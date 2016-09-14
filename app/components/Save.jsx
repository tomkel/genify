import React from 'react'
import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Checkbox from 'material-ui/Checkbox'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionDone from 'material-ui/svg-icons/action/done'
import Playlists from '../playlists'
import log from '../log'
import styles from './save.css'

export default class Save extends React.Component {

  static propTypes = {
    playlists: React.PropTypes.instanceOf(Playlists),
  }

  static defaultProps = {
    playlists: new Playlists(true),
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
        <FloatingActionButton secondary className={styles.done} onClick={this.save}>
          <ActionDone />
        </FloatingActionButton>
      </div>
    )
  }
}
