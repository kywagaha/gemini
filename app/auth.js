/**
 * 
 * Module exports functions for signing in with Spotify API
 * 
 */

var crypto = require("crypto"),
constants = require("./constants"),
fetch = require('node-fetch'),
express = require("express"),
main = require('./main'),
express = express(),
spotifyApi = constants.spotifyApi;

const scopes = ["user-modify-playback-state", "user-read-playback-state"],
AUTH_URL = 'https://accounts.spotify.com/authorize',
CLIENT_ID = constants.CLIENT_ID,
PORT = constants.PORT,
REDIRECT_URI = `http://localhost:${PORT}/callback`;

console.log('Starting express');
var serverRunning = false;
var server = express.listen(PORT, 'localhost', () => {
	serverRunning = true;
});
var isSigningIn = true;

module.exports = {
  /**
   * Create url for Spotify API oauth2
   * @return {string}
   */ 
  getAuthUrl: function() {
	if (!serverRunning) {
		server.listen(PORT, 'localhost');
	}

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
  
  /**
   * Attempt refresh from the saved refresh token in constants and electron-settings.
   * If error, start normal sign-in authorization method
   * @param {string} code Token returned after signing in with the correct auth-url.
   * @return {}
   * 
   */
	tryRefresh: function(code) {
		if (isSigningIn) {
			isSigningIn = false;
			fetch('https://accounts.spotify.com/api/token', {
				method: 'POST',
				headers: {'Content-Type':'application/x-www-form-urlencoded'},
				body: `grant_type=refresh_token&refresh_token=${code}&client_id=${CLIENT_ID}`
			})
			.then(res => res.json())
			.then(json => {
				if (json.error) {
					console.log('error', json)
					main.startAuth();
				} else {
					isSigningIn = true;
					console.log('Using previous refresh token');
					spotifyApi.setAccessToken(json.access_token);
					spotifyApi.setRefreshToken(json.refresh_token);
					constants.saveRToken(json.refresh_token);
					close_express();
					main.startApp();
				};
			});
		} else {
			console.log('Already a signin request');
    };
    return;
	},

  /**
   * Refreshes access token and refresh token in constants
   * @param {string} token 
   * @return {}
   */
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
				console.log('Refreshed tokens!');
				spotifyApi.setAccessToken(json.access_token);
				spotifyApi.setRefreshToken(json.refresh_token);
				constants.saveRToken(json.refresh_token);
			}
		})
	},

}

/**
 * Handle response from Spotify API authorization
 */
express.get("/callback", function (req, res) {
	var myCode = req.query.code;
	res.send();
	var data = `client_id=${CLIENT_ID}&grant_type=authorization_code&code=${myCode}&redirect_uri=${REDIRECT_URI}&code_verifier=${codeVerifier}`;
	if (req.query.state != codeState) {
		console.log('bad state, trying again');
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
				main.startAuth();
			} else {
				spotifyApi.setAccessToken(json.access_token);
				spotifyApi.setRefreshToken(json.refresh_token);
				constants.saveRToken(json.refresh_token);
				main.startApp();
			};
		});
		
		close_express();
	};
});

function close_express() {
	console.log('Closing express');
    server.close(() => {
		serverRunning = false;
		console.log("Express is now closed. You may now re-sign in if you need to.")
	});
}