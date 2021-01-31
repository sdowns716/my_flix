import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './login-view.scss';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap/Form';

export function LoginView(props) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

  /**
   * submits username and password to login
   * @function handleSubmit
   * @param {string} username
   * @param {string} password
   */
	const handleSubmit = (e) => {
		e.preventDefault();
    axios
      .post('https://sydney-flix-app.herokuapp.com/login', {
        Username: username,
        Password: password,
      })
      .then((response) => {
        const data = response.data;
        props.onLoggedIn(data);
      })
      .catch((e) => {
        console.log('no such user');
      });
  };

	return (
		<form>
			<label>
				Username:
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</label>
			<label>
				Password:
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</label>
			<button type="button" onClick={handleSubmit}>
				Submit
			</button>
		</form>
	);
}