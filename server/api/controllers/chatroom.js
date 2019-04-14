const Chatroom = require('../models/chatroom')
const mongoose = require('mongoose');


exports.get_all_chatrooms = (req, res, next) => {
    Chatroom.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                chatrooms: docs
            }
            res.status(200).json(response);
        })
}

exports.get_chatroom = (req, res, next) => {
    const chatroomId = req.params.chatroomId;
    Chatroom.findById(chatroomId)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: 'Chatroom Not Found!' })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
}

exports.delete_chatroom = (req, res, next) => {
    const chatroomId = req.params.chatroomId;
    Chatroom.deleteMany({ _id: chatroomId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Chatroom Deleted"
            });
        })
        .catch(err => {
            error: err
        });
}

