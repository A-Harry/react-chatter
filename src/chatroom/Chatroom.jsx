import React from 'react'
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import NavigationIcon from '@material-ui/icons/Navigation';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import * as Scroll from 'react-scroll';
import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { TextField, Button } from '@material-ui/core'
import ListItemText from '@material-ui/core/ListItemText';
import Fab from '@material-ui/core/Fab';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { deepPurple, deepOrange } from '@material-ui/core/colors';



export default class Chatroom extends React.Component {


    constructor(props) {
        super(props)

        this.state = {
            chatHistory: [
                {
                    user: "saif",
                    message: "hello"
                },
                {
                    user: "samir",
                    message: "sup"
                },
                {
                    user: "saif",
                    message: "hello"
                },
                {
                    user: "saif",
                    message: "hello"
                },
                {
                    user: "samir",
                    message: "sup"
                },
                {
                    user: "saif",
                    message: "hello"
                },
                {
                    user: "saif",
                    message: "hello"
                },
                {
                    user: "samir",
                    message: "sup"
                },
                {
                    user: "saif",
                    message: "hello"
                },
                {
                    user: "saif",
                    message: "hello"
                },
                {
                    user: "samir",
                    message: "sup"
                },
                {
                    user: "saif",
                    message: "hello"
                },
                {
                    user: "saif",
                    message: "hello"
                },
            ],
            input: '',
            current_user: localStorage.getItem('username'),
            isAuthenticated: false

        }

        this.handleChange = this.handleChange.bind(this)
        this.onSendMessage = this.onSendMessage.bind(this)
        this.onMessageReceived = this.onMessageReceived.bind(this)
        this.updateChatHistory = this.updateChatHistory.bind(this)
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    componentDidMount() {
        scroll.scrollToBottom();
    }

    componentDidUpdate() {
        scroll.scrollToBottom();
    }


    onSendMessage() {
        if (!this.state.input)
            return

        this.props.onSendMessage(this.state.input, (err) => {
            if (err) {
                return console.error(err)
            }

            return this.setState({ input: '' })
        })
    }

    onMessageReceived(entry) {
        console.log('Message Received: ', entry)
        this.updateChatHistory(entry)
    }

    updateChatHistory(entry) {
        this.setState({ chatHistory: this.state.chatHistory.concat(entry) })
    }



    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <div id="chat-window">
                        <List>
                            {
                                this.state.chatHistory.map(chat => (
                                    <ListItem style={{ float: "center" }}>
                                        <ListItemAvatar>
                                            <Avatar style={
                                                { backgroundColor: (chat.user === localStorage.getItem('username') ? deepPurple[500] : deepOrange[500]) }
                                            }>
                                                AC
                                        </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={chat.message}
                                            secondary={chat.user}
                                        />
                                    </ListItem>
                                ))
                            }

                        </List>
                    </div>
                    <div id="newMessage">
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
                        <Fab id="chat-button" variant="extended" color="primary" aria-label="Send" className={'chatIcon'} className='newMessage' >
                            <NavigationIcon />
                            Send
                    </Fab>
                    </div>

                </header>
            </div>




        )
    }
}