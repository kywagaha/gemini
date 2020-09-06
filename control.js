const remote = require('electron').remote;
const { ipcRenderer } = require('electron')
var $ = require('jquery');
var changeMs = 200;

function control(type) {
    $.ajax({
        async: true,
        url: 'http://localhost:8080/control',
        data: {
            type: type
        },
        type: 'GET'
    });
};

// Toggle playback
var togglePlay = function(){
    hasToggled = true;
    clearInterval(resetTime);
    var resetTime = setTimeout(() => {
        hasToggled = false;
    }, 1000);
    $.ajax({
        async: true,
        url: 'http://localhost:8080/currently-playing',
        type: 'GET',
        success: function(data) {
            var isPlaying = data.body.is_playing;
            // Play if paused; pause if playing
            if (isPlaying == true){
                console.log('from control')
                $('#toggle').removeClass().addClass('fa fa-play');
                control('pause');
                console.log('Pausing music');
            }
            else if (isPlaying == false){
                $('#toggle').removeClass().addClass('fa fa-pause');
                control('play');
                console.log('Playing music');
            }
            else {
                console.log('Nothing playing');
            };
        }
    });
};

// Skip to next song in queue
var seek = function(){
    console.log('Skipping forward');
    control('forward');
    setTimeout(() => {
        new_update(false);
    }, changeMs);
};
// Skip back to previous song
var track = function(){
    console.log('Skipping backward');
    control('backward');
    setTimeout(() => {
        new_update(false);
    }, changeMs);
};

// A map to remember in
var keysdown = {};

// keydown handler
$(document).keydown(function(e){

  // Do we already know it's down?
  if (keysdown[e.keyCode]) {
      // Ignore it
      return;
  }

  // Remember it's down
  keysdown[e.keyCode] = true;

  // Do our thing
  switch(e.keyCode){
    case 18: //left (a)
      break;
  }
});

// keyup handler
$(document).keyup(function(e){
  // Remove this key from the map
  delete keysdown[e.keyCode];
});

var firing = false;
$("#toggle").click(() => {
    if(firing)
        return;
        togglePlay();
    firing = false;
});

$("#seek").click(() => {
    if(firing)
        return;
    seek();
    firing = false;
});

$("#previous").click(() => {
    if(firing)
        return;
    track();
    firing = false;
});

$("#full").click(() => {
    if(firing)
        return;
    var window = remote.getCurrentWindow();
    if (!window.isFullScreen()) {
        window.setFullScreen(true);
    } else {
        window.setFullScreen(false);
    }
})

$("#x").click(() => {
    if(firing)
        return;
    var window = remote.getCurrentWindow();
    window.close();
})

$("#close").click(() => {
    if(firing)
        return;
    var window = remote.getCurrentWindow();
    window.close();
})

$("#mini").click(() => {
    if(firing)
        return;
    var window = remote.getCurrentWindow();
    window.minimize();
})

$("#maximize").click(() => {
    if(firing)
        return;
    var window = remote.getCurrentWindow();
    if (!window.isFullScreen() && keysdown[18] == true) {
        if (!window.isMaximized()) {
            window.maximize()
        } else {
            window.unmaximize()
        }
        return
    }
    if (!window.isFullScreen()) {
        window.setFullScreen(true);
    } else {
        window.setFullScreen(false);
    }
})


$("#square").click(() => {
    if(firing)
        return;
    var window = remote.getCurrentWindow();
    if (!window.isMaximized()) {
        window.maximize();          
    } else {
        window.unmaximize();
    }
})

$("#minimize").click(() => {
    if(firing)
        return;
    var window = remote.getCurrentWindow();
    window.minimize(); 
})

$("#top").click(() => {
    if(firing)
        return;
    var window = remote.getCurrentWindow();
    if (!window.isAlwaysOnTop()) {
        window.setAlwaysOnTop(true)
        $("#top").css("opacity", "100%");
    } else {
        window.setAlwaysOnTop(false);
        $("#top").css("opacity", "");
    }
})

$("#topmac").click(() => {
    if(firing)
        return;
    var window = remote.getCurrentWindow();
    if (!window.isAlwaysOnTop()) {
        window.setAlwaysOnTop(true)
        $("#topmac").css("opacity", "100%");
    } else {
        window.setAlwaysOnTop(false);
        $("#topmac").css("opacity", "");
    }
})

ipcRenderer.on('focus', (event, arg) => {
    if (arg == 'yes') {
        $("#mac").addClass("focus")
    } else {
        $("#mac").removeClass("focus")
    }
  })