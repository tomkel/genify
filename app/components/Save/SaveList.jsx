import React from 'react'
import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import SaveListItem from './SaveListItem'

const styles = {
  playlist: {
    marginLeft: '8%',
  },
}

export default class SaveList extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.checkedArr !== this.props.checkedArr
  }

  updateCheckedArr = this.props.playlistArr.map((curr, i) =>
      (ev, checked) => this.props.updateChecked(i, checked))

  render() {
    const listItems = this.props.checkedArr.map((curr, i) => (
      <SaveListItem
        key={`li${i}`}
        style={styles.playlist}
        primaryText={this.props.playlistArr[i][0]}
        secondaryText={`${this.props.playlistArr[i][1]} tracks`}
        checked={this.props.checkedArr[i]}
        onCheck={this.updateCheckedArr[i]}
      />
    ))

    return (
      <List>
        <div>
          <ListSubheader>
            {this.props.numTracksCategorized}/{this.props.totalTracks} tracks have genre metadata and were categorized into {this.props.playlistArr.length} playlists
          </ListSubheader>
        </div>
        {listItems}
      </List>
    )
  }
}
