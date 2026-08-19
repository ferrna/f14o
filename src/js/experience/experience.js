import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function revealTitle(title) {
  if (!title || title.classList.contains('is-in')) return;
  gsap.to(title, {
    opacity: 1,
    y: 0,
    duration: REDUCE_MOTION ? 0 : 0.6,
    ease: 'power3.out',
    overwrite: 'auto',
    onComplete: () => {
      title.classList.add('is-in');
      gsap.set(title, { clearProps: 'opacity,transform,y' });
    },
  });
}

function revealItem(item) {
  if (!item || item.classList.contains('is-in')) return;
  gsap.to(item, {
    opacity: 1,
    y: 0,
    duration: REDUCE_MOTION ? 0 : 0.75,
    ease: 'power3.out',
    overwrite: 'auto',
    onComplete: () => {
      item.classList.add('is-in');
      gsap.set(item, { clearProps: 'opacity,transform,y' });
    },
  });
}

function bindHover(items, timeline) {
  items.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      if (!item.classList.contains('is-in')) return;
      timeline?.classList.add('is-hovering');
      item.classList.add('is-active');
    });
    item.addEventListener('mouseleave', () => {
      timeline?.classList.remove('is-hovering');
      item.classList.remove('is-active');
    });
  });
}

export function initExperience() {
  const section = document.querySelector('#experience');
  if (!section || section.dataset.experienceReady === 'true') return;
  section.dataset.experienceReady = 'true';

  const title = section.querySelector('#experience-title');
  const timeline = section.querySelector('.experience-timeline');
  const items = [...section.querySelectorAll('.experience-item')];
  if (!items.length) return;

  bindHover(items, timeline);

  if (REDUCE_MOTION) {
    section.classList.add('is-static');
    title?.classList.add('is-in');
    timeline?.classList.add('is-drawn');
    items.forEach((item) => item.classList.add('is-in'));
    return;
  }

  gsap.set(title, { opacity: 0, y: 14 });
  gsap.set(items, { opacity: 0, y: 28 });

  ScrollTrigger.create({
    trigger: section,
    start: 'top 70%',
    once: true,
    onEnter: () => {
      revealTitle(title);
      timeline?.classList.add('is-drawn');
      items.forEach((item, index) => {
        gsap.delayedCall(0.16 + index * 0.24, () => revealItem(item));
      });
    },
  });

  document.addEventListener('intro-done', () => ScrollTrigger.refresh(), { once: true });
}
