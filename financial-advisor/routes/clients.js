/* Load configuration from .env file */
require('dotenv').config()
var express = require('express');
var router = express.Router();
var request = require('request-promise-native');

/* GET clients listing. */
router.get('/', async (req, res, next) => {
    let options = {
        uri: process.env.REST_HOST + '/clients',
        json: true
    }
    try {
        result = await request.get(options);
        res.render('clients', { clients: result });
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error getting clients')
    }
});

/* GET clients add new page */
router.get('/add', async (req, res, next) => {
    return res.render('client_add', {url: '/clients/add'})
});

/* POST create new client */
router.post('/add', async (req, res, next) => {
    console.log(req.body)
    let options = {
        uri: process.env.REST_HOST + '/clients',
        form: req.body,
        json: true
    }
    try {
        result = await request.post(options)
        res.redirect('/clients/')
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error creating client')
    }
});


/* GET client details */
router.get('/details/:client_id', async (req, res, next) => {
    let options = {
        uri: process.env.REST_HOST + '/clients/' + req.params.client_id,
        json: true
    }
    try {
        result = await request.get(options);
        res.render('client_detail', { client: result });
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error getting clients')
    }
});

/* POST update client details */
router.post('/details/:client_id', async (req, res, next) => {
    console.log(req.body)
    let options = {
        uri: process.env.REST_HOST + '/clients/' + req.params.client_id,
        form: req.body,
        json: true
    }
    try {
        result = await request.put(options)
        res.redirect('/clients/details/' + req.params.client_id)
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error updating client ' + req.params.client_id)
    }
});

/* GET delete client */
router.get('/delete/:client_id', async (req, res, next) => {
    console.log('HELO')
    let options = {
        uri: process.env.REST_HOST + '/clients/' + req.params.client_id,
        json: true
    }
    try {
        result = await request.delete(options)
        res.redirect('/clients/')
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error deleting client ' + req.params.client_id)
    }
});

module.exports = router;
