'use strict'
const http = require('http')
const url = require('url')
const crypto = require('crypto')
const querystring = require('querystring')
require('isomorphic-fetch')
const winston = require('winston')

const log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      timestamp: true,
    }),
  ],
})

let accessToken
;(() => {
  if (accessToken) {
    log.info(' we have an access token ')
    log.info('getting user\'s saved tracks')
    collectTracks().then(organizeTracks).then(createPlaylists)
  }
})()

function getAuthURL() {
  const authURL = 'https://accounts.spotify.com/authorize'
  // const stateString = crypto.randomBytes(64).toString('hex')
  const authParams = {
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: 'http://localhost:8080',
    // state: stateString,
    scope: 'playlist-modify-public user-library-read',
  }
  return `${authURL}?${querystring.stringify(authParams)}`
}

function getRefreshAndAccessTokens(authCode) {
  const url = 'https://accounts.spotify.com/api/token'
  const params = {
    grant_type: 'authorization_code',
    code: authCode,
    redirect_uri: 'http://localhost:8080'
  }
  const headers = new Headers({ 
    Authorization: new Buffer(`Basic ${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
  })

  fetch(`${url}?${querystring.stringify(params)}`, { method: 'POST', headers }).then(r => {
    return r.text()
  }).then(text => {
    log.info(text)
  })

}

function authFlow(req, res) {
  const urlObj = url.parse(req.url, true)
  log.info(urlObj)
  if (urlObj.query.error) {
    res.end()
    log.error(urlObj.query.error)
    return
  }
  if (urlObj.query.code) {
    res.end()

    getRefreshAndAccessTokens(urlObj.query.code)
  } else {
    const html = `<!DOCTYPE html>
      <button onclick="document.location.assign('${getAuthURL()}')">
        Click to Authorize
      </button>`
    res.end(html)
  }
}

function server() {
  http.createServer(authFlow).listen(8080)
}
server()

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
  tracksArr = tracksArr.concat(response.items)
  return response.total
}

function collectTracks() {
  return getTracks(0).then(r => {
    const totalTracks = storeTracks(r)
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
  const promises = []
  promises.push(getGenres(artistIDs).then(responses => {
    let populated = 0
    responses.forEach(r => {
      r.artists.forEach(c => {
        // NOTE: c.genres is empty on all entries!!!
        if (c.genres.length) populated++
        artistMap.get(c.id).genres = c.genres
      })
    })
    log.debug(populated, '/', artistIDs.size)
    return Promise.resolve(artistMap)
  }))
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

function getGenres(artists) {
  const artistsURL = 'https://api.spotify.com/v1/artists'
  const artistsArr = Array.from(artists)
  const promises = []

  const headers = new Headers()
  headers.set('Authorization', `Bearer ${accessToken}`)

  for (let i = 0; i < artistsArr.length; i += 50) {
    const qs = querystring.stringify({ ids: artistsArr.slice(i, i + 50).join() })
    promises.push(fetch(`${artistsURL}?${qs}`, { headers }).then(r => r.json()))
  }
  return Promise.all(promises)
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

const playlists = new Map()
function createPlaylists(map) {
  log.debug(map)
  map[0].forEach(v => {
    try {
      // organize by genre
      v.genres.forEach(g => {
        v.tracks.forEach(t => {
          if (playlists.has(g)) {
            playlists.get(g).push(t)
          } else {
            playlists.set(g, [t])
          }
        })
      })
      // organize by terms
      if (v.terms && v.terms.length) {
        const term = v.terms[0].name
        v.tracks.forEach(t => {
          if (playlists.has(term)) {
            playlists.get(term).push(t)
          } else {
            playlists.set(term, [t])
          }
        })
        log.debug(term)
      }
    } catch (e) {
      log.error(e)
      log.error('failed on', v)
    }
  })
  log.info(playlists)
}
