import { gsap } from 'gsap';
import { DUR, EASE } from './lib/tokens';
import { prefersReducedMotion } from './lib/prefs';

const HOLD = 0.75;

let pendingHold = false;
let watching = false;

/**
 * El morph del título ya lo resuelve View Transition. Esto solo cubre
 * el hold: 0.75s de título + kicker, después entra el resto.
 * El flag se arma en la lista de work, antes de que el documento se swapée.
 */
export function watchCaseEnter(): void {
  if (watching) return;
  watching = true;

  document.addEventListener(
    'click',
    (event) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('[data-work-list] a[href]');
      if (!link) return;
      pendingHold = isCasePath(new URL(link.href, window.location.href).pathname);
    },
    true,
  );

  document.addEventListener('astro:before-preparation', (event) => {
    const to = readTo(event);
    if (to && isCasePath(to) && document.querySelector('[data-work-list]')) {
      pendingHold = true;
    }
  });

  document.addEventListener('astro:before-swap', (event) => {
    if (!pendingHold) return;
    const doc = (event as Event & { newDocument?: Document }).newDocument;
    markHold(doc);
  });
}

export function initCaseEnter(): void {
  const root = document.querySelector<HTMLElement>('[data-case]');
  if (!root) return;

  const late = root.querySelectorAll<HTMLElement>('[data-case-late]');
  const hold = pendingHold && late.length > 0 && !prefersReducedMotion();
  pendingHold = false;

  if (!hold) {
    root.removeAttribute('data-case-hold');
    return;
  }

  root.setAttribute('data-case-hold', '');
  gsap.set(late, { opacity: 0 });
  gsap.to(late, {
    opacity: 1,
    duration: DUR.long,
    delay: HOLD,
    ease: EASE.outSoft,
    stagger: 0.06,
    overwrite: true,
    onComplete: () => root.removeAttribute('data-case-hold'),
  });
}

function markHold(doc: Document | undefined): void {
  doc?.querySelector('[data-case]')?.setAttribute('data-case-hold', '');
}

function readTo(event: Event): string | undefined {
  const nav = event as Event & { to?: URL | string };
  if (!nav.to) return undefined;
  return typeof nav.to === 'string' ? nav.to : nav.to.pathname;
}

function isCasePath(pathname: string): boolean {
  return /\/work\/[^/]+/.test(pathname);
}
