/* Server Sync plugin config page. Needs jxlib.js/jxlib.css. Config keys are best guesses (see DEF). */
(function () {
  const { h, icon } = window.JA;
  const DEF = { SyncWatchState: true, SyncFavorites: true, SyncUsers: false, SyncMetadata: false, AutoSync: true, FrequencyHours: 24, ConflictResolution: 'newest' };

  JA.page({
    path: '/dashboard/serversync', title: 'Server Sync',
    render(el) {
      const X = window.JX;
      const T = 'Server Sync', S = 'Keep libraries and watch state in sync across servers';
      el.replaceChildren(h('div', { class: 'jx-page' }, h('div', { class: 'jx-missing', text: 'Loading...' })));
      X.loadPlugin(/server.?sync/i).then((r) => {
        if (!r) return el.replaceChildren(X.missing(T, S, 'Server Sync'));
        const { plugin, cfg } = r;
        const c = { ...DEF, ...cfg };
        const bool = (k) => X.switchEl(c[k], (v) => { c[k] = v; });
        const save = () => X.saveCfg(plugin, { ...cfg, ...c }).then(() => X.toast('Saved')).catch((e) => X.toast(e.message, 'error'));
        const servers = Array.isArray(cfg.Servers) ? cfg.Servers : [];
        const f = (s, ...k) => { for (const x of k) if (s[x] != null) return String(s[x]); return ''; };
        const onoff = (b) => (b ? 'On' : 'Off');
        const table = h('div', { class: 'jx-sec' },
          h('div', { class: 'jx-th' }, ['Server|s', 'Address|w260', 'Mode|', 'Last sync|w150', 'Status|w120', '|w32'].map((t) => { const [a, b] = t.split('|'); return h('div', { class: 'jx-c ' + (b || ''), text: a }); })),
          servers.map((s) => [h('div', { class: 'jx-div' }), h('div', { class: 'jx-tr' },
            h('div', { class: 'jx-c s' }, h('div', { class: 'jx-ident' }, h('div', { class: 'jx-ib' }, icon('server', 16)),
              h('div', {}, h('p', { class: 'a', text: f(s, 'Name', 'ServerName') }), h('p', { class: 'b', text: 'Version ' + f(s, 'Version') })))),
            h('div', { class: 'jx-c w260', text: f(s, 'Address', 'Url', 'Host') }), h('div', { class: 'jx-c', text: f(s, 'Mode') || 'Two-way' }),
            h('div', { class: 'jx-c w150', text: f(s, 'LastSync') }),
            h('div', { class: 'jx-c w120' }, h('span', { class: 'jx-badge' }, icon('circle-check', 12), 'Synced')),
            h('div', { class: 'jx-c w32' }, icon('more', 14)))]));
        el.replaceChildren(h('div', { class: 'jx-page' },
          X.head(T, S, [X.jbtn('Sync now', 'sync', false, () => window.JA.go('/dashboard/tasks')), X.jbtn('Add server', 'plus', true, save)]),
          h('div', { class: 'jx-cols' },
            h('div', { class: 'jx-main' },
              h('div', { class: 'jx-stats' },
                X.stat('server', 'Servers', String(servers.length), 'paired', true), X.stat('clock', 'Last sync', '-', ''),
                X.stat('layers', 'Items synced', '-', ''), X.stat('calendar', 'Next sync', '-', '')),
              table,
              X.section('layers', 'What to sync', 'Choose data', [
                X.rowOf('Watch state', 'Played and resume positions', bool('SyncWatchState')),
                X.rowOf('Favorites', 'Favorited titles', bool('SyncFavorites')),
                X.rowOf('User accounts', 'Names and passwords', bool('SyncUsers')),
                X.rowOf('Library metadata', 'Titles, images and NFO files', bool('SyncMetadata'))]),
              X.section('clock', 'Schedule', 'When syncing runs', [
                X.rowOf('Sync automatically', 'Run on a schedule', bool('AutoSync')),
                X.rowOf('Frequency', 'How often', X.selectEl([[1, 'Every hour'], [6, 'Every 6 hours'], [12, 'Every 12 hours'], [24, 'Every 24 hours'], [168, 'Every week']], c.FrequencyHours, (v) => { c.FrequencyHours = Number(v); })),
                X.rowOf('On conflict', 'Which side wins', X.selectEl([['newest', 'Newest change'], ['local', 'This server'], ['remote', 'Other server']], c.ConflictResolution, (v) => { c.ConflictResolution = v; }))])),
            h('div', { class: 'jx-rail' },
              X.railSec('Summary', null, null, [X.kv('Paired servers', String(servers.length)), X.kv('Mode', 'Two-way'),
                X.kv('Watch state', onoff(c.SyncWatchState)), X.kv('Favorites', onoff(c.SyncFavorites)), X.kv('Last sync', '-')]),
              X.railSec('Related', null, null, [
                X.link('plug', 'Plugins', 'Plugin version ' + (plugin.Version || ''), '/dashboard/plugins'),
                X.link('clock', 'Scheduled Tasks', 'Sync schedule', '/dashboard/tasks'),
                X.link('network', 'Networking', 'Connection to other servers', '/dashboard/networking')]),
              X.railSec('Notes', null, null, [
                X.note('info', 'Both servers must run the same plugin version.'),
                X.note('alert', 'Turning on user accounts overwrites passwords on the other server.')])))));
      }).catch((e) => el.replaceChildren(h('pre', { class: 'ja-error', text: e.message })));
    }
  });
})();
