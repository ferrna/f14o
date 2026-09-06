import type { Lang } from '../i18n/config';

/**
 * Contenido de las secciones del home que no vive en Markdown. El email y
 * los enlaces no se traducen: son los mismos en los dos idiomas y repetirlos
 * sería una fuente doble de verdad esperando desincronizarse.
 */

export const email = 'arriondovfernando@gmail.com';

/** Content del meta tag de Search Console. Vacío hasta verificar la propiedad. */
export const googleSiteVerification = '';

export const links: Array<{
  label: string;
  href: string;
  newTab?: boolean;
}> = [
  { label: 'GitHub', href: 'https://github.com/ferrna' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/farriondo/' },
  { label: 'CV', href: '/Fernando-Arriondo-CV.pdf', newTab: true },
];

/**
 * El stack no es un inventario: es una frase donde las herramientas son las
 * únicas palabras encendidas. Van entre corchetes para que el texto siga
 * siendo legible en el archivo y el resaltado no dependa de una lista aparte.
 */
export function stackSegments(line: string): Array<{ text: string; tool: boolean }> {
  return line
    .split(/\[([^\]]+)\]/)
    .map((text, i) => ({ text, tool: i % 2 === 1 }))
    .filter((segment) => segment.text !== '');
}

/** Vista índice: las mismas ocho tools, agrupadas por el papel que cumplen. */
export const stackGroups = [
  { id: '01', name: 'Interface', tools: ['React', 'TypeScript', 'Sass'] },
  { id: '02', name: 'Server', tools: ['Node', 'Postgres'] },
  { id: '03', name: 'Motion', tools: ['GSAP'] },
  { id: '04', name: 'Delivery', tools: ['Docker', 'AWS'] },
] as const;

export const primaryTool = 'TypeScript';

const en = {
  stackSentence: [
    '[TypeScript] and [Node] hold the logic.',
    '[Postgres] keeps it honest.',
    '[React] and [Sass] build the surface.',
    '[GSAP] moves it.',
    '[Docker] and [AWS] ship it.',
  ],
  stackStatement: 'Tools chosen for constraints, not for trends.',
  contactHeadline: ['Write when something', 'has to ship.'],
  experience: [
    {
      when: 'Now',
      dates: '2024 — Now (2026)',
      role: 'Full Stack Engineer',
      place: 'Remote — Guatemala',
      company: 'Tribal Worldwide GT',
      body: 'I ship client products end to end at [Tribal Worldwide GT]. Agora, Hacienda, Kino, Barista and Bantrab are that work — when the hard part is making the site agree with payments, inventory or a CMS that already runs the business.',
      current: true,
    },
    {
      when: 'Jun — Sep 2023',
      dates: 'Jun — Sep 2023',
      role: 'Full Stack Developer',
      place: 'Remote',
      company: 'Alkemy',
      body: 'Squad work at [Alkemy]: full stack on a real brief, with review and a delivery date measured in weeks.',
      current: false,
    },
  ],
};

const es: typeof en = {
  stackSentence: [
    '[TypeScript] y [Node] sostienen la lógica.',
    '[Postgres] la mantiene honesta.',
    '[React] y [Sass] construyen la superficie.',
    '[GSAP] la mueve.',
    '[Docker] y [AWS] la ponen en producción.',
  ],
  stackStatement: 'Herramientas elegidas por sus límites, no por su moda.',
  contactHeadline: ['Escribime cuando algo', 'tenga que salir.'],
  experience: [
    {
      when: 'Ahora',
      dates: '2024 — Hoy',
      role: 'Full Stack Engineer',
      place: 'Remoto — Guatemala',
      company: 'Tribal Worldwide GT',
      body: 'Llevo productos de cliente a producción en [Tribal Worldwide GT]. Agora, Hacienda, Kino, Barista y Bantrab son ese trabajo — cuando lo difícil es que el sitio coincida con los pagos, el inventario o un CMS que ya corre la operación.',
      current: true,
    },
    {
      when: 'Jun — Sep 2023',
      dates: 'Jun — Sep 2023',
      role: 'Full Stack Developer',
      place: 'Remoto',
      company: 'Alkemy',
      body: 'Trabajo en squad en [Alkemy]: full stack sobre un brief real, con review y una fecha de entrega medida en semanas.',
      current: false,
    },
  ],
};

const bySite: Record<Lang, typeof en> = { en, es };

export function useSite(lang: Lang): typeof en {
  return bySite[lang];
}
