# genify
Build spotify playlists from saved music based on their type and genre.

## Usage Environment variables

`SPOTIFY_CLIENT_ID`, and `SPOTIFY_CLIENT_SECRET` must be set in order for the
script to work.

You can register for this API key
[here](https://developer.spotify.com/my-applications/#!/applications).

Start the program with
```
npm start
```

## Design

**genify** attemps to group saved spotify songs into playlists based on their similarity to each other.

There are a couple properties in the [Spotify Web API](https://developer.spotify.com/web-api/) which appear to allow this. The [album object](https://developer.spotify.com/web-api/object-model/#album-object-full) has a `genres` property which would be sufficient, however not one of the albums in my library had this field populated.

The [artist object](https://developer.spotify.com/web-api/object-model/#artist-object-full) also has a `genres` property. 47% of the artists in my library had this field populated, which is better, but still not good enough.

Looking at the [EchoNest API](http://developer.echonest.com/docs/v4) instead, there is an [`Artist/terms`](http://developer.echonest.com/docs/v4/artist.html#terms) API endpoint, from which you can get *"a list of most descriptive terms for an artist"*.
