/* Recommendation controller */

/** List all recommendations */
exports.list_all_recommendations = async (req, res) => {
    try {
        let query_result = await req.app.get('db').recommendation.get_all()
        return res.json(query_result.rows)
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error retrieving all recommendations')
    }
}

/** Create a single recommendation and insert into database */
exports.create_recommendation = async (req, res) => {
    try {
        let query_result = await req.app.get('db').recommendation.insert(
            req.body.figi_id,
            req.body.portfolio_id,
            req.body.quantity,
            req.body.transaction_type,
            Date.now()
        )
        return res.json('Created recommendation')
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error creating recommendation')
    }
}

/** Retrieve a single recommendation from the database */
exports.read_recommendation = async (req, res) => {
    try {
        let query_result = await req.app.get('db').recommendation.get(req.params.recommendation_id)
        return res.json(query_result.rows[0])
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error retrieving recommendation')
    }
}

/** Remove a single recommendation from the database */
exports.remove_recommendation = async (req, res) => {
    try {
        await req.app.get('db').recommendation.delete(req.params.recommendation_id)
        return res.json('Successfully removed recommendation')
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error removing recommendation')
    }
}