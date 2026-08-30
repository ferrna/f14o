import { gsap } from 'gsap';
import { CURTAIN, EASE } from './lib/tokens';
import { prefersReducedMotion } from './lib/prefs';

/**
 * En mobile, About entra con la misma gramática de la cortina: panel de
 * abajo hacia arriba, hold con el kicker, y el hero se revela. En desktop
 * o si la cortina de navegación ya cubrió el viaje, no se duplica el wipe.
 */
export function initAboutEnter(): void {
  const about = document.querySelector<HTMLElement>('[data-about]');
  const wipe = about?.querySelector<HTMLElement>('[data-about-wipe]');
  const visual = about?.querySelector<HTMLElement>('[data-about-visual]');
  const headline = about?.querySelector<HTMLElement>('[data-about-headline]');
  if (!about || !wipe || !visual || !headline) return;

  const mobile = window.matchMedia('(max-width: 760px)').matches;
  if (!mobile || prefersReducedMotion()) return;

  let revealed = false;
  const reveal = (): void => {
    if (revealed) return;
    revealed = true;
    playReveal(visual, headline);
  };

  gsap.set([visual, headline], { opacity: 0, y: 18 });

  const start = (): void => {
    if (document.querySelector('[data-curtain][data-active="true"]')) {
      window.setTimeout(reveal, 700);
      return;
    }

    wipe.hidden = false;
    gsap.set(wipe, { yPercent: 100 });

    gsap
      .timeline()
      .to(wipe, { yPercent: 0, duration: CURTAIN.in, ease: EASE.inOutMat })
      .to({}, { duration: 0.28 })
      .to(wipe, { yPercent: -100, duration: CURTAIN.out, ease: EASE.inOutMat })
      .add(reveal, '-=0.28')
      .set(wipe, { hidden: true, yPercent: 100 });
  };

  if (document.body.classList.contains('is-intro')) {
    const tick = window.setInterval(() => {
      if (document.body.classList.contains('is-intro')) return;
      window.clearInterval(tick);
      start();
    }, 80);
    return;
  }

  start();
}

function playReveal(visual: HTMLElement, headline: HTMLElement): void {
  gsap.to([visual, headline], {
    opacity: 1,
    y: 0,
    duration: 0.55,
    ease: EASE.outSoft,
    stagger: 0.08,
    overwrite: true,
  });
}
