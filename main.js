// Click to Enter Functionality
document.addEventListener('DOMContentLoaded', () => {
  const entryScreen = document.getElementById('entry-screen');
  const mainContent = document.getElementById('main-content');
  const enterSound = document.getElementById('enter-sound');

  // Handle click/tap
  entryScreen.addEventListener('click', () => {
    // Play sound if available
    if (enterSound) {
      enterSound.currentTime = 0;
      enterSound.play().catch(e => console.log("Audio error:", e));
    }
    
    // Hide entry screen and show content
    entryScreen.style.opacity = '0';
    setTimeout(() => {
      entryScreen.style.display = 'none';
      mainContent.classList.remove('hidden');
    }, 500);
  });

  // Your existing grid interaction code
  const gridItems = document.querySelectorAll('.grid-item');
  
  gridItems.forEach(item => {
    item.addEventListener('click', () => {
      gridItems.forEach(i => i.dataset.active = "false");
      item.dataset.active = "true";
    });
  });
});
