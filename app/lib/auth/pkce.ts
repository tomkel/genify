import { authEndpoint, clientId, scope, redirectUrl } from './common.ts'

const generateRandomString = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = crypto.getRandomValues(new Uint8Array(length))
  return values.reduce((acc, x) => acc + possible[x % possible.length], '')
}

const sha256 = (plain: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return globalThis.crypto.subtle.digest('SHA-256', data)
}

// https://caniuse.com/mdn-javascript_builtins_uint8array_tobase64
// base64url https://datatracker.ietf.org/doc/html/rfc4648#section-5
const base64urlencode = (input: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

export async function genPKCECodes() {
  const verifier = generateRandomString(64)
  const challenge = await sha256(verifier).then(base64urlencode)

  return { verifier, challenge }
}

// https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
export async function getAuthURL() {
  const authUrl = new URL(authEndpoint)

  const { verifier, challenge } = await genPKCECodes()
  window.localStorage.setItem('code_verifier', verifier)
  window.localStorage.setItem('auth_state', generateRandomString(10))

  const params = {
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    redirect_uri: redirectUrl,
  }

  authUrl.search = new URLSearchParams(params).toString()
  return authUrl.toString()
}
