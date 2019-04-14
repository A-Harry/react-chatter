const mongoose = require('mongoose');

const eventLogSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    type: {type: String},
    user: {type: String},
    room: {type: String},
    date: {type: String},
    time: {type: String},
    content: []
},
{
    collection: 'eventLog'
});

module.exports = mongoose.model('EventLog', eventLogSchema);