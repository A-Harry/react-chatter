const express = require('express');
const router = express.Router();
const User = require('../models/user')
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

router.post('/', (req,res, next) => {

    const password = req.body.password;
    const username = req.body.username;
    console.log(password,username)

    bcryptjs.hash(password, saltRounds, function(err, hash){
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            phoneNumber: req.body.phoneNumber,
            username: req.body.username,
            passwordHash: hash
        })

        User.findOne({username: user.username})
            .exec()
            .then(result => {
                if(result){
                    res.status(400).json({
                        message: "User Already Exist!"
                    });
                }else{
                    user.save()
                        .then(result => {
                            res.status(201).json({
                                message: "New User Created",
                                createdUser: {
                                    id: result._id,
                                    phoneNumber: result.phoneNumber,
                                    username: result.username,
                                }
                            })
                        })
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            });
    });

})

module.exports = router;