/* WebMarket — product detail page */
(function () {
  'use strict';

  var mainEl = document.getElementById('main-content');
  var id = new URLSearchParams(location.search).get('id');
  var product = Catalog.byId(id);

  if (!product) {
    document.title = 'Товар не найден — WebMarket';
    mainEl.innerHTML = UI.emptyState({
      icon: 'alert',
      title: 'Товар не найден',
      text: 'Возможно, товар удалён или ссылка указана неверно.',
      actionHref: 'catalog.html',
      actionLabel: 'В каталог'
    });
    return;
  }

  document.title = product.title + ' — WebMarket';

  var selectedOptions = Catalog.defaultOptions(product);
  var qty = 1;
  var category = Catalog.CATEGORIES.filter(function (c) { return c.id === product.category; })[0];

  function specsTable(specs) {
    var rows = Object.keys(specs).map(function (k) {
      return '<tr><td>' + UI.escapeHtml(k) + '</td><td>' + UI.escapeHtml(specs[k]) + '</td></tr>';
    }).join('');
    return '<table class="specs-table"><tbody>' + rows + '</tbody></table>';
  }

  function reviewsList(reviews) {
    if (!reviews.length) return '<p>Пока нет отзывов об этом товаре.</p>';
    return reviews.map(function (r) {
      return '<div class="review">' +
        '<div class="review-head"><span class="review-author">' + UI.escapeHtml(r.author) + '</span><span class="review-date">' + UI.escapeHtml(r.date) + '</span></div>' +
        '<div class="review-stars">' + UI.rating(r.rating) + '</div>' +
        '<p class="review-text">' + UI.escapeHtml(r.text) + '</p>' +
        '</div>';
    }).join('');
  }

  function optionGroup(opt) {
    var pills = opt.values.map(function (v) {
      var isColor = v && typeof v === 'object';
      var value = isColor ? v.name : v;
      var selected = selectedOptions[opt.label] === value;
      if (isColor) {
        return '<button type="button" class="pill pill-color' + (selected ? ' is-selected' : '') + '" data-label="' + UI.escapeHtml(opt.label) + '" data-value="' + UI.escapeHtml(value) + '" title="' + UI.escapeHtml(value) + '" aria-label="' + UI.escapeHtml(value) + '"><span style="background:' + v.hex + '"></span></button>';
      }
      return '<button type="button" class="pill' + (selected ? ' is-selected' : '') + '" data-label="' + UI.escapeHtml(opt.label) + '" data-value="' + UI.escapeHtml(value) + '">' + UI.escapeHtml(value) + '</button>';
    }).join('');
    return '<div class="option-group"><span class="option-group-label">' + UI.escapeHtml(opt.label) + '</span><div class="pill-group">' + pills + '</div></div>';
  }

  var badgeHtml = product.badge === 'hit'
    ? '<span class="badge badge-hit">Хит</span>'
    : (product.badge === 'sale' ? '<span class="badge badge-sale">−' + product.discount + '%</span>' : '');

  var priceHtml = '<span class="price">' + Store.fmtPrice(product.price) + '</span>' +
    (product.oldPrice ? '<span class="price-old">' + Store.fmtPrice(product.oldPrice) + '</span>' : '') + badgeHtml;

  mainEl.innerHTML =
    '<nav class="breadcrumbs">' +
      '<a href="index.html">Главная</a><span>/</span>' +
      '<a href="catalog.html?category=' + category.id + '">' + UI.escapeHtml(category.title) + '</a><span>/</span>' +
      '<span>' + UI.escapeHtml(product.title) + '</span>' +
    '</nav>' +
    '<div class="product-layout">' +
      '<div class="product-gallery">' +
        '<div class="gallery-main"><img id="gallery-main-img" src="' + product.images[0] + '" alt="' + UI.escapeHtml(product.title) + '"></div>' +
        '<div class="gallery-thumbs">' +
          product.images.map(function (img, i) {
            return '<button type="button" class="gallery-thumb' + (i === 0 ? ' is-active' : '') + '" data-index="' + i + '"><img src="' + img + '" alt=""></button>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<div class="product-info">' +
        '<h1 class="product-info-title overflow-wrap-anywhere">' + UI.escapeHtml(product.title) + '</h1>' +
        '<div class="product-info-rating">' + UI.rating(product.rating, { size: 'lg' }) +
          '<a href="#reviews-tab" id="reviews-link">' + product.reviewsCount + ' отзывов</a>' +
        '</div>' +
        '<div class="product-info-price">' + priceHtml + '</div>' +
        (product.options || []).map(optionGroup).join('') +
        '<div class="option-group">' +
          '<span class="option-group-label">Количество</span>' +
          '<div class="qty-stepper" id="qty-stepper">' +
            '<button type="button" id="qty-minus" aria-label="Уменьшить количество" disabled>' + UI.icon('minus') + '</button>' +
            '<input type="text" id="qty-input" value="1" readonly aria-label="Количество товара">' +
            '<button type="button" id="qty-plus" aria-label="Увеличить количество">' + UI.icon('plus') + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="product-actions-row">' +
          '<button type="button" class="btn btn-primary btn-lg" id="pdp-add-cart">В корзину</button>' +
          '<button type="button" class="btn btn-secondary btn-lg" id="pdp-buy-now">Купить сейчас</button>' +
          '<button type="button" class="icon-btn' + (Store.isFavorite(product.id) ? ' is-active' : '') + '" id="pdp-fav-btn" aria-label="В избранное">' + UI.icon('heart') + '</button>' +
        '</div>' +
        '<div class="tabs" role="tablist">' +
          '<button type="button" class="tab is-active" data-tab="description" role="tab" aria-selected="true">Описание</button>' +
          '<button type="button" class="tab" data-tab="specs" role="tab" aria-selected="false">Характеристики</button>' +
          '<button type="button" class="tab" data-tab="reviews" role="tab" aria-selected="false">Отзывы (' + product.reviewsCount + ')</button>' +
        '</div>' +
        '<div class="tab-panel" data-panel="description"><p class="overflow-wrap-anywhere">' + UI.escapeHtml(product.description) + '</p></div>' +
        '<div class="tab-panel" data-panel="specs" hidden>' + specsTable(product.specs) + '</div>' +
        '<div class="tab-panel" data-panel="reviews" id="reviews-tab" hidden>' + reviewsList(product.reviews) + '</div>' +
      '</div>' +
    '</div>' +
    '<section class="section">' +
      '<div class="section-head"><h2 class="section-title">Похожие товары</h2></div>' +
      '<div class="grid grid-4" id="related-grid"></div>' +
    '</section>';

  var related = Catalog.byCategory(product.category).filter(function (p) { return p.id !== product.id; }).slice(0, 4);
  document.getElementById('related-grid').innerHTML = related.map(UI.productCard).join('');

  function syncQty() {
    document.getElementById('qty-input').value = String(qty);
    document.getElementById('qty-minus').disabled = qty <= 1;
  }

  mainEl.addEventListener('click', function (e) {
    var pill = e.target.closest('.pill');
    if (pill) {
      var group = pill.closest('.pill-group');
      selectedOptions[pill.getAttribute('data-label')] = pill.getAttribute('data-value');
      group.querySelectorAll('.pill').forEach(function (p) { p.classList.toggle('is-selected', p === pill); });
      return;
    }

    var thumb = e.target.closest('.gallery-thumb');
    if (thumb) {
      var idx = Number(thumb.getAttribute('data-index'));
      document.getElementById('gallery-main-img').src = product.images[idx];
      document.querySelectorAll('.gallery-thumb').forEach(function (t) { t.classList.toggle('is-active', t === thumb); });
      return;
    }

    var tabBtn = e.target.closest('.tab');
    if (tabBtn) {
      var tabName = tabBtn.getAttribute('data-tab');
      document.querySelectorAll('.tab').forEach(function (t) {
        var active = t === tabBtn;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      document.querySelectorAll('.tab-panel').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== tabName; });
      return;
    }

    if (e.target.closest('#reviews-link')) {
      e.preventDefault();
      var reviewsTabBtn = mainEl.querySelector('.tab[data-tab="reviews"]');
      if (reviewsTabBtn) reviewsTabBtn.click();
      var panel = document.getElementById('reviews-tab');
      if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (e.target.closest('#qty-plus')) { qty += 1; syncQty(); return; }
    if (e.target.closest('#qty-minus')) { if (qty > 1) qty -= 1; syncQty(); return; }

    if (e.target.closest('#pdp-add-cart')) {
      Store.addToCart(product.id, qty, Object.assign({}, selectedOptions));
      UI.toast('Товар добавлен в корзину', 'success');
      return;
    }

    if (e.target.closest('#pdp-buy-now')) {
      Store.addToCart(product.id, qty, Object.assign({}, selectedOptions));
      location.href = 'checkout.html';
      return;
    }

    if (e.target.closest('#pdp-fav-btn')) {
      Store.toggleFavorite(product.id);
      var favBtn = document.getElementById('pdp-fav-btn');
      var isFav = Store.isFavorite(product.id);
      favBtn.classList.toggle('is-active', isFav);
      UI.toast(isFav ? 'Добавлено в избранное' : 'Удалено из избранного', 'success');
      return;
    }
  });
})();
