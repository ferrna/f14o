import type { Lang } from '../i18n/config';

/**
 * Contenido de las secciones del home que no vive en Markdown. El email y
 * los enlaces no se traducen: son los mismos en los dos idiomas y repetirlos
 * sería una fuente doble de verdad esperando desincronizarse.
 */

export const email = 'hola@fernandoarriondo.dev';

export const links = [
  { label: 'GitHub', href: 'https://github.com/ferrna' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { label: 'CV', href: '#' },
];

/** Las herramientas se nombran igual en todos lados; sólo cambia la frase. */
export const tools = ['React', 'TypeScript', 'Node', 'Postgres', 'GSAP', 'Docker', 'AWS', 'Sass'];

export const primaryTool = 'TypeScript';

const en = {
  stackStatement: 'Tools chosen for constraints, not for trends.',
  contactHeadline: ['Let us build something', 'that actually ships.'],
  experience: [
    {
      dates: '2023 — Now',
      role: 'Senior Full Stack Engineer',
      company: 'Digital Innovations Studio',
      body: 'End-to-end work on microservice SaaS platforms. Page latency down 45%, tighter queries, the product still easy to feel.',
      current: true,
    },
    {
      dates: '2021 — 2023',
      role: 'Full Stack Developer',
      company: 'E-Commerce & Media Solutions',
      body: 'Modular storefronts, custom checkout paths and headless CMS architectures for international commerce clients.',
      current: false,
    },
    {
      dates: '2019 — 2021',
      role: 'Frontend Developer',
      company: 'Creative Agency Co.',
      body: 'Responsive web apps in Vue and React, with accessibility as a given and performance that holds across browsers.',
      current: false,
    },
  ],
};

const es: typeof en = {
  stackStatement: 'Herramientas elegidas por sus límites, no por su moda.',
  contactHeadline: ['Construyamos algo', 'que llegue a producción.'],
  experience: [
    {
      dates: '2023 — Hoy',
      role: 'Senior Full Stack Engineer',
      company: 'Digital Innovations Studio',
      body: 'Trabajo de punta a punta en plataformas SaaS de microservicios. Latencia de página 45% abajo, consultas más ajustadas, el producto todavía fácil de usar.',
      current: true,
    },
    {
      dates: '2021 — 2023',
      role: 'Full Stack Developer',
      company: 'E-Commerce & Media Solutions',
      body: 'Tiendas modulares, checkouts a medida y arquitecturas de CMS headless para clientes de comercio internacional.',
      current: false,
    },
    {
      dates: '2019 — 2021',
      role: 'Frontend Developer',
      company: 'Creative Agency Co.',
      body: 'Aplicaciones web responsivas en Vue y React, con accesibilidad como punto de partida y rendimiento que se sostiene entre navegadores.',
      current: false,
    },
  ],
};

const bySite: Record<Lang, typeof en> = { en, es };

export function useSite(lang: Lang): typeof en {
  return bySite[lang];
}
