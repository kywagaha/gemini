var fadeTime = 500;
var timer = 2500; //2500

if (navigator.appVersion.indexOf("Mac") > -1) {
  $(".mac").show();
} else {
  $(".notmac").show();
}

// Hide mouse function
/*
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
*/

var hider = null;
$("body").mousemove(function() {
  if (!isOptionsVisible) {
    clearTimeout(hider);
    showHeader();
    hider = setTimeout(function () {
        hideHeader();
    }, timer);
  }
})

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

function fadeOutMedia() {
  $("#media-controls").fadeOut(fadeTime);
}

function fadeInMedia() {
  $("#media-controls").fadeIn(fadeTime);

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
  fadeOutOptions();
}
function showHeader() {
  $("header").fadeIn(fadeTime / 2);
  if (isPlaying)
    $("#media-controls").fadeIn(fadeTime);
    $("footer").fadeIn(fadeTime / 2);
}
