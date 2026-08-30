import type { Lang } from './config';

/**
 * Todo el texto de interfaz vive acá. El español no es una traducción
 * literal del inglés: donde la versión literal sonaba acartonada se eligió
 * la frase que un hispanohablante escribiría desde cero.
 */
const en = {
  nav: {
    work: 'Work',
    about: 'About',
    contact: 'Contact',
    home: 'Fernando Arriondo — home',
    menu: 'Menu',
    skip: 'Skip to content',
  },
  intro: {
    hello: [
      "Hello, I'm Fernando! A freelance",
      'full stack developer based',
      'in Buenos Aires.',
    ],
  },
  hero: {
    availability: 'Available for work',
    role: 'Full Stack Developer',
    scroll: 'Scroll',
    telemetry: ['Uptime 99.98%', 'Latency 42ms', 'Last deploy 2h ago'],
    build: 'Build passing',
    edition: 'Portfolio',
    year: '2026',
  },
  work: {
    kicker: 'Selected work',
    count: 'projects',
    hint: 'Scroll · Click to open case',
  },
  stack: {
    kicker: 'Stack',
  },
  experience: {
    kicker: 'Experience',
  },
  contact: {
    kicker: 'Contact',
    copy: 'Copy',
    copied: 'Copied',
  },
  footer: {
    city: 'Buenos Aires',
    build: 'Build passing',
  },
  cursor: {
    view: 'View',
    drag: 'Drag',
  },
  about: {
    kicker: 'About',
    headline: ['I build software', 'that holds up.'],
    prose: [
      'I design and engineer web products end to end, from the first interface sketch to the systems that hold state, motion and data. I care about the quiet details: how something loads, how it answers, how it stays clear once it gets complex.',
      'No handoff in the middle. That is usually where products lose the thread, and it is the part I like most.',
    ],
    caption: 'Fig. 00 — The worm',
    facts: {
      based: 'Based',
      experience: 'Experience',
      focus: 'Focus',
    },
    location: 'Buenos Aires',
    years: ' years',
    focus: 'Web platforms',
    cta: 'Get in touch',
    foot: 'Currently reading source code · Open to selected projects',
  },
  case: {
    back: '← Index',
    brief: 'The brief',
    role: 'Role',
    year: 'Year',
    stack: 'Stack',
    live: 'Visit live site',
    next: 'Next project',
  },
  lost: {
    line: 'This route does not exist.',
    aside: 'The worm looked. It is not here.',
    back: 'Back to index',
    terminal: 'no matching route',
  },
  route: {
    home: 'Home',
    about: 'About',
    lost: 'Not found',
  },
  meta: {
    homeTitle: 'Fernando Arriondo — Full Stack Developer',
    homeDescription:
      'Full stack developer building web platforms with a focus on clarity, performance and long-term maintainability.',
    aboutTitle: 'About — Fernando Arriondo',
    aboutDescription:
      'Full stack developer working end to end, from interface to the systems that hold state and data.',
    lostTitle: '404 — Fernando Arriondo',
    lostDescription: 'This route does not exist.',
  },
};

const es: typeof en = {
  nav: {
    work: 'Proyectos',
    about: 'Sobre mí',
    contact: 'Contacto',
    home: 'Fernando Arriondo — inicio',
    menu: 'Menú',
    skip: 'Ir al contenido',
  },
  intro: {
    hello: [
      'Hola, soy Fernando. Desarrollador',
      'full stack freelance',
      'en Buenos Aires.',
    ],
  },
  hero: {
    availability: 'Disponible para trabajar',
    role: 'Desarrollador Full Stack',
    scroll: 'Scroll',
    telemetry: ['Uptime 99.98%', 'Latencia 42ms', 'Último deploy hace 2h'],
    build: 'Build en verde',
    edition: 'Portfolio',
    year: '2026',
  },
  work: {
    kicker: 'Trabajo seleccionado',
    count: 'proyectos',
    hint: 'Scroll · Clic para abrir el caso',
  },
  stack: {
    kicker: 'Stack',
  },
  experience: {
    kicker: 'Experiencia',
  },
  contact: {
    kicker: 'Contacto',
    copy: 'Copiar',
    copied: 'Copiado',
  },
  footer: {
    city: 'Buenos Aires',
    build: 'Build en verde',
  },
  cursor: {
    view: 'Ver',
    drag: 'Arrastrar',
  },
  about: {
    kicker: 'Sobre mí',
    headline: ['Construyo software', 'que se sostiene.'],
    prose: [
      'Diseño y desarrollo productos web de punta a punta, desde el primer boceto de interfaz hasta los sistemas que sostienen estado, movimiento y datos. Me importan los detalles callados: cómo carga algo, cómo responde, cómo sigue siendo claro cuando se vuelve complejo.',
      'Sin traspaso en el medio. Ahí es donde los productos suelen perder el hilo, y es la parte que más me gusta.',
    ],
    caption: 'Fig. 00 — El gusano',
    facts: {
      based: 'Base',
      experience: 'Experiencia',
      focus: 'Enfoque',
    },
    location: 'Buenos Aires',
    years: ' años',
    focus: 'Plataformas web',
    cta: 'Escribime',
    foot: 'Leyendo código fuente · Abierto a proyectos seleccionados',
  },
  case: {
    back: '← Índice',
    brief: 'El encargo',
    role: 'Rol',
    year: 'Año',
    stack: 'Stack',
    live: 'Ver el sitio',
    next: 'Siguiente proyecto',
  },
  lost: {
    line: 'Esta ruta no existe.',
    aside: 'El gusano buscó. Acá no está.',
    back: 'Volver al inicio',
    terminal: 'ninguna ruta coincide',
  },
  route: {
    home: 'Inicio',
    about: 'Sobre mí',
    lost: 'No encontrado',
  },
  meta: {
    homeTitle: 'Fernando Arriondo — Desarrollador Full Stack',
    homeDescription:
      'Desarrollador full stack que construye plataformas web con foco en claridad, rendimiento y mantenimiento a largo plazo.',
    aboutTitle: 'Sobre mí — Fernando Arriondo',
    aboutDescription:
      'Desarrollador full stack que trabaja de punta a punta, de la interfaz a los sistemas que sostienen estado y datos.',
    lostTitle: '404 — Fernando Arriondo',
    lostDescription: 'Esta ruta no existe.',
  },
};

export type Copy = typeof en;

const dictionary: Record<Lang, Copy> = { en, es };

export function useCopy(lang: Lang): Copy {
  return dictionary[lang];
}
