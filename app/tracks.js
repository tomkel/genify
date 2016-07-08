const querystring = require('querystring')
const log = require('./log')
const tokens = require('./tokens')

let tracksArr = []
const tracksMap = new Map()

const artistIDs = new Set()
// key: artist ID
// value: { tracks: [track IDs],
//          genres: [genres] }
const artistMap = new Map()

const albumsIDs = new Set()
// key: album ID
// value: { tracks: [track IDs],
//          genres: [genres] }
const albumsMap = new Set()

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
function fetchArtists(artistIDs) {
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${tokens.access}`)

  let url = 'https://api.spotify.com/v1/artists?ids='
  for (const ID of artistIDs) {
    url += `${ID},`
  }
  url = url.slice(0, -1) // remove trailing comma

  return fetch(url, { headers }).then(r => r.json())
}

// maximum 20 IDs
// result array is in an albums property
function fetchAlbums(albumIDs) {
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${tokens.access}`)

  let url = 'https://api.spotify.com/v1/albums?ids='
  for (const ID of albumIDs) {
    url += `${ID},`
  }
  url = url.slice(0, -1) // remove trailing comma

  return fetch(url, { headers }).then(r => r.json())
}


// takes an HTTP response
function store(response) {
  tracksArr = tracksArr.concat(response.items)
}

function getTerms(artists) {
  const termsURL = 'http://developer.echonest.com/api/v4/artist/terms'
  const ECHONEST_API_KEY = process.env.ECHONEST_API_KEY
  const artistsArr = Array.from(artists).splice(0, 5)
  const promises = []

  artistsArr.forEach(a => {
    const qs = querystring.stringify({
      api_key: ECHONEST_API_KEY,
      id: `spotify:artist:${a}`,
    })
    promises.push(fetch(`${termsURL}?${qs}`).then(r => r.json()).then(r => {
      const r2 = r
      // enclose a
      r2.id = (retVal => () => retVal)(a)
      return Promise.resolve(r2)
    }))
  })
  return Promise.all(promises)
}

/**
 * returns a promise with artistMap parameter
 *  tracks
 *  genres
 */
function organize() {
  tracksArr.forEach(c => {
    artistIDs.add(c.track.artists[0].id)
    if (artistMap.has(c.track.artists[0].id)) {
      artistMap.get(c.track.artists[0].id).tracks.push(c.track.id)
    } else {
      artistMap.set(c.track.artists[0].id, { tracks: [c.track.id], genres: [] })
    }
  })
  const promises = []
  promises.push(getTerms(artistIDs).then(rArr => {
    let populated = 0
    rArr.forEach(r => {
      populated++
      log.debug(r.id())
      artistMap.get(r.id()).terms = r.response.terms
    })
    log.debug(populated, '/', artistIDs.size)
    return Promise.resolve(artistMap)
  }))
  return Promise.all(promises)
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
exports.organize = organize
