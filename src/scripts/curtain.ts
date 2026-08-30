import { gsap } from 'gsap';
import { CURTAIN, EASE } from './lib/tokens';
import { prefersReducedMotion } from './lib/prefs';

/**
 * Donde el navegador soporta View Transitions, el morph del elemento
 * compartido resuelve la navegación y la cortina no aparece. La cortina es
 * el fallback universal: barre siempre de abajo hacia arriba y nunca vuelve,
 * para que la navegación tenga una gramática direccional estable.
 */
export function initCurtain(): void {
  const supportsViewTransitions = typeof document.startViewTransition === 'function';
  if (supportsViewTransitions || prefersReducedMotion()) return;

  const curtain = document.querySelector<HTMLElement>('[data-curtain]');
  const panel = curtain?.querySelector<HTMLElement>('.curtain__panel');
  const label = curtain?.querySelector<HTMLElement>('[data-curtain-label]');
  const bar = curtain?.querySelector<HTMLElement>('[data-curtain-bar]');
  if (!curtain || !panel || !label || !bar) return;

  const track = bar.parentElement;

  document.addEventListener('astro:before-preparation', (event) => {
    const nav = event as Event & { loader: () => Promise<void> };
    const original = nav.loader;

    nav.loader = async () => {
      curtain.dataset.active = 'true';
      label.textContent = readRouteLabel(nav);

      const cover = gsap
        .timeline()
        .to(panel, { yPercent: 0, duration: CURTAIN.in, ease: EASE.inOutMat })
        .to([label, track], { opacity: 1, duration: 0.15 }, '-=0.1')
        .fromTo(bar, { scaleX: 0 }, { scaleX: 0.9, duration: CURTAIN.holdMax, ease: EASE.linear }, '<');

      // Si la vista destino ya está lista, la cortina no se detiene: nunca
      // se agrega espera artificial.
      await Promise.all([original(), cover.then()]);
    };
  });

  document.addEventListener('astro:after-swap', () => {
    gsap.set(bar, { scaleX: 1 });

    gsap
      .timeline({
        onComplete: () => {
          curtain.dataset.active = 'false';
          gsap.set(panel, { yPercent: 100 });
          gsap.set([label, track], { opacity: 0 });
        },
      })
      .to([label, track], { opacity: 0, duration: 0.12 })
      .to(panel, { yPercent: -100, duration: CURTAIN.out, ease: EASE.inOutMat }, '<');
  });
}

function readRouteLabel(event: Event): string {
  const to = (event as Event & { to?: URL }).to;
  if (!to) return '';

  const segment = to.pathname.split('/').filter(Boolean).pop() ?? '';
  if (!segment) return 'Home';

  return segment.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}
