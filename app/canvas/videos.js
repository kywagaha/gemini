/**
 *
 * Download and use JSON file for specific songs with an uploaded video
 *
 */

const { ipcMain } = require("electron");
const fetch = require("node-fetch");
const protobuf = require("protobufjs");
const canvasProto = require("./canvasProto.json");

async function getServerURLs() {
  return fetch("https://apresolve.spotify.com/?type=spclient")
    .then((res) => res.json())
    .then((data) => data.spclient);
}

let url =
  "https://raw.githubusercontent.com/Gabe-H/Gemini-Media/master/videos.json";
songLength = 0;
function initJSON() {
  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      console.log("Got json from", url);
      myJSON = json["ids"];
      songLength = Object.keys(myJSON).length || 0;
    })
    .catch((error) => {
      console.log(error);
      console.log("Couldn't get videos JSON! Trying again... \n");

      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          console.log("Got json from", url);
          myJSON = json["ids"];
          songLength = Object.keys(myJSON).length || 0;
        })
        .catch((error) => {
          console.log("Retry failed!");
          console.log(error);
        });
    });
}
initJSON();
setInterval(initJSON, 3600 * 1000);

ipcMain.on("isvideo", async (event, arg) => {
  console.log("Playing song with id: " + arg);
  var isSpecial = false;

  // just some draft code for now...
  // i think loading the proto json every time is
  // probably not the best thing to do

  /**
   * References:
   * https://github.com/itsmeow/Spicetify-Canvas/blob/1f451edaf4cfbdc4f718a97d81d852f1cf16092b/Extensions/getCanvas.js
   * https://github.com/bartleyg/my-spotify-canvas/blob/a8f91dcec08e737c1720e0f955e71f7330e1acb4/api/canvases.js
   *
   * Thank you!!
   */
  var root = protobuf.Root.fromJSON(canvasProto);

  var EntityCanvazRequest = root.lookupType(
    "com.spotify.canvazcache.EntityCanvazRequest"
  );
  var EntityCanvazResponse = root.lookupType(
    "com.spotify.canvazcache.EntityCanvazResponse"
  );

  var protoReq = EntityCanvazRequest.create({
    entities: [{ entityUri: arg }],
  });

  var encodedProtoReq = EntityCanvazRequest.encode(protoReq).finish();

  const serverUrls = await getServerURLs();

  // Get Canvas token from here temporarily
  // https://open.spotify.com/get_access_token?reason=transport&productType=web_player
  const canvasToken = "";

  // TO DO: pick random server url
  const res = await fetch(
    "https://" + serverUrls[0] + "/canvaz-cache/v0/canvases",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${canvasToken}`,
        "Content-Type": "application/x-protobuf",
      },
      body: encodedProtoReq,
    }
  );

  const resBuffer = await res.buffer();

  const decodedRes = EntityCanvazResponse.decode(resBuffer);
  const canvases = decodedRes.canvases;

  // TO DO: Some canvases may be images (JPG)... not mp4
  if (canvases.length == 0) {
    console.log("Not special");
    event.reply("isvideo", null);
  }

  event.reply("isvideo", canvases[0]);
  isSpecial = true;
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
