import React from 'react'
import Checkbox from 'material-ui/Checkbox'
import { ListItem } from 'material-ui/List'

export default class SaveListItem extends React.Component {

  state = {
    checked: this.props.checked,
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ checked: nextProps.checked })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.checked !== this.state.checked
  }

  updateCheck = (ev, checked) => {
    //this.props.checkedArr[this.props.index] = checked
    this.setState({ checked })
  }

  render() {
    const checkbox = (
      <Checkbox
        checked={this.state.checked}
        //onCheck={this.props.updateChecked}
        onCheck={this.updateCheck}
      />
    )
    const { primaryText, secondaryText, style } = this.props
    return (
      <ListItem
        primaryText={primaryText}
        secondaryText={secondaryText}
        style={style}
        leftCheckbox={checkbox}
      />
    )
  }
}

// ref={(element) => { this.props.refArr[i] = element }}
