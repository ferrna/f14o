import { gsap } from 'gsap';
import { EASE } from './lib/tokens';
import { hasFinePointer, prefersReducedMotion } from './lib/prefs';

/** Distancia mínima entre una captura y la siguiente: si no, el rastro se satura. */
const GAP = 88;
/** Tiempo que la captura se sostiene a tamaño pleno antes de encogerse. */
const HOLD = 0.42;
const SHRINK = 0.55;

/**
 * Rastro de capturas al estilo de Federico Pian: cada tramo del puntero
 * deja una foto, y esa foto se encoge sola. No es un thumbnail que sigue
 * al mouse — es un estela que se apaga.
 */
export function initWorkList(): void {
  const list = document.querySelector<HTMLElement>('[data-work-list]');
  if (!list || !hasFinePointer() || prefersReducedMotion()) return;

  const rows = Array.from(list.querySelectorAll<HTMLElement>('[data-work-row]'));
  if (!rows.length) return;

  let active: HTMLElement | null = null;

  rows.forEach((row) => {
    const shots = Array.from(row.querySelectorAll<HTMLElement>('[data-work-shot]'));
    if (!shots.length) return;

    let lastX = 0;
    let lastY = 0;
    let cursor = 0;
    let z = 1;

    const drop = (x: number, y: number): void => {
      const shot = shots[cursor % shots.length];
      if (!shot) return;
      cursor += 1;
      z += 1;

      gsap.killTweensOf(shot);

      const w = shot.offsetWidth;
      const h = shot.offsetHeight;
      const tilt = gsap.utils.random(-9, 9);

      gsap.set(shot, {
        x: x - w / 2,
        y: y - h / 2,
        scale: 0.42,
        rotate: tilt,
        opacity: 1,
        zIndex: z,
      });

      gsap
        .timeline()
        .to(shot, { scale: 1, duration: 0.32, ease: EASE.outSoft })
        .to(shot, { scale: 0.18, opacity: 0, duration: SHRINK, ease: EASE.inOutMat }, HOLD);
    };

    row.addEventListener('pointerenter', (event) => {
      active = row;
      row.dataset.active = 'true';
      list.dataset.hovering = 'true';
      lastX = event.clientX;
      lastY = event.clientY;
      drop(event.clientX, event.clientY);
    });

    row.addEventListener(
      'pointermove',
      (event) => {
        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;
        if (Math.hypot(dx, dy) < GAP) return;

        lastX = event.clientX;
        lastY = event.clientY;
        drop(event.clientX, event.clientY);
      },
      { passive: true },
    );

    row.addEventListener('pointerleave', () => {
      if (active === row) {
        active = null;
        list.dataset.hovering = 'false';
      }
      delete row.dataset.active;
    });
  });
}
