import { memo } from 'react'
import Checkbox from '@mui/material/Checkbox'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useShallow } from 'zustand/react/shallow'
import { usePlaylistStore } from '@/lib/state.ts'

type SaveListItemProps = {
  style: React.CSSProperties
  genre: string
}
export default memo(function SaveListItem(props: SaveListItemProps) {
  const { style, genre } = props

  const playlist = usePlaylistStore(useShallow(state => state.genrePlaylists.get(genre)))
  if (!playlist) throw new Error(`missing playlist ${genre} in checkbox`)

  const toggleSelected = usePlaylistStore(state => state.toggleSelected)


  return (
    <ListItem sx={style}>
      <ListItemButton onClick={() => { toggleSelected(genre) }}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={playlist.selected}
          />
        </ListItemIcon>
        <ListItemText primary={genre} secondary={`${playlist.tracks.size} tracks`} />
      </ListItemButton>
    </ListItem>
  )
})
