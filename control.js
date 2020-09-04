const remote = require('electron').remote;
var $ = require('jquery');
var changeMs = 200;
var timerId;
var isPlaying;
var isControl = false;

function control(type) {
    isControl = true;
    $.ajax({
        async: true,
        url: 'http://localhost:8080/control',
        data: {
            type: type
        },
        type: 'GET',
        success: function() {
            update(true);
            setTimeout(function() {
                update(true);
            }, 100);
            setTimeout(function() {
                update(true);
            }, 200);
            setTimeout(function() {
                isControl = false;
            }, 300);
        }
    });
};

function volume_control(value) {
    var  throttleFunction  =  function (func, delay) {
        if (timerId) {
            return;
        }
        timerId  =  setTimeout(function () {
            func();
            timerId  =  undefined;
        }, delay)
    };
    throttleFunction(function() {
        $.ajax({
            url: 'http://localhost:8080/volume',
            type: 'GET',
            data: {
                value: value
            },
            success: function() {
                console.log('volume set to ', value)
            }
        });
    }, 200);
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
    setTimeout(function() {
        update(false);
    }, changeMs);
};
// Skip back to previous song
var doubleClickBkwd = function(){
    console.log('Skipping backward');
    control('backward');
    fadeOut();
    setTimeout(function() {
        update(false);
    }, changeMs);
};

var firing = false;
$("#toggle").click(function() {
    if(firing)
        return;
        singleClick();
    firing = false;
});

$("#seek").click(function () {
    if(firing)
        return;
    doubleClickFwd();
    firing = false;
});

$("#previous").click(function () {
    if(firing)
        return;
    doubleClickBkwd();
    firing = false;
});

$("#full").click(function () {
    if(firing)
        return;
    var window = remote.getCurrentWindow();
    if (!window.isFullScreen()) {
        window.setFullScreen(true);
    } else {
        window.setFullScreen(false);
    }
})

$("#x").click(function () {
    if(firing)
        return;
    var window = remote.getCurrentWindow();
    window.close();
})

$("#square").click(function () {
    if(firing)
        return;
    var window = remote.getCurrentWindow();
    if (!window.isMaximized()) {
        window.maximize();          
    } else {
        window.unmaximize();
    }
})

$("#minimize").click(function () {
    if(firing)
        return;
    var window = remote.getCurrentWindow();
    window.minimize(); 
})

$("#volume").click(function () {
    if(firing)
        return;
    $(".slider").fadeOut(fadeTime/2); 
})

$(document).on('input', '#myRange', function() {
    volume_control($(this).val())
});