import { gsap } from 'gsap';
import { CURSOR } from './lib/tokens';
import { hasFinePointer, prefersReducedMotion } from './lib/prefs';

type CursorState = 'default' | 'hover' | 'project' | 'drag' | 'sculpture';

/**
 * El anillo persigue al punto con interpolación: esa diferencia de velocidad
 * es lo que produce la sensación de inercia. El punto va casi pegado al mouse
 * para que la precisión de click no se vea afectada.
 */
export function initCursor(): void {
  if (!hasFinePointer() || prefersReducedMotion()) return;

  const root = document.querySelector<HTMLElement>('[data-cursor]');
  const dot = document.querySelector<HTMLElement>('[data-cursor-dot]');
  const ring = document.querySelector<HTMLElement>('[data-cursor-ring]');
  const label = document.querySelector<HTMLElement>('[data-cursor-label]');
  if (!root || !dot || !ring || !label) return;

  let pointerX = -100;
  let pointerY = -100;
  let ringX = -100;
  let ringY = -100;
  let visible = false;
  let state: CursorState = 'default';
  let labelText = '';

  const setDotX = gsap.quickSetter(dot, 'x', 'px') as (v: number) => void;
  const setDotY = gsap.quickSetter(dot, 'y', 'px') as (v: number) => void;
  const setRingX = gsap.quickSetter(ring, 'x', 'px') as (v: number) => void;
  const setRingY = gsap.quickSetter(ring, 'y', 'px') as (v: number) => void;

  const apply = (next: CursorState, text = ''): void => {
    if (next === state && text === labelText) return;
    state = next;
    labelText = text;
    root.dataset.state = next;
    label.textContent = text;
  };

  const resolve = (target: Element | null): void => {
    if (!target) return apply('default');

    const explicit = target.closest<HTMLElement>('[data-cursor]');
    if (explicit && explicit !== root) {
      const mode = (explicit.dataset.cursor || 'hover') as CursorState;
      return apply(mode, explicit.dataset.cursorLabel ?? '');
    }

    if (target.closest('[data-cursor-project]')) return apply('project', 'View');
    if (target.closest('[data-cursor-drag]')) return apply('drag', 'Drag');
    if (target.closest('[data-cursor-sculpture]')) return apply('sculpture', '3D');
    if (target.closest('a, button, [role="button"], [data-cursor-hover]')) return apply('hover');

    apply('default');
  };

  window.addEventListener(
    'pointermove',
    (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (!visible) {
        visible = true;
        ringX = pointerX;
        ringY = pointerY;
        root.dataset.visible = 'true';
      }

      setDotX(pointerX);
      setDotY(pointerY);
      resolve(event.target as Element | null);
    },
    { passive: true }
  );

  document.addEventListener('pointerleave', () => {
    visible = false;
    root.dataset.visible = 'false';
  });

  gsap.ticker.add(() => {
    if (!visible) return;
    ringX += (pointerX - ringX) * CURSOR.lerp;
    ringY += (pointerY - ringY) * CURSOR.lerp;
    setRingX(ringX);
    setRingY(ringY);
  });
}
