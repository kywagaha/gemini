var crypto = require("crypto");
var constants = require("./constants");
var fetch = require('node-fetch');
var express = require("express");
const main = require('./main');
express = express();
var spotifyApi = constants.spotifyApi;
var settings = constants.settings;

const scopes = ["user-modify-playback-state", "user-read-playback-state"];
const AUTH_URL = 'https://accounts.spotify.com/authorize';
const CLIENT_ID = constants.CLIENT_ID;
const PORT = constants.PORT;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;

console.log('starting express')
var server = express.listen(PORT, 'localhost');

//main.test();
module.exports = {
  getAuthUrl: function() {
		restart_express();
    codeVerifier = base64URLEncode(crypto.randomBytes(32));
    codeState = base64URLEncode(crypto.randomBytes(32));
    codeChallenge = base64URLEncode(sha256(codeVerifier));
  
    const authUrl = AUTH_URL +
    `?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&` +
    `scope=${scopes}&state=${codeState}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  
    function sha256(str) {
      return crypto.createHash('sha256')
      .update(str)
      .digest();
    };
  
    function base64URLEncode(str) {
      return new Buffer.from(str)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    };
    console.log(authUrl)
    return authUrl;
	},
	
	tryRefresh: function(token) {
		fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {'Content-Type':'application/x-www-form-urlencoded'},
			body: `grant_type=refresh_token&refresh_token=${token}&client_id=${CLIENT_ID}`
		})
		.then(res => res.json())
		.then(json => {
			if (json.error) {
				console.log('error', json)
				main.startAuth();
			} else {
				console.log('using previous refresh token')
				spotifyApi.setAccessToken(json.access_token);
				spotifyApi.setRefreshToken(json.refresh_token);
				settings.setSync({
					access_token: json.access_token,
					refresh_token: json.refresh_token
				})
				close_express();
				main.startApp()
			}
		})
	},

	refresh: function(token) {
		fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {'Content-Type':'application/x-www-form-urlencoded'},
			body: `grant_type=refresh_token&refresh_token=${token}&client_id=${CLIENT_ID}`
		})
		.then(res => res.json())
		.then(json => {
			if (json.error) {
				main.startAuth();
				console.log('error', json)
			} else {
				console.log('refreshed tokens!')
				spotifyApi.setAccessToken(json.access_token);
				spotifyApi.setRefreshToken(json.refresh_token);
				settings.setSync({
					access_token: json.access_token,
					refresh_token: json.refresh_token
				})
			}
		})
	},

}

express.get("/callback", function (req, res) {
	var myCode = req.query.code;
	res.send();
	var data = `client_id=${CLIENT_ID}&grant_type=authorization_code&code=${myCode}&redirect_uri=${REDIRECT_URI}&code_verifier=${codeVerifier}`;
	if (req.query.state != codeState) {
		console.log('bad state, trying again')
		main.startAuth();
	} else {
		fetch('https://accounts.spotify.com/api/token/', {
			method: 'POST',
			headers: {'Content-Type':'application/x-www-form-urlencoded'},
			body: data
		})
		.then(res => res.json())
		.then(json => {
			if (json.error) {
				main.startAuth()
			} else {
				spotifyApi.setAccessToken(json.access_token);
				spotifyApi.setRefreshToken(json.refresh_token);
				settings.setSync({
					access_token: json.access_token,
					refresh_token: json.refresh_token
				})
				main.startApp();
			}
		})
		
		close_express();
	}
});

function restart_express() {
	if (!server) {
		console.log('restarting express')
		server.listen(PORT, 'localhost');
	} else {
		server.listen(PORT, 'localhost');
	}
}

function close_express() {
  if (server) {
		console.log('closing server')
    server.close();
  }
}
  
// Token refresh function