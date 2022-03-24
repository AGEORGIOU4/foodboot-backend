const express = require('express');
const router = express.Router();

const db = require('../db/configDB');

const Food_Combination = require("../concepts/Food_Combination");
const Meal_Plan = require("../concepts/Meal_Plan");

// Add headers to allow API calls before the routes are defined
router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

/*-----------FOOD COMBINATION------------*/

router.get('/meal-plans/food-combinations/:id', (req, res) => {
    const {id} = req.params; // extract 'id' from request

    if (isNaN(id)) {
        return res.status(422)
            .setHeader('content-type', 'application/json')
            .send({error: `ID is non-numeric!`});
    }

    Food_Combination.findAll({where: {meal_plan_id: id}, order: [['start', 'ASC']]})
        .then(food_combination => {
            if (!food_combination) {
                return res.status(404)
                    .setHeader('content-type', 'application/json')
                    .send({error: `Food Combination not found for Meal Plan with id: ${id}!`});
            }

            // food_combination found
            return res.status(200)
                .setHeader('content-type', 'application/json')
                .send(food_combination); // body is JSON
        })
        .catch(error => {
            res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});

router.put('/meal-plans/food-combinations/update/:id', (req, res) => {
    const {id} = req.params; // get id from URI
    const posted_food_combination = req.body; // submitted food_combination

    if (!id || !posted_food_combination.meal_plan_id || !posted_food_combination.title || !posted_food_combination.portion || !posted_food_combination.start ||!posted_food_combination.end || !posted_food_combination.typeOfMeal) {
        return res.status(422)
            .setHeader('content-type', 'application/json')
            .send({error: `Bad request - All fields must be completed!`}); // bad request
    }

    Meal_Plan.findOne({where: {id: posted_food_combination.meal_plan_id}}).then(meal_plan => {
        if (!meal_plan) {
            return res.status(404)
                .setHeader('content-type', 'application/json')
                .send({error: `Invalid meal plan for id: ${id}!`});
        }
    })

    Food_Combination.findOne({where: {id: id}}).then(food_combination => {
        if (!food_combination) { // food_combination not found (Create new)
            Food_Combination.create({
                id: id,
                meal_plan_id: posted_food_combination.meal_plan_id,
                title: posted_food_combination.title,
                portion: posted_food_combination.portion,
                start: posted_food_combination.start,
                end: posted_food_combination.end,
                typeOfMeal: posted_food_combination.typeOfMeal,
            })
                .then(food_combination => {
                    return res.status(200)
                        .setHeader('content-type', 'application/json')
                        .send({message: `Food Combination added!`, food_combination: food_combination}); // body is JSON
                });
        } else {
            //  food combination found
            food_combination.meal_plan_id = posted_food_combination.meal_plan_id;
            food_combination.title = posted_food_combination.title;
            food_combination.portion = posted_food_combination.portion;
            food_combination.start = posted_food_combination.start;
            food_combination.end = posted_food_combination.end;
            food_combination.typeOfMeal = posted_food_combination.typeOfMeal;

            food_combination.save()
                .then(food_combination => {
                    return res.status(200)
                        .setHeader('content-type', 'application/json')
                        .send({message: `Food Combination updated!`, food_combination: food_combination}); // body is JSON
                }).catch(error => {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    res.status(409)
                        .setHeader('content-type', 'application/json')
                        .send({error: `Food combination already recorded!`}); // resource already exists
                }
            })
        }

    }).catch(error => {
        return res.status(500)
            .setHeader('content-type', 'application/json')
            .send({error: `Server error: ${error.name}`});
    });
});

router.delete('/meal-plans/food-combinations/delete/:id', (req, res) => {
    const {id} = req.params; // get meal plan id from URI

    return db.transaction(async (t) => {

        const food_combination = await Food_Combination.findOne({where: {id: id}})

        if (!food_combination) {
            return res.status(404)
                .setHeader('content-type', 'application/json')
                .send({error: `Food Combination not found for id: ${id}!`});
        }

        // food_combination found
        return food_combination.destroy({transaction: t})
            .then(food_combination => {
                res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({message: `Food combination deleted!`, food_combination: food_combination});
            })
    })
        .catch(error => {
            return res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});


module.exports = router;

