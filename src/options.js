$("#option-button").click(() => {
  if ($("#options").css("display") == 'none') {
    fadeInOptions();
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
  window.actions.getDevices();
})