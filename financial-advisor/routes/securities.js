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
router.get('/detail/:figi_id', async (req, res, next) => {
    let options = {
        uri: process.env.REST_HOST + '/securities/' + req.params.figi_id,
        json: true
    }
    try {
        result = await request.delete(options)
        res.render('security_detail', { security: result });
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error deleting recommendation ' + req.params.recommendation_id)
    }
});


module.exports = router;
