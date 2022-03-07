const express = require('express');
const router = express.Router();

const sequelize = require('../db/configDB');

const Customer = require('../concepts/Customer');

// Add headers to allow API calls before the routes are defined
router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

router.get('/customers', (req, res) => {
    Customer.findAll()
        .then(customers => {
            res.status(200)
            res.setHeader('content-type', 'application/json')
                .send(customers); // body is JSON
        })
        .catch(error => {
            res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});

router.post('/customers/create', (req, res) => {
    const posted_customer = req.body; // submitted customer

    return sequelize.transaction(async (t) => {
        // invalid customer posted
        if (!posted_customer.name || !posted_customer.surname || !posted_customer.email || !posted_customer.phone || !posted_customer.dob) {
             res.status(422)
                .setHeader('content-type', 'application/json')
                .send({error: `Bad request - All fields must be completed`}); // bad request
        }

        return Customer.create({
            name: posted_customer.name,
            surname: posted_customer.surname,
            email: posted_customer.email,
            phone: posted_customer.phone,
            dob: posted_customer.dob,
        }, {transaction: t})
            .then(customer => {
                res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({message: `Customer added`, customer: customer}); // body is JSON
            })
            .catch(error => {
                if (error.name === 'SequelizeUniqueConstraintError') {
                     res.status(409)
                        .setHeader('content-type', 'application/json')
                        .send({error: `Customer with this email already exists!`}); // resource already exists
                }
            });
    })
        .catch(error => {
            res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});

module.exports = router;