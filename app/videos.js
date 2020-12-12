/**
 * 
 * Download and use JSON file for specific songs with an uploaded video
 * 
 */

const { ipcMain } = require("electron");
const fetch = require("node-fetch");

let url = "https://raw.githubusercontent.com/Gabe-H/Gemini-Media/master/videos.json";
songLength = 0;
function initJSON() {
  fetch(url)
  .then((res) => res.json())
  .then((json) => {
    console.log('Got json from', url)
    myJSON = json["ids"];
    songLength = Object.keys(myJSON).length || 0;
  })
  .catch((error) => {
    console.log(error);
    console.log('Couldn\'t get videos JSON! Trying again... \n')

    fetch(url)
    .then((res) => res.json())
    .then((json) => {
      console.log('Got json from', url)
      myJSON = json["ids"];
      songLength = Object.keys(myJSON).length || 0;
    })
    .catch((error) => {
      console.log('Retry failed!');
      console.log(error);
    });
  });
};
initJSON();
setInterval(initJSON, 3600* 1000);

ipcMain.on("isvideo", (event, arg) => {
  console.log('Playing song with id:' + arg);
  var isSpecial = false;
  for (i = 0; i < songLength; i++) {
    if (myJSON[i].id == arg) {
      event.reply("isvideo", myJSON[i]);
      isSpecial = true;
    };
  };
  if (isSpecial == false) {
    console.log("Not special");
    event.reply("isvideo", null);
  };
});

ipcMain.on("refresh-json", (event, arg) => {
  fetch(url, settings)
    .then((res) => res.json())
    .then((json) => {
      myJSON = json;
    });
});

ipcMain.on("webdown", (event, arg) => {
  ipcMain.removeAllListeners("isvideo");
  ipcMain.removeAllListeners("refresh-json");
  console.log("website for videos is down");
  ipcMain.on("isvideo", (event, arg) => {
    setTimeout(() => {
      console.log("falling back to album art only");
      event.reply("isvideo", null);
    }, 1000);
  });
});
