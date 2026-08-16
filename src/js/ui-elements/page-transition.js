import { gsap } from 'gsap';

let isTransitionComplete = false;

function toggleTransitionComplete(value) {
    isTransitionComplete = value;
}

const pageTransition = {
    onEnter: (el, done) => {
        const storedImageDetails = JSON.parse(sessionStorage.getItem('transitionImageDetails'));
        if (storedImageDetails) {
            const transitionImage = document.createElement('img');
            transitionImage.src = storedImageDetails.src;
            transitionImage.style.position = 'fixed';
            transitionImage.style.zIndex = '1000';
            Object.assign(transitionImage.style, storedImageDetails.final);
            document.body.appendChild(transitionImage);
    
            const targetImage = document.querySelector('#project-main-image');
            if (targetImage) {
                const rect = targetImage.getBoundingClientRect();
                gsap.fromTo(transitionImage, 
                    storedImageDetails.final,
                    {
                        duration: 0.5,
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height,
                        ease: "power2.inOut",
                        onComplete: () => {
                            transitionImage.remove();
                            gsap.set(el, { autoAlpha: 1 });
                            toggleTransitionComplete(true);
                            done();
                        }
                    }
                );
            } else {
                transitionImage.remove();
                pageTransition.defaultEnter(el, done);
            }
        } else {
            pageTransition.defaultEnter(el, done);
        }
        //sessionStorage.removeItem('transitionImageDetails');
    },
    onLeave: (el, done) => {
        toggleTransitionComplete(false);
        gsap.to(el, { 
            autoAlpha: 0, 
            duration: 0.3, 
            onComplete: done
        });
    },
    defaultEnter: (el, done) => {
        gsap.fromTo(el, 
            { autoAlpha: 0 },
            { 
                autoAlpha: 1, 
                duration: 0.3, 
                onComplete: () => {
                    toggleTransitionComplete(true);
                    done();
                }
            }
        );
    }
};

export { pageTransition, toggleTransitionComplete };