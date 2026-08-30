import { initCursor } from './cursor';
import { initSmoothScroll, scrollTo } from './scroll';
import { initCounters, initHeroScrub, initReveals } from './reveals';

let booted = false;

/** Punto de entrada único de la capa de motion. */
export function initMotion(): void {
  if (booted) return;
  booted = true;

  initSmoothScroll();
  initCursor();
  initReveals();
  initHeroScrub();
  initCounters();
  bindAnchors();
}

/** Los anclas internas pasan por Lenis para no romper el suavizado. */
function bindAnchors(): void {
  document.addEventListener('click', (event) => {
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]');
    if (!link) return;

    const url = new URL(link.href, window.location.href);
    if (url.pathname !== window.location.pathname || !url.hash) return;

    const target = document.querySelector<HTMLElement>(url.hash);
    if (!target) return;

    event.preventDefault();
    scrollTo(target);
  });
}
