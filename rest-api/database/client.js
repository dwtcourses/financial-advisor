/**
 * Client Database Access Object
 */
module.exports = class Client {

    /**
     * Construct a client data access object
     * @param {Pool} db_pool - Pool object to connect to PostgreSQL server
     */
    constructor(db_pool) {
        this.db_pool = db_pool
    }

    /** Get all clients
     * @return promise of SQL query
     */
    get_all() {
        let command = 'SELECT * FROM client;'
        return this.db_pool.query(command)
    }

    /** Insert a new client into the database
     * @param {string} birthdate - date in MM/DD/YYYY format
     * @param {string} client_name - full name of the client
     * @param {float} remaining_funds - decimal number of dollars
     * @param {string} country - name of country of client
     * @return promise of SQL query
     */
    insert(birthdate, client_name, remaining_funds, country) {
        let command = `INSERT INTO client (birthdate, client_name, remaining_funds, country) VALUES('${birthdate}', '${client_name}', ${remaining_funds}, '${country}');`
        return this.db_pool.query(command)
    }

    /** Get a client by client_id
     * @param {integer} client_id - primary id of the client
     * @return promise of SQL query
     */
    get(client_id) {
        let command = `SELECT * FROM client WHERE client_id=${client_id};`
        return this.db_pool.query(command)
    }

    /** Update single client details
     * @param {integer} client_id - primary id of the client
     * @param {string} birthdate - date in MM/DD/YYYY format
     * @param {string} client_name - full name of the client
     * @param {float} remaining_funds - decimal number of dollars
     * @param {string} country - name of country of client
     * @return promise of SQL query
     */
    update(client_id, birthdate, client_name, remaining_funds, country) {
        let command = `UPDATE client SET birthdate='${birthdate}', client_name='${client_name}', remaining_funds=${remaining_funds}, country='${country}' WHERE client_id=${client_id}`
        return this.db_pool.query(command)
    }

    /** Remove a client by client_id
     * @param {integer} client_id - primary id of the client
     * @return promise of SQL query
     */
    delete(client_id) {
        let command = `DELETE FROM client WHERE client_id=${client_id}`
        return this.db_pool.query(command)
    }
}