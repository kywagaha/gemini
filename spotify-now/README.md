# spotify-now is now depreciated. it is now being maintained as "[Gemini](https://github.com/Gabe-H/Gemini)"
Aesthetic now playing screen for Spotify

![screenshot](https://i.imgur.com/Edl9qr6.png)
![screenshot](https://i.imgur.com/F1Idw41.png)
![screenshot](https://i.imgur.com/HnpdBnp.png)

# Installation
Requires Node.js
`npm install`
`npm start`

# Setup
First you need to make a Spotify application. Be sure to copy the `Client Id` and `Client Secret` into the respective fields in `main.js`.
Then edit the settings for the app on the Spotify developer dashboard, and set the `Redirect Uri` to `http://localhost:8080/callback`.

# Usage
While a track is playing (or paused!), Spotify Now will update to show the current song and artist. It also has the basic functions of Play/Pause on a single click, and Skip Track by double-clicking.
