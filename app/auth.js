const querystring = require('querystring')
const log = require('./log')
const tokens = require('./tokens')

function getAuthURL() {
  const authURL = 'https://accounts.spotify.com/authorize'
  // const stateString = crypto.randomBytes(64).toString('hex')
  const authParams = {
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: 'http://localhost:8080',
    // state: stateString,
    scope: 'playlist-modify-public user-library-read',
  }
  return `${authURL}?${querystring.stringify(authParams)}`
}

function getTokens(authCode) {
  const tokenUrl = 'https://accounts.spotify.com/api/token'
  const params = {
    grant_type: 'authorization_code',
    code: authCode,
    redirect_uri: 'http://localhost:8080',
  }

  const base64Auth =
    (new Buffer(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`))
    .toString('base64')

  const headers = new Headers({
    Authorization: `Basic ${base64Auth}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  })
  log.debug(headers)

  return fetch(tokenUrl, { method: 'POST', headers, body: querystring.stringify(params) })
    .then(r => r.json())
}

function authCodeFlow(authCode) {
  return getTokens(authCode).then(r => {
    if (r.access_token) {
      tokens.access = r.access_token
      tokens.refresh = r.refresh_token
      log.info('We have an access token')
      log.debug(tokens)
      return { accessToken: r.access_token, refreshToken: r.refresh_token }
    }
    return Promise.reject('Failed to get access token')
  })
}

exports.url = getAuthURL()
exports.authCodeFlow = authCodeFlow
