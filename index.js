
const express = require('express'),
 morgan = require('morgan'),
 app = express();
 bodyParser = require('body-parser');

app.use(bodyParser.json());


let movies = [
  {
    title: 'Bambi',
    description: 'A fawn who will one day become King of the forest is born.  He befriends different animals who help him navigate phases of his life.',
    genre:{
      genre: 'Animated',
      description: 'Cartoon with moving pictures'
    },
    director: {
      name: 'David Hand',
      bio: 'Born in Plainfield, New Jersey, Hand began his animation career working on the Out of the Inkwell cartoons throughout the 1920s. He joined the Disney studio in 1930.  Hand contributed to Midnight in a Toy Shop, The China Plate and Egyptian Melodies.',
      birthYear: 1900,
      deathYear: 1996
    },
    imageURL: 'bambi.png',
    featured: 'No',
  },
  {
    title: 'Peter Pan',
    description: 'A free-spirited and mischevious young boy who never grows up spends his time on the island of Neverland as the leader of the Lost Boys.',
    genre:{
      genre: 'Animated',
      description: 'Cartoon with moving pictures'
    },
    director: {
      name: 'Clyde Geronimi',
      bio: 'Born in Italy, he immigrated to the US as a young child.  His earliest experience in animation was through J.R. Bray Studios and joined Disney in 1931.',
      birthYear: 1901,
      deathYear: 1989
    },
    imageURL: 'peterpan.png',
    featured: 'Yes',
  }

/*  {
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
    feature: '', */
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
  res.json(movies);
});

// Gets all of the data about a single movie, by title
app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) =>
    { return movie.title === req.params.title }));
});

//Gets data about a genre of single movie, by title
app.get('/movies/genre/:genre', (_req, res) => {
  res.send('Successful GET request returning data about the genre of the movie');
});

//Gets data about a director (bio, birth year & death year by name)
app.get('/movies/directors/:director', (_req, res) => {
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
});

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
