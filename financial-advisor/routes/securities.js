/* Load configuration from .env file */
require('dotenv').config()
var express = require('express')
var router = express.Router()
var request = require('request-promise-native')
var talib = require('talib')

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

            // Conver to decimals
            close_vals = prices.map(p => +p.price)

            // Process data to produce indices

            // MACD
            talib.execute({
                name: "MACD",
                startIdx: 0,
                endIdx: close_vals.length - 1,
                inReal: close_vals,
                optInFastPeriod: 12,
                optInSlowPeriod: 26,
                optInSignalPeriod: 9
            }, function (err, res) {
                macd_data = {
                    macd: res.result.outMACD,
                    macd_signal: res.result.outMACDSignal,
                    macd_hist: res.result.outMACDHist
                }
            });

            // RSI
            talib.execute({
                name: "RSI",
                startIdx: 0,
                endIdx: close_vals.length - 1,
                inReal: close_vals,
                optInTimePeriod: 14
            }, function (err, res) {
                rsi_data = res.result.outReal
            });

            // Bollinger Bands
            talib.execute({
                name: "BBANDS",
                startIdx: 0,
                endIdx: close_vals.length - 1,
                inReal: close_vals,
                optInTimePeriod: 5,
                optInNbDevUp: 2,
                optInNbDevDn: 2,
                optInMAType: 0
            }, function (err, res) {
                bband_data = {
                    bband_hi: res.result.outRealUpperBand,
                    bband_mid: res.result.outRealMiddleBand,
                    bband_lo: res.result.outRealLowerBand
                }
            })

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
