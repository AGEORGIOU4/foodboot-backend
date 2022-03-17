const express = require('express');
const router = express.Router();

const db = require('../db/configDB');

// const Calendar = require('../concepts/Calendar');
// const Calendar_Event = require("../concepts/Calendar_Event");
// const Client = require("../concepts/Client");

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

// Get Calendar by User
router.get('/calendars/:user', (req, res) => {
    const {user} = req.params; // extract 'id' from request

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

/*-----------CALENDAR EVENT------------*/

// Get All Calendar Events by Calendar Email (user-email)
router.get('/calendars/calendar-events/:user', (req, res) => {
    const {user} = req.params; // extract 'user_email' from request

    Calendar_Event.findAll({where: {user_email: user}})
        .then(calendar_event => {
            if (!calendar_event) {
                return res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send(calendar_event); // body is JSON
            }

            // calendar_event found
            return res.status(200)
                .setHeader('content-type', 'application/json')
                .send(calendar_event); // body is JSON
        })
        .catch(error => {
            res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});

router.post('/calendars/calendar-events/create', (req, res) => {
    const posted_calendar_event = req.body; // submitted calendar_event

    if (!posted_calendar_event) {
        res.status(400)
            .setHeader('content-type', 'application/json')
            .send({
                error: `Bad request - User email, event title and at least start, end or all day attribute must be completed!`
            }); // bad request
    } else {
        if (!posted_calendar_event.start) {
            posted_calendar_event.start = "";
        }
        if (!posted_calendar_event.end) {
            posted_calendar_event.end = "";
        }
        if (!posted_calendar_event.allDay) {
            posted_calendar_event.allDay = "";
        }

        Calendar_Event.create({
            id: posted_calendar_event.id,
            user_email: posted_calendar_event.user_email,
            title: posted_calendar_event.title,
            start: posted_calendar_event.start,
            end: posted_calendar_event.end,
            allDay: posted_calendar_event.allDay
        })
            .then(calendar_event => {
                res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({message: `Calendar Event added!`, calendar_event: calendar_event}); // body is JSON
            }).catch(error => {
            return res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
    }
});

router.put('/calendars/calendar-events/update/:id', (req, res) => {
    const {id} = req.params; // get id from URI
    const posted_calendar_event = req.body; // submitted client

    return db.transaction(async (t) => {

        const calendar_event = await Calendar_Event.findOne({where: {id: id}})

        if (!calendar_event) { // calendar_event not found
            return res.status(404)
                .setHeader('content-type', 'application/json')
                .send({error: `Calendar event with id ${id} not found!`});
        }

        // client found
        if (posted_calendar_event.title)
            calendar_event.title = posted_calendar_event.title;

        if (posted_calendar_event.start)
            calendar_event.start = posted_calendar_event.start;

        if (posted_calendar_event.end)
            calendar_event.end = posted_calendar_event.end;

        if (posted_calendar_event.allDay)
            calendar_event.allDay = posted_calendar_event.allDay;


        return calendar_event.save({transaction: t})
            .then(calendar_event => {
                res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({message: `Calendar event updated!`, calendar_event: calendar_event}); // body is JSON
            })
    })
        .catch(error => {
            res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});

router.delete('/calendars/calendar-events/delete/:id', (req, res) => {
    const {id} = req.params; // get client id from URI

    return db.transaction(async (t) => {

        const calendar_event = await Calendar_Event.findOne({where: {id: id}})

        if (!calendar_event) {
            return res.status(404)
                .setHeader('content-type', 'application/json')
                .send({error: `Calendar Event not found for id: ${id}!`});
        }

        // calendar_event found
        return calendar_event.destroy({transaction: t})
            .then(calendar_event => {
                res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({message: `Calendar Event deleted!`, calendar_event: calendar_event});
            })
    })
        .catch(error => {
            return res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
});


module.exports = router;

