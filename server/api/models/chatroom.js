const mongoose = require('mongoose');

const chatroomSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String},
    users: [String],
    messages : []
},
{
    collection: 'chatrooms'
});

module.exports = mongoose.model('Chatroom', chatroomSchema);