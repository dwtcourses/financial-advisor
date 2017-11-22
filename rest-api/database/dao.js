/* Database Access Object */

Client = require('./client.js')
Portfolio = require('./portfolio.js')
Security = require('./security.js')
Company = require('./company.js')

module.exports = class MyDAO {

    // Register all database models here
    constructor(db_pool) {
        this.client = new Client(db_pool)
        this.portfolio = new Portfolio(db_pool)
        this.security = new Security(db_pool)
        this.company = new Company(db_pool)
    }
}