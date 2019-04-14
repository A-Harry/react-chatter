const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    phoneNumber: {type: Number},
    username: {type: String},
    passwordHash: {type: String},
    chatrooms: [String]
},
{
    collection: 'users'
});

module.exports = mongoose.model('User', userSchema);