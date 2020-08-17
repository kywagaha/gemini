const { app, BrowserWindow } = require('electron')
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

  // and load the index.html of the app.
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)
