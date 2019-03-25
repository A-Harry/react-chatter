import React from 'react'

import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import NavigationIcon from '@material-ui/icons/Navigation';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { TextField, Button } from '@material-ui/core'
import ListItemText from '@material-ui/core/ListItemText';
import Fab from '@material-ui/core/Fab';



export default class Chatroom extends React.Component {


    constructor(props) {
        super(props)

        this.state = {
            chatHistory: [],
            input: '',

        }

        this.handleChange = this.handleChange.bind(this)
        this.onSendMessage = this.onSendMessage.bind(this)
        this.onMessageReceived = this.onMessageReceived.bind(this)
        this.updateChatHistory = this.updateChatHistory.bind(this)
        this.scrollChatToBottom = this.scrollChatToBottom.bind(this)
    }

    componentDidMount() {
        this.props.registerHandler(this.onMessageReceived)
        this.scrollChatToBottom()
    }

    componentDidUpdate() {
        this.scrollChatToBottom()
    }

    componentWillUnmount() {
        this.props.unregisterHandler()
    }

    handleChange(event) {
        this.setState({
            input: event.target.value
        })
    }

    onSendMessage() {
        if (!this.state.input)
            return

        this.props.onSendMessage(this.state.input, (err) => {
            if (err)
                return console.error(err)

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

    scrollChatToBottom() {
        this.panel.scrollTo(0, this.panel.scrollHeight)
    }



    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="Single-line item"
                                secondary={null}
                            />
                        </ListItem>
                    </List>
                    <Fab variant="extended" color="primary" aria-label="Send" className={'chatIcon'}>
                        <NavigationIcon />
                        Send
                    </Fab>



                </header>
            </div>




        )
    }
}