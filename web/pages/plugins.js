/* Plugins page: installed plugins get a cog menu (settings, versions, enable/disable, uninstall); catalog entries get an install button on the left. */
(function () {
  const { h, icon, get, post, toast, api, go } = window.JA;
  const del = (p) => api('DELETE', p);
  const run = async (fn, ok) => { try { await fn(); if (ok) toast(ok); return true; } catch (e) { toast(e.message, 'error'); return false; } };

  function menu(anchor, items) {
    document.querySelectorAll('.ls-menu').forEach((m) => m.remove());
    const r = anchor.getBoundingClientRect();
    const m = h('div', { class: 'ls-menu', style: 'top:' + (r.bottom + 4) + 'px;right:' + Math.max(8, document.documentElement.clientWidth - r.right) + 'px' },
      items.map((i) => i === '-' ? h('hr') : i.head ? h('small', { text: i.head })
        : h('button', { type: 'button', class: i.danger ? 'danger' : '', disabled: i.disabled, onclick: () => { m.remove(); i.run(); } }, i.icon ? icon(i.icon, 14) : null, h('span', { text: i.label }))));
    document.body.append(m);
    const off = (e) => { if (!m.contains(e.target)) { m.remove(); document.removeEventListener('mousedown', off, true); } };
    setTimeout(() => document.addEventListener('mousedown', off, true), 0);
  }

  // The catalog fetch occasionally fails on the server (repository hiccup), so retry before giving up.
  async function packages() {
    for (let i = 0; i < 3; i++) { try { return await get('Packages'); } catch (e) { if (i === 2) { toast('Catalog unavailable: ' + e.message, 'error'); return []; } await new Promise((r) => setTimeout(r, 800)); } }
  }
  const install = (pkg, version) => run(() => post('Packages/Installed/' + encodeURIComponent(pkg.name) + '?assemblyGuid=' + pkg.guid
    + (version ? '&version=' + encodeURIComponent(version.version) + (version.repositoryUrl ? '&repositoryUrl=' + encodeURIComponent(version.repositoryUrl) : '') : '')), 'Installing ' + pkg.name + ', restart to apply');

  JA.page({ path: '/dashboard/plugins', title: 'Plugins', render(el) {
    const P = window.PB;
    return P.run(el, {
      title: 'Plugins', sub: 'Installed extensions and catalog', noSave: true,
      actions: () => [P.btn('Restart server', 'restart', false, () => confirm('Restart the server?') && run(() => post('System/Restart'), 'Restarting...'))],
      load: async () => ({ inst: await get('Plugins'), cat: await packages(), pages: await get('web/ConfigurationPages').catch(() => []) }),
      view: ({ inst, cat, pages }, ui) => {
        const byGuid = (g) => cat.find((c) => (c.guid || '').toLowerCase() === g.toLowerCase());
        const ids = new Set(inst.map((p) => p.Id.toLowerCase()));
        const cog = (p) => {
          const b = h('button', { class: 'ls-cog', type: 'button', title: 'Plugin options', 'aria-label': 'Plugin options' }, icon('cog', 16));
          b.addEventListener('click', (e) => {
            e.stopPropagation();
            const page = pages.find((x) => (x.PluginId || '').toLowerCase() === p.Id.toLowerCase() && !/\.(js|css)$/.test(x.Name));
            const pkg = byGuid(p.Id);
            const versions = pkg ? [...pkg.versions].sort((a, c) => new Date(c.timestamp) - new Date(a.timestamp)).slice(0, 6) : [];
            menu(b, [
              page ? { label: 'Settings', icon: 'cog', run: () => go('/configurationpage?name=' + encodeURIComponent(page.Name)) } : { label: 'No settings page', icon: 'cog', disabled: true, run() {} },
              '-', { head: 'Versions' },
              ...(versions.length ? versions.map((v) => ({ label: 'Install v' + v.version + (v.version === p.Version ? ' (current)' : ''), icon: 'download', disabled: v.version === p.Version,
                run: async () => { if (await install(pkg, v)) ui.reload(); } })) : [{ label: 'Not in a catalog', disabled: true, run() {} }]),
              '-',
              p.Status === 'Active'
                ? { label: 'Disable', run: async () => { if (await run(() => post('Plugins/' + p.Id + '/' + p.Version + '/Disable'), 'Disabled, restart to apply')) ui.reload(); } }
                : { label: 'Enable', run: async () => { if (await run(() => post('Plugins/' + p.Id + '/' + p.Version + '/Enable'), 'Enabled, restart to apply')) ui.reload(); } },
              ...(p.CanUninstall ? [{ label: 'Uninstall', icon: 'trash', danger: true, run: async () => { if (confirm('Uninstall ' + p.Name + '?') && await run(() => del('Plugins/' + p.Id + '/' + p.Version), 'Uninstalled, restart to apply')) ui.reload(); } }] : [])]);
          });
          return b;
        };
        const catalog = cat.filter((c) => !ids.has((c.guid || '').toLowerCase())).slice(0, 60);
        return { a: [
          P.sec('plug', 'Installed', inst.length + ' plugins', inst.map((p) => P.row(p.Name, 'v' + p.Version,
            h('div', { class: 'pb-actions' }, P.badge(p.Status, null, p.Status === 'Active' ? 'ok' : 'mute'), cog(p)), { py: 11, lead: h('div', { class: 'ls-ib' }, icon(JA.pluginIcon(p.Name), 16)) }))),
          P.sec('layers', 'Catalog', 'From your plugin repositories', catalog.map((c) => {
            const btn = h('button', { class: 'ls-ib ls-install', type: 'button', title: 'Install ' + c.name, 'aria-label': 'Install ' + c.name }, icon('download', 16));
            btn.addEventListener('click', async () => { if (await install(c)) ui.reload(); });
            return P.row(c.name, c.overview || c.description || '', null, { py: 11, lead: btn });
          }))],
        b: [], rail: [P.rsec('Summary', [['Installed', inst.length], ['Active', inst.filter((p) => p.Status === 'Active').length], ['In catalog', catalog.length]]
          .map(([k, v]) => P.row(k, null, h('p', { class: 'pb-sv', text: String(v) }), { py: 9 })))] };
      }
    });
  } });
})();
