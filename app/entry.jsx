import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { minBlack } from 'material-ui/styles/colors'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import merge from 'lodash/merge'
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


const palette = {
  primary1Color: '#3f3f42',
  accent1Color: '#84bd00',
  textColor: '#dfe0e6',
  secondaryTextColor: '#838486',
  // shows up on buttons
  alternateTextColor: '#dfe0e6',
  // used in Save.jsx
  cardBackground: '#222326',
}

const muiTheme = getMuiTheme(merge({}, darkBaseTheme, {
  // black background: #121314
  // lighter black background: #222326
  // muted gray <p> text: #838486
  // bright gray <h> text: #dfe0e6
  // accent green: #84bd00
  // icon white: #ffffff
  overlay: {
    backgroundColor: minBlack,
  },
  palette,
  checkbox: {
    checkedColor: palette.secondaryTextColor,
    // equal to textColor/alternateTextColor by default
    boxColor: palette.secondaryTextColor,
  },
  backgroundColor: '#121314',
}))

log.debug(muiTheme)

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
