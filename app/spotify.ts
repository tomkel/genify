import type { User, Page, Artist, Track, MaxInt, FollowedArtists, Market, SavedAlbum, SimplifiedAudiobook, SimplifiedPlaylist, SavedEpisode, SavedShow, SavedTrack, UserProfile, Album, Playlist, TrackItem, SnapshotReference } from '@spotify/web-api-ts-sdk'
import fetchQueue from './fetch-queue.ts'
import log from './log.ts'

let token: string = ''
let userId: string = ''

function setAccessToken(accessToken: string) {
  token = accessToken
}

function setUserId(uid: string) {
  userId = uid
}

type ApiQueryString = { limit?: MaxInt<50>, offset?: number, ids?: string[] } | null
type ContentType = object | string
interface FetchGeneric {
  <T extends ContentType>(url: string, qs?: ApiQueryString, postData?: object | null, method?: string): Promise<T>;
}
const fetchGeneric: FetchGeneric = <T extends ContentType>(url: string, qs?: ApiQueryString, postData?: object | null, method?: string): Promise<T> => {
  const headers: HeadersInit = {}
  headers.Authorization = `Bearer ${token}`

  const opts: RequestInit = {}
  if (method) {
    opts.method = method
  }
  if (postData) {
    headers['Content-Type'] = 'application/json'
    opts.method = 'POST'
    opts.body = JSON.stringify(postData)
  }
  opts.headers = new Headers(headers)

  let qsURL = url
  if (qs) {
    const params = new URLSearchParams()
    if (qs.limit) params.append('limit', String(qs.limit))
    if (qs.offset) params.append('offset', String(qs.offset))
    if (qs.ids) params.append('ids', qs.ids.toString())
    qsURL += `?${params.toString()}`
  }

  let tries = 1

  const promiseFetchFunc = (interval: number): Promise<T> =>
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

async function getUserId(): Promise<string> {
  if (!userId) {
    userId = await fetchGeneric<UserProfile>('https://api.spotify.com/v1/me').then(json => json.id)
  }
  return userId
}

type BaseFuncIds = (ids: string[]) => Promise<Record<string, any>>
// baseFunc has an ids paremeter, which is an array of ids
function fetchManyIds(baseFunc: BaseFuncIds, ids: Set<string>, numAtATime: MaxInt<100>, property: string): Promise<any[]> {
  const promises: Promise<object>[] = []
  const idArr = Array.from(ids)
  let items: any[] = []
  for (let i = 0; i < idArr.length; i += numAtATime) {
    promises.push(
      baseFunc(idArr.slice(i, i + numAtATime))
        .then((r) => items = items.concat(r[property]))
    )
  }

  return Promise.all(promises).then(() => {
    log.info(`Got many ${idArr.length}`)
    return items
  })
}

// baseFunc has an offset parameter
type BaseFuncOffset = (offset: number) => Promise<{ items: any[], total: number }>
function fetchManyUnknownSize(baseFunc: BaseFuncOffset): Promise<any[]> {
  return baseFunc(0).then(res => {
    let items: any[] = []
    items = items.concat(res.items)

    const total = res.total
    log.info(`Total: ${total}`)

    const promises = []
    for (let offset = 50; offset < total; offset += 50) {
      promises.push(
        baseFunc(offset).then(res => items = items.concat(res.items))
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
function fetchTracks(offset: number): Promise<Page<SavedTrack>> {
  return fetchGeneric<Page<SavedTrack>>('https://api.spotify.com/v1/me/tracks', { limit: 50, offset })
}

function fetchAllTracks() {
  return fetchManyUnknownSize(fetchTracks)
}


// maximum 100 IDs
// result array is in an artists property
function fetchArtists(ids: string[]): Promise<Artist[]> {
  return fetchGeneric<Artist[]>('https://api.spotify.com/v1/artists', { ids })
}

function fetchAllArtists(ids: Set<string>) {
  return fetchManyIds(fetchArtists, ids, 100, 'artists')
}

// maximum 20 IDs
// result array is in an albums property
function fetchAlbums(ids: string[]): Promise<Album[]> {
  return fetchGeneric<Album[]>('https://api.spotify.com/v1/albums', { ids })
}

function fetchAllAlbums(ids: Set<string>) {
  return fetchManyIds(fetchAlbums, ids, 20, 'albums')
}

// returns id of created playlist
function createPlaylist(name: string): Promise<string> {
  const now = new Date()
  const dateString = `${now.getMonth() + 1}-${now.getDate()}-${String(now.getFullYear()).slice(2)}`
  return getUserId().then(userId =>
    fetchGeneric<Playlist<TrackItem>>(`https://api.spotify.com/v1/users/${userId}/playlists`,
      null, { name: `${name} [genify ${dateString}]` })
  ).then(json => json.id)
}

function addTracksToPlaylist(tracks: string[], playlist: string): Promise<SnapshotReference[]> {
  return getUserId().then(userId => {
    const promises = []
    for (let i = 0; i < tracks.length; i += 100) {
      promises.push(
        fetchGeneric<SnapshotReference>(`https://api.spotify.com/v1/users/${userId}/playlists/${playlist}/tracks`,
          null, { uris: tracks.slice(i, i + 100).map(t => `spotify:track:${t}`) })
      )
    }
    return Promise.all(promises)
  })
}

function getPlaylists(offset: number) {
  return fetchGeneric<Page<SimplifiedPlaylist>>('https://api.spotify.com/v1/me/playlists', { limit: 50, offset })
}

function getAllPlaylists() {
  return fetchManyUnknownSize(getPlaylists)
}

function unfollowPlaylist(playlistId: string) {
  return getUserId().then(userId =>
    fetchGeneric<string>(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/followers`,
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
