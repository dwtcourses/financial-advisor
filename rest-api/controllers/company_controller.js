/* Company controller */

/* List all companies */
exports.list_all_companies = async (req, res) => {
    try {
        let query_result = await req.app.get('db').company.get_all(req.query.name)
        return res.json(query_result.rows)
        //TODO: Paging
    } catch (err) {
        console.log (err)
        return res.status(500).json('Error retrieving all companies')
    }
}

/* Retrieve a single company */
exports.read_company = async (req, res) => {
    try {
        let query_result = await req.app.get('db').company.get(req.params.company_id)
        return res.json(query_result.rows[0])
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error retrieving company')
    }
}
