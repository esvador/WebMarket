/* WebMarket — home page: slider, categories, bestsellers */
(function () {
  'use strict';

  var mainEl = document.getElementById('main-content');

  var SLIDES = [
    {
      eyebrow: 'Новинки',
      title: 'Электроника нового поколения',
      text: 'Смартфоны, наушники и ноутбуки для работы и жизни.',
      cta: 'Смотреть электронику',
      href: 'catalog.html?category=electronics',
      gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)'
    },
    {
      eyebrow: 'Сезонная распродажа',
      title: 'Скидки до 30% на одежду и обувь',
      text: 'Обновите гардероб к новому сезону по выгодным ценам.',
      cta: 'В каталог',
      href: 'catalog.html',
      gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)'
    },
    {
      eyebrow: 'Промокод',
      title: 'SALE10 — скидка 10% на заказ',
      text: 'Примените промокод в корзине и получите скидку на всю сумму заказа.',
      cta: 'Выбрать товары',
      href: 'catalog.html',
      gradient: 'linear-gradient(135deg,#10b981,#0284c7)'
    }
  ];

  var AUTOPLAY_MS = 5000;

  function slideHtml(s) {
    return '<div class="slide" style="background:' + s.gradient + '">' +
      '<span class="slide-eyebrow">' + UI.escapeHtml(s.eyebrow) + '</span>' +
      '<h2 class="slide-title">' + UI.escapeHtml(s.title) + '</h2>' +
      '<p class="slide-text">' + UI.escapeHtml(s.text) + '</p>' +
      '<a href="' + s.href + '" class="btn btn-primary">' + UI.escapeHtml(s.cta) + '</a>' +
      '</div>';
  }

  function dotHtml(s, i) {
    return '<button type="button" class="slider-dot' + (i === 0 ? ' is-active' : '') + '" data-index="' + i + '" aria-label="Слайд ' + (i + 1) + '"></button>';
  }

  var hits = Catalog.PRODUCTS.filter(function (p) { return p.badge === 'hit'; }).slice(0, 8);
  var catTiles = Catalog.CATEGORIES.map(function (c) {
    return '<a class="cat-tile" href="catalog.html?category=' + c.id + '"><span class="cat-tile-icon">' + UI.icon(c.icon) + '</span><span>' + UI.escapeHtml(c.title) + '</span></a>';
  }).join('');

  mainEl.innerHTML =
    '<section class="section" style="padding-bottom:0">' +
      '<div class="slider" id="slider">' +
        '<div class="slider-track" id="slider-track">' + SLIDES.map(slideHtml).join('') + '</div>' +
        '<button type="button" class="icon-btn slider-arrow slider-prev" id="slider-prev" aria-label="Предыдущий слайд">' + UI.icon('chevron-left') + '</button>' +
        '<button type="button" class="icon-btn slider-arrow slider-next" id="slider-next" aria-label="Следующий слайд">' + UI.icon('chevron-right') + '</button>' +
        '<div class="slider-dots" id="slider-dots">' + SLIDES.map(dotHtml).join('') + '</div>' +
      '</div>' +
    '</section>' +
    '<section class="section">' +
      '<div class="section-head"><h2 class="section-title">Категории</h2></div>' +
      '<div class="cat-tiles">' + catTiles + '</div>' +
    '</section>' +
    '<section class="section">' +
      '<div class="section-head"><h2 class="section-title">Хиты продаж</h2></div>' +
      '<div class="grid grid-4" id="hits-grid">' + hits.map(UI.productCard).join('') + '</div>' +
    '</section>';

  var slideIndex = 0;
  var slideCount = SLIDES.length;
  var autoplayTimer = null;
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function goToSlide(i) {
    slideIndex = (i + slideCount) % slideCount;
    document.getElementById('slider-track').style.transform = 'translateX(-' + (slideIndex * 100) + '%)';
    document.querySelectorAll('.slider-dot').forEach(function (d, idx) { d.classList.toggle('is-active', idx === slideIndex); });
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  function startAutoplay() {
    if (prefersReducedMotion) return;
    stopAutoplay();
    autoplayTimer = setInterval(function () { goToSlide(slideIndex + 1); }, AUTOPLAY_MS);
  }

  var sliderEl = document.getElementById('slider');
  sliderEl.addEventListener('mouseenter', stopAutoplay);
  sliderEl.addEventListener('mouseleave', startAutoplay);
  sliderEl.addEventListener('focusin', stopAutoplay);
  sliderEl.addEventListener('focusout', startAutoplay);

  sliderEl.addEventListener('click', function (e) {
    if (e.target.closest('#slider-prev')) { goToSlide(slideIndex - 1); return; }
    if (e.target.closest('#slider-next')) { goToSlide(slideIndex + 1); return; }
    var dot = e.target.closest('.slider-dot');
    if (dot) goToSlide(Number(dot.getAttribute('data-index')));
  });

  startAutoplay();
})();
