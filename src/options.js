var isOptionsVisible = false;

$("#option-button").click(() => {
  if (isOptionsVisible == false) {
    fadeInOptions();
    isOptionsVisible = true;
  } else {
    fadeOutOptions();
    isOptionsVisible = false;
  }
  })
  
$("#opt-square").click(() => {
  window.actions.square();
})

$("#opt-prog").click(() => {
  toggleProgress();
})

$("#opt-device").click(() => {
  window.actions.getDevices();
})

$("body").click(() => {
  //if ($("#option-button:hover").length != )
  if ($('#options:hover').length == 0 && $("#option-button:hover").length == 0) {
    if (isOptionsVisible)
      fadeOutOptions();
  }
})