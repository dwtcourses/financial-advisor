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
     * @return promise of SQL query
     */
    get_all() {
        let command = 'SELECT * FROM security'
        return this.db_pool.query(command)
    }

    /** Get a security by figi_id
     * @param {string} figi_id - primary id of the security
     * @return promise of SQL query
     */
    get(figi_id) {
        let command = 'SELECT * FROM security JOIN company on security.company_id = company.company_id WHERE figi_id=$1'
        let params = [figi_id]
        return this.db_pool.query(command, params)
    }
}