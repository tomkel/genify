import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'

const querystring = require('querystring')


function getAuthURL() {
  const authURL = 'https://accounts.spotify.com/authorize'
  // const stateString = crypto.randomBytes(64).toString('hex')
  const authParams = {
    client_id: '38dfce7a65f84684b6678907870b0cec',
    response_type: 'token',
    redirect_uri: 'http://localhost:8080/generate',
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
      <div>
        <h1>Genify is an app that organizes your saved music in Spotify.</h1>
        <h2>
          Genify reads the songs in <i>Your Music</i> and sorts them into playlists based on genre.
        </h2>
        <h2>Press the button below to get started</h2>

        <RaisedButton label="Click Here to Authorize" primary onClick={this.authRedirect} />
      </div>
    )
  }
}

export default AuthButton
