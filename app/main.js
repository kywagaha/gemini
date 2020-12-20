/**
 * 
 * Main app that signs in, and initializes the electron window
 * 
 */

module.exports = { startApp:startApp, startAuth:startAuth };
const { app, BrowserWindow, ipcMain } = require("electron");
const windowStateKeeper = require('electron-window-state');
const { autoUpdater } = require("electron-updater");
const { spotifyApi } = require("./constants");
var constants = require("./constants"),
settings = constants.settings,
auth = require('./auth');
require("./ipcSupport");
require("./videos");

autoUpdater.checkForUpdatesAndNotify();
/**
 * Create Electron window using electron-window-state.
 * Web Preferences set to contextIsolation for security.
 */
function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 800
  });
  win = new BrowserWindow({
    'x': mainWindowState.x,
    'y': mainWindowState.y,
    'width': mainWindowState.width,
    'height': mainWindowState.height,
    minWidth: 250,
    minHeight: 250,
    title: "Gemini",
    backgroundColor: "#000000",
    webPreferences: {
      enableRemoteModule: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: (__dirname + "/preload.js"),
    },
    frame: false
  });

  win.on("focus", () => { // On window focus
    win.webContents.send("focus", true);
  });

  win.on("blur", () => { // On window unfocus
    win.webContents.send("focus", false);
  });

  win.menuBarVisible = false;
  mainWindowState.manage(win); // Saves window size, location, etc.
  // win.webContents.openDevTools({ mode: 'undocked' })

  if (settings.hasSync('refresh_token')) { // If a refresh token is saved, attempt to use it for next sign on.
    auth.tryRefresh(settings.getSync('refresh_token'));
  } else {
    startAuth();
  };

  if (settings.hasSync('on_top')) { // Save on top state, since window-electron-state doesn't.
    var topState = settings.getSync('on_top');
    win.setAlwaysOnTop(topState);
  } else {
    constants.saveIsTop(false);
  };
};

function startApp() {
  setInterval(refresh, 60*59*1000);
  win.loadFile('src/index.html');
};

function startAuth() {
  win.loadURL(auth.getAuthUrl())
};

function refresh() {
  auth.refresh(spotifyApi.getRefreshToken())
};


ipcMain.on("auth-server", (event, arg) => { // Allows for re-signin
  if (arg == "sign-in") {
    win.loadURL(auth.getAuthUrl());
  }
});

ipcMain.on("set-square", (event, arg) => { // Set window width to window height
  width = (win.getSize())[0];
  height = (win.getSize())[1];
  if (width < height) {
    win.setSize(width, width);
  } else if (height < width) {
    win.setSize(height, height);
  };
});

app.whenReady().then(createWindow);