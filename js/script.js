/* js/script.js
   Improved, formatted, and accessible menu toggle script.
   - Toggles the "show" class on #menu when #menuBtn is activated
   - Closes menu when a link inside it is clicked
   - Closes menu when clicking outside or pressing Escape
*/

const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');

if (menuBtn && menu) {
  // Toggle menu visibility when button is clicked
  menuBtn.addEventListener('click', () => {
    menu.classList.toggle('show');
  });

  // Close the menu when a link inside it is clicked
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('show');
    });
  });

  // Close the menu when clicking outside of it
  document.addEventListener('click', (event) => {
    // If the menu is open and the click target is outside the menu and button, close it
    if (menu.classList.contains('show') && !menu.contains(event.target) && !menuBtn.contains(event.target)) {
      menu.classList.remove('show');
    }
  });

  // Close the menu when pressing Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
      menu.classList.remove('show');
    }
  });

  // Improve keyboard accessibility: toggle with Enter/Space when the button has focus
  menuBtn.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      menu.classList.toggle('show');
    }
  });

} else {
  // If elements are missing, log a helpful message for debugging
  console.warn('js/script.js: #menuBtn or #menu not found in the DOM.');
}
