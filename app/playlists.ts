import Tracks, { TrackIdsAndGenres } from './tracks'
import * as spotify from './spotify'
import log from './log'

class Playlists {
  newPlaylists: Map<string, string[]>

  constructor(useDom = false) {
    this.newPlaylists = new Map()
    if (process.env.NODE_ENV === 'development') {
      if (useDom) {
        log.info('retrieving playlists from DOM')
        const storedPlaylists = sessionStorage.getItem('playlists')
        if (storedPlaylists) {
          log.info('creating playlist object')
          const parsedPlaylists = JSON.parse(storedPlaylists) as Array<[string, string[]]>
          this.newPlaylists = new Map(parsedPlaylists)
        } else {
          log.info('no playlists found in DOM')
        }
      }
    }
  }

  tracks = new Tracks()

  totalTracks = () => this.tracks.tracksArr.length
  numTracksCategorized = 0

  createNewPlaylists = (map: Map<string, TrackIdsAndGenres>) => {
    log.debug(map)
    const sortedTracks = new Set<string>()
    map.forEach((v) => {
      try {
        // organize by genre
        v.genres.forEach((g) => {
          v.tracks.forEach((t) => {
            if (this.newPlaylists.has(g)) {
              const trackArr = this.newPlaylists.get(g)
              if (!trackArr) throw new Error('trackArr undefined somehow')
              trackArr.push(t)
            } else {
              this.newPlaylists.set(g, [t])
            }
            sortedTracks.add(t)
          })
        })
      } catch (e) {
        log.error(e)
        log.error('failed on', v)
      }
    })
    this.numTracksCategorized = sortedTracks.size
    // maps are iterated by insertion order
    // reorder map by array size descending
    this.newPlaylists = new Map([...this.newPlaylists.entries()].sort((a, b) => b[1].length - a[1].length))
    log.info(this.newPlaylists)
    return this.newPlaylists
  }

  gen = () => this.tracks.collect()
    .then(this.tracks.mapArtists)
    .then(this.createNewPlaylists)
    .then((newPlaylists) => {
      if (process.env.NODE_ENV === 'development') {
        log.info('storing playlists in DOM')
        sessionStorage.setItem('playlists', JSON.stringify([...this.newPlaylists]))
      }
      return newPlaylists
    })

  saveSpotifyPlaylists = (playlistsToSave: boolean[]) => {
    const promises = []
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

  // returns an array of ids that match the regex parameter
  getMatchedSpotifyPlaylists = (match: RegExp) =>
    spotify.getAllPlaylists().then(playlists =>
      playlists.filter(item => match.test(item.name)).map(item => item.id)
    )

  unfollowSpotifyPlaylists = () =>
    this.getMatchedSpotifyPlaylists(/\[.*?genify.*?\]/)
      .then(async (matched) => {
        await Promise.all(matched.map(spotify.unfollowPlaylist))
        log.info(matched.length, 'playlists cleared')
      })

  // playlistsToSave is a boolean array
  save = (playlistsToSave: boolean[], deleteFirst: boolean) => {
    log.info('saving')
    if (deleteFirst) {
      return this.unfollowSpotifyPlaylists()
        .then(() => this.saveSpotifyPlaylists(playlistsToSave))
    }
    return this.saveSpotifyPlaylists(playlistsToSave)
  }

  getPlaylistNamesAndSizeMap = () => {
    const newMap = new Map<string, number>()
    this.newPlaylists.forEach((value, key) => newMap.set(key, value.length))
    return newMap
  }
}

const playlists = new Playlists(false)
export function usePlaylists(): Playlists {
  return playlists
}

export default Playlists
