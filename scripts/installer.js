//simple helper uses config

const config = require('../config')
const NWwrapper = require('./NWwrapper')

const Install = id => NWwrapper.Install(config.winservice(id))
const Uninstall = id => NWwrapper.Uninstall(config.winservice(id))
const EchoWinService = id => { console.log(JSON.stringify(config.winservice(id))); return Promise.resolve() }

module.exports = {
    Install, 
    Uninstall,
    EchoWinService,
}

/*  Keeping the below for record of Elevation attempts
*/

//all the elevation I tried worked as expected, EXCEPT i then loose all console messages after that point....so fuck it, just ask the user to elevate

//this also blows any further console logging node -e 'require("./db").init()'

// const config = require('../config')
// const AsWinService = require('../utils/AsWinService')
// const nw = require('node-windows')
// Note: this is a recursive call !!
// try{
//     const args = process.argv.slice(2)
//     if(args[0] == "elevate"){
//         nw.isAdminUser(isAnAdmin => {
//             if(isAnAdmin){
//                 console.log('Attempting to elevate')
//                 nw.elevate('node ./scripts/install', {'shell':'powershell.exe'}, (error, stdout, stderr) => {
//                     if (error) {
//                       console.error(`exec error: ${error}`);
//                       return;
//                     }
//                     console.log(`stdout: ${stdout}`);
//                     console.error(`stderr: ${stderr}`);
//                   })
//             }
//             else{
//                 console.log('Error: Requires Elevated Privileges')
//             }
//         })
//     } 
//     else{
//         console.log('Attempting install')
//         //AsWinService.Install(config.winservice)
//     }
// }
// catch(e){
//     console.log(e)
// }

// # all the elevation I have tried, below and node-windows.elevate work, except i then loose all console messages after that point....so fuck it, just ask the user to elevate
// # AND node-windows.isAdminUser only checks if the user HAS admin rights, it doesnt check if the shell is elevated, which is what we need 
// # Self-elevate the script if required
// # if (-Not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] 'Administrator')) {
// #  if ([int](Get-CimInstance -Class Win32_OperatingSystem | Select-Object -ExpandProperty BuildNumber) -ge 6000) {
// #   $CommandLine = "-File `"" + $MyInvocation.MyCommand.Path + "`" " + $MyInvocation.UnboundArguments
// #   Start-Process -FilePath PowerShell.exe -Verb Runas -ArgumentList $CommandLine
// #   Exit
// #  }
// # }
// # require nicely, instead of throwing an error by [hashtag]Requires -RunAsAdministrator
// Function IsAdmin {
//     $user = [Security.Principal.WindowsIdentity]::GetCurrent();
//     (New-Object Security.Principal.WindowsPrincipal $user).IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator) 
// }
// If (IsAdmin) {
//     # Write-Host Get-Location # is the location from which the powershell comand started, not the location of the script
//     # Write-Host "You are Admin."
//     node ./scripts/install.js
//     Break
// }
// Else{ 
//     Write-Warning "Install as windows service requires admin rights. Run-as-Admin on your shell and try again."
//     Break
// }
// #$location = Get-Location
// #$location | Get-Member #enumerates methods on Location object
