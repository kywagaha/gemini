var { app, BrowserWindow } = require('electron');
var passport = require('passport');
var url = require('url');
var SpotifyStrategy = require('passport-spotify').Strategy;
var express = require('express');
express = express();
express.listen(8888);

var CLIENT_ID = 'YOUR_CLIENT_ID';
var CLIENT_SECRET = 'YOUR_CLIENT_SECRET';


var signin;
function createSign () {
  // Create the browser window.
   signin = new BrowserWindow({
    width: 800,
    height: 800,
    icon: './icon.png',
    webPreferences: {
      nodeIntegration: true,
      devTools: false
    }
    
  });

  // and load the index.html of the app.
  signin.loadURL('http://localhost:8888/auth/spotify');
};

var mainWindow 
function createMain() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 800,
        icon: './icon.png',
        webPreferences: {
          nodeIntegration: true,
          devTools: false
        }
      });
  mainWindow.loadFile('./index.html');
};

var access_token;
var refresh_token;
var expires_in_sec;
passport.use(
    new SpotifyStrategy(
      {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: 'http://localhost:8888/auth/spotify/callback'
      },
      function(accessToken, refreshToken, expires_in, profile, done) {
        createMain();
        signin.close();
        // main process
        access_token = accessToken;
        refresh_token = refreshToken;
        expires_in_sec = expires_in;
      }
    )
  );
express.get(
    '/auth/spotify',
    passport.authenticate('spotify', {
        scope: ["user-modify-playback-state", "user-read-playback-state", "user-top-read"]
    }),
    function(req, res) {
        // The request will be redirected to spotify for authentication, so this
        // function will not be called.
    }
);

express.get(
    '/auth/spotify/callback',
    passport.authenticate('spotify', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    }
);
express.get('/login', function(req, res) {
    signin.close();
});

var isEnabled = false;
express.get('/auth/enable', function (req, res){ //allows one call of the authorization code from /mycode
    var userAgent = req.get('User-Agent');
        if (userAgent.includes('Electron') == true) { //only Electron User-Agent can /enable
            res.send('Now enabled');
            isEnabled = true;
        }
        else {
            res.send('Invalid browser');
        };
});

express.get('/auth/tokens', function (req, res) {
    if (isEnabled == true) {
        res.send({
            access_token,
            expires_in_sec
        });
        isEnabled = false;
    }
    else {
        res.send('GET not enabled');
    };
});

express.get('/auth/refresh', function (req, res) {
    const requestUrl = url.parse(url.format({
        protocol: 'https',
        hostname: 'accounts.spotify.com',
        pathname: '/api/token',
        query: {
            grant_type : 'refresh_token',
            refresh_token: refresh_token
        }

    }));
    var encodedClientVars = 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64');
    var request = require('request');
        request.post({
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization' : encodedClientVars
            },
            url: requestUrl
        }, function(error, response, body){
                var body = JSON.parse(body);
                access_token = body.access_token;
                if (isEnabled == true) {
                    res.send({
                        body
                    });
                    isEnabled = false;
                }
                else {
                    res.send('GET not enabled');
                };
        });
        
});
app.whenReady().then(createSign);