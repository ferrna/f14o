/**
 * Espejo en TypeScript de los tokens de motion definidos en _tokens.scss.
 * Sostener los dos lados en sincronía es deliberado: GSAP necesita números,
 * y leerlos del CSS en runtime obligaría a un reflow por cada animación.
 */

export const EASE = {
  outSoft: 'power3.out', // equivale a cubic-bezier(0.22, 1, 0.36, 1)
  inOutMat: 'power2.inOut', // equivale a cubic-bezier(0.65, 0, 0.35, 1)
  micro: 'power2.out',
  linear: 'none',
} as const;

export const DUR = {
  micro: 0.2,
  short: 0.35,
  base: 0.6,
  long: 0.9,
  intro: 1.8,
} as const;

export const STAGGER = {
  chars: 0.028,
  rows: 0.04,
  blocks: 0.12,
  menuItems: 0.06,
} as const;

export const REVEAL = {
  shift: 16,
  dur: 0.4,
  ruleDraw: 0.6,
  trigger: 'top 75%',
} as const;

/** Sólo los colores que GSAP necesita interpolar; el resto vive en el CSS. */
export const COLOR = {
  muted: '#a89c8c',
  subtle: '#776c60',
  creamBright: '#f7f0e5',
  violet: '#7b61ff',
} as const;

export const CURTAIN = {
  in: 0.4,
  holdMax: 0.4,
  out: 0.5,
} as const;

export const CURSOR = {
  lerp: 0.18,
} as const;

export const SCULPTURE = {
  rotateX: 14,
  rotateY: 18,
  follow: 0.6,
} as const;
