param($q="",$hash='/dashboard',$out='dash.png')
$d="C:\Users\lenni\AppData\Local\Temp\claude\352347a79e23846c\0986977d-8f42-4f7a-9e37-344c62f2d0ed\scratchpad"; Remove-Item "$d\$out" -ea 0
$p=Start-Process "C:\Program Files\Mozilla Firefox\firefox.exe" -ArgumentList @("--no-remote","-profile","$d\ffprof2","--headless","--screenshot","$d\$out","--window-size=1920,1080","http://localhost:8099/$q#$hash") -PassThru
$p|Wait-Process -Timeout 60 -ea 0; if(-not $p.HasExited){$p|Stop-Process -Force}
