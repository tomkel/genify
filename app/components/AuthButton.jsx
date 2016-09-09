import React from 'react'

const querystring = require('querystring')

function getAuthURL() {
  const authURL = 'https://accounts.spotify.com/authorize'
  // const stateString = crypto.randomBytes(64).toString('hex')
  const authParams = {
    client_id: '38dfce7a65f84684b6678907870b0cec',
    response_type: 'token',
    redirect_uri: 'http://localhost:8080/auth',
    // state: stateString,
    scope: 'playlist-modify-public user-library-read',
  }
  return `${authURL}?${querystring.stringify(authParams)}`
}

class AuthButton extends React.Component {

  constructor() {
    super()
    this.authRedirect = this.authRedirect.bind(this)
  }

  authRedirect() {
    document.location.assign(getAuthURL())
  }

  render() {
    return (
      <button onClick={this.authRedirect}>
        Click to Authorize
      </button>
    )
  }
}

export default AuthButton
