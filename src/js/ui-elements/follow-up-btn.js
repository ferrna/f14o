document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.overlay-container');
    const followButton = document.querySelector('.follow-button');
    if (!container || !followButton) return;
  
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect(); // Get container bounds
      const mouseX = e.clientX - rect.left; // Mouse X relative to container
      const mouseY = e.clientY - rect.top;  // Mouse Y relative to container
  
      // Calculate the button's new position by moving it a little toward the cursor
      const moveX = (mouseX - rect.width / 2) * 0.15; // Adjust movement amount
      const moveY = (mouseY - rect.height / 2) * 0.15;
  
      // Apply a translation to move the button slightly toward the cursor
      followButton.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
    });
  
    container.addEventListener('mouseleave', () => {
      // Reset the button to the center when the cursor leaves the container
      followButton.style.transform = 'translate(-50%, -50%)';
    });
  });