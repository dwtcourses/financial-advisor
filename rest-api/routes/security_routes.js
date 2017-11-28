/* securities routing */
module.exports = function(app) {

    // Import the securities controller
    var security_controller = require('../controllers/security_controller')

    // All securities
    app.route('/securities')
        .get(security_controller.list_all_securities)

    // Single client
    app.route('/securities/:figi_id')
        .get(security_controller.read_security)

    // Single client
    app.route('/securities/:figi_id/prices')
        .get(security_controller.list_security_prices)

    // Security aggregation
    app.route('/securities_analysis/top_gainers')
        .get(security_controller.list_top_gainers)
    app.route('/securities_analysis/top_losers')
        .get(security_controller.list_top_losers)
}
