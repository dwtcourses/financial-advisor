/* Portfolio controller */

exports.list_all_portfolios = function(req, res) {
    return res.json('All portfolios')
}

exports.create_portfolio = function(req, res) {
    return res.json('Create portfolio')
}

exports.read_portfolio = function(req, res) {
    return res.json('Read portfolio')
}

exports.update_portfolio = function(req, res) {
    return res.json('Update portfolio')
}

exports.remove_portfolio = function(req, res) {
    return res.json('Remove portfolio')
}