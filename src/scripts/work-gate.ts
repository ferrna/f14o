import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASE } from './lib/tokens';
import { prefersReducedMotion } from './lib/prefs';
import { getLenis } from './scroll';

/** Recorrido corto: el hero no se mueve en vertical, sólo arma el corte. */
const PIN_END = '+=8%';
const FIRE_AT = 0.08;

/**
 * El hero se clava hasta el trigger. Al dispararse se hunde hacia el
 * fondo (perspectiva + escala, sin desplazamiento horizontal) y los
 * proyectos entran con opacidad. Después, el home sigue en vertical.
 */
export function initWorkGate(): void {
  const work = document.querySelector<HTMLElement>('#work');
  const panel = document.querySelector<HTMLElement>('[data-work-gate-panel]');
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!work || !panel || !hero) return;

  // El fade va en el contenido, no en la fila: un transform en
  // [data-work-row] convierte las capturas fixed del rastro en
  // coordenadas locales y las deja fuera de lugar.
  const items = Array.from(
    panel.querySelectorAll<HTMLElement>('.work__head, .work__link, .work__hint'),
  );

  if (prefersReducedMotion() || alreadyAtWork()) {
    gsap.set(items, { clearProps: 'transform,opacity' });
    return;
  }

  gsap.set(hero, { transformPerspective: 1600, transformOrigin: '50% 42%', x: 0, z: 0 });
  gsap.set(items, { y: 22, opacity: 0 });

  let played = false;
  let pin: ScrollTrigger | undefined;

  const play = (): void => {
    if (played) return;
    played = true;
    getLenis()?.stop();

    gsap.set(work, { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 4 });

    const tl = gsap.timeline({
      defaults: { ease: EASE.outSoft },
      onComplete: () => land(hero, work, items, pin),
    });

    // Hacia atrás: se aleja en Z. x queda en 0 a propósito.
    tl.to(
      hero,
      {
        z: -420,
        scale: 0.78,
        opacity: 0,
        filter: 'blur(16px)',
        x: 0,
        duration: 1.45,
        ease: EASE.inOutMat,
      },
      0,
    );

    if (items.length) {
      tl.to(
        items,
        { y: 0, opacity: 1, duration: 1.15, stagger: 0.09, ease: EASE.outSoft },
        0.28,
      );
    }
  };

  pin = ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: PIN_END,
    pin: true,
    pinSpacing: true,
    onUpdate: (self) => {
      if (self.progress >= FIRE_AT) play();
    },
  });

  work.addEventListener('work-gate', play, { once: true });
}

function land(
  hero: HTMLElement,
  work: HTMLElement,
  items: HTMLElement[],
  pin?: ScrollTrigger,
): void {
  pin?.kill();
  gsap.set(hero, { clearProps: 'transform,opacity,filter' });
  gsap.set(work, { clearProps: 'position,top,left,right,zIndex' });
  gsap.set(items, { clearProps: 'transform,opacity' });
  ScrollTrigger.refresh();

  const y = Math.round(work.offsetTop);
  window.scrollTo(0, y);
  getLenis()?.scrollTo(y, { immediate: true });
  getLenis()?.start();
}

function alreadyAtWork(): boolean {
  return window.location.hash === '#work';
}

export function releaseWorkGate(): void {
  document.querySelector('#work')?.dispatchEvent(new Event('work-gate'));
}
