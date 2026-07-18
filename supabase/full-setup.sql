-- =========================================================
-- HURGHADA REISEPLANNER — SUPABASE COMPLETE SETUP
-- =========================================================
-- خطوة 1: افتح Supabase Dashboard → مشروعك → SQL Editor
-- Step 1: Open Supabase Dashboard → your project → SQL Editor
-- =========================================================


-- =========================================================
-- الجزء الأول: إنشاء الجداول (CREATE TABLES)
-- =========================================================

-- 1) destinations — الوجهات السياحية
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2) destination_translations — ترجمات الوجهات (إنجليزي وروسي)
CREATE TABLE IF NOT EXISTS destination_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_slug TEXT NOT NULL REFERENCES destinations(slug) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  UNIQUE(destination_slug, locale)
);

-- 3) tour_categories — فئات الجولات
CREATE TABLE IF NOT EXISTS tour_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4) category_translations — ترجمات الفئات
CREATE TABLE IF NOT EXISTS category_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_slug TEXT NOT NULL REFERENCES tour_categories(slug) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  label TEXT DEFAULT '',
  description TEXT DEFAULT '',
  UNIQUE(category_slug, locale)
);

-- 5) tours — الجولات السياحية
CREATE TABLE IF NOT EXISTS tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_description TEXT DEFAULT '',
  description TEXT DEFAULT '',
  price NUMERIC,
  duration TEXT DEFAULT '',
  duration_hours NUMERIC DEFAULT 0,
  max_guests NUMERIC DEFAULT 8,
  difficulty TEXT DEFAULT 'leicht',
  min_age NUMERIC DEFAULT 6,
  destination TEXT DEFAULT '',
  destination_slug TEXT REFERENCES destinations(slug) ON DELETE SET NULL,
  category TEXT DEFAULT '',
  category_label TEXT DEFAULT '',
  highlights JSONB DEFAULT '[]'::jsonb,
  included JSONB DEFAULT '[]'::jsonb,
  not_included JSONB DEFAULT '[]'::jsonb,
  itinerary JSONB DEFAULT '[]'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  image TEXT DEFAULT '',
  meeting_point TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6) tour_translations — ترجمات الجولات
CREATE TABLE IF NOT EXISTS tour_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_slug TEXT NOT NULL REFERENCES tours(slug) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  name TEXT DEFAULT '',
  short_description TEXT DEFAULT '',
  category_label TEXT DEFAULT '',
  UNIQUE(tour_slug, locale)
);

-- 7) blog_posts — مقالات المدونة
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  image TEXT DEFAULT '',
  category TEXT DEFAULT '',
  date DATE DEFAULT CURRENT_DATE,
  read_time TEXT DEFAULT '',
  tags JSONB DEFAULT '[]'::jsonb,
  author TEXT DEFAULT '',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8) faqs — الأسئلة الشائعة
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9) bookings — حجوزات الجولات
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_slug TEXT DEFAULT '',
  tour_name TEXT DEFAULT '',
  first_name TEXT DEFAULT '',
  last_name TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  date DATE,
  guests NUMERIC DEFAULT 1,
  status TEXT DEFAULT 'PENDING',
  total_price NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10) contact_messages — رسادات الاتصال
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11) newsletter_subscribers — مشتركو النشرة البريدية
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT DEFAULT 'website',
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);


-- =========================================================
-- الجزء الثاني: الفهارس (INDEXES) لتسريع الاستعلامات
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_tours_slug ON tours(slug);
CREATE INDEX IF NOT EXISTS idx_tours_category ON tours(category);
CREATE INDEX IF NOT EXISTS idx_tours_destination ON tours(destination_slug);
CREATE INDEX IF NOT EXISTS idx_tours_featured ON tours(featured);
CREATE INDEX IF NOT EXISTS idx_tour_translations_slug ON tour_translations(tour_slug);
CREATE INDEX IF NOT EXISTS idx_destination_translations_slug ON destination_translations(destination_slug);
CREATE INDEX IF NOT EXISTS idx_category_translations_slug ON category_translations(category_slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(read);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);


-- =========================================================
-- الجزء الثالث: بيانات تجريبية — 6 وجهات
-- =========================================================

INSERT INTO destinations (slug, name, tagline, description, image) VALUES
('hurghada', 'Hurghada', 'Perle des Roten Meeres', 'Hurghada ist die beliebteste Badestadt am Roten Meer in Ägypten. Kristallklares Wasser, wunderschöne Korallenriffe und endlose Sandstrände warten auf Sie.', '/images/destinations/hurghada.jpg'),
('safaga', 'Safaga', 'Paradies für Taucher', 'Safaga ist ein ruhiges Fischerdorf mit einer der besten Tauchregionen der Welt. Die giftfreien Sandstrände und die Artenvielfalt im Meer sind einzigartig.', '/images/destinations/safaga.jpg'),
('quseir', 'Quseir', 'Antike Hafenstadt', 'Quseir verbindet Geschichte mit Natur. Die antike römische Hafenstadt bietet unberührte Riffe, Wüstenabenteuer und eine authentische ägyptische Atmosphäre.', '/images/destinations/quseir.jpg'),
('el-gouna', 'El Gouna', 'Luxus am Meer', 'El Gouna ist eine exklusive Ferienstadt mit Marina, Top-Gastronomie und erstklassigen Hotels. Ideal für anspruchsvolle Reisende.', '/images/destinations/el-gouna.jpg'),
('soma-bay', 'Soma Bay', 'Sport & Wellness', 'Soma Bay bietet perfekte Bedingungen für Kitesurfing, Tauchen und Golf. Das Resort-Gebiet ist für seine Wellness-Hotels bekannt.', '/images/destinations/soma-bay.jpg'),
('makadi-bay', 'Makadi Bay', 'Familienfreundlich', 'Makadi Bay ist ideal für Familien. Ruhige Buchten, flache Strände und das berühmte Makadi Water World machen es zum Familienparadies.', '/images/destinations/makadi-bay.jpg');


-- =========================================================
-- الجزء الرابع: بيانات تجريبية — ترجمات الوجهات
-- =========================================================

INSERT INTO destination_translations (destination_slug, locale, tagline, description) VALUES
-- English
('hurghada', 'en', 'Pearl of the Red Sea', 'Hurghada is the most popular resort city on the Red Sea coast in Egypt. Crystal clear water, beautiful coral reefs and endless sandy beaches await you.'),
('safaga', 'en', 'Diver''s Paradise', 'Safaga is a quiet fishing village with one of the best diving regions in the world. The toxic-free sandy beaches and marine biodiversity are unique.'),
('quseir', 'en', 'Ancient Port City', 'Quseir combines history with nature. The ancient Roman port city offers pristine reefs, desert adventures and an authentic Egyptian atmosphere.'),
('el-gouna', 'en', 'Luxury by the Sea', 'El Gouna is an exclusive resort town with marina, top gastronomy and first-class hotels. Ideal for discerning travelers.'),
('soma-bay', 'en', 'Sports & Wellness', 'Soma Bay offers perfect conditions for kitesurfing, diving and golf. The resort area is known for its wellness hotels.'),
('makadi-bay', 'en', 'Family Friendly', 'Makadi Bay is ideal for families. Calm bays, shallow beaches and the famous Makadi Water World make it a family paradise.'),
-- Russian
('hurghada', 'ru', 'Жемчужина Красного моря', 'Хургада — самый популярный курортный город на побережье Красного моря в Египте. Кристально чистая вода, прекрасные коралловые рифы и бесконечные песчаные пляжи ждут вас.'),
('safaga', 'ru', 'Рай для дайверов', 'Сафага — тихая рыбацкая деревушка с одним из лучших дайвинговых регионов мира. Песчаные пляжи и морское биоразнообразие уникальны.'),
('quseir', 'ru', 'Древний портовый город', 'Кусейр сочетает историю и природу. Древний римский портовый город предлагает нетронутые рифы, пустынные приключения и атмосферу настоящего Египта.'),
('el-gouna', 'ru', 'Роскошь у моря', 'Эль-Гуна — эксклюзивный курортный город с мариной, отличной гастрономией и первоклассными отелями. Идеально для требовательных путешественников.'),
('soma-bay', 'ru', 'Спорт и оздоровление', 'Сома Бей предлагает идеальные условия для кайтсёрфинга, дайвинга и гольфа. Курортная зона известна своими оздоровительными отелями.'),
('makadi-bay', 'ru', 'Для семей', 'Макади Бей идеален для семей. Спокойные бухты, мелкие пляжи и знаменитый аквапарк Makadi Water World делают его семейным раем.');


-- =========================================================
-- الجزء الخامس: بيانات تجريبية — 4 فئات جولات
-- =========================================================

INSERT INTO tour_categories (slug, label, category, description) VALUES
('ganztagstouren', 'Ganztagestouren', 'ganztag', 'Erleben Sie die Highlights Ägyptens an einem ganzen Tag — von der Wüste bis zum Meer.'),
('halbtagstouren', 'Halbtagestouren', 'halbtag', 'Kurze, intensive Erlebnisse fürwenig Zeit — perfekt für einen Vormittag oder Nachmittag.'),
('wassersport', 'Wassersport', 'wassersport', 'Tauchen, Schnorcheln, Parasailing und mehr — Spannung auf dem Roten Meer.'),
('wuesten-safari', 'Wüstensafari', 'wuesten-safari', 'Quad, Camel, Sterne — die ägyptische Wüste aufregend erleben.');


-- =========================================================
-- الجزء السادس: بيانات تجريبية — ترجمات الفئات
-- =========================================================

INSERT INTO category_translations (category_slug, locale, label, description) VALUES
('ganztagstouren', 'en', 'Full Day Tours', 'Experience the highlights of Egypt on a full day — from the desert to the sea.'),
('ganztagstouren', 'ru', 'Дневные экскурсии', 'Откройте для себя достопримечательности Египта за целый день — от пустыни до моря.'),
('halbtagstouren', 'en', 'Half Day Tours', 'Short, intense experiences for little time — perfect for a morning or afternoon.'),
('halbtagstouren', 'ru', 'Полуденные экскурсии', 'Короткие, насыщенные впечатления — идеально для утра или послеобеда.'),
('wassersport', 'en', 'Water Sports', 'Diving, snorkeling, parasailing and more — excitement on the Red Sea.'),
('wassersport', 'ru', 'Водные виды спорта', 'Дайвинг, снорклинг, парапланеризм и многое другое — адреналин на Красном море.'),
('wuesten-safari', 'en', 'Desert Safari', 'Quad, camel, stars — experience the Egyptian desert excitingly.'),
('wuesten-safari', 'ru', 'Пустынное сафари', 'Квадроциклы, верблюды, звёзды — увлекательное путешествие по египетской пустыне.');


-- =========================================================
-- الجزء السابع: بيانات تجريبية — 5 جولات سياحية
-- =========================================================

INSERT INTO tours (slug, name, short_description, description, price, duration, duration_hours, max_guests, difficulty, min_age, destination, destination_slug, category, category_label, highlights, included, not_included, itinerary, faqs, image, meeting_point, featured) VALUES

('kairo-von-hurghada', 'Tagesausflug Kairo von Hurghada', 'Die Pyramiden von Gizeh, das Ägyptische Museum und die Altstadt Kairo — alles an einem Tag.', 'Erleben Sie die unvergessliche Hauptstadt Ägyptens an einem einzigen Tag. Abholung am Morgen in Hurghada, komfortabler Reisebus mit Klimaanlage, fachkundiger deutscher Reiseführer. Besuchen Sie die weltberühmten Pyramiden von Gizeh, die Große Sphinx und das Ägyptische Museum mit dem Schatz des Tutanchamun.', 85, '12 Stunden', 12, 20, 'leicht', 6, 'Hurghada', 'hurghada', 'ganztag', 'Ganztagestouren',
'["Pyramiden von Gizeh", "Große Sphinx", "Ägyptisches Museum", "Nilüberfahrt mit Feluke", "Altstadt El Moez"]'::jsonb,
'["Abholung vom Hotel", "Reisebus mit Klimaanlage", "Deutschsprachiger Reiseführer", "Mittagessen", "Alle Eintrittsgelder"]'::jsonb,
'["Trinkgelder", "Personal Expenses", "Optional: Kamelfahrt"]'::jsonb,
'[{"title": "Abholung", "content": "Frühe Abholung zwischen 04:00 und 05:00 Uhr vom Hotel in Hurghada."}, {"title": "Ankunft Kairo", "content": "Ankunft in Kairo nach ca. 5 Stunden Fahrt. Besuch der Pyramiden von Gizeh und der Sphinx."}, {"title": "Mittagessen", "content": "Mittagessen in einem lokalen Restaurant mit ägyptischer Küche."}, {"title": "Museum", "content": "Besuch des Ägyptischen Museums mit den Schätzen des Tutanchamun."}, {"title": "Rückfahrt", "content": "Rückfahrt nach Hurghada mit Ankunft am späten Abend."}]'::jsonb,
'[{"question": "Ist die Fahrt nach Kairo sehr anstrengend?", "answer": "Die Fahrt dauert ca. 5 Stunden je Richtung. Im modernen Bus mit Klimaanlage ist sie angenehm. Wir machen Pausen."}, {"question": "Muss ich die Pyramiden besteigen?", "answer": "Nein, das Besteigen ist optional und gegen eine zusätzliche Gebühr möglich."}]'::jsonb,
'/images/tours/kairo.jpg', 'Hotellobby in Hurghada', true),

('rote-meer-schnorcheltour', 'Schnorcheltour am Roten Meer', 'Entdecken Sie die bunte Unterwasserwelt vor Hurghada — auch für Anfänger geeignet.', 'Tauchen Sie ein in die faszinierende Unterwasserwelt des Roten Meeres. Die Gegend vor Hurghada gehört zu den schönsten Korallengärten der Welt. Schnorchelausrüstung ist inklusive — auch Nichtschwimmer können teilnehmen.', 35, '4 Stunden', 4, 12, 'leicht', 4, 'Hurghada', 'hurghada', 'wassersport', 'Wassersport',
'["Korallenriffe", "Bunte Fische", "Delfine (saisonabhängig)", "Kristallklares Wasser"]'::jsonb,
'["Schnorchelausrüstung", "Rettungsweste", "Trinkwasser", "Snacks", "Bootsfahrt"]'::jsonb,
'["Fotopaket optional", "Trinkgeld"]'::jsonb,
'[{"title": "Hafen", "content": "Treffen am Hafen von Hurghada um 09:00 Uhr. Sicherheitsbelehrung und Ausrüstung."}, {"title": "Erster Stopp", "content": "Schnorcheln an einem der schönsten Korallenriffe vor Hurghada (ca. 45 Min)."}, {"title": "Zweiter Stopp", "content": "Weiterfahrt zum zweiten Schnorchelplatz. Kaffee und Snacks an Bord."}, {"title": "Rückkehr", "content": "Rückkehr zum Hafen um 13:00 Uhr."}]'::jsonb,
'[{"question": "Kann ich schwimmen, wenn ich kein guter Schwimmer bin?", "answer": "Ja! Sie bekommen eine Rettungsweste und das Boot fährt an ruhigen Stellen."}, {"question": "Wann sind die besten Bedingungen?", "answer": "Das Rote Meer ist das ganze Jahr über warm. April bis Oktober ideale Sicht."}]'::jsonb,
'/images/tours/schnorcheln.jpg', 'Hafen Hurghada', true),

('wuesten-safari-quad', 'Quad-Wüstensafari von Hurghada', 'Mit dem Quad durch die Egyptsche Wüste — Sonnenuntergang und Beduinen-Camp inklusive.', 'Erleben Sie die atemberaubende ägyptische Wüste auf einem Quad. Rennen Sie über Sanddünen, besuchen Sie ein Beduinen-Dorf und genießen Sie den Sonnenuntergang mit traditionellem Tee.', 40, '4 Stunden', 4, 8, 'mittel', 16, 'Hurghada', 'hurghada', 'wuesten-safari', 'Wüstensafari',
'["Quad-Fahren", "Sonnenaufgang über den Dünen", "Beduinen-Dorf", "Kamelreiten", "Wüsten-Camp"]'::jsonb,
'["Quad-Miete", "Sicherheitshelm", "Kamelreiten", "Teepause", "Transfer"]'::jsonb,
'["Fotos (optional)", "Trinkgeld", "Shisha im Camp"]'::jsonb,
'[{"title": "Abholung", "content": "Abholung vom Hotel um 14:00 Uhr. Fahrt zum Quad-Stützpunkt."}, {"title": "Quad-Tour", "content": "2-stündige Quad-Tour durch die Sanddünen der Wüste."}, {"title": "Beduinen-Camp", "content": "Besuch eines Beduinen-Dorfes mit Kamelreiten und ägyptischem Tee."}, {"title": "Sonnenuntergang", "content": "Genießen Sie den Sonnenuntergang vom Wüstenberg aus. Rückfahrt zum Hotel."}]'::jsonb,
'[{"question": "Brauche ich einen Führerschein?", "answer": "Nein, Sie erhalten eine kurze Einweisung vor Ort."}, {"question": "Ist es gefährlich?", "answer": "Die Touren sind sicher. Sie fahren in Gruppen mit Guide und tragen Helme."}]'::jsonb,
'/images/tours/quad-wueste.jpg', 'Hotellobby in Hurghada', true),

('snorkeln-giftun-insel', 'Giftun-Insel Schnorchel & Grill', 'Tagesausflug zur Giftun-Insel mit Schnorcheln, Grillen und Strand.', 'Genießen Sie einen ganzen Tag auf der uninhabitierten Giftun-Insel, einem Nationalpark. Rotes Korallenmeer, weißer Sandstrand und ein leckeres Grillbuffet am Meer.', 55, '8 Stunden', 8, 20, 'leicht', 4, 'Hurghada', 'hurghada', 'ganztag', 'Ganztagestouren',
'["Giftun-Insel Nationalpark", "Schnorcheln an Korallenriffen", "Grillbuffet am Strand", "Wasserrutsche am Boot"]'::jsonb,
'["Bootsfahrt", "Schnorchelausrüstung", "Grillbuffet", "Getränke", "Nationalpark-Gebühr"]'::jsonb,
'["Fotos", "Alkoholische Getränke", "Trinkgeld"]'::jsonb,
'[{"title": "Hafen", "content": "Abfahrt vom Hafen um 08:00 Uhr mit dem Boot zur Giftun-Insel."}, {"title": "Schnorcheln", "content": "Erster Schnorchelstopp am Riff der Nationalpark-Insel."}, {"title": "Insel", "content": "Ankunft auf der Insel. Grillbuffet, Strand, Entspannung."}, {"title": "Nachmittag", "content": "Zweiter Schnorchelstopp auf der Rückfahrt. Ankunft im Hafen ca. 16:00 Uhr."}]'::jsonb,
'[{"question": "Ist die Insel überfüllt?", "answer": "Nein, die Besucherzahl ist begrenzt. Es ist ein Nationalpark."}, {"question": "Gibt es Toiletten auf der Insel?", "answer": "Ja, es gibt einfache Sanitäranlagen auf der Insel."}]'::jsonb,
'/images/tours/giftun.jpg', 'Hafen Hurghada', false),

('halbtags-schnorcheln', 'Halbtags-Schnorchel Abenteuer', 'Schnorcheln Sie zwei der schönsten Riffe vor Hurghada in nur 4 Stunden.', 'Perfekt für alle, die wenig Zeit haben aber das Beste aus dem Roten Meer genießen möchten. In nur 4 Stunden erleben Sie zwei fantastische Schnorchelplätze.', 25, '4 Stunden', 4, 12, 'leicht', 4, 'Hurghada', 'hurghada', 'halbtag', 'Halbtagestouren',
'["Zwei Schnorchelplätze", "Korallenriffe", "Bunte Unterwasserwelt"]'::jsonb,
'["Schnorchelausrüstung", "Rettungsweste", "Wasser", "Snacks"]'::jsonb,
'["Fotos", "Trinkgeld"]'::jsonb,
'[{"title": "Abfahrt", "content": "Treffen am Hafen um 09:00 oder 13:00 Uhr (morgens/ nachmittags)."}, {"title": "Erster Stopp", "content": "Schnorcheln am ersten Riff (ca. 30 Min)."}, {"title": "Zweiter Stopp", "content": "Schnorcheln am zweiten Riff mit Kaffee an Bord."}, {"title": "Rückkehr", "content": "Rückkehr zum Hafen nach insgesamt 4 Stunden."}]'::jsonb,
'[{"question": "Welche Zeit ist besser — morgens oder nachmittags?", "answer": "Morgens ist das Wasser ruhiger und die Sicht oft besser. Nachmittags ist es weniger überfüllt."}]'::jsonb,
'/images/tours/halbtag-schnorcheln.jpg', 'Hafen Hurghada', false);


-- =========================================================
-- الجزء الثامن: ترجمات الجولات — English
-- =========================================================

INSERT INTO tour_translations (tour_slug, locale, name, short_description, category_label) VALUES
('kairo-von-hurghada', 'en', 'Day Trip to Cairo from Hurghada', 'The Pyramids of Giza, the Egyptian Museum and Cairo Old Town — all in one day.', 'Full Day Tours'),
('rote-meer-schnorcheltour', 'en', 'Red Sea Snorkeling Tour', 'Discover the colorful underwater world off Hurghada — suitable for beginners too.', 'Water Sports'),
('wuesten-safari-quad', 'en', 'Quad Desert Safari from Hurghada', 'Ride a quad through the Egyptian desert — sunset and Bedouin camp included.', 'Desert Safari'),
('snorkeln-giftun-insel', 'en', 'Giftun Island Snorkeling & BBQ', 'Day trip to Giftun Island with snorkeling, BBQ and beach.', 'Full Day Tours'),
('halbtags-schnorcheln', 'en', 'Half Day Snorkeling Adventure', 'Snorkel two of the best reefs off Hurghada in just 4 hours.', 'Half Day Tours'),

('kairo-von-hurghada', 'ru', 'Дневная поездка в Каир из Хургады', 'Пирамиды Гизы, Египетский музей и Старый Каир — всё за один день.', 'Дневные экскурсии'),
('rote-meer-schnorcheltour', 'ru', 'Снорклинг на Красном море', 'Откройте красочный подводный мир Хургады — подходит для начинающих.', 'Водные виды спорта'),
('wuesten-safari-quad', 'ru', 'Квадроциклы в пустыне из Хургады', 'Прокат на квадроцикле по египетской пустыне — закат и бедуинский лагерь.', 'Пустынное сафари'),
('snorkeln-giftun-insel', 'ru', 'Остров Гифтун: снорклинг и барбекю', 'Дневная поездка на остров Гифтун со снорклингом, барбекю и пляжем.', 'Дневные экскурсии'),
('halbtags-schnorcheln', 'ru', 'Полуденный снорклинг', 'Снорклинг на двух лучших рифах Хургады всего за 4 часа.', 'Полуденные экскурсии');


-- =========================================================
-- الجزء التاسع: بيانات تجريبية — 5 مقالات مدونة
-- =========================================================

INSERT INTO blog_posts (slug, title, excerpt, content, image, category, date, read_time, tags, author, published) VALUES

('beste-strände-hurghada', 'Die 10 besten Strände in Hurghada', 'Von geheimen Buchten bis zu belebten Strandabschnitten — die schönsten Strände der Region.', '<h2>1. Mamsha Beach</h2><p>Der beliebteste Strand in Hurghada. Langanstreckt sich entlang der Promenade mit vielen Cafés und Restaurants.</p><h2>2. Sahl Hasheesh</h2><p>Ein exklusiver Resort-Strand mit kristallklarem Wasser und feinem weißem Sand. Perfekt zum Schnorcheln.</p><h2>3. Makadi Beach</h2><p>Ruhig und familienfreundlich. Flaches Wasser und weicher Sand machen es ideal für Kinder.</p><h2>4. El Gouna Beach</h2><p>Die künstlichen Lagunen bieten geschützte Badebuchten. Ideal zum Entspannen.</p><h2>5. Giftun Island</h2><p>Nur mit dem Boot erreichbar — ein unberührtes Paradies mit Nationalpark.</p><p><strong>Tipp:</strong> Besuchen Sie die Strände am besten früh morgens oder am späten Nachmittag für die schönsten Lichtverhältnisse und weniger Menschen.</p>', '/images/blog/strände.jpg', 'Reisetipps', '2025-11-15', '8 Minuten', '["Hurghada", "Strände", "Reisetipps", "Rotes Meer"]'::jsonb, 'Reiseplaner Team', true),

('tauchen-hurghada-guide', 'Tauchen in Hurghada: Der ultimative Guide', 'Alles was Sie über Tauchen in Hurghada wissen müssen — von Kursen bis zu den besten Tauchplätzen.', '<h2>Warum Hurghada?</h2><p>Hurghada ist eine der weltweit besten Tauchdestinationen. Die Wassertemperatur beträgt 22-30°C das ganze Jahr.</p><h2>Beliebte Tauchplätze</h2><ul><li><strong>Giftun:</strong> Korallenriffe, Schildkröten, Barrakuda</li><li><strong>Abu Dabbab:</strong> Seekühe und Seeschildkröten</li><li><strong>Elphinstone:</strong> Hammerhaie (fortgeschritten)</li></ul><h2>Tauchkurse</h2><p>PADI-Kurse gibt es in fast jedem Hotel. Anfänger可以从Discovery Dive开始，无需经验。</p>', '/images/blog/tauchen.jpg', 'Aktivitäten', '2025-10-28', '12 Minuten', '["Tauchen", "Hurghada", "Rotes Meer", "PADI"]'::jsonb, 'Reiseplaner Team', true),

('wetter-hurghada', 'Das Wetter in Hurghada — Wann reisen?', 'Monat für Monat: Wassertemperatur, Lufttemperatur und Reisetipps für jede Jahreszeit.', '<h2>Frisühling (März — Mai)</h2><p>Perfektes Reisewetter! 25-32°C, wenig Regen. Ideal für Ausflüge und Sightseeing.</p><h2>Sommer (Juni — September)</h2><p>Sehr heiß mit 35-42°C. Ideal für Strandurlauber. Wassertemperatur 28-30°C.</p><h2>Herbst (Oktober — November)</h2><p>Angenehm warm mit 28-33°C. Die beste Zeit für Taucher wegen der höchsten Sicht.</p><h2>Winter (Dezember — Februar)</h2><p>Mild mit 20-25°C. Perfekt für Alle, die der Kälte entkommen möchten. Wassertemperatur 22-24°C.</p>', '/images/blog/wetter.jpg', 'Reisetipps', '2025-10-10', '6 Minuten', '["Wetter", "Reisezeit", "Hurghada", "Klima"]'::jsonb, 'Reiseplaner Team', true),

('kultur-egypten', 'Kultur & Geschichte Ägyptens', 'Von den Pharaonen bis heute — eine Reise durch 5000 Jahre ägyptische Geschichte.', '<h2>Die Pharaonenzeit</h2><p>Ägypten ist das Land der Pharaonen. Die Pyramiden von Gizeh sind das älteste der Sieben Weltwunder.</p><h2>Die griechisch-römische Epoche</h2><p>Alexandria und die Ruizen von Karnak zeugen von dieser faszinierenden Zeit.</p><h2>Das koptische Ägypten</h2><p>Die Höhlenkirchen von Abu Simbel und die Klöster des Niltales sind einzigartig.</p><h2>Das islamische Ägypten</h2><p>Die Moscheen von Kairo, die Medina von Fes — eine lebendige Kultur.</p>', '/images/blog/kultur.jpg', 'Kultur', '2025-09-22', '10 Minuten', '["Kultur", "Geschichte", "Ägypten", "Pharaonen"]'::jsonb, 'Reiseplaner Team', true),

('tips-fuer-reisende', '10 wertvolle Tipps für Reisende nach Hurghada', 'Was Sie vor der Reise wissen sollten — von Bargeld bis Verhalten.', '<h2>1. Bargeld mitnehmen</h2><p>Egyptische Pfund und Euro/USD in kleinen Scheinen. Kreditkarten werden oft nicht akzeptiert.</p><h2>2. Trinkgelder</h2><p>Trinkgelder sind obligatorisch. 50-100 EGP für Guides, 20-30 für Kellner.</p><h2>3. Verhandeln</h2><p>Auf Märkten und in Geschäften wird verhandeln erwartet. Starten Sie bei 50% des Angebots.</p><h2>4. Kleidung</h2><p>Leichte, lockere Kleidung. Für Moscheen: Schultern und Knie bedecken.</p><h2>5. Sonnenschutz</h2><p>Hochwertiger Sonnenschutz ist Pflicht. Die Sonne ist sehr intensiv.</p>', '/images/blog/tipps.jpg', 'Reisetipps', '2025-09-05', '7 Minuten', '["Tipps", "Hurghada", "Reisenvorbereitung", "Ägypten"]'::jsonb, 'Reiseplaner Team', true);


-- =========================================================
-- الجزء العاشر: بيانات تجريبية — 12 سؤال شائع (FAQs)
-- =========================================================

INSERT INTO faqs (question, answer, sort_order) VALUES
('Welche Zahlungsmethoden akzeptieren Sie?', 'Wir akzeptieren Kreditkarten (Visa, MasterCard), PayPal und Banküberweisung. Barzahlung ist vor Ort möglich.', 1),
('Kostenlose Stornierung möglich?', 'Ja, bis 48 Stunden vor Beginn der Tour können Sie kostenlos stornieren.', 2),
('Wie buche ich eine Tour?', 'Wählen Sie Ihre Tour, wählen Sie Datum und Teilnehmeranzahl und klicken Sie auf "Jetzt buchen". Sie erhalten eine Bestätigung per E-Mail.', 3),
('Kann ich mehrere Touren an einem Tag buchen?', 'Ja, solange die Zeiten sich nicht überschneiden. Halbtagestouren lassen sich gut kombinieren.', 4),
('Gibt es Kinderermäßigungen?', 'Ja, für Kinder unter 12 Jahren gibt es 50% Rabatt. Babys unter 3 Jahren reisen kostenlos.', 5),
('Ist eine Pick-up-Service inklusive?', 'Ja, alle Touren beinhalten eine Abholung und Rückbringung zu Ihrem Hotel in Hurghada.', 6),
('Was soll ich mitnehmen?', 'Sonnencreme, Hut, bequeme Schuhe, Kamera, Wasser und eine kleine Summe Geld für Trinkgelder.', 7),
('Gibt es Verpflegung auf den Touren?', 'Bei Ganztagestouren ist das Mittagessen meist inklusive. Bei Halbtagestouren gibt es Snacks und Getränke.', 8),
('Wie sind die Wetterbedingungen?', 'Hurghada hat das ganze Jahr über warmes Wetter. Die beste Reisezeit ist März bis Mai und Oktober bis November.', 9),
('Ist Hurghada sicher für Touristen?', 'Ja, Hurghada ist eine der sichersten Touristenregionen Ägyptens. Es gibt eine starke Polizeipräsenz.', 10),
('Kann ich mehrere Destinationen besuchen?', 'Ja, wir bieten Kombi-Touren an, die mehrere Destinationen an einem Tag besuchen.', 11),
('Welche Sprachen sprechen Ihre Guides?', 'Deutsch, Englisch, Arabisch und oft auch Russisch und Italienisch.', 12);


-- =========================================================
-- الجزء الحادي عشر: سياسات الأمان (RLS)
-- =========================================================

-- ENABLE RLS on all tables
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public READ policies (everyone can read)
CREATE POLICY "Public read destinations" ON destinations FOR SELECT USING (true);
CREATE POLICY "Public read destination_translations" ON destination_translations FOR SELECT USING (true);
CREATE POLICY "Public read tour_categories" ON tour_categories FOR SELECT USING (true);
CREATE POLICY "Public read category_translations" ON category_translations FOR SELECT USING (true);
CREATE POLICY "Public read tours" ON tours FOR SELECT USING (true);
CREATE POLICY "Public read tour_translations" ON tour_translations FOR SELECT USING (true);
CREATE POLICY "Public read published blog_posts" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (true);

-- Public INSERT policies (anyone can submit)
CREATE POLICY "Public insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert newsletter_subscribers" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Admin FULL ACCESS (uses service_role key which bypasses RLS)
-- The service_role key in your .env.local bypasses all RLS policies
-- So your admin panel can read/write everything
