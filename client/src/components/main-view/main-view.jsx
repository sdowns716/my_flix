import React from 'react';
import axios from 'axios';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

export class MainView extends React.Component {
    constructor() {
      super();
  
      this.state = {
        movies: null,
        selectedMovie: null,
        user: null,
      };
    }

  // One of the "hooks" available in a React Component
  componentDidMount() {
    axios.get('/https://sydney-flix-app.herokuapp.com/movies')
      .then(response => {
        // Assign the result to the state
        this.setState({
          movies: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  render() {
    const { movies } = this.state;

    // Before the movies have been loaded
    if (!movies) return <div className="main-view"/>;

    return (
     <div className="main-view">
     { movies.map(movie => (
       <div className="movie-card" key={movie._id}>{movie.Title}</div>
     ))}
     </div>
    );
  }
}