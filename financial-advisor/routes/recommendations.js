/* Load configuration from .env file */
require('dotenv').config()
var express = require('express');
var router = express.Router();
var request = require('request-promise-native');

/* GET recommendations listing. */
router.get('/', async (req, res, next) => {
    let options = {
        uri: process.env.REST_HOST + '/recommendations',
        json: true
    }
    try {
        result = await request.get(options);
        res.render('recommendations', { recommendations: result });
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error getting recommendations')
    }
});

/* GET recommendations add new page. */
router.get('/add', async (req, res, next) => {
    let client_options = {
        uri: process.env.REST_HOST + '/clients',
        json: true
    }
    let portfolio_options = {
        uri: process.env.REST_HOST + '/portfolios',
        json: true
    }
    let security_options = {
        uri: process.env.REST_HOST + '/securities',
        json: true
    }
    try {
        client_p = request.get(client_options);
        portfolio_p = request.get(portfolio_options);
        security_p = request.get(security_options);
        Promise.all([client_p, portfolio_p, security_p]).then(values => {
            clients = values[0]
            portfolios = values[1]
            securities = values[2]
            transaction_types = ['Buy', 'Sell']
            return res.render('recommendation_add',
                {
                    clients: clients,
                    portfolios: portfolios,
                    securities: securities,
                    transaction_types: transaction_types,
                    url: '/recommendations/add'
                })
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error getting clients or portfolios')
    }
});

/* POST create new recommendation */
router.post('/add', async (req, res, next) => {
    console.log(req.body)
    let options = {
        uri: process.env.REST_HOST + '/recommendations',
        form: req.body,
        json: true
    }
    try {
        result = await request.post(options)
        res.redirect('/recommendations')
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error creating recommendation')
    }
});

/* GET delete recommendation */
router.get('/delete/:recommendation_id', async (req, res, next) => {
    let options = {
        uri: process.env.REST_HOST + '/recommendations/' + req.params.recommendation_id,
        json: true
    }
    try {
        result = await request.delete(options)
        res.redirect('/recommendations')
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error deleting recommendation ' + req.params.recommendation_id)
    }
});

module.exports = router;
