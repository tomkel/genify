import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { Genre, GenrePlaylists, Playlist } from './types.ts'
import { unselectSmallPlaylists } from './playlists.ts'

type PlaylistState = {
  genrePlaylists: GenrePlaylists
  setSelected: (genre: string, selected: boolean) => void
  toggleSelected: (genre: string) => void
  checkAll: () => void
  uncheckAll: () => void
  unselectSmall: (lessThanNumTracks: number) => void
}

export const usePlaylistStore = create<PlaylistState>()(
  immer(set => ({
    genrePlaylists: new Map<Genre, Playlist>() satisfies GenrePlaylists,
    // setGenrePlaylists: (gp: GenrePlaylists) => { set({ genrePlaylists: gp }) },
    setSelected: (genre: string, selected: boolean) => {
      set((state) => {
        const playlist = state.genrePlaylists.get(genre)
        if (!playlist) throw new Error(`playlist ${genre} did not exist`)
        playlist.selected = selected
      })
    },
    toggleSelected: (genre: string) => {
      set((state) => {
        const playlist = state.genrePlaylists.get(genre)
        if (!playlist) throw new Error(`playlist ${genre} did not exist`)
        playlist.selected = !playlist.selected
      })
    },
    checkAll: () => {
      set((state) => {
        state.genrePlaylists.forEach((playlist) => {
          playlist.selected = true
        })
      })
    },
    uncheckAll: () => {
      set((state) => {
        state.genrePlaylists.forEach((playlist) => {
          playlist.selected = false
        })
      })
    },
    unselectSmall: (lessThanNumTracks: number) => {
      set((state) => {
        unselectSmallPlaylists(state.genrePlaylists, lessThanNumTracks)
      })
    },
  })),
)


type TrackState = {
  numTotalTracks: number
  setTotalTracks: (n: number) => void
}

export const useTrackStore = create<TrackState>()(set => ({
  numTotalTracks: 0,
  setTotalTracks: (n) => { set({ numTotalTracks: n }) },
}))
