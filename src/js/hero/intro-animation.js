import { gsap } from 'gsap';
import { playHelloWorm } from '../about/hello-worm.js';

const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const GLOW = '0 0 10px #abff84, 0 0 28px rgba(171, 255, 132, 0.7), 0 0 48px rgba(171, 255, 132, 0.35)';
const GLOW_OFF = '0 0 0px rgba(171, 255, 132, 0)';

function splitChars(target) {
  if (!target) return [];
  if (target.classList.contains('text-split-done')) {
    return [...target.querySelectorAll('.char')];
  }

  const texts = [];
  const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) texts.push(walker.currentNode);

  const chars = [];
  texts.forEach((node) => {
    const value = node.nodeValue;
    if (value == null || /^[\n\r\t ]*$/.test(value)) return;
    const frag = document.createDocumentFragment();
    [...value].forEach((letter) => {
      if (letter === '\n' || letter === '\r' || letter === '\t') return;
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = letter === ' ' ? '\u00A0' : letter;
      frag.appendChild(span);
      chars.push(span);
    });
    if (frag.childNodes.length) {
      node.parentNode.replaceChild(frag, node);
    }
  });

  target.classList.add('text-split-done');
  return chars;
}

function reveal(elements) {
  gsap.set(elements.filter(Boolean), {
    opacity: 1,
    x: 0,
    xPercent: 0,
    y: 0,
    scale: 1,
    filter: 'none',
    textShadow: GLOW_OFF,
  });
}

export function prepareHomeIntro() {
  const image = document.querySelector('.hero-image');
  const title = document.querySelector('.hero-title');
  const subtitle = document.querySelector('.hero-subtitle');
  const tech = document.querySelector('#technologies .tech-icons-container');
  const brand = document.querySelector('#header-left-content h2');
  const nav = document.querySelector('#header-content');

  const titleChars = splitChars(title);
  const subtitleChars = splitChars(subtitle);
  const brandChars = splitChars(brand);

  if (REDUCE_MOTION) {
    reveal([image, title, subtitle, tech, brand, nav, ...titleChars, ...subtitleChars, ...brandChars]);
    playHelloWorm();
    document.body.classList.remove('is-awaiting-intro');
    document.body.classList.add('intro-done');
    document.dispatchEvent(new CustomEvent('intro-done'));
    return { reduced: true, titleChars, subtitleChars, brandChars, image, tech, nav };
  }

  gsap.set(image, { opacity: 0, scale: 0.82, filter: 'blur(16px)' });
  gsap.set(nav, { opacity: 0, y: -8 });
  gsap.set(tech, { xPercent: 72, opacity: 0 });
  gsap.set([title, subtitle, brand], { opacity: 1 });
  gsap.set([...titleChars, ...subtitleChars], { opacity: 0, x: -18 });
  gsap.set(brandChars, { opacity: 0, y: 8, textShadow: GLOW_OFF });

  document.body.classList.remove('is-awaiting-intro');

  return { reduced: false, titleChars, subtitleChars, brandChars, image, tech, nav };
}

function revealChars(chars, stagger) {
  if (!chars.length) return;
  gsap.to(chars, {
    opacity: 1,
    x: 0,
    duration: 0.4,
    stagger,
    ease: 'power3.out',
    overwrite: 'auto',
  });
}

export function playHomeIntro(prepared, { delay = 0 } = {}) {
  const ctx = prepared || prepareHomeIntro();
  if (ctx.reduced || document.body.dataset.introPlayed === 'true') {
    document.body.dataset.introPlayed = 'true';
    document.body.classList.add('intro-done');
    return;
  }

  document.body.dataset.introPlayed = 'true';

  const { image, tech, nav, titleChars, subtitleChars, brandChars } = ctx;
  const tl = gsap.timeline({
    delay,
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      document.body.classList.add('intro-done');
      document.dispatchEvent(new CustomEvent('intro-done'));
    },
  });

  if (image) {
    tl.fromTo(image, {
      opacity: 0,
      scale: 0.78,
      filter: 'blur(18px)',
    }, {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.95,
      ease: 'power3.out',
    }, 0);
  }

  const nameAt = image ? 0.52 : 0.06;

  playHelloWorm({
    delay: delay + nameAt - 0.08,
    onImage: () => {
      revealChars(titleChars, 0.04);
      window.setTimeout(() => revealChars(subtitleChars, 0.028), 220);
    },
  });

  const techAt = nameAt + Math.max(titleChars.length * 0.04, 0.2) + 0.45;

  if (tech) {
    tl.to(tech, {
      xPercent: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.inOut',
    }, techAt);
  }

  if (nav) {
    tl.to(nav, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, techAt + 0.35);
  }

  if (brandChars.length) {
    const brandAt = tech ? techAt + 0.55 : techAt + 0.15;
    tl.to(brandChars, {
      opacity: 1,
      y: 0,
      duration: 0.16,
      stagger: 0.05,
      ease: 'power2.out',
    }, brandAt);

    tl.to(brandChars, {
      textShadow: GLOW,
      duration: 0.2,
      stagger: 0.05,
      ease: 'power2.out',
    }, brandAt + 0.08);

    tl.to(brandChars, {
      textShadow: GLOW_OFF,
      duration: 0.55,
      ease: 'power2.out',
    });
  }

  return tl;
}
