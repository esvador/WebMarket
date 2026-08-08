/* WebMarket — catalog page: filters, sort, pagination, mobile drawer */
(function () {
  'use strict';

  var PAGE_SIZE = 12;
  var mainEl = document.getElementById('main-content');

  var params = new URLSearchParams(location.search);
  var initialCategory = params.get('category');

  var state = {
    category: new Set(),
    priceMin: null,
    priceMax: null,
    rating: 0,
    sort: 'popularity',
    query: params.get('q') || '',
    visibleCount: PAGE_SIZE
  };
  if (initialCategory && Catalog.CATEGORIES.some(function (c) { return c.id === initialCategory; })) {
    state.category.add(initialCategory);
  }

  function pluralizeRu(n, one, few, many) {
    var mod10 = n % 10, mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
    return many;
  }

  function computeResults() {
    var list = state.query.trim() ? Catalog.search(state.query) : Catalog.PRODUCTS.slice();
    if (state.category.size > 0) list = list.filter(function (p) { return state.category.has(p.category); });
    if (state.priceMin != null) list = list.filter(function (p) { return p.price >= state.priceMin; });
    if (state.priceMax != null) list = list.filter(function (p) { return p.price <= state.priceMax; });
    if (state.rating > 0) list = list.filter(function (p) { return p.rating >= state.rating; });
    list.sort(function (a, b) {
      if (state.sort === 'price-asc') return a.price - b.price;
      if (state.sort === 'price-desc') return b.price - a.price;
      return b.popularity - a.popularity;
    });
    return list;
  }

  function categoryFilterHtml() {
    return Catalog.CATEGORIES.map(function (c) {
      return '<label class="checkbox"><input type="checkbox" value="' + c.id + '"' + (state.category.has(c.id) ? ' checked' : '') + '>' + UI.escapeHtml(c.title) + '</label>';
    }).join('');
  }

  function ratingFilterHtml() {
    var options = [{ v: 0, label: 'Любой' }, { v: 3, label: 'От 3★ и выше' }, { v: 4, label: 'От 4★ и выше' }, { v: 4.5, label: 'От 4.5★ и выше' }];
    return options.map(function (o) {
      return '<label class="radio"><input type="radio" name="rating-filter" value="' + o.v + '"' + (state.rating === o.v ? ' checked' : '') + '>' + o.label + '</label>';
    }).join('');
  }

  mainEl.innerHTML =
    '<div class="section-head"><h1 class="section-title" id="catalog-title">Каталог</h1></div>' +
    '<div class="catalog-layout">' +
      '<aside class="filters" id="filters">' +
        '<div class="filter-group"><span class="filter-title">Категории</span><div class="filter-options" id="filter-categories">' + categoryFilterHtml() + '</div></div>' +
        '<div class="filter-group"><span class="filter-title">Цена, ₽</span><div class="filter-price">' +
          '<input type="number" class="input" id="price-min" placeholder="' + Catalog.priceRange.min + '" min="0">' +
          '<span>—</span>' +
          '<input type="number" class="input" id="price-max" placeholder="' + Catalog.priceRange.max + '" min="0">' +
        '</div></div>' +
        '<div class="filter-group"><span class="filter-title">Рейтинг</span><div class="filter-options" id="filter-rating">' + ratingFilterHtml() + '</div></div>' +
        '<button type="button" class="btn btn-secondary btn-block" id="reset-filters">Сбросить фильтры</button>' +
        '<button type="button" class="btn btn-primary btn-block filters-apply-btn" id="apply-filters-mobile">Показать товары</button>' +
      '</aside>' +
      '<div class="catalog-main">' +
        '<div class="catalog-toolbar">' +
          '<button type="button" class="btn btn-secondary filters-toggle-btn" id="filters-toggle">' + UI.icon('sliders') + '<span id="filters-toggle-label">Фильтры</span></button>' +
          '<span class="result-count" id="result-count"></span>' +
          '<div class="sort-control"><label for="sort-select">Сортировка:</label>' +
            '<select class="select" id="sort-select">' +
              '<option value="popularity">По популярности</option>' +
              '<option value="price-asc">Сначала дешевле</option>' +
              '<option value="price-desc">Сначала дороже</option>' +
            '</select>' +
          '</div>' +
        '</div>' +
        '<div class="grid grid-4" id="catalog-grid"></div>' +
        '<div class="empty-state" id="catalog-empty" hidden>' +
          '<div class="empty-state-icon">' + UI.icon('search') + '</div>' +
          '<h2>Ничего не найдено</h2>' +
          '<p>Попробуйте изменить фильтры или поисковый запрос.</p>' +
          '<button type="button" class="btn btn-primary" id="reset-filters-empty">Сбросить фильтры</button>' +
        '</div>' +
        '<div class="load-more-wrap" id="load-more-wrap"><button type="button" class="btn btn-secondary" id="load-more">Показать ещё</button></div>' +
      '</div>' +
    '</div>' +
    '<div class="drawer-overlay" id="filters-overlay" hidden></div>';

  function activeFilterCount() {
    var n = state.category.size;
    if (state.priceMin != null) n++;
    if (state.priceMax != null) n++;
    if (state.rating > 0) n++;
    return n;
  }

  function updateTitle() {
    var titleEl = document.getElementById('catalog-title');
    if (state.query.trim()) {
      titleEl.textContent = 'Результаты по запросу «' + state.query.trim() + '»';
    } else if (state.category.size === 1) {
      var catId = Array.from(state.category)[0];
      var cat = Catalog.CATEGORIES.filter(function (c) { return c.id === catId; })[0];
      titleEl.textContent = cat ? cat.title : 'Каталог';
    } else {
      titleEl.textContent = 'Каталог';
    }
  }

  function updateFiltersMeta() {
    var label = document.getElementById('filters-toggle-label');
    if (label) {
      var n = activeFilterCount();
      label.textContent = n > 0 ? ('Фильтры (' + n + ')') : 'Фильтры';
    }
    var applyBtn = document.getElementById('apply-filters-mobile');
    if (applyBtn) {
      var count = computeResults().length;
      applyBtn.textContent = 'Показать ' + count + ' ' + pluralizeRu(count, 'товар', 'товара', 'товаров');
    }
  }

  function renderGrid() {
    var results = computeResults();
    var toShow = results.slice(0, state.visibleCount);
    var gridEl = document.getElementById('catalog-grid');
    var emptyEl = document.getElementById('catalog-empty');
    var loadMoreWrap = document.getElementById('load-more-wrap');

    if (results.length === 0) {
      gridEl.innerHTML = '';
      emptyEl.hidden = false;
      loadMoreWrap.hidden = true;
    } else {
      emptyEl.hidden = true;
      gridEl.innerHTML = toShow.map(UI.productCard).join('');
      var remaining = results.length - toShow.length;
      if (remaining <= 0) {
        loadMoreWrap.hidden = true;
      } else {
        loadMoreWrap.hidden = false;
        document.getElementById('load-more').textContent = 'Показать ещё (' + remaining + ')';
      }
    }

    document.getElementById('result-count').textContent = results.length + ' ' + pluralizeRu(results.length, 'товар', 'товара', 'товаров');
    updateFiltersMeta();
  }

  function onFilterChange() {
    state.visibleCount = PAGE_SIZE;
    updateTitle();
    renderGrid();
  }

  function resetFilters() {
    state.category.clear();
    state.priceMin = null;
    state.priceMax = null;
    state.rating = 0;
    document.getElementById('price-min').value = '';
    document.getElementById('price-max').value = '';
    mainEl.querySelectorAll('#filter-categories input').forEach(function (cb) { cb.checked = false; });
    var anyRadio = mainEl.querySelector('#filter-rating input[value="0"]');
    if (anyRadio) anyRadio.checked = true;
    onFilterChange();
  }

  function openMobileFilters() {
    document.getElementById('filters').classList.add('is-open');
    document.getElementById('filters-overlay').hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeMobileFilters() {
    document.getElementById('filters').classList.remove('is-open');
    document.getElementById('filters-overlay').hidden = true;
    document.body.style.overflow = '';
  }

  function initialRender() {
    document.getElementById('catalog-grid').innerHTML = UI.skeletonCards(8);
    document.getElementById('load-more-wrap').hidden = true;
    updateTitle();
    setTimeout(renderGrid, 400);
  }

  initialRender();

  mainEl.addEventListener('click', function (e) {
    if (e.target.closest('#filters-toggle')) { openMobileFilters(); return; }
    if (e.target.closest('#filters-overlay') || e.target.closest('#apply-filters-mobile')) { closeMobileFilters(); return; }
    if (e.target.closest('#reset-filters') || e.target.closest('#reset-filters-empty')) { resetFilters(); return; }
    if (e.target.closest('#load-more')) { state.visibleCount += PAGE_SIZE; renderGrid(); return; }
  });

  mainEl.addEventListener('change', function (e) {
    if (e.target.closest('#filter-categories')) {
      var value = e.target.value;
      if (e.target.checked) state.category.add(value); else state.category.delete(value);
      onFilterChange();
      return;
    }
    if (e.target.name === 'rating-filter') {
      state.rating = Number(e.target.value);
      onFilterChange();
      return;
    }
    if (e.target.id === 'price-min') {
      state.priceMin = e.target.value ? Number(e.target.value) : null;
      onFilterChange();
      return;
    }
    if (e.target.id === 'price-max') {
      state.priceMax = e.target.value ? Number(e.target.value) : null;
      onFilterChange();
      return;
    }
    if (e.target.id === 'sort-select') {
      state.sort = e.target.value;
      renderGrid();
      return;
    }
  });

  document.addEventListener('wm:search', function (e) {
    state.query = (e.detail && e.detail.q) || '';
    state.visibleCount = PAGE_SIZE;
    updateTitle();
    renderGrid();
  });
})();
