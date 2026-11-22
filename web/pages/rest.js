/* Remaining admin pages built on window.PB (playback-common.js). Each page loads real data and writes back through the Jellyfin API. */
(function () {
  const { h, icon, get, post, toast, api } = Object.assign({}, window.JA);
  const el$ = (...a) => window.PB.h(...a);

  // ---- helpers ---------------------------------------------------------------
  const lead = (n) => window.PB.ibox(n);
  const del = (p) => api('DELETE', p);
  const when = (iso) => (iso ? new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '-');
  const link = (label, href) => h('a', { class: 'pb-btn', href: '#' + href }, h('span', { text: label }));
  const tryDo = async (fn, ok) => { try { await fn(); if (ok) toast(ok); return true; } catch (e) { toast(e.message, 'error'); return false; } };
  const sure = (msg) => confirm(msg);

  /** Settings page: GET one config object, edit fields, POST it back. */
  function settings(path, title, sub, cfgPath, build, extra) {
    JA.page({ path, title, render(el) {
      const { run } = window.PB;
      return run(el, {
        title, sub,
        load: async () => ({ cfg: await get(cfgPath), extra: extra ? await extra() : null }),
        save: (d) => post(cfgPath, d.cfg),
        view: (d, ui) => build(d.cfg, ui, d.extra)
      });
    } });
  }

  /** Data page: custom header action, content rebuilt on every refresh. */
  function listPage(path, title, sub, o) {
    JA.page({ path, title, render(el) {
      const root = h('div', { class: 'pb-page' });
      el.append(root);
      let dead = false, timer;
      const refresh = async () => {
        let d;
        try { d = await o.load(); } catch (e) { root.replaceChildren(h('pre', { class: 'ja-error', text: 'Failed to load: ' + e.message })); return; }
        if (dead) return;
        const v = o.view(d, refresh);
        root.replaceChildren(
          h('div', { class: 'pb-head' }, h('div', { class: 'pb-titles' }, h('p', { class: 'pb-title', text: title }), h('p', { class: 'pb-sub', text: sub })),
            h('div', { class: 'pb-actions' }, o.actions ? o.actions(d, refresh) : null)),
          h('div', { class: 'pb-cols' }, h('div', { class: 'pb-main' }, h('div', { class: 'pb-col', style: 'flex:1' }, v.a)), h('div', { class: 'pb-rail' }, v.rail || null)));
      };
      refresh();
      if (o.poll) timer = setInterval(refresh, o.poll);
      return () => { dead = true; clearInterval(timer); };
    } });
  }
  const P = window.PB;
  const bd = (...a) => P.badge(...a);
  const bt = (...a) => P.btn(...a);
  const rowI = (ico, t, s, right) => P.row(t, s, right, { py: 11, lead: lead(ico) });
  const empty = (msg, ico) => [P.row(msg, null, null, { py: 14, lead: lead(ico || 'info') })];
  const summary = (title, pairs) => P.rsec(title, pairs.map(([k, v]) => P.row(k, null, h('p', { class: 'pb-sv', text: String(v) }), { py: 9 })));

  // ---- Branding ----------------------------------------------------------------
  settings('/dashboard/branding', 'Branding', 'Login screen and custom styling', 'Branding/Configuration', (c) => {
    const area = (k, ph, rows) => { const t = h('textarea', { class: 'pb-in', rows, placeholder: ph, spellcheck: 'false', style: 'width:360px;height:' + rows * 20 + 'px;padding:8px 10px;resize:vertical' }); t.value = c[k] || ''; t.addEventListener('input', () => { c[k] = t.value; }); return t; };
    return { a: [P.sec('palette', 'Login', 'Shown on the sign-in page', [
      P.row('Login disclaimer', 'Text shown below the login form', area('LoginDisclaimer', 'Disclaimer', 4), {}),
      P.row('Splash screen', 'Show the splash screen image', P.tgl(c.SplashscreenEnabled, (v) => { c.SplashscreenEnabled = v; }))]),
      P.sec('code', 'Custom CSS', 'Applied to every client', [P.row('Custom CSS code', 'Styles added to all web clients', area('CustomCss', '/* css */', 10))])], b: [], rail: [] };
  });

  // ---- Users -------------------------------------------------------------------
  listPage('/dashboard/users', 'Users', 'Accounts that can sign in to this server', {
    load: () => get('Users'),
    actions: () => link('Add user', '/dashboard/users/add'),
    view: (us) => ({
      a: [P.sec('users', 'All users', us.length + ' accounts', us.map((u) => rowI('users', u.Name,
        (u.LastActivityDate ? 'last active ' + when(u.LastActivityDate) : 'never signed in'),
        h('div', { class: 'pb-actions' }, u.Policy.IsAdministrator ? bd('Admin', 'shield', 'info') : null, u.Policy.IsDisabled ? bd('Disabled', 'circle', 'mute') : null,
          link('Edit', '/dashboard/users/profile?userId=' + u.Id)))))],
      rail: [summary('Summary', [['Accounts', us.length], ['Administrators', us.filter((u) => u.Policy.IsAdministrator).length], ['Disabled', us.filter((u) => u.Policy.IsDisabled).length]])]
    })
  });

  // ---- Libraries -----------------------------------------------------------------
  listPage('/dashboard/libraries', 'Libraries', 'Media folders on this server', {
    load: () => get('Library/VirtualFolders'),
    actions: (_, refresh) => [bt('Scan all libraries', 'sync', false, () => tryDo(() => post('Library/Refresh'), 'Library scan started')),
      bt('Add library', 'plus', true, () => addLibrary(refresh))],
    view: (libs, refresh) => ({
      a: [P.sec('library', 'Libraries', libs.length + ' configured', libs.length ? libs.map((l) => rowI('folder', l.Name, (l.CollectionType || 'mixed') + ' · ' + (l.Locations || []).join(', '),
        h('div', { class: 'pb-actions' },
          bt('Scan', 'sync', false, () => tryDo(() => post('Items/' + l.ItemId + '/Refresh?Recursive=true&ImageRefreshMode=Default&MetadataRefreshMode=Default'), 'Scan started')),
          bt('Remove', 'trash', false, async () => { if (sure('Remove library "' + l.Name + '"? Media files are not deleted.') && await tryDo(() => del('Library/VirtualFolders?name=' + encodeURIComponent(l.Name)), 'Removed')) refresh(); })))) : empty('No libraries yet', 'library'))],
      rail: [P.rsec('Related', [P.relatedLink('settings', 'Display', 'Folder view and grouping', '/dashboard/libraries/display'), P.relatedLink('library', 'Metadata', 'Language and country', '/dashboard/libraries/metadata')])]
    })
  });
  function addLibrary(refresh) {
    const name = prompt('Library name'); if (!name) return;
    const type = prompt('Type (movies, tvshows, music, books, homevideos, musicvideos, mixed)', 'movies'); if (!type) return;
    const path = prompt('Media folder path on the server'); if (!path) return;
    tryDo(() => post('Library/VirtualFolders?name=' + encodeURIComponent(name) + '&collectionType=' + (type === 'mixed' ? '' : type) + '&refreshLibrary=true', { LibraryOptions: { PathInfos: [{ Path: path }] } }), 'Library added').then((ok) => ok && refresh());
  }

  // ---- Libraries: Display / Metadata / NFO ---------------------------------------------
  settings('/dashboard/libraries/display', 'Display', 'How libraries are shown', 'System/Configuration', (c) => ({
    a: [P.sec('settings', 'Display', 'Grouping and folders', [
      P.row('Folder view', 'Show a folder view of media', P.tgl(c.EnableFolderView, (v) => { c.EnableFolderView = v; })),
      P.row('Display specials within seasons', 'Show specials in the season they aired', P.tgl(c.DisplaySpecialsWithinSeasons, (v) => { c.DisplaySpecialsWithinSeasons = v; })),
      P.row('Group movies into collections', 'Show movies in a collection as one item', P.tgl(c.EnableGroupingMoviesIntoCollections, (v) => { c.EnableGroupingMoviesIntoCollections = v; })),
      P.row('Group shows into collections', 'Show shows in a collection as one item', P.tgl(c.EnableGroupingShowsIntoCollections, (v) => { c.EnableGroupingShowsIntoCollections = v; }))])], b: [], rail: []
  }));
  settings('/dashboard/libraries/metadata', 'Metadata', 'Preferred language and country', 'System/Configuration', (c, ui, x) => ({
    a: [P.sec('library', 'Defaults', 'Used when a library has no override', [
      P.row('Metadata language', 'Language for downloaded metadata', P.sel(x.langs.map((l) => [l.TwoLetterISOLanguageName, l.DisplayName]), c.PreferredMetadataLanguage || 'en', 240, (v) => { c.PreferredMetadataLanguage = v; })),
      P.row('Country', 'Used for ratings and release dates', P.sel(x.countries.map((l) => [l.TwoLetterISORegionName, l.DisplayName]), c.MetadataCountryCode || 'US', 240, (v) => { c.MetadataCountryCode = v; }))])], b: [], rail: []
  }), async () => ({ langs: (await get('Localization/Cultures')).filter((l) => l.TwoLetterISOLanguageName), countries: await get('Localization/Countries') }));
  settings('/dashboard/libraries/nfo', 'NFO Settings', 'Kodi-style NFO metadata files', 'System/Configuration/xbmcmetadata', (c) => ({
    a: [P.sec('logs', 'NFO', 'Saved next to media files', [
      P.row('Release date format', 'Format used inside NFO files', P.inp(c.ReleaseDateFormat, { w: 240, cb: (v) => { c.ReleaseDateFormat = v; } })),
      P.row('Save image paths in NFO', 'Write image paths to the file', P.tgl(c.SaveImagePathsInNfo, (v) => { c.SaveImagePathsInNfo = v; })),
      P.row('Enable path substitution', 'Apply substitutions to image paths', P.tgl(c.EnablePathSubstitution, (v) => { c.EnablePathSubstitution = v; })),
      P.row('Duplicate extra thumbs', 'Copy extrafanart to extrathumbs', P.tgl(c.EnableExtraThumbsDuplication, (v) => { c.EnableExtraThumbsDuplication = v; }))])], b: [], rail: []
  }));

  // ---- Streaming / Trickplay / Networking ------------------------------------------------------
  settings('/dashboard/playback/streaming', 'Streaming', 'Bitrate limits for remote clients', 'System/Configuration', (c) => ({
    a: [P.sec('play', 'Remote streaming', 'Limits apply outside the local network', [
      P.row('Internet streaming bitrate limit (Mbps)', 'Leave empty for no limit', P.inp(c.RemoteClientBitrateLimit ? c.RemoteClientBitrateLimit / 1e6 : '', { w: 160, num: true, cb: (v) => { c.RemoteClientBitrateLimit = Math.round(P.num(v) * 1e6); } }))])], b: [], rail: []
  }));
  JA.page({ path: '/dashboard/playback/trickplay', title: 'Trickplay', render(el) {
    return P.run(el, {
      title: 'Trickplay', sub: 'Scrubbing preview images, applied to every library',
      load: async () => { const libs = await get('Library/VirtualFolders'); return { libs, o: Object.assign({ EnableTrickplayImageExtraction: false, ExtractTrickplayImagesDuringLibraryScan: false, TrickplayOptions: {} }, (libs[0] || {}).LibraryOptions) }; },
      save: (d) => Promise.all(d.libs.map((l) => { const o = Object.assign({}, l.LibraryOptions, { EnableTrickplayImageExtraction: d.o.EnableTrickplayImageExtraction, ExtractTrickplayImagesDuringLibraryScan: d.o.ExtractTrickplayImagesDuringLibraryScan, TrickplayOptions: Object.assign({}, l.LibraryOptions.TrickplayOptions, d.o.TrickplayOptions) }); return post('Library/VirtualFolders/LibraryOptions', { Id: l.ItemId, LibraryOptions: o }); })),
      view: (d) => { const o = d.o, t = o.TrickplayOptions; return { a: [P.sec('skip', 'Generation', 'Extra disk use while scanning', [
        P.row('Enable trickplay image extraction', 'Create previews for scrubbing', P.tgl(o.EnableTrickplayImageExtraction, (v) => { o.EnableTrickplayImageExtraction = v; })),
        P.row('Extract during library scan', 'Instead of a scheduled task', P.tgl(o.ExtractTrickplayImagesDuringLibraryScan, (v) => { o.ExtractTrickplayImagesDuringLibraryScan = v; })),
        P.row('Interval (ms)', 'Time between images', P.inp(t.Interval || 10000, { w: 160, num: true, cb: (v) => { t.Interval = P.num(v, 10000); } })),
        P.row('JPEG quality', '1-100', P.inp(t.JpegQuality || 80, { w: 160, num: true, cb: (v) => { t.JpegQuality = P.num(v, 80); } }))])], b: [], rail: [] }; }
    });
  } });
  settings('/dashboard/networking', 'Networking', 'Ports, HTTPS and discovery', 'System/Configuration/network', (c) => {
    const n = (k) => P.inp(c[k], { w: 160, num: true, cb: (v) => { c[k] = P.num(v); } });
    const t = (k) => P.tgl(c[k], (v) => { c[k] = v; });
    return { a: [
      P.sec('network', 'Ports', null, [P.row('HTTP port', 'Local port', n('InternalHttpPort')), P.row('HTTPS port', 'Local port for HTTPS', n('InternalHttpsPort')),
        P.row('Public HTTP port', 'Port advertised to clients', n('PublicHttpPort')), P.row('Public HTTPS port', null, n('PublicHttpsPort')),
        P.row('Base URL', 'Path prefix, e.g. /jellyfin', P.inp(c.BaseUrl, { w: 240, cb: (v) => { c.BaseUrl = v; } }))]),
      P.sec('key', 'Security', null, [P.row('Enable HTTPS', 'Needs a certificate', t('EnableHttps')), P.row('Require HTTPS', 'Redirect plain HTTP', t('RequireHttps')),
        P.row('Certificate path', 'PKCS#12 file', P.inp(c.CertificatePath, { w: 240, cb: (v) => { c.CertificatePath = v; } }))])],
      b: [P.sec('network', 'Discovery', null, [P.row('Enable IPv4', null, t('EnableIPv4')), P.row('Enable IPv6', null, t('EnableIPv6')), P.row('Auto discovery', 'Respond to client discovery', t('AutoDiscovery')), P.row('Enable UPnP', 'Automatic port mapping', t('EnableUPnP')),
        P.row('Local network subnets', 'Comma separated', P.inp((c.LocalNetworkSubnets || []).join(', '), { w: 240, cb: (v) => { c.LocalNetworkSubnets = v.split(',').map((s) => s.trim()).filter(Boolean); } })),
        P.row('Known proxies', 'Comma separated', P.inp((c.KnownProxies || []).join(', '), { w: 240, cb: (v) => { c.KnownProxies = v.split(',').map((s) => s.trim()).filter(Boolean); } }))])], rail: [] };
  });

  // ---- Devices / Activity -------------------------------------------------------------
  listPage('/dashboard/devices', 'Devices', 'Clients that have signed in', {
    load: async () => (await get('Devices')).Items,
    actions: (ds, refresh) => bt('Remove all others', 'trash', false, async () => { const me = ApiClient.deviceId(); if (sure('Sign out every other device?')) { await Promise.all(ds.filter((d) => d.Id !== me).map((d) => del('Devices?id=' + d.Id))); refresh(); } }),
    view: (ds, refresh) => ({
      a: [P.sec('monitor', 'Devices', ds.length + ' known', ds.length ? ds.map((d) => P.row(d.Name, d.AppName + ' ' + (d.AppVersion || '') + ' · ' + (d.LastUserName || '-') + ' · ' + when(d.DateLastActivity),
        bt('Remove', 'trash', false, async () => { if (await tryDo(() => del('Devices?id=' + d.Id), 'Removed')) refresh(); }), { py: 11, lead: h('div', { class: 'pb-ib' }, JA.browser(d.Name + ' ' + d.AppName, 18)) })) : empty('No devices', 'monitor'))],
      rail: [summary('Summary', [['Devices', ds.length], ['Users', new Set(ds.map((d) => d.LastUserName)).size]])]
    })
  });
  listPage('/dashboard/activity', 'Activity', 'Recent server events', {
    poll: 10000,
    load: async () => (await get('System/ActivityLog/Entries?startIndex=0&limit=60')).Items,
    view: (es) => ({
      a: [P.sec('activity', 'Log', 'Latest 60 entries', es.map((e) => rowI(e.Severity === 'Error' || e.Severity === 'Warning' ? 'alert' : 'activity', e.Name, (e.ShortOverview || e.Overview || '') + ' · ' + when(e.Date),
        bd(e.Severity, null, e.Severity === 'Error' ? 'danger' : e.Severity === 'Warning' ? 'warn' : 'mute'))))],
      rail: [summary('Summary', [['Entries', es.length], ['Warnings', es.filter((e) => e.Severity === 'Warning').length], ['Errors', es.filter((e) => e.Severity === 'Error').length]])]
    })
  });

  // ---- Plugins / API keys ---------------------------------------------------------------
  listPage('/dashboard/plugins', 'Plugins', 'Installed extensions and catalog', {
    load: async () => ({ inst: await get('Plugins'), cat: await get('Packages').catch(() => []) }),
    actions: () => bt('Restart server', 'restart', false, () => sure('Restart the server?') && tryDo(() => post('System/Restart'), 'Restarting...')),
    view: ({ inst, cat }, refresh) => {
      const ids = new Set(inst.map((p) => p.Id.toLowerCase()));
      return { a: [
        P.sec('plug', 'Installed', inst.length + ' plugins', inst.map((p) => rowI('plug', p.Name, 'v' + p.Version,
          h('div', { class: 'pb-actions' }, bd(p.Status, null, p.Status === 'Active' ? 'ok' : 'mute'),
            p.Status === 'Active' ? bt('Disable', null, false, async () => { if (await tryDo(() => post('Plugins/' + p.Id + '/' + p.Version + '/Disable'), 'Disabled, restart to apply')) refresh(); }) : bt('Enable', null, false, async () => { if (await tryDo(() => post('Plugins/' + p.Id + '/' + p.Version + '/Enable'), 'Enabled, restart to apply')) refresh(); }),
            p.CanUninstall ? bt('Uninstall', 'trash', false, async () => { if (sure('Uninstall ' + p.Name + '?') && await tryDo(() => del('Plugins/' + p.Id + '/' + p.Version), 'Uninstalled, restart to apply')) refresh(); }) : null)))),
        P.sec('layers', 'Catalog', 'From your plugin repositories', cat.filter((p) => !ids.has((p.guid || '').toLowerCase())).slice(0, 40).map((p) => rowI('plug', p.name, p.overview || p.description || '',
          bt('Install', 'plus', false, async () => { if (await tryDo(() => post('Packages/Installed/' + encodeURIComponent(p.name) + '?assemblyGuid=' + p.guid), 'Installing ' + p.name)) refresh(); }))))],
        rail: [summary('Summary', [['Installed', inst.length], ['Active', inst.filter((p) => p.Status === 'Active').length]])] };
    }
  });
  listPage('/dashboard/keys', 'API Keys', 'Tokens for external apps', {
    load: async () => (await get('Auth/Keys')).Items,
    actions: (_, refresh) => bt('New key', 'plus', true, async () => { const n = prompt('App name for this key'); if (n && await tryDo(() => post('Auth/Keys?app=' + encodeURIComponent(n)), 'Key created')) refresh(); }),
    view: (ks, refresh) => ({
      a: [P.sec('key', 'Keys', ks.length + ' active', ks.length ? ks.map((k) => rowI('key', k.AppName, k.AccessToken + ' · ' + when(k.DateCreated),
        h('div', { class: 'pb-actions' }, bt('Copy', null, false, () => navigator.clipboard.writeText(k.AccessToken).then(() => toast('Copied'))),
          bt('Revoke', 'trash', false, async () => { if (sure('Revoke this key?') && await tryDo(() => del('Auth/Keys/' + k.AccessToken), 'Revoked')) refresh(); })))) : empty('No API keys', 'key'))],
      rail: [summary('Summary', [['Keys', ks.length]])]
    })
  });

  // ---- Backups / Logs / Tasks ------------------------------------------------------------
  listPage('/dashboard/backups', 'Backups', 'Server data archives', {
    load: () => get('Backup').catch(() => []),
    actions: (_, refresh) => bt('Create backup', 'plus', true, async () => { if (await tryDo(() => post('Backup/Create', { Metadata: true, Trickplay: false, Subtitles: true, Database: true }), 'Backup created')) refresh(); }),
    view: (bs, refresh) => ({
      a: [P.sec('archive', 'Backups', bs.length + ' archives', bs.length ? bs.map((b) => rowI('archive', b.Path.split(/[\\/]/).pop(), 'v' + (b.ServerVersion || '?') + ' · ' + when(b.DateCreated),
        bt('Restore', 'restart', false, () => { if (sure('Restore this backup? The server restarts.')) tryDo(() => post('Backup/Restore', { ArchiveFileName: b.Path.split(/[\\/]/).pop() }), 'Restoring...'); }))) : empty('No backups yet', 'archive'))],
      rail: [summary('Summary', [['Archives', bs.length]])]
    })
  });
  listPage('/dashboard/logs', 'Logs', 'Server log files', {
    load: () => get('System/Logs'),
    view: (ls) => ({
      a: [P.sec('logs', 'Files', ls.length + ' logs', ls.map((l) => rowI('logs', l.Name, window.JA.bytes(l.Size) + ' · ' + when(l.DateModified),
        h('a', { class: 'pb-btn', target: '_blank', href: ApiClient.getUrl('System/Logs/Log?name=' + encodeURIComponent(l.Name)) + '&api_key=' + ApiClient.accessToken() }, h('span', { text: 'Open' })))))],
      rail: [summary('Summary', [['Files', ls.length]])]
    })
  });
  listPage('/dashboard/tasks', 'Scheduled Tasks', 'Maintenance jobs', {
    poll: 4000,
    load: () => get('ScheduledTasks?isHidden=false'),
    view: (ts, refresh) => ({
      a: [P.sec('clock', 'Tasks', ts.length + ' tasks', ts.map((t) => {
        const run = t.State === 'Running', last = t.LastExecutionResult;
        return rowI('clock', t.Name, run ? 'running ' + Math.round(t.CurrentProgressPercentage || 0) + '%' : (t.Category + ' · last ' + (last ? last.Status + ' ' + when(last.EndTimeUtc) : 'never')),
          run ? bt('Stop', null, false, async () => { await tryDo(() => del('ScheduledTasks/Running/' + t.Id)); refresh(); }) : bt('Run', 'play', false, async () => { await tryDo(() => post('ScheduledTasks/Running/' + t.Id), 'Started'); refresh(); }));
      }))],
      rail: [summary('Summary', [['Tasks', ts.length], ['Running', ts.filter((t) => t.State === 'Running').length]])]
    })
  });

  // ---- Live TV / DVR ----------------------------------------------------------------------
  listPage('/dashboard/livetv', 'Live TV', 'Tuners and guide data', {
    load: async () => get('System/Configuration/livetv'),
    view: (c, refresh) => ({
      a: [P.sec('tv', 'Tuner devices', (c.TunerHosts || []).length + ' configured', (c.TunerHosts || []).length ? c.TunerHosts.map((t) => rowI('tv', t.FriendlyName || t.Type, t.Url,
        bt('Remove', 'trash', false, async () => { if (sure('Remove this tuner?') && await tryDo(() => del('LiveTv/TunerHosts?id=' + t.Id), 'Removed')) refresh(); }))) : empty('No tuners configured', 'tv')),
        P.sec('layers', 'TV guide data', (c.ListingProviders || []).length + ' providers', (c.ListingProviders || []).length ? c.ListingProviders.map((p) => rowI('layers', p.Type, p.Path || p.ListingsId || '',
          bt('Remove', 'trash', false, async () => { if (sure('Remove this provider?') && await tryDo(() => del('LiveTv/ListingProviders?id=' + p.Id), 'Removed')) refresh(); }))) : empty('No guide providers', 'layers'))],
      rail: [P.rsec('Notes', [P.note('info', 'Adding tuners and guide providers needs the stock setup dialogs; toggle the theme off in the plugin settings to use them.')])]
    })
  });
  listPage('/dashboard/livetv/recordings', 'DVR', 'Scheduled and series recordings', {
    poll: 15000,
    load: async () => ({ t: (await get('LiveTv/Timers')).Items, s: (await get('LiveTv/SeriesTimers')).Items }),
    view: ({ t, s }, refresh) => ({
      a: [P.sec('disc', 'Scheduled', t.length + ' recordings', t.length ? t.map((x) => rowI('disc', x.Name, x.ChannelName + ' · ' + when(x.StartDate),
        h('div', { class: 'pb-actions' }, bd(x.Status, null, x.Status === 'InProgress' ? 'ok' : 'mute'), bt('Cancel', 'trash', false, async () => { if (await tryDo(() => del('LiveTv/Timers/' + x.Id), 'Cancelled')) refresh(); })))) : empty('Nothing scheduled', 'disc')),
        P.sec('disc', 'Series', s.length + ' rules', s.length ? s.map((x) => rowI('disc', x.Name, x.ChannelName || 'Any channel',
          bt('Cancel', 'trash', false, async () => { if (await tryDo(() => del('LiveTv/SeriesTimers/' + x.Id), 'Cancelled')) refresh(); }))) : empty('No series rules', 'disc'))],
      rail: [summary('Summary', [['Scheduled', t.length], ['Series rules', s.length]])]
    })
  });
})();
