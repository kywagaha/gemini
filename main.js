const { app, BrowserWindow } = require('electron')
const { shutdown } = require('./server.js')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height:848,
    webPreferences: {
      nodeIntegration: true
    },
    frame: true,
    resizable: true
  })

  win.on('close', function(e){
    console.log(typeof shutdown.shutdown);
    });

  // and load the index.html of the app.
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)