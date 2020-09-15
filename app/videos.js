const { ipcMain } = require('electron');
const fetch = require('node-fetch');

let url = "https://raw.githubusercontent.com/Gabe-H/Gemini-Media/master/videos.json";
var myJSON;

let settings = { method: "Get" };
function initJSON() {
  fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        console.log(json["ids"])
        myJSON = json["ids"];
    });
}
initJSON()
setInterval(initJSON, 3600000)


ipcMain.on('isvideo', (event, arg) => {
  var isSpecial = false;
    for(i=0;i<Object.keys(myJSON).length;i++) {
        if(myJSON[i].id == arg) {
            console.log('Is special, video= ' + myJSON[i].url)
            event.reply('isvideo', myJSON[i])
            isSpecial = true;
        }
    }
    if (isSpecial == false) {
      console.log('Not special');
      event.reply('isvideo', null)
    }
});

ipcMain.on('refresh-json', (event, arg) => {
  fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
       myJSON = json;
    });
});