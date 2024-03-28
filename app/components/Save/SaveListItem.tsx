import React from 'react'
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox'
import ListItem from '@mui/material/ListItem'
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'

interface SaveListItemProps {
  primaryText: string
  secondaryText: string
  style: React.CSSProperties
  onCheck: CheckboxProps['onChange']
  checked: boolean
}
export default class SaveListItem extends React.Component<SaveListItemProps> {

  shouldComponentUpdate(nextProps: SaveListItemProps) {
    return nextProps.checked !== this.props.checked
  }

  render() {
    const { primaryText, secondaryText, style, onCheck, checked } = this.props

    return (
      <ListItem sx={style}>
        <ListItemButton>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={checked}
              onChange={onCheck}
            />
          </ListItemIcon>
          <ListItemText primary={primaryText} secondary={secondaryText} />
        </ListItemButton>
      </ListItem>
    )
  }
}

// ref={(element) => { this.props.refArr[i] = element }}
