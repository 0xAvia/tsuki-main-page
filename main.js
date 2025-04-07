// ========================
// DOM Elements
// ========================
const entryScreen = document.getElementById('entry-screen');
const mainContent = document.getElementById('main-content');
const enterSound = document.getElementById('enter-sound');
const gridContainer = document.querySelector('.grid-container');
const gridItems = document.querySelectorAll('.grid-item');

// ========================
// Click to Enter Functionality
// ========================
function initEntryScreen() {
  if (!entryScreen) return;

  const handleEntry = () => {
    // Play enter sound if available
    if (enterSound) {
      enterSound.currentTime = 0;
      enterSound.play().catch(e => {
        console.warn('Audio playback prevented:', e);
        proceedWithoutAudio();
      });
    } else {
      proceedWithoutAudio();
    }
  };

  const proceedWithoutAudio = () => {
    entryScreen.style.opacity = '0';
    entryScreen.style.pointerEvents = 'none';
    
    setTimeout(() => {
      entryScreen.style.display = 'none';
      mainContent.classList.remove('hidden');
      initGridInteractions(); // Initialize grid after entry
    }, 500);
  };

  // Support both mouse and touch events
  entryScreen.addEventListener('click', handleEntry);
  entryScreen.addEventListener('touchend', handleEntry);
}

// ========================
// Grid Interactions
// ========================
function initGridInteractions() {
  if (!gridContainer || gridItems.length === 0) return;

  const activateItem = (item) => {
    gridItems.forEach(i => {
      i.dataset.active = "false";
      i.style.transform = '';
    });
    
    item.dataset.active = "true";
    item.style.transform = 'scale(1.02)';
  };

  // Click/tap handling
  gridContainer.addEventListener('click', (e) => {
    const item = e.target.closest('.grid-item');
    if (item) activateItem(item);
  });

  // Keyboard navigation
  gridContainer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const item = e.target.closest('.grid-item');
      if (item) {
        e.preventDefault();
        activateItem(item);
      }
    }
  });

  // Set first item as active by default
  if (gridItems.length > 0) {
    gridItems[0].dataset.active = "true";
    gridItems[0].tabIndex = 0; // Make focusable
  }
}

// ========================
// Tweakpane Configuration
// ========================
function initTweakpane() {
  const config = {
    theme: 'system',
    soundVolume: 0.7
  };

  const ctrl = new Pane({
    title: 'Config',
    expanded: false,
  });

  ctrl.addBinding(config, 'theme', {
    label: 'Theme',
    options: {
      System: 'system',
      Light: 'light',
      Dark: 'dark',
    }
  });

  if (enterSound) {
    ctrl.addBinding(config, 'soundVolume', {
      label: 'Sound Volume',
      min: 0,
      max: 1,
      step: 0.1
    }).on('change', (v) => {
      enterSound.volume = v.value;
    });
  }

  ctrl.on('change', (ev) => {
    if (ev.presetKey === 'theme') {
      document.documentElement.dataset.theme = config.theme;
    }
  });
}

// ========================
// Initialize Everything
// ========================
document.addEventListener('DOMContentLoaded', () => {
  initEntryScreen();
  
  // Only initialize Tweakpane if library is loaded
  if (typeof Pane !== 'undefined') {
    initTweakpane();
  }

  // Make grid items focusable
  gridItems.forEach(item => {
    item.tabIndex = 0;
  });
});

// ========================
// Responsive Adjustments
// ========================
function handleResize() {
  // Adjust grid layout on resize if needed
  const cols = window.innerWidth < 768 ? 1 : 3;
  gridContainer.style.gridTemplateColumns = `repeat(${cols}, minmax(280px, 1fr))`;
}

window.addEventListener('resize', handleResize);
