$d="C:\Users\lenni\AppData\Local\Temp\claude\352347a79e23846c\0986977d-8f42-4f7a-9e37-344c62f2d0ed\scratchpad"
Remove-Item "$PSScriptRoot\audit.json" -ea 0
$p=Start-Process "C:\Program Files\Mozilla Firefox\firefox.exe" -ArgumentList @("--no-remote","-profile","$d\ffprof","--headless","http://localhost:8099/?audit#/dashboard") -PassThru
for($i=0;$i -lt 60 -and -not (Test-Path "$PSScriptRoot\audit.json");$i++){Start-Sleep 1}
Stop-Process -Id $p.Id -Force -ea 0
