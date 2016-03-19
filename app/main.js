'use strict'

require('babel-polyfill')
const crypto = require('crypto')
const querystring = require('querystring')
require('isomorphic-fetch')


// remove leading # from urlHash
let urlHash = window.location.hash
if (urlHash.charAt(0) === '#') urlHash = urlHash.substr(1)
urlHash = querystring.parse(urlHash)

if ('state' in urlHash) {
  // check if state matches dom storage

  /**
   * success params:
   *  access_token
   *  token_type
   *  expires_in
   *  state
   */
  for (let param in urlHash) {
    window.localStorage.setItem(param, urlHash[param])
  }
  /**
   * fail params:
   *  error
   *  state
   */
} else {

}


const accessToken = window.localStorage.getItem('access_token')
if (accessToken) {
  console.log(' we have an access token ')
  console.log('getting user\'s saved tracks')
  collectTracks().then(organizeTracks).then(createPlaylists)
}

// returns a Promise
function getTracks(offset) {
  const getTracksURL = 'https://api.spotify.com/v1/me/tracks'
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${accessToken}`)
  const qs = querystring.stringify({ limit: 50, offset })
  return fetch(`${getTracksURL}?${qs}`, { headers }).then(r => r.json())
}

let tracksArr = []
// takes an HTTP response, returns total number of tracks
function storeTracks(response) {
  tracksArr =  tracksArr.concat(response.items)
  return response.total
}

function collectTracks() {
  return getTracks(0).then(r => {
    let totalTracks = storeTracks(r)
    let offset = 50
    const promises = []
    for (let offset = 50; offset < totalTracks; offset += 50) {
      promises.push(getTracks(offset))
    }
    return Promise.all(promises).then(responses => {
      responses.forEach(curr => {
        storeTracks(curr)
      })
      return Promise.resolve()
    })
  }).catch(e => {
    // TODO: handle error gracefully
    throw e
  })
}

/**
 * returns a promise with artistMap parameter
 *  tracks
 *  genres
 */
function organizeTracks() {
  const artistIDs = new Set()
  const artistMap = new Map()
  tracksArr.forEach(c => {
    artistIDs.add(c.track.artists[0].id)
    if (artistMap.has(c.track.artists[0].id)) {
      artistMap.get(c.track.artists[0].id).tracks.push(c.track.id)
    } else {
      artistMap.set(c.track.artists[0].id, { tracks: [c.track.id], genres: [] })
    }
  })
  return getGenres(artistIDs).then(responses => {
    let populated = 0
    responses.forEach(r => {
      r.artists.forEach(c => {
        // NOTE: c.genres is empty on all entries!!!
        if (c.genres.length) populated++
        artistMap.get(c.id).genres = c.genres
      })
    })
    console.log(populated, '/', artistIDs.size)
    return Promise.resolve(artistMap)
  })
}

function getGenres(artists) {
  const artistsURL = 'https://api.spotify.com/v1/artists'
  const artistsArr = Array.from(artists)
  const promises = []
  for (let i = 0; i < artistsArr.length; i += 50) {
    const headers = new Headers()
    headers.set('Authorization', `Bearer ${accessToken}`)
    const qs = querystring.stringify({ ids: artistsArr.slice(i, i + 50).join() })
    promises.push(fetch(`${artistsURL}?${qs}`, { headers }).then(r => r.json()))
  }
  return Promise.all(promises)
}

let playlists = new Map()
function createPlaylists(map) {
  console.log(map)
  map.forEach(v => {
    try {
      v.genres.forEach(g => {
        v.tracks.forEach(t => {
          if (playlists.has(g)) {
            playlists.get(g).push(t)
          } else {
            playlists.set(g, [t])
          }
        })
      })
    } catch (e) {
      console.log('failed on', v)
    }
  })
  console.log(playlists)
}


const authURL = 'https://accounts.spotify.com/authorize'
const stateString = crypto.randomBytes(64).toString('hex')
const authParams = {
  client_id: process.env.CLIENT_ID,
  response_type: 'token',
  redirect_uri: 'http://localhost:8080',
  state: stateString,
  scope: 'playlist-modify-public user-library-read',
  // show_dialog
}

const authButton = document.getElementById('auth')
authButton.addEventListener('click', () => {
  window.location.assign(`${authURL}?${querystring.stringify(authParams)}`)
})

//got(authURL, {query: authParams}).then(response => {
//  console.log(response.body)
//}).catch(e => {
//  console.error(e)
//})
