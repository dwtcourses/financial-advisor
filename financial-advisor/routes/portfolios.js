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

/* GET portfolios add new page. */
router.get('/add', async (req, res, next) => {
    let options = {
        uri: process.env.REST_HOST + '/clients',
        json: true
    }
    try {
        clients = await request.get(options);
        return res.render('portfolio_add', {clients: clients, url: '/portfolios/add'})
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error getting clients')
    }
});

/* POST create new portfolio */
router.post('/add', async (req, res, next) => {
    let options = {
        uri: process.env.REST_HOST + '/portfolios',
        form: req.body,
        json: true
    }
    console.log(options)
    try {
        result = await request.post(options)
        res.redirect('/portfolios')
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error creating portfolio')
    }
});


/* GET portfolio details */
router.get('/details/:portfolio_id', async (req, res, next) => {
    let portfolio_options = {
        uri: process.env.REST_HOST + '/portfolios/' + req.params.portfolio_id,
        json: true
    }
    let portfolio_security_options = {
        uri: process.env.REST_HOST + '/portfolio_security/' + req.params.portfolio_id,
        json: true
    }
    try {
        result = await Promise.all([request.get(portfolio_options), request.get(portfolio_security_options)])
        res.render('portfolio_detail', { portfolio: result[0], portfolio_securities: result[1], put_url: '/portfolios/' + req.params.portfolio_id });
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error getting portfolio ' + portfolio_id)
    }
});

/* POST update portfolio details */
router.post('/details/:portfolio_id', async (req, res, next) => {
    console.log(req.body)
    let options = {
        uri: process.env.REST_HOST + '/portfolios/' + req.params.portfolio_id,
        form: req.body,
        json: true
    }
    try {
        result = await request.put(options)
        res.redirect('/portfolios/' + req.params.portfolio_id)
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error updating portfolio ' + req.params.portfolio_id)
    }
});

/* GET delete portfolio */
router.get('/delete/:portfolio_id', async (req, res, next) => {
    let options = {
        uri: process.env.REST_HOST + '/portfolios/' + req.params.portfolio_id,
        json: true
    }
    try {
        result = await request.delete(options)
        res.redirect('/portfolios/')
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error deleting client ' + req.params.portfolio_id)
    }
});


/* GET remove security portfolio */
router.get('/remove/:portfolio_id', async (req, res, next) => {
    console.log(req.params.portfolio_id)
    // Get client details
    let get_client_options = {
        uri: process.env.REST_HOST + '/clients/' + req.query.client_id,
        json: true
    }
    try {
        var client = await request.get(get_client_options);
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error getting client')
    }

    // Update client
    client.remaining_funds += req.params.total_value;
    let update_client_options = {
        uri: process.env.REST_HOST + '/clients/' + req.query.client_id,
        form: client,
        json: true
    }
    try {
        await request.put(update_client_options)
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error updating client ' + req.params.portfolio_id)
    }

    // Delete security
    let delete_security_options = {
        uri: process.env.REST_HOST + '/portfolio_security/' + req.params.portfolio_id,
        form: {'figi_id': req.query.figi_id},
        json: true
    }
    try {
        client = await request.delete(delete_security_options);
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error removing security')
    }

});



module.exports = router;
