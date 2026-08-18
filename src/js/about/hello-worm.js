import { gsap } from 'gsap';

const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const SOURCE = '<h1>hello world!</h1>';
const FOLDS = [
  { x: 154 / 210, y: 95 / 358 },
  { x: 71 / 210, y: 155 / 358 },
  { x: 138 / 210, y: 203 / 358 },
  { x: 56 / 210, y: 263 / 358 },
];
const BRACKET_TO_FOLD = [1, 0, 3, 2];

let tl = null;
let idle = null;
let splitDone = false;
let bound = false;

function root() {
  return document.querySelector('[data-hello-worm]');
}

function parts(el) {
  return {
    stage: el.querySelector('.hello-worm-stage'),
    code: el.querySelector('[data-hello-code]'),
    visual: el.querySelector('.hello-worm-visual'),
    path: el.querySelector('.hello-worm-stroke'),
    image: el.querySelector('.hello-worm-image'),
  };
}

function splitCode(node) {
  if (!node || node.dataset.split === 'true') return;
  const text = (node.textContent || SOURCE).replace(/\s+/g, ' ').trim() || SOURCE;
  node.textContent = '';

  const match = text.match(/^(<h1>)([\s\S]*)(<\/h1>)$/i) || [null, '<h1>', text, '</h1>'];
  const chunks = [
    { type: 'open', value: match[1] },
    { type: 'phrase', value: match[2] },
    { type: 'close', value: match[3] },
  ];

  const frag = document.createDocumentFragment();
  chunks.forEach((chunk) => {
    const wrap = document.createElement('span');
    wrap.className = `hw-chunk hw-${chunk.type}`;
    [...chunk.value].forEach((letter) => {
      const span = document.createElement('span');
      const isBr = letter === '<' || letter === '>';
      const isPhrase = chunk.type === 'phrase';
      const isTag = !isBr && !isPhrase;
      span.className = [
        'hw-char',
        isBr ? 'hw-br' : '',
        isTag ? 'hw-tag' : '',
        isPhrase ? 'hw-phrase' : '',
      ].filter(Boolean).join(' ');
      span.textContent = letter === ' ' ? '\u00A0' : letter;
      if (isBr) span.dataset.role = 'bracket';
      else if (isPhrase) span.dataset.role = 'phrase';
      else span.dataset.role = 'tag';
      wrap.appendChild(span);
    });
    frag.appendChild(wrap);
  });

  node.appendChild(frag);
  node.dataset.split = 'true';
}

function chars(code, role) {
  return [...code.querySelectorAll(`[data-role="${role}"]`)];
}

function kill() {
  if (tl) {
    tl.kill();
    tl = null;
  }
  if (idle) {
    idle.kill();
    idle = null;
  }
}

function foldDelta(el, visual, index) {
  const fold = FOLDS[BRACKET_TO_FOLD[index]];
  const box = visual.getBoundingClientRect();
  const rect = el.getBoundingClientRect();
  return {
    x: box.left + fold.x * box.width - (rect.left + rect.width / 2),
    y: box.top + fold.y * box.height - (rect.top + rect.height / 2),
  };
}

function startIdle(visual) {
  if (!visual || REDUCE_MOTION) return;
  idle = gsap.to(visual, {
    y: 7,
    duration: 3.4,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
  });
}

function settle(el) {
  const { stage, code, visual, path, image } = parts(el);
  const allChars = code ? [...code.querySelectorAll('.hw-char')] : [];
  gsap.set(el, { opacity: 1 });
  gsap.set(stage, { rotateX: 0, rotateY: 0, z: 0 });
  gsap.set(allChars, { opacity: 0, x: 0, y: 0, scale: 1, rotation: 0, filter: 'none' });
  gsap.set(code, { opacity: 0 });
  gsap.set(path, { opacity: 0, clearProps: 'strokeDashoffset,strokeDasharray' });
  gsap.set(image, { opacity: 1, scale: 1, filter: 'none' });
  gsap.set(visual, { y: 0, rotateX: 0, rotateY: 0 });
  el.dataset.state = 'settled';
  startIdle(visual);
}

function hideHomeHero(immediate) {
  const lines = document.querySelector('#hero-wrapper .hero-text-lines');
  const worm = document.getElementById('hero-worm');
  const duration = immediate || REDUCE_MOTION ? 0 : 0.35;
  gsap.to([lines, worm].filter(Boolean), {
    opacity: 0,
    duration,
    ease: 'power2.out',
    overwrite: 'auto',
  });
}

export function restoreHomeHero(immediate) {
  const lines = document.querySelector('#hero-wrapper .hero-text-lines');
  const worm = document.getElementById('hero-worm');
  const duration = immediate || REDUCE_MOTION ? 0 : 0.4;
  gsap.to([lines, worm].filter(Boolean), {
    opacity: 1,
    duration,
    ease: 'power2.out',
    overwrite: 'auto',
  });
}

export function prepareHelloWorm() {
  const el = root();
  if (!el) return null;
  const { code, visual } = parts(el);
  if (code && !splitDone) {
    splitCode(code);
    splitDone = true;
  }
  if (!bound && visual) {
    bound = true;
    visual.style.pointerEvents = 'auto';
    visual.style.cursor = 'pointer';
    visual.setAttribute('title', 'Replay');
    visual.addEventListener('click', () => playHelloWorm());
  }
  return el;
}

export function playHelloWorm({ delay = 0 } = {}) {
  const el = prepareHelloWorm();
  if (!el) return null;

  kill();
  hideHomeHero(REDUCE_MOTION);
  el.dataset.state = 'playing';
  gsap.set(el, { opacity: 0 });

  const { stage, code, visual, path, image } = parts(el);
  const brackets = chars(code, 'bracket');
  const phrase = chars(code, 'phrase');
  const tags = chars(code, 'tag');
  const allChars = [...code.querySelectorAll('.hw-char')];

  if (REDUCE_MOTION) {
    settle(el);
    return null;
  }

  gsap.set(stage, { rotateX: 0, rotateY: 0 });
  gsap.set(visual, { y: 0, rotateX: 0, rotateY: 0 });
  gsap.set(code, { opacity: 1 });
  gsap.set(image, { opacity: 0, scale: 0.9, filter: 'blur(14px)' });
  gsap.set(allChars, {
    opacity: 0,
    x: 0,
    y: 0,
    xPercent: 0,
    yPercent: 0,
    scale: 1,
    rotation: 0,
    filter: 'none',
  });

  const length = path ? path.getTotalLength() : 0;
  if (path && length) {
    gsap.set(path, {
      opacity: 0.92,
      strokeDasharray: length,
      strokeDashoffset: length,
    });
  }

  const foldScale = window.innerWidth < 720 ? 3.6 : 5.1;
  const nameAt = 0.05;

  tl = gsap.timeline({
    delay,
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      el.dataset.state = 'settled';
      gsap.set(image, { clearProps: 'filter' });
      startIdle(visual);
    },
  });

  tl.set(el, { opacity: 1 }, 0);

  tl.to(allChars, {
    opacity: 1,
    duration: 0.38,
    stagger: 0.032,
    ease: 'power3.out',
  }, nameAt);

  const hold = nameAt + allChars.length * 0.032 + 0.9;
  const absorbAt = hold;
  const foldAt = hold + 0.1;
  const drawAt = hold;
  const imageAt = hold + 1.65;

  tl.to(tags, {
    opacity: 0,
    scale: 0.35,
    y: 10,
    filter: 'blur(8px)',
    duration: 0.42,
    stagger: 0.025,
    ease: 'power2.in',
  }, absorbAt);

  tl.to(phrase, {
    scaleX: 0.18,
    scaleY: 2.8,
    y: (i) => (i % 2 === 0 ? -28 : 32),
    opacity: 0,
    filter: 'blur(8px)',
    duration: 0.85,
    stagger: { each: 0.024, from: 'center' },
    ease: 'power2.in',
  }, absorbAt);

  brackets.forEach((bracket, index) => {
    const delta = foldDelta(bracket, visual, index);
    tl.to(bracket, {
      x: delta.x,
      y: delta.y,
      scale: foldScale,
      rotation: index % 2 === 0 ? -12 : 10,
      color: '#e0c2f5',
      textShadow: '0 0 28px rgba(255, 156, 211, 0.55)',
      duration: 1.45,
      ease: 'power3.inOut',
    }, foldAt);
  });

  tl.to(stage, {
    rotateX: 16,
    rotateY: -7,
    duration: 1.2,
    ease: 'power2.inOut',
  }, foldAt);

  if (path && length) {
    tl.to(path, {
      strokeDashoffset: 0,
      duration: 1.85,
      ease: 'power2.inOut',
    }, drawAt);
  }

  tl.to(brackets, {
    opacity: 0,
    filter: 'blur(10px)',
    duration: 0.45,
    ease: 'power2.in',
  }, imageAt);

  tl.to(image, {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    duration: 0.9,
    ease: 'power2.out',
  }, imageAt);

  tl.to(path, {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out',
  }, imageAt + 0.2);

  tl.to(stage, {
    rotateX: 0,
    rotateY: 0,
    duration: 0.85,
    ease: 'power3.out',
  }, imageAt);

  tl.to(code, { opacity: 0, duration: 0.25 }, imageAt + 0.2);

  return tl;
}

export function resetHelloWorm({ showHome = true } = {}) {
  const el = root();
  kill();
  if (!el) return;
  const { stage, code, visual, path, image } = parts(el);
  const allChars = code ? [...code.querySelectorAll('.hw-char')] : [];
  gsap.set(el, { opacity: 0 });
  gsap.set(stage, { rotateX: 0, rotateY: 0 });
  gsap.set(visual, { y: 0, rotateX: 0, rotateY: 0 });
  gsap.set(code, { opacity: 1 });
  gsap.set(allChars, {
    opacity: 0,
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    color: '',
    textShadow: 'none',
    filter: 'none',
  });
  gsap.set(image, { opacity: 0, scale: 1, filter: 'none' });
  gsap.set(path, { opacity: 0, clearProps: 'strokeDashoffset,strokeDasharray' });
  el.dataset.state = 'idle';
  if (showHome) restoreHomeHero(false);
}

export function setHelloWormVisible(visible, { immediate = false } = {}) {
  const el = root();
  if (!el) return;
  const duration = immediate || REDUCE_MOTION ? 0 : 0.55;
  gsap.to(el, {
    opacity: visible ? 1 : 0,
    duration,
    ease: 'power2.out',
    overwrite: 'auto',
  });
}
