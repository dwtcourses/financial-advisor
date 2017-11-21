/* portfolios routing */
module.exports = function(app) {

        var portfolios = require('../controllers/portfolio_controller')

        // All clients
        app.route('/portfolios')
            .get(portfolios.list_all_portfolios)
            .post(portfolios.create_portfolio)

        // Single client
        app.route('/portfolios/:portfolio_id')
            .get(portfolios.read_portfolio)
            .put(portfolios.update_portfolio)
            .delete(portfolios.remove_portfolio)
    };