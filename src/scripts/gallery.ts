import { gsap } from 'gsap';
import { EASE } from './lib/tokens';
import { prefersReducedMotion } from './lib/prefs';

const SKEW_MAX = 4;
const SNAP_DUR = 0.7;
/** Debajo de este arrastre el gesto se lee como click, no como swipe. */
const DRAG_THRESHOLD = 8;
/** Velocidad a partir de la cual la inercia salta dos piezas. */
const FLICK_VELOCITY = 1.1;

export function initGallery(): void {
  document.querySelectorAll<HTMLElement>('[data-gallery]').forEach(setup);
}

function setup(gallery: HTMLElement): void {
  const viewport = gallery.querySelector<HTMLElement>('[data-gallery-viewport]');
  const track = gallery.querySelector<HTMLElement>('[data-gallery-track]');
  const caption = gallery.querySelector<HTMLElement>('[data-gallery-caption]');
  const counter = gallery.querySelector<HTMLElement>('[data-gallery-counter]');
  const progress = gallery.querySelector<HTMLElement>('[data-gallery-progress]');
  const slides = Array.from(gallery.querySelectorAll<HTMLElement>('[data-gallery-slide]'));
  if (!viewport || !track || !slides.length) return;

  const reduced = prefersReducedMotion();
  let index = 0;
  let dragging = false;
  let startX = 0;
  let startOffset = 0;
  let offset = 0;
  let lastX = 0;
  let lastTime = 0;
  let velocity = 0;

  const offsetFor = (i: number): number => {
    const slide = slides[i];
    if (!slide) return 0;
    // Centra la pieza activa en el viewport.
    return viewport.clientWidth / 2 - (slide.offsetLeft + slide.offsetWidth / 2);
  };

  const paint = (): void => {
    slides.forEach((slide, i) => {
      slide.dataset.current = String(i === index);
    });

    const label = slides[index]?.querySelector('img')?.getAttribute('alt') ?? '';
    const human = String(index + 1).padStart(2, '0');

    if (caption) caption.textContent = `Fig. ${human} — ${label}`;
    if (counter) counter.textContent = `${human} / ${String(slides.length).padStart(2, '0')}`;
    if (progress) progress.style.transform = `scaleX(${(index + 1) / slides.length})`;
  };

  const move = (target: number, duration = SNAP_DUR): void => {
    index = gsap.utils.clamp(0, slides.length - 1, target);
    offset = offsetFor(index);
    paint();

    if (reduced) {
      gsap.set(track, { x: offset, skewX: 0 });
      return;
    }
    gsap.to(track, { x: offset, skewX: 0, duration, ease: EASE.outSoft });
  };

  viewport.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    dragging = true;
    startX = event.clientX;
    lastX = event.clientX;
    lastTime = event.timeStamp;
    velocity = 0;
    startOffset = offset;
    viewport.dataset.dragging = 'true';
    viewport.setPointerCapture(event.pointerId);
    gsap.killTweensOf(track);
  });

  viewport.addEventListener('pointermove', (event) => {
    if (!dragging) return;

    const delta = event.clientX - startX;
    offset = startOffset + delta;

    const dt = event.timeStamp - lastTime || 16;
    velocity = (event.clientX - lastX) / dt;
    lastX = event.clientX;
    lastTime = event.timeStamp;

    // La inclinación es proporcional a la velocidad y se endereza al soltar:
    // sugiere masa sin llegar a distorsionar la lectura de las imágenes.
    const skew = reduced ? 0 : gsap.utils.clamp(-SKEW_MAX, SKEW_MAX, -velocity * 2.2);
    gsap.set(track, { x: offset, skewX: skew });
  });

  const release = (): void => {
    if (!dragging) return;
    dragging = false;
    delete viewport.dataset.dragging;

    const travelled = offset - startOffset;
    if (Math.abs(travelled) < DRAG_THRESHOLD) {
      move(index);
      return;
    }

    const direction = travelled > 0 ? -1 : 1;
    const jump = Math.abs(velocity) > FLICK_VELOCITY ? 2 : 1;
    move(index + direction * jump);
  };

  viewport.addEventListener('pointerup', release);
  viewport.addEventListener('pointercancel', release);
  viewport.addEventListener('pointerleave', release);

  viewport.setAttribute('tabindex', '0');
  viewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') move(index + 1);
    if (event.key === 'ArrowLeft') move(index - 1);
  });

  window.addEventListener('resize', () => move(index, 0));

  move(0, 0);
}
