var SpotifyWebApi = require('spotify-web-api-js');
var $ = require('jquery');
const { fork } = require('child_process');
const fs = require('fs')
const ps = fork(`./server.js`);
const path = './file.txt'
var spotifyApi = new SpotifyWebApi();

var CLIENT_ID = '69a68365eba84036af391794e50dfd62';
var CLIENT_SECRET = '324db7b9ef51403a849a636f7818e43c';

var URI = 'http://localhost:8080/callback'
var scopes = ["user-modify-playback-state", "user-read-playback-state"];
var url = "https://accounts.spotify.com/authorize/?client_id=" + CLIENT_ID + "&response_type=code&redirect_uri=" + URI + "&scope=" + scopes;

if (fs.existsSync(path)) {
  console.log(url);
  //window.open(url)
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
        console.log(myToken);
    }
    });
    return myToken;
  }();
  spotifyApi.setAccessToken(token);

  spotifyApi.getMyCurrentPlayingTrack()
  .then(function(data) {
    console.log('Now playing', data)
    document.getElementById("song").innerHTML = data.item.name;
    document.getElementById("artist").innerHTML = data.item.artists[0].name;
    document.body.style.backgroundImage = 'url('+data.item.album.images[0].url+')';
    
    setInterval(function update(){

      spotifyApi.getMyCurrentPlayingTrack()
      .then(function(data) {
        console.log('Now playing', data);
        document.getElementById("song").innerHTML = data.item.name;
        document.getElementById("artist").innerHTML = data.item.artists[0].name;
        document.body.style.backgroundImage = 'url('+data.item.album.images[0].url+')';
        
      }, function(error) {
        console.log(error)
      }); 
    
    }, 5000);
  }
  ), (function(err) {
    console.error(err);
  });

  window.onload = function() {
    var timer;
    var el = document.getElementById('testButton');

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

    var doubleClick = function(){ 
      spotifyApi.skipToNext();
    };

    var firingFunc = singleClick;

    window.onclick = function() {
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
      firingFunc = doubleClick;       
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
