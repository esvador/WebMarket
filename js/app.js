/* WebMarket — shared UI: header, footer, search, toasts, modal, cards, icons (window.UI) */
(function () {
  'use strict';

  var ICONS = {
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>',
    cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    minus: '<path d="M5 12h14"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    'check-circle': '<path d="M21.8 10A10 10 0 1 1 17 3.34"/><path d="m9 11 3 3L22 4"/>',
    sliders: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
    package: '<path d="M11 21.7a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7Z"/><path d="M12 22V12"/><path d="m3.3 7 8.7 5 8.7-5"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>',
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    card: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>',
    shirt: '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23Z"/>',
    footprints: '<ellipse cx="7" cy="7" rx="3" ry="4"/><ellipse cx="17" cy="17" rx="3" ry="4"/><circle cx="7" cy="15.5" r="1.4"/><circle cx="17" cy="4.5" r="1.4"/>',
    watch: '<circle cx="12" cy="12" r="6"/><polyline points="12 10 12 12 13 13"/><path d="M16.51 17.35 16.15 21.18a2 2 0 0 1-2 1.82h-4.32a2 2 0 0 1-2-1.82L7.49 17.35"/><path d="M7.49 6.65 7.85 2.82a2 2 0 0 1 2-1.82h4.32a2 2 0 0 1 2 1.82l.36 3.83"/>',
    lamp: '<path d="M9 2h6l3 7H6z"/><path d="M12 9v12"/><path d="M8 21h8"/>'
  };

  function icon(name) {
    var inner = ICONS[name];
    if (!inner) return '';
    return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var STAR_POINTS = '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2';

  function starSvg(cls) {
    return '<svg class="icon ' + cls + '" viewBox="0 0 24 24"><polygon points="' + STAR_POINTS + '"/></svg>';
  }

  function rating(value, opts) {
    var v = Math.max(0, Math.min(5, value || 0));
    var rounded = Math.round(v * 2) / 2;
    var html = '';
    for (var i = 1; i <= 5; i++) {
      if (rounded >= i) {
        html += starSvg('star-full');
      } else if (rounded >= i - 0.5) {
        html += '<span class="star-half">' + starSvg('star-empty') + starSvg('star-full star-half-fill') + '</span>';
      } else {
        html += starSvg('star-empty');
      }
    }
    var size = (opts && opts.size === 'lg') ? ' stars-lg' : '';
    return '<span class="stars' + size + '" title="' + v.toFixed(1) + ' из 5">' + html + '</span>';
  }

  function toast(msg, type) {
    var container = document.getElementById('toast-container');
    if (!container) return;
    var el = document.createElement('div');
    el.className = 'toast' + (type ? ' toast-' + type : '');
    el.innerHTML = icon(type === 'error' ? 'alert' : 'check-circle') + '<span>' + escapeHtml(msg) + '</span>';
    container.appendChild(el);
    setTimeout(function () {
      el.classList.add('is-leaving');
      setTimeout(function () { el.remove(); }, 200);
    }, 3000);
  }

  function emptyState(opts) {
    var action = opts.actionHref ? '<a href="' + opts.actionHref + '" class="btn btn-primary">' + escapeHtml(opts.actionLabel || '') + '</a>' : '';
    return '<div class="empty-state">' +
      '<div class="empty-state-icon">' + icon(opts.icon || 'package') + '</div>' +
      '<h2>' + escapeHtml(opts.title) + '</h2>' +
      (opts.text ? '<p>' + escapeHtml(opts.text) + '</p>' : '') +
      action +
      '</div>';
  }

  function summaryRows(t) {
    var rows = '<div class="summary-row"><span>Товары (' + t.count + ' шт.)</span><span>' + Store.fmtPrice(t.subtotal) + '</span></div>';
    if (t.discount > 0) {
      rows += '<div class="summary-row is-discount"><span>Скидка</span><span>−' + Store.fmtPrice(t.discount) + '</span></div>';
    }
    rows += '<div class="summary-row"><span>Доставка</span><span>' + (t.shipping === 0 ? 'Бесплатно' : Store.fmtPrice(t.shipping)) + '</span></div>';
    rows += '<div class="summary-row-total"><span>Итого</span><span>' + Store.fmtPrice(t.total) + '</span></div>';
    return rows;
  }

  function productCard(p) {
    var favActive = Store.isFavorite(p.id) ? ' is-active' : '';
    var badge = p.badge === 'hit'
      ? '<span class="badge badge-hit">Хит</span>'
      : (p.badge === 'sale' ? '<span class="badge badge-sale">−' + p.discount + '%</span>' : '');
    var priceHtml = '<span class="price">' + Store.fmtPrice(p.price) + '</span>' +
      (p.oldPrice ? '<span class="price-old">' + Store.fmtPrice(p.oldPrice) + '</span>' : '');
    return (
      '<div class="product-card" data-product-id="' + p.id + '">' +
        '<div class="product-card-media">' +
          '<a href="product.html?id=' + p.id + '" tabindex="-1">' +
            '<img src="' + p.images[0] + '" alt="' + escapeHtml(p.title) + '" loading="lazy">' +
          '</a>' +
          '<div class="product-card-badges">' + badge + '</div>' +
          '<button type="button" class="icon-btn product-card-fav' + favActive + '" data-action="toggle-favorite" data-id="' + p.id + '" aria-label="В избранное">' + icon('heart') + '</button>' +
        '</div>' +
        '<div class="product-card-body">' +
          '<a href="product.html?id=' + p.id + '" class="product-card-title">' + escapeHtml(p.title) + '</a>' +
          '<div class="product-card-rating">' + rating(p.rating) + '<span>' + p.reviewsCount + '</span></div>' +
          '<div class="product-card-price">' + priceHtml + '</div>' +
        '</div>' +
        '<div class="product-card-actions">' +
          '<button type="button" class="btn btn-secondary btn-block btn-sm" data-action="add-to-cart" data-id="' + p.id + '">В корзину</button>' +
        '</div>' +
      '</div>'
    );
  }

  function skeletonCards(n) {
    var card = '<div class="skeleton-card"><div class="skeleton skeleton-img"></div>' +
      '<div class="skeleton-card-body">' +
      '<div class="skeleton skeleton-line"></div>' +
      '<div class="skeleton skeleton-line w-60"></div>' +
      '<div class="skeleton skeleton-line w-40"></div>' +
      '</div></div>';
    return card.repeat(Math.max(0, n));
  }

  function openModal(id) {
    var overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    var focusTarget = overlay.querySelector('input, button, select, textarea');
    if (focusTarget) focusTarget.focus();
  }

  function closeModal() {
    var overlays = document.querySelectorAll('.modal-overlay');
    for (var i = 0; i < overlays.length; i++) overlays[i].hidden = true;
    document.body.style.overflow = '';
  }

  function openDrawer() {
    var drawer = document.getElementById('mobile-drawer');
    var overlay = document.getElementById('drawer-overlay');
    if (drawer) drawer.hidden = false;
    if (overlay) overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    var drawer = document.getElementById('mobile-drawer');
    var overlay = document.getElementById('drawer-overlay');
    if (drawer) drawer.hidden = true;
    if (overlay) overlay.hidden = true;
    document.body.style.overflow = '';
  }

  function setBadge(id, n) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = n > 99 ? '99+' : String(n);
    el.hidden = n === 0;
  }

  function updateHeaderCounts(state) {
    var cartCount = state.cart.reduce(function (sum, l) { return sum + l.qty; }, 0);
    setBadge('cart-count', cartCount);
    setBadge('fav-count', state.favorites.length);
  }

  function highlightActiveCategory() {
    var params = new URLSearchParams(location.search);
    var cat = params.get('category');
    if (!cat) return;
    var links = document.querySelectorAll('.category-nav a');
    links.forEach(function (a) {
      if ((a.getAttribute('href') || '').indexOf('category=' + cat) !== -1) a.classList.add('is-active');
    });
  }

  function buildSearch() {
    var input = document.getElementById('search-input');
    var suggestBox = document.getElementById('search-suggest');
    if (!input || !suggestBox) return;

    var activeIndex = -1;
    var currentResults = [];
    var debounceTimer = null;
    var onCatalogPage = /catalog\.html$/.test(location.pathname);

    var initialQ = new URLSearchParams(location.search).get('q');
    if (initialQ) input.value = initialQ;

    function render(q) {
      currentResults = Catalog.search(q, 6);
      activeIndex = -1;
      if (!q.trim()) { suggestBox.hidden = true; suggestBox.innerHTML = ''; return; }
      if (currentResults.length === 0) {
        suggestBox.innerHTML = '<div class="suggest-empty">Ничего не найдено</div>';
      } else {
        suggestBox.innerHTML = currentResults.map(function (p) {
          return '<div class="suggest-item" data-id="' + p.id + '">' +
            '<img class="suggest-thumb" src="' + p.images[0] + '" alt="">' +
            '<span class="suggest-title">' + escapeHtml(p.title) + '</span>' +
            '<span class="suggest-price">' + Store.fmtPrice(p.price) + '</span>' +
            '</div>';
        }).join('');
      }
      suggestBox.hidden = false;
    }

    function syncCatalogUrl(q) {
      try { history.replaceState(null, '', 'catalog.html' + (q.trim() ? '?q=' + encodeURIComponent(q.trim()) : '')); } catch (e) { /* replaceState may be unavailable on file:// in rare setups */ }
    }

    function goToCatalog(q) {
      if (onCatalogPage) {
        suggestBox.hidden = true;
        document.dispatchEvent(new CustomEvent('wm:search', { detail: { q: q } }));
        syncCatalogUrl(q);
      } else {
        location.href = 'catalog.html' + (q.trim() ? '?q=' + encodeURIComponent(q.trim()) : '');
      }
    }

    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      var q = input.value;
      debounceTimer = setTimeout(function () {
        render(q);
        if (onCatalogPage) {
          document.dispatchEvent(new CustomEvent('wm:search', { detail: { q: q } }));
          syncCatalogUrl(q);
        }
      }, 200);
    });

    input.addEventListener('focus', function () {
      if (input.value.trim()) render(input.value);
    });

    input.addEventListener('keydown', function (e) {
      var items = suggestBox.querySelectorAll('.suggest-item');
      if (e.key === 'ArrowDown') {
        if (!items.length) return;
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, items.length - 1);
        highlightItem(items);
      } else if (e.key === 'ArrowUp') {
        if (!items.length) return;
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        highlightItem(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && currentResults[activeIndex]) {
          location.href = 'product.html?id=' + currentResults[activeIndex].id;
        } else {
          suggestBox.hidden = true;
          goToCatalog(input.value);
        }
      } else if (e.key === 'Escape') {
        suggestBox.hidden = true;
        input.blur();
      }
    });

    function highlightItem(items) {
      items.forEach(function (it, i) { it.classList.toggle('is-active', i === activeIndex); });
      if (items[activeIndex]) items[activeIndex].scrollIntoView({ block: 'nearest' });
    }

    suggestBox.addEventListener('click', function (e) {
      var item = e.target.closest('.suggest-item');
      if (!item) return;
      location.href = 'product.html?id=' + item.getAttribute('data-id');
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.header-search')) suggestBox.hidden = true;
    });
  }

  function mountHeader() {
    var el = document.getElementById('site-header');
    if (!el) return;
    var cats = Catalog.CATEGORIES.map(function (c) {
      return '<a href="catalog.html?category=' + c.id + '">' + c.title + '</a>';
    }).join('');

    el.innerHTML =
      '<header class="site-header">' +
        '<div class="container header-inner">' +
          '<button type="button" class="icon-btn burger" id="burger-btn" aria-label="Открыть меню">' + icon('menu') + '</button>' +
          '<a href="index.html" class="logo">WebMarket</a>' +
          '<div class="header-search">' +
            '<span class="header-search-icon">' + icon('search') + '</span>' +
            '<input type="search" class="input" id="search-input" placeholder="Искать товары..." autocomplete="off" aria-label="Поиск товаров">' +
            '<div class="search-suggest" id="search-suggest" hidden></div>' +
          '</div>' +
          '<nav class="header-actions">' +
            '<a href="favorites.html" class="icon-btn" id="fav-link" aria-label="Избранное">' + icon('heart') + '<span class="badge-count" id="fav-count" hidden>0</span></a>' +
            '<a href="cart.html" class="icon-btn" id="cart-link" aria-label="Корзина">' + icon('cart') + '<span class="badge-count" id="cart-count" hidden>0</span></a>' +
            '<button type="button" class="icon-btn" id="login-btn" aria-label="Войти">' + icon('user') + '</button>' +
          '</nav>' +
        '</div>' +
        '<div class="container"><nav class="category-nav">' + cats + '</nav></div>' +
      '</header>';

    highlightActiveCategory();
    buildSearch();
    updateHeaderCounts(Store.get());
    Store.subscribe(updateHeaderCounts);
  }

  function mountFooter() {
    var el = document.getElementById('site-footer');
    if (!el) return;
    var catLinks = Catalog.CATEGORIES.map(function (c) {
      return '<li><a href="catalog.html?category=' + c.id + '">' + c.title + '</a></li>';
    }).join('');
    el.innerHTML =
      '<footer class="site-footer">' +
        '<div class="container footer-inner">' +
          '<div class="footer-col"><h4>Каталог</h4><ul>' + catLinks + '</ul></div>' +
          '<div class="footer-col"><h4>Покупателям</h4><ul>' +
            '<li><a href="cart.html">Корзина</a></li>' +
            '<li><a href="favorites.html">Избранное</a></li>' +
            '<li><a href="checkout.html">Оформление заказа</a></li>' +
            '<li><a href="#">Доставка и оплата</a></li>' +
            '<li><a href="#">Возврат товара</a></li>' +
          '</ul></div>' +
          '<div class="footer-col"><h4>О компании</h4><ul>' +
            '<li><a href="#">О нас</a></li>' +
            '<li><a href="#">Контакты</a></li>' +
            '<li><a href="#">Вакансии</a></li>' +
          '</ul></div>' +
          '<div class="footer-col"><h4>WebMarket</h4><p>Учебный кликабельный прототип интернет-магазина. Все товары и заказы демонстрационные.</p></div>' +
        '</div>' +
        '<div class="footer-bottom">© 2026 WebMarket — учебный прототип</div>' +
      '</footer>';
  }

  function injectGlobalUI() {
    if (!document.getElementById('toast-container')) {
      var t = document.createElement('div');
      t.id = 'toast-container';
      t.className = 'toast-container';
      t.setAttribute('aria-live', 'polite');
      document.body.appendChild(t);
    }

    if (!document.getElementById('login-modal')) {
      var overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.id = 'login-modal';
      overlay.hidden = true;
      overlay.innerHTML =
        '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="login-title">' +
          '<button type="button" class="icon-btn modal-close" data-modal-close aria-label="Закрыть">' + icon('x') + '</button>' +
          '<h2 class="modal-title" id="login-title">Вход в аккаунт</h2>' +
          '<form id="login-form">' +
            '<div class="field"><label class="field-label" for="login-email">Email</label><input class="input" type="email" id="login-email" placeholder="you@example.com" required></div>' +
            '<div class="field"><label class="field-label" for="login-password">Пароль</label><input class="input" type="password" id="login-password" placeholder="••••••••" required></div>' +
            '<button type="submit" class="btn btn-primary btn-block">Войти</button>' +
            '<p class="modal-hint">Демо-форма — вход выполняется без проверки данных</p>' +
          '</form>' +
        '</div>';
      document.body.appendChild(overlay);
    }

    if (!document.getElementById('mobile-drawer')) {
      var drawerOverlay = document.createElement('div');
      drawerOverlay.className = 'drawer-overlay';
      drawerOverlay.id = 'drawer-overlay';
      drawerOverlay.hidden = true;
      document.body.appendChild(drawerOverlay);

      var catLinks = Catalog.CATEGORIES.map(function (c) {
        return '<a href="catalog.html?category=' + c.id + '">' + c.title + '</a>';
      }).join('');
      var drawer = document.createElement('div');
      drawer.className = 'mobile-drawer';
      drawer.id = 'mobile-drawer';
      drawer.hidden = true;
      drawer.innerHTML =
        '<div class="drawer-head"><span class="logo">WebMarket</span>' +
        '<button type="button" class="icon-btn" id="drawer-close" aria-label="Закрыть меню">' + icon('x') + '</button></div>' +
        '<nav class="drawer-nav">' + catLinks +
          '<hr class="drawer-sep">' +
          '<a href="favorites.html">Избранное</a><a href="cart.html">Корзина</a>' +
          '<hr class="drawer-sep">' +
          '<a href="#" id="drawer-login">Войти</a>' +
        '</nav>';
      document.body.appendChild(drawer);
    }
  }

  function wireGlobalEvents() {
    document.addEventListener('click', function (e) {
      var target = e.target;

      var favBtn = target.closest('[data-action="toggle-favorite"]');
      if (favBtn) {
        var fid = favBtn.getAttribute('data-id');
        Store.toggleFavorite(fid);
        var nowFav = Store.isFavorite(fid);
        favBtn.classList.toggle('is-active', nowFav);
        toast(nowFav ? 'Добавлено в избранное' : 'Удалено из избранного', 'success');
        return;
      }

      var addBtn = target.closest('[data-action="add-to-cart"]');
      if (addBtn) {
        var pid = addBtn.getAttribute('data-id');
        var product = Catalog.byId(pid);
        if (product) {
          Store.addToCart(pid, 1, Catalog.defaultOptions(product));
          toast('Товар добавлен в корзину', 'success');
        }
        return;
      }

      if (target.closest('#burger-btn')) { openDrawer(); return; }
      if (target.closest('#drawer-close') || target.closest('#drawer-overlay')) { closeDrawer(); return; }
      var drawerLogin = target.closest('#drawer-login');
      if (drawerLogin) { e.preventDefault(); closeDrawer(); openModal('login-modal'); return; }
      if (target.closest('#login-btn')) { openModal('login-modal'); return; }
      if (target.closest('[data-modal-close]')) { closeModal(); return; }
      if (target.classList && target.classList.contains('modal-overlay')) { closeModal(); return; }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeModal(); closeDrawer(); }
    });

    document.addEventListener('submit', function (e) {
      if (e.target && e.target.id === 'login-form') {
        e.preventDefault();
        closeModal();
        toast('Вы вошли (демо)', 'success');
      }
    });
  }

  window.UI = {
    icon: icon,
    toast: toast,
    productCard: productCard,
    skeletonCards: skeletonCards,
    rating: rating,
    openModal: openModal,
    closeModal: closeModal,
    mountHeader: mountHeader,
    mountFooter: mountFooter,
    escapeHtml: escapeHtml,
    emptyState: emptyState,
    summaryRows: summaryRows
  };

  mountHeader();
  mountFooter();
  injectGlobalUI();
  wireGlobalEvents();
})();
