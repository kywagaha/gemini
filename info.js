var $ = require('jquery');
var updateInt;
var updateMs = 1000;
var mySong;
var myArtist;
var myAlbum;

// Fades first text, only called once
function start(){
    $.ajax({
        async: true,
        url: 'http://localhost:8080/currently-playing',
        type: 'GET',
        success: function(data) {
            if (data.statusCode == 200){
                document.getElementById('myRange').value = data.body.device.volume_percent;
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
            if (!CONTROL && isControl == false) {
                document.getElementById('myRange').value = data.body.device.volume_percent;
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
                                setTimeout(update, 200);
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