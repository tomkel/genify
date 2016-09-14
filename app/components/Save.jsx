import React from 'react'
import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Checkbox from 'material-ui/Checkbox'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionDone from 'material-ui/svg-icons/action/done'
import CircularProgress from 'material-ui/CircularProgress'
import Overlay from 'material-ui/internal/Overlay'
import Playlists from '../playlists'
import log from '../log'

const styles = {
  progress: {
    margin: 'auto',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  doneButton: {
    position: 'fixed',
    right: '1rem',
    bottom: '1rem',
  },
}

export default class Save extends React.Component {

  static propTypes = {
    playlists: React.PropTypes.instanceOf(Playlists),
  }

  static defaultProps = {
    playlists: new Playlists(true),
  }

  state = {
    deleteExistingPlaylists: true,
    saving: false,
  }

  save = () => {
    this.setState({ saving: true })
    this.props.playlists.save()
  }

  render() {
    if (this.state.saving) {
      return (
        <div>
          <Overlay show />
          <CircularProgress size={2.5} style={styles.progress} />
        </div>
      )
    }

    const playlists = Array.from(this.props.playlists.getPlaylistNamesAndSizeMap().entries()).map(
      (curr, i) =>
        <ListItem
          key={i}
          primaryText={curr[0]}
          secondaryText={`${curr[1]} tracks`}
          leftCheckbox={<Checkbox />}
        />
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
        <List>
          <Subheader>Playlists</Subheader>
          {playlists}
        </List>
        <FloatingActionButton secondary style={styles.doneButton} onClick={this.save}>
          <ActionDone />
        </FloatingActionButton>
      </div>
    )
  }
}
