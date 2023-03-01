/*

Requirements:

    > npm install node-windows -g //see Global LOCATION note below
    > npm link node-windows

Notes:

    Elevation: 

        Elevation sucks through npm (natural because it is suposed to be OS agnostic). 
        Current "Install as Windows Service" path requires Admin, and forces this through a Powershell script requireadmin.ps1 in package.json
            "scripts":{
                "requireadmin":"powershell ./scripts/requireadmin.ps1",
                "preinstall_ws": "npm run requireadmin && npm install node-windows -g && npm link node-windows",
                "install_ws":"node ./scripts/install", --loads config and calls below functions
            }
        
    Global LOCATION:

        Possible issue with running Windows installer by multiple users...
        To change the "global" location for all users to a more appropriate shared global location %ALLUSERSPROFILE%\(npm|npm-cache) (do this as an administrator):
        create an [NODE_INSTALL_PATH]\etc\ directory
        this is needed before you try npm config --global ... actions
        create the global (admin) location(s) for npm modules
        C:\ProgramData\npm-cache - npm modules will go here
        C:\ProgramData\npm - binary scripts for globally installed modules will go here
        C:\ProgramData\npm\node_modules - globally installed modules will go here
        set the permissions appropriately
        administrators: modify
        authenticated users: read/execute
        Set global configuration settings (Administrator Command Prompt)
        npm config --global set prefix "C:\ProgramData\npm"
        npm config --global set cache "C:\ProgramData\npm-cache"
        Add C:\ProgramData\npm to your System's Path environment variable

        https://stackoverflow.com/questions/19874582/change-default-global-installation-directory-for-node-js-modules-in-windows
*/

const Install = async nwconfig => {
    try{
        if(!nwconfig){ throw new Error('ArgumentNullException Install nwconfig undefined')}
        const {Service} = require('node-windows')
        const svc = new Service(nwconfig)
        svc
            .on('install', _=> {
                console.log('Starting Service')
                svc.start()
            })
            .on('alreadyinstalled', _=> {
                console.log('Starting Service')
                svc.start()
            })
            .on('start', _=> {
                console.log('Service is running')
                process.exit(0)
            })
            .on('invalidinstallation', _=> {
                console.log('Invalid installation')
                process.kill(process.pid, 'SIGTERM')
            })
            .on('error', _=> {
                console.log('Unexpected error')
                process.kill(process.pid, 'SIGTERM')
            })
        
        console.log('Begin Install')
        svc.install()
    }
    catch(e){
        console.log(e.message)
    }
}

const Uninstall = async nwconfig => {
    try{
        if(!nwconfig){ throw new Error('ArgumentNullException Uninstall nwconfig undefined')}
        const {Service} = require('node-windows')
        const svc = new Service(nwconfig)
        svc
            .on('uninstall', _=> {
                console.log('Uninstall complete')
                console.log('The service exists:', svc.exists)
                process.exit(0) 
            })
            .on('error', _=> {
                console.log('Unexpected error')
                process.kill(process.pid, 'SIGTERM')
            })

        console.log('Begin Uninstall')
        svc.uninstall()
    }
    catch(e){
        console.log(e.message)
    }
}

module.exports = {Install, Uninstall}