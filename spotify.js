var SpotifyWebApi = require('spotify-web-api-js');
var $ = require('jquery');
var spotifyApi = new SpotifyWebApi();

function enable() {
    $.ajax({
        async: false,
        url: 'http://localhost:8888/auth/enable',
        type: 'GET'
    });
};
enable();
$.ajax({
    async: false,
    url: 'http://localhost:8888/auth/tokens',
    type: 'GET',
    success: function(data) {
        spotifyApi.setAccessToken(data.access_token);
        getOnce();
        setInterval(refresh, ((data.expires_in_sec - 10) * 1000))
    }
});

function refresh() {
    enable();
    $.ajax({
        async: true,
        url: 'http://localhost:8888/auth/refresh',
        type: 'GET',
        success: function(data) {
            spotifyApi.setAccessToken(data.body.access_token);
        }
    });
};

function getOnce(){
    spotifyApi.getMyCurrentPlayingTrack().then(function(data) {
        if (data != ""){
            document.getElementById("song").innerHTML = data.item.name;
            document.getElementById("artist").innerHTML = data.item.artists[0].name;
            document.body.style.backgroundImage = 'url('+data.item.album.images[0].url+')';
            setInterval(update, 5000);
        }
        else {
            document.getElementById("song").innerHTML = 'No track loaded';
            document.getElementById("artist").innerHTML = 'please play a track';
            document.body.style.backgroundImage = '';
            mySong = null;
            setInterval(update, 5000);
        };
    });
};

var mySong;
function update(){
    spotifyApi.getMyCurrentPlayingTrack().then(function(data) {
        if (data != ""){
            if (mySong != data.item.name) {
                document.getElementById("song").innerHTML = data.item.name;
                document.getElementById("artist").innerHTML = data.item.artists[0].name;
                document.body.style.backgroundImage = 'url('+data.item.album.images[0].url+')';
            };
            var remaining_ms = data.item.duration_ms - data.progress_ms;
            if (remaining_ms < 5000) {
                setTimeout(update, remaining_ms);
                console.log('Predicting track skip in ' + remaining_ms);
            };
            mySong = data.item.name;
        }
        else {
        
            document.getElementById("song").innerHTML = 'No track loaded';
            document.getElementById("artist").innerHTML = 'please play a track';
            console.log('No loaded track found');
            mySong = null;
        };
        },function(err) {
            console.log(err.status);
            // Handle bad API
            if (err.status == 401) {
                document.getElementById("song").innerHTML = "API token out of date";
                document.getElementById("artist").innerHTML = "please close and restart the app";
            };
        }); 

};

// Get mouse x position
function xCoords(event) { 
    var x = event.clientX;
    return x;
};


// Toggle playback
var singleClick = function(){
    spotifyApi.getMyCurrentPlayingTrack().then(function(data) {
        var isPlaying = data.is_playing;
        if (isPlaying == true){
            spotifyApi.pause();
            console.log('Pausing music');
        }
        else if (isPlaying == false){
            spotifyApi.play();
            console.log('Playing music');
        }
        else {
            console.log('No track loaded');
        };
    });
};

// skip to next song in queue
var doubleClickFwd = function(){
    console.log('Skipping forward');
    spotifyApi.skipToNext();
    setTimeout(update, 400);
};
// skip back to previous song
var doubleClickBkwd = function(){
    console.log('Skipping backward');
    setTimeout(update, 400); 
    spotifyApi.skipToPrevious();
};

var firing = false;
var firingFunc = singleClick;

// Single click function
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