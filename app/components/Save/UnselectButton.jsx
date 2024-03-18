import React from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import { emphasize } from '@mui/material/styles/colorManipulator'


function getStyles(muiTheme) {
  return {
    spinner: {
      minWidth: '1rem',
      backgroundColor: emphasize(muiTheme.palette.primary1Color),
    },
    container: {
      display: 'inline-block',
      minWidth: '28em',
    },
  }
}

export default class UnselectButton extends React.Component {

  static defaultProps = {
    min: 2,
  }
  static contextTypes = {
    theme: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props)
    this.styles = getStyles(context.theme)
  }

  state = {
    val: 2,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.val !== this.state.val
  }

  dec = () => {
    if (this.state.val > this.props.min) {
      this.setState({ val: this.state.val - 1 })
    }
  }
  inc = () => {
    this.setState({ val: this.state.val + 1 })
  }

  doAction = () => {
    this.props.action(this.state.val)
  }

  render() {
    return (
      <div style={Object.assign({}, this.props.style, this.styles.container)}>
        <Button
          variant="contained"
          label="−"
          onClick={this.dec}
          backgroundColor={this.styles.spinner.backgroundColor}
          style={this.styles.spinner}
        />
        <Button
          variant="contained"
          label={`Unselect playlists with less than ${this.state.val} tracks`}
          primary
          onClick={this.doAction}
        />
        <Button
          variant="contained"
          label="+"
          onClick={this.inc}
          backgroundColor={this.styles.spinner.backgroundColor}
          style={this.styles.spinner}
        />
      </div>
    )
  }
}
