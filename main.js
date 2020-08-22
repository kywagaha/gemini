const { app, BrowserWindow, webContents } = require('electron');
var express = require('express');
var $ = require('jquery');
var serverPort = 8080; //also on lines 14 and 25
var express = express();
var server = express.listen(serverPort);

// Set Spotify app client variables here:
const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const URI = 'http://localhost:' + serverPort + '/callback';
const scopes = ["user-modify-playback-state", "user-read-playback-state", "user-read-recently-played"];
const url = "https://accounts.spotify.com/authorize/?client_id=" + CLIENT_ID + "&response_type=code&redirect_uri=" + URI + "&scope=" + scopes;
var myAuth = null;
let spot;
var isSpot = false;

function startServer() {
  console.log('starting server');
  express.listen(serverPort);
};

express.get('/callback', function (req, res) {
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

express.get('/mycode', function (req, res) {
  if (myAuth != null) {
    res.send({
      authorization: myAuth,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      url: url
    });
  }
  else {
    res.send('Error, please check all info');
  };
});



// HTTP Keep-Alive to a short time to allow graceful shutdown
server.on('connection', function (socket) {
  socket.setTimeout(1000);
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

const args = {
    width: 800,
    height:848,
    webPreferences: {
      nodeIntegration: true
    }
  };

function mainWindow () {
  // Create the browser window.
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

function signIn () {
  // Create the browser window.
  spot = new BrowserWindow(args);
  // and load the index.html of the app.
  spot.loadURL(url);
  spot.menuBarVisible = false;
  isSpot = true;
};

app.whenReady().then(signIn);
