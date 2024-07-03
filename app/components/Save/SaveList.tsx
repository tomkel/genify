import { memo } from 'react'
import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import SaveListItem from './SaveListItem.tsx'
import type { Styles } from '@/components/Styles.ts'
import { getTotalTracks } from '@/lib/playlists.ts'
import { useTrackStore, usePlaylistStore } from '@/lib/state.ts'

const styles = {
  playlist: {
    paddingLeft: '8%',
    paddingRight: '8%',
  },
} satisfies Styles

export default memo(function SaveList() {
  const totalTracks = useTrackStore(state => state.numTotalTracks)
  const genrePlaylists = usePlaylistStore(state => state.genrePlaylists)
  const numTracksCategorized = getTotalTracks(genrePlaylists)

  const li = Array.from(genrePlaylists.entries())
    .toSorted((a, b) => b[1].tracks.size - a[1].tracks.size)
    .map(([name]) => {
      return (
        <SaveListItem
          style={styles.playlist}
          key={name}
          genre={name}
        />
      )
    })

  return (
    <List>
      <div>
        <ListSubheader>
          {numTracksCategorized}/{totalTracks} tracks have genre metadata and were categorized into {genrePlaylists.size} playlists
        </ListSubheader>
      </div>
      {li}
    </List>
  )
})
