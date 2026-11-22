// Local preview: serves web/ at /JellyAdmin/ and fake Jellyfin API data so the UI can be screenshotted without a server.
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', 'web');
const T = (n) => new Date(Date.now() - n * 36e5).toISOString();
const api = {
  'System/Info/Public': { Version: '10.11.11' },
  'System/Info': { ServerName: 'jellyfin', Version: '10.11.11', OperatingSystem: 'Linux', LocalAddress: 'http://10.42.4.54:8096', WebPath: '/jellyfin/jellyfin-web', ProgramDataPath: '/config', LogPath: '/config/log', CachePath: '/cache', TranscodingTempPath: '/cache/transcodes', ImageCachePath: '/cache/images', InternalMetadataPath: '/config/metadata' },
  'System/Info/Storage': { Libraries: [], Folders: [] },
  Devices: { Items: [{ Id: 'a', Name: 'Firefox', AppName: 'Jellyfin Web', AppVersion: '10.11.11', LastUserName: 'lennox', DateLastActivity: T(0.01) }, { Id: 'b', Name: 'Chrome', AppName: 'Jellyfin Web', AppVersion: '10.11.11', LastUserName: 'lennox', DateLastActivity: T(5) }] },
  'Items/Counts': { MovieCount: 42, SeriesCount: 9, EpisodeCount: 1459 },
  'Library/VirtualFolders': [{ Name: 'Movies', ItemId: '1', CollectionType: 'movies', Locations: ['/media/movies'], LibraryOptions: {} }, { Name: 'Shows', ItemId: '2', CollectionType: 'tvshows', Locations: ['/media/shows'], LibraryOptions: {} }],
  Plugins: [{ Id: 'x', Name: 'Intro Skipper', Version: '1.0', Status: 'Active', CanUninstall: true }],
  ScheduledTasks: [{ Id: 't', Name: 'Scan Media Library', Category: 'Library', State: 'Idle', Triggers: [], LastExecutionResult: { Status: 'Completed', EndTimeUtc: T(3) } }],
  Users: [{ Id: 'u', Name: 'lennox', LastActivityDate: T(0.1), Policy: { IsAdministrator: true } }],
  'System/ActivityLog/Entries': { Items: [{ Name: 'lennox is online from Firefox', ShortOverview: 'IP: 10.42.4.54', Date: T(0.1), Severity: 'Information' }, { Name: 'lennox disconnected from Firefox', Date: T(0.2), Severity: 'Information' }] },
  'web/ConfigurationPages': [], Sessions: [{ DeviceId: 'a', RemoteEndPoint: '10.42.4.54', UserName: 'lennox' }], 'Localization/Options': [{ Name: 'English', Value: 'en-US' }], 'Users/u/Items/Resume': { Items: [], TotalRecordCount: 0 },
  'System/Configuration': {}, 'System/Configuration/network': {}, 'System/Configuration/xbmcmetadata': {}, 'System/Configuration/livetv': { TunerHosts: [], ListingProviders: [] },
  'Branding/Configuration': {}, Packages: [], 'Auth/Keys': { Items: [] }, Backup: [], 'System/Logs': [], 'LiveTv/Timers': { Items: [] }, 'LiveTv/SeriesTimers': { Items: [] },
  'Localization/Cultures': [{ TwoLetterISOLanguageName: 'en', DisplayName: 'English' }], 'Localization/Countries': [{ TwoLetterISORegionName: 'US', DisplayName: 'United States' }]
};
http.createServer((q, r) => {
  const u = new URL(q.url, 'http://x'), p = decodeURIComponent(u.pathname).replace(/^\//, '');
  if (p === '' || p === 'index.html') { r.setHeader('content-type', 'text/html'); return r.end(fs.readFileSync(path.join(__dirname, 'index.html'))); }
  if (p === 'report') { let b=''; q.on('data',c=>b+=c); q.on('end',()=>{ fs.writeFileSync(path.join(__dirname,'audit.json'), b); r.end('ok'); }); return; }
  if (p === 'slow.gif') return setTimeout(() => { r.setHeader('content-type', 'image/gif'); r.end(Buffer.from('R0lGODlhAQABAAAAACw=', 'base64')); }, 2500);
  if (p.startsWith('JellyAdmin/')) { const f = path.join(root, p.slice(11)); if (fs.existsSync(f)) { r.setHeader('content-type', { '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' }[path.extname(f)] || 'text/plain'); return r.end(fs.readFileSync(f)); } }
  if (p === 'pages.json') { r.setHeader('content-type', 'application/json'); return r.end(JSON.stringify(fs.readdirSync(path.join(root, 'pages')).filter((f) => /\.(js|css)$/.test(f)))); }
  const k = Object.keys(api).find((k) => p === k || p.startsWith(k + '/') && false) || Object.keys(api).find((k) => p === k);
  r.setHeader('content-type', 'application/json');
  if (p.startsWith('Items?')) return r.end(JSON.stringify({ TotalRecordCount: 10, Items: [] }));
  r.end(JSON.stringify(k ? api[k] : {}));
}).listen(8099, () => console.log('http://localhost:8099'));
