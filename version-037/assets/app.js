(function () {
  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var slides = all('[data-hero-slide]');
  var dots = all('[data-hero-dot]');
  var mini = all('[data-hero-mini]');
  var index = 0;

  function showHero(next) {
    if (!slides.length) return;
    index = (next + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === index);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === index);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showHero(Number(dot.getAttribute('data-hero-dot')) || 0);
    });
  });

  mini.forEach(function (item) {
    item.addEventListener('mouseenter', function () {
      showHero(Number(item.getAttribute('data-hero-mini')) || 0);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showHero(index + 1);
    }, 5200);
  }

  var input = document.querySelector('[data-local-search]');
  var cards = all('.movie-card');
  var buttons = all('[data-category-filter]');
  var activeCategory = 'all';

  function applyFilter() {
    if (!cards.length) return;
    var keyword = input ? input.value.trim().toLowerCase() : '';
    cards.forEach(function (card) {
      var text = card.getAttribute('data-search') || '';
      var category = card.getAttribute('data-category') || '';
      var matchText = !keyword || text.indexOf(keyword) !== -1;
      var matchCategory = activeCategory === 'all' || category === activeCategory;
      card.classList.toggle('is-hidden', !(matchText && matchCategory));
    });
  }

  if (input) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q) input.value = q;
    input.addEventListener('input', applyFilter);
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeCategory = button.getAttribute('data-category-filter') || 'all';
      buttons.forEach(function (b) {
        b.classList.toggle('is-active', b === button);
      });
      applyFilter();
    });
  });

  applyFilter();
})();
