/* /client routing */
module.exports = function(app) {

    var clients = require('../controllers/client_controller')

    // All clients
    app.route('/clients')
        .get(clients.list_all_clients)
        .post(clients.create_client)

    // Single client
    app.route('/clients/:client_id')
        .get(clients.read_client)
        .put(clients.update_client)
        .delete(clients.remove_client)
};