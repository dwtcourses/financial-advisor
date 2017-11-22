
module.exports = class Client {

    constructor(db_pool) {
        this.db_pool = db_pool
    }

    // Class methods
    get_all() {
        return this.db_pool.query('SELECT * FROM client;')
    }

    insert() {
    }

    get(client_id) {
        return this.db_pool.query(`SELECT * FROM client WHERE client_id=${client_id};`)
    }

    update(client_id) {

    }

    delete(client_id) {

    }
}