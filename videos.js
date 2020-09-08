const { ipcMain } = require('electron');
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://guest:Bly5TKBM0yE8jn13@videos.z7e7t.mongodb.net/customvideos?retryWrites=true&w=majority" // used for videos easter egg. feel free to use this uri and view it yourself
const client = new MongoClient(uri, { useUnifiedTopology: true });

ipcMain.on('isvideo', (event, arg) => {
    async function run() {
        try {
          console.log('checking...')
          await client.connect();
      
          const database = client.db("customvideos");
          const collection = database.collection("videos");
      
          const query = { songid: arg };
      
          const options = {
            projection: { _id: 0, videourl: 1, css: 1 },
          };
      
          const video = await collection.findOne(query, options);

          if (video == null){
            event.reply('isvideo', 'null')
          } else {
            event.reply('isvideo', video)
          }

        } finally {
        }
      }
      run().catch(console.dir);
  });

ipcMain.on('webdown', (event, arg) => {
  ipcMain.removeAllListeners('isvideo')
  console.log('closed')
  ipcMain.on('isvideo', (event, arg) => {
    setTimeout(() => {
      event.reply('isvideo', 'null')
    }, 1000);
  });
});