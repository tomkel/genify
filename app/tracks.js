const querystring = require('querystring')
const log = require('./log')
const tokens = require('./tokens')

let tracksArr = []
const artistIDs = new Set()
// key: artist ID
// value: { tracks: [track IDs],
//          genres: [genres] }
const artistMap = new Map()

// returns a Promise
function fetchTracks(offset) {
  const tracksURL = 'https://api.spotify.com/v1/me/tracks'
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${tokens.access}`)
  const qs = querystring.stringify({ limit: 50, offset })
  return fetch(`${tracksURL}?${qs}`, { headers }).then(r => r.json())
}

// takes an HTTP response, returns total number of tracks
function store(response) {
  tracksArr = tracksArr.concat(response.items)
  return response.total
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
  return fetchTracks(0).then(r => {
    const totalTracks = store(r)
    log.info(`Total Tracks: ${totalTracks}`)

    const promises = []
    for (let offset = 50; offset < totalTracks; offset += 50) {
      promises.push(fetchTracks(offset)
        .then(store)
      )
    }

    return Promise.all(promises).then(() =>
      new Promise((resolve) => {
        log.info('Got all tracks')
        resolve()
      })
    )
  })
}

exports.collect = collect
exports.organize = organize
