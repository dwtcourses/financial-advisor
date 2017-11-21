var express = require('express');
var body_parser = require('body-parser')

app = express();
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());

port = 3001

// Import routes
var client_routes = require('./routes/client_routes')
var portfolio_routes = require('./routes/portfolio_routes')

// Register routes
client_routes(app);
portfolio_routes(app);

app.listen(port)

console.log("REST API on port " + port);