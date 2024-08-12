import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import DoneIcon from '@mui/icons-material/Done'
import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop'
import Divider from '@mui/material/Divider'
import Fab from '@mui/material/Fab'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Theme, useTheme } from '@mui/material/styles'
import log from '@/lib/log.ts'
import SaveList from './SaveList.tsx'
import UnselectButton from './UnselectButton.tsx'
import type { Styles } from '@/components/Styles.ts'
import { usePlaylistStore } from '@/lib/state.ts'
import { saveNewPlaylists, unfollowSpotifyPlaylists } from '@/lib/playlists.ts'
import { Box } from '@mui/material'

const getStyles = (theme: Theme): Styles => ({
  container: {
    maxWidth: '40rem',
    margin: '0 auto',
    paddingTop: '0.1rem',
    backgroundColor: theme.palette.background.paper,
  },
  backdrop: {
    zIndex: 2, // to be higher than ListSubheader
  },
  progress: {
    margin: 'auto',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 3, // to be higher than ListSubheader + Backdrop
  },
  doneButton: {
    position: 'fixed',
    right: '50%',
    marginRight: '-18rem',
    bottom: '1rem',
  },
  button: {
    margin: '1rem',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  headerCheckboxContainer: {
    display: 'block',
    textAlign: 'center',
    userSelect: 'none',
    marginTop: '0.5rem',
    marginBottom: '1rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '18em',
  },
  headerText: {
    textAlign: 'center',
    fontWeight: 400,
  },
})

let ranEffect = false
export type PlaylistNamesAndSizes = Array<Readonly<[playlistName: string, playlistSize: number]>>
export default function Save() {
  const theme = useTheme()
  const styles = getStyles(theme)

  const checkAll = usePlaylistStore(state => state.checkAll)
  const uncheckAll = usePlaylistStore(state => state.uncheckAll)

  const [deleteExistingPlaylists, setDeleteExisting] = useState(true)
  const [saving, setSaving] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    // give time for the progress bar to show up before saving

    if (!saving) {
      log.info('expected to be saving')
      return
    }
    if (ranEffect) throw new Error('already ran saving effect')

    let p = Promise.resolve()
    if (deleteExistingPlaylists) {
      p = unfollowSpotifyPlaylists()
    }

    const genrePlaylists = usePlaylistStore.getState().genrePlaylists
    void p.then(() => saveNewPlaylists(genrePlaylists))
      .then(() => { navigate('../end', { relative: 'path' }) })

    ranEffect = true
  }, [saving]) // eslint-disable-line react-hooks/exhaustive-deps

  const savingMarkup = saving ? (
    <Box>
      <Backdrop sx={styles.backdrop} open />
      <CircularProgress size={250} color="secondary" sx={styles.progress} />
    </Box>
  ) : (
    <Fab color="secondary" sx={styles.doneButton} onClick={() => { setSaving(true) }}>
      <DoneIcon />
    </Fab>
  )

  return (
    <div style={Object.assign({}, styles.mainChildren, styles.container)}>
      <h1 style={styles.headerText}>Choose your playlists</h1>
      <div style={styles.buttonContainer}>
        <Button variant="contained" color="primary" sx={styles.button} onClick={checkAll}>Select All</Button>
        <Button variant="contained" color="primary" sx={styles.button} onClick={uncheckAll}>Select None</Button>
        <UnselectButton style={styles.button} />
      </div>
      <FormControlLabel
        control={(
          <Checkbox
            checked={deleteExistingPlaylists}
            onChange={() => { setDeleteExisting(prev => !prev) }}
          />
        )}
        label="Delete existing Genify playlists"
        sx={styles.headerCheckboxContainer}
      />

      <Divider />

      <SaveList />

      {savingMarkup}
    </div>
  )
}
