/**
 *
 * Handle all button and key presses. Contains all ipcRenderer functions regarding playback
 *
 */

var changeMs = 200,
  isFullscreen = null,
  firing = false;

function control(type) {
  window.controls.control(type);
}

function togglePlay() {
  hasToggled = true;
  clearInterval(resetTime);
  var resetTime = setTimeout(() => {
    hasToggled = false;
  }, 1000);
  window.controls.togglePlay();
}

function toggleShuffle() {
  hasToggled = true;
  clearInterval(resetTime);
  var resetTime = setTimeout(() => {
    hasToggled = false;
  }, 1000);
  control("shuffle");
  window.controls.toggleShuffle();
}

function cycleRepeat() {
  hasToggled = true;
  clearInterval(resetTime);
  var resetTime = setTimeout(() => {
    hasToggled = false;
  }, 1000);
  window.controls.cycleRepeat(myRepeat);
}

function setVolume(val) {
  hasToggled = true;
  clearInterval(resetTime);
  var resetTime = setTimeout(() => {
    hasToggled = false;
  }, 1000);
  window.controls.setVolume(val);
}

// Skip to next song in queue
function seek() {
  console.log("Skipping forward");
  control("forward");
  setTimeout(() => {
    update(false);
  }, changeMs);
}

// Skip back to previous song
function track() {
  console.log(progress_ms);
  if (progress_ms > 3000) {
    console.log("resetting to 0 sec");
    control("reset");
    progress_ms = 0;
  } else {
    console.log("attemping skip to previous");
    control("previous");
  }
  setTimeout(() => {
    update(false);
  }, changeMs);
}

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

/**
 * All button.click listeners
 */
$("#toggle").click(() => {
  if (firing) return;
  togglePlay();
  firing = false;
});

$("#shuffle").click(() => {
  if (firing) return;
  toggleShuffle();
  firing = false;
});

$("#repeat").click(() => {
  cycleRepeat();
});

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

document.getElementById("volume-knob").addEventListener("input", () => {
  setVolume($("#volume-knob").val());
});

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
});

ipcRenderer.on("repeat-reply", (event, arg) => {
  myRepeat = arg;
  console.log(myRepeat);
  set_repeat(myRepeat);
});

ipcRenderer.on("volume-reply", (event, arg) => {
  console.warn("slow down!");
});

ipcRenderer.on("focus", (event, arg) => {
  if (arg) {
    $("#mac").addClass("focus");
  } else {
    $("#mac").removeClass("focus");
  }
});

ipcRenderer.on("is-top", (event, arg) => {
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

ipcRenderer.on("is-top-mac", (event, arg) => {
  switch (arg) {
    case true:
      $("#topmac").css("opacity", "100%");
      break;
    case false:
      $("#topmac").css("opacity", "");
      break;
  }
});

ipcRenderer.on("hidepin", (event, isFull) => {
  isFullscreen = isFull;
  if (isFull) {
    $("#top").css("display", "none");
    $("#topmac").css("display", "none");
  } else {
    $("#top").css("display", "inline-block", "opacity", "");
    $("#topmac").css("display", "inline-block", "opacity", "");
  }
});

// Shortcuts
function doc_keyUp(e) {
  if (e.ctrlKey && e.keyCode == 83) {
    window.reset.signin();
  } else if (e.ctrlKey && e.keyCode == 65) toggleProgress();
  else if (e.ctrlKey && e.keyCode == 68) {
    window.actions.square();
  } else {
    switch (e.keyCode) {
      case 27:
        if (isFullscreen) window.actions.fullscreen();
        break;
      case 70:
        window.actions.fullscreen();
        break;
      case 74:
        control("backward");
        break;
      case 75:
        togglePlay();
        break;
      case 76:
        control("forward");
        break;
      case 32:
        togglePlay();
        break;
      case 37:
        control("backward");
        break;
      case 39:
        control("forward");
        break;
    }
  }
}

document.addEventListener("keyup", doc_keyUp, false);
