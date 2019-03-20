
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser'); 

const {localPassportMiddleware, jwtPassportMiddleware} = require('../auth/strategies'); 
const {JWT_SECRET, JWT_EXPIRY} = require('../config');

const jsonParser = bodyParser.json(); 

const authRouter = express.Router(); 

authRouter.use(jsonParser);
router.use(bodyParser.urlencoded({ extended: true }));


function createJwtToken(user){
    return jwt.sign({user}, JWT_SECRET, {
        subject: user.userName,
        expiresIn: JWT_EXPIRY, 
        algorithm: 'HS256'
    });
}

authRouter.post('/login', localPassportMiddleware, (req,res) => {
    const user = req.user; 
    const jwtToken = createJwtToken(user); 
    res.json({jwtTOken, user}); 
}); 

module.exports = authRouter; 
