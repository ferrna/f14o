import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const GLOW = '0 0 8px rgba(171, 255, 132, 0.45), 0 0 18px rgba(171, 255, 132, 0.22)';
const GLOW_STRONG = '0 0 10px #abff84, 0 0 24px rgba(171, 255, 132, 0.55)';

function currentX(el) {
  const transform = getComputedStyle(el).transform;
  if (!transform || transform === 'none') return 0;
  return new DOMMatrixReadOnly(transform).m41;
}

export function initTechSlider() {
  const section = document.querySelector('#technologies');
  if (!section || section.dataset.techReady === 'true') return;
  section.dataset.techReady = 'true';

  const toggle = section.querySelector('[data-tech-toggle]');
  const label = section.querySelector('[data-tech-label]');
  const icons = section.querySelector('.tech-icons');
  const panel = section.querySelector('[data-tech-panel]');
  if (!toggle || !label || !icons || !panel) return;

  gsap.set(label, { opacity: 0, y: 10 });

  let landY = null;
  let touchY = 0;
  const DOWN_PX = 4;

  function markLanding() {
    landY = Math.round(window.scrollY);
  }

  function revealLabel() {
    markLanding();
    if (section.classList.contains('is-label-in')) return;
    section.classList.add('is-label-in');
    gsap.to(label, {
      opacity: 1,
      y: 0,
      duration: REDUCE_MOTION ? 0 : 0.55,
      ease: 'power2.out',
    });
    if (REDUCE_MOTION) return;
    gsap.fromTo(label, { textShadow: GLOW }, {
      textShadow: GLOW_STRONG,
      duration: 0.32,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
      onComplete: () => {
        gsap.set(label, { clearProps: 'textShadow' });
      },
    });
  }

  function hideLabel() {
    if (!section.classList.contains('is-label-in')) return;
    closePanel();
    section.classList.remove('is-label-in');
    gsap.to(label, {
      opacity: 0,
      y: 8,
      duration: REDUCE_MOTION ? 0 : 0.28,
      ease: 'power2.out',
    });
  }

  function syncToScroll() {
    if (landY == null) return;
    const y = window.scrollY;
    if (y > landY + DOWN_PX) hideLabel();
    else if (Math.abs(y - landY) <= DOWN_PX) revealLabel();
  }

  function openPanel() {
    if (section.classList.contains('is-open')) return;
    section.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');

    const x = currentX(icons);
    gsap.set(icons, { x });
    icons.style.animation = 'none';
    gsap.to(icons, {
      x: 0,
      duration: REDUCE_MOTION ? 0 : 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
      onComplete: () => ScrollTrigger.refresh(),
    });
  }

  function closePanel() {
    if (!section.classList.contains('is-open')) return;
    section.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    gsap.set(icons, { clearProps: 'x,transform' });
    icons.style.removeProperty('animation');
    ScrollTrigger.refresh();
  }

  toggle.addEventListener('click', () => {
    if (!section.classList.contains('is-label-in')) return;
    if (section.classList.contains('is-open')) closePanel();
    else openPanel();
  });

  document.addEventListener('hero-guide-complete', (event) => {
    if (event.detail?.compact) revealLabel();
    else hideLabel();
  });

  window.addEventListener('scroll', syncToScroll, { passive: true });
  window.addEventListener('wheel', (event) => {
    if (!section.classList.contains('is-label-in')) return;
    if (event.deltaY > 0) hideLabel();
  }, { passive: true });
  window.addEventListener('touchmove', (event) => {
    if (!section.classList.contains('is-label-in') || !event.touches[0]) return;
    const y = event.touches[0].clientY;
    if (touchY && y < touchY - 6) hideLabel();
    touchY = y;
  }, { passive: true });
  window.addEventListener('touchstart', (event) => {
    touchY = event.touches[0] ? event.touches[0].clientY : 0;
  }, { passive: true });

  if (document.body.classList.contains('is-hero-passed')) {
    revealLabel();
  }

  if (REDUCE_MOTION) {
    document.addEventListener('intro-done', revealLabel, { once: true });
    if (document.body.classList.contains('intro-done')) revealLabel();
  }
}
