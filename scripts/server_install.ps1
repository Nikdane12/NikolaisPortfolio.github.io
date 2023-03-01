Write-Host "Begin Installing latest BOD_WS"
cd C:\local\services\bod_ws
npm run winuninstall --silent
cd ..
Start-Sleep -Seconds 4
Rename-Item bod_ws bod_ws-$(Get-Date -format "yyy_MM_dd_HH_mm")
git clone --depth 1 git@bitbucket.org:glamoxas/bod_ws.git
cd .\bod_ws\
npm run wininstall --silent
Write-Host "Finished Installing latest BOD_WS"