const express = require('express')

const customers = require('./calls/customers.js');

const db = require('./db/configDB')

const app = express();
const PORT = process.env.PORT || 3000;

var bodyParser = require('body-parser')

app.use(bodyParser.json())

// Test DB
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err))

app.get("/", (req, res) => { res.send("Welcome to foodboot backend! Visit https://foodboot.netlify.app/") })
// Calls
app.use('/', customers);

app.listen(PORT, () => {
  console.log(`REST API app listening at http://localhost:${PORT}`)
});