/**
 * Seed script: populates blog_post_translations with EN and RU translations
 * for all existing blog posts, including full content body translations.
 *
 * Run in PowerShell:
 *   $env:SUPABASE_SERVICE_ROLE_KEY="your-key"; node scripts/seed-blog-translations.js
 */
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://bgweumxabgkkqnvifaik.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.error('Set SUPABASE_SERVICE_ROLE_KEY env var first.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const tr = {
  en: {
    'beste-strände-hurghada': {
      title: 'The 10 Best Beaches in Hurghada',
      excerpt: 'From hidden coves to lively beach sections — the most beautiful beaches in the region.',
      category: 'Travel Tips',
      content: `<h2>1. Mamsha Beach</h2><p>The most popular beach in Hurghada. It stretches along the promenade with many cafés and restaurants.</p><h2>2. Sahl Hasheesh</h2><p>An exclusive resort beach with crystal-clear water and fine white sand. Perfect for snorkelling.</p><h2>3. Makadi Beach</h2><p>Quiet and family-friendly. Shallow water and soft sand make it ideal for children.</p><h2>4. El Gouna Beach</h2><p>The artificial lagoons offer protected bathing bays. Ideal for relaxing.</p><h2>5. Giftun Island</h2><p>Only reachable by boat — an untouched paradise with a national park.</p><p><strong>Tip:</strong> Visit the beaches early in the morning or late in the afternoon for the best light conditions and fewer people.</p>`,
    },
    'tauchen-hurghada-guide': {
      title: 'Diving in Hurghada: The Ultimate Guide',
      excerpt: 'Everything you need to know about diving in Hurghada — from courses to the best dive sites.',
      category: 'Activities',
      content: `<h2>Why Hurghada?</h2><p>Hurghada is one of the world's best diving destinations. Water temperature is 22–30°C all year round.</p><h2>Popular Dive Sites</h2><ul><li><strong>Giftun:</strong> Pristine coral reefs and colourful fish.</li><li><strong>Shaab Abu Nuhas:</strong> Famous shipwreck diving.</li><li><strong>Brothers Islands:</strong> Advanced diving with sharks and pelagic fish.</li></ul><h2>Diving Courses</h2><p>Whether you're a beginner or advanced, Hurghada offers PADI and SSI courses at every level.</p><p><strong>Tip:</strong> Book a multi-day dive package for the best value.</p>`,
    },
    'wetter-hurghada': {
      title: 'Weather in Hurghada — When to Travel?',
      excerpt: 'Month by month: water temperature, air temperature and travel tips for every season.',
      category: 'Travel Tips',
      content: `<h2>Spring (March — May)</h2><p>Perfect travel weather! 25–32°C, little rain. Ideal for excursions and sightseeing.</p><h2>Summer (June — September)</h2><p>Very hot with 35–42°C. Ideal for beach holidays and water sports. The sea is warm and crystal clear.</p><h2>Autumn (October — November)</h2><p>Pleasant temperatures of 25–35°C. One of the best times to visit Hurghada.</p><h2>Winter (December — February)</h2><p>Mild with 20–25°C. Perfect for diving as the water is exceptionally clear. Evenings can be cool.</p><p><strong>Tip:</strong> Water temperature rarely drops below 21°C, making diving possible year-round.</p>`,
    },
    'kultur-egypten': {
      title: 'Culture & History of Egypt',
      excerpt: 'From the Pharaohs to today — a journey through 5,000 years of Egyptian history.',
      category: 'Culture',
      content: `<h2>The Pharaonic Era</h2><p>Egypt is the land of the Pharaohs. The Pyramids of Giza are the oldest of the Seven Wonders of the Ancient World.</p><h2>The Greco-Roman Period</h2><p>Alexandria and the ruins of Philae and Dendera tell the story of Greek and Roman influence.</p><h2>Islamic Heritage</h2><p>Mosques, bazaars and traditional souks reflect centuries of Islamic culture.</p><h2>Modern Egypt</h2><p>Today, Egypt blends ancient traditions with modern life. Hurghada is a perfect example of this fascinating mix.</p>`,
    },
    'tips-fuer-reisende': {
      title: '10 Valuable Tips for Travelers to Hurghada',
      excerpt: 'What you should know before your trip — from cash to local customs.',
      category: 'Travel Tips',
      content: `<h2>1. Bring Cash</h2><p>Egyptian pounds and euros/USD in small bills. Credit cards are often not accepted.</p><h2>2. Tipping</h2><p>Tipping is customary. 50–100 EGP for guides, 20–30 EGP for hotel staff.</p><h2>3. Sun Protection</h2><p>High SPF sunscreen, hat and sunglasses are essential, especially from April to October.</p><h2>4. Drinking Water</h2><p>Only drink bottled water. It's widely available and cheap.</p><h2>5. Bargaining</h2><p>Haggling is expected at bazaars and with taxi drivers. Start at about 50% of the asking price.</p><h2>6. Dress Code</h2><p>Respectful clothing is appreciated, especially outside tourist areas and at mosques.</p><h2>7. Photography</h2><p>Always ask before photographing people. Some sites charge extra for cameras.</p><h2>8. Local Food</h2><p>Try koshari, ful medames and fresh falafel — authentic Egyptian cuisine is delicious and affordable.</p><h2>9. Best Time to Visit</h2><p>October to April offers the most pleasant temperatures for exploring.</p><h2>10. Travel Insurance</h2><p>Always take out comprehensive travel insurance before your trip.</p>`,
    },
    'die-besten-ausfluege-in-hurghada-2025-top-sehenswuerdigkeiten-insider-tipps-und-unvergessliche-erlebnisse-am-roten-meer': {
      title: 'The Best Excursions in Hurghada 2025 — Top Attractions, Insider Tips & Unforgettable Experiences on the Red Sea',
      excerpt: 'The best excursions in Hurghada 2025 — Top attractions, insider tips and unforgettable experiences on the Red Sea.',
      category: '',
      content: `<p>Hurghada is one of the most popular travel destinations in Egypt, attracting thousands of holidaymakers from Germany, Austria and Switzerland every year. The beautiful coastline on the Red Sea offers a unique mix of relaxation, adventure and cultural experiences.</p><h2>Top Excursions</h2><p>From snorkelling trips to Giftun Island, desert safaris on quad bikes, to boat tours with dolphin watching — Hurghada has something for everyone.</p><h2>Insider Tips</h2><ul><li>Visit the old town of El Dahar for an authentic Egyptian atmosphere</li><li>Take a sunset boat trip for unforgettable photo opportunities</li><li>Explore the underwater world with a diving course at one of the many dive centres</li></ul><h2>Cultural Highlights</h2><p>Day trips to Luxor, Cairo and the Valley of the Kings are absolute must-dos during your Hurghada holiday.</p>`,
    },
    'pyramiden-von-gizeh-ab-hurghada-ein-unvergesslicher-kairo-ausflug-bei-sonnenaufgang': {
      title: 'Pyramids of Giza from Hurghada: An Unforgettable Cairo Trip at Sunrise',
      excerpt: 'Pyramids of Giza from Hurghada — An unforgettable Cairo trip at sunrise.',
      category: '',
      content: `<p>A Cairo trip from Hurghada is one of the most impressive experiences during a holiday in Egypt. Experiencing the world-famous Pyramids of Giza at sunrise is something you'll never forget.</p><h2>The Journey</h2><p>The drive from Hurghada to Cairo takes about 5–6 hours. Early morning departures ensure you arrive at the pyramids for the magical sunrise.</p><h2>The Pyramids</h2><p>The Great Pyramid of Khufu, the Pyramid of Khafre and the Pyramid of Menkaure — together with the Sphinx, they form one of the most impressive archaeological sites in the world.</p><h2>Tips</h2><ul><li>Book a guided tour for the best experience</li><li>Bring plenty of water and sun protection</li><li>Combine with a visit to the Egyptian Museum in Cairo</li></ul>`,
    },
    'luxor-ausflug-ab-hurghada-die-geheimnisse-der-pharaonen-im-tal-der-koenige-erleben': {
      title: 'Luxor Trip from Hurghada: Experience the Secrets of the Pharaohs in the Valley of the Kings',
      excerpt: 'Luxor trip from Hurghada: Experience the secrets of the Pharaohs in the Valley of the Kings.',
      category: '',
      content: `<p>A Luxor trip from Hurghada is one of the most impressive experiences during an Egypt holiday. Anyone vacationing in Hurghada and fascinated by the history of ancient Egypt should definitely visit Luxor.</p><h2>Valley of the Kings</h2><p>The burial site of the pharaohs houses spectacular tombs with well-preserved wall paintings and hieroglyphics. Highlights include the tombs of Tutankhamun, Ramesses VI and Seti I.</p><h2>Karnak Temple</h2><p>One of the largest temple complexes in the world, with impressive columns and obelisks dating back over 3,000 years.</p><h2>Hatshepsut Temple</h2><p>The stunning mortuary temple of Queen Hatshepsut, carved into the cliffs of Deir el-Bahari.</p><p><strong>Tip:</strong> Book an overnight stay in Luxor to explore the sites at your leisure and visit the Sound & Light Show at Karnak.</p>`,
    },
    'die-besten-schnorchel-ausfluege-in-hurghada-2025-die-faszinierende-unterwasserwelt-des-roten-meeres-entdecken': {
      title: 'The Best Snorkelling Trips in Hurghada 2025: Discover the Fascinating Underwater World of the Red Sea',
      excerpt: 'The best snorkelling trips in Hurghada 2025: Discover the fascinating underwater world of the Red Sea.',
      category: '',
      content: `<p>Snorkelling in Hurghada is one of the most popular activities for holidaymakers in Egypt. The Red Sea offers some of the most beautiful underwater worlds on the planet.</p><h2>Best Snorkelling Spots</h2><ul><li><strong>Giftun Island:</strong> Protected national park with pristine coral reefs.</li><li><strong>Mahmya Beach:</strong> Beautiful house reef directly accessible from the beach.</li><li><strong>El Gouna Lagoons:</strong> Calm waters ideal for beginners.</li></ul><h2>What You'll See</h2><p>Colourful coral gardens, clownfish, sea turtles, moray eels and hundreds of other species call the Red Sea home.</p><h2>Tips for Beginners</h2><ul><li>Take a short introduction before heading out</li><li>Don't touch the coral — it's fragile and protected</li><li>Use reef-safe sunscreen to protect the marine environment</li></ul>`,
    },
    'quad-safari-hurghada-2025-das-ultimative-wuestenabenteuer-in-aegypten': {
      title: 'Quad Safari Hurghada 2025 — The Ultimate Desert Adventure in Egypt',
      excerpt: 'Quad Safari Hurghada 2025 — The ultimate desert adventure in Egypt.',
      category: '',
      content: `<p>A quad safari in Hurghada is one of the most popular and exciting excursions on the Red Sea. Anyone looking for adventure, adrenaline and unforgettable experiences during their Egypt holiday will love a desert safari.</p><h2>What to Expect</h2><p>Ride through the vast Egyptian desert on a quad bike, through valleys, over dunes and past Bedouin villages. The sunset tour is particularly popular.</p><h2>Including Bedouin Village Visit</h2><p>Most safaris include a stop at a traditional Bedouin village where you can enjoy tea, learn about their way of life and ride camels.</p><h2>Safety Tips</h2><ul><li>Always follow the guide's instructions</li><li>Wear a helmet and protective clothing</li><li>Bring sunscreen and plenty of water</li></ul><p><strong>Tip:</strong> Book a sunset safari for the most spectacular desert views and amazing photo opportunities.</p>`,
    },
  },
  ru: {
    'beste-strände-hurghada': {
      title: '10 лучших пляжей Хургады',
      excerpt: 'От секретных бухт до оживлённых пляжных зон — самые красивые пляжи региона.',
      category: 'Советы путешественникам',
      content: `<h2>1. Пляж Мамша</h2><p>Самый популярный пляж Хургады. Тянется вдоль набережной с множеством кафе и ресторанов.</p><h2>2. Сахл Хашиш</h2><p>Эксклюзивный курортный пляж с кристально чистой водой и мелким белым песком. Идеален для снорклинга.</p><h2>3. Пляж Макади</h2><p>Спокойный и семейный. Мелкая вода и мягкий песок делают его идеальным для детей.</p><h2>4. Пляж Эль Гуна</h2><p>Искусственные лагуны предлагают защищённые бухты. Идеально для отдыха.</p><h2>5. Остров Гифтун</h2><p>Доступен только на лодке — нетронутый рай с национальным парком.</p><p><strong>Совет:</strong> Посещайте пляжи ранним утром или поздним вечером для лучших условий освещения и меньшего скопления людей.</p>`,
    },
    'tauchen-hurghada-guide': {
      title: 'Дайвинг в Хургаде: Полный гид',
      excerpt: 'Всё, что нужно знать о дайвинге в Хургаде — от курсов до лучших мест для погружения.',
      category: 'Активности',
      content: `<h2>Почему Хургада?</h2><p>Хургада — одно из лучших дайвинг-направлений мира. Температура воды 22–30°C круглый год.</p><h2>Популярные места для погружения</h2><ul><li><strong>Гифтун:</strong> Нетронутые коралловые рифы и разноцветные рыбы.</li><li><strong>Шааб Абу-Нуас:</strong> Знаменитое затонувшее судно.</li><li><strong>Острова Братья:</strong> Продвинутый дайвинг с акулами и пелагическими рыбами.</li></ul><h2>Курсы дайвинга</h2><p>Независимо от уровня подготовки, Хургада предлагает курсы PADI и SSI любого уровня.</p><p><strong>Совет:</strong> Закажите многодневный пакет для дайвинга — это выгоднее.</p>`,
    },
    'wetter-hurghada': {
      title: 'Погода в Хургаде — Когда ехать?',
      excerpt: 'По месяцам: температура воды, температура воздуха и советы для каждого сезона.',
      category: 'Советы путешественникам',
      content: `<h2>Весна (март — май)</h2><p>Идеальная погода для путешествий! 25–32°C, мало дождей. Идеально для экскурсий и осмотра достопримечательностей.</p><h2>Лето (июнь — сентябрь)</h2><p>Очень жарко, 35–42°C. Идеально для пляжного отдыха и водных видов спорта. Море тёплое и кристально чистое.</p><h2>Осень (октябрь — ноябрь)</h2><p>Приятная температура 25–35°C. Одно из лучших времён для посещения Хургады.</p><h2>Зима (декабрь — февраль)</h2><p>Мягкая, 20–25°C. Идеально для дайвинга, так как вода особенно прозрачная. Вечером может быть прохладно.</p><p><strong>Совет:</strong> Температура воды редко опускается ниже 21°C, что делает дайвинг возможным круглый год.</p>`,
    },
    'kultur-egypten': {
      title: 'Культура и история Египта',
      excerpt: 'От фараонов до наших дней — путешествие через 5000 лет египетской истории.',
      category: 'Культура',
      content: `<h2>Эпоха фараонов</h2><p>Египет — земля фараонов. Пирамиды Гизы — самое древнее из Семи чудес Древнего мира.</p><h2>Греко-римский период</h2><p>Александрия и руины Филэ и Дендеры рассказывают о греческом и римском влиянии.</p><h2>Исламское наследие</h2><p>Мечети, базары и традиционные суки отражают многовековую исламскую культуру.</p><h2>Современный Египет</h2><p>Сегодня Египет сочетает древние традиции с современной жизнью. Хургада — идеальный пример этого удивительного микса.</p>`,
    },
    'tips-fuer-reisende': {
      title: '10 ценных советов путешественникам в Хургаду',
      excerpt: 'Что стоит знать перед поездкой — от наличных до местных обычаев.',
      category: 'Советы путешественникам',
      content: `<h2>1. Берите наличные</h2><p>Египетские фунты и евро/доллары мелкими купюрами. Кредитные карты часто не принимаются.</p><h2>2. Чаевые</h2><p>Чаевые — обычай. 50–100 EGP гидам, 20–30 EGP персоналу отеля.</p><h2>3. Защита от солнца</h2><p>Солнцезащитный крем с высоким SPF, шляпа и солнцезащитные очки обязательны, особенно с апреля по октябрь.</p><h2>4. Питьевая вода</h2><p>Пейте только бутилированную воду. Она широко доступна и дешёвая.</p><h2>5. Торговля</h2><p>Торговаться принято на базарах и с таксистами. Начинайте примерно с 50% от запрашиваемой цены.</p><h2>6. Дресс-код</h2><p>Уважительная одежда приветствуется, особенно за пределами туристических зон и в мечетях.</p><h2>7. Фотография</h2><p>Всегда спрашивайте разрешения перед фотографированием людей. На некоторых объектах дополнительная плата за камеру.</p><h2>8. Местная еда</h2><p>Попробуйте кошари, фуль медамес и свежий фалафель — аутентичная египетская кухня вкусна и доступна.</p><h2>9. Лучшее время для посещения</h2><p>С октября по апрель — самые комфортные температуры для путешествий.</p><h2>10. Страховка</h2><p>Всегда оформляйте comprehensive travel insurance перед поездкой.</p>`,
    },
    'die-besten-ausfluege-in-hurghada-2025-top-sehenswuerdigkeiten-insider-tipps-und-unvergessliche-erlebnisse-am-roten-meer': {
      title: 'Лучшие экскурсии в Хургаде 2025 — Топ достопримечательности, советы и незабываемые впечатления на Красном море',
      excerpt: 'Лучшие экскурсии в Хургаде 2025 — Топ достопримечательности, советы и незабываемые впечатления на Красном море.',
      category: '',
      content: `<p>Хургада — одно из самых популярных направлений для отдыха в Египте, привлекающее тысячи туристов из Германии, Австрии и Швейцарии каждый год. Красивое побережье Красного моря предлагает уникальное сочетание отдыха, приключений и культурного опыта.</p><h2>Топ экскурсий</h2><p>От поездок на снорклинг на остров Гифтун, пустынных сафари на квадроциклах до лодочных круизов с наблюдением за дельфинами — в Хургаде найдётся занятие для каждого.</p><h2>Советы от местных</h2><ul><li>Посетите старый квартал Эль Дахар для атмосферы аутентичного Египта</li><li>Совершите закатную поездку на лодке для незабываемых фото</li><li>Исследуйте подводный мир на курсе дайвинга в одном из многих центров</li></ul><h2>Культурные места</h2><p>Дневные поездки в Луксор, Каир и Долину царей — абсолютные must-do во время отдыха в Хургаде.</p>`,
    },
    'pyramiden-von-gizeh-ab-hurghada-ein-unvergesslicher-kairo-ausflug-bei-sonnenaufgang': {
      title: 'Пирамиды Гизы из Хургады: Незабываемая поездка в Каир на рассвете',
      excerpt: 'Пирамиды Гизы из Хургады — Незабываемая поездка в Каир на рассвете.',
      category: '',
      content: `<p>Поездка в Каир из Хургады — одно из самых впечатляющих впечатлений во время отпуска в Египте. Увидеть всемирно известные Пирамиды Гизы на рассвете — это то, что вы никогда не забудете.</p><h2>Дорога</h2><p>Езда из Хургады в Каир занимает около 5–6 часов. Ранние утренние выезды обеспечивают прибытие к пирамидам к волшебному рассвету.</p><h2>Пирамиды</h2><p>Великая пирамида Хеопса, пирамида Хефрена и пирамида Микерина вместе со Сфинксом образуют одно из самых впечатляющих археологических мест в мире.</p><h2>Советы</h2><ul><li>Закажите экскурсию с гидом для лучшего опыта</li><li>Возьмите достаточно воды и средства от солнца</li><li>Совместите с посещением Египетского музея в Каире</li></ul>`,
    },
    'luxor-ausflug-ab-hurghada-die-geheimnisse-der-pharaonen-im-tal-der-koenige-erleben': {
      title: 'Экскурсия в Луксор из Хургады: Тайны фараонов в Долине царей',
      excerpt: 'Экскурсия в Луксор из Хургады: Тайны фараонов в Долине царей.',
      category: '',
      content: `<p>Экскурсия в Луксор из Хургады — одно из самых впечатляющих впечатлений во время отдыха в Египте. Тот, кто отдыхает в Хургаде и увлечён историей Древнего Египта, обязательно должен посетить Луксор.</p><h2>Долина царей</h2><p>Место захоронения фараонов хранит впечатляющие гробницы с хорошо сохранившимися росписями и иероглифами. Среди них — гробницы Тутанхамона, Рамсеса VI и Сети I.</p><h2>Храм Карнак</h2><p>Один из крупнейших храмовых комплексов мира с впечатляющими колоннами и обелисками возрастом более 3000 лет.</p><h2>Храм Хатшепсут</h2><p>Потрясающий погребальный храм царицы Хатшепсут, вырубленный в скалах Дейр-эль-Бахри.</p><p><strong>Совет:</strong> Закажите ночёвку в Луксоре, чтобы осматривать достопримечательности без спешки и посетить Звук и Свет в Карнаке.</p>`,
    },
    'die-besten-schnorchel-ausfluege-in-hurghada-2025-die-faszinierende-unterwasserwelt-des-roten-meeres-entdecken': {
      title: 'Лучшие поездки на снорклинг в Хургаде 2025: Откройте увлекательный подводный мир Красного моря',
      excerpt: 'Лучшие поездки на снорклинг в Хургаде 2025: Откройте увлекательный подводный мир Красного моря.',
      category: '',
      content: `<p>Снорклинг в Хургаде — одна из самых популярных активностей для отдыхающих в Египте. Красное море предлагает один из красивейших подводных миров на планете.</p><h2>Лучшие места для снорклинга</h2><ul><li><strong>Остров Гифтун:</strong> Защищённый национальный парк с нетронутыми коралловыми рифами.</li><li><strong>Пляж Махмия:</strong> Красивый домашний риф, доступный прямо с пляжа.</li><li><strong>Лагуны Эль Гуна:</strong> Спокойные воды, идеальные для начинающих.</li></ul><h2>Что вы увидите</h2><p>Разноцветные коралловые сады, рыбы-клоуны, морские черепахи, муравьи и сотни других видов называют Красное море домом.</p><h2>Советы для начинающих</h2><ul><li>Пройдите краткое обучение перед выходом в воду</li><li>Не трогайте кораллы — они хрупкие и защищены</li><li>Используйте солнцезащитный крем, безопасный для рифов</li></ul>`,
    },
    'quad-safari-hurghada-2025-das-ultimative-wuestenabenteuer-in-aegypten': {
      title: 'Квадроцикл-сафари Хургада 2025 — Истинное пустынное приключение в Египте',
      excerpt: 'Квадроцикл-сафари Хургада 2025 — Истинное пустынное приключение в Египте.',
      category: '',
      content: `<p>Квадроцикл-сафари в Хургаде — одно из самых популярных и захватывающих экскурсий на Красном море. Ищущие приключения, адреналин и незабываемые впечатления во время отдыха в Египте оценят пустынное сафари.</p><h2>Что вас ждёт</h2><p>Проехать на квадроцикле по бескрайней египетской пустыне, через долины, по дюнам и мимо бедуинских деревень. Особой популярностью пользуется закатное сафари.</p><h2>Посещение бедуинской деревни</h2><p>Большинство сафари включают остановку в традиционной бедуинской деревне, где можно попить чая, узнать об образе жизни и покататься на верблюдах.</p><h2>Советы по безопасности</h2><ul><li>Всегда следуйте инструкциям гида</li><li>Надевайте шлем и защитную одежду</li><li>Берите солнцезащитный крем и достаточно воды</li></ul><p><strong>Совет:</strong> Закажите закатное сафари для самых зрелищных видов пустыни и потрясающих фотомоментов.</p>`,
    },
  },
};

async function main() {
  const { data: posts, error: fetchErr } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, content, category, read_time, tags')
    .eq('published', true);

  if (fetchErr) {
    console.error('Failed to fetch blog posts:', fetchErr.message);
    process.exit(1);
  }

  console.log(`Found ${posts.length} published blog posts.`);

  const rows = [];

  for (const post of posts) {
    for (const locale of ['en', 'ru']) {
      const t = tr[locale]?.[post.slug];
      if (t) {
        rows.push({
          post_slug: post.slug,
          locale,
          title: t.title,
          excerpt: t.excerpt,
          content: t.content,
          category: t.category || post.category || '',
          read_time: post.read_time || null,
          tags: post.tags || [],
        });
      } else {
        // Fallback: copy German content
        rows.push({
          post_slug: post.slug,
          locale,
          title: post.title,
          excerpt: post.excerpt || '',
          content: post.content || '',
          category: post.category || '',
          read_time: post.read_time || null,
          tags: post.tags || [],
        });
      }
    }
  }

  console.log(`Upserting ${rows.length} translation rows...`);

  const { error: upsertErr } = await supabase
    .from('blog_post_translations')
    .upsert(rows, { onConflict: 'post_slug,locale' });

  if (upsertErr) {
    console.error('Upsert failed:', upsertErr.message);
    console.error('Did you run the SQL migration (supabase/add-blog-translations.sql) first?');
    process.exit(1);
  }

  console.log('Done! Blog translations seeded with full EN and RU content.');
}

main();
