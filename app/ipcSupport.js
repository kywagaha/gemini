/**
 * 
 * ipcMain handlers that deal with Spotify requests
 * 
 */

const { ipcMain } = require("electron");
var constants = require("./constants");
var spotifyApi = constants.spotifyApi;
var auth = require('./auth');

// Initial pinstate
ipcMain.on('init-pin', (event, arg) => {
});

// Initial /currently-playing request
ipcMain.on("init-playing", (event, arg) => {
  event.reply('is-top', win.isAlwaysOnTop())
  event.reply('is-top-mac', win.isAlwaysOnTop())
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
  );
});

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
});

// Send new volume percent to API
ipcMain.on("set-volume", (event, arg) => {
    setVol(event, arg);
});

// Separate function for volume in preparation
// for api call throttling
function setVol(event, volume) {
  spotifyApi.setVolume(volume)
  .then(function() {}, function (err) {
    if (err.statusCode == 403) {
      console.log('device does not allow volume change')
    } else if (err.statusCode == 429) {
      event.reply("volume-reply", true)
    } else {
      catch_error(err);
    };
  });
};

// Handles controlling requests (play, pause, skip, previous)
ipcMain.on("control", (event, arg) => {
  switch (arg) {
    case "play":
      spotifyApi.play()
      .then(()=>{},(err) => {
        catch_error(err);
      });
      break;
    case "pause":
      spotifyApi.pause()
      .then(()=>{},(err) => {
        catch_error(err);
      });
      break;
    case "forward":
      spotifyApi.skipToNext()
      .then(()=>{},(err) => {
        catch_error(err);
      });
      break;
    case "reset":
      spotifyApi.seek(0)
      .then(()=>{},(err) => {
        catch_error(err);
      });
      break;
    case "previous":
      spotifyApi.seek(0)
      .then(()=>{},(err) => {
        catch_error(err);
      });
      spotifyApi.skipToPrevious()
      .then(()=>{},(err) => {
        catch_error(err);
      });
      break;
    case "shuffle":
      spotifyApi.getMyCurrentPlaybackState()
      .then(function(data) {
        if (data.body.shuffle_state == true) {
          spotifyApi.setShuffle({state: false}).then(function(data) {
          }).catch((err) => {
            console.log(err);
          });
          event.reply("is_shuffle", false);
        };
        if (data.body.shuffle_state == false) {
          spotifyApi.setShuffle({state: true}).then(function(data) {
          }).catch((err) => {
            console.log(err);
          });
          event.reply("is_shuffle", true);
        };
      }, function(error) {
        console.log(error);
      });
  };
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
        win.setFullScreen(true);
        win.setAlwaysOnTop(false);
        event.reply("hidepin", true);
        event.reply("is-top", false);
        event.reply("is-top-mac", false);
      } else {
        win.setFullScreen(false);
        event.reply("hidepin", false);
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

// Get user's active devices 
ipcMain.on("devices", (event, args) => {
  spotifyApi.getMyDevices().then(
    function(data) {
      event.reply("devices-reply", data);
    }, function (err) {
      catch_error(err);
    }
  );
});

// Transfer playback to device id. 
ipcMain.on("transfer", (event, arg) => {
  console.log(`transferring playback to device with id: "${arg}"`)
  spotifyApi.transferMyPlayback({
    deviceIds:[arg],
    play: true
  }).then(function (data) {},
    function (err) {
    catch_error(err);
  });
});

// Exception for errors that (for now) have no significant effect
function catch_error(error) {
  console.error(error);
  switch (error.statusCode) {
    case 400: break;
    case 403: break;
    case 404: break;
    case 429: break;
    case 500: break;
    case 502: break;
    case 503: break;
    default:
      auth.tryRefresh();
      break;
  };
};