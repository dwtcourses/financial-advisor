/* Load configuration from .env file */
require('dotenv').config()
console.log('REST API: ' + process.env.REST_HOST)
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
