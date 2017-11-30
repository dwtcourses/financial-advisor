/* Portfolio security routing */
module.exports = function(app) {

    // Import the portfolio security controller
    var portfolio_security_controller = require('../controllers/portfolio_security_controller')

    app.route('/portfolio_security/:portfolio_id')
        .get(portfolio_security_controller.list_all_portfolio_security)
        .post(portfolio_security_controller.create_portfolio_security)
        .delete(portfolio_security_controller.remove_portfolio_security)
};