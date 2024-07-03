import { memo } from 'react'
import Checkbox from '@mui/material/Checkbox'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { usePlaylistStore } from '@/lib/state.ts'

type SaveListItemProps = {
  style: React.CSSProperties
  genre: string
}
export default memo(function SaveListItem(props: SaveListItemProps) {
  const { style, genre } = props

  const genrePlaylists = usePlaylistStore(state => state.genrePlaylists)
  const playlist = genrePlaylists.get(genre)
  if (!playlist) throw new Error(`missing playlist ${genre} in checkbox`)

  const setSelected = usePlaylistStore(state => state.setSelected)

  return (
    <ListItem sx={style}>
      <ListItemButton>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={playlist.selected}
            onChange={(_, newCheckedState) => { setSelected(genre, newCheckedState) }}
          />
        </ListItemIcon>
        <ListItemText primary={genre} secondary={`${playlist.tracks.size} tracks`} />
      </ListItemButton>
    </ListItem>
  )
})
