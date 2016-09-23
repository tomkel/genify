const querystring = require('querystring')
const tokens = require('./tokens')
const tracks = require('./tracks')
const log = require('./log')

const playlists = new Map()
function createPlaylists(map) {
  log.debug(map)
  map.forEach(v => {
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
    } catch (e) {
      log.error(e)
      log.error('failed on', v)
    }
  })
  log.info(playlists)
}

function gen() {
  return tracks.collect()
    .then(tracks.mapArtists)
    .then(tracks.mapAlbums)
//    .then(createPlaylists)
}

function save() {

}

exports.gen = gen
exports.save = save
