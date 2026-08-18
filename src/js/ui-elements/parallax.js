function setupParallax() {
    const heroImage = document.querySelector('.hero-image img');
    const container = document.querySelector('.hero-image-container');
    if (!heroImage || !container || container.closest('#header-left-content')) return;
    let containerTop = container.offsetTop;
    let containerHeight = container.offsetHeight;
    let windowHeight = window.innerHeight;

    function updateParallax() {
        const scrollPosition = window.pageYOffset;
        const visiblePart = Math.max(0, Math.min(containerHeight, windowHeight + scrollPosition - containerTop));
        const parallaxOffset = (visiblePart / containerHeight) * 50; // 50 is the maximum pixel offset

        heroImage.style.transform = `translateY(${parallaxOffset}px) scale(1.1)`;
    }

    window.addEventListener('scroll', updateParallax);
    window.addEventListener('resize', () => {
        containerTop = container.offsetTop;
        containerHeight = container.offsetHeight;
        windowHeight = window.innerHeight;
        updateParallax();
    });

    updateParallax(); // Initial call
}

document.addEventListener('DOMContentLoaded', setupParallax);