/* Load configuration from .env file */
require('dotenv').config()
var express = require('express');
var router = express.Router();
var request = require('request-promise-native');

/* GET portfolios listing. */
router.get('/', async (req, res, next) => {
    let options = {
        uri: process.env.REST_HOST + '/portfolios',
        json: true
    }
    try {
        result = await request.get(options);
        res.render('portfolios', { portfolios: result });
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error getting portfolios')
    }
});

/* GET portfolio details */
router.get('/:portfolio_id', async (req, res, next) => {
    let options = {
        uri: process.env.REST_HOST + '/portfolios/' + req.params.portfolio_id,
        json: true
    }
    try {
        result = await request.get(options);
        res.render('portfolio_detail', { portfolio: result });
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error getting portfolio ' + portfolio_id)
    }
});

module.exports = router;
