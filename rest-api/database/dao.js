/* Database Access Object */

Client = require('./client.js')
Portfolio = require('./portfolio.js')

module.exports = class MyDAO {

    // Register all database models here
    constructor(db_pool) {
        this.client = new Client(db_pool)
        this.portfolio = new Portfolio(db_pool)
    }
}