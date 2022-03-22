const express = require('express')

const clients = require('./calls/clients.js');
const medical_histories = require('./calls/medical_histories.js');
const food_preferences = require('./calls/food_preferences.js');
const food_options = require('./calls/food_options.js');
const calendars = require('./calls/calendars.js');
const calendar_events = require('./calls/calendar_events.js');
const meal_plans = require('./calls/meal_plans.js');
const food_combinations = require('./calls/food_combinations.js');

const db = require('./db/configDB');

const app = express();
const PORT = process.env.PORT || 5000;

const bodyParser = require('body-parser');
app.use(bodyParser.json())

// Test DB
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err))

// Welcome Message
app.get("/", (req, res) => { res.send("Welcome to foodboot backend! Visit https://foodboot.netlify.app/") })

// Calls
app.use('/', clients);
app.use('/', medical_histories);
app.use('/', food_preferences);
app.use('/', food_options);
app.use('/', calendars);
app.use('/', calendar_events);
app.use('/', meal_plans);
app.use('/', food_combinations);

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
});