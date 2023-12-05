Start-Process powershell -ArgumentList "-WindowStyle", "Maximized", ".\g3.ps1"

if ($env:TERM_PROGRAM -ne "vscode") {
    exit
}