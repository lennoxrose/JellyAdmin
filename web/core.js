/* Jelly Admin core: shell (sidebar + topbar), hash router, helpers. Page modules live in web/pages/*.js and call JA.page(). */
(function () {
  if (window.JA) return;
  const BASE = '/JellyAdmin/';

  // ---- helpers -------------------------------------------------------------
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'checked' || k === 'value' || k === 'disabled' || k === 'selected') el[k] = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
  }
  const icon = (name, size) => h('img', { class: 'ja-icon', src: BASE + 'icons/' + name + '.svg', alt: '', width: size, height: size });

  // Browser logos come from the alrra/browser-logos repo via jsDelivr (pinned), not embedded.
  const BROWSERS = [['edg|edge', 'edge'], ['opr|opera', 'opera'], ['brave', 'brave'], ['vivaldi', 'vivaldi'], ['samsung', 'samsung-internet'],
    ['yabrowser|yandex', 'yandex'], ['ucbrowser|uc browser', 'uc'], ['chromium', 'chromium'], ['firefox|fxios', 'firefox'], ['safari', 'safari'], ['chrome|crios', 'chrome']];
  function browser(text, size) {
    const t = String(text || '').toLowerCase();
    const hit = BROWSERS.find(([re]) => new RegExp(re).test(t));
    if (!hit) return icon('monitor', size);
    const img = h('img', { class: 'ja-icon', alt: '', width: size, height: size,
      src: 'https://cdn.jsdelivr.net/gh/alrra/browser-logos@v47.0.0/src/' + hit[1] + '/' + hit[1] + '_48x48.png' });
    img.addEventListener('error', () => img.replaceWith(icon('monitor', size)));
    return img;
  }

  async function api(method, path, body) {
    const url = ApiClient.getUrl(path);
    const res = await fetch(url, {
      method,
      headers: { 'X-Emby-Token': ApiClient.accessToken(), 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    if (!res.ok) throw new Error(method + ' ' + path + ' -> HTTP ' + res.status);
    const type = res.headers.get('content-type') || '';
    return type.includes('json') ? res.json() : res.text();
  }
  const get = (p) => api('GET', p);
  const post = (p, b) => api('POST', p, b);

  function toast(msg, kind) {
    const t = h('div', { class: 'ja-toast ' + (kind || ''), text: msg });
    document.body.append(t);
    setTimeout(() => t.remove(), 3500);
  }
  function btn(label, o) {
    o = o || {};
    return h('button', { class: 'ja-btn ' + (o.variant || ''), type: 'button', onclick: o.onclick, disabled: o.disabled },
      o.icon ? icon(o.icon, 14) : null, h('span', { text: label }));
  }
  function toggle(checked, onchange) {
    const el = h('button', { class: 'ja-toggle' + (checked ? ' on' : ''), type: 'button', role: 'switch', 'aria-checked': String(!!checked) }, h('i'));
    el.addEventListener('click', () => {
      const on = !el.classList.contains('on');
      el.classList.toggle('on', on);
      el.setAttribute('aria-checked', String(on));
      if (onchange) onchange(on);
    });
    return el;
  }
  const bytes = (n) => {
    const u = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
    let i = 0;
    while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
    return (i ? n.toFixed(1) : n) + ' ' + u[i];
  };
  const ago = (iso) => {
    const s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s / 60) + ' minutes ago';
    if (s < 86400) return Math.floor(s / 3600) + ' hours ago';
    return Math.floor(s / 86400) + ' days ago';
  };
  const route = () => (location.hash.replace(/^#/, '').split('?')[0] || '/').replace(/\/+$/, '') || '/';
  const query = () => new URLSearchParams(location.hash.split('?')[1] || '');
  const go = (path) => { location.hash = '#' + path; };

  // ---- navigation model (from the Figma sidebar) -----------------------------
  const NAV = [
    { section: 'SERVER', items: [
      { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
      { label: 'General', path: '/dashboard/settings', icon: 'settings' },
      { label: 'Branding', path: '/dashboard/branding', icon: 'palette' },
      { label: 'Users', path: '/dashboard/users', icon: 'users' },
      { label: 'Libraries', path: '/dashboard/libraries', icon: 'library', children: [
        { label: 'Libraries', path: '/dashboard/libraries' },
        { label: 'Display', path: '/dashboard/libraries/display' },
        { label: 'Metadata', path: '/dashboard/libraries/metadata' },
        { label: 'NFO Settings', path: '/dashboard/libraries/nfo' }] },
      { label: 'Playback', path: '/dashboard/playback/transcoding', icon: 'play', children: [
        { label: 'Transcoding', path: '/dashboard/playback/transcoding' },
        { label: 'Resume', path: '/dashboard/playback/resume' },
        { label: 'Streaming', path: '/dashboard/playback/streaming' },
        { label: 'Trickplay', path: '/dashboard/playback/trickplay' }] }] },
    { section: 'DEVICES', items: [
      { label: 'Devices', path: '/dashboard/devices', icon: 'monitor' },
      { label: 'Activity', path: '/dashboard/activity', icon: 'activity' }] },
    { section: 'LIVE TV', items: [
      { label: 'Live TV', path: '/dashboard/livetv', icon: 'tv' },
      { label: 'DVR', path: '/dashboard/livetv/recordings', icon: 'disc' }] },
    { section: 'PLUGINS', items: [
      { label: 'Plugins', path: '/dashboard/plugins', icon: 'plug' },
      { label: 'Intro Skipper', path: '/dashboard/introskipper', icon: 'skip' },
      { label: 'Server Sync', path: '/dashboard/serversync', icon: 'sync' }] }, // plugin pages are appended at runtime
    { section: 'ADVANCED', items: [
      { label: 'Networking', path: '/dashboard/networking', icon: 'network' },
      { label: 'API Keys', path: '/dashboard/keys', icon: 'key' },
      { label: 'Backups', path: '/dashboard/backups', icon: 'archive' },
      { label: 'Logs', path: '/dashboard/logs', icon: 'logs' },
      { label: 'Scheduled Tasks', path: '/dashboard/tasks', icon: 'clock' }] }
  ];
  const flatNav = () => NAV.flatMap((s) => s.items.flatMap((i) => [i, ...(i.children || [])].map((x) => ({ ...x, section: s.section }))));

  // ---- shell -----------------------------------------------------------------
  const pages = new Map();
  let shell, content, crumbEl, cleanup, lastKey, navEl, pluginItems = [];

  function isActive(item) {
    const r = route();
    return r === item.path || (item.children && item.children.some((c) => c.path === r));
  }

  function renderNav() {
    navEl.replaceChildren();
    const sections = NAV.map((s) => ({ ...s, items: s.section === 'PLUGINS' ? [...s.items, ...pluginItems] : s.items }));
    for (const s of sections) {
      const sec = h('div', { class: 'ja-sec' }, h('div', { class: 'ja-sec-label', text: s.section }));
      for (const it of s.items) {
        const open = it.children && (it.open || isActive(it));
        const row = h('a', { class: 'ja-nav' + (isActive(it) ? ' active' : ''), href: it.children ? null : '#' + it.path,
          onclick: it.children ? () => { it.open = !open; renderNav(); } : null },
          icon(it.icon, 16), h('span', { text: it.label }), it.children ? [h('i', { class: 'ja-sp' }), icon('chevron-down', 14)] : null);
        sec.append(row);
        if (open) for (const c of it.children) sec.append(h('a', { class: 'ja-nav ja-sub' + (route() === c.path ? ' active' : ''), href: '#' + c.path }, h('span', { text: c.label })));
      }
      navEl.append(sec);
    }
  }

  function buildShell() {
    navEl = h('nav', { class: 'ja-navlist' });
    const brandVer = h('div', { class: 'ja-ver', text: '' });
    const userName = h('div', { class: 'ja-uname', text: '' });
    const avatar = h('div', { class: 'ja-avatar', text: '' });
    const side = h('aside', { class: 'ja-side' },
      h('div', { class: 'ja-brand' }, icon('logo-jellyfin', 30), h('div', {}, h('div', { class: 'ja-bname', text: 'jellyfin' }), brandVer)),
      navEl, h('div', { class: 'ja-grow' }),
      h('div', { class: 'ja-user' }, avatar, h('div', {}, userName, h('div', { class: 'ja-urole', text: 'Administrator' })), h('i', { class: 'ja-sp' }), icon('more', 14)));

    crumbEl = h('div', { class: 'ja-crumb' });
    const results = h('div', { class: 'ja-results' });
    const input = h('input', { class: 'ja-search-input', placeholder: 'Search settings', autocomplete: 'off' });
    const searchGo = (path) => { results.replaceChildren(); input.value = ''; input.blur(); go(path); };
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      results.replaceChildren();
      if (!q) return;
      const hits = flatNav().filter((i) => (i.label + ' ' + i.section).toLowerCase().includes(q)).slice(0, 8);
      for (const i of hits) results.append(h('a', { class: 'ja-result', onclick: () => searchGo(i.path) }, h('span', { text: i.label }), h('small', { text: i.section })));
    });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const f = results.firstChild; if (f) f.click(); } if (e.key === 'Escape') { input.value = ''; results.replaceChildren(); input.blur(); } });
    document.addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && document.body.classList.contains('ja-shell')) { e.preventDefault(); input.focus(); } });

    const top = h('header', { class: 'ja-top' },
      h('button', { class: 'ja-iconbtn', type: 'button', onclick: () => history.back(), 'aria-label': 'Back' }, icon('arrow-left', 14)),
      crumbEl, h('i', { class: 'ja-grow' }),
      h('div', { class: 'ja-search' }, icon('search', 14), input, h('kbd', { text: '⌘K' }), results),
      h('button', { class: 'ja-iconbtn', type: 'button', onclick: () => go('/dashboard/activity'), 'aria-label': 'Activity' }, icon('bell', 14)),
      h('div', { class: 'ja-avatar big' }));
    content = h('main', { class: 'ja-content' });
    shell = h('div', { id: 'ja-root' }, side, h('div', { class: 'ja-col' }, top, content));
    document.body.append(shell);

    // async decoration; failures just leave the placeholders empty
    fetch('/System/Info/Public').then((r) => r.json()).then((i) => { brandVer.textContent = i.Version; }).catch(() => {});
    Promise.resolve(window.ApiClient && ApiClient.getCurrentUser()).then((u) => {
      if (!u) return;
      userName.textContent = u.Name;
      for (const a of shell.querySelectorAll('.ja-avatar')) a.textContent = u.Name.slice(0, 1).toUpperCase();
    }).catch(() => {});
    get('web/ConfigurationPages?EnableInMainMenu=true').then((list) => {
      pluginItems = list.filter((p) => p.Name !== 'Jelly Admin Theme').map((p) => ({
        label: p.DisplayName || p.Name, path: '/configurationpage?name=' + encodeURIComponent(p.Name), icon: 'plug' }));
      renderNav();
    }).catch(() => {});
  }

  function sync() {
    const inDash = document.body.classList.contains('dashboardDocument');
    if (!inDash) { document.body.classList.remove('ja-shell', 'ja-custom'); if (cleanup) { cleanup(); cleanup = null; } lastKey = null; return; }
    if (!shell) {
      try { buildShell(); } catch (e) { console.error('JellyAdmin shell failed', e); window.JA.error = e; return; } // leave stock UI untouched on failure
    }
    document.body.classList.add('ja-shell');
    const key = location.hash;
    if (key === lastKey) return;
    lastKey = key;
    if (cleanup) { try { cleanup(); } catch (e) { console.error(e); } cleanup = null; }
    const page = pages.get(route());
    const all = flatNav().find((n) => n.path === route());
    crumbEl.replaceChildren(h('span', { text: all ? titleCase(all.section) : 'Server' }), icon('chevron-right', 12),
      h('b', { text: page ? page.title : all ? all.label : route().split('/').pop() }));
    document.body.classList.toggle('ja-custom', !!page);
    content.replaceChildren();
    renderNav();
    if (page) {
      try { cleanup = page.render(content, { query: query(), path: route() }) || null; }
      catch (e) { console.error(e); content.append(h('pre', { class: 'ja-error', text: 'Page failed to render: ' + e.message })); }
    }
  }
  const titleCase = (s) => s.charAt(0) + s.slice(1).toLowerCase();

  /** Register a page. def = { path | paths, title, render(el, {query,path}) -> optional cleanup fn } */
  function page(def) { for (const p of [].concat(def.paths || def.path)) pages.set(p, def); lastKey = null; if (shell) sync(); }

  window.JA = { h, icon, browser, api, get, post, toast, btn, toggle, bytes, ago, query, route, go, page, NAV };
  const start = () => {
    new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    sync();
  };
  window.addEventListener('hashchange', sync);
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
