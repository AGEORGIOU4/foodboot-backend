const express = require('express');
const router = express.Router();

const db = require('../db/configDB');

const Calendar = require('../concepts/Calendar');

// Add headers to allow API calls before the routes are defined
router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

/*-----------CALENDAR------------*/

router.get('/calendars', (req, res) => {
    Calendar.findAll()
        .then(calendars => {
            return res.status(200)
                .setHeader('content-type', 'application/json')
                .send(calendars); // body is JSON
        })
        .catch(error => {
            return res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});

router.get('/calendars/:user', (req, res) => {
    const {user} = req.params; // extract 'user' from request

    Calendar.findOne({where: {user_email: user}})
        .then(calendar => {
            if (!calendar) {
                return res.status(404)
                    .setHeader('content-type', 'application/json')
                    .send({error: `Calendar not found for  user_email: ${user}!`});
            }

            // calendar found
            return res.status(200)
                .setHeader('content-type', 'application/json')
                .send(calendar); // body is JSON
        })
        .catch(error => {
            res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});

router.post('/calendars/create', (req, res) => {
    const posted_calendar = req.body; // submitted calendar

    return db.transaction(async (t) => {
        // invalid calendar posted
        if (!posted_calendar.user_email) {
            return res.status(422)
                .setHeader('content-type', 'application/json')
                .send({error: `Bad request - User email is not valid!`}); // bad request
        }

        return Calendar.create({
            user_email: posted_calendar.user_email,
        }, {transaction: t})
            .then(calendar => {
                return res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({message: `Calendar created!`, calendar: calendar}); // body is JSON
            })
            .catch(error => {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    return res.status(409)
                        .setHeader('content-type', 'application/json')
                        .send({error: `Calendar for this user already exists!`}); // resource already exists
                }
            });
    })
        .catch(error => {
            return res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});

router.delete('/calendars/delete', (req, res) => {
    const {user_email} = req.body; // get calendar id from URI

    return db.transaction(async (t) => {

        const calendar = await Calendar.findOne({where: {user_email: user_email}})

        if (!calendar) {
            return res.status(404)
                .setHeader('content-type', 'application/json')
                .send({error: `Calendar not found for user_email ${user_email}!`});
        }

        // calendar found
        return calendar.destroy({transaction: t})
            .then(calendar => {
                res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({message: `Calendar deleted!`, calendar: calendar});
            })
    })
        .catch(error => {
            res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});


module.exports = router;

