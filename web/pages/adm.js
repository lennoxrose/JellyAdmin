/* Shared helpers for dashboard/general/branding/users pages. Needs jxlib.js (JX) at render time. */
(function () {
  if (window.ADM) return;
  const { h, icon, post, toast } = window.JA;
  const safe = (p) => p.catch(() => null);
  const day0 = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const clock = (d) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const when = (iso) => {
    const d = new Date(iso), n = Math.round((day0(new Date()) - day0(d)) / 864e5);
    if (n <= 0) return 'today at ' + clock(d);
    if (n === 1) return 'yesterday at ' + clock(d);
    if (n < 7) return 'last ' + d.toLocaleDateString('en-US', { weekday: 'long' }) + ' at ' + clock(d);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' + clock(d);
  };
  const until = (d) => {
    const ms = d - Date.now(), hrs = Math.round(ms / 36e5);
    if (ms < 6e4) return 'any moment';
    if (ms < 36e5) return 'in ' + Math.round(ms / 6e4) + ' minutes';
    if (hrs < 24) return 'in ' + hrs + ' hours';
    const n = Math.round((day0(d) - day0(new Date())) / 864e5);
    return (n === 1 ? 'tomorrow ' : d.toLocaleDateString('en-US', { weekday: 'long' }) + ' ') + clock(d);
  };
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  // shortcut: Jellyfin exposes no next-run field, so estimate it from the triggers.
  function nextRun(t) {
    const now = Date.now(); let best = null;
    for (const tr of t.Triggers || []) {
      let d = null;
      if (tr.Type === 'IntervalTrigger') {
        const last = t.LastExecutionResult && t.LastExecutionResult.EndTimeUtc;
        d = new Date((last ? new Date(last).getTime() : now) + tr.IntervalTicks / 1e4);
        if (d < now) d = new Date(now);
      } else if (tr.Type === 'DailyTrigger' || tr.Type === 'WeeklyTrigger') {
        const base = new Date(); base.setHours(0, 0, 0, 0);
        for (let i = 0; i < 8 && !d; i++) {
          const c = new Date(base.getTime() + i * 864e5 + tr.TimeOfDayTicks / 1e4);
          if (c > now && (tr.Type === 'DailyTrigger' || DAYS[c.getDay()] === tr.DayOfWeek)) d = c;
        }
      }
      if (d && (!best || d < best)) best = d;
    }
    return best;
  }
  const pct = (a, b) => (b > 0 ? Math.max(0, Math.min(100, Math.round((a / b) * 100))) : 0);

  const sec = (o, rows) => h('div', { class: 'jx-sec' },
    h('div', { class: 'jx-sec-h' }, o.ico ? icon(o.ico, 16) : null,
      h('div', { class: 'jx-sec-t' }, h('p', { class: 'b', text: o.title }), o.sub != null ? h('p', { class: 's', text: o.sub }) : null),
      h('i', { class: 'adm-sp' }), o.badge || null,
      o.link ? h('a', { class: 'adm-link', href: '#' + o.link[1] }, h('span', { text: o.link[0] }), icon('chevron-right', 12)) : null),
    h('div', { class: 'jx-div' }),
    rows.length ? rows.map((r, i) => [i ? h('div', { class: 'jx-div' }) : null, r]) : h('div', { class: 'adm-empty', text: o.empty || 'Nothing to show' }));
  const box = (ico, size) => h('div', { class: 'adm-box' }, typeof ico === 'string' ? icon(ico, size || 14) : ico);
  const badge = (label, kind, ico) => h('div', { class: 'adm-badge ' + (kind || '') }, icon(ico || 'circle', 12), h('span', { text: label }));
  const item = (o) => h('div', { class: 'adm-item' + (o.onclick ? ' click' : ''), style: 'padding:' + (o.py || 12) + 'px 0', onclick: o.onclick },
    o.left || null, h('div', { class: 'adm-t' }, h('p', { class: 'a' + (o.plain ? ' n' : ''), text: o.title }), o.sub != null ? h('p', { class: 'b', text: o.sub }) : null), o.right || null);
  const kv = (k, v) => h('div', { class: 'adm-kv', style: 'padding:9px 0' }, h('span', { text: k }), h('span', { text: String(v) }));
  const usage = (path, label, used, total) => h('div', { class: 'adm-item', style: 'padding:10px 0' },
    h('div', { class: 'adm-t' }, h('p', { class: 'a', text: path }), h('p', { class: 'b', text: label })),
    h('div', { class: 'adm-usage' }, h('span', { text: window.JA.bytes(used) + ' / ' + window.JA.bytes(total) }),
      h('div', { class: 'adm-prog' }, h('i', { style: 'width:' + pct(used, total) + '%' }))));
  const textIn = (v, cb, o) => {
    const el = h('input', { class: 'jx-in adm-w240', type: (o && o.type) || 'text', value: v == null ? '' : String(v) });
    el.addEventListener('input', () => cb(el.value)); return el;
  };
  const selectIn = (opts, v, cb, cls) => { const w = window.JX.selectEl(opts, v, cb); w.classList.add(cls || 'adm-selw240'); return w; };
  const btnD = (label, ico, onclick) => { const b = window.JX.jbtn(label, ico, false, onclick); b.classList.add('adm-btn-d'); return b; };
  const act = (path, okMsg) => () => post(path).then(() => toast(okMsg)).catch((e) => toast(e.message, 'error'));
  const power = {
    restart: () => confirm('Restart the server?') && act('System/Restart', 'Restarting server...')(),
    shutdown: () => confirm('Shut down the server?') && act('System/Shutdown', 'Shutting down...')(),
    scan: act('Library/Refresh', 'Library scan started')
  };
  const logoFor = (name, size) => window.JA.browser(name, size || 18);
  const stat = (label, ico, v, sub) => h('div', { class: 'adm-stat' }, h('div', { class: 'adm-stat-top' }, h('span', { text: label }), icon(ico, 16)),
    h('div', { class: 'adm-stat-v', text: v }), h('div', { class: 'adm-stat-s', text: sub }));
  window.ADM = { safe, when, until, nextRun, pct, sec, box, badge, item, kv, usage, textIn, selectIn, btnD, power, logoFor, stat };
})();
