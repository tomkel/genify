import React from 'react'

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
}

export default class End extends React.Component {
  render() {
    return (
      <div style={styles.container}>
        <h1 style={styles.h1}>Success!</h1>
        <h2 style={styles.h2}>Check your spotify account for the playlists.</h2>
      </div>
    )
  }
}
