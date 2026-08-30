import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASE } from './lib/tokens';
import { prefersReducedMotion } from './lib/prefs';

/**
 * La placa se clava un tramo corto: primero se lee la figura, después
 * las tres líneas se abren. Sin pin si el entorno pide menos movimiento.
 */
export function initAboutPlate(): void {
  const root = document.querySelector<HTMLElement>('[data-about-plate]');
  const pin = root?.querySelector<HTMLElement>('[data-about-plate-pin]');
  if (!root || !pin) return;

  const lines = Array.from(root.querySelectorAll<HTMLElement>('[data-about-plate-line]'));
  if (!lines.length) return;

  if (prefersReducedMotion()) {
    gsap.set(lines, { yPercent: 0, clipPath: 'inset(0% 0 0 0)' });
    return;
  }

  gsap.set(lines, { yPercent: 110, clipPath: 'inset(100% 0 0 0)' });

  const tl = gsap.timeline({ defaults: { ease: EASE.outSoft } });
  tl.to({}, { duration: 0.22 });
  tl.to(lines, {
    yPercent: 0,
    clipPath: 'inset(0% 0 0 0)',
    duration: 0.55,
    stagger: 0.12,
  });

  ScrollTrigger.create({
    trigger: pin,
    start: 'top top',
    end: '+=120%',
    pin: true,
    scrub: 0.65,
    animation: tl,
  });
}
