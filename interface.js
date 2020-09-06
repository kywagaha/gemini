var $ = require('jquery');
var fadeTime = 500;

if (navigator.appVersion.indexOf("Mac") > -1) {
    $('.notmac').hide();
} else {
    $('.mac').hide()
}

// Hide mouse function
$(document).ready(function() {
    var idleMouseTimer;
    var forceMouseHide = false;
    $("body").css('cursor', 'none');
    hideHeader();
    $("body").mousemove(function() {
        if(!forceMouseHide) {
            $("body").css('cursor', '');
            showHeader();
            clearTimeout(idleMouseTimer);
            idleMouseTimer = setTimeout(function() {
                $("body").css('cursor', 'none');
                hideHeader();
                forceMouseHide = true;
                setTimeout(function() {
                    forceMouseHide = false;
                }, 200);
            }, 2500);
        };
    });
});

// Fading functions
function fadeIn() {
    $('#bg').fadeIn(fadeTime);
    setTimeout(function(){
        $('h1').fadeIn(fadeTime);
        $('h2').fadeIn(fadeTime);
    }, 300);
};

function fadeOut() {
    $('h1').fadeOut(fadeTime);
    $('h2').fadeOut(fadeTime);
};

function fadeOutAlbum() {
    $('#bg').fadeOut(fadeTime);
};

function fadeInAlbum() {
    $('#bg').fadeIn(fadeTime);
};

function hideHeader() {
    $("header").fadeOut(fadeTime/2);
    $("footer").fadeOut(fadeTime/2);
}
function showHeader() {
    $("header").fadeIn(fadeTime/2);
    $("footer").fadeIn(fadeTime/2);
}
// Ctrl+s function for re-signin
function doc_keyUp(e) {
    if (e.ctrlKey && e.keyCode == 83) {
        window.location.replace('http://localhost:8080/sign-in');
    }
    else if (e.keyCode == 27) {
    var window = remote.getCurrentWindow();
    window.setFullScreen(false);
    }
};
document.addEventListener('keyup', doc_keyUp, false);