const express = require('express');
const router = express.Router();
const passport = require('passport'); 
const mongoose = require('mongoose'); 
mongoose.Promise = global.Promise; 
const {DATABASE_URL, PORT} = require('../config');
const {Story} = require('../models'); 

const jwtAuth = passport.authenticate('jwt', {session: false});

//GET endpoint that returns all the stories in the database
router.get('/', (req, res) => {
    Story
    .find({user: req.body.id})
    .then(stories => (
        res.json(
            stories.map(story => {
            return{
                id: story.id, 
                title: story.title,
                story: story.story, 
                date: story.date
            }
            console.log(stories);
        }))
    ))
    .catch(err => {
        console.err(err); 
        res.status(500).json({
            error: `something went wrong`
        });
    });
});

//GET By ID for Stories
router.get('/:id', (req,res) => {
    Story
    .findById(req.params.id)
        .then(story => res.json(story.serialize()))
        .catch(err => {
            console.error(err); 
            res.status(500).json({
                error: 'something went wrong'
            });
        })
    });

//POST endpoint that creates writing prompts 
router.post('/', jwtAuth, (req, res) => {
    console.log(req.body);
    const requiredFields=['title','story'];
    for(let i=0; i < requiredFields.length; i++){
        const field = requiredFields[i]; 
        if(!(field in req.body)){
            const message = `Missing ${field} in request body`; 
            console.error(message); 
            return res.status(400).send(message);
        }
    }

    Story
        .create({
            title: req.body.title,
            story: req.body.story,
            user: req.user.id
        })
        .then(story => res.status(201).json(story.serialize())
        )
        .catch(err => {
        console.error(err); 
        res.status(500).json({
            error: 'Something went wrong'
        });
    });
});

//PUT ENDPOINT FOR STORIES

router.put('/:id', (req,res) => {
    console.log(req.params.id,req.body.id, req.body); 
    if(!(req.params.id && req.body.id && req.params.id  == req.body.id)) {
        res.status(400).json({
            error: 'Request path id and request body id values must match'
        });
    }

    const updated = {}; 
    const updatedFields = ['title', 'story']; 
    updatedFields.forEach(field => {
        if(field in req.body){
            updated[field] = req.body[field]; 
        } 
    });
    
    return Story
        .findByIdAndUpdate(req.params.id, {
            $set: updated 
        }, {
            new: true
        })
        .then(story => {
            console.log('in here:', story);
            res.status(204).end()
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'Something Went Wrong'
            })
        })
    })
;

//DELETE ENDPOINT FOR STORIES
router.delete('/:id', (req,res) => {
    Story
    .findByIdAndDelete(req.params.id)
    .then(() => {
        res.status(204).end(); 
    })
})

module.exports = router; 