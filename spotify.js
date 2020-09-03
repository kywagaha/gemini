var $ = require('jquery');
var ProgressBar = require('progressbar.js');
const remote = require('electron').remote;
var fadeTime = 500;
var updateMs = 2500;
var changeMs = 200;

//var bar = new ProgressBar.Line('#volbar', {
//    easing: 'easeInOut',
//    color: '#FFFFFF'
//});

function control(type){
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
        }
    });
};

var updateInt;
var mySong;
var myArtist;
var myAlbum;
var isPlaying;
// Fades first text, only called once
function start(){
    $.ajax({
        async: false,
        url: 'http://localhost:8080/currently-playing',
        type: 'GET',
        success: function(data) {
            if (data.statusCode == 200){
                isPlaying = data.body.is_playing;
                if (isPlaying == true) {
                    $('#toggle').removeClass().addClass('fa fa-pause');
                }
                else if (isPlaying == false) {
                    $('#toggle').removeClass().addClass('fa fa-play');
                };
                if (data.body.currently_playing_type == "track") {
                    document.getElementById("song").innerHTML = data.body.item.name;
                    document.getElementById("artist").innerHTML = data.body.item.artists[0].name;
                    if (data.body.item.name == "Lose" && data.body.item.artists[0].name == "NIKI") {
                        document.getElementById("bg").innerHTML = `<video autoplay muted loop><source src="https://kyle.awayan.com/lose.mov" type="video/mp4"></video>`
                    }
                    else {
                        document.getElementById("bg").innerHTML = `<img src="${data.body.item.album.images[0].url}">`;
                    }
                    fadeIn();
                    updateInt = setInterval(function() {
                        update(false);
                    }, updateMs);
                    mySong = data.body.item.name;
                    myArtist = data.body.item.artists[0].name;
                    myAlbum = data.body.item.album.name;

                }
                if (data.body.currently_playing_type == "episode") {
                    document.getElementById("song").innerHTML = "Now playing a podcast";
                    document.getElementById("artist").innerHTML = "Podcast data is not currently supported in Spotify's API";
                    document.getElementById("bg").innerHTML = "";
                    fadeIn();
                    updateInt = setInterval(function() {
                        update(false);
                    }, updateMs);
                }
            }
            else {
                document.getElementById("song").innerHTML = 'No track loaded';
                document.getElementById("artist").innerHTML = 'please play a track';
                document.body.style.backgroundImage = '';
                fadeIn();
                mySong = null;
                updateInt = setInterval(function() {
                    update(false);
                }, updateMs);
            };
        }
    });
};
start();

// Updates front-end only if data is different
function update(CONTROL){
    $.ajax({
        async: true,
        url: 'http://localhost:8080/currently-playing',
        type: 'GET',
        success: function(data) {
            isPlaying = data.body.is_playing;
            if (!CONTROL) {
                if (isPlaying == true) {
                    $('#toggle').removeClass().addClass('fa fa-pause');
                }
                else if (isPlaying == false) {
                    $('#toggle').removeClass().addClass('fa fa-play');
                };
            };
            if (data.statusCode == 200){
                // Only change data if it's different from what's onscreen 
                if (data.body.currently_playing_type == "track") {
                    if (myAlbum != data.body.item.album.name && data.body.item.name != "Lose" && data.body.item.artists[0].name != "NIKI") {
                        fadeOutAlbum();
                        setTimeout(function() {
                            document.getElementById("bg").innerHTML = `<img src="${data.body.item.album.images[0].url}">`;
                            fadeInAlbum();
                        }, fadeTime);
                    };
                    if (mySong != data.body.item.name || myArtist != data.body.item.artists[0].name) {
                        if (data.body.item.name == "Lose" && data.body.item.artists[0].name == "NIKI") {
                            document.getElementById("bg").innerHTML = `<video autoplay muted loop><source src="https://kyle.awayan.com/lose.mov" type="video/mp4"></video>`
                        }
                        if (!CONTROL) {
                            fadeOut();
                            setTimeout(function() {
                                document.getElementById("song").innerHTML = data.body.item.name;
                                document.getElementById("artist").innerHTML = data.body.item.artists[0].name;
                                fadeIn();
                            }, fadeTime);
                        }
                        else if (CONTROL) {
                            setTimeout(function () {
                                document.getElementById("song").innerHTML = data.body.item.name;
                                document.getElementById("artist").innerHTML = data.body.item.artists[0].name;
                                if (mySong != "Lose" && data.body.item.artists[0].name == "NIKI") {
                                   document.getElementById("bg").innerHTML = `<img src="${data.body.item.album.images[0].url}">`;
                                }
                                else {
                                    document.getElementById("bg").innerHTML = `<img src="${data.body.item.album.images[0].url}">`;
                                }
                                fadeIn();  
                                function timerMethod() {
                                    if(runCount > 1) clearInterval(timerId);
                                    update(false);
                                };
                                var timerId = setInterval(timerMethod, 100);
                            }, fadeTime - 200) // For lag
                        };
                        mySong = data.body.item.name;
                        myArtist = data.body.item.artists[0].name;
                        myAlbum = data.body.item.album.name;
                    };
                    var remaining_ms = data.body.item.duration_ms - data.body.progress_ms;
                    // Get precise end of song within the last update
                    if (remaining_ms < updateMs && remaining_ms != 0) {
                        console.log('Predicting track skip in ' + remaining_ms);
                        setTimeout(function() {
                            update(false);
                        }, remaining_ms + 30); // Allow API update
                    };
                }
                else if (data.body.currently_playing_type = "episode") {
                    setTimeout(function() {
                        document.getElementById("song").innerHTML = "Now playing a podcast";
                        document.getElementById("artist").innerHTML = "Podcast data is not currently supported in Spotify's API";
                        document.getElementById("bg").innerHTML = "";
                        fadeIn();
                    });
                };
            }
            else if (data.statusCode == 204) {
                document.getElementById("song").innerHTML = 'No track loaded';
                document.getElementById("artist").innerHTML = 'please play a track';
                $('#toggle').removeClass();
                console.log('No loaded track found');
                mySong = null;
            }
            else if (data.statusCode == 429) {
                document.getElementById("song").innerHTML = 'Rate Limiting Applied';
                document.getElementById("artist").innerHTML = 'please try again later';
                console.log('429 error');
                console.log(data)
                mySong = null;
                clearInterval(updateInt);
            }
            else {
                document.getElementById("song").innerHTML = 'Error';
                document.getElementById("artist").innerHTML = 'check console logs';
                console.log(data);
            };
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

// Get mouse x position
function xCoords(event) {
    var x = event.clientX;
    return x;
};
// Get mouse y position
function yCoords(event) {
    var y = event.clientY;
    return y;
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

var isFullscreen = false;

document.addEventListener('webkitfullscreenchange', function () {
    console.log('full change')
    isFullscreen = !!document.webkitIsFullScreen;
}, false);

function fullScreen(elem) {
    // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (!isFullscreen) {
        if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    };
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
    var elem = document.body;
    fullScreen(elem);
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

// Hide mouse function
$(document).ready(function() {
    var idleMouseTimer;
    var forceMouseHide = false;
    $("body").css('cursor', 'none');
    hideHeader();
    $("body").mousemove(function() {
        if(!forceMouseHide) {
            $("body").css('cursor', '');
            showHeader();
            clearTimeout(idleMouseTimer);
            idleMouseTimer = setTimeout(function() {
                $("body").css('cursor', 'none');
                hideHeader();
                forceMouseHide = true;
                setTimeout(function() {
                    forceMouseHide = false;
                }, 200);
            }, 2500);
        };
    });
});

// Fading functions
function fadeIn() {
    $('#bg').fadeIn(fadeTime);
    setTimeout(function(){
        $('h1').fadeIn(fadeTime);
        $('h2').fadeIn(fadeTime);
    }, 300);
};

function fadeOut() {
    $('h1').fadeOut(fadeTime);
    $('h2').fadeOut(fadeTime);
};

function fadeOutAlbum() {
    $('#bg').fadeOut(fadeTime);
};

function fadeInAlbum() {
    $('#bg').fadeIn(fadeTime);
};

function hideHeader() {
    $("header").fadeOut(fadeTime/2);
    $("footer").fadeOut(fadeTime/2);
    
}
function showHeader() {
    $("header").fadeIn(fadeTime/2);
    $("footer").fadeIn(fadeTime/2);
}
// Ctrl+s function for re-signin
function doc_keyUp(e) {
    if (e.ctrlKey && e.keyCode == 83) {
        window.location.replace('http://localhost:8080/sign-in');
    }
};
document.addEventListener('keyup', doc_keyUp, false);