const querystring = require('querystring')

const log = require('./log')
const tokens = require('./tokens')

let tracksArr = []

const artistIDs = new Set()
// key: artist ID
// value: { tracks: [track IDs],
//          genres: [genres] }
const artistMap = new Map()

const albumIDs = new Set()
// key: album ID
// value: { tracks: [track IDs],
//          genres: [genres] }
const albumMap = new Map()

// returns a Promise
// result array is in an items property
function fetchTracks(offset) {
  const tracksURL = 'https://api.spotify.com/v1/me/tracks'
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${tokens.access}`)
  const qs = querystring.stringify({ limit: 50, offset })
  return fetch(`${tracksURL}?${qs}`, { headers }).then(r => r.json())
}

// maximum 50 IDs
// result array is in an artists property
function fetchArtists(IDs) {
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${tokens.access}`)

  let url = 'https://api.spotify.com/v1/artists?ids='
  for (const ID of IDs) {
    url += `${ID},`
  }
  url = url.slice(0, -1) // remove trailing comma

  return fetch(url, { headers }).then(r => r.json())
}

// maximum 20 IDs
// result array is in an albums property
function fetchAlbums(IDs) {
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${tokens.access}`)

  let url = 'https://api.spotify.com/v1/albums?ids='
  for (const ID of IDs) {
    url += `${ID},`
  }
  url = url.slice(0, -1) // remove trailing comma

  return fetch(url, { headers }).then(r => r.json())
}


// takes an HTTP response
function store(response) {
  tracksArr = tracksArr.concat(response.items)
}

/**
 * returns a promise with artistMap parameter
 *  tracks
 *  genres
 */
function mapArtists() {
  let populated = 0

  function mapArtistGenres(res) {
    res.artists.forEach(artistObj => {
      if (artistObj.genres.length) {
        artistMap.get(artistObj.id).genres =
            artistMap.get(artistObj.id).genres.concat(artistObj.genres)
        populated++
      }
    })
  }

  tracksArr.forEach(c => {
    artistIDs.add(c.track.artists[0].id)
    if (artistMap.has(c.track.artists[0].id)) {
      artistMap.get(c.track.artists[0].id).tracks.push(c.track.id)
    } else {
      artistMap.set(c.track.artists[0].id, { tracks: [c.track.id], genres: [] })
    }
  })

  const promises = []
  const artistIdArray = Array.from(artistIDs)
  for (let i = 0; i < artistIdArray.length; i += 50) {
    promises.push(
        fetchArtists(artistIdArray.slice(i, i + 50)).then(mapArtistGenres)
    )
  }

  return Promise.all(promises).then(() => {
    log.info(populated, '/', artistIDs.size, 'artists have their genres populated')
    return artistMap
  })
}

function mapAlbums() {
  let populated = 0

  function mapAlbumGenres(res) {
    res.albums.forEach(albumObj => {
      if (albumObj.genres.length) {
        albumMap.get(albumObj.id).genres =
            albumMap.get(albumObj.id).genres.concat(albumObj.genres)
        populated++
      }
    })
  }

  tracksArr.forEach(c => {
    albumIDs.add(c.track.album.id)
    if (albumMap.has(c.track.album.id)) {
      albumMap.get(c.track.album.id).tracks.push(c.track.id)
    } else {
      albumMap.set(c.track.album.id, { tracks: [c.track.id], genres: [] })
    }
  })

  const promises = []
  const albumIdArray = Array.from(albumIDs)
  for (let i = 0; i < albumIdArray.length; i += 20) {
    promises.push(
        fetchAlbums(albumIdArray.slice(i, i + 20)).then(mapAlbumGenres)
    )
  }

  return Promise.all(promises).then(() => {
    log.info(populated, '/', albumIDs.size, 'albums have their genres populated')
    return albumMap
  })
}

function collect() {
  return fetchTracks(0).then(res => {
    store(res)
    const totalTracks = res.total
    log.info(`Total Tracks: ${totalTracks}`)

    const promises = []
    for (let offset = 50; offset < totalTracks; offset += 50) {
      promises.push(
        fetchTracks(offset).then(store)
      )
    }

    return Promise.all(promises).then(() =>
      log.info('Got all tracks')
    )
  })
}

exports.collect = collect
exports.map = mapArtists
exports.mapArtists = mapArtists
exports.mapAlbums = mapAlbums
