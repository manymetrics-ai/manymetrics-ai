// Genera los SVG del README del perfil y el propio README.md a partir de assets/profile.json.
// Uso: node assets/build.mjs
// Las fuentes (Geist y Geist Mono, recortadas) van incrustadas en cada SVG para que GitHub las muestre.
import fs from 'node:fs';
import path from 'node:path';

const dir = path.dirname(new URL(import.meta.url).pathname);
const root = path.resolve(dir, '..');
const P = JSON.parse(fs.readFileSync(path.join(dir, 'profile.json'), 'utf8'));

const C = { ink: '#0B2230', navy: '#0E2A38', panel: '#123445', line: '#1E4254', slate: '#4A606A', cyan: '#00C1B2', cyanDeep: '#0B8C82', white: '#F4F7F6', muted: '#A3B4BB' };
const b64 = (f) => fs.readFileSync(path.join(dir, 'fonts', f)).toString('base64');
const FONTS = `<style>
@font-face{font-family:G;src:url(data:font/woff2;base64,${b64('geist.woff2')}) format('woff2');font-weight:100 900}
@font-face{font-family:GM;src:url(data:font/woff2;base64,${b64('geist-mono.woff2')}) format('woff2');font-weight:100 900}
text{font-family:G,'Segoe UI',Helvetica,Arial,sans-serif}.m{font-family:GM,ui-monospace,Menlo,monospace}
</style>`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const svg = (w, h, body, title) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>${FONTS}${body}</svg>\n`;
const write = (name, content) => fs.writeFileSync(path.join(dir, name), content);
const diamond = (x, y, s = 5, fill = 'none') => `<path d="M${x} ${y - s}L${x + s} ${y}L${x} ${y + s}L${x - s} ${y}Z" fill="${fill}" stroke="${C.cyan}" stroke-width="1.4"/>`;

// ---------- Cabecera ----------
function hero() {
  const W = 1280, H = 440;
  const cx = 1010, cy = 220, R = 118;
  const nodes = [['assess', -90], ['architect', 0], ['govern', 90], ['scale', 180]];
  const pt = (a, r = R) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  // red de puntos de fondo (simula un grafo de agentes)
  const seed = [[700, 70], [780, 140], [860, 60], [1180, 80], [1230, 170], [1200, 330], [1120, 395], [860, 390], [760, 330], [690, 230]];
  const links = [[0, 1], [1, 2], [3, 4], [4, 5], [5, 6], [7, 8], [8, 9], [9, 0], [2, 3], [6, 7]];
  const net = links.map(([a, b]) => `<line x1="${seed[a][0]}" y1="${seed[a][1]}" x2="${seed[b][0]}" y2="${seed[b][1]}" stroke="${C.line}" stroke-width="1"/>`).join('')
    + seed.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="3" fill="${i % 3 ? C.slate : C.cyan}" opacity="${i % 3 ? 0.7 : 0.9}"/>`).join('');
  const arcs = nodes.map(([, a]) => {
    const [x1, y1] = pt(a + 22), [x2, y2] = pt(a + 68);
    return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} A${R} ${R} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${C.cyan}" stroke-width="1.6" marker-end="url(#ar)"/>`;
  }).join('');
  const labels = nodes.map(([k, a], i) => {
    const [x, y] = pt(a);
    const [lx, ly] = pt(a, R + 52);
    const anchor = a === 0 ? 'start' : a === 180 ? 'end' : 'middle';
    const dx = a === 0 ? -26 : a === 180 ? 26 : 0;
    return `<circle cx="${x}" cy="${y}" r="24" fill="${C.navy}" stroke="${C.cyan}" stroke-width="1.4"/>
      <text x="${x}" y="${y + 5}" text-anchor="middle" class="m" font-size="14" fill="${C.cyan}">${P.phases[k].n}</text>
      <text x="${lx + dx}" y="${ly + 5}" text-anchor="${anchor}" font-size="13" font-weight="600" letter-spacing="3" fill="${C.white}">${P.phases[k].en.toUpperCase()}</text>`;
  }).join('');
  // Puntos de la retícula que se encienden y apagan en bucle (posiciones fijas, pseudoaleatorias)
  let seedN = 7;
  const rnd = () => ((seedN = (seedN * 9301 + 49297) % 233280) / 233280);
  const lit = Array.from({ length: 26 }, (_, i) => {
    const gx = Math.round((W / 2 + 22 + rnd() * (W / 2 - 44)) / 44) * 44;
    const gy = Math.round((22 + rnd() * (H - 44)) / 44) * 44;
    if (Math.hypot(gx - cx, gy - cy) < 70) return '';
    const big = i % 5 === 0, dur = (5 + rnd() * 5).toFixed(1), begin = (rnd() * 6).toFixed(1);
    return `<circle cx="${gx}" cy="${gy}" r="${big ? 3.2 : 2}" fill="${C.cyan}" opacity="0"><animate attributeName="opacity" values="0;${big ? 0.95 : 0.6};0" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></circle>`;
  }).join('');
  const body = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.ink}"/><stop offset="1" stop-color="${C.navy}"/></linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${C.cyan}" stop-opacity=".22"/><stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/></radialGradient>
    <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="${C.line}"/></pattern>
    <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M44 0H0V44" fill="none" stroke="${C.line}" stroke-width=".6"/></pattern>
    <marker id="ar" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="${C.cyan}"/></marker>
    <clipPath id="clip"><rect width="${W}" height="${H}" rx="18"/></clipPath>
  </defs>
  <g clip-path="url(#clip)">
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#dots)" opacity=".55"/>
    <rect x="${W / 2}" width="${W / 2}" height="${H}" fill="url(#grid)" opacity=".6"/>
    ${lit}
    <circle cx="${cx}" cy="${cy}" r="260" fill="url(#glow)"/>
    ${net}
    <circle cx="${cx}" cy="${cy}" r="${R + 90}" fill="none" stroke="${C.line}" stroke-dasharray="2 8"/>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${C.line}" stroke-width="1"/>
    <g>${arcs}</g>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${C.cyan}" stroke-width="2" stroke-dasharray="40 702" stroke-linecap="round" opacity=".9">
      <animate attributeName="stroke-dashoffset" from="742" to="0" dur="6s" repeatCount="indefinite"/>
    </circle>
    <circle cx="${cx}" cy="${cy}" r="52" fill="${C.navy}" stroke="${C.cyan}" stroke-width="1.4"/>
    <text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="22" font-weight="600" fill="${C.cyan}">AI</text>
    <text x="${cx}" y="${cy + 17}" text-anchor="middle" class="m" font-size="7.5" letter-spacing=".6" fill="${C.muted}">TRANSFORMATION</text>
    ${labels}
    <rect x="64" y="70" width="4" height="22" fill="${C.cyan}"/>
    <text x="80" y="87" class="m" font-size="15" letter-spacing="4" fill="${C.cyan}">${esc(P.kicker)}</text>
    <text x="64" y="168" font-size="58" font-weight="650" letter-spacing="-1.8" fill="${C.white}">${esc(P.name.split(' ').slice(0, 2).join(' '))}</text>
    <text x="64" y="232" font-size="58" font-weight="650" letter-spacing="-1.8" fill="${C.white}">${esc(P.name.split(' ').slice(2).join(' '))}</text>
    <text x="64" y="290" font-size="24" font-weight="500" letter-spacing="-0.3" fill="${C.white}">${esc(P.title)}</text>
    <text x="64" y="326" font-size="19" fill="${C.muted}">${esc(P.tagline)}</text>
    <g transform="translate(64 360)">
      <rect width="${(P.location.length + 10) * 8 + 52}" height="34" rx="17" fill="${C.panel}" stroke="${C.line}"/>
      <circle cx="20" cy="17" r="4" fill="${C.cyan}"><animate attributeName="opacity" values="1;.3;1" dur="2.4s" repeatCount="indefinite"/></circle>
      <text x="34" y="22" class="m" font-size="13" fill="${C.white}">${esc(P.location)} · ES / EN</text>
    </g>
  </g>`;
  write('hero.svg', svg(W, H, body, `${P.name}. ${P.title}. ${P.tagline}`));
}

// ---------- Cabeceras de sección ----------
function section(key, n, label) {
  const W = 1280, H = 72;
  const body = `<text x="0" y="46" class="m" font-size="16" fill="${C.cyan}">${n}</text>
  <text x="44" y="46" font-size="28" font-weight="600" letter-spacing="-0.6" fill="${C.cyan}">${esc(label)}</text>
  <line x1="${44 + Math.round(label.length * 15.2) + 24}" y1="38" x2="${W}" y2="38" stroke="${C.slate}" stroke-width="1"/>
  ${diamond(W - 8, 38, 5, C.navy)}`;
  write(`section-${key}.svg`, svg(W, H, body, label));
}

// ---------- Focus areas ----------
function focus() {
  const W = 1280, gap = 14, h = 52, fs = 18;
  let x = 0, y = 0;
  const items = P.focus.filter((f) => !f.startsWith('TODO')).map((f, i) => {
    const w = Math.round(f.length * fs * 0.56) + 64;
    if (x + w > W) { x = 0; y += h + gap; }
    const g = `<g transform="translate(${x} ${y})"><rect x=".5" y=".5" width="${w}" height="${h}" rx="10" fill="${C.navy}" stroke="${C.line}"/>
      <text x="20" y="32" class="m" font-size="13" fill="${C.cyan}">${String(i + 1).padStart(2, '0')}</text>
      <text x="48" y="33" font-size="${fs}" font-weight="500" fill="${C.white}">${esc(f)}</text></g>`;
    x += w + gap;
    return g;
  }).join('');
  write('focus.svg', svg(W, y + h + 2, items, 'Focus areas: ' + P.focus.join(', ')));
}

// ---------- Tarjetas de servicio ----------
// Ilustraciones de líneas que se dibujan en bucle (una por servicio). Caja de 150 x 96.
const draw = (d, delay = 0, dur = 2.4, extra = '') => {
  const len = 420;
  return `<path d="${d}" fill="none" stroke="${C.cyan}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${len}" stroke-dashoffset="${len}" ${extra}>
    <animate attributeName="stroke-dashoffset" values="${len};0;0;${len}" keyTimes="0;.35;.85;1" dur="7s" begin="${delay}s" repeatCount="indefinite"/></path>`;
};
const dot = (x, y, delay, r = 3.2) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.navy}" stroke="${C.cyan}" stroke-width="1.4" opacity="0">
  <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;${delay};${delay + 0.05};.85;1" dur="7s" repeatCount="indefinite"/></circle>`;
const ghost = (d) => `<path d="${d}" fill="none" stroke="${C.line}" stroke-width="1"/>`;
const ICON = {
  assess: () => ghost('M8 88H146M8 88V6') + [20, 44, 68, 92, 116].map((x, i) => ghost(`M${x + 10} 88V${88 - [26, 40, 34, 58, 72][i]}`)).join('')
    + draw('M18 70L42 54L66 60L90 34L118 20L140 12') + dot(18, 70, .08) + dot(42, 54, .13) + dot(66, 60, .18) + dot(90, 34, .23) + dot(118, 20, .28) + dot(140, 12, .33, 4),
  architect: () => [0, 26, 52].map((o, i) => draw(`M75 ${14 + o}L135 ${30 + o}L75 ${46 + o}L15 ${30 + o}Z`, 0, 2.4, `opacity="${1 - i * 0.25}"`)).join('')
    + ghost('M15 30V82M135 30V82M75 46V98') + dot(75, 14, .1) + dot(135, 56, .2) + dot(15, 82, .3),
  govern: () => ghost('M75 4L132 22V50C132 74 106 90 75 96C44 90 18 74 18 50V22Z')
    + draw('M75 4L132 22V50C132 74 106 90 75 96C44 90 18 74 18 50V22Z') + draw('M50 50L68 66L102 34') + dot(102, 34, .3, 4),
  dashboards: () => ghost('M6 6H146V92H6ZM6 26H146') + [16, 34, 52].map((x, i) => ghost(`M${x} 84V${84 - [22, 36, 28][i]}`)).join('')
    + draw('M14 84V62M32 84V48M50 84V56', 0) + draw('M72 74L92 58L110 64L138 36', .2) + dot(138, 36, .32, 3.6) + `<circle cx="16" cy="16" r="3" fill="${C.cyan}"/>`,
  apps: () => ghost('M6 6H146V92H6ZM6 22H146') + `<circle cx="16" cy="14" r="2.5" fill="${C.slate}"/><circle cx="26" cy="14" r="2.5" fill="${C.slate}"/><circle cx="36" cy="14" r="2.5" fill="${C.cyan}"/>`
    + draw('M18 34H70V60H18Z') + draw('M82 34H134M82 46H122M82 58H128', .2) + draw('M18 72H134', .4) + dot(134, 72, .32),
  training: () => ghost('M10 86H144') + draw('M14 80L50 62L84 50L118 30L142 14') + dot(14, 80, .06) + dot(50, 62, .14) + dot(84, 50, .22) + dot(118, 30, .3) + dot(142, 14, .38, 4.4)
    + `<text x="14" y="98" class="m" font-size="9" fill="${C.muted}">EXEC</text><text x="70" y="98" class="m" font-size="9" fill="${C.muted}">PRO</text><text x="118" y="98" class="m" font-size="9" fill="${C.muted}">TECH</text>`,
};
function card(s) {
  const W = 620, H = 250;
  const ph = P.phases[s.phase];
  const tag = s.agent ? `<g transform="translate(32 70)">${diamond(5, -4, 4.5)}<text x="16" y="0" class="m" font-size="11.5" letter-spacing="1.4" fill="${C.cyan}">AGENT-POWERED</text></g>` : '';
  const body = `
  <defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.panel}"/><stop offset="1" stop-color="${C.ink}"/></linearGradient>
  <pattern id="cgrid" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="${C.line}"/></pattern></defs>
  <rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="16" fill="url(#cg)" stroke="${C.line}" stroke-width="1.5"/>
  <rect x="${W - 196}" y="18" width="178" height="118" rx="10" fill="url(#cgrid)" opacity=".8"/>
  <path d="M1 60V17A16 16 0 0 1 17 1H70" fill="none" stroke="${C.cyan}" stroke-width="2"/>
  <text x="32" y="50" class="m" font-size="13" letter-spacing="2" fill="${C.cyan}">${ph.n} · ${ph.en.toUpperCase()}</text>
  ${tag}
  <g transform="translate(${W - 182} 28)">${(ICON[s.icon] || (() => ''))()}</g>
  <text x="32" y="168" font-size="34" font-weight="600" letter-spacing="-1" fill="${C.white}">${esc(s.title)}</text>
  <text x="32" y="200" font-size="17" fill="${C.muted}">${esc(s.line)}</text>
  <text x="32" y="232" font-size="14" font-weight="600" letter-spacing=".5" fill="${C.cyan}">View service  →</text>`;
  write(`service-${s.id}.svg`, svg(W, H, body, `${s.title}. ${s.line}`));
}

// ---------- Matriz de servicios ----------
function matrix() {
  const W = 1280, H = 560, L = 150, T = 50, PW = 980, PH = 430;
  const X = (v) => L + v * PW, Y = (v) => T + (1 - v) * PH;
  const order = ['assess', 'architect', 'govern', 'scale'];
  const svcs = [...P.services].sort((a, b) => order.indexOf(a.phase) - order.indexOf(b.phase) || a.map.x - b.map.x);
  const path = svcs.map((s, i) => `${i ? 'L' : 'M'}${X(s.map.x).toFixed(0)} ${Y(s.map.y).toFixed(0)}`).join('');
  const grid = [1, 2, 3].map((i) => `<line x1="${L + (PW * i) / 4}" y1="${T}" x2="${L + (PW * i) / 4}" y2="${T + PH}" stroke="${C.line}" stroke-dasharray="2 6"/>`
    + `<line x1="${L}" y1="${T + (PH * i) / 4}" x2="${L + PW}" y2="${T + (PH * i) / 4}" stroke="${C.line}" stroke-dasharray="2 6"/>`).join('');
  const quads = [['STRATEGY · ASSESS', L + 14, T + PH - 14, 'start'], ['DELIVERY · ASSESS', L + PW - 14, T + PH - 14, 'end'], ['STRATEGY · SCALE', L + 14, T + 24, 'start'], ['DELIVERY · SCALE', L + PW - 14, T + 24, 'end']]
    .map(([t, x, y, a]) => `<text x="${x}" y="${y}" text-anchor="${a}" class="m" font-size="11" letter-spacing="2" fill="${C.slate}">${t}</text>`).join('');
  const ticks = order.map((k, i) => `<text x="${L - 18}" y="${Y((i + 0.5) / 4) + 4}" text-anchor="end" class="m" font-size="12" letter-spacing="1.5" fill="${C.muted}">${P.phases[k].n} ${P.phases[k].en.toUpperCase()}</text>`).join('');
  const pts = svcs.map((s, i) => {
    const x = X(s.map.x), y = Y(s.map.y), b = (0.6 + i * 0.45).toFixed(2);
    const right = s.map.x < 0.72, tx = right ? x + 18 : x - 18, anchor = right ? 'start' : 'end';
    return `<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${b}s" dur=".5s" fill="freeze"/>
      <circle cx="${x}" cy="${y}" r="22" fill="${C.cyan}" opacity="0"><animate attributeName="r" values="8;26" dur="2.8s" begin="${b}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".45;0" dur="2.8s" begin="${b}s" repeatCount="indefinite"/></circle>
      <circle cx="${x}" cy="${y}" r="${s.agent ? 9 : 7}" fill="${s.agent ? C.cyan : C.navy}" stroke="${C.cyan}" stroke-width="2"/>
      <text x="${tx}" y="${y - 2}" text-anchor="${anchor}" font-size="17" font-weight="600" fill="${C.white}">${esc(s.title)}</text>
      <text x="${tx}" y="${y + 17}" text-anchor="${anchor}" class="m" font-size="11" letter-spacing="1.2" fill="${C.cyan}">${P.phases[s.phase].n} · ${P.phases[s.phase].en.toUpperCase()}${s.agent ? ' · ◇ AGENTS' : ''}</text></g>`;
  }).join('');
  const body = `
  <defs><linearGradient id="mbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.ink}"/><stop offset="1" stop-color="${C.navy}"/></linearGradient>
  <marker id="ma" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0L10 5L0 10z" fill="${C.slate}"/></marker></defs>
  <rect width="${W}" height="${H}" rx="18" fill="url(#mbg)"/>
  <rect x="${L}" y="${T}" width="${PW}" height="${PH}" fill="none" stroke="${C.line}"/>
  ${grid}${ticks}
  <line x1="${L}" y1="${T + PH + 30}" x2="${L + PW}" y2="${T + PH + 30}" stroke="${C.slate}" stroke-width="1.2" marker-end="url(#ma)"/>
  <text x="${L}" y="${T + PH + 52}" class="m" font-size="12" letter-spacing="2" fill="${C.muted}">STRATEGY</text>
  <text x="${L + PW}" y="${T + PH + 52}" text-anchor="end" class="m" font-size="12" letter-spacing="2" fill="${C.muted}">DELIVERY</text>
  <path d="${path}" fill="none" stroke="${C.cyan}" stroke-width="1.6" stroke-dasharray="6 8" opacity=".55" pathLength="1000" stroke-dashoffset="1000">
    <animate attributeName="stroke-dashoffset" from="1000" to="0" begin=".4s" dur="3.4s" fill="freeze"/></path>
  ${pts}
  <g transform="translate(${L + PW - 210} ${T + PH + 76})"><circle cx="6" cy="-4" r="6" fill="${C.cyan}"/><text x="18" y="0" class="m" font-size="11" fill="${C.muted}">AGENT-POWERED</text>
  <circle cx="140" cy="-4" r="5" fill="${C.navy}" stroke="${C.cyan}" stroke-width="2"/><text x="152" y="0" class="m" font-size="11" fill="${C.muted}">EXPERT</text></g>`;
  write('services-map.svg', svg(W, H + 30, body, 'Services map: ' + svcs.map((s) => `${s.title} (${P.phases[s.phase].en})`).join(', ')));
}

// ---------- Insignias sociales (propias, en la paleta) ----------
const ICONS = JSON.parse(fs.readFileSync(path.join(dir, 'icons.json'), 'utf8'));
ICONS.email = 'M2 5h20v14H2zM2 5l10 8 10-8';
ICONS.linkedin = 'M3 3h18v18H3zM7 10v7M7 7v.01M11 17v-7M11 13a3 3 0 0 1 6 0v4';
ICONS.catalog = 'M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z';
function badge(id, label) {
  const H = 40, w = Math.round(label.length * 9.6) + 66;
  const stroke = ['email', 'catalog', 'linkedin'].includes(id);
  const icon = `<g transform="translate(16 11) scale(.75)"><path d="${ICONS[id]}" ${stroke ? `fill="none" stroke="${C.cyan}" stroke-width="2" stroke-linejoin="round"` : `fill="${C.cyan}"`}/></g>`;
  const body = `<rect x=".75" y=".75" width="${w - 1.5}" height="${H - 1.5}" rx="8" fill="${C.navy}" stroke="${C.line}" stroke-width="1.5"/>${icon}
  <text x="46" y="25.5" class="m" font-size="13" font-weight="500" letter-spacing="1.6" fill="${C.white}">${esc(label.toUpperCase())}</text>`;
  write(`badge-${id}.svg`, svg(w, H, body, label));
  return `badge-${id}.svg`;
}

// ---------- README ----------
function readme() {
  const link = (id, label, url) => `<a href="${url}"><img src="assets/${badge(id, label)}" height="40" alt="${label}"/></a>`;
  const social = P.social.filter((s) => s.url && s.url !== 'TODO').map((s) => link(s.logo, s.label, s.url));
  social.push(link('email', 'Email', `mailto:${P.email}`), link('catalog', 'Services', P.catalog));
  const svc = P.services.map((s) => `<a href="${P.catalog}en/services/${s.id}/"><img src="assets/service-${s.id}.svg" width="49%" alt="${esc(s.title)}"/></a>`);
  const rows = [];
  for (let i = 0; i < svc.length; i += 2) rows.push(`<p>\n  ${svc[i]}\n  ${svc[i + 1] || ''}\n</p>`);
  const md = `<!-- README generado por assets/build.mjs a partir de assets/profile.json. Edita el JSON y vuelve a generar. -->
<a href="${P.catalog}"><img src="assets/hero.svg" width="100%" alt="${esc(P.name)}. ${esc(P.title)}"/></a>

<p align="center">
  ${social.join('\n  ')}
</p>

<img src="assets/section-about.svg" width="100%" alt="About"/>

${P.about}

<img src="assets/section-focus.svg" width="100%" alt="Focus areas"/>

<img src="assets/focus.svg" width="100%" alt="${esc(P.focus.filter((f) => !f.startsWith('TODO')).join(' · '))}"/>

<img src="assets/section-services.svg" width="100%" alt="Services"/>

Freelance services, each tied to one phase of the cycle: **Assess → Architect → Govern → Scale**. Pricing is tailored to scope.

<img src="assets/services-map.svg" width="100%" alt="Services map: where each service sits between strategy and delivery, and across the Assess, Architect, Govern and Scale phases"/>

${rows.join('\n\n')}

<p align="center">
  <a href="${P.catalog}en/">Full catalog (EN)</a> · <a href="${P.catalog}es/">Catálogo en español</a> · <a href="${P.catalog}en/demo/ai-maturity-report/">Sample agent report</a>
</p>

<img src="assets/section-contact.svg" width="100%" alt="Contact"/>

<p align="center">
  <a href="mailto:${P.email}"><strong>${P.email}</strong></a>
</p>
`;
  fs.writeFileSync(path.join(root, 'README.md'), md);
}

hero();
section('about', '01', 'About');
section('focus', '02', 'Focus areas');
section('services', '03', 'Services');
section('contact', '04', 'Contact');
focus();
P.services.forEach(card);
matrix();
readme();
console.log('OK: README.md y assets/*.svg generados');
