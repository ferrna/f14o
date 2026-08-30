import { gsap } from 'gsap';
import { EASE, SCULPTURE } from './lib/tokens';
import { hasFinePointer, prefersReducedMotion } from './lib/prefs';

/**
 * El parallax alcanza para que la pieza se sienta viva y está lo bastante
 * contenido para que no parezca un juguete. En About se suma una rotación
 * continua tan lenta que sólo se percibe si te quedás mirando.
 */
export function initSculpture(scope: ParentNode = document): void {
  if (prefersReducedMotion()) return;

  scope.querySelectorAll<HTMLElement>('[data-sculpture]').forEach((el) => {
    if (el.dataset.sculpture === 'about') {
      // Con un asset 2D una rotación completa se leería como una calcomanía
      // girando. Una deriva lenta y asimétrica da presencia sin delatar que
      // no hay volumen real detrás.
      const img = el.querySelector('img');
      gsap.to(img, { y: -14, duration: 7.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to(img, { rotate: 2.5, duration: 11, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }

    if (!hasFinePointer()) return;

    const stage = el.closest<HTMLElement>('[data-sculpture-stage]') ?? el.parentElement;
    if (!stage) return;

    const opts = { duration: SCULPTURE.follow, ease: EASE.micro };
    const setRotX = gsap.quickTo(el, 'rotationX', opts);
    const setRotY = gsap.quickTo(el, 'rotationY', opts);
    const setX = gsap.quickTo(el, 'x', opts);
    const setY = gsap.quickTo(el, 'y', opts);

    gsap.set(el, { transformPerspective: 1200 });

    stage.addEventListener(
      'pointermove',
      (event) => {
        const rect = stage.getBoundingClientRect();
        const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

        setRotX(-ny * SCULPTURE.rotateX);
        setRotY(nx * SCULPTURE.rotateY);
        setX(nx * 14);
        setY(ny * 14);
      },
      { passive: true }
    );

    stage.addEventListener('pointerleave', () => {
      setRotX(0);
      setRotY(0);
      setX(0);
      setY(0);
    });
  });
}
