'use strict'; 

const express = require('express');
const passport = require ('passport'); 
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser'); 

const config =require('../config'); 
const router= express.Router(); 


const createAuthToken = function (email) {
    return jwt.sign({email}, config.JWT_SECRET, {
        subject: email,
        expiresIn: config.JWT_EXPIRY, 
        algorithm: 'HS256'
    });
};

const localAuth = passport.authenticate('local', {session: false}); 
router.use(bodyParser.json()); 

router.post('/login',  (req,res) => {
    console.log('hello');
    const email = req.body.email; 
    console.log(email);
    const authToken = createAuthToken(email); 
    console.log(authToken);
    res.json({authToken, email}); 
}); 

const jwtAuth =passport.authenticate('jwt', {session:false}); 

router.post('/refresh', jwtAuth, (req,res) => {
    const user = req.user; 
    const authToken = createJwtToken(user); 
    res.json({authToken, user}); 
}); 

module.exports = {router}; 
