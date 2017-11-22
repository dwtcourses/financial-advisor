/* Client controller */


exports.list_all_clients = async (req, res) => {
    let query_result = await req.app.get('db').client.get_all()
    return res.json(query_result.rows)
}

exports.create_client = function(req, res) {
    return res.json('Create client')
}

exports.read_client = async (req, res) => {
    let query_result = await req.app.get('db').client.get(req.params.client_id)
    return res.json(query_result.rows)
}

exports.update_client = function(req, res) {
    return res.json('Update client')
}

exports.remove_client = function(req, res) {
    return res.json('Remove client')
}