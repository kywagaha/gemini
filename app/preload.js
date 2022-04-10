/**
 *
 * Loads all ipcRenderer functions to the renderer window
 *
 */

const { contextBridge, ipcRenderer } = require("electron");

// Allow ipcRenderer.on(); no vulnerabilities
contextBridge.exposeInMainWorld("ipcRenderer", {
  on: (event, data) => ipcRenderer.on(event, data),
});

/**
 * Handle ipcRenderer.send() manually, as allowing
 * it is a significant vulnerability
 */
contextBridge.exposeInMainWorld("actions", {
  // Electron API and device handling
  fullscreen: () => ipcRenderer.send("buttons", "full"),
  close: () => ipcRenderer.send("buttons", "close"),
  minimize: () => ipcRenderer.send("buttons", "minimize"),
  maximize: () => ipcRenderer.send("buttons", "maximize"),
  top: () => ipcRenderer.send("buttons", "top"),
  topmac: () => ipcRenderer.send("buttons", "topmac"),
  signin: () => ipcRenderer.send("auth-server", "sign-in"),

  square: () => ipcRenderer.send("set-square", null),
});

contextBridge.exposeInMainWorld("controls", {
  // Spotify Api handling
  togglePlay: () => ipcRenderer.send("toggle-play", null),
  toggleShuffle: () => ipcRenderer.send("toggle-shuffle", null),
  cycleRepeat: (status) => ipcRenderer.send("cycle-repeat", status),

  setVolume: (val) => ipcRenderer.send("set-volume", val),
  search: (args) => ipcRenderer.send("search", args),
  getDevices: () => ipcRenderer.send("devices", null),
  control: (type) => ipcRenderer.send("control", type),
  transferPlayback: (id) => ipcRenderer.send("transfer", id),
});

contextBridge.exposeInMainWorld("playing", {
  init: () => ipcRenderer.send("init-playing", null),
  update: () => ipcRenderer.send("update-playing"),
});

contextBridge.exposeInMainWorld("doesSong", {
  haveVideo: (arg) => ipcRenderer.send("isvideo", arg),
});

contextBridge.exposeInMainWorld("turnOff", {
  video: () => ipcRenderer.send("webdown", null),
});
