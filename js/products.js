/* WebMarket — product catalog data (window.Catalog) */
(function () {
  'use strict';

  var CATEGORIES = [
    { id: 'electronics', title: 'Электроника', icon: 'cpu' },
    { id: 'clothing', title: 'Одежда', icon: 'shirt' },
    { id: 'shoes', title: 'Обувь', icon: 'footprints' },
    { id: 'accessories', title: 'Аксессуары', icon: 'watch' },
    { id: 'home', title: 'Дом и уют', icon: 'lamp' }
  ];

  var GRADIENTS = {
    electronics: ['#6366f1', '#8b5cf6'],
    clothing: ['#f59e0b', '#ef4444'],
    shoes: ['#10b981', '#059669'],
    accessories: ['#ec4899', '#db2777'],
    home: ['#0ea5e9', '#0284c7']
  };

  var ANGLES = [
    { x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
    { x1: '100%', y1: '0%', x2: '0%', y2: '100%' },
    { x1: '0%', y1: '100%', x2: '100%', y2: '0%' },
    { x1: '0%', y1: '0%', x2: '0%', y2: '100%' }
  ];

  function initials(title) {
    var words = title.split(' ').filter(Boolean);
    return words.slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
  }

  function placeholderImage(categoryId, title, seed) {
    var colors = GRADIENTS[categoryId] || ['#64748b', '#475569'];
    var a = ANGLES[seed % ANGLES.length];
    var gid = 'g' + categoryId + seed + Math.abs(title.length * (seed + 1));
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">' +
      '<defs><linearGradient id="' + gid + '" x1="' + a.x1 + '" y1="' + a.y1 + '" x2="' + a.x2 + '" y2="' + a.y2 + '">' +
      '<stop offset="0%" stop-color="' + colors[0] + '"/>' +
      '<stop offset="100%" stop-color="' + colors[1] + '"/>' +
      '</linearGradient></defs>' +
      '<rect width="640" height="640" fill="url(#' + gid + ')"/>' +
      '<circle cx="' + (100 + seed * 60) + '" cy="' + (540 - seed * 40) + '" r="170" fill="rgba(255,255,255,0.07)"/>' +
      '<text x="320" y="320" font-family="Segoe UI, Arial, sans-serif" font-size="188" font-weight="600" fill="rgba(255,255,255,0.9)" text-anchor="middle" dominant-baseline="central">' + initials(title) + '</text>' +
      '</svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  function images(categoryId, title) {
    return [0, 1, 2, 3].map(function (i) { return placeholderImage(categoryId, title, i); });
  }

  function pct(price, oldPrice) {
    if (!oldPrice || oldPrice <= price) return 0;
    return Math.round((1 - price / oldPrice) * 100);
  }

  var RAW = [
    // ---------- Электроника ----------
    {
      id: 1, title: 'Смартфон Pulse X12 128 ГБ', category: 'electronics',
      price: 42990, oldPrice: null, rating: 4.6, reviewsCount: 312, popularity: 98, badge: 'hit',
      options: [
        { label: 'Память', values: ['128 ГБ', '256 ГБ'] },
        { label: 'Цвет', values: [{ name: 'Чёрный', hex: '#1f2937' }, { name: 'Серебристый', hex: '#cbd5e1' }, { name: 'Синий', hex: '#2563eb' }] }
      ],
      description: 'Флагманский смартфон с ярким OLED-экраном 6.5", быстрой зарядкой и тройной камерой для съёмки в любых условиях. Держит заряд весь день даже при активном использовании.',
      specs: { 'Бренд': 'Pulse', 'Экран': '6.5" OLED, 120 Гц', 'Процессор': 'Octa-core 3.2 ГГц', 'Камера': '50 + 12 + 8 Мп', 'Аккумулятор': '5000 мАч', 'Гарантия': '12 месяцев' },
      reviews: [
        { author: 'Игорь М.', rating: 5, text: 'Экран огонь, батареи хватает на полтора дня. Не пожалел, что взял именно эту модель.', date: '14 июля 2026' },
        { author: 'Анастасия К.', rating: 4, text: 'Камера отличная, но немного греется при длительной съёмке видео.', date: '2 июня 2026' },
        { author: 'Дмитрий В.', rating: 5, text: 'Быстро летает, память есть куда девать. Рекомендую.', date: '21 мая 2026' }
      ]
    },
    {
      id: 2, title: 'Беспроводные наушники SoundWave Pro', category: 'electronics',
      price: 8990, oldPrice: null, rating: 4.7, reviewsCount: 458, popularity: 95, badge: 'hit',
      options: [{ label: 'Цвет', values: [{ name: 'Чёрный', hex: '#1f2937' }, { name: 'Белый', hex: '#f8fafc' }] }],
      description: 'Внутриканальные наушники с активным шумоподавлением и чистым басом. До 30 часов работы с кейсом, быстрая зарядка через USB-C.',
      specs: { 'Бренд': 'SoundWave', 'Тип': 'Внутриканальные, TWS', 'Шумоподавление': 'Активное, до 32 дБ', 'Время работы': '8 ч + 22 ч в кейсе', 'Защита': 'IPX5', 'Гарантия': '12 месяцев' },
      reviews: [
        { author: 'Павел С.', rating: 5, text: 'Шумодав реально работает, в метро не слышно ничего лишнего.', date: '30 июля 2026' },
        { author: 'Мария Л.', rating: 5, text: 'Сидят удобно, не выпадают на пробежке. Звук плотный, басы приятные.', date: '18 июля 2026' },
        { author: 'Роман Т.', rating: 4, text: 'Хороший звук, но кейс маловат для кармана джинсов.', date: '4 июля 2026' }
      ]
    },
    {
      id: 3, title: 'Ноутбук AirBook 14', category: 'electronics',
      price: 74990, oldPrice: null, rating: 4.5, reviewsCount: 176, popularity: 90, badge: 'hit',
      options: [{ label: 'Память', values: ['256 ГБ SSD', '512 ГБ SSD'] }, { label: 'Цвет', values: [{ name: 'Серебристый', hex: '#cbd5e1' }, { name: 'Серый космос', hex: '#475569' }] }],
      description: 'Тонкий и лёгкий ноутбук 14" для работы и учёбы: яркий экран, тихая работа без вентилятора и до 16 часов автономности.',
      specs: { 'Бренд': 'AirBook', 'Экран': '14" IPS, 1920×1200', 'Процессор': '8-ядерный, 3.5 ГГц', 'Оперативная память': '16 ГБ', 'Вес': '1.2 кг', 'Гарантия': '24 месяца' },
      reviews: [
        { author: 'Елена Ф.', rating: 5, text: 'Лёгкий, тихий, экран приятный. Для работы с документами и браузером — идеально.', date: '9 июля 2026' },
        { author: 'Сергей П.', rating: 4, text: 'Мощности хватает с запасом, но портов маловато.', date: '25 июня 2026' }
      ]
    },
    {
      id: 4, title: 'Умные часы FitTrack Series 5', category: 'electronics',
      price: 12990, oldPrice: 16990, rating: 4.4, reviewsCount: 203, popularity: 82, badge: 'sale',
      options: [{ label: 'Цвет', values: [{ name: 'Чёрный', hex: '#1f2937' }, { name: 'Розовый', hex: '#f9a8d4' }, { name: 'Синий', hex: '#2563eb' }] }],
      description: 'Умные часы с мониторингом пульса, сна и десятками спортивных режимов. Экран AMOLED виден даже под ярким солнцем.',
      specs: { 'Бренд': 'FitTrack', 'Экран': '1.9" AMOLED', 'Автономность': 'до 9 дней', 'Защита': '5 ATM', 'Датчики': 'Пульс, SpO2, GPS', 'Гарантия': '12 месяцев' },
      reviews: [
        { author: 'Ольга Д.', rating: 4, text: 'Точно считает шаги и пульс, приложение удобное.', date: '20 июля 2026' },
        { author: 'Артём Б.', rating: 5, text: 'За свои деньги отличные часы, GPS ловит быстро.', date: '11 июня 2026' },
        { author: 'Вера Н.', rating: 4, text: 'Батарея держит около недели при активном использовании.', date: '30 мая 2026' }
      ]
    },
    {
      id: 5, title: 'Планшет TabLite 10', category: 'electronics',
      price: 24990, oldPrice: null, rating: 4.3, reviewsCount: 94, popularity: 61, badge: null,
      options: [{ label: 'Память', values: ['64 ГБ', '128 ГБ'] }],
      description: 'Планшет 10.5" для чтения, фильмов и работы с документами. Лёгкий корпус и аккумулятор на весь день использования.',
      specs: { 'Бренд': 'TabLite', 'Экран': '10.5" IPS', 'Оперативная память': '6 ГБ', 'Аккумулятор': '7000 мАч', 'Вес': '470 г', 'Гарантия': '12 месяцев' },
      reviews: [
        { author: 'Наталья Ж.', rating: 4, text: 'Хорош для чтения и сериалов вечером, экран приятный.', date: '17 июля 2026' },
        { author: 'Кирилл О.', rating: 4, text: 'Для офисных задач достаточно, тормозов не заметил.', date: '2 июля 2026' }
      ]
    },
    {
      id: 6, title: 'Портативная колонка BoomBox Mini', category: 'electronics',
      price: 5490, oldPrice: null, rating: 4.5, reviewsCount: 267, popularity: 70, badge: null,
      options: [{ label: 'Цвет', values: [{ name: 'Чёрный', hex: '#1f2937' }, { name: 'Красный', hex: '#dc2626' }, { name: 'Зелёный', hex: '#16a34a' }] }],
      description: 'Компактная колонка с объёмным звуком и защитой от брызг. До 14 часов автономной работы, есть режим стерео-пары.',
      specs: { 'Бренд': 'BoomBox', 'Мощность': '20 Вт', 'Защита': 'IPX7', 'Время работы': 'до 14 часов', 'Bluetooth': '5.3', 'Гарантия': '12 месяцев' },
      reviews: [
        { author: 'Юлия С.', rating: 5, text: 'Берём с собой на все пикники, звук громкий и чистый.', date: '28 июля 2026' },
        { author: 'Максим Р.', rating: 4, text: 'Не боится дождя, проверено на даче.', date: '15 июня 2026' }
      ]
    },

    // ---------- Одежда ----------
    {
      id: 7, title: 'Худи Comfort Oversize', category: 'clothing',
      price: 3490, oldPrice: null, rating: 4.6, reviewsCount: 189, popularity: 88, badge: 'hit',
      options: [{ label: 'Размер', values: ['S', 'M', 'L', 'XL'] }, { label: 'Цвет', values: [{ name: 'Чёрный', hex: '#1f2937' }, { name: 'Серый', hex: '#94a3b8' }, { name: 'Бежевый', hex: '#d6c7b0' }] }],
      description: 'Свободное худи из плотного футера с начёсом. Мягкое, тёплое, не теряет форму после стирки.',
      specs: { 'Материал': '80% хлопок, 20% полиэстер', 'Плотность': '320 г/м²', 'Уход': 'Машинная стирка 30°', 'Страна производства': 'Турция' },
      reviews: [
        { author: 'Анна В.', rating: 5, text: 'Очень уютное, ношу и дома, и на прогулках. Размер в размер.', date: '22 июля 2026' },
        { author: 'Тимур Г.', rating: 4, text: 'Плотный материал, не просвечивает. После стирки не село.', date: '8 июля 2026' }
      ]
    },
    {
      id: 8, title: 'Джинсы Slim Fit Denim', category: 'clothing',
      price: 3290, oldPrice: 4290, rating: 4.3, reviewsCount: 145, popularity: 66, badge: 'sale',
      options: [{ label: 'Размер', values: ['S', 'M', 'L', 'XL', 'XXL'] }, { label: 'Цвет', values: [{ name: 'Синий', hex: '#2563eb' }, { name: 'Чёрный', hex: '#1f2937' }] }],
      description: 'Джинсы зауженного кроя из плотного денима со стрейчем. Сидят по фигуре, не растягиваются на коленях.',
      specs: { 'Материал': '98% хлопок, 2% эластан', 'Посадка': 'Slim fit', 'Уход': 'Машинная стирка 30°', 'Страна производства': 'Бангладеш' },
      reviews: [
        { author: 'Виктор Л.', rating: 4, text: 'Сидят хорошо, но нужно брать на размер больше.', date: '19 июня 2026' },
        { author: 'Дарья М.', rating: 5, text: 'Плотный деним, цвет не линяет после нескольких стирок.', date: '3 июня 2026' }
      ]
    },
    {
      id: 9, title: 'Куртка ветровка Trail Runner', category: 'clothing',
      price: 5990, oldPrice: null, rating: 4.7, reviewsCount: 132, popularity: 84, badge: 'hit',
      options: [{ label: 'Размер', values: ['S', 'M', 'L', 'XL'] }, { label: 'Цвет', values: [{ name: 'Чёрный', hex: '#1f2937' }, { name: 'Синий', hex: '#2563eb' }, { name: 'Жёлтый', hex: '#eab308' }] }],
      description: 'Лёгкая ветрозащитная куртка со светоотражающими вставками. Складывается в свой карман — удобно брать в поездки.',
      specs: { 'Материал': '100% нейлон, DWR-пропитка', 'Водостойкость': '5000 мм', 'Вес': '240 г', 'Страна производства': 'Вьетнам' },
      reviews: [
        { author: 'Егор К.', rating: 5, text: 'На пробежках спасает от ветра и мелкого дождя, дышит хорошо.', date: '26 июля 2026' },
        { author: 'Светлана И.', rating: 4, text: 'Компактная, всегда лежит в рюкзаке про запас.', date: '12 июля 2026' },
        { author: 'Никита Ф.', rating: 5, text: 'Отражатели реально заметны в темноте, безопасно бегать вечером.', date: '29 июня 2026' }
      ]
    },
    {
      id: 10, title: 'Футболка базовая Cotton Basic', category: 'clothing',
      price: 1490, oldPrice: null, rating: 4.4, reviewsCount: 302, popularity: 58, badge: null,
      options: [{ label: 'Размер', values: ['XS', 'S', 'M', 'L', 'XL'] }, { label: 'Цвет', values: [{ name: 'Белый', hex: '#f8fafc' }, { name: 'Чёрный', hex: '#1f2937' }, { name: 'Серый', hex: '#94a3b8' }, { name: 'Синий', hex: '#2563eb' }] }],
      description: 'Базовая футболка из плотного хлопка прямого кроя. Хорошо держит форму и не садится после стирки.',
      specs: { 'Материал': '100% хлопок', 'Плотность': '180 г/м²', 'Уход': 'Машинная стирка 40°', 'Страна производства': 'Турция' },
      reviews: [
        { author: 'Илья Х.', rating: 4, text: 'Простая хорошая футболка, беру уже третью такую.', date: '5 июля 2026' },
        { author: 'Полина Ш.', rating: 5, text: 'Ткань приятная, не просвечивает и не мнётся.', date: '21 июня 2026' }
      ]
    },
    {
      id: 11, title: 'Свитер шерстяной Nordic Wool', category: 'clothing',
      price: 4490, oldPrice: 5990, rating: 4.6, reviewsCount: 87, popularity: 55, badge: 'sale',
      options: [{ label: 'Размер', values: ['S', 'M', 'L', 'XL'] }, { label: 'Цвет', values: [{ name: 'Бежевый', hex: '#d6c7b0' }, { name: 'Серый', hex: '#94a3b8' }, { name: 'Бордовый', hex: '#9f1239' }] }],
      description: 'Тёплый свитер из смесовой шерсти с узором. Приятный к телу, не колется благодаря добавлению хлопка.',
      specs: { 'Материал': '60% шерсть, 40% хлопок', 'Уход': 'Ручная стирка 30°', 'Страна производства': 'Латвия' },
      reviews: [
        { author: 'Ксения А.', rating: 5, text: 'Очень тёплый и не колючий, ношу поверх рубашки.', date: '30 июля 2026' },
        { author: 'Владимир Ю.', rating: 4, text: 'Хорошее качество вязки, цвет как на фото.', date: '9 июня 2026' }
      ]
    },
    {
      id: 12, title: 'Платье летнее Sunlight', category: 'clothing',
      price: 3990, oldPrice: null, rating: 4.5, reviewsCount: 118, popularity: 63, badge: null,
      options: [{ label: 'Размер', values: ['XS', 'S', 'M', 'L'] }, { label: 'Цвет', values: [{ name: 'Жёлтый', hex: '#eab308' }, { name: 'Белый', hex: '#f8fafc' }, { name: 'Розовый', hex: '#f9a8d4' }] }],
      description: 'Лёгкое платье-миди из вискозы с летним принтом. Свободный крой, приятная ткань, не требует глажки.',
      specs: { 'Материал': '100% вискоза', 'Длина': 'Миди', 'Уход': 'Машинная стирка 30°', 'Страна производства': 'Турция' },
      reviews: [
        { author: 'Марина Т.', rating: 5, text: 'Очень лёгкое и воздушное, отлично на лето.', date: '24 июля 2026' },
        { author: 'Алина Р.', rating: 4, text: 'Красивый цвет, но чуть просвечивает на солнце.', date: '1 июля 2026' }
      ]
    },

    // ---------- Обувь ----------
    {
      id: 13, title: 'Кроссовки StreetRun Air', category: 'shoes',
      price: 6990, oldPrice: null, rating: 4.7, reviewsCount: 356, popularity: 93, badge: 'hit',
      options: [{ label: 'Размер', values: ['38', '39', '40', '41', '42', '43', '44'] }, { label: 'Цвет', values: [{ name: 'Белый', hex: '#f8fafc' }, { name: 'Чёрный', hex: '#1f2937' }] }],
      description: 'Лёгкие кроссовки с амортизирующей подошвой для бега и города. Дышащая сетка верха, устойчивая посадка стопы.',
      specs: { 'Материал верха': 'Текстильная сетка', 'Материал подошвы': 'EVA + резина', 'Сезон': 'Демисезон', 'Страна производства': 'Вьетнам' },
      reviews: [
        { author: 'Данила В.', rating: 5, text: 'Бегаю уже месяц, стопа не устаёт, амортизация отличная.', date: '27 июля 2026' },
        { author: 'Евгения П.', rating: 5, text: 'Лёгкие и удобные, размер соответствует.', date: '13 июля 2026' },
        { author: 'Роман К.', rating: 4, text: 'Хорошие кроссовки, но маркий белый цвет.', date: '28 июня 2026' }
      ]
    },
    {
      id: 14, title: 'Ботинки кожаные Urban Trek', category: 'shoes',
      price: 7490, oldPrice: 9490, rating: 4.5, reviewsCount: 142, popularity: 71, badge: 'sale',
      options: [{ label: 'Размер', values: ['39', '40', '41', '42', '43', '44'] }, { label: 'Цвет', values: [{ name: 'Коричневый', hex: '#78350f' }, { name: 'Чёрный', hex: '#1f2937' }] }],
      description: 'Демисезонные ботинки из натуральной кожи с рифлёной подошвой. Держат тепло и не промокают в слякоть.',
      specs: { 'Материал верха': 'Натуральная кожа', 'Материал подошвы': 'Резина', 'Сезон': 'Осень-зима', 'Страна производства': 'Россия' },
      reviews: [
        { author: 'Станислав Ж.', rating: 5, text: 'Кожа плотная, качественная прошивка. Ноги не мёрзнут.', date: '31 июля 2026' },
        { author: 'Инна Б.', rating: 4, text: 'Разнашиваются пару дней, потом сидят отлично.', date: '10 июня 2026' }
      ]
    },
    {
      id: 15, title: 'Сандалии летние Coast Walk', category: 'shoes',
      price: 2990, oldPrice: null, rating: 4.2, reviewsCount: 76, popularity: 44, badge: null,
      options: [{ label: 'Размер', values: ['37', '38', '39', '40', '41', '42'] }],
      description: 'Удобные сандалии с регулируемыми ремешками и мягкой стелькой. Не скользят на мокрой поверхности.',
      specs: { 'Материал верха': 'Текстиль, эко-кожа', 'Материал подошвы': 'EVA', 'Сезон': 'Лето', 'Страна производства': 'Китай' },
      reviews: [
        { author: 'Татьяна Ч.', rating: 4, text: 'Удобные для города и пляжа, стелька мягкая.', date: '22 июня 2026' },
        { author: 'Богдан С.', rating: 4, text: 'Хорошо держат ногу, ремешки регулируются точно.', date: '4 июня 2026' }
      ]
    },
    {
      id: 16, title: 'Кеды классические Canvas Low', category: 'shoes',
      price: 2490, oldPrice: 3190, rating: 4.4, reviewsCount: 210, popularity: 68, badge: 'sale',
      options: [{ label: 'Размер', values: ['36', '37', '38', '39', '40', '41', '42', '43'] }, { label: 'Цвет', values: [{ name: 'Белый', hex: '#f8fafc' }, { name: 'Чёрный', hex: '#1f2937' }, { name: 'Красный', hex: '#dc2626' }] }],
      description: 'Классические текстильные кеды на каждый день. Лёгкие, дышащие, сочетаются почти с любой одеждой.',
      specs: { 'Материал верха': 'Хлопковый текстиль', 'Материал подошвы': 'Резина', 'Сезон': 'Весна-лето', 'Страна производства': 'Китай' },
      reviews: [
        { author: 'Ярослав Д.', rating: 4, text: 'Классика, которая всегда выручает. Размер верный.', date: '16 июля 2026' },
        { author: 'Виктория М.', rating: 5, text: 'Взяла белые — выглядят стильно, ходить удобно.', date: '29 мая 2026' }
      ]
    },
    {
      id: 17, title: 'Туфли модельные Milano Line', category: 'shoes',
      price: 5490, oldPrice: null, rating: 4.5, reviewsCount: 63, popularity: 39, badge: null,
      options: [{ label: 'Размер', values: ['39', '40', '41', '42', '43', '44'] }, { label: 'Цвет', values: [{ name: 'Чёрный', hex: '#1f2937' }, { name: 'Коричневый', hex: '#78350f' }] }],
      description: 'Строгие туфли из гладкой кожи для делового образа. Классическая колодка и удобная подкладка.',
      specs: { 'Материал верха': 'Натуральная кожа', 'Материал подошвы': 'Кожа/резина', 'Сезон': 'Всесезонные', 'Страна производства': 'Италия' },
      reviews: [
        { author: 'Григорий Н.', rating: 5, text: 'Отличные туфли для офиса, выглядят дороже своей цены.', date: '20 июля 2026' },
        { author: 'Алексей Т.', rating: 4, text: 'Кожа хорошая, но требуют разнашивания в первую неделю.', date: '2 июля 2026' }
      ]
    },

    // ---------- Аксессуары ----------
    {
      id: 18, title: 'Рюкзак городской UrbanPack 20L', category: 'accessories',
      price: 4290, oldPrice: null, rating: 4.7, reviewsCount: 289, popularity: 86, badge: 'hit',
      options: [{ label: 'Цвет', values: [{ name: 'Чёрный', hex: '#1f2937' }, { name: 'Серый', hex: '#94a3b8' }, { name: 'Синий', hex: '#2563eb' }] }],
      description: 'Вместительный рюкзак с отделением для ноутбука 15" и водоотталкивающей тканью. Удобен для города и командировок.',
      specs: { 'Материал': 'Полиэстер 900D', 'Объём': '20 л', 'Отделение для ноутбука': 'до 15.6"', 'Страна производства': 'Вьетнам' },
      reviews: [
        { author: 'Владислав Е.', rating: 5, text: 'Ношу каждый день, спина не устаёт, карманов много.', date: '25 июля 2026' },
        { author: 'Софья К.', rating: 5, text: 'Ноутбук сидит плотно и безопасно, ткань не промокает под дождём.', date: '6 июля 2026' },
        { author: 'Артур Л.', rating: 4, text: 'Крепкая фурнитура, молнии ходят плавно.', date: '19 июня 2026' }
      ]
    },
    {
      id: 19, title: 'Ремень кожаный Classic Line', category: 'accessories',
      price: 1990, oldPrice: 2690, rating: 4.5, reviewsCount: 98, popularity: 48, badge: 'sale',
      options: [{ label: 'Размер', values: ['S/M', 'L/XL'] }, { label: 'Цвет', values: [{ name: 'Чёрный', hex: '#1f2937' }, { name: 'Коричневый', hex: '#78350f' }] }],
      description: 'Классический ремень из плотной натуральной кожи с металлической пряжкой. Подходит и для делового, и для повседневного стиля.',
      specs: { 'Материал': 'Натуральная кожа', 'Ширина': '3.5 см', 'Пряжка': 'Металл, никель', 'Страна производства': 'Россия' },
      reviews: [
        { author: 'Захар П.', rating: 5, text: 'Кожа плотная, пряжка не разбалтывается.', date: '17 июня 2026' },
        { author: 'Лидия В.', rating: 4, text: 'Брала в подарок, упаковка и качество порадовали.', date: '30 мая 2026' }
      ]
    },
    {
      id: 20, title: 'Солнцезащитные очки SunShade Aviator', category: 'accessories',
      price: 2790, oldPrice: null, rating: 4.4, reviewsCount: 134, popularity: 57, badge: null,
      options: [{ label: 'Цвет', values: [{ name: 'Золотистый', hex: '#ca8a04' }, { name: 'Чёрный', hex: '#1f2937' }, { name: 'Серебристый', hex: '#cbd5e1' }] }],
      description: 'Очки-авиаторы с поляризационными линзами и защитой от UV400. Лёгкая металлическая оправа.',
      specs: { 'Оправа': 'Металл', 'Линзы': 'Поляризационные, UV400', 'Комплект': 'Футляр, салфетка', 'Страна производства': 'Италия' },
      reviews: [
        { author: 'Денис Ш.', rating: 5, text: 'Не бликуют, поляризация чувствуется сразу за рулём.', date: '23 июля 2026' },
        { author: 'Кристина Ф.', rating: 4, text: 'Стильные и лёгкие, сидят удобно.', date: '5 июня 2026' }
      ]
    },
    {
      id: 21, title: 'Кошелёк компактный SlimFold', category: 'accessories',
      price: 1590, oldPrice: null, rating: 4.6, reviewsCount: 176, popularity: 52, badge: null,
      options: [{ label: 'Цвет', values: [{ name: 'Чёрный', hex: '#1f2937' }, { name: 'Коричневый', hex: '#78350f' }, { name: 'Бордовый', hex: '#9f1239' }] }],
      description: 'Тонкий кошелёк из кожи с защитой RFID и отделениями для карт и купюр. Не оттопыривает карман.',
      specs: { 'Материал': 'Натуральная кожа', 'Защита': 'RFID-блокировка', 'Отделения': '6 карт + купюры', 'Страна производства': 'Россия' },
      reviews: [
        { author: 'Олег К.', rating: 5, text: 'Тонкий, все карты помещаются, в кармане почти не заметен.', date: '11 июля 2026' },
        { author: 'Юрий М.', rating: 4, text: 'Хорошая кожа, со временем красиво потемнеет.', date: '27 мая 2026' }
      ]
    },
    {
      id: 22, title: 'Шарф вязаный WarmKnit', category: 'accessories',
      price: 1290, oldPrice: null, rating: 4.3, reviewsCount: 54, popularity: 33, badge: null,
      options: [{ label: 'Цвет', values: [{ name: 'Серый', hex: '#94a3b8' }, { name: 'Бежевый', hex: '#d6c7b0' }, { name: 'Бордовый', hex: '#9f1239' }] }],
      description: 'Мягкий вязаный шарф из смесовой пряжи. Хорошо держит тепло и не колется.',
      specs: { 'Материал': '50% шерсть, 50% акрил', 'Размер': '180×30 см', 'Уход': 'Ручная стирка', 'Страна производства': 'Беларусь' },
      reviews: [
        { author: 'Валентина О.', rating: 4, text: 'Тёплый и мягкий, цвет приятный вживую.', date: '2 июня 2026' },
        { author: 'Константин Р.', rating: 5, text: 'Хорошая плотность вязки, не растягивается.', date: '15 мая 2026' }
      ]
    },

    // ---------- Дом и уют ----------
    {
      id: 23, title: 'Настольная лампа GlowDesk LED', category: 'home',
      price: 2490, oldPrice: null, rating: 4.6, reviewsCount: 121, popularity: 74, badge: 'hit',
      options: [{ label: 'Цвет', values: [{ name: 'Белый', hex: '#f8fafc' }, { name: 'Чёрный', hex: '#1f2937' }] }],
      description: 'LED-лампа с регулировкой яркости и цветовой температуры. Гибкий кронштейн, сенсорное управление, USB-порт для зарядки.',
      specs: { 'Источник света': 'LED, 10 Вт', 'Регулировка': '3 режима яркости', 'Порт': 'USB-A для зарядки', 'Страна производства': 'Китай' },
      reviews: [
        { author: 'Регина А.', rating: 5, text: 'Свет мягкий, глаза не устают при работе за компьютером.', date: '29 июля 2026' },
        { author: 'Фёдор Б.', rating: 4, text: 'Удобный кронштейн, держит любое положение.', date: '14 июня 2026' }
      ]
    },
    {
      id: 24, title: 'Плед флисовый CozyHome', category: 'home',
      price: 1890, oldPrice: 2490, rating: 4.7, reviewsCount: 203, popularity: 65, badge: 'sale',
      options: [{ label: 'Цвет', values: [{ name: 'Бежевый', hex: '#d6c7b0' }, { name: 'Серый', hex: '#94a3b8' }, { name: 'Синий', hex: '#2563eb' }] }],
      description: 'Мягкий плед из микрофибры плотной вязки. Не электризуется, быстро сохнет после стирки, приятен к телу.',
      specs: { 'Материал': '100% полиэстер (микрофибра)', 'Размер': '150×200 см', 'Уход': 'Машинная стирка 30°', 'Страна производства': 'Россия' },
      reviews: [
        { author: 'Алевтина С.', rating: 5, text: 'Очень мягкий и тёплый, не скатывается после стирки.', date: '21 июля 2026' },
        { author: 'Виталий Д.', rating: 5, text: 'Плотный, приятного цвета, дома стало уютнее.', date: '3 июля 2026' },
        { author: 'Настасья К.', rating: 4, text: 'Хорошее качество за такую цену.', date: '9 июня 2026' }
      ]
    },
    {
      id: 25, title: 'Набор посуды DineSet 4 персоны', category: 'home',
      price: 3490, oldPrice: null, rating: 4.4, reviewsCount: 68, popularity: 41, badge: null,
      options: [],
      description: 'Набор тарелок и мисок из керамики на 4 персоны. Подходит для посудомоечной машины и микроволновки.',
      specs: { 'Материал': 'Керамика', 'Комплектация': '4 тарелки, 4 миски, 4 салатника', 'Можно в посудомойку': 'Да', 'Страна производства': 'Россия' },
      reviews: [
        { author: 'Людмила Г.', rating: 4, text: 'Красивая посуда, цвет глубокий, сколов при доставке не было.', date: '30 июня 2026' },
        { author: 'Пётр Ж.', rating: 5, text: 'Плотная керамика, приятно держать в руках.', date: '8 июня 2026' }
      ]
    },
    {
      id: 26, title: 'Ароматическая свеча HomeScent Vanilla', category: 'home',
      price: 890, oldPrice: 1190, rating: 4.5, reviewsCount: 157, popularity: 47, badge: 'sale',
      options: [],
      description: 'Соевая свеча с ароматом ванили и сандала. Горит около 40 часов, упакована в стеклянный стакан с крышкой.',
      specs: { 'Воск': 'Соевый', 'Время горения': '≈40 часов', 'Объём': '220 г', 'Страна производства': 'Россия' },
      reviews: [
        { author: 'Ирина Х.', rating: 5, text: 'Аромат ненавязчивый, приятно горит вечером.', date: '26 июня 2026' },
        { author: 'Геннадий Ф.', rating: 4, text: 'Хватает надолго, запах держится по всей комнате.', date: '1 июня 2026' }
      ]
    },
    {
      id: 27, title: 'Подушка декоративная SoftCorner', category: 'home',
      price: 1090, oldPrice: null, rating: 4.3, reviewsCount: 82, popularity: 36, badge: null,
      options: [{ label: 'Цвет', values: [{ name: 'Бежевый', hex: '#d6c7b0' }, { name: 'Серый', hex: '#94a3b8' }, { name: 'Жёлтый', hex: '#eab308' }] }],
      description: 'Декоративная подушка с плотным чехлом на молнии и мягким наполнителем. Держит форму, освежает интерьер.',
      specs: { 'Материал чехла': 'Хлопок/лён', 'Наполнитель': 'Холлофайбер', 'Размер': '45×45 см', 'Страна производства': 'Россия' },
      reviews: [
        { author: 'Тамара Л.', rating: 4, text: 'Красивая фактура ткани, наполнитель не сбивается.', date: '19 июля 2026' },
        { author: 'Марк В.', rating: 4, text: 'Хорошо дополнила диван, цвет соответствует фото.', date: '27 июня 2026' }
      ]
    }
  ];

  var PRODUCTS = RAW.map(function (p) {
    p.oldPrice = p.oldPrice || null;
    p.discount = pct(p.price, p.oldPrice);
    p.images = images(p.category, p.title);
    var catTitle = (CATEGORIES.filter(function (c) { return c.id === p.category; })[0] || {}).title || '';
    p.search = (p.title + ' ' + catTitle + ' ' + p.description).toLowerCase();
    return p;
  });

  function byId(id) {
    var sid = String(id);
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (String(PRODUCTS[i].id) === sid) return PRODUCTS[i];
    }
    return undefined;
  }

  function byCategory(id) {
    return PRODUCTS.filter(function (p) { return p.category === id; });
  }

  function search(q, limit) {
    var query = (q || '').toLowerCase().trim();
    if (!query) return [];
    var results = PRODUCTS.filter(function (p) { return p.search.indexOf(query) !== -1; });
    return typeof limit === 'number' ? results.slice(0, limit) : results;
  }

  function defaultOptions(product) {
    var out = {};
    (product.options || []).forEach(function (opt) {
      var v = opt.values[0];
      out[opt.label] = (v && typeof v === 'object') ? v.name : v;
    });
    return out;
  }

  var prices = PRODUCTS.map(function (p) { return p.price; });

  window.Catalog = {
    CATEGORIES: CATEGORIES,
    PRODUCTS: PRODUCTS,
    priceRange: { min: Math.min.apply(null, prices), max: Math.max.apply(null, prices) },
    byId: byId,
    byCategory: byCategory,
    search: search,
    defaultOptions: defaultOptions,
    placeholderImage: placeholderImage
  };
})();
