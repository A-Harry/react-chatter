import React from 'react'
import socket from '../socket-io-client'
import Avatar from '@material-ui/core/Avatar';
import NavigationIcon from '@material-ui/icons/Navigation';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { animateScroll as scroll } from 'react-scroll'
import { TextField, Button } from '@material-ui/core'
import ListItemText from '@material-ui/core/ListItemText';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { deepPurple, deepOrange } from '@material-ui/core/colors';



export default class Chatroom extends React.Component {


    constructor(props) {
        super(props)

        this.state = {
            chatHistory: [],
            input: '',
            current_user: localStorage.getItem('username'),
            current_room: '',
            client: socket(),
            isAuthenticated: false

        }

        this.handleChange = this.handleChange.bind(this)
        this.handleNewMessage = this.handleNewMessage.bind(this)
        this.onMessageReceived = this.onMessageReceived.bind(this)
        this.updateChatHistory = this.updateChatHistory.bind(this)
        this.onEnterChatroom = this.onEnterChatroom.bind(this)
        this.onLeaveChatroom = this.onLeaveChatroom.bind(this)
        this.autoAuth = this.autoAuth.bind(this)
    }

    componentWillMount() {
        this.autoAuth();
        this.onEnterChatroom();
    }

    componentDidMount() {
        scroll.scrollToBottom();
        this.getChatHistory();
    }

    componentDidUpdate() {
        this.getChatHistory();
        scroll.scrollToBottom();
    }

    componentWillUnmount() {
        this.onLeaveChatroom();
    }

    autoAuth() {
        let token = localStorage.getItem('token')
        if (token != null) {
            this.setState({ isAuthenticated: true })
            console.log(this.state.isAuthenticated)
        };
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }
    getChatHistory() {
        const { chatroomId } = this.props.match.params
        axios({
            method: 'get',
            url: 'http://localhost:3002/api/chatrooms/' + chatroomId,
            headers: {
                'Authorizattion': localStorage.getItem('token')
            }
        })
            .then(response => {
                this.setState({
                    current_room: response.data.name,
                    chatHistory: response.data.messages
                })
            })
        return this.state.chatHistory;
    }

    handleNewMessage = event => {
        event.preventDefault();
        let room = this.state.current_room
        let msg = this.state.input
        let user = localStorage.getItem('username')
        this.setState({ input: '' })
        scroll.scrollToBottom();

        if (this.state.input.length === 0)
            return

        return this.state.client.message(room, msg, user, () => {
            this.setState({ input: '' })
        })

    }

    onMessageReceived(entry) {
        console.log('Message Received: ', entry)
        this.updateChatHistory(entry)
    }

    updateChatHistory(entry) {
        this.setState({ chatHistory: this.state.chatHistory.concat(entry) })
    }

    onTyping() {
        let room = this.state.current_room

        return this.state.client.typing(room, () => {
            console.log(this.state.current_user + " is typing")
        })
    }

    onEnterChatroom() {
        if (!this.state.current_user)
            return
        
        setTimeout(() => {

        return this.state.client.join(this.state.current_room, () => {
            console.log(this.state.current_user + " Joined Chatroom " + this.state.current_room + "!")
        })
        
        },2000)

    }

    onLeaveChatroom() {
        this.state.client.leave(this.state.current_room)
        console.log(this.state.current_user + " left " + this.state.current_room + " chatroom!")
    }

    renderMessage(user, message) {
        if (user === localStorage.getItem('username')) {
            return (
                <ListItem >
                    <ListItemAvatar>
                        <Avatar style={
                            { backgroundColor: deepPurple[500] }}>
                            {user.charAt(0).toUpperCase() + user.charAt(1).toUpperCase()}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={message}
                        secondary={user}
                    />
                </ListItem>
            )
        } else {
            return (
                <ListItem >
                    <ListItemText
                        primary={message}
                        secondary={user}
                        style={{ textAlign: 'right' }}
                    />
                    <ListItemAvatar>
                        <Avatar style={
                            { backgroundColor: deepOrange[500] }}>
                            {user.charAt(0).toUpperCase() + user.charAt(1).toUpperCase()}
                        </Avatar>
                    </ListItemAvatar>

                </ListItem>
            )
        }
    }

    render() {
        if (!this.state.isAuthenticated) {
            console.log(this.state.isAuthenticated)
            return (
                <Redirect to='/login' />
            )
        }

        return (
            <div className="App">
                <header className="App-header">
                    <div id='chat-header'>
                        <p id='room-name'>{this.state.current_room}</p>
                    </div>
                    <div id="chat-window">
                        <List>
                            {
                                this.state.chatHistory.map(chat => (
                                    <div>
                                        {this.renderMessage(chat.user, chat.message)}
                                    </div>
                                ))
                            }

                        </List>
                    </div>
                    <div id="newMessage">
                        <form onSubmit={this.handleNewMessage} autoComplete='off'>
                            <TextField
                                name="input"
                                id="input"
                                label="New Message"
                                margin="normal"
                                variant="outlined"
                                value={this.state.input}
                                className='newMessage'
                                onChange={this.handleChange}
                                type="text"
                            />
                            <br></br>
                            <Button
                                id="chat-button"
                                aria-label="Send"
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={!this.state.input.length > 0}
                            >
                                <NavigationIcon />
                                Send
                        </Button>
                        </form>
                    </div>

                </header>
            </div>




        )
    }
}