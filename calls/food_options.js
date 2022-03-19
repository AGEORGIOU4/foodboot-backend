const express = require('express');
const router = express.Router();

const db = require('../db/configDB');

const Food_Option= require('../concepts/Food_Option');

// Add headers to allow API calls before the routes are defined
router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

/*-----------FOOD OPTION------------*/

router.get('/food-options', (req, res) => {
    Food_Option.findAll()
        .then(food_options => {
            return res.status(200)
                .setHeader('content-type', 'application/json')
                .send(food_options); // body is JSON
        })
        .catch(error => {
            return res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});

router.post('/food-options/create', (req, res) => {
    const posted_food_option = req.body; // submitted food option

    return db.transaction(async (t) => {
        // invalid food option posted
        if (!posted_food_option.value || !posted_food_option.text || !posted_food_option.label) {
            return res.status(422)
                .setHeader('content-type', 'application/json')
                .send({error: `Bad request - All fields are required!`}); // bad request
        }

        return Food_Option.create({
            value: posted_food_option.value,
            text: posted_food_option.text,
            label: posted_food_option.label,
        }, {transaction: t})
            .then(food_option => {
                return res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({message: `Food option created!`, food_option: food_option}); // body is JSON
            })
            .catch(error => {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    return res.status(409)
                        .setHeader('content-type', 'application/json')
                        .send({error: `Food option already exists!`}); // resource already exists
                }
            });
    })
        .catch(error => {
            return res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});

router.delete('/food-options/delete/:id', (req, res) => {
    const {id} = req.params; // get food option id from URI

    return db.transaction(async (t) => {

        const food_option = await Food_Option.findOne({where: {id: id}})

        if (!food_option) {
            return res.status(404)
                .setHeader('content-type', 'application/json')
                .send({error: `Food option not found for id ${id}!`});
        }

        // food option found
        return food_option.destroy({transaction: t})
            .then(food_option => {
                res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({message: `Food option deleted!`, food_option: food_option});
            })
    })
        .catch(error => {
            res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});


module.exports = router;

