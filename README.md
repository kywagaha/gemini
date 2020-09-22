# Gemini
Aesthetic now playing screen for Spotify

![screenshot](https://i.imgur.com/HOda3vb.png)
## Use it as a mini-player!
![screenshot](https://i.imgur.com/SrHmQDl.png)
## or as a full-screen display!
![screenshot](https://i.imgur.com/rBw86rZ.jpg)

# Installation
`yarn install` or `npm install`, but yarn is recommended for building the app.

# Setup
`yarn start` or `npm start`.

This uses [Gemini-Authorization](https://github.com/Gabe-H/Gemini-Authorization) for Spotify authentication by default. If you would like to use your own client ID and secret, you can do it locally by creating a file named `.env`, and set the client parameters as
```
CLIENT_ID=123456
CLIENT_SECRET=abcdefg
```

# Usage
While a track is playing, Gemini will update to show the current song and artist. 

Should you need to sign in again, pressing `Ctrl+S` will take you back to that screen.

## Keyboard Controls
- `Space` or `K`: Play/Pause
- `Left arrow key` or `J`: Previous track
- `Right arrow key` or `L`: Next track
- `Esc`: Exit out of fullscreen

# Building
`yarn dist`

Insert your client ID and secret in `main.js`, replacing the `process.env` variables. Delete the `.env` file as it will not work in production.

Note that your client ID and secret will be exposed if someone looks in to the compiled source files, so it's best to just compile a version for yourself if you want to use your own client ID and secret.

Refer to the `electron-builder` arguments for your specific operating system [here](https://www.electron.build/cli).

# To Do
Please check out our [projects page](https://github.com/Gabe-H/Gemini/projects/2)! Please open an issue if you have any suggestions!

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
