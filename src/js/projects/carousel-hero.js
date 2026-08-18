import { goToProject } from '../ui-elements/page-transition.js';
import { t } from '../i18n/i18n.js';

const MOBILE_QUERY = '(max-width: 1024px)';
const TRANSITION_MS = 300;

const ICONS = {
  expand: '<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6.69325 9.36016L3.16659 12.8935V11.8335C3.16659 11.6567 3.09635 11.4871 2.97132 11.3621C2.8463 11.2371 2.67673 11.1668 2.49992 11.1668C2.32311 11.1668 2.15354 11.2371 2.02851 11.3621C1.90349 11.4871 1.83325 11.6567 1.83325 11.8335V14.5002C1.83431 14.5873 1.85242 14.6733 1.88659 14.7535C1.95424 14.9164 2.08369 15.0458 2.24659 15.1135C2.32673 15.1477 2.4128 15.1658 2.49992 15.1668H5.16658C5.3434 15.1668 5.51297 15.0966 5.63799 14.9716C5.76301 14.8465 5.83325 14.677 5.83325 14.5002C5.83325 14.3234 5.76301 14.1538 5.63799 14.0288C5.51297 13.9037 5.3434 13.8335 5.16658 13.8335H4.10659L7.63992 10.3068C7.76545 10.1813 7.83598 10.011 7.83598 9.8335C7.83598 9.65596 7.76545 9.4857 7.63992 9.36016C7.51438 9.23463 7.34412 9.1641 7.16658 9.1641C6.98905 9.1641 6.81879 9.23463 6.69325 9.36016ZM4.10659 3.16683H5.16658C5.3434 3.16683 5.51297 3.09659 5.63799 2.97157C5.76301 2.84654 5.83325 2.67697 5.83325 2.50016C5.83325 2.32335 5.76301 2.15378 5.63799 2.02876C5.51297 1.90373 5.3434 1.8335 5.16658 1.8335H2.49992C2.4128 1.83455 2.32673 1.85267 2.24659 1.88683C2.08369 1.95448 1.95424 2.08393 1.88659 2.24683C1.85242 2.32698 1.83431 2.41304 1.83325 2.50016V5.16683C1.83325 5.34364 1.90349 5.51321 2.02851 5.63823C2.15354 5.76326 2.32311 5.8335 2.49992 5.8335C2.67673 5.8335 2.8463 5.76326 2.97132 5.63823C3.09635 5.51321 3.16659 5.34364 3.16659 5.16683V4.10683L6.69325 7.64016C6.75523 7.70265 6.82896 7.75224 6.9102 7.78609C6.99144 7.81994 7.07858 7.83736 7.16658 7.83736C7.25459 7.83736 7.34173 7.81994 7.42297 7.78609C7.50421 7.75224 7.57794 7.70265 7.63992 7.64016C7.7024 7.57819 7.752 7.50445 7.78585 7.42321C7.81969 7.34197 7.83712 7.25484 7.83712 7.16683C7.83712 7.07882 7.81969 6.99168 7.78585 6.91044C7.752 6.82921 7.7024 6.75547 7.63992 6.6935L4.10659 3.16683ZM14.4999 11.1668C14.3231 11.1668 14.1535 11.2371 14.0285 11.3621C13.9035 11.4871 13.8333 11.6567 13.8333 11.8335V12.8935L10.3066 9.36016C10.181 9.23463 10.0108 9.1641 9.83325 9.1641C9.65572 9.1641 9.48545 9.23463 9.35992 9.36016C9.23438 9.4857 9.16386 9.65596 9.16386 9.8335C9.16386 10.011 9.23438 10.1813 9.35992 10.3068L12.8933 13.8335H11.8333C11.6564 13.8335 11.4869 13.9037 11.3618 14.0288C11.2368 14.1538 11.1666 14.3234 11.1666 14.5002C11.1666 14.677 11.2368 14.8465 11.3618 14.9716C11.4869 15.0966 11.6564 15.1668 11.8333 15.1668H14.4999C14.587 15.1658 14.6731 15.1477 14.7533 15.1135C14.9162 15.0458 15.0456 14.9164 15.1133 14.7535C15.1474 14.6733 15.1655 14.5873 15.1666 14.5002V11.8335C15.1666 11.6567 15.0963 11.4871 14.9713 11.3621C14.8463 11.2371 14.6767 11.1668 14.4999 11.1668ZM15.1133 2.24683C15.0456 2.08393 14.9162 1.95448 14.7533 1.88683C14.6731 1.85267 14.587 1.83455 14.4999 1.8335H11.8333C11.6564 1.8335 11.4869 1.90373 11.3618 2.02876C11.2368 2.15378 11.1666 2.32335 11.1666 2.50016C11.1666 2.67697 11.2368 2.84654 11.3618 2.97157C11.4869 3.09659 11.6564 3.16683 11.8333 3.16683H12.8933L9.35992 6.6935C9.29743 6.75547 9.24784 6.82921 9.21399 6.91044C9.18014 6.99168 9.16272 7.07882 9.16272 7.16683C9.16272 7.25484 9.18014 7.34197 9.21399 7.42321C9.24784 7.50445 9.29743 7.57819 9.35992 7.64016C9.42189 7.70265 9.49563 7.75224 9.57687 7.78609C9.65811 7.81994 9.74524 7.83736 9.83325 7.83736C9.92126 7.83736 10.0084 7.81994 10.0896 7.78609C10.1709 7.75224 10.2446 7.70265 10.3066 7.64016L13.8333 4.10683V5.16683C13.8333 5.34364 13.9035 5.51321 14.0285 5.63823C14.1535 5.76326 14.3231 5.8335 14.4999 5.8335C14.6767 5.8335 14.8463 5.76326 14.9713 5.63823C15.0963 5.51321 15.1666 5.34364 15.1666 5.16683V2.50016C15.1655 2.41304 15.1474 2.32698 15.1133 2.24683Z" fill="currentColor"/></svg>',
  zoomIn: '<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M9.99994 7.1666H7.99994V5.1666C7.99994 4.98979 7.9297 4.82022 7.80467 4.6952C7.67965 4.57017 7.51008 4.49994 7.33327 4.49994C7.15646 4.49994 6.98689 4.57017 6.86187 4.6952C6.73684 4.82022 6.6666 4.98979 6.6666 5.1666V7.1666H4.6666C4.48979 7.1666 4.32022 7.23684 4.1952 7.36187C4.07017 7.48689 3.99994 7.65646 3.99994 7.83327C3.99994 8.01008 4.07017 8.17965 4.1952 8.30467C4.32022 8.4297 4.48979 8.49994 4.6666 8.49994H6.6666V10.4999C6.6666 10.6767 6.73684 10.8463 6.86187 10.9713C6.98689 11.0964 7.15646 11.1666 7.33327 11.1666C7.51008 11.1666 7.67965 11.0964 7.80467 10.9713C7.9297 10.8463 7.99994 10.6767 7.99994 10.4999V8.49994H9.99994C10.1767 8.49994 10.3463 8.4297 10.4713 8.30467C10.5964 8.17965 10.6666 8.01008 10.6666 7.83327C10.6666 7.65646 10.5964 7.48689 10.4713 7.36187C10.3463 7.23684 10.1767 7.1666 9.99994 7.1666ZM14.4733 14.0266L11.9999 11.5733C12.96 10.3762 13.4249 8.8568 13.2991 7.32747C13.1733 5.79814 12.4664 4.37512 11.3236 3.35103C10.1808 2.32694 8.68914 1.77961 7.15522 1.82158C5.62129 1.86356 4.16175 2.49164 3.0767 3.5767C1.99164 4.66175 1.36356 6.12129 1.32158 7.65522C1.27961 9.18914 1.82694 10.6808 2.85103 11.8236C3.87512 12.9664 5.29814 13.6733 6.82747 13.7991C8.3568 13.9249 9.87621 13.46 11.0733 12.4999L13.5266 14.9533C13.5886 15.0158 13.6623 15.0654 13.7436 15.0992C13.8248 15.133 13.9119 15.1505 13.9999 15.1505C14.0879 15.1505 14.1751 15.133 14.2563 15.0992C14.3376 15.0654 14.4113 15.0158 14.4733 14.9533C14.5934 14.829 14.6606 14.6628 14.6606 14.4899C14.6606 14.317 14.5934 14.1509 14.4733 14.0266ZM7.33327 12.4999C6.41029 12.4999 5.50804 12.2262 4.74061 11.7135C3.97318 11.2007 3.37504 10.4718 3.02183 9.61913C2.66862 8.7664 2.57621 7.82809 2.75627 6.92285C2.93634 6.0176 3.38079 5.18608 4.03344 4.53344C4.68608 3.88079 5.5176 3.43634 6.42285 3.25627C7.32809 3.07621 8.2664 3.16862 9.11913 3.52183C9.97185 3.87504 10.7007 4.47318 11.2135 5.24061C11.7262 6.00804 11.9999 6.91029 11.9999 7.83327C11.9999 9.07095 11.5083 10.2579 10.6331 11.1331C9.75793 12.0083 8.57095 12.4999 7.33327 12.4999Z" fill="currentColor"/></svg>',
  zoomOut: '<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M14.4733 14.0266L11.9999 11.5733C12.96 10.3762 13.4249 8.8568 13.2991 7.32747C13.1733 5.79814 12.4664 4.37512 11.3236 3.35103C10.1808 2.32694 8.68914 1.77961 7.15522 1.82158C5.62129 1.86356 4.16175 2.49164 3.0767 3.5767C1.99164 4.66175 1.36356 6.12129 1.32158 7.65522C1.27961 9.18914 1.82694 10.6808 2.85103 11.8236C3.87512 12.9664 5.29814 13.6733 6.82747 13.7991C8.3568 13.9249 9.87621 13.46 11.0733 12.4999L13.5266 14.9533C13.5886 15.0158 13.6623 15.0654 13.7436 15.0992C13.8248 15.133 13.9119 15.1505 13.9999 15.1505C14.0879 15.1505 14.1751 15.133 14.2563 15.0992C14.3376 15.0654 14.4113 15.0158 14.4733 14.9533C14.5934 14.829 14.6606 14.6628 14.6606 14.4899C14.6606 14.317 14.5934 14.1509 14.4733 14.0266ZM7.33327 12.4999C6.41029 12.4999 5.50804 12.2262 4.74061 11.7135C3.97318 11.2007 3.37504 10.4718 3.02183 9.61913C2.66862 8.7664 2.57621 7.82809 2.75627 6.92285C2.93634 6.0176 3.38079 5.18608 4.03344 4.53344C4.68608 3.88079 5.5176 3.43634 6.42285 3.25627C7.32809 3.07621 8.2664 3.16862 9.11913 3.52183C9.97185 3.87504 10.7007 4.47318 11.2135 5.24061C11.7262 6.00804 11.9999 6.91029 11.9999 7.83327C11.9999 9.07095 11.5083 10.2579 10.6331 11.1331C9.75793 12.0083 8.57095 12.4999 7.33327 12.4999ZM9.99994 7.1666H4.6666C4.48979 7.1666 4.32022 7.23684 4.1952 7.36187C4.07017 7.48689 3.99994 7.65646 3.99994 7.83327C3.99994 8.01008 4.07017 8.17965 4.1952 8.30467C4.32022 8.4297 4.48979 8.49994 4.6666 8.49994H9.99994C10.1767 8.49994 10.3463 8.4297 10.4713 8.30467C10.5964 8.17965 10.6666 8.01008 10.6666 7.83327C10.6666 7.65646 10.5964 7.48689 10.4713 7.36187C10.3463 7.23684 10.1767 7.1666 9.99994 7.1666Z" fill="currentColor"/></svg>',
  close: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M7.40994 6.00019L11.7099 1.71019C11.8982 1.52188 12.004 1.26649 12.004 1.00019C12.004 0.733884 11.8982 0.478489 11.7099 0.290185C11.5216 0.101882 11.2662 -0.00390625 10.9999 -0.00390625C10.7336 -0.00390625 10.4782 0.101882 10.2899 0.290185L5.99994 4.59019L1.70994 0.290185C1.52164 0.101882 1.26624 -0.00390625 0.999939 -0.00390625C0.733637 -0.00390625 0.478243 0.101882 0.289939 0.290185C0.101635 0.478489 -0.00415277 0.733884 -0.00415277 1.00019C-0.00415278 1.26649 0.101635 1.52188 0.289939 1.71019L4.58994 6.00019L0.289939 10.2902C0.196211 10.3831 0.121816 10.4937 0.0710478 10.6156C0.0202791 10.7375 -0.00585938 10.8682 -0.00585938 11.0002C-0.00585938 11.1322 0.0202791 11.2629 0.0710478 11.3848C0.121816 11.5066 0.196211 11.6172 0.289939 11.7102C0.382902 11.8039 0.493503 11.8783 0.615362 11.9291C0.737221 11.9798 0.867927 12.006 0.999939 12.006C1.13195 12.006 1.26266 11.9798 1.38452 11.9291C1.50638 11.8783 1.61698 11.8039 1.70994 11.7102L5.99994 7.41019L10.2899 11.7102C10.3829 11.8039 10.4935 11.8783 10.6154 11.9291C10.7372 11.9798 10.8679 12.006 10.9999 12.006C11.132 12.006 11.2627 11.9798 11.3845 11.9291C11.5064 11.8783 11.617 11.8039 11.7099 11.7102C11.8037 11.6172 11.8781 11.5066 11.9288 11.3848C11.9796 11.2629 12.0057 11.1322 12.0057 11.0002C12.0057 10.8682 11.9796 10.7375 11.9288 10.6156C11.8781 10.4937 11.8037 10.3831 11.7099 10.2902L7.40994 6.00019Z" fill="currentColor"/></svg>',
};

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
    this.expandButton = root.querySelector('[data-carousel-expand]');

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
    this.gallery = null;

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
    this.expandButton?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.openGallery(this.realIndex());
    });

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
    if (!slide || event.target.closest('[data-carousel-expand]')) return;

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

  galleryData() {
    return this.originalSlides.map((slide) => {
      const image = slide.querySelector('img');
      return {
        image: image?.currentSrc || image?.src || '',
        title: image?.alt || t('projects.imageAlt'),
        description: image?.alt || '',
      };
    });
  }

  openGallery(initialSlide) {
    this.gallery?.destroy();
    this.gallery = new CarouselGallery({
      data: this.galleryData(),
      title: t('projects.galleryTitle'),
      initialSlide,
      onClose: () => {
        this.gallery = null;
      },
    });
  }
}

class CarouselGallery {
  constructor({ data, title, initialSlide = 0, onClose }) {
    this.data = data;
    this.title = title;
    this.currentSlide = Math.max(0, Math.min(initialSlide, data.length - 1));
    this.onClose = onClose;
    this.zoomLevel = 1;
    this.slideWidth = 0;
    this.swipeOffset = 0;
    this.touchStart = null;
    this.touchEnd = null;
    this.transitionTime = '0.3s';
    this.position = { x: 0, y: 0 };
    this.startPosition = { x: 0, y: 0 };
    this.isDragging = false;

    this.render();
    this.bind();
    this.measure();
    this.update();
  }

  get isMobile() {
    return isMobileViewport();
  }

  get baseZoom() {
    return this.isMobile ? 1.2 : 2;
  }

  get zoomStep() {
    return this.isMobile ? 0.5 : 1;
  }

  render() {
    const root = document.createElement('div');
    root.className = 'carouselhero__gallery';
    root.innerHTML = `
      <div class="carouselhero__gallery-top">
        <button type="button" class="carouselhero__gallery-close" data-gallery-close>
          <span data-gallery-close-label>${t('projects.close')}</span>${ICONS.close}
        </button>
        <div class="carouselhero__gallery-title">
          <h4>${this.title}</h4>
        </div>
        <div class="carouselhero__gallery-count">
          <span data-gallery-count></span>
        </div>
      </div>
      <div class="carouselhero__gallery-images">
        <div class="carouselhero__gallery-slides-container">
          <div class="gallery-slide-button" data-gallery-prev-wrap>
            <button type="button" data-gallery-prev aria-label="${t('projects.prev')}">‹</button>
          </div>
          <div class="gallery-slide-container">
            <div class="gallery-slide-container-inner" data-gallery-touch>
              <button type="button" class="acerca-button-plus" data-gallery-zoom-step hidden>+</button>
              <button type="button" class="acerca-button" data-gallery-zoom>
                <span data-gallery-zoom-label></span>
                <span data-gallery-zoom-icon></span>
              </button>
              <div class="carouselhero__gallery-slides" data-gallery-track></div>
            </div>
          </div>
          <div class="gallery-slide-description-mobile" data-gallery-desc-mobile></div>
          <div class="gallery-slide-button" data-gallery-next-wrap>
            <button type="button" data-gallery-next aria-label="${t('projects.next')}">›</button>
          </div>
          <div class="gallery-slide-controls-mobile">
            <div class="gallery-slide-button" data-gallery-prev-mobile-wrap>
              <button type="button" data-gallery-prev-mobile aria-label="${t('projects.prev')}">‹</button>
            </div>
            <div class="carouselhero__gallery-count">
              <span data-gallery-count-mobile></span>
            </div>
            <div class="gallery-slide-button" data-gallery-next-mobile-wrap>
              <button type="button" data-gallery-next-mobile aria-label="${t('projects.next')}">›</button>
            </div>
          </div>
        </div>
      </div>
      <div class="gallery-slide-description" data-gallery-desc></div>
    `;

    const track = root.querySelector('[data-gallery-track]');
    this.data.forEach((item, index) => {
      const slide = document.createElement('div');
      slide.className = 'gallery-slide';
      slide.innerHTML = `
        <div class="gallery-slide-image" data-gallery-image>
          <img src="${item.image}" alt="${item.title}" draggable="false">
        </div>
      `;
      track.appendChild(slide);
    });

    const navSvg = document.querySelector('[data-carousel-hero] [data-carousel-prev] svg')?.outerHTML
      || '<span>‹</span>';
    const nextSvg = document.querySelector('[data-carousel-hero] [data-carousel-next] svg')?.outerHTML
      || '<span>›</span>';
    root.querySelectorAll('[data-gallery-prev], [data-gallery-prev-mobile]').forEach((btn) => {
      btn.innerHTML = navSvg;
    });
    root.querySelectorAll('[data-gallery-next], [data-gallery-next-mobile]').forEach((btn) => {
      btn.innerHTML = nextSvg;
    });

    document.body.appendChild(root);
    document.body.classList.add('lock-scroll');
    this.root = root;
    this.track = track;
  }

  bind() {
    this.root.querySelector('[data-gallery-close]').addEventListener('click', () => this.destroy());
    this.root.querySelectorAll('[data-gallery-prev], [data-gallery-prev-mobile]').forEach((btn) => {
      btn.addEventListener('click', () => this.changeSlide('left'));
    });
    this.root.querySelectorAll('[data-gallery-next], [data-gallery-next-mobile]').forEach((btn) => {
      btn.addEventListener('click', () => this.changeSlide('right'));
    });
    this.root.querySelector('[data-gallery-zoom]').addEventListener('click', () => this.toggleZoom());
    this.root.querySelector('[data-gallery-zoom-step]').addEventListener('click', () => this.stepZoom());

    const touch = this.root.querySelector('[data-gallery-touch]');
    touch.addEventListener('touchstart', (event) => this.onTouchStart(event), { passive: true });
    touch.addEventListener('touchmove', (event) => this.onTouchMove(event), { passive: true });
    touch.addEventListener('touchend', () => this.onTouchEnd());

    this.root.querySelectorAll('[data-gallery-image]').forEach((imageWrap) => {
      imageWrap.addEventListener('mousedown', (event) => this.onDragStart(event.clientX, event.clientY));
      imageWrap.addEventListener('mousemove', (event) => this.onDragMove(event.clientX, event.clientY));
      imageWrap.addEventListener('mouseup', () => this.onDragEnd());
      imageWrap.addEventListener('mouseleave', () => this.onDragEnd());
      imageWrap.addEventListener('touchstart', (event) => {
        const touchPoint = event.touches[0];
        this.onDragStart(touchPoint.clientX, touchPoint.clientY);
      }, { passive: true });
      imageWrap.addEventListener('touchmove', (event) => {
        const touchPoint = event.touches[0];
        this.onDragMove(touchPoint.clientX, touchPoint.clientY);
      }, { passive: true });
      imageWrap.addEventListener('touchend', (event) => {
        event.preventDefault();
        this.onDragEnd();
      });
    });

    this.onKeyDown = (event) => {
      if (event.key === 'ArrowLeft') this.changeSlide('left');
      if (event.key === 'ArrowRight') this.changeSlide('right');
      if (event.key === 'Escape') this.destroy();
    };
    window.addEventListener('keydown', this.onKeyDown);

    this.onResize = () => {
      this.updateViewport();
      this.measure();
      this.update();
    };
    this.updateViewport();
    window.addEventListener('resize', this.onResize);
    window.addEventListener('orientationchange', this.onResize);
    window.visualViewport?.addEventListener('resize', this.onResize);
  }

  updateViewport() {
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    document.documentElement.style.setProperty('--vh', `${viewportHeight}px`);
    this.root.classList.toggle('landscape', window.matchMedia('(orientation: landscape)').matches);
  }

  measure() {
    this.slideWidth = this.root.querySelector('.gallery-slide-container-inner')?.clientWidth || 0;
  }

  changeSlide(direction) {
    if (direction === 'left' && this.currentSlide > 0) {
      this.currentSlide -= 1;
    } else if (direction === 'right' && this.currentSlide < this.data.length - 1) {
      this.currentSlide += 1;
    }
    this.zoomLevel = 1;
    this.position = { x: 0, y: 0 };
    this.update();
  }

  toggleZoom() {
    this.zoomLevel = this.zoomLevel === 1 ? this.baseZoom : 1;
    this.position = { x: 0, y: 0 };
    this.update();
  }

  stepZoom() {
    this.zoomLevel = this.zoomLevel > this.baseZoom ? this.baseZoom : this.baseZoom + this.zoomStep;
    this.position = { x: 0, y: 0 };
    this.update();
  }

  onTouchStart(event) {
    if (this.zoomLevel > 1) return;
    this.touchEnd = null;
    this.touchStart = event.targetTouches[0].clientX;
    this.swipeOffset = 0;
    this.transitionTime = '0s';
    this.update();
  }

  onTouchMove(event) {
    if (this.touchStart == null || this.zoomLevel > 1) return;
    const currentTouch = event.targetTouches[0].clientX;
    this.touchEnd = currentTouch;
    this.swipeOffset = this.touchStart - currentTouch;
    this.update();
  }

  onTouchEnd() {
    this.transitionTime = '0.3s';
    if (this.touchStart == null || this.touchEnd == null || this.zoomLevel > 1) {
      this.swipeOffset = 0;
      this.update();
      return;
    }
    const distance = this.touchStart - this.touchEnd;
    if (distance > 50) this.changeSlide('right');
    if (distance < -50) this.changeSlide('left');
    this.swipeOffset = 0;
    this.touchStart = null;
    this.touchEnd = null;
    this.update();
  }

  onDragStart(clientX, clientY) {
    if (this.zoomLevel <= 1) return;
    this.isDragging = true;
    this.startPosition = { x: clientX - this.position.x, y: clientY - this.position.y };
    this.updateImages();
  }

  onDragMove(clientX, clientY) {
    if (!this.isDragging || this.zoomLevel <= 1) return;
    const newX = (clientX - this.startPosition.x) * 1.2;
    const newY = clientY - this.startPosition.y;
    const maxOffsetX = this.isMobile ? Math.min(this.zoomLevel, 2) * 200 : this.zoomLevel * 100;
    const maxOffsetY = this.isMobile ? this.zoomLevel * 100 : (this.zoomLevel - 1) * 100;
    this.position = {
      x: Math.max(Math.min(newX, maxOffsetX), -maxOffsetX),
      y: Math.max(Math.min(newY, maxOffsetY), -maxOffsetY),
    };
    this.updateImages();
  }

  onDragEnd() {
    this.isDragging = false;
    this.position = { x: 0, y: 0 };
    this.updateImages();
  }

  update() {
    const gap = 16;
    const x = -(this.slideWidth + gap) * this.currentSlide - this.swipeOffset;
    this.track.style.transition = `transform ${this.transitionTime} ease-out`;
    this.track.style.transform = `translateX(${x}px)`;

    this.track.querySelectorAll('.gallery-slide').forEach((slide, index) => {
      slide.classList.toggle('active', index === this.currentSlide);
    });

    const count = `${this.currentSlide + 1}/${this.data.length}`;
    this.root.querySelectorAll('[data-gallery-count], [data-gallery-count-mobile]').forEach((el) => {
      el.textContent = count;
    });

    const description = this.data[this.currentSlide]?.description || '';
    this.root.querySelector('[data-gallery-desc]').textContent = description;
    this.root.querySelector('[data-gallery-desc-mobile]').textContent = description;

    this.root.querySelector('[data-gallery-prev-wrap]')?.classList.toggle('disabled', this.currentSlide === 0);
    this.root.querySelector('[data-gallery-next-wrap]')?.classList.toggle('disabled', this.currentSlide === this.data.length - 1);
    this.root.querySelector('[data-gallery-prev-mobile-wrap]')?.classList.toggle('disabled', this.currentSlide === 0);
    this.root.querySelector('[data-gallery-next-mobile-wrap]')?.classList.toggle('disabled', this.currentSlide === this.data.length - 1);

    const zoomed = this.zoomLevel !== 1;
    const zoomStep = this.root.querySelector('[data-gallery-zoom-step]');
    zoomStep.hidden = !zoomed;
    zoomStep.textContent = this.zoomLevel <= this.baseZoom ? '+' : '-';
    this.root.querySelector('[data-gallery-zoom-label]').textContent = zoomed ? t('projects.zoomOut') : t('projects.zoomIn');
    this.root.querySelector('[data-gallery-zoom-icon]').innerHTML = zoomed ? ICONS.zoomOut : ICONS.zoomIn;

    this.updateImages();
  }

  updateImages() {
    this.track.querySelectorAll('img').forEach((img) => {
      img.classList.toggle('mobile-expand-image', this.zoomLevel > 1);
      img.style.transform = `scale(${this.zoomLevel}) translate(${this.position.x}px, ${this.position.y}px)`;
      img.style.transition = this.isDragging ? 'none' : 'transform 0.2s ease-out';
    });
    this.root.querySelectorAll('[data-gallery-image]').forEach((wrap) => {
      wrap.style.cursor = this.zoomLevel > 1 ? (this.isDragging ? 'grabbing' : 'grab') : 'default';
    });
  }

  destroy() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('orientationchange', this.onResize);
    window.visualViewport?.removeEventListener('resize', this.onResize);
    this.root.remove();
    document.body.classList.remove('lock-scroll');
    this.onClose?.();
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
