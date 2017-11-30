/**
 * Portfolio Database Access Object
 */
module.exports = class portfolio {

    /**
     * Construct a portfolio data access object
     * @param {Pool} db_pool - Pool object to connect to PostgreSQL server
     */
    constructor(db_pool) {
        this.db_pool = db_pool
    }

    /** Get all portfolios
     * @return promise of SQL query
     */
    get_all() {
        let command = ' \
            SELECT portfolio.*, client.*, V.value \
            FROM portfolio \
            JOIN client ON client.client_id = portfolio.client_id \
            LEFT JOIN ( SELECT PS.portfolio_id, SUM(Q.price * PS.quantity) as value FROM portfolio_security as PS JOIN price_recent as Q ON Q.figi_id = PS.figi_id GROUP BY portfolio_id) \
            as V ON portfolio.portfolio_id = V.portfolio_id'
        return this.db_pool.query(command)
    }

    /** Get a portfolio by portfolio_id
     * @param {integer} portfolio_id - primary id of the portfolio
     * @return promise of SQL query
     */
    get(portfolio_id) {
        let command = ' \
            SELECT portfolio.*, client.*, V.value \
            FROM portfolio \
            JOIN client ON client.client_id = portfolio.client_id \
            LEFT JOIN ( SELECT PS.portfolio_id, SUM(Q.price * PS.quantity) as value FROM portfolio_security as PS JOIN price_recent as Q ON Q.figi_id = PS.figi_id GROUP BY portfolio_id) \
            as V ON portfolio.portfolio_id = V.portfolio_id \
            WHERE portfolio.portfolio_id=$1'
        let params = [portfolio_id]
        return this.db_pool.query(command, params)
    }

    /** Insert a new portfolio into the database
     * @param {string} client_id - id of client to assign the portfolio
     * @param {string} target_date - target date in MM/DD/YYYY format
     * @param {string} strategy - name of strategy
     * @return promise of SQL query
     */
    insert(client_id, target_date, strategy) {
        let command = 'INSERT INTO portfolio (client_id, target_date, strategy) VALUES($1, $2, $3)'
        let params = [client_id, target_date, strategy]
        console.log(params)
        return this.db_pool.query(command, params)
    }

    /** Update single portfolio details
     * @param {integer} portfolio_id - primary id of the portfolio
     * @param {string} target_date - date in format MM/DD/YYYY
     * @param {string} strategy - name of strategy
     * @return promise of SQL query
     */
    update(portfolio_id, target_date, strategy) {
        let command = 'UPDATE portfolio SET target_date=$1, strategy=$2 WHERE portfolio_id=$3'
        let params = [target_date, strategy, portfolio_id]
        return this.db_pool.query(command, params)
    }

    /** Get all securities associated with portfolio
     * @param {integer} portfolio_id - primary id of the portfolio
     * @return promise of SQL query
     */
    get_securities(portfolio_id) {
        let command = 'SELECT * FROM portfolio_security WHERE portfolio_id=$1;'
        let params = [portfolio_id]
        return this.db_pool.query(command, params)
    }

    /** Remove a portfolio by portfolio_id, only if there are no associated securities
     * @param {integer} portfolio_id - primary id of the portfolio
     * @return promise of SQL query
     */
    delete(portfolio_id) {
        // Save reference to class
        var self = this
        return this.get_securities(portfolio_id).then(function(result) {
            if (result.rows.length == 0) {
                let command = 'DELETE FROM portfolio WHERE portfolio_id=$1'
                let params = [portfolio_id]
                return self.db_pool.query(command, params)
            } else {
                return Promise.reject(new Error('Securities still associated with portfolio'))
            }
        }).catch(function(err) {
            return Promise.reject(new Error('Error retrieving securities associated with portfolio'))
        });
    }
}