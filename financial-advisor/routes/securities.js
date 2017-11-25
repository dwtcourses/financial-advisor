/* Load configuration from .env file */
require('dotenv').config()
var express = require('express');
var router = express.Router();
var request = require('request-promise-native');

/* GET securities listing. */
router.get('/', async (req, res, next) => {
    let options = {
        uri: process.env.REST_HOST + '/securities',
        json: true
    }
    try {
        result = await request.get(options);
        res.render('securities', { securities: result });
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error getting recommendations')
    }
});


/* GET single security detail */
router.get('/details/:figi_id', async (req, res, next) => {
    let detail_options = {
        uri: process.env.REST_HOST + '/securities/' + req.params.figi_id,
        json: true
    }
    let price_options = {
        uri: process.env.REST_HOST + '/securities/' + req.params.figi_id + '/prices',
        json: true
    }
    try {
        detail_p = request.get(detail_options)
        price_p = request.get(price_options)
        Promise.all([detail_p, price_p]).then(values => {
            details = values[0]
            prices = values[1]
            return res.render('security_detail',
                {
                    security: details,
                    prices: prices
                })
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error retrieving security details for ' + req.params.figi_id)
    }
});


module.exports = router;
