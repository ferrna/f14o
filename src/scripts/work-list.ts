import { gsap } from 'gsap';
import { DUR, EASE } from './lib/tokens';
import { hasFinePointer, prefersReducedMotion } from './lib/prefs';

/**
 * El thumbnail flotante es el mismo nodo que después se expande en la
 * transición al detalle, así que su posición en hover no es decorativa:
 * define desde dónde arranca el morph.
 */
export function initWorkList(): void {
  const list = document.querySelector<HTMLElement>('[data-work-list]');
  if (!list || !hasFinePointer() || prefersReducedMotion()) return;

  const rows = Array.from(list.querySelectorAll<HTMLElement>('[data-work-row]'));
  if (!rows.length) return;

  let active: HTMLElement | null = null;

  rows.forEach((row) => {
    const thumb = row.querySelector<HTMLElement>('[data-work-thumb]');
    if (!thumb) return;

    // El seguimiento va amortiguado para que el thumbnail arrastre detrás
    // del puntero en vez de quedarle pegado.
    const setX = gsap.quickTo(thumb, 'x', { duration: 0.55, ease: EASE.micro });
    const setY = gsap.quickTo(thumb, 'y', { duration: 0.55, ease: EASE.micro });
    const setRotate = gsap.quickTo(thumb, 'rotate', { duration: 0.7, ease: EASE.micro });

    let lastX = 0;

    const place = (event: PointerEvent): void => {
      const offsetX = event.clientX - thumb.offsetWidth / 2;
      const offsetY = event.clientY - thumb.offsetHeight / 2;

      // La inclinación nace de la velocidad horizontal: da la sensación de
      // que la imagen tiene peso.
      const velocity = event.clientX - lastX;
      lastX = event.clientX;

      setX(offsetX);
      setY(offsetY);
      setRotate(gsap.utils.clamp(-6, 6, velocity * 0.35));
    };

    row.addEventListener('pointerenter', (event) => {
      active = row;
      row.dataset.active = 'true';
      list.dataset.hovering = 'true';

      lastX = event.clientX;
      gsap.set(thumb, {
        x: event.clientX - thumb.offsetWidth / 2,
        y: event.clientY - thumb.offsetHeight / 2,
      });
      gsap.to(thumb, { opacity: 1, scale: 1, duration: DUR.short, ease: EASE.outSoft });
    });

    row.addEventListener('pointermove', place, { passive: true });

    row.addEventListener('pointerleave', () => {
      if (active === row) {
        active = null;
        list.dataset.hovering = 'false';
      }
      delete row.dataset.active;
      gsap.to(thumb, { opacity: 0, scale: 0.94, duration: DUR.micro, ease: EASE.micro });
    });
  });
}
