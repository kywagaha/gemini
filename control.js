const remote = require('electron').remote;
var $ = require('jquery');
var changeMs = 200;
var timerId;
var isPlaying;

function control(type) {
    $.ajax({
        async: true,
        url: 'http://localhost:8080/control',
        data: {
            type: type
        },
        type: 'GET',
        success: () => {
            setTimeout(() => {
                new_update(true);
            }, 100);
            setTimeout(() => {
                new_update(true);
            }, 200);
        }
    });
};

// Toggle playback
var singleClick = function(){
    $.ajax({
        async: true,
        url: 'http://localhost:8080/currently-playing',
        type: 'GET',
        success: function(data) {
            isPlaying = data.body.is_playing;
            // Play if paused; pause if playing
            if (isPlaying == true){
                control('pause');
                $('#toggle').removeClass().addClass('fa fa-play');
                console.log('Pausing music');
            }
            else if (isPlaying == false){
                control('play');
                $('#toggle').removeClass().addClass('fa fa-pause');
                console.log('Playing music');
            }
            else {
                console.log('No track loaded');
            };
        }
    });
};

// Skip to next song in queue
var doubleClickFwd = function(){
    console.log('Skipping forward');
    control('forward');
    fadeOut();
    setTimeout(() => {
        new_update(false);
    }, changeMs);
};
// Skip back to previous song
var doubleClickBkwd = function(){
    console.log('Skipping backward');
    control('backward');
    fadeOut();
    setTimeout(() => {
        new_update(false);
    }, changeMs);
};

var firing = false;
$("#toggle").click(() => {
    if(firing)
        return;
        singleClick();
    firing = false;
});

$("#seek").click(() => {
    if(firing)
        return;
    doubleClickFwd();
    firing = false;
});

$("#previous").click(() => {
    if(firing)
        return;
    doubleClickBkwd();
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