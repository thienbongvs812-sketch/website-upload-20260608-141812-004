(function () {
  var header = document.querySelector('[data-header]');
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  function syncHeader() {
    if (!header || header.classList.contains('inner-header')) {
      return;
    }
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var heroIndex = 0;
  var heroTimer = null;

  function showHero(index) {
    if (!slides.length) {
      return;
    }
    heroIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, current) {
      slide.classList.toggle('is-active', current === heroIndex);
    });
    dots.forEach(function (dot, current) {
      dot.classList.toggle('is-active', current === heroIndex);
    });
  }

  function startHero() {
    if (slides.length < 2) {
      return;
    }
    heroTimer = window.setInterval(function () {
      showHero(heroIndex + 1);
    }, 5600);
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var next = Number(dot.getAttribute('data-hero-dot')) || 0;
      showHero(next);
      if (heroTimer) {
        window.clearInterval(heroTimer);
        startHero();
      }
    });
  });

  startHero();

  var filterInputs = Array.prototype.slice.call(document.querySelectorAll('[data-live-filter]'));
  filterInputs.forEach(function (input) {
    var section = input.closest('section') || document;
    var list = document.querySelector('[data-filter-list]');
    var form = input.closest('form');
    var reset = form ? form.querySelector('[data-filter-reset]') : null;

    function applyFilter() {
      var keyword = input.value.trim().toLowerCase();
      var cards = Array.prototype.slice.call(list ? list.querySelectorAll('.movie-card') : section.querySelectorAll('.movie-card'));
      cards.forEach(function (card) {
        var text = ((card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-meta') || '')).toLowerCase();
        card.classList.toggle('is-hidden', Boolean(keyword) && text.indexOf(keyword) === -1);
      });
    }

    input.addEventListener('input', applyFilter);
    if (reset) {
      reset.addEventListener('click', function () {
        window.setTimeout(applyFilter, 0);
      });
    }
  });

  var searchRoot = document.querySelector('[data-search-results]');
  var searchInput = document.querySelector('[data-search-input]');
  if (searchRoot && searchInput && Array.isArray(window.SEARCH_MOVIES)) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    searchInput.value = query;
    if (query.trim()) {
      renderSearch(query.trim());
    }
  }

  function renderSearch(query) {
    var keyword = query.toLowerCase();
    var result = window.SEARCH_MOVIES.filter(function (item) {
      return item.search.indexOf(keyword) !== -1;
    }).slice(0, 96);

    if (!result.length) {
      searchRoot.innerHTML = '<div class="search-empty"><h2>没有找到相关内容</h2><p>换一个片名、地区、类型或标签继续搜索。</p></div>';
      return;
    }

    var html = '<div class="section-heading"><div><span>Result</span><h2>搜索结果</h2></div></div><div class="card-grid four-grid">';
    result.forEach(function (item) {
      html += '<article class="movie-card">';
      html += '<a class="poster-link" href="' + item.url + '" aria-label="观看 ' + escapeHtml(item.title) + '">';
      html += '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy"><span class="play-badge">▶</span></a>';
      html += '<div class="card-body"><div class="card-meta"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.type) + '</span></div>';
      html += '<h2><a href="' + item.url + '">' + escapeHtml(item.title) + '</a></h2>';
      html += '<p>' + escapeHtml(item.oneLine) + '</p><div class="tag-row"><span>' + escapeHtml(item.category) + '</span></div></div></article>';
    });
    html += '</div>';
    searchRoot.innerHTML = html;
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }
})();
