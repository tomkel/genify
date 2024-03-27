import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useOutletContext } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import Playlists from '../playlists'
import { setToken } from '../spotify'
import log from '../log'
import type { LayoutContext } from './Layout'

const styles = {
  progress: {
    margin: 'auto',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
}

export default function Generate() {
  const [styles, token, setPlaylists]: LayoutContext = useOutletContext()

  useEffect(() => {
    if (!token) return
    const navigate = useNavigate()
    setToken(token)
    const playlists = new Playlists(false)
    setPlaylists(playlists)
    playlists.gen()
      .then(() => navigate('save'))
    
  }, [token])

  if (!token) {
    return <h1>{'There was an error with authentication'}</h1>
  }

  return (
    <div style={styles.mainChildren}>
      <CircularProgress sx={styles.progress} size={2.5} />
      {/* make sure that all fonts are loaded */}
      <span style={{ visibility: 'hidden', fontWeight: 300, fontFamily: 'Roboto' }}>a</span>
      <span style={{ visibility: 'hidden', fontWeight: 400, fontFamily: 'Roboto' }}>a</span>
      <span style={{ visibility: 'hidden', fontWeight: 500, fontFamily: 'Roboto' }}>a</span>
      <span style={{ visibility: 'hidden', fontWeight: 700, fontFamily: 'Roboto' }}>a</span>
    </div>
  )
}