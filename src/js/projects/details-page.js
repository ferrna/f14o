import { pageTransition } from '../ui-elements/page-transition.js';
import { gsap } from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
    gsap.set(document.body, { autoAlpha: 0 });
    
    const transitionImage = document.querySelector('.transition-image');
    if (transitionImage) {
        document.body.appendChild(transitionImage);
    }
  
    pageTransition.onEnter(document.body, () => {
        // Any initialization code for the project detail page
    });
});