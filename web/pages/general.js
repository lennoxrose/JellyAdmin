/* General settings (Figma 9:25). /System/Configuration GET then POST of the whole object. */
(function () {
  const { h, icon, get, post, toast } = window.JA;

  JA.page({
    path: '/dashboard/settings', title: 'General',
    render(el) {
      const root = h('div', { class: 'adm-page' });
      el.append(root);
      let dead = false;
      (async function init() {
        const J = window.JX, A = window.ADM, safe = A.safe;
        const [cfg, info, storage, langs] = await Promise.all([get('System/Configuration'), safe(get('System/Info')), safe(get('System/Info/Storage')), safe(get('Localization/Options'))]);
        if (dead) return;
        const redo = () => { root.replaceChildren(); init(); };
        const wizard = h('div'); // placeholder so toggle below can mutate cfg only
        const save = async () => {
          try { await post('System/Configuration', cfg); toast('Settings saved'); } catch (e) { toast(e.message, 'error'); }
        };
        const row = J.rowOf;
        const numOr = (k) => J.numInput(cfg[k], (v) => { cfg[k] = v; });

        const serverSec = J.section('server', 'Server', 'Identity and language', [
          row('Server name', 'Shown in clients and on the login screen', A.textIn(cfg.ServerName, (v) => { cfg.ServerName = v; })),
          row('Preferred display language', 'Language of the admin interface',
            A.selectIn((langs || [{ Name: cfg.UICulture, Value: cfg.UICulture }]).map((l) => [l.Value, l.Name]), cfg.UICulture, (v) => { cfg.UICulture = v; })),
          row('Cache path', 'Temporary files such as the image cache', A.textIn(cfg.CachePath, (v) => { cfg.CachePath = v; })),
          row('Metadata path', 'Where metadata and artwork are stored', A.textIn(cfg.MetadataPath, (v) => { cfg.MetadataPath = v; }))]);
        const logSec = J.section('logs', 'Logging', 'Diagnostic files', [
          row('Log retention', 'Days to keep log files', numOr('LogFileRetentionDays')),
          row('Slow response warning', 'Log requests slower than this, in ms', numOr('SlowResponseThresholdMs'))]);
        const perfSec = J.section('zap', 'Performance', 'Limits for background work', [
          row('Parallel library scan tasks limit', '0 lets the server decide', numOr('LibraryScanFanoutConcurrency')),
          row('Parallel image encoding limit', '0 lets the server decide', numOr('ParallelImageEncodingLimit'))]);
        const accSec = J.section('lock', 'Access', 'How people sign in', [
          row('Quick Connect', 'Sign in with a code from another device', J.switchEl(cfg.QuickConnectAvailable, (v) => { cfg.QuickConnectAvailable = v; })),
          row('Show setup wizard', 'Run the first-time wizard again', J.switchEl(!cfg.IsStartupWizardCompleted, (v) => { cfg.IsStartupWizardCompleted = !v; }))]);
        const mntSec = J.section('power', 'Maintenance', 'Restart or stop the server', [
          row('Restart server', 'Applies path and language changes', J.jbtn('Restart', 'restart', false, A.power.restart)),
          row('Shut down server', 'Stops Jellyfin until it is started again', A.btnD('Shutdown', 'power', A.power.shutdown))]);
        const names = [['CacheFolder', 'Cache'], ['ImageCacheFolder', 'Image Cache'], ['InternalMetadataFolder', 'Metadata'], ['TranscodingTempFolder', 'Transcodes'], ['ProgramDataFolder', 'Program Data'], ['LogFolder', 'Logs']];
        const stoRows = storage ? names.map(([k, l]) => storage[k] && A.usage(storage[k].Path, l, storage[k].UsedSpace, storage[k].UsedSpace + storage[k].FreeSpace)).filter(Boolean) : [];
        const stoSec = A.sec({ ico: 'hard-drive', title: 'Storage', sub: 'Space used by server folders', empty: 'Storage info unavailable' }, stoRows);

        const cache = storage && storage.CacheFolder;
        const rail = h('div', { class: 'jx-rail' },
          J.railSec('Summary', null, null, [
            J.kv('Server name', cfg.ServerName || '-'), J.kv('Version', (info && info.Version) || '-'),
            J.kv('Web version', (window.ApiClient && ApiClient.appVersion && ApiClient.appVersion()) || '-'), J.kv('Build', (info && info.SystemArchitecture) || '-'),
            J.kv('Cache used', cache ? window.JA.bytes(cache.UsedSpace) : '-'), J.kv('Quick Connect', cfg.QuickConnectAvailable ? 'Enabled' : 'Disabled'),
            J.kv('Language', (langs && (langs.find((l) => l.Value === cfg.UICulture) || {}).Name) || cfg.UICulture || '-')]),
          J.railSec('Related', null, null, [
            J.link('palette', 'Branding', 'Login screen and custom CSS', '/dashboard/branding'), J.link('network', 'Networking', 'Ports and remote access', '/dashboard/networking'),
            J.link('clock', 'Scheduled Tasks', 'Cleanup and maintenance jobs', '/dashboard/tasks'), J.link('archive', 'Backups', 'Save your configuration', '/dashboard/backups')]),
          J.railSec('Notes', null, null, [
            J.note('info', 'Path changes take effect after a restart.'), J.note('alert', 'Display language only affects the admin interface.')]));

        root.append(
          J.head('General', 'Server-wide settings', [J.jbtn('Reset', 'restart', false, redo), J.jbtn('Save changes', 'save', true, save)]),
          h('div', { class: 'jx-cols' },
            h('div', { class: 'adm-main' }, h('div', { class: 'adm-col' }, serverSec, logSec), h('div', { class: 'adm-col' }, perfSec, accSec, mntSec, stoSec)), rail));
      })().catch((e) => root.append(h('pre', { class: 'ja-error', text: e.message })));
      return () => { dead = true; };
    }
  });
})();
