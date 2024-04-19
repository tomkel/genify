import { memo } from 'react'
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

interface SaveListItemProps {
  primaryText: string
  secondaryText: string
  style: React.CSSProperties
  onCheck: CheckboxProps['onChange']
  checked: boolean
}
export default memo(function SaveListItem(props: SaveListItemProps) {
  const { primaryText, secondaryText, style, onCheck, checked } = props

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
})

// ref={(element) => { this.props.refArr[i] = element }}
