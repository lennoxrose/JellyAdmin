/* Shared helpers for third-party plugin config pages (introskipper.js, serversync.js). Must load before they render. */
(function () {
  if (window.JX) return;
  const { h, icon, get, post, toast, go } = window.JA;

  const num = (v) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };

  /** Find an installed plugin by name regex and load its configuration. -> {plugin, cfg} | null */
  async function loadPlugin(re) {
    const list = await get('Plugins');
    const plugin = list.find((p) => re.test(p.Name));
    if (!plugin) return null;
    let cfg = {};
    try { cfg = await get('Plugins/' + plugin.Id + '/Configuration'); } catch (e) { /* plugin without config */ }
    return { plugin, cfg };
  }
  const saveCfg = (plugin, cfg) => post('Plugins/' + plugin.Id + '/Configuration', cfg);

  const head = (title, sub, actions) => h('div', { class: 'jx-head' },
    h('div', { class: 'jx-titles' }, h('p', { class: 'jx-title', text: title }), h('p', { class: 'jx-sub', text: sub })),
    h('div', { class: 'jx-actions' }, actions));
  const jbtn = (label, ico, primary, onclick) => h('button', { class: 'jx-btn' + (primary ? ' pri' : ''), type: 'button', onclick }, icon(ico, 14), h('span', { text: label }));

  const stat = (ico, label, value, sub, first) => h('div', { class: 'jx-stat' + (first ? ' first' : '') },
    h('div', { class: 'jx-stat-top' }, icon(ico, 14), h('span', { text: label })),
    h('div', { class: 'jx-stat-v', text: value }), h('div', { class: 'jx-stat-s', text: sub }));

  const section = (ico, title, sub, rows) => h('div', { class: 'jx-sec' },
    h('div', { class: 'jx-sec-h' }, ico ? icon(ico, 16) : null, h('div', { class: 'jx-sec-t' }, h('p', { class: 'b', text: title }), sub ? h('p', { class: 's', text: sub }) : null)),
    h('div', { class: 'jx-div' }),
    rows.map((r, i) => [i ? h('div', { class: 'jx-div' }) : null, r]));

  const rowOf = (title, sub, ctl) => h('div', { class: 'jx-row' }, h('div', { class: 'jx-row-t' }, h('p', { class: 'a', text: title }), h('p', { class: 'b', text: sub })), ctl);

  const switchEl = (on, onchange) => {
    const el = h('button', { class: 'jx-sw' + (on ? ' on' : ''), type: 'button', role: 'switch', 'aria-checked': String(!!on) }, h('i'));
    el.addEventListener('click', () => { const v = !el.classList.contains('on'); el.classList.toggle('on', v); el.setAttribute('aria-checked', String(v)); onchange(v); });
    return el;
  };
  const numInput = (v, onchange) => {
    const el = h('input', { class: 'jx-in', type: 'text', inputmode: 'numeric', value: String(v ?? ''), size: Math.max(2, String(v ?? '').length) });
    el.addEventListener('input', () => { el.size = Math.max(2, el.value.length); onchange(num(el.value)); });
    return el;
  };
  const selectEl = (opts, v, onchange) => {
    const s = h('select', { class: 'jx-sel' }, opts.map(([val, label]) => h('option', { value: val, selected: String(val) === String(v), text: label })));
    s.addEventListener('change', () => onchange(s.value));
    return h('div', { class: 'jx-selw' }, s, icon('chevron-down', 14));
  };

  const railSec = (title, ico, sub, rows) => h('div', { class: 'jx-sec' },
    h('div', { class: 'jx-sec-h' }, ico ? icon(ico, 16) : null, h('div', { class: 'jx-sec-t' }, h('p', { class: 'b', text: title }), sub ? h('p', { class: 's', text: sub }) : null)),
    h('div', { class: 'jx-div' }),
    rows.map((r, i) => [i ? h('div', { class: 'jx-div' }) : null, r]));
  const kv = (k, v) => h('div', { class: 'jx-kv' }, h('span', { text: k }), h('b', { text: v }));
  const link = (ico, title, sub, path) => h('a', { class: 'jx-link', href: '#' + path }, icon(ico, 16), h('div', { class: 'jx-row-t' }, h('p', { class: 'a', text: title }), h('p', { class: 'b', text: sub })), icon('chevron-right', 14));
  const note = (ico, text) => h('div', { class: 'jx-note' }, icon(ico, 16), h('span', { text }));
  const usage = (title, pct) => h('div', { class: 'jx-usage' }, h('span', { class: 'a', text: title }),
    h('div', { class: 'jx-us' }, h('span', { text: pct + ' %' }), h('div', { class: 'jx-prog' }, h('i', { style: 'width:' + pct + '%' }))));

  const missing = (title, sub, name) => h('div', { class: 'jx-page' }, head(title, sub, []),
    h('div', { class: 'jx-missing' }, h('p', { text: name + ' is not installed.' }),
      h('a', { class: 'jx-btn pri', href: '#/dashboard/plugins' }, h('span', { text: 'Open plugins' }))));

  window.JX = { loadPlugin, saveCfg, head, jbtn, stat, section, rowOf, switchEl, numInput, selectEl, railSec, kv, link, note, usage, missing, toast, go };
})();
