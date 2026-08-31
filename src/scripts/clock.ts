const ZONE = 'America/Argentina/Buenos_Aires';

let timer: number | undefined;

/**
 * La hora se pinta en el cliente porque el sitio es estático: la del build
 * sería la de CI, no la de Santa Fe. Un solo intervalo sobrevive a las
 * navegaciones de ClientRouter; si no, cada vista dejaría un ticker atrás.
 */
export function initClock(): void {
  const nodes = document.querySelectorAll<HTMLTimeElement>('[data-clock]');
  if (!nodes.length) {
    window.clearInterval(timer);
    timer = undefined;
    return;
  }

  const format = new Intl.DateTimeFormat(document.documentElement.lang === 'es' ? 'es-AR' : 'en-GB', {
    timeZone: ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });

  const paint = (): void => {
    const now = new Date();
    const label = format.format(now);

    nodes.forEach((el) => {
      el.textContent = label;
      el.dateTime = now.toISOString();
    });
  };

  paint();
  window.clearInterval(timer);
  timer = window.setInterval(paint, 1000);
}
