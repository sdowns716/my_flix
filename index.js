const path = require("path");
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Models = require('./models.js');
const passport = require('passport');
const app = express();
const uuid = require("uuid");

const cors = require('cors');
const { check, validationResult } = require('express-validator');

require('./passport');

const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;

/*mongoose.connect('mongodb://localhost:27017/myFlixDB', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true });*/

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(bodyParser.json());
app.use(morgan('common'));
app.use(cors());
app.use(express.static('public'));
app.use("/client", express.static(path.join(__dirname, "client", "dist")));
app.get("/client/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
const auth = require('./auth')(app);

let allowedOrigins = [
  'https://sydney-flix-app.herokuapp.com',
  'http://localhost:8080',
  'http://localhost:1234',
  '*'
];

app.use(cors());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        var message =
          'The CORS policy for this application doesn’t allow access from origin ' +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    }
  }));

//Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// GET requests
app.get('/', (_req, res) => {
  res.send('Welcome to my Movie App!')
});
app.get('/documentation', (_req, res) => {
  res.sendFile('documentation.html', { root: __dirname });
});

// Get all movies
app.get('/movies', 
passport.authenticate('jwt', { session: false }), 
(_req, res) => {
  Movies.find()
    .then(function(movies) {
      res.status(201).json(movies)
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

// Gets all of the data about a single movie, by title
app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ Title : req.params.Title })
  .then((movie) => {
    res.status(201).json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//Gets genre details
app.get('/movies/genres/:Name', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({'Genre.Name': req.params.Name})
  .then(function(movie){
    res.status(201).json(movie)
    })
  .catch(function(err) {
    console.error(err);
    res.status(500).send('Error:' + err);
  });
});

//Gets data about a genre of single movie, by title
app.get('/movies/genres/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({'Genre.Title': req.params.Title})
  .then(function(movie){
    if(movie){
      res.status(201).send('Movie with the title : ' + movie.Title + ' is  a ' + movie.Genre.Name + ' .' );
    }else{
      res.status(404).send('Movie with the title : ' + req.params.Title + ' was not found.');
        }
    })
  .catch(function(err) {
    console.error(err);
    res.status(500).send('Error:' + err);
  });
});

//Gets data about a director (bio, birth year & death year by name)
app.get('/movies/directors/:Name', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({"Director.Name" : req.params.Name})
  .then(function(movies){
    res.status(201).json(movies.Director)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error:" + err);
  });
});

  // Adds data for a new user registration
  app.post('/users',

  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

  // Get all users
app.get('/users', (_req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Allows users to update their info(username, password, email, DOB)
app.put('/users/:Username',
passport.authenticate('jwt', { session: false }),
(req, res) => {
let hashedPassword = Users.hashPassword(req.body.Password);
Users.findOneAndUpdate({ Username: req.params.Username },
  { $set:
  {
    Username: req.body.Username,
    Password: hashedPassword,
    Email: req.body.Email,
    Birthday: req.body.Birthday
  }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//Delete movie by username
app.delete('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username : req.params.Username }, {
    $pull : { FavoriteMovies : req.params.MovieID }
  },
  { new : true }, // This line makes sure that the updated document is returned
  function(err, updatedUser) {
    if (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser)
    }
  })
});

// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
console.log('Listening on Port ' + port);
});
