class ProjectsCarousel {
  constructor() {
    this.container = document.querySelector('.carousel-container');
    this.slides = document.querySelectorAll('.carousel-slide');
    this.prevButton = document.querySelector('.carousel-button.prev');
    this.nextButton = document.querySelector('.carousel-button.next');
    this.currentIndex = 0;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 5000; // 5 seconds delay between slides

    this.init();
  }

  init() {
    this.showSlide(this.currentIndex);
    this.prevButton.addEventListener('click', () => this.prevSlide());
    this.nextButton.addEventListener('click', () => this.nextSlide());
    
    // Start autoplay
    this.startAutoPlay();

    // Pause autoplay on user interaction
    this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
    this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    this.prevButton.addEventListener('mouseenter', () => this.pauseAutoPlay());
    this.nextButton.addEventListener('mouseenter', () => this.pauseAutoPlay());
  }

  showSlide(index) {
    this.slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (i === index) {
        slide.classList.add('active');
      }
    });
    this.container.style.transform = `translateX(-${index * 100}%)`;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.showSlide(this.currentIndex);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.showSlide(this.currentIndex);
  }

  startAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
    this.autoPlayInterval = setInterval(() => this.nextSlide(), this.autoPlayDelay);
  }

  pauseAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ProjectsCarousel();
});
