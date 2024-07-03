import * as spotify from './spotify.ts'
import log from './log.ts'
import type { Artist, SavedTrack } from '@spotify/web-api-ts-sdk'
import type { ArtistMap, TrackIdsAndGenres } from './types.ts'

/** curried */
const addTrackToArtistMap = (artistMap: ArtistMap) => (t: SavedTrack) => {
  const firstArtistID = t.track.artists[0].id
  const tg = artistMap.get(firstArtistID)
  if (tg) {
    tg.tracks.add(t.track.id)
  } else {
    artistMap.set(firstArtistID, {
      tracks: new Set([t.track.id]),
      genres: new Set(),
    })
  }
}

/** returns true if the artist had genres */
const addArtistGenresToArtistMap = (artistMap: ArtistMap) => (artist: Artist): boolean => {
  if (!artist.genres.length) return false

  const tg = artistMap.get(artist.id)
  if (!tg) throw new Error('we fetched an artist that we shouldnt have')
  artist.genres.forEach(genre => tg.genres.add(genre))

  return true
}

/** get the first artist for the track, get its genres, and associate the genres with the track */
export const sortTracksByArtist = async (tracks: SavedTrack[]): Promise<ArtistMap> => {
  const artistMap = new Map<string, TrackIdsAndGenres>() satisfies ArtistMap

  tracks.forEach(addTrackToArtistMap(artistMap))

  const artistIDs = [...artistMap.keys()]
  const artistsInfo = await spotify.getAllArtists(artistIDs)
  const numArtistsHaveGenres = artistsInfo.map(addArtistGenresToArtistMap(artistMap))
    .reduce(
      (last, curr) => last + Number(curr),
      0,
    )
  log.info(numArtistsHaveGenres, '/', artistsInfo.length, 'artists have their genres populated')

  return artistMap
}
