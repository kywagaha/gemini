const { ipcMain } = require("electron");
const fetch = require("node-fetch");

let url =
  "https://raw.githubusercontent.com/Gabe-H/Gemini-Media/master/videos.json";
var myJSON;

let settings = { method: "Get" };
function initJSON() {
  fetch(url, settings)
    .then((res) => res.json())
    .then((json) => {
      myJSON = json["ids"];
    });
}
initJSON();
setInterval(initJSON, 3600000);

ipcMain.on("isvideo", (event, arg) => {
  var isSpecial = false;
  for (i = 0; i < Object.keys(myJSON).length; i++) {
    if (myJSON[i].id == arg) {
      event.reply("isvideo", myJSON[i]);
      isSpecial = true;
    }
  }
  if (isSpecial == false) {
    console.log("Not special");
    event.reply("isvideo", null);
  }
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
