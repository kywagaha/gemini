var $ = require('jquery');
const { ipcRenderer, ipcMain } = require('electron');
var changeMs = 200;

function control(type) {
    ipcRenderer.send('control', type);
};

// Toggle playback
var togglePlay = function(){
    hasToggled = true;
    clearInterval(resetTime);
    var resetTime = setTimeout(() => {
        hasToggled = false;
    }, 1000);
    ipcRenderer.send('toggle-play', '');
};

ipcRenderer.on('toggle-play-reply', (event, data) => {
    var isPlaying = data.body.is_playing;
        // Play if paused; pause if playing
        if (isPlaying == true){
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
});

// Skip to next song in queue
var seek = function(){
    console.log('Skipping forward');
    control('forward');
    setTimeout(() => {
        update(false);
    }, changeMs);
};
// Skip back to previous song
var track = function(){
    console.log('Skipping backward');
    control('backward');
    setTimeout(() => {
        update(false);
    }, changeMs);
};

// A map to remember in
var keysdown = {};

// keydown handler
$(document).keydown(function(e){
  if (keysdown[e.keyCode]) {
      return;
  };
  keysdown[e.keyCode] = true;
  switch(e.keyCode){
    case 18:
      break;
  };
});

// keyup handler
$(document).keyup(function(e){
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
    ipcRenderer.send('buttons', 'full');
});

$("#close").click(() => {
    if(firing)
        return;
    ipcRenderer.send('buttons', 'close');
});

$("#mini").click(() => {
    if(firing)
        return;
    ipcRenderer.send('buttons', 'minimize');
});

$("#maximize").click(() => {
    if(firing)
    return;
    if (keysdown[18] == true) {
        ipcRenderer.send('buttons', 'maximize')
        return
    }
    ipcRenderer.send('buttons', 'full');
});

$("#x").click(() => {
    if(firing)
        return;
    ipcRenderer.send('buttons', 'close');
});

$("#square").click(() => {
    if(firing)
        return;
    ipcRenderer.send('buttons', 'maximize');
});

$("#minimize").click(() => {
    if(firing)
        return;
    ipcRenderer.send('buttons', 'minimize');
});

$("#top").click(() => {
    if(firing)
        return;
    ipcRenderer.send('buttons', 'top');
});

$("#topmac").click(() => {
    if(firing)
        return;
    ipcRenderer.send('buttons', 'topmac');
});

ipcRenderer.on('focus', (event, arg) => {
    if (arg == 'yes') {
        $("#mac").addClass("focus");
    } else {
        $("#mac").removeClass("focus");
    };
  });

ipcRenderer.on('not', (event, arg) => {
    switch (arg) {
        case true:
            $("#top").css("opacity", "100%");
            break;
        case false:
            $("#top").css("opacity", "");
            break;
        default:
            break;
    }
});

ipcRenderer.on('mac', (event, arg) => {
    switch (arg) {
        case true:
            $("#topmac").css("opacity", "100%");
            break;
        case false:
            $("#topmac").css("opacity", "");
            break;
        default:
            break;
    }
});