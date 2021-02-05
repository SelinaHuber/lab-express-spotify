require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));



// setting the spotify-api goes here:



const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', function(req, res) {
    console.log ("hello it works")
    res.render('homePage');
});


app.get('/artist-search', (req, res) => {    
      spotifyApi
      .searchArtists(req.query.search)
      .then(data => {
        console.log('The received data from the API: ', data.body);
        //console.log(data.body.artists.items)
        res.render('artist-search-results', {artists: data.body.artists.items})
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
})
  
app.get('/albums/:artistId', (req, res, next) => {
    console.log('TESSSSSSTTTT', req.params.artistId)
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(album => {
          res.render('albums', {album: album.body.items})
    })
    /* spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
      function(data) {
        console.log('Artist albums', data.body);
      },
      function(err) {
        console.error(err);
      }
    ); */
});

app.get('/tracks/:trackId', (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.trackId)
  .then(track => {
    res.render('tracks', {tracks: track.body.items})
  })
  .catch(err => console.log('The error while searching tracks occurred: ', err));
})


/* spotifyApi.getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ', { limit : 5, offset : 1 })
  .then(function(data) {
    console.log(data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  }); */


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
