import React from 'react'
import { browserHistory } from 'react-router'
import CircularProgress from 'material-ui/CircularProgress'
import Playlists from '../playlists'
import { setToken } from '../spotify'
import log from '../log'

const path = require('path')

const styles = {
  progress: {
    margin: 'auto',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
}

export default class Generate extends React.Component {

  static propTypes = {
    token: React.PropTypes.string,
    setPlaylists: React.PropTypes.func,
  }

  componentDidMount() {
    if (!this.props.token) return
    setToken(this.props.token)
    const playlists = new Playlists(false)
    this.props.setPlaylists(playlists)
    const nextPath = path.join(this.props.routes[0].path, 'save')
    playlists.gen()
      .then(() => browserHistory.push(nextPath))
  }

  render() {
    if (!this.props.token) {
      return <h1>{'There was an error with authentication'}</h1>
    }

    return (
      <div>
        <CircularProgress style={styles.progress} size={2.5} />
        {/* make sure that all fonts are loaded */}
        <span style={{ visibility: 'hidden', fontWeight: 300, fontFamily: 'Roboto' }}>a</span>
        <span style={{ visibility: 'hidden', fontWeight: 400, fontFamily: 'Roboto' }}>a</span>
        <span style={{ visibility: 'hidden', fontWeight: 500, fontFamily: 'Roboto' }}>a</span>
      </div>
    )
  }
}
