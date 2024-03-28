import React, { useState } from 'react'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles'
import { emphasize } from '@mui/system/colorManipulator'
import type Styles from '../Styles'


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

type UnselectButtonProps = { min: number, unselectAction: (minTracks: number) => void, style: React.CSSProperties }
export default function UnselectButton({ min = 2, unselectAction, style }: UnselectButtonProps) {
  const theme = useTheme()
  const styles = getStyles(theme)
  const [val, setVal] = useState(2)

  const dec = () => { if (val > min) setVal(val - 1) }
  const inc = () => setVal( val + 1 )
  const doAction = () => unselectAction(val)

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
      >{`Unselect playlists with less than ${val} tracks`}</Button>
      <Button
        variant="contained"
        onClick={inc}
        sx={styles.spinner}
      >+</Button>
    </div>
  )
}