var isOptionsVisible = false;
var myDevices = null;
var originalOptionHeight = parseInt($("#options").css("height"));
var newOptionHeight = originalOptionHeight;

$("#option-button").click(() => {
  if (isOptionsVisible == false) {
    fadeInOptions();
    clearTimeout(hider);
    window.actions.getDevices();
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
    $("#options").css("height", `${newOptionHeight}px`);
  } else {
    $("#devices-wrapper").hide();
    $("#options").css("height", `${originalOptionHeight}px`);
  };
});

$("#opt-signin").click(() => {
  window.reset.signin();
});

$("body").click(() => {
  if ($('#options:hover').length == 0 && $("#option-button:hover").length == 0) {
    if (isOptionsVisible)
      fadeOutOptions();
  };
});

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

ipcRenderer.on("devices-reply", (event, data) => {
  myDevices = data.body.devices;
  $("#devices").empty();
  newOptionHeight = originalOptionHeight;
  for (var d=0; d < myDevices.length; d++) {
    newOptionHeight += 25;
    dev = myDevices[d];
    if (dev.is_active) {
      console.log(`${dev.name} is active`);
    };
    $("#devices").append(`<li><i>${dev.name}</i></li>`);
  };
});

ipcRenderer.on("focus", (event, arg) => {
  if (!arg) {
    fadeOutOptions();
    hideHeader();
  }
});

$("#devices").on("click", "i", function (event) {
  for (var i=0; i< myDevices.length; i++) {
    if (myDevices[i].name == event.target.innerHTML)
      window.actions.transferPlayback(myDevices[i].id);    
  };
});
