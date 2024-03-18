import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import DoneIcon from '@mui/material/done'
import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop'
import Divider from '@mui/material/Divider'
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
    playlists: PropTypes.instanceOf(Playlists),
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  }

  static defaultProps = {
    playlists: new Playlists(true),
  }

  constructor(props, context) {
    super(props)
    getUserId()
    this.styles = getStyles(context.muiTheme)
    this.totalTracks = props.playlists.totalTracks()

    this.playlistArr = Array.from(this.props.playlists.getPlaylistNamesAndSizeMap().entries())

    this.state = {
      deleteExistingPlaylists: true,
      saving: false,
      playlistChecked: this.playlistArr.map(curr => curr[1] > 1),
    }

    /* fetchQueue.on('update', (doneRequests, totalRequests) => {
      console.log('update received')
      console.log(doneRequests, totalRequests, doneRequests / totalRequests)
      this.setState({
        doneRequests,
        totalRequests,
      })
    }) */
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.playlistChecked !== this.state.playlistChecked ||
      nextState.saving !== this.state.saving ||
      nextState.deleteExistingPlaylists !== this.state.deleteExistingPlaylists
  }

  componentDidUpdate() {
    // give time for the progress bar to show up before saving
    if (this.state.saving) {
      const nextPath = this.props.routes[0].path + '/end'
      this.props.playlists.save(this.state.playlistChecked, this.state.deleteExistingPlaylists)
        .then(() => browserHistory.push(nextPath))
    }
  }

  save = () => {
    this.setState({ saving: true })
  }

  unselect = (minTracks) => {
    for (let i = 0; i < this.playlistArr.length; i += 1) {
      const numTracks = this.playlistArr[i][1]
      if (numTracks < minTracks) {
        const newCheckedArr = this.state.playlistChecked.slice()
        for (let j = i; j < this.state.playlistChecked.length; j += 1) {
          newCheckedArr[j] = false
        }
        this.setState({ playlistChecked: newCheckedArr })
        return
      }
    }
  }

  updateChecked = (index, checked) => {
    const newCheckedArr = this.state.playlistChecked.slice()
    newCheckedArr[index] = checked
    this.setState({ playlistChecked: newCheckedArr })
  }

  uncheckAll = () => {
    this.setState({ playlistChecked: this.state.playlistChecked.map(() => false) })
  }
  checkAll = () => {
    this.setState({ playlistChecked: this.state.playlistChecked.map(() => true) })
  }

  render() {
    const { styles } = this

    let saving
    if (this.state.saving) {
      saving = (
        <div>
          <Backdrop open />
          <CircularProgress size={2.5} style={styles.progress} />
        </div>
      )
    }

    return (
      <div style={styles.container}>
        <h1 style={styles.headerText}>Choose your playlists</h1>
        <div style={styles.buttonContainer}>
          <Button variant="contained" label="Select All" primary style={styles.button} onClick={this.checkAll} />
          <Button variant="contained" label="Select None" primary style={styles.button} onClick={this.uncheckAll} />
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
          checkedArr={this.state.playlistChecked}
          updateChecked={this.updateChecked}
          playlistArr={this.playlistArr}
          totalTracks={this.totalTracks}
          numTracksCategorized={this.props.playlists.numTracksCategorized}
        />

        <Button variant="fab" secondary style={styles.doneButton} onClick={this.save}>
          <DoneIcon />
        </Button>
        {saving}
      </div>
    )
  }
}
