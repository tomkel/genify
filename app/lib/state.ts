import { create } from 'zustand'
import { Genre, GenrePlaylists, Playlist } from './types.ts'

type PlaylistState = {
  genrePlaylists: GenrePlaylists
  // setGenrePlaylists: (gp: GenrePlaylists) => void
  renderPlaylists: () => void
}

export const usePlaylistStore = create<PlaylistState>()((set, get) => ({
  genrePlaylists: new Map<Genre, Playlist>() satisfies GenrePlaylists,
  // setGenrePlaylists: (gp: GenrePlaylists) => { set({ genrePlaylists: gp }) },
  renderPlaylists: () => { set({ genrePlaylists: get().genrePlaylists }) } // new obj
}))


type TrackState = {
  numTotalTracks: number
  setTotalTracks: (n: number) => void
}

export const useTrackStore = create<TrackState>()(set => ({
  numTotalTracks: 0,
  setTotalTracks: (n) => { set({ numTotalTracks: n }) },
}))
