/**
 * 
 * All visual functions (fadeIn, fadeOut) and idle mouse
 * 
 */

var fadeTime = 500;
var timer = 2500; //2500

if (navigator.appVersion.indexOf("Mac") > -1) {
  $(".mac").show();
} else {
  $(".notmac").show();
};

var hider = setTimeout(function () {
    hideHeader();
    if (isFullscreen)
      $("body").css("cursor", "none");
}, timer);

$("body").mousemove(function() {
  if (!isOptionsVisible) {
    clearTimeout(hider);
    showHeader();
    $("body").css("cursor", "");
    hider = setTimeout(function () {
        hideHeader();
        if (isFullscreen)
          $("body").css("cursor", "none");
    }, timer);
  };
});

// Fading functions for each significant group
function fadeIn() {
  $("h1").fadeIn(fadeTime - 200);
  $("h2").fadeIn(fadeTime - 200);
};

function fadeOut() {
  $("h1").fadeOut(fadeTime);
  $("h2").fadeOut(fadeTime);
};

function fadeOutAlbum() {
  $("#bg").fadeOut(fadeTime);
};

function fadeInAlbum() {
  setTimeout(() => {
    $("#bg").fadeIn(fadeTime);
  }, 150);
};

function fadeOutMedia() {
  $("#media-controls").fadeOut(fadeTime);
};

function fadeInMedia() {
  $("#media-controls").fadeIn(fadeTime);
};

function fadeInOptions() {
  isOptionsVisible = true;
  $("#options").show();
};

function fadeOutOptions() {
  $("#options").css("height", `${originalOptionHeight}px`);
  $("#options").addClass("hideAnimation");
  setTimeout(() => {
    $("#options").hide();
    isOptionsVisible = false;
    $("#options").removeClass("hideAnimation");
    $("#devices-wrapper").hide();
  }, 500);
};

function toggleProgress() {
  if ($("#progressbar").css('display') == 'none') {
    $("#progressbar").show();
  } else {
    $("#progressbar").hide();
  };
};

function hideHeader() {
  $("header").fadeOut(fadeTime / 2);
  $("footer").fadeOut(fadeTime / 2);
  fadeOutOptions();
};

function showHeader() {
  $("header").fadeIn(fadeTime / 2);
  if (isPlaying) {
    $("#media-controls").fadeIn(fadeTime);
    $("footer").fadeIn(fadeTime / 2);
  };
};
