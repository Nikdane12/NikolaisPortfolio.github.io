const path = require('path')
const config = require('./config.default.js')
module.exports = config

config.loglevel = "debug"

config.clientApis.allowUnauthorized = false
