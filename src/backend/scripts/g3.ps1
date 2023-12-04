Clear-Host
Set-Location '../out/generate-model'

# Include in actual script
node main.js

Set-Location '../../scripts'
Write-Host
Pause
Clear-Host