import * as spotify from './spotify.ts'
import log from './log.ts'
import type { Artist, SavedTrack } from '@spotify/web-api-ts-sdk'


export interface TrackIdsAndGenres {
  tracks: Set<string>
  genres: Set<string>
}
class Tracks {

  // key: artist ID
  // value: { tracks: [track IDs],
  //          genres: [genres] }
  artistMap = new Map<string, TrackIdsAndGenres>()

  /**
   * returns a promise with artistMap parameter
   *  tracks
   *  genres
   */
  mapArtists = (tracks: SavedTrack[]) => {
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

  collect = () => spotify.getAllTracks().then(tracks => this.savedTracks = tracks)
}

export default Tracks
