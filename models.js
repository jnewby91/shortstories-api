'use strict'; 

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// const categorySchema = mongoose.Schema({category: 'string'});

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
    category: {
        type: 'string', 
        required: true
    }
}); 

// const commentSchema = mongoose.Schema({comments: 'string'});

const shortStorySchema = mongoose.Schema({
    title: {
        type: 'string',
        required: true
    },
    story: {
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

//Need to encrypt password being passed into the database
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hash(password, 10);
}

//Retrieves the correct password from a hashed value 
userSchema.methods.validatePassword = function(password){
    return bcrypt.compare(password, this.password);
}

//The items I want returned when I use the user GET endpoint 
userSchema.methods.serialize = () =>{
    return {
        id: this.id,
        userName: this.userName,
        email: this.email, 
        tagline: this.tagline, 
    }
}

//The items I want returned when I use the prompts GET endpoint 
promptSchema.methods.serialize = () =>{
    return {
        id: this.id,
        title: this.titile, 
        story: this.story,
        date: this.date 
    }
}

//The items I want returned when I use the shortStories GET endpoint 
shortStorySchema.methods.serialize = () =>{
    return {
        id: this.id,
        title: this.titile, 
        scenario: this.scenario,
        category: this.category,
        date: this.date
    }
}



const Story = mongoose.model('Story', shortStorySchema); 
const Prompt = mongoose.model('Prompt', promptSchema)
const User = mongoose.model('User', userSchema);

module.exports = {Story, Prompt, User}; 