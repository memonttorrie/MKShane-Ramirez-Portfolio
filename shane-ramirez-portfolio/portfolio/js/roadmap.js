(function(){
  var root = document.documentElement,
      themeToggle = document.getElementById('theme-toggle'),
      themeLabel = document.getElementById('theme-label'),
      menu = document.getElementById('menu'),
      burger = document.querySelector('.burger'),
      year = document.getElementById('yr');

  function updateTheme(theme, save) {
    root.dataset.theme = theme;
    var nextTheme = theme === 'dark' ? 'light' : 'dark';
    themeToggle.setAttribute('aria-label', 'Switch to ' + nextTheme + ' mode');
    themeToggle.title = 'Switch to ' + nextTheme + ' mode';
    themeLabel.textContent = nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1) + ' mode';

    if (save) {
      try {
        localStorage.setItem('portfolio-theme', theme);
      } catch (error) {
        console.warn('Could not save the selected color theme.', error);
      }
    }
  }

  updateTheme(root.dataset.theme === 'light' ? 'light' : 'dark', false);
  themeToggle.addEventListener('click', function () {
    updateTheme(root.dataset.theme === 'light' ? 'dark' : 'light', true);
  });

  burger.addEventListener('click', function(){
    var open = menu.classList.toggle('open');
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
  });
  menu.addEventListener('click', function(event){
    if (!event.target.closest('a')) return;
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', false);
  });

  year.textContent = new Date().getFullYear();
})();
