import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu'
import Login from './login/Login.jsx'
import Signup from './signup/Signup.jsx'
import Chatroom from './chatroom/Chatroom.jsx'
import ChatroomList from './chatroom-list/ChatroomList.jsx'



import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
    };
  }

  showSettings(event) {
    event.preventDefault();
  }

  render() {
    return (

      <div>
        <Menu right>
          <a id="home" className="menu-item" href="/login">Login</a>
          <a id="about" className="menu-item" href="/chatrooms">Chatrooms</a>
          <a id="chatrooms" className="menu-item" href="/about">About</a>
        </Menu>
        <Login />
        <Signup />
        <ChatroomList />
        <Chatroom />
      </div>
    )

  }
}

export default App;