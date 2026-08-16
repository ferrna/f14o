import { pageTransition } from '../ui-elements/page-transition.js';
import { Flip } from 'gsap/Flip';
import { gsap } from 'gsap';

async function loadPage(url) {
  return fetch(url)
      .then(response => response.text())
      .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          return doc.querySelector('main').innerHTML;
      });
}

export class ProjectsSlides {
    constructor() {
      this.container = document.querySelector('.projects-container');
      this.slides = document.querySelectorAll('.projects-slide');
      this.prevButton = document.querySelector('.projects-button.prev');
      this.nextButton = document.querySelector('.projects-button.next');
      this.currentIndex = 0;
      this.autoPlayInterval = null;
      this.autoPlayDelay = 5000; // 5 seconds delay between slides
        
      this.slides.forEach(slide => {
        slide.addEventListener('click', (e) => this.handleProjectClick(e));
      });

      this.init();
    }
  
    init() {
      //this.showSlide(this.currentIndex);
      //this.prevButton.addEventListener('click', () => this.prevSlide());
      //this.nextButton.addEventListener('click', () => this.nextSlide());
      //
      //// Start autoplay
      //this.startAutoPlay();
  //
      //// Pause autoplay on user interaction
      //this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
      //this.container.addEventListener('mouseleave', () => this.startAutoPlay());
      //this.prevButton.addEventListener('mouseenter', () => this.pauseAutoPlay());
      //this.nextButton.addEventListener('mouseenter', () => this.pauseAutoPlay());
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
  
    //startAutoPlay() {
    //  if (this.autoPlayInterval) {
    //    clearInterval(this.autoPlayInterval);
    //  }
    //  this.autoPlayInterval = setInterval(() => this.nextSlide(), this.autoPlayDelay);
    //}
  
    pauseAutoPlay() {
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
      }
    }

    handleProjectClick(event) {
      const projectLink = event.currentTarget.querySelector('a');
      if (projectLink) {
          event.preventDefault();
          const destinationURL = projectLink.href;
          const clickedImage = event.currentTarget.querySelector('img');
          loadPage(destinationURL).then((nextPageContent) => {  
            const rect = clickedImage.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            const finalPosition = {
              x: (windowWidth - rect.width) / 2 - rect.left, // Horizontal translation
              y: 0 - rect.top,
              width: rect.width,
              height: rect.height
            };

            sessionStorage.setItem('transitionImageDetails', JSON.stringify({
              initial: {
                  top: rect.top,
                  left: rect.left,
                  width: rect.width,
                  height: rect.height
              },
              final: {
                top: 0,
                left: (windowWidth - rect.width) / 2
              },
              src: clickedImage.src
            }));

            //const clonedImage = clickedImage.cloneNode(true);
            //clonedImage.style.position = 'fixed';
            //clonedImage.style.zIndex = '1000';
            //clonedImage.classList.add('transition-image');
            //document.body.appendChild(clonedImage);

            gsap.to(clickedImage, {
              duration: 0.5,
              x: finalPosition.x,
              y: finalPosition.y,
              ease: "power2.inOut",
              onComplete: () => {

                  gsap.to(document.querySelector('main'), {
                      duration: 0.5,
                      opacity: 0,
                      onComplete: () => {
                          // Replace current page content with next page content
                          document.querySelector('main').innerHTML = nextPageContent;

                          window.scrollTo(0, 0);
                          // Dispatch a custom event when content is swapped for
                          // styling new image to same position
                          const contentSwappedEvent = new Event('contentSwapped');
                          document.dispatchEvent(contentSwappedEvent);

                          // Fade the new content in
                          gsap.fromTo(document.querySelector('#project-details-container *:not(#project-main-image)'), {
                              opacity: 0
                          }, {
                              duration: 0.5,
                              opacity: 1
                          });
                          gsap.fromTo(document.querySelector('main'), {
                            opacity: 1
                        }, {
                            duration: 0,
                            opacity: 1
                        });
                      }
                  });
              }
            });
          });
      }
    }
}

  