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
      "Hello, I'm Fernando. A software",
      'engineer based in Santa Fe,',
      'remote with Tribal Worldwide GT.',
    ],
  },
  hero: {
    availability: 'Available for work',
    role: 'Full Stack Engineer',
    scroll: 'Scroll',
    facts: ['Santa Fe', 'Remote with Tribal Worldwide GT'],
    edition: 'Portfolio',
    year: '2026',
  },
  work: {
    kicker: 'Selected work',
    count: 'projects',
    hint: 'Click a case to open it',
  },
  stack: {
    kicker: 'Stack',
    viewProse: 'Phrase',
    viewIndex: 'Index',
    switchToIndex: 'Show as index',
    switchToProse: 'Show as phrase',
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
    city: 'Santa Fe',
    note: 'Open to selected work',
  },
  cursor: {
    view: 'View',
    drag: 'Drag',
  },
  about: {
    kicker: 'About',
    headline: ['I ship the product', 'through to deploy.'],
    prose: [
      'I build web products end to end: frontend, backend, tests and deploy. The hard part is usually making the site agree with payments, inventory or a CMS that already runs the business.',
      'No handoff in the middle. That is where products lose the thread, and it is the part I like most.',
    ],
    caption: 'Fig. 00 — The worm · WebGL · 60fps',
    facts: {
      based: 'Based',
      experience: 'Experience',
      focus: 'Focus',
    },
    location: 'Santa Fe',
    years: ' years',
    focus: 'Web platforms',
    cta: 'Get in touch',
    foot: 'Currently reading source code · Open to selected projects',
    plate: {
      caption: 'Fig. 01 — Portrait',
      alt: 'Fernando Arriondo, portrait.',
      lines: [
        'Santa Fe. Remote with Tribal Worldwide GT.',
        'Frontend, backend, tests and deploy.',
        'The site has to match the operation.',
      ],
    },
  },
  case: {
    back: '← All work',
    brief: 'The brief',
    role: 'Role',
    duration: 'Duration',
    year: 'Year',
    stack: 'Stack',
    live: 'Visit live site',
    next: 'Next',
    status: 'Status',
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
    lab: 'Lab',
    lost: 'Not found',
  },
  meta: {
    homeTitle: 'Fernando Arriondo — Software Engineer',
    homeDescription:
      'Software engineer in Santa Fe, remote with Tribal Worldwide GT. I ship client products end to end — frontend, backend, tests and deploy.',
    aboutTitle: 'About — Fernando Arriondo',
    aboutDescription:
      'Santa Fe. Remote with Tribal Worldwide GT. Frontend, backend, tests and deploy.',
    lostTitle: '404 — Fernando Arriondo',
    lostDescription: 'This route does not exist.',
    labTitle: 'Lab — Fernando Arriondo',
    labDescription: 'Sandbox for a 3D deck prototype.',
  },
  lab: {
    kicker: 'Sandbox',
    hint: 'Drag to move between plates.',
    figures: ['Shipment tracking', 'Route optimization', 'Analytics'],
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
      'en Santa Fe, remoto',
      'con Tribal Worldwide GT.',
    ],
  },
  hero: {
    availability: 'Disponible para trabajar',
    role: 'Full Stack Engineer',
    scroll: 'Scroll',
    facts: ['Santa Fe', 'Remoto con Tribal Worldwide GT'],
    edition: 'Portfolio',
    year: '2026',
  },
  work: {
    kicker: 'Trabajo seleccionado',
    count: 'proyectos',
    hint: 'Clic en un caso para abrirlo',
  },
  stack: {
    kicker: 'Stack',
    viewProse: 'Frase',
    viewIndex: 'Índice',
    switchToIndex: 'Ver como índice',
    switchToProse: 'Ver como frase',
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
    city: 'Santa Fe',
    note: 'Abierto a proyectos seleccionados',
  },
  cursor: {
    view: 'Ver',
    drag: 'Arrastrar',
  },
  about: {
    kicker: 'Sobre mí',
    headline: ['Llevo el producto', 'hasta el deploy.'],
    prose: [
      'Armo productos web de punta a punta: frontend, backend, testing y deploy. Lo difícil suele ser que el sitio coincida con los pagos, el inventario o un CMS que ya corre la operación.',
      'Sin traspaso en el medio. Ahí es donde los productos pierden el hilo, y es la parte que más me gusta.',
    ],
    caption: 'Fig. 00 — El gusano · WebGL · 60fps',
    facts: {
      based: 'Base',
      experience: 'Experiencia',
      focus: 'Enfoque',
    },
    location: 'Santa Fe',
    years: ' años',
    focus: 'Plataformas web',
    cta: 'Escribime',
    foot: 'Leyendo código fuente · Abierto a proyectos seleccionados',
    plate: {
      caption: 'Fig. 01 — Retrato',
      alt: 'Fernando Arriondo, retrato.',
      lines: [
        'Santa Fe. Remoto con Tribal Worldwide GT.',
        'Frontend, backend, testing y deploy.',
        'El sitio tiene que coincidir con la operación.',
      ],
    },
  },
  case: {
    back: '← Todos los proyectos',
    brief: 'El encargo',
    role: 'Rol',
    duration: 'Duración',
    year: 'Año',
    stack: 'Stack',
    live: 'Ver el sitio',
    next: 'Siguiente',
    status: 'Estado',
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
    lab: 'Lab',
    lost: 'No encontrado',
  },
  meta: {
    homeTitle: 'Fernando Arriondo — Desarrollador Full Stack',
    homeDescription:
      'Desarrollador en Santa Fe, remoto con Tribal Worldwide GT. Llevo productos de cliente a producción: frontend, backend, testing y deploy.',
    aboutTitle: 'Sobre mí — Fernando Arriondo',
    aboutDescription:
      'Santa Fe. Remoto con Tribal Worldwide GT. Frontend, backend, testing y deploy.',
    lostTitle: '404 — Fernando Arriondo',
    lostDescription: 'Esta ruta no existe.',
    labTitle: 'Lab — Fernando Arriondo',
    labDescription: 'Sandbox para un prototipo de placa 3D.',
  },
  lab: {
    kicker: 'Sandbox',
    hint: 'Arrastrá para pasar de placa.',
    figures: ['Seguimiento de envío', 'Optimización de ruta', 'Analítica'],
  },
};

export type Copy = typeof en;

const dictionary: Record<Lang, Copy> = { en, es };

export function useCopy(lang: Lang): Copy {
  return dictionary[lang];
}
