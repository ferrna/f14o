// Archived home projects grid behavior.
// Restore with `src/js/projects/projects-grid.html` and `_project-grid.scss`.
import { goToProject } from '../ui-elements/page-transition.js';

export class ProjectsSlides {
    constructor() {
      this.container = document.querySelector('#projects-container');
      this.slides = document.querySelectorAll('.projects-slide');
      this.prevButton = document.querySelector('.projects-button.prev');
      this.nextButton = document.querySelector('.projects-button.next');
      this.currentIndex = 0;
      this.autoPlayInterval = null;
      this.autoPlayDelay = 5000;

      this.slides.forEach((slide) => {
        slide.addEventListener('click', (event) => this.handleProjectClick(event));
      });

      this.init();
    }

    init() {
    }

    showSlide(index) {
      this.slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
          slide.classList.add('active');
        }
      });
      if (this.container) {
        this.container.style.transform = `translateX(-${index * 100}%)`;
      }
    }

    prevSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
      this.showSlide(this.currentIndex);
    }

    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      this.showSlide(this.currentIndex);
    }

    pauseAutoPlay() {
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
      }
    }

    handleProjectClick(event) {
      const projectLink = event.currentTarget.querySelector('a');
      const clickedImage = event.currentTarget.querySelector('img');
      if (!projectLink || !clickedImage) return;

      event.preventDefault();
      goToProject({
        image: clickedImage,
        url: projectLink.href,
      });
    }
}
