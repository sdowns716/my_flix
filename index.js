const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express'),
 morgan = require('morgan'),
 app = express();
 bodyParser = require('body-parser');
 uuid = require("uuid");
app.use(bodyParser.json());


app.use(express.static('public'));
app.use(morgan('common'));
//Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// GET requests
app.get('/', (_req, res) => {
  res.send('Welcome to my Disney Movie App!');
});
app.get('/documentation', (_req, res) => {
  res.sendFile('documentation.html', { root: __dirname });
});

// Get all movies
app.get('/movies', (_req, res) => {
  Movies.find()
    .then(function(movies) {
      res.status(201).json(movies)
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
  });

// Gets all of the data about a single movie, by title
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title : req.params.Title })
  .then((movie) => {
    res.json(movie)
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Gets genre details
app.get('/movies/genres/:Name', (req, res) => {
  Movies.findOne({'Genre.Name': req.params.Name})
  .then(function(movie){
    res.json(movie)
    })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error:" + err);
  });
});

//Gets data about a genre of single movie, by title
app.get('/movies/genres/:Title', (req, res) => {
  Movies.findOne({'Genre.Title': req.params.Title})
  .then(function(movie){
    if(movie){
      res.status(201).send("Movie with the title : " + movie.Title + " is  a " + movie.Genre.Name + " ." );
    }else{
      res.status(404).send("Movie with the title : " + req.params.Title + " was not found.");
        }
    })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error:" + err);
  });
});

//Gets data about a director (bio, birth year & death year by name)
app.get('/movies/directors/:Name', (req, res) => {
  Movies.findOne({"Director.Name" : req.params.Name})
  .then(function(movies){
    res.json(movies.Director)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error:" + err);
  });
});

  // Adds data for a new user registration
  app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
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
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Allows users to update their info(username, password, email, DOB)
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
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
app.post('/users/:Username/Movies/:MovieID', (req, res) => {
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
app.delete('/users/:Username/Movies/:MovieID', (req, res) => {
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
app.delete('/users/:Username', (req, res) => {
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
app.listen(8080, () =>
console.log('Your app is listening on port 8080.'));
