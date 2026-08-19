import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { applyTranslations, t } from '../i18n/i18n.js';
import { initProjectFeatures } from '../projects/project-features.js';

gsap.registerPlugin(ScrollTrigger);

const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IMAGE_EASE = 'power3.inOut';
const IMAGE_DURATION = 0.8;
const CONTENT_DURATION = 0.55;

const state = {
  busy: false,
  homeScrollY: 0,
  fromImage: null,
  handoff: {
    moved: false,
    committed: false,
    nodes: [],
    placeholder: null,
    onScroll: null,
    onWheel: null,
    onTouchStart: null,
    onTouchMove: null,
    onKeyDown: null,
    edgeLocked: false,
    lastIntent: 0,
    touchY: 0,
    raf: 0,
  },
};

function prefersReducedMotion() {
  return REDUCE_MOTION;
}

function rectOf(el) {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function fetchPart(url, selector = 'main') {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load ${url}`);
      }
      return response.text();
    })
    .then((html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const part = doc.querySelector(selector);
      const main = doc.querySelector('main');
      const node = part || main;
      if (!node) {
        throw new Error('Loaded page is missing the requested content');
      }
      return {
        html: node.innerHTML,
        title: doc.title,
      };
    });
}

function fetchMain(url) {
  return fetchPart(url, 'main');
}

function waitForImage(img) {
  if (img.complete && img.naturalHeight) {
    return Promise.resolve();
  }
  if (img.decode) {
    return img.decode().catch(() => {});
  }
  return new Promise((resolve) => {
    img.addEventListener('load', resolve, { once: true });
    img.addEventListener('error', resolve, { once: true });
  });
}

function setHomeScrollTriggers(enabled) {
  ScrollTrigger.getAll().forEach((trigger) => {
    if (enabled) {
      trigger.enable();
    } else {
      trigger.disable();
    }
  });
  if (enabled) {
    ScrollTrigger.refresh();
  }
}

function createFixedClone(image, rect) {
  const clone = image.cloneNode(true);
  clone.className = 'project-transition-image';
  clone.removeAttribute('id');
  clone.setAttribute('aria-hidden', 'true');
  document.body.appendChild(clone);
  gsap.set(clone, {
    position: 'fixed',
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    margin: 0,
    zIndex: 10000,
    pointerEvents: 'none',
    objectFit: 'cover',
    maxWidth: 'none',
    maxHeight: 'none',
  });
  return clone;
}

function pageSlots(main) {
  return {
    main,
    viewHome: main.querySelector('#view-home'),
    viewProject: main.querySelector('#view-project'),
    viewAbout: main.querySelector('#view-about'),
    homePage: main.querySelector('#home-page'),
  };
}

export function ensureViews() {
  const main = document.querySelector('main');
  if (!main) return null;

  let viewHome = main.querySelector('#view-home');
  let viewProject = main.querySelector('#view-project');
  if (viewHome && viewProject) {
    return pageSlots(main);
  }

  const isProject = Boolean(main.querySelector('#project-details-container'));
  const wrapper = document.createElement('div');
  wrapper.id = isProject ? 'view-project' : 'view-home';
  while (main.firstChild) {
    wrapper.appendChild(main.firstChild);
  }
  main.appendChild(wrapper);

  const other = document.createElement('div');
  other.id = isProject ? 'view-home' : 'view-project';
  other.hidden = true;
  main.appendChild(other);

  return pageSlots(main);
}

function ensureAboutSlot(viewHome) {
  let about = document.querySelector('#view-about');
  if (about) return about;
  if (!viewHome) return null;
  about = document.createElement('div');
  about.id = 'view-about';
  about.hidden = true;
  about.setAttribute('aria-hidden', 'true');
  const hero = viewHome.querySelector('#hero-wrapper');
  if (hero) {
    hero.insertAdjacentElement('afterend', about);
  } else {
    viewHome.appendChild(about);
  }
  return about;
}

function ensureHomePage(viewHome) {
  let homePage = document.querySelector('#home-page');
  if (homePage) return homePage;
  if (!viewHome) return null;
  homePage = document.createElement('div');
  homePage.id = 'home-page';
  const hero = viewHome.querySelector('#hero-wrapper');
  const about = viewHome.querySelector('#view-about');
  if (hero) {
    hero.insertAdjacentElement('afterend', homePage);
  } else if (about) {
    viewHome.insertBefore(homePage, about);
  } else {
    viewHome.appendChild(homePage);
  }
  return homePage;
}

function isAboutVisible() {
  const about = document.querySelector('#view-about');
  return Boolean(about && !about.hidden);
}

function setNavActive(view) {
  document.querySelectorAll('[data-nav]').forEach((button) => {
    const active = (view === 'about' && button.dataset.nav === 'about')
      || (view === 'home' && button.dataset.nav === 'projects');
    button.classList.toggle('is-active', active);
    if (active) {
      button.setAttribute('aria-current', 'page');
    } else {
      button.removeAttribute('aria-current');
    }
  });
}

function setHeroAboutLayout(visible, { immediate = false } = {}) {
  const hero = document.querySelector('#hero-wrapper');
  const movers = document.querySelectorAll('.hero-text-lines');
  if (!hero) return Promise.resolve();

  const apply = () => hero.classList.toggle('is-about', visible);

  if (immediate || prefersReducedMotion() || !movers.length) {
    apply();
    gsap.set(movers, { x: 0 });
    return Promise.resolve();
  }

  const starts = [...movers].map((el) => el.getBoundingClientRect().left);
  apply();
  movers.forEach((el, index) => {
    gsap.set(el, { x: starts[index] - el.getBoundingClientRect().left });
  });
  return gsap.to(movers, {
    x: 0,
    duration: 0.55,
    ease: 'power2.out',
    overwrite: 'auto',
  });
}

function setAboutPortrait(visible, { immediate = false } = {}) {
  document.body.dataset.page = visible ? 'about' : (document.body.dataset.page === 'project' ? 'project' : 'home');
  return setHeroAboutLayout(visible, { immediate });
}

function showView(view) {
  view.hidden = false;
  view.removeAttribute('hidden');
  view.removeAttribute('aria-hidden');
  view.classList.remove('is-measuring');
  view.style.cssText = '';
}

function hideView(view) {
  view.hidden = true;
  view.setAttribute('aria-hidden', 'true');
  view.style.cssText = '';
  view.classList.remove('is-measuring');
}

function prepareMeasuring(view) {
  view.hidden = false;
  view.classList.add('is-measuring');
}

function fadeElements(elements, { to = 1, duration = CONTENT_DURATION, delay = 0, y = 0 } = {}) {
  if (!elements.length) {
    return Promise.resolve();
  }
  return gsap.to(elements, {
    opacity: to,
    y,
    duration,
    delay,
    stagger: to === 1 ? 0.06 : 0,
    ease: 'power2.out',
    overwrite: 'auto',
  });
}

function projectContent(viewProject) {
  return [...viewProject.querySelectorAll('[data-project-fade]')];
}

function setHistory(view, url, title, { replace = false } = {}) {
  const nextUrl = url || window.location.href;
  if (title) {
    document.title = title;
  }
  const current = window.history.state || {};
  const resolved = new URL(nextUrl, window.location.href).href;
  if (current.view === view && window.location.href === resolved) {
    return;
  }
  const method = replace ? 'replaceState' : 'pushState';
  window.history[method]({ view }, title || document.title, nextUrl);
}

export async function goToProject({ image, url, updateHistory = true }) {
  if (state.busy || !image || !url) return;
  teardownHandoff();
  restoreHandoffToHome();
  state.busy = true;
  state.fromImage = image;
  state.homeScrollY = window.scrollY;

  const views = ensureViews();
  if (!views) {
    window.location.href = url;
    return;
  }

  const { viewHome, viewProject } = views;
  const start = rectOf(image);
  const clone = createFixedClone(image, start);
  image.style.visibility = 'hidden';
  document.body.classList.add('is-page-transitioning');

  try {
    const page = await fetchMain(url);
    viewProject.innerHTML = page.html;
    applyTranslations(viewProject);
    bindProjectChrome(viewProject);
    initProjectFeatures(viewProject);

    const target = viewProject.querySelector('#project-main-image');
    if (!target) {
      throw new Error('Project page is missing #project-main-image');
    }
    target.src = image.currentSrc || image.src;
    target.style.visibility = 'hidden';
    await waitForImage(target);

    prepareMeasuring(viewProject);
    const end = rectOf(target);
    setHomeScrollTriggers(false);

    const fadeOutHome = prefersReducedMotion()
      ? Promise.resolve()
      : gsap.to(viewHome, { opacity: 0, duration: 0.4, ease: 'power2.inOut' });

    const moveImage = prefersReducedMotion()
      ? gsap.set(clone, end)
      : gsap.to(clone, {
          ...end,
          duration: IMAGE_DURATION,
          ease: IMAGE_EASE,
        });

    await Promise.all([fadeOutHome, moveImage]);

    hideView(viewHome);
    gsap.set(viewHome, { opacity: 1 });
    window.scrollTo(0, 0);
    showView(viewProject);

    const incoming = projectContent(viewProject);
    if (prefersReducedMotion()) {
      gsap.set(incoming, { opacity: 1, y: 0 });
    } else {
      gsap.set(incoming, { opacity: 0, y: 20 });
      fadeElements(incoming, { to: 1, y: 0, delay: 0.05 });
    }

    target.style.visibility = '';
    clone.remove();
    const projectTitle = t('meta.projectTitle');
    if (updateHistory) {
      setHistory('project', url, projectTitle);
    } else {
      document.title = projectTitle;
    }
  } catch (error) {
    clone.remove();
    image.style.visibility = '';
    window.location.href = url;
    return;
  } finally {
    document.body.classList.remove('is-page-transitioning');
    state.busy = false;
  }

  await prepareProjectHandoff();
}

export async function goToHome({ url = 'index.html', scrollToProjects = false, updateHistory = true } = {}) {
  if (state.busy) return;

  const views = ensureViews();
  const onProject = Boolean(views && views.viewProject && !views.viewProject.hidden);
  if (!onProject && isAboutVisible()) {
    await goHomeFromAbout({ scrollToProjects, updateHistory });
    return;
  }

  teardownHandoff();
  restoreHandoffToHome();
  state.busy = true;

  if (!views) {
    window.location.href = scrollToProjects ? `${url}#projects` : url;
    return;
  }

  const { viewHome, viewProject } = views;
  const hero = viewProject.querySelector('#project-main-image');
  document.body.classList.add('is-page-transitioning');

  try {
    if (!viewHome.innerHTML.trim()) {
      const page = await fetchPart(url, '#view-home');
      viewHome.innerHTML = page.html;
      applyTranslations(viewHome);
      bindSiteNav(viewHome);
    }

    if (viewHome.dataset.slidesReady !== 'true') {
      document.dispatchEvent(new CustomEvent('home-view-ready'));
    }

    const original = state.fromImage && viewHome.contains(state.fromImage)
      ? state.fromImage
      : viewHome.querySelector('.carouselhero .slide.active img')
        || viewHome.querySelector('.projects-slide img');

    if (original) {
      original.style.visibility = 'hidden';
    }

    const start = hero ? rectOf(hero) : null;
    const clone = hero && start ? createFixedClone(hero, start) : null;
    if (hero) {
      hero.style.visibility = 'hidden';
    }

    const fadeOutProject = prefersReducedMotion()
      ? Promise.resolve()
      : gsap.to(viewProject, { opacity: 0, duration: 0.35, ease: 'power2.inOut' });

    prepareMeasuring(viewHome);
    if (scrollToProjects) {
      const projects = viewHome.querySelector('#projects');
      if (projects) {
        viewHome.scrollTop = Math.max(0, projects.offsetTop);
      }
    } else {
      viewHome.scrollTop = state.homeScrollY;
    }

    const end = original ? rectOf(original) : null;
    const moveImage = clone && end
      ? (prefersReducedMotion()
        ? gsap.set(clone, end)
        : gsap.to(clone, { ...end, duration: IMAGE_DURATION, ease: IMAGE_EASE }))
      : Promise.resolve();

    await Promise.all([fadeOutProject, moveImage]);

    hideView(viewProject);
    gsap.set(viewProject, { opacity: 1 });
    showView(viewHome);
    if (scrollToProjects) {
      const projects = viewHome.querySelector('#projects');
      window.scrollTo(0, projects ? projects.offsetTop : 0);
    } else {
      window.scrollTo(0, state.homeScrollY);
    }
    setHomeScrollTriggers(true);

    if (original) {
      original.style.visibility = '';
    }
    if (clone) {
      clone.remove();
    }

    document.body.dataset.page = 'home';
    setNavActive('home');
    setAboutPortrait(false, { immediate: true });
    const homeTitle = t('meta.homeTitle');
    if (updateHistory) {
      setHistory('home', url, homeTitle);
    } else {
      document.title = homeTitle;
    }
  } catch (error) {
    window.location.href = scrollToProjects ? `${url}#projects` : url;
    return;
  } finally {
    document.body.classList.remove('is-page-transitioning');
    state.busy = false;
  }
}

export function bindProjectChrome(root = document) {
  root.querySelectorAll('[data-project-back]').forEach((button) => {
    if (button.dataset.bound === 'true') return;
    button.dataset.bound = 'true';
    button.addEventListener('click', (event) => {
      event.preventDefault();
      if (window.history.state && window.history.state.view === 'project') {
        window.history.back();
        return;
      }
      goToHome();
    });
  });

  root.querySelectorAll('[data-project-home]').forEach((button) => {
    if (button.dataset.bound === 'true') return;
    button.dataset.bound = 'true';
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const projects = document.querySelector('#projects');
      if (projects && state.handoff.moved) {
        projects.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
        return;
      }
      goToHome({ scrollToProjects: true });
    });
  });
}

async function ensureHomeView() {
  const views = ensureViews();
  if (!views) return null;
  if (!views.viewHome.innerHTML.trim()) {
    const page = await fetchPart('index.html', '#view-home');
    views.viewHome.innerHTML = page.html;
    applyTranslations(views.viewHome);
    bindSiteNav(views.viewHome);
    document.dispatchEvent(new CustomEvent('home-view-ready'));
  }
  return views;
}

async function fillHomePage(homePage) {
  if (!homePage || homePage.innerHTML.trim()) return homePage;
  const page = await fetchPart('index.html', '#home-page');
  homePage.innerHTML = page.html;
  applyTranslations(homePage);
  document.dispatchEvent(new CustomEvent('home-view-ready'));
  return homePage;
}

async function fillAbout(about) {
  if (!about || about.innerHTML.trim()) return about;
  const page = await fetchPart('about.html', '#view-about');
  about.innerHTML = page.html;
  applyTranslations(about);
  return about;
}

async function goHomeFromAbout({ scrollToProjects = false, updateHistory = true } = {}) {
  if (state.busy) return;
  state.busy = true;
  document.body.classList.add('is-page-transitioning');

  try {
    const views = ensureViews();
    const homePage = ensureHomePage(views && views.viewHome);
    const about = document.querySelector('#view-about');
    await fillHomePage(homePage);

    const fadeOutAbout = prefersReducedMotion() || !about
      ? Promise.resolve()
      : gsap.to(about, { opacity: 0, duration: 0.35, ease: 'power2.inOut' });

    await Promise.all([fadeOutAbout, setAboutPortrait(false)]);

    if (about) {
      hideView(about);
      gsap.set(about, { opacity: 1 });
    }
    if (homePage) {
      showView(homePage);
      if (!prefersReducedMotion()) {
        gsap.fromTo(homePage, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
      }
    }

    document.body.dataset.page = 'home';
    setNavActive('home');
    if (scrollToProjects) {
      const projects = document.querySelector('#projects');
      window.scrollTo({
        top: projects ? projects.offsetTop : 0,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    }

    const homeTitle = t('meta.homeTitle');
    if (updateHistory) {
      setHistory('home', 'index.html', homeTitle);
    } else {
      document.title = homeTitle;
    }
  } catch (error) {
    window.location.href = scrollToProjects ? 'index.html#projects' : 'index.html';
    return;
  } finally {
    document.body.classList.remove('is-page-transitioning');
    state.busy = false;
  }
}

export async function goToAbout({ updateHistory = true } = {}) {
  if (state.busy) return;
  if (isAboutVisible()) return;

  const views = ensureViews();
  if (!views) {
    window.location.href = 'about.html';
    return;
  }

  teardownHandoff();
  restoreHandoffToHome();
  state.busy = true;
  document.body.classList.add('is-page-transitioning');

  try {
    const about = ensureAboutSlot(views.viewHome);
    const homePage = document.querySelector('#home-page');
    if (!about) {
      window.location.href = 'about.html';
      return;
    }

    await fillAbout(about);

    const fadeOutHome = prefersReducedMotion() || !homePage
      ? Promise.resolve()
      : gsap.to(homePage, { opacity: 0, duration: 0.35, ease: 'power2.inOut' });

    await Promise.all([fadeOutHome, setAboutPortrait(true)]);

    if (homePage) {
      hideView(homePage);
      gsap.set(homePage, { opacity: 1 });
    }

    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    showView(about);
    const incoming = [...about.querySelectorAll('#about-container > *')];
    if (prefersReducedMotion()) {
      gsap.set(incoming, { opacity: 1, y: 0 });
    } else {
      gsap.set(incoming, { opacity: 0, y: 16 });
      fadeElements(incoming, { to: 1, y: 0, delay: 0.05 });
    }

    document.body.dataset.page = 'about';
    setNavActive('about');
    const aboutTitle = t('meta.aboutTitle');
    if (updateHistory) {
      setHistory('about', 'about.html', aboutTitle);
    } else {
      document.title = aboutTitle;
    }
  } catch (error) {
    window.location.href = 'about.html';
    return;
  } finally {
    document.body.classList.remove('is-page-transitioning');
    state.busy = false;
  }
}

export function bindSiteNav(root = document) {
  root.querySelectorAll('[data-nav="about"]').forEach((button) => {
    if (button.dataset.bound === 'true') return;
    button.dataset.bound = 'true';
    button.addEventListener('click', (event) => {
      event.preventDefault();
      goToAbout();
    });
  });

  root.querySelectorAll('[data-nav="projects"]').forEach((button) => {
    if (button.dataset.bound === 'true') return;
    button.dataset.bound = 'true';
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const homePage = document.querySelector('#home-page');
      const onHome = homePage && !homePage.hidden && !isAboutVisible();
      if (onHome) {
        const projects = document.querySelector('#projects');
        if (projects) {
          projects.scrollIntoView({
            behavior: prefersReducedMotion() ? 'auto' : 'smooth',
            block: 'start',
          });
        }
        return;
      }
      goToHome({ scrollToProjects: true });
    });
  });
}

function getHandoffNodes(viewHome) {
  const projects = viewHome.querySelector('#projects');
  return projects ? [projects] : [];
}

function setProjectsTitleMode(isOther) {
  const title = document.querySelector('#projects-title');
  if (!title) return;
  title.dataset.i18nHtml = isOther ? 'projects.otherTitle' : 'projects.selectedTitle';
  title.classList.remove('text-split-done');
  title.innerHTML = t(title.dataset.i18nHtml);
}

function restoreHandoffToHome({ resetTitle = true } = {}) {
  if (!state.handoff.moved || !state.handoff.placeholder) return;
  const placeholder = state.handoff.placeholder;
  if (placeholder.parentNode) {
    state.handoff.nodes.forEach((node) => {
      placeholder.parentNode.insertBefore(node, placeholder);
    });
    placeholder.remove();
  }
  state.handoff.moved = false;
  state.handoff.nodes = [];
  state.handoff.placeholder = null;
  if (resetTitle) {
    setProjectsTitleMode(false);
  }
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event('resize'));
  });
}

function teardownHandoff() {
  if (state.handoff.onScroll) {
    window.removeEventListener('scroll', state.handoff.onScroll);
    state.handoff.onScroll = null;
  }
  if (state.handoff.onWheel) {
    window.removeEventListener('wheel', state.handoff.onWheel);
    state.handoff.onWheel = null;
  }
  if (state.handoff.onTouchStart) {
    window.removeEventListener('touchstart', state.handoff.onTouchStart);
    state.handoff.onTouchStart = null;
  }
  if (state.handoff.onTouchMove) {
    window.removeEventListener('touchmove', state.handoff.onTouchMove);
    state.handoff.onTouchMove = null;
  }
  if (state.handoff.onKeyDown) {
    window.removeEventListener('keydown', state.handoff.onKeyDown);
    state.handoff.onKeyDown = null;
  }
  if (state.handoff.raf) {
    cancelAnimationFrame(state.handoff.raf);
    state.handoff.raf = 0;
  }
  state.handoff.edgeLocked = false;
  document.body.classList.remove('is-handoff-armed');
}

function getMaxScroll() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

function isAtHandoffEdge() {
  const projects = document.querySelector('#projects');
  if (!projects) return false;
  const rect = projects.getBoundingClientRect();
  const sectionInView = rect.top < window.innerHeight && rect.bottom > 0;
  if (!sectionInView) return false;
  return window.scrollY >= getMaxScroll() - 2 || rect.bottom <= window.innerHeight + 2;
}

function bindHandoffInput() {
  const onScroll = () => {
    state.handoff.edgeLocked = isAtHandoffEdge();
  };

  const onWheel = (event) => {
    if (!state.handoff.moved || state.handoff.committed) return;
    if (event.deltaY <= 0) {
      state.handoff.lastIntent = performance.now();
      return;
    }

    const maxScroll = getMaxScroll();
    const atBottom = window.scrollY >= maxScroll - 2;

    if (!atBottom && window.scrollY + event.deltaY >= maxScroll) {
      event.preventDefault();
      window.scrollTo(0, maxScroll);
      state.handoff.edgeLocked = true;
      state.handoff.lastIntent = performance.now();
      return;
    }

    if (atBottom || state.handoff.edgeLocked) {
      event.preventDefault();
      if (!state.busy && performance.now() - state.handoff.lastIntent > 280) {
        commitHandoff();
      }
      state.handoff.lastIntent = performance.now();
    }
  };

  const onTouchStart = (event) => {
    state.handoff.touchY = event.touches[0].clientY;
  };

  const onTouchMove = (event) => {
    if (!state.handoff.moved || state.handoff.committed) return;
    const currentY = event.touches[0].clientY;
    const goingDown = state.handoff.touchY - currentY > 6;
    if (!goingDown) return;
    if (!isAtHandoffEdge()) return;
    event.preventDefault();
    if (!state.busy && performance.now() - state.handoff.lastIntent > 280) {
      commitHandoff();
    }
    state.handoff.lastIntent = performance.now();
  };

  const onKeyDown = (event) => {
    if (!['ArrowDown', 'PageDown', ' ', 'Spacebar'].includes(event.key)) return;
    if (!state.handoff.moved || state.handoff.committed || state.busy) return;
    if (!isAtHandoffEdge()) return;
    event.preventDefault();
    commitHandoff();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('keydown', onKeyDown);
  state.handoff.onScroll = onScroll;
  state.handoff.onWheel = onWheel;
  state.handoff.onTouchStart = onTouchStart;
  state.handoff.onTouchMove = onTouchMove;
  state.handoff.onKeyDown = onKeyDown;
}

async function commitHandoff() {
  if (state.busy || state.handoff.committed || !state.handoff.moved) return;
  const views = ensureViews();
  const projects = document.querySelector('#projects');
  if (!views || !projects) return;

  state.busy = true;
  state.handoff.committed = true;
  teardownHandoff();

  const title = projects.querySelector('#projects-title');
  const visualTop = projects.getBoundingClientRect().top;

  restoreHandoffToHome({ resetTitle: false });

  hideView(views.viewProject);
  gsap.set(views.viewProject, { opacity: 1 });
  showView(views.viewHome);

  const homeProjects = views.viewHome.querySelector('#projects');
  const placeHomeProjects = () => {
    if (!homeProjects) return;
    window.scrollTo(0, window.scrollY + homeProjects.getBoundingClientRect().top - visualTop);
  };

  placeHomeProjects();
  setHomeScrollTriggers(true);
  placeHomeProjects();
  if (state.fromImage) {
    state.fromImage.style.visibility = '';
  }
  document.body.dataset.page = 'home';
  setNavActive('home');
  setHistory('home', 'index.html', t('meta.homeTitle'));

  if (title) {
    await gsap.to(title, {
      opacity: 0,
      duration: 0.22,
      ease: 'power2.out',
    });
  }

  setProjectsTitleMode(false);
  const nextTitle = document.querySelector('#projects-title');
  if (nextTitle) {
    gsap.fromTo(nextTitle, { opacity: 0 }, {
      opacity: 1,
      duration: 0.35,
      ease: 'power2.out',
    });
  }

  state.busy = false;
}

export async function prepareProjectHandoff() {
  teardownHandoff();
  restoreHandoffToHome();

  const views = await ensureHomeView();
  if (!views) return;

  const slot = views.viewProject.querySelector('[data-projects-handoff]');
  const nodes = getHandoffNodes(views.viewHome);
  if (!slot || !nodes.length) return;

  if (state.fromImage) {
    state.fromImage.style.visibility = '';
  }

  const placeholder = document.createComment('handoff-anchor');
  nodes[0].parentNode.insertBefore(placeholder, nodes[0]);
  nodes.forEach((node) => slot.appendChild(node));

  state.handoff.moved = true;
  state.handoff.committed = false;
  state.handoff.nodes = nodes;
  state.handoff.placeholder = placeholder;
  state.handoff.edgeLocked = false;
  state.handoff.lastIntent = performance.now();
  setProjectsTitleMode(true);

  bindHandoffInput();
  document.body.classList.add('is-handoff-armed');
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event('resize'));
  });
}

function detectInitialView() {
  const path = window.location.pathname;
  if (path.includes('project-details') || document.querySelector('#project-details-container')) {
    return 'project';
  }
  if (path.includes('about') || (isAboutVisible() && document.querySelector('#home-page')?.hidden)) {
    return 'about';
  }
  return 'home';
}

export function initPageTransitions() {
  const views = ensureViews();
  bindProjectChrome();
  bindSiteNav();

  const initialView = detectInitialView();
  if (!window.history.state || !window.history.state.view) {
    window.history.replaceState({ view: initialView }, document.title);
  }

  if (initialView === 'project') {
    prepareProjectHandoff();
  } else if (initialView === 'about') {
    setAboutPortrait(true, { immediate: true });
    setNavActive('about');
  } else {
    setNavActive('home');
  }

  window.addEventListener('popstate', (event) => {
    const view = event.state && event.state.view;
    if (view === 'project') {
      const image = state.fromImage
        || document.querySelector('.carouselhero .slide.active img')
        || document.querySelector('.projects-slide img');
      if (image) {
        goToProject({ image, url: window.location.href, updateHistory: false });
      }
      return;
    }
    if (view === 'about') {
      goToAbout({ updateHistory: false });
      return;
    }
    const onHome = views && views.viewProject && views.viewProject.hidden && !isAboutVisible();
    if (onHome) {
      return;
    }
    goToHome({ updateHistory: false });
  });
}
