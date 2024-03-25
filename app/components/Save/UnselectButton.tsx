import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import type { Theme } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
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

type UnselectButtonProps = { min: number, theme: Theme, action: (val: number) => void, style: React.CSSProperties }

UnselectButton.propTypes = {
  theme: PropTypes.object.isRequired,
}
export default function UnselectButton({ min = 2, theme, action, style }: UnselectButtonProps) {
  const styles = getStyles(theme)
  const [val, setVal] = useState(2)

  const dec = () => {
    if (val > min) {
      setVal(val - 1)
    }
  }
  const inc = () => {
    setVal( val + 1 )
  }

  const doAction = () => {
    action(val)
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
      >{`Unselect playlists with less than ${val} tracks`}</Button>
      <Button
        variant="contained"
        onClick={inc}
        sx={styles.spinner}
      >+</Button>
    </div>
  )
}