/**
 * Company Database Access Object
 */
module.exports = class Company {

    /**
     * Construct a company data access object
     * @param {Pool} db_pool - Pool object to connect to PostgreSQL server
     */
    constructor(db_pool) {
        this.db_pool = db_pool
    }

    /** Get all securities
     * @param {string} name - optional name to query for company
     * @return promise of SQL query
     */
    get_all(name) {
        if (name == undefined) {
            let command = 'SELECT company.*, security.figi_id FROM company LEFT JOIN security ON security.company_id=company.company_id'
            return this.db_pool.query(command)
        } else {
            let command = 'SELECT * FROM company WHERE company.company_name ~* $1'
            let params = ['.*' + name + '.*']
            return this.db_pool.query(command, params)
        }
    }

    /** Get a company by company_id
     * @param {string} company_id - primary id of the company
     * @return promise of SQL query
     */
    get(company_id) {
        let command = 'SELECT company.*, security.figi_id FROM company LEFT JOIN security ON security.company_id=company.company_id WHERE company.company_id=$1'
        let params = [company_id]
        return this.db_pool.query(command, params)
    }
}