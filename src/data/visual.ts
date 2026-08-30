/**
 * Ajustes visuales que no son contenido: se cambian acá, no en los
 * componentes. intensity 0 es invisible; 1 es el vidrio denso del primer corte.
 */
export const glass = {
  enabled: true,
  intensity: 0.45,
};

export function glassVars(config = glass): string {
  if (!config.enabled || config.intensity <= 0) {
    return [
      '--glass-on: 0',
      '--glass-blur: 0px',
      '--glass-alpha: 0',
      '--glass-hero-blur: 0px',
      '--glass-hero-alpha: 0',
    ].join('; ');
  }

  const t = Math.min(1, Math.max(0, config.intensity));

  return [
    '--glass-on: 1',
    `--glass-blur: ${(6 + t * 6).toFixed(1)}px`,
    `--glass-alpha: ${(0.04 + t * 0.14).toFixed(3)}`,
    `--glass-hero-blur: ${(8 + t * 12).toFixed(1)}px`,
    `--glass-hero-alpha: ${(0.1 + t * 0.28).toFixed(3)}`,
  ].join('; ');
}

export function glassMode(config = glass): 'on' | 'off' {
  return config.enabled && config.intensity > 0 ? 'on' : 'off';
}
