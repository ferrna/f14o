import { gsap } from 'gsap';
import { EASE, STAGGER } from './lib/tokens';
import { prefersReducedMotion } from './lib/prefs';
import { getLenis } from './scroll';

const OPEN_DUR = 0.55;

export function initMenu(): void {
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const toggle = document.querySelector<HTMLElement>('[data-menu-toggle]');
  if (!menu || !toggle) return;

  const items = Array.from(menu.querySelectorAll<HTMLElement>('[data-menu-item]'));
  const main = document.querySelector<HTMLElement>('#main');
  const reduced = prefersReducedMotion();
  const dur = reduced ? 0 : OPEN_DUR;

  // El overlay arranca fuera de pantalla por CSS para que no parpadee antes
  // de que corra el JS, pero GSAP lee ese translate como píxeles: sin
  // normalizarlo a yPercent, animar yPercent parte y termina en el mismo lugar.
  gsap.set(menu, { yPercent: -100, y: 0 });

  let open = false;
  let lastFocus: HTMLElement | null = null;

  const setOpen = (next: boolean): void => {
    if (next === open) return;
    open = next;

    toggle.setAttribute('aria-expanded', String(next));
    document.body.style.overflow = next ? 'hidden' : '';
    next ? getLenis()?.stop() : getLenis()?.start();

    if (next) {
      lastFocus = document.activeElement as HTMLElement | null;
      menu.hidden = false;
      gsap.set(items, { opacity: 0, y: 18 });

      gsap
        .timeline()
        .to(menu, { yPercent: 0, duration: dur, ease: EASE.inOutMat })
        // Los ítems arrancan cuando el overlay va por el 60%: las dos cosas
        // se solapan y el conjunto se siente más rápido de lo que dura.
        .to(items, { opacity: 1, y: 0, duration: 0.4, ease: EASE.outSoft, stagger: STAGGER.menuItems }, dur * 0.6)
        .to(main, { scale: 0.96, opacity: 0.4, duration: dur, ease: EASE.inOutMat }, 0);

      menu.querySelector<HTMLAnchorElement>('a')?.focus();
      return;
    }

    gsap
      .timeline({
        onComplete: () => {
          menu.hidden = true;
          lastFocus?.focus();
        },
      })
      .to(items, { opacity: 0, y: 10, duration: 0.2, ease: EASE.micro })
      .to(menu, { yPercent: -100, duration: dur, ease: EASE.inOutMat }, '<')
      .to(main, { scale: 1, opacity: 1, duration: dur, ease: EASE.inOutMat }, '<');
  };

  toggle.addEventListener('click', () => setOpen(!open));

  menu.addEventListener('click', (event) => {
    if ((event.target as Element).closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) setOpen(false);
    if (event.key === 'Tab' && open) trapFocus(event, menu, toggle);
  });

  // Al pasar a desktop el overlay deja de tener sentido y podría dejar el
  // scroll bloqueado.
  window.matchMedia('(min-width: 761px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

function trapFocus(event: KeyboardEvent, menu: HTMLElement, toggle: HTMLElement): void {
  const focusable = [toggle, ...Array.from(menu.querySelectorAll<HTMLElement>('a[href], button'))];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) return;

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
