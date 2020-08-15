var SpotifyWebApi = require('spotify-web-api-js');
var spotifyApi = new SpotifyWebApi();

spotifyApi.setAccessToken('YOUR-TOKEN-HERE');
spotifyApi.getMyCurrentPlayingTrack()
.then(function(data) {
  console.log('Now playing', data)
  document.getElementById("song").innerHTML = data.item.name
  document.getElementById("artist").innerHTML = data.item.artists[0].name
  document.body.style.backgroundImage = 'url('+data.item.album.images[0].url+')'
  
  const interval = setInterval(function(){

    spotifyApi.getMyCurrentPlayingTrack()
    .then(function(data) {
      console.log('Now playing', data)
      document.getElementById("song").innerHTML = data.item.name
      document.getElementById("artist").innerHTML = data.item.artists[0].name
      document.body.style.backgroundImage = 'url('+data.item.album.images[0].url+')'
      
    }, function(error) {
      console.log(error)
    }); 
  
  }, 5000);
}
), (function(err) {
  console.error(err);
});

window.onclick = function toggle_playback() {
  spotifyApi.getMyCurrentPlayingTrack()
  .then(function(data) {
  var isPlaying = data.is_playing
  if (isPlaying == true){
    spotifyApi.pause()
    console.log('Pausing music')
  }
  else if (isPlaying == false){
    spotifyApi.play()
    console.log('Playing music')
  }
  else {
    console.log('No track loaded')
  }
  
  })
}
clearInterval(interval);

