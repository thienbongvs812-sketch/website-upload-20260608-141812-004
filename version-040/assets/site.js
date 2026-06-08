(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    var searchButton = document.querySelector('[data-search-toggle]');
    var search = document.querySelector('[data-header-search]');

    if (menuButton && menu) {
        menuButton.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    if (searchButton && search) {
        searchButton.addEventListener('click', function () {
            search.classList.toggle('is-open');
            var input = search.querySelector('input');
            if (search.classList.contains('is-open') && input) {
                input.focus();
            }
        });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) return;
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }

        function play() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(index + 1);
            }, 5600);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                play();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                play();
            });
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
                play();
            });
        });

        show(0);
        play();
    });

    document.querySelectorAll('.movie-row').forEach(function (row) {
        var section = row.closest('.content-section');
        if (!section) return;
        var prev = section.querySelector('[data-row-prev]');
        var next = section.querySelector('[data-row-next]');
        var amount = Math.max(260, Math.floor(row.clientWidth * 0.8));
        if (prev) {
            prev.addEventListener('click', function () {
                row.scrollBy({ left: -amount, behavior: 'smooth' });
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                row.scrollBy({ left: amount, behavior: 'smooth' });
            });
        }
    });

    document.querySelectorAll('[data-card-scope]').forEach(function (scope) {
        var input = scope.querySelector('[data-filter-input]');
        var select = scope.querySelector('[data-filter-select]');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
        var auto = scope.querySelector('[data-autofill-query]');

        if (auto) {
            var params = new URLSearchParams(window.location.search);
            var q = params.get('q');
            if (q) auto.value = q;
        }

        function filterCards() {
            var query = input ? input.value.trim().toLowerCase() : '';
            var selected = select ? select.value.trim().toLowerCase() : '';
            cards.forEach(function (card) {
                var haystack = (card.getAttribute('data-search') || '').toLowerCase();
                var matched = (!query || haystack.indexOf(query) !== -1) && (!selected || haystack.indexOf(selected) !== -1);
                card.classList.toggle('is-hidden', !matched);
            });
        }

        if (input) input.addEventListener('input', filterCards);
        if (select) select.addEventListener('change', filterCards);
        filterCards();
    });
})();
