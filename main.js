var { app, BrowserWindow, webContents } = require('electron');
var express = require('express');
var $ = require('jquery');
var serverPort = 8080; //also on lines 14 and 25
var express = express();
var server = express.listen(serverPort);

// Set Spotify app client variables here:
// 
const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
//
//

const URI = 'http://localhost:' + serverPort + '/callback'; //port also used in spotify.js
const scopes = ["user-modify-playback-state", "user-read-playback-state"];
const url = "https://accounts.spotify.com/authorize/?client_id=" + CLIENT_ID + "&response_type=code&redirect_uri=" + URI + "&scope=" + scopes;

const args = { //arguments for both windows
  width: 800,
  height:848,
  webPreferences: {
    nodeIntegration: true,
    enableRemoteModule: true,
    devTools: false
  }
};

let spot;
var isSpot = false;
function signIn () {
  // Create the spotify sign in window.
  spot = new BrowserWindow(args);
  spot.loadURL(url);
  spot.menuBarVisible = false;
  isSpot = true;
};

app.whenReady().then(signIn);

function mainWindow () {
  // Create the main ui window.
  let main = new BrowserWindow(args);

  // and load the index.html of the app.
  main.loadFile('./index.html');
  main.menuBarVisible = false;

  main.webContents.on('console-message', (event, message, line) => {
    if (line == 'starting server back up') {
      console.log('server restarting');
      startServer();
    };
    if (line == 'reload window') {
      console.log('reloading');
      main.reload();
    };
  });
};

//query options
var myAuth = null;
express.get('/callback', function (req, res) { //used by redirect after spotify sign in
  if (req.query.error != undefined) {
    res.send(req.query.error, req.query.state);
  }
  else {
  myAuth = req.url.split('=')[1];
  res.send("Success! Please close this window");
  mainWindow();
  if (isSpot == true){
    spot.close();
  };
  isSpot = false;
  };
  
});

var isEnabled = true;
express.get('/enable', function (req, res){ //allows one call of the authorization code from /mycode
  var userAgent = req.get('User-Agent');
  if (userAgent.includes('Electron') == true) { //only electron can /enable
    res.send('Now enabled');
    isEnabled = true;
  }
  else {
    res.send('Invalid browser');
  }
});

express.get('/mycode', function (req, res) { //used to retrieve authorization code. access terminated after use
  if (isEnabled == true) {
    res.send({
      authorization: myAuth,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      url: url
    });
    isEnabled = false; //set so brower can't access client data
  }
  else {
    res.send('Session has expired');
  };
});

// Handle ^C
process.on('SIGINT', shutdown);

// Do graceful shutdown
function shutdown() {
  console.log('gracefully shutting down express');
  server.close(function () {
    console.log('closed express');
  });
};

console.log('waiting for spotify token on port ' + serverPort);