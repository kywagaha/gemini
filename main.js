const { app, BrowserWindow, webContents } = require('electron');
var server = require('./server');
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
      console.log(typeof server.startserver);
    }
  })
}

app.whenReady().then(createWindow);