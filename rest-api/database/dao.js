/* Database Access Object */

Client = require('./client.js')
Portfolio = require('./portfolio.js')
Security = require('./security.js')
Company = require('./company.js')
Recommendation = require('./recommendation.js')
PortfolioSecurity = require('./portfolio_security.js')

module.exports = class MyDAO {

    // Register all database models here
    constructor(db_pool) {
        this.client = new Client(db_pool)
        this.portfolio = new Portfolio(db_pool)
        this.security = new Security(db_pool)
        this.company = new Company(db_pool)
        this.recommendation = new Recommendation(db_pool)
        this.portfolio_security = new PortfolioSecurity(db_pool)
    }
}