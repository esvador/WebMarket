/* WebMarket — checkout page (delivery -> payment -> done) */
(function () {
  'use strict';

  var mainEl = document.getElementById('main-content');
  var currentStep = 1;
  var delivery = { shipping: 'courier' };
  var payment = { method: 'card' };

  var STEP_LABELS = [{ n: 1, label: 'Доставка' }, { n: 2, label: 'Оплата' }, { n: 3, label: 'Готово' }];
  var SHIP_OPTIONS = [
    { id: 'courier', label: 'Курьером, 1-2 дня', price: 350 },
    { id: 'pickup', label: 'В пункт выдачи', price: 200 },
    { id: 'self', label: 'Самовывоз из магазина', price: 0 }
  ];
  var PAY_OPTIONS = [
    { id: 'card', label: 'Картой онлайн' },
    { id: 'cod', label: 'При получении' }
  ];
  var MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

  function stepperButtons(current) {
    return STEP_LABELS.map(function (s, idx) {
      var clickable = s.n < current;
      var cls = 'stepper-step' + (s.n < current ? ' is-done' : (s.n === current ? ' is-active' : '')) + (clickable ? ' is-clickable' : '');
      var dot = s.n < current ? UI.icon('check') : String(s.n);
      var sep = idx < STEP_LABELS.length - 1 ? '<div class="stepper-sep' + (s.n < current ? ' is-done' : '') + '"></div>' : '';
      return '<button type="button" class="' + cls + '" data-goto-step="' + s.n + '"' + (clickable ? '' : ' disabled') + '>' +
        '<span class="stepper-dot">' + dot + '</span><span>' + s.label + '</span></button>' + sep;
    }).join('');
  }

  function shipOptionHtml(opt) {
    var selected = delivery.shipping === opt.id;
    return '<label class="ship-option' + (selected ? ' is-selected' : '') + '">' +
      '<span class="ship-option-label"><span class="radio"><input type="radio" name="shipping" value="' + opt.id + '"' + (selected ? ' checked' : '') + '></span>' + UI.escapeHtml(opt.label) + '</span>' +
      '<span class="ship-option-price">' + (opt.price === 0 ? 'Бесплатно' : Store.fmtPrice(opt.price)) + '</span>' +
      '</label>';
  }

  function payOptionHtml(opt) {
    var selected = payment.method === opt.id;
    return '<label class="pay-option' + (selected ? ' is-selected' : '') + '">' +
      '<span class="pay-option-label"><span class="radio"><input type="radio" name="payment" value="' + opt.id + '"' + (selected ? ' checked' : '') + '></span>' + UI.escapeHtml(opt.label) + '</span>' +
      '</label>';
  }

  function successHtml(order) {
    return '<div class="success-panel">' +
      '<div class="success-icon">' + UI.icon('check-circle') + '</div>' +
      '<h2>Заказ оформлен!</h2>' +
      '<p class="success-order-no">Номер заказа: <strong>' + UI.escapeHtml(order.number) + '</strong></p>' +
      '<p class="success-order-no">Дата: ' + UI.escapeHtml(order.date) + '</p>' +
      '<div class="success-total">' + Store.fmtPrice(order.total) + '</div>' +
      '<a href="index.html" class="btn btn-primary btn-lg">Вернуться в магазин</a>' +
      '</div>';
  }

  function formatOrderDate() {
    var d = new Date();
    return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  }

  function formatPhone(value) {
    var digits = value.replace(/\D/g, '');
    if (digits.charAt(0) === '8') digits = '7' + digits.slice(1);
    if (digits.charAt(0) !== '7') digits = '7' + digits;
    digits = digits.slice(0, 11);
    var rest = digits.slice(1);
    var out = '+7';
    if (rest.length > 0) out += ' (' + rest.slice(0, 3);
    if (rest.length >= 3) out += ')';
    if (rest.length > 3) out += ' ' + rest.slice(3, 6);
    if (rest.length > 6) out += '-' + rest.slice(6, 8);
    if (rest.length > 8) out += '-' + rest.slice(8, 10);
    return out;
  }

  function formatCardNumber(value) {
    return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  }

  function formatExpiry(value) {
    var digits = value.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
  }

  function renderEmpty() {
    mainEl.innerHTML = '<h1 class="section-title" style="margin-bottom:var(--sp-6)">Оформление заказа</h1>' +
      UI.emptyState({
        icon: 'cart',
        title: 'Корзина пуста',
        text: 'Добавьте товары из каталога, чтобы оформить заказ.',
        actionHref: 'catalog.html',
        actionLabel: 'В каталог'
      });
  }

  function renderDoneOnly(order) {
    mainEl.innerHTML = '<h1 class="section-title" style="margin-bottom:var(--sp-6)">Оформление заказа</h1>' +
      '<div class="stepper" id="stepper">' + stepperButtons(3) + '</div>' +
      '<div id="step-content">' + successHtml(order) + '</div>';
  }

  function updateStepper(step) {
    var el = document.getElementById('stepper');
    if (el) el.innerHTML = stepperButtons(step);
  }

  function updateSummary() {
    var rowsEl = document.getElementById('summary-rows');
    if (rowsEl) rowsEl.innerHTML = UI.summaryRows(Store.totals(delivery.shipping));
  }

  function goToStepPanel(step) {
    currentStep = step;
    mainEl.querySelectorAll('.step-panel').forEach(function (p) {
      p.hidden = Number(p.getAttribute('data-step-panel')) !== step;
    });
    updateStepper(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function validateStep1() {
    var ok = true;
    [['f-name', 'err-name'], ['f-phone', 'err-phone'], ['f-address', 'err-address']].forEach(function (pair) {
      var input = document.getElementById(pair[0]);
      var err = document.getElementById(pair[1]);
      var valid = input.value.trim().length > 0;
      input.classList.toggle('is-invalid', !valid);
      if (err) err.hidden = valid;
      if (!valid) ok = false;
    });
    return ok;
  }

  function validateStep2() {
    if (payment.method !== 'card') return true;
    var numEl = document.getElementById('f-card-number');
    var expEl = document.getElementById('f-card-expiry');
    var cvvEl = document.getElementById('f-card-cvv');
    var numOk = numEl.value.replace(/\s/g, '').length === 16;
    var expOk = /^\d{2}\/\d{2}$/.test(expEl.value);
    var cvvOk = cvvEl.value.length === 3;
    numEl.classList.toggle('is-invalid', !numOk);
    expEl.classList.toggle('is-invalid', !expOk);
    cvvEl.classList.toggle('is-invalid', !cvvOk);
    return numOk && expOk && cvvOk;
  }

  function startPayment() {
    var payBtn = document.getElementById('pay-btn');
    var backBtn = document.getElementById('to-step-1');
    payBtn.disabled = true;
    payBtn.innerHTML = '<span class="spinner"></span> Оплата...';
    if (backBtn) backBtn.disabled = true;

    setTimeout(function () {
      var order = {
        number: 'WM-' + String(Math.floor(100000 + Math.random() * 900000)),
        total: Store.totals(delivery.shipping).total,
        date: formatOrderDate()
      };
      Store.setOrder(order);
      Store.clearCart();
      Store.clearPromo();
      currentStep = 3;
      updateStepper(3);
      document.getElementById('step-content').innerHTML = successHtml(order);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500 + Math.random() * 500);
  }

  function renderForm() {
    mainEl.innerHTML =
      '<h1 class="section-title" style="margin-bottom:var(--sp-6)">Оформление заказа</h1>' +
      '<div class="stepper" id="stepper">' + stepperButtons(1) + '</div>' +
      '<div id="step-content">' +
        '<div class="checkout-layout">' +
          '<div class="checkout-col">' +

            '<div class="step-panel" data-step-panel="1">' +
              '<div class="checkout-card">' +
                '<h3>Контактные данные и адрес</h3>' +
                '<div class="checkout-form">' +
                  '<div class="field"><label class="field-label" for="f-name">Имя и фамилия <span class="required-hint" id="err-name" hidden>— обязательное поле</span></label>' +
                  '<input class="input" id="f-name" type="text" placeholder="Иван Иванов"></div>' +
                  '<div class="field"><label class="field-label" for="f-phone">Телефон <span class="required-hint" id="err-phone" hidden>— обязательное поле</span></label>' +
                  '<input class="input" id="f-phone" type="tel" inputmode="numeric" placeholder="+7 (___) ___-__-__"></div>' +
                  '<div class="field"><label class="field-label" for="f-address">Адрес доставки <span class="required-hint" id="err-address" hidden>— обязательное поле</span></label>' +
                  '<input class="input" id="f-address" type="text" placeholder="Город, улица, дом, квартира"></div>' +
                '</div>' +
              '</div>' +
              '<div class="checkout-card">' +
                '<h3>Способ доставки</h3>' +
                '<div class="checkout-form" id="shipping-options">' + SHIP_OPTIONS.map(shipOptionHtml).join('') + '</div>' +
              '</div>' +
              '<div class="checkout-actions">' +
                '<span></span>' +
                '<button type="button" class="btn btn-primary btn-lg" id="to-step-2">Далее: оплата</button>' +
              '</div>' +
            '</div>' +

            '<div class="step-panel" data-step-panel="2" hidden>' +
              '<div class="checkout-card">' +
                '<h3>Способ оплаты</h3>' +
                '<div class="checkout-form" id="payment-options">' + PAY_OPTIONS.map(payOptionHtml).join('') + '</div>' +
                '<div class="card-fields" id="card-fields"' + (payment.method !== 'card' ? ' hidden' : '') + '>' +
                  '<div class="field"><label class="field-label" for="f-card-number">Номер карты</label>' +
                  '<input class="input" id="f-card-number" type="text" inputmode="numeric" autocomplete="off" placeholder="0000 0000 0000 0000" maxlength="19"></div>' +
                  '<div class="input-row input-row-2">' +
                    '<div class="field"><label class="field-label" for="f-card-expiry">Срок действия</label>' +
                    '<input class="input" id="f-card-expiry" type="text" inputmode="numeric" autocomplete="off" placeholder="MM/YY" maxlength="5"></div>' +
                    '<div class="field"><label class="field-label" for="f-card-cvv">CVV</label>' +
                    '<input class="input" id="f-card-cvv" type="password" inputmode="numeric" autocomplete="off" placeholder="123" maxlength="3"></div>' +
                  '</div>' +
                  '<p class="demo-note">Демо-форма — данные карты никуда не отправляются и не сохраняются.</p>' +
                '</div>' +
              '</div>' +
              '<div class="checkout-actions">' +
                '<button type="button" class="btn btn-secondary" id="to-step-1">Назад</button>' +
                '<button type="button" class="btn btn-primary btn-lg" id="pay-btn">Оплатить</button>' +
              '</div>' +
            '</div>' +

          '</div>' +
          '<div class="summary-box" id="checkout-summary">' +
            '<h2 class="summary-title">Сумма заказа</h2>' +
            '<div id="summary-rows"></div>' +
          '</div>' +
        '</div>' +
      '</div>';

    updateSummary();
    wireForm();
  }

  function wireForm() {
    mainEl.addEventListener('click', function (e) {
      var stepBtn = e.target.closest('[data-goto-step]');
      if (stepBtn && !stepBtn.disabled) {
        goToStepPanel(Number(stepBtn.getAttribute('data-goto-step')));
        return;
      }

      if (e.target.closest('#to-step-2')) {
        if (!validateStep1()) return;
        goToStepPanel(2);
        return;
      }

      if (e.target.closest('#to-step-1')) {
        goToStepPanel(1);
        return;
      }

      if (e.target.closest('#pay-btn')) {
        if (!validateStep2()) return;
        startPayment();
        return;
      }
    });

    mainEl.addEventListener('change', function (e) {
      if (e.target.name === 'shipping') {
        delivery.shipping = e.target.value;
        mainEl.querySelectorAll('.ship-option').forEach(function (el) {
          el.classList.toggle('is-selected', el.querySelector('input').value === delivery.shipping);
        });
        updateSummary();
        return;
      }
      if (e.target.name === 'payment') {
        payment.method = e.target.value;
        mainEl.querySelectorAll('.pay-option').forEach(function (el) {
          el.classList.toggle('is-selected', el.querySelector('input').value === payment.method);
        });
        var cardFields = document.getElementById('card-fields');
        if (cardFields) cardFields.hidden = payment.method !== 'card';
        return;
      }
    });

    mainEl.addEventListener('input', function (e) {
      var id = e.target.id;
      if (id === 'f-phone') { e.target.value = formatPhone(e.target.value); return; }
      if (id === 'f-card-number') { e.target.value = formatCardNumber(e.target.value); return; }
      if (id === 'f-card-expiry') { e.target.value = formatExpiry(e.target.value); return; }
      if (id === 'f-card-cvv') { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3); return; }
    });
  }

  var initialState = Store.get();
  if (initialState.cart.length === 0) {
    if (initialState.lastOrder) {
      renderDoneOnly(initialState.lastOrder);
    } else {
      renderEmpty();
    }
  } else {
    renderForm();
  }
})();
