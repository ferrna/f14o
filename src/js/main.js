import './ui-elements/text-title-animation.js';
import { initCarouselHero } from './projects/carousel-hero.js';
import { initProjectDetails } from './projects/details-page.js';
import { initPageTransitions } from './ui-elements/page-transition.js';
import { initI18n } from './i18n/i18n.js';
import { prepareHomeIntro, playHomeIntro } from './hero/intro-animation.js';
import { initHeroScroll } from './hero/hero-scroll.js';
import { initTechSlider } from './technologies/tech-slider.js';
import { initExperience } from './experience/experience.js';

// UI elements
import './ui-elements/fullscreen.js';
import './ui-elements/cursor.js';
import './ui-elements/follow-up-btn.js';

document.addEventListener('DOMContentLoaded', () => {
    initI18n();
    initPageTransitions();
    const intro = prepareHomeIntro();

    if (window.location.pathname === '/' || window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        const introScreen = document.getElementById('intro-screen');
        const introTitle = document.getElementById('intro-title');

        if (introScreen && introTitle) {
            setTimeout(() => {
                introTitle.classList.add('hide-title');
            }, 1000);

            setTimeout(() => {
                introScreen.classList.add('hide-intro');
                playHomeIntro(intro, { delay: 0.18 });
            }, 1480);

            introScreen.addEventListener('animationend', (event) => {
                if (event.animationName === 'hide-intro') {
                    introScreen.style.display = 'none';
                }
            });
        } else {
            playHomeIntro(intro);
        }

        initCarouselHero();
        const viewHome = document.querySelector('#view-home');
        if (viewHome) {
            viewHome.dataset.slidesReady = 'true';
        }
    } else {
        playHomeIntro(intro);
    }

    initProjectDetails();
    document.body.classList.add('transition-ready');
    initHeroScroll();
    initTechSlider();
    initExperience();
});

document.addEventListener('home-view-ready', () => {
    const viewHome = document.querySelector('#view-home');
    if (viewHome && viewHome.dataset.slidesReady !== 'true') {
        initCarouselHero(viewHome);
        viewHome.dataset.slidesReady = 'true';
    }
    initTechSlider();
    initExperience();
});
