if ($env:TERM_PROGRAM -ne "vscode") {
    $shell = New-Object -ComObject WScript.Shell
    $shell.SendKeys('{F11}')
}

Clear-Host
Set-Location '../out/generate-model'

# Include in actual script
node main.js

Set-Location '../../scripts'
Write-Host
Pause
Clear-Host

if ($env:TERM_PROGRAM -ne "vscode") {
    exit
}