const remote = require('electron').remote;
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
                console.log('from control')
                control('play');
                console.log('Playing music');
            }
            else {
                console.log('Nothing playign');
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