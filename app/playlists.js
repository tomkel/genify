import Tracks from './tracks'
import log from './log'

const querystring = require('querystring')

class Playlists {

  newPlaylists = new Map()

  constructor(token) {
    this.token = token
    this.tracks = new Tracks(token)
  }

  createNewPlaylists = (map) => {
    log.debug(map)
    map.forEach(v => {
      try {
        // organize by genre
        v.genres.forEach(g => {
          v.tracks.forEach(t => {
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

  fetchAndStoreUserId() {
    const profileURL = 'https://api.spotify.com/v1/me'
    const headers = new Headers()
    headers.set('Authorization', `Bearer ${this.token}`)
    return fetch(profileURL, { headers }).then(r => r.json())
      .then(json => {
        this.userId = json.id
        return json.id
      })
  }

  createSpotifyPlaylist(playlistName) {
    const playlistURL = `https://api.spotify.com/v1/users/${this.userId}/playlists`
    const headers = new Headers()
    headers.set('Authorization', `Bearer ${this.token}`)
    headers.set('Content-Type', 'application/json')
    const now = new Date()
    const dateString = `${now.getMonth() + 1}-${now.getDate()}-${String(now.getFullYear()).slice(2)}`
    return fetch(playlistURL,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: `${playlistName} [genify ${dateString}]` }),
      })
      .then(r => r.json())
      .then(json => json.id)
  }

  addTracksToSpotifyPlaylist(tracks, playlist) {
    const playlistURL = `https://api.spotify.com/v1/users/${this.userId}/playlists/${playlist}/tracks`
    const headers = new Headers()
    headers.set('Authorization', `Bearer ${this.token}`)
    headers.set('Content-Type', 'application/json')

    const promises = []
    for (let i = 0; i < tracks.length; i += 100) {
      promises.push(
        fetch(playlistURL,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({ uris: tracks.slice(i, i + 100).map(t => `spotify:track:${t}`) }),
          }
        ).then(r => r.json())
      )
    }
    return Promise.all(promises)
  }

  createSpotifyPlaylists = () => {
    let i = 0
    for (const [name, trackIds] of this.newPlaylists) {
      if (trackIds.length < 5) break
      setTimeout(() => {
      this.createSpotifyPlaylist(name)
        .then(playlistId => setTimeout(() =>this.addTracksToSpotifyPlaylist(trackIds, playlistId),i*1000+510))
        .then(() => log.info('Created', name))
      }, i*1000 + 10)
      i += 1
    }
  }

  getSpotifyPlaylists(offset) {
    const playlistURL = `https://api.spotify.com/v1/users/${this.userId}/playlists`
    const headers = new Headers()
    headers.set('Authorization', `Bearer ${this.token}`)
    const qs = querystring.stringify({ limit: 50, offset })
    return fetch(`${playlistURL}?${qs}`, { headers }).then(r => r.json())
  }

  // returns an array of ids that match the regex parameter
  getMatchedSpotifyPlaylists(match) {
    let result = []
    const extractPlaylists = (res) => {
      result = result.concat(
        res.items.filter(item => match.test(item.name)).map(item => item.id)
      )
    }
    return this.getSpotifyPlaylists(0).then(json => {
      extractPlaylists(json)

      const promises = []
      for (let offset = 50; offset < json.total; offset += 50) {
        promises.push(
          this.getSpotifyPlaylists(offset).then(extractPlaylists)
        )
      }

      return Promise.all(promises).then(() => result)
    })
  }

  unfollowSpotifyPlaylist = (id) => {
    const unfollowURL = `https://api.spotify.com/v1/users/${this.userId}/playlists/${id}/followers`
    const headers = new Headers()
    headers.set('Authorization', `Bearer ${this.token}`)
    return fetch(unfollowURL, { method: 'DELETE', headers }).then(r => r.text())
  }

  unfollowSpotifyPlaylists = () => {
    this.getMatchedSpotifyPlaylists(/\[.*?genify.*?\]/)
      .then(matched => {matched.forEach((match, i) => setTimeout(() => this.unfollowSpotifyPlaylist(match),i*1000+10))
      log.info(matched.length, 'playlists cleared')
      })
  }

  save = () => {
    log.info('saving')
    this.fetchAndStoreUserId()
      .then(this.unfollowSpotifyPlaylists)
      .then(this.createSpotifyPlaylists)
  }
}

export default Playlists
