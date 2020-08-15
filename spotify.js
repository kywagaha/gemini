var SpotifyWebApi = require('spotify-web-api-js');
const { app, globalShortcut } = require('electron')
var spotifyApi = new SpotifyWebApi();

spotifyApi.setAccessToken('BQDhf4i97R1niuDk7ZvlKkr7c3DovqyKdl3D2DrAc5ieSA0UBDbJVBYpNnQc1B32ZfaWbNJSsCg8hKN3LegdWoXgF1hV1PjXU4VH6CHmQi12NVQ34eM6aVKvXtNXYHnN5Vn5VdXY0DsxClKYopNSfzmBTZR9wTrguuP_jBQ0yjisv3tqPYdrtqJdEz1u73M');
spotifyApi.getMyCurrentPlayingTrack('title')
.then(function(data) {
  console.log('Now playing', data)
  document.getElementById("song").innerHTML = data.item.name
  document.getElementById("artist").innerHTML = data.item.artists[0].name
  document.body.style.backgroundImage = 'url('+data.item.album.images[0].url+')'
  
  const interval = setInterval(function(){

    spotifyApi.getMyCurrentPlayingTrack('title')
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

