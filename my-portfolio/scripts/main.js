// Nav toggle for small screens
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('nav-menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(!expanded));
  });
}

// Year in footer
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// --- MOBILE TOUCH CONTROLS ---
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const btnJump = document.getElementById('btn-jump');
const btnInteract = document.getElementById('btn-interact');

if (btnLeft && btnRight && btnJump && btnInteract) {
  const handleTouch = (key, state) => {
    if (key === 'left') keys.left = state;
    if (key === 'right') keys.right = state;
    if (key === 'up') keys.up = state;
    if (key === 'interact') {
        keys.interact = state;
        if(state) checkInteraction(); // Trigger interaction immediately on press
    }
  };

  // Touch Start Events
  btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); handleTouch('left', true); });
  btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); handleTouch('right', true); });
  btnJump.addEventListener('touchstart', (e) => { e.preventDefault(); handleTouch('up', true); });
  btnInteract.addEventListener('touchstart', (e) => { e.preventDefault(); handleTouch('interact', true); });

  // Touch End Events
  btnLeft.addEventListener('touchend', (e) => { e.preventDefault(); handleTouch('left', false); });
  btnRight.addEventListener('touchend', (e) => { e.preventDefault(); handleTouch('right', false); });
  btnJump.addEventListener('touchend', (e) => { e.preventDefault(); handleTouch('up', false); });
  btnInteract.addEventListener('touchend', (e) => { e.preventDefault(); handleTouch('interact', false); });
}