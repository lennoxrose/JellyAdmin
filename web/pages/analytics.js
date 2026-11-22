/* Analytics page (Figma 31:1047), laid out at the design's 1656x1028 content size.
   Playback figures come from Jelly Admin's own playback log (Collector.cs, served by JellyAdminApi/Analytics); library figures from Items.
   Failed streams come from the client's own stop report (FailureTap.cs). */
(function () {
  const { h, get, post, toast } = window.JA;
  const PU = '#a970ff', BL = '#00a4dc', PK = '#f472b6', GR = '#4ade80', AM = '#f5b942', TL = '#2dd4bf', OR = '#fb923c', RD = '#f87171';
  const PAL = [PU, BL, PK, GR, AM, TL];
  const RANGES = [['24h', 1, '24 hours'], ['7d', 7, '7 days'], ['30d', 30, '30 days'], ['90d', 90, '90 days'], ['1y', 365, '1 year']];
  const DAY = 864e5, HOUR = 36e5;

  const d = (css, ...k) => h('div', { style: 'position:absolute;' + css }, ...k);
  const t = (text, css, cls) => h('p', { class: cls || '', style: css, text });
  const sv = (css, w, hh, inner) => { const e = d(css); e.innerHTML = '<svg width="' + w + '" height="' + hh + '" viewBox="0 0 ' + w + ' ' + hh + '" style="display:block;overflow:visible">' + inner + '</svg>'; return e; };
  const rgba = (c, a) => { const n = parseInt(c.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; };
  const fmt = (n) => Math.round(n).toLocaleString('en-US');
  const pad = (n) => String(n).padStart(2, '0');
  const sqlTime = (ms) => { const x = new Date(ms); return x.getFullYear() + '-' + pad(x.getMonth() + 1) + '-' + pad(x.getDate()) + ' ' + pad(x.getHours()) + ':' + pad(x.getMinutes()) + ':' + pad(x.getSeconds()); };
  // shortcut: plugin timestamps are read as server-local time; if the plugin stores UTC the weekday/hour cells shift by the offset.
  const parseTime = (s) => new Date(String(s).replace(' ', 'T').slice(0, 19)).getTime();

  /** Catmull-Rom spline through points as an SVG cubic path. Control points are clamped between the two points of each
   *  segment so a sharp step (e.g. 0 to a value) cannot overshoot and dip below or above the data. */
  function smooth(p) {
    let s = 'M' + p[0][0] + ' ' + p[0][1];
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c;
      const lo = Math.min(b[1], c[1]), hi = Math.max(b[1], c[1]), cl = (y) => Math.max(lo, Math.min(hi, y));
      s += 'C' + (b[0] + (c[0] - a[0]) / 6) + ' ' + cl(b[1] + (c[1] - a[1]) / 6) + ' ' + (c[0] - (e[0] - b[0]) / 6) + ' ' + cl(c[1] - (e[1] - b[1]) / 6) + ' ' + c[0] + ' ' + c[1];
    }
    return s;
  }
  const legend = (items, left, top) => d('left:' + left + 'px;top:' + top + 'px;display:flex;gap:21px',
    ...items.map(([c, l]) => h('span', { class: 'an-lg' }, h('i', { style: 'background:' + c }), l)));
  /** Hover tooltip for a panel: show(x, y, title, value) places it centred on x, clamped to the panel. */
  function tooltip(pane) {
    const tip = d('display:none;padding:6px 9px;background:#141414;border:1px solid #2a2a2a;border-radius:6px;white-space:nowrap;pointer-events:none;z-index:5');
    pane.append(tip);
    pane.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
    return {
      show(x, y, title, value) {
        tip.replaceChildren(h('div', { class: 'an-m9', text: title }), h('div', { style: 'font-size:11px;font-weight:700;color:#ededed;margin-top:3px', text: value }));
        tip.style.display = 'block';
        const w = tip.offsetWidth;
        tip.style.left = Math.max(4, Math.min(x - w / 2, pane.clientWidth - w - 4)) + 'px';
        tip.style.top = y + 'px';
      },
      hide() { tip.style.display = 'none'; }
    };
  }
  const artIds = new Map(); // played item id -> id whose picture to show
  /** Draw an item's picture into a thumbnail; the gradient behind it stays if the item has none. */
  function paint(thumb, artId) {
    if (!window.ApiClient) return;
    const img = h('img', { alt: '', src: ApiClient.getUrl('Items/' + artId + '/Images/Primary?fillWidth=44&fillHeight=44&quality=85'), style: 'width:100%;height:100%;object-fit:cover;display:block' });
    img.addEventListener('load', () => thumb.replaceChildren(img));
  }
  const none = (text) => t(text || 'No data', 'left:0;right:0;top:50%;text-align:center', 'an-m10');
  function panel(x, y, w, hh, title, sub, right) {
    return h('div', { class: 'an-panel', style: 'left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + hh + 'px' },
      h('p', { class: 'an-t', text: title }), h('p', { class: 'an-s', text: sub }), h('p', { class: 'an-r', text: right }));
  }
  const top = (rows, key, val, n) => {
    const m = new Map();
    for (const r of rows) { const k = key(r); if (k) m.set(k, (m.get(k) || 0) + val(r)); }
    return [...m].sort((a, b) => b[1] - a[1]).slice(0, n);
  };

  // ---- data ----------------------------------------------------------------------
  async function library() {
    const base = 'Items?Recursive=true&IncludeItemTypes=Movie,Episode&Limit=0&EnableTotalRecordCount=true';
    const n = (q) => get(base + q).then((r) => r.TotalRecordCount || 0).catch(() => 0);
    const [r4k, r1080, r720, rsd, hevc, h264, av1, items] = await Promise.all([
      n('&MinWidth=3200'), n('&MinWidth=1700&MaxWidth=3199'), n('&MinWidth=1100&MaxWidth=1699'), n('&MaxWidth=1099'),
      n('&VideoCodecs=hevc'), n('&VideoCodecs=h264'), n('&VideoCodecs=av1'),
      get('Items?Recursive=true&IncludeItemTypes=Movie,Episode&Fields=DateCreated&SortBy=DateCreated&SortOrder=Descending&Limit=30000&EnableImages=false&EnableUserData=false&EnableTotalRecordCount=false')
        .then((r) => r.Items || []).catch(() => [])]);
    const res = [r4k, r1080, r720, rsd], total = res.reduce((a, b) => a + b, 0);
    return { res, codec: [hevc, h264, av1, Math.max(0, total - hevc - h264 - av1)], items };
  }
  let libCache = null, libAt = 0; // the library counts are heavy and barely change, so refresh them every 5 minutes
  async function load(days) {
    const now = Date.now(), hourly = days === 1, step = hourly ? HOUR : DAY, n = hourly ? 24 : days;
    const mid = new Date(now); mid.setHours(0, 0, 0, 0);
    const end = hourly ? Math.ceil(now / HOUR) * HOUR : mid.getTime() + DAY, start = end - n * step, prevStart = start - n * step;
    let rows = [], error = null, users = [];
    try {
      [rows, users] = await Promise.all([get('JellyAdminApi/Analytics?since=' + prevStart), get('Users').catch(() => [])]);
      rows = rows.map((r) => ({ t: r.t, userid: r.u, itemtype: r.k, itemname: r.s || r.n, itemid: r.i, method: r.m, clientname: r.c, secs: r.secs, kbps: r.kbps, reasons: r.r, failed: !!r.f }));
    } catch (e) { error = e.message; }
    return { days, hourly, step, n, start, end, rows, error, users, lib: libCache && Date.now() - libAt < 3e5 ? libCache : (libAt = Date.now(), libCache = await library()) };
  }

  // ---- view ----------------------------------------------------------------------
  function build(D) {
    const played = D.rows.filter((r) => !r.failed), failed = D.rows.filter((r) => r.failed);
    const inCur = (r) => r.t >= D.start && r.t < D.end, inPrev = (r) => r.t < D.start;
    const cur = played.filter(inCur), prev = played.filter(inPrev), curF = failed.filter(inCur), prevF = failed.filter(inPrev);
    const failPct = (ok, bad) => ok.length + bad.length ? bad.length / (ok.length + bad.length) * 100 : 0;
    const rl = RANGES.find((r) => r[1] === D.days), last = 'Last ' + rl[2];
    const normId = (id) => String(id).replace(/-/g, '').toLowerCase();
    const um = new Map(D.users.map((u) => [normId(u.Id), u]));
    const userOf = (id) => um.get(normId(id));
    const bucket = (r) => Math.min(D.n - 1, Math.floor((r.t - D.start) / D.step));
    const series = (rows, fn) => { const a = Array.from({ length: D.n }, () => []); rows.forEach((r) => a[bucket(r)].push(r)); return a.map(fn); };
    const method = (r) => r.method;
    const hrs = (rows) => rows.reduce((a, r) => a + r.secs, 0) / 3600;
    const users = (rows) => new Set(rows.map((r) => r.userid)).size;
    const tcPct = (rows) => rows.length ? rows.filter((r) => method(r) === 2).length / rows.length * 100 : 0;
    const pctDelta = (a, b) => b > 0 ? (a >= b ? '+' : '') + ((a - b) / b * 100).toFixed(1) + '%' : '-';
    const out = [];
    const bytes = (rows) => rows.reduce((a, r) => a + r.kbps * 125 * r.secs, 0);
    const fmtBytes = (b) => b >= 1e12 ? (b / 1e12).toFixed(2) + ' TB' : b >= 1e9 ? (b / 1e9).toFixed(1) + ' GB' : b >= 1e6 ? (b / 1e6).toFixed(0) + ' MB' : '-';
    // KPI strip
    out.push(d('left:48px;top:86px;width:1560px;height:1px;background:#1f1f1f'), d('left:48px;top:196px;width:1560px;height:1px;background:#1f1f1f'));
    const kpis = [
      ['PLAYS', fmt(cur.length), pctDelta(cur.length, prev.length), cur.length >= prev.length ? GR : RD, series(cur, (a) => a.length), PU],
      ['WATCH TIME', fmt(hrs(cur)) + ' h', pctDelta(hrs(cur), hrs(prev)), hrs(cur) >= hrs(prev) ? GR : RD, series(cur, hrs), BL],
      ['ACTIVE USERS', String(users(cur)), (users(cur) >= users(prev) ? '+' : '') + (users(cur) - users(prev)), users(cur) >= users(prev) ? GR : RD, series(cur, users), PK],
      ['BANDWIDTH', fmtBytes(bytes(cur)), pctDelta(bytes(cur), bytes(prev)), bytes(cur) <= bytes(prev) ? GR : AM, series(cur, bytes), AM],
      ['TRANSCODES', tcPct(cur).toFixed(1) + '%', (tcPct(cur) >= tcPct(prev) ? '+' : '') + (tcPct(cur) - tcPct(prev)).toFixed(1) + '%', tcPct(cur) <= tcPct(prev) ? GR : AM, series(cur, tcPct), TL],
      ['FAILED STREAMS', failPct(cur, curF).toFixed(1) + '%', (failPct(cur, curF) >= failPct(prev, prevF) ? '+' : '') + (failPct(cur, curF) - failPct(prev, prevF)).toFixed(1) + '%',
        failPct(cur, curF) <= failPct(prev, prevF) ? GR : RD,
        series([...cur, ...curF], (a) => failPct(a.filter((r) => !r.failed), a.filter((r) => r.failed))), RD]];
    kpis.forEach(([label, value, delta, dc, ser, color], i) => {
      const x = 48 + i * 260 + (i ? 24 : 0); // cells after the first sit 24px right of their divider
      if (i) out.push(d('left:' + (48 + i * 260) + 'px;top:86px;width:1px;height:111px;background:#1f1f1f'));
      out.push(t(label, 'left:' + x + 'px;top:102px', 'an-kl'), t(value, 'left:' + x + 'px;top:122px', 'an-kv'));
      if (delta != null) out.push(d('left:' + x + 'px;top:160px;display:flex;gap:10px;white-space:nowrap', h('span', { style: 'font-size:11px;font-weight:500;color:' + dc, text: delta }), h('span', { style: 'font-size:10px;color:#7a7a7a', text: 'vs prev. period' })));
      if (ser && ser.length > 1) {
        const mn = Math.min(...ser), mx = Math.max(...ser), sp = ser.map((v, j) => [j * 100 / (ser.length - 1), 1.5 + (1 - (v - mn) / ((mx - mn) || 1)) * 21]);
        out.push(sv('left:' + (x + 110) + 'px;top:108px', 100, 24, '<path d="' + smooth(sp) + '" stroke="' + color + '" stroke-width="1.5" fill="none"/>'));
      }
    });

    // Playback activity
    const pa = panel(48, 218, 1020, 308, 'Playback activity', 'Plays per day · stacked by media type', last);
    const kind = (r) => ({ movie: 0, episode: 1, tvchannel: 2, program: 2, livetvchannel: 2, livetvprogram: 2 })[String(r.itemtype).toLowerCase()];
    const lay = [0, 1, 2].map((k) => series(cur, (a) => a.filter((r) => kind(r) === k).length));
    const cum = [lay[0], lay[0].map((v, i) => v + lay[1][i]), lay[0].map((v, i) => v + lay[1][i] + lay[2][i])];
    const peak = Math.max(...cum[2], 1), pow = Math.pow(10, Math.floor(Math.log10(peak)));
    const stepV = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s * 4 >= peak), maxV = stepV * 4;
    const X = (i) => D.n > 1 ? i * 930 / (D.n - 1) : 465, Y = (v) => 180 - v / maxV * 180;
    for (let i = 0; i <= 4; i++) {
      const y = 69 + i * 45;
      pa.append(d('left:61px;top:' + y + 'px;width:930px;height:1px;background:' + (i === 4 ? '#2a2a2a' : '#1f1f1f')), t(fmt(maxV - i * stepV), 'left:55px;top:' + (y - 6) + 'px;width:34px;text-align:right;transform:translateX(-100%)', 'an-m9'));
    }
    const dateLabel = (i) => { const ts = D.start + i * D.step; return D.hourly ? pad(new Date(ts).getHours()) + ':00' : new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); };
    for (let k = 0; k < 5; k++) { const i = Math.round(k * (D.n - 1) / 4); pa.append(t(dateLabel(i), 'left:' + (51 + X(i)) + 'px;top:259px', 'an-m9')); }
    pa.append(legend([[PU, 'Movies'], [PK, 'Shows'], [TL, 'Live TV']], 17, 281));
    if (!cur.length) pa.append(none(D.error ? 'Playback data unavailable' : 'No playback in this period'));
    else {
      let g = '';
      [[2, TL, .3], [1, PK, .35], [0, PU, .45]].forEach(([k, c, o], j) => {
        const pts = cum[k].map((v, i) => [X(i), Y(v)]), line = smooth(pts.length > 1 ? pts : [[0, pts[0][1]], [930, pts[0][1]]]);
        g += '<defs><linearGradient id="an-g' + j + '" x1="0" y1="0" x2="0" y2="1"><stop stop-color="' + c + '" stop-opacity="' + o + '"/><stop offset="1" stop-color="' + c + '" stop-opacity="0"/></linearGradient></defs>'
          + '<path d="' + line + 'L930 180L0 180Z" fill="url(#an-g' + j + ')"/><path d="' + line + '" stroke="' + c + '" stroke-width="2" fill="none"/>';
      });
      pa.append(sv('left:61px;top:69px', 930, 180, g));
      const mark = d('left:0;top:69px;width:0'), tip = d('width:128px;height:40px;top:75px;background:#141414;border:1px solid #2a2a2a;border-radius:6px'), dot = d('width:8px;height:8px;border-radius:50%;background:#fff');
      const show = (i) => {
        const x = 61 + X(i);
        mark.replaceChildren(d('left:0;top:0;width:1px;height:180px;background:#3a3a3a'));
        mark.style.left = x + 'px'; dot.style.left = x - 4 + 'px'; dot.style.top = 69 + Y(cum[2][i]) - 4 + 'px';
        tip.style.left = (x + 10 + 128 > 991 ? x - 138 : x + 10) + 'px';
        tip.replaceChildren(t(dateLabel(i), 'left:9px;top:5px', 'an-m9'), t(fmt(cum[2][i]) + ' plays', 'left:9px;top:19px;font-size:11px;font-weight:700;color:#ededed'));
      };
      show(cum[2].indexOf(peak));
      const hit = d('left:61px;top:69px;width:930px;height:180px');
      hit.addEventListener('mousemove', (e) => { const r = hit.getBoundingClientRect(); show(Math.max(0, Math.min(D.n - 1, Math.round((e.clientX - r.left) / r.width * (D.n - 1))))); });
      pa.append(mark, dot, tip, hit);
    }
    out.push(pa);

    // Playback method
    const pm = panel(1092, 218, 516, 308, 'Playback method', 'Direct vs. transcoded', last);
    const mc = [0, 0, 0]; cur.forEach((r) => mc[method(r)]++);
    const mt = cur.length || 1, MM = [['Direct Play', GR], ['Direct Stream', BL], ['Transcode', AM]];
    let ring = '', off = 0;
    mc.forEach((c, i) => { const len = c / mt * 439.8; if (c) ring += '<circle cx="80" cy="80" r="70" fill="none" stroke="' + MM[i][1] + '" stroke-width="20" stroke-dasharray="' + Math.max(0, len - (cur.length > c ? 3 : 0)) + ' 1000" stroke-dashoffset="' + -off + '" transform="rotate(-90 80 80)"/>'; off += len; });
    if (!cur.length) ring = '<circle cx="80" cy="80" r="70" fill="none" stroke="#1a1a1a" stroke-width="20"/>';
    pm.append(sv('left:39px;top:89px', 160, 160, ring),
      t(cur.length >= 1000 ? (cur.length / 1000).toFixed(1) + 'k' : String(cur.length), 'left:119px;top:151px;width:100px;transform:translateX(-50%);text-align:center;font-size:22px;font-weight:700;letter-spacing:-.5px;color:#ededed'),
      t('total plays', 'left:119px;top:179px;width:100px;transform:translateX(-50%);text-align:center', 'an-m10'));
    MM.forEach(([label, c], i) => {
      const y = 95 + i * 58, p = mc[i] / mt * 100;
      pm.append(d('left:259px;top:' + (y + 3) + 'px;width:10px;height:10px;border-radius:50%;background:' + c), t(label, 'left:277px;top:' + y + 'px;font-size:12px;font-weight:500;color:#ededed'),
        t(Math.round(p) + '%', 'right:17px;top:' + y + 'px;font-size:12px;font-weight:700;color:#fff'),
        d('left:277px;top:' + (y + 24) + 'px;width:220px;height:4px;border-radius:2px;background:#1a1a1a'), d('left:277px;top:' + (y + 24) + 'px;width:' + p * 2.2 + 'px;height:4px;border-radius:2px;background:' + c));
    });
    const reasonCount = new Map();
    cur.filter((r) => method(r) === 2 && r.reasons).forEach((r) => r.reasons.split(',').forEach((x) => {
      const k = x.trim().replace(/(NotSupported|ExceedsLimit)$/, '').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
      if (k && k !== 'unknown') reasonCount.set(k, (reasonCount.get(k) || 0) + 1);
    }));
    const rsum = [...reasonCount.values()].reduce((a, b) => a + b, 0);
    pm.append(t(rsum ? 'Transcode reasons: ' + [...reasonCount].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => k + ' (' + Math.round(v / rsum * 100) + '%)').join(', ')
      : mc[2] ? 'Transcode reasons: none reported' : 'No transcodes in this period', 'left:17px;top:281px', 'an-m10'));
    out.push(pm);

    // Bandwidth: average concurrent Mbps per hour of day, for the peak day and for the average day
    const bw = panel(48, 548, 504, 244, 'Bandwidth', 'Mbps · peak vs. average', D.hourly ? 'Today' : rl[2]);
    const slots = new Map(), nDays = D.hourly ? 1 : D.n;
    cur.filter((r) => r.kbps > 0).forEach((r) => {
      for (let ts = r.t, endT = r.t + r.secs * 1000; ts < endT;) {
        const hb = Math.floor(ts / HOUR) * HOUR, seg = Math.min(endT, hb + HOUR) - ts, key = Math.floor((hb - D.start) / DAY) * 24 + new Date(hb).getHours();
        slots.set(key, (slots.get(key) || 0) + r.kbps / 1000 * seg / HOUR);
        ts += seg;
      }
    });
    const peakH = new Array(24).fill(0), avgH = new Array(24).fill(0);
    slots.forEach((v, key) => { const hr = ((key % 24) + 24) % 24; peakH[hr] = Math.max(peakH[hr], v); avgH[hr] += v / nDays; });
    const bmax = Math.max(...peakH, 0.001), bpow = Math.pow(10, Math.floor(Math.log10(bmax))), bstep = [1, 2, 2.5, 5, 10].map((m) => m * bpow).find((v) => v * 3 >= bmax), bTop = bstep * 3;
    for (let i = 0; i <= 3; i++) {
      const y = 63 + i * 40;
      bw.append(d('left:55px;top:' + y + 'px;width:420px;height:1px;background:' + (i === 3 ? '#2a2a2a' : '#1f1f1f')),
        t(String(+(bTop - i * bstep).toFixed(1)), 'left:49px;top:' + (y - 6) + 'px;width:34px;text-align:right;transform:translateX(-100%)', 'an-m9'));
    }
    [['00:00', 41], ['06:00', 146], ['12:00', 251], ['18:00', 356], ['24:00', 461]].forEach(([l, x]) => bw.append(t(l, 'left:' + x + 'px;top:191px', 'an-m9')));
    bw.append(legend([[BL, 'Peak'], [AM, 'Average']], 17, 213));
    if (!slots.size) bw.append(none('No bandwidth recorded in this period'));
    else {
      let g = '';
      [[peakH, BL, .35], [avgH, AM, .3]].forEach(([vals, c, o], j) => {
        const pts = vals.map((v, i) => [(i + .5) * 420 / 24, 120 - v / bTop * 120]), line = smooth(pts);
        g += '<defs><linearGradient id="an-b' + j + '" x1="0" y1="0" x2="0" y2="1"><stop stop-color="' + c + '" stop-opacity="' + o + '"/><stop offset="1" stop-color="' + c + '" stop-opacity="0"/></linearGradient></defs>'
          + '<path d="' + line + 'L' + pts[23][0] + ' 120L' + pts[0][0] + ' 120Z" fill="url(#an-b' + j + ')"/><path d="' + line + '" stroke="' + c + '" stroke-width="2" fill="none"/>';
      });
      bw.append(sv('left:55px;top:63px', 420, 120, g));
      const bTip = tooltip(bw), shown = 'display:none;pointer-events:none';
      const bMark = d('top:63px;width:1px;height:120px;background:#3a3a3a;' + shown), dotP = d('width:8px;height:8px;border-radius:50%;background:' + BL + ';' + shown), dotA = d('width:8px;height:8px;border-radius:50%;background:' + AM + ';' + shown);
      const bHit = d('left:55px;top:63px;width:420px;height:120px');
      const bHide = () => { bTip.hide(); [bMark, dotP, dotA].forEach((e) => { e.style.display = 'none'; }); };
      bHit.addEventListener('mousemove', (e) => {
        const r = bHit.getBoundingClientRect(), hr = Math.max(0, Math.min(23, Math.floor((e.clientX - r.left) / r.width * 24))), x = 55 + (hr + .5) * 420 / 24;
        bMark.style.cssText += ';display:block;left:' + x + 'px';
        [[dotP, peakH[hr]], [dotA, avgH[hr]]].forEach(([dot, v]) => { dot.style.display = 'block'; dot.style.left = x - 4 + 'px'; dot.style.top = 63 + 120 - v / bTop * 120 - 4 + 'px'; });
        bTip.show(x, 68, pad(hr) + ':00-' + pad((hr + 1) % 24) + ':00', peakH[hr].toFixed(1) + ' Mbps peak · ' + avgH[hr].toFixed(1) + ' avg');
      });
      bHit.addEventListener('mouseleave', bHide);
      bw.append(bMark, dotP, dotA, bHit);
    }
    out.push(bw);

    // Heatmap
    const hm = panel(576, 548, 504, 244, 'Watch time heatmap', 'Hour of day × weekday', 'Avg. hours');
    const cell = Array.from({ length: 7 }, () => new Array(24).fill(0)), starts = Array.from({ length: 7 }, () => new Array(24).fill(0)), occ = new Array(7).fill(0);
    cur.forEach((r) => { // spread a play over the hours it actually ran
      const st = new Date(r.t); starts[st.getDay()][st.getHours()]++;
      for (let ts = r.t, endT = r.t + r.secs * 1000; ts < endT;) {
        const hb = Math.floor(ts / HOUR) * HOUR, seg = Math.min(endT, hb + HOUR) - ts, x = new Date(hb);
        cell[x.getDay()][x.getHours()] += seg / HOUR;
        ts += seg;
      }
    });
    for (let ts = D.start; ts < D.end; ts += DAY) occ[new Date(ts).getDay()]++;
    const avg = cell.map((row, wd) => row.map((v) => v / (occ[wd] || 1))), hmax = Math.max(...avg.flat(), 0);
    const shade = (v) => !v ? '#141414' : v / hmax <= .25 ? '#2b1b55' : v / hmax <= .5 ? '#5b34b0' : v / hmax <= .75 ? '#8b5cf6' : '#c4a6ff';
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], hmTip = tooltip(hm);
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach((day, r) => {
      const y = 71 + r * 18.6, wd = (r + 1) % 7;
      hm.append(t(day, 'left:17px;top:' + (y + 2) + 'px', 'an-m9'));
      for (let c = 0; c < 24; c++) {
        const cellEl = d('width:14px;height:14px;border-radius:3px;left:' + (53 + c * 18.6) + 'px;top:' + y + 'px;background:' + shade(avg[wd][c]));
        cellEl.addEventListener('mouseenter', () => hmTip.show(53 + c * 18.6 + 7, y - 46, dayNames[r] + ' ' + pad(c) + ':00-' + pad((c + 1) % 24) + ':00',
          avg[wd][c].toFixed(1) + ' h avg · ' + starts[wd][c] + (starts[wd][c] === 1 ? ' play' : ' plays')));
        cellEl.addEventListener('mouseleave', hmTip.hide);
        hm.append(cellEl);
      }
    });
    [['00', 52], ['06', 163.6], ['12', 275.2], ['18', 386.8], ['23', 479.8]].forEach(([l, x]) => hm.append(t(l, 'left:' + x + 'px;top:207.2px', 'an-m9')));
    hm.append(t('Less', 'left:379px;top:37px', 'an-m9'), t('More', 'left:475px;top:37px', 'an-m9'));
    ['#141414', '#2b1b55', '#5b34b0', '#8b5cf6', '#c4a6ff'].forEach((c, i) => hm.append(d('left:' + (403 + i * 14) + 'px;top:37px;width:12px;height:12px;border-radius:2px;background:' + c)));
    out.push(hm);

    // Top clients
    const tc = panel(1104, 548, 504, 244, 'Top clients', 'Plays by app', rl[2]);
    const clients = top(cur, (r) => r.clientname, () => 1, 6);
    if (!clients.length) tc.append(none());
    clients.forEach(([name, c], i) => {
      const y = 65 + i * 28;
      tc.append(t(name, 'left:17px;top:' + y + 'px', 'an-tx'), d('left:149px;top:' + (y + 2) + 'px;width:260px;height:10px;border-radius:5px;background:#161616'),
        d('left:149px;top:' + (y + 2) + 'px;width:' + c / clients[0][1] * 260 + 'px;height:10px;border-radius:5px;background:' + PAL[i % 6]), t(fmt(c), 'right:17px;top:' + y + 'px;text-align:right', 'an-v'));
    });
    out.push(tc);

    // Top users
    const tu = panel(48, 816, 372, 188, 'Top users', 'Hours watched', rl[0]);
    const tusers = top(cur, (r) => r.userid, (r) => r.secs / 3600, 5);
    if (!tusers.length) tu.append(none());
    tusers.forEach(([id, v], i) => {
      const y = 61 + i * 24, u = userOf(id), name = u ? u.Name : String(id).slice(0, 8);
      const av = h('div', { class: 'an-av', style: 'left:17px;top:' + y + 'px;background:' + PAL[i % 5] });
      window.JA.avatarFill(av, u || { Name: name });
      tu.append(av, t(name, 'left:41px;top:' + (y + 2) + 'px', 'an-tx'), d('left:119px;top:' + (y + 5) + 'px;width:170px;height:6px;border-radius:3px;background:#161616'),
        d('left:119px;top:' + (y + 5) + 'px;width:' + v / tusers[0][1] * 170 + 'px;height:6px;border-radius:3px;background:' + PAL[i % 5]), t(fmt(v) + 'h', 'right:17px;top:' + (y + 2) + 'px;text-align:right', 'an-v'));
    });
    out.push(tu);

    // Library growth
    const lg = panel(444, 816, 372, 188, 'Library growth', 'New items per month', '');
    const nowD = new Date(), months = Array.from({ length: 12 }, (_, i) => new Date(nowD.getFullYear(), nowD.getMonth() - 11 + i, 1)), counts = new Array(12).fill(0);
    const films = new Array(12).fill(0);
    D.lib.items.forEach((it) => {
      const x = new Date(it.DateCreated), i = (x.getFullYear() - months[0].getFullYear()) * 12 + x.getMonth() - months[0].getMonth();
      if (i >= 0 && i < 12) { counts[i]++; if (it.Type === 'Movie') films[i]++; }
    });
    const cmax = Math.max(...counts, 1), y0 = months[0].getFullYear(), y1 = months[11].getFullYear();
    lg.lastChild.textContent = y0 === y1 ? String(y1) : y0 + '–' + String(y1).slice(2);
    const lgTip = tooltip(lg);
    counts.forEach((c, i) => {
      const bh = c / cmax * 100, x = 20 + i * 28, col = i % 2 ? BL : PU;
      lg.append(d('left:' + x + 'px;top:' + (159 - bh) + 'px;width:18px;height:' + bh + 'px;border-radius:3px;background:linear-gradient(to bottom,' + col + ',' + rgba(col, .45) + ')'),
        t('JFMAMJJASOND'[months[i].getMonth()], 'left:' + (x + 9) + 'px;top:165px;width:18px;text-align:center;transform:translateX(-50%)', 'an-m9'));
      const hit = d('left:' + (x - 5) + 'px;top:45px;width:28px;height:130px');
      hit.addEventListener('mouseenter', () => lgTip.show(x + 9, Math.max(44, 159 - bh - 52), months[i].toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        c + (c === 1 ? ' item' : ' items') + ' · ' + films[i] + ' movies, ' + (c - films[i]) + ' episodes'));
      hit.addEventListener('mouseleave', lgTip.hide);
      lg.append(hit);
    });
    lg.append(d('left:17px;top:159px;width:336px;height:1px;background:#2a2a2a')); out.push(lg);

    // Resolution & codec
    const rc = panel(840, 816, 372, 188, 'Resolution & codec', 'Share of library by stream', 'Now');
    const stackRow = (vals, cols, labels, y) => {
      const tot = vals.reduce((a, b) => a + b, 0);
      if (!tot) { rc.append(d('left:17px;top:' + y + 'px;width:334px;height:22px;border-radius:4px;background:#161616')); }
      let x = 17;
      vals.forEach((v, i) => {
        const w = v / (tot || 1) * 328; if (!v) return;
        rc.append(d('left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:22px;border-radius:4px;background:' + cols[i]));
        if (w >= 22) rc.append(t(Math.round(v / tot * 100) + '%', 'left:' + (x + 4) + 'px;top:' + (y + 5) + 'px;font-size:10px;font-weight:700;color:#0d0d0d'));
        x += w + 2;
      });
      rc.append(legend(labels.map((l, i) => [cols[i], l]), 17, y + 32));
    };
    stackRow(D.lib.res, [PU, BL, GR, AM], ['4K', '1080p', '720p', 'SD'], 61);
    stackRow(D.lib.codec, [PK, TL, OR, '#6b6b6b'], ['HEVC', 'H.264', 'AV1', 'Other'], 127);
    out.push(rc);

    // Top content
    const tn = panel(1236, 816, 372, 188, 'Top content', 'Most played', rl[0]);
    const content = top(cur, (r) => r.itemname, () => 1, 5), anyId = new Map();
    cur.forEach((r) => { if (!anyId.has(r.itemname)) anyId.set(r.itemname, r.itemid); });
    if (!content.length) tn.append(none());
    const pending = [];
    content.forEach(([name, c], i) => {
      const y = 61 + i * 25, col = [BL, PU, GR, PK, AM][i], itemId = anyId.get(name);
      const thumb = d('left:37px;top:' + (y - 2) + 'px;width:22px;height:22px;border-radius:4px;overflow:hidden;background:linear-gradient(to bottom,' + rgba(col, .9) + ',' + rgba(col, .4) + ')');
      if (artIds.has(itemId)) paint(thumb, artIds.get(itemId)); else if (itemId) pending.push([thumb, itemId]);
      tn.append(t(String(i + 1), 'left:17px;top:' + y + 'px;font-size:11px;color:#7a7a7a'), thumb,
        t(name, 'left:69px;top:' + (y + 2) + 'px;max-width:190px;overflow:hidden;text-overflow:ellipsis', 'an-tx'), t(fmt(c) + ' plays', 'right:17px;top:' + (y + 2) + 'px;text-align:right', 'an-v'));
    });
    if (pending.length) {
      // Episodes show their series' poster, so look up the series id once for the titles on screen.
      get('Items?Ids=' + pending.map((x) => x[1]).join(',')).then((res) => {
        const by = new Map((res.Items || []).map((it) => [normId(it.Id), it.SeriesId || it.Id]));
        pending.forEach(([thumb, id]) => { const art = by.get(normId(id)) || id; artIds.set(id, art); paint(thumb, art); });
      }).catch(() => {});
    }
    out.push(tn);
    return out;
  }

  const csv = (rows) => {
    const cols = Object.keys(rows[0] || {}).filter((k) => k !== 't' && k !== 'secs');
    return [cols.join(','), ...rows.map((r) => cols.map((c) => '"' + String(r[c] == null ? '' : r[c]).replace(/"/g, '""') + '"').join(','))].join('\n');
  };

  JA.page({ path: '/dashboard/analytics', title: 'Analytics', render(el) {
    const root = h('div', { class: 'an-root' }), sub = t('Playback, bandwidth and library insights across all users and devices', 'left:48px;top:52px;font-size:11px;color:#7a7a7a');
    const body = d('left:0;top:0;width:100%;height:100%;pointer-events:none'), pill = d('left:1394px;top:26px;width:46px;height:28px;border-radius:4px;background:#ededed');
    let data = null, days = 30, seq = 0;
    const labels = RANGES.map(([l], i) => t(l, 'left:' + (1298 + i * 48) + 'px;top:33px;width:46px;text-align:center;font-size:11px;font-weight:500', ''));
    const mark = () => { pill.style.left = 1298 + RANGES.findIndex((r) => r[1] === days) * 48 + 'px'; labels.forEach((p, i) => { p.style.color = RANGES[i][1] === days ? '#0d0d0d' : '#7a7a7a'; }); };
    async function go(dd, quiet) {
      if (quiet && body.querySelector('.an-panel:hover')) return; // keep a hovered tooltip on screen
      days = dd; mark(); const mine = ++seq; if (!quiet) body.style.opacity = '.4';
      const D = await load(dd); if (mine !== seq) return;
      data = D; body.replaceChildren(...build(D)); body.style.opacity = '';
      sub.textContent = D.error ? 'Could not load playback data (' + D.error + ')'
        : !D.rows.length ? 'No playback recorded yet. Jelly Admin records every playback from the moment this version is installed.'
        : 'Playback, bandwidth and library insights across all users and devices';
      sub.style.color = D.error || !D.rows.length ? AM : '#7a7a7a';
    }
    root.append(t('Analytics', 'left:48px;top:24px;font-size:20px;font-weight:700;letter-spacing:-.4px;color:#ededed'), sub,
      d('left:1296px;top:24px;width:244px;height:32px;border:1px solid #1f1f1f;border-radius:6px;background:#000'), pill, ...labels,
      ...RANGES.map(([, v], i) => h('button', { class: 'an-range', type: 'button', style: 'left:' + (1298 + i * 48) + 'px', 'aria-label': RANGES[i][0], onclick: () => go(v) })),
      h('button', { class: 'an-export', type: 'button', text: 'Export', onclick: () => {
        if (!data || !data.rows.length) return toast('Nothing to export', 'error');
        const a = h('a', { href: URL.createObjectURL(new Blob([csv(data.rows)], { type: 'text/csv' })), download: 'playback-' + days + 'd.csv' }); a.click(); URL.revokeObjectURL(a.href);
      } }), body);
    el.append(root); go(days);
    // The layout is fixed at the design's 1656px; shrink it to fit narrower windows instead of clipping.
    const fit = () => { root.style.zoom = el.clientWidth ? Math.min(1, el.clientWidth / 1656) : 1; };
    const ro = new ResizeObserver(fit); ro.observe(el); fit();
    const live = setInterval(() => go(days, true), 15000); // new and running plays show up without a reload
    return () => { ro.disconnect(); clearInterval(live); };
  } });
})();
