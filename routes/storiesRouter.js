const express = require('express');
const router = express.Router();

const mongoose = require('mongoose'); 
mongoose.Promise = global.Promise; 

const {DATABASE_URL, PORT} = require('../config');
const {Story} = require('../models'); 

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

//POST endpoint that creates writing prompts 
router.post('/', (req, res) => {
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
            user: req.body.id
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

//DELETE ENDPOINT FOR STORIES
router.delete('/:id', (req,res) => {
    Story
    .findByIdAndDelete(req.params.id)
    .then(() => {
        res.status(204).end(); 
    })
})

module.exports = router; 