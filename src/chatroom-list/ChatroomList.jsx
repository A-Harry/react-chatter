import React, { Component } from 'react'
import NavigationIcon from '@material-ui/icons/Navigation';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
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

const chatrooms = [
    { _id: 1, name: 'Saif' },
    { _id: 2, name: 'Saif' },
    { _id: 3, name: 'Saif' },
]

export class ChatroomList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chatrooms: [],
            addChatroom: '',
            submitted: false,
            loading: false,
            error: ''
        };
    }

    componentDidMount() {
        this.loadChatrooms();
    }

    validateForm() {
        return this.state.addChatroom.length > 0;
      }

    handleChange = event => {
        this.setState({
          [event.target.id]: event.target.value
        });
      }


    handleChat = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
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
                console.log(response.data.chatrooms)
            })
    }


    handleDelete = (event) => {
        event.preventDefault();
        if (window.confirm("Are you sure to delete this chatroom?")) {
            console.log("Implement delete functionality here");
        }
        let id = event.currentTarget.value;
        this.setState({ loading: true });

        axios({
            method: 'delete',
            url: 'http://localhost:3002/api/chatrooms/' + id,
        })
            .then(response => {
                console.log(response.status === 200)
                console.log("Chatroom Deleted!")
                this.setState({ loading: false });
            })
    }

    render() {
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
                                <TableBody>
                                    {this.state.chatrooms.map(chatroom => (
                                        <TableRow key={chatroom._id}>
                                            <TableCell component="th" scope="chatroom">
                                                {chatroom.name}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Fab variant="extended" color="primary" aria-label="Chat" className={'chatIcon'} value={chatroom._id}>
                                                    <NavigationIcon />
                                                </Fab>
                                                <Fab variant="extended" color="secondary" aria-label="Delete" className={'chatIcon'} onClick={this.handleDelete} value={chatroom._id}>
                                                    <DeleteIcon />
                                                </Fab>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <ExpansionPanel id="add-chatroom">
                                <ExpansionPanelSummary expandIcon={<AddIcon />}>
                                    <Typography>Add Chatroom</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <form className="form" onSubmit={this.handleSubmit}>
                                        <TextField
                                            name="add-chatroom-name"
                                            id="addChatroom"
                                            className='formControl'
                                            placeholder="Enter Chatroom Name"
                                            value={this.state.currentChatroom}
                                            onChange={this.handleChange}
                                            type="text"
                                        />
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={!this.validateForm()}
                                        ><AddIcon />Add Chatroom</Button>
                                    </form>

                                    {/* <Typography>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                        sit amet blandit leo lobortis eget.
                                    </Typography> */}


                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </Paper>
                    </div>
                </header>
            </div>
        )
    }
}

export default ChatroomList
