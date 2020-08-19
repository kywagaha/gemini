const { app, BrowserWindow } = require('electron');
const { shutdown } = require('./server.js');
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
}

app.whenReady().then(createWindow);
