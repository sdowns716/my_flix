
const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

let topMovies = [
  {
    title: 'Bambi',
    description: '',
    genre:'',
    director: {
      name: '',
      bio: '',
      birthYear: 9,
      deathYear: 8
    },
    imageURL: '',
    featured: '',
  },
  {
    title: 'Peter Pan',
    description: '',
    genre:'',
    director: {
      name: '',
      bio: '',
      birthYear: 9,
      deathYear: 9
    },
    imageURL: '',
    featured: '',
  },
  {
    title: 'Sleeping Beauty',
    description: '',
    genre:'',
    director: {
      name: '',
      bio: '',
      birthYear: 8,
      deathYear: 9
    },
    imageURL: '',
    featured: '',
  },
  {
    title: 'The Parent Trap',
    description: '',
    genre:'',
    director: {
      name: '',
      bio: '',
      birthYear: 9999,
      deathYear: 8888
    },
    imageURL: '',
    featured: '',
  },
  {
    title: 'Mary Poppins',
    description: '',
    genre:'',
    director: {
      name: '',
      bio: '',
      birthYear: 8888,
      deathYear: 9999
    },
    imageURL: '',
    featured: '',
  },
  {
    title: 'Jungle Book',
    description: '',
    genre:'',
    director: {
      name: '',
      bio: '',
      birthYear: 8888,
      deathYear: 9999
    },
    imageURL: '',
    featured: '',
  },
  {
    title: 'Robin Hood',
    description: '',
    genre:'',
    director: {
      name: '',
      bio: '',
      birthYear: 7,
      deathYear: 9,
    },
    imageURL: '',
    featured: '',
  },
  {
    title: 'The Rescuers',
    description: '',
    genre:'',
    director: {
      name: '',
      bio: '',
      birthYear: 7,
      deathYear: 9
    },
    imageURL: '',
    featured: '',
  },
  {
    title: 'Honey, I Shrunk the Kids',
    description: '',
    genre:'',
    director: {
      name: '',
      bio: '',
      birthYear: 1999,
      deathYear: 47777,
    },
    imageURL: '',
    featured: '',
  },
  {
    title: 'The Little Mermaid',
    description: '',
    genre:'',
    director: {
      name: '',
      bio: '',
      birthYear: 1900,
      deathYear: 1900,
    },
    imageURL: '',
    featured: '',
  }
];

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

app.get('/movies', (_req, res) => {
  res.json(topMovies);
});

// Gets all of the data about a single movie, by title
app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) =>
    { return movie.title === req.params.title }));
});

//Gets data about a genre of single movie, by title
app.get('/movies/:title/genres', (_req, res) => {
  res.send('Successful GET request returning the genre of a single movie');
  });

//Gets data about a director (bio, birth year & death year by name)
app.get('/movies/:name/directors', (_req, res) => {
    res.send('Successful GET request returning data (bio, birth year & death) about the director');
  });

  // Adds data for a new user registration
app.post('/users', (_req, res) => {
    res.send('Successful POST request adding data for a new user');
});

//Allows users to update their info(username, password, email, DOB)
app.put('/users/:id', (_req, res) => {
  res.send('Successful PUT request allowing users to update their info (username, password, email, DOB)');
});

  //Allow users to add movie to favorites
  app.post('/movies/:title/favorites', (_req, res) => {
    res.send ('Successful POST request allowing users to add a movie to their favorites')

  //Allow users to remove movie from favorites
app.delete('/movies/:title/favorites', (_req, res) => {
  res.send ('Successful DELETE request allowing users to remove a movie from their favorites')
});

  //Allow users to deregister by ID
app.delete('/users/:id', (_req, res) => {
  res.send ('Successful DELETE request allowing users to deregister with their ID')
});

// listen for requests
app.listen(8080, () =>
  console.log('Your app is listening on port 8080.'));
});
