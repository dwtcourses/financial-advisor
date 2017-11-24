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

/* GET client details */
router.get('/:client_id', async (req, res, next) => {
    let options = {
        uri: process.env.REST_HOST + '/clients/' + req.params.client_id,
        json: true
    }
    try {
        result = await request.get(options);
        res.render('client_detail', { client: result });
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error getting portfolio ' + client_id)
    }
});

/* POST update client details */
router.post('/:client_id', async (req, res, next) => {
    console.log(req.body)
    let options = {
        uri: process.env.REST_HOST + '/clients/' + req.params.client_id,
        form: req.body,
        json: true
    }
    try {
        result = await request.put(options)
        res.redirect('/clients/' + req.params.client_id)
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error updating client ' + client_id)
    }
});


module.exports = router;
