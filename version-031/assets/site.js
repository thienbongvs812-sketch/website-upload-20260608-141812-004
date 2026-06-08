(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    document.addEventListener('error', function (event) {
        if (event.target && event.target.tagName === 'IMG') {
            event.target.classList.add('image-error');
        }
    }, true);

    document.querySelectorAll('[data-search-form]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = form.querySelector('input[name="q"]');
            var value = input ? input.value.trim() : '';
            var url = './search.html';
            if (value) {
                url += '?q=' + encodeURIComponent(value);
            }
            window.location.href = url;
        });
    });

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        var active = 0;

        function show(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === active);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === active);
            });
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                show(active + 1);
            }, 5600);
        }
    }

    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search-text]'));
    var liveInput = document.querySelector('[data-live-search]');
    var yearFilter = document.querySelector('[data-year-filter]');
    var typeFilter = document.querySelector('[data-type-filter]');
    var regionFilter = document.querySelector('[data-region-filter]');
    var emptyState = document.querySelector('[data-empty-state]');

    function normalize(value) {
        return (value || '').toLowerCase().replace(/\s+/g, '');
    }

    function runFilter() {
        if (!cards.length) {
            return;
        }

        var query = normalize(liveInput ? liveInput.value : '');
        var year = yearFilter ? yearFilter.value : '';
        var type = typeFilter ? typeFilter.value : '';
        var region = regionFilter ? regionFilter.value : '';
        var visible = 0;

        cards.forEach(function (card) {
            var text = normalize(card.getAttribute('data-search-text'));
            var matchesQuery = !query || text.indexOf(query) !== -1;
            var matchesYear = !year || card.getAttribute('data-year') === year;
            var matchesType = !type || card.getAttribute('data-type').indexOf(type) !== -1;
            var matchesRegion = !region || card.getAttribute('data-region').indexOf(region) !== -1;
            var showCard = matchesQuery && matchesYear && matchesType && matchesRegion;
            card.style.display = showCard ? '' : 'none';
            if (showCard) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle('is-visible', visible === 0);
        }
    }

    if (liveInput) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q) {
            liveInput.value = q;
        }
        liveInput.addEventListener('input', runFilter);
    }

    [yearFilter, typeFilter, regionFilter].forEach(function (control) {
        if (control) {
            control.addEventListener('change', runFilter);
        }
    });

    runFilter();
})();
