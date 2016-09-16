import React from 'react'
import { browserHistory } from 'react-router'
import Checkbox from 'material-ui/Checkbox'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionDone from 'material-ui/svg-icons/action/done'
import CircularProgress from 'material-ui/CircularProgress'
import Overlay from 'material-ui/internal/Overlay'
import RaisedButton from 'material-ui/RaisedButton'
import Divider from 'material-ui/Divider'
import SaveList from './SaveList'
import UnselectButton from './UnselectButton'
import Playlists from '../../playlists'
import { getUserId } from '../../spotify'
import { updates as fetchQueue } from '../../fetch-queue'
import log from '../../log'

function getStyles(muiTheme) {
  return {
    container: {
      maxWidth: '40rem',
      margin: '0 auto',
      paddingTop: '0.1rem',
      backgroundColor: muiTheme.palette.cardBackground,
    },
    progress: {
      margin: 'auto',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    doneButton: {
      position: 'fixed',
      right: '50%',
      marginRight: '-18rem',
      bottom: '1rem',
    },
    button: {
      margin: '1rem',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    headerCheckbox: {
      marginTop: '0.5rem',
      marginBottom: '1rem',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: '18em',
    },
    headerText: {
      textAlign: 'center',
      fontWeight: 300,
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
    this.totalTracks = props.playlists.totalTracks()

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
  }

  componentDidUpdate() {
    // give time for the progress bar to show up before saving
    if (this.state.saving) {
      this.updateCheckedFromRefs()
      this.props.playlists.save(this.playlistChecked, this.state.deleteExistingPlaylists)
        .then(() => browserHistory.push('/end'))
    }
  }

  updateCheckedFromRefs = () => {
    this.playlistChecked = this.playlistRefs.map(e => e.state.switched)
  }

  save = () => {
    this.setState({ saving: true })
  }

  unselect = (minTracks) => {
    this.updateCheckedFromRefs()
    for (let i = 0; i < this.playlistArr.length; i += 1) {
      const numTracks = this.playlistArr[i][1]
      if (numTracks < minTracks) {
        for (let j = i; j < this.playlistChecked.length; j += 1) {
          this.playlistChecked[j] = false
        }
        this.forceUpdate()
        return
      }
    }
  }

  uncheckAll = () => {
    this.playlistChecked = this.playlistChecked.map(() => false)
    this.forceUpdate()
  }
  checkAll = () => {
    this.playlistChecked = this.playlistChecked.map(() => true)
    this.forceUpdate()
  }

  playlistArr = Array.from(this.props.playlists.getPlaylistNamesAndSizeMap().entries())
  playlistChecked = this.playlistArr.map(curr => curr[1] > 1)
  playlistRefs = []

  render() {
    const { styles } = this

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
      <div style={styles.container}>
        <h1 style={styles.headerText}>Choose your playlists</h1>
        <div style={styles.buttonContainer}>
          <RaisedButton label="Select All" primary style={styles.button} onClick={this.checkAll} />
          <RaisedButton label="Select None" primary style={styles.button} onClick={this.uncheckAll} />
          <UnselectButton
            action={this.unselect}
            min={2}
            style={styles.button}
          />
        </div>
        <Checkbox
          label="Delete existing Genify playlists"
          checked={this.state.deleteExistingPlaylists}
          onCheck={(ev, checked) => this.setState({ deleteExistingPlaylists: checked })}
          style={styles.headerCheckbox}
        />

        <Divider />

        <SaveList
          checkedArr={this.playlistChecked}
          playlistArr={this.playlistArr}
          refArr={this.playlistRefs}
          totalTracks={this.totalTracks}
          numTracksCategorized={this.props.playlists.numTracksCategorized}
        />

        <FloatingActionButton secondary style={styles.doneButton} onClick={this.save}>
          <ActionDone />
        </FloatingActionButton>
        {saving}
      </div>
    )
  }
}
