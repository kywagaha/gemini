var fadeTime = 500;
var timer = 99999999; //2500

if (navigator.appVersion.indexOf("Mac") > -1) {
  $(".mac").show();
} else {
  $(".notmac").show();
}

// Hide mouse function
$(document).ready(function () {
  var idleMouseTimer;
  var forceMouseHide = false;
  $("body").css("cursor", "none");
  hideHeader();
  $("body").mousemove(function () {
    if (!forceMouseHide) {
      $("body").css("cursor", "");
      showHeader();
      clearTimeout(idleMouseTimer);
      idleMouseTimer = setTimeout(function () {
        $("body").css("cursor", "none");
        hideHeader();
        forceMouseHide = true;
        setTimeout(function () {
          forceMouseHide = false;
        }, 200);
      }, timer);
    }
  });
});

// Fading functions
function fadeIn() {
  $("h1").fadeIn(fadeTime - 200);
  $("h2").fadeIn(fadeTime - 200);
}

function fadeOut() {
  $("h1").fadeOut(fadeTime);
  $("h2").fadeOut(fadeTime);
}

function fadeOutAlbum() {
  $("#bg").fadeOut(fadeTime);
}

function fadeInAlbum() {
  setTimeout(() => {
    $("#bg").fadeIn(fadeTime);
  }, 150);
}

function toggleProgress() {
  if ($("#progressbar").css('display') == 'none') {
    $("#progressbar").show();
  } else {
    $("#progressbar").hide();
  }
}

function hideHeader() {
  $("header").fadeOut(fadeTime / 2);
  $("footer").fadeOut(fadeTime / 2);
}
function showHeader() {
  $("header").fadeIn(fadeTime / 2);
  if (isPlaying)
    $("footer").fadeIn(fadeTime / 2);
}
// Ctrl+s function for re-signin
function doc_keyUp(e) {
  if (e.ctrlKey && e.keyCode == 83) {
    window.reset.signin();
  } else if (e.ctrlKey && e.keyCode == 65)
      toggleProgress()
    else if (e.ctrlKey && e.keyCode == 68) {
    window.actions.square()
  } else {
    switch (e.keyCode) {
      case 27:
        window.actions.fullscreen();
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
