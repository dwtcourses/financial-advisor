const { run } = require('runjs')

function start() {
    run(`SET DEBUG=financial-advisor:* & npm run devstart`)
}

module.exports = {
  start
}