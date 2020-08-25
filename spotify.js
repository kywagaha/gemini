var $ = require('jquery');

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

function start(){
    $.ajax({
        async: false,
        url: 'http://localhost:8080/currently-playing',
        type: 'GET',
        success: function(data) {
            if (data.statusCode == 200){
                document.getElementById("song").innerHTML = data.body.item.name;
                document.getElementById("artist").innerHTML = data.body.item.artists[0].name;
                document.body.style.backgroundImage = 'url('+data.body.item.album.images[0].url+')';
                setInterval(update, 2500);
            }
            else {
                document.getElementById("song").innerHTML = 'No track loaded';
                document.getElementById("artist").innerHTML = 'please play a track';
                document.body.style.backgroundImage = '';
                mySong = null;
                setInterval(update, 2500);
            };
        }
    });
};
start();

var mySong;
function update(){
    $.ajax({
        async: true,
        url: 'http://localhost:8080/currently-playing',
        type: 'GET',
        success: function(data) {
            if (data.statusCode == 200){
                if (mySong != data.body.item.name) {
                    document.getElementById("song").innerHTML = data.body.item.name;
                    document.getElementById("artist").innerHTML = data.body.item.artists[0].name;
                    document.body.style.backgroundImage = 'url('+data.body.item.album.images[0].url+')';
                };
                var remaining_ms = data.body.item.duration_ms - data.body.progress_ms;
                if (remaining_ms < 5000) {
                    setTimeout(update, remaining_ms);
                    console.log('Predicting track skip in ' + remaining_ms);
                };
                mySong = data.body.item.name;
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
// skip to next song in queue
var doubleClickFwd = function(){
    console.log('Skipping forward');
    control('forward');
    setTimeout(update, 400);
};
// skip back to previous song
var doubleClickBkwd = function(){
    console.log('Skipping backward');
    setTimeout(update, 400); 
    control('backward');
};
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
    if (xCoords(event) < 200) {
        firingFunc = doubleClickBkwd;
    }      
     else {
        firingFunc = doubleClickFwd;
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