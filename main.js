// ========================
// Click-to-Enter Overlay
// ========================
document.addEventListener('DOMContentLoaded', function() {
  const overlay = document.querySelector('.enter-overlay');
  const enterSound = document.getElementById('enter-sound');

  function removeOverlay() {
    overlay?.classList.add('fade-out');
    setTimeout(() => overlay?.remove(), 1500);
  }

  if (overlay) {
    // Click handler
    overlay.addEventListener('click', () => {
      console.log('Overlay clicked');
      
      // Try playing audio
      if (enterSound) {
        enterSound.volume = 0.5;
        enterSound.currentTime = 0;
        enterSound.play()
          .then(() => removeOverlay())
          .catch(e => {
            console.warn('Audio failed:', e);
            removeOverlay(); // Continue anyway
          });
      } else {
        removeOverlay();
      }
    });

    // Mobile touch support
    overlay.addEventListener('touchend', (e) => {
      e.preventDefault();
      overlay.click();
    });
  }
});

// ========================
// Original Tweakpane Code
// ========================
const config = { theme: 'system' };
const ctrl = new Pane({ title: 'Config', expanded: true });

const update = () => {
  document.documentElement.dataset.theme = config.theme;
};

ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: { System: 'system', Light: 'light', Dark: 'dark' }
});

ctrl.on('change', (event) => {
  if (!document.startViewTransition) return update();
  document.startViewTransition(() => update());
});
update();

// ========================
// Grid Interaction Logic
// ========================
const list = document.querySelector('ul');
const items = list?.querySelectorAll('li');

const setIndex = (event) => {
  const closest = event.target.closest('li');
  if (!closest || !items) return;

  const index = [...items].indexOf(closest);
  const cols = [...items].map((_, i) => 
    i === index ? '10fr' : '1fr'
  ).join(' ');
  
  list.style.gridTemplateColumns = cols;
  items.forEach((item, i) => {
    item.dataset.active = (i === index).toString();
  });
};

if (list) {
  list.addEventListener('click', setIndex);
  list.addEventListener('pointermove', setIndex);
}

// Handle window resize
window.addEventListener('resize', () => {
  if (!items) return;
  const w = Math.max(...[...items].map(i => i.offsetWidth));
  list?.style.setProperty('--article-width', w);
});
