const { contextBridge, ipcRenderer } = require('electron')
require('jQuery')

contextBridge.exposeInMainWorld(
    'ipcRenderer',
    {
      send: (channel, arg) => ipcRenderer.send(channel, arg),
      on: (event, data) => ipcRenderer.on(event, data)
    }
)