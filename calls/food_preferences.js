const express = require('express');
const router = express.Router();

const db = require('../db/configDB');

const Client = require('../concepts/Client');
const Food_Preference = require('../concepts/Food_Preference');

// Add headers to allow API calls before the routes are defined
router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

/*-----------FOOD PREFERENCE------------*/

router.get('/clients/food-preferences/:id', (req, res) => {
    const {id} = req.params; // extract 'id' from request

    if (isNaN(id)) {
        return res.status(422)
            .setHeader('content-type', 'application/json')
            .send({error: `ID is non-numeric!`});
    }

    Food_Preference.findAll({where: {client_id: id}})
        .then(food_preference => {
            if (!food_preference) {
                return res.status(404)
                    .setHeader('content-type', 'application/json')
                    .send({error: `Food Preferences not found for Client with id: ${id}!`});
            }

            // food_preferences found
            return res.status(200)
                .setHeader('content-type', 'application/json')
                .send(food_preference); // body is JSON
        })
        .catch(error => {
            res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});

router.put('/clients/food-preferences/update/:id', (req, res) => {
    const {id} = req.params; // get id from URI
    const posted_food_preference = req.body; // submitted medical_history

    return db.transaction(async (t) => {
        const client = await Client.findOne({where: {id: id}})

        if (!client) {
            return res.status(404)
                .setHeader('content-type', 'application/json')
                .send({error: `Invalid client for id: ${id}!`});
        }

        const food_preference = await Food_Preference.findOne({where: {client_id: id}})

        if (!food_preference) { // food_preference not found (Create new)
            return Food_Preference.create({
                client_id: id,
                value: posted_food_preference.value
            }, {transaction: t})
                .then(food_preference => {
                    res.status(200)
                        .setHeader('content-type', 'application/json')
                        .send({message: `Food Preferences added!`, food_preference: food_preference}); // body is JSON
                });
        } else {
            //  food preference found
            food_preference.client_id = posted_food_preference.id;
            food_preference.value = posted_food_preference.value;

            return food_preference.save({transaction: t})
                .then(food_preference => {
                    res.status(200)
                        .setHeader('content-type', 'application/json')
                        .send({message: `Food preferences updated!`, food_preference: food_preference}); // body is JSON
                })
        }
    }).catch(error => {
        return res.status(500)
            .setHeader('content-type', 'application/json')
            .send({error: `Server error: ${error.name}`});
    });
});

router.delete('/clients/food-preferences/delete/:id', (req, res) => {
    const {id} = req.params; // get client id from URI

    return db.transaction(async (t) => {

        const food_preference = await Food_Preference.findOne({where: {client_id: id}})

        if (!food_preference) {
            return res.status(404)
                .setHeader('content-type', 'application/json')
                .send({error: `Food Preferences not found for id: ${id}!`});
        }

        // food_preference found
        return food_preference.destroy({transaction: t})
            .then(food_preference => {
                res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({message: `Food Preferences deleted!`, food_preference: food_preference});
            })
    })
        .catch(error => {
            return res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});


module.exports = router;