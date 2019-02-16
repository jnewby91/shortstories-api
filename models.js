'use strict'; 

const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    firstName: 'string', 
    lastName: 'string',
    userName: {
        type: 'string',
        unique: true,
        required: true
    },
    tagline: 'string',
    email: {
        type: 'string',
        unique: true, 
        required: true, 
    },
    password: {
        type: 'string', 
        unique: true,
        required: true, 
    }

});

const categorySchema = mongoose.Schema({category: 'string'});

const promptSchema = mongoose.Schema({
    title: {
        type:'string',
        required: true
    },
    email: {
        type: 'string',
        unique: true, 
        required: true, 
    },
    scenario: {
        type:'string',
        required: true
    },
    
    //Could put a date on when this prompt was created 
    category: [categorySchema]
}); 

// const commentSchema = mongoose.Schema({comments: 'string'});

const shortStorySchema = mongoose.Schema({
    title: {
        type: 'string',
        required: true
    },
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    date: {
        type: Date, 
        default: Date.now()
    }
    // comments: [commentSchema],
    // likes: Number, 
    
})


const Story = mongoose.model('Story', shortStorySchema); 
const Prompt = mongoose.model('Prompt', promptSchema)
const User = mongoose.model('User', userSchema);

module.exports = {Story, Prompt, User}; 