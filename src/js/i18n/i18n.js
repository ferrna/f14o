import { translations } from './translations.js';

const STORAGE_KEY = 'portfolio-lang';
const SUPPORTED = ['en', 'es'];

let currentLang = detectLanguage();
let bound = false;
let applied = false;

function detectLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (SUPPORTED.includes(saved)) return saved;
  } catch {
    // Ignore storage access errors.
  }

  const locale = (navigator.language || 'en').toLowerCase();
  return locale.startsWith('es') ? 'es' : 'en';
}

export function getLanguage() {
  return currentLang;
}

export function t(key, lang = currentLang) {
  const dict = translations[lang] || translations.en;
  return dict[key] ?? translations.en[key] ?? key;
}

function currentViewName() {
  const stateView = window.history.state && window.history.state.view;
  if (stateView) return stateView;
  if (document.body.dataset.page) return document.body.dataset.page;
  const viewProject = document.querySelector('#view-project');
  if (viewProject && !viewProject.hidden) return 'project';
  const viewAbout = document.querySelector('#view-about');
  if (viewAbout && !viewAbout.hidden) return 'about';
  return 'home';
}

function applyAttributeTranslations(el, lang) {
  el.dataset.i18nAttr.split(',').forEach((pair) => {
    const [attr, key] = pair.split(':').map((part) => part.trim());
    if (!attr || !key) return;
    el.setAttribute(attr, t(key, lang));
  });
}

function updateDocumentTitle() {
  const view = currentViewName();
  const titleKey = view === 'project'
    ? 'meta.projectTitle'
    : view === 'about'
      ? 'meta.aboutTitle'
      : 'meta.homeTitle';
  document.title = t(titleKey);
}

function updateLangSwitchers(root) {
  root.querySelectorAll('[data-lang-switcher]').forEach((switcher) => {
    switcher.querySelectorAll('[data-lang]').forEach((button) => {
      const active = button.dataset.lang === currentLang;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  });
}

export function applyTranslations(root = document) {
  const lang = currentLang;
  document.documentElement.lang = lang;

  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n, lang);
  });

  root.querySelectorAll('[data-i18n-html]').forEach((el) => {
    el.classList.remove('text-split-done');
    el.innerHTML = t(el.dataset.i18nHtml, lang);
  });

  root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    applyAttributeTranslations(el, lang);
  });

  updateLangSwitchers(root);
  if (root === document || root === document.documentElement || root === document.body) {
    updateDocumentTitle();
  }
  applied = true;
}

export function setLanguage(lang) {
  if (!SUPPORTED.includes(lang) || lang === currentLang) return;
  currentLang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Ignore storage access errors.
  }
  applyTranslations();
  document.dispatchEvent(new CustomEvent('portfolio:lang', { detail: { lang } }));
}

export function initI18n() {
  if (!applied) applyTranslations();

  if (bound) return;
  bound = true;

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-lang]');
    if (!button) return;
    event.preventDefault();
    setLanguage(button.dataset.lang);
  });
}

if (document.readyState !== 'loading') {
  applyTranslations();
}
