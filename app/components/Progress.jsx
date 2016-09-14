import React from 'react'
import { browserHistory } from 'react-router'
import CircularProgress from 'material-ui/CircularProgress'
import Playlists from '../playlists'
import { setToken } from '../spotify'
import log from '../log'

export default class Progress extends React.Component {

  static propTypes = {
    token: React.PropTypes.string,
    setPlaylists: React.PropTypes.func,
  }

  componentDidMount() {
    if (!this.props.token) return
    log.info(this.props.token)
    setToken(this.props.token)
    const playlists = new Playlists(false)
    this.props.setPlaylists(playlists)
    playlists.gen()
      .then(() => browserHistory.push('/save'))
  }

  render() {
    if (!this.props.token) {
      return <h1>{'There was an error with authentication'}</h1>
    }

    return <CircularProgress size={3} />
  }
}
