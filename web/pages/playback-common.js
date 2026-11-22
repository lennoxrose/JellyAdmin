/* Shared builders for the Playback pages and Networking (window.PB). Must be loaded before those pages render. */
(function () {
  if (window.PB) return;
  const { h, icon, get, post, toast, go } = window.JA;
  const P = (cls, text) => h('p', { class: cls, text });
  const num = (v, d) => { const n = Number(v); return Number.isFinite(n) ? n : (d || 0); };

  const dv = () => h('div', { class: 'pb-dv' });
  const joinRows = (rows) => rows.filter(Boolean).map((r, i) => [i ? dv() : null, r]);
  const sec = (ico, title, sub, rows) => h('div', { class: 'pb-sec' },
    h('div', { class: 'pb-sh' }, ico ? icon(ico, 16) : null, h('div', { class: 'pb-st' }, P('b', title), sub ? P('s', sub) : null)),
    dv(), h('div', { class: 'pb-rows' }, joinRows(rows)));
  const row = (title, sub, ctl, o) => {
    o = o || {};
    return h('div', { class: 'pb-row', style: 'padding:' + (o.py || 13) + 'px 0' }, o.lead || null,
      h('div', { class: 'pb-tx' }, P('a', title), sub ? P('b', sub) : null), ctl || null);
  };
  const ibox = (name) => h('div', { class: 'pb-ib' }, icon(name, 14));
  const badge = (text, ico, tone) => h('div', { class: 'pb-bd pb-' + (tone || 'mute') }, ico ? icon(ico, 12) : null, h('span', { text }));
  const btn = (label, ico, primary, onclick) => h('button', { class: 'pb-btn' + (primary ? ' pri' : ''), type: 'button', onclick }, ico ? icon(ico, 14) : null, h('span', { text: label }));
  const tgl = (on, cb) => {
    const el = h('button', { class: 'pb-tg' + (on ? ' on' : ''), type: 'button', role: 'switch', 'aria-checked': String(!!on) }, h('i'));
    el.addEventListener('click', () => { const v = !el.classList.contains('on'); el.classList.toggle('on', v); el.setAttribute('aria-checked', String(v)); if (cb) cb(v); });
    return el;
  };
  const inp = (val, o) => {
    o = o || {};
    const el = h('input', { class: 'pb-in', type: 'text', value: val == null ? '' : String(val), placeholder: o.ph, style: o.w ? 'width:' + o.w + 'px' : null, spellcheck: 'false' });
    if (o.num) el.setAttribute('inputmode', 'numeric');
    el.addEventListener('input', () => o.cb && o.cb(el.value));
    return el;
  };
  const sel = (opts, val, w, cb) => {
    opts = opts.map((o) => (Array.isArray(o) ? o : [o, o]));
    if (!opts.some((o) => String(o[0]) === String(val))) opts.push([val, String(val)]);
    const s = h('select', {}, opts.map(([v, l]) => h('option', { value: v, text: l, selected: String(v) === String(val) })));
    s.addEventListener('change', () => cb && cb(s.value));
    return h('div', { class: 'pb-sel', style: 'width:' + w + 'px' }, s, icon('chevron-down', 14));
  };
  const rsec = (title, rows) => sec(null, title, null, rows);
  const related = (ico, title, sub, path) => row(title, sub, icon('chevron-right', 14), { py: 10, lead: icon(ico, 16) });
  const relatedLink = (ico, title, sub, path) => { const r = related(ico, title, sub); r.classList.add('link'); r.addEventListener('click', () => go(path)); return r; };
  const note = (ico, text) => h('div', { class: 'pb-row', style: 'padding:10px 0' }, icon(ico, 16), h('div', { class: 'pb-tx' }, P('n', text)));

  /** Run a page. s = {title, sub, load(), view(data, ui) -> {a:[], b:[], rail:[]}, save(data)} ; returns cleanup. */
  function run(el, s) {
    const root = h('div', { class: 'pb-page' });
    el.append(root);
    let dead = false, cleanups = [];
    const stop = () => { cleanups.forEach((f) => { try { f(); } catch (e) { /* ignore */ } }); cleanups = []; };
    async function load() {
      stop();
      let data;
      try { data = await s.load(); } catch (e) { root.replaceChildren(h('pre', { class: 'ja-error', text: 'Failed to load: ' + e.message })); return; }
      if (dead) return;
      const sums = [];
      const ui = {
        sum: (label, fn) => {
          const v = P('pb-sv', fn());
          sums.push(() => { v.textContent = fn(); });
          return h('div', { class: 'pb-row', style: 'padding:9px 0' }, h('div', { class: 'pb-tx' }, P('l', label)), v);
        },
        refresh: () => sums.forEach((f) => f()),
        onDestroy: (f) => cleanups.push(f),
        reload: load
      };
      let v;
      try { v = s.view(data, ui); } catch (e) { root.replaceChildren(h('pre', { class: 'ja-error', text: 'Page failed to render: ' + e.message })); console.error(e); return; }
      const save = btn('Save changes', 'save', true, async () => {
        save.disabled = true;
        try { await s.save(data); toast('Saved'); await load(); }
        catch (e) { toast('Save failed: ' + e.message, 'error'); save.disabled = false; }
      });
      root.replaceChildren(
        h('div', { class: 'pb-head' }, h('div', { class: 'pb-titles' }, P('pb-title', s.title), P('pb-sub', s.sub)),
          h('div', { class: 'pb-actions' }, s.actions ? s.actions(ui) : [btn('Reset', 'restart', false, load), save])),
        h('div', { class: 'pb-cols' },
          h('div', { class: 'pb-main' }, h('div', { class: 'pb-col' }, v.a), v.b && v.b.length ? h('div', { class: 'pb-col' }, v.b) : null),
          h('div', { class: 'pb-rail' }, v.rail)));
    }
    load();
    return () => { dead = true; stop(); };
  }

  /** Poll fn every ms until the page is torn down. */
  const poll = (ui, fn, ms) => { fn(); const t = setInterval(fn, ms || 5000); ui.onDestroy(() => clearInterval(t)); };

  /** Set a boolean policy flag on users whose current value differs. */
  const users = () => get('Users');
  const savePolicies = (list, changed) => Promise.all(list.filter((u) => changed(u)).map((u) => post('Users/' + u.Id + '/Policy', u.Policy)));

  window.PB = { P, num, sec, row, ibox, badge, btn, tgl, inp, sel, rsec, relatedLink, note, run, poll, users, savePolicies, h, icon, get, post, toast };
})();
