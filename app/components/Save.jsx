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

      </div>
    )
  }
}
