var $ = require('jquery');

var mySong;
var myArtist;
var myAlbum;
var myVolume = 0;
var myBg;

var isSpecial = false;

const update_ms = 1000;
const nothing_playing_json = {
    body: {
        item: {
            name: 'Nothing playing',
            artists: {
                0: {
                    name: ''
    }   }   }   }

};
const podcast_json = {
    body: {
        item: {
            name: 'Playing podcast',
            artist: {
                0: {
                    name: 'No podcast data available yet'
    }   }   }   }
};
    // Initial setup
$.ajax({
    url: 'http://localhost:8080/currently-playing',
    type: 'GET',
    success: function(data) {
        switch(data.statusCode) {
            case 200:
                isPlaying = data.body.is_playing;
                switch(data.body.currently_playing_type) {
                    case 'track':
                        sel_songs(data.body.item.id);
                        document.getElementById('song').innerHTML = data.body.item.name;
                        document.getElementById('artist').innerHTML = data.body.item.artists[0].name;
                        if (isSpecial == false) {
                            myBg = `<img src="${data.body.item.album.images[0].url}">`;
                            sel_songs(data.body.item.id);
                            document.getElementById("bg").innerHTML = myBg;
                        }
                        fadeIn();
                        fadeInAlbum();
                        setInterval(new_update, update_ms);
                        mySong = data.body.item.id;
                        myArtist = data.body.item.artists[0].id;
                        myAlbum = data.body.item.album.id;
                        myVolume = data.body.device.volume_percent;
                        set_volume();
                        set_toggle(data.body.is_playing);
                    break;
                    case 'episode':
                        show_data(podcast_json);
                    break;
                };
            break;
            case 204:
                show_data(no_play);
            break;
        };
    },
    error: function(err) {
        document.getElementById('song').innerHTML = 'Error';
        document.getElementById('artist').innerHTML = 'check console logs';
        console.log(err);
    }
});

function new_update() {
    $.ajax({
        url: 'http://localhost:8080/currently-playing',
        type: 'GET',
        success: function(data) {
            switch(data.statusCode) {
                case 200:
                isPlaying = data.body.is_playing;
                switch(data.body.currently_playing_type) {
                    case 'track':
                        show_data(data);
                    break;
                    case 'episode':
                        show_data(podcast_json);
                    break;
                };
            break;
            case 204:
                show_data(no_play);
            break;
            };
        }
    });
};

function show_data(data) {
    if (mySong != data.body.item.id) {
        isSpecial = false;
        fadeOut();
        setTimeout(() => {
            document.getElementById('song').innerHTML = data.body.item.name;
            fadeIn();
        }, fadeTime)
    }
    if (myArtist != data.body.item.artists[0].id) {
        fadeOut();
        setTimeout(() => {
            document.getElementById('artist').innerHTML = data.body.item.artists[0].name;
            fadeIn();
        }, fadeTime)
    }
    if (myAlbum != data.body.item.album.id) {
        myBg = `<img src="${data.body.item.album.images[0].url}">`;
        sel_songs(data.body.item.id);
        fadeOutAlbum();
        setTimeout(() => {
            document.getElementById("bg").innerHTML = myBg;
            fadeInAlbum();
        }, fadeTime);
    }
    set_volume();
    set_toggle(data.body.is_playing);

    myVolume = data.body.device.volume_percent;
    mySong = data.body.item.id;
    myArtist = data.body.item.artists[0].id;
    myAlbum = data.body.item.album.id;
};

function set_volume() {
    document.getElementById('myRange').value = myVolume;
};

function set_toggle(data) {
    if (data) {
        $('#toggle').removeClass().addClass('fa fa-pause');
    }
    else {
        $('#toggle').removeClass().addClass('fa fa-play');
    }
};

function sel_songs(data) {
    switch(data) {
        case '7rgjkzZBhBjObaYsvq8Ej0':
            myBg = `<video autoplay muted loop><source src="https://kyle.awayan.com/lose.mov" type="video/mp4"></video>`;
        break;
        case 'SONG ID':
            myBg = '';
        break;
    };
};
