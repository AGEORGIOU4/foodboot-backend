const express = require('express')

const clients = require('./calls/clients.js');

const db = require('./db/configDB');

const app = express();
const PORT = process.env.PORT || 5000;

const bodyParser = require('body-parser');
app.use(bodyParser.json())

// Test DB
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err))

//test
// Welcome Message
app.get("/", (req, res) => { res.send("Welcome to foodboot backend! Visit https://foodboot.netlify.app/") })

// Calls
app.use('/', clients);

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
});