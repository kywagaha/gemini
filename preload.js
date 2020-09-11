const { contextBridge, ipcRenderer } = require('electron')
require('jquery')

contextBridge.exposeInMainWorld(
    'ipcRenderer',
    {
      send: (channel, arg) => ipcRenderer.send(channel, arg),
      on: (event, data) => ipcRenderer.on(event, data)
    }
)
  
contextBridge.exposeInMainWorld(
    '$',
    {
      keydown: (document) => jQuery.keydown()
    }
)