/* Portfolio controller */

/* List all portfolios */
exports.list_all_portfolios = async (req, res) => {
    try {
        let query_result = await req.app.get('db').portfolio.get_all()
        return res.json(query_result.rows)
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error retrieving all portfolios')
    }
}

/* Create a single portfolio */
exports.create_portfolio = async (req, res) => {
    try {
        let query_result = await req.app.get('db').portfolio.insert(
            req.body.client_id,
            req.body.target_date,
            req.body.strategy
        )
        return res.json('Created portfolio')
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error creating portfolio')
    }
}

/* Retrieve a single portfolio */
exports.read_portfolio = async (req, res) => {
    try {
        let query_result = await req.app.get('db').portfolio.get(req.params.portfolio_id)
        return res.json(query_result.rows[0])
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error retrieving portfolio')
    }
}

/* Update a portfolio */
exports.update_portfolio = async (req, res) => {
    try {
        await req.app.get('db').portfolio.update(
            req.params.portfolio_id,
            req.body.target_date,
            req.body.strategy
            //TODO: Add and remove funds
        )
        return res.json('Successfully updated portfolio')
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error updating portfolio')
    }
}

/* Remove portfolio, only if there are no securities */
exports.remove_portfolio = async (req, res) => {
    try {
        await req.app.get('db').portfolio.delete(req.params.portfolio_id)
        return res.json('Successfully removed portfolio')
    } catch (err) {
        return res.status(500).json('Error removing portfolio')
    }
}
