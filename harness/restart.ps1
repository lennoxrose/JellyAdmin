Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -match 'harness' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
Start-Process node -ArgumentList 'harness/server.js' -WorkingDirectory (Split-Path $PSScriptRoot) -WindowStyle Hidden
