import log from './log'

const querystring = require('querystring')

class Tracks {

  constructor(token) {
    this.token = token
  }

  tracksArr = []

  artistIDs = new Set()
  // key: artist ID
  // value: { tracks: [track IDs],
  //          genres: [genres] }
  artistMap = new Map()

  albumIDs = new Set()
  // key: album ID
  // value: { tracks: [track IDs],
  //          genres: [genres] }
  albumMap = new Map()

  // returns a Promise
  // result array is in an items property
  fetchTracks(offset) {
    const tracksURL = 'https://api.spotify.com/v1/me/tracks'
    const headers = new Headers()
    headers.set('Authorization', `Bearer ${this.token}`)
    const qs = querystring.stringify({ limit: 50, offset })
    return fetch(`${tracksURL}?${qs}`, { headers }).then(r => r.json())
  }

  // maximum 50 IDs
  // result array is in an artists property
  fetchArtists(IDs) {
    const headers = new Headers()
    headers.set('Authorization', `Bearer ${this.token}`)

    let url = 'https://api.spotify.com/v1/artists?ids='
    for (const ID of IDs) {
      url += `${ID},`
    }
    url = url.slice(0, -1) // remove trailing comma

    return fetch(url, { headers }).then(r => r.json())
  }

  // maximum 20 IDs
  // result array is in an albums property
  fetchAlbums(IDs) {
    const headers = new Headers()
    headers.set('Authorization', `Bearer ${this.token}`)

    let url = 'https://api.spotify.com/v1/albums?ids='
    for (const ID of IDs) {
      url += `${ID},`
    }
    url = url.slice(0, -1) // remove trailing comma

    return fetch(url, { headers }).then(r => r.json())
  }


  // takes an HTTP response
  store = (response) => {
    if (response.error) {
      log.error(response.error)
    } else {
      this.tracksArr = this.tracksArr.concat(response.items)
    }
  }

  /**
   * returns a promise with artistMap parameter
   *  tracks
   *  genres
   */
  mapArtists = () => {
    let populated = 0

    const mapArtistGenres = (res) => {
      res.artists.forEach(artistObj => {
        if (artistObj.genres.length) {
          this.artistMap.get(artistObj.id).genres =
              this.artistMap.get(artistObj.id).genres.concat(artistObj.genres)
          populated += 1
        }
      })
    }

    this.tracksArr.forEach(c => {
      this.artistIDs.add(c.track.artists[0].id)
      if (this.artistMap.has(c.track.artists[0].id)) {
        this.artistMap.get(c.track.artists[0].id).tracks.push(c.track.id)
      } else {
        this.artistMap.set(c.track.artists[0].id, { tracks: [c.track.id], genres: [] })
      }
    })

    const promises = []
    const artistIdArray = Array.from(this.artistIDs)
    for (let i = 0; i < artistIdArray.length; i += 50) {
      promises.push(
          this.fetchArtists(artistIdArray.slice(i, i + 50)).then(mapArtistGenres)
      )
    }

    return Promise.all(promises).then(() => {
      log.info(populated, '/', this.artistIDs.size, 'artists have their genres populated')
      return this.artistMap
    })
  }

  mapAlbums() {
    let populated = 0

    const mapAlbumGenres = (res) => {
      res.albums.forEach(albumObj => {
        if (albumObj.genres.length) {
          this.albumMap.get(albumObj.id).genres =
              this.albumMap.get(albumObj.id).genres.concat(albumObj.genres)
          populated += 1
        }
      })
    }

    this.tracksArr.forEach(c => {
      this.albumIDs.add(c.track.album.id)
      if (this.albumMap.has(c.track.album.id)) {
        this.albumMap.get(c.track.album.id).tracks.push(c.track.id)
      } else {
        this.albumMap.set(c.track.album.id, { tracks: [c.track.id], genres: [] })
      }
    })

    const promises = []
    const albumIdArray = Array.from(this.albumIDs)
    for (let i = 0; i < albumIdArray.length; i += 20) {
      promises.push(
          this.fetchAlbums(albumIdArray.slice(i, i + 20)).then(mapAlbumGenres)
      )
    }

    return Promise.all(promises).then(() => {
      log.info(populated, '/', this.albumIDs.size, 'albums have their genres populated')
      return this.albumMap
    })
  }

  collect = () =>
    this.fetchTracks(0).then(res => {
      this.store(res)
      const totalTracks = res.total
      log.info(`Total Tracks: ${totalTracks}`)

      const promises = []
      for (let offset = 50; offset < totalTracks; offset += 50) {
        promises.push(
          this.fetchTracks(offset).then(this.store)
        )
      }

      return Promise.all(promises).then(() =>
        log.info('Got all tracks')
      )
    })

}

export default Tracks
