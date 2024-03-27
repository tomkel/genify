import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import Playlists from '../playlists'
import log from '../log'
import type { LayoutContext } from './Layout'
import { setToken as spotifySetToken } from '../spotify'

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

function useGetToken(): string {
  const [stateToken, localSetToken] = useState<string>('')
  if (stateToken) return stateToken

  const location = useLocation()
  console.log('location hash', location.hash)
    // remove leading #
  const params = new URLSearchParams(location.hash.substring(1));
  const hashToken = params.get('access_token') || ''
  if (hashToken) {
    spotifySetToken(hashToken)
    localSetToken(hashToken)
  }
  return hashToken
}

export default function Generate() {
  const [styles, setPlaylists]: LayoutContext = useOutletContext()
  const navigate = useNavigate()
  const token = useGetToken()

  useEffect(() => {
    if (!token) throw new Error('didnt get token')

    const playlists = new Playlists(false)
    setPlaylists(playlists)
    playlists.gen()
      .then(() => navigate('/save'))
  }, [])

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