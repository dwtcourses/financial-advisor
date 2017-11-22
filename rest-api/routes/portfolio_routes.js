/* portfolios routing */
exports = function(app) {

    // Import the portfolio controller
    var portfolio_controller = require('../controllers/portfolio_controller')

    // All clients
    app.route('/portfolios')
        .get(portfolio_controller.list_all_portfolios)
        .post(portfolio_controller.create_portfolio)

    // Single client
    app.route('/portfolios/:portfolio_id')
        .get(portfolio_controller.read_portfolio)
        .put(portfolio_controller.update_portfolio)
        .delete(portfolio_controller.remove_portfolio)
};