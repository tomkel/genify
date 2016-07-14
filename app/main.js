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

process.on('unhandledRejection', (reason, p) => {
  log.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason)
})

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
    log.debug(`got auth code: ${urlObj.query.code}`)

    auth.authCodeFlow(urlObj.query.code)
      .then(playlist.gen)
      // .then(playlist.save)
  } else {
    const html = `<!DOCTYPE html>
      <button onclick="document.location.assign('${auth.url}')">
        Click to Authorize
      </button>`

    response.end(html)
  }
}

(() => {
  http.createServer(requestHandler).listen(8080, () => {
    log.info('Please visit http://localhost:8080 in your browser to begin the program')
  })
})()
