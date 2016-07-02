require('dotenv').config()
const http = require('http')
const url = require('url')
require('isomorphic-fetch')

const log = require('./log')
const auth = require('./auth')
const playlist = require('./playlist')

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  log.error('Set environment variables specified in README.')
  process.exit(1)
}

function requestHandler(request, response) {
  const urlObj = url.parse(request.url, true)
  log.debug(urlObj)

  if (urlObj.query.error) {
    response.end()
    log.error(urlObj.query.error)
    return
  }

  if (urlObj.query.code) {
    response.end()
    log.info(`got auth code: ${urlObj.query.code}`)

    auth.authCodeFlow(urlObj.query.code)
      .then(a => console.log(a))
      // .then(playlist.gen)
  } else {
    const html = `<!DOCTYPE html>
      <button onclick="document.location.assign('${auth.url}')">
        Click to Authorize
      </button>`

    response.end(html)
  }
}

;(() => {
  http.createServer(requestHandler).listen(8080)
})()
