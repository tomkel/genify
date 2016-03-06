'use strict';

require("babel-polyfill");
const crypto = require('crypto'),
      querystring = require('querystring'),
      got = require('got');


// remove leading # from urlHash
let urlHash = window.location.hash;
if (urlHash.charAt(0) === '#') urlHash = urlHash.substr(1);
urlHash = querystring.parse(urlHash);

if ('state' in urlHash) {
  //check if state matches dom storage

  /**
   * success params:
   *  access_token
   *  token_type
   *  expires_in
   *  state
   */
  for (let param in urlHash) {
    window.localStorage.setItem(param, urlHash[param]);
  }
  /**
   * fail params:
   *  error
   *  state
   */
} else {

}


const accessToken = window.localStorage.getItem('access_token');
if (accessToken) {
  console.log(' we have an access token ');
  console.log('getting user\'s saved tracks');
  collectTracks().then(organizeTracks).then(createPlaylists);
}

// returns a Promise
function getTracks(offset) {
  const getTracksURL = 'https://api.spotify.com/v1/me/tracks';
  return got(getTracksURL,
            {headers: {'Authorization': 'Bearer ' + accessToken},
             query: {limit: 50, offset: offset}});
}

let tracksArr = [];
// takes an HTTP response, returns total number of tracks
function storeTracks(response) {
  response = JSON.parse(response.body);
  tracksArr =  tracksArr.concat(response.items);
  return response.total;
}

function collectTracks() {
  return getTracks(0).then(r => {
    let totalTracks = storeTracks(r);
    let offset = 50;
    const promises = [];
    for (let offset = 50; offset < totalTracks; offset += 50) {
      promises.push(getTracks(offset));
    }
    return Promise.all(promises).then(responses => {
      responses.forEach(curr => {
        storeTracks(curr);
      });
      return Promise.resolve();
    });
  }).catch(e => {
    //TODO: handle error gracefully
    throw e;
  });
}

/**
 * returns a promise with albumMap parameter
 *  tracks
 *  genres
 */
function organizeTracks() {
  console.log(tracksArr);
  const albumIDs = new Set();
  const albumMap = new Map();
  tracksArr.forEach(c => {
    albumIDs.add(c.track.album.id);
    if (albumMap.has(c.track.album.id)) {
      albumMap.get(c.track.album.id).tracks.push(c.track.id);
    } else {
      albumMap.set(c.track.album.id, {tracks: [c.track.id]});
    }
  });
  return getGenres(albumIDs).then(responses => {
    responses.forEach(r => {
      r = JSON.parse(r.body);
      r.albums.forEach(c => {
        //NOTE: c.genres is empty on all entries!!!
        console.log(c);
        albumMap.get(c.id).genres = c.genres;
      });
    });
    console.log(albumMap);
    return Promise.resolve(albumMap);
  });
}

function getGenres(albums) {
  const albumsURL = 'https://api.spotify.com/v1/albums';
  const albumsArr = Array.from(albums);
  console.log(albumsArr.length, 'albums');
  const promises = [];
  for (let i = 0; i < albumsArr.length; i += 20) {
    promises.push(got(albumsURL,
                      {headers: {'Authorization': 'Bearer ' + accessToken},
                       query: {ids: albumsArr.slice(i, i+20).join()}}));
  }
  return Promise.all(promises);
}

let playlists = new Map();
function createPlaylists(map) {
  console.log(map);
  map.forEach(v => {
    console.log(v);
    try {
      v.genres.forEach(g => {
        v.tracks.forEach(t => {
          if (playlists.has(g)) {
            playlists.get(g).push(t);
          } else {
            playlists.set(g, [t]);
          }
        });
      });
    } catch (e) {
      console.log('failed on', v);
    }
  });
  console.log(playlists);
}


const authURL = 'https://accounts.spotify.com/authorize';
const stateString = crypto.randomBytes(64).toString('hex');
const authParams = {
  client_id: process.env.CLIENT_ID,
  response_type: 'token',
  redirect_uri: 'http://localhost:8080',
  state: stateString,
  scope: 'playlist-modify-public user-library-read'
  //show_dialog
};

const authButton = document.getElementById('auth');
authButton.addEventListener('click', ev => {
  window.location.assign(authURL + '?' + querystring.stringify(authParams));
});

//got(authURL, {query: authParams}).then(response => {
//  console.log(response.body);
//}).catch(e => {
//  console.error(e);
//});
