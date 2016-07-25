const querystring = require('querystring')
const tokens = require('./tokens')
const tracks = require('./tracks')
const log = require('./log')

const playlists = new Map()
function createPlaylists(map) {
  log.debug(map)
  map[0].forEach(v => {
    try {
      // organize by genre
      v.genres.forEach(g => {
        v.tracks.forEach(t => {
          if (playlists.has(g)) {
            playlists.get(g).push(t)
          } else {
            playlists.set(g, [t])
          }
        })
      })
      // organize by terms
      if (v.terms && v.terms.length) {
        const term = v.terms[0].name
        v.tracks.forEach(t => {
          if (playlists.has(term)) {
            playlists.get(term).push(t)
          } else {
            playlists.set(term, [t])
          }
        })
        log.debug(term)
      }
    } catch (e) {
      log.error(e)
      log.error('failed on', v)
    }
  })
  log.info(playlists)
}

function gen() {
  return tracks.collect()
    //.then(tracks.map)
    .then(tracks.mapAlbums)
    .then(tracks.mapArtists)
  //  .then(createPlaylists)
}

function save() {

}

exports.gen = gen
exports.save = save
