/* clients routing */
module.exports = function(app) {

    // Import the client controller
    var client_controller = require('../controllers/client_controller')

    // All clients
    app.route('/clients')
        .get(client_controller.list_all_clients)
        .post(client_controller.create_client)

    // Single client
    app.route('/clients/:client_id')
        .get(client_controller.read_client)
        .put(client_controller.update_client)
        .delete(client_controller.remove_client)
};