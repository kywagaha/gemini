var SpotifyWebApi = require('spotify-web-api-js');
var $ = require('jquery');
const fs = require('fs');
const path = './file.txt';
var spotifyApi = new SpotifyWebApi();

// Set Spotify app client variables here:
const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOU_CLIENT_SECRET';

var URI = 'http://localhost:8080/callback';
var scopes = ["user-modify-playback-state", "user-read-playback-state"];
var url = "https://accounts.spotify.com/authorize/?client_id=" + CLIENT_ID + "&response_type=code&redirect_uri=" + URI + "&scope=" + scopes;

if (fs.existsSync(path)) {
  console.log(url);
  var myCode;
  $.ajax({async: false, url, type: 'GET', success: function(data){myCode = data;}});
  console.log(myCode);
  var token = function getToken() {
    var myToken = null;
    $.ajax({
      async: false,
      url: 'https://accounts.spotify.com/api/token',
      data: {
        'redirect_uri':'http://localhost:8080/callback',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': myCode
      },
      type: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': ' Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
        },
      success: function(data){
        myToken = data['access_token'];
    }
    });
    return myToken;
  }();
  spotifyApi.setAccessToken(token);
  function update(){
    spotifyApi.getMyCurrentPlayingTrack()
    .then(function(data) {
      if (data != ""){
        document.getElementById("song").innerHTML = data.item.name;
        document.getElementById("artist").innerHTML = data.item.artists[0].name;
        document.body.style.backgroundImage = 'url('+data.item.album.images[0].url+')';
        console.log('Now playing', data);
      }
      else {
        document.getElementById("song").innerHTML = 'No track loaded';
        document.getElementById("artist").innerHTML = 'please play a track';
        console.log('No loaded track found');
      }
    }, function(error) {
      console.log(error);
    }); 
  
  }
  update();
  setInterval(update, 5000);

  var timer;

  function xCoords(event) {
    var x = event.clientX;
    return x;
  }
  function yCoords(event) {
    var y = event.clientX;
    return y;
  }

  var firing = false;
  var singleClick = function(){
    spotifyApi.getMyCurrentPlayingTrack()
      .then(function(data) {
      var isPlaying = data.is_playing;
      if (isPlaying == true){
        spotifyApi.pause();
        console.log('Pausing music');
      }
      else if (isPlaying == false){
        spotifyApi.play();
        console.log('Playing music');
      }
      else {
        console.log('No track loaded');
      }
    })
  };

  var doubleClickFwd = function(){ 
    spotifyApi.skipToNext();
    setTimeout(update, 300); 
  };
  var doubleClickBkwd = function(){
    setTimeout(update, 300); 
    spotifyApi.skipToPrevious();
  };

  var firingFunc = singleClick;

  window.onclick = function() {
    console.log(xCoords(event));
    if(firing) 
      return;

    firing = true;
    timer = setTimeout(function() { 
      firingFunc(); 

      firingFunc = singleClick;
      firing = false;
    }, 300);

  }

  window.ondblclick = function() {
    if (xCoords(event) < 200) {
      firingFunc = doubleClickBkwd;
    }      
    else {
      firingFunc = doubleClickFwd;
    }
  }
}

else {
  window.open(url);
  fs.appendFile('file.txt', 'used for init', function (err) {
    if (err) throw err;
    console.log('Saved!');
  }); 
}
