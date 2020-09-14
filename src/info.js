var mySong;
var myArtist;
var myAlbum;
var myBg;
var data;

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
window.playing.init();

    // Initial setup
ipcRenderer.on('init-playing-reply', (event, data) => {
  switch(data.statusCode) {
    case 200:
        switch(data.body.currently_playing_type) {
            case 'track':
                if (data.body.item.name.includes("Remix") || data.body.item.name.includes("Mix") || data.body.item.name.includes("Version") || data.body.item.name.includes("Live") || data.body.item.name.includes("Ver.") || data.body.item.name.includes("ver.")) {
                    document.getElementById('song').innerHTML = data.body.item.name.split(/\[/)[0]
                } else {
                    document.getElementById('song').innerHTML = data.body.item.name.split(/[\[(-]/)[0]
                }
                console.log(1)
                myBg = `<img src="${data.body.item.album.images[0].url}">`;
                window.doesSong.haveVideo(data.body.item.id)
                fadeIn();
                setInterval(update, update_ms);
                mySong = data.body.item.id;
                var thisArtist = data.body.item.artists
                var showArtist = data.body.item.artists[0].name;
                for(i=1;i<data.body.item.artists.length;i++) {
                    showArtist += ', ' + thisArtist[i].name
                }
                document.getElementById('artist').innerHTML = showArtist;
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
        window.doesSong.haveVideo(data.body.item.id)
        document.getElementById('song').innerHTML = data.body.item.name;
        document.getElementById('artist').innerHTML = data.body.item.artists[0].name;
        fadeIn();
        setInterval(update, update_ms);
    break;
};
})

function update() {
    window.playing.update()
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

ipcRenderer.on('isvideo', (event, arg) => {
    console.log('checking...');
    if (arg == null) {
        console.log(null);
        isSpecial = false;
        console.log(myBg);
        console.log('fading in no video!');
    }
    else {
        console.log('video!');
        isSpecial = true;
        if (document.getElementById("bg").innerHTML.substring(1, 4) == 'img') {
            fadeOutAlbum();
        }
        myBg = `<video autoplay muted loop style="${arg.css}"><source src='${arg.url}'> type="video/mp4"></video>`
        console.log(myBg)
    }
    setBackground();
});


function show_data(Spotdata) {
    data = Spotdata
    if (myAlbum != data.body.item.album.id) {
        sameAlbum = false
    } else {
        sameAlbum = true
    };

    if (mySong != data.body.item.id) {
        
        myBg = `<img src="${data.body.item.album.images[0].url}">`;
        var thisArtist = data.body.item.artists
        var showArtist = data.body.item.artists[0].name;
        for(i=1;i<data.body.item.artists.length;i++) {
            showArtist += ', ' + thisArtist[i].name
        }
        // i just learned truth tables in discrete mathematics. although there's no proposition (with my knowledge at least, we just started this topic lol), making the table and copying it to the code really helped me out and simplified things. thanks profressor stefano carpin
        if (isSpecial == false && sameAlbum == false) {
            console.log('1')
            fadeOutAlbum();
            window.doesSong.haveVideo(data.body.item.id)
            console.log('sent')
        }
        if (isSpecial == false && sameAlbum == true) {
            window.doesSong.haveVideo(data.body.item.id)
        }
        if (isSpecial == true && sameAlbum == false) {
            console.log('3')
            fadeOutAlbum();
            window.doesSong.haveVideo(data.body.item.id)
            console.log('sent')
        }
        if (isSpecial == true && sameAlbum == true) {
            if (!wasSpecial) {
                console.log('4')
                fadeOutAlbum();
                window.doesSong.haveVideo(data.body.item.id)
                console.log('sent')
        }}
        fadeOut();
        setTimeout(() => {
            document.getElementById('artist').innerHTML = showArtist;
            if (data.body.item.name.includes("Remix") || data.body.item.name.includes("Mix") || data.body.item.name.includes("Version") || data.body.item.name.includes("Live") || data.body.item.name.includes("Ver.") || data.body.item.name.includes("ver.")) {
                document.getElementById('song').innerHTML = data.body.item.name.split(/\[/)[0]
            } else {
                document.getElementById('song').innerHTML = data.body.item.name.split(/[\[(-]/)[0]
            }
            fadeIn();
        }, fadeTime)
        wasSpecial = isSpecial;
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
    myBg = '';
    setBackground();
    fadeIn();
    set_toggle(data.body.is_playing);
}

function setBackground() {
    setTimeout(() => {
        document.getElementById("bg").innerHTML = myBg;
    }, fadeTime);
    fadeInAlbum();
}

window.addEventListener('error', function(e) {
    console.log(e)
    if (e.path[1].tagName == 'VIDEO') {
        console.log('closed')
        window.turnOff.video()
        location.reload(true);
    }
}, true);