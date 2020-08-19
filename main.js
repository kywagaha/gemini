const { app, BrowserWindow, webContents } = require('electron');
var express = require('express');
var serverPort = 8080;
var express = express();
var server = express.listen(serverPort);

function startserver() {
  console.log('bruh')
  express.listen(serverPort);
}

express.get('/callback', function (req, res) {
  res.send(req.url.split('=')[1])
  shutdown()
})

// HTTP Keep-Alive to a short time to allow graceful shutdown
server.on('connection', function (socket) {
  socket.setTimeout(5 * 1000);
});

// Handle ^C
process.on('SIGINT', shutdown);

// Do graceful shutdown
function shutdown() {
  console.log('graceful shutdown express');
  server.close(function () {
    console.log('closed express');
  });
}

console.log('waiting for spotify token on port ' + serverPort);

const args = {
    width: 800,
    height:848,
    webPreferences: {
      nodeIntegration: true
    }
  };

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow(args)

  // and load the index.html of the app.
  win.loadFile('./index.html');
  win.menuBarVisible = false;

  win.webContents.on('console-message', (event, message, line) => {
    if (line == 'starting server back up') {
      console.log('ok')
      startserver()
    }
  })
}

app.whenReady().then(createWindow);