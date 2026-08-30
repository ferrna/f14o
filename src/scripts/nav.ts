import { routeWithoutLocale } from '../i18n/config';

/**
 * El header vive en el layout: con ClientRouter hay que marcar el activo
 * en cada page-load, no en el HTML estático de la primera vista.
 */
let bound = false;

export function initNav(): void {
  markNav();
  if (bound) return;
  bound = true;
  window.addEventListener('hashchange', markNav);
}

function markNav(): void {
  const current = currentNav();
  document.querySelectorAll<HTMLElement>('[data-nav]').forEach((el) => {
    const on = el.dataset.nav === current;
    el.toggleAttribute('data-current', on);
    if (on) el.setAttribute('aria-current', 'page');
    else el.removeAttribute('aria-current');
  });
}

function currentNav(): 'work' | 'about' | 'contact' {
  const route = routeWithoutLocale(window.location.pathname);
  const hash = window.location.hash;

  if (route.startsWith('/about')) return 'about';
  if (hash === '#contact') return 'contact';
  return 'work';
}
