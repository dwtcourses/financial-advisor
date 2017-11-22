/* Client controller */

/** List all clients */
exports.list_all_clients = async (req, res) => {
    try {
        let query_result = await req.app.get('db').client.get_all()
        return res.json(query_result.rows)
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error retrieving all clients')
    }
}

/** Create a single client and insert into database */
exports.create_client = async (req, res) => {
    try {
        let query_result = await req.app.get('db').client.insert(
            req.body.birthdate,
            req.body.client_name,
            req.body.remaining_funds,
            req.body.country
        )
        return res.json('Created client')
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error creating client')
    }
}

/** Retrieve a single client from the database */
exports.read_client = async (req, res) => {
    try {
        let query_result = await req.app.get('db').client.get(req.params.client_id)
        return res.json(query_result.rows)
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error retrieving client')
    }
}

/** Update a single client */
exports.update_client = async (req, res) => {
    try {
        await req.app.get('db').client.update(
            req.params.client_id,
            req.body.birthdate,
            req.body.client_name,
            req.body.remaining_funds,
            req.body.country
        )
        return res.json('Successfully updated client')
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error updating client')
    }
}

/** Remove a single client from the database */
exports.remove_client = async (req, res) => {
    try {
        await req.app.get('db').client.delete(req.params.client_id)
        return res.json('Successfully removed client')
    } catch (err) {
        console.log(err)
        return res.status(500).json('Error removing client')
    }
}