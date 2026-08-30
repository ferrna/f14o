import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DUR, EASE, REVEAL, STAGGER } from './lib/tokens';
import { prefersReducedMotion } from './lib/prefs';

gsap.registerPlugin(ScrollTrigger);

/**
 * Todo lo que entra lo hace con un desplazamiento corto y sin escala: el
 * movimiento tiene que leerse como peso, no como efecto. Los reveals se
 * disparan una sola vez y nunca quedan atados al scroll, porque encadenar
 * la lectura al gesto de scrollear la vuelve incómoda.
 */
export function initReveals(scope: ParentNode = document): void {
  const reduced = prefersReducedMotion();

  scope.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (reduced) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const delay = Number(el.dataset.revealDelay ?? 0);

    gsap.fromTo(
      el,
      { opacity: 0, y: REVEAL.shift },
      {
        opacity: 1,
        y: 0,
        delay,
        duration: REVEAL.dur,
        ease: EASE.outSoft,
        scrollTrigger: { trigger: el, start: REVEAL.trigger, once: true },
      }
    );
  });

  // Grupos con hijos escalonados: la cascada es lo que da la sensación de
  // que la página se arma sola en lugar de aparecer de golpe.
  scope.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>('[data-reveal-item]');
    if (!items.length) return;

    if (reduced) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    const step = group.dataset.revealGroup === 'blocks' ? STAGGER.blocks : STAGGER.rows;

    gsap.fromTo(
      items,
      { opacity: 0, y: REVEAL.shift },
      {
        opacity: 1,
        y: 0,
        duration: REVEAL.dur,
        ease: EASE.outSoft,
        stagger: step,
        scrollTrigger: { trigger: group, start: REVEAL.trigger, once: true },
      }
    );
  });

  // Las reglas finas se dibujan de izquierda a derecha. Son el detalle que
  // más contribuye a que la página parezca construirse.
  scope.querySelectorAll<HTMLElement>('[data-rule]').forEach((rule) => {
    if (reduced) {
      gsap.set(rule, { scaleX: 1 });
      return;
    }

    gsap.fromTo(
      rule,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: REVEAL.ruleDraw,
        ease: EASE.outSoft,
        scrollTrigger: { trigger: rule, start: REVEAL.trigger, once: true },
      }
    );
  });
}

/**
 * Único elemento atado al scroll: la escultura del hero sube, se achica y se
 * desvanece mientras salís de la primera pantalla.
 */
export function initHeroScrub(): void {
  if (prefersReducedMotion()) return;
  // El gate del home se queda con el hero: un scrub acá pelearía con el pin.
  if (document.querySelector('[data-work-gate]')) return;

  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const sculpture = document.querySelector<HTMLElement>('[data-hero-sculpture]');
  if (!hero || !sculpture) return;

  gsap.to(sculpture, {
    y: -80,
    scale: 0.86,
    opacity: 0,
    ease: EASE.linear,
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
}

/** Contador numérico: el único número animado de todo el sitio. */
export function initCounters(scope: ParentNode = document): void {
  scope.querySelectorAll<HTMLElement>('[data-count-to]').forEach((el) => {
    const target = Number(el.dataset.countTo ?? 0);
    if (Number.isNaN(target)) return;

    if (prefersReducedMotion()) {
      el.textContent = String(target);
      return;
    }

    const proxy = { value: 0 };
    gsap.to(proxy, {
      value: target,
      duration: DUR.long - 0.1,
      ease: EASE.outSoft,
      onUpdate: () => {
        el.textContent = String(Math.round(proxy.value));
      },
      scrollTrigger: { trigger: el, start: REVEAL.trigger, once: true },
    });
  });
}
