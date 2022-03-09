const express = require('express');
const router = express.Router();

const {sequelize} = require('../db/configDB');
const db = sequelize();

const Client = require('../concepts/Client');
const Medical_History = require('../concepts/Medical_History');

// Add headers to allow API calls before the routes are defined
router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

/*-----------CLIENT------------*/

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

    return db.transaction(async (t) => {
        // invalid client posted
        if (!posted_client.first_name || !posted_client.last_name || !posted_client.dob || !posted_client.email || !posted_client.phone || !posted_client.address || !posted_client.food_allergies) {
            return res.status(422)
                .setHeader('content-type', 'application/json')
                .send({error: `Bad request - All fields must be completed`}); // bad request
        }

        return Client.create({
            first_name: posted_client.first_name,
            last_name: posted_client.last_name,
            dob: posted_client.dob,
            email: posted_client.email,
            phone: posted_client.phone,
            address: posted_client.address,
            food_allergies: posted_client.food_allergies,
        }, {transaction: t})
            .then(client => {
                return res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({message: `Client added`, client: client}); // body is JSON
            })
            .catch(error => {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    return res.status(409)
                        .setHeader('content-type', 'application/json')
                        .send({error: `Client with this email already exists!`}); // resource already exists
                }
            });
    })
        .catch(error => {
            return res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});

router.put('/clients/update/:id', (req, res) => {
    const {id} = req.params; // get id from URI
    const posted_client = req.body; // submitted client

    return db.transaction(async (t) => {
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
        if (posted_client.first_name)
            client.first_name = posted_client.first_name;

        if (posted_client.last_name)
            client.last_name = posted_client.last_name;

        if (posted_client.dob)
            client.dob = posted_client.dob;

        if (posted_client.email)
            client.email = posted_client.email;

        if (posted_client.phone)
            client.phone = posted_client.phone;

        if (posted_client.address)
            client.address = posted_client.address;

        if (posted_client.food_allergies)
            client.food_allergies = posted_client.food_allergies;

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

    return db.transaction(async (t) => {

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


/*-----------MEDICAL HISTORY------------*/

router.get('/clients/medical-histories', (req, res) => {
    Medical_History.findAll()
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

router.get('/clients/medical-histories/:id', (req, res) => {
    const {id} = req.params; // extract 'id' from request

    if (isNaN(id)) {
        return res.status(422)
            .setHeader('content-type', 'application/json')
            .send({message: `ID is non-numeric`});
    }

    Medical_History.findOne({where: {client_id: id}})
        .then(medical_history => {
            if (!medical_history) {
                return res.status(404)
                    .setHeader('content-type', 'application/json')
                    .send({message: `Medical History not found for Client with id: ${id}`});
            }

            // medical_history found
            return res.status(200)
                .setHeader('content-type', 'application/json')
                .send(medical_history); // body is JSON
        })
        .catch(error => {
            res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});

router.post('/clients/medical-histories/create', (req, res) => {
    const posted_medical_history = req.body; // submitted client

    return db.transaction(async (t) => {
        // invalid medical history posted
        if (!posted_medical_history.client_id || !posted_medical_history.date || !posted_medical_history.height || !posted_medical_history.weight) {
            return res.status(422)
                .setHeader('content-type', 'application/json')
                .send({error: `Bad request - All fields must be completed`}); // bad request
        }

        return Client.findOne({where: {id: posted_medical_history.client_id}})
            .then(medical_history => {
                if (!medical_history) {
                    return res.status(404)
                        .setHeader('content-type', 'application/json')
                        .send({message: `Client does not exist for id: ${posted_medical_history.client_id}`});
                } else {
                    return Medical_History.create({
                        client_id: posted_medical_history.client_id,
                        date: posted_medical_history.date,
                        height: posted_medical_history.height,
                        weight: posted_medical_history.weight,
                    }, {transaction: t})
                        .then(medical_history => {
                            res.status(200)
                                .setHeader('content-type', 'application/json')
                                .send({message: `Medical History added`, medical_history: medical_history}); // body is JSON
                        })
                        .catch(error => {
                            if (error.name === 'SequelizeUniqueConstraintError') {
                                res.status(409)
                                    .setHeader('content-type', 'application/json')
                                    .send({error: `Medical history for this client already exists!`}); // resource already exists
                            }
                        });
                }
            })
    })
        .catch(error => {
            res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});

router.put('/clients/medical-histories/update/:id', (req, res) => {
    const {id} = req.params; // get id from URI
    const posted_medical_history = req.body; // submitted client

    return db.transaction(async (t) => {
        if (isNaN(id)) {
            return res.status(422)
                .setHeader('content-type', 'application/json')
                .send({message: `ID is non-numeric`});
        }

        const medical_history = await Medical_History.findOne({where: {client_id: id}})

        if (!medical_history) { // medical_history not found
            return res.status(404)
                .setHeader('content-type', 'application/json')
                .send({error: `Medical History with id ${id} not found`});
        }

        // client found
        if (posted_medical_history.date)
            medical_history.date = posted_medical_history.date;

        if (posted_medical_history.height)
            medical_history.height = posted_medical_history.height;

        if (posted_medical_history.weight)
            medical_history.weight = posted_medical_history.weight;

        return medical_history.save({transaction: t})
            .then(medical_history => {
                res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({message: `Medical History updated`, medical_history: medical_history}); // body is JSON
            })
    })
        .catch(error => {
            return res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});

router.delete('/clients/medical-histories/delete/:id', (req, res) => {
    const {id} = req.params; // get client id from URI

    return db.transaction(async (t) => {

        const medical_history = await Medical_History.findOne({where: {client_id: id}})

        if (!medical_history) {
            return res.status(404)
                .setHeader('content-type', 'application/json')
                .send({error: `Medical History not found for client_id ${id}`});
        }

        // medical_history found
        return medical_history.destroy({transaction: t})
            .then(medical_history => {
                res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({message: `Medical history deleted`, medical_history: medical_history});
            })
    })
        .catch(error => {
            return res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});


module.exports = router;