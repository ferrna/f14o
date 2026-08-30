/** Preferencias del entorno que condicionan toda la capa de motion. */

export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = (): boolean => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** La intro completa corre una sola vez por sesión. */
const INTRO_KEY = 'fa:intro-played';

export const introAlreadyPlayed = (): boolean => {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1';
  } catch {
    return false;
  }
};

export const markIntroPlayed = (): void => {
  try {
    sessionStorage.setItem(INTRO_KEY, '1');
  } catch {
    // Modo privado sin sessionStorage: la intro vuelve a correr, no es crítico.
  }
};
