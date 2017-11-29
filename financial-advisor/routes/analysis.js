/* Load configuration from .env file */
require('dotenv').config()
var express = require('express');
var router = express.Router();
var request = require('request-promise-native');

/* GET analysis data */
router.get('/', async (req, res, next) => {
    let date = new Date()
    date.setDate(date.getDate() - 28)
    let date_str = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()
    let gainer_options = {
        uri: process.env.REST_HOST + '/securities_analysis/top_gainers?date=' + date_str,
        json: true
    }
    let loser_options = {
        uri: process.env.REST_HOST + '/securities_analysis/top_losers?date=' + date_str,
        json: true
    }
    try {
        result = await Promise.all([request.get(gainer_options), request.get(loser_options)])
        res.render('analysis', { gainers: result[0], losers: result[1] });
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error getting analysis data')
    }
});

module.exports = router;

