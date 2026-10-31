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
  const body = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.ink}"/><stop offset="1" stop-color="${C.navy}"/></linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${C.cyan}" stop-opacity=".22"/><stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/></radialGradient>
    <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="${C.line}"/></pattern>
    <marker id="ar" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="${C.cyan}"/></marker>
    <clipPath id="clip"><rect width="${W}" height="${H}" rx="18"/></clipPath>
  </defs>
  <g clip-path="url(#clip)">
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#dots)" opacity=".55"/>
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
function card(s) {
  const W = 620, H = 210;
  const ph = P.phases[s.phase];
  const tag = s.agent ? `<g transform="translate(${W - 172} 34)"><rect width="148" height="28" rx="14" fill="none" stroke="${C.cyan}" stroke-opacity=".6"/>${diamond(18, 14, 4.5)}<text x="32" y="19" class="m" font-size="11.5" letter-spacing="1" fill="${C.cyan}">AGENT-POWERED</text></g>` : '';
  const body = `
  <defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.panel}"/><stop offset="1" stop-color="${C.ink}"/></linearGradient></defs>
  <rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="16" fill="url(#cg)" stroke="${C.line}" stroke-width="1.5"/>
  <path d="M1 60V17A16 16 0 0 1 17 1H70" fill="none" stroke="${C.cyan}" stroke-width="2"/>
  <text x="32" y="53" class="m" font-size="13" letter-spacing="2" fill="${C.cyan}">${ph.n} · ${ph.en.toUpperCase()}</text>
  ${tag}
  <text x="32" y="112" font-size="34" font-weight="600" letter-spacing="-1" fill="${C.white}">${esc(s.title)}</text>
  <text x="32" y="146" font-size="17" fill="${C.muted}">${esc(s.line)}</text>
  <text x="32" y="184" font-size="14" font-weight="600" letter-spacing=".5" fill="${C.cyan}">View service  →</text>`;
  write(`service-${s.id}.svg`, svg(W, H, body, `${s.title}. ${s.line}`));
}

// ---------- Insignias sociales (propias, en la paleta) ----------
const ICONS = JSON.parse(fs.readFileSync(path.join(dir, 'icons.json'), 'utf8'));
ICONS.email = 'M2 5h20v14H2zM2 5l10 8 10-8';
ICONS.catalog = 'M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z';
function badge(id, label) {
  const H = 40, w = Math.round(label.length * 9.6) + 66;
  const stroke = id === 'email' || id === 'catalog';
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
readme();
console.log('OK: README.md y assets/*.svg generados');
