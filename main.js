// ENTRY SCREEN
const entryScreen = document.getElementById('entry-screen');
const mainContent = document.getElementById('main-content');
const enterSound = document.getElementById('enter-sound');

entryScreen.addEventListener('click', () => {
  // Play sound
  if (enterSound) {
    enterSound.volume = 0.5;
    enterSound.play().catch(e => console.log("Audio error:", e));
  }
  
  // Hide entry screen
  entryScreen.style.opacity = '0';
  setTimeout(() => {
    entryScreen.style.display = 'none';
    mainContent.classList.remove('hidden');
  }, 500);
});

// GRID INTERACTION
const gridItems = document.querySelectorAll('.grid-item');

gridItems.forEach(item => {
  item.addEventListener('click', () => {
    // Remove active state from all
    gridItems.forEach(i => i.dataset.active = "false");
    // Set clicked item as active
    item.dataset.active = "true";
  });
});

// TWEAKPANE
const pane = new Tweakpane.Pane();
pane.addBinding({ theme: 'system' }, 'theme', {
  options: {
    system: 'system',
    light: 'light',
    dark: 'dark'
  }
}).on('change', ev => {
  document.documentElement.dataset.theme = ev.value;
});
