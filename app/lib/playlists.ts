import log from './log.ts'
import * as spotify from './spotify.ts'
import type { GenrePlaylists, TrackIdsAndGenres } from './types.ts'

// returns an array of ids that match the regex parameter
const getMatchedSpotifyPlaylists = (match: RegExp) =>
  spotify.getAllPlaylists().then(playlists =>
    playlists.filter(item => match.test(item.name)).map(item => item.id)
  )

export const unfollowSpotifyPlaylists = () =>
  getMatchedSpotifyPlaylists(/\[.*?genify.*?\]/).then(async (matched) => {
    /* used to unfollowPlaylist.
       Without this before the map loop, getUserId will be called for each unfollowPlaylist */
    await spotify.getUserId()

    await Promise.all(matched.map(spotify.unfollowPlaylist))
    log.info(matched.length, 'playlists cleared')
  })

// playlistsToSave is a boolean array
export const saveNewPlaylists = async (playlistsToSave: GenrePlaylists) => {
  log.info('saving:')
  log.debug(playlistsToSave)

  /* used to createPlaylist.
     Without this before the forEach loop, getUserId will be called forEach createPlaylist */
  await spotify.getUserId()

  const promises: Array<Promise<void>> = []
  playlistsToSave.forEach((playlist, name) => {
    if (playlist.selected) {
      promises.push(
        spotify
          .createPlaylist(name)
          .then(playlistId => spotify.addTracksToPlaylist(playlist.tracks, playlistId))
          .then(() => {
            log.info('Created', name)
          }),
      )
    }
  })
  return Promise.all(promises)
}

export const sortTracksIntoPlaylistsByGenre =
  (genrePlaylists: GenrePlaylists) => (idag: TrackIdsAndGenres) => {
    const { tracks, genres } = idag
    try {
      // organize by genre
      genres.forEach((g) => {
        // can have same track in multiple playlists
        tracks.forEach((t) => {
          const genrePlist = genrePlaylists.get(g)
          if (genrePlist) {
            genrePlist.tracks.add(t)
          } else {
            genrePlaylists.set(g, {
              tracks: new Set([t]),
              selected: true,
              name: g,
            })
          }
        })
      })
    } catch (e) {
      log.error(e)
      log.error('failed on', idag)
    }
  }

export const unselectSmallPlaylists = (gp: GenrePlaylists, lessThanNumTracks: number) => {
  gp.forEach((playlist) => {
    if (playlist.tracks.size < lessThanNumTracks) {
      playlist.selected = false
    }
  })
}

export function getTotalTracks(gp: GenrePlaylists) {
  return Array.from(gp.values())
    .map(playlist => playlist.tracks)
    .reduce((a, b) => a.union(b))
    .size
}
