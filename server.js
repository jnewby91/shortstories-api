const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {DATABASE_URL, PORT} = require('./config.js');
const {Story, Prompt, User} = require('./models');
const bodyParser = require('body-parser');

const usersRouter = require('./routes/usersRouter');
const storiesRouter = require('./routes/storiesRouter');
const promptsRouter = require('./routes/promptsRouter');

app.use('/prompts', promptsRouter);
app.use('/stories', storiesRouter);
app.use('/users', usersRouter);

 app.get('/api/*', (req, res) => {
   res.json({ok: true});
 });

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