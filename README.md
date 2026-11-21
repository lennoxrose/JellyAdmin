# JellyAdmin

Jellyfin 10.11 plugin that restyles the admin dashboard. Toggle it under Dashboard > Plugins > Jelly Admin Theme.

## Install

Dashboard > Plugins > Repositories > add:

```
https://raw.githubusercontent.com/lennoxrose/JellyAdmin/main/manifest.json
```

Then Catalog > General > Jelly Admin Theme, install, restart Jellyfin.

## Build

`dotnet build -c Release` (needs .NET 9 SDK).
