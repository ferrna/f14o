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
  
  // Usage
  document.addEventListener('DOMContentLoaded', () => {
    const titleElement = document.querySelector('.hero-title');
    const subtitleElement = document.querySelector('.hero-subtitle');
    if (titleElement) {
        gsap.effects.clipTitle(titleElement, { delay: 1.6 });
    }
    if (subtitleElement) {
        gsap.effects.clipTitle(subtitleElement, { delay: 1.6 });
    }
    const projectsTitle = document.querySelector('#projects-title');
    const projects = document.querySelector('#projects');
    if (projectsTitle) {
      //gsap.effects.clipTitle(projectsTitle, {
      //  delay: 0,
      //  scrollTrigger: {
      //    trigger: projectsTitle,
      //    start: "top bottom-=100",
      //    //endTrigger: projects,
      //    end: "bottom top",
      //    pinSpacing: false,
      //    pin: true,
      //    toggleActions: "play none none reset"
      //  }
      //});
      // First ScrollTrigger for the animation
      const animationTrigger = ScrollTrigger.create({
        trigger: projectsTitle,
        start: "top bottom", // Starts animation when the top of projectsTitle reaches the bottom of the viewport
        onEnter: () => gsap.effects.clipTitle(projectsTitle, { delay: 0 }),
        toggleActions: "play none none reset" // This ensures the animation only happens once
      });

      // Second ScrollTrigger for pinning
      ScrollTrigger.create({
        trigger: projectsTitle,
        start: "top top", // Starts pinning when the top of projectsTitle reaches the top of the viewport
        endTrigger: projects,
        end: "bottom top", // Ends pinning when the bottom of projects reaches the top of the viewport
        pin: true,
        pinSpacing: false,
        onUpdate: self => {
          // Calculate the progress of the scroll through the projects section
          const progress = self.progress;
          
          // Start fading out when we're 80% through the projects section
          if (progress > 0.8) {
            const fadeOutProgress = (progress - 0.8) / 0.2; // This will go from 0 to 1 in the last 20% of the scroll
            gsap.to(projectsTitle, {
              opacity: 1 - fadeOutProgress,
              duration: 0.1 // Make the fade quick and responsive to scroll
            });
          } else {
            // Ensure full opacity when not in the fade-out zone
            gsap.to(projectsTitle, {
              opacity: 1,
              duration: 0.1
            });
          }
        }
      });
    }
  });