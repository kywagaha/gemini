var changeMs = 200;

function control(type) {
  window.check.type(type);
}

// Toggle playback
var togglePlay = function () {
  hasToggled = true;
  clearInterval(resetTime);
  var resetTime = setTimeout(() => {
    hasToggled = false;
  }, 1000);
  window.controls.togglePlay();
};
var toggleShuffle = function () {
  hasToggled = true;
  clearInterval(resetTime);
  var resetTime = setTimeout(() => {
    hasToggled = false;
  }, 1000);
  control('shuffle')
  window.controls.toggleShuffle();
};

ipcRenderer.on("toggle-play-reply", (event, data) => {
  var isPlaying = data.body.is_playing;
  // Play if paused; pause if playing
  if (isPlaying == true) {
    $("#toggle").removeClass().addClass("fa fa-play");
    control("pause");
    console.log("Pausing music");
  } else if (isPlaying == false) {
    $("#toggle").removeClass().addClass("fa fa-pause");
    control("play");
    console.log("Playing music");
  } else {
    console.log("Nothing playing");
  }
});

ipcRenderer.on("toggle-shuffle-reply", (event, data) => {
  var isShuffle = data.body.shuffle_state;
  if (isShuffle == true) {
    $("#shuffle").removeClass().addClass("fa fa-random");
  }
})

// Skip to next song in queue
var seek = function () {
  console.log("Skipping forward");
  control("forward");
  setTimeout(() => {
    update(false);
  }, changeMs);
};
// Skip back to previous song
var track = function () {
  console.log("Skipping backward");
  control("backward");
  setTimeout(() => {
    update(false);
  }, changeMs);
};

// A map to remember in
var keysdown = {};

// keydown handler
$(document).keydown(function (e) {
  if (keysdown[e.keyCode]) {
    return;
  }
  keysdown[e.keyCode] = true;
  switch (e.keyCode) {
    case 18:
      break;
  }
});

// keyup handler
$(document).keyup(function (e) {
  delete keysdown[e.keyCode];
});

var firing = false;
$("#toggle").click(() => {
  if (firing) return;
  togglePlay();
  firing = false;
});

$("#shuffle").click(() => {
  if (firing) return;
  toggleShuffle();
  firing = false;
})

$("#seek").click(() => {
  if (firing) return;
  seek();
  firing = false;
});

$("#previous").click(() => {
  if (firing) return;
  track();
  firing = false;
});

$("#full").click(() => {
  if (firing) return;
  window.actions.fullscreen();
});

$("#close").click(() => {
  if (firing) return;
  window.actions.close();
});

$("#mini").click(() => {
  if (firing) return;
  window.actions.minimize();
});

$("#maximize").click(() => {
  if (firing) return;
  if (keysdown[18] == true) {
    window.actions.maximize();
    return;
  }
  window.actions.fullscreen();
});

$("#x").click(() => {
  if (firing) return;
  window.actions.close();
});

$("#square").click(() => {
  if (firing) return;
  window.actions.maximize();
});

$("#minimize").click(() => {
  if (firing) return;
  window.actions.minimize();
});

$("#top").click(() => {
  if (firing) return;
  window.actions.top();
});

$("#topmac").click(() => {
  if (firing) return;
  window.actions.topmac();
});

ipcRenderer.on("focus", (event, arg) => {
  if (arg == "yes") {
    $("#mac").addClass("focus");
  } else {
    $("#mac").removeClass("focus");
  }
});

ipcRenderer.on("not", (event, arg) => {
  switch (arg) {
    case true:
      $("#top").css("opacity", "100%");
      break;
    case false:
      $("#top").css("opacity", "");
      break;
  }
});

ipcRenderer.on("is_shuffle", (event, arg) => {
  switch (arg) {
    case true:
      $("#shuffle").css("opacity", "100%");
      break;
    case false:
      $("#shuffle").css("opacity", "");
      break;
  }
});

ipcRenderer.on("mac", (event, arg) => {
  switch (arg) {
    case true:
      $("#topmac").css("opacity", "100%");
      break;
    case false:
      $("#topmac").css("opacity", "");
      break;
  }
});
