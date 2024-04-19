import Button from '@mui/material/Button'
import { useOutletContext } from 'react-router-dom'
import type { LayoutContext } from './Layout'
import type Styles from './Styles'

const styles = {
  container: {
    maxWidth: '34rem',
    height: '58vh',
    textAlign: 'center',
  },
  introText: {
    fontSize: '2.2em',
  },
  startButton: {
    width: '20rem',
  },
} satisfies Styles


function getAuthURL() {
  const authURL = 'https://accounts.spotify.com/authorize'
  // const stateString = crypto.randomBytes(64).toString('hex')
  const redirectOrigin = import.meta.env.PROD
    ? 'https://tkel.ly'
    : 'http://localhost:5173'

  // `new URL` will throw with invalid result, although it seems pretty tolerant
  const redirectUrl = new URL(`${import.meta.env.BASE_URL}/generate`, redirectOrigin)

  const authParams = new URLSearchParams({
    client_id: '38dfce7a65f84684b6678907870b0cec',
    response_type: 'token',
    redirect_uri: redirectUrl.toString(),
    // state: stateString,
    scope: 'playlist-modify-public user-library-read',
  })
  return `${authURL}?${authParams.toString()}`
}

const authRedirect = () => {
  document.location.assign(getAuthURL())
}

export default function AuthButton() {
  const [contextStyles]: LayoutContext = useOutletContext()

  return (
    <div style={Object.assign({}, contextStyles.mainChildren, styles.container)}>
      <h1 style={styles.introText}>
        Genify organizes your saved music in Spotify into playlists based on genre.
      </h1>

      <Button
        variant="contained"
        color="primary"
        onClick={authRedirect}
        sx={styles.startButton}
      >Click here to get started</Button>
    </div>
  )
}
