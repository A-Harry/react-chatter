import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu'
import Login from './login/Login'
import Signup from './signup/Signup'
import Chatroom from './chatroom/Chatroom'
import ChatroomList from './chatroom-list/ChatroomList'


import './App.css';


export default class App extends Component {

  componentWillUnmount(){
    this.onLogout();
  }

  showSettings(event) {
    event.preventDefault();
  }

  onLogout(){
    localStorage.removeItem('token')
    localStorage.removeItem('username')
  }

  render() {
    return (

      <BrowserRouter>
        <Menu right>
          <li id="home" className="menu-item"><Link to={"/"}>Home</Link></li>
          <li id="about" className="menu-item"><Link to={"/login"}>Login</Link></li>
          <li id="signup" className="menu-item"><Link to={"/signup"}>Signup</Link></li>
          <li id="logout" className="menu-item" onClick={this.onLogout}><Link to={"/login"}>Logout</Link></li>
        </Menu>
        <Switch>
          <Route exact path="/" component={ChatroomList} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/chatrooms/:chatroomId" component={Chatroom} />
          <Route path="/chatrooms" component={ChatroomList} />
        </Switch>
      </BrowserRouter>
    )

  }
}