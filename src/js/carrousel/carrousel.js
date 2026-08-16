class ProjectsCarousel {
    constructor() {
      this.container = document.querySelector('.carousel-container');
      this.slides = document.querySelectorAll('.carousel-slide');
      this.prevButton = document.querySelector('.carousel-button.prev');
      this.nextButton = document.querySelector('.carousel-button.next');
      this.currentIndex = 0;
  
      this.init();
    }
  
    init() {
      this.showSlide(this.currentIndex);
      this.prevButton.addEventListener('click', () => this.prevSlide());
      this.nextButton.addEventListener('click', () => this.nextSlide());
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
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    new ProjectsCarousel();
  });