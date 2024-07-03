export type TrackIdsAndGenres = {
  tracks: Set<string>
  genres: Set<string>
}
type ArtistID = string
export type ArtistMap = Map<ArtistID, TrackIdsAndGenres>

export type Playlist = {
  selected: boolean
  tracks: Set<string>
  name: string
}
export type Genre = string
export type GenrePlaylists = Map<Genre, Playlist>
