import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import Layout from './components/Layout'
import AuthButton from './components/AuthButton'
import Progress from './components/Progress'
import Playlists from './components/Playlists'

require('isomorphic-fetch')
import log from './log'

/*process.on('unhandledRejection', (reason, p) => {
  log.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason)
})*/

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={Layout}>

      <IndexRoute component={AuthButton} />
      <Route path="/auth" component={Progress} />
      <Route path="/generate" component={Progress} />
      <Route path="/display" component={Playlists} />
    </Route>
  </Router>,
  document.getElementById('app'))
