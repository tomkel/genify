import { clientId, redirectUrl, scope, authEndpoint } from './common.ts'

// make async so can be used interchangably with PKCE auth flow
// eslint-disable-next-line @typescript-eslint/require-await
export async function getAuthURL() {
  // https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow
  const authParams = new URLSearchParams({
    client_id: clientId,
    response_type: 'token',
    redirect_uri: redirectUrl,
    scope,
  })
  return `${authEndpoint}?${authParams.toString()}`
}
