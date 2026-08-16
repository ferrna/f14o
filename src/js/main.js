import './ui-elements/text-title-animation.js';
import { ProjectsSlides } from './projects/projects-slides.js';
import './projects/details-page.js';

// UI elements
import './ui-elements/fullscreen.js';
import './ui-elements/cursor.js';
import './ui-elements/follow-up-btn.js';

// Hero background distortion
//import { initImageDistortion } from './hero/image-distortion';

// Background animation lava
//import './background-animation/background-animation.js';
//import { stopBackgroundAnimation } from './background-animation/background-animation.js';

import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
gsap.registerPlugin(Flip);

document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio website loaded');

    // Intro screen
    if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
        const introScreen = document.getElementById('intro-screen');
        const introTitle = document.getElementById('intro-title');
    
        setTimeout(() => {
            introTitle.classList.add('hide-title');
        }, 1000);
    
        setTimeout(() => {
            introScreen.classList.add('hide-intro');
        }, 1480);

        introScreen.addEventListener('animationend', (event) => {
            if (event.animationName === 'hide-intro') {
                introScreen.style.display = 'none';
            }
        });
    
    }
    
    // Project details page content swap
    document.addEventListener('contentSwapped', () => {
        const transitionImageDetails = JSON.parse(sessionStorage.getItem('transitionImageDetails'));
        console.log(transitionImageDetails);

        //stopBackgroundAnimation();
    
        if (transitionImageDetails) {
            const targetImage = document.querySelector('#project-main-image');
            if (targetImage) {
                targetImage.style.position = 'absolute';
                targetImage.style.top = transitionImageDetails.final.top + 'px';
                targetImage.style.left = transitionImageDetails.final.left + 'px';
                targetImage.style.width = transitionImageDetails.final.width + 'px';
                targetImage.style.height = transitionImageDetails.final.height + 'px';
            }
        }
    });

    new ProjectsSlides()
    document.body.classList.add('transition-ready')
})
