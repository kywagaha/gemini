# Gemini
Aesthetic now playing screen for Spotify

![screenshot](https://i.imgur.com/Edl9qr6.png)
![screenshot](https://i.imgur.com/F1Idw41.png)
![screenshot](https://i.imgur.com/HnpdBnp.png)

# Installation
Requires Node.js
`npm install`
`npm start`

# Setup
First you need to make a Spotify application. Be sure to copy the `Client Id` and `Client Secret` into a new file called `.env`.
Then edit the settings for the app on the Spotify developer dashboard, and set the `Redirect Uri` to `http://localhost:8888/auth/spotify/callback`.

# Usage
While a track is playing, Gemini will update to show the current song and artist. 

It also has the basic functions of Play/Pause on a single click, Skip Track by double-clicking in the center or right, and Previous Track by double-clicking on the left side of the screen.
