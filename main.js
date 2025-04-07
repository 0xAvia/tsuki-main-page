i// ==============================================
// Click to Enter Functionality (Fixed Version)
// ==============================================
document.addEventListener('DOMContentLoaded', function() {
  const overlay = document.querySelector('.enter-overlay');
  const enterSound = document.getElementById('enter-sound');

  function removeOverlay() {
    if (overlay) {
      overlay.classList.add('fade-out');
      setTimeout(() => {
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 1500);
    }
  }

  if (overlay) {
    overlay.addEventListener('click', function() {
      console.log('Overlay clicked - attempting to play audio');
      
      // Try to play audio
      if (enterSound) {
        enterSound.volume = 0.7;
        enterSound.currentTime = 0;
        
        const audioPromise = enterSound.play();
        
        if (audioPromise !== undefined) {
          audioPromise
            .then(() => {
              console.log('Audio playback started');
              removeOverlay();
            })
            .catch(error => {
              console.warn('Audio playback failed:', error);
              removeOverlay(); // Continue even if audio fails
            });
        }
      } else {
        console.warn('No audio element found');
        removeOverlay();
      }
    });

    // Mobile touch support
    overlay.addEventListener('touchend', function(e) {
      e.preventDefault();
      overlay.click();
    });
  } else {
    console.warn('No overlay element found');
  }
});

// ==============================================
// Original Tweakpane Configuration
// ==============================================
const config = {
  theme: 'system',
};

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
});

const update = () => {
  document.documentElement.dataset.theme = config.theme;
};

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update();
  document.startViewTransition(() => update());
};

ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
});

ctrl.on('change', sync);
update();

// ==============================================
// Original Grid Interaction Logic
// ==============================================
const list = document.querySelector('ul');
const items = list?.querySelectorAll('li');

const setIndex = (event) => {
  const closest = event.target.closest('li');
  if (closest && items) {
    const index = [...items].indexOf(closest);
    const cols = new Array(items.length)
      .fill()
      .map((_, i) => {
        items[i].dataset.active = (index === i).toString();
        return index === i ? '10fr' : '1fr';
      })
      .join(' ');
    list.style.setProperty('grid-template-columns', cols);
  }
};

if (list) {
  list.addEventListener('focus', setIndex, true);
  list.addEventListener('click', setIndex);
  list.addEventListener('pointermove', setIndex);
}

const resync = () => {
  if (items) {
    const w = Math.max(...[...items].map(i => i.offsetWidth));
    list?.style.setProperty('--article-width', w);
  }
};

window.addEventListener('resize', resync);
resync();
