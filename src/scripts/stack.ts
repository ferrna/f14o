import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COLOR, EASE, REVEAL, STAGGER } from './lib/tokens';
import { prefersReducedMotion } from './lib/prefs';

gsap.registerPlugin(ScrollTrigger);

type View = 'prose' | 'index';

type IndexView = {
  root: HTMLElement | null;
  reset: () => void;
  play: () => void;
};

/**
 * Phrase: las cinco líneas arrancan apagadas y se encienden una por una
 * atadas al scroll. El subrayado marca la línea que se está encendiendo.
 *
 * Index: las mismas tools en cuatro columnas. Las reglas se dibujan y
 * los nombres entran en cascada, 40ms entre ítem.
 */
export function initStack(): void {
  const section = document.querySelector<HTMLElement>('[data-stack]');
  if (!section) return;

  const reduced = prefersReducedMotion();
  const prose = bindProse(section, reduced);
  const index = bindIndex(section, reduced);

  bindSwitch(section, prose, index);
  enterExperience(reduced);
}

function bindProse(section: HTMLElement, reduced: boolean): ScrollTrigger | null {
  const sentence = section.querySelector<HTMLElement>('[data-stack-sentence]');
  const statement = section.querySelector<HTMLElement>('[data-stack-statement]');
  const lines = Array.from(section.querySelectorAll<HTMLElement>('[data-stack-line]'));
  if (!sentence || !lines.length) return null;

  const tools = lines.map((line) => Array.from(line.querySelectorAll<HTMLElement>('[data-stack-tool]')));
  const marks = lines.map((line) => Array.from(line.querySelectorAll<HTMLElement>('[data-stack-mark]')));

  if (reduced) {
    gsap.set(lines, { color: COLOR.muted });
    tools.forEach((group) => gsap.set(group, { color: COLOR.creamBright }));
    marks.forEach((group) => gsap.set(group, { scaleX: 0 }));
    gsap.set(statement, { opacity: 1, y: 0 });
    return null;
  }

  gsap.set(lines, { color: COLOR.subtle });
  tools.forEach((group) => gsap.set(group, { color: COLOR.subtle }));
  marks.forEach((group) => gsap.set(group, { scaleX: 0, transformOrigin: 'left center' }));
  if (statement) gsap.set(statement, { opacity: 0, y: 8 });

  const tl = gsap.timeline({
    defaults: { ease: EASE.linear },
    scrollTrigger: {
      trigger: section,
      start: 'top 72%',
      end: 'bottom 42%',
      scrub: 0.55,
    },
  });

  const step = 1 / lines.length;

  lines.forEach((_, i) => {
    const at = i * step;
    tl.to(lines[i], { color: COLOR.muted, duration: step * 0.45 }, at);
    if (tools[i]?.length) {
      tl.to(tools[i], { color: COLOR.creamBright, duration: step * 0.45 }, at);
    }
    if (marks[i]?.length) {
      tl.to(marks[i], { scaleX: 1, duration: step * 0.2 }, at);
      tl.to(marks[i], { scaleX: 0, duration: step * 0.15 }, at + step * 0.55);
    }
  });

  if (statement) {
    tl.to(statement, { opacity: 1, y: 0, duration: step * 0.6, ease: EASE.outSoft }, 1 - step);
  }

  return tl.scrollTrigger ?? null;
}

function bindIndex(section: HTMLElement, reduced: boolean): IndexView {
  const root = section.querySelector<HTMLElement>('[data-stack-index]');
  const cols = Array.from(section.querySelectorAll<HTMLElement>('[data-stack-col]'));
  const rules = cols.map((col) => col.querySelector<HTMLElement>('[data-stack-rule]'));
  const names = cols.map((col) => col.querySelector<HTMLElement>('[data-stack-col-name]'));
  const items = cols.flatMap((col) => Array.from(col.querySelectorAll<HTMLElement>('[data-stack-col-tool]')));
  const ids = cols.map((col) => col.querySelector<HTMLElement>('.stack__col-id'));

  const reset = (): void => {
    gsap.set(rules, { scaleX: reduced ? 1 : 0, transformOrigin: 'left center' });
    gsap.set([...names, ...items, ...ids], { opacity: reduced ? 1 : 0, y: reduced ? 0 : 10 });
  };

  const play = (): void => {
    if (reduced) {
      gsap.set(rules, { scaleX: 1 });
      gsap.set([...names, ...items, ...ids], { opacity: 1, y: 0 });
      return;
    }

    gsap
      .timeline({ defaults: { ease: EASE.outSoft } })
      .to(rules, { scaleX: 1, duration: REVEAL.ruleDraw, stagger: 0.06 }, 0)
      .to(ids, { opacity: 1, y: 0, duration: REVEAL.dur, stagger: 0.06 }, 0.08)
      .to(names, { opacity: 1, y: 0, duration: REVEAL.dur, stagger: 0.06 }, 0.14)
      .to(items, { opacity: 1, y: 0, duration: REVEAL.dur, stagger: STAGGER.rows }, 0.22);
  };

  reset();
  return { root, reset, play };
}

function bindSwitch(section: HTMLElement, prose: ScrollTrigger | null, index: IndexView): void {
  const button = section.querySelector<HTMLButtonElement>('[data-stack-switch]');
  const proseRoot = section.querySelector<HTMLElement>('[data-stack-prose]');
  if (!button) return;

  const toIndex = button.dataset.toIndex ?? '';
  const toProse = button.dataset.toProse ?? '';

  const setView = (view: View): void => {
    if (section.dataset.view === view) return;

    section.dataset.view = view;
    button.setAttribute('aria-pressed', String(view === 'index'));
    button.setAttribute('aria-label', view === 'index' ? toProse : toIndex);

    if (view === 'index') {
      prose?.disable();
      if (proseRoot) proseRoot.hidden = true;
      if (index.root) index.root.hidden = false;
      index.reset();
      index.play();
      return;
    }

    if (index.root) index.root.hidden = true;
    if (proseRoot) proseRoot.hidden = false;
    prose?.enable();
    ScrollTrigger.refresh();
  };

  button.addEventListener('click', (event) => {
    const picked = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-mode]')?.dataset.mode as
      | View
      | undefined;
    setView(picked ?? (section.dataset.view === 'index' ? 'prose' : 'index'));
  });
}

function enterExperience(reduced: boolean): void {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-xp-item]'));
  if (!items.length) return;

  const rules = items.flatMap((item) => Array.from(item.querySelectorAll<HTMLElement>('[data-xp-rule]')));

  if (reduced) {
    gsap.set(items, { opacity: 1, y: 0 });
    gsap.set(rules, { scaleX: 1 });
    return;
  }

  gsap.set(items, { opacity: 0, y: REVEAL.shift });
  gsap.set(rules, { scaleX: 0, transformOrigin: 'left center' });

  const trigger = items[0]?.closest('section') ?? items[0];

  gsap
    .timeline({
      defaults: { ease: EASE.outSoft },
      scrollTrigger: { trigger, start: REVEAL.trigger, once: true },
    })
    .to(items, { opacity: 1, y: 0, duration: REVEAL.dur, stagger: STAGGER.blocks }, 0)
    .to(rules, { scaleX: 1, duration: REVEAL.ruleDraw, stagger: STAGGER.blocks }, 0.16);
}
