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

module.exports = router;

