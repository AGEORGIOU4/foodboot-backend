const express = require('express');
const router = express.Router();

const sequelize = require('../db/configDB');

const Client = require('../concepts/Client');

// Add headers to allow API calls before the routes are defined
router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

router.get('/clients', (req, res) => {
    Client.findAll()
        .then(clients => {
            res.status(200)
                .setHeader('content-type', 'application/json')
                .send(clients); // body is JSON
        })
        .catch(error => {
            res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});

router.post('/clients/create', (req, res) => {
    const posted_client = req.body; // submitted client

    return sequelize.transaction(async (t) => {
        // invalid client posted
        if (!posted_client.name || !posted_client.surname || !posted_client.email || !posted_client.phone || !posted_client.dob) {
            res.status(422)
                .setHeader('content-type', 'application/json')
                .send({error: `Bad request - All fields must be completed`}); // bad request
        }

        return Client.create({
            name: posted_client.name,
            surname: posted_client.surname,
            email: posted_client.email,
            phone: posted_client.phone,
            dob: posted_client.dob,
        }, {transaction: t})
            .then(client => {
                res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({message: `Client added`, client: client}); // body is JSON
            })
            .catch(error => {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    res.status(409)
                        .setHeader('content-type', 'application/json')
                        .send({error: `Client with this email already exists!`}); // resource already exists
                }
            });
    })
        .catch(error => {
            res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});

router.put('/clients/update/:id', (req, res) => {
    const {id} = req.params; // get id from URI
    const posted_client = req.body; // submitted client

    return sequelize.transaction(async (t) => {
        if (isNaN(id)) {
            return res.status(422)
                .setHeader('content-type', 'application/json')
                .send({message: `ID is non-numeric`});
        }

        const client = await Client.findOne({where: {id: id}})

        if (!client) { // client not found
            return res.status(404)
                .setHeader('content-type', 'application/json')
                .send({error: `Client with id ${id} not found`});
        }

        // client found
        if (posted_client)
            client.name = posted_client.name;

        if (posted_client.surname)
            client.surname = posted_client.surname;

        if (posted_client)
            client.email = posted_client.email;

        if (posted_client.phone)
            client.phone = posted_client.phone;

        if (posted_client.dob)
            client.dob = posted_client.dob;

        return client.save({transaction: t})
            .then(client => {
                res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({message: `Client updated`, client: client}); // body is JSON
            })
            .catch(error => {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    res.status(409)
                        .setHeader('content-type', 'application/json')
                        .send({error: `Client with this email already exists!`}); // resource already exists
                }
            });
    })
        .catch(error => {
            res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});

router.delete('/clients/delete/:id', (req, res) => {
    const {id} = req.params; // get client id from URI

    return sequelize.transaction(async (t) => {

        const client = await Client.findOne({where: {id: id}})

        if (!client) {
            return res.status(404)
                .setHeader('content-type', 'application/json')
                .send({error: `Client not found for id ${id}`});
        }

        // client found
        return client.destroy({transaction: t})
            .then(client => {
                res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({message: `Client deleted`, client: client});
            })
    })
        .catch(error => {
            res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});


module.exports = router;