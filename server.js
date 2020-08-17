var express = require('express');
var serverPort = 8080;
var app = express();
var server = app.listen(serverPort);

app.get('/callback', function (req, res) {
  res.send(req.url.split('=')[1])
})

// HTTP Keep-Alive to a short time to allow graceful shutdown
server.on('connection', function (socket) {
  socket.setTimeout(5 * 1000);
});

// Handle ^C
process.on('SIGINT', shutdown);

// Do graceful shutdown
function shutdown() {
  console.log('graceful shutdown express');
  server.close(function () {
    console.log('closed express');
  });
}

console.log('waiting for spotify token on port ' + serverPort);