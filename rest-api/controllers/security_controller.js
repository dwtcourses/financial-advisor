/* security controller */

/* List all securities */
exports.list_all_securities = async (req, res) => {
    try {
        let query_result = await req.app.get('db').security.get_all(req.query.name)
        return res.json(query_result.rows)
        //TODO: Paging, optional query search
    } catch (err) {
        console.log (err)
        return res.status(500).json('Error retrieving all securities')
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
