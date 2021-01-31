import React from 'react';
import axios from 'axios';

import { connect } from 'react-redux';

import { BrowserRouter as Router, Route} from "react-router-dom";

import { setMovies, setUser } from '../../actions/actions';

import { Link } from 'react-router-dom';

import MoviesList from '../movies-list/movies-list';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { MovieCard } from '../movie-card/movie-card';
import { ProfileView } from '../profile-view/profile-view';

export class MainView extends React.Component {

  constructor() {
    super();

    this.state = {
      user: null
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }

  /**
   * gets the movies from the database
   * @function getMovies
   * @param {*} token 
   * @return {movies}
   */
  getMovies(token) {
    axios.get('https://sydney-flix-app.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}`}
    })
    .then(response => {
      this.props.setMovies(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  /**
   * once logged in, saves credentials to localstorage
   * @function onLoggedIn
   * @param {*} authData 
   */
	onLoggedIn(authData) {
		this.setState({
			user: authData.user.Username
    });
    
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }
  render() {
    
    let { movies } = this.props;
    let { user } = this.state;
    
    return (
      <Router basename="/client">
         <div className="main-view">
           <Route exact path="/" render={() => {
             if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
             return <MoviesList movies={movies}/>;
         }} />
           <Route path="/register" render={() => <RegistrationView />} />
           <Route path="/movies/:movieId" render={({match}) => <MovieView movie={movies.find(m => m._id === match.params.movieId)}/>}/>
           <Route
            path="/movies/director/:name"
            render={({ match }) => {
              if (!movies) return <div className="main-view" />;
              return (
                <DirectorView
                  director={
                    movies.find((m) => m.Director.Name === match.params.name)
                      .Director
                  }
                />
              );
                }}
                />
          <Route
            path="/movies/genres/:name"
            render={({ match }) => {
              if (!movies) return <div className="main-view" />;
              return (
                <GenreView
                  genre={
                    movies.find((m) => m.Genre.Name === match.params.name).Genre
                  }
                />
              );
            }}
          />
         </div>
    </Router>
              );
          }
        }

let mapStateToProps = state => {
  return { movies: state.movies }
}

export default connect(mapStateToProps, { setMovies, setUser } )(MainView);