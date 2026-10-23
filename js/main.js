(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Photo fallback: drop your picture at images/profile.png
  var photo = document.getElementById('photo');
  photo.onerror = function(){ photo.onerror = null; photo.src = 'images/profile-placeholder.svg'; };

  document.getElementById('yr').textContent = new Date().getFullYear();

  var themeToggle = document.getElementById('theme-toggle'),
      themeLabel = document.getElementById('theme-label'),
      root = document.documentElement;

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

  // Mobile menu
  var burger = document.querySelector('.burger'), menu = document.getElementById('menu');
  burger.addEventListener('click', function(){
    var open = menu.classList.toggle('open');
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
  });
  menu.addEventListener('click', function(){
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', false);
  });

  // Cursor glow
  var glow = document.querySelector('.glow');
  if(!reduce) addEventListener('pointermove', function(e){ glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });

  // Photo card tilt
  var card = document.getElementById('card');
  if(!reduce && matchMedia('(hover:hover)').matches){
    card.addEventListener('pointerenter', function(){ card.classList.add('dancing'); });
    card.addEventListener('pointermove', function(e){
      var b = card.getBoundingClientRect();
      var x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
      card.style.transform = 'perspective(800px) rotateY(' + x * 12 + 'deg) rotateX(' + -y * 12 + 'deg)';
    });
    card.addEventListener('pointerleave', function(){
      card.classList.remove('dancing');
      card.style.transform = '';
    });
  }

  // Reveal sections, fill XP bars, count up stats
  document.querySelectorAll('.sec, .stats').forEach(function(s){ s.classList.add('rv'); });
  document.querySelectorAll('.bar').forEach(function(b){ b.style.setProperty('--v', b.dataset.v); });

  function count(node){
    var end = +node.dataset.n, suf = node.dataset.suf || '';
    if(reduce){ node.textContent = end.toLocaleString() + suf; return; }
    var t0 = null;
    (function step(t){
      t0 = t0 || t;
      var p = Math.min((t - t0) / 1400, 1);
      node.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString() + suf;
      if(p < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      var t = e.target;
      t.classList.add('in');
      t.querySelectorAll('.bar').forEach(function(b){ b.classList.add('go'); });
      t.querySelectorAll('[data-n]').forEach(count);
      io.unobserve(t);
    });
  }, { threshold: .15 });
  document.querySelectorAll('.rv').forEach(function(s){ io.observe(s); });
})();
