import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { setHelloWormVisible } from '../about/hello-worm.js';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const STAR_COUNT = 90;
const GUIDE_DURATION = 1.05;

let started = false;
let guiding = false;
let guideToken = 0;
let wheelAcc = 0;
let wheelReset = 0;
let touchY = 0;

function createStars(root) {
  if (!root || root.dataset.starsReady === 'true') {
    return [...(root?.querySelectorAll('.hero-star') || [])];
  }

  const frag = document.createDocumentFragment();
  for (let i = 0; i < STAR_COUNT; i += 1) {
    const star = document.createElement('span');
    const size = 1 + Math.random() * 2.4;
    star.className = 'hero-star';
    const inBulge = Math.random() > 0.7;
    star.style.left = inBulge
      ? `${22 + Math.random() * 56}%`
      : `${6 + Math.random() * 88}%`;
    star.style.top = inBulge
      ? `${76 + Math.random() * 20}%`
      : `${6 + Math.random() * 68}%`;
    star.style.setProperty('--size', `${size}px`);
    star.style.setProperty('--delay', `${Math.random() * 2.6}s`);
    star.dataset.dir = i % 2 === 0 ? '-1' : '1';
    star.dataset.dist = String(140 + Math.random() * 280);
    star.dataset.drift = String((Math.random() - 0.5) * 90);
    frag.appendChild(star);
  }
  root.appendChild(frag);
  root.dataset.starsReady = 'true';
  return [...root.querySelectorAll('.hero-star')];
}

function applyStars(progress, starEls) {
  starEls.forEach((star) => {
    const dir = Number(star.dataset.dir);
    const dist = Number(star.dataset.dist);
    const drift = Number(star.dataset.drift);
    if (progress <= 0.02) {
      star.style.animationPlayState = 'running';
      gsap.set(star, { clearProps: 'transform,x,y,opacity' });
      return;
    }
    star.style.animationPlayState = 'paused';
    gsap.set(star, {
      y: dir * dist * progress,
      x: drift * progress,
      opacity: 1 - progress,
    });
  });
}

function setCompact(on, { immediate = false } = {}) {
  const duration = immediate || REDUCE_MOTION ? 0 : 0.55;
  const worm = document.getElementById('hero-worm');
  const title = document.querySelector('[data-header-title]');
  const mark = document.querySelector('[data-header-mark]');
  const photo = document.querySelector('.hero-image');
  const titleLines = document.querySelector('.hero-text-lines');
  const aboutHero = document.querySelector('#hero-wrapper')?.classList.contains('is-about');

  document.body.classList.toggle('is-hero-passed', on);

  if (aboutHero) {
    setHelloWormVisible(!on, { immediate });
    gsap.to([worm, titleLines].filter(Boolean), { opacity: 0, duration, ease: 'power2.out', overwrite: 'auto' });
  } else {
    gsap.to(worm, { opacity: on ? 0 : 1, duration, ease: 'power2.out', overwrite: 'auto' });
    gsap.to(titleLines, { opacity: on ? 0 : 1, duration, ease: 'power2.out', overwrite: 'auto' });
  }
  gsap.to(title, {
    opacity: on ? 0 : 1,
    duration: duration * 0.7,
    ease: 'power2.out',
    overwrite: 'auto',
  });
  gsap.to(mark, {
    opacity: on ? 1 : 0,
    duration,
    delay: on ? duration * 0.2 : 0,
    ease: 'power2.out',
    overwrite: 'auto',
    onStart: () => {
      if (mark && on) mark.style.visibility = 'visible';
    },
    onComplete: () => {
      if (mark && !on) mark.style.visibility = 'hidden';
    },
  });

  if (photo) {
    if (on) {
      gsap.fromTo(photo, { opacity: 0, scale: 0.88 }, {
        opacity: 1,
        scale: 1,
        duration,
        delay: duration * 0.15,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    } else {
      gsap.to(photo, { opacity: 1, scale: 1, duration: duration * 0.5, overwrite: 'auto' });
    }
  }
}

function headerOffset() {
  const header = document.querySelector('.site-header');
  return header ? Math.round(header.getBoundingClientRect().height) : 80;
}

function getNextSection() {
  const home = document.querySelector('#home-page');
  if (home && !home.hidden) {
    return document.querySelector('#technologies') || home;
  }
  const about = document.querySelector('#view-about');
  if (about && !about.hidden) {
    return about.querySelector('#about') || about;
  }
  return null;
}

function nextScrollY() {
  const next = getNextSection();
  if (!next) return 0;
  return Math.max(0, Math.round(window.scrollY + next.getBoundingClientRect().top - headerOffset()));
}

function guideBlocked() {
  return REDUCE_MOTION
    || !document.body.classList.contains('intro-done')
    || document.body.classList.contains('lock-scroll')
    || document.body.classList.contains('is-page-transitioning');
}

function finishGuide(token) {
  if (token !== guideToken) return;
  guiding = false;
  wheelAcc = 0;
  ScrollTrigger.refresh();
}

function guideTo(y, compact) {
  if (guiding) return;
  const token = ++guideToken;
  guiding = true;
  wheelAcc = 0;
  setCompact(compact);
  gsap.to(window, {
    scrollTo: { y, autoKill: false },
    duration: GUIDE_DURATION,
    ease: 'power3.inOut',
    overwrite: true,
    onComplete: () => {
      finishGuide(token);
      document.dispatchEvent(new CustomEvent('hero-guide-complete', { detail: { compact } }));
    },
    onInterrupt: () => finishGuide(token),
  });
  window.setTimeout(() => finishGuide(token), GUIDE_DURATION * 1000 + 350);
}

function canGuideDown() {
  return window.scrollY < nextScrollY() - 24;
}

function canGuideUp() {
  const dest = nextScrollY();
  const y = window.scrollY;
  return y > 24 && y <= dest + 32;
}

function tryGuide(delta) {
  if (guideBlocked()) return false;
  if (!getNextSection()) return false;

  if (delta > 0 && canGuideDown()) {
    guideTo(nextScrollY(), true);
    return true;
  }
  if (delta < 0 && canGuideUp()) {
    guideTo(0, false);
    return true;
  }
  return false;
}

function onWheel(event) {
  if (guiding) {
    event.preventDefault();
    return;
  }
  if (guideBlocked() || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;

  const wantDown = event.deltaY > 0 && canGuideDown();
  const wantUp = event.deltaY < 0 && canGuideUp();
  if (!wantDown && !wantUp) {
    wheelAcc = 0;
    return;
  }

  event.preventDefault();
  wheelAcc += event.deltaY;
  window.clearTimeout(wheelReset);
  wheelReset = window.setTimeout(() => { wheelAcc = 0; }, 200);
  if (Math.abs(wheelAcc) < 42) return;

  const delta = wheelAcc;
  wheelAcc = 0;
  tryGuide(delta);
}

function onTouchStart(event) {
  touchY = event.touches[0] ? event.touches[0].clientY : 0;
}

function onTouchMove(event) {
  if (guiding) {
    event.preventDefault();
    return;
  }
  if (guideBlocked() || !event.touches[0]) return;

  const delta = touchY - event.touches[0].clientY;
  const wantDown = delta > 0 && canGuideDown();
  const wantUp = delta < 0 && canGuideUp();
  if (!wantDown && !wantUp) return;
  if (Math.abs(delta) < 36) return;

  touchY = event.touches[0].clientY;
  if (tryGuide(delta)) event.preventDefault();
}

function onKeyDown(event) {
  if (guiding || guideBlocked()) return;
  if (event.target.closest('button, a, input, textarea, [contenteditable="true"]')) return;
  if (['ArrowDown', 'PageDown', ' '].includes(event.key) && canGuideDown()) {
    event.preventDefault();
    tryGuide(1);
  } else if (['ArrowUp', 'PageUp'].includes(event.key) && canGuideUp()) {
    event.preventDefault();
    tryGuide(-1);
  }
}

export function initHeroScroll() {
  const hero = document.querySelector('#hero-wrapper');
  const starRoot = document.querySelector('[data-hero-stars]');
  if (!hero || started) return;
  started = true;

  const stars = createStars(starRoot);
  const mark = document.querySelector('[data-header-mark]');
  if (mark) {
    gsap.set(mark, { opacity: 0, visibility: 'hidden' });
  }

  ScrollTrigger.create({
    trigger: hero,
    start: 'top top+=40',
    end: 'bottom top+=80',
    scrub: 0.55,
    onUpdate: (self) => applyStars(self.progress, stars),
  });

  ScrollTrigger.create({
    trigger: hero,
    start: 'top top+=80',
    onEnter: () => {
      if (!guiding) setCompact(true);
    },
    onLeaveBack: () => {
      if (!guiding) setCompact(false);
    },
  });

  if (hero.getBoundingClientRect().top < -80) {
    setCompact(true, { immediate: true });
  }

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('keydown', onKeyDown);

  document.addEventListener('intro-done', () => {
    ScrollTrigger.refresh();
  });
}

