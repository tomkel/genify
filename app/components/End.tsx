import type Styles from './Styles.d.ts'

const styles = {
  container: {
    maxWidth: '40rem',
    margin: '0 auto',
    textAlign: 'center',
    height: '37vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  h1: {
    fontWeight: 300,
    fontSize: '4em',
  },
  h2: {
    fontWeight: 300,
    fontSize: '2em',
  },
} satisfies Styles

export default function End() {
  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>Success!</h1>
      <h2 style={styles.h2}>Check your Spotify account for the playlists.</h2>
    </div>
  )
}
