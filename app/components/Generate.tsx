import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useOutletContext } from 'react-router'
import CircularProgress from '@mui/material/CircularProgress'
import type { LayoutContext } from './Layout.tsx'
import log from '@/lib/log.ts'
import type { Styles } from './Styles.ts'
import { GenrePlaylists } from '@/lib/types.ts'
import * as spotify from '@/lib/spotify.ts'
import { sortTracksByArtist } from '@/lib/tracks.ts'
import { sortTracksIntoPlaylistsByGenre, unselectSmallPlaylists } from '@/lib/playlists.ts'
import { usePlaylistStore, useTrackStore } from '@/lib/state.ts'

const styles = {
  progress: {
    margin: 'auto',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
} satisfies Styles

function useGetToken(): string {
  const [stateToken, localSetToken] = useState<string>('')
  const location = useLocation()
  if (stateToken) return stateToken

  console.log('location hash', location.hash)
  // remove leading #
  const params = new URLSearchParams(location.hash.substring(1))
  const hashToken = params.get('access_token') ?? ''
  if (hashToken) {
    spotify.setToken(hashToken)
    localSetToken(hashToken)
  }
  return hashToken
}

async function tracksIntoPlaylists(genrePlaylists: GenrePlaylists) {
  const savedTracks = await spotify.getAllSavedTracks()
  const artistMap = await sortTracksByArtist(savedTracks)
  log.debug(artistMap)
  artistMap.forEach(sortTracksIntoPlaylistsByGenre(genrePlaylists))
  unselectSmallPlaylists(genrePlaylists, 2)
  log.info(genrePlaylists)
  return savedTracks.length
}

let hasRun = false
export default function Generate() {
  const [contextStyles]: LayoutContext = useOutletContext()
  const genrePlaylists = usePlaylistStore(state => state.genrePlaylists)
  const setTotalTracks = useTrackStore(state => state.setTotalTracks)
  const navigate = useNavigate()
  const token = useGetToken()

  useEffect(() => {
    if (!token) throw new Error('didnt get token')
    if (hasRun) {
      log.info('encountered hasRun twice!')
      return
    }

    void tracksIntoPlaylists(genrePlaylists)
      .then((totalTracks) => {
        setTotalTracks(totalTracks)
        return navigate('../save', { relative: 'path' })
      })

    hasRun = true

  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!token) {
    return <h1>There was an error with authentication</h1>
  }

  return (
    <div style={contextStyles.mainChildren}>
      <CircularProgress sx={styles.progress} size={250} color="secondary" />
    </div>
  )
}
