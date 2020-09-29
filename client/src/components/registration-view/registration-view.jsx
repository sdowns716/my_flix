import React, { useState } from 'react';
import axios from 'axios';
import { Form, Container, Button } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './registration-view.scss';

export function RegistrationView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password, email, dob);
    // Send a request to the server for authentication then call props.onLoggedIn(username)
    props.onLoggedIn(username);
  };
  return (
    <Container className='container'>
      <Form>
        <Form.Group className='registration'>
          <h4>Please Register</h4>
          <Row>
            <Col>
              <Form.Label className='Label'>Username:</Form.Label>
              <Form.Control
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='Control'
                type='text'
                placeholder='Enter Username'
              />
            </Col>
            <Col>
              <Form.Label className='Label'>Email:</Form.Label>
              <Form.Control
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='email'
                type='email'
                placeholder='Enter Email'
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label className='Label'>Birthday:</Form.Label>
              <Form.Control
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className='birthday'
                type='date'
                placeholder='Enter Birthday'
              />
            </Col>
            <Col>
              <Form.Label className='Label'>Password:</Form.Label>
              <Form.Control
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='Control2'
                type='password'
                placeholder='Enter Password'
              />
            </Col>
          </Row>
          <Row className='Button'>
            <Col>
              <Button type='button' variant='dark' onClick={handleSubmit}>
                Submit
              </Button>
            </Col>
          </Row>
        </Form.Group>
      </Form>
    </Container>
  );
}