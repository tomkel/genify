import { useState } from 'react'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import { emphasize } from '@mui/system/colorManipulator'
import type { Styles } from '@/components/Styles.ts'
import { usePlaylistStore } from '@/lib/state.ts'
import { unselectSmallPlaylists } from '@/lib/playlists.ts'

function getStyles(muiTheme: Theme): Styles {
  return {
    spinner: {
      minWidth: '1rem',
      backgroundColor: emphasize(muiTheme.palette.primary.main),
    },
    container: {
      display: 'inline-block',
      minWidth: '28em',
    },
  }
}

type UnselectButtonProps = {
  style: React.CSSProperties
}
export default function UnselectButton({ style }: UnselectButtonProps) {
  const theme = useTheme()
  const styles = getStyles(theme)

  const genrePlaylists = usePlaylistStore(state => state.genrePlaylists)
  const renderPlaylists = usePlaylistStore(state => state.renderPlaylists)

  const min = 2
  const [curr, setCurr] = useState(min)

  const dec = () => { if (curr > min) setCurr(curr - 1) }
  const inc = () => { setCurr(curr + 1) }
  const doAction = () => {
    unselectSmallPlaylists(genrePlaylists, curr)
    renderPlaylists()
  }

  return (
    <div style={Object.assign({}, style, styles.container)}>
      <Button
        variant="contained"
        onClick={dec}
        sx={styles.spinner}
      >-</Button>
      <Button
        variant="contained"
        color="primary"
        onClick={doAction}
      >{`Unselect playlists with less than ${curr} tracks`}</Button>
      <Button
        variant="contained"
        onClick={inc}
        sx={styles.spinner}
      >+</Button>
    </div>
  )
}
