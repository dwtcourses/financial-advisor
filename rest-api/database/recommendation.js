/**
 * Recommendation Database Access Object
 */
module.exports = class Recommendation {

    /**
     * Construct a recommendation data access object
     * @param {Pool} db_pool - Pool object to connect to PostgreSQL server
     */
    constructor(db_pool) {
        this.db_pool = db_pool
    }

    /** Get all recommendations
     * @return promise of SQL query
     */
    get_all() {
        let command = 'SELECT * FROM recommendation JOIN portfolio ON portfolio.portfolio_id = recommendation.portfolio_id JOIN client ON client.client_id = portfolio.client_id JOIN security ON security.figi_id = recommendation.figi_id'
        return this.db_pool.query(command)
    }

    /** Get a recommendation by recommendation_id
     * @param {integer} recommendation_id - primary id of the recommendation
     * @return promise of SQL query
     */
    get(recommendation_id) {
        let command = 'SELECT * FROM recommendation JOIN portfolio ON portfolio.portfolio_id = recommendation.portfolio_id JOIN client ON client.client_id = portfolio.client_id JOIN security ON security.figi_id = recommendation.figi_id WHERE recommendation_id=$1'
        let params = [recommendation_id]
        return this.db_pool.query(command, params)
    }

    /** Insert a new recommendation into the database
     * @param {string} figi_id - unique FIGI id of security
     * @param {int} portfolio_id - id of portfolio
     * @param {int} quantity - quantity of the security
     * @param {string} transaction_type - type of transaction
     * @param {timestamp} timestamp - submission timestamp
     * @return promise of SQL query
     */
    insert(figi_id, portfolio_id, quantity, transaction_type, timestamp) {
        let command = 'INSERT INTO recommendation (figi_id, portfolio_id, quantity, transaction_type, submission_timestamp) VALUES($1, $2, $3, $4, to_timestamp($5 / 1000.0))'
        let params = [figi_id, portfolio_id, quantity, transaction_type, timestamp]
        return this.db_pool.query(command, params)
    }

    /** Remove a recommendation by recommendation_id
     * @param {integer} recommendation_id - primary id of the recommendation
     * @return promise of SQL query
     */
    delete(recommendation_id) {
        let command = 'DELETE FROM recommendation WHERE recommendation_id=$1'
        let params = [recommendation_id]
        return this.db_pool.query(command, params)
    }
}