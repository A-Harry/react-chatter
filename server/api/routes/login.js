const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const User = require('../models/user')

router.post('/', (req, res, next) => {

    const user = req.body.username;
    const password = req.body.password;

    User.findOne({ username: user })
        .exec()
        .then(result => {
            if (result) {
                console.log(result._id)
                bcryptjs.compare(password, result.passwordHash, function (err, result) {
                    if (result == true) {
                        const token = jwt.sign({
                            username: user,
                            userId: result._id
                        }, process.env.JWT_KEY,
                            {
                                expiresIn: "1h"
                            });

                        res.status(200).json({
                            message: 'Auth Success',
                            token: token,
                            expiresIn: 3600
                        });
                    } else {
                        res.status(401).json({
                            message: 'Auth Failed, Check Password!'
                        });
                    }
                })
            } else {
                res.status(401).json({
                    message: 'Auth Failed'
                });
            }

        })
});

module.exports = router;