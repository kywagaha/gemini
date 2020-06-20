var SpotifyWebApi = require('spotify-web-api-js');
var spotifyApi = new SpotifyWebApi();

spotifyApi.setAccessToken('token');
spotifyApi.getMyCurrentPlayingTrack('title')
.then(function(data) {
  console.log('Now playing', data);
  document.getElementById("song").innerHTML = data.item.name
  document.getElementById("artist").innerHTML = data.item.artists[0].name
  document.body.style.backgroundImage = 'url('+data.item.album.images[0].url+')'
}, function(err) {
  console.error(err);
});