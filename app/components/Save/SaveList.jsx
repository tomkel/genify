import React from 'react'
import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Checkbox from 'material-ui/Checkbox'

const styles = {
  playlist: {
    marginLeft: '8%',
  },
}

export default class SaveList extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.checkedArr !== this.props.checkedArr
  }

  render() {
    return (
      <List>
        <Subheader>{this.props.playlistArr.length} Playlists</Subheader>
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
