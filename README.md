# Gemini [![Build Status](https://travis-ci.com/Gabe-H/Gemini.svg?branch=master)](https://travis-ci.com/Gabe-H/Gemini)
Aesthetic now playing screen for Spotify

![screenshot](https://i.imgur.com/HOda3vb.png)
## Use it as a mini-player!
![screenshot](https://i.imgur.com/SrHmQDl.png)
## or as a full-screen display!
![screenshot](https://i.imgur.com/rBw86rZ.jpg)

# Installation
`yarn install` or `npm install`, but yarn is recommended for building the app.

# Setup
First you need to make a Spotify application. Once you have your client ID and client secret, make an .env file in the root directory (the file name is just `.env`). Fill in the .env file like this (no 'quotation marks' around the vars):
```
CLIENT_ID=123456789
CLIENT_SECRET=987654321
```
Then edit the settings for the app on the Spotify developer dashboard, and set the `Redirect Uri` to `http://localhost:8080/callback`.

Once it's all ready, `yarn start` or `npm start`.

# Usage
While a track is playing, Gemini will update to show the current song and artist. 

Should you need to sign in again, pressing `Ctrl+S` will take you back to that screen.

# Building
Put your Client ID and secret in `main.js`. The `.env` will not work in production. Note that your client ID and secret will be exposed if someone looks in the build's source files.

`yarn dist`

Recommeneded to run on macOS as it can compile a Windows, Mac, and Linux version. If you only want to compile for a specific operating system, change `dist` in `package.json`. Refer to the `electron-builder` arguments [here](https://www.electron.build/cli).

# Font License
We have explicit permission from the creator of the Forma DJR Font, David Jonathan Ross, to use in Gemini. If you want to develop and fork Gemini, please do not install the fonts on your system and use it for your own use. It is against the license and you should buy the [font](https://djr.com/forma/) for your own personal use.

# [Our favorite songs and albums!](https://open.spotify.com/playlist/6ILAg2eGBzvN3loVQLI9O5?si=oXj4PnPgSZyLLTBJU1fQpg)
- [Lose - NIKI](https://open.spotify.com/track/7rgjkzZBhBjObaYsvq8Ej0?si=c2DyCWX_QDyRHToxpOzV5A)
- [Djesse Vol. 3 - Jacob Collier](https://open.spotify.com/album/33cj3kzLqVOg9zvy69Wrc8?si=pCUxII-9Q_mYzyDzvVY3rA)
- [Switchblade - NIKI](https://open.spotify.com/track/6Ve2gwTaMxTgKMuAcHbwcH?si=YcSJi59cQL-aCBRLJw4wfg)
- [7 rings - Ariana Grande](https://open.spotify.com/track/6ocbgoVGwYJhOv1GgI9NsF?si=ULM0YYAqTCyD02T9U2hnyA)
- [urs - NIKI](https://open.spotify.com/track/50oEtTUNlce4TuZXQoJzXW?si=NmvfHvWaQv2IdD_BtC8Twg)
- [Stuck with U - Ariana Grande and Justin Bieber](https://open.spotify.com/track/4HBZA5flZLE435QTztThqH?si=DyRI2hgvQhiOjEphCCPcSw)
- [Trying - Luna Li](https://open.spotify.com/track/6JOcqL8v344EarvtlQZ3km?si=2evfA1cTSsy8W0fFJQlNnw)
- [Indigo - NIKI](https://open.spotify.com/track/1sOr5OXjbukTzBDgmvd6Fa?si=FhkQLdrLRJmal0TDCjGuag)
- [All I Want - Olivia Rodrigo](https://open.spotify.com/track/1v6svH1Fyx9C1nIt1mA2DT?si=RZTjLnkDRHW48UljXYY3sw)
