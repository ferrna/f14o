import { gsap } from 'gsap';

const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initProjectTabs(root = document) {
  const tabsRoot = root.querySelector('[data-project-tabs]');
  if (!tabsRoot || tabsRoot.dataset.bound === 'true') return;
  tabsRoot.dataset.bound = 'true';

  const tabs = [...tabsRoot.querySelectorAll('[data-tab]')];
  const panels = [...tabsRoot.querySelectorAll('[data-tab-panel]')];

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const id = tab.dataset.tab;
      tabs.forEach((item) => {
        const selected = item === tab;
        item.classList.toggle('is-active', selected);
        item.setAttribute('aria-selected', selected ? 'true' : 'false');
      });
      panels.forEach((panel) => {
        const match = panel.dataset.tabPanel === id;
        panel.classList.toggle('is-active', match);
        panel.hidden = !match;
      });
      tabsRoot.dispatchEvent(new CustomEvent('project-tab-change', {
        bubbles: true,
        detail: { tab: id },
      }));
    });
  });
}

export function initProjectFeatures(root = document) {
  initProjectTabs(root);

  const container = root.querySelector('[data-project-features]');
  if (!container || container.dataset.bound === 'true') return;
  container.dataset.bound = 'true';

  const items = [...container.querySelectorAll('[data-feature]')];
  if (!items.length) return;

  const article = root.querySelector('#project-details-container') || document.querySelector('#project-details-container');
  const featuresPanel = container.closest('[data-tab-panel]');
  let active = items.findIndex((item) => item.classList.contains('is-active'));
  if (active < 0) active = 0;
  let animating = false;
  let lastWheel = 0;
  let lastComputed = indexFromArticleScroll(article);
  let introPlayed = false;

  items.forEach((item, index) => {
    item.classList.toggle('is-active', index === active);
    item.addEventListener('click', () => setActive(index));
  });
  container.dataset.active = String(active);

  if (!featuresPanel || !featuresPanel.hidden) {
    playIntro();
  }

  container.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaY) < 8) return;
    event.preventDefault();
    if (performance.now() - lastWheel < 420) return;
    lastWheel = performance.now();
    setActive(active + (event.deltaY > 0 ? 1 : -1));
  }, { passive: false });

  window.addEventListener('scroll', () => {
    if (featuresPanel && featuresPanel.hidden) return;
    const next = indexFromArticleScroll(article);
    if (next === lastComputed) return;
    lastComputed = next;
    setActive(next);
  }, { passive: true });

  root.addEventListener('project-tab-change', (event) => {
    if (event.detail?.tab !== 'features') return;
    playIntro();
  });

  function setActive(next) {
    const index = ((next % items.length) + items.length) % items.length;
    if (index === active || animating) return;

    const current = items[active];
    const incoming = items[index];
    active = index;

    if (REDUCE_MOTION) {
      current.classList.remove('is-active');
      incoming.classList.add('is-active');
      container.dataset.active = String(index);
      return;
    }

    animating = true;
    const outgoingDetail = current.querySelector('.project-feature-detail');
    const incomingDetail = incoming.querySelector('.project-feature-detail');
    const outgoingTitle = current.querySelector('.project-feature-title');
    const incomingTitle = incoming.querySelector('.project-feature-title');

    const tl = gsap.timeline({
      onComplete: () => {
        animating = false;
      },
    });

    tl.to([outgoingDetail, outgoingTitle], {
      opacity: 0,
      duration: 0.18,
      ease: 'power2.in',
    });
    tl.add(() => {
      current.classList.remove('is-active');
      incoming.classList.add('is-active');
      container.dataset.active = String(index);
      gsap.set(outgoingTitle, { clearProps: 'transform,y' });
      gsap.set(incomingTitle, { opacity: 0, y: 8 });
      gsap.set(incomingDetail, { opacity: 0, y: 10 });
    });
    tl.to(outgoingTitle, {
      opacity: 0.5,
      duration: 0.25,
      ease: 'power2.out',
    }, '<');
    tl.to(incomingTitle, {
      opacity: 1,
      y: 0,
      duration: 0.35,
      ease: 'power2.out',
    }, '<0.04');
    tl.to(incomingDetail, {
      opacity: 1,
      y: 0,
      duration: 0.35,
      ease: 'power2.out',
    }, '<');
  }

  function playIntro() {
    if (introPlayed || REDUCE_MOTION) {
      introPlayed = true;
      return;
    }
    introPlayed = true;
    gsap.from(container, {
      opacity: 0,
      y: 16,
      duration: 0.55,
      delay: 0.05,
      ease: 'power2.out',
    });
    const firstTitle = items[active].querySelector('.project-feature-title');
    const firstDetail = items[active].querySelector('.project-feature-detail');
    gsap.from(firstTitle, {
      opacity: 0,
      y: 8,
      duration: 0.4,
      delay: 0.12,
      ease: 'power2.out',
    });
    gsap.from(firstDetail, {
      opacity: 0,
      y: 12,
      duration: 0.45,
      delay: 0.18,
      ease: 'power2.out',
    });
  }
}

function indexFromArticleScroll(article) {
  if (!article) return 0;
  const handoff = article.querySelector('.project-handoff');
  const start = article.offsetTop;
  const end = handoff ? handoff.offsetTop : start + article.offsetHeight;
  const range = Math.max(1, end - start - window.innerHeight * 0.45);
  const progress = Math.min(0.999, Math.max(0, (window.scrollY - start) / range));
  return Math.min(3, Math.floor(progress * 4));
}
