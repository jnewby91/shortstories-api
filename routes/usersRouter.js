const express = require('express');
const router = express.Router();

const mongoose = require('mongoose'); 
mongoose.Promise = global.Promise; 

const {DATABASE_URL, PORT} = require('../config');
const {User} = require('../models'); 

//GET endpoint that returns all the users in the database

router.get('/', (req, res) => {
    User
    .find({})
    .then(users => (
        res.json(
            users.map(user => {
            return{
                id: user.id, 
                username: user.userName,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email, 
                tagline: user.tagline, 
            }
            console.log(users);
        }))
    ))
    .catch(err => {
        console.err(err); 
        res.status(500).json({
            error: `something went wrong`
        });
    });
});



//POST endpoint to create users in Sign-up 

router.post('/', (req, res) => {
    console.log(req.body);
    const requiredFields=['firstName','lastName', 'userName', 'email', 'password'];
    for(let i=0; i < requiredFields.length; i++){
        const field = requiredFields[i]; 
        if(!(field in req.body)){
            const message = `Missing ${field} in request body`; 
            console.error(message); 
            return res.status(400).send(message);
        }
    }

    User
    .hashPassword(req.body.password)
    .then(password => {
        return User
        .create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            email: req.body.email,
            password: password   
        })
        .then(user => res.status(201).json(user.serialize()))
    })
    .catch(err => {
        console.error(err); 
        res.status(500).json({
            error: 'Something went wrong'
        });
    })
});


module.exports = router; 