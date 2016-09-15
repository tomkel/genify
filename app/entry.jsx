import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { minBlack } from 'material-ui/styles/colors'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import injectTapEventPlugin from 'react-tap-event-plugin'
import Layout from './components/Layout'
import AuthButton from './components/AuthButton'
import Generate from './components/Generate'
import Save from './components/Save'
import End from './components/End'
import log from './log'

process.on('unhandledRejection', (reason, p) => {
  log.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason)
})

injectTapEventPlugin()

const muiTheme = getMuiTheme({
  overlay: {
    backgroundColor: minBlack,
  },
})

class Main extends React.Component {

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Router history={browserHistory}>
          <Route path="/" component={Layout}>

            <IndexRoute component={AuthButton} />
            <Route path="/generate" component={Generate} />
            <Route path="/save" component={Save} />
            <Route path="/end" component={End} />
          </Route>
        </Router>
      </MuiThemeProvider>
    )
  }
}

ReactDOM.render(<Main />, document.getElementById('app'))
