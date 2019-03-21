'use strict'; 

const express = require('express');
const passport = require ('passport'); 
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser'); 

const config =require('../config'); 
const router= express.Router(); 


const createAuthToken = function (user) {
    return jwt.sign({user}, config.JWT_SECRET, {
        subject: user.userName,
        expiresIn: config.JWT_EXPIRY, 
        algorithm: 'HS256'
    });
};

const localAuth = passport.authenticate('local', {session: false}); 
router.use(bodyParser.json()); 

router.post('/login', localAuth, (req,res) => {
    const user = req.user; 
    const authToken = createAuthToken(user); 
    res.json({authToken, user}); 
}); 

const jwtAuth =passport.authenticate('jwt', {session:false}); 

router.post('/refresh', jwtAuth, (req,res) => {
    const user = req.user; 
    const authToken = createJwtToken(user); 
    res.json({authToken, user}); 
}); 

module.exports = {router}; 
