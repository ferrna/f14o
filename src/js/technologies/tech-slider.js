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
  const icons = section.querySelector('.tech-icons');
  const panel = section.querySelector('[data-tech-panel]');
  if (!toggle || !icons || !panel) return;

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
    if (section.classList.contains('is-open')) closePanel();
    else openPanel();
  });

}
