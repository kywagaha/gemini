var isOptionsVisible = false;
var myDevices = null;

$("#option-button").click(() => {
  if (isOptionsVisible == false) {
    fadeInOptions();
    window.actions.getDevices();
  } else {
    fadeOutOptions();
  }
  })
  
$("#opt-square").click(() => {
  window.actions.square();
})

$("#opt-prog").click(() => {
  toggleProgress();
})

$("#opt-device").click(() => {
  $("#devices-wrapper").toggle()
})

$("body").click(() => {
  if ($('#options:hover').length == 0 && $("#option-button:hover").length == 0) {
    if (isOptionsVisible)
      fadeOutOptions();
  }
})

function fadeInOptions() {
  isOptionsVisible = true;
  $("#options").show();
}

function fadeOutOptions() {
  $("#options").addClass("hideAnimation");
  setTimeout(() => {
    $("#options").hide();
    isOptionsVisible = false;
    $("#options").removeClass("hideAnimation");
    $("#devices-wrapper").hide();
  }, 500);
}

ipcRenderer.on("devices-reply", (event, data) => {
  myDevices = data.body.devices;
  $("#devices").empty();
  for (var d=0; d < myDevices.length; d++) {
    dev = myDevices[d]
    if (dev.is_active) {
      console.log(`${dev.name} is active`)
    }
    $("#devices").append(`<li><i>${dev.name}</i></li>`);
  }
})

$("#devices").on("click", "i", function (event) {
  for (var i=0; i< myDevices.length; i++) {
    if (myDevices[i].name == event.target.innerHTML)
      window.actions.transferPlayback(myDevices[i].id);    
  }
})

