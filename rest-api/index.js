/**
 * Main Node.js index file
 */

/* Load configuration from .env file */
require('dotenv').config()

/* Import required libraries */
var express = require('express');
var body_parser = require('body-parser')

/* Instantiate express app */
app = express();

/* Accept url encoding and json payload */
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());

/* Open database connection and set as part of app context */
const { Pool, Client } = require('pg')
const MyDAO = require('./database/dao.js')
const my_dao = new MyDAO(new Pool())
app.set('db', my_dao)

/* Import and register routes */
require('./routes/client_routes')(app)
require('./routes/portfolio_routes')(app)

/* Start server */
port = 3001
app.listen(port)
console.log("REST API on port " + port);