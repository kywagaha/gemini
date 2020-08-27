# Gemini
Aesthetic now playing screen for Spotify

![screenshot](https://i.imgur.com/Edl9qr6.png)
![screenshot](https://i.imgur.com/F1Idw41.png)
![screenshot](https://i.imgur.com/HnpdBnp.png)


# Installation
Requires Node.js
`npm install`

# Setup
First you need to make a Spotify application. Once you have your client ID and client secret, make an .env file in the root directory (the file name is just `.env`). Fill in the .env file like this:
```
CLIENT_ID=123456789
CLIENT_SECRET=987654321
```
Then edit the settings for the app on the Spotify developer dashboard, and set the `Redirect Uri` to `http://localhost:8888/auth/spotify/callback`.

# Usage
While a track is playing, Gemini will update to show the current song and artist. 

It also has the basic functions of Play/Pause on a single click, Skip Track by double-clicking in the center or right, and Previous Track by double-clicking on the left side of the screen.

# Font License
We have explicit permission from the creator of the Forma DJR Font, David Jonathan Ross, to use in Gemini. If you want to develop and fork Gemini, please do not install the fonts on your system and use it for your own use. It is against the license and you should buy the [font](https://djr.com/forma/) for your own personal use.