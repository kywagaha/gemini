var $ = require('jquery');
var mySong;
var myArtist;
var myAlbum;
var myBg;

var isSpecial = false;

const update_ms = 1000;
const nothing_playing_json = {
    body: {
        is_playing: false,
        item: {
            name: 'Nothing playing',
            id: null,
            artists: {
                0: {
                    name: '',
                    id: null
                }
            },
            album: {
                id: null,
                images: {
                    0: {
                        url: ''
                    }
                }
            }
        }
    }
};
    // Initial setup
ipcRenderer.on('init-playing-reply', (event, data) => {
  console.log(data) // prints "pong"
  switch(data.statusCode) {
    case 200:
        switch(data.body.currently_playing_type) {
            case 'track':
                document.getElementById('song').innerHTML = data.body.item.name;
                document.getElementById('artist').innerHTML = data.body.item.artists[0].name;
                myBg = `<img src="${data.body.item.album.images[0].url}">`;
                sel_songs(data.body.item.id);
                document.getElementById("bg").innerHTML = myBg;
                fadeIn();
                fadeInAlbum();
                setInterval(update, update_ms);
                mySong = data.body.item.id;
                myArtist = data.body.item.artists[0].id;
                myAlbum = data.body.item.album.id;
                set_toggle(data.body.is_playing);
            break;
            case 'episode':
                set_podcast(data);
                setInterval(update, update_ms);
            break;
        };
    break;
    case 204:
        data = nothing_playing_json;
        sel_songs(data.body.item.id);
        document.getElementById('song').innerHTML = data.body.item.name;
        document.getElementById('artist').innerHTML = data.body.item.artists[0].name;
        fadeIn();
        setInterval(update, update_ms);
    break;
};
})
ipcRenderer.send('init-playing', '');

function update() {
    ipcRenderer.send('update-playing');
};

ipcRenderer.on('update-playing-reply', (event, data) => {
    switch(data.statusCode) {
        case 200:
        switch(data.body.currently_playing_type) {
            case 'track':
                show_data(data);
            break;
            case 'episode':
                set_podcast(data);
            break;
        };
        break;
        case 204:
            show_data(nothing_playing_json);
        break;
    };
});

var hasToggled = false;
var sameAlbum = false;
var wasSpecial = false;
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
        }
        if (isSpecial == true && sameAlbum == true) {
            if (!wasSpecial) {
                fadeOutAlbum();
                setTimeout(() => {
                    document.getElementById("bg").innerHTML = myBg;
                    fadeInAlbum();
                }, fadeTime);
                myBg = `<img src="${data.body.item.album.images[0].url}">`;
                sel_songs(data.body.item.id);
            }
        }
        fadeOut();
        setTimeout(() => {
            document.getElementById('song').innerHTML = data.body.item.name;
            fadeIn();
        }, fadeTime)
        wasSpecial = isSpecial;
    }
    if (myArtist != data.body.item.artists[0].id) {
        fadeOut();
        setTimeout(() => {
            document.getElementById('artist').innerHTML = data.body.item.artists[0].name;
            fadeIn();
        }, fadeTime)
    }
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

function set_podcast(data) {
    document.getElementById('song').innerHTML = 'Playing podcast';
    document.getElementById('artist').innerHTML = 'No podcast data available yet';
    document.getElementById('bg').innerHTML = '';
    fadeIn();
    set_toggle(data.body.is_playing);
}