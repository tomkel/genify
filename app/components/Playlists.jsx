import React from 'react'

export default class Playlists extends React.Component {
  render() {
    this.props.playlists.save()

    return (
      <div>
        <h1>Playlists</h1>
      </div>
    )
  }
}
