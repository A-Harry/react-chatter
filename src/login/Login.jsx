import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { TextField, Button } from '@material-ui/core'
import axios from 'axios';
import logo from '../assets/logo2.png';

export default class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      isAuthenticated: false,
      error: "",

    };
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  serializeForm() {
    return (
      {
        username: this.state.username,
        password: this.state.password
      }
    )
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    axios.post('http://localhost:3002/api/login/', this.serializeForm())
      .then(response => {
          localStorage.setItem('username', this.state.username)
          localStorage.setItem('token', response.data.token)
      })
      .catch((err) => {
        this.setState({
          error: 'Try Again!'
        })
        return (
          <Redirect to="/login" />
        )
      })

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>{this.state.error}</p>
          <div className="form">
            <form onSubmit={this.handleSubmit}>
              <TextField
                name="username"
                id="username"
                label="Username"
                className='formControl'
                margin="normal"
                variant="outlined"
                value={this.state.username}
                onChange={this.handleChange}
                type="text"
              />
              
              <TextField
                name="password"
                id="password"
                label="Password"
                className='formControl'
                margin="normal"
                variant="outlined"
                value={this.state.password}
                onChange={this.handleChange}
                type="password"
              />

              <Button
                id="loginButton"
                type="submit"
                variant="contained"
                color="primary"
                disabled={!this.validateForm()}
              >
                Login
              </Button>
            </form>
          </div>
        </header>

      </div>

    );
  }
}

