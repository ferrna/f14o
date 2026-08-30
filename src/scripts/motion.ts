import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initCursor } from './cursor';
import { initSmoothScroll, resetScroll, scrollTo } from './scroll';
import { initCounters, initHeroScrub, initReveals } from './reveals';
import { initWorkList } from './work-list';
import { initGallery } from './gallery';
import { initCurtain } from './curtain';
import { initCopy } from './copy';
import { initSculpture } from './sculpture';
import { initIntro } from './intro';
import { initMenu } from './menu';

let globalsReady = false;

/**
 * Punto de entrada único. Se separa lo que vive mientras dure la sesión
 * (scroll, cursor, cortina) de lo que hay que rearmar en cada vista, porque
 * con ClientRouter el documento persiste entre navegaciones.
 */
export function initMotion(): void {
  if (!globalsReady) {
    globalsReady = true;
    initSmoothScroll();
    initCursor();
    initCurtain();
    bindAnchors();
  }

  // Los triggers apuntan a nodos que la navegación acaba de reemplazar.
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  resetScroll();

  initMenu();
  void initIntro();
  initReveals();
  initHeroScrub();
  initCounters();
  initWorkList();
  initGallery();
  initCopy();
  initSculpture();

  ScrollTrigger.refresh();
}

/** Las anclas internas pasan por Lenis para no romper el suavizado. */
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
