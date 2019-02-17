const express = require('express');
const router = express.Router();

const mongoose = require('mongoose'); 
mongoose.Promise = global.Promise; 

const {DATABASE_URL, PORT} = require('../config');
const {Prompt} = require('../models'); 

//GET endpoint that returns all the users in the database
router.get('/', (req, res) => {
    Prompt
    .find({})
    .then(prompts => (
        res.json(
            prompts.map(prompt => {
            return{
                id: prompt.id, 
                title: prompt.title,
                scenario: prompt.scenario,
                email: prompt.email, 
                category: prompt.category
            }
            console.log(prompts);
        }))
    ))
    .catch(err => {
        console.err(err); 
        res.status(500).json({
            error: `something went wrong`
        });
    });
});

//GET endpoint that returns a single prompt in the database
router.get('/:id', (req,res) => {
    Prompt
    .findById(req.params.id)
        .then(prompt => res.json(prompt.serialize()))
        .catch(err => {
            console.error(err); 
            res.status(500).json({
                error: 'something went wrong'
            });
        })
    });

//POST endpoint that creates writing prompts 
router.post('/', (req, res) => {
    console.log(req.body);
    const requiredFields=['title','email', 'scenario', 'category'];
    for(let i=0; i < requiredFields.length; i++){
        const field = requiredFields[i]; 
        if(!(field in req.body)){
            const message = `Missing ${field} in request body`; 
            console.error(message); 
            return res.status(400).send(message);
        }
    }

    Prompt
        .create({
            title: req.body.title,
            email: req.body.email,
            scenario: req.body.scenario,
            category: req.body.category,
        })
        .then(prompt => res.status(201).json(prompt.serialize())
        )
        .catch(err => {
        console.error(err); 
        res.status(500).json({
            error: 'Something went wrong'
        });
    });
});


//DELETE ENDPOINT FOR PROMPTS
router.delete('/:id', (req,res) => {
    Prompt
    .findByIdAndDelete(req.params.id)
    .then(() => {
        res.status(204).end(); 
    })
})


module.exports = router; 