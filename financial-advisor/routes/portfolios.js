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
    let security_options = {
        uri: process.env.REST_HOST + '/securities/',
        json: true
    }
    try {
        result = await Promise.all([
            request.get(portfolio_options),
            request.get(portfolio_security_options),
            request.get(security_options)
        ])
        res.render('portfolio_detail', {
            portfolio: result[0],
            portfolio_securities: result[1],
            securities: result[2],
            update_url: '/portfolios/' + req.params.portfolio_id,
            buy_security_url: '/portfolios/add/' + req.params.portfolio_id + '?client_id=' + result[0].client_id,
        });
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
    client.remaining_funds = (+(client.remaining_funds) + +(req.query.total_value)).toFixed(2)
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

    //TODO: Use POST and prevent spurious money

    // Delete security
    let delete_security_options = {
        uri: process.env.REST_HOST + '/portfolio_security/' + req.params.portfolio_id,
        form: {'figi_id': req.query.figi_id},
        json: true
    }
    try {
        client = await request.delete(delete_security_options);
        res.redirect('/portfolios/details/' + req.params.portfolio_id)
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error removing security')
    }

});


/* GET remove security portfolio */
router.post('/add/:portfolio_id', async (req, res, next) => {
    // Get recent price for security
    let get_security_details = {
        uri: process.env.REST_HOST + '/securities/' + req.body.figi_id,
        form: client,
        json: true
    }
    try {
        var security = await request.get(get_security_details)
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error updating client ' + req.params.portfolio_id)
    }

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
    client.remaining_funds = (+(client.remaining_funds) - (+(req.body.quantity) * +(security.price))).toFixed(2)
    // Don't buy if not enough remaining funds
    if (client.remaining_funds < 0) {
        return res.redirect('/portfolios/details/' + req.params.portfolio_id)
    }

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

    req.body.purchase_price = security.price
    req.body.portfolio_id = req.params.portfolio_id

    // Insert security
    let insert_security_options = {
        uri: process.env.REST_HOST + '/portfolio_security/' + req.params.portfolio_id,
        form: req.body,
        json: true
    }
    console.log(insert_security_options)
    try {
        client = await request.post(insert_security_options);
        res.redirect('/portfolios/details/' + req.params.portfolio_id)
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error adding security')
    }
});


module.exports = router;
