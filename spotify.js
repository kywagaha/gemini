var $ = require('jquery');
var fadeTime = 500;
var updateMs = 2000;

function control(type){
    $.ajax({
        async: true,
        url: 'http://localhost:8080/control',
        data: {
            type: type
        },
        type: 'GET'
    });
};

var mySong;
var myArtist;
var myAlbum;
// Fades first text, only called once
function start(){
    $.ajax({
        async: false,
        url: 'http://localhost:8080/currently-playing',
        type: 'GET',
        success: function(data) {
            console.log(data);
            if (data.statusCode == 200){
                document.getElementById("song").innerHTML = data.body.item.name;
                document.getElementById("artist").innerHTML = data.body.item.artists[0].name;
                document.getElementById("bg").innerHTML = `<img src="${data.body.item.album.images[0].url}">`;
                fadeIn();
                setInterval(update, updateMs);
            }
            else {
                document.getElementById("song").innerHTML = 'No track loaded';
                document.getElementById("artist").innerHTML = 'please play a track';
                document.body.style.backgroundImage = '';
                mySong = null;
                setInterval(update, updateMs);
            };
            mySong = data.body.item.name;
            myArtist = data.body.item.artists[0].name;
            myAlbum = data.body.item.album.name;
        }
    });
};
start();

// Updates front-end only if data is different
function update(){
    $.ajax({
        async: true,
        url: 'http://localhost:8080/currently-playing',
        type: 'GET',
        success: function(data) {
            if (data.statusCode == 200){
                var remaining_ms = data.body.item.duration_ms - data.body.progress_ms;
                // Get precise end of song within the last update
                if (remaining_ms < updateMs && remaining_ms != 0) {
                    console.log('Predicting track skip in ' + remaining_ms);
                    setTimeout(update, remaining_ms);
                };
                // Only change data if it's different from what's onscreen
                if (mySong != data.body.item.name || myArtist != data.body.item.artists[0].name) {
                    fadeOut();
                    setTimeout(function() {
                        document.getElementById("song").innerHTML = data.body.item.name;
                        document.getElementById("artist").innerHTML = data.body.item.artists[0].name;
                        document.getElementById("bg").innerHTML = `<img src="${data.body.item.album.images[0].url}">`;
                        fadeIn();
                    }, fadeTime);
                };
                if (myAlbum != data.body.item.album.name) {
                    fadeOutAlbum();
                    setTimeout(function() {
                        document.getElementById("bg").innerHTML = `<img src="${data.body.item.album.images[0].url}">`;
                        fadeInAlbum()
                    }, fadeTime);
                };
                mySong = data.body.item.name;
                myArtist = data.body.item.artists[0].name;
                myAlbum = data.body.item.album.name;
            }
            else if (data.statusCode == 204) {
                document.getElementById("song").innerHTML = 'No track loaded';
                document.getElementById("artist").innerHTML = 'please play a track';
                console.log('No loaded track found');
                mySong = null;
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
            console.log(data.body);
            var isPlaying = data.body.is_playing;
            // Play if paused; pause if playing
            if (isPlaying == true){
                control('pause');
                console.log('Pausing music');
            }
            else if (isPlaying == false){
                control('play');
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
    setTimeout(update, 300);
};
// Skip back to previous song
var doubleClickBkwd = function(){
    console.log('Skipping backward');
    control('backward');
    fadeOut();
    setTimeout(update, 300);
};
var fullScreen = function() {
    var elem = document.documentElement;

    // Function to open fullscreen mode
    function openFullscreen() {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    };
    
    // Function to close fullscreen mode
    function closeFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      };
    };
    openFullscreen();
    closeFullscreen();
}
// Single click function
var firing = false;
var firingFunc = singleClick;
window.onclick = function() {
    if(firing)
        return;
    firing = true;
    timer = setTimeout(function() { 
        firingFunc(); 
        firingFunc = singleClick;
        firing = false;
  }, 300);

};

// Double click function. Will go to previous track if mouse is on left 200 pixels of screen.
window.ondblclick = function() {
    if (yCoords(event) < 100) {
        firingFunc = fullScreen;
    }
    else {
        if (xCoords(event) < 200) {
            firingFunc = doubleClickBkwd;
        }
         else {
            firingFunc = doubleClickFwd;
        };
    };
};

// Hide mouse function
$(document).ready(function() {
    var idleMouseTimer;
    var forceMouseHide = false;
    $("body").css('cursor', 'none');
    $("body").mousemove(function(ev) {
        if(!forceMouseHide) {
            $("body").css('cursor', '');
            clearTimeout(idleMouseTimer);
            idleMouseTimer = setTimeout(function() {
                $("body").css('cursor', 'none');
                forceMouseHide = true;
                setTimeout(function() {
                    forceMouseHide = false;
                }, 200);
            }, 1000);
        };
    });
});

// Fading functions
function fadeIn(){
    $('#bg').fadeIn(fadeTime);
    setTimeout(function(){
        $('h1').fadeIn(fadeTime);
        $('h2').fadeIn(fadeTime);
    }, 300);
};

function fadeOut(){
    $('h1').fadeOut(fadeTime);
    $('h2').fadeOut(fadeTime);
};

function fadeOutAlbum(){
    $('#bg').fadeOut(fadeTime);
}
