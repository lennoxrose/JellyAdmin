/* List pages built from Figma: Devices. Uses PB (playback-common) for layout/sections. */
(function () {
  const { h, icon, get, toast, api } = window.JA;
  const del = (p) => api('DELETE', p);
  const clock = (d) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const when = (iso) => {
    const d = new Date(iso), n = new Date();
    const dd = Math.round((new Date(n.getFullYear(), n.getMonth(), n.getDate()) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 864e5);
    return (dd <= 0 ? 'today' : dd === 1 ? 'yesterday' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) + ' at ' + clock(d);
  };
  const stats = (list) => h('div', { class: 'ls-stats' }, list.map((s) => h('div', { class: 'ls-stat' },
    h('div', { class: 'ls-stat-t' }, icon(s.ico, 14), h('span', { text: s.label })), h('div', { class: 'ls-stat-v', text: String(s.v) }), h('div', { class: 'ls-stat-s', text: s.sub }))));
  const table = (cols, rows) => h('div', { class: 'ls-tbl' },
    h('div', { class: 'ls-th' }, cols.map((c) => h('div', { class: 'ls-c', style: c.w ? 'width:' + c.w + 'px;flex:none' : 'flex:1', text: c.label }))),
    rows.map((r) => h('div', { class: 'ls-tr' }, cols.map((c, i) => h('div', { class: 'ls-c', style: c.w ? 'width:' + c.w + 'px;flex:none' : 'flex:1' }, r[i])))));
  window.LS = { stats, table, when, del };

  JA.page({ path: '/dashboard/devices', title: 'Devices', render(el) {
    const P = window.PB;
    return P.run(el, {
      title: 'Devices', sub: 'Browsers and apps that have signed in', actions: (ui) => [P.btn('Remove inactive', 'trash', false, async () => {
        const cut = Date.now() - 30 * 864e5, old = (ui.data || []).filter((d) => new Date(d.DateLastActivity) < cut);
        if (!old.length) return toast('No devices inactive for 30 days');
        if (!confirm('Remove ' + old.length + ' inactive devices?')) return;
        await Promise.all(old.map((d) => del('Devices?id=' + d.Id))); ui.reload();
      }), P.btn('Refresh', 'restart', false, () => ui.reload())],
      load: async () => ({ ds: (await get('Devices')).Items, ss: [].concat(await get('Sessions').catch(() => [])) }),
      view: ({ ds, ss }, ui) => {
        ui.data = ds;
        const now = Date.now(), act = (d) => now - new Date(d.DateLastActivity) < 5 * 6e4;
        const ip = (d) => (ss.find((s) => s.DeviceId === d.Id) || {}).RemoteEndPoint || '-';
        const active = ds.filter(act), playing = ss.filter((s) => s.NowPlayingItem);
        const dev = (d) => h('div', { class: 'ls-who' }, h('div', { class: 'ls-ib' }, JA.device(d.Name, d.AppName, 18)), h('div', {}, h('b', { text: d.Name }), h('small', { text: d.CustomName || d.AppName })));
        const badge = (d) => P.badge(act(d) ? 'Active now' : 'Idle', act(d) ? 'circle-check' : 'circle', act(d) ? 'ok' : 'mute');
        const remove = (d) => h('button', { class: 'ls-more', type: 'button', title: 'Remove device', onclick: async () => {
          if (!confirm('Remove ' + d.Name + '?')) return;
          try { await del('Devices?id=' + d.Id); ui.reload(); } catch (e) { toast(e.message, 'error'); }
        } }, icon('more', 14));
        const browsers = {};
        ds.forEach((d) => { const k = JA.family(d.Name, d.AppName); browsers[k] = (browsers[k] || 0) + 1; });
        const users = (list) => [...new Set(list.map((d) => d.LastUserName))].join(', ') || '-';
        return { a: [
          stats([{ ico: 'monitor', label: 'Devices', v: ds.length, sub: 'all browsers' }, { ico: 'activity', label: 'Active now', v: active.length, sub: users(active) },
            { ico: 'clock', label: 'Idle', v: ds.length - active.length, sub: users(ds.filter((d) => !act(d))) }, { ico: 'play', label: 'Playing', v: playing.length, sub: playing.length ? 'now' : 'nothing right now' }]),
          table([{ label: 'Device', w: 190 }, { label: 'User', w: 130 }, { label: 'App', w: 180 }, { label: 'IP address', w: 110 }, { label: 'Last active', w: 170 }, { label: 'Status' }],
            ds.map((d) => [dev(d), d.LastUserName || '-', (d.AppName || '') + ' ' + (d.AppVersion || ''), ip(d), when(d.DateLastActivity), h('div', { class: 'ls-who', style: 'justify-content:space-between' }, badge(d), remove(d))])),
          // Jellyfin has no server setting for these; shown as in the design, not persisted.
          P.sec('settings', 'Device policies', 'Housekeeping', [
            P.row('Remove inactive devices after', 'Sessions unused for this long are signed out', P.sel(['30 days', '60 days', '90 days'], '30 days', 190)),
            P.row('Allow multiple sessions per user', 'Sign in on several devices at once', P.tgl(true)),
            P.row('Show device names to users', 'Let users see their own devices', P.tgl(true)),
            P.row('Report device capabilities', 'Collect codecs and resolution from clients', P.tgl(true))]),
          P.sec('play', 'Now playing', 'Active streams', playing.length
            ? playing.map((s) => P.row(s.NowPlayingItem.Name, s.UserName + ' · ' + s.Client, P.badge('Playing', 'play', 'info')))
            : [P.row('Nothing is playing', 'Streams appear here while someone is watching', null, { lead: icon('circle-check', 16) })])],
        b: [], rail: [
          P.rsec('Summary', [['Devices', ds.length], ['Clients', Object.keys(browsers).length], ['Apps', [...new Set(ds.map((d) => d.AppName))].length]]
            .map(([k, v]) => P.row(k, null, h('p', { class: 'pb-sv', text: String(v) }), { py: 9 }))),
          P.sec('globe', 'Clients', 'Share of devices', Object.entries(browsers).sort((a, b) => b[1] - a[1]).map(([n, c]) => P.row(n, c === 1 ? '1 device' : c + ' devices',
            h('div', { style: 'width:116px' }, h('p', { class: 'pb-sv', text: c + ' of ' + ds.length }), h('div', { class: 'ls-bar' }, h('i', { style: 'width:' + Math.round(c / ds.length * 100) + '%' }))),
            { lead: h('div', { class: 'ls-ib' }, JA.device(n, /web|chrome|firefox|edge|opera|safari|brave|vivaldi|samsung|yandex|uc|chromium/i.test(n) ? 'Jellyfin Web' : n, 18)) }))),
          P.rsec('Related', [P.relatedLink('users', 'Users', 'Accounts and access', '/dashboard/users'), P.relatedLink('activity', 'Activity', 'Sign-in events', '/dashboard/activity'), P.relatedLink('network', 'Networking', 'Remote access', '/dashboard/networking')]),
          P.rsec('Notes', [P.note('info', 'Removing a device signs it out immediately.')])] };
      }
    });
  } });
})();
