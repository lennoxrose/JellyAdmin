Get-CimInstance Win32_Process -Filter "Name='firefox.exe'" | Where-Object { $_.CommandLine -match 'ffprof' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
