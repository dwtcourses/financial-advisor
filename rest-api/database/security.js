/**
 * Security Database Access Object
 */
module.exports = class Security {

    /**
     * Construct a security data access object
     * @param {Pool} db_pool - Pool object to connect to PostgreSQL server
     */
    constructor(db_pool) {
        this.db_pool = db_pool
    }

    /** Get all securities
     * @param {string} name - optional query parameter to filter by name
     * @param {string} ticker - optional query parameter to filter by ticker symbol
     * @return promise of SQL query
     */
    get_all(name, ticker) {
        if (name == undefined && ticker == undefined) {
            let command = 'SELECT * FROM security'
            return this.db_pool.query(command)
        } else if (name == undefined && ticker != undefined) {
            let command = 'SELECT * FROM security WHERE security.ticker ~* $1'
            let params = ['.*' + ticker + '.*']
            return this.db_pool.query(command, params)
        } else if (name != undefined && ticker == undefined) {
            let command = 'SELECT * FROM security WHERE security.security_name ~* $1'
            let params = ['.*' + name + '.*']
            return this.db_pool.query(command, params)
        } else if (name != undefined && ticker != undefined) {
            let command = 'SELECT * FROM security WHERE security.security_name ~* $1 AND security.ticker ~* $2'
            let params = ['.*' + name + '.*', '.*' + ticker + '.*']
            return this.db_pool.query(command, params)
        }
    }

    /** Get a security by figi_id
     * @param {string} figi_id - primary id of the security
     * @return promise of SQL query
     */
    get(figi_id) {
        let command = 'SELECT * FROM security JOIN company ON security.company_id = company.company_id WHERE figi_id=$1'
        let params = [figi_id]
        return this.db_pool.query(command, params)
    }

    /** Get security prices by figi_id
     * @param {string} figi_id - primary id of the security
     * @return promise of SQL query
     */
    get_price(figi_id) {
        let command = 'SELECT end_of_date, price FROM price WHERE price.figi_id=$1 ORDER BY end_of_date DESC'
        let params = [figi_id]
        return this.db_pool.query(command, params)
    }
}