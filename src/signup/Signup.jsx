import React, { Component } from 'react';
import { TextField, Button } from '@material-ui/core'
import axios from 'axios';
import logo from '../assets/logo2.png';

export default class Signup extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username_signup: '',
      phone_number_signup: '',
      password_signup: '',
      confirm_password_signup: '',
      error: '',
      submitted: false,
      loading: false,
      isAuthenticated: false,
      errorMessage: ''
    };
  }


  validateForm() {
    return this.state.username_signup.length > 0 && this.state.password_signup.length > 0 && this.state.phone_number_signup.length > 0 && this.state.password_signup === this.state.confirm_password_signup;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }


  handleSubmit = event => {
    event.preventDefault();
    this.setState({ submitted: true });
    const { username_signup, password_signup } = this.state;

    // stop here if form is invalid
    if (!(username_signup && password_signup)) {
      return;
    }

    this.setState({ loading: true });

    axios({
      method: 'post',
      url: 'http://localhost:3002/api/signup',
      data: {
        username: this.state.username_signup,
        password: this.state.password_signup,
        phoneNumber: this.state.phone_number_signup
      }
    })
      .then(response => {
          this.setState({
            errorMessage: 'Username Added!'
          })
      })
      .catch(error => {
        this.setState({
          errorMessage: 'Username Already Exists'
        })
      });

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="form">
          <p style={{color: this.state.errorMessage === 'Username Already Exists' ? 'red' : 'green'}}>
            {this.state.errorMessage}
          </p>
            <form onSubmit={this.handleSubmit} autoComplete='off'>
              <TextField
                name="username"
                id="username_signup"
                label="Username"
                className='formControl'
                margin="normal"
                variant="outlined"
                value={this.state.username_signup}
                onChange={this.handleChange}
                type="text"
              />

              <TextField
                name="phone_number"
                id="phone_number_signup"
                label="Phone Number"
                className='formControl'
                margin="normal"
                variant="outlined"
                value={this.state.phone_number_signup}
                onChange={this.handleChange}
                type="number"
              />

              <TextField
                name="password"
                id="password_signup"
                label="Password"
                className='formControl'
                margin="normal"
                variant="outlined"
                value={this.state.password_signup}
                onChange={this.handleChange}
                type="password"
              />

              <TextField
                name="confirm_password"
                id="confirm_password_signup"
                label="Confirm Password"
                className='formControl'
                margin="normal"
                variant="outlined"
                value={this.state.confirm_password_signup}
                onChange={this.handleChange}
                type="password"
              />
              <Button
                id="signupButton"
                type="submit"
                variant="contained"
                color="primary"
                disabled={!this.validateForm()}
              >
                Sign Up Now!
              </Button>

            </form>
          </div>
        </header>

      </div>

    );
  }
}