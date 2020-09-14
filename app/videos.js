const { ipcMain } = require('electron');
const fetch = require('node-fetch');

let url = "https://raw.githubusercontent.com/Gabe-H/Gemini-Media/master/videos.json";
var myJSON;

let settings = { method: "Get" };

fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
       myJSON = json;
       console.log(myJSON)
    });


ipcMain.on('isvideo', (event, arg) => {
  var isSpecial = false;
    for(i=0;i<Object.keys(myJSON).length;i++) {
        if(myJSON[i].id == arg) {
            console.log(myJSON[i])
            event.reply('isvideo', myJSON[i])
            isSpecial = true;
        }
    }
    if (isSpecial == false) {
      console.log(null);
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