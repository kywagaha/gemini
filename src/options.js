/**
 * 
 * Specific to option menu on the bottom left
 * 
 */

var isOptionsVisible = false,
myDevices = null,
originalOptionHeight = parseInt($("#options").css("height")),
newOptionHeight = originalOptionHeight;

/**
 * All option menu button handling
 */
$("#option-button").click(() => {
  if (isOptionsVisible == false) {
    fadeInOptions();
    clearTimeout(hider);
    window.controls.getDevices();
  } else {
    fadeOutOptions();
  };
});
  
$("#opt-square").click(() => {
  window.actions.square();
});

$("#opt-prog").click(() => {
  toggleProgress();
});

$("#opt-device").click(() => {
  if ($("#devices-wrapper").css("display") == "none") {
    $("#devices-wrapper").show();
    $("#options").css("height", `${parseInt($("#devices").css('height')) + originalOptionHeight}px`);
  } else {
    $("#devices-wrapper").hide();
    $("#options").css("height", `${originalOptionHeight}px`);
  };
});

$("#opt-signin").click(() => {
  window.actions.signin();
});

$("body").click(() => {
  if ($('#options:hover').length == 0 && $("#option-button:hover").length == 0) {
    if (isOptionsVisible)
      fadeOutOptions();
  };
});

ipcRenderer.on("devices-reply", (event, data) => {
  myDevices = data.body.devices;
  $("#devices").empty();
  for (var d=0; d < myDevices.length; d++) {
    dev = myDevices[d];
    // if (dev.is_active) {
    //   console.log(`${dev.name} is active`);
    // };
    $("#devices").append(`<li><i>${dev.name}</i></li>`);
  };
});

ipcRenderer.on("focus", (event, arg) => {
  if (!arg) {
    fadeOutOptions();
    hideHeader();
  };
});

$("#devices").on("click", "i", function (event) {
  for (var i=0; i< myDevices.length; i++) {
    if (myDevices[i].name == event.target.innerHTML)
      window.controls.transferPlayback(myDevices[i].id);    
  };
});
