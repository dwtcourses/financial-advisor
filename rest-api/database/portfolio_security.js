/**
 * Portfolio Security Databasee Access Object
 */
module.exports = class portfolio_security {

    /**
     * Construct a portfolio security data access object
     * @param {Pool} db_pool - Pool object to connect to PostgreSQL server
     */
    constructor(db_pool) {
        this.db_pool = db_pool
    }

    /** Get all portfolio securities by portfolio_id
     * @param {integer} portfolio_id - primary id of the portfolio
     * @return promise of SQL query
     */
    get_all(portfolio_id) {
        let command = ' \
            SELECT portfolio_security.*, S.ticker, PR.price as current_price \
            FROM portfolio_security \
            JOIN security S ON S.figi_id = portfolio_security.figi_id \
            JOIN price_recent PR ON PR.figi_id = portfolio_security.figi_id \
            WHERE portfolio_security.portfolio_id=$1'
        let params = [portfolio_id]
        return this.db_pool.query(command, params)
    }

    /** Insert a new portfolio security into the database
     * @param {string} portfolio_id - id of portfolio to add the security
     * @param {string} figi_id - id of security to add
     * @param {double} purchase_price - price of purchase
     * @param {int} quantity - quantity of securities to purchase
     * @return promise of SQL query
     */
    insert(portfolio_id, figi_id, purchase_price, quantity) {
        let today = new Date()
        let command = 'INSERT INTO portfolio_security (portfolio_id, figi_id, purchase_date, purchase_price, quantity) VALUES($1, $2, $3, $4, $5)'
        let params = [portfolio_id, figi_id, today.toISOString(), purchase_price, quantity]
        return this.db_pool.query(command, params)
    }

    /** Remove a portfolio_security by portfolio_id, figi_id
     * @param {int} portfolio_id - primary id of the portfolio
     * @param {string} figi_id - primary id of the security
     * @return promise of SQL query
     */
    delete(portfolio_id, figi_id) {
        let command = 'DELETE FROM portfolio_security WHERE portfolio_id=$1 AND figi_id=$2'
        let params = [portfolio_id, figi_id]
        return this.db_pool.query(command, params)
    }
}