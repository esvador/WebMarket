/* WebMarket — cart page */
(function () {
  'use strict';

  var mainEl = document.getElementById('main-content');

  function lineHtml(line) {
    var p = Catalog.byId(line.id);
    if (!p) return '';
    var optsText = Object.keys(line.options || {}).map(function (k) { return k + ': ' + line.options[k]; }).join(' · ');
    return (
      '<div class="cart-line" data-key="' + line.key + '">' +
        '<a href="product.html?id=' + p.id + '" class="cart-line-media"><img src="' + p.images[0] + '" alt=""></a>' +
        '<div class="cart-line-title-wrap">' +
          '<a href="product.html?id=' + p.id + '" class="cart-line-title overflow-wrap-anywhere">' + UI.escapeHtml(p.title) + '</a>' +
          (optsText ? '<div class="cart-line-options">' + UI.escapeHtml(optsText) + '</div>' : '') +
        '</div>' +
        '<div class="cart-line-right">' +
          '<div class="cart-line-price">' + Store.fmtPrice(p.price * line.qty) + '</div>' +
          '<div class="qty-stepper">' +
            '<button type="button" class="qty-minus" data-key="' + line.key + '" aria-label="Уменьшить количество"' + (line.qty <= 1 ? ' disabled' : '') + '>' + UI.icon('minus') + '</button>' +
            '<input type="text" value="' + line.qty + '" readonly aria-label="Количество">' +
            '<button type="button" class="qty-plus" data-key="' + line.key + '" aria-label="Увеличить количество">' + UI.icon('plus') + '</button>' +
          '</div>' +
          '<button type="button" class="icon-btn" data-action="remove-line" data-key="' + line.key + '" aria-label="Удалить товар">' + UI.icon('trash') + '</button>' +
        '</div>' +
      '</div>'
    );
  }

  function render(state) {
    state = state || Store.get();

    if (state.cart.length === 0) {
      mainEl.innerHTML = '<h1 class="section-title" style="margin-bottom:var(--sp-6)">Корзина</h1>' +
        UI.emptyState({
          icon: 'cart',
          title: 'Корзина пуста',
          text: 'Добавьте товары из каталога, чтобы оформить заказ.',
          actionHref: 'catalog.html',
          actionLabel: 'В каталог'
        });
      return;
    }

    var t = Store.totals();
    var linesHtml = state.cart.map(lineHtml).join('');

    var promoHtml = state.promo === 'SALE10'
      ? '<div class="promo-applied"><span>Промокод SALE10 применён</span><button type="button" id="promo-remove">Убрать</button></div>'
      : (
          '<form class="promo-form" id="promo-form" novalidate>' +
            '<input type="text" class="input" id="promo-input" placeholder="Промокод">' +
            '<button type="submit" class="btn btn-secondary" id="promo-submit" disabled>Применить</button>' +
          '</form>' +
          '<div class="field-error" id="promo-error"></div>'
        );

    mainEl.innerHTML =
      '<h1 class="section-title" style="margin-bottom:var(--sp-6)">Корзина</h1>' +
      '<div class="cart-layout">' +
        '<div class="cart-lines">' + linesHtml + '</div>' +
        '<div class="summary-box">' +
          '<h2 class="summary-title">Сумма заказа</h2>' +
          '<div id="summary-rows">' + UI.summaryRows(t) + '</div>' +
          promoHtml +
          '<button type="button" class="btn btn-primary btn-block btn-lg" id="checkout-btn">Оформить заказ</button>' +
        '</div>' +
      '</div>';
  }

  render();
  Store.subscribe(render);

  mainEl.addEventListener('click', function (e) {
    var plus = e.target.closest('.qty-plus');
    if (plus) {
      var key = plus.getAttribute('data-key');
      var line = Store.get().cart.filter(function (l) { return l.key === key; })[0];
      if (line) Store.setQty(key, line.qty + 1);
      return;
    }

    var minus = e.target.closest('.qty-minus');
    if (minus) {
      var key2 = minus.getAttribute('data-key');
      var line2 = Store.get().cart.filter(function (l) { return l.key === key2; })[0];
      if (line2 && line2.qty > 1) Store.setQty(key2, line2.qty - 1);
      return;
    }

    var removeBtn = e.target.closest('[data-action="remove-line"]');
    if (removeBtn) {
      Store.removeFromCart(removeBtn.getAttribute('data-key'));
      return;
    }

    if (e.target.closest('#promo-remove')) {
      Store.clearPromo();
      return;
    }

    if (e.target.closest('#checkout-btn')) {
      location.href = 'checkout.html';
      return;
    }
  });

  mainEl.addEventListener('submit', function (e) {
    if (!e.target || e.target.id !== 'promo-form') return;
    e.preventDefault();
    var input = document.getElementById('promo-input');
    var result = Store.applyPromo(input.value);
    if (!result.ok) {
      var err = document.getElementById('promo-error');
      if (err) err.textContent = result.error;
      UI.toast(result.error, 'error');
    } else {
      UI.toast('Промокод применён', 'success');
    }
  });

  mainEl.addEventListener('input', function (e) {
    if (!e.target || e.target.id !== 'promo-input') return;
    var submitBtn = document.getElementById('promo-submit');
    if (submitBtn) submitBtn.disabled = !e.target.value.trim();
    var err = document.getElementById('promo-error');
    if (err) err.textContent = '';
  });
})();
