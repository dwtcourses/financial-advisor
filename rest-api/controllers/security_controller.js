/* security controller */

/* List all securities */
exports.list_all_securities = async (req, res) => {
    try {
        let query_result = await req.app.get('db').security.get_all(req.query.name, req.query.ticker)
        return res.json(query_result.rows)
        //TODO: Paging
    } catch (err) {
        console.log (err)
        return res.status(500).json('Error retrieving all securities')
    }
}

/* List aggregated data */
exports.list_top_gainers = async (req, res) => {
    try {
        let query_result = await req.app.get('db').security.get_top_gainers(req.query.date)
        return res.json(query_result.rows)
    } catch (err) {
        console.log (err)
        return res.status(500).json('Error retrieving top securities')
    }
}

exports.list_top_losers = async (req, res) => {
    try {
        let query_result = await req.app.get('db').security.get_top_losers(req.query.date)
        return res.json(query_result.rows)
    } catch (err) {
        console.log (err)
        return res.status(500).json('Error retrieving top securities')
    }
}

/* Retrieve a single security */
exports.read_security = async (req, res) => {
    try {
        let query_result = await req.app.get('db').security.get(req.params.figi_id)
        return res.json(query_result.rows[0])
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error retrieving security')
    }
}

/* Retrieve prices for single security*/
exports.list_security_prices = async (req, res) => {
    try {
        let query_result = await req.app.get('db').security.get_price(req.params.figi_id)
        return res.json(query_result.rows)
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error retrieving security prices')
    }
}

