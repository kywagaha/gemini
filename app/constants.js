const SpotifyWebApi = require("spotify-web-api-node");
const spotifyApi = new SpotifyWebApi();
const settings = require("electron-settings");

module.exports = {
  CLIENT_ID : 'cfa0ee03cb904889af4c77929c6d2ba8',
  PORT : 8080,
  spotifyApi: spotifyApi,
  settings: settings
}