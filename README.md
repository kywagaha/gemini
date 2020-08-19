# spotify-now
Aesthetic now playing screen for Spotify

![screenshot](https://i.imgur.com/Edl9qr6.png)
![screenshot](https://i.imgur.com/F1Idw41.png)
![screenshot](https://i.imgur.com/HnpdBnp.png)

# Installation
Requires Node.js
`npm install`
`npm start`

# Setup
First you need to make a Spotify application. Be sure to copy the `Client Id` and `Client Secret` into the respective fields in `spotify.js`.
Then edit the settings for the app on the Spotify developer dashboard, and set the `Redirect Uri` to `http://localhost:8080/callback`.

The first time you run the app, sign into Spotify in the prompt, then close the windows. When you reload the app it will run as expected.

You can also set how long it takes to refresh the track info. The default is 5s (5000ms), but you can customize that number on line `11` of `spotify.js`. It is highly recommended to keep this value above 1000.

# Usage
While a track is playing (or paused!), Spotify Now will update to show the current song and artist. It also has the basic functions of Play/Pause on a single click, and Skip Track by double-clicking.
