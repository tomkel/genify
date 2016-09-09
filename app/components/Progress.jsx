import React from 'react'
import Playlists from '../playlists'

export default class Progress extends React.Component {

  constructor() {
    super()
    this.state = {
      progress: 0,
    }
  }


  render() {
    console.log(this.props.token)
    if (!this.props.token) {
      alert('There was an error with authentication')
      return <h1>Progress</h1>
    }

    const playlists = new Playlists(this.props.token)
    playlists.gen()
      //.then(playlist.save)

    return <h1>Progress {this.state.progress}</h1>
  }
}
