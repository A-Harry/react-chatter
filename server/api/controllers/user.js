const User = require('../models/user')
const EventLog = require('../models/eventLog')
const mongoose = require('mongoose');

exports.get_user = (req, res, next) => {
    const id = req.params.userId
    User.findById(id)
        .exec()
        .then(doc => {
            console.log("From Databse", doc);
            if(doc){
                res.status(200).json(doc);
            }else{
                res.status(404).json({message: 'Customer Not Found!'})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err})
        });
}

exports.get_user_history = (req, res, next) => {
    const name = req.params.name
    EventLog.find({user: name})
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                events: docs
            }
            res.status(200).json(response);
        })
}

exports.get_user_history_by_room = (req, res, next) => {
    const roomName = req.params.roomName
    EventLog.find({room: roomName})
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                events: docs
            }
            res.status(200).json(response);
        })
}

exports.update_user = (req,res,next) => {
    const id = req.params.userId;
    User.updateOne({_id: id}, {$set: {
        username: req.body.username,
        phoneNumber: req.body.phoneNumber}})
        .exec()
        .then(doc => {
            if(doc){
                res.status(200).json(doc);
            }else{
                res.status(404).json({})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:err
            })
        })
}

