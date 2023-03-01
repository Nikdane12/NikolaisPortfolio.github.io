/*

    Configuration stack
    
    each environment NODE_ENV value overrides defaults

    expected NODE_ENV values:

    undefigned (returns local)
    local (NOT IN GIT, this is your individual developer version)
    development 
    production  
    

USE:
    const config = requires('./config')

*/
const config = require(`./config.${process.env.NODE_ENV || 'local'}.js`)
module.exports = config;
