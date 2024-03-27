import * as spotify from './spotify.ts'
import log from './log.ts'
import type { Album, Artist, SavedTrack } from '@spotify/web-api-ts-sdk'


export type TrackIdsAndGenres = { tracks: string[], genres: string[] }
class Tracks {

  tracksArr: SavedTrack[] = []

  artistIDs: Set<string> = new Set()
  // key: artist ID
  // value: { tracks: [track IDs],
  //          genres: [genres] }
  artistMap: Map<string, TrackIdsAndGenres> = new Map()

  albumIDs: Set<string> = new Set()
  // key: album ID
  // value: { tracks: [track IDs],
  //          genres: [genres] }
  albumMap: Map<string, TrackIdsAndGenres> = new Map()

  /**
   * returns a promise with artistMap parameter
   *  tracks
   *  genres
   */
  mapArtists = () => {
    let populated = 0

    const mapArtistGenres = (artists: Artist[]) => {
      artists.forEach(artistObj => {
        if (artistObj.genres.length) {
          const mapObj = this.artistMap.get(artistObj.id)
        if (!mapObj) throw new Error('mapObj undefined somehow in mapArtistGenres')
          mapObj.genres = mapObj.genres.concat(artistObj.genres)
          populated += 1
        }
      })
    }

    this.tracksArr.forEach(c => {
      this.artistIDs.add(c.track.artists[0].id)
      if (this.artistMap.has(c.track.artists[0].id)) {
        const mapObj = this.artistMap.get(c.track.artists[0].id)
        if (!mapObj) throw new Error('mapObj undefined somehow in artist tracksArr')
        mapObj.tracks.push(c.track.id)
      } else {
        this.artistMap.set(c.track.artists[0].id, { tracks: [c.track.id], genres: [] })
      }
    })

    return spotify.getAllArtists(this.artistIDs).then(mapArtistGenres).then(() => {
      log.info(populated, '/', this.artistIDs.size, 'artists have their genres populated')
      return this.artistMap
    })
  }

  mapAlbums = () => {
    let populated = 0

    const mapAlbumGenres = (albums: Album[]) => {
      albums.forEach(albumObj => {
        if (albumObj.genres.length) {
          const mapObj = this.albumMap.get(albumObj.id)
          if (!mapObj) throw new Error('mapObj undefined somehow in mapAlbumGenres')
          mapObj.genres = mapObj.genres.concat(albumObj.genres)
          populated += 1
        }
      })
    }

    this.tracksArr.forEach(c => {
      this.albumIDs.add(c.track.album.id)
      if (this.albumMap.has(c.track.album.id)) {
        const mapObj = this.albumMap.get(c.track.album.id)
        if (!mapObj) throw new Error('mapObj undefined somehow in album tracksArr')
        mapObj.tracks.push(c.track.id)
      } else {
        this.albumMap.set(c.track.album.id, { tracks: [c.track.id], genres: [] })
      }
    })

    return spotify.getAllAlbums(this.albumIDs).then(mapAlbumGenres).then(() => {
      log.info(populated, '/', this.albumIDs.size, 'albums have their genres populated')
      return this.albumMap
    })
  }

  collect = () => spotify.getAllTracks().then(tracks => this.tracksArr = tracks)
}

export default Tracks
