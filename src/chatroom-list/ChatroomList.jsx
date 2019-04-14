import React, { Component } from 'react'
import NavigationIcon from '@material-ui/icons/Navigation';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import { TextField, Button } from '@material-ui/core'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import logo from '../assets/logo2.png';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import socket from '../socket-io-client'
import Admin from '../admin/Admin'

export default class ChatroomList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chatrooms: [],
            addChatroom: '',
            client: socket(),
            isAuthenticated: false,
            isAdmin: false,
            loading: false,
        };

        this.handleChat = this.handleChat.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentWillMount() {
        this.loadChatrooms();
        this.autoAuth();
    }

    componentWillUpdate() {
        this.loadChatrooms();
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
    
    
    serializeForm() {
        return (
            {
                user: localStorage.getItem('username'),
                room: this.state.addChatroom
            }
        )
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

    validateForm() {
        return this.state.addChatroom.length > 0;
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
            this.state.client.join(chatroomName);
        }

    }

    handleDelete = (event) => {
        event.preventDefault();
        if (window.confirm("Are you sure you want to delete this chatroom?")) {
            let id = event.currentTarget.value;
            axios({
                method: 'delete',
                url: 'http://localhost:3002/api/chatrooms/' + id,
                headers: {
                    'Authorizattion' : localStorage.getItem('token')
                }
            })
                .then(response => {
                    console.log("Chatroom Deleted!")
                })
        }
    }

    handleChat = (event) => {
        event.preventDefault();
        let id = event.currentTarget.value;
        this.props.history.push("/chatrooms/" + id);
    }

    render() {
        if (!this.state.isAuthenticated) {
            console.log(this.state.isAuthenticated)
            return (
                <Redirect to='/login' />
            )
        }

        if(this.state.isAdmin){
            return(
                <Admin />
            )
        }

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <div className="form">
                        <Paper className='root'>
                            <Table className='result-table'>
                                <TableHead>
                                    <TableRow id="table-header">
                                        <TableCell>Chatroom Name</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody style={({backgroundColor: 'rgb(214, 196, 240)'})} >
                                    {this.state.chatrooms.map(chatroom => (
                                        <TableRow key={chatroom._id}>
                                            <TableCell component="th" scope="chatroom">
                                                {chatroom.name}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Fab variant="extended" color="primary" aria-label="Chat" className='chatIcon' onClick={this.handleChat} value={chatroom._id}>
                                                    <NavigationIcon />
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
                    </div>
                </header>
            </div>
        )
    }
}