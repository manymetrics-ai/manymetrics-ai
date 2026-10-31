// Lee content/site.yml (datos generales editables a mano).
import fs from 'node:fs';
import { parse } from 'yaml';

export type Lang = 'es' | 'en';
export const site = parse(fs.readFileSync('content/site.yml', 'utf8'));

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (p: string) => `${base}${p.startsWith('/') ? p : '/' + p}`;

export const serviceUrl = (lang: Lang, id: string) =>
  url(lang === 'es' ? `/es/servicios/${id}/` : `/en/services/${id}/`);
export const demoUrl = (lang: Lang, id: string) => url(`/${lang}/demo/${id}/`);
export const homeUrl = (lang: Lang) => url(`/${lang}/`);

export const phases = {
  assess: { es: 'Evaluar', en: 'Assess', n: '01' },
  architect: { es: 'Diseñar', en: 'Architect', n: '02' },
  govern: { es: 'Gobernar', en: 'Govern', n: '03' },
  scale: { es: 'Escalar', en: 'Scale', n: '04' },
} as const;

export const ui = {
  es: {
    other: 'English', otherLang: 'en' as Lang,
    back: 'Todos los servicios', problem: 'El problema', for_whom: 'Para quién',
    how: 'Cómo trabajo', deliverables: 'Qué recibes', tools: 'Herramientas',
    agent: 'Con agentes de IA', agent_title: 'El papel de los agentes',
    demo: 'Ver demo del entregable', ask: 'Pedir propuesta', more: 'Ver servicio',
    phase: 'Fase', demo_badge: 'Demo · datos ficticios',
    subject: (t: string) => `Consulta: ${t}`,
    footer: 'Catálogo de servicios freelance. Precios a medida según alcance.',
  },
  en: {
    other: 'Español', otherLang: 'es' as Lang,
    back: 'All services', problem: 'The problem', for_whom: 'Who it is for',
    how: 'How I work', deliverables: 'What you get', tools: 'Tools',
    agent: 'Agent-powered', agent_title: 'What the agents do',
    demo: 'See a sample deliverable', ask: 'Request a proposal', more: 'View service',
    phase: 'Phase', demo_badge: 'Demo · fictional data',
    subject: (t: string) => `Enquiry: ${t}`,
    footer: 'Freelance services catalog. Pricing tailored to scope.',
  },
};

export const mailto = (subject: string) =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
