const express = require('express');
const router = express.Router();

const db = require('../db/configDB');
const Meal_Plan = require("../concepts/Meal_Plan");

// Add headers to allow API calls before the routes are defined
router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

/*-----------MEAL PLAN------------*/

router.get('/meal-plans', (req, res) => {
    Meal_Plan.findAll()
        .then(meal_plans => {
            return res.status(200)
                .setHeader('content-type', 'application/json')
                .send(meal_plans); // body is JSON
        })
        .catch(error => {
            return res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});

router.get('/meal-plans/:id', async (req, res) => {
    const {id} = req.params;

    const meal_plan = await Meal_Plan.findOne({where: {client_id: id}});

    if (!meal_plan) {
        return res.status(404)
            .setHeader('content-type', 'application/json')
            .send({error: `Meal Plan not found for  id: ${id}!`});
    }

    if (meal_plan) {
        return res.status(200)
            .setHeader('content-type', 'application/json')
            .send(meal_plan); // body is JSON
    }

    return res.status(500)
        .setHeader('content-type', 'application/json')
        .send({error: `Server error: ${error.name}`});
});

router.put('/meal-plans/update', (req, res) => {
    const posted_meal_plan = req.body; // submitted meal plan

    return db.transaction(async (t) => {
        // invalid meal plan posted
        if (!posted_meal_plan.client_id || !posted_meal_plan.client_first_name || !posted_meal_plan.client_last_name || !posted_meal_plan.date || !posted_meal_plan.age || !posted_meal_plan.weight || !posted_meal_plan.notes) {
            return res.status(422)
                .setHeader('content-type', 'application/json')
                .send({error: `Bad request - All fields are required!`}); // bad request
        }

        const meal_plan = await Meal_Plan.findOne({where: {client_id: posted_meal_plan.client_id}})

        if(! meal_plan) {

            return Meal_Plan.create({
                client_id: posted_meal_plan.client_id,
                client_first_name: posted_meal_plan.client_first_name,
                client_last_name: posted_meal_plan.client_last_name,
                date: posted_meal_plan.date,
                age: posted_meal_plan.age,
                weight: posted_meal_plan.weight,
                notes: posted_meal_plan.notes,
            }, {transaction: t})
                .then(meal_plan => {
                    return res.status(200)
                        .setHeader('content-type', 'application/json')
                        .send({message: `Meal plan created!`, meal_plan: meal_plan}); // body is JSON
                })
                .catch(error => {
                    if (error.name === 'SequelizeUniqueConstraintError') {
                        return res.status(409)
                            .setHeader('content-type', 'application/json')
                            .send({error: `Meal plan for client already exists!`}); // resource already exists
                    }
                });
        }

        meal_plan.client_id = posted_meal_plan.client_id;
        meal_plan.client_first_name = posted_meal_plan.client_first_name;
        meal_plan.client_last_name = posted_meal_plan.client_last_name;
        meal_plan.date = posted_meal_plan.date;
        meal_plan.age = posted_meal_plan.age;
        meal_plan.weight = posted_meal_plan.weight;
        meal_plan.notes = posted_meal_plan.notes;

        return meal_plan.save({transaction: t})
            .then(meal_plan => {
                res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({message: `Meal Plan updated`, meal_plan: meal_plan}); // body is JSON
            })
    })
        .catch(error => {
            return res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});

router.delete('/meal-plans/delete/:id', (req, res) => {
    const {id} = req.params; // get meal plan id from URI

    return db.transaction(async (t) => {

        const meal_plan = await Meal_Plan.findOne({where: {id: id}})

        if (!meal_plan) {
            return res.status(404)
                .setHeader('content-type', 'application/json')
                .send({error: `Meal plan not found for id ${id}!`});
        }

        // meal plan found
        return meal_plan.destroy({transaction: t})
            .then(meal_plan => {
                res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({message: `Meal plan deleted!`, meal_plan: meal_plan});
            })
    })
        .catch(error => {
            res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});


module.exports = router;

