/* Dashboard (Figma 8:2). Live data, refreshed every 5s. */
(function () {
  const { h, icon, get, go } = window.JA;
  const A = () => window.ADM, X = () => window.JX;

  async function load() {
    const { safe } = A();
    const [info, counts, users, devices, tasks, folders, plugins, log, storage] = await Promise.all([
      safe(get('System/Info')), safe(get('Items/Counts')), safe(get('Users')), safe(get('Devices')),
      safe(get('ScheduledTasks')), safe(get('Library/VirtualFolders')), safe(get('Plugins')),
      safe(get('System/ActivityLog/Entries?limit=30')), safe(get('System/Info/Storage'))]);
    const libs = await Promise.all((folders || []).slice(0, 8).map((f) =>
      safe(get('Items?ParentId=' + f.ItemId + '&Recursive=true&Limit=0&IncludeItemTypes=Movie,Episode,Audio,MusicVideo,Video,Book&EnableTotalRecordCount=true'))
        .then((r) => ({ f, n: r ? r.TotalRecordCount : null }))));
    return { info: info || {}, counts: counts || {}, users: users || [], devices: (devices && devices.Items) || [], tasks: tasks || [],
      libs, plugins: plugins || [], log: (log && log.Items) || [], storage };
  }

  function build(d) {
    const { sec, box, badge, item, kv, usage, when, until, nextRun, logoFor, stat, power } = A();
    const J = X(), pc = (t) => Math.round(t.CurrentProgressPercentage || 0);
    const active = d.devices.filter((x) => Date.now() - new Date(x.DateLastActivity).getTime() < 5 * 6e4);
    const running = d.tasks.filter((t) => t.State === 'Running');
    const admins = d.users.filter((u) => u.Policy && u.Policy.IsAdministrator).length;
    const webVer = window.ApiClient && ApiClient.appVersion ? ApiClient.appVersion() : '';
    const ok = badge('Online', 'ok', 'circle-check');

    const server = sec({ ico: 'server', title: 'Server', sub: (d.info.ServerName || '') + ' · ' + (d.info.Version || ''), badge: ok },
      [['Server name', d.info.ServerName], ['Server version', d.info.Version], ['Web version', webVer || '-'], ['Build version', d.info.SystemArchitecture || '-']]
        .map(([k, v]) => h('div', { class: 'adm-kv' }, h('span', { text: k }), h('span', { text: v == null ? '-' : String(v) }))));

    const tasksSec = sec({ ico: 'clock', title: 'Running tasks', sub: running.length + ' active', link: ['View all', '/dashboard/tasks'], empty: 'No tasks running' },
      running.map((t) => h('div', { class: 'adm-task' },
        h('div', { class: 'adm-task-top' }, icon('sync', 14), h('span', { text: t.Name }), h('i', { class: 'adm-sp' }),
          h('span', { class: 'adm-muted', text: t.CurrentProgressPercentage == null ? 'Running' : pc(t) + '%' })),
        h('div', { class: 'adm-prog' }, h('i', { style: 'width:' + (t.CurrentProgressPercentage == null ? 30 : pc(t)) + '%' })))));

    const devSec = sec({ ico: 'monitor', title: 'Devices', sub: d.devices.length + ' connected', link: ['View all', '/dashboard/devices'] },
      d.devices.slice(0, 5).map((x) => {
        const on = active.includes(x);
        return item({ left: A().box(window.JA.device(x.Name, x.AppName, 18)), title: x.Name + ' · ' + (x.LastUserName || ''), sub: (x.AppName || '') + ' ' + (x.AppVersion || ''),
          right: badge(on ? 'Active now' : 'Idle', on ? 'ok' : '', on ? 'circle-check' : 'circle') });
      }));

    const libSec = sec({ ico: 'library', title: 'Libraries', sub: 'Where your media lives', link: ['Manage', '/dashboard/libraries'] },
      d.libs.map(({ f, n }) => {
        const scanning = f.RefreshStatus && f.RefreshStatus !== 'Idle';
        const tv = /tvshows/i.test(f.CollectionType || '');
        return item({ left: box(tv ? 'tv' : 'film'), title: f.Name,
          sub: (n == null ? '' : n.toLocaleString() + ' items · ') + ((f.Locations || [])[0] || ''),
          right: scanning ? badge('Scanning ' + Math.round(f.RefreshProgress || 0) + '%', 'info', 'sync') : badge('Up to date', 'ok', 'circle-check') });
      }));

    const plugSec = sec({ ico: 'plug', title: 'Plugins', sub: d.plugins.length + ' installed', link: ['Catalog', '/dashboard/plugins'] },
      d.plugins.slice(0, 5).map((p) => item({ left: box(/skip/i.test(p.Name) ? 'skip' : 'plug'), title: p.Name, sub: p.Description || p.Version,
        right: badge(p.Status === 'Active' ? 'Active' : p.Status, p.Status === 'Active' ? 'ok' : '', p.Status === 'Active' ? 'circle-check' : 'circle') })));

    const actSec = sec({ ico: 'activity', title: 'Activity', sub: 'Latest events', link: ['View all', '/dashboard/activity'] },
      d.log.slice(0, 6).map((e) => {
        const ff = /firefox/i.test(e.Name || '');
        return item({ left: box(ff ? 'logo-firefox' : /authenticat/i.test(e.Name) ? 'shield-check' : 'info', ff ? 18 : 14), title: e.Name, plain: true,
          sub: when(e.Date) + (e.ShortOverview ? ' · ' + e.ShortOverview.replace(/^IP address:\s*/i, '') : '') });
      }));

    const upcoming = d.tasks.filter((t) => t.State !== 'Running').map((t) => [t, nextRun(t)]).filter((x) => x[1]).sort((a, b) => a[1] - b[1]).slice(0, 4);
    const schedSec = sec({ ico: 'calendar', title: 'Scheduled tasks', sub: 'Next runs', link: ['View all', '/dashboard/tasks'] },
      upcoming.map(([t, when_]) => item({ left: icon('clock', 16), title: t.Name, plain: true, py: 10, right: h('span', { class: 'adm-muted', text: until(when_) }) })));

    const alerts = d.log.filter((e) => e.Severity === 'Warning' || e.Severity === 'Error' || e.Severity === 'Critical' || /Plugin|Install|Update/.test(e.Type || '')).slice(0, 4);
    const alertSec = sec({ ico: 'bell', title: 'Alerts', sub: alerts.length + ' new', link: ['All', '/dashboard/activity'], empty: 'No alerts' },
      alerts.map((e) => item({ left: box('info'), title: e.Name, sub: when(e.Date) })));

    const names = { CacheFolder: 'Cache', ImageCacheFolder: 'Image Cache', ProgramDataFolder: 'Program Data', LogFolder: 'Logs', InternalMetadataFolder: 'Metadata', TranscodingTempFolder: 'Transcodes' };
    const folderRows = d.storage ? Object.keys(names).map((k) => d.storage[k]).map((f, i) => f && usage(f.Path, Object.values(names)[i], f.UsedSpace, f.UsedSpace + f.FreeSpace)).filter(Boolean) : [];
    const pathSec = sec({ ico: 'hard-drive', title: 'Paths', sub: 'Storage used', empty: 'Storage info unavailable' }, folderRows);

    const c = d.counts;
    return [
      J.head('Dashboard', 'Overview of your Jellyfin server', [
        J.jbtn('Scan All Libraries', 'sync', false, power.scan), J.jbtn('Restart', 'restart', false, power.restart),
        A().btnD('Shutdown', 'power', power.shutdown)]),
      h('div', { class: 'adm-stats' },
        stat('Movies', 'film', String(c.MovieCount ?? '-'), 'Movies library'), stat('Series', 'tv', String(c.SeriesCount ?? '-'), 'Shows library'),
        stat('Episodes', 'play', (c.EpisodeCount ?? 0).toLocaleString(), 'across ' + (c.SeriesCount ?? 0) + ' series'),
        stat('Devices', 'monitor', String(d.devices.length), active.length + ' active now'),
        stat('Users', 'users', String(d.users.length), admins + ' administrator' + (admins === 1 ? '' : 's'))),
      h('div', { class: 'adm-cols3' },
        h('div', { class: 'adm-col g20' }, server, tasksSec, libSec, plugSec),
        h('div', { class: 'adm-col g20' }, actSec, schedSec),
        h('div', { class: 'adm-col g20 c440' }, alertSec, devSec, pathSec))
    ];
  }

  JA.page({
    path: '/dashboard', title: 'Dashboard',
    render(el) {
      const root = h('div', { class: 'adm-page' });
      el.append(root);
      let dead = false;
      const tick = () => load().then((d) => { if (!dead) root.replaceChildren(...build(d)); }).catch((e) => console.error(e));
      tick();
      const t = setInterval(tick, 5000);
      return () => { dead = true; clearInterval(t); };
    }
  });
})();
