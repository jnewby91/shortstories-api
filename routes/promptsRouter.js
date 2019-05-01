const express = require('express');
const router = express.Router();
const passport = require('passport'); 
const mongoose = require('mongoose'); 
mongoose.Promise = global.Promise; 

const {DATABASE_URL, PORT} = require('../config');
const {Prompt} = require('../models'); 
const jwtAuth = passport.authenticate('jwt', {session: false});

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
                user: prompt.user, 
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
router.post('/', jwtAuth, (req, res) => {
    console.log(req.body);
    const requiredFields=['title','scenario', 'category'];
    for(let i=0; i < requiredFields.length; i++){
        const field = requiredFields[i]; 
        if(!(field in req.body)){
            const message = `Missing ${field} in request body`; 
            console.error(message); 
            return res.status(400).send(message);
        }
    }
//find the user first 
//then write to the array of prompts for that user

    Prompt
        .create({
            title: req.body.title,
            user: req.user.id,
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

//PUT ENDPOINT FOR PROMPTS

// router.put('/:id', jwtAuth, (req,res) => {
//     const requireFields = ['title', 'scenario', 'category']; 
//     for(i=0; i < requiredFields.length; i++){
//         const field = requireFields[i]; 
//         if (!(field in req.body)) {
//             const message = `Missing\ ${field} \ in request body`; 
//             console.err(message); 
//             return res.status(400).send(message); 
//         }

//     const updated = {}; 
//     const updatedFields = ['title', 'story', 'id', 'email']; 
//     updatedFields.forEach(field => {
//         if(field in req.body) {
//             updated[field] = req.body[field];  
//         }
//     });

//     return User.findByIdAndUpdate( req.params.id, {$set:updated}, {new: true})
//     .then(user => {


//     })
        
//     }
// })


//DELETE ENDPOINT FOR PROMPTS
router.delete('/:id', (req,res) => {
    Prompt
    .findByIdAndDelete(req.params.id)
    .then(() => {
        res.status(204).end(); 
    })
})


module.exports = router; 