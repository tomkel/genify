import type { Album, Albums, Artist, Artists, MaxInt, Page, Playlist, SavedTrack, SimplifiedPlaylist, SnapshotReference, UserProfile } from '@spotify/web-api-ts-sdk'
import fetchQueue from './fetch-queue.ts'
import log from './log.ts'

let token = ''
let _userId = ''

async function getUserId(): Promise<string> {
  if (!_userId) {
    _userId = await fetchGeneric<UserProfile>('https://api.spotify.com/v1/me').then(json => json.id)
  }
  return _userId
}

function setToken(accessToken: string) {
  token = accessToken
}

type ApiQueryString = { limit?: MaxInt<50>, offset?: number, ids?: string[] } | null
type ContentType = UserProfile | Page<SavedTrack> | Artists | Albums | Playlist | SnapshotReference | Page<SimplifiedPlaylist> | string
type FetchGeneric = <T extends ContentType>(url: string, qs?: ApiQueryString, postData?: object | null, method?: string) => Promise<T>
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
          return Promise.reject(new Error(errTxt))
        }
        const ctHeader = r.headers.get('Content-Type') ?? ''
        if (ctHeader.includes('json')) {
          return r.json()
        }
        return r.text()
      // eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
      }).then(resolve).catch(reject), interval)
    )

  return promiseFetchFunc(100)
}

type ArtistsAndAlbums = Partial<Artists & Albums>
type ArtistOrAlbum = Artist | Album
type BaseFuncIds = (ids: string[]) => Promise<ArtistsAndAlbums>
// baseFunc has an ids paremeter, which is an array of ids
async function fetchManyIds<T extends ArtistOrAlbum>(baseFunc: BaseFuncIds, ids: string[], numAtATime: MaxInt<50>, property: 'albums' | 'artists'): Promise<T[]> {
  let items: T[] = []
  const promises: Array<Promise<void>> = []
  for (let i = 0; i < ids.length; i += numAtATime) {
    promises.push(
      baseFunc(ids.slice(i, i + numAtATime))
        .then((r) => { items = items.concat(r[property] as T[]) })
    )
  }

  await Promise.all(promises)
  log.info(`Got many ${ids.length}`)
  return items
}

// baseFunc has an offset parameter
type Paged = SavedTrack | SimplifiedPlaylist
async function fetchManyUnknownSize<T extends Paged>(baseFunc: (offset: number) => Promise<Page<T>>): Promise<T[]> {
  const initialResp = await baseFunc(0)
  let items: T[] = [...initialResp.items]

  const total = initialResp.total
  log.info(`Total: ${total}`)

  const promises: Array<Promise<void>> = []
  for (let offset = 50; offset < total; offset += 50) {
    promises.push(
      baseFunc(offset).then((r) => { items = items.concat(r.items) })
    )
  }

  await Promise.all(promises)
  log.info(`Got all ${total}`)
  return items
}

// returns a Promise
// result array is in an items property
function fetchTracks(offset: number): Promise<Page<SavedTrack>> {
  return fetchGeneric<Page<SavedTrack>>('https://api.spotify.com/v1/me/tracks', { limit: 50, offset })
}

function getAllSavedTracks(): Promise<SavedTrack[]> {
  return fetchManyUnknownSize<SavedTrack>(fetchTracks)
}

// maximum 50 IDs
// result array is in an artists property
function fetchArtists(ids: string[]): Promise<Artists> {
  return fetchGeneric<Artists>('https://api.spotify.com/v1/artists', { ids })
}

function getAllArtists(ids: string[]): Promise<Artist[]> {
  return fetchManyIds<Artist>(fetchArtists, ids, 50, 'artists')
}

// maximum 20 IDs
// result array is in an albums property
function fetchAlbums(ids: string[]): Promise<Albums> {
  return fetchGeneric<Albums>('https://api.spotify.com/v1/albums', { ids })
}

function getAllAlbums(ids: string[]): Promise<Album[]> {
  return fetchManyIds<Album>(fetchAlbums, ids, 20, 'albums')
}

// returns id of created playlist
async function createPlaylist(name: string): Promise<string> {
  const now = new Date()
  const dateString = `${now.getMonth() + 1}-${now.getDate()}-${String(now.getFullYear()).slice(2)}`
  const userId = await getUserId()
  const json = await fetchGeneric<Playlist>(`https://api.spotify.com/v1/users/${userId}/playlists`,
    null, { name: `${name} [genify ${dateString}]` })
  return json.id
}

function addTracksToPlaylist(tracks: Set<string>, playlist: string): Promise<SnapshotReference[]> {
  return getUserId().then((userId) => {
    const promises: Array<Promise<SnapshotReference>> = []
    const tracksArr = Array.from(tracks)
    for (let i = 0; i < tracks.size; i += 100) {
      promises.push(
        fetchGeneric<SnapshotReference>(`https://api.spotify.com/v1/users/${userId}/playlists/${playlist}/tracks`,
          null, { uris: tracksArr.slice(i, i + 100).map(t => `spotify:track:${t}`) })
      )
    }
    return Promise.all(promises)
  })
}

function getPlaylists(offset: number) {
  return fetchGeneric<Page<SimplifiedPlaylist>>('https://api.spotify.com/v1/me/playlists', { limit: 50, offset })
}

function getAllPlaylists(): Promise<SimplifiedPlaylist[]> {
  return fetchManyUnknownSize<SimplifiedPlaylist>(getPlaylists)
}

async function unfollowPlaylist(playlistId: string) {
  const userId = await getUserId()
  return fetchGeneric<string>(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/followers`, null, null, 'DELETE')
}

export {
  addTracksToPlaylist,
  createPlaylist,
  getAllAlbums,
  getAllArtists,
  getAllPlaylists,
  getAllSavedTracks,
  getUserId,
  setToken,
  unfollowPlaylist,
}
