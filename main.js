const { app, BrowserWindow } = require('electron')
const { shutdown } = require('./server.js')
// Change UI setup here
const ui = 1;
//
var pathToHtml = './index' + ui + '.html';

var args;
if (ui == 1) {
  args = {
    width: 800,
    height:848,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    resizable: false
  };
}
else {
  args = {
    width: 800,
    height:848,
    webPreferences: {
      nodeIntegration: true
    },
    frame: true,
    resizable: true
  };
}

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow(args)

  // and load the index.html of the app.
  win.loadFile(pathToHtml);
}

app.whenReady().then(createWindow);
