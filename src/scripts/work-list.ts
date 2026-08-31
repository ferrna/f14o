import { gsap } from 'gsap';
import { EASE, REVEAL, STAGGER } from './lib/tokens';
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
  if (!list) return;

  const rows = Array.from(list.querySelectorAll<HTMLElement>('[data-work-row]'));
  if (!rows.length) return;

  enterRows(rows);

  if (!hasFinePointer() || prefersReducedMotion()) return;

  let active: HTMLElement | null = null;

  rows.forEach((row) => {
    const shots = ensureShots(row);
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

/** El pool no vive en el HTML: 24 <img> en el home mataban el LCP mobile. */
function ensureShots(row: HTMLElement): HTMLElement[] {
  const existing = Array.from(row.querySelectorAll<HTMLElement>('[data-work-shot]'));
  if (existing.length) return existing;

  const trail = row.querySelector<HTMLElement>('[data-work-trail]');
  const srcs = trail?.dataset.srcs?.split('|').filter(Boolean) ?? [];
  if (!trail || !srcs.length) return [];

  return Array.from({ length: 8 }, (_, i) => {
    const shot = document.createElement('div');
    shot.className = 'work__shot';
    shot.dataset.workShot = '';

    const src = srcs[i % srcs.length] ?? '';

    const img = document.createElement('img');
    img.className = 'work__shot-img';
    img.src = src;
    img.alt = '';
    img.decoding = 'async';

    const bg = document.createElement('img');
    bg.className = 'work__shot-bg';
    bg.src = src;
    bg.alt = '';
    bg.decoding = 'async';

    shot.append(bg, img);
    trail.appendChild(shot);
    return shot;
  });
}

/**
 * Las filas entran una vez: abajo más apagadas y con la línea corta.
 * El transform va en el título y la regla, nunca en [data-work-row].
 */
function enterRows(rows: HTMLElement[]): void {
  const leads = rows.map((row) => row.querySelector<HTMLElement>('.work__lead'));
  const rules = rows.map((row) => row.querySelector<HTMLElement>('[data-work-rule]'));

  if (prefersReducedMotion()) {
    gsap.set(leads, { opacity: 1 });
    gsap.set(rules, { scaleX: 1 });
    return;
  }

  const last = Math.max(rows.length - 1, 1);
  rows.forEach((_, i) => {
    const dim = 0.82 - (i / last) * 0.55;
    gsap.set(leads[i], { opacity: dim });
    gsap.set(rules[i], { scaleX: 0.72 - (i / last) * 0.52, transformOrigin: 'left center' });
  });

  const trigger = rows[0]?.closest('section') ?? rows[0];

  gsap
    .timeline({
      scrollTrigger: { trigger, start: REVEAL.trigger, once: true },
    })
    .to(leads, { opacity: 1, duration: REVEAL.dur, ease: EASE.outSoft, stagger: STAGGER.rows + 0.03 }, 0)
    .to(rules, { scaleX: 1, duration: REVEAL.ruleDraw, ease: EASE.outSoft, stagger: STAGGER.rows + 0.03 }, 0);
}
