/* Users page (Figma 11:13). Needs window.LS from lists.js and window.PB at render time. */
(function () {
  const { h, icon, get, toast } = window.JA;
  JA.page({ path: '/dashboard/users', title: 'Users', render(el) {
    const P = window.PB, { stats, table, when } = window.LS;
    return P.run(el, {
      title: 'Users', sub: 'Accounts that can sign in to this server',
      actions: () => [P.btn('Quick Connect', 'key', false, async () => {
        const code = prompt('Enter the Quick Connect code shown on the device');
        if (!code) return;
        try { await JA.post('QuickConnect/Authorize?code=' + encodeURIComponent(code.trim())); toast('Device authorized'); } catch (e) { toast(e.message, 'error'); }
      }), P.btn('Add user', 'user-plus', true, () => JA.go('/dashboard/users/add'))],
      load: async () => ({ us: await get('Users'), ds: (await get('Devices')).Items, log: (await get('System/ActivityLog/Entries?startIndex=0&limit=100')).Items }),
      view: ({ us, ds, log }) => {
        const act = (d) => Date.now() - new Date(d.DateLastActivity) < 5 * 6e4;
        const lastDev = (u) => ds.filter((d) => d.LastUserId === u.Id || d.LastUserName === u.Name).sort((a, b) => new Date(b.DateLastActivity) - new Date(a.DateLastActivity))[0];
        const av = (u) => { const a = h('div', { class: 'ls-av' }); JA.avatarFill(a, u); return a; };
        const logins = log.filter((e) => /^Authentication(Succeeded|Failed)$/.test(e.Type || ''));
        const failed24 = logins.filter((e) => e.Type === 'AuthenticationFailed' && Date.now() - new Date(e.Date) < 864e5).length;
        const active = us.filter((u) => { const d = lastDev(u); return d && act(d); });
        const browsers = {};
        ds.forEach((d) => { const k = JA.family(d.Name, d.AppName); browsers[k] = (browsers[k] || 0) + 1; });
        const adm = us.filter((u) => u.Policy.IsAdministrator).length, dis = us.filter((u) => u.Policy.IsDisabled).length;
        const rows = us.map((u) => {
          const d = lastDev(u);
          return [
            h('div', { class: 'ls-who' }, av(u), h('div', {}, h('b', { text: u.Name }), h('small', { text: u.LastActivityDate ? 'Last seen ' + when(u.LastActivityDate) : 'Never signed in' }))),
            u.Policy.IsAdministrator ? P.badge('Admin', 'info', 'info') : P.badge('User', 'circle', 'mute'),
            d ? h('div', { class: 'ls-who' }, h('div', { class: 'ls-ib sm' }, JA.device(d.Name, d.AppName, 16)), d.Name) : '-',
            u.LastActivityDate ? when(u.LastActivityDate) : '-',
            u.Policy.EnableAllFolders ? 'All' : String((u.Policy.EnabledFolders || []).length),
            h('div', { class: 'ls-who', style: 'justify-content:space-between' },
              u.Policy.IsDisabled ? P.badge('Disabled', 'ban', 'danger') : (d && act(d)) ? P.badge('Active', 'circle-check', 'ok') : P.badge('Idle', 'circle', 'mute'),
              h('button', { class: 'ls-more', type: 'button', title: 'Edit user', onclick: () => JA.go('/dashboard/users/profile?userId=' + u.Id) }, icon('more', 14)))];
        });
        return { a: [
          stats([{ ico: 'users', label: 'Users', v: us.length, sub: adm + ' administrator' + (adm === 1 ? '' : 's') }, { ico: 'activity', label: 'Active now', v: active.length, sub: active.map((u) => u.Name).join(', ') || '-' },
            { ico: 'ban', label: 'Disabled', v: dis, sub: dis ? 'accounts' : 'none' }, { ico: 'monitor', label: 'Signed in devices', v: ds.length, sub: Object.keys(browsers).length + ' browsers' }]),
          table([{ label: 'User', w: 200 }, { label: 'Role', w: 114 }, { label: 'Last device', w: 177 }, { label: 'Last active', w: 135 }, { label: 'Libraries', w: 90 }, { label: 'Status' }], rows),
          P.sec('log-in', 'Recent sign-ins', 'Latest authentications', logins.slice(0, 4).map((e) => P.row(e.Name, when(e.Date) + (e.ShortOverview ? ' · ' + e.ShortOverview : ''),
            P.badge(e.Type === 'AuthenticationFailed' ? 'Failed' : 'Success', e.Type === 'AuthenticationFailed' ? 'circle-x' : 'circle-check', e.Type === 'AuthenticationFailed' ? 'danger' : 'ok'),
            { lead: h('div', { class: 'ls-ib sm' }, JA.device((e.Name.match(/from (.+)$/) || [])[1] || '', 'Jellyfin Web', 16)) }))),
          // Jellyfin has no server-side "defaults for new users"; shown as designed, not saved.
          P.sec('settings', 'Defaults for new users', 'Applied when an account is created', [
            P.row('Allow remote access', 'Sign in from outside the local network', P.tgl(true)),
            P.row('Enable media playback', 'Allow watching media', P.tgl(true)),
            P.row('Allow transcoding', 'Let the server convert media for them', P.tgl(true))])],
        b: [], rail: [
          P.rsec('Summary', [['Total users', us.length], ['Administrators', adm], ['Signed in now', active.length], ['Failed sign-ins (24h)', failed24]]
            .map(([k, v]) => P.row(k, null, h('p', { class: 'pb-sv', text: String(v) }), { py: 9 }))),
          P.sec('globe', 'Browsers', 'Used to sign in', Object.entries(browsers).map(([n, c]) => P.row(n, c + ' devices', h('p', { class: 'pb-sv', text: Math.round(c / ds.length * 100) + '%' }), { lead: h('div', { class: 'ls-ib' }, JA.device(n, /web|chrome|firefox|edge|opera|safari|brave|vivaldi|samsung|yandex|uc|chromium/i.test(n) ? 'Jellyfin Web' : n, 18)) }))),
          P.rsec('Related', [P.relatedLink('monitor', 'Devices', 'Signed in browsers', '/dashboard/devices'), P.relatedLink('activity', 'Activity', 'Sign-in events', '/dashboard/activity'),
            P.relatedLink('key', 'API Keys', 'Programmatic access', '/dashboard/keys'), P.relatedLink('lock', 'Networking', 'Remote access', '/dashboard/networking')]),
          P.rsec('Notes', [P.note('info', 'Users can change their own password and display name.'), P.note('alert', 'Admins can see and manage every library.')])] };
      }
    });
  } });
})();
