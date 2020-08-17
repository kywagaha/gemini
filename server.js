const http = require('http');
const url = require('url');
const $ = require('jquery');

var code = null;
http.createServer((req, res) => {
    code = req.url.split('=')[1]
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(code);
    console.log(code);
    

}).listen(8080);

console.log('server running on port 8080');