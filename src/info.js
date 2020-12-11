var init = true;
var isSpecial = false;
var nothing_init = true;
var oldProgress = 0;
var isPlaying = true;

const update_ms = 1000;

// Initial setup
ipcRenderer.on("init-playing-reply", (event, data) => {
  switch (data.statusCode) {
    case 200: // Song is playing
      switch (data.body.item.is_local) {
        case false: // Non local music
          switch (data.body.currently_playing_type) {
            case "track": // For track (not podcast)
              var thisName = data.body.item.name;
              if (
                thisName.includes("Remix") ||
                thisName.includes("Mix") ||
                thisName.includes("Version") ||
                thisName.includes("Live") ||
                thisName.includes("Ver.") ||
                thisName.includes("ver.")
              ) {
                document.getElementById("song").innerHTML = data.body.item.name.split(/\[/)[0];
              } else {
                document.getElementById(
                  "song"
                ).innerHTML = data.body.item.name.split(/[\[(-]/)[0];
              }; // Special title cases
              var progress = `${(data.body.progress_ms / data.body.item.duration_ms) * -100 + 100}`;
              $("#progressbar").animate({'right': `${progress}%`}, 400, 'linear');
              // Initialize background var
              myBg = `<img src="${data.body.item.album.images[0].url}">`;
              // Check if song uri has a video (defined in gemini-media repo)
              window.doesSong.haveVideo(data.body.item.uri);

              mySong = data.body.item.id; // Set song placeholder
              var thisArtist = data.body.item.artists; // .artists array in json response
              var showArtist = data.body.item.artists[0].name; // Temporary artist string
              for (i = 1; i < data.body.item.artists.length; i++) { // Append to showArtist if more than 1 artist
                showArtist += ", " + thisArtist[i].name;
              };
              document.getElementById("artist").innerHTML = showArtist; // Artist element to appended artist str
              fadeIn(); // Show text on screen

                // Set album placeholder
              myAlbum = data.body.item.album.id;
                // Trigger functions 
              set_toggle(data.body.is_playing);
              set_shuffle(data.body.shuffle_state);
              set_repeat(data.body.repeat_state);
              set_volume(data.body.device.volume_percent);
                // Start sending 1s updates to main.js
              setInterval(update, update_ms);
              break;
            case "episode": // Case podcast
                // Not enough info from API yet, 
              set_podcast(data);
                // Start sending 1s updates to main.js
              setInterval(update, update_ms);
              break;
          }
          break;
        case true: // Case local track
          mySong = data.body.item.uri;
          var song = data.body.item.name;
          var artist = data.body.item.artists[0].name
          var args = song;
          console.log(mySong); // Log song uri since it's not obtainable from Spotify app. For use with a special case
          window.doesSong.haveVideo(mySong); // Check for special

          var progress = `${(data.body.progress_ms / data.body.item.duration_ms) * -100 + 100}`
          $("#progressbar").animate({'right': `${progress}%`}, 400, 'linear');     
               
          if (artist != '') {
            args = song+' '+artist;
          };
          window.actions.search([	
            args
          ]);
          if (data.body.item.artists[0].name == ''){
            document.getElementById('artist').innerHTML = '';
          } else {
            document.getElementById('artist').innerHTML = data.body.item.artists[0].name;
          }
          document.getElementById('song').innerHTML = data.body.item.name;
          fadeIn();
          setInterval(update, update_ms);
          set_toggle(data.body.is_playing);
          set_shuffle(data.body.shuffle_state);
          set_repeat(data.body.repeat_state);
          set_volume(data.body.device.volume_percent);
          break;
      }
      break;
    case 204:
      set_nothing_playing();
      setInterval(update, update_ms);
      break;
    default:
      document.getElementById("song").innerHTML = "Error";
      document.getElementById("artist").innerHTML = "Check error logs";
      console.log(data);
      break;
  }
});

function update() {
  window.playing.update();
}

ipcRenderer.on("update-playing-reply", (event, data) => {
  switch (data.statusCode) {
    case 200:
      nothing_init = true;
      switch (data.body.item.is_local) {
        case false:
          switch (data.body.currently_playing_type) {
            case "track":
              show_data(data);
              break;
            case "episode":
              set_podcast(data);
              break;
          }
          break;
        case true:
          show_data(data);
          break;
      }
      break;
    case 204:
      set_nothing_playing();
      break;
  }
});

ipcRenderer.on("local-reply", (event, args) => {
  myBg = `<img src="${args}">`;
  window.doesSong.haveVideo(mySong);
  fadeOutAlbum();
  setBackground();
})

var hasToggled = false;
var sameAlbum = false;
var wasSpecial = false;

ipcRenderer.on("isvideo", (event, arg) => {
  if (arg == null) {
    isSpecial = false;
  } else {
    if (init) {
      wasSpecial = true;
      init = false;
    }
    isSpecial = true;
    if (document.getElementById("bg").innerHTML.substring(1, 4) == "img") {
      fadeOutAlbum();
    }
    myBg = `<video autoplay muted loop style="${arg.css}"><source src='${arg.url}'> type="video/mp4"></video>`;
  }
  setBackground();
});

function show_data(data) {
  isPlaying = true;
  var progress = data.body.progress_ms / data.body.item.duration_ms * -100 + 100;
  var difference = data.body.progress_ms - oldProgress;
  if (difference > 1200 || difference < 800) {
    $("#progressbar").animate({'right': `${progress}%`}, 175, 'linear');
  } else {
    $("#progressbar").animate({'right': `${progress}%`}, update_ms, 'linear');
  }
  switch(data.body.item.is_local) {
    case false:
      if (myAlbum != data.body.item.album.id) {
        sameAlbum = false;
      } else {
        sameAlbum = true;
      }
    
      if (mySong != data.body.item.id) {
        fadeOut();
        myBg = `<img src="${data.body.item.album.images[0].url}">`;
        var thisArtist = data.body.item.artists;
        var showArtist = data.body.item.artists[0].name;
        for (i = 1; i < data.body.item.artists.length; i++) {
          showArtist += ", " + thisArtist[i].name;
        }

        if (isSpecial == false && sameAlbum == false) {
          fadeOutAlbum();
          window.doesSong.haveVideo(data.body.item.uri);
        }
        if (isSpecial == false && sameAlbum == true) {
          window.doesSong.haveVideo(data.body.item.uri);
        }
        if (isSpecial == true && sameAlbum == false) {
          fadeOutAlbum();
          window.doesSong.haveVideo(data.body.item.uri);
        }
        if (isSpecial == true && sameAlbum == true) {
          if (!wasSpecial) {
            fadeOutAlbum();
            window.doesSong.haveVideo(data.body.item.uri);
          }
        }
        setTimeout(() => {
          document.getElementById("artist").innerHTML = showArtist;
          if (
            data.body.item.name.includes("Remix") ||
            data.body.item.name.includes("Mix") ||
            data.body.item.name.includes("Version") ||
            data.body.item.name.includes("Live") ||
            data.body.item.name.includes("Ver.") ||
            data.body.item.name.includes("ver.")
          ) {
            document.getElementById("song").innerHTML = data.body.item.name.split(
              /\[/
            )[0];
          } else {
            document.getElementById("song").innerHTML = data.body.item.name.split(
              /[\[(-]/
            )[0];
          }
          fadeIn();
        }, fadeTime);
        wasSpecial = isSpecial;
      }
      mySong = data.body.item.id;
      myArtist = data.body.item.artists[0].id;
      myAlbum = data.body.item.album.id;
      break;
    case true:
      if (mySong != data.body.item.uri) {
        var song = data.body.item.name;
        var artist = data.body.item.artists[0].name;
        var args = song;
        if (artist != '') {
          args = song+' '+artist;
        };
        window.actions.search([	
          args
        ]);
        mySong = data.body.item.uri;
        console.log(mySong);
        fadeOut();
        setTimeout(() => {
          if (data.body.item.artists[0].name == ''){
            document.getElementById('artist').innerHTML = '';
          } else {
            document.getElementById('artist').innerHTML = data.body.item.artists[0].name;
          };
          document.getElementById('song').innerHTML = data.body.item.name;
          fadeIn();
        }, fadeTime)
      }
      break;
  }
  if (!hasToggled) {
    set_toggle(data.body.is_playing);
    set_shuffle(data.body.shuffle_state);
    set_repeat(data.body.repeat_state);
    set_volume(data.body.device.volume_percent);
    myRepeat = data.body.repeat_state;
  }
  oldProgress = data.body.progress_ms
}

function set_toggle(data) {
  if (data) {
    if (!$("#toggle").hasClass("fa fa-pause"))
      $("#toggle").removeClass().addClass("fa fa-pause");
  } else {
    if (!$("#toggle").hasClass("fa fa-play"))
    $("#toggle").removeClass().addClass("fa fa-play");
  }
}

function set_shuffle(data) {
  if (data)
    $("#shuffle").css("opacity", "100%")
  else
    $("#shuffle").css("opacity", "");
}

function set_repeat(data) {
  myRepeat = data;
  switch(data) {
    case 'off':
      $("#repeat").css("opacity", "");
      $("#repeat").html("");
      break;
    case 'context':
      $("#repeat").css("opacity", "100%");
      $("#repeat").html("");
      break;
    case 'track':
      $("#repeat").css("opacity", "100%");
      $("#repeat").html(`<span class="repeat">1</span>`);
      break;
  };
}

function set_volume(data) {
  $("#volume-knob").val(data)
}

function set_podcast(data) {
  setSongArtist("Playing podcast", "No podcast data available yet");
  myBg = "";
  setBackground();
  fadeIn();
  set_toggle(data.body.is_playing);
}

function set_nothing_playing() {
  if (nothing_init) {
    fadeOutAlbum();
    fadeOut();
    setSongArtist('Nothing playing', '');
    $("#progressbar").animate({'right': `100%`}, 175, 'linear');
    $("footer").fadeOut(fadeTime / 2);
    mySong = '';
    myAlbum = '';
    myBg = '';
    myArtist = '';
    isPlaying = false;
    nothing_init = false;
  }
}

function setBackground() {
  setTimeout(() => {
    document.getElementById("bg").innerHTML = myBg;
    fadeInAlbum();
  }, fadeTime);
}

function setSongArtist(song, artist) {
  setTimeout(() => {
    document.getElementById("song").innerHTML = song;
    document.getElementById("artist").innerHTML = artist;
    fadeIn();
  }, fadeTime);
}

window.addEventListener(
  "error",
  function (e) {
    console.log(e);
    if (e.path[1].tagName == "VIDEO") {
      console.log("closed");
      window.turnOff.video();
      location.reload(true);
    }
  },
  true
);

window.playing.init();
