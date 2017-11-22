/* companies routing */
module.exports = function(app) {

    // Import the companies controller
    var company_controller = require('../controllers/company_controller')

    // All companies
    app.route('/companies')
        .get(company_controller.list_all_companies)

    // Single client
    app.route('/companies/:company_id')
        .get(company_controller.read_company)
}
