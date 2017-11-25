/* Load configuration from .env file */
require('dotenv').config()
var express = require('express')
var router = express.Router()
var request = require('request-promise-native')
var talib = require('talib')

// MACD
function macd (values) {
    return new Promise((resolve, reject) => {
        talib.execute({
            name: "MACD",
            startIdx: 0,
            endIdx: values.length - 1,
            inReal: values,
            optInFastPeriod: 12,
            optInSlowPeriod: 26,
            optInSignalPeriod: 9
        }, function(err, res) {
            resolve({
                macd: res.result.outMACD,
                macd_signal: res.result.outMACDSignal,
                macd_hist: res.result.outMACDHist
            })
        })
    })
};

// RSI
function rsi (values) {
    return new Promise((resolve, reject) => {
        talib.execute({
            name: "RSI",
            startIdx: 0,
            endIdx: values.length - 1,
            inReal: values,
            optInTimePeriod: 14
        }, function (err, res) {
            resolve({
                rsi_data: res.result.outReal
            })
        })
    })
}

// Bollinger Bands
function bbands (values) {
    return new Promise((resolve, reject) => {
        talib.execute({
            name: "BBANDS",
            startIdx: 0,
            endIdx: values.length - 1,
            inReal: values,
            optInTimePeriod: 5,
            optInNbDevUp: 2,
            optInNbDevDn: 2,
            optInMAType: 0
        }, function (err, res) {
            resolve({
                bbands_hi: res.result.outRealUpperBand,
                bbands_mid: res.result.outRealMiddleBand,
                bbands_lo: res.result.outRealLowerBand
            })
        })
    })
}

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
        // Get detail and price of security
        let detail_p = request.get(detail_options)
        let price_p = request.get(price_options)
        let result = await Promise.all([detail_p, price_p])
        let details = result[0]
        let prices = result[1]
        let close_vals = prices.map(p => +p.price)

        // Process data to produce indices
        let macd_data_p = macd(close_vals)
        let rsi_p = rsi(close_vals)
        let bbands_p = bbands(close_vals)
        let indices = await Promise.all([macd_data_p, rsi_p, bbands_p])
        let macd_data = indices[0]
        let rsi_data = indices[1]
        let bbands_data = indices[2]

        // Combine processed data with prices
        let data = prices;
        data.forEach(function (d, i) {
            d.date = Date.parse(d.end_of_date);
            d.price = +d.price;
            d.rsi = rsi_data.rsi_data[i]
            d.bbands_hi = bbands_data.bbands_hi[i]
            d.bbands_mid = bbands_data.bbands_mid[i]
            d.bbands_lo = bbands_data.bbands_lo[i]
            d.macd = macd_data.macd[i]
            d.macd_signal = macd_data.macd_signal[i]
            d.macd_hist = macd_data.macd_hist[i]
        });
        return res.render('security_detail', {
            security: details,
            data: data,
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error retrieving security details for ' + req.params.figi_id)
    }
});


module.exports = router;
