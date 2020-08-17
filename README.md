# spotify-now

# Installation
`npm install`
`npm start`

# Setup
First you need to make a Spotify application. Be sure to copy the `Client Id` and `Client Secret` into the respective fields in `spotify.js`.
Then edit the settings for the app, and set the `Redirect Uri` to `http://localhost:8080/callback`.

The first time you run the app, sign into Spotify in the prompt, then close the windows. When you reload the app it will run as expected

# Usage
While a track is playing (or paused!), Spotify Now will update to show the current song and artist. It also has the basic functions of Play/Pause on a single click, and Skip Track by double-clicking.