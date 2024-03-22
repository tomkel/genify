import fetchQueue from './fetch-queue.js'
import log from './log.js'

let token
let userId

function setAccessToken(accessToken) {
  token = accessToken
}

function setUserId(uid) {
  userId = uid
}

function fetchGeneric(url, qs, postData, method) {
  const headers = { Authorization: `Bearer ${token}` }
  const opts = {}
  if (method) {
    opts.method = method
  }
  if (postData) {
    headers['Content-Type'] = 'application/json'
    opts.method = 'POST'
    opts.body = JSON.stringify(postData)
  }
  opts.headers = new Headers(headers)

  const params = new URLSearchParams(qs)
  const qsURL = qs ? `${url}?${params.toString()}` : url

  let tries = 1

  const promiseFetchFunc = interval =>
    new Promise((resolve, reject) =>
      fetchQueue(() => fetch(qsURL, opts).then((r) => {
        if (!r.ok) {
          const errTxt = `Error ${r.status}: ${r.statusText}`
          if (tries < 5) {
            log.error(`Retrying ${tries}`)
            tries += 1
            return promiseFetchFunc(100 * tries)
          }
          return Promise.reject(errTxt)
        }
        const ctHeader = r.headers.get('Content-Type') || ''
        if (ctHeader.includes('json')) {
          return r.json()
        }
        return r.text()
      }).then(resolve).catch(reject), interval)
    )

  return promiseFetchFunc(100)
}

async function getUserId() {
  if (!userId) {
    userId = await fetchGeneric('https://api.spotify.com/v1/me').then(json => json.id)
  }
  return userId
}

// takes an HTTP response
function concatRes(response, storage, property) {
  if (response.error) {
    log.error(response)
  } else {
    return storage.concat(response[property])
  }
}

// baseFunc has an ids paremeter, which is an array of ids
function fetchManyIds(baseFunc, ids, numAtATime, property) {
  const promises = []
  const idArr = Array.from(ids)
  let items = []
  for (let i = 0; i < idArr.length; i += numAtATime) {
    promises.push(
      baseFunc(idArr.slice(i, i + numAtATime)).then(r => items = concatRes(r, items, property))
    )
  }

  return Promise.all(promises).then(() => {
    log.info(`Got many ${idArr.length}`)
    return items
  })
}

// baseFunc has an offset parameter
function fetchManyUnknownSize(baseFunc) {
  return baseFunc(0).then(res => {
    let items = []
    items = concatRes(res, items, 'items')

    const total = res.total
    log.info(`Total: ${total}`)

    const promises = []
    for (let offset = 50; offset < total; offset += 50) {
      promises.push(
        baseFunc(offset).then(r => items = concatRes(r, items, 'items'))
      )
    }

    return Promise.all(promises).then(() => {
      log.info(`Got all ${total}`)
      return items
    })
  })
}

// returns a Promise
// result array is in an items property
function fetchTracks(offset) {
  return fetchGeneric('https://api.spotify.com/v1/me/tracks', { limit: 50, offset })
}

function fetchAllTracks() {
  return fetchManyUnknownSize(fetchTracks)
}


// maximum 100 IDs
// result array is in an artists property
function fetchArtists(ids) {
  return fetchGeneric('https://api.spotify.com/v1/artists', { ids: ids.join() })
}

function fetchAllArtists(ids) {
  return fetchManyIds(fetchArtists, ids, 100, 'artists')
}

// maximum 20 IDs
// result array is in an albums property
function fetchAlbums(ids) {
  return fetchGeneric('https://api.spotify.com/v1/albums', { ids: ids.join() })
}

function fetchAllAlbums(ids) {
  return fetchManyIds(fetchAlbums, ids, 20, 'albums')
}

// returns id of created playlist
function createPlaylist(name) {
  const now = new Date()
  const dateString = `${now.getMonth() + 1}-${now.getDate()}-${String(now.getFullYear()).slice(2)}`
  return getUserId().then(userId =>
    fetchGeneric(`https://api.spotify.com/v1/users/${userId}/playlists`,
      null, { name: `${name} [genify ${dateString}]` })
  ).then(json => json.id)
}

function addTracksToPlaylist(tracks, playlist) {
  return getUserId().then(userId => {
    const promises = []
    for (let i = 0; i < tracks.length; i += 100) {
      promises.push(
        fetchGeneric(`https://api.spotify.com/v1/users/${userId}/playlists/${playlist}/tracks`,
          null, { uris: tracks.slice(i, i + 100).map(t => `spotify:track:${t}`) })
      )
    }
    return Promise.all(promises)
  })
}

function getPlaylists(offset) {
  return fetchGeneric('https://api.spotify.com/v1/me/playlists', { limit: 50, offset })
}

function getAllPlaylists() {
  return fetchManyUnknownSize(getPlaylists)
}

function unfollowPlaylist(id) {
  return getUserId().then(userId =>
    fetchGeneric(`https://api.spotify.com/v1/users/${userId}/playlists/${id}/followers`,
      null, null, 'DELETE')
  )
}

export { setAccessToken as setToken,
         fetchAllTracks as getAllTracks,
         fetchAllArtists as getAllArtists,
         fetchAllAlbums as getAllAlbums,
         createPlaylist,
         addTracksToPlaylist,
         getAllPlaylists,
         unfollowPlaylist,
         getUserId }
