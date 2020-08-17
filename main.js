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

app.on ("before-quit", (event) => {
  exec ("mongodb/bin/mongo admin --eval 'db.shutdownServer()'");
  process.exit (); // really let the app exit now
});