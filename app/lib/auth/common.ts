export const authEndpoint = 'https://accounts.spotify.com/authorize'
const redirectOrigin = import.meta.env.PROD
  ? 'https://tkel.ly/genify'
  : 'http://localhost:5173'
export const redirectUrl = redirectOrigin + '/generate'
export const clientId = '38dfce7a65f84684b6678907870b0cec'
export const scope = 'playlist-modify-public user-library-read'
