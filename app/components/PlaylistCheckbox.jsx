import React from 'react'
import { ListItem } from 'material-ui/List'
import Checkbox from 'material-ui/Checkbox'

export default class PlaylistCheckbox extends React.Component {
  render() {
    return (
      <ListItem
        primaryText={this.props.primaryText}
        secondaryText={this.props.secondaryText}
        leftCheckbox={
          <Checkbox
            checked={this.props.checked}
            onCheck={this.props.onCheck}
          />
        }
      />
            
    )
  }
}
