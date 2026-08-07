/* WebMarket — application state store (window.Store) */
(function () {
  'use strict';

  var KEY_CART = 'wm:v1:cart';
  var KEY_FAV = 'wm:v1:fav';
  var KEY_PROMO = 'wm:v1:promo';
  var KEY_ORDER = 'wm:v1:order';

  var SHIPPING_RATES = { courier: 350, pickup: 200, self: 0 };
  var FREE_SHIPPING_THRESHOLD = 5000;
  var DEFAULT_SHIPPING_RATE = 350;
  var PROMO_RATE = 0.1;

  // localStorage can throw (file://, private mode, quota) — fall back to an in-memory map.
  var memory = {};
  var storage = {
    get: function (key) {
      try {
        var v = window.localStorage.getItem(key);
        return v === null ? undefined : v;
      } catch (e) {
        return Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : undefined;
      }
    },
    set: function (key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch (e) {
        memory[key] = value;
      }
    }
  };

  function safeParse(raw, fallback) {
    if (raw === undefined) return fallback;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function loadCart() {
    var parsed = safeParse(storage.get(KEY_CART), []);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(function (line) {
        return line && typeof line.key === 'string' && line.qty > 0 && Catalog.byId(line.id);
      })
      .map(function (line) {
        return {
          key: line.key,
          id: Number(line.id),
          qty: Math.max(1, Math.floor(line.qty)),
          options: (line.options && typeof line.options === 'object') ? line.options : {}
        };
      });
  }

  function loadFavorites() {
    var parsed = safeParse(storage.get(KEY_FAV), []);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(Number).filter(function (id) { return !!Catalog.byId(id); });
  }

  function loadPromo() {
    var parsed = safeParse(storage.get(KEY_PROMO), null);
    return parsed === 'SALE10' ? parsed : null;
  }

  function loadOrder() {
    var parsed = safeParse(storage.get(KEY_ORDER), null);
    if (!parsed || typeof parsed !== 'object') return null;
    if (typeof parsed.number !== 'string' || typeof parsed.total !== 'number') return null;
    return parsed;
  }

  var state = {
    cart: loadCart(),
    favorites: loadFavorites(),
    promo: loadPromo(),
    lastOrder: loadOrder()
  };

  var listeners = [];

  function notify() {
    var snapshot = get();
    listeners.forEach(function (fn) {
      try { fn(snapshot); } catch (e) { /* one bad subscriber must not block the others */ }
    });
  }

  function subscribe(fn) {
    listeners.push(fn);
    return function unsubscribe() {
      var idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }

  function get() {
    return {
      cart: state.cart.slice(),
      favorites: state.favorites.slice(),
      promo: state.promo,
      lastOrder: state.lastOrder
    };
  }

  function makeKey(id, options) {
    var keys = Object.keys(options || {}).sort();
    var parts = keys.map(function (k) { return k + ':' + options[k]; });
    return id + '|' + parts.join(',');
  }

  function addToCart(id, qty, options) {
    id = Number(id);
    var product = Catalog.byId(id);
    if (!product) return;
    var opts = options || {};
    var key = makeKey(id, opts);
    var qtyToAdd = Math.max(1, Math.floor(qty || 1));
    var existing = state.cart.filter(function (l) { return l.key === key; })[0];
    if (existing) {
      existing.qty += qtyToAdd;
    } else {
      state.cart.push({ key: key, id: id, qty: qtyToAdd, options: opts });
    }
    storage.set(KEY_CART, JSON.stringify(state.cart));
    notify();
  }

  function setQty(key, n) {
    var line = state.cart.filter(function (l) { return l.key === key; })[0];
    if (!line) return;
    line.qty = Math.max(1, Math.floor(n));
    storage.set(KEY_CART, JSON.stringify(state.cart));
    notify();
  }

  function removeFromCart(key) {
    state.cart = state.cart.filter(function (l) { return l.key !== key; });
    storage.set(KEY_CART, JSON.stringify(state.cart));
    notify();
  }

  function clearCart() {
    state.cart = [];
    storage.set(KEY_CART, JSON.stringify(state.cart));
    notify();
  }

  function toggleFavorite(id) {
    id = Number(id);
    var idx = state.favorites.indexOf(id);
    if (idx === -1) state.favorites.push(id);
    else state.favorites.splice(idx, 1);
    storage.set(KEY_FAV, JSON.stringify(state.favorites));
    notify();
  }

  function isFavorite(id) {
    return state.favorites.indexOf(Number(id)) !== -1;
  }

  function applyPromo(code) {
    var normalized = (code || '').trim().toUpperCase();
    if (!normalized) return { ok: false, error: 'Введите промокод' };
    if (normalized === 'SALE10') {
      state.promo = 'SALE10';
      storage.set(KEY_PROMO, JSON.stringify(state.promo));
      notify();
      return { ok: true };
    }
    return { ok: false, error: 'Такой промокод не найден' };
  }

  function clearPromo() {
    state.promo = null;
    storage.set(KEY_PROMO, JSON.stringify(state.promo));
    notify();
  }

  function totals(shippingId) {
    var subtotal = state.cart.reduce(function (sum, line) {
      var product = Catalog.byId(line.id);
      return sum + (product ? product.price * line.qty : 0);
    }, 0);
    var discount = state.promo === 'SALE10' ? Math.round(subtotal * PROMO_RATE) : 0;
    var afterDiscount = Math.max(0, subtotal - discount);
    var shipping;
    if (shippingId && Object.prototype.hasOwnProperty.call(SHIPPING_RATES, shippingId)) {
      // an explicit checkout method always overrides the free-shipping estimate
      shipping = SHIPPING_RATES[shippingId];
    } else {
      shipping = subtotal === 0 ? 0 : (afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_RATE);
    }
    var count = state.cart.reduce(function (sum, line) { return sum + line.qty; }, 0);
    return { subtotal: subtotal, discount: discount, shipping: shipping, total: afterDiscount + shipping, count: count };
  }

  function setOrder(order) {
    state.lastOrder = { number: order.number, total: order.total, date: order.date };
    storage.set(KEY_ORDER, JSON.stringify(state.lastOrder));
    notify();
  }

  function fmtPrice(n) {
    var num = Math.round(n || 0);
    var str = String(Math.abs(num)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (num < 0 ? '-' : '') + str + ' ₽';
  }

  window.Store = {
    get: get,
    subscribe: subscribe,
    addToCart: addToCart,
    setQty: setQty,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    toggleFavorite: toggleFavorite,
    isFavorite: isFavorite,
    applyPromo: applyPromo,
    clearPromo: clearPromo,
    totals: totals,
    setOrder: setOrder,
    fmtPrice: fmtPrice
  };
})();
