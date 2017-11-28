/* Load configuration from .env file */
require('dotenv').config()
var express = require('express');
var router = express.Router();
var request = require('request-promise-native');

/* GET companies listing. */
router.get('/', async (req, res, next) => {
    let options = {
        uri: process.env.REST_HOST + '/companies',
        json: true
    }
    try {
        result = await request.get(options);
        res.render('companies', { companies: result });
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error getting companies')
    }
});

module.exports = router;
