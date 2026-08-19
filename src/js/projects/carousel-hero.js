import { goToProject } from '../ui-elements/page-transition.js';
import { t } from '../i18n/i18n.js';

const MOBILE_QUERY = '(max-width: 1024px)';
const TRANSITION_MS = 300;

function isMobileViewport() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function slideMetrics() {
  const mobile = isMobileViewport();
  return {
    mobile,
    slidesGap: mobile ? 16 : 48,
    inactiveSlideWidth: mobile ? 300 : 657,
    slidesWidth: mobile ? 327 : 753,
  };
}

function readPx(styles, name, fallback) {
  const value = parseFloat(styles.getPropertyValue(name));
  return Number.isFinite(value) ? value : fallback;
}

export class CarouselHero {
  constructor(root = document.querySelector('[data-carousel-hero]')) {
    if (!root || root.dataset.carouselReady === 'true') return;

    this.root = root;
    this.track = root.querySelector('[data-carousel-track]');
    this.touchSurface = root.querySelector('[data-carousel-touch]');
    this.dotsWrap = root.querySelector('[data-carousel-dots]');
    this.prevButton = root.querySelector('[data-carousel-prev]');
    this.nextButton = root.querySelector('[data-carousel-next]');

    this.originalSlides = [...this.track.querySelectorAll(':scope > .slide')];
    if (!this.originalSlides.length) return;

    this.currentSlide = this.originalSlides.length > 1 ? 1 : 0;
    this.containerOffset = 0;
    this.swipeOffset = 0;
    this.touchStart = null;
    this.touchEnd = null;
    this.isTransitioning = false;
    this.transitionTime = '0.3s';
    this.didSwipe = false;
    this.loopTimer = 0;

    this.cloneEdges();
    this.slides = [...this.track.querySelectorAll(':scope > .slide')];
    this.buildDots();
    this.bind();
    this.scheduleMeasure();
    this.root.dataset.carouselReady = 'true';
  }

  cloneEdges() {
    if (this.originalSlides.length < 2) return;
    const first = this.originalSlides[0].cloneNode(true);
    const last = this.originalSlides[this.originalSlides.length - 1].cloneNode(true);
    first.classList.remove('projects-slide');
    last.classList.remove('projects-slide');
    first.setAttribute('aria-hidden', 'true');
    last.setAttribute('aria-hidden', 'true');
    this.track.insertBefore(last, this.track.firstChild);
    this.track.appendChild(first);
  }

  buildDots() {
    if (!this.dotsWrap) return;
    this.dotsWrap.replaceChildren();
    this.originalSlides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'thumbnail';
      dot.setAttribute('aria-label', `${t('projects.slide')} ${index + 1}`);
      dot.addEventListener('click', () => {
        this.transitionTime = '0.3s';
        this.currentSlide = index + (this.originalSlides.length > 1 ? 1 : 0);
        this.update();
      });
      this.dotsWrap.appendChild(dot);
    });
  }

  bind() {
    this.prevButton?.addEventListener('click', () => this.changeSlide('left'));
    this.nextButton?.addEventListener('click', () => this.changeSlide('right'));

    this.track.addEventListener('click', (event) => this.handleSlideClick(event));

    this.touchSurface?.addEventListener('touchstart', (event) => this.onTouchStart(event), { passive: true });
    this.touchSurface?.addEventListener('touchmove', (event) => this.onTouchMove(event), { passive: true });
    this.touchSurface?.addEventListener('touchend', () => this.onTouchEnd());

    this.onResize = () => this.scheduleMeasure();
    window.addEventListener('resize', this.onResize);

    this.resizeObserver = new ResizeObserver(() => this.scheduleMeasure());
    this.resizeObserver.observe(this.touchSurface || this.root);

    this.onLang = () => this.buildDots();
    document.addEventListener('portfolio:lang', this.onLang);
  }

  scheduleMeasure() {
    this.measure();
    this.update();
  }

  measure() {
    const fallback = slideMetrics();
    const styles = getComputedStyle(this.root);
    const trackStyles = getComputedStyle(this.track);
    const viewport = this.touchSurface || this.track.parentElement;
    const viewportWidth = viewport?.clientWidth || 0;

    this.slidesWidth = readPx(styles, '--slide-width', fallback.slidesWidth);
    this.inactiveSlideWidth = readPx(styles, '--slide-width-inactive', fallback.inactiveSlideWidth);
    this.slidesGap = parseFloat(trackStyles.gap) || fallback.slidesGap;
    this.containerOffset = viewportWidth ? (viewportWidth - this.slidesWidth) / 2 : 0;
  }

  realIndex() {
    const count = this.originalSlides.length;
    if (count <= 1) return 0;
    if (this.currentSlide === 0) return count - 1;
    if (this.currentSlide === this.slides.length - 1) return 0;
    return this.currentSlide - 1;
  }

  translateX() {
    const swipe = isMobileViewport() ? this.swipeOffset : 0;
    const step = (this.inactiveSlideWidth || 0) + (this.slidesGap || 0);
    return -step * this.currentSlide + this.containerOffset - swipe;
  }

  update() {
    this.slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === this.currentSlide);
    });

    this.track.style.transition = `transform ${this.transitionTime} ease-out`;
    this.track.style.transform = `translateX(${this.translateX()}px)`;

    const real = this.realIndex();
    this.dotsWrap?.querySelectorAll('.thumbnail').forEach((dot, index) => {
      dot.classList.toggle('active', index === real);
    });

    if (!this.isTransitioning) return;

    const last = this.slides.length - 1;
    if (this.currentSlide === last || this.currentSlide === 0) {
      window.clearTimeout(this.loopTimer);
      this.loopTimer = window.setTimeout(() => {
        this.isTransitioning = false;
        this.currentSlide = this.currentSlide === 0 ? last - 1 : 1;
        this.transitionTime = '0s';
        this.update();
      }, TRANSITION_MS);
    } else {
      this.isTransitioning = false;
    }
  }

  changeSlide(direction) {
    if (this.originalSlides.length < 2 || this.isTransitioning) return;
    this.isTransitioning = true;
    this.transitionTime = '0.3s';
    this.currentSlide += direction === 'left' ? -1 : 1;
    this.update();
  }

  handleSlideClick(event) {
    if (this.didSwipe) {
      event.preventDefault();
      return;
    }

    const slide = event.target.closest('.slide');
    if (!slide) return;

    const index = this.slides.indexOf(slide);
    if (index !== this.currentSlide) {
      event.preventDefault();
      if (index < this.currentSlide) this.changeSlide('left');
      else this.changeSlide('right');
      return;
    }

    const link = slide.querySelector('a');
    const image = slide.querySelector('img');
    if (!link || !image) return;
    event.preventDefault();
    goToProject({ image, url: link.href });
  }

  onTouchStart(event) {
    this.touchEnd = null;
    this.touchStart = event.targetTouches[0].clientX;
    this.swipeOffset = 0;
    this.didSwipe = false;
    this.transitionTime = '0s';
    this.update();
  }

  onTouchMove(event) {
    if (this.touchStart == null) return;
    const currentTouch = event.targetTouches[0].clientX;
    this.touchEnd = currentTouch;
    this.swipeOffset = this.touchStart - currentTouch;
    this.update();
  }

  onTouchEnd() {
    this.transitionTime = '0.3s';
    if (this.touchStart == null || this.touchEnd == null) {
      this.swipeOffset = 0;
      this.update();
      return;
    }

    const distance = this.touchStart - this.touchEnd;
    if (Math.abs(distance) > 50) {
      this.didSwipe = true;
      this.changeSlide(distance > 0 ? 'right' : 'left');
    }

    this.swipeOffset = 0;
    this.touchStart = null;
    this.touchEnd = null;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.transitionTime = '0.3s';
        if (!this.didSwipe) this.update();
      });
    });
  }
}

export function initCarouselHero(root) {
  const nested = root?.querySelector?.('[data-carousel-hero]');
  const target = nested
    || (root?.matches?.('[data-carousel-hero]') ? root : null)
    || document.querySelector('[data-carousel-hero]');
  if (!target) return;
  new CarouselHero(target);
}
