const { app, BrowserWindow } = require('electron')
function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height:848,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    resizable: false
  })

  // and load the index.html of the app.
  win.loadFile('index.html')
  const ses = win.webContents.session
  ses.defaultSession.clearStorageData([], (data) => {})
}

app.whenReady().then(createWindow)
