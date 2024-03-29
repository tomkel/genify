import React from 'react'
import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import SaveListItem from './SaveListItem'
import Styles from '../Styles'
import { PlaylistNamesAndSizes } from './Save'

const styles: Styles = {
  playlist: {
    marginLeft: '8%',
  },
}

interface SaveListProps {
  playlistChecked: boolean[]
  updateCheckedItem: (index: number, checked: boolean) => void
  playlistNamesAndSizes: PlaylistNamesAndSizes
  totalTracks: number
  numTracksCategorized: number
}
export default React.memo(function SaveList(props: SaveListProps) {
  const {
    playlistChecked,
    updateCheckedItem,
    playlistNamesAndSizes,
    totalTracks,
    numTracksCategorized } = props

  const listItems = playlistChecked.map((isCurrChecked, i) => {
    const onCheck = (ev: React.ChangeEvent<HTMLInputElement>) => { updateCheckedItem(i, ev.target.checked) }
    const [playlistName, playlistSize] = playlistNamesAndSizes[i]
    return (
      <SaveListItem
        key={`li${i}`}
        style={styles.playlist}
        primaryText={playlistName}
        secondaryText={`${playlistSize} tracks`}
        checked={isCurrChecked}
        onCheck={onCheck}
      />
    )
  })

  return (
    <List>
      <div>
        <ListSubheader>
          {numTracksCategorized}/{totalTracks} tracks have genre metadata and were categorized into {playlistNamesAndSizes.length} playlists
        </ListSubheader>
      </div>
      {listItems}
    </List>
  )
})
