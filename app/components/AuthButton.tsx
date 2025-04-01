import Button from '@mui/material/Button'
import { useOutletContext } from 'react-router'
import type { LayoutContext } from './Layout'
import type { Styles } from './Styles.ts'
import { getAuthURL } from '@/lib/auth/implicit.ts'
// import { getAuthURL } from '@/lib/auth/pkce.ts'

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


const authRedirect = () => {
  void getAuthURL()
    .then((url) => { document.location.assign(url) })
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
