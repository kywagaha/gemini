var $ = require('jquery');

var mySong;
var myArtist;
var myAlbum;
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
                switch(data.body.currently_playing_type) {
                    case 'track':
                        sel_songs(data.body.item.id);
                        document.getElementById('song').innerHTML = data.body.item.name;
                        document.getElementById('artist').innerHTML = data.body.item.artists[0].name;
                        myBg = `<img src="${data.body.item.album.images[0].url}">`;
                        sel_songs(data.body.item.id);
                        document.getElementById("bg").innerHTML = myBg;
                        fadeIn();
                        fadeInAlbum();
                        setInterval(new_update, update_ms);
                        mySong = data.body.item.id;
                        myArtist = data.body.item.artists[0].id;
                        myAlbum = data.body.item.album.id;
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
        document.getElementById('artist').innerHTML = 'Please check if your internet is connected. Try pressing CTRL/Command + R to refresh.';
        $('h1').fadeIn(300);
        $('h2').fadeIn(300);
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
        },
        error: function(err) {
            document.getElementById('song').innerHTML = 'Error';
            document.getElementById('artist').innerHTML = 'Please check if your internet is connected. Try pressing CTRL/Command + R to refresh.';
            $('h1').fadeIn(300);
            $('h2').fadeIn(300);
            $('#bg').fadeOut(300);
            console.log(err);
        }
    });
};

var hasToggled = false;
var sameAlbum = false
function show_data(data) {
    if (myAlbum != data.body.item.album.id) {
        sameAlbum = false
    } else {
        sameAlbum = true
    }
    if (mySong != data.body.item.id) {
        sel_songs(data.body.item.id);
        // i just learned truth tables in discrete mathematics. although there's no proposition (with my knowledge at least, we just started this topic lol), making the table and copying it to the code really helped me out and simplified things. thanks profressor stefano carpin
        if (isSpecial == false && sameAlbum == false) {
            fadeOutAlbum();
            setTimeout(() => {
                document.getElementById("bg").innerHTML = myBg;
                fadeInAlbum();
            }, fadeTime);
            myBg = `<img src="${data.body.item.album.images[0].url}">`;
        }
        if (isSpecial == false && sameAlbum == true) {
            if (document.getElementById("bg").innerHTML.substring(1, 4) == 'vid') {
                fadeOutAlbum();
                setTimeout(() => {
                    document.getElementById("bg").innerHTML = myBg;
                    fadeInAlbum();
                }, fadeTime);
                myBg = `<img src="${data.body.item.album.images[0].url}">`;
            }
        }
        if (isSpecial == true && sameAlbum == false) {
            fadeOutAlbum();
            setTimeout(() => {
                document.getElementById("bg").innerHTML = myBg;
                fadeInAlbum();
            }, fadeTime);
            myBg = `<img src="${data.body.item.album.images[0].url}">`;
            sel_songs(data.body.item.id);
            isSpecial = false;
        }
        if (isSpecial == true && sameAlbum == true) {
            fadeOutAlbum();
            setTimeout(() => {
                document.getElementById("bg").innerHTML = myBg;
                fadeInAlbum();
            }, fadeTime);
            myBg = `<img src="${data.body.item.album.images[0].url}">`;
            sel_songs(data.body.item.id);
            isSpecial = false;
        }
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
    console.log(hasToggled)
    if (!hasToggled) {
        set_toggle(data.body.is_playing);
    };

    mySong = data.body.item.id;
    myArtist = data.body.item.artists[0].id;
    myAlbum = data.body.item.album.id;
};

function set_toggle(data) {
    if (data) {
        $('#toggle').removeClass().addClass('fa fa-pause');
    }
    else {
        $('#toggle').removeClass().addClass('fa fa-play');
    }
};