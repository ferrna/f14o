import { gsap } from 'gsap';

export function initCursor() {
  const cursor = document.querySelector('[data-cursor]');
  if (!cursor) return;

  const ring = cursor.querySelector('.cursor-ring');
  const dot = cursor.querySelector('.cursor-dot');
  const label = cursor.querySelector('[data-cursor-label]');

  // Disable completely on devices without hover support
  if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) {
    cursor.style.display = 'none';
    return;
  }

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isHovered = false;
  let activeState = null;
  let isVisible = false;

  const setDotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power2.out' });
  const setDotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power2.out' });

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      cursor.classList.add('is-visible');
      ringX = mouseX;
      ringY = mouseY;
    }

    setDotX(mouseX);
    setDotY(mouseY);
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    isVisible = false;
    cursor.classList.remove('is-visible');
  });

  document.addEventListener('mouseenter', () => {
    isVisible = true;
    cursor.classList.add('is-visible');
  });

  // Smooth lerp loop for the trailing ring
  const lerp = (start, end, factor) => start + (end - start) * factor;

  function render() {
    if (isVisible) {
      ringX = lerp(ringX, mouseX, 0.18);
      ringY = lerp(ringY, mouseY, 0.18);
      gsap.set(ring, { x: ringX, y: ringY });
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  function setCursorMode(mode, text = '') {
    if (activeState === mode && label.textContent === text) return;
    activeState = mode;

    cursor.className = 'cursor is-visible' + (mode ? ` cursor--${mode}` : '');
    if (label) {
      label.textContent = text;
    }
  }

  // Event delegation for responsive hover states across dynamic DOM updates
  document.addEventListener('mouseover', (e) => {
    const target = e.target;

    // Check project carousel slide
    const slide = target.closest('.projects-slide, .carouselhero .slide');
    if (slide) {
      if (slide.classList.contains('active')) {
        setCursorMode('project', 'VIEW');
      } else {
        setCursorMode('drag', 'DRAG');
      }
      return;
    }

    // Check carousel navigation or container
    const carousel = target.closest('[data-carousel-hero]');
    if (carousel && !target.closest('button')) {
      setCursorMode('drag', 'DRAG');
      return;
    }

    // Check Hello Worm
    const worm = target.closest('.hello-worm-visual, .hero-image');
    if (worm) {
      setCursorMode('worm', '3D');
      return;
    }

    // Check interactive links, buttons, pills
    const interactive = target.closest('a, button, [role="button"], .tech-pill, .experience-item, .contact-btn-primary, .contact-btn-secondary, .contact-social-link');
    if (interactive) {
      setCursorMode('hover');
      return;
    }

    // Default state
    setCursorMode(null);
  });
}
