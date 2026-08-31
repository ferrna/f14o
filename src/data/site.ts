import type { Lang } from '../i18n/config';

/**
 * Contenido de las secciones del home que no vive en Markdown. El email y
 * los enlaces no se traducen: son los mismos en los dos idiomas y repetirlos
 * sería una fuente doble de verdad esperando desincronizarse.
 */

export const email = 'arriondovfernando@gmail.com';

export const links: Array<{
  label: string;
  href: string;
  newTab?: boolean;
}> = [
  { label: 'GitHub', href: 'https://github.com/ferrna' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/farriondo/' },
  { label: 'CV', href: '/Fernando-Arriondo-CV.pdf', newTab: true },
];

/** Las herramientas se nombran igual en todos lados; sólo cambia la frase. */
export const tools = ['React', 'TypeScript', 'Node', 'Postgres', 'GSAP', 'Docker', 'AWS', 'Sass'];

export const primaryTool = 'TypeScript';

const en = {
  stackStatement: 'Tools chosen for constraints, not for trends.',
  contactHeadline: ['Let us build something', 'that actually ships.'],
  experience: [
    {
      dates: '2024 — Now (2026)',
      role: 'Full Stack Engineer',
      company: 'Tribal Worldwide GT',
      body: 'I ship client products end to end — frontend, backend, tests and deploy — when the hard part is making the site agree with payments, inventory or a CMS that already runs the business.',
      current: true,
    },
    {
      dates: '2022 — 2024',
      role: 'Full Stack Developer',
      company: 'E-Commerce & Media Solutions',
      body: 'Modular storefronts, custom checkout paths and headless CMS architectures for international commerce clients.',
      current: false,
    }
  ],
};

const es: typeof en = {
  stackStatement: 'Herramientas elegidas por sus límites, no por su moda.',
  contactHeadline: ['Construyamos algo', 'que llegue a producción.'],
  experience: [
    {
      dates: '2024 — Hoy',
      role: 'Full Stack Engineer',
      company: 'Tribal Worldwide GT',
      body: 'Llevo productos de cliente a producción — frontend, backend, testing y deploy — cuando lo difícil es que el sitio coincida con los pagos, el inventario o un CMS que ya corre la operación.',
      current: true,
    },
    {
      dates: '2022 — 2024',
      role: 'Full Stack Developer',
      company: 'E-Commerce & Media Solutions',
      body: 'Tiendas modulares, checkouts a medida y arquitecturas de CMS headless para clientes de comercio internacional.',
      current: false,
    }
  ],
};

const bySite: Record<Lang, typeof en> = { en, es };

export function useSite(lang: Lang): typeof en {
  return bySite[lang];
}
