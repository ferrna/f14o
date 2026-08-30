import type Lenis from 'lenis';
import { gsap } from 'gsap';
import { hasFinePointer, prefersReducedMotion } from './lib/prefs';

let lenis: Lenis | null = null;

/**
 * Suavizado deliberadamente bajo: alcanza para quitar el salto del scroll
 * nativo sin generar la sensación de arrastre pegajoso que vuelve incómoda
 * la lectura en textos largos. En touch se deja el scroll nativo: Lenis
 * más un ticker a 60fps es el costo más alto del TBT en mobile.
 */
export function initSmoothScroll(): void {
  if (prefersReducedMotion() || !hasFinePointer() || lenis) return;

  void Promise.all([import('lenis'), import('gsap/ScrollTrigger')]).then(
    ([{ default: Lenis }, { ScrollTrigger }]) => {
      if (lenis) return;

      gsap.registerPlugin(ScrollTrigger);
      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, touchMultiplier: 1.6 });
      lenis.on('scroll', ScrollTrigger.update);

      if (document.body.classList.contains('is-intro')) lenis.stop();

      gsap.ticker.add((time) => {
        lenis?.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    },
  );
}

export const getLenis = (): Lenis | null => lenis;

/** Tras navegar, la vista nueva tiene que empezar arriba y sin inercia previa. */
export function resetScroll(): void {
  lenis?.scrollTo(0, { immediate: true });
  lenis?.resize();
}

export function scrollTo(target: string | HTMLElement): void {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.1 });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  el?.scrollIntoView({ behavior: 'auto', block: 'start' });
}
