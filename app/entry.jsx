import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import Layout from './components/Layout'
import AuthButton from './components/AuthButton'
import Progress from './components/Progress'
import Save from './components/Save'
import log from './log'

process.on('unhandledRejection', (reason, p) => {
  log.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason)
})

injectTapEventPlugin()

ReactDOM.render(
  <MuiThemeProvider>
    <Router history={browserHistory}>
      <Route path="/" component={Layout}>

        <IndexRoute component={AuthButton} />
        <Route path="/generate" component={Progress} />
        <Route path="/save" component={Save} />
      </Route>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('app'))
