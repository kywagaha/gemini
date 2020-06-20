var SpotifyWebApi = require('spotify-web-api-js');
var spotifyApi = new SpotifyWebApi();

spotifyApi.setAccessToken('spotifytoken');
spotifyApi.getMyCurrentPlayingTrack('title')
.then(function(data) {
    console.log('User playlists', data);
  }, function(err) {
    console.error(err);
  });