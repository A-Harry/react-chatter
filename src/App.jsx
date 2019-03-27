import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect, Link } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu'
import Login from './login/Login'
import Signup from './signup/Signup'
import Chatroom from './chatroom/Chatroom'
import ChatroomList from './chatroom-list/ChatroomList'


import './App.css';

// const PrivateRoute = ({ component: Component, ...rest }) => (
//   <Route {...rest} render={(props) => (
//     localStorage.getItem('token') != null
//       ? <Component {...props} />
//       : <Redirect to='/login' />
//   )} />
// )


export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false
    };
  }

  componentWillMount() {
    let token = localStorage.getItem('token')
    if (token != null) {
      this.setState({
        isAuthenticated: true
      })
    } else {
      this.setState({
        isAuthenticated: false,
        redirect: true
      })
    }
    this.renderRedirect()
    console.log(this.state.isAuthenticated)
  }

  renderRedirect = () => {
    if (this.state.isAuthenticated) {
      return <Redirect to='/chatrooms' />
    } else {
      return <Redirect to='/login' />
    }
  }

  showSettings(event) {
    event.preventDefault();
  }

  render() {
    return (

      <BrowserRouter>
        <Menu right>
          <li id="home" className="menu-item"><Link to={"/"}>Home</Link></li>
          <li id="about" className="menu-item"><Link to={"/login"}>Login</Link></li>
          <li id="signup" className="menu-item"><Link to={"/signup"}>Signup</Link></li>
          <li id="chatrooms" className="menu-item"><Link to={"/chatrooms/123"}>About</Link></li>
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