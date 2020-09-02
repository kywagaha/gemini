const { app, BrowserWindow } = require('electron');
var express = require('express');
var express = express();
var SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

var CLIENT_ID = process.env.CLIENT_ID;
var CLIENT_SECRET = process.env.CLIENT_SECRET;

var spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: 'http://localhost:8080/callback'
});

express.listen(8080);


var scopes = ['user-modify-playback-state', 'user-read-playback-state'],
  state = '';
var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);  // spotifyApi.createAuthorizeURL(scopes, state, true); for login/auth everytime

var win;
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 728,
    height: 728,
    title: 'Gemini',
    backgroundColor: '#000000',
    webPreferences: {
        nodeIntegration: true,
        devTools: false
    },
    frame: false
  });

  // and load the index.html of the app.
  win.menuBarVisible = false;
  win.loadURL(authorizeURL);
};

// Callback path after Spotify auth
express.get('/callback', function (req, res) {
    var myCode = req.query.code;
    spotifyApi.authorizationCodeGrant(myCode).then(
      function(data) {
        // Set the access token on the API object to use it in later calls
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
        win.loadFile('./index.html');
        res.send();
        setInterval(refresh, (data.body['expires_in'] - 10) * 1000);
      },
      function(err) {
        res.send('Authorization failed, redirecting');
        setTimeout(function() {
          var fURL = spotifyApi.createAuthorizeURL(scopes, state, true);
          win.loadURL(fURL);
        }, 300);
        console.log(err);
      }
    );
});

// Optional sign in after the fact
express.get('/sign-in', function(req, res) {
  var fURL = spotifyApi.createAuthorizeURL(scopes, state, true);
  res.send('redirecting');
  win.loadURL(fURL);
});

// Token refresh function
function refresh() {
  spotifyApi.refreshAccessToken().then(
    function(data) {
      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
    },
    function(err) {
      console.log('Refresh error: ', err);
    }
  );
};
express.get('/currently-playing', function(req, res) {
  spotifyApi.getMyCurrentPlaybackState().then(
    function(data) {
      res.send(data);
    },
    function(err) {
      console.log(err);
    }
  );
});
express.get('/control', function (req, res) {
  switch (req.query.type) {
    case 'play': spotifyApi.play();
      break;
    case 'pause': spotifyApi.pause();
      break;
    case 'forward': spotifyApi.skipToNext();
      break;
    case 'backward': spotifyApi.skipToPrevious();
      break;
  };
  res.send();
});

app.whenReady().then(createWindow);