import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'

const querystring = require('querystring')

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
}


function getAuthURL() {
  const authURL = 'https://accounts.spotify.com/authorize'
  // const stateString = crypto.randomBytes(64).toString('hex')
  let redirectUrl
  if (process.env.NODE_ENV === 'production') {
    redirectUrl = 'https://tkel.ly/genify/generate'
  } else {
    redirectUrl = 'http://localhost:8080/generate'
  }

  const authParams = {
    client_id: '38dfce7a65f84684b6678907870b0cec',
    response_type: 'token',
    redirect_uri: redirectUrl,
    // state: stateString,
    scope: 'playlist-modify-public user-library-read',
  }
  return `${authURL}?${querystring.stringify(authParams)}`
}

class AuthButton extends React.Component {

  authRedirect = () => {
    document.location.assign(getAuthURL())
  }

  render() {
    return (
      <div style={Object.assign({}, this.props.style, styles.container)}>
        <h1 style={styles.introText}>
          Genify organizes your saved music in Spotify into playlists based on genre.
        </h1>

        <RaisedButton
          label="Click here to get started"
          primary
          onClick={this.authRedirect}
          style={styles.startButton}
        />
      </div>
    )
  }
}

export default AuthButton
