# genify
Build spotify playlists from saved music based on their genre.

## Design

**genify** groups saved spotify songs into playlists based on their genre.

There are a couple properties in the [Spotify Web API](https://developer.spotify.com/web-api/) which appear to allow this. The [album object](https://developer.spotify.com/web-api/object-model/#album-object-full) has a `genres` property which would be sufficient, however not one of the albums in my library had this field populated.

The [artist object](https://developer.spotify.com/web-api/object-model/#artist-object-full) also has a `genres` property. 47% of the artists in my library had this field populated. This is the current method genify uses to categorize tracks.

The EchoNest used to have a good API for this (the [`Artist/terms`](http://developer.echonest.com/docs/v4/artist.html#terms) endpoint), however Spotify has since bought
them out and shut down the API, without fully integrating it! :angry: :thumbsdown:
