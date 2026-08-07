/* WebMarket — favorites page */
(function () {
  'use strict';

  var mainEl = document.getElementById('main-content');

  function render(state) {
    state = state || Store.get();
    var products = state.favorites.map(function (id) { return Catalog.byId(id); }).filter(Boolean);

    if (products.length === 0) {
      mainEl.innerHTML = '<h1 class="section-title" style="margin-bottom:var(--sp-6)">Избранное</h1>' +
        UI.emptyState({
          icon: 'heart',
          title: 'В избранном пока пусто',
          text: 'Отмечайте понравившиеся товары сердечком — они появятся здесь.',
          actionHref: 'catalog.html',
          actionLabel: 'В каталог'
        });
      return;
    }

    mainEl.innerHTML = '<h1 class="section-title" style="margin-bottom:var(--sp-6)">Избранное (' + products.length + ')</h1>' +
      '<div class="grid grid-4">' + products.map(UI.productCard).join('') + '</div>';
  }

  render();
  Store.subscribe(render);
})();
