import './ui-elements/text-title-animation.js';
import { ProjectsSlides } from './projects/projects-slides.js';
import { initProjectDetails } from './projects/details-page.js';
import { initPageTransitions } from './ui-elements/page-transition.js';
import { initI18n } from './i18n/i18n.js';

// UI elements
import './ui-elements/fullscreen.js';
import './ui-elements/cursor.js';
import './ui-elements/follow-up-btn.js';

document.addEventListener('DOMContentLoaded', () => {
    initI18n();
    initPageTransitions();

    if (window.location.pathname === '/' || window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        const introScreen = document.getElementById('intro-screen');
        const introTitle = document.getElementById('intro-title');

        if (introScreen && introTitle) {
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

        new ProjectsSlides();
        const viewHome = document.querySelector('#view-home');
        if (viewHome) {
            viewHome.dataset.slidesReady = 'true';
        }
    }

    initProjectDetails();
    document.body.classList.add('transition-ready');
});

document.addEventListener('home-view-ready', () => {
    const viewHome = document.querySelector('#view-home');
    if (!viewHome || viewHome.dataset.slidesReady === 'true') return;
    new ProjectsSlides();
    viewHome.dataset.slidesReady = 'true';
});
