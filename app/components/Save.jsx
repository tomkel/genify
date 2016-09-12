import React from 'react'
import Playlists from '../playlists'

export default class Save extends React.Component {

  static propTypes = {
    playlists: React.PropTypes.instanceOf(Playlists),
    save: React.PropTypes.func,
  }

  state = {
    deleteExistingPlaylists: true,
  }

  save = () => {
    this.props.playlists.save()
  }

  render() {
    const playlists = Array.from(this.props.playlists.getPlaylistNamesAndSizeMap().entries()).map(
      (curr, i) =>
        <li key={i}>
          <strong>{curr[0]}</strong> - {curr[1]}
        </li>
    )

    return (
      <div>
        <h1>Playlists</h1>
        <label htmlFor="deleteExisting">
          <input
            id="deleteExisting"
            type="checkbox"
            checked={this.state.deleteExistingPlaylists}
            onChange={ev => this.setState({ deleteExistingPlaylists: ev.target.checked })}
          />
          Delete existing playlists
        </label>
        <ul>
          {playlists}
        </ul>
      </div>
    )
  }
}
