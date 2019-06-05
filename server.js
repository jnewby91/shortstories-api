'use strict' ;
require('dotenv').config();

const express = require('express');
const app = express(); 
const cors= require('cors'); 
const morgan= require('morgan'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const passport = require('passport'); 

const {DATABASE_URL, PORT, CLIENT_ORIGIN} = require('./config.js');

// app.use(
//     cors({
//         origin: CLIENT_ORIGIN
//     })
// );

app.use(morgan('tiny')); 
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if(req.method === 'OPTIONS'){
        return res.send(204);
    }
    next(); 
})

const usersRouter = require('./routes/usersRouter');
const storiesRouter = require('./routes/storiesRouter');
const promptsRouter = require('./routes/promptsRouter');
const {router: authRouter} = require('./auth/router'); 

const {localStrategy, jwtStrategy} = require('./auth/strategies'); 

mongoose.Promise = global.Promise;

app.use(passport.initialize()); 

passport.use(localStrategy); 
passport.use(jwtStrategy); 

app.use(express.static('public')); 

app.use('/api/prompts', promptsRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);


//  app.get('/api/*', (req, res) => {
//    res.json({ok: true});
//  });

 let server;

function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                    console.log(`Your app is listening on port ${PORT}`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    })
}

if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {
    runServer,
    app,
    closeServer
};