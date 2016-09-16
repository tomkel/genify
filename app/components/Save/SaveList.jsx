import React from 'react'
import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Checkbox from 'material-ui/Checkbox'

const styles = {
  playlist: {
    marginLeft: '8%',
  },
  subheaderContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  subheader: {
    width: 'auto',
  },
}

export default class SaveList extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.checkedArr !== this.props.checkedArr
  }

  render() {
    return (
      <List>
        <div style={styles.subheaderContainer}>
          <Subheader style={styles.subheader}>
            {this.props.numTracksCategorized}/{this.props.totalTracks} tracks have genre metadata
          </Subheader>
          <Subheader style={styles.subheader}>{this.props.playlistArr.length} Playlists</Subheader>
        </div>
        {this.props.checkedArr.map((curr, i) =>
          <ListItem
            key={`li${i}`}
            primaryText={this.props.playlistArr[i][0]}
            secondaryText={`${this.props.playlistArr[i][1]} tracks`}
            style={styles.playlist}
            leftCheckbox={
              <Checkbox
                defaultChecked={this.props.checkedArr[i]}
                ref={(element) => { this.props.refArr[i] = element }}
              />
            }
          />
        )}
      </List>
    )
  }
}
