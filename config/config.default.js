const path = require('path')

const apps = [
    {
        id:'portfolio',
        name:'AA Portfolio',
        port:'88',
        filename:'app.js'
    }
]

const winservice = id => {
    const app = getApp(id)
    if(app){
        return {
            name: app.name,
            description: app.name,
            nodeOptions: [ "--max_old_space_size=4096" ],
            script: path.join(__dirname, '..', app.filename)
        }
    }
}

const getApp = id => apps.find(x=>x.id == id)

module.exports = {

    loglevel:"info", /* trace, debug, info, warn, error, fatal */

    clientApis:{allowUnauthorized: false},
    
    winservice,
    getApp,

}