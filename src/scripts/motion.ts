import { initSmoothScroll, resetScroll, scrollTo } from './scroll';
import { initCurtain } from './curtain';
import { watchCaseEnter, initCaseEnter } from './case-enter';
import { initIntro } from './intro';
import { initMenu } from './menu';
import { initNav } from './nav';
import { hasFinePointer } from './lib/prefs';

let globalsReady = false;

/**
 * Punto de entrada único. Se separa lo que vive mientras dure la sesión
 * (scroll, cursor, cortina) de lo que hay que rearmar en cada vista, porque
 * con ClientRouter el documento persiste entre navegaciones.
 *
 * La intro corre primero: montar ScrollTriggers y módulos de página al
 * mismo tiempo pelea por el hilo principal en mobile.
 */
export function initMotion(): void {
  if (!globalsReady) {
    globalsReady = true;
    initSmoothScroll();
    void bootCursor();
    initCurtain();
    watchCaseEnter();
    bindAnchors();
  }

  initMenu();
  initNav();
  void bootPage();
}

async function bootCursor(): Promise<void> {
  if (!hasFinePointer()) return;
  const { initCursor } = await import('./cursor');
  initCursor();
}

async function bootPage(): Promise<void> {
  initCaseEnter();
  await initIntro();

  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  const { gsap } = await import('gsap');
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  resetScroll();

  const { initCounters, initHeroScrub, initReveals } = await import('./reveals');
  initReveals();
  initHeroScrub();
  initCounters();

  const [{ initCopy }, { initSculpture }, { initClock }] = await Promise.all([
    import('./copy'),
    import('./sculpture'),
    import('./clock'),
  ]);
  initCopy();
  initSculpture();
  initClock();

  if (document.querySelector('[data-work-gate]')) {
    const { initWorkGate } = await import('./work-gate');
    initWorkGate();
  }
  if (document.querySelector('[data-work-list]')) {
    const { initWorkList } = await import('./work-list');
    initWorkList();
  }
  if (document.querySelector('[data-stack-sentence]')) {
    const { initStack } = await import('./stack');
    initStack();
  }
  if (document.querySelector('[data-about-plate]')) {
    const { initAboutPlate } = await import('./about-plate');
    initAboutPlate();
  }
  if (document.querySelector('[data-about]')) {
    const { initAboutEnter } = await import('./about-enter');
    initAboutEnter();
  }
  if (document.querySelector('[data-gallery]')) {
    const { initGallery } = await import('./gallery');
    initGallery();
  }
  if (document.querySelector('[data-deck]')) {
    const { initDeck } = await import('./deck');
    initDeck();
  }

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
    if (url.hash === '#work') {
      document.querySelector('#work')?.dispatchEvent(new Event('work-gate'));
    }
    if (url.hash) {
      history.replaceState(null, '', `${url.pathname}${url.hash}`);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
    scrollTo(target);
  });
}
