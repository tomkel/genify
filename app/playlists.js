import Tracks from './tracks'
import log from './log'

class Playlists {

  playlists = new Map()

  constructor(token) {
    this.token = token
    this.tracks = new Tracks(token)
  }

  createPlaylists = (map) => {
    log.debug(map)
    map.forEach(v => {
      try {
        // organize by genre
        v.genres.forEach(g => {
          v.tracks.forEach(t => {
            if (this.playlists.has(g)) {
              this.playlists.get(g).push(t)
            } else {
              this.playlists.set(g, [t])
            }
          })
        })
      } catch (e) {
        log.error(e)
        log.error('failed on', v)
      }
    })
    log.info(this.playlists)
    return this.playlists
  }

  gen = () => this.tracks.collect()
      .then(this.tracks.mapArtists)
      .then(this.createPlaylists)

  save() {

  }
}

export default Playlists
