import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import logo from '../assets/logo2.png';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import { TextField, Button } from '@material-ui/core'
import socket from '../socket-io-client'
import { withRouter } from 'react-router-dom'

import axios from 'axios';

class Admin extends Component {

    constructor(props) {
        super(props)
        this.state = {
            eventHistory: [],
            chatHistory: [],
            chatrooms: [],
            current_user: localStorage.getItem('username'),
            isAuthenticated: false,
            isAdmin: false,
            addChatroom: '',
            client: socket(),
            value: 'one'
        }

        this.handleChat = this.handleChat.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleTabChange = this.handleTabChange.bind(this)
    }

    componentWillMount() {
        this.autoAuth();
        this.loadChatrooms();
        this.loadEventHistory();
    }

    componentWillUpdate() {
        this.loadChatrooms();
    }

    loadChatrooms = () => {
        axios({
            method: 'get',
            url: 'http://localhost:3002/api/chatrooms/'
        })
            .then(response => {
                this.setState({
                    chatrooms: response.data.chatrooms
                })
            })
    }

    loadEventHistory = () => {
        axios({
            method: 'get',
            url: 'http://localhost:3002/api/events'
        })

            .then(response => {
                this.setState({
                    eventHistory: response.data.events
                })
            })

    }

    autoAuth() {
        let token = localStorage.getItem('token')
        let username = localStorage.getItem('username')
        if (token != null) {
            this.setState({ isAuthenticated: true })
        };
        if (username === 'admin') {
            this.setState({ isAdmin: true })
        }
    }

    validateForm() {
        return this.state.addChatroom.length > 0;
    }

    handleChat = (event) => {
        event.preventDefault();
        let id = event.currentTarget.value;
        console.log(id)
        this.props.history.push("/chatrooms/" + id);
    }

    handleChange = event => {
        event.preventDefault();
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();
        if (window.confirm("Are you sure you want to add this chatroom?")) {
            let chatroomName = this.state.addChatroom;
            this.state.client.join(chatroomName)
            this.state.client.leave(chatroomName)
            this.setState({ state: this.state });
        }

    }

    handleDelete = (event) => {
        event.preventDefault();
        if (window.confirm("Are you sure you want to delete this chatroom?")) {
            let id = event.currentTarget.value;
            this.setState({ loading: true });

            axios({
                method: 'delete',
                url: 'http://localhost:3002/api/chatrooms/' + id,
                headers: {
                    'Authorizattion': localStorage.getItem('token')
                }
            })
                .then(response => {
                    console.log(response.status === 200)
                    console.log("Chatroom Deleted!")
                    this.setState({ loading: false });
                })
        }
    }

    handleTabChange = (event, value) => {
        this.setState({ value });
    };

    handleChangeIndex = index => {
        this.setState({ value: index });
    };



    render() {
        const { value } = this.state;


        if (!this.state.isAuthenticated && !this.state.isAdmin) {
            return (
                <Redirect to='/login' />
            )
        }

        return (

            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <div id='chat-header'>
                        <p id='room-name'>{this.state.current_user}</p>
                    </div>
                    <div className="form">

                        <AppBar position="static">
                            <Tabs value={value} onChange={this.handleTabChange} variant="fullWidth" centered>
                                <Tab value="one" label="Event Log" />
                                <Tab value="two" label="Chat Rooms" />
                            </Tabs>
                        </AppBar>
                        {
                            value === 'one' &&
                            <Paper className='root'>
                                <Table className='result-table'>
                                    <TableHead>
                                        <TableRow id="table-header">
                                            <TableCell>Event Type</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Time</TableCell>
                                            <TableCell>User</TableCell>
                                            <TableCell>Room</TableCell>
                                            <TableCell>Event ID</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody style={({ backgroundColor: 'rgb(214, 196, 240)' })} >
                                        {this.state.eventHistory.map(event => (
                                            <TableRow key={event._id}>
                                                <TableCell component="th" scope="event">
                                                    {event.type}
                                                </TableCell>
                                                <TableCell>
                                                    {event.date}
                                                </TableCell>
                                                <TableCell>
                                                    {event.time}
                                                </TableCell>
                                                <TableCell>
                                                    {event.user}
                                                </TableCell>
                                                <TableCell>
                                                    {event.room}
                                                </TableCell>
                                                <TableCell>
                                                    {event._id}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Paper>

                        }
                        {value === 'two' &&
                            <Paper className='root'>
                                <Table className='result-table'>
                                    <TableHead>
                                        <TableRow id="table-header">
                                            <TableCell>Chatroom Name</TableCell>
                                            <TableCell align="right">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody style={({ backgroundColor: 'rgb(214, 196, 240)' })} >
                                        {this.state.chatrooms.map(chatroom => (
                                            <TableRow key={chatroom._id}>
                                                <TableCell component="th" scope="chatroom">
                                                    {chatroom.name}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Fab style={({ marginRight: '1rem' })} variant="extended" color="primary" aria-label="Chat" className='chatIcon' onClick={this.handleChat} value={chatroom._id}>
                                                        <NavigationIcon />
                                                    </Fab>
                                                    <Fab variant="extended" color="secondary" aria-label="Delete" className='chatIcon' onClick={this.handleDelete} value={chatroom._id}>
                                                        <DeleteIcon />
                                                    </Fab>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <ExpansionPanel id="add_chatroom">
                                    <ExpansionPanelSummary expandIcon={<AddIcon />}>
                                        <Typography>Add Chatroom</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <form className="form" onSubmit={this.handleSubmit} autoComplete='off'>
                                            <TextField
                                                name="add-chatroom-name"
                                                id="addChatroom"
                                                className='formControl'
                                                placeholder="Enter Chatroom Name"
                                                value={this.state.addChatroom}
                                                onChange={this.handleChange}
                                                type="text"
                                            /><br></br>
                                            <Button
                                                id='add-chat-button'
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                disabled={!this.validateForm()}
                                            ><AddIcon />Add Chatroom</Button><br />
                                        </form>



                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            </Paper>
                        }

                    </div>
                </header>
            </div>


        )



    }
}

export default withRouter(Admin)
