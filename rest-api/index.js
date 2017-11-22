// Use .env file
require('dotenv').config()

var express = require('express');
var body_parser = require('body-parser')

app = express();
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());

// Open database connection and set as part of app context
const { Pool, Client } = require('pg')
const db_pool = new Pool()
const MyDAO = require('./database/dao.js')
const my_dao = new MyDAO(db_pool)
app.set('db', my_dao)

// Import and register routes
require('./routes/client_routes')(app)
require('./routes/portfolio_routes')(app)

// Start server
port = 3001
app.listen(port)
console.log("REST API on port " + port);