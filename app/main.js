'use strict';

require("babel-polyfill");
const crypto = require('crypto'),
      querystring = require('querystring'),
      got = require('got');


// remove leading # from urlHash
let urlHash = window.location.hash;
if (urlHash.charAt(0) === '#') urlHash = urlHash.substr(1);
urlHash = querystring.parse(urlHash);

if ('state' in urlHash) {
  //check if state matches dom storage

  /**
   * success params:
   *  access_token
   *  token_type
   *  expires_in
   *  state
   */
  for (let param in urlHash) {
    window.localStorage.setItem(param, urlHash[param]);
  }
  /**
   * fail params:
   *  error
   *  state
   */
} else {

}


if (window.localStorage.getItem('access_token')) {
  console.log(' we have an access token ');

}
const authURL = 'https://accounts.spotify.com/authorize';
const stateString = crypto.randomBytes(64).toString('hex');
const authParams = {
  client_id: process.env.CLIENT_ID,
  response_type: 'token',
  redirect_uri: 'http://localhost:8080',
  state: stateString,
  scope: 'playlist-modify-public user-library-read'
  //show_dialog
};

const authButton = document.getElementById('auth');
authButton.addEventListener('click', ev => {
  window.location.assign(authURL + '?' + querystring.stringify(authParams));
});

//got(authURL, {query: authParams}).then(response => {
//  console.log(response.body);
//}).catch(e => {
//  console.error(e);
//});
