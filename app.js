require("dotenv").config();

const { response } = require("express");
const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
// GET  /   -  Renders a home page with the search GET form
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  const artistName = req.query.artistName;
  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      const artistsArr = data.body.artists.items;
      res.render("artist-search", { artistsList: artistsArr });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      console.log("data.body.items", data.body.items);
      const albumsArray = data.body.items;
      res.render("albums", { albumsList: albumsArray });
    })
    .catch(() => {
      console.log(err);
    });
});

//get tracks/345
app.get("/musics/:albumId", (req, res) => {
  const albumId = req.params.albumId;
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      console.log("data.body.items", data.body.items);
      const musicArray = data.body.items;
      res.render("music", { musicList: musicArray });
    })
    .catch(() => {
      console.log(err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
