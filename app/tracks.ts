import * as spotify from './spotify'
import log from './log'
import type { Album, Artist, SavedTrack } from '@spotify/web-api-ts-sdk'


export interface TrackIdsAndGenres {
  tracks: Set<string>
  genres: Set<string>
}
class Tracks {

  savedTracks = new Array<SavedTrack>()

  // key: artist ID
  // value: { tracks: [track IDs],
  //          genres: [genres] }
  artistMap = new Map<string, TrackIdsAndGenres>()

  albumIDs = new Set<string>()
  // key: album ID
  // value: { tracks: [track IDs],
  //          genres: [genres] }
  albumMap = new Map<string, TrackIdsAndGenres>()

  /**
   * returns a promise with artistMap parameter
   *  tracks
   *  genres
   */
  mapArtists = () => {
    let artistHasGenres = 0

    const mapArtistGenres = (artists: Artist[]) => {
      artists.forEach((artist) => {
        if (artist.genres.length) {
          const tg = this.artistMap.get(artist.id)
          if (!tg) throw new Error('we fetched an artist that we shouldnt have')
          artist.genres.forEach(genre => tg.genres.add(genre))
          artistHasGenres += 1
        }
      })
    }

    this.savedTracks.forEach((t) => {
      const firstArtistID = t.track.artists[0].id
      if (this.artistMap.has(firstArtistID)) {
        const tg = this.artistMap.get(firstArtistID)
        if (!tg) throw new Error('tg undefined somehow in artist savedTracks')
        tg.tracks.add(t.track.id)
      } else {
        this.artistMap.set(firstArtistID, { tracks: new Set([t.track.id]), genres: new Set() })
      }
    })

    const artistIDs = [...this.artistMap.keys()]
    return spotify.getAllArtists(artistIDs).then(mapArtistGenres).then(() => {
      log.info(artistHasGenres, '/', this.artistMap.size, 'artists have their genres populated')
      return this.artistMap
    })
  }

  mapAlbums = () => {
    let populated = 0

    const mapAlbumGenres = (albums: Album[]) => {
      albums.forEach((albumObj) => {
        if (albumObj.genres.length) {
          const mapObj = this.albumMap.get(albumObj.id)
          if (!mapObj) throw new Error('mapObj undefined somehow in mapAlbumGenres')
          mapObj.genres.forEach(genre => mapObj.genres.add(genre))
          populated += 1
        }
      })
    }

    this.savedTracks.forEach((c) => {
      this.albumIDs.add(c.track.album.id)
      if (this.albumMap.has(c.track.album.id)) {
        const mapObj = this.albumMap.get(c.track.album.id)
        if (!mapObj) throw new Error('mapObj undefined somehow in album tracksArr')
        mapObj.tracks.add(c.track.id)
      } else {
        this.albumMap.set(c.track.album.id, { tracks: new Set([c.track.id]), genres: new Set() })
      }
    })

    return spotify.getAllAlbums(this.albumIDs).then(mapAlbumGenres).then(() => {
      log.info(populated, '/', this.albumIDs.size, 'albums have their genres populated')
      return this.albumMap
    })
  }

  collect = () => spotify.getAllTracks().then(tracks => this.savedTracks = tracks)
}

export default Tracks
