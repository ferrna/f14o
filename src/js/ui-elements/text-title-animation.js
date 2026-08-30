import {gsap} from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Mock SplitText functionality
function splitText(target) {
    if (target.classList.contains('text-split-done')) {
      return target.querySelectorAll('.char');
    }
    
    const text = target.textContent;
    const chars = text.split('').map(char => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char;
      return span;
    });
    
    target.textContent = '';
    chars.forEach(char => target.appendChild(char));
    target.classList.add('text-split-done');
    
    return chars;
  }
  
  gsap.registerPlugin(ScrollTrigger);
  // Register the clipTitle effect
  gsap.registerEffect({
    name: 'clipTitle',
    effect: (targets, config) => {
      const tl = gsap.timeline({
        defaults: { ease: config.ease },
        delay: config.delay,
        scrollTrigger: config.scrollTrigger
      });
  
      const target = targets[0];
      const chars = splitText(target);
  
      tl.fromTo(
        chars,
        {
          x: config.x,
          yPercent: config.yPercent,
          clipPath: 'inset(0% 100% 120% -5%)',
          transformOrigin: '0% 50%',
        },
        {
          clipPath: 'inset(0% -100% -100% -5%)',
          yPercent: 0,
          stagger: config.stagger,
          duration: config.clipDuration,
          ease: config.clipEase,
        }
      );
  
      tl.to(chars, {
        x: 0,
        duration: config.xDuration,
        ease: config.xEase,
        stagger: config.stagger,
      }, "<0.2"); // This starts at the same time + 0.2s as the previous animation
  
      // If scrollTrigger is provided, don't play the animation immediately
      if (!config.scrollTrigger) {
        tl.play();
      }
  
      // Set up hover functionality
      target.addEventListener('mouseenter', () => {
        tl.pause();
        gsap.to(chars, {
          x: config.x,
          yPercent: config.yPercent,
          clipPath: 'inset(0% 100% 120% -5%)',
          duration: 0.3,  // Reduced duration for reset
          ease: 'power2.in',  // Faster ease-in for reset
          onComplete: () => {
            tl.restart()
              .timeScale(1.2);  // Slightly faster replay
          }
        });
      });
      
      target.addEventListener('mouseleave', () => {
        tl.timeScale(1);  // Reset to normal speed
      });
  
      return tl;
    },
    defaults: {
      yPercent: 0, 
      x: -30, 
      clipDuration: 0.8,
      xDuration: 1.2, // Longer duration for x movement
      clipEase: 'power3.out',
      xEase: 'power2.out', // Slower easing for x movement
      stagger: -0.05,
      delay: 0,
      scrollTrigger: null
    },
    extendTimeline: true,
  });
  
function initSectionHeadings(root = document) {
  root.querySelectorAll('.section-heading').forEach((heading) => {
    if (heading.dataset.headingReady === 'true') return;
    heading.dataset.headingReady = 'true';

    const backdrop = heading.querySelector('.section-heading__backdrop') || heading.querySelector('.section-heading__display');
    const kicker = heading.querySelector('.section-heading__kicker');
    const title = heading.querySelector('.section-heading__title') || heading.querySelector('.section-heading__label');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (backdrop) {
      gsap.fromTo(backdrop, {
        opacity: 0,
        x: -24,
      }, {
        opacity: 0.75,
        x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: heading,
          start: 'top 88%',
          once: true,
        },
      });
    }

    if (kicker) {
      gsap.fromTo(kicker, {
        opacity: 0,
        y: 10,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: heading,
          start: 'top 88%',
          once: true,
        },
      });
    }

    if (title) {
      gsap.fromTo(title, {
        opacity: 0,
        y: 14,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: heading,
          start: 'top 88%',
          once: true,
        },
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => initSectionHeadings());
document.addEventListener('home-view-ready', () => initSectionHeadings());