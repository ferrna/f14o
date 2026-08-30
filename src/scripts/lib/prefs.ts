/** Preferencias del entorno que condicionan toda la capa de motion. */

export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = (): boolean => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
