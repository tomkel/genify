import React from 'react'
import { browserHistory } from 'react-router'
import Playlists from '../playlists'
import log from '../log'

export default class Progress extends React.Component {

  componentDidMount() {
    if (!this.props.token) return
    log.info(this.props.token)
    const playlists = new Playlists(this.props.token)
    playlists.gen()
      .then(() => this.props.setPlaylists(playlists))
      .then(() => browserHistory.push('/display'))
  }

  render() {
    if (!this.props.token) {
      return <h1>{'There was an error with authentication'}</h1>
    }

    return <h1>Loading...</h1>
  }
}
