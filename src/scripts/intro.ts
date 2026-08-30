import { gsap } from 'gsap';
import { DUR, EASE, STAGGER } from './lib/tokens';
import { introAlreadyPlayed, markIntroPlayed, prefersReducedMotion } from './lib/prefs';
import { getLenis } from './scroll';

/**
 * El progreso está atado a la carga real de fuentes e imagen: un contador
 * falso se nota, y el sitio se presenta como uno que no miente sus números.
 * El objeto resuelve primero y el nombre llega después: el objeto instala la
 * atmósfera, el nombre la aterriza.
 */
export async function initIntro(): Promise<void> {
  const intro = document.querySelector<HTMLElement>('[data-intro]');
  if (!intro) return;

  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const name = document.querySelector<HTMLElement>('[data-hero-name]');
  const sculpture = document.querySelector<HTMLElement>('[data-hero-sculpture]');

  const done = (): void => {
    intro.hidden = true;
    document.body.classList.remove('is-intro');
    getLenis()?.start();
    markIntroPlayed();
  };

  if (prefersReducedMotion() || introAlreadyPlayed() || !hero || !name || !sculpture) {
    done();
    return;
  }

  document.body.classList.add('is-intro');
  getLenis()?.stop();

  const bar = intro.querySelector<HTMLElement>('[data-intro-bar]');
  const value = intro.querySelector<HTMLElement>('[data-intro-value]');
  const chars = splitChars(name);
  const late = Array.from(document.querySelectorAll<HTMLElement>('[data-intro-fade]'));

  gsap.set(sculpture, { opacity: 0, scale: 0.92, filter: 'blur(18px)' });
  gsap.set(chars, { opacity: 0, xPercent: -18 });
  gsap.set(late, { opacity: 0, y: 10 });

  await runMeter(bar, value, waitForAssets(sculpture));

  gsap
    .timeline({ onComplete: done })
    .to(intro, { opacity: 0, duration: DUR.short, ease: EASE.micro })
    .to(sculpture, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: DUR.base, ease: EASE.outSoft }, '<')
    .to(chars, { opacity: 1, xPercent: 0, duration: DUR.base, ease: EASE.outSoft, stagger: STAGGER.chars }, '-=0.25')
    .to(late, { opacity: 1, y: 0, duration: DUR.base, ease: EASE.outSoft, stagger: 0.06 }, '-=0.35');
}

/**
 * Espera a que estén las fuentes y la escultura, que es lo que se ve primero.
 * El piso de tiempo evita que con caché caliente la barra sea un parpadeo:
 * un loader que se ve medio frame molesta más que uno que no está.
 */
function waitForAssets(sculpture: HTMLElement): Promise<unknown> {
  const image = sculpture.querySelector('img');
  const decoded = image?.decode?.().catch(() => undefined) ?? Promise.resolve();
  const floor = new Promise((resolve) => setTimeout(resolve, 900));

  return Promise.all([document.fonts.ready, decoded, floor]);
}

/**
 * La barra avanza hasta 90% mientras se espera y completa al resolverse:
 * refleja progreso real sin quedarse trabada si algo tarda de más.
 */
function runMeter(bar: HTMLElement | null, value: HTMLElement | null, ready: Promise<unknown>): Promise<void> {
  return new Promise((resolve) => {
    const progress = { value: 0 };

    const paint = (): void => {
      if (bar) bar.style.transform = `scaleX(${progress.value / 100})`;
      if (value) value.textContent = `${Math.round(progress.value)}%`;
    };

    // Lineal a propósito: una curva con salida rápida hace que el contador
    // salte a 70% en el primer cuarto de segundo y se lea como decorado.
    const crawl = gsap.to(progress, {
      value: 90,
      duration: 2.2,
      ease: EASE.linear,
      onUpdate: paint,
    });

    void ready.then(() => {
      crawl.kill();
      gsap.to(progress, {
        value: 100,
        duration: 0.35,
        ease: EASE.micro,
        onUpdate: paint,
        onComplete: () => resolve(),
      });
    });
  });
}

/** Divide el título en caracteres para el revelado de izquierda a derecha. */
function splitChars(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? '';
  el.textContent = '';

  return Array.from(text).map((char) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char === ' ' ? '\u00a0' : char;
    el.appendChild(span);
    return span;
  });
}
