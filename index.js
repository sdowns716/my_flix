const express = require('express');
const morgan = require('morgan');
const app = express();

let topMovies = [
  {
    movie: 'Bambi',
    year: '1942'
  },
  {
    movie: 'Peter Pan',
    year: '1953'
  },
  {
    movie: 'Sleeping Beauty',
    year: '1959'
  },
  {
    movie: 'The Parent Trap',
    year: '1961'
  },
  {
    movie: 'Mary Poppins',
    year: '1964'
  },
  {
    movie: 'Jungle Book',
    year: '1967'
  },
  {
    movie: 'Robin Hood',
    year: '1973'
  },
  {
    movie: 'The Rescuers',
    year: '1977'
  },
  {
    movie: 'Honey, I Shrunk the Kids',
    year: '1989'
  },
  {
    movie: 'The Little Mermaid',
    year: '1989'
  }
];

app.use(express.static('public'));
app.use(morgan('common'));

//Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie app!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});


// listen for requests
app.listen(8080, () =>
  console.log('Your app is listening on port 8080.'));
;
