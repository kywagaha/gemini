const { app, BrowserWindow, ipcMain } = require('electron');
var express = require('express');
var express = express();
var SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();
require('./videos')

var CLIENT_ID = process.env.CLIENT_ID;
var CLIENT_SECRET = process.env.CLIENT_SECRET;

var spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: 'http://localhost:8080/callback'
});

var server = express.listen(8080);


var scopes = ['user-modify-playback-state', 'user-read-playback-state'],
  state = '';
var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);  // spotifyApi.createAuthorizeURL(scopes, state, true); for login/auth everytime

var win;
function createWindow () {
  win = new BrowserWindow({
    width: 640,
    height: 640,
    minWidth: 200,
    minHeight: 200,
    title: 'Gemini',
    backgroundColor: '#000000',
    webPreferences: {
        nodeIntegration: true,
        devTools: false,
        enableRemoteModule: false,
    },
    frame: false
  });

  win.on('blur', () => {
    win.webContents.send('focus', 'no');
  });
  
  win.on('focus', () => {
    win.webContents.send('focus', 'yes');
  });
  
  // and load the index.html of the app.
  win.menuBarVisible = false;
  win.loadURL(authorizeURL);
};

ipcMain.on('init-playing', (event, arg) => {
  spotifyApi.getMyCurrentPlaybackState().then(
    function(data) {
      event.reply('init-playing-reply', data);
    },
    function(err) {
      event.reply('init-playing-reply', err);
    }
  )
});

ipcMain.on('update-playing', (event, arg) => {
  spotifyApi.getMyCurrentPlaybackState().then(
    function(data) {
      event.reply('update-playing-reply', data);
    },
    function(err) {
      event.reply('update-playing-reply', err);
    }
  )
});

ipcMain.on('toggle-play', (event, arg) => {
  spotifyApi.getMyCurrentPlaybackState().then(
    function(data) {
      event.reply('toggle-play-reply', data);
    },
    function(err) {
      event.reply('toggle-play-reply', err);
    }
  )
});

ipcMain.on('control', (event, arg) => {
  switch (arg) {
    case 'play': spotifyApi.play()
    .catch((err) => {
      catch_error(err);
    });
      break;
    case 'pause': spotifyApi.pause()
    .catch((err) => {
      catch_error(err);
    });
      break;
    case 'forward': spotifyApi.skipToNext()
    .catch((err) => {
      catch_error(err);
    });
      break;
    case 'backward': spotifyApi.skipToPrevious()
    .catch((err) => {
      catch_error(err);
    });
      break;
  };
});
ipcMain.on('auth-server', (event, arg) => {
  if (arg == 'sign-in') {
    restart_express();
    var fURL = spotifyApi.createAuthorizeURL(scopes, state, true);
      win.loadURL(fURL);
  };
});

ipcMain.on('buttons', (event, arg) => {
  switch (arg) {
    case 'close':
      win.close();
    break;

    case 'maximize':
      if (!win.isMaximized()) {
          win.maximize();          
      } else {
          win.unmaximize();
      };
    break;

    case 'full':
        if (!win.isFullScreen()) {
          win.setFullScreen(true);
          event.reply('pin', false);
          event.reply('pin-mac', false);
      } else {
          win.setFullScreen(false);
          event.reply('pin', true);
          event.reply('pin-mac', true);
      };
    break;

    case 'minimize':
      win.minimize();
    break;

    case 'top':
      if (!win.isAlwaysOnTop()) {
          win.setAlwaysOnTop(true);
          event.reply('not', true);
      } else {
          win.setAlwaysOnTop(false);
          event.reply('not', false);
      };
    break;

    case 'topmac':
      if (!win.isAlwaysOnTop()) {
        win.setAlwaysOnTop(true);
        event.reply('mac', true);
    } else {
        win.setAlwaysOnTop(false);
        event.reply('mac', false);
    };
    break;
    
    default:
      break;
  };

});

function restart_express() {
  if (!server) {
    server.listen(8080);
  };
};

function close_express() {
  if (server) {
    server.close();
    server = null;
  };
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
        setInterval(refresh, (data.body['expires_in'] - 10) * 1000);
        close_express();
      },
      function(err) {
        setTimeout(function() {
          var fURL = spotifyApi.createAuthorizeURL(scopes, state, true);
          win.loadURL(fURL);
        }, 300);
        console.log(err);
      }
    );
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

function catch_error(error) {
  console.log(error);
  if (error.statusCode == 403) {
  };
};

app.whenReady().then(createWindow);