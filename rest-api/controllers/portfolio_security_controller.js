/* Portfolio security controller */

/** List all portfolio security */
exports.list_all_portfolio_security = async (req, res) => {
    try {
        let query_result = await req.app.get('db').portfolio_security.get_all(req.params.portfolio_id)
        return res.json(query_result.rows)
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error retrieving portfolio securities')
    }
}

/** Create a portfolio security and insert into database */
exports.create_portfolio_security = async (req, res) => {
    try {
        let query_result = await req.app.get('db').portfolio_security.insert(
            req.params.portfolio_id,
            req.body.figi_id,
            req.body.purchase_price,
            req.body.quantity
        )
        return res.json('Created portfolio security')
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error creating portfolio security')
    }
}

/** Remove a single portfolio security from the database */
exports.remove_portfolio_security = async (req, res) => {
    try {
        await req.app.get('db').portfolio_security.delete(req.params.portfolio_id, req.body.figi_id)
        return res.json('Successfully removed portfolio_security')
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error removing portfolio_security')
    }
}