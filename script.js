/* SwadesiGo Growth OS: script.js
   Edit the DATA block below to change any number on the site. Charts are plain SVG, no libraries. */

/* ============================ DATA (edit here) ============================ */
const FACTORS = ['Market size', 'Customer fit', 'EV readiness', 'Whitespace', 'Service'];
const W0 = [25, 25, 20, 20, 10];
// name, state, hub, plan wave (0 = not in plan), lead buyer, ratings [market, fit, ev, whitespace, service] (team estimates, 1-5)
const CITIES = [
  ['Jaipur', 'Rajasthan', 'North', 1, 'Delivery partners', [4, 5, 4, 4, 4]],
  ['Indore', 'Madhya Pradesh', 'West-Central', 1, 'Students, small business', [3.5, 5, 4, 4, 4]],
  ['Coimbatore', 'Tamil Nadu', 'South', 1, 'Small business', [3.5, 4.5, 4, 4, 3.5]],
  ['Lucknow', 'Uttar Pradesh', 'North', 1, 'Delivery, small business', [4.5, 4, 3, 4, 3.5]],
  ['Bhubaneswar', 'Odisha', 'East', 1, 'Students, delivery', [3, 4, 4.5, 4, 3.5]],
  ['Ahmedabad', 'Gujarat', 'West-Central', 2, 'Small business', [4, 4, 4, 3, 3.5]],
  ['Kochi', 'Kerala', 'South', 2, 'Commuters, students', [3, 3.5, 5, 3, 4]],
  ['Pune', 'Maharashtra', 'West-Central', 2, 'Students', [4.5, 3.5, 4, 2, 4]],
  ['Hyderabad', 'Telangana', 'South', 2, 'Delivery fleets', [4.5, 3.5, 3.5, 2, 3.5]],
  ['Bengaluru', 'Karnataka', 'South', 2, 'Professionals, fleets', [5, 3, 4, 1, 3.5]],
  ['Nagpur', 'Maharashtra', '', 0, '', [3, 3, 3.5, 3.5, 3.5]],
  ['Surat', 'Gujarat', '', 0, '', [3.5, 3, 3.5, 3, 3.5]],
  ['Bhopal', 'Madhya Pradesh', '', 0, '', [3, 3.5, 3, 3.5, 3.5]],
  ['Patna', 'Bihar', '', 0, '', [3, 3.5, 3, 3.5, 3]]
];
// buyer heat: [Hustler, Explorer, Builder]  2 = lead, 1 = support
const HEAT = { Jaipur: [2, 1, 0], Indore: [1, 2, 1], Coimbatore: [1, 0, 2], Lucknow: [2, 0, 2], Bhubaneswar: [1, 2, 0],
  Ahmedabad: [1, 0, 2], Kochi: [1, 2, 0], Pune: [1, 2, 0], Hyderabad: [2, 1, 0], Bengaluru: [1, 2, 0] };
// quarterly plan (Q1..Q8)
const U = [500, 1000, 1800, 2700, 3600, 4800, 6000, 7600];
const FX = [3.0, 3.3, 3.6, 4.1, 4.8, 5.2, 5.6, 6.4];
const GM = [.14, .15, .165, .18, .195, .205, .215, .225];
const CAC = [10000, 9500, 9000, 8200, 7400, 6800, 6300, 6000];
const LG = [2600, 2500, 2400, 2300, 2300, 2200, 2200, 2200];
const CAPEX = 12, RAISE = 45;
const PRICE = { base: 74999, cargo: 89999, fleet: 99999 };
const TIERNAME = { base: 'Base', cargo: 'Cargo', fleet: 'Pro-Fleet' };
const RATED = { base: 85, cargo: 105, fleet: 135 };

/* ============================ helpers ============================ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const val = id => +document.getElementById(id).value;
const out = (k, t) => $$(`[data-out="${k}"]`).forEach(e => { e.textContent = t; });
const inr = n => '\u20B9' + Math.round(n).toLocaleString('en-IN');
const cr = (n, d = 1) => '\u20B9' + n.toFixed(d) + ' Cr';
const num = n => Math.round(n).toLocaleString('en-IN');
const G = '#1f6f54', GM_ = '#5e9b7e', SA = '#d98e2b', CL = '#b4533c', BL = '#3e6b8a', GRY = '#9fb0a6', FOR = '#153a2e';
const esc = s => String(s).replace(/"/g, '&quot;');
const tip = (t) => `data-tip="${esc(t)}"`;

function svg(w, h, inner) { return `<svg viewBox="0 0 ${w} ${h}" role="img" preserveAspectRatio="xMidYMid meet">${inner}</svg>`; }

function vbar(o) {
  const W = o.w || 480, H = o.h || 230;
  const v = o.values, n = v.length, m = { l: 12, r: 12, t: 26, b: Math.min(...v) < 0 ? 44 : 30 };
  const mx = Math.max(0, ...v), mn = Math.min(0, ...v), span = (mx - mn) || 1;
  const y = x => m.t + (mx - x) / span * (H - m.t - m.b), y0 = y(0);
  const step = (W - m.l - m.r) / n, bw = Math.min(46, step * .64);
  const fmt = o.fmt || (x => x);
  let s = `<line class="ax" x1="${m.l}" x2="${W - m.r}" y1="${y0}" y2="${y0}"/>`;
  v.forEach((x, i) => {
    const cx = m.l + step * i + step / 2, top = Math.min(y(x), y0), h = Math.max(1.5, Math.abs(y(x) - y0));
    const col = Array.isArray(o.colors) ? o.colors[i] : (o.colors ? o.colors(x, i) : G);
    s += `<rect class="${x >= 0 ? 'gu' : 'gd'}" x="${cx - bw / 2}" y="${top}" width="${bw}" height="${h}" rx="3" fill="${col}" ${tip(o.labels[i] + ': ' + fmt(x))}/>`;
    s += `<text x="${cx}" y="${x >= 0 ? top - 6 : top + h + 13}" text-anchor="middle" class="strong">${fmt(x)}</text>`;
    s += `<text x="${cx}" y="${H - 9}" text-anchor="middle">${o.labels[i]}</text>`;
  });
  return svg(W, H, s);
}

function hbar(o) {
  const W = o.w || 480, ml = o.ml || 130, mr = 64, rh = o.rh || 30, H = o.labels.length * rh + 14;
  const v = o.values, mx = Math.max(0, ...v, o.max || 0), mn = Math.min(0, ...v), span = (mx - mn) || 1;
  const x = q => ml + (q - mn) / span * (W - ml - mr), x0 = x(0), fmt = o.fmt || (q => q);
  let s = `<line class="ax" x1="${x0}" x2="${x0}" y1="4" y2="${H - 6}"/>`;
  v.forEach((q, i) => {
    const y = 8 + i * rh, col = Array.isArray(o.colors) ? o.colors[i] : (o.colors ? o.colors(q, i) : G);
    const bx = Math.min(x(q), x0), bwid = Math.max(1.5, Math.abs(x(q) - x0));
    s += `<text x="${ml - 10}" y="${y + rh / 2 + 1}" text-anchor="end" class="strong" dominant-baseline="middle">${o.labels[i]}</text>`;
    s += `<rect class="gr" x="${bx}" y="${y + 3}" width="${bwid}" height="${rh - 10}" rx="3" fill="${col}" ${tip(o.labels[i] + ': ' + fmt(q))}/>`;
    s += `<text x="${q >= 0 ? bx + bwid + 6 : bx - 6}" y="${y + rh / 2 + 1}" text-anchor="${q >= 0 ? 'start' : 'end'}" dominant-baseline="middle">${fmt(q)}</text>`;
  });
  return svg(W, H, s);
}

function gbar(o) {
  const W = o.w || 480, H = o.h || 240, m = { l: 12, r: 12, t: 22, b: 30 };
  const all = o.series.flatMap(s => s.values), mx = Math.max(...all) * 1.12;
  const y = q => m.t + (mx - q) / mx * (H - m.t - m.b), y0 = y(0), n = o.labels.length, k = o.series.length;
  const step = (W - m.l - m.r) / n, bw = Math.min(30, step * .7 / k), fmt = o.fmt || (q => q);
  let s = `<line class="ax" x1="${m.l}" x2="${W - m.r}" y1="${y0}" y2="${y0}"/>`;
  o.labels.forEach((lb, i) => {
    const cx = m.l + step * i + step / 2;
    o.series.forEach((se, j) => {
      const q = se.values[i], bx = cx - (k * bw) / 2 + j * bw + 1, top = y(q);
      s += `<rect class="gu" x="${bx}" y="${top}" width="${bw - 2}" height="${Math.max(1.5, y0 - top)}" rx="3" fill="${se.color}" ${tip(lb + ' | ' + se.name + ': ' + fmt(q))}/>`;
      s += `<text x="${bx + (bw - 2) / 2}" y="${top - 5}" text-anchor="middle" style="font-size:10px" class="strong">${fmt(q)}</text>`;
    });
    s += `<text x="${cx}" y="${H - 9}" text-anchor="middle">${lb}</text>`;
  });
  const lg = `<ul class="legend">${o.series.map(se => `<li><i style="background:${se.color}"></i>${se.name}</li>`).join('')}</ul>`;
  return svg(W, H, s) + lg;
}

function line(o) {
  const W = o.w || 480, H = o.h || 230, m = { l: 44, r: 16, t: 16, b: 30 };
  const all = o.series.flatMap(s => s.values).concat(o.ref ? [o.ref.v] : []);
  let mx = Math.max(0, ...all), mn = Math.min(0, ...all); if (mx === mn) mx = mn + 1;
  const pad = (mx - mn) * .08; mx += pad; if (mn < 0) mn -= pad;
  const n = o.labels.length, x = i => m.l + i / (n - 1) * (W - m.l - m.r), y = q => m.t + (mx - q) / (mx - mn) * (H - m.t - m.b);
  const fmt = o.fmt || (q => q), ticks = 4;
  let s = '';
  for (let t = 0; t <= ticks; t++) { const q = mn + (mx - mn) * t / ticks, yy = y(q); s += `<line class="gl" x1="${m.l}" x2="${W - m.r}" y1="${yy}" y2="${yy}"/><text x="${m.l - 6}" y="${yy + 3}" text-anchor="end">${fmt(q)}</text>`; }
  if (o.ref) s += `<line class="dash" stroke="${SA}" stroke-width="1.5" x1="${m.l}" x2="${W - m.r}" y1="${y(o.ref.v)}" y2="${y(o.ref.v)}"/><text x="${W - m.r}" y="${y(o.ref.v) - 5}" text-anchor="end" style="fill:#8a5a10;font-weight:600">${o.ref.label}</text>`;
  o.series.forEach(se => {
    const pts = se.values.map((q, i) => `${x(i)},${y(q)}`);
    if (o.area) s += `<polygon points="${m.l},${y(0)} ${pts.join(' ')} ${x(n - 1)},${y(0)}" fill="${se.color}" opacity=".12"/>`;
    s += `<polyline points="${pts.join(' ')}" fill="none" stroke="${se.color}" stroke-width="2.6" stroke-linejoin="round"/>`;
    se.values.forEach((q, i) => { s += `<circle cx="${x(i)}" cy="${y(q)}" r="3.6" fill="#fff" stroke="${se.color}" stroke-width="2" ${tip(o.labels[i] + ': ' + fmt(q))}/>`; });
  });
  o.labels.forEach((lb, i) => { if (!o.skip || i % o.skip === 0 || i === n - 1) s += `<text x="${x(i)}" y="${H - 9}" text-anchor="middle">${lb}</text>`; });
  return svg(W, H, s);
}

function donut(items, center, w) {
  const tot = items.reduce((a, b) => a + b.v, 0) || 1, R = 70, r = 44, cx = 90, cy = 90;
  let a0 = -Math.PI / 2, s = '';
  items.forEach(it => {
    const a1 = a0 + it.v / tot * Math.PI * 2 - (items.length > 1 ? .012 : 0), big = a1 - a0 > Math.PI ? 1 : 0;
    const p = (ang, rad) => `${cx + rad * Math.cos(ang)},${cy + rad * Math.sin(ang)}`;
    if (it.v > 0) s += `<path d="M${p(a0, R)} A${R},${R} 0 ${big} 1 ${p(a1, R)} L${p(a1, r)} A${r},${r} 0 ${big} 0 ${p(a0, r)} Z" fill="${it.c}" ${tip(it.n + ': ' + (it.t || Math.round(it.v / tot * 100) + '%'))}/>`;
    a0 += it.v / tot * Math.PI * 2;
  });
  if (center) s += `<text x="${cx}" y="${cy - 2}" text-anchor="middle" class="big" style="font-size:17px">${center[0]}</text><text x="${cx}" y="${cy + 15}" text-anchor="middle">${center[1]}</text>`;
  const lg = `<ul class="legend">${items.map(it => `<li><span><i style="background:${it.c}"></i>${it.n}</span><span>${it.t || Math.round(it.v / tot * 100) + '%'}</span></li>`).join('')}</ul>`;
  return `<div class="donut">${svg(180, 180, s)}${lg}</div>`;
}

function hwater(rows, o) {
  const W = 480, ml = o.ml || 110, mr = 70, rh = 30, H = rows.length * rh + 12, mx = o.max;
  const x = q => ml + q / mx * (W - ml - mr), fmt = o.fmt;
  let s = `<line class="ax" x1="${ml}" x2="${ml}" y1="4" y2="${H - 6}"/>`;
  rows.forEach((r, i) => {
    const y = 8 + i * rh, a = Math.min(r.from, r.to), b = Math.max(r.from, r.to);
    s += `<text x="${ml - 10}" y="${y + rh / 2 + 1}" text-anchor="end" class="strong" dominant-baseline="middle">${r.label}</text>`;
    s += `<rect class="gr" x="${x(a)}" y="${y + 3}" width="${Math.max(2, x(b) - x(a))}" height="${rh - 10}" rx="3" fill="${r.color}" ${tip(r.label + ': ' + r.text)}/>`;
    s += `<text x="${x(b) + 6}" y="${y + rh / 2 + 1}" dominant-baseline="middle">${r.text}</text>`;
  });
  return svg(W, H, s);
}

/* ============================ model ============================ */
function model(p = {}) {
  const v = p.vol ?? 1, a = p.asp ?? 80000, g = p.gm ?? 0, c = p.cac ?? 1, f = p.fx ?? 1;
  let cum = 0, tr = 0;
  const rows = U.map((u0, i) => {
    const u = u0 * v, rev = u * a / 1e7, gp = rev * (GM[i] + g / 100), mk = u * CAC[i] * c / 1e7, lg = u * LG[i] / 1e7;
    const co = gp - mk - lg, fx = FX[i] * f, e = co - fx; cum += e; tr = Math.min(tr, cum);
    return { u, rev, gp, mk, lg, co, fx, e, cum, nwc: rev * 20 / 90 };
  });
  return { rows, tr, be: rows.findIndex(r => r.e > 0), need: -tr + CAPEX + rows[7].nwc };
}
const BASE = model();
const sum = (rows, a, b, k) => rows.slice(a, b).reduce((s, r) => s + r[k], 0);

/* ============================ city scoring ============================ */
function weights() { const raw = $$('#wsl input').map(i => +i.value), t = raw.reduce((a, b) => a + b, 0) || 1; return { raw, t, pct: raw.map(r => r / t) }; }
function scoreCities(w) {
  return CITIES.map(c => ({ n: c[0], st: c[1], hub: c[2], wave: c[3], lead: c[4], r: c[5], s: c[5].reduce((a, r, i) => a + r * w.pct[i], 0) * 20 })).sort((a, b) => b.s - a.s);
}
let LASTW = { pct: W0.map(x => x / 100), raw: W0, t: 100 };

/* ============================ chart registry ============================ */
const CH = {
  homeCum: () => { let c = 0; return vbar({ labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'], values: U.map(u => c += u), colors: (q, i) => i < 4 ? G : GM_, fmt: q => num(q), h: 210 }); },
  evReg: () => vbar({ labels: ['FY18', 'FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], values: [.10, .15, .17, .14, .46, 1.18, 1.68, 2.05, 2.66], colors: (q, i) => i === 8 ? SA : G, fmt: q => q.toFixed(2) }),
  stateTop: () => hbar({ labels: ['Tripura', 'Assam', 'Delhi', 'Kerala', 'Goa'], values: [18.38, 14.30, 13.89, 11.34, 10.76], fmt: q => q.toFixed(2) + '%', ml: 70 }),
  indiaGlobal: () => vbar({ labels: ['India 2024', 'Global 2024', 'India goal 2030'], values: [7.66, 16.48, 30], colors: [G, GRY, SA], fmt: q => q + '%', h: 240 }),
  poolGrowth: () => hbar({ labels: ['Vehicle software', 'Battery, EV drive', 'All components', 'ICE powertrain'], values: [15, 13, 3.5, -3], colors: q => q < 0 ? CL : G, fmt: q => q + '%', ml: 116, w: 440 }),
  chargers: () => donut([{ n: 'Karnataka', v: 6096, c: G, t: '6,096' }, { n: 'Rest of India', v: 29151 - 6096, c: GRY, t: '23,055' }], ['29,151', 'stations']),
  r2w: () => {
    const w = LASTW, sc = scoreCities(w);
    const xs = c => { const d = w.pct[0] + w.pct[2]; return d ? (c.r[0] * w.pct[0] + c.r[2] * w.pct[2]) / d : 0; };
    const ys = c => { const d = w.pct[1] + w.pct[3] + w.pct[4]; return d ? (c.r[1] * w.pct[1] + c.r[3] * w.pct[3] + c.r[4] * w.pct[4]) / d : 0; };
    const W = 480, H = 300, m = { l: 40, r: 14, t: 14, b: 38 }, lo = 2, hi = 5;
    const X = q => m.l + (q - lo) / (hi - lo) * (W - m.l - m.r), Y = q => m.t + (hi - q) / (hi - lo) * (H - m.t - m.b);
    let s = `<rect x="${X(3.5)}" y="${m.t}" width="${W - m.r - X(3.5)}" height="${Y(3.5) - m.t}" fill="#e3eee7"/>`;
    s += `<line class="dash gl" x1="${X(3.5)}" x2="${X(3.5)}" y1="${m.t}" y2="${H - m.b}"/><line class="dash gl" x1="${m.l}" x2="${W - m.r}" y1="${Y(3.5)}" y2="${Y(3.5)}"/>`;
    s += `<line class="ax" x1="${m.l}" x2="${W - m.r}" y1="${H - m.b}" y2="${H - m.b}"/><line class="ax" x1="${m.l}" x2="${m.l}" y1="${m.t}" y2="${H - m.b}"/>`;
    [2, 3, 4, 5].forEach(t => { s += `<text x="${X(t)}" y="${H - m.b + 14}" text-anchor="middle">${t}</text><text x="${m.l - 8}" y="${Y(t) + 3}" text-anchor="end">${t}</text>`; });
    s += `<text x="${(m.l + W - m.r) / 2}" y="${H - 6}" text-anchor="middle" class="strong">Market attractiveness (size, EV readiness)</text>`;
    s += `<text transform="translate(11 ${H / 2}) rotate(-90)" text-anchor="middle" class="strong">Ability to win (fit, whitespace, service)</text>`;
    s += `<text x="${W - m.r - 6}" y="${m.t + 14}" text-anchor="end" style="fill:#1f6f54;font-weight:600">ENTER FIRST</text>`;
    sc.forEach((c, i) => {
      const col = c.wave === 1 ? G : c.wave === 2 ? SA : GRY, px = X(xs(c)), py = Y(ys(c));
      s += `<circle cx="${px}" cy="${py}" r="6.5" fill="${col}" fill-opacity=".9" stroke="#fff" stroke-width="1.5" ${tip(c.n + ' | score ' + c.s.toFixed(1))}/><text x="${px + 9}" y="${py + 3.5}" style="font-size:10px">${c.n}</text>`;
    });
    return svg(W, H, s);
  },
  stateE2W: () => hbar({ labels: ['Kerala', 'Karnataka', 'Maharashtra', 'Odisha', 'Tamil Nadu'], values: [13.9, 12.5, 10.1, 9.3, 8.1], fmt: q => q + '%', ml: 90 }),
  tcoBars: () => {
    const p = tco(), kms = [800, 1200, 1500, 2600];
    return gbar({ labels: ['Student 800 km', 'Shop 1,200 km', 'Commuter 1,500 km', 'Rider 2,600 km'], series: [{ name: 'Petrol scooter', color: CL, values: kms.map(k => k / p.mil * p.pet) }, { name: 'SwadesiGo', color: G, values: kms.map(k => k * p.kwh * p.tar) }], fmt: q => num(q), h: 250 });
  },
  tcoLine: () => {
    const p = tco(), ks = [300, 800, 1300, 1800, 2300, 2800, 3300];
    return line({ labels: ks.map(k => num(k)), series: [{ color: G, values: ks.map(k => (k / p.mil * p.pet - k * p.kwh * p.tar) * 12) }], area: true, fmt: q => num(q / 1000) + 'k', h: 220 });
  },
  mix: () => donut([{ n: 'Base', v: 40, c: GM_ }, { n: 'Cargo', v: 25, c: SA }, { n: 'Pro-Fleet', v: 35, c: G }], ['100%', 'of units']),
  saveEmi: () => {
    const p = tco(), L = loan(), prof = [['Student', 800, 'base'], ['Shop', 1200, 'cargo'], ['Commuter', 1500, 'base'], ['Rider', 2600, 'fleet']];
    return gbar({ labels: prof.map(q => q[0] + ' ' + num(q[1]) + ' km'), series: [{ name: 'Fuel saving a month', color: G, values: prof.map(q => q[1] / p.mil * p.pet - q[1] * p.kwh * p.tar) }, { name: 'EMI a month', color: SA, values: prof.map(q => emi(PRICE[q[2]], L.down, L.rate, L.ten)) }], fmt: q => num(q), h: 250 });
  },
  priceCmp: () => hbar({ labels: ['SwadesiGo Base', 'SwadesiGo Cargo', 'SwadesiGo Pro-Fleet', 'Ola S1 X (approx.)', 'TVS iQube (approx.)', 'Bajaj Chetak (approx.)'], values: [75, 90, 100, 90, 101, 110], colors: [G, G, G, GRY, GRY, GRY], fmt: q => '\u20B9' + q + 'k', ml: 150, w: 470 }),
  gmCmp: () => vbar({ labels: ['Ola FY25', 'Ather FY26', 'TVS FY26', 'SwadesiGo Y1', 'SwadesiGo Y2'], values: [17.9, 21.1, 28.8, sum(BASE.rows, 0, 4, 'gp') / sum(BASE.rows, 0, 4, 'rev') * 100, sum(BASE.rows, 4, 8, 'gp') / sum(BASE.rows, 4, 8, 'rev') * 100], colors: [GRY, GRY, GRY, G, G], fmt: q => q.toFixed(1) + '%', h: 240 }),
  champMix: () => donut([{ n: 'Delivery riders', v: 30, c: G }, { n: 'Students', v: 20, c: GM_ }, { n: 'Small-business owners', v: 20, c: SA }, { n: 'Local micro-influencers', v: 20, c: BL }, { n: 'EV enthusiasts', v: 10, c: GRY }], ['100', 'Champions']),
  champRoll: () => vbar({ labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'], values: [100, 300, 500, 500, 600, 700, 900, 1000], colors: (q, i) => i < 3 ? G : SA, fmt: q => num(q), h: 210 }),
  funnel: () => {
    const g = gateIn(), rows = [['Champions', g.ch, 100], ['Test rides', g.rides, 800], ['Deliveries', g.del, 80]];
    const W = 480, ml = 100, mr = 90, rh = 44, H = rows.length * rh + 10;
    let s = '';
    rows.forEach((r, i) => {
      const mx = Math.max(r[1], r[2]) * 1.15, y = 6 + i * rh, wAct = r[1] / mx * (W - ml - mr), wGate = r[2] / mx * (W - ml - mr), ok = r[1] >= r[2];
      s += `<text x="${ml - 10}" y="${y + 20}" text-anchor="end" class="strong">${r[0]}</text>`;
      s += `<rect class="gr" x="${ml}" y="${y + 8}" width="${wAct}" height="22" rx="3" fill="${ok ? G : CL}" ${tip(r[0] + ': ' + num(r[1]) + ' (gate ' + num(r[2]) + ')')}/>`;
      s += `<line stroke="${FOR}" stroke-width="2" stroke-dasharray="3 3" x1="${ml + wGate}" x2="${ml + wGate}" y1="${y + 3}" y2="${y + 35}"/>`;
      s += `<text x="${ml + Math.max(wAct, wGate) + 8}" y="${y + 24}">${num(r[1])} / ${num(r[2])}</text>`;
    });
    return svg(W, H, s);
  },
  cacPath: () => line({ labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'], series: [{ color: G, values: CAC }], ref: { v: 9000, label: 'Day-100 gate \u20B99,000' }, fmt: q => num(q), h: 230 }),
  rrWater: () => {
    const r = rr(), rows = [{ label: 'Rated range', from: 0, to: r.r0, color: GRY, text: Math.round(r.r0) + ' km' }];
    r.steps.forEach(s => rows.push({ label: s.n, from: Math.min(s.a, s.b), to: Math.max(s.a, s.b), color: s.b >= s.a ? GM_ : CL, text: (s.b - s.a >= 0 ? '+' : '') + (s.b - s.a).toFixed(1) + ' km' }));
    rows.push({ label: 'RealRange', from: 0, to: r.real, color: G, text: Math.round(r.real) + ' km' });
    return hwater(rows, { max: Math.max(r.r0, ...r.steps.map(s => Math.max(s.a, s.b))) * 1.08, ml: 112 });
  },
  rrScen: () => {
    const sc = [['Student, mild day', 'base', 70, 26, 'mixed', 5, 100, 'normal'], ['Rider, 41\u00B0C, stop-go', 'fleet', 95, 41, 'stop', 10, 95, 'normal'], ['Loaded cargo', 'cargo', 220, 33, 'mixed', 10, 100, 'normal'], ['Hilly, cool, ageing pack', 'base', 85, 18, 'free', 40, 92, 'normal']];
    const res = sc.map(q => rr({ v: q[1], kg: q[2], t: q[3], tr: q[4], c: q[5], s: q[6], st: q[7] }));
    return gbar({ labels: sc.map(q => q[0]), series: [{ name: 'Rated range', color: GRY, values: res.map(r => r.r0) }, { name: 'RealRange', color: G, values: res.map(r => r.real) }], fmt: q => Math.round(q), h: 250 });
  },
  techGantt: () => {
    const rows = [['RealRange', 0, 6, G], ['Predictive maintenance, retention', 6, 15, GM_], ['Fleet dashboard, spares logistics', 15, 24, BL], ['Next-city signal (continuous)', 0, 24, SA]];
    const W = 480, ml = 170, rh = 34, H = rows.length * rh + 30, x = q => ml + q / 24 * (W - ml - 10);
    let s = '';
    [0, 6, 12, 18, 24].forEach(t => { s += `<line class="gl" x1="${x(t)}" x2="${x(t)}" y1="2" y2="${H - 22}"/><text x="${x(t)}" y="${H - 6}" text-anchor="middle">M${t}</text>`; });
    rows.forEach((r, i) => { const y = 6 + i * rh; s += `<text x="${ml - 8}" y="${y + 17}" text-anchor="end" class="strong">${r[0]}</text><rect class="gr" x="${x(r[1])}" y="${y + 4}" width="${x(r[2]) - x(r[1])}" height="20" rx="4" fill="${r[3]}" ${tip(r[0] + ': months ' + r[1] + ' to ' + r[2])}/>`; });
    return svg(W, H, s);
  },
  ebitdaQ: () => vbar({ labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'], values: fin().rows.map(r => r.e), colors: q => q >= 0 ? G : CL, fmt: q => q.toFixed(1), h: 230 }),
  ebitdaCum: () => line({ labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'], series: [{ color: CL, values: fin().rows.map(r => r.cum) }], area: true, fmt: q => q.toFixed(0), h: 230 }),
  unitWater: () => {
    const p = finP(), r = fin().rows[7], u = r.u || 1, rev = p.asp, cogs = rev - r.gp * 1e7 / u, gp = r.gp * 1e7 / u, mk = r.mk * 1e7 / u, lg = r.lg * 1e7 / u, co = gp - mk - lg;
    return hwater([
      { label: 'Net price', from: 0, to: rev, color: GRY, text: inr(rev) },
      { label: 'Cost of goods', from: gp, to: rev, color: CL, text: '-' + inr(cogs) },
      { label: 'Gross profit', from: 0, to: gp, color: GM_, text: inr(gp) },
      { label: 'Acquisition', from: gp - mk, to: gp, color: CL, text: '-' + inr(mk) },
      { label: 'Logistics', from: gp - mk - lg, to: gp - mk, color: CL, text: '-' + inr(lg) },
      { label: 'Contribution', from: 0, to: Math.max(co, 0), color: co >= 0 ? G : CL, text: inr(co) }], { max: rev * 1.05, ml: 96, fmt: inr });
  },
  funds: () => {
    const m = fin(), peak = -m.tr, nwc = m.rows[7].nwc, buf = Math.max(0, RAISE - m.need);
    return donut([{ n: 'Operating losses to breakeven', v: peak, c: CL, t: cr(peak) }, { n: 'Capex (tooling, hubs)', v: CAPEX, c: SA, t: cr(CAPEX) }, { n: 'Working capital', v: nwc, c: BL, t: cr(nwc) }, { n: 'Unallocated buffer', v: buf, c: GRY, t: cr(buf) }], [cr(Math.min(m.need, 999), 1).replace('\u20B9', '\u20B9'), 'cash need']);
  },
  revQ: () => vbar({ labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'], values: fin().rows.map(r => r.rev), colors: (q, i) => i < 4 ? GM_ : G, fmt: q => q.toFixed(0), h: 230 }),
  sens: () => {
    const p = finP(), vs = [60, 70, 80, 90, 100, 110, 120, 130];
    return vbar({ labels: vs.map(v => v + '%'), values: vs.map(v => model({ ...p, vol: v / 100 }).rows[7].e), colors: q => q >= 0 ? G : CL, fmt: q => q.toFixed(1), h: 230 });
  }
};

function renderCharts(page) { $$('[data-chart]', page).forEach(el => { const f = CH[el.dataset.chart]; if (f) el.innerHTML = f(); }); }
function redraw(names) { names.forEach(n => $$(`[data-chart="${n}"]`).forEach(el => { if (el.closest('.page.active')) el.innerHTML = CH[n](); })); }

/* ============================ page logic ============================ */
/* Growth OS */
function updCities() {
  const w = weights(); LASTW = w;
  w.pct.forEach((p, i) => out('wv' + i, Math.round(p * 100) + '%'));
  const sc = scoreCities(w), planSet = CITIES.filter(c => c[3]).map(c => c[0]).sort().join(','), topSet = sc.slice(0, 10).map(c => c.n).sort().join(',');
  $('#rankBox').innerHTML = `<div class="rank-head"><b>Ranking under your weights</b><span>Dashed line marks the top ten</span></div>` + sc.map((c, i) => {
    const tg = c.wave === 1 ? '<span class="tag t1">Wave 1</span>' : c.wave === 2 ? '<span class="tag t2">Wave 2</span>' : '<span class="tag t0">Not in plan</span>';
    return `<div class="rrow ${c.wave === 2 ? 'w2' : ''} ${i >= 10 ? 'out' : ''} ${i === 9 ? 'cut' : ''}"><span class="rk">${i + 1}</span><span class="cn">${c.n}<small>${c.st}</small></span><div class="rbar"><i style="width:${c.s}%"></i></div><span class="rs">${c.s.toFixed(1)}</span>${tg}</div>`;
  }).join('');
  out('topScore', sc[0].s.toFixed(1)); out('topCity', sc[0].n);
  const same = planSet === topSet;
  out('matchTxt', same ? 'Same as plan' : 'Differs from plan');
  const inNew = sc.slice(0, 10).filter(c => !c.wave).map(c => c.n), outOld = CITIES.filter(c => c[3] && !sc.slice(0, 10).find(x => x.n === c[0])).map(c => c[0]);
  out('matchNote', same ? 'Plan and engine agree' : 'In: ' + (inNew.join(', ') || 'none') + '. Out: ' + (outOld.join(', ') || 'none'));
  redraw(['r2w']);
}
function planTable() {
  const sc = scoreCities({ pct: W0.map(x => x / 100) });
  $('#planBody').innerHTML = CITIES.filter(c => c[3]).sort((a, b) => a[3] - b[3] || sc.findIndex(x => x.n === a[0]) - sc.findIndex(x => x.n === b[0])).map(c => `<tr><td><span class="tag ${c[3] === 1 ? 't1' : 't2'}">Wave ${c[3]}</span></td><td><strong>${c[0]}</strong></td><td>${c[1]}</td><td>${c[2]}</td><td>${c[4]}</td><td class="r"><strong>${sc.find(x => x.n === c[0]).s.toFixed(1)}</strong></td></tr>`).join('');
  const lab = ['', 'Support', 'Lead'], cls = ['h0', 'h1', 'h2'];
  $('#matrixBody').innerHTML = CITIES.filter(c => c[3]).sort((a, b) => a[3] - b[3]).map(c => `<tr><td><strong>${c[0]}</strong></td><td><span class="tag ${c[3] === 1 ? 't1' : 't2'}">Wave ${c[3]}</span></td>${HEAT[c[0]].map(h => `<td class="heat ${cls[h]}">${lab[h] || '-'}</td>`).join('')}</tr>`).join('');
}

/* Customers */
function tco() { return { km: val('cKm'), pet: val('cPetrol'), mil: val('cMil'), tar: val('cTar'), kwh: val('cKwh') }; }
function updCustomers() {
  const p = tco(), P = p.km / p.mil * p.pet, E = p.km * p.kwh * p.tar;
  out('cvKm', num(p.km) + ' km'); out('cvPetrol', inr(p.pet) + ' / litre'); out('cvMil', p.mil + ' km/l'); out('cvTar', '\u20B9' + p.tar + ' / kWh'); out('cvKwh', p.kwh.toFixed(3) + ' kWh/km');
  out('tcoP', inr(P)); out('tcoE', inr(E)); out('tcoYr', inr((P - E) * 12)); out('tcoPct', Math.round((1 - E / P) * 100) + '%'); out('tcoKmTxt', num(p.km));
  out('tcoRider', inr(2600 / p.mil * p.pet - 2600 * p.kwh * p.tar));
  redraw(['tcoBars', 'tcoLine']);
}

/* Pricing */
function emi(P, down, rate, n) { const L = P * (1 - down / 100), r = rate / 1200; return r ? L * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : L / n; }
function loan() { return { tier: document.getElementById('pTier').value, down: val('pDown'), rate: val('pRate'), ten: val('pTen') }; }
function updPricing() {
  const L = loan(), P = PRICE[L.tier], e = emi(P, L.down, L.rate, L.ten), fin_ = P * (1 - L.down / 100);
  out('pvDown', L.down + '%'); out('pvRate', L.rate + '%'); out('pvTen', L.ten + ' months');
  out('emiM', inr(e)); out('emiD', inr(e / 30)); out('emiMNote', `${TIERNAME[L.tier]}, ${L.ten} months, ${L.down}% down, ${L.rate}% rate`);
  $('#emiCard').innerHTML = `Down payment <b>${inr(P - fin_)}</b>. Amount financed <b>${inr(fin_)}</b>. Total repaid <b>${inr(e * L.ten)}</b>, of which interest is <b>${inr(e * L.ten - fin_)}</b>.`;
  redraw(['saveEmi']);
}

/* Circle */
function gateIn() { const ch = val('cCh'), rd = val('cRd'), cv = val('cCv'), sp = val('cSp') * 1e5, rides = ch * rd, del = Math.round(rides * cv / 100); return { ch, rd, cv, sp, rides, del, cac: del ? sp / del : Infinity }; }
function updCircle() {
  const g = gateIn(), ok = [g.ch >= 100, g.rides >= 800, g.del >= 80, g.cac <= 9000], n = ok.filter(Boolean).length;
  out('ccv', g.ch); out('crv', g.rd); out('cpv', g.cv + '%'); out('csv', '\u20B9' + (g.sp / 1e5).toFixed(1) + ' lakh');
  out('cRides', num(g.rides)); out('cDel', num(g.del)); out('cCac', isFinite(g.cac) ? inr(g.cac) : 'n/a'); out('cGates', n + ' of 4');
  const st = $('#cStatus');
  if (n === 4) { st.className = 'note-line'; st.innerHTML = '<b>Scale.</b> All four gates met. Unlock a pop-up hub and open franchise talks.'; }
  else if (g.del < 40 || g.cac > 13500) { st.className = 'note-line bad'; st.innerHTML = '<b>Pause.</b> Deliveries or CAC are far off the gate. Stop paid spend, keep serving existing owners, and review the buyer segment and channel before retrying.'; }
  else { st.className = 'note-line warn'; st.innerHTML = '<b>Experiment.</b> Close but not there. Extend 50 days with one change (buyer segment, channel or offer) and test again.'; }
  redraw(['funnel']);
}

/* RealRange */
function rr(o) {
  o = o || { v: document.getElementById('rVar').value, kg: val('rKg'), t: val('rT'), tr: document.getElementById('rTr').value, c: val('rC'), s: val('rS'), st: document.getElementById('rSt').value };
  const r0 = RATED[o.v];
  const fl = o.kg > 75 ? 1 - .0022 * (o.kg - 75) : Math.min(1.025, 1 + .001 * (75 - o.kg));
  const ft = o.t < 20 ? 1 - .006 * (20 - o.t) : o.t > 35 ? 1 - .004 * (o.t - 35) : 1;
  const ftr = { free: 1, mixed: .94, stop: .86 }[o.tr], fc = 1 - .003 * o.c, fs = o.s / 100, fst = { eco: 1.06, normal: 1, sport: .88 }[o.st];
  let cur = r0; const steps = [];
  [['Load', fl], ['Temperature', ft], ['Traffic', ftr], ['Climb', fc], ['Battery health', fs], ['Riding style', fst]].forEach(([n, f]) => { const nx = cur * f; steps.push({ n, a: cur, b: nx }); cur = nx; });
  return { r0, real: cur, steps };
}
function updRR() {
  const r = rr(); out('rvKg', val('rKg') + ' kg'); out('rvT', val('rT') + ' \u00B0C'); out('rvC', val('rC') + ' m'); out('rvS', val('rS') + '%');
  out('rrKm', Math.round(r.real) + ' km'); out('rrPct', Math.round(r.real / r.r0 * 100) + '%'); out('rrRated', r.r0);
  redraw(['rrWater']);
}

/* Financials */
function finP() { return { vol: val('fV') / 100, asp: val('fA'), gm: val('fG'), cac: val('fC') / 100, fx: val('fF') / 100 }; }
function fin() { return model(finP()); }
function updFin() {
  const p = finP(), m = model(p), R = m.rows;
  out('fvV', Math.round(p.vol * 100) + '%'); out('fvA', inr(p.asp)); out('fvG', (val('fG') > 0 ? '+' : '') + val('fG') + ' pts'); out('fvC', Math.round(p.cac * 100) + '%'); out('fvF', Math.round(p.fx * 100) + '%');
  out('fBe', m.be < 0 ? 'Beyond Q8' : 'Q' + (m.be + 1)); out('fBeNote', m.be < 0 ? 'Not within 24 months' : 'From about month ' + (m.be * 3 + 1));
  out('fRev2', cr(sum(R, 4, 8, 'rev'), 0)); out('fRev1', cr(sum(R, 0, 4, 'rev'), 0));
  out('fPeak', cr(-m.tr)); out('fNeed', cr(m.need)); out('fNeedNote', m.need <= RAISE ? 'Against \u20B945 Cr: buffer ' + cr(RAISE - m.need) : 'Shortfall of ' + cr(m.need - RAISE) + ' on \u20B945 Cr');
  $('#fNeedK').classList.toggle('neg', m.need > RAISE);
  const cpu = p.asp * (GM[7] + val('fG') / 100) - CAC[7] * p.cac - LG[7], fq = FX[7] * p.fx * 1e7;
  out('fBev', cpu > 0 ? num(fq / cpu / 3) : 'n/a');
  const st = $('#fStatus');
  if (m.be < 0) { st.className = 'note-line bad'; st.innerHTML = '<b>No breakeven inside 24 months</b> with these assumptions. Cut fixed cost, lift volume or margin, or lower CAC.'; }
  else if (m.need > RAISE) { st.className = 'note-line bad'; st.innerHTML = `<b>Breakeven reached in Q${m.be + 1}, but the cash need exceeds the raise</b> by ${cr(m.need - RAISE)}.`; }
  else { st.className = 'note-line'; st.innerHTML = `<b>Breakeven in Q${m.be + 1}</b> and the total need of ${cr(m.need)} fits inside the \u20B945 Cr raise.`; }
  const col = (k, f) => R.map(r => f(r[k])), fm = x => x.toFixed(1);
  const row = (l, k, f, cls) => `<tr class="${cls || ''}"><td>${l}</td>${R.map(r => `<td class="r ${r[k] < 0 && k !== 'u' ? 'neg' : ''}">${f(r[k])}</td>`).join('')}<td class="r">${f(sum(R, 0, 4, k))}</td><td class="r">${f(sum(R, 4, 8, k))}</td></tr>`;
  $('#modelTbl').innerHTML = `<thead><tr><th>Line</th>${['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'].map(q => `<th class="r">${q}</th>`).join('')}<th class="r">Year 1</th><th class="r">Year 2</th></tr></thead><tbody>` +
    row('Units sold', 'u', num) + row('Net revenue', 'rev', fm) + row('Gross profit', 'gp', fm) + row('Marketing and sales', 'mk', fm) + row('Distribution and service', 'lg', fm) + row('Contribution', 'co', fm) + row('Fixed costs', 'fx', fm) + row('EBITDA', 'e', fm, 'total') +
    `<tr><td>Cumulative EBITDA</td>${R.map(r => `<td class="r ${r.cum < 0 ? 'neg' : ''}">${fm(r.cum)}</td>`).join('')}<td class="r">${fm(R[3].cum)}</td><td class="r">${fm(R[7].cum)}</td></tr></tbody>`;
  redraw(['ebitdaQ', 'ebitdaCum', 'unitWater', 'funds', 'revQ', 'sens', 'gmCmp']);
}

/* Home and static */
function updHome() {
  out('hCum', num(sum(BASE.rows, 0, 8, 'u'))); out('hNeed', cr(BASE.need)); out('hBe', 'Q' + (BASE.be + 1)); out('hRev', cr(sum(BASE.rows, 4, 8, 'rev'), 0));
  out('hSave', inr((1500 / 45 * 100 - 1500 * .03 * 8) * 12));
}

/* ============================ router ============================ */
const PAGES = ['home', 'market', 'cities', 'customers', 'pricing', 'circle', 'realrange', 'financials', 'sources'];
const TITLES = { home: 'Home', market: 'Market', cities: 'Growth OS', customers: 'Customers', pricing: 'Pricing', circle: 'Circle', realrange: 'RealRange', financials: 'Financials', sources: 'Sources' };
const UPD = { home: updHome, cities: updCities, customers: updCustomers, pricing: updPricing, circle: updCircle, realrange: updRR, financials: updFin };

function addPagers() {
  PAGES.forEach((p, i) => {
    if (p === 'home') return;
    const pv = PAGES[i - 1], nx = PAGES[i + 1], wrap = $('#page-' + p + ' .wrap');
    wrap.insertAdjacentHTML('beforeend', `<div class="pager"><a href="#${pv}"><small>Previous</small><b>${TITLES[pv]}</b></a>${nx ? `<a class="next" href="#${nx}"><small>Next</small><b>${TITLES[nx]}</b></a>` : ''}</div>`);
  });
}
function route() {
  let name = location.hash.replace('#', '') || 'home'; if (!PAGES.includes(name)) name = 'home';
  $$('.page').forEach(p => p.classList.toggle('active', p.id === 'page-' + name));
  $$('.topnav a').forEach(a => a.classList.toggle('on', a.dataset.go === name));
  const page = $('#page-' + name);
  if (UPD[name]) UPD[name]();
  renderCharts(page);
  window.scrollTo(0, 0);
  $('#topnav').classList.remove('open'); $('#menuBtn').setAttribute('aria-expanded', 'false');
}

/* ============================ boot ============================ */
document.addEventListener('DOMContentLoaded', () => {
  planTable(); addPagers();
  $('#menuBtn').addEventListener('click', () => { const o = $('#topnav').classList.toggle('open'); $('#menuBtn').setAttribute('aria-expanded', o); });
  $('#wsl').addEventListener('input', updCities);
  $('#wReset').addEventListener('click', () => { $$('#wsl input').forEach((i, k) => i.value = W0[k]); updCities(); });
  [['#page-customers', updCustomers], ['#page-pricing', updPricing], ['#page-circle', updCircle], ['#page-realrange', updRR], ['#page-financials', updFin]].forEach(([sel, fn]) => $(sel).addEventListener('input', fn));
  $('#fReset').addEventListener('click', () => { [['fV', 100], ['fA', 80000], ['fG', 0], ['fC', 100], ['fF', 100]].forEach(([i, v]) => document.getElementById(i).value = v); updFin(); });
  // tooltips
  const tp = $('#tip');
  document.addEventListener('mousemove', e => {
    const t = e.target.closest && e.target.closest('[data-tip]');
    if (!t) { tp.style.opacity = 0; return; }
    tp.textContent = t.getAttribute('data-tip'); tp.style.opacity = 1;
    tp.style.left = Math.min(e.clientX + 14, innerWidth - 260) + 'px'; tp.style.top = (e.clientY + 16) + 'px';
  });
  window.addEventListener('hashchange', route);
  route();
});
