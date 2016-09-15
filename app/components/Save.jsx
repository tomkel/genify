import React from 'react'
import { browserHistory } from 'react-router'
import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Checkbox from 'material-ui/Checkbox'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionDone from 'material-ui/svg-icons/action/done'
import CircularProgress from 'material-ui/CircularProgress'
import Overlay from 'material-ui/internal/Overlay'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Divider from 'material-ui/Divider'
import TextField from 'material-ui/TextField'
import PlaylistCheckbox from './PlaylistCheckbox'
import Playlists from '../playlists'
import { getUserId } from '../spotify'
import { updates as fetchQueue } from '../fetch-queue'
import log from '../log'

function getStyles(muiTheme) {
  return {
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
    minTracksButton: {
      minWidth: '1rem',
      backgroundColor: muiTheme.palette.borderColor,
    },
  }
}


export default class Save extends React.Component {

  static propTypes = {
    playlists: React.PropTypes.instanceOf(Playlists),
  }

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  }

  static defaultProps = {
    playlists: new Playlists(true),
  }

  constructor(props, context) {
    super(props)

    getUserId()

    this.styles = getStyles(context.muiTheme)
    const state = {
      deleteExistingPlaylists: true,
      saving: false,
      minTracks: 2,
    }
    this.playlistArr.map(curr => curr[1] > 1).forEach((bool, i) => state[`playlist${i}`] = bool)
    this.state = state

    /* fetchQueue.on('update', (doneRequests, totalRequests) => {
      console.log('update received')
      console.log(doneRequests, totalRequests, doneRequests / totalRequests)
      this.setState({
        doneRequests,
        totalRequests,
      })
    }) */
  }

  playlistArr = Array.from(this.props.playlists.getPlaylistNamesAndSizeMap().entries())

  componentDidUpdate() {
    // give time for the progress bar to show up before saving
    if (this.state.saving) {
      this.props.playlists.save()
        .then(() => browserHistory.push('/end'))
    }
  }

  save = () => {
    this.setState({ saving: true })
  }


  unselect = () => {


  }

  setPlaylistChecked = i =>
    (ev) => {
      console.log('checked')
      const newState = {}
      newState[`playlist${i}`] = ev.target.checked
      this.setState(newState)
    }

  render() {
    const { styles } = this
    console.log(styles)
    this.playlistListItems = this.playlistArr.map(
      (curr, i) =>
        <PlaylistCheckbox
          key={i}
          primaryText={curr[0]}
          secondaryText={`${curr[1]} tracks`}
          checked={this.state[`playlist${i}`]}
          onCheck={this.setPlaylistChecked(i)}
        />
    )

    console.log(this.playlistListItems)

    let saving
    if (this.state.saving) {
      saving = (
        <div>
          <Overlay show />
          <CircularProgress size={2.5} style={styles.progress} />
        </div>
      )
    }

    console.log('context', this.context)
    return (
      <div>
        <h1>Playlists</h1>
        <Checkbox
          label="Delete existing playlists"
          checked={this.state.deleteExistingPlaylists}
          onChange={ev => this.setState({ deleteExistingPlaylists: ev.target.checked })}
        />
        <RaisedButton label="Select All" primary />
        <RaisedButton label="Select None" primary />
        <div>
          <RaisedButton
            label="−"
            onClick={() => this.setState({ minTracks: this.state.minTracks - 1 })}
            backgroundColor={styles.minTracksButton.backgroundColor}
            style={styles.minTracksButton}
          />
          <RaisedButton
            label={`Unselect playlists with less than ${this.state.minTracks} tracks`}
            primary
            onClick={ev => this.unselect}
          />
          <RaisedButton
            label="+"
            onClick={() => this.setState({ minTracks: this.state.minTracks + 1 })}
            backgroundColor={styles.minTracksButton.backgroundColor}
            style={styles.minTracksButton}
          />
        </div>

        <Divider />

        <List>
          <Subheader>Playlists</Subheader>
          {this.playlistListItems}
        </List>
        <FloatingActionButton secondary style={styles.doneButton} onClick={this.save}>
          <ActionDone />
        </FloatingActionButton>
        {saving}
      </div>
    )
  }
}
