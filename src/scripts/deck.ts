import { gsap } from 'gsap';
import { EASE } from './lib/tokens';
import { prefersReducedMotion } from './lib/prefs';

const STEP = 280;
const DRAG_THRESHOLD = 8;
const FLICK_VELOCITY = 1.1;

/**
 * Placas en coverflow: el arrastre mueve un índice continuo y al soltar
 * se clava con inercia. Sin Draggable: el mismo gesto que la galería.
 */
export function initDeck(): void {
  document.querySelectorAll<HTMLElement>('[data-deck]').forEach(setup);
}

function setup(root: HTMLElement): void {
  const stage = root.querySelector<HTMLElement>('[data-deck-stage]');
  if (!stage) return;

  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-deck-card]'));
  if (!cards.length) return;
  const caption = root.querySelector<HTMLElement>('[data-deck-caption]');
  const counter = root.querySelector<HTMLElement>('[data-deck-counter]');
  const progress = root.querySelector<HTMLElement>('[data-deck-progress]');
  const labels = caption?.dataset.figures?.split('|') ?? [];
  const reduced = prefersReducedMotion();

  let index = 0;
  let pos = 0;
  let dragging = false;
  let startX = 0;
  let startPos = 0;
  let lastX = 0;
  let lastT = 0;
  let velocity = 0;

  const figures = labels.length
    ? labels
    : cards.map((_, i) => `Plate ${String(i + 1).padStart(2, '0')}`);

  const layout = (p: number, immediate = false): void => {
    cards.forEach((card, i) => {
      const d = i - p;
      const ad = Math.abs(d);
      const vars = reduced
        ? { x: 0, rotateY: 0, z: 0, scale: 1, opacity: ad < 0.5 ? 1 : 0, zIndex: ad < 0.5 ? 3 : 0 }
        : {
            x: d * 210,
            rotateY: gsap.utils.clamp(-26, 26, d * 16),
            z: -ad * 140,
            scale: 1 - Math.min(ad, 2) * 0.12,
            opacity: 1 - Math.min(ad, 1.6) * 0.28,
            zIndex: Math.round(8 - ad * 3),
          };

      if (immediate) gsap.set(card, vars);
      else gsap.to(card, { ...vars, duration: 0.7, ease: EASE.outSoft, overwrite: 'auto' });
    });
  };

  const paint = (): void => {
    const human = String(index + 1).padStart(2, '0');
    const total = String(cards.length).padStart(2, '0');
    if (caption) caption.textContent = `Fig. ${human} — ${figures[index] ?? ''}`;
    if (counter) counter.textContent = `${human} / ${total}`;
    if (progress) progress.style.transform = `scaleX(${(index + 1) / cards.length})`;
  };

  const snap = (target: number): void => {
    index = gsap.utils.clamp(0, cards.length - 1, target);
    pos = index;
    paint();
    layout(pos);
  };

  stage.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    dragging = true;
    startX = event.clientX;
    lastX = event.clientX;
    lastT = event.timeStamp;
    startPos = pos;
    velocity = 0;
    stage.dataset.dragging = 'true';
    stage.setPointerCapture(event.pointerId);
    gsap.killTweensOf(cards);
  });

  stage.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const delta = event.clientX - startX;
    pos = startPos - delta / STEP;
    const dt = event.timeStamp - lastT || 16;
    velocity = (event.clientX - lastX) / dt;
    lastX = event.clientX;
    lastT = event.timeStamp;
    layout(pos, true);
  });

  const release = (): void => {
    if (!dragging) return;
    dragging = false;
    delete stage.dataset.dragging;

    const travelled = (startPos - pos) * STEP;
    if (Math.abs(travelled) < DRAG_THRESHOLD) {
      snap(index);
      return;
    }

    const dir = travelled > 0 ? -1 : 1;
    const jump = Math.abs(velocity) > FLICK_VELOCITY ? 2 : 1;
    snap(index + dir * jump);
  };

  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);

  stage.setAttribute('tabindex', '0');
  stage.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') snap(index + 1);
    if (event.key === 'ArrowLeft') snap(index - 1);
  });

  paint();
  layout(0, true);
}
