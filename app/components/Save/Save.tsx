import React, { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import DoneIcon from '@mui/icons-material/Done'
import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop'
import Divider from '@mui/material/Divider'
import SaveList from './SaveList'
import UnselectButton from './UnselectButton'
// import { updates as fetchQueue } from '../../fetch-queue'
import type Styles from '../Styles'
import Fab from '@mui/material/Fab'
import FormControlLabel from '@mui/material/FormControlLabel'
import { LayoutContext } from '../Layout'

const styles: Styles = {
  container: {
    maxWidth: '40rem',
    margin: '0 auto',
    paddingTop: '0.1rem',
    backgroundColor: '#222326',
  },
  progress: {
    margin: 'auto',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
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
  headerCheckbox: {
    marginTop: '0.5rem',
    marginBottom: '1rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '18em',
  },
  headerText: {
    textAlign: 'center',
    fontWeight: 300,
  },
}

const falseArr = (size: number): boolean[] => {
  return Array<boolean>(size).fill(false)
}
const trueArr = (size: number): boolean[] => {
  return Array<boolean>(size).fill(true)
}

export default function Save() {
  const [, playlists]: LayoutContext = useOutletContext()
  if (!playlists) throw new Error('expected playlists')

  const totalTracks = playlists.totalTracks()
  type PlaylistNamesAndSizes = Array<[playlistName: string, playlistSize: number]>
  const playlistNamesAndSizes: PlaylistNamesAndSizes = Array.from(playlists.getPlaylistNamesAndSizeMap().entries())

  const [deleteExistingPlaylists, setDeleteExisting] = useState(true)
  const [saving, setSaving] = useState(false)
  const [playlistChecked, setPlaylistChecked] = useState<boolean[]>(() => playlistNamesAndSizes.map(curr => curr[1] > 1))

  const navigate = useNavigate()

  useEffect(() => {
    // give time for the progress bar to show up before saving
    if (!saving) throw new Error('expected to be saving')
    void playlists.save(playlistChecked, deleteExistingPlaylists)
      .then(() => { navigate('/end') })
  }, [saving])

  const updateCheckedItem = (index: number, checked: boolean) => {
    const newCheckedArr = [...playlistChecked]
    newCheckedArr[index] = checked
    setPlaylistChecked(newCheckedArr)
  }

  const unselectMany = (minTracks: number) => {
    for (let i = 0; i < playlistNamesAndSizes.length; i += 1) {
      const numTracks = playlistNamesAndSizes[i][1]
      if (numTracks < minTracks) {
        const newCheckedArr = [...playlistChecked]
        for (let j = i; j < playlistChecked.length; j += 1) {
          newCheckedArr[j] = false
        }
        setPlaylistChecked(newCheckedArr)
      }
    }
  }

  const checkAll = () => { setPlaylistChecked(trueArr(playlistChecked.length)) }
  const uncheckAll = () => { setPlaylistChecked(falseArr(playlistChecked.length)) }

  const savingMarkup = saving ? (
    <div>
      <Backdrop open />
      <CircularProgress size={2.5} sx={styles.progress} />
    </div>
  ) : <></>

  return (
    <div style={styles.container}>
      <h1 style={styles.headerText}>Choose your playlists</h1>
      <div style={styles.buttonContainer}>
        <Button variant="contained" color="primary" sx={styles.button} onClick={checkAll}>Select All</Button>
        <Button variant="contained" color="primary" sx={styles.button} onClick={uncheckAll}>Select None</Button>
        <UnselectButton
          unselectAction={unselectMany}
          min={2}
          style={styles.button}
        />
      </div>
      <FormControlLabel
        control={(
          <Checkbox
            checked={deleteExistingPlaylists}
            onChange={() => { setDeleteExisting(prev => !prev) }}
            sx={styles.headerCheckbox}
          />
        )}
        label="Delete existing Genify playlists"
      />

      <Divider />

      <SaveList
        checkedArr={playlistChecked}
        updateChecked={updateCheckedItem}
        playlistArr={playlistNamesAndSizes}
        totalTracks={totalTracks}
        numTracksCategorized={playlists.numTracksCategorized}
      />

      <Fab color="secondary" sx={styles.doneButton} onClick={() => { setSaving(true) }}>
        <DoneIcon />
      </Fab>
      {savingMarkup}
    </div>
  )
}
