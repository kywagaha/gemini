const { app, BrowserWindow, ipcMain } = require("electron");
module.exports = { startApp:startApp, startAuth:startAuth };
const windowStateKeeper = require('electron-window-state');
const { autoUpdater } = require("electron-updater");
var constants = require("./constants");
var spotifyApi = constants.spotifyApi;
var settings = constants.settings;
var auth = require('./auth');
require("./videos");

autoUpdater.checkForUpdatesAndNotify();

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
    minWidth: 200,
    minHeight: 200,
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

  win.on("blur", () => {
    win.webContents.send("focus", "no");
  });

  win.on("focus", () => {
    win.webContents.send("focus", "yes");
  });

  win.menuBarVisible = false;
  mainWindowState.manage(win);

  if (settings.hasSync('refresh_token')) {
    auth.tryRefresh(settings.getSync('refresh_token'))
  } else {
    startAuth()
  }

  if (settings.hasSync('on_top')) {
    var topState = settings.getSync('on_top');
    win.setAlwaysOnTop(topState);
  } else {
    constants.saveIsTop(false);
  }
}

function startApp() {
  setInterval(refresh, 60*59*1000);
  win.loadFile('src/index.html');
}
function startAuth() {
  win.loadURL(auth.getAuthUrl())
}
function refresh() {
  auth.refresh(spotifyApi.getRefreshToken())
}
// Initial pinstate
ipcMain.on('init-pin', (event, arg) => {
  event.reply('is-top', win.isAlwaysOnTop())
  event.reply('is-top-mac', win.isAlwaysOnTop())
})

// Initial /currently-playing request
ipcMain.on("init-playing", (event, arg) => {
  spotifyApi.getMyCurrentPlaybackState().then(
    function (data) {
      event.reply("init-playing-reply", data);
    },
    function (err) {
      catch_error(err);
      event.reply("init-playing-reply", err);
    }
  );
});
// Updating /currently-playing request
ipcMain.on("update-playing", (event, arg) => {
  spotifyApi.getMyCurrentPlaybackState().then(
    function (data) {
      event.reply("update-playing-reply", data);
    },
    function (err) {
      catch_error(err);
      event.reply("update-playing-reply", err);
    }
  );
});
// Set play/pause button to correct state
ipcMain.on("toggle-play", (event, arg) => {
  spotifyApi.getMyCurrentPlaybackState().then(
    function (data) {
      event.reply("toggle-play-reply", data);
    },
    function (err) {
      catch_error(err);
      event.reply("toggle-play-reply", err);
    }
  );
});
// Set shuffle true/false based on current state
ipcMain.on("toggle-shuffle", (event, arg) => {
  spotifyApi.getMyCurrentPlaybackState().then(
    function (data) {
      event.reply("toggle-shuffle-reply", data);
    },
    function (err) {
      catch_error(err);
      event.reply("toggle-shuffle-reply", err);
    }
  )
})
// Cycle through repeat options in order (none, context, track)
ipcMain.on("cycle-repeat", (event, arg) => {
      switch (arg) {
        case 'off':
          spotifyApi.setRepeat({state: 'context'})
          .then(()=>{},(err) => {
            catch_error(err)
          })
          event.reply("repeat-reply", 'context')
          break;
        case 'context':
          spotifyApi.setRepeat({state: 'track'})
          .then(()=>{},(err) => {
            catch_error(err)
          })
          event.reply("repeat-reply", 'track')
          break;
        case 'track':
          spotifyApi.setRepeat({state: 'off'})
          .then(()=>{},(err) => {
            catch_error(err)
          })
          event.reply("repeat-reply", 'off')
          break;
      };
})
// Send new volume percent to API
ipcMain.on("set-volume", (event, arg) => {
  spotifyApi.setVolume(arg)
  .then(function() {}, function (err) {
    if (err.statusCode == 403) {
      console.log('device does not allow volume change')
    } else {
      catch_error(err)
    }
  })
})
// Handles controlling requests (play, pause, skip, previous)
ipcMain.on("control", (event, arg) => {
  switch (arg) {
    case "play":
      spotifyApi.play()
      .then(()=>{},(err) => {
        catch_error(err)
      })
      break;
    case "pause":
      spotifyApi.pause()
      .then(()=>{},(err) => {
        catch_error(err)
      })
      break;
    case "forward":
      spotifyApi.skipToNext()
      .then(()=>{},(err) => {
        catch_error(err)
      })
      break;
    case "backward":
      spotifyApi.seek(0)
      .then(()=>{},(err) => {
        catch_error(err)
      })
      spotifyApi.skipToPrevious()
      .then(()=>{},(err) => {
        if (err.statusCode != 403) {
          catch_error(err)
        }
      })
      break;
    case "shuffle":
      spotifyApi.getMyCurrentPlaybackState()
      .then(function(data) {
        if (data.body.shuffle_state == true) {
          spotifyApi.setShuffle({state: false}).then(function(data) {
          })
          event.reply("is_shuffle", false);
        }
        if (data.body.shuffle_state == false) {
          spotifyApi.setShuffle({state: true}).then(function(data) {
          }).catch((err) => {
            console.log(err)
          });
          event.reply("is_shuffle", true);
        }
      }, function(error) {
        console.log(error)
        refresh()
      })
  }
});
// Allows for re-signin
ipcMain.on("auth-server", (event, arg) => {
  if (arg == "sign-in") {
    win.loadURL(auth.getAuthUrl());
  }
});
// Electron window controls (minimize, maximize, close)
ipcMain.on("buttons", (event, arg) => {
  switch (arg) {
    case "close":
      win.close();
      break;

    case "maximize":
      if (!win.isMaximized()) {
        win.maximize();
      } else {
        win.unmaximize();
      }
      break;

    case "full":
      if (!win.isFullScreen()) {
        win.webContents.send("hidepin", "fullscreen");
        win.setFullScreen(true);
        win.setAlwaysOnTop(false);
        event.reply("not", false);
        event.reply("mac", false);
      } else {
        win.webContents.send("hidepin", "notfullscreen");
        win.setFullScreen(false);
      }
      break;

    case "minimize":
      win.minimize();
      break;

    case "top":
      if (!win.isAlwaysOnTop()) {
        win.setAlwaysOnTop(true);
        constants.saveIsTop(true);
        event.reply("is-top", true);
      } else {
        win.setAlwaysOnTop(false);
        constants.saveIsTop(false);
        event.reply("is-top", false);
      }
      break;

    case "topmac":
      if (!win.isAlwaysOnTop()) {
        win.setAlwaysOnTop(true);
        constants.saveIsTop(true);
        event.reply("is-top-mac", true);
      } else {
        win.setAlwaysOnTop(false);
        constants.saveIsTop(false);
        event.reply("is-top-mac", false);
      }
      break;

    default:
      break;
  }
});
// Set window width to window height
ipcMain.on("set-square", (event, arg) => {
  width = (win.getSize())[0];
  height = (win.getSize())[1];
  if (width < height) {
    win.setSize(width, width);
  } else if (height < width) {
    win.setSize(height, height);
  };
});
// Search Spotify for local files
ipcMain.on("search", (event, args) => {	
  console.log('searching for ', args)	
  spotifyApi.search(args, ['track'], {limit : 1}).then(function(data) {	
    if (data.body.tracks.items[0]) {	
      var imgURL = data.body.tracks.items[0].album.images[0].url;	
      console.log(imgURL);	
      event.reply("local-reply", imgURL);	
    } else {	
      console.log('no image');	
      event.reply("local-reply", '')	
    }	
  }, function (err) {	
    catch_error(err)	
  })
});

function catch_error(error) {
  console.error(error);
  if (error.statusCode == 429)
    auth.tryRefresh();
}

app.whenReady().then(createWindow);