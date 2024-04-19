import Tracks, { TrackIdsAndGenres } from './tracks.ts'
import * as spotify from './spotify.ts'
import log from './log.ts'

interface Playlist {
  selected: boolean
  tracks: Set<string>
  name: string
}

// returns an array of ids that match the regex parameter
const getMatchedSpotifyPlaylists = (match: RegExp) =>
  spotify.getAllPlaylists().then(playlists =>
    playlists.filter(item => match.test(item.name)).map(item => item.id)
  )

class Playlists {
  newPlaylists: Map<string, Playlist>

  constructor(useDom = false) {
    this.newPlaylists = new Map()
    if (import.meta.env.DEV) {
      if (useDom) {
        log.info('retrieving playlists from DOM')
        const storedPlaylists = sessionStorage.getItem('playlists')
        if (storedPlaylists) {
          log.info('creating playlist object')
          // const parsedPlaylists = JSON.parse(storedPlaylists) as Array<[string, string[]]>
          // this.newPlaylists = new Map(parsedPlaylists)
        } else {
          log.info('no playlists found in DOM')
        }
      }
    }
  }

  tracks = new Tracks()

  totalTracks = () => this.tracks.savedTracks.length
  numTracksCategorized = 0

  createNewPlaylists = (map: Map<string, TrackIdsAndGenres>) => {
    log.debug(map)
    const allTracks = new Set<string>()
    map.forEach((idag) => {
      const { tracks, genres } = idag
      try {
        // organize by genre
        genres.forEach((g) => {
          tracks.forEach((t) => {
            if (this.newPlaylists.has(g)) {
              const plist = this.newPlaylists.get(g)
              if (!plist) throw new Error('trackSet undefined somehow')
              plist.tracks.add(t)
            } else {
              this.newPlaylists.set(g, { tracks: new Set([t]), selected: true, name: g })
            }
            allTracks.add(t)
          })
        })
      } catch (e) {
        log.error(e)
        log.error('failed on', idag)
      }
    })
    this.numTracksCategorized = allTracks.size
    // maps are iterated by insertion order
    // reorder map by array size descending
    this.newPlaylists = new Map([...this.newPlaylists].sort((a, b) => b[1].tracks.size - a[1].tracks.size))
    log.info(this.newPlaylists)
    return this.newPlaylists
  }

  gen = () => this.tracks.collect()
    .then(this.tracks.mapArtists)
    .then(this.createNewPlaylists)
    .then((newPlaylists) => {
      if (import.meta.env.DEV) {
        // log.info('storing playlists in DOM')
        // sessionStorage.setItem('playlists', JSON.stringify([...this.newPlaylists]))
      }
      return newPlaylists
    })

  saveSpotifyPlaylists = () => {
    const promises: Array<Promise<void>> = []
    const playlistArr = Array.from(this.newPlaylists)
    for (let i = 0; i < playlistsToSave.length; i += 1) {
      if (playlistsToSave[i]) {
        const name = playlistArr[i][0]
        const trackIds = playlistArr[i][1]
        promises.push(
          spotify.createPlaylist(name)
            .then(playlistId => spotify.addTracksToPlaylist(trackIds, playlistId))
            .then(() => { log.info('Created', name) })
        )
      }
    }
    return Promise.all(promises)
  }

  unfollowSpotifyPlaylists = () =>
    getMatchedSpotifyPlaylists(/\[.*?genify.*?\]/)
      .then(async (matched) => {
        await Promise.all(matched.map(spotify.unfollowPlaylist))
        log.info(matched.length, 'playlists cleared')
      })

  // playlistsToSave is a boolean array
  save = async (deleteFirst: boolean) => {
    log.info('saving')
    if (deleteFirst) {
      await this.unfollowSpotifyPlaylists()
    }
    return this.saveSpotifyPlaylists(playlistsToSave)
  }

  getPlaylistNamesAndSizeMap = () => {
    const newMap = new Map<string, number>()
    this.newPlaylists.forEach((value, key) => newMap.set(key, value.length))
    return newMap
  }
}

const playlists = new Playlists()
export function usePlaylists(): Playlists {
  return playlists
}

export default Playlists
