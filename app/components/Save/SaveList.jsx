import React from 'react'
import { List } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import SaveListItem from './SaveListItem'

const styles = {
  playlist: {
    marginLeft: '8%',
  },
}

export default class SaveList extends React.Component {

  shouldComponentUpdate(nextProps) {
    // return false
    return true
    // return nextProps.checkedArr !== this.props.checkedArr
  }

  updateCheckedArr = []

  listItems = this.props.checkedArr.map((curr, i) => {
    //this.updateCheckedArr[i] = (checked
    return (
      <SaveListItem
        key={`li${i}`}
        style={styles.playlist}
        primaryText={this.props.playlistArr[i][0]}
        secondaryText={`${this.props.playlistArr[i][1]} tracks`}
        checkedArr={this.props.checkedArr}
        checked={this.props.checkedArr[i]}
        index={i}
      />
    )
  })

  render() {
    const listItems = this.props.checkedArr.map((curr, i) => (
      <SaveListItem
        key={`li${i}`}
        style={styles.playlist}
        primaryText={this.props.playlistArr[i][0]}
        secondaryText={`${this.props.playlistArr[i][1]} tracks`}
        checkedArr={this.props.checkedArr}
        checked={this.props.checkedArr[i]}
        index={i}
      />
    ))

    return (
      <List>
        <div>
          <Subheader>
            {this.props.numTracksCategorized}/{this.props.totalTracks} tracks have genre metadata and were categorized into {this.props.playlistArr.length} playlists
          </Subheader>
        </div>
        {listItems}
      </List>
    )
  }
}
