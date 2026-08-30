import { gsap } from 'gsap';
import { DUR, EASE, STAGGER } from './lib/tokens';
import { prefersReducedMotion } from './lib/prefs';
import { getLenis } from './scroll';

/** En ClientRouter el módulo vive: no hay que repetir la intro al navegar. */
let played = false;

/**
 * El progreso está atado a la carga real de fuentes e imagen: un contador
 * falso se nota, y el sitio se presenta como uno que no miente sus números.
 * El objeto resuelve primero y el nombre llega después: el objeto instala la
 * atmósfera, el nombre la aterriza.
 */
export async function initIntro(): Promise<void> {
  const intro = document.querySelector<HTMLElement>('[data-intro]');
  if (!intro) return;
  if (played || intro.hidden) {
    intro.hidden = true;
    return;
  }

  const name = document.querySelector<HTMLElement>('[data-hero-name]');
  const sculpture = document.querySelector<HTMLElement>('[data-hero-sculpture]');
  const veil = intro.querySelector<HTMLElement>('[data-intro-veil]');
  const lines = Array.from(intro.querySelectorAll<HTMLElement>('[data-intro-hello-line]'));

  const done = (): void => {
    played = true;
    intro.hidden = true;
    document.body.classList.remove('is-intro');
    getLenis()?.start();
  };

  if (prefersReducedMotion()) {
    done();
    return;
  }

  document.body.classList.add('is-intro');
  getLenis()?.stop();

  const bar = intro.querySelector<HTMLElement>('[data-intro-bar]');
  const value = intro.querySelector<HTMLElement>('[data-intro-value]');
  const meter = intro.querySelector<HTMLElement>('.intro__meter');
  const chars = name ? splitChars(name) : [];
  const late = Array.from(document.querySelectorAll<HTMLElement>('[data-intro-fade]'));

  if (sculpture) gsap.set(sculpture, { opacity: 0, scale: 0.88 });
  if (chars.length) gsap.set(chars, { opacity: 0, xPercent: -18 });
  if (late.length) gsap.set(late, { opacity: 0, y: 10 });
  if (lines.length) gsap.set(lines, { yPercent: 110, clipPath: 'inset(100% 0 0 0)' });

  if (lines.length) {
    gsap.to(lines, {
      yPercent: 0,
      clipPath: 'inset(0% 0 0 0)',
      duration: DUR.base + 0.15,
      ease: EASE.outSoft,
      stagger: 0.08,
      delay: 0.12,
    });
  }

  await runMeter(bar, value, waitForAssets(sculpture), sculpture, veil);

  const tl = gsap.timeline({ onComplete: done });
  // El nombre entra con el fade del loader: si espera a que termine,
  // Lighthouse marca el LCP 400ms más tarde.
  if (chars.length) {
    tl.to(chars, { opacity: 1, xPercent: 0, duration: DUR.base, ease: EASE.outSoft, stagger: STAGGER.chars }, 0);
  }
  if (sculpture) {
    tl.to(sculpture, { opacity: 1, scale: 1, duration: DUR.base, ease: EASE.outSoft }, 0);
  }
  tl.to([meter, intro.querySelector('[data-intro-hello]'), veil].filter(Boolean), {
    opacity: 0,
    duration: DUR.short,
    ease: EASE.micro,
  }, 0);
  if (late.length) {
    tl.to(late, { opacity: 1, y: 0, duration: DUR.base, ease: EASE.outSoft, stagger: 0.06 }, 0.12);
  }
}

/**
 * Espera a que estén las fuentes y, en el home, la escultura. El piso de
 * tiempo evita que con caché caliente la barra sea un parpadeo.
 */
function waitForAssets(sculpture: HTMLElement | null): Promise<unknown> {
  const image = sculpture?.querySelector('img');
  const decoded = image?.decode?.().catch(() => undefined) ?? Promise.resolve();
  const floor = new Promise((resolve) => setTimeout(resolve, 900));
  // Sólo Archivo: fonts.ready también espera a la mono y retrasa el LCP.
  const typeface = document.fonts.load('700 4rem "Archivo Variable"').catch(() => undefined);

  return Promise.all([typeface, decoded, floor]);
}

/**
 * La barra avanza hasta 90% mientras se espera y completa al resolverse.
 * El worm crece con el porcentaje desde el arranque, no en el tramo final.
 */
function runMeter(
  bar: HTMLElement | null,
  value: HTMLElement | null,
  ready: Promise<unknown>,
  sculpture: HTMLElement | null,
  veil: HTMLElement | null,
): Promise<void> {
  return new Promise((resolve) => {
    const progress = { value: 0 };

    const paint = (): void => {
      const t = progress.value;
      if (bar) bar.style.transform = `scaleX(${t / 100})`;
      if (value) value.textContent = `${Math.round(t)}%`;

      // Desde 8%: ease-out para que se lea pronto y siga llenándose hasta el 100.
      if (sculpture) {
        const k = gsap.utils.clamp(0, 1, (t - 8) / 92);
        const eased = 1 - (1 - k) * (1 - k);
        gsap.set(sculpture, { opacity: eased, scale: 0.88 + 0.12 * eased });
      }

      if (veil) {
        veil.style.opacity = t < 10 ? '1' : String(1 - ((t - 10) / 90) * 0.88);
      }
    };

    const crawl = gsap.to(progress, {
      value: 90,
      duration: 2,
      ease: EASE.linear,
      onUpdate: paint,
    });

    void ready.then(() => {
      crawl.kill();
      gsap.to(progress, {
        value: 100,
        duration: 0.8,
        ease: EASE.outSoft,
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
