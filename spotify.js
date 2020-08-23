var SpotifyWebApi = require('spotify-web-api-js');
var $ = require('jquery');
var electron = require('electron');
var remote = electron.remote;
var spotifyApi = new SpotifyWebApi();
const localUrl = 'http://localhost:8080'
var CLIENT_ID;
var CLIENT_SECRET;
var myCode;

$.ajax({
  async: false,
  url: localUrl + '/enable',
  type: 'get',
  success: function() {
    console.log('next step')
  }
});

$.ajax({
  async: false, 
  url: localUrl + '/mycode', 
  type: 'GET', 
  success: function(data) {
    myCode = data;
    CLIENT_ID = data.client_id,
    CLIENT_SECRET = data.client_secret
  }
});


const update_ms = 5000;
var refresh_ms = 3590000;
var myRefresh;
getToken();
function getToken() {
  return $.ajax({
    async: false,
    url: 'https://accounts.spotify.com/api/token',
    data: {
      'redirect_uri': localUrl + '/callback',
      'client_id': CLIENT_ID,
      'grant_type': 'authorization_code',
      'code': myCode.authorization
    },
    type: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
      },
    success: function(data){
      myRefresh = data.refresh_token;
      spotifyApi.setAccessToken(data.access_token);
      getOnce();
      refresh_ms = (data.expires_in - 10)* 1000;
      console.log('refreshing in ' + (refresh_ms / 1000) + 'seconds');
      setInterval(refreshToken, refresh_ms);
      return data;
    },
    error: function (request, error) {
      console.log(arguments);
      getAuth();

    }
  });
};

function getAuth() {
  $.ajax({
    url: myCode.url,
    type: 'get',
    success: function(){
      win = remote.getCurrentWindow();
      win.close()
      getToken();
    }
  });
};

function refreshToken() {
$.ajax({
  url: 'https://accounts.spotify.com/api/token',
  data: {
    'grant_type': 'refresh_token',
    'refresh_token': myRefresh
  },
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(myCode.client_id + ':' + CLIENT_SECRET)
  },
  type: 'post',
  success: function (data){
    console.log(data.access_token)
    spotifyApi.setAccessToken(data.access_token);
  }
});
};

function getOnce(){
  spotifyApi.getMyCurrentPlayingTrack().then(function(data) {
    if (data != ""){
      document.getElementById("song").innerHTML = data.item.name;
      document.getElementById("artist").innerHTML = data.item.artists[0].name;
      document.body.style.backgroundImage = 'url('+data.item.album.images[0].url+')';
      setInterval(update, update_ms);
      }
  })
}

var firstUpdate = true;
var mySong;
function update(){
  spotifyApi.getMyCurrentPlayingTrack()
  .then(function(data) {
    if (data != ""){
      if (firstUpdate == false) {
        if (mySong != data.item.name) {
          document.getElementById("song").innerHTML = data.item.name;
          document.getElementById("artist").innerHTML = data.item.artists[0].name;
          document.body.style.backgroundImage = 'url('+data.item.album.images[0].url+')';
        };
      }
      else {
        document.getElementById("song").innerHTML = data.item.name;
        document.getElementById("artist").innerHTML = data.item.artists[0].name;
        document.body.style.backgroundImage = 'url('+data.item.album.images[0].url+')';
      };
      
      var remaining_ms = data.item.duration_ms - data.progress_ms;
      if (remaining_ms < update_ms) {
        setTimeout(update, remaining_ms);
        console.log('Predicting track skip in ' + remaining_ms);
      };
      firstUpdate = false;
      mySong = data.item.name;
    }
    else {
      document.getElementById("song").innerHTML = 'No track loaded';
      document.getElementById("artist").innerHTML = 'please play a track';
      document.body.style.backgroundImage = none;
      console.log('No loaded track found');
      mySong = null;
    };
  }, function(err) {
    console.log(err.status);
    if (err.status == 401) {
      document.getElementById("song").innerHTML = "API token out of date";
      document.getElementById("artist").innerHTML = "please close and restart the app";
    };
  }); 

};
function xCoords(event) {
  var x = event.clientX;
  return x;
};

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
    };
  });
};

var doubleClickFwd = function(){
  console.log('Skipping forward');
  spotifyApi.skipToNext();
  setTimeout(update, 400); 
};
var doubleClickBkwd = function(){
  console.log('Skipping backward');
  setTimeout(update, 400); 
  spotifyApi.skipToPrevious();
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

};

window.ondblclick = function() {
  if (xCoords(event) < 200) {
    firingFunc = doubleClickBkwd;
  }      
  else {
    firingFunc = doubleClickFwd;
  };
};

$(document).ready(function() { 
  var idleMouseTimer;
  var forceMouseHide = false;
  $("body").css('cursor', 'none');
  $("body").mousemove(function(ev) {
    if(!forceMouseHide) {
      $("body").css('cursor', '');
      clearTimeout(idleMouseTimer);
      idleMouseTimer = setTimeout(function() {
        $("body").css('cursor', 'none');
        forceMouseHide = true;
        setTimeout(function() {
          forceMouseHide = false;
        }, 200);
      }, 1000);
    };
  });
});