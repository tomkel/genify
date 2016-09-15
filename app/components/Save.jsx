import React from 'react'
import { browserHistory } from 'react-router'
import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Checkbox from 'material-ui/Checkbox'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionDone from 'material-ui/svg-icons/action/done'
import CircularProgress from 'material-ui/CircularProgress'
import Overlay from 'material-ui/internal/Overlay'
import RaisedButton from 'material-ui/RaisedButton'
import Divider from 'material-ui/Divider'
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

    /* fetchQueue.on('update', (doneRequests, totalRequests) => {
      console.log('update received')
      console.log(doneRequests, totalRequests, doneRequests / totalRequests)
      this.setState({
        doneRequests,
        totalRequests,
      })
    }) */
  }

  state = {
    deleteExistingPlaylists: true,
    saving: false,
    minTracks: 2,
  }

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
    for (let i = 0; i < this.playlistArr.length; i += 1) {
      const numTracks = this.playlistArr[i][1]
      if (numTracks < this.state.minTracks) {
        for (let j = i; j < this.playlistChecked.length; j += 1) {
          this.playlistChecked[j] = false
        }
        this.forceUpdate()
        return
      }
    }
  }

  playlistArr = Array.from(this.props.playlists.getPlaylistNamesAndSizeMap().entries())
  playlistChecked = this.playlistArr.map(curr => curr[1] > 1)

  render() {
    const { styles } = this

    const playlistListItems = this.playlistArr.map(
      (curr, i) =>
        <ListItem
          key={i}
          primaryText={curr[0]}
          secondaryText={`${curr[1]} tracks`}
          leftCheckbox={
            <Checkbox
              defaultChecked={this.playlistChecked[i]}
              onCheck={(ev) => { this.playlistChecked[i] = ev.target.checked }}
            />
          }
        />
   )

    let saving
    if (this.state.saving) {
      saving = (
        <div>
          <Overlay show />
          <CircularProgress size={2.5} style={styles.progress} />
        </div>
      )
    }

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
            onClick={this.unselect}
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
          {playlistListItems}
        </List>
        <FloatingActionButton secondary style={styles.doneButton} onClick={this.save}>
          <ActionDone />
        </FloatingActionButton>
        {saving}
      </div>
    )
  }
}
