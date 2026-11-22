/* Branding page (Figma 9:591). Real: login disclaimer, splash toggle/image, custom CSS, Quick Connect. Design-only items are not saved. */
(function () {
  const { h, icon, get, post, toast, api } = window.JA;
  JA.page({ path: '/dashboard/branding', title: 'Branding', render(el) {
    const P = window.PB, { when } = window.LS;
    return P.run(el, {
      title: 'Branding', sub: 'Customize the login screen and the look of the web client',
      load: async () => ({ b: await get('Branding/Configuration'), sys: await get('System/Configuration'), us: await get('Users'),
        log: (await get('System/ActivityLog/Entries?startIndex=0&limit=3&hasUserId=true').catch(() => ({ Items: [] }))).Items }),
      save: async (d) => { await post('System/Configuration/branding', d.b); await post('System/Configuration', d.sys); },
      view: ({ b, sys, us, log }, ui) => {
        const area = (get_, set_, ph, cls) => { const t = h('textarea', { class: 'pb-in ' + (cls || ''), placeholder: ph, spellcheck: 'false' }); t.value = get_() || ''; t.addEventListener('input', () => set_(t.value)); return t; };
        const lines = (b.CustomCss || '').split('\n').length || 1;
        const gutter = h('div', { class: 'br-gutter' });
        const code = h('textarea', { class: 'br-code', spellcheck: 'false', placeholder: '/* custom css */' });
        const number = () => gutter.replaceChildren(...Array.from({ length: Math.max(1, code.value.split('\n').length) }, (_, i) => h('div', { text: String(i + 1) })));
        code.value = b.CustomCss || ''; number();
        code.addEventListener('input', () => { b.CustomCss = code.value; number(); ui.refresh(); });
        code.addEventListener('scroll', () => { gutter.scrollTop = code.scrollTop; });
        const file = h('input', { type: 'file', accept: 'image/png,image/jpeg', style: 'display:none' });
        file.addEventListener('change', async () => {
          const f = file.files[0]; if (!f) return;
          const data = await new Promise((ok) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(',')[1]); r.readAsDataURL(f); });
          try {
            const res = await fetch(ApiClient.getUrl('Branding/Splashscreen'), { method: 'POST', headers: { ...JA.auth(), 'Content-Type': f.type }, body: data });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            toast('Splash image uploaded');
          } catch (e) { toast('Upload failed: ' + e.message, 'error'); }
        });
        // Design-only controls: shown, not persisted (Jellyfin has no server setting for them).
        const local = (on) => P.tgl(on);
        const avatar = (u) => { const a = h('div', { class: 'ls-av' }); JA.avatarFill(a, u); return a; };
        return { a: [
          P.sec('lock', 'Login', 'What people see before signing in', [
            P.row('Login disclaimer', 'Message shown on the login page', area(() => b.LoginDisclaimer, (v) => { b.LoginDisclaimer = v; ui.refresh(); }, 'Add a message…', 'br-area')),
            P.row('Show server name', 'Display the server name above the form', local(true)),
            P.row('Show Quick Connect', 'Offer sign in with a code', P.tgl(sys.QuickConnectAvailable, (v) => { sys.QuickConnectAvailable = v; }))]),
          P.sec('image', 'Splash screen', 'Shown while the client loads', [
            P.row('Enable splash screen', 'Use a custom splash image', P.tgl(b.SplashscreenEnabled, (v) => { b.SplashscreenEnabled = v; ui.refresh(); })),
            P.row('Splash image', 'PNG or JPG, 1920 × 1080 recommended', [file, P.btn('Upload', 'upload', false, () => file.click())]),
            P.row('Remove splash image', 'Go back to the default', h('button', { class: 'pb-btn br-danger', type: 'button', onclick: async () => { try { await api('DELETE', 'Branding/Splashscreen'); toast('Splash image removed'); } catch (e) { toast(e.message, 'error'); } } }, icon('trash', 14), h('span', { text: 'Remove' })))]),
          P.sec('layers', 'Icons', 'Navigation icons in the admin panel', [
            P.row('Show icons in sidebar', 'One icon per menu entry', local(true)), P.row('Icon style', 'Stroke weight of icons', P.sel(['Thin', 'Regular', 'Bold'], 'Thin', 240))]),
          P.sec('users', 'Per-user overrides', 'Custom values per account', us.map((u) => P.row(u.Name, u.Policy.IsAdministrator ? 'Administrator' : 'User',
            P.sel(['Use server default', 'Custom'], 'Use server default', 200), { lead: avatar(u) })))],
        b: [
          P.sec('terminal', 'Custom CSS code', 'Applied to every client that loads the web interface', [h('div', { class: 'br-editor' }, gutter, code)]),
          P.sec('palette', 'Theme', 'Defaults for new clients', [
            P.row('Default theme', 'Applied until a user picks their own', P.sel(['Dark', 'Light'], 'Dark', 170)),
            P.row('Accent color', 'Buttons and highlights', h('div', { class: 'br-color' }, h('i'), h('span', { text: '#FAFAFA' }))),
            P.row('Interface font', 'Typeface used by the web client', P.sel(['JetBrains Mono', 'System'], 'JetBrains Mono', 170)),
            P.row('Compact lists', 'Tighter row spacing', local(true))]),
          P.sec('history', 'Recent changes', 'Configuration history', log.length ? log.map((e) => P.row(e.Name, when(e.Date), null, { lead: h('div', { class: 'ls-ib' }, icon('history', 14)) })) : [P.row('No recent changes', null, null, { lead: h('div', { class: 'ls-ib' }, icon('history', 14)) })])],
        rail: [
          P.rsec('Current branding', [['Login disclaimer', b.LoginDisclaimer ? 'Set' : 'Not set'], ['Splash screen', b.SplashscreenEnabled ? 'On' : 'Off'], ['Theme', 'Dark'],
            ['Custom CSS', (b.CustomCss ? b.CustomCss.split('\n').length : 0) + ' line(s)'], ['Font', 'JetBrains Mono']].map(([k, v]) => P.row(k, null, h('p', { class: 'pb-sv', text: v }), { py: 9 }))),
          P.rsec('Related', [P.relatedLink('settings', 'General', 'Server name and language', '/dashboard/settings'), P.relatedLink('users', 'Users', 'Who appears on the login screen', '/dashboard/users'), P.relatedLink('info', 'Theming guide', 'Documentation', '/dashboard/branding')]),
          P.rsec('Notes', [P.note('info', 'Custom CSS loads after the default stylesheet.'), P.note('alert', 'Invalid CSS can make the interface hard to read. Keep a backup.')])] };
      }
    });
  } });
})();
