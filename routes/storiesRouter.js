const express = require('express');
const router = express.Router();

const mongoose = require('mongoose'); 
mongoose.Promise = global.Promise; 

const {DATABASE_URL, PORT} = require('../config');
const {Story} = require('../models'); 

module.exports = router; 