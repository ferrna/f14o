export const LANGS = ['en', 'es'] as const;

export type Lang = (typeof LANGS)[number];

/** El idioma por defecto no lleva prefijo en la URL. */
export const DEFAULT_LANG: Lang = 'en';

/** Etiquetas del selector: el idioma se nombra en su propio idioma. */
export const LANG_LABEL: Record<Lang, string> = {
  en: 'EN',
  es: 'ES',
};

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefijo con el que arrancan todas las rutas de un idioma. */
export function localeRoot(lang: Lang): string {
  return lang === DEFAULT_LANG ? base : `${base}/${lang}`;
}

/** Construye una ruta interna para un idioma: path(lang, '/about'). */
export function path(lang: Lang, to = '/'): string {
  const clean = to === '/' ? '' : to.startsWith('/') ? to : `/${to}`;
  return `${localeRoot(lang)}${clean}` || '/';
}

/**
 * La misma página en el otro idioma. Trabaja sobre el pathname en vez de
 * mandar siempre a la home: cambiar de idioma no debería costar el lugar
 * donde uno estaba leyendo.
 */
export function altPath(lang: Lang, pathname: string): string {
  return path(otherLang(lang), routeWithoutLocale(pathname));
}

export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'es' : 'en';
}

/** Quita base y prefijo de idioma: '/f14o/es/about' → '/about'. */
export function routeWithoutLocale(pathname: string): string {
  let route = pathname;
  if (base && route.startsWith(base)) route = route.slice(base.length);

  for (const lang of LANGS) {
    if (route === `/${lang}`) return '/';
    if (route.startsWith(`/${lang}/`)) return route.slice(lang.length + 1);
  }

  return route || '/';
}
