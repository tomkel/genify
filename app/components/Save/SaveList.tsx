import React from 'react'
import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import SaveListItem from './SaveListItem'
import Styles from '../Styles'
import type { CheckboxProps } from '@mui/material/Checkbox/Checkbox.d.ts'

const styles: Styles = {
  playlist: {
    marginLeft: '8%',
  },
}

interface SaveListProps {
  checkedArr: boolean[]
  updateChecked: (index: number, checked: boolean) => void
  playlistArr: Array<[string, number]>
  totalTracks: number
  numTracksCategorized: number
}
export default class SaveList extends React.Component<SaveListProps> {

  shouldComponentUpdate(nextProps: SaveListProps) {
    return nextProps.checkedArr !== this.props.checkedArr
  }

  updateCheckedArr = this.props.playlistArr.map((_curr, i) => {
    const checkboxChange: CheckboxProps['onChange'] =
      (_ev: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        this.props.updateChecked(i, checked)
      }
    return checkboxChange
  })

  render() {
    const listItems = this.props.checkedArr.map((curr, i) => {
      const currPlaylist = this.props.playlistArr[i]
      return (
        <SaveListItem
          key={`li${i}`}
          style={styles.playlist}
          primaryText={currPlaylist[0]}
          secondaryText={`${currPlaylist[1]} tracks`}
          checked={curr}
          onCheck={this.updateCheckedArr[i]}
        />
      )
    })

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
