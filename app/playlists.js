import Tracks from './tracks'
import * as spotify from './spotify'
import log from './log'

class Playlists {

  constructor(useDom = false) {
    if (useDom) {
      log.info('retrieving playlists from DOM')
      const storedPlaylists = sessionStorage.getItem('playlists')
      if (storedPlaylists) {
        log.info('creating playlist object')
        this.newPlaylists = new Map(JSON.parse(storedPlaylists))
      } else {
        log.info('no playlists found in DOM')
      }
    }
    if (!this.newPlaylists) {
      this.newPlaylists = new Map()
    }
  }

  tracks = new Tracks()

  createNewPlaylists = (map) => {
    log.debug(map)
    map.forEach((v) => {
      try {
        // organize by genre
        v.genres.forEach((g) => {
          v.tracks.forEach((t) => {
            if (this.newPlaylists.has(g)) {
              this.newPlaylists.get(g).push(t)
            } else {
              this.newPlaylists.set(g, [t])
            }
          })
        })
      } catch (e) {
        log.error(e)
        log.error('failed on', v)
      }
    })
    // maps are iterated by insertion order
    // reorder map by array size descending
    this.newPlaylists = new Map([...this.newPlaylists.entries()].sort((a, b) =>
      b[1].length - a[1].length
    ))
    log.info(this.newPlaylists)
    return this.newPlaylists
  }

  gen = () => this.tracks.collect()
      .then(this.tracks.mapArtists)
      .then(this.createNewPlaylists)
      .then(() => {
        log.info('storing playlists in DOM')
        sessionStorage.setItem('playlists', JSON.stringify([...this.newPlaylists]))
      })

  saveSpotifyPlaylists = () => {
    const promises = []
    for (const [name, trackIds] of this.newPlaylists) {
      if (trackIds.length < 2) break
      promises.push(
        spotify.createPlaylist(name)
          .then(playlistId => spotify.addTracksToPlaylist(trackIds, playlistId))
          .then(() => log.info('Created', name))
      )
    }
    return Promise.all(promises)
  }

 // returns an array of ids that match the regex parameter
  getMatchedSpotifyPlaylists = match =>
    spotify.getAllPlaylists().then(playlists =>
      playlists.filter(item => match.test(item.name)).map(item => item.id)
    )

  unfollowSpotifyPlaylists = () =>
    this.getMatchedSpotifyPlaylists(/\[.*?genify.*?\]/)
      .then((matched) => {
        matched.forEach(spotify.unfollowPlaylist)
        log.info(matched.length, 'playlists cleared')
      })

  save = () => {
    log.info('saving')
    return this.unfollowSpotifyPlaylists()
      .then(this.saveSpotifyPlaylists)
  }

  getPlaylistNamesAndSizeMap = () => {
    const newMap = new Map(this.newPlaylists)
    newMap.forEach((value, key, map) => map.set(key, value.length))
    return newMap
  }
}

export default Playlists
