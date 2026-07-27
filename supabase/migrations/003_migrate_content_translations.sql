-- Migration 003: Transform content_translations from EAV to row-per-locale schema
-- Generated: 2026-07-25T16:58:12.041Z

-- =====================================================
-- STEP 1: Rename old EAV table
-- =====================================================
ALTER TABLE IF EXISTS content_translations RENAME TO content_translations_eav;

-- =====================================================
-- STEP 2: Create new row-per-locale table
-- =====================================================
CREATE TABLE content_translations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  table_name TEXT NOT NULL CHECK (table_name IN ('tours','destinations','blog_posts','faqs')),
  row_id UUID NOT NULL,
  locale TEXT NOT NULL,
  name TEXT,
  description TEXT,
  short_description TEXT,
  category_label TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  included JSONB DEFAULT '[]'::jsonb,
  not_included JSONB DEFAULT '[]'::jsonb,
  meeting_point TEXT,
  duration TEXT,
  title TEXT,
  excerpt TEXT,
  content TEXT,
  read_time TEXT,
  faqs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ct_table_row ON content_translations(table_name, row_id);
CREATE INDEX idx_ct_locale ON content_translations(locale);
CREATE UNIQUE INDEX idx_ct_table_row_locale ON content_translations(table_name, row_id, locale);

-- =====================================================
-- STEP 3: Insert translated data
-- =====================================================

-- Batch 1 (rows 1-50)
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs) VALUES
('tours', '42a2941f-6b90-4f0a-9593-0ec1ec980a13', 'en', 'Private Day Trip to Luxor from Hurghada - Valley of the Kings & Karnak Temple', '<table class="tour-pricing-table"><thead><tr><th>Participant</th><th>Vehicle</th><th>Price per person</th></tr></thead><tbody><tr><td>2 people</td><td>Private limousine</td><td>150 € per person</td></tr><tr><td>3 – 4 people</td><td>Private Minibus</td><td>135 € per person</td></tr><tr><td>5 - 6 people</td><td>Private minibus</td><td>100 € per person</td></tr><tr><td>7 - 8 people</td><td>Private minibus</td><td>90 € per person</td></tr></tbody></table>
Discover Egypt''s fascinating history on a comfortable, private day trip to Luxor from Hurghada. Luxor - the former Thebes - was once the center of ancient Egyptian civilization and offers some of the most impressive monuments in the country.





Your day begins early in the morning with a comfortable drive to Luxor. Accompanied by an experienced German-speaking Egyptologist, you will explore the city''s most important sights: the Valley of the Kings with its magnificent tombs, the monumental Karnak Temple, the terrace temple of Queen Hatshepsut and the famous Colossi of Memnon.





This tour is perfect for history lovers, families, and travelers who want to experience Egypt''s cultural heart in just one day.', 'Discover Luxor on a private day trip from Hurghada. Visit the Valley of the Kings, Karnak Temple, Hatshepsut Temple and the Colossi of Memnon including lunch and a German-speaking tour guide.', 'Culture & sightseeing', '["Valley of the Kings – discover the tombs of the pharaohs","Karnak Temple – monumental building with a hypostyle hall","Terrace Temple of Queen Hatshepsut – architectural masterpiece","Colossi of Memnon – impressive sitting statues","Lunch with Egyptian specialties","Private tour with German-speaking Egyptologist"]'::jsonb, '["High-quality transfer in an air-conditioned vehicle","German-speaking Egyptologist as tour guide","Entrance fees to all attractions","Lunch","Water and soft drinks during the journey"]'::jsonb, '["Drinks in the restaurant","Personal expenses","Transfer surcharge for guests from Marsa Alam: €25 per person","Transfer surcharge for guests from El Quseir: €15 per person","Transfer surcharge from Makadi Bay & Sahl Hasheesh: €5 per person","Transfer surcharge from El Gouna, Safaga & Soma Bay: €10 per person","Foreign language tour guide (English, Russian or French): additional charge €10 per person"]'::jsonb, 'Hurghada - Red Sea - Egypt', '14h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '42a2941f-6b90-4f0a-9593-0ec1ec980a13', 'hu', 'Privát egynapos kirándulás Luxorba Hurghadából – A Királyok Völgye és a karnaki templom', '<table class="tour-pricing-table"><thead><tr><th>Részvevő</th><th>Jármű</th><th>Ár személyenként</th></tr></thead><tbody><tr><td>2 fő</td><td>Privát limuzin</td><td>150 € személyenként</td><td>150 € személyenként</td><td>privát Minibusz</td><td>135 €/fő</td></tr><tr><td>5-6 fő</td><td>Privát mikrobusz</td><td>100 €/fő</td></tr><tr><td>7-8 fő</td><td>Privát mikrobusz</td><td>90 €/fő/fő
Fedezze fel Egyiptom lenyűgöző történelmét egy kényelmes, privát egynapos kiránduláson Luxorba Hurghadából. Luxor – az egykori Théba – egykor az ókori egyiptomi civilizáció központja volt, és az ország leglenyűgözőbb műemlékeit kínálja.





Napja kora reggel kényelmes utazással kezdődik Luxorba. Egy tapasztalt németül beszélő egyiptológus kíséretében felfedezheti a város legfontosabb nevezetességeit: a Királyok Völgyét a csodálatos sírokkal, a monumentális karnaki templomot, Hatsepszut királynő terasztemplomát és a híres Memnon kolosszusokat.





Ez a túra tökéletes a történelem szerelmeseinek, családoknak és utazóknak, akik egyetlen nap alatt szeretnék megtapasztalni Egyiptom kulturális szívét.', 'Fedezze fel Luxort egy privát egynapos kiránduláson Hurghadából. Látogassa meg a Királyok Völgyét, a Karnak-templomot, a Hatsepszut-templomot és a Memnon-kolosszusokat, ebéddel és németül beszélő idegenvezetővel.', 'Kultúra és városnézés', '["A Királyok Völgye – fedezze fel a fáraók sírjait","Karnak-templom – monumentális épület hipostílusú teremmel","Terasz Hatsepszut királynő temploma – építészeti remekmű","Memnoni kolosszusok – lenyűgöző ülőszobrok","Ebéd egyiptomi különlegességekkel","Privát túra németül beszélő egyiptológussal"]'::jsonb, '["Kiváló minőségű transzfer légkondicionált járműben","Németül beszélő egyiptológus, mint idegenvezető","Belépődíjak minden látnivalóra","Ebéd","Víz és üdítőital az utazás során"]'::jsonb, '["Italok az étteremben","Személyes kiadások","Transzfer felár Marsa Alamból: 25 € személyenként","Transzfer felár El Quseirből: 15 € személyenként","Transzfer felára a Makadi Bay & Sahl Hasheesh területéről: 5 euró személyenként","Transzfer felára El Gouna, Safaga és Soma Bay területéről: 10 € személyenként","Idegen nyelvű túravezető (angol, orosz vagy francia): felár 10 € személyenként"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '14 óra', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '42a2941f-6b90-4f0a-9593-0ec1ec980a13', 'ru', 'Частная однодневная поездка в Луксор из Хургады – Долина царей и Карнакский храм
---ЦЭП---
Откройте для себя Луксор в частной однодневной поездке из Хургады. Посетите Долину царей, Карнакский храм, Храм Хатшепсут и Колоссы Мемнона, включая обед и услуги немецкоязычного гида.
---ЦЭП---
Культура и достопримечательности
---ЦЭП---
Хургада - Красное море - Египет
---ЦЭП---
14 часов
---ЦЭП---
<table class="tour-pricing-table"><thead><tr><th>Участник</th><th>Автомобиль</th><th>Цена на человека</th></tr></thead><tbody><tr><td>2 человека</td><td>Частный лимузин</td><td>150 € на человека</td></tr><tr><td>3 – 4 человека</td><td>Частный Микроавтобус</td><td>135 € на человека</td></tr><tr><td>5 - 6 человек</td><td>Частный микроавтобус</td><td>100 € на человека</td></tr><tr><td>7 - 8 человек</td><td>Частный микроавтобус</td><td>90 € на человека</td></tr></tbody></table>
Откройте для себя увлекательную историю Египта в комфортабельной частной однодневной поездке в Луксор из Хургады. Луксор – бывшие Фивы – когда-то был центром древнеегипетской цивилизации и предлагает одни из самых впечатляющих памятников в стране.





Ваш день начнется рано утром с комфортной поездки в Луксор. В сопровождении опытного немецкоязычного египтолога вы осмотрите самые важные достопримечательности города: Долину царей с ее великолепными гробницами, монументальный Карнакский храм, террасный храм царицы Хатшепсут и знаменитые Колоссы Мемнона.





Этот тур идеально подходит для любителей истории, семей и путешественников, которые хотят познакомиться с культурным центром Египта всего за один день.
---ЦЭП---
Долина царей – откройте для себя гробницы фараонов
---РАЗДЕЛЕНИЕ---
Карнакский храм – монументальное здание с гипостильным залом.
---РАЗДЕЛЕНИЕ---
Террасный храм царицы Хатшепсут – архитектурный шедевр
---РАЗДЕЛЕНИЕ---
Колоссы Мемнона – впечатляющие сидячие статуи.
---РАЗДЕЛЕНИЕ---
Обед с блюдами египетской кухни
---РАЗДЕЛЕНИЕ---
Частный тур с немецкоязычным египтологом
---ЦЭП---
Качественный трансфер на автомобиле с кондиционером
---РАЗДЕЛЕНИЕ---
Немецкоязычный египтолог в качестве гида.
---РАЗДЕЛЕНИЕ---
Входные билеты на все достопримечательности
---РАЗДЕЛЕНИЕ---
Обед
---РАЗДЕЛЕНИЕ---
Вода и безалкогольные напитки во время путешествия
---ЦЭП---
Напитки в ресторане
---РАЗДЕЛЕНИЕ---
Личные расходы
---РАЗДЕЛЕНИЕ---
Доплата за трансфер для гостей из Марса Алама: 25 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер для гостей из Эль-Кусейра: 15 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из залива Макади и Сахл Хашиша: 5 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из Эль-Гуны, Сафаги и Сома-Бэй: 10 евро на человека.
---РАЗДЕЛЕНИЕ---
Гид на иностранном языке (английский, русский или французский): дополнительная плата 10 евро на человека.', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Fahrzeug</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Private Limousine</td><td>150 € p.P.</td></tr><tr><td>3 – 4 Personen</td><td>Privater Minibus</td><td>135 € p.P.</td></tr><tr><td>5 – 6 Personen</td><td>Privater Minibus</td><td>100 € p.P.</td></tr><tr><td>7 – 8 Personen</td><td>Privater Minibus</td><td>90 € p.P.</td></tr></tbody></table>
Entdecken Sie die faszinierende Geschichte Ägyptens auf einem komfortablen, privaten Tagesausflug von Hurghada nach Luxor. Luxor – das ehemalige Theben – war einst das Zentrum der altägyptischen Hochkultur und bietet einige der beeindruckendsten Monumente des Landes.





Ihr Tag beginnt früh morgens mit einer komfortablen Fahrt nach Luxor. Begleitet von einem erfahrenen deutschsprachigen Ägyptologen erkunden Sie die wichtigsten Sehenswürdigkeiten der Stadt: das Tal der Könige mit seinen prachtvollen Gräbern, den monumentalen Karnak-Tempel, den Terrassentempel der Königin Hatschepsut und die berühmten Memnonkolosse.





Diese Tour ist perfekt für Geschichtsliebhaber, Familien und Reisende, die Ägyptens kulturelles Herz an nur einem Tag erleben möchten.', 'Entdecken Sie Luxor bei einem privaten Tagesausflug ab Hurghada. Besuchen Sie das Tal der Könige, den Karnak-Tempel, den Hatschepsut-Tempel und die Memnonkolosse inklusive Mittagessen und deutschsprachigem Reiseleiter.', 'Kultur & Sightseeing', '["Tal der Könige – Gräber der Pharaonen entdecken","Karnak-Tempel – monumentales Bauwerk mit Säulenhalle","Terrassentempel der Königin Hatschepsut – architektonisches Meisterwerk","Memnonkolosse – beeindruckende Sitzstatuen","Mittagessen mit ägyptischen Spezialitäten","Privattour mit deutschsprachigem Ägyptologen"]'::jsonb, '["Hochwertiger Transfer im klimatisierten Fahrzeug","Deutschsprachiger Ägyptologe als Reiseleiter","Eintrittsgelder zu allen Sehenswürdigkeiten","Mittagessen","Wasser und Softdrinks während der Fahrt"]'::jsonb, '["Getränke im Restaurant","Persönliche Ausgaben","Transferzuschlag für Gäste aus Marsa Alam: 25 € pro Person","Transferzuschlag für Gäste aus El Quseir: 15 € pro Person","Transferzuschlag ab Makadi Bay & Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga & Soma Bay: 10 € pro Person","Fremdsprachiger Reiseleiter (Englisch, Russisch oder Französisch): Aufpreis 10 € pro Person"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '14h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '42a2941f-6b90-4f0a-9593-0ec1ec980a13', 'fr', 'Excursion privée d''une journée à Louxor depuis Hurghada - Vallée des Rois et temple de Karnak', '<table class="tour-pricing-table"><thead><tr><th>Participant</th><th>Véhicule</th><th>Prix par personne</th></tr></thead><tbody><tr><td>2 personnes</td><td>Limousine privée</td><td>150 € par personne</td></tr><tr><td>3 – 4 personnes</td><td>Privé Minibus</td><td>135 € par personne</td></tr><tr><td>5 - 6 personnes</td><td>Minibus privé</td><td>100 € par personne</td></tr><tr><td>7 - 8 personnes</td><td>Minibus privé</td><td>90 € par personne</td></tr></tbody></table>
Découvrez l''histoire fascinante de l''Égypte lors d''une excursion confortable et privée d''une journée à Louxor au départ d''Hurghada. Louxor – l''ancienne Thèbes – était autrefois le centre de la civilisation égyptienne antique et offre certains des monuments les plus impressionnants du pays.





Votre journée commence tôt le matin par un trajet confortable vers Louxor. Accompagné d''un égyptologue germanophone expérimenté, vous explorerez les sites les plus importants de la ville : la Vallée des Rois avec ses magnifiques tombeaux, le temple monumental de Karnak, le temple en terrasse de la reine Hatshepsout et les célèbres colosses de Memnon.





Cette visite est parfaite pour les amateurs d''histoire, les familles et les voyageurs qui souhaitent découvrir le cœur culturel de l''Égypte en une seule journée.', 'Découvrez Louxor lors d''une excursion privée d''une journée au départ d''Hurghada. Visitez la Vallée des Rois, le temple de Karnak, le temple d''Hatchepsout et les colosses de Memnon, déjeuner compris et guide touristique germanophone.', 'Culture et tourisme', '["Vallée des Rois – découvrez les tombeaux des pharaons","Temple de Karnak – bâtiment monumental avec une salle hypostyle","Temple en terrasse de la reine Hatshepsout – chef-d''œuvre architectural","Colosses de Memnon – impressionnantes statues assises","Déjeuner avec des spécialités égyptiennes","Visite privée avec un égyptologue germanophone"]'::jsonb, '["Transfert de haute qualité dans un véhicule climatisé","Égyptologue germanophone comme guide touristique","Frais d''entrée à toutes les attractions","Déjeuner","Eau et boissons gazeuses pendant le voyage"]'::jsonb, '["Boissons au restaurant","Dépenses personnelles","Supplément de transfert pour les clients de Marsa Alam : 25 € par personne","Supplément de transfert pour les clients d''El Quseir : 15 € par personne","Supplément de transfert depuis la baie de Makadi et Sahl Hasheesh : 5 € par personne","Supplément de transfert depuis El Gouna, Safaga et Soma Bay : 10 € par personne","Guide touristique en langue étrangère (anglais, russe ou français) : supplément 10 € par personne"]'::jsonb, 'Hurghada - Mer Rouge - Egypte', '14h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '42a2941f-6b90-4f0a-9593-0ec1ec980a13', 'ar', 'رحلة نهارية خاصة إلى الأقصر من الغردقة - وادي الملوك ومعبد الكرنك
--- تسيب ---
اكتشف الأقصر في رحلة نهارية خاصة من الغردقة. زيارة وادي الملوك ومعبد الكرنك ومعبد حتشبسوت وتمثالي ممنون بما في ذلك الغداء ومرشد سياحي يتحدث الألمانية.
--- تسيب ---
الثقافة ومشاهدة المعالم السياحية
--- تسيب ---
الغردقة - البحر الأحمر - مصر
--- تسيب ---
14 ساعة
--- تسيب ---
<table class="tour-pricing-table"><thead><tr><th>المشارك</th><th>المركبة</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخصين</td><td>سيارة ليموزين خاصة</td><td>150 يورو للشخص الواحد</td></tr><tr><td>3 - 4 أشخاص</td><td>خاص حافلة صغيرة</td><td>135 يورو للشخص الواحد</td></tr><tr><td>5 - 6 أشخاص</td><td>حافلة صغيرة خاصة</td><td>100 يورو للشخص الواحد</td></tr><tr><td>7 - 8 أشخاص</td><td>حافلة صغيرة خاصة</td><td>90 يورو للشخص الواحد</td></tr></tbody></table>
اكتشف تاريخ مصر الرائع في رحلة نهارية خاصة ومريحة إلى الأقصر من الغردقة. كانت الأقصر - طيبة سابقًا - ذات يوم مركزًا للحضارة المصرية القديمة، وتضم بعضًا من المعالم الأثرية الأكثر إثارة للإعجاب في البلاد.





يبدأ يومك في الصباح الباكر برحلة مريحة إلى الأقصر. برفقة عالم مصريات ذو خبرة ويتحدث الألمانية، سوف تستكشف أهم معالم المدينة: وادي الملوك بمقابره الرائعة، ومعبد الكرنك الضخم، ومعبد الشرفة للملكة حتشبسوت، وتمثالي ممنون الشهير.





هذه الجولة مثالية لمحبي التاريخ والعائلات والمسافرين الذين يرغبون في تجربة قلب مصر الثقافي في يوم واحد فقط.
--- تسيب ---
وادي الملوك – اكتشف مقابر الفراعنة
---تقسيم---
معبد الكرنك – مبنى ضخم به قاعة أعمدة
---تقسيم---
شرفة معبد الملكة حتشبسوت – تحفة معمارية
---تقسيم---
تمثالا ممنون – تماثيل جالسة مثيرة للإعجاب
---تقسيم---
الغداء مع التخصصات المصرية
---تقسيم---
جولة خاصة مع عالم المصريات الناطق باللغة الألمانية
--- تسيب ---
- نقل بجودة عالية بسيارة مكيفة
---تقسيم---
عالم المصريات الناطق بالألمانية كمرشد سياحي
---تقسيم---
رسوم الدخول إلى جميع مناطق الجذب
---تقسيم---
الغداء
---تقسيم---
- المياه والمشروبات الغازية أثناء الرحلة
--- تسيب ---
المشروبات في المطعم
---تقسيم---
النفقات الشخصية
---تقسيم---
تكلفة النقل الإضافية للضيوف من مرسى علم: 25 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية للضيوف من القصير: 15 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية من خليج مكادي وسهل حشيش: 5 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية من الجونة وسفاجا وخليج سوما: 10 يورو للشخص الواحد
---تقسيم---
مرشد سياحي بلغة أجنبية (الإنجليزية أو الروسية أو الفرنسية): رسوم إضافية 10 يورو للشخص الواحد', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Fahrzeug</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Private Limousine</td><td>150 € p.P.</td></tr><tr><td>3 – 4 Personen</td><td>Privater Minibus</td><td>135 € p.P.</td></tr><tr><td>5 – 6 Personen</td><td>Privater Minibus</td><td>100 € p.P.</td></tr><tr><td>7 – 8 Personen</td><td>Privater Minibus</td><td>90 € p.P.</td></tr></tbody></table>
Entdecken Sie die faszinierende Geschichte Ägyptens auf einem komfortablen, privaten Tagesausflug von Hurghada nach Luxor. Luxor – das ehemalige Theben – war einst das Zentrum der altägyptischen Hochkultur und bietet einige der beeindruckendsten Monumente des Landes.





Ihr Tag beginnt früh morgens mit einer komfortablen Fahrt nach Luxor. Begleitet von einem erfahrenen deutschsprachigen Ägyptologen erkunden Sie die wichtigsten Sehenswürdigkeiten der Stadt: das Tal der Könige mit seinen prachtvollen Gräbern, den monumentalen Karnak-Tempel, den Terrassentempel der Königin Hatschepsut und die berühmten Memnonkolosse.





Diese Tour ist perfekt für Geschichtsliebhaber, Familien und Reisende, die Ägyptens kulturelles Herz an nur einem Tag erleben möchten.', 'Entdecken Sie Luxor bei einem privaten Tagesausflug ab Hurghada. Besuchen Sie das Tal der Könige, den Karnak-Tempel, den Hatschepsut-Tempel und die Memnonkolosse inklusive Mittagessen und deutschsprachigem Reiseleiter.', 'Kultur & Sightseeing', '["Tal der Könige – Gräber der Pharaonen entdecken","Karnak-Tempel – monumentales Bauwerk mit Säulenhalle","Terrassentempel der Königin Hatschepsut – architektonisches Meisterwerk","Memnonkolosse – beeindruckende Sitzstatuen","Mittagessen mit ägyptischen Spezialitäten","Privattour mit deutschsprachigem Ägyptologen"]'::jsonb, '["Hochwertiger Transfer im klimatisierten Fahrzeug","Deutschsprachiger Ägyptologe als Reiseleiter","Eintrittsgelder zu allen Sehenswürdigkeiten","Mittagessen","Wasser und Softdrinks während der Fahrt"]'::jsonb, '["Getränke im Restaurant","Persönliche Ausgaben","Transferzuschlag für Gäste aus Marsa Alam: 25 € pro Person","Transferzuschlag für Gäste aus El Quseir: 15 € pro Person","Transferzuschlag ab Makadi Bay & Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga & Soma Bay: 10 € pro Person","Fremdsprachiger Reiseleiter (Englisch, Russisch oder Französisch): Aufpreis 10 € pro Person"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '14h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '77f34e21-9d9d-4be6-90b3-8148b2d82214', 'en', 'El Gouna – Private city tour with lagoon cruise & observation tower', '<table class="tour-pricing-table"><thead><tr><th>Participant</th><th>Vehicle</th><th>Price per person</th></tr></thead><tbody><tr><td>2 people</td><td>Private limousine</td><td>50 € per person</td></tr><tr><td>3 – 4 people</td><td>Private minibus</td><td>40 € per person</td></tr><tr><td>5 - 6 people</td><td>Private minibus</td><td>35 € per person</td></tr><tr><td>7 - 8 people</td><td>Private minibus</td><td>30 € per person</td></tr></tbody></table>
El Gouna is one of the most elegant places on the Red Sea. The modern lagoon city delights with turquoise waterways, quiet islands, Mediterranean architecture and a relaxed atmosphere reminiscent of European port cities.





With our private El Gouna city tour you will experience the city in a completely individual way: without sales stops, without large groups, but with personal support and an experienced German-speaking guide. The tour combines an idyllic lagoon cruise, cultural sightseeing and a visit to the famous observation tower for one of the best views in all of El Gouna.', 'Discover El Gouna – the “Venice of Egypt” – on a private city tour with a lagoon cruise and a visit to the observation tower. Architecture, marina, lagoons and panorama in just about 4 hours, without sales stops.', 'Culture & sightseeing', '["• Private city tour with a German-speaking guide","• Idyllic lagoon trip through El Gouna","• Visit the observation tower for panoramic views","• Downtown, Mosque, Coptic Church & Bibliotheca Alexandrina","• Stroll at the Abu Tig Marina","• No sales stops","• Perfect for couples, families and photography lovers"]'::jsonb, '["Private transfers in air-conditioned vehicle","Lagoon cruise in El Gouna","German speaking tour guide","Soft drinks in the car","Entrance fees according to the program"]'::jsonb, '["Personal expenses","Drinks in cafes or restaurants","Transfer surcharge from Makadi Bay & Sahl Hasheesh: €5 per person","Transfer surcharge from El Gouna, Safaga & Soma Bay: €10 per person","Foreign language tour guide (English, Russian or French): additional charge €10 per person"]'::jsonb, 'Hurghada - Red Sea - Egypt', '4h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '77f34e21-9d9d-4be6-90b3-8148b2d82214', 'fr', 'El Gouna – Visite privée de la ville avec croisière sur le lagon et tour d''observation', '<table class="tour-pricing-table"><thead><tr><th>Participant</th><th>Véhicule</th><th>Prix par personne</th></tr></thead><tbody><tr><td>2 personnes</td><td>Limousine privée</td><td>50 € par personne</td></tr><tr><td>3 – 4 personnes</td><td>Privé minibus</td><td>40 € par personne</td></tr><tr><td>5 - 6 personnes</td><td>Minibus privé</td><td>35 € par personne</td></tr><tr><td>7 - 8 personnes</td><td>Minibus privé</td><td>30 € par personne</td></tr></tbody></table>
El Gouna est l''un des endroits les plus élégants de la mer Rouge. La ville lagunaire moderne séduit par ses voies navigables turquoise, ses îles tranquilles, son architecture méditerranéenne et son atmosphère détendue qui rappelle les villes portuaires européennes.





Avec notre visite privée de la ville d''El Gouna, vous découvrirez la ville d''une manière totalement individuelle : sans points de vente, sans grands groupes, mais avec un accompagnement personnel et un guide germanophone expérimenté. La visite combine une croisière idyllique sur le lagon, des visites culturelles et une visite de la célèbre tour d''observation pour l''une des plus belles vues de tout El Gouna.', 'Découvrez El Gouna – la « Venise égyptienne » – lors d''une visite privée de la ville avec une croisière sur le lagon et une visite de la tour d''observation. Architecture, marina, lagons et panorama en seulement 4 heures environ, sans arrêts de vente.', 'Culture et tourisme', '["• Visite privée de la ville avec un guide germanophone","• Excursion idyllique dans le lagon à travers El Gouna","• Visitez la tour d''observation pour des vues panoramiques","• Centre-ville, mosquée, église copte et Bibliotheca Alexandrina","• Promenez-vous à la marina d''Abu Tig","• Aucun arrêt de vente","• Parfait pour les couples, les familles et les amateurs de photographie"]'::jsonb, '["Transferts privés en véhicule climatisé","Croisière sur le lagon à El Gouna","Guide touristique germanophone","Boissons gazeuses dans la voiture","Tarifs d''entrée selon le programme"]'::jsonb, '["Dépenses personnelles","Boissons dans les cafés ou restaurants","Supplément de transfert depuis la baie de Makadi et Sahl Hasheesh : 5 € par personne","Supplément de transfert depuis El Gouna, Safaga et Soma Bay : 10 € par personne","Guide touristique en langue étrangère (anglais, russe ou français) : supplément 10 € par personne"]'::jsonb, 'Hurghada - Mer Rouge - Egypte', '4h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '77f34e21-9d9d-4be6-90b3-8148b2d82214', 'hu', 'El Gouna – Privát városnézés lagúnahajóval és kilátótoronnyal', '<table class="tour-pricing-table"><thead><tr><th>Részvevő</th><th>Gépjármű</th><th>Ár személyenként</th></tr></thead><tbody><tr><td>2 fő</td><td>Privát limuzin</td><td>50 € személyenként</td></tr><dtrd> mikrobusz</td><td>40 €/fő</td></tr><tr><td>5-6 fő</td><td>Privát mikrobusz</td><td>35 €/fő</td></tr><tr><td>7-8 fő</td><td>Privát mikrobusz</td><td>30 €/trtable/fő/td>
El Gouna a Vörös-tenger egyik legelegánsabb helye. A modern lagúnaváros türkizkék vízi utakkal, csendes szigetekkel, mediterrán építészettel és az európai kikötővárosokat idéző ​​nyugodt légkörrel gyönyörködtet.





Privát El Gouna városnézésünkkel teljesen egyéni módon élheti meg a várost: értékesítési megállók nélkül, nagy csoportok nélkül, de személyes támogatással és tapasztalt németül beszélő idegenvezetővel. A túra egy idilli lagúna körutat, kulturális városnézést és a híres kilátótorony meglátogatását egyesíti, hogy az egyik legjobb kilátást nyújtsa egész El Gounában.', 'Fedezze fel El Gounát – „Egyiptom Velencéjét” – egy privát városnézésen lagúna körutazással és a kilátó meglátogatásával. Építészet, kikötő, lagúnák és panoráma mindössze 4 óra alatt, értékesítési leállások nélkül.', 'Kultúra és városnézés', '["• Privát városnézés német nyelvű idegenvezetővel","• Idilli lagúna kirándulás El Gounán keresztül","• Látogassa meg a kilátót a panorámás kilátásért","• Belváros, mecset, kopt templom és Bibliotheca Alexandrina","• Séta az Abu Tig kikötőben","• Nincs értékesítési leállás","• Tökéletes pároknak, családoknak és a fotózás szerelmeseinek"]'::jsonb, '["Privát transzferek légkondicionált járművel","Lagúna körutazás El Gounában","németül beszélő idegenvezető","Üdítők az autóban","Belépődíjak a program szerint"]'::jsonb, '["Személyes kiadások","Italok kávézókban vagy éttermekben","Transzfer felára a Makadi Bay & Sahl Hasheesh területéről: 5 euró személyenként","Transzfer felára El Gouna, Safaga és Soma Bay területéről: 10 € személyenként","Idegen nyelvű túravezető (angol, orosz vagy francia): felár 10 € személyenként"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '4 óra', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '77f34e21-9d9d-4be6-90b3-8148b2d82214', 'ru', 'Эль-Гуна – Частная экскурсия по городу с круизом по лагуне и смотровой башней
---ЦЭП---
Откройте для себя Эль-Гуну – «Египетскую Венецию» – во время частной экскурсии по городу с круизом по лагуне и посещением смотровой башни. Архитектура, пристань, лагуны и панорама всего за 4 часа, без остановок продаж.
---ЦЭП---
Культура и достопримечательности
---ЦЭП---
Хургада - Красное море - Египет
---ЦЭП---
4 часа
---ЦЭП---
<table class="tour-pricing-table"><thead><tr><th>Участник</th><th>Автомобиль</th><th>Цена на человека</th></tr></thead><tbody><tr><td>2 человека</td><td>Частный лимузин</td><td>50 € на человека</td></tr><tr><td>3 – 4 человека</td><td>Частный микроавтобус</td><td>40 € на человека</td></tr><tr><td>5 - 6 человек</td><td>Частный микроавтобус</td><td>35 € на человека</td></tr><tr><td>7 - 8 человек</td><td>Частный микроавтобус</td><td>30 € на человека</td></tr></tbody></table>
Эль-Гуна – одно из самых элегантных мест на Красном море. Современный город-лагуна восхищает бирюзовыми водными путями, тихими островами, средиземноморской архитектурой и непринужденной атмосферой, напоминающей европейские портовые города.





С нашей частной экскурсией по городу Эль-Гуна вы познакомитесь с городом совершенно индивидуально: без остановок продаж, без больших групп, но с личной поддержкой и опытным немецкоязычным гидом. Тур сочетает в себе идиллический круиз по лагуне, осмотр культурных достопримечательностей и посещение знаменитой смотровой башни, откуда открывается один из лучших видов во всей Эль-Гуне.
---ЦЭП---
• Частная экскурсия по городу с немецкоязычным гидом
---РАЗДЕЛЕНИЕ---
• Идиллическое путешествие по лагуне Эль-Гуны
---РАЗДЕЛЕНИЕ---
• Посетите смотровую башню, откуда открывается панорамный вид.
---РАЗДЕЛЕНИЕ---
• Центр города, мечеть, Коптская церковь и Александринская библиотека.
---РАЗДЕЛЕНИЕ---
• Прогулка по пристани Абу-Тиг.
---РАЗДЕЛЕНИЕ---
• Никаких остановок продаж
---РАЗДЕЛЕНИЕ---
• Идеально подходит для пар, семей и любителей фотографии.
---ЦЭП---
Частные трансферы на автомобиле с кондиционером
---РАЗДЕЛЕНИЕ---
Круиз по лагуне в Эль-Гуне
---РАЗДЕЛЕНИЕ---
Немецкоговорящий гид
---РАЗДЕЛЕНИЕ---
Безалкогольные напитки в машине
---РАЗДЕЛЕНИЕ---
Входные билеты согласно программе
---ЦЭП---
Личные расходы
---РАЗДЕЛЕНИЕ---
Напитки в кафе или ресторанах
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из залива Макади и Сахл Хашиша: 5 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из Эль-Гуны, Сафаги и Сома-Бэй: 10 евро на человека.
---РАЗДЕЛЕНИЕ---
Гид на иностранном языке (английский, русский или французский): дополнительная плата 10 евро на человека.', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Fahrzeug</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Private Limousine</td><td>50 € p.P.</td></tr><tr><td>3 – 4 Personen</td><td>Privater Minibus</td><td>40 € p.P.</td></tr><tr><td>5 – 6 Personen</td><td>Privater Minibus</td><td>35 € p.P.</td></tr><tr><td>7 – 8 Personen</td><td>Privater Minibus</td><td>30 € p.P.</td></tr></tbody></table>
El Gouna ist einer der elegantesten Orte am Roten Meer. Die moderne Lagunenstadt begeistert mit türkisblauen Wasserwegen, ruhigen Inseln, mediterraner Architektur und einer entspannten Atmosphäre, die an europäische Hafenstädte erinnert.





Mit unserer privaten El Gouna Stadtrundfahrt erleben Sie die Stadt ganz individuell: ohne Verkaufsstopps, ohne große Gruppen, dafür mit persönlicher Betreuung und einem erfahrenen deutschsprachigen Guide. Die Tour kombiniert eine idyllische Lagunenfahrt, kulturelle Sehenswürdigkeiten und einen Besuch des berühmten Aussichtsturms, von dem aus Sie einen der besten Ausblicke in ganz El Gouna genießen.', 'Entdecken Sie El Gouna – das „Venedig Ägyptens“ – auf einer privaten Stadtrundfahrt mit Lagunenfahrt und Besuch des Aussichtsturms. Architektur, Yachthafen, Lagunen und Panorama in nur ca. 4 Stunden, ohne Verkaufsstopps.', 'Kultur & Sightseeing', '["• Private Stadtrundfahrt mit deutschsprachigem Guide","• Idyllische Lagunenfahrt durch El Gouna","• Besuch des Aussichtsturms für Panoramablicke","• Downtown, Moschee, koptische Kirche & Bibliotheca Alexandrina","• Flanieren an der Abu Tig Marina","• Keine Verkaufsstopps","• Perfekt für Paare, Familien und Fotoliebhaber"]'::jsonb, '["Private Transfers im klimatisierten Fahrzeug","Lagunenfahrt in El Gouna","Deutschsprachiger Reiseleiter","Softgetränke im Auto","Eintrittsgelder laut Programm"]'::jsonb, '["Persönliche Ausgaben","Getränke in Cafés oder Restaurants","Transferzuschlag ab Makadi Bay & Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga & Soma Bay: 10 € pro Person","Fremdsprachiger Reiseleiter (Englisch, Russisch oder Französisch): Aufpreis 10 € pro Person"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '4h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '77f34e21-9d9d-4be6-90b3-8148b2d82214', 'ar', 'الجونة - جولة خاصة في المدينة مع رحلة بحرية في البحيرة وبرج المراقبة
--- تسيب ---
اكتشف الجونة - "فينيسيا مصر" - في جولة خاصة بالمدينة مع رحلة بحرية في البحيرة وزيارة برج المراقبة. الهندسة المعمارية والمارينا والبحيرات والبانوراما في حوالي 4 ساعات فقط، دون توقف المبيعات.
--- تسيب ---
الثقافة ومشاهدة المعالم السياحية
--- تسيب ---
الغردقة - البحر الأحمر - مصر
--- تسيب ---
4 ساعات
--- تسيب ---
<table class="tour-pricing-table"><thead><tr><th>المشارك</th><th>المركبة</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخصين</td><td>سيارة ليموزين خاصة</td><td>50 يورو للشخص الواحد</td></tr><tr><td>3 - 4 أشخاص</td><td>خاص حافلة صغيرة</td><td>40 يورو للشخص الواحد</td></tr><tr><td>5 - 6 أشخاص</td><td>حافلة صغيرة خاصة</td><td>35 يورو للشخص الواحد</td></tr><tr><td>7 - 8 أشخاص</td><td>حافلة صغيرة خاصة</td><td>30 يورو للشخص الواحد</td></tr></tbody></table>
الجونة هي واحدة من الأماكن الأكثر أناقة على البحر الأحمر. تتميز المدينة الشاطئية الحديثة بالممرات المائية الفيروزية والجزر الهادئة والهندسة المعمارية المتوسطية والأجواء المريحة التي تذكرنا بالمدن الساحلية الأوروبية.





من خلال جولتنا الخاصة في مدينة الجونة، ستختبر المدينة بطريقة فردية تمامًا: بدون توقف مبيعات، وبدون مجموعات كبيرة، ولكن مع دعم شخصي ودليل ذو خبرة يتحدث الألمانية. تجمع الجولة بين رحلة بحرية مثالية في البحيرة ومشاهدة المعالم الثقافية وزيارة برج المراقبة الشهير للحصول على واحدة من أفضل المناظر في الجونة بأكملها.
--- تسيب ---
• جولة خاصة في المدينة مع مرشد ناطق باللغة الألمانية
---تقسيم---
• رحلة مثالية إلى البحيرة عبر الجونة
---تقسيم---
• زيارة برج المراقبة للاستمتاع بالمناظر البانورامية
---تقسيم---
• وسط البلد، المسجد، الكنيسة القبطية، مكتبة الإسكندرية
---تقسيم---
• التنزه في مارينا أبو تيج
---تقسيم---
• لا توقف المبيعات
---تقسيم---
• مثالي للأزواج والعائلات ومحبي التصوير الفوتوغرافي
--- تسيب ---
- الانتقالات الخاصة بمركبات مكيفة
---تقسيم---
رحلة بحرية في البحيرة الجونة
---تقسيم---
مرشد سياحي يتحدث الألمانية
---تقسيم---
المشروبات الغازية في السيارة
---تقسيم---
رسوم الدخول حسب البرنامج
--- تسيب ---
النفقات الشخصية
---تقسيم---
المشروبات في المقاهي أو المطاعم
---تقسيم---
تكلفة النقل الإضافية من خليج مكادي وسهل حشيش: 5 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية من الجونة وسفاجا وخليج سوما: 10 يورو للشخص الواحد
---تقسيم---
مرشد سياحي بلغة أجنبية (الإنجليزية أو الروسية أو الفرنسية): رسوم إضافية 10 يورو للشخص الواحد', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Fahrzeug</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Private Limousine</td><td>50 € p.P.</td></tr><tr><td>3 – 4 Personen</td><td>Privater Minibus</td><td>40 € p.P.</td></tr><tr><td>5 – 6 Personen</td><td>Privater Minibus</td><td>35 € p.P.</td></tr><tr><td>7 – 8 Personen</td><td>Privater Minibus</td><td>30 € p.P.</td></tr></tbody></table>
El Gouna ist einer der elegantesten Orte am Roten Meer. Die moderne Lagunenstadt begeistert mit türkisblauen Wasserwegen, ruhigen Inseln, mediterraner Architektur und einer entspannten Atmosphäre, die an europäische Hafenstädte erinnert.





Mit unserer privaten El Gouna Stadtrundfahrt erleben Sie die Stadt ganz individuell: ohne Verkaufsstopps, ohne große Gruppen, dafür mit persönlicher Betreuung und einem erfahrenen deutschsprachigen Guide. Die Tour kombiniert eine idyllische Lagunenfahrt, kulturelle Sehenswürdigkeiten und einen Besuch des berühmten Aussichtsturms, von dem aus Sie einen der besten Ausblicke in ganz El Gouna genießen.', 'Entdecken Sie El Gouna – das „Venedig Ägyptens“ – auf einer privaten Stadtrundfahrt mit Lagunenfahrt und Besuch des Aussichtsturms. Architektur, Yachthafen, Lagunen und Panorama in nur ca. 4 Stunden, ohne Verkaufsstopps.', 'Kultur & Sightseeing', '["• Private Stadtrundfahrt mit deutschsprachigem Guide","• Idyllische Lagunenfahrt durch El Gouna","• Besuch des Aussichtsturms für Panoramablicke","• Downtown, Moschee, koptische Kirche & Bibliotheca Alexandrina","• Flanieren an der Abu Tig Marina","• Keine Verkaufsstopps","• Perfekt für Paare, Familien und Fotoliebhaber"]'::jsonb, '["Private Transfers im klimatisierten Fahrzeug","Lagunenfahrt in El Gouna","Deutschsprachiger Reiseleiter","Softgetränke im Auto","Eintrittsgelder laut Programm"]'::jsonb, '["Persönliche Ausgaben","Getränke in Cafés oder Restaurants","Transferzuschlag ab Makadi Bay & Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga & Soma Bay: 10 € pro Person","Fremdsprachiger Reiseleiter (Englisch, Russisch oder Französisch): Aufpreis 10 € pro Person"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '4h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', 'c2db0455-a5c7-47f9-8925-2ce6dcc3434a', 'en', 'Night City Tour of Hurghada – Private Tour', '<table class="tour-pricing-table"><thead><tr><th>Participant</th><th>Vehicle</th><th>Price per person</th></tr></thead><tbody><tr><td>2 people</td><td>Private limousine</td><td>30 € per person</td></tr><tr><td>3 – 4 people</td><td>Private minibus</td><td>25 € per person</td></tr><tr><td>5 - 6 people</td><td>Private minibus</td><td>20 € per person</td></tr><tr><td>7 - 8 people</td><td>Private minibus</td><td>15 € per person</td></tr></tbody></table>
Experience Hurghada in its most beautiful light: at night. As the heat of the day fades, the city develops its unique evening rhythm. The illuminated marina, traditional markets, the Grand Mosque and a visit to an Egyptian café make this exclusive tour an intensive insight into the real Hurghada.





With Hurghada Travel Planner you can enjoy a private, German-speaking guided city tour that combines authentic impressions and comfortable comfort.





Why a nighttime city tour of Hurghada?





When the sun sets and the sky takes on reddish nuances, Hurghada shows itself at its most atmospheric. The marina lights up, the markets come alive and the city breathes a sigh of relief. At exactly this time we accompany you through the mysterious evening atmosphere - without any crowds, relaxed and personal.', 'Experience Hurghada at night - with a sparkling marina, authentic markets and oriental flair. This approximately 3-hour private tour shows you the city from a completely new perspective.', 'Culture & sightseeing', '["Hurghada marina","The marina is a modern hotspot and is one of the most beautiful port facilities on the Red Sea. Numerous yachts depart from here for diving and island trips. In the evening, the lights from the boats transform the water into a brilliant play of colors. An ideal place for photos and a first impression of Hurghada''s vibrant nightlife.","Traditional fruit and vegetable market","The real Hurghada begins here. The market is a meeting place for locals who buy fresh goods every day. Visitors experience authentic bargaining, real sounds and smells - a lively slice of everyday Egyptian life, far away from the tourist zones.","Fish market and Great Mosque","We walk past the fish market and reach the Great Mosque, which shines in warm lights in the evening. It offers impressive photo opportunities and a look at the city''s religious architecture.","Typical Egyptian café experience","Finally, enjoy a traditional mint tea or Arabic coffee at a local cafe. A quiet moment that rounds off the tour perfectly."]'::jsonb, '["Transfer in modern, air-conditioned vehicles","German speaking tour guide","Entrance fees for all mentioned attractions","Insurance and taxes"]'::jsonb, '["Personal expenses","Transfer surcharge from Makadi Bay & Sahl Hasheesh: €5 per person","Transfer surcharge from El Gouna, Safaga & Soma Bay: €10 per person","Foreign language tour guide (English, Russian or French): additional charge €10 per person"]'::jsonb, 'Hurghada - Red Sea - Egypt', '3h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', 'c2db0455-a5c7-47f9-8925-2ce6dcc3434a', 'fr', 'Visite nocturne de la ville d''Hurghada - Visite privée', '<table class="tour-pricing-table"><thead><tr><th>Participant</th><th>Véhicule</th><th>Prix par personne</th></tr></thead><tbody><tr><td>2 personnes</td><td>Limousine privée</td><td>30 € par personne</t></tr><tr><td>3 – 4 personnes</td><td>Privé minibus</td><td>25 € par personne</td></tr><tr><td>5 - 6 personnes</td><td>Minibus privé</td><td>20 € par personne</td></tr><tr><td>7 - 8 personnes</td><td>Minibus privé</td><td>15 € par personne</td></tr></tbody></table>
Découvrez Hurghada sous sa plus belle lumière : la nuit. À mesure que la chaleur du jour s''estompe, la ville développe son rythme nocturne unique. La marina illuminée, les marchés traditionnels, la Grande Mosquée et la visite d''un café égyptien font de cette visite exclusive un aperçu intensif de la véritable Hurghada.





Avec Hurghada Travel Planner, vous pouvez profiter d''une visite guidée privée en langue allemande qui allie impressions authentiques et confort confortable.





Pourquoi une visite nocturne de Hurghada ?





Lorsque le soleil se couche et que le ciel prend des nuances rougeâtres, Hurghada se montre la plus atmosphérique. Le port de plaisance s''illumine, les marchés s''animent et la ville pousse un soupir de soulagement. C''est exactement à ce moment-là que nous vous accompagnons dans l''atmosphère mystérieuse du soir - sans foule, détendue et personnelle.', 'Découvrez Hurghada la nuit - avec une marina étincelante, des marchés authentiques et une touche orientale. Cette visite privée d''environ 3 heures vous montre la ville sous un tout nouveau point de vue.', 'Culture et tourisme', '["Port de plaisance d''Hurghada","La marina est un haut lieu moderne et constitue l''une des plus belles installations portuaires de la mer Rouge. De nombreux yachts partent d''ici pour la plongée et les excursions sur l''île. Le soir, les lumières des bateaux transforment l''eau en un jeu de couleurs éclatant. Un endroit idéal pour prendre des photos et avoir une première impression de la vie nocturne animée d''Hurghada.","Marché traditionnel de fruits et légumes","La vraie Hurghada commence ici. Le marché est un lieu de rencontre pour les locaux qui achètent chaque jour des produits frais. Les visiteurs font l''expérience de marchandages authentiques, de vrais sons et d''odeurs - une tranche animée de la vie quotidienne égyptienne, loin des zones touristiques.","Marché aux poissons et Grande Mosquée","Nous passons devant le marché aux poissons et atteignons la Grande Mosquée, qui brille de lumières chaudes le soir. Il offre des opportunités de photos impressionnantes et un aperçu de l''architecture religieuse de la ville.","Expérience typique d''un café égyptien","Enfin, dégustez un thé à la menthe traditionnel ou un café arabe dans un café local. Un moment de calme qui complète parfaitement la visite."]'::jsonb, '["Transfert dans des véhicules modernes et climatisés","Guide touristique germanophone","Frais d''entrée pour toutes les attractions mentionnées","Assurances et taxes"]'::jsonb, '["Dépenses personnelles","Supplément de transfert depuis la baie de Makadi et Sahl Hasheesh : 5 € par personne","Supplément de transfert depuis El Gouna, Safaga et Soma Bay : 10 € par personne","Guide touristique en langue étrangère (anglais, russe ou français) : supplément 10 € par personne"]'::jsonb, 'Hurghada - Mer Rouge - Egypte', '3h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', 'c2db0455-a5c7-47f9-8925-2ce6dcc3434a', 'hu', 'Éjszakai városnézés Hurghadában – privát túra', '<table class="tour-pricing-table"><thead><tr><th>Részvevő</th><th>Gépjármű</th><th>Ár személyenként</th></tr></thead><tbody><tr><td>2 fő</td><td>Privát limuzin</td><td>30 € személyenként</td></tr><dtrd> mikrobusz</td><td>25 €/fő</td></tr><tr><td>5-6 fő</td><td>Privát mikrobusz</td><td>20 €/fő</td></tr><tr><td>7-8 fő</td><td>Privát kisbusz</td><td>15 €/tr/fő/td>
Tapasztalja meg Hurghadát a legszebb fényében: éjszaka. Ahogy a nap melege enyhül, a város kialakítja egyedi esti ritmusát. A kivilágított kikötő, a hagyományos piacok, a Nagymecset és egy egyiptomi kávézó látogatása teszi ezt az exkluzív túrát intenzív betekintést az igazi Hurghadába.





A Hurghada Travel Planner segítségével privát, németül beszélő vezetett városnézésen vehet részt, amely az autentikus benyomásokat és a kényelmes kényelmet ötvözi.





Miért érdemes éjszakai városnézést Hurghadában?





Amikor a nap lenyugszik, és az ég vöröses árnyalatokat kap, Hurghada a leghangulatosabb. A kikötő kivilágosodik, a piacok életre kelnek, és a város megkönnyebbülten fellélegzik. Pontosan ebben az időben kísérünk végig a titokzatos esti hangulaton - tömeg nélkül, nyugodtan és személyesen.', 'Tapasztalja meg Hurghadát éjszaka – pezsgő kikötővel, autentikus piacokkal és keleti hangulattal. Ez a körülbelül 3 órás privát túra teljesen új szemszögből mutatja be a várost.', 'Kultúra és városnézés', '["Hurghada kikötője","A kikötő egy modern hotspot, és a Vörös-tenger egyik legszebb kikötői létesítménye. Számos jacht indul innen búvárkodásra és szigeti kirándulásokra. Este a hajók fényei ragyogó színjátékká változtatják a vizet. Ideális hely a fotózáshoz és az első benyomáshoz Hurghada nyüzsgő éjszakai életéről.","Hagyományos zöldség-gyümölcs piac","Az igazi Hurghada itt kezdődik. A piac a helyiek találkozóhelye, akik minden nap friss árut vásárolnak. A látogatók autentikus alkudozást, valódi hangokat és szagokat tapasztalnak – a mindennapi egyiptomi élet élénk szeletét, távol a turisztikai övezetektől.","Halpiac és Nagymecset","Elsétálunk a halpiac mellett, és elérjük a Nagymecsetet, amely esténként meleg fényekben ragyog. Lenyűgöző fotózási lehetőségeket és a város vallási építészetét kínálja.","Tipikus egyiptomi kávézói élmény","Végül igyon egy hagyományos mentateát vagy arab kávét egy helyi kávézóban. Csendes pillanat, amely tökéletesen lezárja a túrát."]'::jsonb, '["Transzfer modern, légkondicionált járművekkel","németül beszélő idegenvezető","Belépődíjak az összes említett látnivalóra","Biztosítás és adók"]'::jsonb, '["Személyi kiadások","Transzfer felára a Makadi Bay & Sahl Hasheesh területéről: 5 euró személyenként","Transzfer felára El Gouna, Safaga és Soma Bay területéről: 10 € személyenként","Idegen nyelvű túravezető (angol, orosz vagy francia): felár 10 € személyenként"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '3 óra', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', 'c2db0455-a5c7-47f9-8925-2ce6dcc3434a', 'ru', 'Ночная экскурсия по Хургаде – Частный тур
---ЦЭП---
Откройте для себя ночную Хургаду с сверкающей пристанью, аутентичными рынками и восточным колоритом. Эта примерно трехчасовая частная экскурсия покажет вам город с совершенно новой точки зрения.
---ЦЭП---
Культура и достопримечательности
---ЦЭП---
Хургада - Красное море - Египет
---ЦЭП---
3 часа
---ЦЭП---
<table class="tour-pricing-table"><thead><tr><th>Участник</th><th>Автомобиль</th><th>Цена на человека</th></tr></thead><tbody><tr><td>2 человека</td><td>Частный лимузин</td><td>30 € на человека</td></tr><tr><td>3 – 4 человека</td><td>Частный микроавтобус</td><td>25 € на человека</td></tr><tr><td>5 - 6 человек</td><td>Частный микроавтобус</td><td>20 € на человека</td></tr><tr><td>7 - 8 человек</td><td>Частный микроавтобус</td><td>15 € на человека</td></tr></tbody></table>
Откройте для себя Хургаду в ее самом прекрасном свете: ночью. По мере того как дневная жара утихает, город обретает свой уникальный вечерний ритм. Освещенная пристань, традиционные рынки, Большая мечеть и посещение египетского кафе делают этот эксклюзивный тур насыщенным знакомством с настоящей Хургадой.





С Hurghada Travel Planner вы можете насладиться частной экскурсией по городу с немецкоязычным гидом, которая сочетает в себе подлинные впечатления и комфорт.





Почему ночная экскурсия по Хургаде?





Когда солнце садится и небо приобретает красноватые оттенки, Хургада предстает наиболее атмосферной. Пристань загорается, рынки оживают, и город вздыхает с облегчением. Именно в это время мы сопровождаем вас в таинственной вечерней атмосфере – без толпы, непринужденно и индивидуально.
---ЦЭП---
Хургада Марина
---РАЗДЕЛЕНИЕ---
Пристань является современной точкой доступа и одним из самых красивых портовых сооружений на Красном море. Отсюда отправляются многочисленные яхты для дайвинга и поездок по островам. Вечером огни лодок превращают воду в яркую игру цветов. Идеальное место для фотографий и первых впечатлений от бурной ночной жизни Хургады.
---РАЗДЕЛЕНИЕ---
Традиционный рынок фруктов и овощей
---РАЗДЕЛЕНИЕ---
Здесь начинается настоящая Хургада. Рынок — место встречи местных жителей, которые каждый день покупают свежие товары. Посетители ощущают аутентичный торг, настоящие звуки и запахи – живой кусочек повседневной египетской жизни вдали от туристических зон.
---РАЗДЕЛЕНИЕ---
Рыбный рынок и Большая мечеть
---РАЗДЕЛЕНИЕ---
Проходим мимо рыбного рынка и доходим до Великой мечети, которая вечером сияет теплыми огнями. Он предлагает впечатляющие возможности для фотографирования и знакомства с религиозной архитектурой города.
---РАЗДЕЛЕНИЕ---
Типичный опыт египетского кафе
---РАЗДЕЛЕНИЕ---
Наконец, насладитесь традиционным мятным чаем или арабским кофе в местном кафе. Тихий момент, который идеально завершает тур.
---ЦЭП---
Трансфер на современных автомобилях с кондиционерами.
---РАЗДЕЛЕНИЕ---
Немецкоговорящий гид
---РАЗДЕЛЕНИЕ---
Входные билеты на все упомянутые достопримечательности
---РАЗДЕЛЕНИЕ---
Страховка и налоги
---ЦЭП---
Личные расходы
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из залива Макади и Сахл Хашиша: 5 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из Эль-Гуны, Сафаги и Сома-Бэй: 10 евро на человека.
---РАЗДЕЛЕНИЕ---
Гид на иностранном языке (английский, русский или французский): дополнительная плата 10 евро на человека.', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Fahrzeug</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Private Limousine</td><td>30 € p.P.</td></tr><tr><td>3 – 4 Personen</td><td>Privater Minibus</td><td>25 € p.P.</td></tr><tr><td>5 – 6 Personen</td><td>Privater Minibus</td><td>20 € p.P.</td></tr><tr><td>7 – 8 Personen</td><td>Privater Minibus</td><td>15 € p.P.</td></tr></tbody></table>
Erleben Sie Hurghada in seinem schönsten Licht: bei Nacht. Während die Hitze des Tages weicht, entfaltet die Stadt ihren einzigartigen Abendrhythmus. Die beleuchtete Marina, traditionelle Märkte, die Große Moschee und ein Besuch in einem ägyptischen Café machen diese exklusive Tour zu einem intensiven Einblick in das echte Hurghada.





Mit Hurghada Reiseplaner genießen Sie eine private, deutschsprachig geführte Stadtrundfahrt, die authentische Eindrücke und bequemen Komfort kombiniert.





Warum eine nächtliche Stadtführung durch Hurghada?





Wenn die Sonne untergeht und der Himmel in rötliche Nuancen taucht, zeigt sich Hurghada von seiner stimmungsvollsten Seite. Die Marina leuchtet, die Märkte werden lebendig und die Stadt atmet auf. Genau zu dieser Zeit begleiten wir Sie durch die geheimnisvolle Abendatmosphäre – ganz ohne Gedränge, entspannt und persönlich.', 'Erleben Sie Hurghada bei Nacht – mit funkelnder Marina, authentischen Märkten und orientalischem Flair. Diese ca. 3-stündige Privattour zeigt Ihnen die Stadt aus einer völlig neuen Perspektive.', 'Kultur & Sightseeing', '["Marina von Hurghada","Die Marina ist ein moderner Hotspot und zählt zu den schönsten Hafenanlagen am Roten Meer. Zahlreiche Yachten starten von hier zu Tauch- und Inseltrips. Abends verwandeln die Lichter der Boote das Wasser in ein leuchtendes Farbspiel. Ein idealer Ort für Fotos und einen ersten Eindruck vom pulsierenden Nachtleben Hurghadas.","Traditioneller Obst- und Gemüsemarkt","Hier beginnt das echte Hurghada. Der Markt ist Treffpunkt der Einheimischen, die täglich frische Waren einkaufen. Besucher erleben authentisches Feilschen, echte Geräusche und Gerüche – ein lebendiger Ausschnitt des ägyptischen Alltags, fernab der Touristenzonen.","Fischmarkt und Große Moschee","Wir spazieren am Fischmarkt vorbei und erreichen die Große Moschee, die am Abend in warmen Lichtern erstrahlt. Sie bietet beeindruckende Fotomotive und einen Blick auf die religiöse Architektur der Stadt.","Typisch ägyptisches Café-Erlebnis","Zum Abschluss genießen Sie einen traditionellen Pfefferminztee oder arabischen Kaffee in einem lokalen Café. Ein ruhiger Moment, der die Tour perfekt abrundet."]'::jsonb, '["Transfer in modernen, klimatisierten Fahrzeugen","Deutschsprachiger Reiseleiter","Eintrittsgebühren für aller genannten Sehenswürdigkeiten","Versicherung und Steuern"]'::jsonb, '["Persönliche Ausgaben","Transferzuschlag ab Makadi Bay & Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga & Soma Bay: 10 € pro Person","Fremdsprachiger Reiseleiter (Englisch, Russisch oder Französisch): Aufpreis 10 € pro Person"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '3h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', 'c2db0455-a5c7-47f9-8925-2ce6dcc3434a', 'ar', 'جولة ليلية في مدينة الغردقة – جولة خاصة
--- تسيب ---
استمتع بتجربة الغردقة ليلاً - مع المارينا المتلألئة والأسواق الأصيلة والذوق الشرقي. تُظهر لك هذه الجولة الخاصة التي تستغرق حوالي 3 ساعات المدينة من منظور جديد تمامًا.
--- تسيب ---
الثقافة ومشاهدة المعالم السياحية
--- تسيب ---
الغردقة - البحر الأحمر - مصر
--- تسيب ---
3 ساعات
--- تسيب ---
<table class="tour-pricing-table"><thead><tr><th>المشارك</th><th>المركبة</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخصين</td><td>سيارة ليموزين خاصة</td><td>30 يورو للشخص الواحد</td></tr><tr><td>3 - 4 أشخاص</td><td>خاص حافلة صغيرة</td><td>25 يورو للشخص الواحد</td></tr><tr><td>5 - 6 أشخاص</td><td>حافلة صغيرة خاصة</td><td>20 يورو للشخص الواحد</td></tr><tr><td>7 - 8 أشخاص</td><td>حافلة صغيرة خاصة</td><td>15 يورو للشخص الواحد</td></tr></tbody></table>
استمتع بتجربة الغردقة في أجمل نورها: في الليل. مع تلاشي حرارة النهار، تطور المدينة إيقاعها المسائي الفريد. المارينا المضيئة والأسواق التقليدية والمسجد الكبير وزيارة مقهى مصري تجعل من هذه الجولة الحصرية نظرة مكثفة على الغردقة الحقيقية.





مع Hurghada Travel Planner، يمكنك الاستمتاع بجولة خاصة في المدينة بصحبة مرشد ناطق باللغة الألمانية والتي تجمع بين الانطباعات الأصيلة والراحة المريحة.





لماذا جولة ليلية في مدينة الغردقة؟





عندما تغرب الشمس وتتحول السماء إلى اللون الأحمر، تظهر الغردقة في أبهى صورها. يضيء المارينا، وتنبض الأسواق بالحياة، وتتنفس المدينة الصعداء. في هذا الوقت بالضبط، نرافقك خلال أجواء المساء الغامضة - بدون أي حشود، مريحة وشخصية.
--- تسيب ---
مارينا الغردقة
---تقسيم---
يعد المارينا نقطة اتصال حديثة وأحد أجمل مرافق الموانئ على البحر الأحمر. تنطلق من هنا العديد من اليخوت للغوص ورحلات الجزيرة. وفي المساء، تحول الأضواء المنبعثة من القوارب الماء إلى تلاعب رائع بالألوان. مكان مثالي لالتقاط الصور والانطباع الأول عن الحياة الليلية النابضة بالحياة في الغردقة.
---تقسيم---
سوق الفواكه والخضروات التقليدي
---تقسيم---
الغردقة الحقيقية تبدأ هنا. يعد السوق مكانًا للقاء السكان المحليين الذين يشترون السلع الطازجة كل يوم. يختبر الزوار المساومة الأصيلة والأصوات والروائح الحقيقية - وهي شريحة حيوية من الحياة المصرية اليومية، بعيدًا عن المناطق السياحية.
---تقسيم---
سوق السمك والمسجد الكبير
---تقسيم---
نسير بجوار سوق السمك ونصل إلى الجامع الكبير الذي يتلألأ بالأضواء الدافئة في المساء. إنه يوفر فرصًا رائعة لالتقاط الصور وإلقاء نظرة على الهندسة المعمارية الدينية للمدينة.
---تقسيم---
تجربة مقهى مصرية نموذجية
---تقسيم---
وأخيرًا، استمتع بالشاي التقليدي بالنعناع أو القهوة العربية في مقهى محلي. لحظة هادئة تختتم الجولة بشكل مثالي.
--- تسيب ---
الإنتقالات بسيارات حديثة ومكيفة
---تقسيم---
مرشد سياحي يتحدث الألمانية
---تقسيم---
رسوم الدخول لجميع المعالم السياحية المذكورة
---تقسيم---
التأمين والضرائب
--- تسيب ---
النفقات الشخصية
---تقسيم---
تكلفة النقل الإضافية من خليج مكادي وسهل حشيش: 5 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية من الجونة وسفاجا وخليج سوما: 10 يورو للشخص الواحد
---تقسيم---
مرشد سياحي بلغة أجنبية (الإنجليزية أو الروسية أو الفرنسية): رسوم إضافية 10 يورو للشخص الواحد', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Fahrzeug</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Private Limousine</td><td>30 € p.P.</td></tr><tr><td>3 – 4 Personen</td><td>Privater Minibus</td><td>25 € p.P.</td></tr><tr><td>5 – 6 Personen</td><td>Privater Minibus</td><td>20 € p.P.</td></tr><tr><td>7 – 8 Personen</td><td>Privater Minibus</td><td>15 € p.P.</td></tr></tbody></table>
Erleben Sie Hurghada in seinem schönsten Licht: bei Nacht. Während die Hitze des Tages weicht, entfaltet die Stadt ihren einzigartigen Abendrhythmus. Die beleuchtete Marina, traditionelle Märkte, die Große Moschee und ein Besuch in einem ägyptischen Café machen diese exklusive Tour zu einem intensiven Einblick in das echte Hurghada.





Mit Hurghada Reiseplaner genießen Sie eine private, deutschsprachig geführte Stadtrundfahrt, die authentische Eindrücke und bequemen Komfort kombiniert.





Warum eine nächtliche Stadtführung durch Hurghada?





Wenn die Sonne untergeht und der Himmel in rötliche Nuancen taucht, zeigt sich Hurghada von seiner stimmungsvollsten Seite. Die Marina leuchtet, die Märkte werden lebendig und die Stadt atmet auf. Genau zu dieser Zeit begleiten wir Sie durch die geheimnisvolle Abendatmosphäre – ganz ohne Gedränge, entspannt und persönlich.', 'Erleben Sie Hurghada bei Nacht – mit funkelnder Marina, authentischen Märkten und orientalischem Flair. Diese ca. 3-stündige Privattour zeigt Ihnen die Stadt aus einer völlig neuen Perspektive.', 'Kultur & Sightseeing', '["Marina von Hurghada","Die Marina ist ein moderner Hotspot und zählt zu den schönsten Hafenanlagen am Roten Meer. Zahlreiche Yachten starten von hier zu Tauch- und Inseltrips. Abends verwandeln die Lichter der Boote das Wasser in ein leuchtendes Farbspiel. Ein idealer Ort für Fotos und einen ersten Eindruck vom pulsierenden Nachtleben Hurghadas.","Traditioneller Obst- und Gemüsemarkt","Hier beginnt das echte Hurghada. Der Markt ist Treffpunkt der Einheimischen, die täglich frische Waren einkaufen. Besucher erleben authentisches Feilschen, echte Geräusche und Gerüche – ein lebendiger Ausschnitt des ägyptischen Alltags, fernab der Touristenzonen.","Fischmarkt und Große Moschee","Wir spazieren am Fischmarkt vorbei und erreichen die Große Moschee, die am Abend in warmen Lichtern erstrahlt. Sie bietet beeindruckende Fotomotive und einen Blick auf die religiöse Architektur der Stadt.","Typisch ägyptisches Café-Erlebnis","Zum Abschluss genießen Sie einen traditionellen Pfefferminztee oder arabischen Kaffee in einem lokalen Café. Ein ruhiger Moment, der die Tour perfekt abrundet."]'::jsonb, '["Transfer in modernen, klimatisierten Fahrzeugen","Deutschsprachiger Reiseleiter","Eintrittsgebühren für aller genannten Sehenswürdigkeiten","Versicherung und Steuern"]'::jsonb, '["Persönliche Ausgaben","Transferzuschlag ab Makadi Bay & Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga & Soma Bay: 10 € pro Person","Fremdsprachiger Reiseleiter (Englisch, Russisch oder Französisch): Aufpreis 10 € pro Person"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '3h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '7cb0c635-f7a7-4d98-a9b0-cde4997ca8ae', 'en', 'Private day trip to Dendera & Abydos from Hurghada', '<table class="tour-pricing-table"><thead><tr><th>Participant</th><th>Vehicle</th><th>Price per person</th></tr></thead><tbody><tr><td>2 people</td><td>Private limousine</td><td>140 € per person</td></tr><tr><td>3 – 4 people</td><td>Private Minibus</td><td>130 € per person</td></tr><tr><td>5 - 6 people</td><td>Private minibus</td><td>120 € per person</td></tr><tr><td>7 - 8 people</td><td>Private minibus</td><td>110 € per person</td></tr></tbody></table>
An unforgettable day in the heart of ancient Egypt





Experience the magic of Ancient Egypt on an exclusive private tour from Hurghada Travel Planner.


This private day trip to Dendera and Abydos takes you to two of Egypt''s most impressive temple sites - places where history, myth and beauty are immortalized in stone.





Accompanied by an experienced German-speaking Egyptologist, you travel along the Nile Valley and discover sanctuaries that only a few visitors otherwise see.





🌸 Temple of Dendera – The realm of the goddess Hathor





Your first stop is the beautiful Hathor Temple in Dendera - a masterpiece of Egyptian art and symbol of love, music and joy.





Here you can expect:





💠 Colorful colonnaded halls, whose original colors have been preserved to this day





💠 The Mamisi (birthhouse of the gods) – symbol of creation and life





💠 The sanatorium where divine healings took place





💠 The Sacred Lake, a place of ritual purification





💠 The only surviving depiction of the legendary Cleopatra VII.





Your guide will explain the mysterious astronomical reliefs on the ceiling - a testament to ancient knowledge about the stars.





✨ Dendera is one of the most colorful temples in Egypt - a place that makes history shine.





🌙 Temple of Abydos – The Sanctuary of Osiris





After a scenic drive along the Nile Valley, you''ll reach Abydos, one of the holiest cities of ancient Egypt.


Here people worshiped the god Osiris, the ruler of death and rebirth.





You visit the temple of Pharaoh Seti I, which is considered one of the most artistically beautiful temples in Egypt.





Highlights of Abydos:





🔹 the famous king list of Abydos with the names of important pharaohs





🔹 Precisely crafted hieroglyphs and reliefs in almost perfect condition





🔹 Scenes from the Horus myth – the eternal battle between good and evil





🔹 Reliefs of Ramses II with his son sacrificing and hunting





🕊️ Abydos is not an ordinary temple - it is a spiritual place where the soul of Egypt lives on.





💼 Travel tips for your trip





✔️ Copy of passport or ID card required (approval from authorities)


✔️ Order the breakfast package the evening before at the hotel reception


✔️ Wear comfortable shoes and weather-appropriate clothing


✔️ Don’t forget sunscreen, sunglasses and a hat


✔️ Camera or cell phone for unforgettable moments


✔️ Some change for tips and toilets', 'Private day trip from Hurghada to Dendera & Abydos with German-speaking Egyptologist, Hathor Temple, Abydos Temple, lunch and comfortable transfer.', 'Culture & sightseeing', '["Private excursion without group tourism","German-speaking Egyptologist with specialist knowledge","Visit to the Hathor Temple in Dendera","Visit to Abydos Temple with king list","Comfortable transfer in an air-conditioned vehicle","Authentic temple art, reliefs and hieroglyphs"]'::jsonb, '["Professional German-speaking tour guide/Egyptologist","Private transfers in modern, air-conditioned vehicles","Entrance to all attractions mentioned in the program","Lunch at a local restaurant","Soft drinks in the vehicle","All taxes and service fees"]'::jsonb, '["Drinks in the restaurant","Personal Expenses & Tips","Transfer surcharge for guests from Marsa Alam: €50 per person","Transfer surcharge for guests from El Quseir: €35 per person","Transfer surcharge from Makadi Bay & Sahl Hasheesh: €5 per person","Transfer surcharge from El Gouna, Safaga & Soma Bay: €10 per person","Foreign language tour guide (English, Russian or French): additional charge €10 per person"]'::jsonb, 'Hurghada - Red Sea - Egypt', '13h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '7cb0c635-f7a7-4d98-a9b0-cde4997ca8ae', 'fr', 'Excursion privée d''une journée à Dendérah et Abydos depuis Hurghada', '<table class="tour-pricing-table"><thead><tr><th>Participant</th><th>Véhicule</th><th>Prix par personne</th></tr></thead><tbody><tr><td>2 personnes</td><td>Limousine privée</td><td>140 € par personne</td></tr><tr><td>3 – 4 personnes</td><td>Privé Minibus</td><td>130 € par personne</td></tr><tr><td>5 - 6 personnes</td><td>Minibus privé</td><td>120 € par personne</td></tr><tr><td>7 - 8 personnes</td><td>Minibus privé</td><td>110 € par personne</td></tr></tbody></table>
Une journée inoubliable au cœur de l''Egypte ancienne





Découvrez la magie de l''Égypte ancienne lors d''une visite privée exclusive de Hurghada Travel Planner.


Cette excursion privée d''une journée à Dendérah et Abydos vous emmène vers deux des sites de temples les plus impressionnants d''Égypte, des lieux où l''histoire, les mythes et la beauté sont immortalisés dans la pierre.





Accompagné d''un égyptologue germanophone expérimenté, vous parcourez la vallée du Nil et découvrez des sanctuaires que seuls quelques visiteurs voient autrement.





🌸 Temple de Dendérah – Le royaume de la déesse Hathor





Votre premier arrêt est le magnifique temple Hathor à Dendérah - un chef-d''œuvre de l''art égyptien et symbole d''amour, de musique et de joie.





Ici, vous pouvez vous attendre à :





💠 Des salles à colonnades colorées, dont les couleurs d''origine ont été conservées jusqu''à ce jour





💠 Le Mamisi (maison natale des dieux) – symbole de création et de vie





💠 Le sanatorium où avaient lieu les guérisons divines





💠 Le Lac Sacré, lieu de purification rituelle





💠 La seule représentation survivante de la légendaire Cléopâtre VII.





Votre guide vous expliquera les mystérieux reliefs astronomiques au plafond, témoignage d''une connaissance ancienne sur les étoiles.





✨ Dendérah est l''un des temples les plus colorés d''Égypte - un lieu qui fait briller l''histoire.





🌙 Temple d''Abydos – Le sanctuaire d''Osiris





Après une route panoramique le long de la vallée du Nil, vous atteindrez Abydos, l''une des villes les plus saintes de l''Égypte ancienne.


Ici, les gens adoraient le dieu Osiris, le souverain de la mort et de la renaissance.





Vous visitez le temple du pharaon Seti Ier, considéré comme l''un des plus beaux temples artistiques d''Égypte.





Points forts d''Abydos :





🔹 la célèbre liste des rois d''Abydos avec les noms des pharaons importants





🔹 Hiéroglyphes et reliefs travaillés avec précision et dans un état presque parfait





🔹 Scènes du mythe d''Horus – la bataille éternelle entre le bien et le mal





🔹 Reliefs de Ramsès II avec son fils sacrifiant et chassant





🕊️ Abydos n''est pas un temple ordinaire - c''est un lieu spirituel où vit l''âme de l''Égypte.





💼 Conseils de voyage pour votre voyage





✔️ Copie du passeport ou de la carte d''identité requise (approbation des autorités)


✔️ Commandez le forfait petit-déjeuner la veille au soir à la réception de l''hôtel


✔️ Portez des chaussures confortables et des vêtements adaptés aux conditions météorologiques


✔️ N''oubliez pas la crème solaire, les lunettes de soleil et un chapeau


✔️ Appareil photo ou téléphone portable pour des moments inoubliables


✔️ Un peu de monnaie pour les pourboires et les toilettes', 'Excursion privée d''une journée d''Hurghada à Dendérah et Abydos avec un égyptologue germanophone, temple Hathor, temple Abydos, déjeuner et transfert confortable.', 'Culture et tourisme', '["Excursion privée sans tourisme de groupe","Égyptologue germanophone avec des connaissances spécialisées","Visite du temple Hathor à Dendérah","Visite du temple d''Abydos avec la liste des rois","Transfert confortable dans un véhicule climatisé","Art authentique du temple, reliefs et hiéroglyphes"]'::jsonb, '["Guide touristique/égyptologue professionnel germanophone","Transferts privés dans des véhicules modernes et climatisés","Entrée à toutes les attractions mentionnées dans le programme","Déjeuner dans un restaurant local","Boissons gazeuses dans le véhicule","Toutes les taxes et frais de service"]'::jsonb, '["Boissons au restaurant","Dépenses personnelles et pourboires","Supplément de transfert pour les clients de Marsa Alam : 50 € par personne","Supplément de transfert pour les clients d''El Quseir : 35 € par personne","Supplément de transfert depuis la baie de Makadi et Sahl Hasheesh : 5 € par personne","Supplément de transfert depuis El Gouna, Safaga et Soma Bay : 10 € par personne","Guide touristique en langue étrangère (anglais, russe ou français) : supplément 10 € par personne"]'::jsonb, 'Hurghada - Mer Rouge - Egypte', '13h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '7cb0c635-f7a7-4d98-a9b0-cde4997ca8ae', 'hu', 'Egynapos privát kirándulás Denderába és Abydosba Hurghadából', '<table class="tour-pricing-table"><thead><tr><th>Részvevő</th><th>Gépjármű</th><th>Ár személyenként</th></tr></thead><tbody><tr><td>2 fő</td><td>Privát limuzin</td><td>140 € személyenként</td><td>személyenként</td><td>privát Mikrobusz</td><td>130 €/fő</td></tr><tr><td>5-6 fő</td><td>Privát mikrobusz</td><td>120 €/fő</td></tr><tr><td>7-8 fő</td><td>Privát mikrobusz><</td><td>/10 €/tr/fő
Egy felejthetetlen nap az ókori Egyiptom szívében





Tapasztalja meg az ókori Egyiptom varázsát a Hurghada Travel Planner exkluzív privát túráján.


Ez a privát egynapos kirándulás Denderába és Abydosba Egyiptom két leglenyűgözőbb templomába visz – olyan helyekre, ahol a történelem, a mítoszok és a szépség kőben van megörökítve.





Egy tapasztalt németül beszélő egyiptológus kíséretében a Nílus völgyén utazik, és olyan szentélyeket fedez fel, amelyeket egyébként csak néhány látogató lát.





🌸 Dendera temploma – Hathor istennő birodalma





Az első megálló a gyönyörű Hathor-templom Denderában – az egyiptomi művészet remekműve és a szerelem, a zene és az öröm szimbóluma.





Itt számíthatsz:





💠 Színes oszlopsoros termek, melyek eredeti színeit a mai napig megőrizték





💠 A Mamisi (az istenek szülőháza) – a teremtés és az élet szimbóluma





💠 A szanatórium, ahol isteni gyógyulások zajlottak





💠 A Szent tó, a rituális megtisztulás helye





💠 Az egyetlen fennmaradt ábrázolás a legendás Kleopátra VII.





Útmutatója elmagyarázza a titokzatos csillagászati ​​domborműveket a mennyezeten – a csillagok ősi tudásának tanúja.





✨ Dendera Egyiptom egyik legszínesebb temploma – egy hely, amely felragyogtatja a történelmet.





🌙 Abydos temploma – Ozirisz szentélye





A Nílus völgyében tett festői autóút után eléri Abydost, az ókori Egyiptom egyik legszentebb városát.


Itt az emberek Ozirisz istent, a halál és az újjászületés uralkodóját imádták.





Felkeresi I. Seti fáraó templomát, amelyet Egyiptom művészileg legszebb templomai között tartanak számon.





Abydos legfontosabb eseményei:





🔹 Abydos híres királylistája a fontos fáraók nevével





🔹 Pontosan kidolgozott hieroglifák és domborművek szinte tökéletes állapotban





🔹 Jelenetek a Hórusz-mítoszból – a jó és a rossz örök harcából





🔹 II. Ramszesz domborművei áldozó és vadászó fiával





🕊️ Abydos nem egy hétköznapi templom - ez egy spirituális hely, ahol Egyiptom lelke tovább él.





💼 Utazási tippek az utazáshoz





✔️ Útlevél vagy személyi igazolvány másolata szükséges (hatósági jóváhagyás)


✔️ Rendelje meg a reggeli csomagot előző este a szálloda recepcióján


✔️ Viseljen kényelmes cipőt és időjárásnak megfelelő ruházatot


✔️ Ne feledkezz meg a fényvédőről, napszemüvegről és sapkáról sem


✔️ Fényképezőgép vagy mobiltelefon a felejthetetlen pillanatokért


✔️ Némi változás a borravalóknál és a WC-nél', 'Egynapos privát kirándulás Hurghadából Denderába és Abydosba németül beszélő egyiptológussal, Hathor templommal, Abydos templommal, ebéddel és kényelmes transzferrel.', 'Kultúra és városnézés', '["Egyéni kirándulás csoportos turizmus nélkül","Németül beszélő egyiptológus szaktudással","Látogatás a Hathor templomban Denderában","Látogatás az Abydos-templomban királylistával","Kényelmes transzfer légkondicionált járművel","Hiteles templomi művészet, domborművek és hieroglifák"]'::jsonb, '["Profi németül beszélő idegenvezető/egyiptológus","Privát transzferek modern, légkondicionált járműveken","Belépő a programban szereplő összes látnivalóhoz","Ebéd egy helyi étteremben","Üdítőitalok a járműben","Minden adó és szolgáltatási díj"]'::jsonb, '["Italok az étteremben","Személyes kiadások és tippek","Transzfer felár Marsa Alamból: 50 € személyenként","Transzfer felár az El Quseir városából: 35 € személyenként","Transzfer felára a Makadi Bay & Sahl Hasheesh területéről: 5 euró személyenként","Transzfer felára El Gouna, Safaga és Soma Bay területéről: 10 € személyenként","Idegen nyelvű túravezető (angol, orosz vagy francia): felár 10 € személyenként"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '13 óra', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '7cb0c635-f7a7-4d98-a9b0-cde4997ca8ae', 'ru', 'Частная однодневная поездка в Дендеру и Абидос из Хургады
---ЦЭП---
Частная однодневная поездка из Хургады в Дендеру и Абидос с немецкоязычным египтологом, храм Хатор, храм Абидос, обед и комфортабельный трансфер.
---ЦЭП---
Культура и достопримечательности
---ЦЭП---
Хургада - Красное море - Египет
---ЦЭП---
13 часов
---ЦЭП---
<table class="tour-pricing-table"><thead><tr><th>Участник</th><th>Автомобиль</th><th>Цена на человека</th></tr></thead><tbody><tr><td>2 человека</td><td>Частный лимузин</td><td>140 € на человека</td></tr><tr><td>3 – 4 человека</td><td>Частный Микроавтобус</td><td>130 € на человека</td></tr><tr><td>5 - 6 человек</td><td>Частный микроавтобус</td><td>120 € на человека</td></tr><tr><td>7 - 8 человек</td><td>Частный микроавтобус</td><td>110 € на человека</td></tr></tbody></table>
Незабываемый день в самом сердце Древнего Египта





Испытайте волшебство Древнего Египта в эксклюзивном частном туре от Hurghada Travel Planner.


Эта частная однодневная поездка в Дендеру и Абидос приведет вас к двум самым впечатляющим храмам Египта — местам, где история, мифы и красота увековечены в камне.





В сопровождении опытного немецкоязычного египтолога вы путешествуете по долине Нила и открываете для себя святилища, которые иначе видят лишь немногие посетители.





🌸 Храм Дендеры – Царство богини Хатор.





Ваша первая остановка — красивый храм Хатхор в Дендере — шедевр египетского искусства и символ любви, музыки и радости.





Здесь вы можете ожидать:





💠 Красочные залы с колоннадами, оригинальные цвета которых сохранились до сих пор





💠 Мамиси (дом богов) – символ творения и жизни.





💠 Санаторий, где происходили божественные исцеления





💠 Священное озеро, место ритуального очищения





💠 Единственное сохранившееся изображение легендарной Клеопатры VII.





Ваш гид расскажет о загадочных астрономических рельефах на потолке — свидетельстве древних знаний о звездах.





✨ Дендера — один из самых красочных храмов Египта — место, которое сверкает историей.





🌙 Храм Абидоса – святилище Осириса





После живописной поездки по долине Нила вы доберетесь до Абидоса, одного из самых священных городов древнего Египта.


Здесь люди поклонялись богу Осирису, повелителю смерти и возрождения.





Вы посетите храм фараона Сети I, который считается одним из самых художественно красивых храмов Египта.





Достопримечательности Абидоса:





🔹 знаменитый список царей Абидоса с именами важных фараонов





🔹Тщательно проработанные иероглифы и рельефы в практически идеальном состоянии.





🔹 Сцены из мифа о Горе – вечная битва добра и зла.





🔹 Рельефы Рамзеса II с сыном, приносящим жертвоприношения и охотящимся





🕊️Абидос – это не обычный храм – это духовное место, где живет душа Египта.





💼 Советы путешественникам для поездки





✔️ Требуется копия паспорта или удостоверения личности (одобрение властей)


✔️ Закажите пакет с завтраком накануне вечером на стойке регистрации отеля.


✔️ Носите удобную обувь и одежду по погоде.


✔️ Не забудьте солнцезащитный крем, солнцезащитные очки и головной убор.


✔️ Фотоаппарат или мобильный телефон для незабываемых моментов


✔️ Небольшая сдача за чаевые и туалеты.
---ЦЭП---
Частная экскурсия без группового туризма
---РАЗДЕЛЕНИЕ---
Немецкоязычный египтолог со специальными знаниями
---РАЗДЕЛЕНИЕ---
Посещение храма Хатхор в Дендере.
---РАЗДЕЛЕНИЕ---
Посещение храма в Абидосе со списком царей
---РАЗДЕЛЕНИЕ---
Комфортный трансфер на автомобиле с кондиционером.
---РАЗДЕЛЕНИЕ---
Аутентичное храмовое искусство, рельефы и иероглифы
---ЦЭП---
Профессиональный немецкоязычный гид/египтолог.
---РАЗДЕЛЕНИЕ---
Частные трансферы на современных автомобилях с кондиционерами.
---РАЗДЕЛЕНИЕ---
Вход на все достопримечательности, указанные в программе.
---РАЗДЕЛЕНИЕ---
Обед в местном ресторане
---РАЗДЕЛЕНИЕ---
Безалкогольные напитки в автомобиле
---РАЗДЕЛЕНИЕ---
Все налоги и сборы за обслуживание
---ЦЭП---
Напитки в ресторане
---РАЗДЕЛЕНИЕ---
Личные расходы и чаевые
---РАЗДЕЛЕНИЕ---
Доплата за трансфер для гостей из Марса Алама: 50 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер для гостей из Эль-Кусейра: 35 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из залива Макади и Сахл Хашиша: 5 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из Эль-Гуны, Сафаги и Сома-Бэй: 10 евро на человека.
---РАЗДЕЛЕНИЕ---
Гид на иностранном языке (английский, русский или французский): дополнительная плата 10 евро на человека.', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Fahrzeug</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Private Limousine</td><td>140 € p.P.</td></tr><tr><td>3 – 4 Personen</td><td>Privater Minibus</td><td>130 € p.P.</td></tr><tr><td>5 – 6 Personen</td><td>Privater Minibus</td><td>120 € p.P.</td></tr><tr><td>7 – 8 Personen</td><td>Privater Minibus</td><td>110 € p.P.</td></tr></tbody></table>
Ein unvergesslicher Tag im Herzen des alten Ägypten





Erleben Sie die Magie des Alten Ägyptens auf einer exklusiven Privattour von Hurghada Reiseplaner.


Dieser Private Tagesausflug nach Dendera und Abydos führt Sie zu zwei der beeindruckendsten Tempelstätten Ägyptens – Orte, an denen Geschichte, Mythos und Schönheit in Stein verewigt sind.





Begleitet von einem erfahrenen deutschsprachigen Ägyptologen reisen Sie entlang des Niltals und entdecken Heiligtümer, die sonst nur wenige Besucher sehen.





🌸 Tempel von Dendera – Das Reich der Göttin Hathor





Ihr erster Halt ist der wunderschöne Hathor-Tempel in Dendera – ein Meisterwerk ägyptischer Kunst und Symbol für Liebe, Musik und Freude.





Hier erwartet Sie:





💠 Farbenprächtige Säulenhallen, deren Originalfarben bis heute erhalten sind





💠 Das Mamisi (Geburtshaus der Götter) – Symbol für Schöpfung und Leben





💠 Das Sanatorium, in dem göttliche Heilungen stattfanden





💠 Der Heilige See, ein Ort ritueller Reinigung





💠 Die einzige erhaltene Darstellung der legendären Kleopatra VII.





Ihr Guide erklärt Ihnen die geheimnisvollen astronomischen Reliefs an der Decke – ein Zeugnis uralten Wissens über die Sterne.





✨ Dendera ist einer der farbenprächtigsten Tempel Ägyptens – ein Ort, der Geschichte zum Leuchten bringt.





🌙 Tempel von Abydos – Das Heiligtum des Osiris





Nach einer landschaftlich reizvollen Fahrt entlang des Niltals erreichen Sie Abydos, eine der heiligsten Städte des Alten Ägyptens.


Hier verehrten die Menschen den Gott Osiris, den Herrscher über Tod und Wiedergeburt.





Sie besuchen den Tempel von Pharao Sethos I. der als einer der künstlerisch schönsten Tempel Ägyptens gilt.





Höhepunkte in Abydos:





🔹 die berühmte Königsliste von Abydos mit den Namen bedeutender Pharaonen





🔹 Präzise gearbeitete Hieroglyphen und Reliefs in nahezu perfektem Zustand





🔹 Szenen des Horus-Mythos – der ewige Kampf zwischen Gut und Böse





🔹 Reliefs von Ramses II. mit seinem Sohn beim Opfer und bei der Jagd





🕊️ Abydos ist kein gewöhnlicher Tempel – es ist ein spiritueller Ort, an dem die Seele Ägyptens weiterlebt.





💼 Reisetipps für Ihren Ausflug





✔️ Kopie des Reisepasses oder Personalausweises erforderlich (Genehmigung durch Behörden)


✔️ Frühstückspaket am Vorabend an der Hotelrezeption bestellen


✔️ Bequeme Schuhe & wettergerechte Kleidung tragen


✔️ Sonnencreme, Sonnenbrille & Kopfbedeckung nicht vergessen


✔️ Kamera oder Handy für unvergessliche Momente


✔️ Etwas Kleingeld für Trinkgelder und Toiletten', 'Privater Tagesausflug von Hurghada nach Dendera & Abydos mit deutschsprachigem Ägyptologen, Hathor-Tempel, Abydos-Tempel, Mittagessen und komfortablem Transfer.', 'Kultur & Sightseeing', '["Privater Ausflug ohne Gruppentourismus","Deutschsprachiger Ägyptologe mit Fachwissen","Besuch des Hathor-Tempels in Dendera","Besuch des Abydos-Tempels mit Königsliste","Komfortabler Transfer im klimatisierten Fahrzeug","Authentische Tempelkunst, Reliefs und Hieroglyphen"]'::jsonb, '["Professioneller deutschsprachiger Reiseleiter / Ägyptologe","Private Transfers im modernen, klimatisierten Fahrzeug","Eintritt zu allen im Programm genannten Sehenswürdigkeiten","Mittagessen in einem lokalen Restaurant","Softdrinks im Fahrzeug","Alle Steuern und Servicegebühren"]'::jsonb, '["Getränke im Restaurant","Persönliche Ausgaben & Trinkgelder","Transferzuschlag für Gäste aus Marsa Alam: 50 € pro Person","Transferzuschlag für Gäste aus El Quseir: 35 € pro Person","Transferzuschlag ab Makadi Bay & Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga & Soma Bay: 10 € pro Person","Fremdsprachiger Reiseleiter (Englisch, Russisch oder Französisch): Aufpreis 10 € pro Person"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '13h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '7cb0c635-f7a7-4d98-a9b0-cde4997ca8ae', 'ar', 'رحلة نهارية خاصة إلى دندرة وأبيدوس من الغردقة
--- تسيب ---
رحلة نهارية خاصة من الغردقة إلى دندرة وأبيدوس مع عالم المصريات الناطق باللغة الألمانية ومعبد حتحور ومعبد أبيدوس والغداء والنقل المريح.
--- تسيب ---
الثقافة ومشاهدة المعالم السياحية
--- تسيب ---
الغردقة - البحر الأحمر - مصر
--- تسيب ---
13 ساعة
--- تسيب ---
<table class="tour-pricing-table"><thead><tr><th>المشارك</th><th>المركبة</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخصين</td><td>سيارة ليموزين خاصة</td><td>140 يورو للشخص الواحد</td></tr><tr><td>3 - 4 أشخاص</td><td>خاص حافلة صغيرة</td><td>130 يورو للشخص الواحد</td></tr><tr><td>5 - 6 أشخاص</td><td>حافلة صغيرة خاصة</td><td>120 يورو للشخص الواحد</td></tr><tr><td>7 - 8 أشخاص</td><td>حافلة صغيرة خاصة</td><td>110 يورو للشخص الواحد</td></tr></tbody></table>
يوم لا ينسى في قلب مصر القديمة





استمتع بسحر مصر القديمة في جولة خاصة وحصرية من Hurghada Travel Planner.


تأخذك هذه الرحلة النهارية الخاصة إلى دندرة وأبيدوس إلى اثنين من مواقع المعابد الأكثر إثارة للإعجاب في مصر - الأماكن التي يتم فيها تخليد التاريخ والأسطورة والجمال في الحجر.





تسافر، برفقة عالم مصريات ذو خبرة ويتحدث الألمانية، على طول وادي النيل وتكتشف محميات لا يراها سوى عدد قليل من الزوار.





🌸معبد دندرة – عالم الالهة حتحور





محطتك الأولى هي معبد حتحور الجميل في دندرة - تحفة الفن المصري ورمز الحب والموسيقى والفرح.





هنا يمكنك أن تتوقع:





💠 قاعات ذات أعمدة ملونة، تم الحفاظ على ألوانها الأصلية حتى يومنا هذا





💠 الماميسي (مولد الآلهة) – رمز الخلق والحياة





💠المصحة التي تمت فيها عمليات الشفاء الإلهي





💠 البحيرة المقدسة مكان التطهير





💠 الصورة الوحيدة الباقية للأسطورة كليوباترا السابعة.





سيشرح لك مرشدك النقوش الفلكية الغامضة الموجودة على السقف، وهي شهادة على المعرفة القديمة بالنجوم.





✨ دندرة هو أحد أكثر المعابد الملونة في مصر - وهو المكان الذي يجعل التاريخ يلمع.





🌙 معبد أبيدوس – معبد أوزوريس





بعد رحلة ذات مناظر خلابة على طول وادي النيل، ستصل إلى أبيدوس، إحدى أقدس مدن مصر القديمة.


هنا كان الناس يعبدون الإله أوزوريس، حاكم الموت والبعث.





تقوم بزيارة معبد الفرعون سيتي الأول الذي يعتبر من أجمل المعابد المصرية من الناحية الفنية.





معالم أبيدوس:





🔹قائمة ملوك أبيدوس الشهيرة بأسماء الفراعنة المهمين





🔹 الحروف الهيروغليفية والنقوش مصنوعة بدقة وفي حالة ممتازة تقريبًا





🔹 مشاهد من أسطورة حورس – المعركة الأبدية بين الخير والشر





🔹 نقوشات لرمسيس الثاني مع ابنه وهو يضحي ويصطاد





🕊️ أبيدوس ليس معبدًا عاديًا - بل هو مكان روحاني تعيش فيه روح مصر.





💼 نصائح السفر لرحلتك





✔️ مطلوب نسخة من جواز السفر أو البطاقة الشخصية (موافقة من السلطات)


✔️ اطلب باقة الإفطار في المساء السابق في مكتب استقبال الفندق


✔️ ارتداء أحذية مريحة وملابس مناسبة للطقس


✔️ لا تنس الواقي من الشمس والنظارات الشمسية والقبعة


✔️ الكاميرا أو الهاتف الخليوي للحظات لا تنسى


✔️ بعض التغيير للنصائح والمراحيض
--- تسيب ---
رحلة خاصة بدون سياحة جماعية
---تقسيم---
عالم مصريات يتحدث الألمانية ولديه معرفة متخصصة
---تقسيم---
زيارة معبد حتحور بدندرة
---تقسيم---
زيارة معبد أبيدوس مع قائمة الملوك
---تقسيم---
نقل مريح في سيارة مكيفة
---تقسيم---
فن المعبد الأصيل والنقوش والكتابات الهيروغليفية
--- تسيب ---
مرشد سياحي محترف يتحدث الألمانية / عالم المصريات
---تقسيم---
الإنتقالات الخاصة بسيارات حديثة ومكيفة
---تقسيم---
الدخول إلى جميع المعالم السياحية المذكورة في البرنامج
---تقسيم---
الغداء في مطعم محلي
---تقسيم---
المشروبات الغازية في السيارة
---تقسيم---
جميع الضرائب ورسوم الخدمة
--- تسيب ---
المشروبات في المطعم
---تقسيم---
النفقات الشخصية والنصائح
---تقسيم---
تكلفة النقل الإضافية للضيوف من مرسى علم: 50 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية للضيوف من القصير: 35 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية من خليج مكادي وسهل حشيش: 5 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية من الجونة وسفاجا وخليج سوما: 10 يورو للشخص الواحد
---تقسيم---
مرشد سياحي بلغة أجنبية (الإنجليزية أو الروسية أو الفرنسية): رسوم إضافية 10 يورو للشخص الواحد', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Fahrzeug</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Private Limousine</td><td>140 € p.P.</td></tr><tr><td>3 – 4 Personen</td><td>Privater Minibus</td><td>130 € p.P.</td></tr><tr><td>5 – 6 Personen</td><td>Privater Minibus</td><td>120 € p.P.</td></tr><tr><td>7 – 8 Personen</td><td>Privater Minibus</td><td>110 € p.P.</td></tr></tbody></table>
Ein unvergesslicher Tag im Herzen des alten Ägypten





Erleben Sie die Magie des Alten Ägyptens auf einer exklusiven Privattour von Hurghada Reiseplaner.


Dieser Private Tagesausflug nach Dendera und Abydos führt Sie zu zwei der beeindruckendsten Tempelstätten Ägyptens – Orte, an denen Geschichte, Mythos und Schönheit in Stein verewigt sind.





Begleitet von einem erfahrenen deutschsprachigen Ägyptologen reisen Sie entlang des Niltals und entdecken Heiligtümer, die sonst nur wenige Besucher sehen.





🌸 Tempel von Dendera – Das Reich der Göttin Hathor





Ihr erster Halt ist der wunderschöne Hathor-Tempel in Dendera – ein Meisterwerk ägyptischer Kunst und Symbol für Liebe, Musik und Freude.





Hier erwartet Sie:





💠 Farbenprächtige Säulenhallen, deren Originalfarben bis heute erhalten sind





💠 Das Mamisi (Geburtshaus der Götter) – Symbol für Schöpfung und Leben





💠 Das Sanatorium, in dem göttliche Heilungen stattfanden





💠 Der Heilige See, ein Ort ritueller Reinigung





💠 Die einzige erhaltene Darstellung der legendären Kleopatra VII.





Ihr Guide erklärt Ihnen die geheimnisvollen astronomischen Reliefs an der Decke – ein Zeugnis uralten Wissens über die Sterne.





✨ Dendera ist einer der farbenprächtigsten Tempel Ägyptens – ein Ort, der Geschichte zum Leuchten bringt.





🌙 Tempel von Abydos – Das Heiligtum des Osiris





Nach einer landschaftlich reizvollen Fahrt entlang des Niltals erreichen Sie Abydos, eine der heiligsten Städte des Alten Ägyptens.


Hier verehrten die Menschen den Gott Osiris, den Herrscher über Tod und Wiedergeburt.





Sie besuchen den Tempel von Pharao Sethos I. der als einer der künstlerisch schönsten Tempel Ägyptens gilt.





Höhepunkte in Abydos:





🔹 die berühmte Königsliste von Abydos mit den Namen bedeutender Pharaonen





🔹 Präzise gearbeitete Hieroglyphen und Reliefs in nahezu perfektem Zustand





🔹 Szenen des Horus-Mythos – der ewige Kampf zwischen Gut und Böse





🔹 Reliefs von Ramses II. mit seinem Sohn beim Opfer und bei der Jagd





🕊️ Abydos ist kein gewöhnlicher Tempel – es ist ein spiritueller Ort, an dem die Seele Ägyptens weiterlebt.





💼 Reisetipps für Ihren Ausflug





✔️ Kopie des Reisepasses oder Personalausweises erforderlich (Genehmigung durch Behörden)


✔️ Frühstückspaket am Vorabend an der Hotelrezeption bestellen


✔️ Bequeme Schuhe & wettergerechte Kleidung tragen


✔️ Sonnencreme, Sonnenbrille & Kopfbedeckung nicht vergessen


✔️ Kamera oder Handy für unvergessliche Momente


✔️ Etwas Kleingeld für Trinkgelder und Toiletten', 'Privater Tagesausflug von Hurghada nach Dendera & Abydos mit deutschsprachigem Ägyptologen, Hathor-Tempel, Abydos-Tempel, Mittagessen und komfortablem Transfer.', 'Kultur & Sightseeing', '["Privater Ausflug ohne Gruppentourismus","Deutschsprachiger Ägyptologe mit Fachwissen","Besuch des Hathor-Tempels in Dendera","Besuch des Abydos-Tempels mit Königsliste","Komfortabler Transfer im klimatisierten Fahrzeug","Authentische Tempelkunst, Reliefs und Hieroglyphen"]'::jsonb, '["Professioneller deutschsprachiger Reiseleiter / Ägyptologe","Private Transfers im modernen, klimatisierten Fahrzeug","Eintritt zu allen im Programm genannten Sehenswürdigkeiten","Mittagessen in einem lokalen Restaurant","Softdrinks im Fahrzeug","Alle Steuern und Servicegebühren"]'::jsonb, '["Getränke im Restaurant","Persönliche Ausgaben & Trinkgelder","Transferzuschlag für Gäste aus Marsa Alam: 50 € pro Person","Transferzuschlag für Gäste aus El Quseir: 35 € pro Person","Transferzuschlag ab Makadi Bay & Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga & Soma Bay: 10 € pro Person","Fremdsprachiger Reiseleiter (Englisch, Russisch oder Französisch): Aufpreis 10 € pro Person"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '13h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '2dc6864a-30cb-4a8e-8277-a54c2ed8ca7d', 'en', 'Monasteries of St. Anthony & St. Paul from Hurghada – The oldest Christian monasteries in the world', '<table class="tour-pricing-table"><thead> per person</td></tr><tr><td>5 - 6 people</td><td>Private minibus</td><td>80€ per person</td></tr><tr><td>7 - 8 people</td><td>Private minibus</td><td>71€ per person</td></tr></tbody></table>
Experience two of Christianity''s oldest monasteries on an exclusive private tour from Hurghada. The monasteries of St. Anthony and St. Paul are isolated in the Eastern Desert and are among the most important spiritual places in Egypt.


The monasteries of St. Anthony and St. Paul are considered the oldest monasteries in the world.


St. Anthony was founded in the 4th century, St. Paul over the cave of St. Paul, who is venerated as the first Christian hermit.





Both monasteries offer unique insights into Egypt''s early monasticism and Coptic tradition.





Why this excursion is so special





Unlike the well-known temples of Egypt, here you will experience the spiritual side of the country. The remote monasteries in the middle of the Eastern Desert offer a unique combination of history, religion, nature and tranquility. To this day, monks live here according to centuries-old traditions.





Who is this excursion suitable for?





This excursion is particularly suitable for travelers interested in culture, Christians, history buffs and guests who want to discover the original Egypt away from the well-known tourist routes.', 'Discover the monasteries of St. Anthony and St. Paul - the oldest Christian monasteries in the world. A unique day trip from Hurghada full of history, spirituality and impressive desert landscapes.', 'Culture & sightseeing', '["Visit the oldest Christian monasteries in the world","Historic churches, frescoes and valuable manuscripts","Climb to Saint Anthony''s Cave (optional)","Breathtaking desert landscapes of the Red Sea Mountains","German-speaking expert tour guide","Lunch included"]'::jsonb, '["All transfers in air-conditioned vehicles","German speaking tour guide","Entrance fees according to the program","Lunch","Drinks in the vehicle","All service fees and taxes"]'::jsonb, '["Drinks in the restaurant","Personal expenses","Transfer surcharge for guests from Marsa Alam: €25 per person","Transfer surcharge for guests from El Quseir: €15 per person","Transfer surcharge from Makadi Bay & Sahl Hasheesh: €5 per person","Transfer surcharge from El Gouna, Safaga & Soma Bay: €10 per person","Foreign language tour guide (English, Russian or French): additional charge €10 per person"]'::jsonb, 'Hurghada - Red Sea - Egypt', '14h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '2dc6864a-30cb-4a8e-8277-a54c2ed8ca7d', 'fr', 'Monastères Saint-Antoine et Saint-Paul d''Hurghada – Les plus anciens monastères chrétiens du monde', '<table class="tour-pricing-table"><thead> par personne</td></tr><tr><td>5 - 6 personnes</td><td>Minibus privé</td><td>80€ par personne</td></tr><tr><td>7 - 8 personnes</td><td>Minibus privé</td><td>71€ par personne</td></tr></tbody></table>
Découvrez deux des plus anciens monastères du christianisme lors d''une visite privée exclusive au départ d''Hurghada. Les monastères Saint-Antoine et Saint-Paul sont isolés dans le désert oriental et comptent parmi les lieux spirituels les plus importants d''Égypte.


Les monastères Saint-Antoine et Saint-Paul sont considérés comme les plus anciens monastères du monde.


Saint Antoine a été fondé au 4ème siècle, Saint Paul sur la grotte de Saint Paul, vénéré comme le premier ermite chrétien.





Les deux monastères offrent un aperçu unique des premiers monachismes égyptiens et de la tradition copte.





Pourquoi cette excursion est si spéciale





Contrairement aux temples égyptiens bien connus, vous découvrirez ici le côté spirituel du pays. Les monastères isolés au milieu du désert oriental offrent une combinaison unique d''histoire, de religion, de nature et de tranquillité. Aujourd''hui encore, les moines vivent ici selon des traditions séculaires.





A qui s''adresse cette excursion ?





Cette excursion est particulièrement adaptée aux voyageurs intéressés par la culture, aux chrétiens, aux passionnés d''histoire et aux clients souhaitant découvrir l''Égypte originelle loin des routes touristiques bien connues.', 'Découvrez les monastères Saint-Antoine et Saint-Paul - les plus anciens monastères chrétiens du monde. Une excursion d''une journée unique au départ d''Hurghada, pleine d''histoire, de spiritualité et de paysages désertiques impressionnants.', 'Culture et tourisme', '["Visitez les plus anciens monastères chrétiens du monde","Églises historiques, fresques et manuscrits précieux","Monter à la grotte de Saint Antoine (facultatif)","Paysages désertiques à couper le souffle des montagnes de la mer Rouge","Guide touristique expert germanophone","Déjeuner inclus"]'::jsonb, '["Tous les transferts en véhicules climatisés","Guide touristique germanophone","Tarifs d''entrée selon le programme","Déjeuner","Boissons dans le véhicule","Tous les frais de service et taxes"]'::jsonb, '["Boissons au restaurant","Dépenses personnelles","Supplément de transfert pour les clients de Marsa Alam : 25 € par personne","Supplément de transfert pour les clients d''El Quseir : 15 € par personne","Supplément de transfert depuis la baie de Makadi et Sahl Hasheesh : 5 € par personne","Supplément de transfert depuis El Gouna, Safaga et Soma Bay : 10 € par personne","Guide touristique en langue étrangère (anglais, russe ou français) : supplément 10 € par personne"]'::jsonb, 'Hurghada - Mer Rouge - Egypte', '14h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '2dc6864a-30cb-4a8e-8277-a54c2ed8ca7d', 'ru', 'Монастыри Св. Антония и Св. Павла в Хургаде – Старейшие христианские монастыри в мире
---ЦЭП---
Откройте для себя монастыри Святого Антония и Святого Павла – старейшие христианские монастыри в мире. Уникальная однодневная поездка из Хургады, полная истории, духовности и впечатляющих пустынных пейзажей.
---ЦЭП---
Культура и достопримечательности
---ЦЭП---
Хургада - Красное море - Египет
---ЦЭП---
14 часов
---ЦЭП---
<table class="tour-pricing-table"><thead> на человека</td></tr><tr><td>5 - 6 человек</td><td>Частный микроавтобус</td><td>80 евро на человека</td></tr><tr><td>7 - 8 человек</td><td>Частный микроавтобус</td><td>71 евро на человека</td></tr></tbody></table>
Посетите два старейших христианских монастыря в эксклюзивном частном туре из Хургады. Монастыри Святого Антония и Святого Павла изолированы в Восточной пустыне и являются одними из важнейших духовных мест Египта.


Монастыри Святого Антония и Святого Павла считаются древнейшими монастырями мира.


Святой Антоний был основан в 4 веке святым Павлом над пещерой святого Павла, которого почитают как первого христианского отшельника.





Оба монастыря предлагают уникальное представление о раннем монашестве Египта и коптских традициях.





Почему эта экскурсия такая особенная





В отличие от известных храмов Египта, здесь вы почувствуете духовную сторону страны. Удаленные монастыри посреди Восточной пустыни предлагают уникальное сочетание истории, религии, природы и спокойствия. По сей день здесь живут монахи по многовековым традициям.





Кому подойдет эта экскурсия?





Эта экскурсия особенно подходит для путешественников, интересующихся культурой, христианами, любителями истории и гостями, которые хотят открыть для себя оригинальный Египет вдали от известных туристических маршрутов.
---ЦЭП---
Посетите старейшие христианские монастыри в мире.
---РАЗДЕЛЕНИЕ---
Исторические церкви, фрески и ценные рукописи
---РАЗДЕЛЕНИЕ---
Поднимитесь в пещеру Святого Антония (по желанию).
---РАЗДЕЛЕНИЕ---
Захватывающие пустынные пейзажи гор Красного моря
---РАЗДЕЛЕНИЕ---
Немецкоязычный опытный гид
---РАЗДЕЛЕНИЕ---
Обед включен
---ЦЭП---
Все трансферы на автомобилях с кондиционером
---РАЗДЕЛЕНИЕ---
Немецкоговорящий гид
---РАЗДЕЛЕНИЕ---
Входные билеты согласно программе
---РАЗДЕЛЕНИЕ---
Обед
---РАЗДЕЛЕНИЕ---
Напитки в машине
---РАЗДЕЛЕНИЕ---
Все сборы и налоги за обслуживание
---ЦЭП---
Напитки в ресторане
---РАЗДЕЛЕНИЕ---
Личные расходы
---РАЗДЕЛЕНИЕ---
Доплата за трансфер для гостей из Марса Алама: 25 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер для гостей из Эль-Кусейра: 15 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из залива Макади и Сахл Хашиша: 5 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из Эль-Гуны, Сафаги и Сома-Бэй: 10 евро на человека.
---РАЗДЕЛЕНИЕ---
Гид на иностранном языке (английский, русский или французский): дополнительная плата 10 евро на человека.', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Fahrzeug</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Private Limousine</td><td>96€ p.P.</td></tr><tr><td>3 – 4 Personen</td><td>Privater Minibus</td><td>85€ p.P.</td></tr><tr><td>5 – 6 Personen</td><td>Privater Minibus</td><td>80€ p.P.</td></tr><tr><td>7 – 8 Personen</td><td>Privater Minibus</td><td>71€ p.P.</td></tr></tbody></table>
Erleben Sie zwei der ältesten Klöster des Christentums auf einer exklusiven Privattour ab Hurghada. Die Klöster St. Antonius und St. Paulus liegen abgeschieden in der östlichen Wüste und gehören zu den wichtigsten spirituellen Orten Ägyptens.


Die Klöster St. Antonius und St. Paulus gelten als die ältesten Klöster der Welt.


St. Antonius wurde im 4. Jahrhundert gegründet, St. Paulus über der Höhle des Heiligen Paulus, der als erster christlicher Eremit verehrt wird.





Beide Klöster bieten einzigartige Einblicke in das frühe Mönchtum und die koptische Tradition Ägyptens.





Warum dieser Ausflug so besonders ist





Anders als die bekannten Tempel Ägyptens erleben Sie hier die spirituelle Seite des Landes. Die abgeschiedenen Klöster inmitten der östlichen Wüste bieten eine einzigartige Kombination aus Geschichte, Religion, Natur und Ruhe. Bis heute leben hier Mönche nach jahrhundertealten Traditionen.





Für wen eignet sich dieser Ausflug?





Dieser Ausflug eignet sich besonders für kulturinteressierte Reisende, Christen, Geschichtsinteressierte sowie Gäste, die das ursprüngliche Ägypten abseits der bekannten Touristenrouten entdecken möchten.', 'Entdecken Sie die Klöster St. Antonius und St. Paulus – die ältesten christlichen Klöster der Welt. Ein einzigartiger Tagesausflug ab Hurghada voller Geschichte, Spiritualität und beeindruckender Wüstenlandschaften.', 'Kultur & Sightseeing', '["Besuch der ältesten christlichen Klöster der Welt","Historische Kirchen, Fresken und wertvolle Manuskripte","Aufstieg zur Höhle des Heiligen Antonius (optional)","Atemberaubende Wüstenlandschaften des Rotmeergebirges","Deutschsprachige fachkundige Reiseleitung","Mittagessen inklusive"]'::jsonb, '["Alle Transfers im klimatisierten Fahrzeug","Deutschsprachige Reiseleitung","Eintrittsgebühren laut Programm","Mittagessen","Getränke im Fahrzeug","Alle Servicegebühren und Steuern"]'::jsonb, '["Getränke im Restaurant","Persönliche Ausgaben","Transferzuschlag für Gäste aus Marsa Alam: 25 € pro Person","Transferzuschlag für Gäste aus El Quseir: 15 € pro Person","Transferzuschlag ab Makadi Bay & Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga & Soma Bay: 10 € pro Person","Fremdsprachiger Reiseleiter (Englisch, Russisch oder Französisch): Aufpreis 10 € pro Person"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '14h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '2dc6864a-30cb-4a8e-8277-a54c2ed8ca7d', 'ar', 'دير القديس أنطونيوس والقديس بولس من الغردقة – أقدم الأديرة المسيحية في العالم
--- تسيب ---
اكتشف أديرة القديس أنطونيوس والقديس بولس - أقدم الأديرة المسيحية في العالم. رحلة نهارية فريدة من الغردقة مليئة بالتاريخ والروحانية والمناظر الطبيعية الصحراوية المبهرة.
--- تسيب ---
الثقافة ومشاهدة المعالم السياحية
--- تسيب ---
الغردقة - البحر الأحمر - مصر
--- تسيب ---
14 ساعة
--- تسيب ---
<table class="tour-pricing-table"><thead> للشخص الواحد</td></tr><tr><td>5 - 6 أشخاص</td><td>حافلة صغيرة خاصة</td><td>80 يورو للشخص الواحد</td></tr><tr><td>7 - 8 أشخاص</td><td>حافلة صغيرة خاصة</td><td>71 يورو للشخص الواحد</td></tr></tbody></table>
استمتع بتجربة اثنين من أقدم الأديرة المسيحية في جولة خاصة وحصرية من الغردقة. دير الأنبا أنطونيوس ودير القديس بولس معزولان في الصحراء الشرقية ويعتبران من أهم الأماكن الروحانية في مصر.


يعتبر دير القديس أنطونيوس والقديس بولس من أقدم الأديرة في العالم.


تأسس القديس أنطونيوس في القرن الرابع على يد القديس بولس فوق مغارة القديس بولس الذي يُبجل باعتباره أول ناسك مسيحي.





يقدم كلا الديرين رؤى فريدة عن الرهبنة المبكرة والتقاليد القبطية في مصر.





لماذا تعتبر هذه الرحلة مميزة جدًا؟





على عكس المعابد المصرية الشهيرة، هنا ستختبر الجانب الروحي للبلاد. توفر الأديرة النائية في وسط الصحراء الشرقية مزيجًا فريدًا من التاريخ والدين والطبيعة والهدوء. حتى يومنا هذا، يعيش الرهبان هنا وفقا لتقاليد عمرها قرون.





لمن هذه الرحلة مناسبة؟





هذه الرحلة مناسبة بشكل خاص للمسافرين المهتمين بالثقافة والمسيحيين وهواة التاريخ والضيوف الذين يرغبون في اكتشاف مصر الأصلية بعيدًا عن الطرق السياحية المعروفة.
--- تسيب ---
قم بزيارة أقدم الأديرة المسيحية في العالم
---تقسيم---
الكنائس التاريخية واللوحات الجدارية والمخطوطات القيمة
---تقسيم---
الصعود إلى كهف القديس أنتوني (اختياري)
---تقسيم---
المناظر الطبيعية الصحراوية الخلابة لجبال البحر الأحمر
---تقسيم---
مرشد سياحي خبير يتحدث الألمانية
---تقسيم---
الغداء متضمن
--- تسيب ---
- جميع التنقلات بسيارات مكيفة
---تقسيم---
مرشد سياحي يتحدث الألمانية
---تقسيم---
رسوم الدخول حسب البرنامج
---تقسيم---
الغداء
---تقسيم---
المشروبات في السيارة
---تقسيم---
جميع رسوم الخدمة والضرائب
--- تسيب ---
المشروبات في المطعم
---تقسيم---
النفقات الشخصية
---تقسيم---
تكلفة النقل الإضافية للضيوف من مرسى علم: 25 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية للضيوف من القصير: 15 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية من خليج مكادي وسهل حشيش: 5 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية من الجونة وسفاجا وخليج سوما: 10 يورو للشخص الواحد
---تقسيم---
مرشد سياحي بلغة أجنبية (الإنجليزية أو الروسية أو الفرنسية): رسوم إضافية 10 يورو للشخص الواحد', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Fahrzeug</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Private Limousine</td><td>96€ p.P.</td></tr><tr><td>3 – 4 Personen</td><td>Privater Minibus</td><td>85€ p.P.</td></tr><tr><td>5 – 6 Personen</td><td>Privater Minibus</td><td>80€ p.P.</td></tr><tr><td>7 – 8 Personen</td><td>Privater Minibus</td><td>71€ p.P.</td></tr></tbody></table>
Erleben Sie zwei der ältesten Klöster des Christentums auf einer exklusiven Privattour ab Hurghada. Die Klöster St. Antonius und St. Paulus liegen abgeschieden in der östlichen Wüste und gehören zu den wichtigsten spirituellen Orten Ägyptens.


Die Klöster St. Antonius und St. Paulus gelten als die ältesten Klöster der Welt.


St. Antonius wurde im 4. Jahrhundert gegründet, St. Paulus über der Höhle des Heiligen Paulus, der als erster christlicher Eremit verehrt wird.





Beide Klöster bieten einzigartige Einblicke in das frühe Mönchtum und die koptische Tradition Ägyptens.





Warum dieser Ausflug so besonders ist





Anders als die bekannten Tempel Ägyptens erleben Sie hier die spirituelle Seite des Landes. Die abgeschiedenen Klöster inmitten der östlichen Wüste bieten eine einzigartige Kombination aus Geschichte, Religion, Natur und Ruhe. Bis heute leben hier Mönche nach jahrhundertealten Traditionen.





Für wen eignet sich dieser Ausflug?





Dieser Ausflug eignet sich besonders für kulturinteressierte Reisende, Christen, Geschichtsinteressierte sowie Gäste, die das ursprüngliche Ägypten abseits der bekannten Touristenrouten entdecken möchten.', 'Entdecken Sie die Klöster St. Antonius und St. Paulus – die ältesten christlichen Klöster der Welt. Ein einzigartiger Tagesausflug ab Hurghada voller Geschichte, Spiritualität und beeindruckender Wüstenlandschaften.', 'Kultur & Sightseeing', '["Besuch der ältesten christlichen Klöster der Welt","Historische Kirchen, Fresken und wertvolle Manuskripte","Aufstieg zur Höhle des Heiligen Antonius (optional)","Atemberaubende Wüstenlandschaften des Rotmeergebirges","Deutschsprachige fachkundige Reiseleitung","Mittagessen inklusive"]'::jsonb, '["Alle Transfers im klimatisierten Fahrzeug","Deutschsprachige Reiseleitung","Eintrittsgebühren laut Programm","Mittagessen","Getränke im Fahrzeug","Alle Servicegebühren und Steuern"]'::jsonb, '["Getränke im Restaurant","Persönliche Ausgaben","Transferzuschlag für Gäste aus Marsa Alam: 25 € pro Person","Transferzuschlag für Gäste aus El Quseir: 15 € pro Person","Transferzuschlag ab Makadi Bay & Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga & Soma Bay: 10 € pro Person","Fremdsprachiger Reiseleiter (Englisch, Russisch oder Französisch): Aufpreis 10 € pro Person"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '14h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '2dc6864a-30cb-4a8e-8277-a54c2ed8ca7d', 'hu', 'Szent Antal és Szent Pál kolostorok Hurghadából – A világ legrégebbi keresztény kolostorai', '<table class="tour-pricing-table"><thead> személyenként</td></tr><tr><td>5-6 fő</td><td>Privát mikrobusz</td><td>80€/fő</td></tr><tr><td>7-8 fő</td><td>Magánbusz</td><td>71><><table/fő/td>71
Tapasztalja meg a kereszténység két legrégebbi kolostorát egy exkluzív privát túrán Hurghadából. Szent Antal és Szent Pál kolostorok elszigeteltek a keleti sivatagban, és Egyiptom legfontosabb spirituális helyei közé tartoznak.


Szent Antal és Szent Pál kolostora a világ legrégebbi kolostorának számít.


Szent Antal a 4. században alakult, Szent Pál Szent Pál barlangja fölött, akit az első keresztény remeteként tisztelnek.





Mindkét kolostor egyedülálló betekintést nyújt Egyiptom korai szerzetességébe és kopt hagyományaiba.





Miért olyan különleges ez a kirándulás?





Egyiptom jól ismert templomaival ellentétben itt megtapasztalhatja az ország spirituális oldalát. A keleti sivatag közepén található távoli kolostorok a történelem, a vallás, a természet és a nyugalom egyedülálló kombinációját kínálják. A mai napig szerzetesek élnek itt évszázados hagyományok szerint.





Kinek alkalmas ez a kirándulás?





Ez a kirándulás különösen alkalmas a kultúra iránt érdeklődő utazóknak, a keresztényeknek, a történelem szerelmeseinek és azoknak, akik szeretnék felfedezni az eredeti Egyiptomot távol a jól ismert turistautaktól.', 'Fedezze fel Szent Antal és Szent Pál kolostorait – a világ legrégebbi keresztény kolostorait. Egyedülálló egynapos kirándulás Hurghadából, tele történelemmel, spiritualitással és lenyűgöző sivatagi tájakkal.', 'Kultúra és városnézés', '["Látogassa meg a világ legrégebbi keresztény kolostorait","Történelmi templomok, freskók és értékes kéziratok","Mássz fel a Szent Antal-barlangba (opcionális)","A Vörös-tengeri hegység lélegzetelállító sivatagi tájai","Németül beszélő szakértő idegenvezető","Az ebéd benne van"]'::jsonb, '["Minden transzfer légkondicionált járművel","németül beszélő idegenvezető","Belépődíjak a program szerint","Ebéd","Italok a járműben","Minden szolgáltatási díj és adó"]'::jsonb, '["Italok az étteremben","Személyi kiadások","Transzfer felár Marsa Alamból: 25 € személyenként","Transzfer felár El Quseirből: 15 € személyenként","Transzfer felára a Makadi Bay & Sahl Hasheesh területéről: 5 euró személyenként","Transzfer felára El Gouna, Safaga és Soma Bay területéről: 10 € személyenként","Idegen nyelvű túravezető (angol, orosz vagy francia): felár 10 € személyenként"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '14 óra', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '1c5a3c79-ab29-46c7-b480-36954adcc661', 'en', 'Luxor day trip with hot air balloon ride & overnight hotel stay from Hurghada', '<table class="tour-pricing-table"><thead> Minibus</td><td>270 € per person</td></tr><tr><td>5 - 6 people</td><td>Private minibus</td><td>240 € per person</td></tr><tr><td>7 - 8 people</td><td>Private minibus</td><td>220 € per person</td></tr></tbody></table>
Discover one of Egypt''s most impressive cultural tours with Hurghada Travel Planner. This 2-day Luxor hot air balloon tour combines history, adventure and comfort with an overnight hotel stay in Luxor.





The tour includes a sunrise hot air balloon ride, Valley of the Kings, Hatshepsut Temple, Colossi of Memnon, Karnak Temple, hotel accommodation, dinner, breakfast, entrance tickets, transfers and a German-speaking Egyptologist.





Ideal for guests who don''t just visit Luxor briefly, but want to experience the highlights of the ancient city in a relaxed and intensive way.', 'Experience Luxor with hot air balloon ride, hotel accommodation, Valley of the Kings, Hatshepsut Temple, Colossi of Memnon and Karnak Temple. Includes German-speaking Egyptologist, entry tickets, transfers and sunrise balloon ride.', 'Culture & sightseeing', '["Hot air balloon ride over Luxor at sunrise - unforgettable panoramic views over the Nile","Karnak Temple – the largest religious building of ancient times","Valley of the Kings – visit three magnificent tombs with original murals","Hatshepsut Temple – the masterpiece of the most powerful woman in Egypt","Colossi of Memnon – impressive remains of the temple of Amenhotep III.","Overnight stay at the hotel including dinner & breakfast"]'::jsonb, '["German-speaking Egyptologist as tour guide","Entrance fees for all sights according to the program","45-60 minutes hot air balloon ride over Luxor","Overnight stay at the hotel including dinner & breakfast","All transfers in air-conditioned vehicles","All taxes & service fees"]'::jsonb, '["Drinks in the restaurant","Personal expenses","Transfer surcharge for guests from Marsa Alam: €25 per person","Transfer surcharge for guests from El Quseir: €15 per person","Transfer surcharge from Makadi Bay & Sahl Hasheesh: €5 per person","Transfer surcharge from El Gouna, Safaga & Soma Bay: €10 per person","Foreign language tour guide (English, Russian or French): additional charge €10 per person"]'::jsonb, 'Hurghada - Red Sea - Egypt', '1 day', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '1c5a3c79-ab29-46c7-b480-36954adcc661', 'fr', 'Excursion d''une journée à Louxor avec vol en montgolfière et nuit à l''hôtel au départ d''Hurghada', '<table class="tour-pricing-table"><thead> Minibus</td><td>270 € par personne</td></tr><tr><td>5 - 6 personnes</td><td>Minibus privé</td><td>240 € par personne</td></tr><tr><td>7 - 8 personnes</td><td>Minibus privé</td><td>220 € par personne</td></tr></tbody></table>
Découvrez l''une des visites culturelles les plus impressionnantes d''Égypte avec Hurghada Travel Planner. Ce tour en montgolfière de 2 jours à Louxor allie histoire, aventure et confort avec une nuit d''hôtel à Louxor.





La visite comprend un tour en montgolfière au lever du soleil, la Vallée des Rois, le temple d''Hatchepsout, les colosses de Memnon, le temple de Karnak, l''hébergement à l''hôtel, le dîner, le petit-déjeuner, les billets d''entrée, les transferts et un égyptologue germanophone.





Idéal pour les clients qui ne visitent pas Louxor brièvement, mais qui souhaitent découvrir les points forts de la ville antique de manière détendue et intensive.', 'Découvrez Louxor avec un tour en montgolfière, l''hébergement à l''hôtel, la Vallée des Rois, le temple d''Hatchepsout, les colosses de Memnon et le temple de Karnak. Comprend un égyptologue germanophone, les billets d''entrée, les transferts et le vol en montgolfière au lever du soleil.', 'Culture et tourisme', '["Vol en montgolfière au-dessus de Louxor au lever du soleil - vues panoramiques inoubliables sur le Nil","Temple de Karnak – le plus grand édifice religieux de l''Antiquité","Vallée des Rois – visitez trois magnifiques tombeaux avec des peintures murales originales","Temple d''Hatchepsout – le chef-d''œuvre de la femme la plus puissante d''Egypte","Colosses de Memnon – vestiges impressionnants du temple d''Amenhotep III.","Nuit à l''hôtel avec dîner et petit-déjeuner"]'::jsonb, '["Égyptologue germanophone comme guide touristique","Frais d''entrée pour tous les sites selon le programme","Vol en montgolfière de 45 à 60 minutes au-dessus de Louxor","Nuit à l''hôtel avec dîner et petit-déjeuner","Tous les transferts en véhicules climatisés","Toutes les taxes et frais de service"]'::jsonb, '["Boissons au restaurant","Dépenses personnelles","Supplément de transfert pour les clients de Marsa Alam : 25 € par personne","Supplément de transfert pour les clients d''El Quseir : 15 € par personne","Supplément de transfert depuis la baie de Makadi et Sahl Hasheesh : 5 € par personne","Supplément de transfert depuis El Gouna, Safaga et Soma Bay : 10 € par personne","Guide touristique en langue étrangère (anglais, russe ou français) : supplément 10 € par personne"]'::jsonb, 'Hurghada - Mer Rouge - Egypte', '1 jour', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '1c5a3c79-ab29-46c7-b480-36954adcc661', 'ru', 'Однодневная поездка в Луксор с полетом на воздушном шаре и ночевкой в отеле из Хургады
---ЦЭП---
Познакомьтесь с Луксором, совершив полет на воздушном шаре, разместившись в отеле, посетив Долину царей, храм Хатшепсут, Колоссы Мемнона и Карнакский храм. Включает немецкоязычного египтолога, входные билеты, трансфер и полет на воздушном шаре на рассвете.
---ЦЭП---
Культура и достопримечательности
---ЦЭП---
Хургада - Красное море - Египет
---ЦЭП---
1 день
---ЦЭП---
<table class="tour-pricing-table"><thead> Микроавтобус</td><td>270 евро на человека</td></tr><tr><td>5 - 6 человек</td><td>Частный микроавтобус</td><td>240 евро на человека</td></tr><tr><td>7 - 8 человек</td><td>Частный микроавтобус</td><td>220 евро на человека человек</td></tr></tbody></table>
Откройте для себя один из самых впечатляющих культурных туров Египта с Hurghada Travel Planner. Этот двухдневный тур на воздушном шаре в Луксоре сочетает в себе историю, приключения и комфорт с ночевкой в ​​отеле в Луксоре.





Тур включает в себя полет на воздушном шаре на рассвете, Долину царей, Храм Хатшепсут, Колоссы Мемнона, Карнакский храм, проживание в отеле, ужин, завтрак, входные билеты, трансфер и услуги немецкоязычного египтолога.





Идеально подходит для гостей, которые не просто посещают Луксор ненадолго, но хотят непринужденно и интенсивно познакомиться с достопримечательностями древнего города.
---ЦЭП---
Полет на воздушном шаре над Луксором на рассвете - незабываемые панорамные виды на Нил
---РАЗДЕЛЕНИЕ---
Карнакский храм – крупнейшее религиозное сооружение древности.
---РАЗДЕЛЕНИЕ---
Долина царей – посетите три великолепные гробницы с оригинальными фресками.
---РАЗДЕЛЕНИЕ---
Храм Хатшепсут – шедевр самой могущественной женщины Египта
---РАЗДЕЛЕНИЕ---
Колоссы Мемнона – впечатляющие остатки храма Аменхотепа III.
---РАЗДЕЛЕНИЕ---
Ночевка в отеле, включая ужин и завтрак.
---ЦЭП---
Немецкоязычный египтолог в качестве гида.
---РАЗДЕЛЕНИЕ---
Входные билеты на все достопримечательности по программе.
---РАЗДЕЛЕНИЕ---
45-60 минут полета на воздушном шаре над Луксором
---РАЗДЕЛЕНИЕ---
Ночевка в отеле, включая ужин и завтрак.
---РАЗДЕЛЕНИЕ---
Все трансферы на автомобилях с кондиционером
---РАЗДЕЛЕНИЕ---
Все налоги и сборы за обслуживание
---ЦЭП---
Напитки в ресторане
---РАЗДЕЛЕНИЕ---
Личные расходы
---РАЗДЕЛЕНИЕ---
Доплата за трансфер для гостей из Марса Алама: 25 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер для гостей из Эль-Кусейра: 15 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из залива Макади и Сахл Хашиша: 5 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из Эль-Гуны, Сафаги и Сома-Бэй: 10 евро на человека.
---РАЗДЕЛЕНИЕ---
Гид на иностранном языке (английский, русский или французский): дополнительная плата 10 евро на человека.', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Fahrzeug</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Private Limousine</td><td>300 € p.P.</td></tr><tr><td>3 – 4 Personen</td><td>Privater Minibus</td><td>270 € p.P.</td></tr><tr><td>5 – 6 Personen</td><td>Privater Minibus</td><td>240 € p.P.</td></tr><tr><td>7 – 8 Personen</td><td>Privater Minibus</td><td>220 € p.P.</td></tr></tbody></table>
Entdecken Sie mit Hurghada Reiseplaner eine der beeindruckendsten Kulturreisen Ägyptens. Dieser 2-tägige Luxor-Ausflug mit Heißluftballonfahrt verbindet Geschichte, Abenteuer und Komfort mit einer Hotelübernachtung in Luxor.





Die Tour beinhaltet eine Heißluftballonfahrt bei Sonnenaufgang, das Tal der Könige, den Hatschepsut-Tempel, die Memnon-Kolosse, den Karnak-Tempel, Hotelübernachtung, Abendessen, Frühstück, Eintrittskarten, Transfers und einen deutschsprachigen Ägyptologen.





Ideal für Gäste, die Luxor nicht nur kurz besuchen, sondern die Höhepunkte der antiken Stadt entspannt und intensiv erleben möchten.', 'Erleben Sie Luxor mit Heißluftballonfahrt, Hotelübernachtung, Tal der Könige, Hatschepsut-Tempel, Memnon-Kolossen und Karnak-Tempel. Inklusive deutschsprachigem Ägyptologen, Eintrittskarten, Transfers und Ballonfahrt bei Sonnenaufgang.', 'Kultur & Sightseeing', '["Heißluftballonfahrt über Luxor bei Sonnenaufgang – unvergesslicher Panoramablick über den Nil","Karnak-Tempel – das größte religiöse Bauwerk der Antike","Tal der Könige – besuchen Sie drei prächtige Gräber mit originalen Wandmalereien","Hatschepsut-Tempel – das Meisterwerk der mächtigsten Frau Ägyptens","Memnon-Kolosse – beeindruckende Überreste des Tempels von Amenophis III.","Übernachtung im Hotel inklusive Abendessen & Frühstück"]'::jsonb, '["Deutschsprachiger Ägyptologe als Reiseleiter","Eintrittsgelder für alle Sehenswürdigkeiten laut Programm","45–60 Minuten Heißluftballonfahrt über Luxor","Übernachtung im Hotel inklusive Abendessen & Frühstück","Alle Transfers im klimatisierten Fahrzeug","Alle Steuern & Servicegebühren"]'::jsonb, '["Getränke im Restaurant","Persönliche Ausgaben","Transferzuschlag für Gäste aus Marsa Alam: 25 € pro Person","Transferzuschlag für Gäste aus El Quseir: 15 € pro Person","Transferzuschlag ab Makadi Bay & Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga & Soma Bay: 10 € pro Person","Fremdsprachiger Reiseleiter (Englisch, Russisch oder Französisch): Aufpreis 10 € pro Person"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '1 Tag', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '1c5a3c79-ab29-46c7-b480-36954adcc661', 'ar', 'رحلة نهارية في الأقصر مع ركوب منطاد الهواء الساخن وإقامة ليلية في الفندق من الغردقة
--- تسيب ---
استمتع بتجربة الأقصر من خلال ركوب منطاد الهواء الساخن والإقامة في الفنادق ووادي الملوك ومعبد حتشبسوت وتمثالي ممنون ومعبد الكرنك. تشمل الرحلة عالم المصريات الناطق باللغة الألمانية، وتذاكر الدخول، والانتقالات، وركوب منطاد شروق الشمس.
--- تسيب ---
الثقافة ومشاهدة المعالم السياحية
--- تسيب ---
الغردقة - البحر الأحمر - مصر
--- تسيب ---
يوم واحد
--- تسيب ---
<table class="tour-pricing-table"><thead> حافلة صغيرة</td><td>270 يورو للشخص الواحد</td></tr><tr><td>5 - 6 أشخاص</td><td>حافلة صغيرة خاصة</td><td>240 يورو للشخص الواحد</td></tr><tr><td>7 - 8 أشخاص</td><td>حافلة صغيرة خاصة</td><td>220 يورو للشخص الواحد شخص</td></tr></tbody></table>
اكتشف واحدة من الجولات الثقافية الأكثر إثارة للإعجاب في مصر مع Hurghada Travel Planner. تجمع جولة منطاد الهواء الساخن في الأقصر لمدة يومين بين التاريخ والمغامرة والراحة مع الإقامة في فندق في الأقصر.





تشمل الجولة ركوب منطاد الهواء الساخن عند شروق الشمس ووادي الملوك ومعبد حتشبسوت وتمثالي ممنون ومعبد الكرنك والإقامة في الفندق والعشاء والإفطار وتذاكر الدخول والانتقالات وعالم المصريات الناطق باللغة الألمانية.





مثالي للضيوف الذين لا يقومون بزيارة الأقصر لفترة قصيرة فحسب، بل يرغبون في تجربة أبرز معالم المدينة القديمة بطريقة مريحة ومكثفة.
--- تسيب ---
ركوب منطاد الهواء الساخن فوق الأقصر عند شروق الشمس - مناظر بانورامية لا تُنسى على نهر النيل
---تقسيم---
معبد الكرنك – أكبر مبنى ديني في العصور القديمة
---تقسيم---
وادي الملوك - قم بزيارة ثلاث مقابر رائعة ذات جداريات أصلية
---تقسيم---
معبد حتشبسوت – تحفة أقوى امرأة في مصر
---تقسيم---
تمثالا ممنون – بقايا رائعة من معبد أمنحتب الثالث.
---تقسيم---
- المبيت في الفندق شامل العشاء والإفطار
--- تسيب ---
عالم المصريات الناطق بالألمانية كمرشد سياحي
---تقسيم---
رسوم الدخول لجميع المعالم السياحية حسب البرنامج
---تقسيم---
ركوب منطاد الهواء الساخن لمدة 45-60 دقيقة فوق الأقصر
---تقسيم---
- المبيت في الفندق شامل العشاء والإفطار
---تقسيم---
- جميع التنقلات بسيارات مكيفة
---تقسيم---
جميع الضرائب ورسوم الخدمة
--- تسيب ---
المشروبات في المطعم
---تقسيم---
النفقات الشخصية
---تقسيم---
تكلفة النقل الإضافية للضيوف من مرسى علم: 25 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية للضيوف من القصير: 15 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية من خليج مكادي وسهل حشيش: 5 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية من الجونة وسفاجا وخليج سوما: 10 يورو للشخص الواحد
---تقسيم---
مرشد سياحي بلغة أجنبية (الإنجليزية أو الروسية أو الفرنسية): رسوم إضافية 10 يورو للشخص الواحد', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Fahrzeug</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Private Limousine</td><td>300 € p.P.</td></tr><tr><td>3 – 4 Personen</td><td>Privater Minibus</td><td>270 € p.P.</td></tr><tr><td>5 – 6 Personen</td><td>Privater Minibus</td><td>240 € p.P.</td></tr><tr><td>7 – 8 Personen</td><td>Privater Minibus</td><td>220 € p.P.</td></tr></tbody></table>
Entdecken Sie mit Hurghada Reiseplaner eine der beeindruckendsten Kulturreisen Ägyptens. Dieser 2-tägige Luxor-Ausflug mit Heißluftballonfahrt verbindet Geschichte, Abenteuer und Komfort mit einer Hotelübernachtung in Luxor.





Die Tour beinhaltet eine Heißluftballonfahrt bei Sonnenaufgang, das Tal der Könige, den Hatschepsut-Tempel, die Memnon-Kolosse, den Karnak-Tempel, Hotelübernachtung, Abendessen, Frühstück, Eintrittskarten, Transfers und einen deutschsprachigen Ägyptologen.





Ideal für Gäste, die Luxor nicht nur kurz besuchen, sondern die Höhepunkte der antiken Stadt entspannt und intensiv erleben möchten.', 'Erleben Sie Luxor mit Heißluftballonfahrt, Hotelübernachtung, Tal der Könige, Hatschepsut-Tempel, Memnon-Kolossen und Karnak-Tempel. Inklusive deutschsprachigem Ägyptologen, Eintrittskarten, Transfers und Ballonfahrt bei Sonnenaufgang.', 'Kultur & Sightseeing', '["Heißluftballonfahrt über Luxor bei Sonnenaufgang – unvergesslicher Panoramablick über den Nil","Karnak-Tempel – das größte religiöse Bauwerk der Antike","Tal der Könige – besuchen Sie drei prächtige Gräber mit originalen Wandmalereien","Hatschepsut-Tempel – das Meisterwerk der mächtigsten Frau Ägyptens","Memnon-Kolosse – beeindruckende Überreste des Tempels von Amenophis III.","Übernachtung im Hotel inklusive Abendessen & Frühstück"]'::jsonb, '["Deutschsprachiger Ägyptologe als Reiseleiter","Eintrittsgelder für alle Sehenswürdigkeiten laut Programm","45–60 Minuten Heißluftballonfahrt über Luxor","Übernachtung im Hotel inklusive Abendessen & Frühstück","Alle Transfers im klimatisierten Fahrzeug","Alle Steuern & Servicegebühren"]'::jsonb, '["Getränke im Restaurant","Persönliche Ausgaben","Transferzuschlag für Gäste aus Marsa Alam: 25 € pro Person","Transferzuschlag für Gäste aus El Quseir: 15 € pro Person","Transferzuschlag ab Makadi Bay & Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga & Soma Bay: 10 € pro Person","Fremdsprachiger Reiseleiter (Englisch, Russisch oder Französisch): Aufpreis 10 € pro Person"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '1 Tag', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '1c5a3c79-ab29-46c7-b480-36954adcc661', 'hu', 'Egynapos luxori kirándulás hőlégballonozással és egy éjszakás szállodával Hurghadából', '<table class="tour-pricing-table"><thead> Mikrobusz</td><td>270 €/fő</td></tr><tr><td>5-6 fő</td><td>Privát kisbusz</td><td>240 €/fő</td></tr><tr><td>7-8 fő/személyes minibusz</td><d20>Privát minibusz</td><d20> személy</td></tr></tbody></table>
Fedezze fel Egyiptom egyik leglenyűgözőbb kulturális túráját a Hurghada Travel Planner segítségével. Ez a 2 napos luxori hőlégballonos túra a történelmet, a kalandot és a kényelmet ötvözi egy éjszakás luxori szállodai tartózkodással.





A túra magában foglalja a napfelkelte hőlégballonozást, a Királyok Völgyét, Hatsepszut Templomot, Memnoni Kolosszusokat, Karnaki Templomot, szállodai szállást, vacsorát, reggelit, belépőjegyeket, transzfereket és egy németül beszélő egyiptológust.





Ideális azoknak a vendégeknek, akik nem csak rövid időre látogatnak el Luxorba, hanem lazán és intenzíven szeretnék megtapasztalni az ősi város fénypontjait.', 'Tapasztalja meg Luxort a hőlégballonos utazással, a szállodai szállással, a Királyok völgyével, a Hatsepszut-templommal, a Memnoni kolosszusokkal és a Karnak-templommal. Tartalmazza a németül beszélő egyiptológust, a belépőjegyeket, a transzfereket és a napkelte ballonos utazást.', 'Kultúra és városnézés', '["Hőlégballonos utazás Luxor felett napkeltekor - felejthetetlen panoráma a Nílusra","A karnaki templom az ókor legnagyobb vallási épülete","A Királyok Völgye – látogassa meg három csodálatos síremléket eredeti falfestményekkel","Hatsepszut temploma – Egyiptom leghatalmasabb nőjének remekműve","Memnoni kolosszusok – Amenhotep III. templomának lenyűgöző maradványai.","Éjszaka a szállodában vacsorával és reggelivel"]'::jsonb, '["Németül beszélő egyiptológus, mint idegenvezető","Belépődíjak minden látnivalóra a program szerint","45-60 perc hőlégballon utazás Luxor felett","Éjszaka a szállodában vacsorával és reggelivel","Minden transzfer légkondicionált járművel","Minden adó és szolgáltatási díj"]'::jsonb, '["Italok az étteremben","Személyi kiadások","Transzfer felár Marsa Alamból: 25 € személyenként","Transzfer felár El Quseirből: 15 € személyenként","Transzfer felára a Makadi Bay & Sahl Hasheesh területéről: 5 euró személyenként","Transzfer felára El Gouna, Safaga és Soma Bay területéről: 10 € személyenként","Idegen nyelvű túravezető (angol, orosz vagy francia): felár 10 € személyenként"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '1 nap', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '4f91f20d-ead4-4473-8700-371d4cb5fc4e', 'en', '🛍️ Hurghada Shopping Tour – free bazaar excursion with transfer', '<table class="tour-pricing-table"><thead><tr><th>Participant</th><th>Vehicle</th><th>Price per person</th></tr></thead><tbody><tr><td>2 people</td><td>Private limousine</td><td>free of charge</td></tr><tr><td>3 – 4 people</td><td>Private Minibus</td><td>free</td></tr><tr><td>5 - 6 people</td><td>Private minibus</td><td>free</td></tr><tr><td>7 - 8 people</td><td>Private minibus</td><td>free</td></tr></tbody></table>
Welcome to Hurghada Travel Planner – experience Hurghada with a free shopping tour to the traditional bazaar.





We will conveniently pick you up from your hotel and take you directly to the Hurghada bazaar. There you have free time to shop, explore and stroll. You will find souvenirs, spices, perfume oils, leather goods, jewelry, papyrus and handicrafts.





This tour is ideal for guests who want to experience Hurghada outside of the hotel and get a real taste of local market life. After shopping, we will bring you safely back to your hotel.', 'Free shopping trip to Hurghada Bazaar with transfer', 'Culture & sightseeing', '["Free shopping tour with hotel transfer","Visit to a famous bazaar in Hurghada","Souvenirs, spices, perfume oils, leather goods & jewelry","Free time for shopping and strolling","Ideal for families, couples & those interested in culture"]'::jsonb, '["Hotel transfer there and back","Private or comfortable transfer","Free time at the bazaar","Accompaniment/organization by Hurghada travel planner"]'::jsonb, '["Personal expenses","Shopping and souvenirs","Tipping voluntary"]'::jsonb, 'Hurghada - Red Sea - Egypt', '3h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '4f91f20d-ead4-4473-8700-371d4cb5fc4e', 'fr', '🛍️ Hurghada Shopping Tour – excursion gratuite au bazar avec transfert', '<table class="tour-pricing-table"><thead><tr><th>Participant</th><th>Véhicule</th><th>Prix par personne</th></tr></thead><tbody><tr><td>2 personnes</td><td>Limousine privée</td><td>gratuit</td></tr><tr><td>3 – 4 personnes</td><td>Privé Minibus</td><td>Gratuit</td></tr><tr><td>5 - 6 personnes</td><td>Minibus privé</td><td>Gratuit</td></tr><tr><td>7 - 8 personnes</td><td>Minibus privé</td><td>Gratuit</td></tr></tbody></table>
Bienvenue sur Hurghada Travel Planner – découvrez Hurghada avec une visite shopping gratuite au bazar traditionnel.





Nous viendrons vous chercher à votre hôtel et vous emmènerons directement au bazar d''Hurghada. Là, vous aurez du temps libre pour faire du shopping, explorer et vous promener. Vous y trouverez des souvenirs, des épices, des huiles de parfum, de la maroquinerie, des bijoux, du papyrus et de l''artisanat.





Cette visite est idéale pour les clients qui souhaitent découvrir Hurghada en dehors de l''hôtel et avoir un véritable aperçu de la vie du marché local. Après vos achats, nous vous ramènerons en toute sécurité à votre hôtel.', 'Sortie shopping gratuite au bazar d''Hurghada avec transfert', 'Culture et tourisme', '["Visite shopping gratuite avec transfert à l''hôtel","Visite d''un célèbre bazar à Hurghada","Souvenirs, épices, huiles de parfum, maroquinerie et bijoux","Temps libre pour faire du shopping et flâner","Idéal pour les familles, les couples et les personnes intéressées par la culture"]'::jsonb, '["Transfert hôtel aller-retour","Transfert privé ou confortable","Temps libre au bazar","Accompagnement/organisation par le planificateur de voyage Hurghada"]'::jsonb, '["Dépenses personnelles","Shopping et souvenirs","Pourboire volontaire"]'::jsonb, 'Hurghada - Mer Rouge - Egypte', '3h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '4f91f20d-ead4-4473-8700-371d4cb5fc4e', 'ru', '🛍️ Шопинг-тур по Хургаде – бесплатная экскурсия по базару с трансфером.
---ЦЭП---
Бесплатная поездка за покупками на базар Хургады с трансфером
---ЦЭП---
Культура и достопримечательности
---ЦЭП---
Хургада - Красное море - Египет
---ЦЭП---
3 часа
---ЦЭП---
<table class="tour-pricing-table"><thead><tr><th>Участник</th><th>Автомобиль</th><th>Цена на человека</th></tr></thead><tbody><tr><td>2 человека</td><td>Частный лимузин</td><td>бесплатно</td></tr><tr><td>3 – 4 человека</td><td>Частный Микроавтобус</td><td>бесплатно</td></tr><tr><td>5 - 6 человек</td><td>Частный микроавтобус</td><td>бесплатно</td></tr><tr><td>7 - 8 человек</td><td>Частный микроавтобус</td><td>бесплатно</td></tr></tbody></table>
Добро пожаловать в Hurghada Travel Planner – откройте для себя Хургаду, совершив бесплатный шопинг-тур на традиционный базар.





Мы удобно заберем вас из отеля и отвезем прямо на базар Хургады. Там у вас есть свободное время для покупок, прогулок и прогулок. Вы найдете сувениры, специи, парфюмерные масла, изделия из кожи, ювелирные изделия, папирус и изделия ручной работы.





Этот тур идеально подходит для гостей, которые хотят познакомиться с Хургадой за пределами отеля и по-настоящему ощутить вкус местной рыночной жизни. После покупок мы благополучно доставим вас обратно в отель.
---ЦЭП---
Бесплатный шопинг-тур с трансфером из отеля
---РАЗДЕЛЕНИЕ---
Посещение знаменитого базара в Хургаде.
---РАЗДЕЛЕНИЕ---
Сувениры, специи, парфюмерные масла, изделия из кожи и ювелирные изделия.
---РАЗДЕЛЕНИЕ---
Свободное время для покупок и прогулок.
---РАЗДЕЛЕНИЕ---
Идеально подходит для семей, пар и тех, кто интересуется культурой
---ЦЭП---
Трансфер из отеля туда и обратно
---РАЗДЕЛЕНИЕ---
Индивидуальный или комфортабельный трансфер
---РАЗДЕЛЕНИЕ---
Свободное время на базаре
---РАЗДЕЛЕНИЕ---
Сопровождение/организация турагентом по Хургаде
---ЦЭП---
Личные расходы
---РАЗДЕЛЕНИЕ---
Шоппинг и сувениры
---РАЗДЕЛЕНИЕ---
Чаевые добровольные', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Fahrzeug</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Private Limousine</td><td>kostenlos</td></tr><tr><td>3 – 4 Personen</td><td>Privater Minibus</td><td>kostenlos</td></tr><tr><td>5 – 6 Personen</td><td>Privater Minibus</td><td>kostenlos</td></tr><tr><td>7 – 8 Personen</td><td>Privater Minibus</td><td>kostenlos</td></tr></tbody></table>
Willkommen bei Hurghada Reiseplaner – erleben Sie Hurghada bei einer kostenlosen Shopping Tour zum traditionellen Basar.





Wir holen Sie bequem von Ihrem Hotel ab und bringen Sie direkt zum Basar von Hurghada. Dort haben Sie freie Zeit zum Einkaufen, Entdecken und Bummeln. Sie finden Souvenirs, Gewürze, Parfümöle, Lederwaren, Schmuck, Papyrus und Kunsthandwerk.





Diese Tour ist ideal für Gäste, die Hurghada außerhalb des Hotels erleben und echte Eindrücke vom lokalen Marktleben sammeln möchten. Nach dem Einkauf bringen wir Sie wieder sicher zurück zu Ihrem Hotel.', 'Kostenloser Shopping-Ausflug zum Basar von Hurghada mit Transfer', 'Kultur & Sightseeing', '["Kostenlose Shopping Tour mit Hoteltransfer","Besuch eines bekannten Basars in Hurghada","Souvenirs, Gewürze, Parfümöle, Lederwaren & Schmuck","Freie Zeit zum Einkaufen und Bummeln","Ideal für Familien, Paare & Kulturinteressierte"]'::jsonb, '["Hoteltransfer hin und zurück","Privater oder komfortabler Transfer","Freie Zeit auf dem Basar","Begleitung/Organisation durch Hurghada Reiseplaner"]'::jsonb, '["Persönliche Ausgaben","Einkäufe und Souvenirs","Trinkgeld freiwillig"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '3h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '4f91f20d-ead4-4473-8700-371d4cb5fc4e', 'hu', '🛍️ Hurghada Shopping Tour – ingyenes bazári kirándulás transzferrel', '<table class="tour-pricing-table"><thead><tr><th>Részvevő</th><th>Gépjármű</th><th>Ár személyenként</th></tr></thead><tbody><tr><td>2 fő</td><td>Privát limuzin</td><td>ingyenes</td></tr><tdd>privát</td></tr><td>fő Minibusz</td><td>ingyenes</td></tr><tr><td>5 - 6 fő</td><td>Privát mikrobusz</td><td>ingyenes</td></tr><tr><td>7 - 8 fő</td><td>Privát mikrobusz</td><td>ingyenes</td></tr></tbody></table>
Üdvözöljük a Hurghada Travel Planner oldalán – tapasztalja meg Hurghadát egy ingyenes bevásárló körúttal a hagyományos bazárba.





Kényelmesen felvesszük a szállodából, és közvetlenül a Hurghada bazárba visszük. Itt van szabad ideje vásárolni, felfedezni és sétálni. Ajándéktárgyak, fűszerek, parfümolajok, bőráruk, ékszerek, papirusz és kézműves termékek találhatók.





Ez a túra ideális azoknak a vendégeknek, akik a szállodán kívül szeretnék megtapasztalni Hurghadát, és igazi ízelítőt szeretnének kapni a helyi piac életéből. Vásárlás után biztonságban visszavisszük szállodájába.', 'Ingyenes bevásárlási kirándulás a Hurghada Bazárba transzferrel', 'Kultúra és városnézés', '["Ingyenes bevásárló túra szállodai transzferrel","Látogatás egy híres bazárban Hurghadában","Ajándéktárgyak, fűszerek, parfümolajok, bőráruk és ékszerek","Szabadidő vásárlásra, sétákra","Ideális családoknak, pároknak és a kultúra iránt érdeklődőknek"]'::jsonb, '["Szállodai transzfer oda-vissza","Privát vagy kényelmes transzfer","Szabadidő a bazárban","Kíséret/szervezés Hurghada utazásszervezője"]'::jsonb, '["Személyi kiadások","Vásárlás és ajándéktárgyak","Önkéntes borravaló"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '3 óra', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '4f91f20d-ead4-4473-8700-371d4cb5fc4e', 'ar', '🛍️ جولة تسوق بالغردقة – رحلة مجانية في البازار مع الانتقالات
--- تسيب ---
رحلة تسوق مجانية إلى بازار الغردقة مع النقل
--- تسيب ---
الثقافة ومشاهدة المعالم السياحية
--- تسيب ---
الغردقة - البحر الأحمر - مصر
--- تسيب ---
3 ساعات
--- تسيب ---
<table class="tour-pricing-table"><thead><tr><th>المشارك</th><th>المركبة</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخصين</td><td>سيارة ليموزين خاصة</td><td>مجانًا</td></tr><tr><td>3 - 4 أشخاص</td><td>خاص حافلة صغيرة</td><td>مجانية</td></tr><tr><td>5 - 6 أشخاص</td><td>حافلة صغيرة خاصة</td><td>مجانية</td></tr><tr><td>7 - 8 أشخاص</td><td>حافلة صغيرة خاصة</td><td>مجانية</td></tr></tbody></table>
مرحبًا بكم في Hurghada Travel Planner - استمتع بتجربة الغردقة من خلال جولة تسوق مجانية في البازار التقليدي.





سننقلك بسهولة من فندقك ونأخذك مباشرة إلى بازار الغردقة. هناك لديك وقت فراغ للتسوق والاستكشاف والتنزه. سوف تجد الهدايا التذكارية والتوابل والزيوت العطرية والمصنوعات الجلدية والمجوهرات وورق البردي والمشغولات اليدوية.





هذه الجولة مثالية للضيوف الذين يرغبون في تجربة الغردقة خارج الفندق والحصول على طعم حقيقي لحياة السوق المحلية. بعد التسوق، سنعيدك بأمان إلى فندقك.
--- تسيب ---
جولة تسوق مجانية مع النقل من الفندق
---تقسيم---
زيارة أحد البازارات الشهيرة في الغردقة
---تقسيم---
الهدايا التذكارية والتوابل والزيوت العطرية والمصنوعات الجلدية والمجوهرات
---تقسيم---
- وقت حر للتسوق والتنزه
---تقسيم---
مثالي للعائلات والأزواج والمهتمين بالثقافة
--- تسيب ---
نقل الفندق هناك والعودة
---تقسيم---
نقل خاص أو مريح
---تقسيم---
وقت حر في البازار
---تقسيم---
المرافقة/التنظيم من قبل مخطِّط رحلات الغردقة
--- تسيب ---
النفقات الشخصية
---تقسيم---
التسوق والهدايا التذكارية
---تقسيم---
البقشيش طوعي', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Fahrzeug</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Private Limousine</td><td>kostenlos</td></tr><tr><td>3 – 4 Personen</td><td>Privater Minibus</td><td>kostenlos</td></tr><tr><td>5 – 6 Personen</td><td>Privater Minibus</td><td>kostenlos</td></tr><tr><td>7 – 8 Personen</td><td>Privater Minibus</td><td>kostenlos</td></tr></tbody></table>
Willkommen bei Hurghada Reiseplaner – erleben Sie Hurghada bei einer kostenlosen Shopping Tour zum traditionellen Basar.





Wir holen Sie bequem von Ihrem Hotel ab und bringen Sie direkt zum Basar von Hurghada. Dort haben Sie freie Zeit zum Einkaufen, Entdecken und Bummeln. Sie finden Souvenirs, Gewürze, Parfümöle, Lederwaren, Schmuck, Papyrus und Kunsthandwerk.





Diese Tour ist ideal für Gäste, die Hurghada außerhalb des Hotels erleben und echte Eindrücke vom lokalen Marktleben sammeln möchten. Nach dem Einkauf bringen wir Sie wieder sicher zurück zu Ihrem Hotel.', 'Kostenloser Shopping-Ausflug zum Basar von Hurghada mit Transfer', 'Kultur & Sightseeing', '["Kostenlose Shopping Tour mit Hoteltransfer","Besuch eines bekannten Basars in Hurghada","Souvenirs, Gewürze, Parfümöle, Lederwaren & Schmuck","Freie Zeit zum Einkaufen und Bummeln","Ideal für Familien, Paare & Kulturinteressierte"]'::jsonb, '["Hoteltransfer hin und zurück","Privater oder komfortabler Transfer","Freie Zeit auf dem Basar","Begleitung/Organisation durch Hurghada Reiseplaner"]'::jsonb, '["Persönliche Ausgaben","Einkäufe und Souvenirs","Trinkgeld freiwillig"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '3h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '69aa0c36-125f-4f41-8502-55a8f4fd6d98', 'en', 'Orange Bay Island Snorkeling Trip with Water Sports from Hurghada', '<table class="tour-pricing-table"><thead><tr><th>Price</th><th>Trip type</th><th>Trip start</th><th>Pick-up</th></tr></thead><tbody><tr><td>From 35 € per person</td><td>Group tour</td><td>daily</td><td>approx. 8:00 a.m.</td></tr></tbody></table>
The Orange Bay Island snorkeling trip with water sports from Hurghada is one of the most exclusive and most booked day trips in the Red Sea. The island of Orange Bay is located in the protected Giftun National Park and is one of Egypt''s most beautiful natural destinations.





Fine white sand, turquoise water and colorful coral reefs create a unique backdrop for a perfect day of vacation. This excursion combines high-quality snorkeling, relaxing hours on a paradise island and professional water sports activities - accompanied by first-class service, private transfer and a German-speaking tour guide.





An ideal experience for travelers who value quality, comfort, safety and authentic nature experiences.





Orange Bay is considered the “Caribbean of Egypt” and delights visitors with its white sandy beach, crystal clear water and a unique underwater world. The trip is ideal for families, couples, groups and snorkeling beginners.', 'Snorkeling and water sports trip to Orange Bay Island in Giftun National Park – white sand, turquoise water and first-class service.', NULL, '["Beautiful Orange Bay Island in Giftun National Park","One of the most popular snorkeling trips in Hurghada","Two snorkeling stops on world-class coral reefs","Crystal clear water & diverse underwater world","Water sports included: Banana Boat & Sofa Boat","Relaxation on the white sandy beach with sun loungers","Lunch & non-alcoholic drinks included","Private hotel transfer in an air-conditioned vehicle","High quality boats","Ideal for families, couples and groups","Orange Bay – the Caribbean of the Red Sea"]'::jsonb, '["Hotel pickup & drop-off in Hurghada (private & air-conditioned)","Boat trip to Orange Bay Island","Two snorkel stops","Complete snorkeling equipment (mask, fins, snorkel, life jacket)","Stay on Orange Bay Island","Lunch","Non-alcoholic drinks","Water sports (Banana Boat & Sofa Boat)","National park fees"]'::jsonb, '["Personal expenses","Additional drinks or snacks","Transfer surcharges for certain regions"]'::jsonb, 'Hurghada - Red Sea - Egypt', '4h', NULL, NULL, NULL, NULL, '[{"question":"Private speedboat tour to Orange Bay from Hurghada – snorkeling & island trip","answer":"LocationHurghada Duration6 hours Private speedboat tour to Orange Bay from Hurghada... from €60.00"}]'::jsonb),
('tours', '69aa0c36-125f-4f41-8502-55a8f4fd6d98', 'ru', 'Поездка на остров Ориндж Бэй с подводным плаванием и водными видами спорта из Хургады
---ЦЭП---
Поездка с сноркелингом и водными видами спорта на остров Ориндж Бэй в национальном парке Гифтун – белый песок, бирюзовая вода и первоклассный сервис.
---ЦЭП---
Хургада - Красное море - Египет
---ЦЭП---
4 часа
---ЦЭП---
<table class="tour-pricing-table"><thead><tr><th>Цена</th><th>Тип поездки</th><th>Начало поездки</th><th>Самовывоз</th></tr></thead><tbody><tr><td>От 35 евро на человека</td><td>Групповой тур</td><td>ежедневно</td><td>ок. 8:00 утра</td></tr></tbody></table>
Поездка на остров Ориндж-Бей с водными видами спорта из Хургады — одна из самых эксклюзивных и наиболее часто заказываемых однодневных поездок на Красном море. Остров Ориндж Бэй расположен на территории охраняемого национального парка Гифтун и является одним из самых красивых природных мест Египта.





Мелкий белый песок, бирюзовая вода и красочные коралловые рифы создают уникальный фон для идеального дня отпуска. Эта экскурсия сочетает в себе высококачественный подводное плавание, часы отдыха на райском острове и профессиональные занятия водными видами спорта - в сопровождении первоклассного обслуживания, частного трансфера и немецкоязычного гида.





Идеальный опыт для путешественников, которые ценят качество, комфорт, безопасность и аутентичные впечатления от природы.





Оранжевый залив считается «Карибским морем Египта» и радует посетителей своим белым песчаным пляжем, кристально чистой водой и уникальным подводным миром. Поездка идеально подходит для семей, пар, групп и новичков в подводном плавании.
---ЦЭП---
Красивый остров Ориндж-Бей в национальном парке Гифтун
---РАЗДЕЛЕНИЕ---
Одна из самых популярных поездок для подводного плавания в Хургаде.
---РАЗДЕЛЕНИЕ---
Две остановки для подводного плавания на коралловых рифах мирового класса
---РАЗДЕЛЕНИЕ---
Кристально чистая вода и разнообразный подводный мир
---РАЗДЕЛЕНИЕ---
Водные виды спорта включены: лодка-банан и лодка-диван.
---РАЗДЕЛЕНИЕ---
Отдых на белом песчаном пляже с шезлонгами
---РАЗДЕЛЕНИЕ---
Обед и безалкогольные напитки включены
---РАЗДЕЛЕНИЕ---
Частный трансфер из отеля на автомобиле с кондиционером.
---РАЗДЕЛЕНИЕ---
Лодки высокого качества
---РАЗДЕЛЕНИЕ---
Идеально подходит для семей, пар и групп
---РАЗДЕЛЕНИЕ---
Оранжевый залив – Карибское море Красного моря
---ЦЭП---
Встреча и выезд из отеля в Хургаде (частный и с кондиционером)
---РАЗДЕЛЕНИЕ---
Поездка на лодке к острову Ориндж Бэй
---РАЗДЕЛЕНИЕ---
Две остановки для сноркелинга
---РАЗДЕЛЕНИЕ---
Полное снаряжение для подводного плавания (маска, ласты, трубка, спасательный жилет)
---РАЗДЕЛЕНИЕ---
Пребывание на острове Ориндж-Бей
---РАЗДЕЛЕНИЕ---
Обед
---РАЗДЕЛЕНИЕ---
Безалкогольные напитки
---РАЗДЕЛЕНИЕ---
Водные виды спорта (лодка-банан и лодка-диван)
---РАЗДЕЛЕНИЕ---
Сборы национального парка
---ЦЭП---
Личные расходы
---РАЗДЕЛЕНИЕ---
Дополнительные напитки или закуски
---РАЗДЕЛЕНИЕ---
Комиссия за трансфер для определенных регионов
---ЦЭП---
Частный тур на скоростном катере в Оранжевый залив из Хургады – подводное плавание и поездка на остров
---ЦЭП---
МестоположениеХургада Продолжительность: 6 часов Частный тур на скоростном катере в Оранжевый залив из Хургады... от 60,00 евро.', '<table class="tour-pricing-table"><thead><tr><th>Preis</th><th>Reisetyp</th><th>Reiseantritt</th><th>Abholung</th></tr></thead><tbody><tr><td>Ab 35 € p.P.</td><td>Gruppentour</td><td>täglich</td><td>ca. 8:00 Uhr</td></tr></tbody></table>
Der Orange Bay Island Schnorchelausflug mit Wassersport ab Hurghada zählt zu den exklusivsten und meistgebuchten Tagesausflügen im Roten Meer. Die Insel Orange Bay liegt im geschützten Giftun-Nationalpark und gehört zu den schönsten Naturzielen Ägyptens.





Feiner weißer Sand, türkisfarbenes Wasser und farbenprächtige Korallenriffe schaffen eine einzigartige Kulisse für einen perfekten Urlaubstag. Dieser Ausflug verbindet hochwertiges Schnorcheln, entspannte Stunden auf einer paradiesischen Insel und professionelle Wassersportaktivitäten – begleitet von erstklassigem Service, privatem Transfer und deutschsprachiger Reiseleitung.





Ein ideales Erlebnis für Reisende, die Qualität, Komfort, Sicherheit und authentische Naturerlebnisse schätzen.





Orange Bay gilt als die „Karibik Ägyptens“ und begeistert Besucher mit weißem Sandstrand, kristallklarem Wasser und einer einzigartigen Unterwasserwelt. Der Ausflug eignet sich ideal für Familien, Paare, Gruppen und Schnorchel-Anfänger.', 'Schnorchel- und Wassersportausflug zur Orange Bay Insel im Giftun-Nationalpark – weißer Sand, türkises Wasser und erstklassiger Service.', NULL, '["Traumhafte Orange Bay Island im Giftun-Nationalpark","Einer der beliebtesten Schnorchelausflüge in Hurghada","Zwei Schnorchelstopps an erstklassigen Korallenriffen","Kristallklares Wasser & vielfältige Unterwasserwelt","Wassersport inklusive: Banana Boat & Sofa Boat","Entspannung am weißen Sandstrand mit Sonnenliegen","Mittagessen & alkoholfreie Getränke inklusive","Privater Hoteltransfer im klimatisierten Fahrzeug","Hochwertige Boote","Ideal für Familien, Paare und Gruppen","Orange Bay – die Karibik des Roten Meeres"]'::jsonb, '["Hotelabholung & Rücktransfer in Hurghada (privat & klimatisiert)","Bootsfahrt zur Orange Bay Island","Zwei Schnorchelstopps","Komplette Schnorchelausrüstung (Maske, Flossen, Schnorchel, Schwimmweste)","Aufenthalt auf Orange Bay Island","Mittagessen","Alkoholfreie Getränke","Wassersport (Banana Boat & Sofa Boat)","Nationalparkgebühren"]'::jsonb, '["Persönliche Ausgaben","Zusätzliche Getränke oder Snacks","Transferzuschläge für bestimmte Regionen"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '4h', NULL, NULL, NULL, NULL, '[{"question":"Private Speedboot Tour zur Orange Bay ab Hurghada – Schnorcheln & Inseltrip","answer":"LocationHurghada Dauer6 Stunden Private Speedboot Tour zur Orange Bay ab Hurghada... ab60.00 &euro;"}]'::jsonb),
('tours', '69aa0c36-125f-4f41-8502-55a8f4fd6d98', 'ar', 'رحلة الغطس في جزيرة أورانج باي مع الرياضات المائية من الغردقة
--- تسيب ---
رحلة غطس ورياضات مائية إلى جزيرة أورانج باي في منتزه الجفتون الوطني - رمال بيضاء ومياه فيروزية وخدمة من الدرجة الأولى.
--- تسيب ---
الغردقة - البحر الأحمر - مصر
--- تسيب ---
4 ساعات
--- تسيب ---
<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>بداية الرحلة</th><th>البيك اب</th></tr></thead><tbody><tr><td>من 35 يورو للشخص الواحد</td><td>جولة جماعية</td><td>يوميًا</td><td>تقريبًا. 8:00 صباحًا</td></tr></tbody></table>
تعد رحلة الغطس في جزيرة أورانج باي مع الرياضات المائية من الغردقة واحدة من أكثر الرحلات اليومية تميزًا وأكثرها حجزًا في البحر الأحمر. تقع جزيرة أورانج باي في محمية الجفتون الوطنية، وتعد من أجمل الوجهات الطبيعية في مصر.





تشكل الرمال البيضاء الناعمة والمياه الفيروزية والشعاب المرجانية الملونة خلفية فريدة لقضاء يوم مثالي في العطلة. تجمع هذه الرحلة بين الغطس عالي الجودة وساعات الاسترخاء في جزيرة الفردوس وأنشطة الرياضات المائية الاحترافية - مصحوبة بخدمة من الدرجة الأولى ونقل خاص ودليل سياحي ناطق باللغة الألمانية.





تجربة مثالية للمسافرين الذين يقدرون الجودة والراحة والسلامة وتجارب الطبيعة الأصيلة.





يعتبر أورانج باي "البحر الكاريبي في مصر" ويسعد الزوار بشاطئه الرملي الأبيض ومياهه الصافية وعالمه الفريد تحت الماء. الرحلة مثالية للعائلات والأزواج والمجموعات ومبتدئي الغطس.
--- تسيب ---
جزيرة أورانج باي الجميلة في منتزه الجفتون الوطني
---تقسيم---
من أشهر رحلات الغطس في الغردقة
---تقسيم---
محطتان للغطس على الشعاب المرجانية ذات المستوى العالمي
---تقسيم---
مياه صافية وعالم متنوع تحت الماء
---تقسيم---
تشمل الرياضات المائية: قارب الموزة وقارب الأريكة
---تقسيم---
الاسترخاء على الشاطئ الرملي الأبيض مع كراسي التشمس
---تقسيم---
شامل الغداء والمشروبات غير الكحولية
---تقسيم---
الإنتقالات الخاصة بالفندق بسيارة مكيفة
---تقسيم---
قوارب عالية الجودة
---تقسيم---
مثالية للعائلات والأزواج والمجموعات
---تقسيم---
أورانج باي – منطقة البحر الكاريبي للبحر الأحمر
--- تسيب ---
النقل من والى الفندق في الغردقة (خاص ومكيف)
---تقسيم---
رحلة بالقارب إلى جزيرة أورانج باي
---تقسيم---
توقفين للغطس
---تقسيم---
معدات الغطس الكاملة (القناع، الزعانف، الغطس، سترة النجاة)
---تقسيم---
البقاء في جزيرة أورانج باي
---تقسيم---
الغداء
---تقسيم---
المشروبات غير الكحولية
---تقسيم---
الرياضات المائية (قارب الموز وقارب الأريكة)
---تقسيم---
رسوم الحديقة الوطنية
--- تسيب ---
النفقات الشخصية
---تقسيم---
مشروبات أو وجبات خفيفة إضافية
---تقسيم---
تحويل الرسوم الإضافية لمناطق معينة
--- تسيب ---
جولة خاصة بالقارب السريع إلى أورانج باي من الغردقة - رحلة الغطس والجزيرة
--- تسيب ---
الموقعالغردقة المدة 6 ساعات جولة خاصة بالقارب السريع إلى أورانج باي من الغردقة... تبدأ من 60.00 يورو', '<table class="tour-pricing-table"><thead><tr><th>Preis</th><th>Reisetyp</th><th>Reiseantritt</th><th>Abholung</th></tr></thead><tbody><tr><td>Ab 35 € p.P.</td><td>Gruppentour</td><td>täglich</td><td>ca. 8:00 Uhr</td></tr></tbody></table>
Der Orange Bay Island Schnorchelausflug mit Wassersport ab Hurghada zählt zu den exklusivsten und meistgebuchten Tagesausflügen im Roten Meer. Die Insel Orange Bay liegt im geschützten Giftun-Nationalpark und gehört zu den schönsten Naturzielen Ägyptens.





Feiner weißer Sand, türkisfarbenes Wasser und farbenprächtige Korallenriffe schaffen eine einzigartige Kulisse für einen perfekten Urlaubstag. Dieser Ausflug verbindet hochwertiges Schnorcheln, entspannte Stunden auf einer paradiesischen Insel und professionelle Wassersportaktivitäten – begleitet von erstklassigem Service, privatem Transfer und deutschsprachiger Reiseleitung.





Ein ideales Erlebnis für Reisende, die Qualität, Komfort, Sicherheit und authentische Naturerlebnisse schätzen.





Orange Bay gilt als die „Karibik Ägyptens“ und begeistert Besucher mit weißem Sandstrand, kristallklarem Wasser und einer einzigartigen Unterwasserwelt. Der Ausflug eignet sich ideal für Familien, Paare, Gruppen und Schnorchel-Anfänger.', 'Schnorchel- und Wassersportausflug zur Orange Bay Insel im Giftun-Nationalpark – weißer Sand, türkises Wasser und erstklassiger Service.', NULL, '["Traumhafte Orange Bay Island im Giftun-Nationalpark","Einer der beliebtesten Schnorchelausflüge in Hurghada","Zwei Schnorchelstopps an erstklassigen Korallenriffen","Kristallklares Wasser & vielfältige Unterwasserwelt","Wassersport inklusive: Banana Boat & Sofa Boat","Entspannung am weißen Sandstrand mit Sonnenliegen","Mittagessen & alkoholfreie Getränke inklusive","Privater Hoteltransfer im klimatisierten Fahrzeug","Hochwertige Boote","Ideal für Familien, Paare und Gruppen","Orange Bay – die Karibik des Roten Meeres"]'::jsonb, '["Hotelabholung & Rücktransfer in Hurghada (privat & klimatisiert)","Bootsfahrt zur Orange Bay Island","Zwei Schnorchelstopps","Komplette Schnorchelausrüstung (Maske, Flossen, Schnorchel, Schwimmweste)","Aufenthalt auf Orange Bay Island","Mittagessen","Alkoholfreie Getränke","Wassersport (Banana Boat & Sofa Boat)","Nationalparkgebühren"]'::jsonb, '["Persönliche Ausgaben","Zusätzliche Getränke oder Snacks","Transferzuschläge für bestimmte Regionen"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '4h', NULL, NULL, NULL, NULL, '[{"question":"Private Speedboot Tour zur Orange Bay ab Hurghada – Schnorcheln & Inseltrip","answer":"LocationHurghada Dauer6 Stunden Private Speedboot Tour zur Orange Bay ab Hurghada... ab60.00 &euro;"}]'::jsonb),
('tours', '69aa0c36-125f-4f41-8502-55a8f4fd6d98', 'hu', 'Orange Bay Island snorkeling kirándulás vízi sportokkal Hurghadából', '<table class="tour-pricing-table"><thead><tr><th>Ár</th><th>Utazás típusa</th><th>Utazás kezdete</th><th>Átvétel</th></tr></thead><tbody><tr><td>35 €-tól személyenként</td><td>Csoportos túra</td><tdd>naponta</td><tdd> 8:00</td></tr></tbody></table>
Az Orange Bay Island-i sznorkelezés vízi sportokkal Hurghadából az egyik legexkluzívabb és legtöbbet foglalt egynapos kirándulás a Vörös-tengeren. Az Orange Bay szigete a védett Giftun Nemzeti Parkban található, és Egyiptom egyik legszebb természeti célpontja.





A finom fehér homok, a türkizkék víz és a színes korallzátonyok egyedi hátteret teremtenek egy tökéletes nyaraláshoz. Ez a kirándulás ötvözi a kiváló minőségű sznorkelezést, a paradicsomi szigeten töltött pihentető órákat és a professzionális vízisport-tevékenységeket – első osztályú kiszolgálással, privát transzferrel és németül beszélő idegenvezetővel.





Ideális élmény azoknak az utazóknak, akik értékelik a minőséget, a kényelmet, a biztonságot és az autentikus természeti élményeket.





Az Orange Bayt „Egyiptom Karib-tengerének” tartják, és fehér homokos strandjával, kristálytiszta vízzel és egyedülálló víz alatti világával gyönyörködteti a látogatókat. Az utazás ideális családok, párok, csoportok és kezdő sznorkelezés számára.', 'Sznorkelezés és vízi sportok kirándulása a Giftun Nemzeti Parkban található Orange Bay Island-re – fehér homok, türkizkék víz és első osztályú kiszolgálás.', NULL, '["Gyönyörű Orange Bay-sziget a Giftun Nemzeti Parkban","Az egyik legnépszerűbb sznorkeltúra Hurghadában","Két sznorkelezési megálló világszínvonalú korallzátonyokon","Kristálytiszta víz és változatos víz alatti világ","Vízi sportok: Banana Boat és Sofa Boat","Pihenés a fehér homokos tengerparton napozóágyakkal","Az ebédet és az alkoholmentes italokat tartalmazza","Privát szállodai transzfer légkondicionált járművel","Kiváló minőségű hajók","Ideális családok, párok és csoportok számára","Orange Bay – a Vörös-tenger Karib-tengere"]'::jsonb, '["Szálloda- és leszállás Hurghadában (privát és légkondicionált)","Hajókirándulás az Orange Bay-szigetre","Két snorkel megálló","Komplett snorkel felszerelés (maszk, uszonyok, légzőcső, mentőmellény)","Maradjon az Orange Bay-szigeten","Ebéd","Alkoholmentes italok","Vízi sportok (banánhajó és kanapéhajó)","Nemzeti park díjai"]'::jsonb, '["Személyi kiadások","További italok vagy harapnivalók","Transzfer felárak bizonyos régiókban"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '4 óra', NULL, NULL, NULL, NULL, '[{"question":"Privát motorcsónakos kirándulás az Orange-öbölbe Hurghadából – sznorkelezés és kirándulás a szigetre","answer":"ElhelyezkedésHurghada Időtartam6 óra Privát motorcsónakos kirándulás az Orange-öbölbe Hurghadából... 60,00 €-tól"}]'::jsonb),
('tours', '69aa0c36-125f-4f41-8502-55a8f4fd6d98', 'fr', 'Excursion de plongée en apnée sur l''île d''Orange Bay avec sports nautiques au départ d''Hurghada', '<table class="tour-pricing-table"><thead><tr><th>Prix</th><th>Type de voyage</th><th>Début du voyage</th><th>Prise en charge</th></tr></thead><tbody><tr><td>À partir de 35 € par personne</td><td>Visite de groupe</td><td>par jour</td><td>env. 8h00</td></tr></tbody></table>
L''excursion de plongée en apnée avec sports nautiques sur l''île d''Orange Bay au départ d''Hurghada est l''une des excursions d''une journée les plus exclusives et les plus réservées de la mer Rouge. L''île d''Orange Bay est située dans le parc national protégé de Giftoun et constitue l''une des plus belles destinations naturelles d''Égypte.





Le sable fin et blanc, l''eau turquoise et les récifs coralliens colorés créent une toile de fond unique pour une journée de vacances parfaite. Cette excursion combine plongée en apnée de haute qualité, heures de détente sur une île paradisiaque et activités de sports nautiques professionnelles - accompagnées d''un service de première classe, d''un transfert privé et d''un guide touristique germanophone.





Une expérience idéale pour les voyageurs qui apprécient la qualité, le confort, la sécurité et les expériences authentiques en nature.





Orange Bay est considérée comme les « Caraïbes de l’Égypte » et ravit les visiteurs avec sa plage de sable blanc, ses eaux cristallines et son monde sous-marin unique. Le voyage est idéal pour les familles, les couples, les groupes et les débutants en snorkeling.', 'Excursion de snorkeling et de sports nautiques sur l''île d''Orange Bay dans le parc national de Giftun – sable blanc, eau turquoise et service de première classe.', NULL, '["Belle île d''Orange Bay dans le parc national Giftoun","L''une des excursions de plongée en apnée les plus populaires à Hurghada","Deux arrêts de plongée en apnée sur des récifs coralliens de classe mondiale","Eau cristalline et monde sous-marin diversifié","Sports nautiques inclus : Banana Boat & Sofa Boat","Détente sur la plage de sable blanc avec transats","Déjeuner et boissons non alcoolisées inclus","Transfert hôtel privé dans un véhicule climatisé","Des bateaux de haute qualité","Idéal pour les familles, les couples et les groupes","Orange Bay – les Caraïbes de la mer Rouge"]'::jsonb, '["Prise en charge et retour à l''hôtel à Hurghada (privé et climatisé)","Excursion en bateau sur l''île d''Orange Bay","Deux arrêts de plongée avec tuba","Équipement complet de snorkeling (masque, palmes, tuba, gilet de sauvetage)","Séjournez sur l''île d''Orange Bay","Déjeuner","Boissons non alcoolisées","Sports nautiques (Banana Boat & Sofa Boat)","Frais de parc national"]'::jsonb, '["Dépenses personnelles","Boissons ou collations supplémentaires","Suppléments de transfert pour certaines régions"]'::jsonb, 'Hurghada - Mer Rouge - Egypte', '4h', NULL, NULL, NULL, NULL, '[{"question":"Excursion privée en hors-bord à Orange Bay depuis Hurghada – plongée en apnée et excursion sur l''île","answer":"LocalisationHurghada Durée6 heures Excursion privée en hors-bord à Orange Bay depuis Hurghada... à partir de 60,00 €"}]'::jsonb),
('tours', '17a82d9b-2d00-4a29-8528-3c2e97a6bf26', 'en', 'Mahmya Island Trip Hurghada with Snorkeling & Lunch', '<table class="tour-pricing-table"><thead><tr><th>Price</th><th>Trip type</th><th>Trip start</th><th>Pick up</th></tr></thead><tbody><tr><td>From 95 € per person</td><td>Group tour</td><td>daily</td><td>approx. 8:00 a.m.</td></tr></tbody></table>
Imagine: soft, white sand under your feet, the sea shimmering in all shades of turquoise, the sun glittering on the surface of the water - welcome to Mahmya Island, one of the most beautiful places in the Red Sea.





The Mahmya Island excursion in Hurghada is much more than an ordinary snorkeling excursion. It is a journey to a protected natural paradise, rightly known as the “Maldives of Egypt”.





Here you can expect spectacular coral reefs, crystal clear water and an underwater world full of color and life. Away from the hustle and bustle, you will experience peace, luxury and nature in perfect harmony.





The excursion is ideal for guests looking for a quality island and snorkeling trip from Hurghada with comfort, nature and relaxation.





Why this excursion is one of the best in Hurghada





✔ One of the most beautiful snorkeling spots in the Red Sea


✔ Protected national park – untouched nature


✔ Dream beach with fine, white sand


✔ High quality boat tour with professional crew


✔ Lunch at a beach restaurant with a sea view


✔ Perfect for couples, families & connoisseurs', 'Mahmya Island excursion from Hurghada with snorkeling, lunch and boat trip - the "Maldives of Egypt" right on your doorstep.', NULL, '["Hotel transfer from Hurghada included","Boat trip to Mahmya Island in the Red Sea","Snorkeling on colorful coral reefs","Stay on Mahmya Island","Lunch on the beach included","Free time to swim, snorkel & relax"]'::jsonb, '["Full day boat trip to Mahmya Island","Hotel transfer (round trip)","Lunch on the island","Water, soft drinks & fruit","Experienced snorkeling guide","Snorkeling equipment"]'::jsonb, '["Personal expenses","Tips (voluntary)","Transfer surcharges for certain regions"]'::jsonb, 'Hurghada - Red Sea - Egypt', '4h', NULL, NULL, NULL, NULL, '[{"question":"Private speedboat tour to Orange Bay from Hurghada – snorkeling & island trip","answer":"LocationHurghada Duration6 hours Private speedboat tour to Orange Bay from Hurghada... from €60.00"}]'::jsonb),
('tours', '17a82d9b-2d00-4a29-8528-3c2e97a6bf26', 'fr', 'Excursion sur l''île de Mahmya à Hurghada avec plongée en apnée et déjeuner', '<table class="tour-pricing-table"><thead><tr><th>Prix</th><th>Type de voyage</th><th>Début du voyage</th><th>Prise en charge</th></tr></thead><tbody><tr><td>À partir de 95 € par personne</td><td>Visite de groupe</td><td>par jour</td><td>env. 8h00</td></tr></tbody></table>
Imaginez : du sable doux et blanc sous vos pieds, la mer scintillant dans toutes les nuances de turquoise, le soleil scintillant à la surface de l''eau - bienvenue sur l''île de Mahmya, l''un des plus beaux endroits de la mer Rouge.





L’excursion sur l’île Mahmya à Hurghada est bien plus qu’une simple excursion de plongée en apnée. C''est un voyage vers un paradis naturel protégé, surnommé à juste titre les « Maldives de l''Égypte ».





Ici, vous pouvez vous attendre à des récifs coralliens spectaculaires, à une eau cristalline et à un monde sous-marin plein de couleurs et de vie. Loin de l''agitation, vous ferez l''expérience du calme, du luxe et de la nature en parfaite harmonie.





L''excursion est idéale pour les clients à la recherche d''un séjour insulaire et de plongée en apnée de qualité au départ d''Hurghada, alliant confort, nature et détente.





Pourquoi cette excursion est l''une des meilleures d''Hurghada





✔ L''un des plus beaux spots de snorkeling de la Mer Rouge


✔ Parc national protégé – nature intacte


✔ Plage de rêve au sable fin et blanc


✔ Excursion en bateau de haute qualité avec un équipage professionnel


✔ Déjeuner dans un restaurant de plage avec vue sur la mer


✔ Parfait pour les couples, les familles et les connaisseurs', 'Excursion sur l''île de Mahmya au départ d''Hurghada avec plongée en apnée, déjeuner et excursion en bateau - les « Maldives d''Égypte » à votre porte.', NULL, '["Transfert à l''hôtel depuis Hurghada inclus","Excursion en bateau sur l''île de Mahmya en mer Rouge","Plongée en apnée sur les récifs coralliens colorés","Restez sur l’île de Mahmya","Déjeuner sur la plage inclus","Temps libre pour nager, plonger et se détendre"]'::jsonb, '["Excursion d''une journée en bateau sur l''île de Mahmya","Transfert hôtel (aller-retour)","Déjeuner sur l''île","Eau, boissons gazeuses et fruits","Guide de plongée en apnée expérimenté","Équipement de plongée en apnée"]'::jsonb, '["Dépenses personnelles","Pourboires (volontaires)","Suppléments de transfert pour certaines régions"]'::jsonb, 'Hurghada - Mer Rouge - Egypte', '4h', NULL, NULL, NULL, NULL, '[{"question":"Excursion privée en hors-bord à Orange Bay depuis Hurghada – plongée en apnée et excursion sur l''île","answer":"LocalisationHurghada Durée6 heures Excursion privée en hors-bord à Orange Bay depuis Hurghada... à partir de 60,00 €"}]'::jsonb),
('tours', '17a82d9b-2d00-4a29-8528-3c2e97a6bf26', 'ru', 'Поездка на остров Махмия в Хургаду с подводным плаванием и обедом
---ЦЭП---
Экскурсия на остров Махмия из Хургады с подводным плаванием, обедом и прогулкой на лодке – «Мальдивы Египта» прямо у вашего порога.
---ЦЭП---
Хургада - Красное море - Египет
---ЦЭП---
4 часа
---ЦЭП---
<table class="tour-pricing-table"><thead><tr><th>Цена</th><th>Тип поездки</th><th>Начало поездки</th><th>Самовывоз</th></tr></thead><tbody><tr><td>От 95 евро на человека</td><td>Групповой тур</td><td>ежедневно</td><td>ок. 8:00 утра</td></tr></tbody></table>
Представьте себе: мягкий белый песок под ногами, море, переливающееся всеми оттенками бирюзы, солнце, сверкающее на поверхности воды – добро пожаловать на остров Махмия, одно из красивейших мест Красного моря.





Экскурсия на остров Махмия в Хургаде – это гораздо больше, чем обычная экскурсия со снорклингом. Это путешествие в охраняемый природный рай, по праву известный как «Мальдивы Египта».





Здесь вас ждут впечатляющие коралловые рифы, кристально чистая вода и подводный мир, полный цвета и жизни. Вдали от шума и суеты вы ощутите покой, роскошь и природу в полной гармонии.





Экскурсия идеально подходит для гостей, которые ищут качественный остров и поездку для подводного плавания из Хургады с комфортом, природой и отдыхом.





Почему эта экскурсия одна из лучших в Хургаде





✔ Одно из самых красивых мест для сноркелинга на Красном море.


✔ Охраняемый национальный парк – нетронутая природа


✔ Пляж мечты с мелким белым песком


✔ Качественная экскурсия на лодке с профессиональной командой


✔ Обед в пляжном ресторане с видом на море


✔ Идеально подходит для пар, семей и ценителей
---ЦЭП---
Трансфер из Хургады включен в стоимость.
---РАЗДЕЛЕНИЕ---
Поездка на лодке к острову Махмия в Красном море.
---РАЗДЕЛЕНИЕ---
Подводное плавание на красочных коралловых рифах
---РАЗДЕЛЕНИЕ---
Пребывание на острове Махмия
---РАЗДЕЛЕНИЕ---
Обед на пляже включен в стоимость
---РАЗДЕЛЕНИЕ---
Свободное время для купания, подводного плавания и отдыха.
---ЦЭП---
Поездка на лодке на целый день на остров Махмия
---РАЗДЕЛЕНИЕ---
Трансфер из отеля (туда и обратно)
---РАЗДЕЛЕНИЕ---
Обед на острове
---РАЗДЕЛЕНИЕ---
Вода, безалкогольные напитки и фрукты
---РАЗДЕЛЕНИЕ---
Опытный гид по подводному плаванию
---РАЗДЕЛЕНИЕ---
Оборудование для подводного плавания
---ЦЭП---
Личные расходы
---РАЗДЕЛЕНИЕ---
Советы (добровольные)
---РАЗДЕЛЕНИЕ---
Комиссия за трансфер для определенных регионов
---ЦЭП---
Частный тур на скоростном катере в Оранжевый залив из Хургады – подводное плавание и поездка на остров
---ЦЭП---
МестоположениеХургада Продолжительность: 6 часов Частный тур на скоростном катере в Оранжевый залив из Хургады... от 60,00 евро.', '<table class="tour-pricing-table"><thead><tr><th>Preis</th><th>Reisetyp</th><th>Reiseantritt</th><th>Abholung</th></tr></thead><tbody><tr><td>Ab 95 € p.P.</td><td>Gruppentour</td><td>täglich</td><td>ca. 8:00 Uhr</td></tr></tbody></table>
Stellen Sie sich vor: Weicher, weißer Sand unter Ihren Füßen, das Meer schimmert in allen Türkistönen, die Sonne glitzert auf der Wasseroberfläche – willkommen auf der Mahmya Insel, einem der schönsten Orte im Roten Meer.





Der Mahmya Insel Ausflug in Hurghada ist weit mehr als ein gewöhnlicher Schnorchelausflug. Er ist eine Reise in ein geschütztes Naturparadies, das zu Recht als die „Malediven Ägyptens“ bekannt ist.





Hier erwarten Sie spektakuläre Korallenriffe, kristallklares Wasser und eine Unterwasserwelt voller Farben und Leben. Abseits vom Trubel erleben Sie Ruhe, Luxus und Natur in perfekter Harmonie.





Der Ausflug eignet sich ideal für Gäste, die einen hochwertigen Insel- und Schnorchelausflug ab Hurghada mit Komfort, Natur und Erholung suchen.





Warum dieser Ausflug zu den besten in Hurghada gehört





✔ Einer der schönsten Schnorchelspots im Roten Meer


✔ Geschützter Nationalpark – unberührte Natur


✔ Traumstrand mit feinem, weißen Sand


✔ Hochwertige Bootstour mit professioneller Crew


✔ Mittagessen in einem Strandrestaurant mit Meerblick


✔ Perfekt für Paare, Familien & Genießer', 'Mahmya Insel Ausflug ab Hurghada mit Schnorcheln, Mittagessen und Bootsfahrt – die „Malediven Ägyptens" direkt vor Ihrer Tür.', NULL, '["Hoteltransfer ab Hurghada inklusive","Bootsfahrt zur Mahmya Insel im Roten Meer","Schnorcheln an farbenprächtigen Korallenriffen","Aufenthalt auf der Mahmya Insel","Mittagessen am Strand inklusive","Freizeit zum Schwimmen, Schnorcheln & Entspannen"]'::jsonb, '["Ganztägiger Bootsausflug zur Mahmya Insel","Hoteltransfer (Hin- & Rückfahrt)","Mittagessen auf der Insel","Wasser, Softdrinks & Obst","Erfahrener Schnorchelguide","Schnorchelausrüstung"]'::jsonb, '["Persönliche Ausgaben","Trinkgelder (freiwillig)","Transferzuschläge für bestimmte Regionen"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '4h', NULL, NULL, NULL, NULL, '[{"question":"Private Speedboot Tour zur Orange Bay ab Hurghada – Schnorcheln & Inseltrip","answer":"LocationHurghada Dauer6 Stunden Private Speedboot Tour zur Orange Bay ab Hurghada... ab60.00 &euro;"}]'::jsonb),
('tours', '17a82d9b-2d00-4a29-8528-3c2e97a6bf26', 'ar', 'رحلة جزيرة المحمية بالغردقة مع الغطس والغداء
--- تسيب ---
رحلة إلى جزيرة المحمية من الغردقة مع الغطس والغداء ورحلة بالقارب - "جزر المالديف المصرية" على عتبة داركم مباشرةً.
--- تسيب ---
الغردقة - البحر الأحمر - مصر
--- تسيب ---
4 ساعات
--- تسيب ---
<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>بداية الرحلة</th><th>الالتقاط</th></tr></thead><tbody><tr><td>من 95 يورو للشخص الواحد</td><td>جولة جماعية</td><td>يوميًا</td><td>تقريبًا. 8:00 صباحًا</td></tr></tbody></table>
تخيل: الرمال البيضاء الناعمة تحت قدميك، والبحر يتلألأ بكل درجات اللون الفيروزي، والشمس تتلألأ على سطح الماء - أهلاً بك في جزيرة المحمية، إحدى أجمل الأماكن في البحر الأحمر.





تعتبر رحلة جزيرة المحمية في الغردقة أكثر بكثير من مجرد رحلة غطس عادية. إنها رحلة إلى جنة طبيعية محمية، تُعرف بحق باسم "جزر المالديف المصرية".





هنا يمكنك أن تتوقع الشعاب المرجانية المذهلة والمياه الصافية وعالم تحت الماء مليء بالألوان والحياة. بعيدًا عن الصخب والضجيج، ستستمتع بالسلام والرفاهية والطبيعة في وئام تام.





تعتبر الرحلة مثالية للضيوف الذين يبحثون عن جزيرة عالية الجودة ورحلة غطس من الغردقة مع الراحة والطبيعة والاسترخاء.





لماذا تعد هذه الرحلة من أفضل الرحلات في الغردقة؟





✔ واحدة من أجمل أماكن الغطس في البحر الأحمر


✔ حديقة وطنية محمية – طبيعة لم تمسها يد الإنسان


✔ شاطئ الأحلام ذو الرمال البيضاء الناعمة


✔ جولة بالقارب عالية الجودة مع طاقم محترف


✔تناول وجبة الغداء بمطعم على الشاطئ بإطلالة بحرية


✔ مثالي للأزواج والعائلات والخبراء
--- تسيب ---
شامل النقل من الفندق من الغردقة
---تقسيم---
رحلة بالقارب إلى جزيرة المحمية في البحر الأحمر
---تقسيم---
الغطس على الشعاب المرجانية الملونة
---تقسيم---
البقاء في جزيرة المحمية
---تقسيم---
الغداء على الشاطئ متضمن
---تقسيم---
وقت حر للسباحة والغطس والاسترخاء
--- تسيب ---
رحلة بالقارب ليوم كامل إلى جزيرة المحمية
---تقسيم---
النقل من الفندق (ذهابا وإيابا)
---تقسيم---
الغداء في الجزيرة
---تقسيم---
المياه والمشروبات الغازية والفواكه
---تقسيم---
دليل الغطس من ذوي الخبرة
---تقسيم---
معدات الغطس
--- تسيب ---
النفقات الشخصية
---تقسيم---
نصائح (طوعية)
---تقسيم---
تحويل الرسوم الإضافية لمناطق معينة
--- تسيب ---
جولة خاصة بالقارب السريع إلى أورانج باي من الغردقة - رحلة الغطس والجزيرة
--- تسيب ---
الموقعالغردقة المدة 6 ساعات جولة خاصة بالقارب السريع إلى أورانج باي من الغردقة... تبدأ من 60.00 يورو', '<table class="tour-pricing-table"><thead><tr><th>Preis</th><th>Reisetyp</th><th>Reiseantritt</th><th>Abholung</th></tr></thead><tbody><tr><td>Ab 95 € p.P.</td><td>Gruppentour</td><td>täglich</td><td>ca. 8:00 Uhr</td></tr></tbody></table>
Stellen Sie sich vor: Weicher, weißer Sand unter Ihren Füßen, das Meer schimmert in allen Türkistönen, die Sonne glitzert auf der Wasseroberfläche – willkommen auf der Mahmya Insel, einem der schönsten Orte im Roten Meer.





Der Mahmya Insel Ausflug in Hurghada ist weit mehr als ein gewöhnlicher Schnorchelausflug. Er ist eine Reise in ein geschütztes Naturparadies, das zu Recht als die „Malediven Ägyptens“ bekannt ist.





Hier erwarten Sie spektakuläre Korallenriffe, kristallklares Wasser und eine Unterwasserwelt voller Farben und Leben. Abseits vom Trubel erleben Sie Ruhe, Luxus und Natur in perfekter Harmonie.





Der Ausflug eignet sich ideal für Gäste, die einen hochwertigen Insel- und Schnorchelausflug ab Hurghada mit Komfort, Natur und Erholung suchen.





Warum dieser Ausflug zu den besten in Hurghada gehört





✔ Einer der schönsten Schnorchelspots im Roten Meer


✔ Geschützter Nationalpark – unberührte Natur


✔ Traumstrand mit feinem, weißen Sand


✔ Hochwertige Bootstour mit professioneller Crew


✔ Mittagessen in einem Strandrestaurant mit Meerblick


✔ Perfekt für Paare, Familien & Genießer', 'Mahmya Insel Ausflug ab Hurghada mit Schnorcheln, Mittagessen und Bootsfahrt – die „Malediven Ägyptens" direkt vor Ihrer Tür.', NULL, '["Hoteltransfer ab Hurghada inklusive","Bootsfahrt zur Mahmya Insel im Roten Meer","Schnorcheln an farbenprächtigen Korallenriffen","Aufenthalt auf der Mahmya Insel","Mittagessen am Strand inklusive","Freizeit zum Schwimmen, Schnorcheln & Entspannen"]'::jsonb, '["Ganztägiger Bootsausflug zur Mahmya Insel","Hoteltransfer (Hin- & Rückfahrt)","Mittagessen auf der Insel","Wasser, Softdrinks & Obst","Erfahrener Schnorchelguide","Schnorchelausrüstung"]'::jsonb, '["Persönliche Ausgaben","Trinkgelder (freiwillig)","Transferzuschläge für bestimmte Regionen"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '4h', NULL, NULL, NULL, NULL, '[{"question":"Private Speedboot Tour zur Orange Bay ab Hurghada – Schnorcheln & Inseltrip","answer":"LocationHurghada Dauer6 Stunden Private Speedboot Tour zur Orange Bay ab Hurghada... ab60.00 &euro;"}]'::jsonb),
('tours', '17a82d9b-2d00-4a29-8528-3c2e97a6bf26', 'hu', 'Mahmya szigeti kirándulás Hurghadába sznorkelezéssel és ebéddel', '<table class="tour-pricing-table"><thead><tr><th>Ár</th><th>Utazás típusa</th><th>Utazás kezdete</th><th>Utazás</th></tr></thead><tbody><tr><td>95 €-tól személyenként</td><td>Csoportos túra</td><tdd>napi</tpro 8:00</td></tr></tbody></table>
Képzeld el: puha, fehér homok a lábad alatt, a tenger a türkiz minden árnyalatában csillog, a nap csillog a víz felszínén – üdvözöljük Mahmya szigetén, a Vörös-tenger egyik legszebb helyén.





A Mahmya-szigeti kirándulás Hurghadában sokkal több, mint egy közönséges snorkeling kirándulás. Ez egy utazás egy védett természeti paradicsomba, amelyet méltán neveznek „Egyiptom Maldív-szigeteinek”.





Itt látványos korallzátonyokra, kristálytiszta vízre és színekkel és élettel teli víz alatti világra lehet számítani. Távol a nyüzsgéstől békét, luxust és a természetet tökéletes harmóniában tapasztalhatja meg.





A kirándulás ideális azoknak a vendégeknek, akik minőségi szigetre és sznorkelezésre vágynak Hurghadából kényelemmel, természettel és pihenéssel.





Miért ez a kirándulás az egyik legjobb Hurghadában





✔ A Vörös-tenger egyik legszebb sznorkelezési helye


✔ Védett nemzeti park – érintetlen természet


✔ Álompart finom, fehér homokkal


✔ Kiváló minőségű hajótúra profi személyzettel


✔ Ebéd egy tengerparti étteremben, kilátással a tengerre


✔ Tökéletes pároknak, családoknak és ínyenceknek', 'Kirándulás a Mahmya-szigetre Hurghadából sznorkelezéssel, ebéddel és hajókirándulással – az "Egyiptom Maldív-szigetei" közvetlenül a küszöbön.', NULL, '["Szállodai transzfer Hurghadából","Hajókirándulás a Vörös-tenger Mahmya szigetére","Sznorkelezés színes korallzátonyokon","Maradjon a Mahmya-szigeten","Ebéd a tengerparton tartalmazza","Szabadidő úszásra, sznorkelezésre és pihenésre"]'::jsonb, '["Egész napos hajókirándulás Mahmya szigetére","Szállodai transzfer (oda-vissza út)","Ebéd a szigeten","Víz, üdítő és gyümölcs","Tapasztalt snorkeling vezető","Snorkeling felszerelés"]'::jsonb, '["Személyi kiadások","Tippek (önkéntes)","Transzfer felárak bizonyos régiókban"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '4 óra', NULL, NULL, NULL, NULL, '[{"question":"Privát motorcsónakos kirándulás az Orange-öbölbe Hurghadából – sznorkelezés és kirándulás a szigetre","answer":"ElhelyezkedésHurghada Időtartam6 óra Privát motorcsónakos kirándulás az Orange-öbölbe Hurghadából... 60,00 €-tól"}]'::jsonb),
('tours', 'a8ddb433-a4fb-41ca-b90d-b399b4a57923', 'en', 'Dendera half day trip from Hurghada – The authentic visit to the Hathor Temple', '<table class="tour-pricing-table"><thead><tr><th>Participant</th><th>Vehicle</th><th>Price per person</th></tr></thead><tbody><tr><td>2 people</td><td>Private limousine</td><td>120 € per person</td></tr><tr><td>3 – 4 people</td><td>Private Minibus</td><td>110 € per person</td></tr><tr><td>5 - 6 people</td><td>Private minibus</td><td>100 € per person</td></tr><tr><td>7 - 8 people</td><td>Private minibus</td><td>90 € per person</td></tr></tbody></table>
Discover the impressive Dendera Temple, one of Egypt''s best-preserved sanctuaries. The temple of the goddess Hathor fascinates with its colorful reliefs, extraordinary architecture and unique astronomical displays. This half-day excursion takes you away from mass tourism to one of the most important cultural monuments in Upper Egypt - exclusively accompanied by a German-speaking Egyptologist. Unlike crowded group excursions, you will experience Dendera in a relaxed atmosphere and with enough time for photos and individual questions.





Why the Dendera Temple is an essential destination





The temple complex is located around 60 kilometers north of Luxor and dates back to the Ptolemaic-Roman period. Thanks to its excellent preservation, it is considered one of the most significant pieces of evidence of ancient Egyptian art and science.', 'Discover the impressive Dendera Temple, one of Egypt''s best-preserved shrines, on an exclusive half-day tour from Hurghada with a German-speaking Egyptologist.', 'Culture & sightseeing', '["gigantic pillared halls in which the original colors have shined for 2000 years","the famous astronomical ceiling showing the starry sky of ancient Egypt","the Mamisi (birthhouse of the gods)","the crypts with enigmatic reliefs","the only completely preserved depiction of Cleopatra VII and Caesarion","the Holy Lake - place of ritual purification","the unique sanatorium where healings took place through sacred rituals"]'::jsonb, '["Private transfer in air-conditioned vehicle","German-speaking tour guide/Egyptologist","Entrance fees according to the program","Drinks in the vehicle","Insurance included"]'::jsonb, '["Personal expenses","Transfer surcharge for guests from Marsa Alam: €50 per person","Transfer surcharge for guests from El Quseir: €35 per person","Transfer surcharge from Makadi Bay & Sahl Hasheesh: €5 per person","Transfer surcharge from El Gouna, Safaga & Soma Bay: €10 per person","Foreign language tour guide (English, Russian or French): additional charge €10 per person"]'::jsonb, 'Hurghada - Red Sea - Egypt', '7h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', 'a8ddb433-a4fb-41ca-b90d-b399b4a57923', 'fr', 'Excursion d’une demi-journée à Dendérah au départ d’Hurghada – La visite authentique du temple d’Hathor', '<table class="tour-pricing-table"><thead><tr><th>Participant</th><th>Véhicule</th><th>Prix par personne</th></tr></thead><tbody><tr><td>2 personnes</td><td>Limousine privée</td><td>120 € par personne</td></tr><tr><td>3 – 4 personnes</td><td>Privé Minibus</td><td>110 € par personne</td></tr><tr><td>5 - 6 personnes</td><td>Minibus privé</td><td>100 € par personne</td></tr><tr><td>7 - 8 personnes</td><td>Minibus privé</td><td>90 € par personne</td></tr></tbody></table>
Découvrez l''impressionnant temple de Dendérah, l''un des sanctuaires les mieux conservés d''Égypte. Le temple de la déesse Hathor fascine par ses reliefs colorés, son architecture extraordinaire et ses expositions astronomiques uniques. Cette excursion d''une demi-journée vous éloigne du tourisme de masse vers l''un des monuments culturels les plus importants de Haute-Égypte - en compagnie exclusivement d''un égyptologue germanophone. Contrairement aux excursions en groupe bondées, vous découvrirez Dendérah dans une atmosphère détendue et avec suffisamment de temps pour prendre des photos et poser des questions individuelles.





Pourquoi le temple de Dendérah est une destination incontournable





Le complexe du temple est situé à environ 60 kilomètres au nord de Louxor et remonte à la période ptolémaïque-romaine. Grâce à son excellente conservation, il est considéré comme l’un des témoignages les plus importants de l’art et de la science égyptiens anciens.', 'Découvrez l''impressionnant temple de Dendérah, l''un des sanctuaires les mieux conservés d''Égypte, lors d''une excursion exclusive d''une demi-journée au départ d''Hurghada avec un égyptologue germanophone.', 'Culture et tourisme', '["de gigantesques salles à piliers dans lesquelles les couleurs d''origine brillent depuis 2000 ans","le célèbre plafond astronomique montrant le ciel étoilé de l''Egypte ancienne","le Mamisi (maison natale des dieux)","les cryptes aux reliefs énigmatiques","la seule représentation entièrement conservée de Cléopâtre VII et de Césarion","le Lac Sacré - lieu de purification rituelle","le sanatorium unique où les guérisons avaient lieu à travers des rituels sacrés"]'::jsonb, '["Transfert privé en véhicule climatisé","Guide touristique/égyptologue germanophone","Tarifs d''entrée selon le programme","Boissons dans le véhicule","Assurance incluse"]'::jsonb, '["Dépenses personnelles","Supplément de transfert pour les clients de Marsa Alam : 50 € par personne","Supplément de transfert pour les clients d''El Quseir : 35 € par personne","Supplément de transfert depuis la baie de Makadi et Sahl Hasheesh : 5 € par personne","Supplément de transfert depuis El Gouna, Safaga et Soma Bay : 10 € par personne","Guide touristique en langue étrangère (anglais, russe ou français) : supplément 10 € par personne"]'::jsonb, 'Hurghada - Mer Rouge - Egypte', '7h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', 'a8ddb433-a4fb-41ca-b90d-b399b4a57923', 'ru', 'Поездка на полдня в Дендеру из Хургады – настоящий визит в храм Хатор
---ЦЭП---
Откройте для себя впечатляющий храм Дендеры, одну из наиболее хорошо сохранившихся святынь Египта, во время эксклюзивного тура на полдня из Хургады с немецкоязычным египтологом.
---ЦЭП---
Культура и достопримечательности
---ЦЭП---
Хургада - Красное море - Египет
---ЦЭП---
7 часов
---ЦЭП---
<table class="tour-pricing-table"><thead><tr><th>Участник</th><th>Автомобиль</th><th>Цена на человека</th></tr></thead><tbody><tr><td>2 человека</td><td>Частный лимузин</td><td>120 € на человека</td></tr><tr><td>3 – 4 человека</td><td>Частный Микроавтобус</td><td>110 € на человека</td></tr><tr><td>5 - 6 человек</td><td>Частный микроавтобус</td><td>100 € на человека</td></tr><tr><td>7 - 8 человек</td><td>Частный микроавтобус</td><td>90 € на человека</td></tr></tbody></table>
Откройте для себя впечатляющий храм Дендеры, одно из наиболее хорошо сохранившихся святилищ Египта. Храм богини Хатхор завораживает красочными рельефами, необычной архитектурой и уникальными астрономическими дисплеями. Эта экскурсия на полдня унесет вас от массового туризма к одному из самых важных культурных памятников Верхнего Египта - исключительно в сопровождении немецкоязычного египтолога. В отличие от многолюдных групповых экскурсий, вы познакомитесь с Дендерой в непринужденной атмосфере и с достаточным количеством времени для фотографий и индивидуальных вопросов.





Почему храм Дендеры является важным местом назначения





Храмовый комплекс расположен примерно в 60 километрах к северу от Луксора и относится к птолемеевско-римскому периоду. Благодаря отличной сохранности он считается одним из наиболее значительных свидетельств древнеегипетского искусства и науки.
---ЦЭП---
гигантские залы с колоннами, в которых оригинальные цвета сияют уже 2000 лет
---РАЗДЕЛЕНИЕ---
знаменитый астрономический потолок, показывающий звездное небо Древнего Египта
---РАЗДЕЛЕНИЕ---
Мамиси (дом рождения богов)
---РАЗДЕЛЕНИЕ---
склепы с загадочными рельефами
---РАЗДЕЛЕНИЕ---
единственное полностью сохранившееся изображение Клеопатры VII и Цезариона
---РАЗДЕЛЕНИЕ---
Святое озеро – место ритуального очищения
---РАЗДЕЛЕНИЕ---
уникальный санаторий, где исцеления происходили посредством священных ритуалов
---ЦЭП---
Частный трансфер на автомобиле с кондиционером
---РАЗДЕЛЕНИЕ---
Немецкоязычный гид/египтолог
---РАЗДЕЛЕНИЕ---
Входные билеты согласно программе
---РАЗДЕЛЕНИЕ---
Напитки в машине
---РАЗДЕЛЕНИЕ---
Страховка включена
---ЦЭП---
Личные расходы
---РАЗДЕЛЕНИЕ---
Доплата за трансфер для гостей из Марса Алама: 50 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер для гостей из Эль-Кусейра: 35 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из залива Макади и Сахл Хашиша: 5 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из Эль-Гуны, Сафаги и Сома-Бэй: 10 евро на человека.
---РАЗДЕЛЕНИЕ---
Гид на иностранном языке (английский, русский или французский): дополнительная плата 10 евро на человека.', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Fahrzeug</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Private Limousine</td><td>120 € p.P.</td></tr><tr><td>3 – 4 Personen</td><td>Privater Minibus</td><td>110 € p.P.</td></tr><tr><td>5 – 6 Personen</td><td>Privater Minibus</td><td>100 € p.P.</td></tr><tr><td>7 – 8 Personen</td><td>Privater Minibus</td><td>90 € p.P.</td></tr></tbody></table>
Entdecken Sie den beeindruckenden Dendera Tempel, eines der am besten erhaltenen Heiligtümer Ägyptens. Der Tempel der Göttin Hathor fasziniert mit farbintensiven Reliefs, außergewöhnlicher Architektur und einzigartigen astronomischen Darstellungen. Dieser halbtägige Ausflug führt Sie abseits des Massentourismus zu einem der wichtigsten Kulturdenkmäler Oberägyptens – exklusiv begleitet von einem deutschsprachigen Ägyptologen.Anders als bei überfüllten Gruppenausflügen erleben Sie Dendera in entspannter Atmosphäre und mit ausreichend Zeit für Fotos und individuelle Fragen.





Warum der Dendera Tempel ein unverzichtbares Ausflugsziel ist





Der Tempelkomplex liegt rund 60 Kilometer nördlich von Luxor und stammt aus der ptolemäisch-römischen Zeit. Dank seiner hervorragenden Erhaltung gilt er als eines der aussagekräftigsten Zeugnisse altägyptischer Kunst und Wissenschaft.', 'Entdecken Sie den beeindruckenden Dendera Tempel, eines der am besten erhaltenen Heiligtümer Ägyptens, auf einer exklusiven Halbtagestour ab Hurghada mit deutschsprachigem Ägyptologen.', 'Kultur & Sightseeing', '["gigantische Säulenhallen, in denen die originalen Farben seit 2000 Jahren strahlen","die berühmte astronomische Decke, die den Sternenhimmel des antiken Ägyptens zeigt","das Mamisi (Geburtshaus der Götter)","die Krypten mit rätselhaften Reliefs","die einzige vollständig erhaltene Darstellung von Kleopatra VII. und Caesarion","den Heiligen See – Ort ritueller Reinigung","das einzigartige Sanatorium, in dem Heilungen durch heilige Rituale stattfanden"]'::jsonb, '["Privater Transfer im klimatisierten Fahrzeug","Deutschsprachiger Reiseleiter / Ägyptologe","Eintrittsgebühren laut Programm","Getränke im Fahrzeug","Versicherung inklusive"]'::jsonb, '["Persönliche Ausgaben","Transferzuschlag für Gäste aus Marsa Alam: 50 € pro Person","Transferzuschlag für Gäste aus El Quseir: 35 € pro Person","Transferzuschlag ab Makadi Bay & Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga & Soma Bay: 10 € pro Person","Fremdsprachiger Reiseleiter (Englisch, Russisch oder Französisch): Aufpreis 10 € pro Person"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '7h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', 'a8ddb433-a4fb-41ca-b90d-b399b4a57923', 'ar', 'رحلة دندرة لنصف يوم من الغردقة - الزيارة الحقيقية لمعبد حتحور
--- تسيب ---
اكتشف معبد دندرة المثير للإعجاب، أحد أفضل المزارات المحفوظة في مصر، في جولة حصرية لمدة نصف يوم من الغردقة مع عالم مصريات ناطق بالألمانية.
--- تسيب ---
الثقافة ومشاهدة المعالم السياحية
--- تسيب ---
الغردقة - البحر الأحمر - مصر
--- تسيب ---
7 ساعات
--- تسيب ---
<table class="tour-pricing-table"><thead><tr><th>المشارك</th><th>المركبة</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخصين</td><td>سيارة ليموزين خاصة</td><td>120 يورو للشخص الواحد</td></tr><tr><td>3 - 4 أشخاص</td><td>خاص حافلة صغيرة</td><td>110 يورو للشخص الواحد</td></tr><tr><td>5 - 6 أشخاص</td><td>حافلة صغيرة خاصة</td><td>100 يورو للشخص الواحد</td></tr><tr><td>7 - 8 أشخاص</td><td>حافلة صغيرة خاصة</td><td>90 يورو للشخص الواحد</td></tr></tbody></table>
اكتشف معبد دندرة المثير للإعجاب، وهو أحد أفضل المقدسات المحفوظة في مصر. يبهر معبد الإلهة حتحور بنقوشه الملونة وهندسته المعمارية غير العادية وعروضه الفلكية الفريدة. تأخذك هذه الرحلة التي تستغرق نصف يوم بعيدًا عن السياحة الجماعية إلى أحد أهم المعالم الثقافية في صعيد مصر - برفقة حصريًا عالم مصريات ناطق بالألمانية. على عكس الرحلات الجماعية المزدحمة، ستستمتع بتجربة دنديرا في جو مريح ومع وجود وقت كافٍ لالتقاط الصور والأسئلة الفردية.





لماذا يعد معبد دندرة وجهة أساسية؟





يقع مجمع المعابد على بعد حوالي 60 كيلومترًا شمال مدينة الأقصر، ويعود تاريخه إلى العصر البطلمي الروماني. وبفضل الحفاظ عليها بشكل ممتاز، تعتبر واحدة من أهم الأدلة على الفن والعلوم المصرية القديمة.
--- تسيب ---
قاعات ضخمة ذات أعمدة لمعت فيها ألوانها الأصلية منذ 2000 عام
---تقسيم---
السقف الفلكي الشهير الذي يظهر السماء المرصعة بالنجوم في مصر القديمة
---تقسيم---
الماميسي (مسقط رأس الآلهة)
---تقسيم---
الخبايا ذات النقوش الغامضة
---تقسيم---
الصورة الوحيدة المحفوظة بالكامل لكليوباترا السابعة وقيصريون
---تقسيم---
البحيرة المقدسة - مكان طقوس التطهير
---تقسيم---
المصحة الفريدة حيث يتم الشفاء من خلال الطقوس المقدسة
--- تسيب ---
نقل خاص في سيارة مكيفة
---تقسيم---
مرشد سياحي ناطق بالألمانية/عالم مصريات
---تقسيم---
رسوم الدخول حسب البرنامج
---تقسيم---
المشروبات في السيارة
---تقسيم---
يشمل التأمين
--- تسيب ---
النفقات الشخصية
---تقسيم---
تكلفة النقل الإضافية للضيوف من مرسى علم: 50 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية للضيوف من القصير: 35 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية من خليج مكادي وسهل حشيش: 5 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية من الجونة وسفاجا وخليج سوما: 10 يورو للشخص الواحد
---تقسيم---
مرشد سياحي بلغة أجنبية (الإنجليزية أو الروسية أو الفرنسية): رسوم إضافية 10 يورو للشخص الواحد', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Fahrzeug</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Private Limousine</td><td>120 € p.P.</td></tr><tr><td>3 – 4 Personen</td><td>Privater Minibus</td><td>110 € p.P.</td></tr><tr><td>5 – 6 Personen</td><td>Privater Minibus</td><td>100 € p.P.</td></tr><tr><td>7 – 8 Personen</td><td>Privater Minibus</td><td>90 € p.P.</td></tr></tbody></table>
Entdecken Sie den beeindruckenden Dendera Tempel, eines der am besten erhaltenen Heiligtümer Ägyptens. Der Tempel der Göttin Hathor fasziniert mit farbintensiven Reliefs, außergewöhnlicher Architektur und einzigartigen astronomischen Darstellungen. Dieser halbtägige Ausflug führt Sie abseits des Massentourismus zu einem der wichtigsten Kulturdenkmäler Oberägyptens – exklusiv begleitet von einem deutschsprachigen Ägyptologen.Anders als bei überfüllten Gruppenausflügen erleben Sie Dendera in entspannter Atmosphäre und mit ausreichend Zeit für Fotos und individuelle Fragen.





Warum der Dendera Tempel ein unverzichtbares Ausflugsziel ist





Der Tempelkomplex liegt rund 60 Kilometer nördlich von Luxor und stammt aus der ptolemäisch-römischen Zeit. Dank seiner hervorragenden Erhaltung gilt er als eines der aussagekräftigsten Zeugnisse altägyptischer Kunst und Wissenschaft.', 'Entdecken Sie den beeindruckenden Dendera Tempel, eines der am besten erhaltenen Heiligtümer Ägyptens, auf einer exklusiven Halbtagestour ab Hurghada mit deutschsprachigem Ägyptologen.', 'Kultur & Sightseeing', '["gigantische Säulenhallen, in denen die originalen Farben seit 2000 Jahren strahlen","die berühmte astronomische Decke, die den Sternenhimmel des antiken Ägyptens zeigt","das Mamisi (Geburtshaus der Götter)","die Krypten mit rätselhaften Reliefs","die einzige vollständig erhaltene Darstellung von Kleopatra VII. und Caesarion","den Heiligen See – Ort ritueller Reinigung","das einzigartige Sanatorium, in dem Heilungen durch heilige Rituale stattfanden"]'::jsonb, '["Privater Transfer im klimatisierten Fahrzeug","Deutschsprachiger Reiseleiter / Ägyptologe","Eintrittsgebühren laut Programm","Getränke im Fahrzeug","Versicherung inklusive"]'::jsonb, '["Persönliche Ausgaben","Transferzuschlag für Gäste aus Marsa Alam: 50 € pro Person","Transferzuschlag für Gäste aus El Quseir: 35 € pro Person","Transferzuschlag ab Makadi Bay & Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga & Soma Bay: 10 € pro Person","Fremdsprachiger Reiseleiter (Englisch, Russisch oder Französisch): Aufpreis 10 € pro Person"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '7h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', 'a8ddb433-a4fb-41ca-b90d-b399b4a57923', 'hu', 'Dendera félnapos kirándulás Hurghadából – A Hathor templom hiteles látogatása', '<table class="tour-pricing-table"><thead><tr><th>Részvevő</th><th>Gépjármű</th><th>Ár személyenként</th></tr></thead><tbody><tr><td>2 fő</td><td>Privát limuzin</td><td>120 € személyenként</td><td>személyenként</td><td>privát Mikrobusz</td><td>110 €/fő</td></tr><tr><td>5-6 fő</td><td>Privát mikrobusz</td><td>100 €/fő</td></tr><tr><td>7-8 fő</td><td>Privát mikrobusz</td><td>90 €/tr>fő
Fedezze fel a lenyűgöző Dendera templomot, Egyiptom egyik legjobban megőrzött szentélyét. Hathor istennő temploma színes domborművekkel, rendkívüli építészetével és egyedi csillagászati ​​kiállításaival lenyűgöző. Ez a félnapos kirándulás a tömegturizmustól Felső-Egyiptom egyik legfontosabb kulturális műemlékéhez vezet – kizárólag németül beszélő egyiptológus kíséretében. Ellentétben a zsúfolt csoportos kirándulásokkal, a Denderát nyugodt légkörben tapasztalhatja meg, és elegendő idő áll rendelkezésére fényképekre és egyéni kérdésekre.





Miért elengedhetetlen célpont a Dendera templom?





A templomegyüttes Luxortól mintegy 60 kilométerre északra található, és a ptolemaioszi-római korszakból származik. Kiváló megőrzésének köszönhetően az ókori egyiptomi művészet és tudomány egyik legjelentősebb bizonyítékaként tartják számon.', 'Fedezze fel a lenyűgöző Dendera templomot, Egyiptom egyik legjobban megőrzött szentélyét egy exkluzív félnapos túrán Hurghadából egy németül beszélő egyiptológussal.', 'Kultúra és városnézés', '[]'::jsonb, '["Privát transzfer légkondicionált járművel","Németül beszélő idegenvezető/egyiptológus","Belépődíjak a program szerint","Italok a járműben","Biztosítás benne"]'::jsonb, '[]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '7 óra', NULL, NULL, NULL, NULL, '[]'::jsonb);

-- Batch 2 (rows 51-100)
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs) VALUES
('tours', '0009b90b-71a9-4e78-8459-e56bacce7cbf', 'en', 'Glass bottom boat Hurghada with snorkeling (30 min.) & hotel transfer', '<table class="tour-pricing-table"><thead><tr><th>Price</th><th>Trip type</th><th>Start of trip</th><th>Pick-up</th></tr></thead><tbody><tr><td>From 20 € per person</td><td>Group tour</td><td>daily</td><td>approx. 12:00 p.m.</td></tr></tbody></table>
With the glass bottom boat in Hurghada you will discover the fascinating underwater world of the Red Sea without getting wet. Through the large panoramic windows in the boat you can observe colorful coral reefs, clownfish, surgeonfish and many other sea creatures from the comfort of your seat.





After the boat trip we dock at a quiet snorkeling spot. There you have the opportunity to experience the underwater world for yourself during guided snorkeling. The snorkeling time is around 30 minutes and is also ideal for beginners.





Life jacket, snorkel and mask are already included in the price. Our German-speaking support ensures that you feel safe and comfortable at all times.





🌊 Why this excursion is so popular





The glass bottom boat excursion combines two experiences in one tour: relaxed observation of the underwater world from the boat and active snorkeling in the Red Sea.





The tour is particularly popular with families with children, non-swimmers and guests who want to explore Hurghada''s coral reefs in a safe and comfortable way.', 'The glass bottom boat excursion in Hurghada with snorkeling is one of the most booked Hurghada excursions. Discover coral reefs and tropical fish through the glass bottom and then enjoy 30 minutes of snorkeling in the Red Sea - including transfer, equipment and German-speaking supervision', 'Snorkeling & diving', '["Glass bottom boat with panoramic views of coral reefs","30 minutes snorkeling in the Red Sea","Popular family excursion in the Red Sea","Perfect for families & beginners","Snorkeling equipment included","Hotel transfer included"]'::jsonb, '["Hotel pickup & drop-off","Glass bottom boat ride","30 minute snorkel stop","Snorkeling equipment & life jacket","Mineral water & soft drinks"]'::jsonb, '["Personal expenses","Tip (optional)","Transfer surcharges for certain regions"]'::jsonb, 'Hurghada–Red Sea–Egypt', '3h', NULL, NULL, NULL, NULL, '[{"question":"Private speedboat tour to Orange Bay from Hurghada – snorkeling & island trip","answer":"LocationHurghada Duration6 hours Private speedboat tour to Orange Bay from Hurghada... from €60.00"}]'::jsonb),
('tours', '0009b90b-71a9-4e78-8459-e56bacce7cbf', 'hu', 'Üvegfenekű hajó Hurghada sznorkelezéssel (30 perc) és szállodai transzferrel', '<table class="tour-pricing-table"><thead><tr><th>Ár</th><th>Utazás típusa</th><th>Utazás kezdete</th><th>Utazás</th></tr></thead><tbody><tr><td>20 €-tól személyenként</td><td>Csoportos túra</td><tdd>naponta 12:00</td></tr></tbody></table>
Az üvegfenekű csónakkal Hurghadában felfedezheti a Vörös-tenger lenyűgöző víz alatti világát anélkül, hogy elázna. A csónakban található nagy panorámaablakokon keresztül kényelmesen, kényelmesen nézheti meg a színes korallzátonyokat, bohóchalakat, sebészhalakat és sok más tengeri élőlényt.





A hajókirándulás után kikötünk egy csendes sznorkelezési helyre. Itt lehetősége van saját maga is megtapasztalni a víz alatti világot vezetett sznorkelezés során. A snorkelezési idő körülbelül 30 perc, és kezdőknek is ideális.





Mentőmellény, légzőcső és maszk már benne van az árban. Német nyelvű támogatásunk biztosítja, hogy mindig biztonságban és kényelmesen érezze magát.





🌊 Miért olyan népszerű ez a kirándulás?





Az üvegfenekű hajókirándulás két élményt egyesít egy túrában: a víz alatti világ nyugodt megfigyelését a hajóból és az aktív sznorkelezést a Vörös-tengeren.





A túra különösen népszerű a gyermekes családok, az úszni nem tudó személyek és a Hurghada korallzátonyait biztonságosan és kényelmesen felfedezni vágyó vendégek körében.', 'A hurghadai üvegfenekű hajókirándulás sznorkelezéssel az egyik legtöbbet lefoglalt hurghadai kirándulás. Fedezze fel a korallzátonyokat és a trópusi halakat az üvegfenéken keresztül, majd élvezze a 30 perces sznorkelezést a Vörös-tengeren – transzferrel, felszereléssel és németül beszélő felügyelettel', 'Sznorkelezés és búvárkodás', '["Üvegfenekű hajó panorámás kilátással a korallzátonyokra","30 perc snorkeling a Vörös-tengeren","Népszerű családi kirándulás a Vörös-tengeren","Tökéletes családoknak és kezdőknek","Snorkeling felszerelés tartalmazza","Szállodai transzfert tartalmaz"]'::jsonb, '["Szállodai átvétel és leszállás","Üvegfenekű csónakázás","30 perc snorkel stop","Snorkel felszerelés és mentőmellény","Ásványvíz és üdítőitalok"]'::jsonb, '["Személyi kiadások","Tipp (opcionális)","Transzfer felárak bizonyos régiókban"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '3 óra', NULL, NULL, NULL, NULL, '[{"question":"Privát motorcsónakos kirándulás az Orange-öbölbe Hurghadából – sznorkelezés és kirándulás a szigetre","answer":"ElhelyezkedésHurghada Időtartam6 óra Privát motorcsónakos kirándulás az Orange-öbölbe Hurghadából... 60,00 €-tól"}]'::jsonb),
('tours', '0009b90b-71a9-4e78-8459-e56bacce7cbf', 'ru', 'Лодка со стеклянным дном в Хургаде, сноркелинг (30 мин.) и трансфер из отеля.
---ЦЭП---
Экскурсия на лодке со стеклянным дном в Хургаде с подводным плаванием — одна из самых заказываемых экскурсий в Хургаде. Откройте для себя коралловые рифы и тропических рыб через стеклянное дно, а затем насладитесь 30-минутным подводным плаванием в Красном море, включая трансфер, снаряжение и немецкоязычный контроль.
---ЦЭП---
Подводное плавание и дайвинг
---ЦЭП---
Хургада – Красное море – Египет
---ЦЭП---
3 часа
---ЦЭП---
<table class="tour-pricing-table"><thead><tr><th>Цена</th><th>Тип поездки</th><th>Начало поездки</th><th>Самовывоз</th></tr></thead><tbody><tr><td>От 20 евро на человека</td><td>Групповой тур</td><td>ежедневно</td><td>ок. 12:00</td></tr></tbody></table>
На лодке со стеклянным дном в Хургаде вы откроете для себя увлекательный подводный мир Красного моря, не намокнув. Через большие панорамные окна лодки вы можете наблюдать за красочными коралловыми рифами, рыбами-клоунами, рыбами-хирургами и многими другими морскими существами, не выходя из своего кресла.





После прогулки на лодке мы пришвартуемся в тихом месте для подводного плавания. Там у вас есть возможность лично познакомиться с подводным миром во время подводного плавания с гидом. Время подводного плавания составляет около 30 минут и идеально подходит для новичков.





Спасательный жилет, трубка и маска уже включены в стоимость. Наша немецкоязычная поддержка гарантирует, что вы всегда будете чувствовать себя безопасно и комфортно.





🌊 Почему эта экскурсия так популярна





Экскурсия на лодке со стеклянным дном объединяет в одном туре два впечатления: спокойное наблюдение за подводным миром с лодки и активный снорклинг в Красном море.





Тур особенно популярен среди семей с детьми, тех, кто не умеет плавать, и гостей, которые хотят исследовать коралловые рифы Хургады безопасным и комфортным способом.
---ЦЭП---
Лодка со стеклянным дном и панорамным видом на коралловые рифы
---РАЗДЕЛЕНИЕ---
30 минут подводного плавания в Красном море
---РАЗДЕЛЕНИЕ---
Популярная семейная экскурсия по Красному морю.
---РАЗДЕЛЕНИЕ---
Идеально подходит для семей и начинающих
---РАЗДЕЛЕНИЕ---
Снаряжение для подводного плавания включено
---РАЗДЕЛЕНИЕ---
Трансфер в отель включен
---ЦЭП---
Встреча в отеле и высадка
---РАЗДЕЛЕНИЕ---
Поездка на лодке со стеклянным дном
---РАЗДЕЛЕНИЕ---
30-минутная остановка для сноркелинга
---РАЗДЕЛЕНИЕ---
Снаряжение для подводного плавания и спасательный жилет
---РАЗДЕЛЕНИЕ---
Минеральная вода и безалкогольные напитки
---ЦЭП---
Личные расходы
---РАЗДЕЛЕНИЕ---
Совет (необязательно)
---РАЗДЕЛЕНИЕ---
Комиссия за трансфер для определенных регионов
---ЦЭП---
Частный тур на скоростном катере в Оранжевый залив из Хургады – подводное плавание и поездка на остров
---ЦЭП---
МестоположениеХургада Продолжительность: 6 часов Частный тур на скоростном катере в Оранжевый залив из Хургады... от 60,00 евро.', '<table class="tour-pricing-table"><thead><tr><th>Preis</th><th>Reisetyp</th><th>Reiseantritt</th><th>Abholung</th></tr></thead><tbody><tr><td>Ab 20 € p.P.</td><td>Gruppentour</td><td>täglich</td><td>ca. 12:00 Uhr</td></tr></tbody></table>
Mit dem Glasbodenboot in Hurghada entdecken Sie die faszinierende Unterwasserwelt des Roten Meeres, ohne nass zu werden. Durch die großen Panoramafenster im Boot beobachten Sie farbenfrohe Korallenriffe, Clownfische, Doktorfische und viele weitere Meeresbewohner bequem von Ihrem Sitzplatz aus.





Nach der Bootsfahrt legen wir an einem ruhigen Schnorchelplatz an. Dort haben Sie die Möglichkeit, die Unterwasserwelt beim geführten Schnorcheln selbst zu erleben. Die Schnorchelzeit beträgt etwa 30 Minuten und eignet sich auch hervorragend für Anfänger.





Schwimmweste, Schnorchel und Maske sind bereits im Preis enthalten. Unsere deutschsprachige Betreuung sorgt dafür, dass Sie sich jederzeit sicher und wohl fühlen.





🌊 Warum dieser Ausflug so beliebt ist





Der Glasbodenboot-Ausflug kombiniert zwei Erlebnisse in einer Tour: die entspannte Beobachtung der Unterwasserwelt vom Boot aus und das aktive Schnorcheln im Roten Meer.





Die Tour ist besonders beliebt bei Familien mit Kindern, Nichtschwimmern und Gästen, die die Korallenriffe Hurghadas auf sichere und komfortable Weise entdecken möchten.', 'Der Glasbodenboot-Ausflug in Hurghada mit Schnorcheln gehört zu den meistgebuchten Hurghada Ausflügen. Entdecken Sie Korallenriffe und tropische Fische durch den Glasboden und genießen Sie anschließend 30 Minuten Schnorcheln im Roten Meer – inklusive Transfer, Ausrüstung und deutschsprachiger Betreu', 'Schnorcheln & Tauchen', '["Glasbodenboot mit Panoramablick auf Korallenriffe","30 Minuten Schnorcheln im Roten Meer","Beliebter Familienausflug im Roten Meer","Perfekt für Familien & Anfänger","Schnorchelausrüstung inklusive","Hoteltransfer inklusive"]'::jsonb, '["Abholung & Rücktransfer vom Hotel","Fahrt mit dem Glasbodenboot","30-minütiger Schnorchelstopp","Schnorchelausrüstung & Schwimmweste","Mineralwasser & Softdrinks"]'::jsonb, '["Persönliche Ausgaben","Trinkgeld (optional)","Transferzuschläge für bestimmte Regionen"]'::jsonb, 'Hurghada–Rotes Meer–Ägypten', '3h', NULL, NULL, NULL, NULL, '[{"question":"Private Speedboot Tour zur Orange Bay ab Hurghada – Schnorcheln & Inseltrip","answer":"LocationHurghada Dauer6 Stunden Private Speedboot Tour zur Orange Bay ab Hurghada... ab60.00 &euro;"}]'::jsonb),
('tours', '0009b90b-71a9-4e78-8459-e56bacce7cbf', 'fr', 'Bateau à fond de verre Hurghada avec plongée en apnée (30 min.) et transfert à l''hôtel', '<table class="tour-pricing-table"><thead><tr><th>Prix</th><th>Type de voyage</th><th>Début du voyage</th><th>Prise en charge</th></tr></thead><tbody><tr><td>À partir de 20 € par personne</td><td>Visite de groupe</td><td>par jour</td><td>env. 12h00</td></tr></tbody></table>
Avec le bateau à fond de verre à Hurghada, vous découvrirez le monde sous-marin fascinant de la mer Rouge sans vous mouiller. Grâce aux grandes fenêtres panoramiques du bateau, vous pourrez observer les récifs coralliens colorés, les poissons-clowns, les poissons chirurgiens et bien d''autres créatures marines depuis le confort de votre siège.





Après la promenade en bateau, nous accosterons dans un endroit calme pour faire de la plongée en apnée. Là, vous avez la possibilité de découvrir le monde sous-marin par vous-même lors d''une plongée en apnée guidée. La durée de la plongée en apnée est d''environ 30 minutes et est également idéale pour les débutants.





Gilet de sauvetage, tuba et masque sont déjà inclus dans le prix. Notre assistance germanophone garantit que vous vous sentez en sécurité et à l''aise à tout moment.





🌊 Pourquoi cette excursion est si populaire





L''excursion en bateau à fond de verre combine deux expériences en une seule visite : observation détendue du monde sous-marin depuis le bateau et plongée en apnée active dans la mer Rouge.





L''excursion est particulièrement populaire auprès des familles avec enfants, des non-nageurs et des clients souhaitant explorer les récifs coralliens d''Hurghada de manière sûre et confortable.', 'L''excursion en bateau à fond de verre à Hurghada avec plongée en apnée est l''une des excursions les plus réservées à Hurghada. Découvrez les récifs coralliens et les poissons tropicaux à travers le fond de verre puis profitez de 30 minutes de plongée en apnée en mer Rouge - transfert, équipement et encadrement germanophone compris', 'Snorkeling et plongée', '["Bateau à fond de verre avec vue panoramique sur les récifs coralliens","30 minutes de plongée en apnée dans la mer Rouge","Excursion familiale populaire en mer Rouge","Parfait pour les familles et les débutants","Équipement de plongée en apnée inclus","Transfert hôtel inclus"]'::jsonb, '["Prise en charge et retour à l''hôtel","Promenade en bateau à fond de verre","Arrêt de plongée avec tuba de 30 minutes","Équipement de plongée en apnée et gilet de sauvetage","Eau minérale et boissons gazeuses"]'::jsonb, '["Dépenses personnelles","Astuce (facultatif)","Suppléments de transfert pour certaines régions"]'::jsonb, 'Hurghada – Mer Rouge – Égypte', '3h', NULL, NULL, NULL, NULL, '[{"question":"Excursion privée en hors-bord à Orange Bay depuis Hurghada – plongée en apnée et excursion sur l''île","answer":"LocalisationHurghada Durée6 heures Excursion privée en hors-bord à Orange Bay depuis Hurghada... à partir de 60,00 €"}]'::jsonb),
('tours', '0009b90b-71a9-4e78-8459-e56bacce7cbf', 'ar', 'القارب ذو القاع الزجاجي بالغردقة مع الغطس (30 دقيقة) والنقل من الفندق
--- تسيب ---
تعد رحلة القارب ذو القاع الزجاجي في الغردقة مع الغطس واحدة من أكثر رحلات الغردقة حجزًا. اكتشف الشعاب المرجانية والأسماك الاستوائية من خلال القاع الزجاجي ثم استمتع بالغطس لمدة 30 دقيقة في البحر الأحمر - بما في ذلك النقل والمعدات والإشراف الناطق باللغة الألمانية
--- تسيب ---
الغطس والغوص
--- تسيب ---
الغردقة – البحر الأحمر – مصر
--- تسيب ---
3 ساعات
--- تسيب ---
<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>بداية الرحلة</th><th>النقل</th></tr></thead><tbody><tr><td>من 20 يورو للشخص الواحد</td><td>جولة جماعية</td><td>يوميًا</td><td>تقريبًا. الساعة 12:00 ظهرًا</td></tr></tbody></table>
مع القارب ذو القاع الزجاجي في الغردقة، سوف تكتشف عالم البحر الأحمر الرائع تحت الماء دون أن تتبلل. من خلال النوافذ البانورامية الكبيرة في القارب، يمكنك مراقبة الشعاب المرجانية الملونة وسمك المهرج وسمك الجراح والعديد من الكائنات البحرية الأخرى وأنت مرتاح في مقعدك.





بعد رحلة القارب، نرسوا في مكان هادئ للغطس. هناك لديك الفرصة لتجربة العالم تحت الماء بنفسك أثناء الغطس المصحوب بمرشدين. يستغرق وقت الغطس حوالي 30 دقيقة وهو مثالي أيضًا للمبتدئين.





سترة النجاة والغطس والقناع متضمنة بالفعل في السعر. يضمن دعمنا الناطق باللغة الألمانية أنك تشعر بالأمان والراحة في جميع الأوقات.





🌊 لماذا تحظى هذه الرحلة بشعبية كبيرة؟





تجمع رحلة القارب ذو القاع الزجاجي بين تجربتين في جولة واحدة: المراقبة المريحة للعالم تحت الماء من القارب والغطس النشط في البحر الأحمر.





تحظى الجولة بشعبية خاصة بين العائلات التي لديها أطفال وغير السباحين والضيوف الذين يرغبون في استكشاف الشعاب المرجانية في الغردقة بطريقة آمنة ومريحة.
--- تسيب ---
قارب ذو قاع زجاجي مع إطلالة بانورامية على الشعاب المرجانية
---تقسيم---
30 دقيقة غطس في البحر الأحمر
---تقسيم---
رحلة عائلية شعبية في البحر الأحمر
---تقسيم---
مثالية للعائلات والمبتدئين
---تقسيم---
معدات الغطس متضمنة
---تقسيم---
شامل النقل من الفندق
--- تسيب ---
الاستقبال والتوصيل من الفندق
---تقسيم---
ركوب القارب ذو القاع الزجاجي
---تقسيم---
توقف الغطس لمدة 30 دقيقة
---تقسيم---
معدات الغطس وسترة النجاة
---تقسيم---
المياه المعدنية والمشروبات الغازية
--- تسيب ---
النفقات الشخصية
---تقسيم---
نصيحة (اختياري)
---تقسيم---
تحويل الرسوم الإضافية لمناطق معينة
--- تسيب ---
جولة خاصة بالقارب السريع إلى أورانج باي من الغردقة - رحلة الغطس والجزيرة
--- تسيب ---
الموقعالغردقة المدة 6 ساعات جولة خاصة بالقارب السريع إلى أورانج باي من الغردقة... تبدأ من 60.00 يورو', '<table class="tour-pricing-table"><thead><tr><th>Preis</th><th>Reisetyp</th><th>Reiseantritt</th><th>Abholung</th></tr></thead><tbody><tr><td>Ab 20 € p.P.</td><td>Gruppentour</td><td>täglich</td><td>ca. 12:00 Uhr</td></tr></tbody></table>
Mit dem Glasbodenboot in Hurghada entdecken Sie die faszinierende Unterwasserwelt des Roten Meeres, ohne nass zu werden. Durch die großen Panoramafenster im Boot beobachten Sie farbenfrohe Korallenriffe, Clownfische, Doktorfische und viele weitere Meeresbewohner bequem von Ihrem Sitzplatz aus.





Nach der Bootsfahrt legen wir an einem ruhigen Schnorchelplatz an. Dort haben Sie die Möglichkeit, die Unterwasserwelt beim geführten Schnorcheln selbst zu erleben. Die Schnorchelzeit beträgt etwa 30 Minuten und eignet sich auch hervorragend für Anfänger.





Schwimmweste, Schnorchel und Maske sind bereits im Preis enthalten. Unsere deutschsprachige Betreuung sorgt dafür, dass Sie sich jederzeit sicher und wohl fühlen.





🌊 Warum dieser Ausflug so beliebt ist





Der Glasbodenboot-Ausflug kombiniert zwei Erlebnisse in einer Tour: die entspannte Beobachtung der Unterwasserwelt vom Boot aus und das aktive Schnorcheln im Roten Meer.





Die Tour ist besonders beliebt bei Familien mit Kindern, Nichtschwimmern und Gästen, die die Korallenriffe Hurghadas auf sichere und komfortable Weise entdecken möchten.', 'Der Glasbodenboot-Ausflug in Hurghada mit Schnorcheln gehört zu den meistgebuchten Hurghada Ausflügen. Entdecken Sie Korallenriffe und tropische Fische durch den Glasboden und genießen Sie anschließend 30 Minuten Schnorcheln im Roten Meer – inklusive Transfer, Ausrüstung und deutschsprachiger Betreu', 'Schnorcheln & Tauchen', '["Glasbodenboot mit Panoramablick auf Korallenriffe","30 Minuten Schnorcheln im Roten Meer","Beliebter Familienausflug im Roten Meer","Perfekt für Familien & Anfänger","Schnorchelausrüstung inklusive","Hoteltransfer inklusive"]'::jsonb, '["Abholung & Rücktransfer vom Hotel","Fahrt mit dem Glasbodenboot","30-minütiger Schnorchelstopp","Schnorchelausrüstung & Schwimmweste","Mineralwasser & Softdrinks"]'::jsonb, '["Persönliche Ausgaben","Trinkgeld (optional)","Transferzuschläge für bestimmte Regionen"]'::jsonb, 'Hurghada–Rotes Meer–Ägypten', '3h', NULL, NULL, NULL, NULL, '[{"question":"Private Speedboot Tour zur Orange Bay ab Hurghada – Schnorcheln & Inseltrip","answer":"LocationHurghada Dauer6 Stunden Private Speedboot Tour zur Orange Bay ab Hurghada... ab60.00 &euro;"}]'::jsonb),
('tours', 'b604535f-6c99-4766-9150-c29fbbf5678c', 'en', 'Eden Island Snorkeling Trip Hurghada with Lunch', '<table class="tour-pricing-table"><thead><tr><th>Price</th><th>Trip type</th><th>Start of trip</th><th>Pick-up</th></tr></thead><tbody><tr><td>From 75 € per person</td><td>Group tour</td><td>daily</td><td>approx. 8:00 a.m.</td></tr></tbody></table>
Discover the beautiful Eden Island on an unforgettable snorkeling trip from Hurghada. Look forward to crystal clear water, colorful coral reefs and a relaxing day on the island''s beautiful sandy beach.





After hotel pickup, drive to the harbor and take off by boat towards Eden Island. On the way you will visit popular snorkeling areas in the Red Sea, where you can experience the fascinating underwater world with colorful fish and impressive coral formations.





Once on Eden Island, enjoy free time to swim, sunbathe and relax. The turquoise water and the idyllic atmosphere make the island one of the most popular excursion destinations in Hurghada.





Lunch is included during the excursion. The excursion is ideal for couples, families, friends and anyone looking to spend a relaxing day on the Red Sea.





Why this excursion is so popular:





✓ Snorkeling on colorful coral reefs


✓ Stay on the beautiful Eden Island


✓ Crystal clear water and fine sandy beach


✓ Hotel transfer included


✓ Lunch during the excursion


✓ Suitable for beginners and experienced snorkelers', 'Experience an unforgettable snorkeling trip to Eden Island from Hurghada with hotel transfer, boat ride, lunch and time to swim and relax in the Red Sea.', 'Snorkeling & diving', '["Hotel transfer from Hurghada included","Boat trip on the Red Sea","Snorkeling on colorful coral reefs","Stay on Eden Island","Lunch included","Free time to swim and relax","Professional snorkeling escort"]'::jsonb, '["Hotel pickup and drop-off","Air-conditioned vehicle transfer","Professional snorkeling guide","Snorkeling equipment","Entrance to Eden Island","Boat ride & life jackets","Snorkeling equipment","Lunch + coffee, tea or soda"]'::jsonb, '["Personal expenses","Tip","Transfer surcharges for certain regions"]'::jsonb, 'Hurghada - Red Sea - Egypt', '8h', NULL, NULL, NULL, NULL, '[{"question":"Private speedboat tour to Orange Bay from Hurghada – snorkeling & island trip","answer":"LocationHurghada Duration6 hours Private speedboat tour to Orange Bay from Hurghada... from €60.00"}]'::jsonb),
('tours', 'b604535f-6c99-4766-9150-c29fbbf5678c', 'fr', 'Excursion de plongée en apnée à Eden Island à Hurghada avec déjeuner', '<table class="tour-pricing-table"><thead><tr><th>Prix</th><th>Type de voyage</th><th>Début du voyage</th><th>Prise en charge</th></tr></thead><tbody><tr><td>À partir de 75 € par personne</td><td>Visite de groupe</td><td>par jour</td><td>env. 8h00</td></tr></tbody></table>
Découvrez la magnifique Eden Island lors d''un voyage de plongée en apnée inoubliable au départ d''Hurghada. Réjouissez-vous d''une eau cristalline, de récifs coralliens colorés et d''une journée de détente sur la magnifique plage de sable de l''île.





Après la prise en charge à l''hôtel, dirigez-vous vers le port et décollez en bateau en direction d''Eden Island. En chemin, vous visiterez les zones de plongée en apnée populaires de la mer Rouge, où vous pourrez découvrir le monde sous-marin fascinant avec des poissons colorés et des formations coralliennes impressionnantes.





Une fois sur Eden Island, profitez de temps libre pour nager, bronzer et vous détendre. L''eau turquoise et l''atmosphère idyllique font de l''île l''une des destinations d''excursion les plus populaires d''Hurghada.





Le déjeuner est inclus pendant l''excursion. L''excursion est idéale pour les couples, les familles, les amis et tous ceux qui souhaitent passer une journée de détente sur la mer Rouge.





Pourquoi cette excursion est si populaire :





✓ Snorkeling sur les récifs coralliens colorés


✓ Restez sur la magnifique Eden Island


✓ Eau cristalline et plage de sable fin


✓ Transfert hôtel inclus


✓ Déjeuner pendant l''excursion


✓ Convient aux plongeurs débutants et expérimentés', 'Vivez un voyage de plongée en apnée inoubliable à Eden Island depuis Hurghada avec transfert à l''hôtel, promenade en bateau, déjeuner et temps pour nager et vous détendre dans la mer Rouge.', 'Snorkeling et plongée', '["Transfert à l''hôtel depuis Hurghada inclus","Promenade en bateau sur la Mer Rouge","Plongée en apnée sur les récifs coralliens colorés","Restez sur Eden Island","Déjeuner inclus","Temps libre pour nager et se détendre","Escorte professionnelle de plongée en apnée"]'::jsonb, '["Prise en charge et retour à l''hôtel","Transfert en véhicule climatisé","Guide professionnel de plongée en apnée","Équipement de plongée en apnée","Entrée à Eden Island","Promenade en bateau et gilets de sauvetage","Équipement de plongée en apnée","Déjeuner + café, thé ou soda"]'::jsonb, '["Dépenses personnelles","Astuce","Suppléments de transfert pour certaines régions"]'::jsonb, 'Hurghada - Mer Rouge - Egypte', '8h', NULL, NULL, NULL, NULL, '[{"question":"Excursion privée en hors-bord à Orange Bay depuis Hurghada – plongée en apnée et excursion sur l''île","answer":"LocalisationHurghada Durée6 heures Excursion privée en hors-bord à Orange Bay depuis Hurghada... à partir de 60,00 €"}]'::jsonb),
('tours', 'b604535f-6c99-4766-9150-c29fbbf5678c', 'ru', 'Поездка на остров Эдем с маской и трубкой в Хургаду с обедом
---ЦЭП---
Совершите незабываемое путешествие с подводным плаванием на остров Эдем из Хургады с трансфером из отеля, поездкой на лодке, обедом и временем для купания и отдыха в Красном море.
---ЦЭП---
Подводное плавание и дайвинг
---ЦЭП---
Хургада - Красное море - Египет
---ЦЭП---
8 часов
---ЦЭП---
<table class="tour-pricing-table"><thead><tr><th>Цена</th><th>Тип поездки</th><th>Начало поездки</th><th>Самовывоз</th></tr></thead><tbody><tr><td>От 75 евро на человека</td><td>Групповой тур</td><td>ежедневно</td><td>ок. 8:00 утра</td></tr></tbody></table>
Откройте для себя прекрасный остров Эдем в незабываемом путешествии с подводным плаванием из Хургады. Вас ждут кристально чистая вода, красочные коралловые рифы и расслабляющий день на прекрасном песчаном пляже острова.





После встречи в отеле отправляйтесь в гавань и отправляйтесь на лодке к острову Иден. По пути вы посетите популярные места для подводного плавания на Красном море, где вы сможете познакомиться с захватывающим подводным миром с разноцветными рыбами и впечатляющими коралловыми образованиями.





Оказавшись на острове Эдем, наслаждайтесь свободным временем, чтобы купаться, загорать и отдыхать. Бирюзовая вода и идиллическая атмосфера делают остров одним из самых популярных экскурсионных направлений в Хургаде.





Обед включен во время экскурсии. Экскурсия идеально подходит для пар, семей, друзей и всех, кто хочет провести расслабляющий день на Красном море.





Почему эта экскурсия так популярна:





✓ Снорклинг на красочных коралловых рифах


✓ Пребывание на прекрасном острове Эдем


✓ Кристально чистая вода и прекрасный песчаный пляж


✓ Трансфер из отеля включен


✓ Обед во время экскурсии


✓ Подходит для начинающих и опытных любителей подводного плавания.
---ЦЭП---
Трансфер из Хургады включен в стоимость.
---РАЗДЕЛЕНИЕ---
Морская прогулка по Красному морю
---РАЗДЕЛЕНИЕ---
Подводное плавание на красочных коралловых рифах
---РАЗДЕЛЕНИЕ---
Пребывание на острове Эдем
---РАЗДЕЛЕНИЕ---
Обед включен
---РАЗДЕЛЕНИЕ---
Свободное время для купания и отдыха
---РАЗДЕЛЕНИЕ---
Профессиональный сопровождающий для подводного плавания
---ЦЭП---
Встреча в отеле и высадка
---РАЗДЕЛЕНИЕ---
Трансфер на автомобиле с кондиционером
---РАЗДЕЛЕНИЕ---
Профессиональный гид по подводному плаванию
---РАЗДЕЛЕНИЕ---
Оборудование для подводного плавания
---РАЗДЕЛЕНИЕ---
Вход на остров Эдем
---РАЗДЕЛЕНИЕ---
Поездка на лодке и спасательные жилеты
---РАЗДЕЛЕНИЕ---
Оборудование для подводного плавания
---РАЗДЕЛЕНИЕ---
Обед + кофе, чай или газировка
---ЦЭП---
Личные расходы
---РАЗДЕЛЕНИЕ---
Совет
---РАЗДЕЛЕНИЕ---
Комиссия за трансфер для определенных регионов
---ЦЭП---
Частный тур на скоростном катере в Оранжевый залив из Хургады – подводное плавание и поездка на остров
---ЦЭП---
МестоположениеХургада Продолжительность: 6 часов Частный тур на скоростном катере в Оранжевый залив из Хургады... от 60,00 евро.', '<table class="tour-pricing-table"><thead><tr><th>Preis</th><th>Reisetyp</th><th>Reiseantritt</th><th>Abholung</th></tr></thead><tbody><tr><td>Ab 75 € p.P.</td><td>Gruppentour</td><td>täglich</td><td>ca. 8:00 Uhr</td></tr></tbody></table>
Entdecken Sie die traumhafte Eden Island bei einem unvergesslichen Schnorchelausflug ab Hurghada. Freuen Sie sich auf kristallklares Wasser, farbenprächtige Korallenriffe und einen entspannten Tag am wunderschönen Sandstrand der Insel.





Nach der Hotelabholung fahren Sie zum Hafen und starten mit dem Boot in Richtung Eden Island. Unterwegs besuchen Sie beliebte Schnorchelgebiete im Roten Meer, wo Sie die faszinierende Unterwasserwelt mit bunten Fischen und beeindruckenden Korallenformationen erleben können.





Auf Eden Island angekommen genießen Sie freie Zeit zum Schwimmen, Sonnenbaden und Entspannen. Das türkisfarbene Wasser und die idyllische Atmosphäre machen die Insel zu einem der beliebtesten Ausflugsziele in Hurghada.





Während des Ausflugs ist ein Mittagessen inklusive. Der Ausflug eignet sich ideal für Paare, Familien, Freunde und alle, die einen entspannten Tag auf dem Roten Meer verbringen möchten.





Warum dieser Ausflug so beliebt ist:





✓ Schnorcheln an farbenreichen Korallenriffen


✓ Aufenthalt auf der wunderschönen Eden Island


✓ Kristallklares Wasser und feiner Sandstrand


✓ Hoteltransfer inklusive


✓ Mittagessen während des Ausflugs


✓ Geeignet für Anfänger und erfahrene Schnorchler', 'Erleben Sie einen unvergesslichen Schnorchelausflug zur Eden Island ab Hurghada mit Hoteltransfer, Bootsfahrt, Mittagessen und Zeit zum Schwimmen und Entspannen im Roten Meer.', 'Schnorcheln & Tauchen', '["Hoteltransfer ab Hurghada inklusive","Bootsfahrt auf dem Roten Meer","Schnorcheln an farbenreichen Korallenriffen","Aufenthalt auf Eden Island","Mittagessen inklusive","Freizeit zum Schwimmen und Entspannen","Professionelle Schnorchelbegleitung"]'::jsonb, '["Hotelabholung und Rücktransfer","Klimatisierter Fahrzeugtransfer","Professioneller Schnorchelguide","Schnorchelausrüstung","Eintritt zu Eden Island","Bootsfahrt & Schwimmwesten","Schnorchelausrüstung","Mittagessen + Kaffee, Tee oder Soda"]'::jsonb, '["Persönliche Ausgaben","Trinkgeld","Transferzuschläge für bestimmte Regionen"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '8h', NULL, NULL, NULL, NULL, '[{"question":"Private Speedboot Tour zur Orange Bay ab Hurghada – Schnorcheln & Inseltrip","answer":"LocationHurghada Dauer6 Stunden Private Speedboot Tour zur Orange Bay ab Hurghada... ab60.00 &euro;"}]'::jsonb),
('tours', 'b604535f-6c99-4766-9150-c29fbbf5678c', 'ar', 'رحلة الغطس في جزيرة عدن بالغردقة مع الغداء
--- تسيب ---
استمتع برحلة غطس لا تُنسى إلى جزيرة عدن من الغردقة مع خدمة النقل من الفندق وركوب القارب والغداء ووقت للسباحة والاسترخاء في البحر الأحمر.
--- تسيب ---
الغطس والغوص
--- تسيب ---
الغردقة - البحر الأحمر - مصر
--- تسيب ---
8 ساعات
--- تسيب ---
<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>بداية الرحلة</th><th>النقل</th></tr></thead><tbody><tr><td>من 75 يورو للشخص الواحد</td><td>جولة جماعية</td><td>يوميًا</td><td>تقريبًا. 8:00 صباحًا</td></tr></tbody></table>
اكتشف جزيرة عدن الجميلة في رحلة غطس لا تُنسى من الغردقة. تطلع إلى المياه الصافية والشعاب المرجانية الملونة وقضاء يوم من الاسترخاء على شاطئ الجزيرة الرملي الجميل.





بعد النقل من الفندق، توجه إلى الميناء وانطلق بالقارب باتجاه جزيرة عدن. وفي الطريق ستزور مناطق الغطس الشهيرة في البحر الأحمر، حيث يمكنك تجربة عالم تحت الماء الرائع مع الأسماك الملونة والتكوينات المرجانية الرائعة.





بمجرد وصولك إلى جزيرة عدن، استمتع بوقت حر للسباحة والتشمس والاسترخاء. المياه الفيروزية والأجواء المثالية تجعل الجزيرة واحدة من الوجهات السياحية الأكثر شعبية في الغردقة.





يتم تضمين الغداء خلال الرحلة. تعتبر الرحلة مثالية للأزواج والعائلات والأصدقاء وأي شخص يتطلع إلى قضاء يوم من الاسترخاء على البحر الأحمر.





لماذا تحظى هذه الرحلة بشعبية كبيرة:





✓ الغطس على الشعاب المرجانية الملونة


✓ البقاء في جزيرة عدن الجميلة


✓ مياه صافية وشاطئ رملي ناعم


✓ شامل النقل من الفندق


✓ تناول وجبة الغداء خلال الرحلة


✓ مناسبة للمبتدئين والسباحين ذوي الخبرة
--- تسيب ---
شامل النقل من الفندق من الغردقة
---تقسيم---
رحلة بالقارب في البحر الأحمر
---تقسيم---
الغطس على الشعاب المرجانية الملونة
---تقسيم---
البقاء في جزيرة عدن
---تقسيم---
الغداء متضمن
---تقسيم---
وقت حر للسباحة والاسترخاء
---تقسيم---
مرافقة الغطس المهنية
--- تسيب ---
الاستقبال والتوصيل من الفندق
---تقسيم---
نقل بمركبة مكيفة
---تقسيم---
دليل الغطس الاحترافي
---تقسيم---
معدات الغطس
---تقسيم---
مدخل جزيرة عدن
---تقسيم---
ركوب القوارب وسترات النجاة
---تقسيم---
معدات الغطس
---تقسيم---
الغداء + القهوة أو الشاي أو الصودا
--- تسيب ---
النفقات الشخصية
---تقسيم---
نصيحة
---تقسيم---
تحويل الرسوم الإضافية لمناطق معينة
--- تسيب ---
جولة خاصة بالقارب السريع إلى أورانج باي من الغردقة - رحلة الغطس والجزيرة
--- تسيب ---
الموقعالغردقة المدة 6 ساعات جولة خاصة بالقارب السريع إلى أورانج باي من الغردقة... تبدأ من 60.00 يورو', '<table class="tour-pricing-table"><thead><tr><th>Preis</th><th>Reisetyp</th><th>Reiseantritt</th><th>Abholung</th></tr></thead><tbody><tr><td>Ab 75 € p.P.</td><td>Gruppentour</td><td>täglich</td><td>ca. 8:00 Uhr</td></tr></tbody></table>
Entdecken Sie die traumhafte Eden Island bei einem unvergesslichen Schnorchelausflug ab Hurghada. Freuen Sie sich auf kristallklares Wasser, farbenprächtige Korallenriffe und einen entspannten Tag am wunderschönen Sandstrand der Insel.





Nach der Hotelabholung fahren Sie zum Hafen und starten mit dem Boot in Richtung Eden Island. Unterwegs besuchen Sie beliebte Schnorchelgebiete im Roten Meer, wo Sie die faszinierende Unterwasserwelt mit bunten Fischen und beeindruckenden Korallenformationen erleben können.





Auf Eden Island angekommen genießen Sie freie Zeit zum Schwimmen, Sonnenbaden und Entspannen. Das türkisfarbene Wasser und die idyllische Atmosphäre machen die Insel zu einem der beliebtesten Ausflugsziele in Hurghada.





Während des Ausflugs ist ein Mittagessen inklusive. Der Ausflug eignet sich ideal für Paare, Familien, Freunde und alle, die einen entspannten Tag auf dem Roten Meer verbringen möchten.





Warum dieser Ausflug so beliebt ist:





✓ Schnorcheln an farbenreichen Korallenriffen


✓ Aufenthalt auf der wunderschönen Eden Island


✓ Kristallklares Wasser und feiner Sandstrand


✓ Hoteltransfer inklusive


✓ Mittagessen während des Ausflugs


✓ Geeignet für Anfänger und erfahrene Schnorchler', 'Erleben Sie einen unvergesslichen Schnorchelausflug zur Eden Island ab Hurghada mit Hoteltransfer, Bootsfahrt, Mittagessen und Zeit zum Schwimmen und Entspannen im Roten Meer.', 'Schnorcheln & Tauchen', '["Hoteltransfer ab Hurghada inklusive","Bootsfahrt auf dem Roten Meer","Schnorcheln an farbenreichen Korallenriffen","Aufenthalt auf Eden Island","Mittagessen inklusive","Freizeit zum Schwimmen und Entspannen","Professionelle Schnorchelbegleitung"]'::jsonb, '["Hotelabholung und Rücktransfer","Klimatisierter Fahrzeugtransfer","Professioneller Schnorchelguide","Schnorchelausrüstung","Eintritt zu Eden Island","Bootsfahrt & Schwimmwesten","Schnorchelausrüstung","Mittagessen + Kaffee, Tee oder Soda"]'::jsonb, '["Persönliche Ausgaben","Trinkgeld","Transferzuschläge für bestimmte Regionen"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '8h', NULL, NULL, NULL, NULL, '[{"question":"Private Speedboot Tour zur Orange Bay ab Hurghada – Schnorcheln & Inseltrip","answer":"LocationHurghada Dauer6 Stunden Private Speedboot Tour zur Orange Bay ab Hurghada... ab60.00 &euro;"}]'::jsonb),
('tours', 'b604535f-6c99-4766-9150-c29fbbf5678c', 'hu', 'Eden Island snorkeling kirándulás Hurghadába ebéddel', '<table class="tour-pricing-table"><thead><tr><th>Ár</th><th>Utazás típusa</th><th>Utazás kezdete</th><th>Utazás</th></tr></thead><tbody><tr><td>75 €-tól személyenként</td><td>Csoportos túra</td><tdd>naponta 8:00</td></tr></tbody></table>
Fedezze fel a gyönyörű Eden-szigetet egy felejthetetlen snorkeling kiránduláson Hurghadából. Várja a kristálytiszta vizet, a színes korallzátonyokat és egy pihentető napot a sziget gyönyörű homokos strandján.





A szálloda felvétele után vezessen a kikötőbe, és szálljon fel hajóval az Eden-sziget felé. Útközben meglátogatja a Vörös-tenger népszerű sznorkelezési területeit, ahol megtapasztalhatja a lenyűgöző víz alatti világot színes halakkal és lenyűgöző korallképződményekkel.





Az Eden-szigeten töltsön szabadidőt úszásra, napozásra és pihenésre. A türkizkék víz és az idilli hangulat a szigetet Hurghada egyik legnépszerűbb kirándulóhelyévé teszi.





A kirándulás során az ebédet az ár tartalmazza. A kirándulás ideális pároknak, családoknak, barátoknak és mindenkinek, aki egy pihentető napot szeretne eltölteni a Vörös-tengeren.





Miért olyan népszerű ez a kirándulás:





✓ Sznorkelezés színes korallzátonyokon


✓ Maradjon a gyönyörű Éden-szigeten


✓ Kristálytiszta víz és finom homokos strand


✓ Szállodai transzfert tartalmaz


✓ Ebéd a kirándulás alatt


✓ Alkalmas kezdőknek és tapasztalt sznorkelezőknek', 'Éljen át egy felejthetetlen snorkeling kirándulást az Éden-szigetre Hurghadából szállodai transzferrel, hajóúttal, ebéddel és úszással és pihenéssel a Vörös-tengerben.', 'Sznorkelezés és búvárkodás', '["Szállodai transzfer Hurghadából","Hajókirándulás a Vörös-tengeren","Sznorkelezés színes korallzátonyokon","Maradjon az Eden-szigeten","Az ebéd benne van","Szabadidő úszásra és pihenésre","Professzionális sznorkelkísérő"]'::jsonb, '["Szállodai fel- és leszállás","Légkondicionált járműtranszfer","Professzionális snorkelezési útmutató","Snorkeling felszerelés","Bejárat az Eden-szigetre","Hajózás és mentőmellények","Snorkeling felszerelés","Ebéd + kávé, tea vagy szóda"]'::jsonb, '["Személyi kiadások","Tipp","Transzfer felárak bizonyos régiókban"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '8 óra', NULL, NULL, NULL, NULL, '[{"question":"Privát motorcsónakos kirándulás az Orange-öbölbe Hurghadából – sznorkelezés és kirándulás a szigetre","answer":"ElhelyezkedésHurghada Időtartam6 óra Privát motorcsónakos kirándulás az Orange-öbölbe Hurghadából... 60,00 €-tól"}]'::jsonb),
('tours', 'f265b20c-db45-4173-a352-b1921fd7f744', 'en', 'Hula Hula Island snorkeling trip with transfer from Hurghada', '<table class="tour-pricing-table"><thead><tr><th>Price</th><th>Trip type</th><th>Trip start</th><th>Pick-up</th></tr></thead><tbody><tr><td>From 35 € per person</td><td>Group tour</td><td>daily</td><td>approx. 8:00 a.m.</td></tr></tbody></table>
Immerse yourself in an unforgettable experience: a boat glides gently over the Red Sea, the sun is reflected on the waves, and paradise opens up in front of you - the Hula Hula Island. White sandy beaches, crystal clear waters, colorful coral reefs and exotic fish are waiting to be discovered.





This day trip from Hurghada perfectly combines adventure, relaxation and nature experience - ideal for families, couples and anyone who wants to experience the beauty of the Red Sea up close.





✨ Why you should book this excursion





The Hula Hula Island is one of the most beautiful destinations for snorkeling and diving trips in the Red Sea near Hurghada. Here nature, adventure and relaxation combine in a unique way:





Discover the colorful underwater world with exotic fish and coral reefs





Relax on the island''s beautiful beaches





Experience unforgettable moments while swimming, snorkeling or diving





Enjoy the Egyptian sun, crystal clear waters and breathtaking scenery





Hula Hula Island is ideal for guests who want to experience a relaxing snorkeling trip from Hurghada with an island stay, clear water and comfortable boat transfer.', 'Snorkeling trip to Hula Hula Island from Hurghada – white sandy beach, colorful coral reefs and an unforgettable island experience.', NULL, '["Boat trip to Hula Hula Island from Hurghada","Snorkeling in the Red Sea with coral reefs","90 minutes island stay on Hula Hula","Lunch & soft drinks included on board","Ideal for families, couples and snorkeling beginners","Hotel transfer from Hurghada included"]'::jsonb, '["Snorkeling equipment","Two stops for snorkeling","Lunch & soft drinks on board","Loungers & parasols on Hula Hula Island","All transfers in air-conditioned vehicles","Boat trip to Hula Hula Island"]'::jsonb, '["Personal expenses","Tips (voluntary)","Transfer surcharges for certain regions"]'::jsonb, 'Hurghada - Red Sea - Egypt', '4h', NULL, NULL, NULL, NULL, '[{"question":"Private speedboat tour to Orange Bay from Hurghada – snorkeling & island trip","answer":"LocationHurghada Duration6 hours Private speedboat tour to Orange Bay from Hurghada... from €60.00"}]'::jsonb),
('tours', 'f265b20c-db45-4173-a352-b1921fd7f744', 'ru', 'Сноркелинг на острове Хула Хула с трансфером из Хургады
---ЦЭП---
Поездка на остров Хула-Хула из Хургады – белый песчаный пляж, красочные коралловые рифы и незабываемые впечатления от острова.
---ЦЭП---
Хургада - Красное море - Египет
---ЦЭП---
4 часа
---ЦЭП---
<table class="tour-pricing-table"><thead><tr><th>Цена</th><th>Тип поездки</th><th>Начало поездки</th><th>Самовывоз</th></tr></thead><tbody><tr><td>От 35 евро на человека</td><td>Групповой тур</td><td>ежедневно</td><td>ок. 8:00 утра</td></tr></tbody></table>
Погрузитесь в незабываемые впечатления: лодка плавно скользит по Красному морю, солнце отражается в волнах, и перед вами открывается рай – остров Хула-Хула. Белые песчаные пляжи, кристально чистая вода, красочные коралловые рифы и экзотические рыбы ждут своего открытия.





Эта однодневная поездка из Хургады прекрасно сочетает в себе приключения, отдых и впечатления от природы – идеально подходит для семей, пар и всех, кто хочет поближе познакомиться с красотой Красного моря.





✨ Почему вам стоит заказать эту экскурсию





Остров Хула-Хула — одно из самых красивых мест для подводного плавания и дайвинга на Красном море недалеко от Хургады. Здесь природа, приключения и отдых уникальным образом сочетаются:





Откройте для себя красочный подводный мир с экзотическими рыбами и коралловыми рифами.





Отдохните на прекрасных пляжах острова.





Испытайте незабываемые моменты во время плавания, подводного плавания или дайвинга.





Наслаждайтесь египетским солнцем, кристально чистой водой и захватывающими дух пейзажами.





Остров Хула Хула идеально подходит для гостей, которые хотят совершить расслабляющее путешествие с подводным плаванием из Хургады с пребыванием на острове, чистой водой и удобным трансфером на лодке.
---ЦЭП---
Поездка на лодке на остров Хула-Хула из Хургады.
---РАЗДЕЛЕНИЕ---
Снорклинг в Красном море с коралловыми рифами
---РАЗДЕЛЕНИЕ---
90-минутное пребывание на острове Хула-Хула
---РАЗДЕЛЕНИЕ---
Обед и безалкогольные напитки включены на борту
---РАЗДЕЛЕНИЕ---
Идеально подходит для семей, пар и новичков в подводном плавании.
---РАЗДЕЛЕНИЕ---
Трансфер из Хургады включен в стоимость.
---ЦЭП---
Оборудование для подводного плавания
---РАЗДЕЛЕНИЕ---
Две остановки для подводного плавания
---РАЗДЕЛЕНИЕ---
Обед и безалкогольные напитки на борту
---РАЗДЕЛЕНИЕ---
Шезлонги и зонтики на острове Хула-Хула
---РАЗДЕЛЕНИЕ---
Все трансферы на автомобилях с кондиционером
---РАЗДЕЛЕНИЕ---
Поездка на лодке на остров Хула-Хула
---ЦЭП---
Личные расходы
---РАЗДЕЛЕНИЕ---
Советы (добровольные)
---РАЗДЕЛЕНИЕ---
Комиссия за трансфер для определенных регионов
---ЦЭП---
Частный тур на скоростном катере в Оранжевый залив из Хургады – подводное плавание и поездка на остров
---ЦЭП---
МестоположениеХургада Продолжительность: 6 часов Частный тур на скоростном катере в Оранжевый залив из Хургады... от 60,00 евро.', '<table class="tour-pricing-table"><thead><tr><th>Preis</th><th>Reisetyp</th><th>Reiseantritt</th><th>Abholung</th></tr></thead><tbody><tr><td>Ab 35 € p.P.</td><td>Gruppentour</td><td>täglich</td><td>ca. 8:00 Uhr</td></tr></tbody></table>
Tauchen Sie ein in ein unvergessliches Erlebnis: Ein Boot gleitet sanft über das Rote Meer, die Sonne spiegelt sich auf den Wellen, und vor Ihnen öffnet sich das Paradies – die Hula Hula Insel. Weiße Sandstrände, kristallklares Wasser, farbenfrohe Korallenriffe und exotische Fische warten darauf, entdeckt zu werden.





Dieser Tagesausflug ab Hurghada verbindet Abenteuer, Entspannung und Naturerlebnis perfekt – ideal für Familien, Paare und alle, die die Schönheit des Roten Meeres hautnah erleben möchten.





✨ Warum Sie diesen Ausflug buchen sollten





Die Hula Hula Insel zählt zu den schönsten Zielen für Schnorchel- und Tauchausflüge im Roten Meer bei Hurghada. Hier verbinden sich Natur, Abenteuer und Erholung auf einzigartige Weise:





Entdecken Sie die bunte Unterwasserwelt mit exotischen Fischen und Korallenriffen





Entspannen Sie an den traumhaften Stränden der Insel





Erleben Sie unvergessliche Momente beim Schwimmen, Schnorcheln oder Tauchen





Genießen Sie die Sonne Ägyptens, kristallklares Wasser und die atemberaubende Landschaft





Die Hula Hula Insel ist ideal für Gäste, die einen entspannten Schnorchelausflug ab Hurghada mit Inselaufenthalt, klarem Wasser und komfortablem Bootstransfer erleben möchten.', 'Schnorchelausflug zur Hula Hula Insel ab Hurghada – weißer Sandstrand, farbenfrohe Korallenriffe und ein unvergessliches Inselerlebnis.', NULL, '["Bootsfahrt zur Hula Hula Insel ab Hurghada","Schnorcheln im Roten Meer mit Korallenriffen","90 Minuten Inselaufenthalt auf Hula Hula","Mittagessen & Softgetränke an Bord inklusive","Ideal für Familien, Paare und Schnorchel-Anfänger","Hoteltransfer von Hurghada inklusive"]'::jsonb, '["Schnorchelausrüstung","Zwei Stopps für Schnorcheln","Mittagessen & Softgetränke an Bord","Liegen & Sonnenschirme auf der Hula Hula Insel","Alle Transfers in klimatisierten Fahrzeugen","Bootsfahrt zur Hula Hula Insel"]'::jsonb, '["Persönliche Ausgaben","Trinkgelder (freiwillig)","Transferzuschläge für bestimmte Regionen"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '4h', NULL, NULL, NULL, NULL, '[{"question":"Private Speedboot Tour zur Orange Bay ab Hurghada – Schnorcheln & Inseltrip","answer":"LocationHurghada Dauer6 Stunden Private Speedboot Tour zur Orange Bay ab Hurghada... ab60.00 &euro;"}]'::jsonb),
('tours', 'f265b20c-db45-4173-a352-b1921fd7f744', 'ar', 'رحلة الغطس في جزيرة الحولة مع الانتقالات من الغردقة
--- تسيب ---
رحلة غطس إلى جزيرة الحولة حولا من الغردقة - شاطئ رملي أبيض وشعاب مرجانية ملونة وتجربة جزيرة لا تُنسى.
--- تسيب ---
الغردقة - البحر الأحمر - مصر
--- تسيب ---
4 ساعات
--- تسيب ---
<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>بداية الرحلة</th><th>البيك اب</th></tr></thead><tbody><tr><td>من 35 يورو للشخص الواحد</td><td>جولة جماعية</td><td>يوميًا</td><td>تقريبًا. 8:00 صباحًا</td></tr></tbody></table>
انغمس في تجربة لا تُنسى: ينزلق القارب بلطف فوق البحر الأحمر، وتنعكس الشمس على الأمواج، وتنفتح أمامك الجنة - جزيرة الحولة هولا. الشواطئ الرملية البيضاء والمياه الصافية والشعاب المرجانية الملونة والأسماك الغريبة في انتظار اكتشافها.





تجمع هذه الرحلة اليومية من الغردقة بين المغامرة والاسترخاء وتجربة الطبيعة - وهي مثالية للعائلات والأزواج وأي شخص يرغب في تجربة جمال البحر الأحمر عن قرب.





✨ لماذا يجب عليك حجز هذه الرحلة





تعتبر جزيرة الحولة من أجمل الوجهات لرحلات الغطس والغوص في البحر الأحمر بالقرب من الغردقة. هنا تجتمع الطبيعة والمغامرة والاسترخاء بطريقة فريدة:





اكتشف العالم الملون تحت الماء مع الأسماك الغريبة والشعاب المرجانية





استرخ على شواطئ الجزيرة الجميلة





استمتع بلحظات لا تُنسى أثناء السباحة أو الغطس أو الغوص





استمتع بالشمس المصرية والمياه الصافية والمناظر الطبيعية الخلابة





تعتبر جزيرة Hula Hula مثالية للضيوف الذين يرغبون في تجربة رحلة غطس مريحة من الغردقة مع الإقامة في الجزيرة والمياه الصافية والنقل المريح بالقارب.
--- تسيب ---
رحلة بالقارب إلى جزيرة الحولة حولا من الغردقة
---تقسيم---
الغطس في البحر الأحمر مع الشعاب المرجانية
---تقسيم---
إقامة لمدة 90 دقيقة في جزيرة هولا هولا
---تقسيم---
الغداء والمشروبات الغازية متضمنة على متن الطائرة
---تقسيم---
مثالية للعائلات والأزواج ومبتدئي الغطس
---تقسيم---
شامل النقل من الفندق من الغردقة
--- تسيب ---
معدات الغطس
---تقسيم---
محطتين للغطس
---تقسيم---
الغداء والمشروبات الغازية على متن الطائرة
---تقسيم---
كراسي استلقاء ومظلات في جزيرة هولا هولا
---تقسيم---
- جميع التنقلات بسيارات مكيفة
---تقسيم---
رحلة بالقارب إلى جزيرة هولا هولا
--- تسيب ---
النفقات الشخصية
---تقسيم---
نصائح (طوعية)
---تقسيم---
تحويل الرسوم الإضافية لمناطق معينة
--- تسيب ---
جولة خاصة بالقارب السريع إلى أورانج باي من الغردقة - رحلة الغطس والجزيرة
--- تسيب ---
الموقعالغردقة المدة 6 ساعات جولة خاصة بالقارب السريع إلى أورانج باي من الغردقة... تبدأ من 60.00 يورو', '<table class="tour-pricing-table"><thead><tr><th>Preis</th><th>Reisetyp</th><th>Reiseantritt</th><th>Abholung</th></tr></thead><tbody><tr><td>Ab 35 € p.P.</td><td>Gruppentour</td><td>täglich</td><td>ca. 8:00 Uhr</td></tr></tbody></table>
Tauchen Sie ein in ein unvergessliches Erlebnis: Ein Boot gleitet sanft über das Rote Meer, die Sonne spiegelt sich auf den Wellen, und vor Ihnen öffnet sich das Paradies – die Hula Hula Insel. Weiße Sandstrände, kristallklares Wasser, farbenfrohe Korallenriffe und exotische Fische warten darauf, entdeckt zu werden.





Dieser Tagesausflug ab Hurghada verbindet Abenteuer, Entspannung und Naturerlebnis perfekt – ideal für Familien, Paare und alle, die die Schönheit des Roten Meeres hautnah erleben möchten.





✨ Warum Sie diesen Ausflug buchen sollten





Die Hula Hula Insel zählt zu den schönsten Zielen für Schnorchel- und Tauchausflüge im Roten Meer bei Hurghada. Hier verbinden sich Natur, Abenteuer und Erholung auf einzigartige Weise:





Entdecken Sie die bunte Unterwasserwelt mit exotischen Fischen und Korallenriffen





Entspannen Sie an den traumhaften Stränden der Insel





Erleben Sie unvergessliche Momente beim Schwimmen, Schnorcheln oder Tauchen





Genießen Sie die Sonne Ägyptens, kristallklares Wasser und die atemberaubende Landschaft





Die Hula Hula Insel ist ideal für Gäste, die einen entspannten Schnorchelausflug ab Hurghada mit Inselaufenthalt, klarem Wasser und komfortablem Bootstransfer erleben möchten.', 'Schnorchelausflug zur Hula Hula Insel ab Hurghada – weißer Sandstrand, farbenfrohe Korallenriffe und ein unvergessliches Inselerlebnis.', NULL, '["Bootsfahrt zur Hula Hula Insel ab Hurghada","Schnorcheln im Roten Meer mit Korallenriffen","90 Minuten Inselaufenthalt auf Hula Hula","Mittagessen & Softgetränke an Bord inklusive","Ideal für Familien, Paare und Schnorchel-Anfänger","Hoteltransfer von Hurghada inklusive"]'::jsonb, '["Schnorchelausrüstung","Zwei Stopps für Schnorcheln","Mittagessen & Softgetränke an Bord","Liegen & Sonnenschirme auf der Hula Hula Insel","Alle Transfers in klimatisierten Fahrzeugen","Bootsfahrt zur Hula Hula Insel"]'::jsonb, '["Persönliche Ausgaben","Trinkgelder (freiwillig)","Transferzuschläge für bestimmte Regionen"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '4h', NULL, NULL, NULL, NULL, '[{"question":"Private Speedboot Tour zur Orange Bay ab Hurghada – Schnorcheln & Inseltrip","answer":"LocationHurghada Dauer6 Stunden Private Speedboot Tour zur Orange Bay ab Hurghada... ab60.00 &euro;"}]'::jsonb),
('tours', 'f265b20c-db45-4173-a352-b1921fd7f744', 'fr', 'Excursion de plongée en apnée sur l''île de Hula Hula avec transfert depuis Hurghada', '<table class="tour-pricing-table"><thead><tr><th>Prix</th><th>Type de voyage</th><th>Début du voyage</th><th>Prise en charge</th></tr></thead><tbody><tr><td>À partir de 35 € par personne</td><td>Visite de groupe</td><td>par jour</td><td>env. 8h00</td></tr></tbody></table>
Plongez dans une expérience inoubliable : un bateau glisse doucement sur la mer Rouge, le soleil se reflète sur les vagues et le paradis s''ouvre devant vous : l''île Hula Hula. Des plages de sable blanc, des eaux cristallines, des récifs coralliens colorés et des poissons exotiques attendent d''être découverts.





Cette excursion d''une journée au départ d''Hurghada combine parfaitement aventure, détente et expérience de la nature - idéale pour les familles, les couples et tous ceux qui souhaitent découvrir de près la beauté de la mer Rouge.





✨ Pourquoi vous devriez réserver cette excursion





L''île de Hula Hula est l''une des plus belles destinations pour des excursions de snorkeling et de plongée dans la mer Rouge, près d''Hurghada. Ici, nature, aventure et détente se combinent de manière unique :





Découvrez le monde sous-marin coloré avec des poissons exotiques et des récifs coralliens





Détendez-vous sur les belles plages de l''île





Vivez des moments inoubliables en nageant, en snorkeling ou en plongée





Profitez du soleil égyptien, des eaux cristallines et des paysages à couper le souffle





L''île de Hula Hula est idéale pour les clients qui souhaitent vivre une excursion de plongée en apnée relaxante au départ d''Hurghada avec un séjour sur l''île, une eau claire et un transfert en bateau confortable.', 'Excursion de plongée en apnée sur l''île de Hula Hula depuis Hurghada : plage de sable blanc, récifs coralliens colorés et expérience insulaire inoubliable.', NULL, '["Excursion en bateau vers l''île de Hula Hula depuis Hurghada","Snorkeling en Mer Rouge avec les récifs coralliens","Séjour insulaire de 90 minutes à Hula Hula","Déjeuner et boissons non alcoolisées inclus à bord","Idéal pour les familles, les couples et les débutants en snorkeling","Transfert à l''hôtel depuis Hurghada inclus"]'::jsonb, '["Équipement de plongée en apnée","Deux arrêts pour la plongée en apnée","Déjeuner et boissons non alcoolisées à bord","Chaises longues et parasols sur l''île de Hula Hula","Tous les transferts en véhicules climatisés","Excursion en bateau sur l''île de Hula Hula"]'::jsonb, '["Dépenses personnelles","Pourboires (volontaires)","Suppléments de transfert pour certaines régions"]'::jsonb, 'Hurghada - Mer Rouge - Egypte', '4h', NULL, NULL, NULL, NULL, '[{"question":"Excursion privée en hors-bord à Orange Bay depuis Hurghada – plongée en apnée et excursion sur l''île","answer":"LocalisationHurghada Durée6 heures Excursion privée en hors-bord à Orange Bay depuis Hurghada... à partir de 60,00 €"}]'::jsonb),
('tours', 'f265b20c-db45-4173-a352-b1921fd7f744', 'hu', 'Hula Hula sziget snorkeling kirándulás transzferrel Hurghadából', '<table class="tour-pricing-table"><thead><tr><th>Ár</th><th>Utazás típusa</th><th>Utazás kezdete</th><th>Átvétel</th></tr></thead><tbody><tr><td>35 €-tól személyenként</td><td>Csoportos túra</td><tdd>naponta</td><tdd> 8:00</td></tr></tbody></table>
Merüljön el egy felejthetetlen élményben: egy hajó finoman siklik a Vörös-tenger felett, a nap tükröződik a hullámokon, és megnyílik előtted a paradicsom - a Hula Hula-sziget. Fehér homokos strandok, kristálytiszta vizek, színes korallzátonyok és egzotikus halak várnak felfedezésre.





Ez a Hurghadából induló egynapos kirándulás tökéletesen ötvözi a kalandot, a pihenést és a természeti élményt – ideális családok, párok és bárki számára, aki közelről szeretné megtapasztalni a Vörös-tenger szépségét.





✨ Miért érdemes ezt a kirándulást lefoglalni?





A Hula Hula-sziget az egyik legszebb célpont a sznorkelezéshez és a búvárkodáshoz a Vörös-tengeren Hurghada közelében. Itt a természet, a kaland és a kikapcsolódás egyedülálló módon egyesül:





Fedezze fel a színes víz alatti világot egzotikus halakkal és korallzátonyokkal





Pihenjen a sziget gyönyörű strandjain





Élvezze a felejthetetlen pillanatokat úszás, sznorkelezés vagy búvárkodás közben





Élvezze az egyiptomi napsütést, a kristálytiszta vizet és a lélegzetelállító tájat





Hula A Hula-sziget ideális azoknak a vendégeknek, akik egy pihentető sznorkelezést szeretnének megtapasztalni Hurghadából szigeti tartózkodással, tiszta vízzel és kényelmes hajótranszferrel.', 'Snorkeling kirándulás Hula Hula szigetére Hurghadából – fehér homokos tengerpart, színes korallzátonyok és felejthetetlen szigetélmény.', NULL, '["Hajókirándulás Hula Hula szigetére Hurghadából","Sznorkelezés a Vörös-tengeren korallzátonyokkal","90 perc szigeti tartózkodás Hula Hulán","Ebéd és üdítőital a fedélzeten","Ideális családok, párok és kezdő sznorkelezés számára","Szállodai transzfer Hurghadából"]'::jsonb, '["Snorkeling felszerelés","Két megálló sznorkelezésre","Ebéd és üdítő a fedélzeten","Nyugágyak és napernyők Hula Hula szigetén","Minden transzfer légkondicionált járművel","Hajókirándulás Hula Hula szigetére"]'::jsonb, '["Személyi kiadások","Tippek (önkéntes)","Transzfer felárak bizonyos régiókban"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '4 óra', NULL, NULL, NULL, NULL, '[{"question":"Privát motorcsónakos kirándulás az Orange-öbölbe Hurghadából – sznorkelezés és kirándulás a szigetre","answer":"ElhelyezkedésHurghada Időtartam6 óra Privát motorcsónakos kirándulás az Orange-öbölbe Hurghadából... 60,00 €-tól"}]'::jsonb),
('tours', 'c7b7cfad-0101-4997-ac52-e4456a21c252', 'en', 'Private Pyramids Tour from Hurghada – Saqqara, Dahshur & Giza', '<table class="tour-pricing-table"><thead> Minibus</td><td>140 € per person</td></tr><tr><td>5 - 6 people</td><td>Private minibus</td><td>110 € per person</td></tr><tr><td>7 - 8 people</td><td>Private minibus</td><td>100 € per person</td></tr></tbody></table>
Discover Egypt''s most important pyramids on a private, perfectly organized day tour from Hurghada. This exclusive excursion takes you to Saqqara, Dahshur and Giza. You travel without time pressure, without sales stops and with maximum comfort. You will be accompanied by an experienced, German-speaking Egyptologist who will convey the history to you precisely, understandably and vividly.





Ideal for discerning guests who want to experience Cairo individually.', 'Experience the most important pyramids in Egypt on a private, individually planned tour from Hurghada. This premium excursion takes you to Saqqara, Dahshur and Giza and offers a first-class mentoring experience from a certified Egyptologist. No sales stops. No waiting time', 'Culture & sightseeing', '["Saqqara – origin of pyramid building","Step pyramid of Djoser","Historical introduction to the early days of the royal necropolis","Dahshur – development of the pyramid shape","Bent pyramid","Red pyramid with access to the interior","Giza – wonder of the ancient world","Pyramids of Cheops, Chephren and Menkaure","Sphinx and Valley Temple","Expert explanations of construction, religion and symbolism"]'::jsonb, '["All transfers in modern, air-conditioned vehicles","All entrance fees","German-speaking tour guide and Egyptologist","Lunch","Drinks on the bus","Insurance"]'::jsonb, '["Personal expenses","Drinks in the restaurant","Transfer surcharge for guests from Marsa Alam: €50 per person","Transfer surcharge for guests from El Quseir: €35 per person","Transfer surcharge from Makadi Bay & Sahl Hasheesh: €5 per person","Transfer surcharge from El Gouna, Safaga & Soma Bay: €10 per person","Foreign language tour guide (English, Russian or French): additional charge €10 per person"]'::jsonb, 'Hurghada - Red Sea - Egypt', '6 p.m', NULL, NULL, NULL, NULL, '[{"question":"🚤 Nile boat trip","answer":"Experience Cairo from the water and enjoy a relaxing cruise on the legendary Nile.15.00 € /person"},{"question":"🏛️ Entrance to the Great Pyramid","answer":"Enter the interior of one of humanity''s greatest wonders - a once-in-a-lifetime experience. €30.00 /person"}]'::jsonb),
('tours', 'c7b7cfad-0101-4997-ac52-e4456a21c252', 'fr', 'Visite privée des pyramides d''Hurghada - Saqqara, Dahchour et Gizeh', '<table class="tour-pricing-table"><thead> Minibus</td><td>140 € par personne</td></tr><tr><td>5 - 6 personnes</td><td>Minibus privé</td><td>110 € par personne</td></tr><tr><td>7 - 8 personnes</td><td>Minibus privé</td><td>100 € par personne personne</td></tr></tbody></table>
Découvrez les pyramides les plus importantes d''Égypte lors d''une excursion privée d''une journée parfaitement organisée au départ d''Hurghada. Cette excursion exclusive vous emmène à Saqqarah, Dahchour et Gizeh. Vous voyagez sans pression de temps, sans arrêts de vente et avec un maximum de confort. Vous serez accompagné d''un égyptologue germanophone expérimenté qui vous racontera l''histoire de manière précise, compréhensible et vivante.





Idéal pour les clients exigeants qui souhaitent découvrir le Caire individuellement.', 'Découvrez les pyramides les plus importantes d''Égypte lors d''une visite privée planifiée individuellement au départ d''Hurghada. Cette excursion premium vous emmène à Saqqarah, Dahchour et Gizeh et offre une expérience de mentorat de première classe assurée par un égyptologue certifié. Aucune vente ne s’arrête. Pas de temps d''attente', 'Culture et tourisme', '["Saqqara – origine de la construction de la pyramide","Pyramide à degrés de Djéser","Introduction historique aux débuts de la nécropole royale","Dahshur – développement de la forme pyramidale","Pyramide courbée","Pyramide rouge avec accès à l''intérieur","Gizeh – merveille du monde antique","Pyramides de Khéops, Chephren et Menkaure","Sphinx et temple de la vallée","Explications d''experts sur la construction, la religion et le symbolisme"]'::jsonb, '["Tous les transferts dans des véhicules modernes et climatisés","Tous les frais d''entrée","Guide touristique germanophone et égyptologue","Déjeuner","Boissons dans le bus","Assurance"]'::jsonb, '["Dépenses personnelles","Boissons au restaurant","Supplément de transfert pour les clients de Marsa Alam : 50 € par personne","Supplément de transfert pour les clients d''El Quseir : 35 € par personne","Supplément de transfert depuis la baie de Makadi et Sahl Hasheesh : 5 € par personne","Supplément de transfert depuis El Gouna, Safaga et Soma Bay : 10 € par personne","Guide touristique en langue étrangère (anglais, russe ou français) : supplément 10 € par personne"]'::jsonb, 'Hurghada - Mer Rouge - Egypte', '18h', NULL, NULL, NULL, NULL, '[{"question":"🚤 Excursion en bateau sur le Nil","answer":"Découvrez le Caire depuis l''eau et profitez d''une croisière relaxante sur le légendaire Nil.15,00 € /personne"},{"question":"🏛️ Entrée de la Grande Pyramide","answer":"Entrez à l''intérieur de l''une des plus grandes merveilles de l''humanité : une expérience unique. 30,00 € /personne"}]'::jsonb),
('tours', 'c7b7cfad-0101-4997-ac52-e4456a21c252', 'ru', 'Частный тур по пирамидам из Хургады – Саккара, Дахшур и Гиза
---ЦЭП---
Посетите самые важные пирамиды Египта во время частного, индивидуально спланированного тура из Хургады. Эта экскурсия премиум-класса доставит вас в Саккару, Дахшур и Гизу и предлагает первоклассный опыт наставничества от сертифицированного египтолога. Никаких остановок продаж. Нет времени ожидания
---ЦЭП---
Культура и достопримечательности
---ЦЭП---
Хургада - Красное море - Египет
---ЦЭП---
18:00
---ЦЭП---
<table class="tour-pricing-table"><thead> Микроавтобус</td><td>140 евро на человека</td></tr><tr><td>5 - 6 человек</td><td>Частный микроавтобус</td><td>110 евро на человека</td></tr><tr><td>7 - 8 человек</td><td>Частный микроавтобус</td><td>100 евро на человека человек</td></tr></tbody></table>
Откройте для себя самые важные пирамиды Египта в рамках частного, прекрасно организованного однодневного тура из Хургады. Эта эксклюзивная экскурсия приведет вас в Саккару, Дахшур и Гизу. Вы путешествуете без цейтнота, без остановок продаж и с максимальным комфортом. Вас будет сопровождать опытный немецкоязычный египтолог, который точно, понятно и ярко передаст вам историю.





Идеально подходит для взыскательных гостей, которые хотят познакомиться с Каиром индивидуально.
---ЦЭП---
Саккара – начало строительства пирамид
---РАЗДЕЛЕНИЕ---
Ступенчатая пирамида Джосера
---РАЗДЕЛЕНИЕ---
Историческое введение в первые дни существования царского некрополя
---РАЗДЕЛЕНИЕ---
Дахшур – развитие пирамидальной формы.
---РАЗДЕЛЕНИЕ---
Гнутая пирамида
---РАЗДЕЛЕНИЕ---
Красная пирамида с доступом внутрь
---РАЗДЕЛЕНИЕ---
Гиза – чудо древнего мира
---РАЗДЕЛЕНИЕ---
Пирамиды Хеопса, Хефрена и Менкаура
---РАЗДЕЛЕНИЕ---
Сфинкс и Храм Долины
---РАЗДЕЛЕНИЕ---
Экспертные объяснения конструкции, религии и символики
---ЦЭП---
Все трансферы на современных автомобилях с кондиционерами.
---РАЗДЕЛЕНИЕ---
Все входные билеты
---РАЗДЕЛЕНИЕ---
Немецкоязычный гид и египтолог.
---РАЗДЕЛЕНИЕ---
Обед
---РАЗДЕЛЕНИЕ---
Напитки в автобусе
---РАЗДЕЛЕНИЕ---
Страхование
---ЦЭП---
Личные расходы
---РАЗДЕЛЕНИЕ---
Напитки в ресторане
---РАЗДЕЛЕНИЕ---
Доплата за трансфер для гостей из Марса Алама: 50 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер для гостей из Эль-Кусейра: 35 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из залива Макади и Сахл Хашиша: 5 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из Эль-Гуны, Сафаги и Сома-Бэй: 10 евро на человека.
---РАЗДЕЛЕНИЕ---
Гид на иностранном языке (английский, русский или французский): дополнительная плата 10 евро на человека.
---ЦЭП---
🚤Прогулка на лодке по Нилу
---РАЗДЕЛЕНИЕ---
🏛️ Вход в Великую пирамиду
---ЦЭП---
Откройте для себя Каир с воды и насладитесь расслабляющим круизом по легендарному Нилу. 15,00 €/чел.
---РАЗДЕЛЕНИЕ---
Войдите в интерьер одного из величайших чудес человечества — опыт, который выпадает раз в жизни. 30,00 евро/чел.', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Fahrzeug</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Private Limousine</td><td>160 € p.P.</td></tr><tr><td>3 – 4 Personen</td><td>Privater Minibus</td><td>140 € p.P.</td></tr><tr><td>5 – 6 Personen</td><td>Privater Minibus</td><td>110 € p.P.</td></tr><tr><td>7 – 8 Personen</td><td>Privater Minibus</td><td>100 € p.P.</td></tr></tbody></table>
Entdecken Sie die wichtigsten Pyramiden Ägyptens auf einer privaten, perfekt organisierten Tagestour ab Hurghada. Diese exklusive Exkursion führt nach Sakkara, Dahschur und Gizeh. Sie reisen ohne Zeitdruck, ohne Verkaufsstopps und mit maximalem Komfort. Begleitet werden Sie von einem erfahrenen, deutschsprachigen Ägyptologen, der Ihnen die Geschichte präzise, verständlich und lebendig vermittelt.





Ideal für anspruchsvolle Gäste, die Kairo individuell erleben möchten.', 'Erleben Sie die bedeutendsten Pyramiden Ägyptens auf einer privaten, individuell planbaren Tour ab Hurghada. Diese Premium-Exkursion führt Sie nach Sakkara, Dahschur und Gizeh und bietet ein erstklassiges Betreuungserlebnis durch einen zertifizierten Ägyptologen. Keine Verkaufsstopps. Keine Wartezei', 'Kultur & Sightseeing', '["Sakkara – Ursprung des Pyramidenbaus","Stufenpyramide des Djoser","Historische Einführung in die Frühzeit der königlichen Nekropole","Dahschur – Entwicklung der Pyramidenform","Knickpyramide","Rote Pyramide mit Zugang zum Innenraum","Gizeh – Weltwunder der Antike","Pyramiden von Cheops, Chephren und Mykerinos","Sphinx und Taltempel","Fachkundige Erläuterungen zu Bauweise, Religion und Symbolik"]'::jsonb, '["Alle Transfers in modernen, klimatisierten Fahrzeugen","Sämtliche Eintrittsgelder","Deutschsprachiger Reiseleiter und Ägyptologe","Mittagessen","Getränke im Bus","Versicherung"]'::jsonb, '["Persönliche Ausgaben","Getränke im Restaurant","Transferzuschlag für Gäste aus Marsa Alam: 50 € pro Person","Transferzuschlag für Gäste aus El Quseir: 35 € pro Person","Transferzuschlag ab Makadi Bay & Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga & Soma Bay: 10 € pro Person","Fremdsprachiger Reiseleiter (Englisch, Russisch oder Französisch): Aufpreis 10 € pro Person"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '18h', NULL, NULL, NULL, NULL, '[{"question":"🚤 Nil-Bootsfahrt","answer":"Erleben Sie Kairo vom Wasser aus und genießen Sie eine entspannte Fahrt auf dem legendären Nil.15.00 € /person"},{"question":"🏛️ Eintritt in die Cheops-Pyramide","answer":"Betreten Sie das Innere eines der größten Weltwunder der Menschheit – ein einmaliges Erlebnis.30.00 € /person"}]'::jsonb),
('tours', 'c7b7cfad-0101-4997-ac52-e4456a21c252', 'ar', 'جولة خاصة في الأهرامات من الغردقة - سقارة ودهشور والجيزة
--- تسيب ---
استمتع بتجربة أهم الأهرامات في مصر في جولة خاصة مخططة بشكل فردي من الغردقة. تأخذك هذه الرحلة المتميزة إلى سقارة ودهشور والجيزة وتقدم تجربة إرشادية من الدرجة الأولى من عالم مصريات معتمد. لا توقف المبيعات. لا وقت الانتظار
--- تسيب ---
الثقافة ومشاهدة المعالم السياحية
--- تسيب ---
الغردقة - البحر الأحمر - مصر
--- تسيب ---
الساعة 6 مساءً
--- تسيب ---
<table class="tour-pricing-table"><thead> حافلة صغيرة</td><td>140 يورو للشخص الواحد</td></tr><tr><td>5 - 6 أشخاص</td><td>حافلة صغيرة خاصة</td><td>110 يورو للشخص الواحد</td></tr><tr><td>7 - 8 أشخاص</td><td>حافلة صغيرة خاصة</td><td>100 يورو لكل شخص شخص</td></tr></tbody></table>
اكتشف أهم أهرامات مصر في جولة نهارية خاصة ومنظمة بشكل مثالي من الغردقة. تأخذك هذه الرحلة الحصرية إلى سقارة ودهشور والجيزة. أنت تسافر دون ضغط الوقت، دون توقف المبيعات وبأقصى قدر من الراحة. سيرافقك عالم مصريات ذو خبرة ويتحدث الألمانية والذي سينقل لك التاريخ بدقة ومفهومة وحيوية.





مثالي للضيوف المميزين الذين يرغبون في تجربة القاهرة بشكل فردي.
--- تسيب ---
سقارة – أصل بناء الهرم
---تقسيم---
هرم زوسر المدرج
---تقسيم---
مقدمة تاريخية للأيام الأولى للمقبرة الملكية
---تقسيم---
دهشور – تطوير الشكل الهرمي
---تقسيم---
الهرم المنحني
---تقسيم---
الهرم الأحمر مع إمكانية الوصول إلى الداخل
---تقسيم---
الجيزة – عجائب العالم القديم
---تقسيم---
أهرامات خوفو وخفرع ومنقرع
---تقسيم---
معبد أبو الهول والوادي
---تقسيم---
تفسيرات الخبراء للبناء والدين والرمزية
--- تسيب ---
- جميع الإنتقالات بسيارات حديثة ومكيفة
---تقسيم---
جميع رسوم الدخول
---تقسيم---
مرشد سياحي يتحدث الألمانية وعالم مصريات
---تقسيم---
الغداء
---تقسيم---
المشروبات على متن الحافلة
---تقسيم---
التأمين
--- تسيب ---
النفقات الشخصية
---تقسيم---
المشروبات في المطعم
---تقسيم---
تكلفة النقل الإضافية للضيوف من مرسى علم: 50 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية للضيوف من القصير: 35 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية من خليج مكادي وسهل حشيش: 5 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية من الجونة وسفاجا وخليج سوما: 10 يورو للشخص الواحد
---تقسيم---
مرشد سياحي بلغة أجنبية (الإنجليزية أو الروسية أو الفرنسية): رسوم إضافية 10 يورو للشخص الواحد
--- تسيب ---
🚤رحلة المركب النيلي
---تقسيم---
🏛️ مدخل الهرم الأكبر
--- تسيب ---
استمتع بتجربة القاهرة من الماء واستمتع برحلة بحرية مريحة على نهر النيل الأسطوري.15.00 يورو للشخص الواحد
---تقسيم---
ادخل إلى داخل إحدى أعظم عجائب البشرية - تجربة لا تتكرر إلا مرة واحدة في العمر. 30.00 يورو للشخص الواحد', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Fahrzeug</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Private Limousine</td><td>160 € p.P.</td></tr><tr><td>3 – 4 Personen</td><td>Privater Minibus</td><td>140 € p.P.</td></tr><tr><td>5 – 6 Personen</td><td>Privater Minibus</td><td>110 € p.P.</td></tr><tr><td>7 – 8 Personen</td><td>Privater Minibus</td><td>100 € p.P.</td></tr></tbody></table>
Entdecken Sie die wichtigsten Pyramiden Ägyptens auf einer privaten, perfekt organisierten Tagestour ab Hurghada. Diese exklusive Exkursion führt nach Sakkara, Dahschur und Gizeh. Sie reisen ohne Zeitdruck, ohne Verkaufsstopps und mit maximalem Komfort. Begleitet werden Sie von einem erfahrenen, deutschsprachigen Ägyptologen, der Ihnen die Geschichte präzise, verständlich und lebendig vermittelt.





Ideal für anspruchsvolle Gäste, die Kairo individuell erleben möchten.', 'Erleben Sie die bedeutendsten Pyramiden Ägyptens auf einer privaten, individuell planbaren Tour ab Hurghada. Diese Premium-Exkursion führt Sie nach Sakkara, Dahschur und Gizeh und bietet ein erstklassiges Betreuungserlebnis durch einen zertifizierten Ägyptologen. Keine Verkaufsstopps. Keine Wartezei', 'Kultur & Sightseeing', '["Sakkara – Ursprung des Pyramidenbaus","Stufenpyramide des Djoser","Historische Einführung in die Frühzeit der königlichen Nekropole","Dahschur – Entwicklung der Pyramidenform","Knickpyramide","Rote Pyramide mit Zugang zum Innenraum","Gizeh – Weltwunder der Antike","Pyramiden von Cheops, Chephren und Mykerinos","Sphinx und Taltempel","Fachkundige Erläuterungen zu Bauweise, Religion und Symbolik"]'::jsonb, '["Alle Transfers in modernen, klimatisierten Fahrzeugen","Sämtliche Eintrittsgelder","Deutschsprachiger Reiseleiter und Ägyptologe","Mittagessen","Getränke im Bus","Versicherung"]'::jsonb, '["Persönliche Ausgaben","Getränke im Restaurant","Transferzuschlag für Gäste aus Marsa Alam: 50 € pro Person","Transferzuschlag für Gäste aus El Quseir: 35 € pro Person","Transferzuschlag ab Makadi Bay & Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga & Soma Bay: 10 € pro Person","Fremdsprachiger Reiseleiter (Englisch, Russisch oder Französisch): Aufpreis 10 € pro Person"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '18h', NULL, NULL, NULL, NULL, '[{"question":"🚤 Nil-Bootsfahrt","answer":"Erleben Sie Kairo vom Wasser aus und genießen Sie eine entspannte Fahrt auf dem legendären Nil.15.00 € /person"},{"question":"🏛️ Eintritt in die Cheops-Pyramide","answer":"Betreten Sie das Innere eines der größten Weltwunder der Menschheit – ein einmaliges Erlebnis.30.00 € /person"}]'::jsonb),
('tours', 'c7b7cfad-0101-4997-ac52-e4456a21c252', 'hu', 'Privát piramistúra Hurghadából – Saqqara, Dahshur és Giza', '<table class="tour-pricing-table"><thead> Mikrobusz</td><td>140 €/fő</td></tr><tr><td>5-6 fő</td><td>Privát mikrobusz</td><td>110 €/fő</td></tr><tr><td>7-8 fő/személyes minibusz</td><td>0€/td><td> személy</td></tr></tbody></table>
Fedezze fel Egyiptom legfontosabb piramisait egy privát, tökéletesen szervezett egynapos túrán Hurghadából. Ez az exkluzív kirándulás Szakkarába, Dahsúrba és Gízába vezet. Időnyomás nélkül, értékesítési leállások nélkül és maximális kényelemmel utazhat. Egy tapasztalt, németül beszélő egyiptológus kíséri majd el, aki precízen, érthetően és szemléletesen közvetíti számodra a történelmet.





Ideális az igényes vendégek számára, akik egyénileg szeretnék megtapasztalni Kairót.', 'Tapasztalja meg Egyiptom legfontosabb piramisait egy privát, egyénileg tervezett túrán Hurghadából. Ez a prémium kirándulás Saqqara, Dahshur és Giza városaiba vezet, és első osztályú mentori tapasztalatot kínál egy okleveles egyiptológustól. Nincs értékesítési leállás. Nincs várakozási idő', 'Kultúra és városnézés', '["Saqqara – a piramisépítés eredete","Dzsoser lépcsős piramisa","Történelmi bevezetés a királyi nekropolisz korai időszakába","Dahshur – a piramis alakjának kialakulása","Hajlított piramis","Vörös piramis hozzáféréssel a belső terekhez","Giza – az ókori világ csodája","Cheops, Chephren és Menkaure piramisai","Szfinx és Völgy templom","Szakértői magyarázatok az építkezésről, a vallásról és a szimbolikáról"]'::jsonb, '["Minden transzfer modern, légkondicionált járművekkel","Minden belépődíj","Németül beszélő idegenvezető és egyiptológus","Ebéd","Italok a buszon","Biztosítás"]'::jsonb, '["Személyi kiadások","Italok az étteremben","Transzfer felár Marsa Alamból: 50 € személyenként","Transzfer felár az El Quseir városából: 35 € személyenként","Transzfer felára a Makadi Bay & Sahl Hasheesh területéről: 5 euró személyenként","Transzfer felára El Gouna, Safaga és Soma Bay területéről: 10 € személyenként","Idegen nyelvű túravezető (angol, orosz vagy francia): felár 10 € személyenként"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '18 óra', NULL, NULL, NULL, NULL, '[{"question":"🚤 Nílusi hajókirándulás","answer":"Tapasztalja meg Kairót a vízből és élvezze a pihentető körutazást a legendás Níluson.15,00 € /fő"},{"question":"🏛️ A Nagy Piramis bejárata","answer":"Lépjen be az emberiség egyik legnagyobb csodájának belsejébe – egy egyszeri élmény az életben. 30,00 €/fő"}]'::jsonb),
('tours', '27ae0b35-e0ef-4b01-9aa7-23d3210d74ff', 'fr', 'Excursion privée avec les dauphins à Hurghada en hors-bord', '<table class="tour-pricing-table"><thead><tr><th>Participants</th><th>Bateau</th><th>Prix par personne</th></tr></thead><tbody><tr><td>1 personne</td><td>Bateau rapide privé</td><td>150 € par personne</td></tr><tr><td>2 personnes</td><td>Privé hors-bord</td><td>80 € p.P.</td></tr><tr><td>3 personnes</td><td>Bateau rapide privé</td><td>70 € p.P.</td></tr><tr><td>4 personnes</td><td>Bateau rapide privé</td><td>60 € p.P.</td></tr><tr><td>5 personnes</td><td>Bateau rapide privé</td><td>55 € p.P.</td></tr><tr><td>6 personnes</td><td>Bateau rapide privé</td><td>50 € p.P.</td></tr></tbody></table>
Vivez l''un des moments les plus impressionnants de vos vacances : nagez avec des dauphins sauvages, découvrez des récifs coralliens colorés et détendez-vous sur une île paradisiaque, le tout en une seule matinée.





Cette visite privée de haute qualité est faite pour les voyageurs qui veulent le meilleur :





✔ Pas de bateaux de masse


✔ Pas d''invités étrangers


✔ Pas de soucis


✔ 100% privé et personnellement pris en charge





Avec HurghadaTravel Planner, vous ne réservez pas n''importe quelle excursion, mais une expérience que de nombreux clients décrivent comme le point culminant de leurs vacances en Égypte.





🐬 Nager avec les dauphins à Hurghada – naturel, respectueux et inoubliable





Imaginez : le hors-bord glisse sur l''eau turquoise. Ils sautent dans la mer chaude. Soudain, des dauphins apparaissent à côté de vous - curieux, élégants, libres.





Notre itinéraire mène spécifiquement aux zones de dauphins les plus connues au large d''Hurghada. Les animaux vivent ici à l''état sauvage et recherchent souvent la proximité des bateaux eux-mêmes.





Pour de nombreux invités, ce moment est plus émouvant que n’importe quelle attraction terrestre.





Mais cette excursion offre bien plus encore :





Naufrage fascinant plein de vie marine





Ambiance détendue sans contrainte de temps





Tout est parfaitement organisé – en seulement 4 heures.





⭐ Pourquoi cette visite est l''une des excursions privées les plus réservées à Hurghada





Réalisation 100% privée





Maximum de 8 personnes à bord





Taux d''observation de dauphins très élevé





Des vedettes rapides modernes et sûres





Capitaines expérimentés et agréés





Idéal pour les couples, les familles et les petits groupes





Excellent rapport qualité/prix





🎒 Merci de l''apporter avec vous





Maillots de bain et serviette





Crème solaire et lunettes de soleil





Couvre-chef





En hiver : veste légère', 'Visite privée des dauphins à Hurghada – personnelle, confortable et inoubliable.', 'Snorkeling et plongée', '["Excursion privée en hors-bord depuis Hurghada","Observez les dauphins à l''état sauvage","Deux récifs coralliens spectaculaires","Plongée en apnée sur l''épave engloutie","Boissons gazeuses et fruits frais à bord","Transfert hôtel inclus"]'::jsonb, '["Hors-bord privé avec capitaine expérimenté","Transfert hôtel aller-retour","Équipement de plongée en apnée","Observation des dauphins à l''état sauvage","Deux arrêts de plongée avec tuba","Boissons gazeuses, eau et fruits frais"]'::jsonb, '["Dépenses personnelles","Repas","Suppléments de transfert pour certaines régions"]'::jsonb, 'Hurghada - Mer Rouge - Egypte', '4h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '27ae0b35-e0ef-4b01-9aa7-23d3210d74ff', 'en', 'Private dolphin trip in Hurghada by speedboat', '<table class="tour-pricing-table"><thead><tr><th>Participants</th><th>Boat</th><th>Price per person</th></tr></thead><tbody><tr><td>1 person</td><td>Private speedboat</td><td>150 € per person</td></tr><tr><td>2 people</td><td>Private speedboat</td><td>80 € p.P.</td></tr><tr><td>3 people</td><td>Private speedboat</td><td>70 € p.P.</td></tr><tr><td>4 people</td><td>Private speedboat</td><td>60 € p.P.</td></tr><tr><td>5 people</td><td>Private Speedboat</td><td>55 € p.P.</td></tr><tr><td>6 people</td><td>Private speed boat</td><td>50 € p.P.</td></tr></tbody></table>
Experience one of the most impressive moments of your vacation: swim with wild dolphins, discover colorful coral reefs and relax on a paradisiacal island - all in a single morning.





This high quality private tour is made for travelers who want the best:





✔ No mass boats


✔ No foreign guests


✔ No hassle


✔ 100% private & personally looked after





With HurghadaTravel Planner you don''t book just any excursion - but an experience that many guests describe as the highlight of their entire Egypt vacation.





🐬 Swimming with dolphins in Hurghada – natural, respectful & unforgettable





Imagine: The speedboat glides over the turquoise water. They jump into the warm sea. Suddenly dolphins appear next to you - curious, elegant, free.





Our route leads specifically to the best known dolphin areas off Hurghada. The animals live here in the wild and often seek proximity to the boats themselves.





For many guests, this moment is more emotional than any attraction on land.





But this excursion offers much more:





Fascinating shipwreck full of marine life





Relaxed atmosphere without time pressure





Everything perfectly organized – in just 4 hours.





⭐ Why this tour is one of the most booked private excursions in Hurghada





100% private implementation





Maximum of 8 people on board





Very high dolphin sighting rate





Modern, safe speedboats





Experienced & licensed captains





Ideal for couples, families & small groups





Excellent value for money





🎒 Please bring it with you





Swimwear & towel





Sunscreen & sunglasses





Headgear





In winter: light jacket', 'Private dolphin tour in Hurghada – personal, comfortable and unforgettable.', 'Snorkeling & diving', '["Private speedboat excursion from Hurghada","Watch dolphins in the wild","Two spectacular coral reefs","Snorkeling at the sunken shipwreck","Soft drinks & fresh fruits on board","Hotel transfer included"]'::jsonb, '["Private speedboat with experienced captain","Hotel transfer there and back","Snorkeling equipment","Dolphin watching in the wild","Two snorkel stops","Soft drinks, water & fresh fruits"]'::jsonb, '["Personal expenses","Meals","Transfer surcharges for certain regions"]'::jsonb, 'Hurghada - Red Sea - Egypt', '4h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '27ae0b35-e0ef-4b01-9aa7-23d3210d74ff', 'hu', 'Privát delfintúra Hurghadában motorcsónakkal', '<table class="tour-pricing-table"><thead><tr><th>Részvevők</th><th>Csónak</th><th>Ár személyenként</th></tr></thead><tbody><tr><td>1 fő</td><td>Privát motorcsónak</td><td>150 € személyenként</td></tr><t>fő</td> motorcsónak</td><td>80 € személyenként</td></tr><tr><td>3 fő</td><td>Privát motorcsónak</td><td>70 € személyenként</td></tr><tr><td>4 fő</td><td>Privát motorcsónak</td><td>60 € p.dtr5><></td>p.dtr. fő</td><td>Privát motorcsónak</td><td>55 € személyenként</td></tr><tr><td>6 fő</td><td>Privát motorcsónak</td><td>50 € személyenként.</td></tr></tbody></table>
Élje át nyaralásának egyik leglenyűgözőbb pillanatát: ússzon vaddelfinekkel, fedezze fel a színes korallzátonyokat, és pihenjen egy paradicsomi szigeten – mindezt egyetlen reggelen belül.





Ez a kiváló minőségű privát túra azoknak az utazóknak készült, akik a legjobbat akarják:





✔ Nincs tömeghajó


✔ Nincsenek külföldi vendégek


✔ Semmi gond


✔ 100%-ban privát és személyesen gondozott





A HurghadaTravel Planner segítségével nem akármilyen kirándulást foglalhat le, hanem olyan élményt, amelyet sok vendég az egész egyiptomi nyaralás csúcspontjaként ír le.





🐬 Úszás delfinekkel Hurghadában – természetes, tiszteletteljes és felejthetetlen





Képzeld el: A motorcsónak siklik a türkizkék víz felett. Beugranak a meleg tengerbe. Hirtelen delfinek jelennek meg melletted – kíváncsiak, elegánsak, szabadok.





Útvonalunk kifejezetten a Hurghada melletti legismertebb delfinterületekre vezet. Az állatok vadon élnek itt, és gyakran magukhoz a csónakokhoz keresik a közelséget.





Sok vendég számára ez a pillanat érzelmesebb, mint bármely szárazföldi látványosság.





De ez a kirándulás sokkal többet kínál:





Lenyűgöző hajóroncs tele tengeri élettel





Nyugodt légkör időnyomás nélkül





Minden tökéletesen szervezett – mindössze 4 óra alatt.





⭐ Miért ez a túra az egyik legtöbbet foglalt privát kirándulás Hurghadában





100%-ban privát megvalósítás





Maximum 8 fő a fedélzeten





Nagyon magas delfin észlelési arány





Modern, biztonságos motorcsónakok





Tapasztalt és engedéllyel rendelkező kapitányok





Ideális pároknak, családoknak és kisebb csoportoknak





Kiváló ár-érték arány





🎒 Kérlek hozd magaddal





Fürdőruha és törölköző





Fényvédő krém és napszemüveg





Fejfedő





Télen: könnyű kabát', 'Privát delfintúra Hurghadában – személyes, kényelmes és felejthetetlen.', 'Sznorkelezés és búvárkodás', '["Privát motorcsónakos kirándulás Hurghadából","Nézze meg a delfineket a vadonban","Két látványos korallzátony","Sznorkelezés az elsüllyedt hajóroncsnál","Üdítőitalok és friss gyümölcsök a fedélzeten","Szállodai transzfert tartalmaz"]'::jsonb, '["Privát motorcsónak tapasztalt kapitánnyal","Szállodai transzfer oda-vissza","Snorkeling felszerelés","Delfin néz a vadonban","Két snorkel megálló","Üdítőitalok, víz és friss gyümölcsök"]'::jsonb, '["Személyi kiadások","Étkezés","Transzfer felárak bizonyos régiókban"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '4 óra', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '27ae0b35-e0ef-4b01-9aa7-23d3210d74ff', 'ru', 'Частная поездка к дельфинам в Хургаде на катере
---ЦЭП---
Частный тур с дельфинами в Хургаде – персональный, комфортный и незабываемый.
---ЦЭП---
Подводное плавание и дайвинг
---ЦЭП---
Хургада - Красное море - Египет
---ЦЭП---
4 часа
---ЦЭП---
<table class="tour-pricing-table"><thead><tr><th>Участники</th><th>Лодка</th><th>Цена на человека</th></tr></thead><tbody><tr><td>1 человек</td><td>Частный катер</td><td>150 евро на человека</td></tr><tr><td>2 человека</td><td>Частный скоростной катер</td><td>80 евро на человека</td></tr><tr><td>3 человека</td><td>Частный катер</td><td>70 евро на человека</td></tr><tr><td>4 человека</td><td>Частный катер</td><td>60 евро на человека</td></tr><tr><td>5 человек</td><td>Частный скоростной катер</td><td>55 евро на человека</td></tr><tr><td>6 человек</td><td>Частный скоростной катер</td><td>50 евро на человека</td></tr></tbody></table>
Испытайте один из самых впечатляющих моментов вашего отпуска: поплавайте с дикими дельфинами, откройте для себя красочные коралловые рифы и отдохните на райском острове - и все это за одно утро.





Этот высококачественный частный тур создан для путешественников, которые хотят лучшего:





✔ Никаких массовых лодок


✔ Никаких иностранных гостей


✔ Никаких проблем


✔ 100% приватность и личный присмотр





С HurghadaTravel Planner вы бронируете не просто экскурсию, а незабываемые впечатления, которые многие гости называют самым ярким событием своего отпуска в Египте.





🐬 Плавание с дельфинами в Хургаде – естественно, достойно и незабываемо.





Представьте: катер скользит по бирюзовой воде. Они прыгают в теплое море. Внезапно рядом с вами появляются дельфины – любопытные, элегантные, свободные.





Наш маршрут ведет именно к самым известным местам с дельфинами недалеко от Хургады. Животные живут здесь в дикой природе и часто сами ищут близости к лодкам.





Для многих гостей этот момент более эмоционален, чем любой аттракцион на суше.





Но эта экскурсия предлагает гораздо больше:





Увлекательное кораблекрушение, полное морской жизни





Расслабляющая атмосфера без цейтнота





Все прекрасно организовано – всего за 4 часа.





⭐ Почему этот тур является одной из самых часто заказываемых частных экскурсий в Хургаде





100% частная реализация





Максимум 8 человек на борту





Очень высокий уровень наблюдения за дельфинами.





Современные и безопасные скоростные катера





Опытные и лицензированные капитаны





Идеально подходит для пар, семей и небольших групп





Отличное соотношение цены и качества





🎒 Пожалуйста, возьмите с собой





Купальники и полотенца





Солнцезащитный крем и солнцезащитные очки





Головной убор





Зимой: легкая куртка.
---ЦЭП---
Частная экскурсия на катере из Хургады
---РАЗДЕЛЕНИЕ---
Наблюдайте за дельфинами в дикой природе
---РАЗДЕЛЕНИЕ---
Два впечатляющих коралловых рифа
---РАЗДЕЛЕНИЕ---
Подводное плавание на месте затонувшего корабля
---РАЗДЕЛЕНИЕ---
Безалкогольные напитки и свежие фрукты на борту
---РАЗДЕЛЕНИЕ---
Трансфер в отель включен
---ЦЭП---
Частный катер с опытным капитаном
---РАЗДЕЛЕНИЕ---
Трансфер из отеля туда и обратно
---РАЗДЕЛЕНИЕ---
Оборудование для подводного плавания
---РАЗДЕЛЕНИЕ---
Наблюдение за дельфинами в дикой природе
---РАЗДЕЛЕНИЕ---
Две остановки для сноркелинга
---РАЗДЕЛЕНИЕ---
Безалкогольные напитки, вода и свежие фрукты
---ЦЭП---
Личные расходы
---РАЗДЕЛЕНИЕ---
Питание
---РАЗДЕЛЕНИЕ---
Комиссия за трансфер для определенных регионов', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Boot</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>1 Person</td><td>Privates Speedboot</td><td>150 € p.P.</td></tr><tr><td>2 Personen</td><td>Privates Speedboot</td><td>80 € p.P.</td></tr><tr><td>3 Personen</td><td>Privates Speedboot</td><td>70 € p.P.</td></tr><tr><td>4 Personen</td><td>Privates Speedboot</td><td>60 € p.P.</td></tr><tr><td>5 Personen</td><td>Privates Speedboot</td><td>55 € p.P.</td></tr><tr><td>6 Personen</td><td>Privates Speedboot</td><td>50 € p.P.</td></tr></tbody></table>
Erleben Sie einen der beeindruckendsten Momente Ihres Urlaubs: Schwimmen Sie mit frei lebenden Delfinen, entdecken Sie farbenprächtige Korallenriffe und entspannen Sie auf einer paradiesischen Insel – alles an einem einzigen Vormittag.





Diese hochwertige Privattour ist für Reisende gemacht, die das Beste wollen:





✔ Keine Massenboote


✔ Keine fremden Gäste


✔ Keine Hektik


✔ 100 % privat & persönlich betreut





Mit HurghadaReiseplaner buchen Sie nicht irgendeinen Ausflug – sondern ein Erlebnis, das viele Gäste als Höhepunkt ihres gesamten Ägypten-Urlaubs bezeichnen.





🐬 Mit Delfinen schwimmen in Hurghada – natürlich, respektvoll & unvergesslich





Stellen Sie sich vor: Das Speedboot gleitet über das türkisfarbene Wasser. Sie springen ins warme Meer. Plötzlich tauchen Delfine neben Ihnen auf – neugierig, elegant, frei.





Unsere Route führt gezielt zu den besten bekannten Delfingebieten vor Hurghada. Die Tiere leben hier in freier Wildbahn und suchen oft selbst die Nähe der Boote.





Für viele Gäste ist dieser Moment emotionaler als jede Sehenswürdigkeit an Land.





Doch dieser Ausflug bietet noch weit mehr:





Faszinierendes Schiffswrack voller Meeresleben





Entspannte Atmosphäre ohne Zeitdruck





Alles perfekt organisiert – in nur 4 Stunden.





⭐ Warum diese Tour zu den meistgebuchten privaten Ausflügen in Hurghada gehört





100 % private Durchführung





Maximal 8 Personen an Bord





Sehr hohe Delfin-Sichtungsquote





Moderne, sichere Speedboote





Erfahrene & lizenzierte Kapitäne





Ideal für Paare, Familien & kleine Gruppen





Hervorragendes Preis-Leistungs-Verhältnis





🎒 Bitte mitbringen





Badebekleidung & Handtuch





Sonnencreme & Sonnenbrille





Kopfbedeckung





Im Winter: leichte Jacke', 'Private Delfintour in Hurghada – persönlich, komfortabel und unvergesslich.', 'Schnorcheln & Tauchen', '["Privater Speedboot-Ausflug ab Hurghada","Delfine in freier Wildbahn beobachten","Zwei spektakuläre Korallenriffe","Schnorcheln am versunkenen Schiffswrack","Softdrinks & frische Früchte an Bord","Hoteltransfer inklusive"]'::jsonb, '["Privates Speedboot mit erfahrenem Kapitän","Hoteltransfer Hin- und Rückfahrt","Schnorchelausrüstung","Delfinbeobachtung in freier Wildbahn","Zwei Schnorchelstopps","Softdrinks, Wasser & frische Früchte"]'::jsonb, '["Persönliche Ausgaben","Mahlzeiten","Transferzuschläge für bestimmte Regionen"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '4h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '27ae0b35-e0ef-4b01-9aa7-23d3210d74ff', 'ar', 'رحلة الدلافين الخاصة في الغردقة بالقارب السريع
--- تسيب ---
جولة الدلافين الخاصة في الغردقة – شخصية ومريحة ولا تُنسى.
--- تسيب ---
الغطس والغوص
--- تسيب ---
الغردقة - البحر الأحمر - مصر
--- تسيب ---
4 ساعات
--- تسيب ---
<table class="tour-pricing-table"><thead><tr><th>المشاركين</th><th>القارب</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخص واحد</td><td>قارب سريع خاص</td><td>150 يورو للشخص الواحد</td></tr><tr><td>شخصان</td><td>خاص قارب سريع</td><td>80 يورو للشخص الواحد.</td></tr><tr><td>3 أشخاص</td><td>قارب سريع خاص</td><td>70 يورو للشخص الواحد.</td></tr><tr><td>4 أشخاص</td><td>قارب سريع خاص</td><td>60 يورو للشخص الواحد.</td></tr><tr><td>5 الأشخاص</td><td>قارب سريع خاص</td><td>55 يورو للشخص الواحد</td></tr><tr><td>6 أشخاص</td><td>قارب سريع خاص</td><td>50 يورو للشخص الواحد</td></tr></tbody></table>
استمتع بواحدة من أكثر اللحظات إثارة للإعجاب في إجازتك: السباحة مع الدلافين البرية، واكتشاف الشعاب المرجانية الملونة والاسترخاء في جزيرة فردوسية - كل ذلك في صباح واحد.





تم تصميم هذه الجولة الخاصة عالية الجودة للمسافرين الذين يريدون الأفضل:





✔ لا توجد قوارب جماعية


✔ لا يوجد ضيوف أجانب


✔ لا يوجد أي متاعب


✔ 100% خاص ويتم الاعتناء به شخصيًا





مع HurghadaTravel Planner، لن تقوم بحجز أي رحلة فحسب - بل تجربة يصفها العديد من الضيوف بأنها أهم ما يميز إجازتهم في مصر بأكملها.





🐬 السباحة مع الدلافين في الغردقة – طبيعية ومحترمة ولا تنسى





تخيل: القارب السريع ينزلق فوق المياه الفيروزية. يقفزون في البحر الدافئ. فجأة تظهر الدلافين بجوارك - فضولية وأنيقة وحرة.





يؤدي طريقنا على وجه التحديد إلى أشهر مناطق الدلافين قبالة الغردقة. تعيش الحيوانات هنا في البرية وغالبًا ما تسعى إلى القرب من القوارب نفسها.





بالنسبة للعديد من الضيوف، تعتبر هذه اللحظة أكثر عاطفية من أي جاذبية على الأرض.





لكن هذه الرحلة تقدم أكثر من ذلك بكثير:





حطام سفينة رائعة مليئة بالحياة البحرية





جو مريح دون ضغط الوقت





كل شيء منظم بشكل مثالي – في 4 ساعات فقط.





⭐ لماذا تعتبر هذه الجولة من أكثر الرحلات الخاصة حجزا في الغردقة





التنفيذ خاص 100%





الحد الأقصى 8 أشخاص على متن الطائرة





معدل مشاهدة الدلافين مرتفع جدًا





قوارب سريعة حديثة وآمنة





كابتن ذو خبرة ومرخص





مثالية للأزواج والعائلات والمجموعات الصغيرة





قيمة ممتازة مقابل المال





🎒 يرجى إحضارها معك





ملابس السباحة ومنشفة





واقي الشمس والنظارات الشمسية





القبعات





في الشتاء: سترة خفيفة
--- تسيب ---
رحلة خاصة بالقارب السريع من الغردقة
---تقسيم---
مشاهدة الدلافين في البرية
---تقسيم---
اثنين من الشعاب المرجانية الرائعة
---تقسيم---
الغطس في حطام السفينة الغارقة
---تقسيم---
المشروبات الغازية والفواكه الطازجة على متن الطائرة
---تقسيم---
شامل النقل من الفندق
--- تسيب ---
قارب سريع خاص مع قبطان ذو خبرة
---تقسيم---
نقل الفندق هناك والعودة
---تقسيم---
معدات الغطس
---تقسيم---
مشاهدة الدلافين في البرية
---تقسيم---
توقفين للغطس
---تقسيم---
المشروبات الغازية والمياه والفواكه الطازجة
--- تسيب ---
النفقات الشخصية
---تقسيم---
وجبات
---تقسيم---
تحويل الرسوم الإضافية لمناطق معينة', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Boot</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>1 Person</td><td>Privates Speedboot</td><td>150 € p.P.</td></tr><tr><td>2 Personen</td><td>Privates Speedboot</td><td>80 € p.P.</td></tr><tr><td>3 Personen</td><td>Privates Speedboot</td><td>70 € p.P.</td></tr><tr><td>4 Personen</td><td>Privates Speedboot</td><td>60 € p.P.</td></tr><tr><td>5 Personen</td><td>Privates Speedboot</td><td>55 € p.P.</td></tr><tr><td>6 Personen</td><td>Privates Speedboot</td><td>50 € p.P.</td></tr></tbody></table>
Erleben Sie einen der beeindruckendsten Momente Ihres Urlaubs: Schwimmen Sie mit frei lebenden Delfinen, entdecken Sie farbenprächtige Korallenriffe und entspannen Sie auf einer paradiesischen Insel – alles an einem einzigen Vormittag.





Diese hochwertige Privattour ist für Reisende gemacht, die das Beste wollen:





✔ Keine Massenboote


✔ Keine fremden Gäste


✔ Keine Hektik


✔ 100 % privat & persönlich betreut





Mit HurghadaReiseplaner buchen Sie nicht irgendeinen Ausflug – sondern ein Erlebnis, das viele Gäste als Höhepunkt ihres gesamten Ägypten-Urlaubs bezeichnen.





🐬 Mit Delfinen schwimmen in Hurghada – natürlich, respektvoll & unvergesslich





Stellen Sie sich vor: Das Speedboot gleitet über das türkisfarbene Wasser. Sie springen ins warme Meer. Plötzlich tauchen Delfine neben Ihnen auf – neugierig, elegant, frei.





Unsere Route führt gezielt zu den besten bekannten Delfingebieten vor Hurghada. Die Tiere leben hier in freier Wildbahn und suchen oft selbst die Nähe der Boote.





Für viele Gäste ist dieser Moment emotionaler als jede Sehenswürdigkeit an Land.





Doch dieser Ausflug bietet noch weit mehr:





Faszinierendes Schiffswrack voller Meeresleben





Entspannte Atmosphäre ohne Zeitdruck





Alles perfekt organisiert – in nur 4 Stunden.





⭐ Warum diese Tour zu den meistgebuchten privaten Ausflügen in Hurghada gehört





100 % private Durchführung





Maximal 8 Personen an Bord





Sehr hohe Delfin-Sichtungsquote





Moderne, sichere Speedboote





Erfahrene & lizenzierte Kapitäne





Ideal für Paare, Familien & kleine Gruppen





Hervorragendes Preis-Leistungs-Verhältnis





🎒 Bitte mitbringen





Badebekleidung & Handtuch





Sonnencreme & Sonnenbrille





Kopfbedeckung





Im Winter: leichte Jacke', 'Private Delfintour in Hurghada – persönlich, komfortabel und unvergesslich.', 'Schnorcheln & Tauchen', '["Privater Speedboot-Ausflug ab Hurghada","Delfine in freier Wildbahn beobachten","Zwei spektakuläre Korallenriffe","Schnorcheln am versunkenen Schiffswrack","Softdrinks & frische Früchte an Bord","Hoteltransfer inklusive"]'::jsonb, '["Privates Speedboot mit erfahrenem Kapitän","Hoteltransfer Hin- und Rückfahrt","Schnorchelausrüstung","Delfinbeobachtung in freier Wildbahn","Zwei Schnorchelstopps","Softdrinks, Wasser & frische Früchte"]'::jsonb, '["Persönliche Ausgaben","Mahlzeiten","Transferzuschläge für bestimmte Regionen"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '4h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', 'b2dc19de-fc9f-4a96-a742-7646e16a8486', 'fr', 'Excursion privée en hors-bord à Hurghada | Snorkeling sur la barrière de corail et coucher de soleil', '<table class="tour-pricing-table"><thead><tr><th>Participants</th><th>Bateau</th><th>Prix par personne</th></tr></thead><tbody><tr><td>1 personne</td><td>Bateau rapide privé</td><td>150 € par personne</td></tr><tr><td>2 personnes</td><td>Privé hors-bord</td><td>80 € p.P.</td></tr><tr><td>3 personnes</td><td>Bateau rapide privé</td><td>70 € p.P.</td></tr><tr><td>4 personnes</td><td>Bateau rapide privé</td><td>60 € p.P.</td></tr><tr><td>5 personnes</td><td>Bateau rapide privé</td><td>55 € p.P.</td></tr><tr><td>6 personnes</td><td>Bateau rapide privé</td><td>50 € p.P.</td></tr></tbody></table>
Tour privé en hors-bord dans la mer Rouge





Cette excursion privée en hors-bord à Hurghada vous offre la possibilité de découvrir la mer Rouge individuellement et sans tourisme de masse. La visite est idéale pour les familles, les couples et les petits groupes qui apprécient l''intimité, la flexibilité et l''attention personnelle.





Dans l''après-midi, vous serez pris en charge directement à votre hôtel à Hurghada et conduit au port. Votre hors-bord privé vous y attend et vous emmènera vers des sites de plongée en apnée sélectionnés et des zones côtières calmes.', 'Snorkeling sur les récifs coralliens et coucher de soleil sur la mer Rouge', 'Snorkeling et plongée', '["Excursion privée en hors-bord depuis Hurghada","Snorkeling sur des récifs coralliens sélectionnés","Restez sur une île tranquille","Coucher de soleil sur la mer","Boissons et fruits frais à bord"]'::jsonb, '["Prise en charge et retour à l''hôtel dans un véhicule climatisé","Bateau rapide privé","Équipement de snorkeling (masque, tuba, palmes, gilet de sauvetage)","Boissons et fruits","Impôts et assurances"]'::jsonb, '["Dépenses personnelles","Suppléments de transfert pour certaines régions"]'::jsonb, 'Hurghada - Mer Rouge - Egypte', '4h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', 'b2dc19de-fc9f-4a96-a742-7646e16a8486', 'en', 'Private Speedboat Trip in Hurghada | Snorkeling on the coral reef & sunset', '<table class="tour-pricing-table"><thead><tr><th>Participants</th><th>Boat</th><th>Price per person</th></tr></thead><tbody><tr><td>1 person</td><td>Private speedboat</td><td>150 € per person</td></tr><tr><td>2 people</td><td>Private speedboat</td><td>80 € p.P.</td></tr><tr><td>3 people</td><td>Private speedboat</td><td>70 € p.P.</td></tr><tr><td>4 people</td><td>Private speedboat</td><td>60 € p.P.</td></tr><tr><td>5 people</td><td>Private Speedboat</td><td>55 € p.P.</td></tr><tr><td>6 people</td><td>Private speed boat</td><td>50 € p.P.</td></tr></tbody></table>
Private speedboat tour in the Red Sea





This private speedboat excursion in Hurghada offers you the opportunity to experience the Red Sea individually and without mass tourism. The tour is ideal for families, couples and small groups who value privacy, flexibility and personal attention.





In the afternoon you will be picked up directly from your hotel in Hurghada and taken to the port. Your private speedboat awaits you there and will take you to selected snorkeling spots and quiet coastal areas.', 'Snorkeling on coral reefs & sunset on the Red Sea', 'Snorkeling & diving', '["Private speedboat trip from Hurghada","Snorkeling on selected coral reefs","Stay on a quiet island","Sunset on the sea","Drinks and fresh fruit on board"]'::jsonb, '["Hotel pickup & drop-off in an air-conditioned vehicle","Private speedboat","Snorkeling equipment (mask, snorkel, fins, life jacket)","Drinks & Fruit","Taxes & Insurance"]'::jsonb, '["Personal expenses","Transfer surcharges for certain regions"]'::jsonb, 'Hurghada - Red Sea - Egypt', '4h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', 'b2dc19de-fc9f-4a96-a742-7646e16a8486', 'ru', 'Частная поездка на катере в Хургаде | Сноркелинг на коралловом рифе и закат
---ЦЭП---
Сноркелинг на коралловых рифах и закат на Красном море
---ЦЭП---
Подводное плавание и дайвинг
---ЦЭП---
Хургада - Красное море - Египет
---ЦЭП---
4 часа
---ЦЭП---
<table class="tour-pricing-table"><thead><tr><th>Участники</th><th>Лодка</th><th>Цена на человека</th></tr></thead><tbody><tr><td>1 человек</td><td>Частный катер</td><td>150 евро на человека</td></tr><tr><td>2 человека</td><td>Частный скоростной катер</td><td>80 евро на человека</td></tr><tr><td>3 человека</td><td>Частный катер</td><td>70 евро на человека</td></tr><tr><td>4 человека</td><td>Частный катер</td><td>60 евро на человека</td></tr><tr><td>5 человек</td><td>Частный скоростной катер</td><td>55 евро на человека</td></tr><tr><td>6 человек</td><td>Частный скоростной катер</td><td>50 евро на человека</td></tr></tbody></table>
Частный тур на катере по Красному морю





Эта частная экскурсия на скоростном катере в Хургаде предлагает вам возможность познакомиться с Красным морем индивидуально и без массового туризма. Тур идеально подходит для семей, пар и небольших групп, которые ценят конфиденциальность, гибкость и личное внимание.





Во второй половине дня вас заберут прямо из отеля в Хургаде и отвезут в порт. Там вас ждет частный скоростной катер, который доставит вас к избранным местам для подводного плавания и тихим прибрежным районам.
---ЦЭП---
Частная поездка на катере из Хургады
---РАЗДЕЛЕНИЕ---
Подводное плавание на избранных коралловых рифах
---РАЗДЕЛЕНИЕ---
Остановитесь на тихом острове
---РАЗДЕЛЕНИЕ---
Закат на море
---РАЗДЕЛЕНИЕ---
Напитки и свежие фрукты на борту
---ЦЭП---
Встреча и выезд из отеля на автомобиле с кондиционером
---РАЗДЕЛЕНИЕ---
Частный катер
---РАЗДЕЛЕНИЕ---
Снаряжение для подводного плавания (маска, трубка, ласты, спасательный жилет)
---РАЗДЕЛЕНИЕ---
Напитки и фрукты
---РАЗДЕЛЕНИЕ---
Налоги и страхование
---ЦЭП---
Личные расходы
---РАЗДЕЛЕНИЕ---
Комиссия за трансфер для определенных регионов', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Boot</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>1 Person</td><td>Privates Speedboot</td><td>150 € p.P.</td></tr><tr><td>2 Personen</td><td>Privates Speedboot</td><td>80 € p.P.</td></tr><tr><td>3 Personen</td><td>Privates Speedboot</td><td>70 € p.P.</td></tr><tr><td>4 Personen</td><td>Privates Speedboot</td><td>60 € p.P.</td></tr><tr><td>5 Personen</td><td>Privates Speedboot</td><td>55 € p.P.</td></tr><tr><td>6 Personen</td><td>Privates Speedboot</td><td>50 € p.P.</td></tr></tbody></table>
Private Speedboot-Tour im Roten Meer





Dieser private Speedboot Ausflug in Hurghada bietet Ihnen die Möglichkeit, das Rote Meer individuell und ohne Massentourismus zu erleben. Die Tour eignet sich ideal für Familien, Paare und kleine Gruppen, die Wert auf Privatsphäre, Flexibilität und persönliche Betreuung legen.





Am Nachmittag werden Sie direkt von Ihrem Hotel in Hurghada abgeholt und zum Hafen gebracht. Dort erwartet Sie Ihr privates Speedboot, mit dem Sie zu ausgewählten Schnorchelplätzen und ruhigen Küstenabschnitten fahren..', 'Schnorcheln an Korallenriffen & Sonnenuntergang auf dem Roten Meer', 'Schnorcheln & Tauchen', '["Private Speedbootfahrt ab Hurghada","Schnorcheln an ausgewählten Korallenriffen","Aufenthalt auf einer ruhigen Insel","Sonnenuntergang auf dem Meer","Getränke und frisches Obst an Bord"]'::jsonb, '["Hotelabholung & Rücktransfer im klimatisierten Fahrzeug","Privates Speedboot","Schnorchelausrüstung (Maske, Schnorchel, Flossen, Schwimmweste)","Getränke & Obst","Steuern & Versicherung"]'::jsonb, '["Persönliche Ausgaben","Transferzuschläge für bestimmte Regionen"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '4h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', 'b2dc19de-fc9f-4a96-a742-7646e16a8486', 'ar', 'رحلة خاصة بالقارب السريع في الغردقة | الغطس على الشعاب المرجانية وغروب الشمس
--- تسيب ---
الغطس على الشعاب المرجانية وغروب الشمس على البحر الأحمر
--- تسيب ---
الغطس والغوص
--- تسيب ---
الغردقة - البحر الأحمر - مصر
--- تسيب ---
4 ساعات
--- تسيب ---
<table class="tour-pricing-table"><thead><tr><th>المشاركين</th><th>القارب</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخص واحد</td><td>قارب سريع خاص</td><td>150 يورو للشخص الواحد</td></tr><tr><td>شخصان</td><td>خاص قارب سريع</td><td>80 يورو للشخص الواحد.</td></tr><tr><td>3 أشخاص</td><td>قارب سريع خاص</td><td>70 يورو للشخص الواحد.</td></tr><tr><td>4 أشخاص</td><td>قارب سريع خاص</td><td>60 يورو للشخص الواحد.</td></tr><tr><td>5 الأشخاص</td><td>قارب سريع خاص</td><td>55 يورو للشخص الواحد</td></tr><tr><td>6 أشخاص</td><td>قارب سريع خاص</td><td>50 يورو للشخص الواحد</td></tr></tbody></table>
جولة خاصة بالقارب السريع في البحر الأحمر





تتيح لك هذه الرحلة الخاصة بالقارب السريع في الغردقة فرصة تجربة البحر الأحمر بشكل فردي وبدون سياحة جماعية. الجولة مثالية للعائلات والأزواج والمجموعات الصغيرة الذين يقدرون الخصوصية والمرونة والاهتمام الشخصي.





في فترة ما بعد الظهر، سيتم اصطحابك مباشرة من فندقك في الغردقة ونقلك إلى الميناء. ينتظرك القارب السريع الخاص بك هناك، وسيأخذك إلى مناطق مختارة للغطس والمناطق الساحلية الهادئة.
--- تسيب ---
رحلة خاصة بالقارب السريع من الغردقة
---تقسيم---
الغطس على الشعاب المرجانية المختارة
---تقسيم---
البقاء في جزيرة هادئة
---تقسيم---
غروب الشمس على البحر
---تقسيم---
المشروبات والفواكه الطازجة على متن الطائرة
--- تسيب ---
الاستقبال في الفندق والتوصيل في سيارة مكيفة
---تقسيم---
قارب سريع خاص
---تقسيم---
معدات الغطس (القناع، الغطس، الزعانف، سترة النجاة)
---تقسيم---
المشروبات والفواكه
---تقسيم---
الضرائب والتأمين
--- تسيب ---
النفقات الشخصية
---تقسيم---
تحويل الرسوم الإضافية لمناطق معينة', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Boot</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>1 Person</td><td>Privates Speedboot</td><td>150 € p.P.</td></tr><tr><td>2 Personen</td><td>Privates Speedboot</td><td>80 € p.P.</td></tr><tr><td>3 Personen</td><td>Privates Speedboot</td><td>70 € p.P.</td></tr><tr><td>4 Personen</td><td>Privates Speedboot</td><td>60 € p.P.</td></tr><tr><td>5 Personen</td><td>Privates Speedboot</td><td>55 € p.P.</td></tr><tr><td>6 Personen</td><td>Privates Speedboot</td><td>50 € p.P.</td></tr></tbody></table>
Private Speedboot-Tour im Roten Meer





Dieser private Speedboot Ausflug in Hurghada bietet Ihnen die Möglichkeit, das Rote Meer individuell und ohne Massentourismus zu erleben. Die Tour eignet sich ideal für Familien, Paare und kleine Gruppen, die Wert auf Privatsphäre, Flexibilität und persönliche Betreuung legen.





Am Nachmittag werden Sie direkt von Ihrem Hotel in Hurghada abgeholt und zum Hafen gebracht. Dort erwartet Sie Ihr privates Speedboot, mit dem Sie zu ausgewählten Schnorchelplätzen und ruhigen Küstenabschnitten fahren..', 'Schnorcheln an Korallenriffen & Sonnenuntergang auf dem Roten Meer', 'Schnorcheln & Tauchen', '["Private Speedbootfahrt ab Hurghada","Schnorcheln an ausgewählten Korallenriffen","Aufenthalt auf einer ruhigen Insel","Sonnenuntergang auf dem Meer","Getränke und frisches Obst an Bord"]'::jsonb, '["Hotelabholung & Rücktransfer im klimatisierten Fahrzeug","Privates Speedboot","Schnorchelausrüstung (Maske, Schnorchel, Flossen, Schwimmweste)","Getränke & Obst","Steuern & Versicherung"]'::jsonb, '["Persönliche Ausgaben","Transferzuschläge für bestimmte Regionen"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '4h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', 'b2dc19de-fc9f-4a96-a742-7646e16a8486', 'hu', 'Privát motorcsónakos kirándulás Hurghadában | Sznorkelezés a korallzátonyon és naplemente', '<table class="tour-pricing-table"><thead><tr><th>Részvevők</th><th>Csónak</th><th>Ár személyenként</th></tr></thead><tbody><tr><td>1 fő</td><td>Privát motorcsónak</td><td>150 € személyenként</td></tr><t>fő</td> motorcsónak</td><td>80 € személyenként</td></tr><tr><td>3 fő</td><td>Privát motorcsónak</td><td>70 € személyenként</td></tr><tr><td>4 fő</td><td>Privát motorcsónak</td><td>60 € p.dtr5><></td>p.dtr. fő</td><td>Privát motorcsónak</td><td>55 € személyenként</td></tr><tr><td>6 fő</td><td>Privát motorcsónak</td><td>50 € személyenként.</td></tr></tbody></table>
Privát motorcsónakos túra a Vörös-tengeren





Ez a privát motorcsónakos kirándulás Hurghadában lehetőséget kínál a Vörös-tenger egyéni megtapasztalására, tömegturizmus nélkül. A túra ideális családok, párok és kis csoportok számára, akik értékelik a magánéletet, a rugalmasságot és a személyes odafigyelést.





Délután közvetlenül a szállodájából veszik fel Hurghadában, és elviszik a kikötőbe. Saját motorcsónakja ott várja Önt, és elviszi kiválasztott sznorkelezési helyekre és csendes tengerparti területekre.', 'Sznorkelezés korallzátonyokon és naplemente a Vörös-tengeren', 'Sznorkelezés és búvárkodás', '["Privát motorcsónakos kirándulás Hurghadából","Sznorkelezés válogatott korallzátonyokon","Maradjon egy csendes szigeten","Naplemente a tengeren","Italok és friss gyümölcs a fedélzeten"]'::jsonb, '["Szállodai fel- és leszállás légkondicionált járművel","Privát motorcsónak","Snorkel felszerelés (maszk, légzőcső, uszonyok, mentőmellény)","Italok és gyümölcsök","Adók és biztosítás"]'::jsonb, '["Személyi kiadások","Transzfer felárak bizonyos régiókban"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '4 óra', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '6b629662-908c-40e3-b396-565393a6be18', 'fr', 'Makadi Water Park Hurghada avec déjeuner et transfert', '<table class="tour-pricing-table"><thead><tr><th>Prix</th><th>Type de voyage</th><th>Début du voyage</th><th>Prise en charge</th></tr></thead><tbody><tr><td>À partir de 50 € par personne</td><td>Billet d''entrée</td><td>par jour</td><td>env. 9h00</td></tr></tbody></table>
Vivez une journée de vacances parfaite au parc aquatique Makadi (Makadi Water World) - l''un des parcs aquatiques les plus grands et les plus modernes de la mer Rouge.


Alliant action, détente et confort, cette excursion premium est idéale pour les familles, les couples et tous ceux qui aiment les plaisirs aquatiques.





Grâce à la prise en charge à l''hôtel, au transfert climatisé, au déjeuner, aux boissons et à l''entrée prioritaire avec accès organisé. profitez d''une journée sans stress et pleine de moments inoubliables.





🍽️ Déjeuner et boissons inclus





Pendant votre séjour, profitez d''un copieux déjeuner buffet composé de plats internationaux.


Les boissons gazeuses, le café et le thé sont inclus dans le prix.


De nombreux restaurants, snack-bars et coins salons ombragés sont disponibles dans le parc.', 'Excursion au parc aquatique Makadi Water Park avec transfert et déjeuner', 'Culture et tourisme', '["Plus de 50 attractions aquatiques pour tous les âges","38 toboggans aquatiques spectaculaires – du rapide au détendu","14 piscines pour enfants et adultes","Black Hole, toboggans à grande vitesse et montagnes russes aquatiques","Rivière à courant et espaces détente","De grands espaces réservés aux enfants pour s''amuser en famille en toute sécurité"]'::jsonb, '["Entrée au parc aquatique Makadi / Makadi Water World","Entrée prioritaire avec accès organisé","Prise en charge et retour à l''hôtel","Transport climatisé","Déjeuner (buffet)","Boissons gazeuses, café et thé"]'::jsonb, '["Conseils","Dépenses personnelles et service photo","Suppléments de transfert pour certaines régions"]'::jsonb, 'Hurghada – Mer Rouge – Égypte', '8h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '6b629662-908c-40e3-b396-565393a6be18', 'en', 'Makadi Water Park Hurghada with lunch & transfer', '<table class="tour-pricing-table"><thead><tr><th>Price</th><th>Trip type</th><th>Start of trip</th><th>Pick-up</th></tr></thead><tbody><tr><td>From 50 € per person</td><td>Entrance ticket</td><td>daily</td><td>approx. 9:00 a.m.</td></tr></tbody></table>
Experience a perfect day of vacation at Makadi Water Park (Makadi Water World) – one of the largest and most modern water parks on the Red Sea.


Combining action, relaxation and comfort, this premium excursion is ideal for families, couples and anyone who loves water fun.





Thanks to hotel pickup, air-conditioned transfer, lunch, drinks and priority entry with organized access. enjoy a stress-free day full of unforgettable moments.





🍽️ Lunch & drinks included





During your stay, enjoy a rich lunch buffet with international dishes.


Soft drinks, coffee and tea are included in the price.


There are numerous restaurants, snack bars and shaded seating areas available in the park.', 'Water park excursion at Makadi Water Park with transfer & lunch', 'Culture & sightseeing', '["Over 50 water attractions for all ages","38 spectacular water slides – from fast to relaxed","14 swimming pools for children & adults","Black Hole, high speed slides & water roller coaster","Lazy river & relaxation zones","Large children''s areas for safe family fun"]'::jsonb, '["Entrance to Makadi Water Park / Makadi Water World","Priority entry with organized access","Hotel pickup & drop off","Air-conditioned transport","Lunch (buffet)","Soft drinks, coffee & tea"]'::jsonb, '["Tips","Personal expenses & photo service","Transfer surcharges for certain regions"]'::jsonb, 'Hurghada–Red Sea–Egypt', '8h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '6b629662-908c-40e3-b396-565393a6be18', 'ru', 'Аквапарк Макади в Хургаде с обедом и трансфером
---ЦЭП---
Экскурсия в аквапарк Макади с трансфером и обедом
---ЦЭП---
Культура и достопримечательности
---ЦЭП---
Хургада – Красное море – Египет
---ЦЭП---
8 часов
---ЦЭП---
<table class="tour-pricing-table"><thead><tr><th>Цена</th><th>Тип поездки</th><th>Начало поездки</th><th>Самовывоз</th></tr></thead><tbody><tr><td>От 50 евро на человека</td><td>Входной билет</td><td>ежедневно</td><td>ок. 9:00 утра.</td></tr></tbody></table>
Проведите идеальный день отпуска в аквапарке Макади (Makadi Water World) — одном из крупнейших и самых современных аквапарков на Красном море.


Эта экскурсия премиум-класса, сочетающая в себе действие, отдых и комфорт, идеально подходит для семей, пар и всех, кто любит водные развлечения.





Благодаря трансферу из отеля, трансферу с кондиционером, обеду, напиткам и приоритетному входу с организованным доступом. проведите день без стресса, полный незабываемых моментов.





🍽️ Обед и напитки включены.





Во время вашего пребывания насладитесь богатым обедом "шведский стол" с блюдами интернациональной кухни.


Безалкогольные напитки, кофе и чай включены в стоимость.


В парке есть множество ресторанов, закусочных и затененных зон отдыха.
---ЦЭП---
Более 50 водных аттракционов для всех возрастов
---РАЗДЕЛЕНИЕ---
38 впечатляющих водных горок – от быстрых до расслабленных
---РАЗДЕЛЕНИЕ---
14 бассейнов для детей и взрослых
---РАЗДЕЛЕНИЕ---
Черная дыра, скоростные горки и водные американские горки
---РАЗДЕЛЕНИЕ---
Ленивая река и зоны отдыха
---РАЗДЕЛЕНИЕ---
Большие детские зоны для безопасного семейного отдыха
---ЦЭП---
Вход в аквапарк Макади / Водный мир Макади.
---РАЗДЕЛЕНИЕ---
Приоритетный вход с организованным доступом
---РАЗДЕЛЕНИЕ---
Встреча в отеле и высадка
---РАЗДЕЛЕНИЕ---
Транспорт с кондиционером
---РАЗДЕЛЕНИЕ---
Обед (шведский стол)
---РАЗДЕЛЕНИЕ---
Безалкогольные напитки, кофе и чай
---ЦЭП---
Советы
---РАЗДЕЛЕНИЕ---
Личные расходы и фотоуслуги
---РАЗДЕЛЕНИЕ---
Комиссия за трансфер для определенных регионов', '<table class="tour-pricing-table"><thead><tr><th>Preis</th><th>Reisetyp</th><th>Reiseantritt</th><th>Abholung</th></tr></thead><tbody><tr><td>Ab 50 € p.P.</td><td>Eintrittsticket</td><td>täglich</td><td>ca. 9:00 Uhr</td></tr></tbody></table>
Erleben Sie einen perfekten Urlaubstag im Makadi Water Park (Makadi Water World) – einem der größten und modernsten Wasserparks am Roten Meer.


Dieser Premium-Ausflug kombiniert Action, Entspannung und Komfort und ist ideal für Familien, Paare und alle, die Wasserspaß lieben.





Dank Hotelabholung, klimatisiertem Transfer, Mittagessen, Getränken und Bevorzugter Einlass mit organisiertem Zugang. genießen Sie einen stressfreien Tag voller unvergesslicher Momente.





🍽️ Mittagessen & Getränke inklusive





Während Ihres Aufenthalts genießen Sie ein reichhaltiges Mittagsbuffet mit internationalen Gerichten.


Softdrinks, Kaffee und Tee sind im Preis enthalten.


Im Park stehen zahlreiche Restaurants, Snackbars und schattige Sitzbereiche zur Verfügung.', 'Wasserpark-Ausflug im Makadi Water Park mit Transfer & Mittagessen', 'Kultur & Sightseeing', '["Über 50 Wasserattraktionen für jedes Alter","38 spektakuläre Wasserrutschen – von rasant bis entspannt","14 Swimmingpools für Kinder & Erwachsene","Black Hole, High-Speed-Rutschen & Wasser-Achterbahn","Lazy River & Relax-Zonen","Große Kinderbereiche für sicheren Familienspaß"]'::jsonb, '["Eintritt zum Makadi Water Park / Makadi Water World","Bevorzugter Einlass mit organisiertem Zugang","Hotelabholung & Rücktransfer","Klimatisierter Transport","Mittagessen (Buffet)","Softdrinks, Kaffee & Tee"]'::jsonb, '["Trinkgelder","Persönliche Ausgaben & Fotoservice","Transferzuschläge für bestimmte Regionen"]'::jsonb, 'Hurghada–Rotes Meer–Ägypten', '8h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '6b629662-908c-40e3-b396-565393a6be18', 'ar', 'حديقة مكادي المائية بالغردقة مع الغداء والنقل
--- تسيب ---
رحلة إلى الحديقة المائية في حديقة مكادي المائية مع النقل والغداء
--- تسيب ---
الثقافة ومشاهدة المعالم السياحية
--- تسيب ---
الغردقة – البحر الأحمر – مصر
--- تسيب ---
8 ساعات
--- تسيب ---
<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>بداية الرحلة</th><th>النقل</th></tr></thead><tbody><tr><td>من 50 يورو للشخص الواحد</td><td>تذكرة الدخول</td><td>يوميًا</td><td>تقريبًا. 9:00 صباحًا</td></tr></tbody></table>
استمتع بيوم مثالي من الإجازة في حديقة مكادي المائية (مكادي ووتر وورلد) – واحدة من أكبر وأحدث الحدائق المائية على البحر الأحمر.


تجمع هذه الرحلة المتميزة بين الإثارة والاسترخاء والراحة، وهي مثالية للعائلات والأزواج وأي شخص يحب المرح المائي.





بفضل خدمة الاستقبال في الفندق والنقل المكيف والغداء والمشروبات وأولوية الدخول مع الوصول المنظم. استمتع بيوم خالي من التوتر ومليء باللحظات التي لا تنسى.





🍽️ شامل الغداء والمشروبات





استمتع أثناء إقامتك ببوفيه غداء غني يضم الأطباق العالمية.


يشمل السعر المشروبات الغازية والقهوة والشاي.


يتوفر العديد من المطاعم وبارات الوجبات الخفيفة ومناطق الجلوس المظللة في الحديقة.
--- تسيب ---
أكثر من 50 منطقة جذب مائية لجميع الأعمار
---تقسيم---
38 منزلقًا مائيًا مذهلاً - من السريع إلى المريح
---تقسيم---
14 حمام سباحة للأطفال والكبار
---تقسيم---
الثقب الأسود والمنزلقات عالية السرعة والأفعوانية المائية
---تقسيم---
نهر كسول ومناطق للاسترخاء
---تقسيم---
مناطق كبيرة للأطفال لمتعة عائلية آمنة
--- تسيب ---
مدخل حديقة مكادي المائية / مكادي ووتر وورلد
---تقسيم---
أولوية الدخول مع الوصول المنظم
---تقسيم---
الاستقبال والتوصيل من الفندق
---تقسيم---
وسائل نقل مكيفة
---تقسيم---
الغداء (بوفيه)
---تقسيم---
المشروبات الغازية والقهوة والشاي
--- تسيب ---
نصائح
---تقسيم---
خدمة المصاريف الشخصية والصور
---تقسيم---
تحويل الرسوم الإضافية لمناطق معينة', '<table class="tour-pricing-table"><thead><tr><th>Preis</th><th>Reisetyp</th><th>Reiseantritt</th><th>Abholung</th></tr></thead><tbody><tr><td>Ab 50 € p.P.</td><td>Eintrittsticket</td><td>täglich</td><td>ca. 9:00 Uhr</td></tr></tbody></table>
Erleben Sie einen perfekten Urlaubstag im Makadi Water Park (Makadi Water World) – einem der größten und modernsten Wasserparks am Roten Meer.


Dieser Premium-Ausflug kombiniert Action, Entspannung und Komfort und ist ideal für Familien, Paare und alle, die Wasserspaß lieben.





Dank Hotelabholung, klimatisiertem Transfer, Mittagessen, Getränken und Bevorzugter Einlass mit organisiertem Zugang. genießen Sie einen stressfreien Tag voller unvergesslicher Momente.





🍽️ Mittagessen & Getränke inklusive





Während Ihres Aufenthalts genießen Sie ein reichhaltiges Mittagsbuffet mit internationalen Gerichten.


Softdrinks, Kaffee und Tee sind im Preis enthalten.


Im Park stehen zahlreiche Restaurants, Snackbars und schattige Sitzbereiche zur Verfügung.', 'Wasserpark-Ausflug im Makadi Water Park mit Transfer & Mittagessen', 'Kultur & Sightseeing', '["Über 50 Wasserattraktionen für jedes Alter","38 spektakuläre Wasserrutschen – von rasant bis entspannt","14 Swimmingpools für Kinder & Erwachsene","Black Hole, High-Speed-Rutschen & Wasser-Achterbahn","Lazy River & Relax-Zonen","Große Kinderbereiche für sicheren Familienspaß"]'::jsonb, '["Eintritt zum Makadi Water Park / Makadi Water World","Bevorzugter Einlass mit organisiertem Zugang","Hotelabholung & Rücktransfer","Klimatisierter Transport","Mittagessen (Buffet)","Softdrinks, Kaffee & Tee"]'::jsonb, '["Trinkgelder","Persönliche Ausgaben & Fotoservice","Transferzuschläge für bestimmte Regionen"]'::jsonb, 'Hurghada–Rotes Meer–Ägypten', '8h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '6b629662-908c-40e3-b396-565393a6be18', 'hu', 'Makadi Water Park Hurghada ebéddel és transzferrel', '<table class="tour-pricing-table"><thead><tr><th>Ár</th><th>Utazás típusa</th><th>Utazás kezdete</th><th>Felvétel</th></tr></thead><tbody><tr><td>50 €-tól személyenként</td><td>Belépőjegy</td><prodx>napi 9:00</td></tr></tbody></table>
Töltsön el egy tökéletes napot a Makadi Water Parkban (Makadi Water World) – a Vörös-tenger egyik legnagyobb és legmodernebb vízi parkjában.


Az akciót, a pihenést és a kényelmet ötvöző prémium kirándulás ideális családoknak, pároknak és mindenkinek, aki szereti a vízi szórakozást.





Köszönhetően a szállodai transzfernek, a légkondicionált transzfernek, az ebédnek, az italoknak és az elsőbbségi belépőnek szervezett belépéssel. töltsön el egy stresszmentes napot, tele felejthetetlen pillanatokkal.





🍽️Ebédet és italokat tartalmaz





Tartózkodása alatt élvezze a gazdag svédasztalos ebédet nemzetközi ételekkel.


Az ár az üdítőket, kávét és teát tartalmazza.


A parkban számos étterem, büfé és árnyékos ülősarok található.', 'Kirándulás a vízi parkba a Makadi Water Parkban transzferrel és ebéddel', 'Kultúra és városnézés', '["Több mint 50 vízi attrakció minden korosztály számára","38 látványos vízi csúszda – a gyorstól a nyugodtig","14 medence gyerekeknek és felnőtteknek","Black Hole, nagy sebességű csúszdák és vízi hullámvasút","Lusta folyó és relaxációs zónák","Nagy gyermekterületek a biztonságos családi szórakozáshoz"]'::jsonb, '["A Makadi Water Park / Makadi Water World bejárata","Elsőbbségi belépés szervezett belépéssel","Szállodai átvétel és leszállás","Légkondicionált közlekedés","Ebéd (svédasztalos)","Üdítőitalok, kávé és tea"]'::jsonb, '["Tippek","Személyi kiadások és fotó szolgáltatás","Transzfer felárak bizonyos régiókban"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '8 óra', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '94351900-ac6d-4c76-92e1-f9e1b1744f2f', 'fr', 'Excursion privée d''une journée d''Hurghada au Caire - Pyramides et grand musée égyptien', 'Une journée extraordinaire commence





Votre aventure personnelle commence avant le lever du soleil. Votre chauffeur privé viendra vous chercher directement à votre hôtel à Hurghada.


Dans une voiture confortable et climatisée, vous voyagez à travers le silence du désert en direction du Caire - confortablement, en toute sécurité et individuellement.


Des boissons gratuites vous rafraîchiront tout au long du voyage pour vous mettre dans l''ambiance de la fascinante capitale égyptienne.', 'Luxe, culture et histoire – Votre excursion privée d''une journée aux pyramides de Gizeh et au Grand Musée égyptien.', 'Culture et tourisme', '["Excursion privée – pas de visite de groupe, pas de contrainte de temps","Guide touristique germanophone et expérimenté","Visite du Grand Musée égyptien avec entrée","Visitez les pyramides et le sphinx de Gizeh","Déjeuner inclus","Boissons gratuites dans le véhicule","Service individuel et planification flexible de la journée"]'::jsonb, '["Transfert privé en véhicule climatisé","Guide touristique germanophone","Billet d''entrée au Grand Musée égyptien","Visitez les pyramides de Gizeh et le Sphinx","Déjeuner au Caire","Boissons gratuites pendant le trajet"]'::jsonb, '["Dépenses personnelles","Boissons au déjeuner","Entrée à l''intérieur des pyramides (facultatif)","Supplément de transfert pour les clients de Marsa Alam : 50 € par personne","Supplément de transfert pour les clients d''El Quseir : 35 € par personne","Supplément de transfert depuis la baie de Makadi et Sahl Hasheesh : 5 € par personne","Supplément de transfert depuis El Gouna, Safaga et Soma Bay : 10 € par personne","Guide touristique en langue étrangère (anglais, russe ou français) : supplément 10 € par personne"]'::jsonb, 'Hurghada - Mer Rouge - Egypte', '18h', NULL, NULL, NULL, NULL, '[{"question":"🏛️ Entrée de la Grande Pyramide","answer":"Entrez à l''intérieur de l''une des plus grandes merveilles de l''humanité : une expérience unique. 30,00 € /personne"},{"question":"🌆 Visite de la tour du Caire – Découvrez le Caire d''en haut","answer":"Découvrez une vue panoramique à couper le souffle sur la métropole du Caire et le Nil depuis la célèbre tour du Caire.25,00 € /personne"}]'::jsonb),
('tours', '94351900-ac6d-4c76-92e1-f9e1b1744f2f', 'en', 'Private Day Trip from Hurghada to Cairo – Pyramids & Grand Egyptian Museum', 'An extraordinary day begins





Your personal adventure begins before sunrise. Your private driver will pick you up directly from your hotel in Hurghada.


In a comfortable, air-conditioned car you travel through the silence of the desert towards Cairo - comfortably, safely and individually.


Complimentary drinks provide refreshment throughout the journey as you get in the mood for Egypt''s fascinating capital.', 'Luxury, Culture & History – Your private day trip to the Pyramids of Giza & the Grand Egyptian Museum.', 'Culture & sightseeing', '["Private excursion – no group tour, no time pressure","German-speaking, experienced tour guide","Visit to the Grand Egyptian Museum including entry","Visit the Pyramids & Sphinx of Giza","Lunch included","Free drinks in the vehicle","Individual service & flexible day planning"]'::jsonb, '["Private transfer in air-conditioned vehicle","German speaking tour guide","Entrance ticket to the Grand Egyptian Museum","Visit the Pyramids of Giza & Sphinx","Lunch in Cairo","Free drinks during the journey"]'::jsonb, '["Personal expenses","Drinks at lunch","Entrance to the interior of the pyramids (optional)","Transfer surcharge for guests from Marsa Alam: €50 per person","Transfer surcharge for guests from El Quseir: €35 per person","Transfer surcharge from Makadi Bay & Sahl Hasheesh: €5 per person","Transfer surcharge from El Gouna, Safaga & Soma Bay: €10 per person","Foreign language tour guide (English, Russian or French): additional charge €10 per person"]'::jsonb, 'Hurghada - Red Sea - Egypt', '6 p.m', NULL, NULL, NULL, NULL, '[{"question":"🏛️ Entrance to the Great Pyramid","answer":"Enter the interior of one of humanity''s greatest wonders - a once-in-a-lifetime experience. €30.00 /person"},{"question":"🌆 Cairo Tower Visit – Experience Cairo from above","answer":"Experience a breathtaking panoramic view over the metropolis of Cairo and the Nile from the famous Cairo Tower.25.00 € /person"}]'::jsonb),
('tours', '94351900-ac6d-4c76-92e1-f9e1b1744f2f', 'ru', 'Частная однодневная поездка из Хургады в Каир – пирамиды и Большой египетский музей
---ЦЭП---
Роскошь, культура и история – ваша частная однодневная поездка к пирамидам Гизы и Большому египетскому музею.
---ЦЭП---
Культура и достопримечательности
---ЦЭП---
Хургада - Красное море - Египет
---ЦЭП---
18:00
---ЦЭП---
Необыкновенный день начинается





Ваше личное приключение начинается еще до восхода солнца. Ваш личный водитель заберет вас прямо из вашего отеля в Хургаде.


В комфортабельном автомобиле с кондиционером вы путешествуете по тишине пустыни в сторону Каира – комфортно, безопасно и индивидуально.


Бесплатные напитки освежат вас на протяжении всего путешествия, пока вы погружаетесь в настроение очаровательной столицы Египта.
---ЦЭП---
Частная экскурсия – без группового тура, без ограничений во времени
---РАЗДЕЛЕНИЕ---
Немецкоязычный, опытный гид.
---РАЗДЕЛЕНИЕ---
Посещение Большого Египетского музея, включая вход.
---РАЗДЕЛЕНИЕ---
Посетите пирамиды и сфинкс Гизы.
---РАЗДЕЛЕНИЕ---
Обед включен
---РАЗДЕЛЕНИЕ---
Бесплатные напитки в автомобиле
---РАЗДЕЛЕНИЕ---
Индивидуальное обслуживание и гибкое планирование дня
---ЦЭП---
Частный трансфер на автомобиле с кондиционером
---РАЗДЕЛЕНИЕ---
Немецкоговорящий гид
---РАЗДЕЛЕНИЕ---
Входной билет в Большой Египетский музей.
---РАЗДЕЛЕНИЕ---
Посетите пирамиды Гизы и Сфинкса.
---РАЗДЕЛЕНИЕ---
Обед в Каире
---РАЗДЕЛЕНИЕ---
Бесплатные напитки во время поездки
---ЦЭП---
Личные расходы
---РАЗДЕЛЕНИЕ---
Напитки за обедом
---РАЗДЕЛЕНИЕ---
Вход во внутреннюю часть пирамид (по желанию)
---РАЗДЕЛЕНИЕ---
Доплата за трансфер для гостей из Марса Алама: 50 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер для гостей из Эль-Кусейра: 35 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из залива Макади и Сахл Хашиша: 5 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из Эль-Гуны, Сафаги и Сома-Бэй: 10 евро на человека.
---РАЗДЕЛЕНИЕ---
Гид на иностранном языке (английский, русский или французский): дополнительная плата 10 евро на человека.
---ЦЭП---
🏛️ Вход в Великую пирамиду
---РАЗДЕЛЕНИЕ---
🌆 Посещение Каирской башни – осмотрите Каир с высоты
---ЦЭП---
Войдите в интерьер одного из величайших чудес человечества — опыт, который выпадает раз в жизни. 30,00 евро/чел.
---РАЗДЕЛЕНИЕ---
Насладитесь захватывающим панорамным видом на Каир и Нил со знаменитой Каирской башни. 25,00 €/чел.', 'Ein außergewöhnlicher Tag beginnt





Noch vor Sonnenaufgang startet Ihr persönliches Abenteuer. Ihr privater Fahrer holt Sie direkt an Ihrem Hotel in Hurghada ab.


Im komfortablen, klimatisierten PKW reisen Sie durch die Stille der Wüste in Richtung Kairo – bequem, sicher und individuell.


Kostenlose Getränke sorgen während der Fahrt für Erfrischung, während Sie sich auf die faszinierende Hauptstadt Ägyptens einstimmen.', 'Luxus, Kultur & Geschichte – Ihr privater Tagesausflug zu den Pyramiden von Gizeh & dem Grand Egyptian Museum.', 'Kultur & Sightseeing', '["Privater Ausflug – keine Gruppentour, kein Zeitdruck","Deutschsprachiger, erfahrener Reiseleiter","Besuch des Grand Egyptian Museum inklusive Eintritt","Besichtigung der Pyramiden & Sphinx von Gizeh","Mittagessen inklusive","Kostenlose Getränke im Fahrzeug","Individueller Service & flexible Tagesgestaltung"]'::jsonb, '["Privater Transfer im klimatisierten Fahrzeug","Deutschsprachiger Reiseleiter","Eintrittskarte für das Grand Egyptian Museum","Besuch der Pyramiden von Gizeh & Sphinx","Mittagessen in Kairo","Kostenlose Getränke während der Fahrt"]'::jsonb, '["Persönliche Ausgaben","Getränke beim Mittagessen","Eintritt ins Innere der Pyramiden (optional)","Transferzuschlag für Gäste aus Marsa Alam: 50 € pro Person","Transferzuschlag für Gäste aus El Quseir: 35 € pro Person","Transferzuschlag ab Makadi Bay & Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga & Soma Bay: 10 € pro Person","Fremdsprachiger Reiseleiter (Englisch, Russisch oder Französisch): Aufpreis 10 € pro Person"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '18h', NULL, NULL, NULL, NULL, '[{"question":"🏛️ Eintritt in die Cheops-Pyramide","answer":"Betreten Sie das Innere eines der größten Weltwunder der Menschheit – ein einmaliges Erlebnis.30.00 € /person"},{"question":"🌆 Cairo Tower Besuch – Kairo von oben erleben","answer":"Erleben Sie einen atemberaubenden Panoramablick über die Millionenmetropole Kairo und den Nil vom berühmten Cairo Tower.25.00 € /person"}]'::jsonb),
('tours', '94351900-ac6d-4c76-92e1-f9e1b1744f2f', 'ar', 'رحلة نهارية خاصة من الغردقة إلى القاهرة - الأهرامات والمتحف المصري الكبير
--- تسيب ---
الرفاهية والثقافة والتاريخ - رحلتك النهارية الخاصة إلى أهرامات الجيزة والمتحف المصري الكبير.
--- تسيب ---
الثقافة ومشاهدة المعالم السياحية
--- تسيب ---
الغردقة - البحر الأحمر - مصر
--- تسيب ---
الساعة 6 مساءً
--- تسيب ---
يبدأ يوم استثنائي





تبدأ مغامرتك الشخصية قبل شروق الشمس. سوف يقوم سائقك الخاص بنقلك مباشرة من فندقك في الغردقة.


تسافر في سيارة مريحة ومكيفة عبر صمت الصحراء باتجاه القاهرة - بشكل مريح وآمن وبشكل فردي.


مشروبات مجانية توفر لك المرطبات طوال الرحلة بينما تستمتع بمزاج عاصمة مصر الرائعة.
--- تسيب ---
رحلة خاصة - بدون جولة جماعية، بدون ضغط الوقت
---تقسيم---
مرشد سياحي ذو خبرة ويتحدث الألمانية
---تقسيم---
زيارة المتحف المصري الكبير شاملة الدخول
---تقسيم---
زيارة الأهرامات وأبو الهول بالجيزة
---تقسيم---
الغداء متضمن
---تقسيم---
مشروبات مجانية في السيارة
---تقسيم---
خدمة فردية وتخطيط يومي مرن
--- تسيب ---
نقل خاص في سيارة مكيفة
---تقسيم---
مرشد سياحي يتحدث الألمانية
---تقسيم---
تذكرة دخول المتحف المصري الكبير
---تقسيم---
زيارة أهرامات الجيزة وأبو الهول
---تقسيم---
الغداء في القاهرة
---تقسيم---
مشروبات مجانية خلال الرحلة
--- تسيب ---
النفقات الشخصية
---تقسيم---
المشروبات في الغداء
---تقسيم---
مدخل داخل الأهرامات (اختياري)
---تقسيم---
تكلفة النقل الإضافية للضيوف من مرسى علم: 50 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية للضيوف من القصير: 35 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية من خليج مكادي وسهل حشيش: 5 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية من الجونة وسفاجا وخليج سوما: 10 يورو للشخص الواحد
---تقسيم---
مرشد سياحي بلغة أجنبية (الإنجليزية أو الروسية أو الفرنسية): رسوم إضافية 10 يورو للشخص الواحد
--- تسيب ---
🏛️ مدخل الهرم الأكبر
---تقسيم---
🌆 زيارة برج القاهرة – تجربة القاهرة من الأعلى
--- تسيب ---
ادخل إلى داخل إحدى أعظم عجائب البشرية - تجربة لا تتكرر إلا مرة واحدة في العمر. 30.00 يورو للشخص الواحد
---تقسيم---
استمتع بإطلالة بانورامية خلابة على مدينة القاهرة ونهر النيل من برج القاهرة الشهير.25.00 يورو /شخص', 'Ein außergewöhnlicher Tag beginnt





Noch vor Sonnenaufgang startet Ihr persönliches Abenteuer. Ihr privater Fahrer holt Sie direkt an Ihrem Hotel in Hurghada ab.


Im komfortablen, klimatisierten PKW reisen Sie durch die Stille der Wüste in Richtung Kairo – bequem, sicher und individuell.


Kostenlose Getränke sorgen während der Fahrt für Erfrischung, während Sie sich auf die faszinierende Hauptstadt Ägyptens einstimmen.', 'Luxus, Kultur & Geschichte – Ihr privater Tagesausflug zu den Pyramiden von Gizeh & dem Grand Egyptian Museum.', 'Kultur & Sightseeing', '["Privater Ausflug – keine Gruppentour, kein Zeitdruck","Deutschsprachiger, erfahrener Reiseleiter","Besuch des Grand Egyptian Museum inklusive Eintritt","Besichtigung der Pyramiden & Sphinx von Gizeh","Mittagessen inklusive","Kostenlose Getränke im Fahrzeug","Individueller Service & flexible Tagesgestaltung"]'::jsonb, '["Privater Transfer im klimatisierten Fahrzeug","Deutschsprachiger Reiseleiter","Eintrittskarte für das Grand Egyptian Museum","Besuch der Pyramiden von Gizeh & Sphinx","Mittagessen in Kairo","Kostenlose Getränke während der Fahrt"]'::jsonb, '["Persönliche Ausgaben","Getränke beim Mittagessen","Eintritt ins Innere der Pyramiden (optional)","Transferzuschlag für Gäste aus Marsa Alam: 50 € pro Person","Transferzuschlag für Gäste aus El Quseir: 35 € pro Person","Transferzuschlag ab Makadi Bay & Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga & Soma Bay: 10 € pro Person","Fremdsprachiger Reiseleiter (Englisch, Russisch oder Französisch): Aufpreis 10 € pro Person"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '18h', NULL, NULL, NULL, NULL, '[{"question":"🏛️ Eintritt in die Cheops-Pyramide","answer":"Betreten Sie das Innere eines der größten Weltwunder der Menschheit – ein einmaliges Erlebnis.30.00 € /person"},{"question":"🌆 Cairo Tower Besuch – Kairo von oben erleben","answer":"Erleben Sie einen atemberaubenden Panoramablick über die Millionenmetropole Kairo und den Nil vom berühmten Cairo Tower.25.00 € /person"}]'::jsonb),
('tours', '94351900-ac6d-4c76-92e1-f9e1b1744f2f', 'hu', 'Egynapos privát kirándulás Hurghadából Kairóba – Piramisok és Nagy Egyiptomi Múzeum', 'Egy rendkívüli nap kezdődik





Személyes kalandja napkelte előtt kezdődik. Az Ön privát sofőrje közvetlenül elviszi a szállodájából Hurghadában.


Kényelmes, légkondicionált autóban utazik a sivatag csendjében Kairó felé - kényelmesen, biztonságosan és egyénileg.


Az ingyenes italok felfrissülést nyújtanak az utazás során, miközben megkedveljük Egyiptom lenyűgöző fővárosát.', 'Luxus, kultúra és történelem – Egynapos privát kirándulása a gízai piramisokhoz és a Nagy Egyiptomi Múzeumhoz.', 'Kultúra és városnézés', '["Egyéni kirándulás – nincs csoportos kirándulás, nincs időnyomás","Németül beszélő, tapasztalt idegenvezető","Látogatás a Nagy Egyiptomi Múzeumba belépővel","Látogassa meg a gízai piramisokat és szfinxet","Az ebéd benne van","Ingyenes italok a járműben","Egyedi kiszolgálás és rugalmas naptervezés"]'::jsonb, '["Privát transzfer légkondicionált járművel","németül beszélő idegenvezető","Belépőjegy a Nagy Egyiptomi Múzeumba","Látogassa meg a gízai piramisokat és a szfinxet","Ebéd Kairóban","Ingyenes italok az utazás alatt"]'::jsonb, '["Személyi kiadások","Italok ebédnél","Bejárat a piramisok belsejébe (opcionális)","Transzfer felár Marsa Alamból: 50 € személyenként","Transzfer felár az El Quseir városából: 35 € személyenként","Transzfer felára a Makadi Bay & Sahl Hasheesh területéről: 5 euró személyenként","Transzfer felára El Gouna, Safaga és Soma Bay területéről: 10 € személyenként","Idegen nyelvű túravezető (angol, orosz vagy francia): felár 10 € személyenként"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '18 óra', NULL, NULL, NULL, NULL, '[{"question":"🏛️ A Nagy Piramis bejárata","answer":"Lépjen be az emberiség egyik legnagyobb csodájának belsejébe – egy egyszeri élmény az életben. 30,00 €/fő"},{"question":"🌆 Látogatás a kairói toronyban – Tapasztalja meg Kairót felülről","answer":"Tapasztalja meg a lélegzetelállító panorámát Kairó metropoliszára és a Nílusra a híres kairói toronyból. 25,00 € /fő"}]'::jsonb),
('tours', '80dc4e17-ea30-4511-92be-5e8add77f139', 'fr', 'Billet d''entrée au Grand Aquarium d''Hurghada avec transfert', '<table class="tour-pricing-table"><thead><tr><th>Prix</th><th>Type de voyage</th><th>Début du voyage</th><th>Prise en charge</th></tr></thead><tbody><tr><td>À partir de 45 € par personne</td><td>Billet d''entrée avec transfert</td><td>tous les jours</td><td>env. 10h00</td></tr></tbody></table>
Découvrez le Grand Aquarium d''Hurghada, l''aquarium le plus grand et le plus moderne d''Égypte sur la mer Rouge. Un moment fort pour les familles, les couples et les amateurs d''aventure, offrant un aperçu fascinant du monde sous-marin - des poissons de récif colorés aux requins majestueux.


Plongez dans plus de 24 galeries thématiques, parcourez le tunnel sous-marin de 24 mètres de long et découvrez plus de 1 000 espèces animales du monde entier.





Pourquoi devriez-vous visiter le Grand Aquarium d''Hurghada





L''aquarium allie nature, aventure et éducation en un. C''est l''une des attractions les plus populaires d''Hurghada et idéale pour un voyage en famille.





Accessibilité et services





♿ Accessible aux personnes en fauteuil roulant et adapté aux poussettes





🐾 Chiens d''assistance autorisés sur demande





🚌 Bonnes connexions aux transports en commun





Conseils pour une visite parfaite :





🎟️ Réservez vos billets en ligne pour éviter les temps d''attente





📸 Emportez votre appareil photo – opportunités de photos inoubliables garanties





👨‍👩‍👧 Prévoyez des zones familiales





⏰ Arrivez tôt pour découvrir toutes les attractions sans stress





Sécurisez vos billets maintenant





Ne manquez pas le point culminant de la mer Rouge – une expérience inoubliable pour petits et grands !', 'Découvrez le Grand Aquarium d''Hurghada avec plus de 1 000 espèces animales, un tunnel sous-marin de 24 mètres de long et des mondes thématiques fascinants - idéal pour les familles, les couples et les enfants.', 'Culture et tourisme', '["🌊 Tunnel sous-marin de 24 mètres de long","🐠 Plus de 1 000 espèces d''animaux du monde entier","🦈 Requins, raies et poissons de récif colorés","🌴 Zone de forêt tropicale avec des animaux et des oiseaux exotiques","👨‍👩‍👧‍👦 Idéal pour les familles avec enfants","📸 De belles opportunités de photos dans l''aquarium"]'::jsonb, '["Entrée au Grand Aquarium d''Hurghada","Transfert depuis et vers l''hôtel à Hurghada","Toutes les taxes et frais de service"]'::jsonb, '["Dépenses personnelles","Nourriture et boissons","Supplément transfert depuis Makadi Bay ou Sahl Hasheesh : 5 € par personne","Supplément transfert depuis El Gouna, Safaga ou Soma Bay : 10 € par personne"]'::jsonb, 'Hurghada – Mer Rouge – Égypte', '3h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '80dc4e17-ea30-4511-92be-5e8add77f139', 'en', 'Hurghada Grand Aquarium entry ticket with transfer', '<table class="tour-pricing-table"><thead><tr><th>Price</th><th>Trip type</th><th>Start of trip</th><th>Pick-up</th></tr></thead><tbody><tr><td>From 45 € per person</td><td>Entrance ticket with transfer</td><td>daily</td><td>approx. 10:00 a.m.</td></tr></tbody></table>
Experience the Hurghada Grand Aquarium, the largest and most modern aquarium in Egypt on the Red Sea. A highlight for families, couples and adventure seekers, offering fascinating insights into the underwater world - from colorful reef fish to majestic sharks.


Immerse yourself in over 24 themed galleries, walk through the 24 meter long underwater tunnel and discover over 1,000 animal species from around the world.





Why you should visit Hurghada Grand Aquarium





The aquarium combines nature, adventure and education in one. It is one of the most popular attractions in Hurghada and ideal for a family-friendly trip.





Accessibility & Services





♿ Wheelchair accessible & stroller friendly





🐾 Assistance dogs allowed on request





🚌 Good connections to public transport





Tips for a perfect visit:





🎟️ Book tickets online to avoid waiting times





📸 Pack your camera – unforgettable photo opportunities guaranteed





👨‍👩‍👧 Plan family-friendly zones





⏰ Arrive early to experience all the attractions stress-free





Secure your tickets now





Don’t miss the highlight of the Red Sea – an unforgettable experience for young and old!', 'Discover the Hurghada Grand Aquarium with over 1,000 animal species, a 24 meter long underwater tunnel and fascinating themed worlds - ideal for families, couples and children.', 'Culture & sightseeing', '["🌊 24 meter long underwater tunnel","🐠 Over 1,000 species of animals from all over the world","🦈 Sharks, rays and colorful reef fish","🌴 Rainforest zone with exotic animals and birds","👨‍👩‍👧‍👦 Ideal for families with children","📸 Beautiful photo opportunities in the aquarium"]'::jsonb, '["Entrance to Hurghada Grand Aquarium","Transfer from and to the hotel in Hurghada","All taxes and service fees"]'::jsonb, '["Personal expenses","Food and drinks","Transfer surcharge from Makadi Bay or Sahl Hasheesh: €5 per person","Transfer surcharge from El Gouna, Safaga or Soma Bay: €10 per person"]'::jsonb, 'Hurghada–Red Sea–Egypt', '3h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '80dc4e17-ea30-4511-92be-5e8add77f139', 'ru', 'Входной билет в Гранд Аквариум Хургады с трансфером
---ЦЭП---
Откройте для себя Большой аквариум Хургады с более чем 1000 видами животных, подводным туннелем длиной 24 метра и увлекательными тематическими мирами, идеально подходящими для семей, пар и детей.
---ЦЭП---
Культура и достопримечательности
---ЦЭП---
Хургада – Красное море – Египет
---ЦЭП---
3 часа
---ЦЭП---
<table class="tour-pricing-table"><thead><tr><th>Цена</th><th>Тип поездки</th><th>Начало поездки</th><th>Самовывоз</th></tr></thead><tbody><tr><td>От 45 евро на человека</td><td>Входной билет с пересадкой</td><td>ежедневно</td><td>ок. 10:00</td></tr></tbody></table>
Посетите Большой аквариум Хургады, самый большой и современный аквариум в Египте на Красном море. Изюминка для семей, пар и искателей приключений, предлагающая захватывающее представление о подводном мире - от красочных рифовых рыб до величественных акул.


Погрузитесь в более чем 24 тематические галереи, пройдите по подводному туннелю длиной 24 метра и откройте для себя более 1000 видов животных со всего мира.





Почему вам стоит посетить Большой Аквариум Хургады





Аквариум сочетает в себе природу, приключения и образование. Это одна из самых популярных достопримечательностей Хургады, идеально подходящая для семейной поездки.





Доступность и услуги





♿ Подходит для гостей на инвалидных колясках и с колясками.





🐾 По запросу допускается размещение с собаками-поводырями.





🚌 Хорошее транспортное сообщение.





Советы для идеального визита:





🎟️ Бронируйте билеты онлайн, чтобы избежать ожидания





📸 Возьмите с собой фотоаппарат — незабываемые фотографии гарантированы





👨‍👩‍👧 Планируйте зоны для семейного отдыха





⏰ Приходите пораньше, чтобы без стресса осмотреть все достопримечательности.





Защитите свои билеты сейчас





Не пропустите самое интересное на Красном море – незабываемые впечатления для детей и взрослых!
---ЦЭП---
🌊 Подводный туннель длиной 24 метра
---РАЗДЕЛЕНИЕ---
🐠 Более 1000 видов животных со всего мира
---РАЗДЕЛЕНИЕ---
🦈 Акулы, скаты и разноцветные рифовые рыбы
---РАЗДЕЛЕНИЕ---
🌴 Зона тропического леса с экзотическими животными и птицами
---РАЗДЕЛЕНИЕ---
👨‍👩‍👧‍👦 Идеально подходит для семей с детьми
---РАЗДЕЛЕНИЕ---
📸 Красивые возможности для фото в аквариуме
---ЦЭП---
Вход в Большой аквариум Хургады.
---РАЗДЕЛЕНИЕ---
Трансфер из и в отель в Хургаде.
---РАЗДЕЛЕНИЕ---
Все налоги и сборы за обслуживание
---ЦЭП---
Личные расходы
---РАЗДЕЛЕНИЕ---
Еда и напитки
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из Макади Бэй или Сахл Хашиш: 5 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из Эль-Гуны, Сафаги или Сома-Бей: 10 евро на человека.', '<table class="tour-pricing-table"><thead><tr><th>Preis</th><th>Reisetyp</th><th>Reiseantritt</th><th>Abholung</th></tr></thead><tbody><tr><td>Ab 45 € p.P.</td><td>Eintrittskarte mit Transfer</td><td>täglich</td><td>ca. 10:00 Uhr</td></tr></tbody></table>
Erleben Sie das Hurghada Grand Aquarium, das größte und modernste Aquarium Ägyptens am Roten Meer. Ein Highlight für Familien, Paare und Abenteuerlustige, das faszinierende Einblicke in die Unterwasserwelt bietet – von farbenprächtigen Rifffischen bis zu majestätischen Haien.


Tauchen Sie ein in über 24 thematische Galerien, spazieren Sie durch den 24 Meter langen Unterwassertunnel und entdecken Sie über 1.000 Tierarten aus aller Welt.





Warum Sie das Hurghada Grand Aquarium besuchen sollten





Das Aquarium vereint Natur, Abenteuer und Bildung in einem. Es ist eine der beliebtesten Attraktionen in Hurghada und ideal für einen familienfreundlichen Ausflug.





Barrierefreiheit & Services





♿ Rollstuhlgerecht & kinderwagenfreundlich





🐾 Assistenzhunde auf Anfrage erlaubt





🚌 Gute Anbindung an öffentliche Verkehrsmittel





Tipps für einen perfekten Besuch:





🎟️ Tickets online buchen, um Wartezeiten zu vermeiden





📸 Kamera einpacken – unvergessliche Fotomotive garantiert





👨‍👩‍👧 Familienfreundliche Zonen einplanen





⏰ Früh kommen, um alle Attraktionen stressfrei zu erleben





Jetzt Tickets sichern





Verpassen Sie nicht das Highlight am Roten Meer – ein unvergessliches Erlebnis für Groß und Klein!', 'Entdecken Sie das Hurghada Grand Aquarium mit über 1.000 Tierarten, einem 24 Meter langen Unterwassertunnel und faszinierenden Themenwelten – ideal für Familien, Paare und Kinder.', 'Kultur & Sightseeing', '["🌊 24 Meter langer Unterwassertunnel","🐠 Über 1.000 Tierarten aus aller Welt","🦈 Haie, Rochen und farbenprächtige Rifffische","🌴 Regenwaldzone mit exotischen Tieren und Vögeln","👨‍👩‍👧‍👦 Ideal für Familien mit Kindern","📸 Schöne Fotomotive im Aquarium"]'::jsonb, '["Eintritt zum Hurghada Grand Aquarium","Transfer vom und zum Hotel in Hurghada","Alle Steuern und Servicegebühren"]'::jsonb, '["Persönliche Ausgaben","Speisen und Getränke","Transferzuschlag ab Makadi Bay oder Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga oder Soma Bay: 10 € pro Person"]'::jsonb, 'Hurghada–Rotes Meer–Ägypten', '3h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '80dc4e17-ea30-4511-92be-5e8add77f139', 'ar', '- تذكرة دخول الغردقة جراند أكواريوم مع الانتقالات
--- تسيب ---
اكتشف جراند أكواريوم الغردقة الذي يضم أكثر من 1000 نوع من الحيوانات، ونفق تحت الماء بطول 24 مترًا وعوالم رائعة تحت الماء - مثالية للعائلات والأزواج والأطفال.
--- تسيب ---
الثقافة ومشاهدة المعالم السياحية
--- تسيب ---
الغردقة – البحر الأحمر – مصر
--- تسيب ---
3 ساعات
--- تسيب ---
<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>بداية الرحلة</th><th>النقل</th></tr></thead><tbody><tr><td>من 45 يورو للشخص الواحد</td><td>تذكرة الدخول مع النقل</td><td>يوميًا</td><td>تقريبًا. 10:00 صباحًا</td></tr></tbody></table>
اكتشف جراند أكواريوم الغردقة، أكبر وأحدث أكواريوم في مصر على البحر الأحمر. مكان مميز للعائلات والأزواج والباحثين عن المغامرة، حيث يقدم رؤى رائعة للعالم تحت الماء - من أسماك الشعاب المرجانية الملونة إلى أسماك القرش المهيبة.


انغمس في أكثر من 24 معرضًا فنيًا، وقم بالمشي عبر النفق تحت الماء الذي يبلغ طوله 24 مترًا واكتشف أكثر من 1000 نوع من الحيوانات من جميع أنحاء العالم.





لماذا يجب عليك زيارة الغردقة جراند أكواريوم؟





يجمع الأكواريوم بين الطبيعة والمغامرة والتعليم في آن واحد. إنها واحدة من مناطق الجذب الأكثر شعبية في الغردقة ومثالية لرحلة عائلية.





إمكانية الوصول والخدمات





♿ يمكن الوصول إليه بواسطة الكراسي المتحركة ومناسب لعربة الأطفال





🐾 مسموح بمساعدة الكلاب عند الطلب





🚌 اتصالات جيدة بوسائل النقل العام





نصائح لزيارة مثالية:





🎟️ حجز التذاكر عبر الإنترنت لتجنب أوقات الانتظار





📸 احزم كاميرتك - نضمن لك فرصًا لالتقاط الصور لا تُنسى





👨‍👩‍👧 خطط لمناطق مناسبة للعائلة





⏰ الوصول مبكرًا لتجربة جميع المعالم السياحية دون أي ضغوط





تأمين التذاكر الخاصة بك الآن





لا تفوّت مشاهدة البحر الأحمر - تجربة لا تُنسى للصغار والكبار!
--- تسيب ---
🌊 نفق تحت الماء بطول 24 مترًا
---تقسيم---
🐠 أكثر من 1000 نوع من الحيوانات من جميع أنحاء العالم
---تقسيم---
🦈 أسماك القرش والشفنينيات وأسماك الشعاب المرجانية الملونة
---تقسيم---
🌴 منطقة غابات مطيرة بها حيوانات وطيور غريبة
---تقسيم---
👨‍👩‍👧‍👦 مثالية للعائلات التي لديها أطفال
---تقسيم---
📸 فرص التقاط الصور الجميلة في الأكواريوم
--- تسيب ---
مدخل الغردقة جراند أكواريوم
---تقسيم---
الإنتقالات من و إلى الفندق بالغردقة
---تقسيم---
جميع الضرائب ورسوم الخدمة
--- تسيب ---
النفقات الشخصية
---تقسيم---
المأكولات والمشروبات
---تقسيم---
تكلفة النقل الإضافية من خليج مكادي أو سهل حشيش: 5 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية من الجونة أو سفاجا أو خليج سوما: 10 يورو للشخص الواحد', '<table class="tour-pricing-table"><thead><tr><th>Preis</th><th>Reisetyp</th><th>Reiseantritt</th><th>Abholung</th></tr></thead><tbody><tr><td>Ab 45 € p.P.</td><td>Eintrittskarte mit Transfer</td><td>täglich</td><td>ca. 10:00 Uhr</td></tr></tbody></table>
Erleben Sie das Hurghada Grand Aquarium, das größte und modernste Aquarium Ägyptens am Roten Meer. Ein Highlight für Familien, Paare und Abenteuerlustige, das faszinierende Einblicke in die Unterwasserwelt bietet – von farbenprächtigen Rifffischen bis zu majestätischen Haien.


Tauchen Sie ein in über 24 thematische Galerien, spazieren Sie durch den 24 Meter langen Unterwassertunnel und entdecken Sie über 1.000 Tierarten aus aller Welt.





Warum Sie das Hurghada Grand Aquarium besuchen sollten





Das Aquarium vereint Natur, Abenteuer und Bildung in einem. Es ist eine der beliebtesten Attraktionen in Hurghada und ideal für einen familienfreundlichen Ausflug.





Barrierefreiheit & Services





♿ Rollstuhlgerecht & kinderwagenfreundlich





🐾 Assistenzhunde auf Anfrage erlaubt





🚌 Gute Anbindung an öffentliche Verkehrsmittel





Tipps für einen perfekten Besuch:





🎟️ Tickets online buchen, um Wartezeiten zu vermeiden





📸 Kamera einpacken – unvergessliche Fotomotive garantiert





👨‍👩‍👧 Familienfreundliche Zonen einplanen





⏰ Früh kommen, um alle Attraktionen stressfrei zu erleben





Jetzt Tickets sichern





Verpassen Sie nicht das Highlight am Roten Meer – ein unvergessliches Erlebnis für Groß und Klein!', 'Entdecken Sie das Hurghada Grand Aquarium mit über 1.000 Tierarten, einem 24 Meter langen Unterwassertunnel und faszinierenden Themenwelten – ideal für Familien, Paare und Kinder.', 'Kultur & Sightseeing', '["🌊 24 Meter langer Unterwassertunnel","🐠 Über 1.000 Tierarten aus aller Welt","🦈 Haie, Rochen und farbenprächtige Rifffische","🌴 Regenwaldzone mit exotischen Tieren und Vögeln","👨‍👩‍👧‍👦 Ideal für Familien mit Kindern","📸 Schöne Fotomotive im Aquarium"]'::jsonb, '["Eintritt zum Hurghada Grand Aquarium","Transfer vom und zum Hotel in Hurghada","Alle Steuern und Servicegebühren"]'::jsonb, '["Persönliche Ausgaben","Speisen und Getränke","Transferzuschlag ab Makadi Bay oder Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga oder Soma Bay: 10 € pro Person"]'::jsonb, 'Hurghada–Rotes Meer–Ägypten', '3h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '80dc4e17-ea30-4511-92be-5e8add77f139', 'hu', 'Hurghada Grand Aquarium belépőjegy átszállással', '<table class="tour-pricing-table"><thead><tr><th>Ár</th><th>Utazás típusa</th><th>Utazás kezdete</th><th>Felvétel</th></tr></thead><tbody><tr><td>45 €-tól személyenként</td><td>Belépőjegy transzferrel</td><tdxdily>><approxda. 10:00</td></tr></tbody></table>
Tapasztalja meg a Hurghada Grand Aquariumot, Egyiptom legnagyobb és legmodernebb akváriumát a Vörös-tengeren. Családok, párok és kalandvágyók számára készült csúcspont, amely lenyűgöző betekintést nyújt a víz alatti világba – a színes zátonyhalaktól a fenséges cápákig.


Merüljön el több mint 24 tematikus galériában, sétáljon át a 24 méter hosszú víz alatti alagúton, és fedezzen fel több mint 1000 állatfajt a világ minden tájáról.





Miért érdemes ellátogatni a Hurghada Grand Aquariumba?





Az akvárium egyben ötvözi a természetet, a kalandot és az oktatást. Hurghada egyik legnépszerűbb látnivalója, és ideális egy családbarát kiránduláshoz.





Kisegítő lehetőségek és szolgáltatások





♿ Kerekesszékkel megközelíthető és babakocsibarát





🐾 Segítő kutyák kérésre bevihetők





🚌 Jó tömegközlekedési kapcsolat





Tippek a tökéletes látogatáshoz:





🎟️ Foglaljon jegyet online, hogy elkerülje a várakozási időt





📸 Csomagolja be fényképezőgépét – garantált a felejthetetlen fotózási lehetőségek





👨‍👩‍👧 Tervezzen családbarát zónákat





⏰ Érkezz korán, hogy stresszmentesen éld át az összes látnivalót





Biztosítsa jegyeit most





Ne hagyja ki a Vörös-tenger csúcspontját – felejthetetlen élmény kicsiknek és nagyoknak!', 'Fedezze fel a Hurghada Grand Aquariumot több mint 1000 állatfajjal, egy 24 méter hosszú víz alatti alagúttal és lenyűgöző tematikus világokkal – ideális családok, párok és gyerekek számára.', 'Kultúra és városnézés', '["🌊 24 méter hosszú víz alatti alagút","🐠 Több mint 1000 állatfaj a világ minden tájáról","🦈 Cápák, ráják és színes zátonyhalak","🌴 Esőerdő zóna egzotikus állatokkal és madarakkal","👨‍👩‍👧‍👦 Ideális gyermekes családok számára","📸 Gyönyörű fotózási lehetőségek az akváriumban"]'::jsonb, '["Bejárat a Hurghada Grand Aquariumba","Transzfer Hurghada szállodájába és vissza","Minden adó és szolgáltatási díj"]'::jsonb, '["Személyi kiadások","Ételek és italok","Transzfer felára a Makadi-öbölből vagy a Sahl Hasheesh-ből: 5 euró személyenként","Transzfer felára El Gouna, Safaga vagy Soma Bay területéről: 10 € személyenként"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '3 óra', NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'a74479e6-f15f-4053-85f5-d910217cd4e5', 'fr', 'Baie de Makadi', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'a74479e6-f15f-4053-85f5-d910217cd4e5', 'en', 'Makadi Bay', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'a74479e6-f15f-4053-85f5-d910217cd4e5', 'ru', 'Макади Бэй', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'a74479e6-f15f-4053-85f5-d910217cd4e5', 'ar', 'خليج مكادي', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'a74479e6-f15f-4053-85f5-d910217cd4e5', 'hu', 'Makadi-öböl', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb);

-- Batch 3 (rows 101-150)
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs) VALUES
('destinations', 'a2b18fe9-0bd0-42a1-90d2-32151f220c3c', 'fr', 'Hurghada', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'a2b18fe9-0bd0-42a1-90d2-32151f220c3c', 'en', 'Hurghada', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'a2b18fe9-0bd0-42a1-90d2-32151f220c3c', 'ru', 'Хургада', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'a2b18fe9-0bd0-42a1-90d2-32151f220c3c', 'ar', 'الغردقة', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'a2b18fe9-0bd0-42a1-90d2-32151f220c3c', 'hu', 'Hurghada', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '65f786e7-75c3-457b-a66a-e9f91f2c950e', 'fr', 'Excursion d’une journée au Caire avec vol au départ d’Hurghada – Grand Musée égyptien et pyramides', '<table class="tour-pricing-table"><thead><tr><th>Participants</th><th>Vol & transfert</th><th>Prix par personne</th></tr></thead><tbody><tr><td>2 personnes</td><td>Vol + transfert privé</td><td>300 € par personne</td></tr><tr><td>3 – 4 personnes</td><td>Vol + privé transfert</td><td>280 € p.P.</td></tr><tr><td>5 - 6 personnes</td><td>Vol + transfert privé</td><td>270 € p.P.</td></tr><tr><td>7 - 8 personnes</td><td>Vol + transfert privé</td><td>255 € p.P.</td></tr></tbody></table>
Découvrez les pyramides de Gizeh, le majestueux Sphinx et les trésors du musée égyptien, le tout en une seule journée depuis Hurghada.


Avec le planificateur de voyage Hurghada, vous pouvez voyager confortablement, en toute sécurité et individuellement. Attendez-vous à un égyptologue germanophone, à un accompagnement personnalisé et à un service VIP exclusif.





💎 Idéal pour les couples, les familles et les petits groupes qui souhaitent découvrir le meilleur du Caire - sans les longs trajets en bus.', 'Découvrez les pyramides de Gizeh, le Sphinx et le Grand Musée égyptien lors d''une excursion d''une journée confortable avec des vols au départ d''Hurghada. Découvrez le meilleur du Caire - organisé rapidement, confortablement et professionnellement. Du conseil de réservation personnalisé au retour à l''hôtel, nous nous en occupons', 'Culture et tourisme', '["Pyramides de Gizeh et Sphinx – Site du patrimoine mondial de l''UNESCO et seule merveille du monde antique","Grand Musée égyptien","Déjeuner sur le Nil – spécialités locales","Vol direct Hurghada – Le Caire – Hurghada","Égyptologue germanophone – visite personnelle tout au long de la journée"]'::jsonb, '["Vol retour Hurghada ↔ Le Caire","Transferts en véhicules climatisés","Tarifs d''entrée selon le programme","Déjeuner","Égyptologue germanophone","Accompagnement et organisation par le planificateur de voyage Hurghada"]'::jsonb, '["Boissons au restaurant","Dépenses personnelles","Supplément transfert depuis Marsa Alam : 50 € par personne","Supplément transfert depuis El Quseir : 35 € par personne","Supplément de transfert depuis la baie de Makadi et Sahl Hasheesh : 5 € par personne","Supplément de transfert depuis El Gouna, Safaga et Soma Bay : 10 € par personne","Guide touristique en langue étrangère (anglais, russe ou français) : supplément 10 € par personne"]'::jsonb, 'Hurghada - Mer Rouge - Egypte', '15h', NULL, NULL, NULL, NULL, '[{"question":"🏛️ Entrée de la Grande Pyramide","answer":"Entrez à l''intérieur de l''une des plus grandes merveilles de l''humanité : une expérience unique. 30,00 € /personne"},{"question":"🌆 Visite de la tour du Caire – Découvrez le Caire d''en haut","answer":"Découvrez une vue panoramique à couper le souffle sur la métropole du Caire et le Nil depuis la célèbre tour du Caire.25,00 € /personne"}]'::jsonb),
('tours', '65f786e7-75c3-457b-a66a-e9f91f2c950e', 'en', 'Cairo day trip with flight from Hurghada – Grand Egyptian Museum & Pyramids', '<table class="tour-pricing-table"><thead><tr><th>Participants</th><th>Flight & transfer</th><th>Price per person</th></tr></thead><tbody><tr><td>2 people</td><td>Flight + private transfer</td><td>300 € per person</td></tr><tr><td>3 – 4 people</td><td>Flight + private transfer</td><td>280 € p.P.</td></tr><tr><td>5 - 6 people</td><td>Flight + private transfer</td><td>270 € p.P.</td></tr><tr><td>7 - 8 people</td><td>Flight + private transfer</td><td>255 € p.P.</td></tr></tbody></table>
Experience the Pyramids of Giza, the majestic Sphinx and the treasures of the Egyptian Museum - all in just one day from Hurghada.


With Hurghada travel planner you can travel comfortably, safely and individually. Look forward to a German-speaking Egyptologist, personal support and exclusive VIP service.





💎 Ideal for couples, families and small groups who want to experience the best of Cairo - without the long bus journeys.', 'Discover the Giza Pyramids, the Sphinx, and the Grand Egyptian Museum on a comfortable day trip with flights from Hurghada. Experience the best of Cairo – quickly, comfortably and professionally organized. From personal booking advice to returning to the hotel - we''ll take care of it', 'Culture & sightseeing', '["Pyramids of Giza & Sphinx – UNESCO World Heritage Site & the only wonder of the ancient world","Grand Egyptian Museum","Lunch on the Nile – local specialties","Direct flight Hurghada – Cairo – Hurghada","German-speaking Egyptologist – personal tour throughout the day"]'::jsonb, '["Return flight Hurghada ↔ Cairo","Transfers in air-conditioned vehicles","Entrance fees according to the program","Lunch","German-speaking Egyptologist","Support & organization by Hurghada travel planner"]'::jsonb, '["Drinks in the restaurant","Personal expenses","Transfer surcharge from Marsa Alam: €50 per person","Transfer surcharge from El Quseir: €35 per person","Transfer surcharge from Makadi Bay & Sahl Hasheesh: €5 per person","Transfer surcharge from El Gouna, Safaga & Soma Bay: €10 per person","Foreign language tour guide (English, Russian or French): additional charge €10 per person"]'::jsonb, 'Hurghada - Red Sea - Egypt', '3 p.m', NULL, NULL, NULL, NULL, '[{"question":"🏛️ Entrance to the Great Pyramid","answer":"Enter the interior of one of humanity''s greatest wonders - a once-in-a-lifetime experience. €30.00 /person"},{"question":"🌆 Cairo Tower Visit – Experience Cairo from above","answer":"Experience a breathtaking panoramic view over the metropolis of Cairo and the Nile from the famous Cairo Tower.25.00 € /person"}]'::jsonb),
('tours', '65f786e7-75c3-457b-a66a-e9f91f2c950e', 'ru', 'Однодневная поездка в Каир с перелетом из Хургады – Большой египетский музей и пирамиды
---ЦЭП---
Откройте для себя пирамиды Гизы, Сфинкса и Большой Египетский музей в комфортабельной однодневной поездке с рейсами из Хургады. Откройте для себя лучшее, что есть в Каире – быстро, комфортно и профессионально организовано. От личной консультации по бронированию до возвращения в отель – мы позаботимся об этом.
---ЦЭП---
Культура и достопримечательности
---ЦЭП---
Хургада - Красное море - Египет
---ЦЭП---
15:00
---ЦЭП---
<table class="tour-pricing-table"><thead><tr><th>Участники</th><th>Перелет и трансфер</th><th>Цена на человека</th></tr></thead><tbody><tr><td>2 человека</td><td>Перелет + индивидуальный трансфер</td><td>300 € на человека</td></tr><tr><td>3 – 4 человека</td><td>Перелет + индивидуальный трансфер трансфер</td><td>280 € на человека</td></tr><tr><td>5 – 6 человек</td><td>Перелет + индивидуальный трансфер</td><td>270 € на человека</td></tr><tr><td>7 – 8 человек</td><td>Перелет + частный трансфер</td><td>255 € на человека</td></tr></tbody></table>
Посетите пирамиды Гизы, величественного Сфинкса и сокровища Египетского музея — и все это всего за один день из Хургады.


С планировщиком путешествий по Хургаде вы можете путешествовать комфортно, безопасно и индивидуально. Вас ждет немецкоязычный египтолог, личная поддержка и эксклюзивное VIP-обслуживание.





💎 Идеально подходит для пар, семей и небольших групп, которые хотят увидеть все лучшее, что есть в Каире, без долгих поездок на автобусе.
---ЦЭП---
Пирамиды Гизы и Сфинкс – объект Всемирного наследия ЮНЕСКО и единственное чудо древнего мира
---РАЗДЕЛЕНИЕ---
Большой египетский музей
---РАЗДЕЛЕНИЕ---
Обед на Ниле – местные деликатесы
---РАЗДЕЛЕНИЕ---
Прямой рейс Хургада – Каир – Хургада.
---РАЗДЕЛЕНИЕ---
Немецкоязычный египтолог – персональная экскурсия в течение дня
---ЦЭП---
Обратный рейс Хургада ↔ Каир
---РАЗДЕЛЕНИЕ---
Трансферы на автомобилях с кондиционером
---РАЗДЕЛЕНИЕ---
Входные билеты согласно программе
---РАЗДЕЛЕНИЕ---
Обед
---РАЗДЕЛЕНИЕ---
Немецкоязычный египтолог
---РАЗДЕЛЕНИЕ---
Поддержка и организация со стороны туроператора по Хургаде.
---ЦЭП---
Напитки в ресторане
---РАЗДЕЛЕНИЕ---
Личные расходы
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из Марса Алама: 50 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из Эль-Кусейра: 35 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из залива Макади и Сахл Хашиша: 5 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из Эль-Гуны, Сафаги и Сома-Бэй: 10 евро на человека.
---РАЗДЕЛЕНИЕ---
Гид на иностранном языке (английский, русский или французский): дополнительная плата 10 евро на человека.
---ЦЭП---
🏛️ Вход в Великую пирамиду
---РАЗДЕЛЕНИЕ---
🌆 Посещение Каирской башни – осмотрите Каир с высоты
---ЦЭП---
Войдите в интерьер одного из величайших чудес человечества — опыт, который выпадает раз в жизни. 30,00 евро/чел.
---РАЗДЕЛЕНИЕ---
Насладитесь захватывающим панорамным видом на Каир и Нил со знаменитой Каирской башни. 25,00 €/чел.', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Flug & Transfer</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Flug + Privattransfer</td><td>300 € p.P.</td></tr><tr><td>3 – 4 Personen</td><td>Flug + Privattransfer</td><td>280 € p.P.</td></tr><tr><td>5 – 6 Personen</td><td>Flug + Privattransfer</td><td>270 € p.P.</td></tr><tr><td>7 – 8 Personen</td><td>Flug + Privattransfer</td><td>255 € p.P.</td></tr></tbody></table>
Erleben Sie die Pyramiden von Gizeh, die majestätische Sphinx und die Schätze des Ägyptischen Museums – alles an nur einem Tag von Hurghada aus.


Mit Hurghada Reiseplaner reisen Sie komfortabel, sicher und individuell. Freuen Sie sich auf einen deutschsprachigen Ägyptologen, persönliche Betreuung und einen exklusiven VIP-Service.





💎 Ideal für Paare, Familien und kleine Gruppen, die das Beste von Kairo erleben wollen – ohne lange Busfahrten.', 'Entdecken Sie die Pyramiden von Gizeh, die Sphinx und das Grand Egyptian Museum bei einem komfortablen Tagesausflug mit Flug ab Hurghada. Erleben Sie das Beste von Kairo – schnell, komfortabel und professionell organisiert. Von der persönlichen Buchungsberatung bis zur Rückkehr ins Hotel – wir kümme', 'Kultur & Sightseeing', '["Pyramiden von Gizeh & Sphinx – UNESCO Weltkulturerbe & einziges Weltwunder der Antike","Grand Egyptian Museum","Mittagessen am Nil – lokale Spezialitäten","Direktflug Hurghada – Kairo – Hurghada","Deutschsprachiger Ägyptologe – persönliche Führung den ganzen Tag"]'::jsonb, '["Hin- & Rückflug Hurghada ↔ Kairo","Transfers in klimatisierten Fahrzeugen","Eintrittsgelder laut Programm","Mittagessen","Deutschsprachiger Ägyptologe","Betreuung & Organisation durch Hurghada Reiseplaner"]'::jsonb, '["Getränke im Restaurant","Persönliche Ausgaben","Transferzuschlag ab Marsa Alam: 50 € pro Person","Transferzuschlag ab El Quseir: 35 € pro Person","Transferzuschlag ab Makadi Bay & Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga & Soma Bay: 10 € pro Person","Fremdsprachiger Reiseleiter (Englisch, Russisch oder Französisch): Aufpreis 10 € pro Person"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '15h', NULL, NULL, NULL, NULL, '[{"question":"🏛️ Eintritt in die Cheops-Pyramide","answer":"Betreten Sie das Innere eines der größten Weltwunder der Menschheit – ein einmaliges Erlebnis.30.00 € /person"},{"question":"🌆 Cairo Tower Besuch – Kairo von oben erleben","answer":"Erleben Sie einen atemberaubenden Panoramablick über die Millionenmetropole Kairo und den Nil vom berühmten Cairo Tower.25.00 € /person"}]'::jsonb),
('tours', '65f786e7-75c3-457b-a66a-e9f91f2c950e', 'hu', 'Egynapos kairói kirándulás Hurghadából – Nagy Egyiptomi Múzeum és piramisok', '<table class="tour-pricing-table"><thead><tr><th>Részvevők</th><th>Repülés és transzfer</th><th>Ár személyenként</th></tr></thead><tbody><tr><td>2 fő</td><td>Repülőút + privát transzfer</td><td>300 € személyenként</td></tr><df/fő –><4td> transzfer</td><td>280 € személyenként</td></tr><tr><td>5-6 fő</td><td>Repülés + privát transzfer</td><td>270 € személyenként.</td></tr><tr><td>7-8 fő</td><td>Repülés + privát transzfer</td><td>P.5/td>P.5/td>P.
Tapasztalja meg a gízai piramisokat, a fenséges Szfinxet és az Egyiptomi Múzeum kincseit – mindezt mindössze egy nap alatt Hurghadából.


A Hurghada utazástervezővel kényelmesen, biztonságosan és egyénileg utazhat. Németül beszélő egyiptológust, személyes támogatást és exkluzív VIP szolgáltatást várunk.





💎 Ideális párok, családok és kis csoportok számára, akik szeretnék megtapasztalni Kairó legjavát – hosszú buszos utazások nélkül.', 'Fedezze fel a gízai piramisokat, a Szfinxet és a Nagy Egyiptomi Múzeumot egy kényelmes egynapos kiránduláson Hurghadából induló repülőjáratokkal. Tapasztalja meg Kairó legjavát – gyorsan, kényelmesen és professzionálisan szervezetten. A személyes foglalási tanácsadástól a szállodába való visszatérésig – mi gondoskodunk róla', 'Kultúra és városnézés', '["Gízai piramisok és szfinx – az UNESCO Világörökség része és az ókori világ egyetlen csodája","Nagy Egyiptomi Múzeum","Ebéd a Níluson – helyi specialitások","Közvetlen járat Hurghada – Kairó – Hurghada","Németül beszélő egyiptológus – személyes túra egész nap"]'::jsonb, '["Retúr járat Hurghada ↔ Kairó","Transzferek légkondicionált járműveken","Belépődíjak a program szerint","Ebéd","németül beszélő egyiptológus","Támogatás és szervezés a Hurghada utazástervező által"]'::jsonb, '["Italok az étteremben","Személyi kiadások","Transzfer felára Marsa Alamból: 50 € személyenként","Transzfer felár El Quseir városából: 35 € személyenként","Transzfer felára a Makadi Bay & Sahl Hasheesh területéről: 5 euró személyenként","Transzfer felára El Gouna, Safaga és Soma Bay területéről: 10 € személyenként","Idegen nyelvű túravezető (angol, orosz vagy francia): felár 10 € személyenként"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '15:00', NULL, NULL, NULL, NULL, '[{"question":"🏛️ A Nagy Piramis bejárata","answer":"Lépjen be az emberiség egyik legnagyobb csodájának belsejébe – egy egyszeri élmény az életben. 30,00 €/fő"},{"question":"🌆 Látogatás a kairói toronyban – Tapasztalja meg Kairót felülről","answer":"Tapasztalja meg a lélegzetelállító panorámát Kairó metropoliszára és a Nílusra a híres kairói toronyból. 25,00 € /fő"}]'::jsonb),
('tours', '65f786e7-75c3-457b-a66a-e9f91f2c950e', 'ar', 'رحلة نهارية إلى القاهرة مع رحلة من الغردقة - المتحف المصري الكبير والأهرامات
--- تسيب ---
اكتشف أهرامات الجيزة وأبو الهول والمتحف المصري الكبير في رحلة نهارية مريحة مع رحلات جوية من الغردقة. اكتشف أفضل ما في القاهرة - بسرعة وبشكل مريح ومنظم بشكل احترافي. بدءًا من نصائح الحجز الشخصية وحتى العودة إلى الفندق - سنهتم بها
--- تسيب ---
الثقافة ومشاهدة المعالم السياحية
--- تسيب ---
الغردقة - البحر الأحمر - مصر
--- تسيب ---
3 مساءا
--- تسيب ---
<table class="tour-pricing-table"><thead><tr><th>المشاركين</th><th>الرحلة والنقل</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخصين</td><td>رحلة الطيران + النقل الخاص</td><td>300 يورو للشخص الواحد</td></tr><tr><td>3 - 4 أشخاص</td><td>رحلة الطيران + النقل الخاص النقل</td><td>280 يورو للشخص الواحد.</td></tr><tr><td>5 - 6 أشخاص</td><td>الرحلة + النقل الخاص</td><td>270 يورو للشخص الواحد.</td></tr><tr><td>7 - 8 أشخاص</td><td>الرحلة + النقل الخاص</td><td>255 يورو للشخص الواحد.</td></tr></tbody></table>
اكتشف أهرامات الجيزة وأبو الهول المهيب وكنوز المتحف المصري - كل ذلك في يوم واحد فقط من الغردقة.


مع مخطط رحلات الغردقة، يمكنك السفر بشكل مريح وآمن وبشكل فردي. نتطلع إلى عالم مصريات يتحدث الألمانية، ودعم شخصي وخدمة VIP حصرية.





💎 مثالية للأزواج والعائلات والمجموعات الصغيرة الذين يرغبون في تجربة أفضل ما في القاهرة - بدون رحلات الحافلة الطويلة.
--- تسيب ---
أهرامات الجيزة وأبو الهول - موقع التراث العالمي لليونسكو والأعجوبة الوحيدة في العالم القديم
---تقسيم---
المتحف المصري الكبير
---تقسيم---
الغداء على النيل – التخصصات المحلية
---تقسيم---
طيران مباشر الغردقة – القاهرة – الغردقة
---تقسيم---
عالم المصريات الناطق بالألمانية – جولة شخصية طوال اليوم
--- تسيب ---
رحلة العودة الغردقة ↔ القاهرة
---تقسيم---
الإنتقالات بسيارات مكيفة
---تقسيم---
رسوم الدخول حسب البرنامج
---تقسيم---
الغداء
---تقسيم---
عالم المصريات الناطق بالألمانية
---تقسيم---
الدعم والتنظيم من قبل مخطط رحلات الغردقة
--- تسيب ---
المشروبات في المطعم
---تقسيم---
النفقات الشخصية
---تقسيم---
تكلفة النقل الإضافية من مرسى علم: 50 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية من القصير: 35 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية من خليج مكادي وسهل حشيش: 5 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية من الجونة وسفاجا وخليج سوما: 10 يورو للشخص الواحد
---تقسيم---
مرشد سياحي بلغة أجنبية (الإنجليزية أو الروسية أو الفرنسية): رسوم إضافية 10 يورو للشخص الواحد
--- تسيب ---
🏛️ مدخل الهرم الأكبر
---تقسيم---
🌆 زيارة برج القاهرة – تجربة القاهرة من الأعلى
--- تسيب ---
ادخل إلى داخل إحدى أعظم عجائب البشرية - تجربة لا تتكرر إلا مرة واحدة في العمر. 30.00 يورو للشخص الواحد
---تقسيم---
استمتع بإطلالة بانورامية خلابة على مدينة القاهرة ونهر النيل من برج القاهرة الشهير.25.00 يورو /شخص', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Flug & Transfer</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Flug + Privattransfer</td><td>300 € p.P.</td></tr><tr><td>3 – 4 Personen</td><td>Flug + Privattransfer</td><td>280 € p.P.</td></tr><tr><td>5 – 6 Personen</td><td>Flug + Privattransfer</td><td>270 € p.P.</td></tr><tr><td>7 – 8 Personen</td><td>Flug + Privattransfer</td><td>255 € p.P.</td></tr></tbody></table>
Erleben Sie die Pyramiden von Gizeh, die majestätische Sphinx und die Schätze des Ägyptischen Museums – alles an nur einem Tag von Hurghada aus.


Mit Hurghada Reiseplaner reisen Sie komfortabel, sicher und individuell. Freuen Sie sich auf einen deutschsprachigen Ägyptologen, persönliche Betreuung und einen exklusiven VIP-Service.





💎 Ideal für Paare, Familien und kleine Gruppen, die das Beste von Kairo erleben wollen – ohne lange Busfahrten.', 'Entdecken Sie die Pyramiden von Gizeh, die Sphinx und das Grand Egyptian Museum bei einem komfortablen Tagesausflug mit Flug ab Hurghada. Erleben Sie das Beste von Kairo – schnell, komfortabel und professionell organisiert. Von der persönlichen Buchungsberatung bis zur Rückkehr ins Hotel – wir kümme', 'Kultur & Sightseeing', '["Pyramiden von Gizeh & Sphinx – UNESCO Weltkulturerbe & einziges Weltwunder der Antike","Grand Egyptian Museum","Mittagessen am Nil – lokale Spezialitäten","Direktflug Hurghada – Kairo – Hurghada","Deutschsprachiger Ägyptologe – persönliche Führung den ganzen Tag"]'::jsonb, '["Hin- & Rückflug Hurghada ↔ Kairo","Transfers in klimatisierten Fahrzeugen","Eintrittsgelder laut Programm","Mittagessen","Deutschsprachiger Ägyptologe","Betreuung & Organisation durch Hurghada Reiseplaner"]'::jsonb, '["Getränke im Restaurant","Persönliche Ausgaben","Transferzuschlag ab Marsa Alam: 50 € pro Person","Transferzuschlag ab El Quseir: 35 € pro Person","Transferzuschlag ab Makadi Bay & Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga & Soma Bay: 10 € pro Person","Fremdsprachiger Reiseleiter (Englisch, Russisch oder Französisch): Aufpreis 10 € pro Person"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '15h', NULL, NULL, NULL, NULL, '[{"question":"🏛️ Eintritt in die Cheops-Pyramide","answer":"Betreten Sie das Innere eines der größten Weltwunder der Menschheit – ein einmaliges Erlebnis.30.00 € /person"},{"question":"🌆 Cairo Tower Besuch – Kairo von oben erleben","answer":"Erleben Sie einen atemberaubenden Panoramablick über die Millionenmetropole Kairo und den Nil vom berühmten Cairo Tower.25.00 € /person"}]'::jsonb),
('destinations', 'e8f6cfb1-c9ce-4adb-b3c2-4c381cd808a8', 'fr', 'El Quseir', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'e8f6cfb1-c9ce-4adb-b3c2-4c381cd808a8', 'en', 'El Quseir', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'e8f6cfb1-c9ce-4adb-b3c2-4c381cd808a8', 'ru', 'Эль-Кусейр', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'e8f6cfb1-c9ce-4adb-b3c2-4c381cd808a8', 'ar', 'القصير', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'e8f6cfb1-c9ce-4adb-b3c2-4c381cd808a8', 'hu', 'El Quseir', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', '5233806c-dc22-4dc1-8aa8-5d90e819ef2c', 'fr', 'Le Caire', 'La capitale de l''Egypte avec les pyramides de Gizeh et le musée égyptien.', NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', '5233806c-dc22-4dc1-8aa8-5d90e819ef2c', 'en', 'Cairo', 'The capital of Egypt with the Pyramids of Giza and the Egyptian Museum.', NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', '5233806c-dc22-4dc1-8aa8-5d90e819ef2c', 'ru', 'Каир
---ЦЭП---
Столица Египта с пирамидами Гизы и Египетским музеем.', 'Die Hauptstadt Ägyptens mit den Pyramiden von Gizeh und dem Ägyptischen Museum.', NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', '5233806c-dc22-4dc1-8aa8-5d90e819ef2c', 'ar', 'القاهرة
--- تسيب ---
عاصمة مصر وأهرامات الجيزة والمتحف المصري.', 'Die Hauptstadt Ägyptens mit den Pyramiden von Gizeh und dem Ägyptischen Museum.', NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', '5233806c-dc22-4dc1-8aa8-5d90e819ef2c', 'hu', 'Kairó', 'Egyiptom fővárosa a gízai piramisokkal és az Egyiptomi Múzeummal.', NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'c39caf1a-a278-4aaa-9735-a255c7a77a6d', 'fr', 'Safaga', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'c39caf1a-a278-4aaa-9735-a255c7a77a6d', 'en', 'Safaga', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'c39caf1a-a278-4aaa-9735-a255c7a77a6d', 'ru', 'Сафага', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'c39caf1a-a278-4aaa-9735-a255c7a77a6d', 'ar', 'سفاجا', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'c39caf1a-a278-4aaa-9735-a255c7a77a6d', 'hu', 'Safaga', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '380712ad-0b71-4e9a-8bfd-4e34c6906afc', 'en', 'Quad Safari Hurghada – 3 hours desert, camel ride & Bedouin village', '<table class="tour-pricing-table"><thead><tr><th>Price</th><th>Trip type</th><th>Trip start</th><th>Pick-up</th></tr></thead><tbody><tr><td>From 30 € per person</td><td>Group tour</td><td>daily</td><td>approx. 8:00 a.m.</td></tr></tbody></table>
Experience an exciting quad bike excursion in Hurghada that will take you through the fascinating desert landscape for 3 hours. Start with a safety briefing, then ride your quad bike through sand dunes and river valleys. You will then take a camel ride to a traditional Bedouin village, where you will learn about Bedouin everyday life and enjoy a traditional drink. The excursion offers the perfect combination of adventure and cultural experience in the Egyptian desert.', 'Exciting 3-hour quad bike excursion in Hurghada with camel ride, visit to a Bedouin village and breathtaking desert landscape.', NULL, '["3 hours quad biking through the desert","Camel ride to a Bedouin village","Visit a traditional Bedouin village","Experience the desert landscape","Safety equipment included","Hotel transfer possible"]'::jsonb, '["Quad rental (3 hours)","Camel ride","Visit to the Bedouin village","Safety equipment","Leadership","water"]'::jsonb, '["Hotel transfer (can be booked optionally)","Tips","Photos and videos","Lunch"]'::jsonb, 'Hurghada - Red Sea - Egypt', '8h', NULL, NULL, NULL, NULL, '[{"question":"Do I need a driving license?","answer":"No, a driving license is not required for quad driving. You will receive detailed safety instructions in advance."},{"question":"From what age can you ride a quad?","answer":"Driving a quad is permitted from the age of 16. Children aged 6 and over are allowed to ride as passengers."},{"question":"What should I wear?","answer":"Wear comfortable clothing and sturdy shoes. It is recommended to bring sunglasses and sunscreen."}]'::jsonb),
('tours', '380712ad-0b71-4e9a-8bfd-4e34c6906afc', 'hu', 'Quad Safari Hurghada – 3 órás sivatag, tevegelés és beduin falu', '<table class="tour-pricing-table"><thead><tr><th>Ár</th><th>Utazás típusa</th><th>Utazás kezdete</th><th>Átvétel</th></tr></thead><tbody><tr><td>30 €-tól személyenként</td><td>Csoportos túra</td><tdd>naponta</td><tdd> 8:00</td></tr></tbody></table>
Tapasztaljon meg egy izgalmas quad-kirándulást Hurghadában, amely 3 órán át elvezeti Önt a lenyűgöző sivatagi tájon. Kezdje egy biztonsági eligazítással, majd lovagoljon quaddal homokdűnéken és folyóvölgyeken. Ezután tevelovaglást tesz egy hagyományos beduin faluba, ahol megismerheti a beduin mindennapi életet, és elfogyaszthat egy hagyományos italt. A kirándulás a kaland és a kulturális élmény tökéletes kombinációját kínálja az egyiptomi sivatagban.', 'Izgalmas 3 órás quad kirándulás Hurghadában tevegézéssel, látogatás egy beduin faluban és lélegzetelállító sivatagi táj.', NULL, '["3 óra quadozás a sivatagban","Tevelovaglás egy beduin faluba","Látogasson el egy hagyományos beduin faluba","Tapasztalja meg a sivatagi tájat","Biztonsági felszerelést tartalmaz","Szállodai transzfer lehetséges"]'::jsonb, '["Quad bérlés (3 óra)","Tevelovaglás","Látogatás a beduin faluban","Biztonsági felszerelés","Vezetés","víz"]'::jsonb, '["Szállodai transzfer (opcionálisan foglalható)","Tippek","Fényképek és videók","Ebéd"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '8 óra', NULL, NULL, NULL, NULL, '[{"question":"Kell-e jogosítvány?","answer":"Nem, a quad vezetéséhez nem szükséges vezetői engedély. Előzetesen megkapja a részletes biztonsági utasításokat."},{"question":"Hány éves kortól tudsz quadozni?","answer":"Quad vezetése 16 éves kortól engedélyezett. Utasként 6 éven felüli gyermekek utazhatnak."},{"question":"Mit vegyek fel?","answer":"Viseljen kényelmes ruházatot és erős cipőt. Napszemüveget és fényvédő krémet ajánlott vinni."}]'::jsonb),
('tours', '380712ad-0b71-4e9a-8bfd-4e34c6906afc', 'fr', 'Quad Safari Hurghada – 3 heures dans le désert, balade à dos de chameau et village bédouin', '<table class="tour-pricing-table"><thead><tr><th>Prix</th><th>Type de voyage</th><th>Début du voyage</th><th>Prise en charge</th></tr></thead><tbody><tr><td>À partir de 30 € par personne</td><td>Visite de groupe</td><td>par jour</td><td>env. 8h00</td></tr></tbody></table>
Vivez une passionnante excursion en quad à Hurghada qui vous mènera à travers le fascinant paysage désertique pendant 3 heures. Commencez par un briefing sur la sécurité, puis conduisez votre quad à travers les dunes de sable et les vallées fluviales. Vous ferez ensuite une promenade à dos de chameau jusqu''à un village bédouin traditionnel, où vous découvrirez la vie quotidienne des Bédouins et dégusterez une boisson traditionnelle. L''excursion offre la combinaison parfaite d''aventure et d''expérience culturelle dans le désert égyptien.', 'Excursion passionnante de 3 heures en quad à Hurghada avec balade à dos de chameau, visite d''un village bédouin et d''un paysage désertique à couper le souffle.', NULL, '["3 heures de quad à travers le désert","Balade à dos de chameau dans un village bédouin","Visitez un village bédouin traditionnel","Découvrez le paysage désertique","Équipement de sécurité inclus","Transfert hôtel possible"]'::jsonb, '["Location de quad (3 heures)","Balade à dos de chameau","Visite du village bédouin","Équipement de sécurité","Direction","eau"]'::jsonb, '["Transfert à l''hôtel (peut être réservé en option)","Conseils","Photos et vidéos","Déjeuner"]'::jsonb, 'Hurghada - Mer Rouge - Egypte', '8h', NULL, NULL, NULL, NULL, '[{"question":"Ai-je besoin d''un permis de conduire ?","answer":"Non, le permis de conduire n''est pas requis pour conduire un quad. Vous recevrez à l''avance des instructions de sécurité détaillées."},{"question":"A partir de quel âge peut-on rouler en quad ?","answer":"La conduite d''un quad est autorisée à partir de 16 ans. Les enfants âgés de 6 ans et plus sont autorisés à monter en tant que passagers."},{"question":"Que dois-je porter ?","answer":"Portez des vêtements confortables et des chaussures solides. Il est recommandé d''apporter des lunettes de soleil et de la crème solaire."}]'::jsonb),
('tours', '380712ad-0b71-4e9a-8bfd-4e34c6906afc', 'ru', 'Сафари на квадроциклах в Хургаде – 3 часа по пустыне, поездка на верблюде и деревня бедуинов
---ЦЭП---
Увлекательная 3-часовая экскурсия на квадроциклах по Хургаде с поездкой на верблюде, посещением бедуинской деревни и захватывающими дух пустынными пейзажами.
---ЦЭП---
Хургада - Красное море - Египет
---ЦЭП---
8 часов
---ЦЭП---
<table class="tour-pricing-table"><thead><tr><th>Цена</th><th>Тип поездки</th><th>Начало поездки</th><th>Самовывоз</th></tr></thead><tbody><tr><td>От 30 евро на человека</td><td>Групповой тур</td><td>ежедневно</td><td>ок. 8:00 утра</td></tr></tbody></table>
Отправьтесь на захватывающую экскурсию на квадроциклах по Хургаде, которая в течение 3 часов проведет вас по захватывающим ландшафтам пустыни. Начните с инструктажа по технике безопасности, а затем покатайтесь на квадроцикле по песчаным дюнам и речным долинам. Затем вы отправитесь на верблюде в традиционную бедуинскую деревню, где узнаете о повседневной жизни бедуинов и насладитесь традиционным напитком. Экскурсия предлагает идеальное сочетание приключений и культурного опыта в египетской пустыне.
---ЦЭП---
3 часа езды на квадроцикле по пустыне
---РАЗДЕЛЕНИЕ---
Поездка на верблюде в деревню бедуинов
---РАЗДЕЛЕНИЕ---
Посетите традиционную бедуинскую деревню.
---РАЗДЕЛЕНИЕ---
Испытайте пустынный пейзаж
---РАЗДЕЛЕНИЕ---
Включено защитное оборудование
---РАЗДЕЛЕНИЕ---
Возможен трансфер из отеля
---ЦЭП---
Аренда квадроцикла (3 часа)
---РАЗДЕЛЕНИЕ---
Поездка на верблюде
---РАЗДЕЛЕНИЕ---
Посещение бедуинской деревни.
---РАЗДЕЛЕНИЕ---
Защитное оборудование
---РАЗДЕЛЕНИЕ---
Лидерство
---РАЗДЕЛЕНИЕ---
вода
---ЦЭП---
Трансфер в отель (можно заказать дополнительно)
---РАЗДЕЛЕНИЕ---
Советы
---РАЗДЕЛЕНИЕ---
Фото и видео
---РАЗДЕЛЕНИЕ---
Обед
---ЦЭП---
Нужны ли мне водительские права?
---РАЗДЕЛЕНИЕ---
С какого возраста можно кататься на квадроцикле?
---РАЗДЕЛЕНИЕ---
Что мне надеть?
---ЦЭП---
Нет, для вождения квадроцикла водительские права не требуются. Вы заранее получите подробные инструкции по технике безопасности.
---РАЗДЕЛЕНИЕ---
Управлять квадроциклом разрешено с 16 лет. В качестве пассажиров допускаются дети от 6 лет и старше.
---РАЗДЕЛЕНИЕ---
Носите удобную одежду и прочную обувь. Рекомендуется взять с собой солнцезащитные очки и солнцезащитный крем.', '<table class="tour-pricing-table"><thead><tr><th>Preis</th><th>Reisetyp</th><th>Reiseantritt</th><th>Abholung</th></tr></thead><tbody><tr><td>Ab 30 € p.P.</td><td>Gruppentour</td><td>täglich</td><td>ca. 8:00 Uhr</td></tr></tbody></table>
Erleben Sie einen aufregenden Quad-Ausflug in Hurghada, der Sie 3 Stunden lang durch die faszinierende Wüstenlandschaft führen. Starten Sie mit einer Sicherheitsunterweisung, fahren Sie dann auf Ihrem Quad durch Sanddünen und Flusstäler. Anschließend erwartet Sie ein Kamelritt zu einem traditionellen Beduinendorf, wo Sie den Alltag der Beduinen kennenlernen und ein traditionelles Getränk genießen können. Der Ausflug bietet die perfekte Kombination aus Abenteuer und kulturellem Erlebnis in der ägyptischen Wüste.', 'Aufregender 3-Stunden Quad-Ausflug in Hurghada mit Kamelritt, Besuch eines Beduinendorfs und atemberaubender Wüstenlandschaft.', NULL, '["3 Stunden Quad-Fahren durch die Wüste","Kamelritt zu einem Beduinendorf","Besuch eines traditionellen Beduinendorfs","Erlebnis der Wüstenlandschaft","Sicherheitsausrüstung inklusive","Hoteltransfer möglich"]'::jsonb, '["Quad-Miete (3 Stunden)","Kamelritt","Besuch des Beduinendorfs","Sicherheitsausrüstung","Führung","Wasser"]'::jsonb, '["Hoteltransfer (optional buchbar)","Trinkgelder","Fotos und Videos","Mittagessen"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '8h', NULL, NULL, NULL, NULL, '[{"question":"Brauche ich einen Führerschein?","answer":"Nein, für das Quad-Fahren ist kein Führerschein erforderlich. Sie erhalten vorab eine ausführliche Sicherheitsunterweisung."},{"question":"Ab welchem Alter darf man quadfahren?","answer":"Das Fahren eines Quads ist ab 16 Jahren erlaubt. Kinder ab 6 Jahren dürfen als Beifahrer mitfahren."},{"question":"Was soll ich anziehen?","answer":"Tragen Sie bequeme Kleidung und feste Schuhe. Es wird empfohlen, eine Sonnenbrille und Sonnencreme mitzunehmen."}]'::jsonb),
('tours', '380712ad-0b71-4e9a-8bfd-4e34c6906afc', 'ar', 'كواد سفاري الغردقة - 3 ساعات في الصحراء وركوب الجمال والقرية البدوية
--- تسيب ---
رحلة مثيرة بالدراجة الرباعية لمدة 3 ساعات في الغردقة مع ركوب الجمال وزيارة قرية بدوية والمناظر الطبيعية الصحراوية الخلابة.
--- تسيب ---
الغردقة - البحر الأحمر - مصر
--- تسيب ---
8 ساعات
--- تسيب ---
<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>بداية الرحلة</th><th>البيك اب</th></tr></thead><tbody><tr><td>من 30 يورو للشخص الواحد</td><td>جولة جماعية</td><td>يوميًا</td><td>تقريبًا. 8:00 صباحًا</td></tr></tbody></table>
استمتع برحلة مثيرة بالدراجة الرباعية في الغردقة ستأخذك عبر المناظر الطبيعية الصحراوية الرائعة لمدة 3 ساعات. ابدأ بموجز حول السلامة، ثم قم بقيادة دراجتك الرباعية عبر الكثبان الرملية ووديان الأنهار. ستأخذ بعد ذلك جولة بالجمال إلى قرية بدوية تقليدية، حيث ستتعرف على الحياة البدوية اليومية وتستمتع بمشروب تقليدي. توفر الرحلة مزيجًا مثاليًا من المغامرة والتجربة الثقافية في الصحراء المصرية.
--- تسيب ---
ركوب الدراجات الرباعية لمدة 3 ساعات عبر الصحراء
---تقسيم---
ركوب الجمال إلى قرية بدوية
---تقسيم---
زيارة قرية بدوية تقليدية
---تقسيم---
تجربة المناظر الطبيعية الصحراوية
---تقسيم---
معدات السلامة متضمنة
---تقسيم---
إمكانية نقل الفندق
--- تسيب ---
تأجير رباعية (3 ساعات)
---تقسيم---
ركوب الجمل
---تقسيم---
زيارة القرية البدوية
---تقسيم---
معدات السلامة
---تقسيم---
القيادة
---تقسيم---
الماء
--- تسيب ---
النقل من الفندق (يمكن حجزه اختياريًا)
---تقسيم---
نصائح
---تقسيم---
الصور ومقاطع الفيديو
---تقسيم---
الغداء
--- تسيب ---
هل أحتاج إلى رخصة قيادة؟
---تقسيم---
من أي عمر يمكنك ركوب الدراجة الرباعية؟
---تقسيم---
ماذا يجب أن أرتدي؟
--- تسيب ---
لا، رخصة القيادة غير مطلوبة للقيادة الرباعية. سوف تتلقى تعليمات السلامة التفصيلية مقدما.
---تقسيم---
يُسمح بقيادة مركبة رباعية الدفع اعتبارًا من سن 16 عامًا. ويُسمح للأطفال بعمر 6 سنوات فما فوق بالركوب كركاب.
---تقسيم---
ارتداء ملابس مريحة وأحذية متينة. يوصى بإحضار النظارات الشمسية وواقي الشمس.', '<table class="tour-pricing-table"><thead><tr><th>Preis</th><th>Reisetyp</th><th>Reiseantritt</th><th>Abholung</th></tr></thead><tbody><tr><td>Ab 30 € p.P.</td><td>Gruppentour</td><td>täglich</td><td>ca. 8:00 Uhr</td></tr></tbody></table>
Erleben Sie einen aufregenden Quad-Ausflug in Hurghada, der Sie 3 Stunden lang durch die faszinierende Wüstenlandschaft führen. Starten Sie mit einer Sicherheitsunterweisung, fahren Sie dann auf Ihrem Quad durch Sanddünen und Flusstäler. Anschließend erwartet Sie ein Kamelritt zu einem traditionellen Beduinendorf, wo Sie den Alltag der Beduinen kennenlernen und ein traditionelles Getränk genießen können. Der Ausflug bietet die perfekte Kombination aus Abenteuer und kulturellem Erlebnis in der ägyptischen Wüste.', 'Aufregender 3-Stunden Quad-Ausflug in Hurghada mit Kamelritt, Besuch eines Beduinendorfs und atemberaubender Wüstenlandschaft.', NULL, '["3 Stunden Quad-Fahren durch die Wüste","Kamelritt zu einem Beduinendorf","Besuch eines traditionellen Beduinendorfs","Erlebnis der Wüstenlandschaft","Sicherheitsausrüstung inklusive","Hoteltransfer möglich"]'::jsonb, '["Quad-Miete (3 Stunden)","Kamelritt","Besuch des Beduinendorfs","Sicherheitsausrüstung","Führung","Wasser"]'::jsonb, '["Hoteltransfer (optional buchbar)","Trinkgelder","Fotos und Videos","Mittagessen"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '8h', NULL, NULL, NULL, NULL, '[{"question":"Brauche ich einen Führerschein?","answer":"Nein, für das Quad-Fahren ist kein Führerschein erforderlich. Sie erhalten vorab eine ausführliche Sicherheitsunterweisung."},{"question":"Ab welchem Alter darf man quadfahren?","answer":"Das Fahren eines Quads ist ab 16 Jahren erlaubt. Kinder ab 6 Jahren dürfen als Beifahrer mitfahren."},{"question":"Was soll ich anziehen?","answer":"Tragen Sie bequeme Kleidung und feste Schuhe. Es wird empfohlen, eine Sonnenbrille und Sonnencreme mitzunehmen."}]'::jsonb),
('tours', '872d19ae-dd4c-4c01-9f1b-217e481b3732', 'en', 'Great safari Hurghada with quad, jeep, camel ride & BBQ', '<table class="tour-pricing-table"><thead><tr><th>Price</th><th>Trip type</th><th>Trip start</th><th>Pick-up</th></tr></thead><tbody><tr><td>From 40 € per person</td><td>Group tour</td><td>daily</td><td>approx. 1:00 p.m.</td></tr></tbody></table>
Discover the adventure of the desert in Hurghada with this varied super safari excursion. Experience the breathtaking scenery of the Egyptian desert on a quad bike, drive a jeep through the sand dunes, ride a camel and enjoy a delicious BBQ in the Bedouin village. This excursion offers the perfect combination of action, nature and cultural experience. After being picked up at the hotel, you will first drive to a quad station, where you will receive a safety briefing and then ride through the desert on self-driven quads. You will then switch to jeeps that will take you to a camel riding station. There you can ride camels and enjoy the desert landscape. Finally, you will reach a traditional Bedouin village where an aromatic BBQ meal awaits you. Enjoy the sunset over the dunes and experience Bedouin hospitality.', 'Experience an unforgettable desert adventure in Hurghada: quad bike, jeep, camel ride, sandboarding and a Bedouin BBQ under the stars - all included.', NULL, '["Quad driving through the desert","Jeep safari over the sand dunes","Camel ride through the desert landscape","Visit a traditional Bedouin village","Delicious BBQ meal in the star tent","Sunset over the dunes","Hotel transfer included"]'::jsonb, '["Hotel transfer (round trip)","Quad driving (approx. 1 hour)","Jeep safari","Camel ride","Sandboarding","BBQ meal in the Bedouin village","Soft drinks and water","Safety equipment","Guided tour through the desert"]'::jsonb, '["Tips","Photos and videos","Alcoholic drinks","Additional snacks"]'::jsonb, 'Hurghada - Red Sea - Egypt', '8h', NULL, NULL, NULL, NULL, '[{"question":"What should I bring with me?","answer":"Bring comfortable clothing, sunscreen, sunglasses, and some money for tips and photos."},{"question":"From what age can you participate?","answer":"Children aged 6 and over are allowed to take part in the quad as passengers. Driving a quad is permitted from the age of 16."},{"question":"Is hotel pickup included?","answer":"Yes, hotel transfers to and from your hotel in Hurghada are included in the price."},{"question":"How long does the excursion last?","answer":"The entire excursion lasts approximately 5-6 hours, including transfer."}]'::jsonb),
('tours', '872d19ae-dd4c-4c01-9f1b-217e481b3732', 'fr', 'Grand safari Hurghada avec quad, jeep, balade à dos de chameau et barbecue', '<table class="tour-pricing-table"><thead><tr><th>Prix</th><th>Type de voyage</th><th>Début du voyage</th><th>Prise en charge</th></tr></thead><tbody><tr><td>À partir de 40 € par personne</td><td>Visite de groupe</td><td>par jour</td><td>env. 13h00</td></tr></tbody></table>
Découvrez l''aventure du désert à Hurghada avec cette excursion de super safari variée. Découvrez les paysages à couper le souffle du désert égyptien en quad, conduisez une jeep à travers les dunes de sable, montez à dos de chameau et savourez un délicieux barbecue dans le village bédouin. Cette excursion offre la combinaison parfaite d’action, de nature et d’expérience culturelle. Après avoir été pris en charge à l''hôtel, vous vous dirigerez d''abord vers une station de quad, où vous recevrez un briefing sur la sécurité, puis traverserez le désert sur des quads autonomes. Vous passerez ensuite à des jeeps qui vous conduiront à une station d''équitation à dos de chameau. Là, vous pourrez monter à dos de chameau et profiter du paysage désertique. Enfin, vous atteindrez un village bédouin traditionnel où un repas barbecue aromatique vous attend. Profitez du coucher de soleil sur les dunes et découvrez l''hospitalité bédouine.', 'Vivez une aventure inoubliable dans le désert à Hurghada : quad, jeep, balade à dos de chameau, sandboard et barbecue bédouin sous les étoiles - tout compris.', NULL, '["Quad conduisant à travers le désert","Safari en jeep sur les dunes de sable","Promenade à dos de chameau à travers le paysage désertique","Visitez un village bédouin traditionnel","Délicieux repas barbecue sous la tente étoilée","Coucher de soleil sur les dunes","Transfert hôtel inclus"]'::jsonb, '["Transfert hôtel (aller-retour)","Conduite en quad (environ 1 heure)","Safari en jeep","Balade à dos de chameau","Sandboard","Repas barbecue dans le village bédouin","Boissons gazeuses et eau","Équipement de sécurité","Visite guidée à travers le désert"]'::jsonb, '["Conseils","Photos et vidéos","Boissons alcoolisées","Collations supplémentaires"]'::jsonb, 'Hurghada - Mer Rouge - Egypte', '8h', NULL, NULL, NULL, NULL, '[{"question":"Que dois-je apporter avec moi ?","answer":"Apportez des vêtements confortables, de la crème solaire, des lunettes de soleil et de l''argent pour des conseils et des photos."},{"question":"A partir de quel âge peut-on participer ?","answer":"Les enfants âgés de 6 ans et plus sont autorisés à monter dans le quad en tant que passagers. La conduite d''un quad est autorisée à partir de 16 ans."},{"question":"La prise en charge à l''hôtel est-elle incluse ?","answer":"Oui, les transferts depuis et vers votre hôtel à Hurghada sont inclus dans le prix."},{"question":"Combien de temps dure l''excursion ?","answer":"L''excursion entière dure environ 5 à 6 heures, transfert compris."}]'::jsonb),
('tours', '872d19ae-dd4c-4c01-9f1b-217e481b3732', 'ru', 'Великолепное сафари в Хургаде с квадроциклом, джипом, поездкой на верблюде и барбекю
---ЦЭП---
Отправьтесь в незабываемое приключение в пустыне в Хургаде: квадроцикл, джип, поездка на верблюде, катание на сэндборде и бедуинское барбекю под звездами — все включено.
---ЦЭП---
Хургада - Красное море - Египет
---ЦЭП---
8 часов
---ЦЭП---
<table class="tour-pricing-table"><thead><tr><th>Цена</th><th>Тип поездки</th><th>Начало поездки</th><th>Самовывоз</th></tr></thead><tbody><tr><td>От 40 евро на человека</td><td>Групповой тур</td><td>ежедневно</td><td>ок. 13:00</td></tr></tbody></table>
Откройте для себя приключения в пустыне Хургады с помощью этой разнообразной экскурсии на супер-сафари. Насладитесь захватывающими пейзажами египетской пустыни на квадроцикле, прокатитесь на джипе по песчаным дюнам, покатайтесь на верблюде и насладитесь вкусным барбекю в бедуинской деревне. Эта экскурсия предлагает идеальное сочетание действий, природы и культурного опыта. После того, как вас встретят в отеле, вы сначала отвезетесь на станцию ​​для квадроциклов, где пройдете инструктаж по технике безопасности, а затем поедете по пустыне на самоуправляемых квадроциклах. Затем вы пересядете на джипы, которые отвезут вас на станцию ​​катания на верблюдах. Там можно покататься на верблюдах и насладиться пустынным пейзажем. Наконец, вы доберетесь до традиционной бедуинской деревни, где вас ждет ароматное барбекю. Наслаждайтесь закатом над дюнами и испытайте бедуинское гостеприимство.
---ЦЭП---
Квадроцикл едет по пустыне
---РАЗДЕЛЕНИЕ---
Джип-сафари по песчаным дюнам
---РАЗДЕЛЕНИЕ---
Поездка на верблюде по пустынному ландшафту
---РАЗДЕЛЕНИЕ---
Посетите традиционную бедуинскую деревню.
---РАЗДЕЛЕНИЕ---
Вкусный ужин-барбекю в звездной палатке
---РАЗДЕЛЕНИЕ---
Закат над дюнами
---РАЗДЕЛЕНИЕ---
Трансфер в отель включен
---ЦЭП---
Трансфер из отеля (туда и обратно)
---РАЗДЕЛЕНИЕ---
Вождение на квадроцикле (около 1 часа)
---РАЗДЕЛЕНИЕ---
Джип-сафари
---РАЗДЕЛЕНИЕ---
Поездка на верблюде
---РАЗДЕЛЕНИЕ---
Сэндбординг
---РАЗДЕЛЕНИЕ---
Барбекю в деревне бедуинов
---РАЗДЕЛЕНИЕ---
Безалкогольные напитки и вода
---РАЗДЕЛЕНИЕ---
Защитное оборудование
---РАЗДЕЛЕНИЕ---
Экскурсия по пустыне
---ЦЭП---
Советы
---РАЗДЕЛЕНИЕ---
Фото и видео
---РАЗДЕЛЕНИЕ---
Алкогольные напитки
---РАЗДЕЛЕНИЕ---
Дополнительные закуски
---ЦЭП---
Что мне следует взять с собой?
---РАЗДЕЛЕНИЕ---
С какого возраста можно участвовать?
---РАЗДЕЛЕНИЕ---
Включен ли трансфер из отеля?
---РАЗДЕЛЕНИЕ---
Сколько длится экскурсия?
---ЦЭП---
Возьмите с собой удобную одежду, солнцезащитный крем, солнцезащитные очки и немного денег на чаевые и фотографии.
---РАЗДЕЛЕНИЕ---
В качестве пассажиров на квадроцикле допускаются дети от 6 лет и старше. Управлять квадроциклом разрешено с 16 лет.
---РАЗДЕЛЕНИЕ---
Да, трансфер от/до вашего отеля в Хургаде включен в стоимость.
---РАЗДЕЛЕНИЕ---
Вся экскурсия длится примерно 5-6 часов, включая трансфер.', '<table class="tour-pricing-table"><thead><tr><th>Preis</th><th>Reisetyp</th><th>Reiseantritt</th><th>Abholung</th></tr></thead><tbody><tr><td>Ab 40 € p.P.</td><td>Gruppentour</td><td>täglich</td><td>ca. 13:00 Uhr</td></tr></tbody></table>
Entdecken Sie das Abenteuer der Wüste in Hurghada mit diesem abwechslungsreichen Super Safari Ausflug. Erleben Sie die atemberaubende Landschaft der ögyptischen Wüste auf einem Quad, fahren Sie mit einem Jeep durch die Sanddünen, reiten Sie auf einem Kamel und genießen Sie ein leckeres BBQ im Beduinendorf. Dieser Ausflug bietet die perfekte Kombination aus Action, Natur und kulturellem Erlebnis. Nach der Abholung am Hotel fahren Sie zunächst zu einer Quad-Station, wo Sie eine Sicherheitsunterweisung erhalten und dann auf selbst gesteuerten Quads durch die Wüste brettern. Anschließend wechseln Sie in Jeeps, die Sie zu einer Kamelreiterstation bringen. Dort können Sie auf Kamelen reiten und die Wüstenlandschaft genießen. Zum Abschluss erreichen Sie ein traditionelles Beduinendorf, wo ein aromatisches BBQ-Mahl auf Sie wartet. Genießen Sie den Sonnenuntergang über den Dünen und erleben Sie die Gastfreundschaft der Beduinen.', 'Erleben Sie ein unvergessliches Desert-Abenteuer in Hurghada: Quad, Jeep, Kamelritt, Sandboarden und ein Beduinen-BBQ unter den Sternen – alles inklusive.', NULL, '["Quad-Fahren durch die Wüste","Jeep-Safari über die Sanddünen","Kamelritt durch die Wüstenlandschaft","Besuch eines traditionellen Beduinendorfs","Leckeres BBQ-Mahl im Sternezelt","Sonnenuntergang über den Dünen","Hoteltransfer inklusive"]'::jsonb, '["Hoteltransfer (Hin- und Rückfahrt)","Quad-Fahren (ca. 1 Stunde)","Jeep-Safari","Kamelritt","Sandboarden","BBQ-Mahl im Beduinendorf","Softdrinks und Wasser","Sicherheitsausrüstung","Führung durch die Wüste"]'::jsonb, '["Trinkgelder","Fotos und Videos","Alkoholische Getränke","Zusätzliche Snacks"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '8h', NULL, NULL, NULL, NULL, '[{"question":"Was soll ich mitbringen?","answer":"Bringen Sie bequeme Kleidung, Sonnencreme, eine Sonnenbrille und etwas Geld für Trinkgelder und Fotos mit."},{"question":"Ab welchem Alter kann man teilnehmen?","answer":"Kinder ab 6 Jahren dürfen als Beifahrer am Quad teilnehmen. Das Fahren eines Quads ist ab 16 Jahren erlaubt."},{"question":"Ist die Abholung vom Hotel inklusive?","answer":"Ja, der Hoteltransfer von und zu Ihrem Hotel in Hurghada ist im Preis inbegriffen."},{"question":"Wie lange dauert der Ausflug?","answer":"Der gesamte Ausflug dauert ca. 5-6 Stunden, inklusive Transfer."}]'::jsonb),
('tours', '872d19ae-dd4c-4c01-9f1b-217e481b3732', 'ar', 'رحلة سفاري رائعة بالغردقة بمركبات رباعية وجيب وركوب الجمال والشواء
--- تسيب ---
استمتع بمغامرة صحراوية لا تُنسى في الغردقة: دراجة رباعية، وسيارة جيب، وركوب الجمال، والتزلج على الرمال، وشواء بدوي تحت النجوم - كل ذلك متضمن.
--- تسيب ---
الغردقة - البحر الأحمر - مصر
--- تسيب ---
8 ساعات
--- تسيب ---
<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>بداية الرحلة</th><th>البيك اب</th></tr></thead><tbody><tr><td>من 40 يورو للشخص الواحد</td><td>جولة جماعية</td><td>يوميًا</td><td>تقريبًا. الساعة الواحدة بعد الظهر</td></tr></tbody></table>
اكتشف مغامرة الصحراء في الغردقة مع رحلة السفاري المتنوعة هذه. استمتع بمناظر الصحراء المصرية الخلابة على دراجة رباعية، وقيادة سيارة جيب عبر الكثبان الرملية، وركوب الجمال والاستمتاع بالشواء اللذيذ في القرية البدوية. توفر هذه الرحلة مزيجًا مثاليًا من الحركة والطبيعة والتجربة الثقافية. بعد أن يتم اصطحابك من الفندق، ستقود أولاً إلى محطة الدفع الرباعي، حيث ستتلقى إحاطة حول السلامة ثم تركب عبر الصحراء على متن مركبات رباعية الدفع ذاتية القيادة. ستنتقل بعد ذلك إلى سيارات الجيب التي ستأخذك إلى محطة ركوب الجمال. وهناك يمكنك ركوب الجمال والاستمتاع بالمناظر الطبيعية الصحراوية. وأخيرًا، ستصل إلى قرية بدوية تقليدية حيث تنتظرك وجبة شواء عطرية. استمتع بغروب الشمس فوق الكثبان الرملية واستمتع بتجربة الضيافة البدوية.
--- تسيب ---
قيادة رباعية عبر الصحراء
---تقسيم---
رحلة سفاري بسيارة جيب فوق الكثبان الرملية
---تقسيم---
ركوب الجمال عبر المناظر الطبيعية الصحراوية
---تقسيم---
زيارة قرية بدوية تقليدية
---تقسيم---
وجبة شواء لذيذة في خيمة النجمة
---تقسيم---
غروب الشمس فوق الكثبان الرملية
---تقسيم---
شامل النقل من الفندق
--- تسيب ---
النقل من الفندق (ذهابا وإيابا)
---تقسيم---
القيادة الرباعية (حوالي ساعة واحدة)
---تقسيم---
جيب سفاري
---تقسيم---
ركوب الجمل
---تقسيم---
التزلج على الرمال
---تقسيم---
وجبة مشويات في القرية البدوية
---تقسيم---
المشروبات الغازية والمياه
---تقسيم---
معدات السلامة
---تقسيم---
جولة إرشادية عبر الصحراء
--- تسيب ---
نصائح
---تقسيم---
الصور ومقاطع الفيديو
---تقسيم---
المشروبات الكحولية
---تقسيم---
وجبات خفيفة إضافية
--- تسيب ---
ماذا يجب أن أحضر معي؟
---تقسيم---
من أي عمر يمكنك المشاركة؟
---تقسيم---
هل يشمل التوصيل من الفندق؟
---تقسيم---
كم من الوقت تستمر الرحلة؟
--- تسيب ---
أحضر ملابس مريحة وواقي من الشمس ونظارات شمسية وبعض المال للحصول على النصائح والصور.
---تقسيم---
يُسمح للأطفال بعمر 6 سنوات فما فوق بالمشاركة في الرباعية كركاب. يُسمح بقيادة المركبات الرباعية ابتداءً من سن 16 عامًا.
---تقسيم---
نعم، يشمل السعر خدمات النقل من وإلى فندقك في الغردقة.
---تقسيم---
تستغرق الرحلة بأكملها حوالي 5-6 ساعات، بما في ذلك النقل.', '<table class="tour-pricing-table"><thead><tr><th>Preis</th><th>Reisetyp</th><th>Reiseantritt</th><th>Abholung</th></tr></thead><tbody><tr><td>Ab 40 € p.P.</td><td>Gruppentour</td><td>täglich</td><td>ca. 13:00 Uhr</td></tr></tbody></table>
Entdecken Sie das Abenteuer der Wüste in Hurghada mit diesem abwechslungsreichen Super Safari Ausflug. Erleben Sie die atemberaubende Landschaft der ögyptischen Wüste auf einem Quad, fahren Sie mit einem Jeep durch die Sanddünen, reiten Sie auf einem Kamel und genießen Sie ein leckeres BBQ im Beduinendorf. Dieser Ausflug bietet die perfekte Kombination aus Action, Natur und kulturellem Erlebnis. Nach der Abholung am Hotel fahren Sie zunächst zu einer Quad-Station, wo Sie eine Sicherheitsunterweisung erhalten und dann auf selbst gesteuerten Quads durch die Wüste brettern. Anschließend wechseln Sie in Jeeps, die Sie zu einer Kamelreiterstation bringen. Dort können Sie auf Kamelen reiten und die Wüstenlandschaft genießen. Zum Abschluss erreichen Sie ein traditionelles Beduinendorf, wo ein aromatisches BBQ-Mahl auf Sie wartet. Genießen Sie den Sonnenuntergang über den Dünen und erleben Sie die Gastfreundschaft der Beduinen.', 'Erleben Sie ein unvergessliches Desert-Abenteuer in Hurghada: Quad, Jeep, Kamelritt, Sandboarden und ein Beduinen-BBQ unter den Sternen – alles inklusive.', NULL, '["Quad-Fahren durch die Wüste","Jeep-Safari über die Sanddünen","Kamelritt durch die Wüstenlandschaft","Besuch eines traditionellen Beduinendorfs","Leckeres BBQ-Mahl im Sternezelt","Sonnenuntergang über den Dünen","Hoteltransfer inklusive"]'::jsonb, '["Hoteltransfer (Hin- und Rückfahrt)","Quad-Fahren (ca. 1 Stunde)","Jeep-Safari","Kamelritt","Sandboarden","BBQ-Mahl im Beduinendorf","Softdrinks und Wasser","Sicherheitsausrüstung","Führung durch die Wüste"]'::jsonb, '["Trinkgelder","Fotos und Videos","Alkoholische Getränke","Zusätzliche Snacks"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '8h', NULL, NULL, NULL, NULL, '[{"question":"Was soll ich mitbringen?","answer":"Bringen Sie bequeme Kleidung, Sonnencreme, eine Sonnenbrille und etwas Geld für Trinkgelder und Fotos mit."},{"question":"Ab welchem Alter kann man teilnehmen?","answer":"Kinder ab 6 Jahren dürfen als Beifahrer am Quad teilnehmen. Das Fahren eines Quads ist ab 16 Jahren erlaubt."},{"question":"Ist die Abholung vom Hotel inklusive?","answer":"Ja, der Hoteltransfer von und zu Ihrem Hotel in Hurghada ist im Preis inbegriffen."},{"question":"Wie lange dauert der Ausflug?","answer":"Der gesamte Ausflug dauert ca. 5-6 Stunden, inklusive Transfer."}]'::jsonb),
('tours', '872d19ae-dd4c-4c01-9f1b-217e481b3732', 'hu', 'Nagyszerű szafari Hurghada quaddal, terepjáróval, tevelovaglással és grillezéssel', '<table class="tour-pricing-table"><thead><tr><th>Ár</th><th>Utazás típusa</th><th>Utazás kezdete</th><th>Átvétel</th></tr></thead><tbody><tr><td>40 €-tól személyenként</td><td>Csoportos túra</td><tdd>naponta</td><tdd> 13:00</td></tr></tbody></table>
Fedezze fel a sivatag kalandját Hurghadában ezzel a változatos szuper szafari kirándulással. Tapasztalja meg az egyiptomi sivatag lélegzetelállító tájait egy quaddal, vezessen dzsippel a homokdűnéken, lovagoljon tevén és élvezze a finom grillezést a beduin faluban. Ez a kirándulás az akció, a természet és a kulturális élmény tökéletes kombinációját kínálja. Miután felveszik a szállodában, először egy quad állomásra kell hajtani, ahol biztonsági eligazítást kap, majd önvezető quadokon áthalad a sivatagon. Ezután terepjárókra vált, amelyek egy tevelovagló állomásra visznek. Itt tevéken lovagolhat és élvezheti a sivatagi tájat. Végül eljut egy hagyományos beduin faluba, ahol egy aromás BBQ étkezés várja Önt. Élvezze a naplementét a dűnék felett, és tapasztalja meg a beduin vendégszeretetet.', 'Éljen át egy felejthetetlen sivatagi kalandot Hurghadában: quad, dzsip, tevegelés, homokdeszkázás és beduin grillezés a csillagok alatt – mindezt tartalmazza.', NULL, '["Quad vezetés a sivatagon keresztül","Jeep szafari a homokdűnék felett","Tevelovaglás a sivatagi tájon","Látogasson el egy hagyományos beduin faluba","Ízletes BBQ étkezés a sztársátorban","Naplemente a dűnék felett","Szállodai transzfert tartalmaz"]'::jsonb, '["Szállodai transzfer (oda-vissza út)","Quad vezetés (kb. 1 óra)","Jeep szafari","Tevelovaglás","Sandboardozás","Grill étkezés a beduin faluban","Üdítőitalok és víz","Biztonsági felszerelés","Tárlatvezetés a sivatagban"]'::jsonb, '["Tippek","Fényképek és videók","Alkoholos italok","További harapnivalók"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '8 óra', NULL, NULL, NULL, NULL, '[{"question":"Mit vigyek magammal?","answer":"Hozz magaddal kényelmes ruházatot, naptejet, napszemüveget és némi pénzt a tippekre és a fényképekre."},{"question":"Hány éves kortól lehet részt venni?","answer":"A quadon 6 éven felüli gyermekek utasként vehetnek részt. Quad vezetése 16 éves kortól engedélyezett."},{"question":"Az ár tartalmazza a szállodai átvételt?","answer":"Igen, az ár tartalmazza a szállodai transzfert Hurghada szállodájába és vissza."},{"question":"Mennyi ideig tart a kirándulás?","answer":"A teljes kirándulás körülbelül 5-6 órát vesz igénybe, az átszállással együtt."}]'::jsonb),
('blog_posts', 'bc3112c6-a2e1-4475-997b-39e2a77e228e', 'en', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Die besten Ausflüge in Hurghada 2025 – Top Sehenswürdigkeiten, Insider-Tipps und unvergessliche Erlebnisse am Roten Meer', 'Die besten Ausflüge in Hurghada 2025 – Top Sehenswürdigkeiten, Insider-Tipps und unvergessliche Erlebnisse am Roten Meer', '<!-- wp:paragraph -->
</p>
<p>Hurghada gehört zu den beliebtesten Reisezielen in Ägypten und zieht jedes Jahr tausende Urlauber aus Deutschland, Österreich und der Schweiz an. Die wunderschöne Küstenstadt am Roten Meer begeistert mit traumhaften Stränden, kristallklarem Wasser, farbenfrohen Korallenriffen und einzigartigen Wüstenlandschaften.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Wer seinen Urlaub in Hurghada verbringt, sollte die schönsten Ausflüge und Touren nicht verpassen. Von entspannten Bootsausflügen über faszinierende Schnorcheltouren bis hin zu aufregenden Quad Safaris bietet Hurghada unvergessliche Erlebnisse für jeden Geschmack.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Auf <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Hurghada Reiseplaner</a> findest du die besten Ausflüge in Hurghada 2025 – sicher, deutschsprachig und zu fairen Preisen.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
</p>
<h4><strong>Warum sind Ausflüge in Hurghada so beliebt?</strong></h4>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Hurghada ist einzigartig, weil hier Meer, Wüste, Abenteuer und Kultur perfekt zusammenkommen. Innerhalb eines einzigen Urlaubs kannst du:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>im Roten Meer schnorcheln</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Delfine beobachten</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>mit dem Quad durch die Wüste fahren</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>historische Tempel entdecken</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>traumhafte Inseln besuchen</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Genau diese Vielfalt macht Hurghada zu einem der besten Urlaubsziele in Ägypten.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":8968,"sizeSlug":"full","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2026/01/IMG-20250808-WA0025.jpg" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:heading -->
</p>
<h3><strong>1.Orange Bay Hurghada – Das Paradies am Roten Meer</strong></h3>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Die Orange Bay zählt zu den schönsten Ausflügen in Hurghada. Der feine weiße Sand, das türkisfarbene Wasser und die entspannte Atmosphäre erinnern an die Malediven.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Dieser Ausflug eignet sich perfekt für:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>Familien</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Paare</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Schnorchel-Fans</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Fotografen</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Die Kombination aus Entspannung und Schnorcheln macht Orange Bay zu einem absoluten Highlight.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":9378,"sizeSlug":"full","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2026/04/86.jpg" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:heading -->
</p>
<h3><strong>2.Quad Safari Hurghada – Das ultimative Wüstenabenteuer</strong></h3>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Eine Quad Safari in Hurghada ist ideal für alle, die Action und Abenteuer suchen.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Erlebe:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>rasante Fahrten durch die Wüste</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>beeindruckende Landschaften</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>einen Besuch im Beduinendorf</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>traditionellen ägyptischen Tee</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>spektakuläre Sonnenuntergänge</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Die Quad Safari gehört zu den meistgebuchten Hurghada Ausflügen.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":8887,"sizeSlug":"large","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2026/01/IMG-20250814-WA0073-1024x683.jpg" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:heading -->
</p>
<h3><strong>3.Schnorcheln in Hurghada – Die faszinierende Unterwasserwelt</strong></h3>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Das Rote Meer zählt zu den schönsten Schnorchelgebieten der Welt.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Beim Schnorcheln in Hurghada entdeckst du:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>bunte Korallenriffe</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>exotische Fischarten</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>kristallklares Wasser</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>einzigartige Unterwasserlandschaften</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Besonders beliebt sind Paradise Island und Giftun Island.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":8814,"sizeSlug":"full","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2026/01/05de47bb-1ef7-4bd2-a83a-b12bbb8b26ef_medium.webp" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:paragraph -->
</p>
<h3 data-section-id="x0t30r" data-start="2783" data-end="2809"><strong>4. Delfin Tour Hurghada</strong></h3>
<p data-start="2811" data-end="2860">Die Delfin Tour ist ein unvergessliches Erlebnis.</p>
<p data-start="2862" data-end="2967">Mit etwas Glück kannst du Delfine in ihrer natürlichen Umgebung beobachten und sogar mit ihnen schwimmen.</p>
<p data-start="2969" data-end="3035">Diese Tour ist besonders beliebt bei Familien und Naturliebhabern.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":6778,"sizeSlug":"full","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2025/10/Private-Tour-to-Luxor-5-870x555-1.webp" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:paragraph -->
</p>
<h3><strong>5. Luxor Tagesausflug ab Hurghada</strong></h3>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Für Kulturinteressierte ist Luxor ein Muss.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Besuche:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>das Tal der Könige</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>den Karnak Tempel</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>den Hatschepsut Tempel</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>den Nil</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Dieser Ausflug zeigt die beeindruckende Geschichte des alten Ägyptens.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":6795,"sizeSlug":"large","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2025/10/aegypten-kairo-pyramiden-von-gizeh-g-1277362064-1024x683.jpg" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:heading -->
</p>
<h3><strong>6.Kairo Ausflug ab Hurghada – Die Pyramiden von Gizeh erleben</strong></h3>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Ein Tagesausflug nach Kairo gehört zu den beeindruckendsten Erlebnissen während eines Hurghada Urlaubs.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Besuche die weltberühmten Pyramiden von Gizeh, die Sphinx und entdecke die faszinierende Geschichte des alten Ägyptens.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Ein Kairo Ausflug ab Hurghada ist perfekt für alle, die die berühmtesten Sehenswürdigkeiten Ägyptens live erleben möchten.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Highlights des Kairo Ausflugs:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>Die Pyramiden von Gizeh</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Die Große Sphinx</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Das Ägyptische Museum</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Spannende Einblicke in die Geschichte Ägyptens</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Dieser Ausflug zählt zu den beliebtesten Kultur-Ausflügen ab Hurghada.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
</p>
<h4><strong>Die besten Tipps für Hurghada Ausflüge</strong></h4>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Für den perfekten Ausflug solltest du:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>frühzeitig buchen</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Sonnenschutz mitnehmen</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>ausreichend Wasser trinken</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>bequeme Kleidung tragen</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>eine Kamera dabeihaben</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:heading -->
</p>
<h4><strong>Warum bei Hurghada Reiseplaner buchen?</strong></h4>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Bei uns profitierst du von:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>deutschsprachigem Service</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>persönlicher Betreuung</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>transparenten Preisen</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>geprüften Touren</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>einfacher Buchung</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Wir helfen dir dabei, die besten Ausflüge in Hurghada zu finden und deinen Urlaub unvergesslich zu machen.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
</p>
<h4><strong>Fazit: Die schönsten Ausflüge in Hurghada 2025</strong></h4>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Hurghada bietet für jeden das passende Erlebnis – egal ob Abenteuer, Entspannung, Schnorcheln oder Kultur.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Wenn du die besten Hurghada Ausflüge suchst, bist du bei Hurghada Reiseplaner genau richtig.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Buche jetzt deine Tour und entdecke die schönsten Seiten des Roten Meeres.</p>
<!-- /wp:paragraph -->', '5 Min', '[]'::jsonb),
('blog_posts', 'bc3112c6-a2e1-4475-997b-39e2a77e228e', 'ru', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Die besten Ausflüge in Hurghada 2025 – Top Sehenswürdigkeiten, Insider-Tipps und unvergessliche Erlebnisse am Roten Meer', 'Die besten Ausflüge in Hurghada 2025 – Top Sehenswürdigkeiten, Insider-Tipps und unvergessliche Erlebnisse am Roten Meer', '<!-- wp:paragraph -->
</p>
<p>Hurghada gehört zu den beliebtesten Reisezielen in Ägypten und zieht jedes Jahr tausende Urlauber aus Deutschland, Österreich und der Schweiz an. Die wunderschöne Küstenstadt am Roten Meer begeistert mit traumhaften Stränden, kristallklarem Wasser, farbenfrohen Korallenriffen und einzigartigen Wüstenlandschaften.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Wer seinen Urlaub in Hurghada verbringt, sollte die schönsten Ausflüge und Touren nicht verpassen. Von entspannten Bootsausflügen über faszinierende Schnorcheltouren bis hin zu aufregenden Quad Safaris bietet Hurghada unvergessliche Erlebnisse für jeden Geschmack.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Auf <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Hurghada Reiseplaner</a> findest du die besten Ausflüge in Hurghada 2025 – sicher, deutschsprachig und zu fairen Preisen.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
</p>
<h4><strong>Warum sind Ausflüge in Hurghada so beliebt?</strong></h4>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Hurghada ist einzigartig, weil hier Meer, Wüste, Abenteuer und Kultur perfekt zusammenkommen. Innerhalb eines einzigen Urlaubs kannst du:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>im Roten Meer schnorcheln</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Delfine beobachten</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>mit dem Quad durch die Wüste fahren</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>historische Tempel entdecken</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>traumhafte Inseln besuchen</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Genau diese Vielfalt macht Hurghada zu einem der besten Urlaubsziele in Ägypten.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":8968,"sizeSlug":"full","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2026/01/IMG-20250808-WA0025.jpg" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:heading -->
</p>
<h3><strong>1.Orange Bay Hurghada – Das Paradies am Roten Meer</strong></h3>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Die Orange Bay zählt zu den schönsten Ausflügen in Hurghada. Der feine weiße Sand, das türkisfarbene Wasser und die entspannte Atmosphäre erinnern an die Malediven.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Dieser Ausflug eignet sich perfekt für:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>Familien</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Paare</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Schnorchel-Fans</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Fotografen</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Die Kombination aus Entspannung und Schnorcheln macht Orange Bay zu einem absoluten Highlight.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":9378,"sizeSlug":"full","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2026/04/86.jpg" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:heading -->
</p>
<h3><strong>2.Quad Safari Hurghada – Das ultimative Wüstenabenteuer</strong></h3>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Eine Quad Safari in Hurghada ist ideal für alle, die Action und Abenteuer suchen.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Erlebe:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>rasante Fahrten durch die Wüste</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>beeindruckende Landschaften</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>einen Besuch im Beduinendorf</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>traditionellen ägyptischen Tee</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>spektakuläre Sonnenuntergänge</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Die Quad Safari gehört zu den meistgebuchten Hurghada Ausflügen.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":8887,"sizeSlug":"large","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2026/01/IMG-20250814-WA0073-1024x683.jpg" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:heading -->
</p>
<h3><strong>3.Schnorcheln in Hurghada – Die faszinierende Unterwasserwelt</strong></h3>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Das Rote Meer zählt zu den schönsten Schnorchelgebieten der Welt.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Beim Schnorcheln in Hurghada entdeckst du:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>bunte Korallenriffe</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>exotische Fischarten</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>kristallklares Wasser</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>einzigartige Unterwasserlandschaften</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Besonders beliebt sind Paradise Island und Giftun Island.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":8814,"sizeSlug":"full","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2026/01/05de47bb-1ef7-4bd2-a83a-b12bbb8b26ef_medium.webp" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:paragraph -->
</p>
<h3 data-section-id="x0t30r" data-start="2783" data-end="2809"><strong>4. Delfin Tour Hurghada</strong></h3>
<p data-start="2811" data-end="2860">Die Delfin Tour ist ein unvergessliches Erlebnis.</p>
<p data-start="2862" data-end="2967">Mit etwas Glück kannst du Delfine in ihrer natürlichen Umgebung beobachten und sogar mit ihnen schwimmen.</p>
<p data-start="2969" data-end="3035">Diese Tour ist besonders beliebt bei Familien und Naturliebhabern.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":6778,"sizeSlug":"full","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2025/10/Private-Tour-to-Luxor-5-870x555-1.webp" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:paragraph -->
</p>
<h3><strong>5. Luxor Tagesausflug ab Hurghada</strong></h3>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Für Kulturinteressierte ist Luxor ein Muss.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Besuche:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>das Tal der Könige</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>den Karnak Tempel</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>den Hatschepsut Tempel</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>den Nil</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Dieser Ausflug zeigt die beeindruckende Geschichte des alten Ägyptens.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":6795,"sizeSlug":"large","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2025/10/aegypten-kairo-pyramiden-von-gizeh-g-1277362064-1024x683.jpg" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:heading -->
</p>
<h3><strong>6.Kairo Ausflug ab Hurghada – Die Pyramiden von Gizeh erleben</strong></h3>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Ein Tagesausflug nach Kairo gehört zu den beeindruckendsten Erlebnissen während eines Hurghada Urlaubs.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Besuche die weltberühmten Pyramiden von Gizeh, die Sphinx und entdecke die faszinierende Geschichte des alten Ägyptens.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Ein Kairo Ausflug ab Hurghada ist perfekt für alle, die die berühmtesten Sehenswürdigkeiten Ägyptens live erleben möchten.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Highlights des Kairo Ausflugs:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>Die Pyramiden von Gizeh</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Die Große Sphinx</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Das Ägyptische Museum</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Spannende Einblicke in die Geschichte Ägyptens</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Dieser Ausflug zählt zu den beliebtesten Kultur-Ausflügen ab Hurghada.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
</p>
<h4><strong>Die besten Tipps für Hurghada Ausflüge</strong></h4>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Für den perfekten Ausflug solltest du:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>frühzeitig buchen</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Sonnenschutz mitnehmen</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>ausreichend Wasser trinken</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>bequeme Kleidung tragen</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>eine Kamera dabeihaben</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:heading -->
</p>
<h4><strong>Warum bei Hurghada Reiseplaner buchen?</strong></h4>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Bei uns profitierst du von:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>deutschsprachigem Service</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>persönlicher Betreuung</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>transparenten Preisen</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>geprüften Touren</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>einfacher Buchung</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Wir helfen dir dabei, die besten Ausflüge in Hurghada zu finden und deinen Urlaub unvergesslich zu machen.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
</p>
<h4><strong>Fazit: Die schönsten Ausflüge in Hurghada 2025</strong></h4>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Hurghada bietet für jeden das passende Erlebnis – egal ob Abenteuer, Entspannung, Schnorcheln oder Kultur.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Wenn du die besten Hurghada Ausflüge suchst, bist du bei Hurghada Reiseplaner genau richtig.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Buche jetzt deine Tour und entdecke die schönsten Seiten des Roten Meeres.</p>
<!-- /wp:paragraph -->', '5 Min', '[]'::jsonb),
('blog_posts', 'bc3112c6-a2e1-4475-997b-39e2a77e228e', 'fr', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Die besten Ausflüge in Hurghada 2025 – Top Sehenswürdigkeiten, Insider-Tipps und unvergessliche Erlebnisse am Roten Meer', 'Die besten Ausflüge in Hurghada 2025 – Top Sehenswürdigkeiten, Insider-Tipps und unvergessliche Erlebnisse am Roten Meer', '<!-- wp:paragraph -->
</p>
<p>Hurghada gehört zu den beliebtesten Reisezielen in Ägypten und zieht jedes Jahr tausende Urlauber aus Deutschland, Österreich und der Schweiz an. Die wunderschöne Küstenstadt am Roten Meer begeistert mit traumhaften Stränden, kristallklarem Wasser, farbenfrohen Korallenriffen und einzigartigen Wüstenlandschaften.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Wer seinen Urlaub in Hurghada verbringt, sollte die schönsten Ausflüge und Touren nicht verpassen. Von entspannten Bootsausflügen über faszinierende Schnorcheltouren bis hin zu aufregenden Quad Safaris bietet Hurghada unvergessliche Erlebnisse für jeden Geschmack.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Auf <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Hurghada Reiseplaner</a> findest du die besten Ausflüge in Hurghada 2025 – sicher, deutschsprachig und zu fairen Preisen.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
</p>
<h4><strong>Warum sind Ausflüge in Hurghada so beliebt?</strong></h4>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Hurghada ist einzigartig, weil hier Meer, Wüste, Abenteuer und Kultur perfekt zusammenkommen. Innerhalb eines einzigen Urlaubs kannst du:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>im Roten Meer schnorcheln</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Delfine beobachten</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>mit dem Quad durch die Wüste fahren</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>historische Tempel entdecken</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>traumhafte Inseln besuchen</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Genau diese Vielfalt macht Hurghada zu einem der besten Urlaubsziele in Ägypten.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":8968,"sizeSlug":"full","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2026/01/IMG-20250808-WA0025.jpg" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:heading -->
</p>
<h3><strong>1.Orange Bay Hurghada – Das Paradies am Roten Meer</strong></h3>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Die Orange Bay zählt zu den schönsten Ausflügen in Hurghada. Der feine weiße Sand, das türkisfarbene Wasser und die entspannte Atmosphäre erinnern an die Malediven.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Dieser Ausflug eignet sich perfekt für:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>Familien</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Paare</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Schnorchel-Fans</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Fotografen</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Die Kombination aus Entspannung und Schnorcheln macht Orange Bay zu einem absoluten Highlight.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":9378,"sizeSlug":"full","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2026/04/86.jpg" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:heading -->
</p>
<h3><strong>2.Quad Safari Hurghada – Das ultimative Wüstenabenteuer</strong></h3>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Eine Quad Safari in Hurghada ist ideal für alle, die Action und Abenteuer suchen.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Erlebe:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>rasante Fahrten durch die Wüste</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>beeindruckende Landschaften</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>einen Besuch im Beduinendorf</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>traditionellen ägyptischen Tee</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>spektakuläre Sonnenuntergänge</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Die Quad Safari gehört zu den meistgebuchten Hurghada Ausflügen.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":8887,"sizeSlug":"large","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2026/01/IMG-20250814-WA0073-1024x683.jpg" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:heading -->
</p>
<h3><strong>3.Schnorcheln in Hurghada – Die faszinierende Unterwasserwelt</strong></h3>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Das Rote Meer zählt zu den schönsten Schnorchelgebieten der Welt.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Beim Schnorcheln in Hurghada entdeckst du:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>bunte Korallenriffe</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>exotische Fischarten</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>kristallklares Wasser</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>einzigartige Unterwasserlandschaften</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Besonders beliebt sind Paradise Island und Giftun Island.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":8814,"sizeSlug":"full","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2026/01/05de47bb-1ef7-4bd2-a83a-b12bbb8b26ef_medium.webp" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:paragraph -->
</p>
<h3 data-section-id="x0t30r" data-start="2783" data-end="2809"><strong>4. Delfin Tour Hurghada</strong></h3>
<p data-start="2811" data-end="2860">Die Delfin Tour ist ein unvergessliches Erlebnis.</p>
<p data-start="2862" data-end="2967">Mit etwas Glück kannst du Delfine in ihrer natürlichen Umgebung beobachten und sogar mit ihnen schwimmen.</p>
<p data-start="2969" data-end="3035">Diese Tour ist besonders beliebt bei Familien und Naturliebhabern.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":6778,"sizeSlug":"full","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2025/10/Private-Tour-to-Luxor-5-870x555-1.webp" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:paragraph -->
</p>
<h3><strong>5. Luxor Tagesausflug ab Hurghada</strong></h3>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Für Kulturinteressierte ist Luxor ein Muss.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Besuche:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>das Tal der Könige</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>den Karnak Tempel</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>den Hatschepsut Tempel</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>den Nil</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Dieser Ausflug zeigt die beeindruckende Geschichte des alten Ägyptens.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":6795,"sizeSlug":"large","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2025/10/aegypten-kairo-pyramiden-von-gizeh-g-1277362064-1024x683.jpg" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:heading -->
</p>
<h3><strong>6.Kairo Ausflug ab Hurghada – Die Pyramiden von Gizeh erleben</strong></h3>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Ein Tagesausflug nach Kairo gehört zu den beeindruckendsten Erlebnissen während eines Hurghada Urlaubs.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Besuche die weltberühmten Pyramiden von Gizeh, die Sphinx und entdecke die faszinierende Geschichte des alten Ägyptens.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Ein Kairo Ausflug ab Hurghada ist perfekt für alle, die die berühmtesten Sehenswürdigkeiten Ägyptens live erleben möchten.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Highlights des Kairo Ausflugs:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>Die Pyramiden von Gizeh</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Die Große Sphinx</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Das Ägyptische Museum</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Spannende Einblicke in die Geschichte Ägyptens</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Dieser Ausflug zählt zu den beliebtesten Kultur-Ausflügen ab Hurghada.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
</p>
<h4><strong>Die besten Tipps für Hurghada Ausflüge</strong></h4>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Für den perfekten Ausflug solltest du:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>frühzeitig buchen</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Sonnenschutz mitnehmen</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>ausreichend Wasser trinken</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>bequeme Kleidung tragen</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>eine Kamera dabeihaben</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:heading -->
</p>
<h4><strong>Warum bei Hurghada Reiseplaner buchen?</strong></h4>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Bei uns profitierst du von:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>deutschsprachigem Service</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>persönlicher Betreuung</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>transparenten Preisen</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>geprüften Touren</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>einfacher Buchung</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Wir helfen dir dabei, die besten Ausflüge in Hurghada zu finden und deinen Urlaub unvergesslich zu machen.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
</p>
<h4><strong>Fazit: Die schönsten Ausflüge in Hurghada 2025</strong></h4>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Hurghada bietet für jeden das passende Erlebnis – egal ob Abenteuer, Entspannung, Schnorcheln oder Kultur.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Wenn du die besten Hurghada Ausflüge suchst, bist du bei Hurghada Reiseplaner genau richtig.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Buche jetzt deine Tour und entdecke die schönsten Seiten des Roten Meeres.</p>
<!-- /wp:paragraph -->', '5 Min', '[]'::jsonb),
('blog_posts', 'bc3112c6-a2e1-4475-997b-39e2a77e228e', 'ar', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Die besten Ausflüge in Hurghada 2025 – Top Sehenswürdigkeiten, Insider-Tipps und unvergessliche Erlebnisse am Roten Meer', 'Die besten Ausflüge in Hurghada 2025 – Top Sehenswürdigkeiten, Insider-Tipps und unvergessliche Erlebnisse am Roten Meer', '<!-- wp:paragraph -->
</p>
<p>Hurghada gehört zu den beliebtesten Reisezielen in Ägypten und zieht jedes Jahr tausende Urlauber aus Deutschland, Österreich und der Schweiz an. Die wunderschöne Küstenstadt am Roten Meer begeistert mit traumhaften Stränden, kristallklarem Wasser, farbenfrohen Korallenriffen und einzigartigen Wüstenlandschaften.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Wer seinen Urlaub in Hurghada verbringt, sollte die schönsten Ausflüge und Touren nicht verpassen. Von entspannten Bootsausflügen über faszinierende Schnorcheltouren bis hin zu aufregenden Quad Safaris bietet Hurghada unvergessliche Erlebnisse für jeden Geschmack.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Auf <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Hurghada Reiseplaner</a> findest du die besten Ausflüge in Hurghada 2025 – sicher, deutschsprachig und zu fairen Preisen.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
</p>
<h4><strong>Warum sind Ausflüge in Hurghada so beliebt?</strong></h4>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Hurghada ist einzigartig, weil hier Meer, Wüste, Abenteuer und Kultur perfekt zusammenkommen. Innerhalb eines einzigen Urlaubs kannst du:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>im Roten Meer schnorcheln</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Delfine beobachten</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>mit dem Quad durch die Wüste fahren</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>historische Tempel entdecken</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>traumhafte Inseln besuchen</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Genau diese Vielfalt macht Hurghada zu einem der besten Urlaubsziele in Ägypten.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":8968,"sizeSlug":"full","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2026/01/IMG-20250808-WA0025.jpg" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:heading -->
</p>
<h3><strong>1.Orange Bay Hurghada – Das Paradies am Roten Meer</strong></h3>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Die Orange Bay zählt zu den schönsten Ausflügen in Hurghada. Der feine weiße Sand, das türkisfarbene Wasser und die entspannte Atmosphäre erinnern an die Malediven.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Dieser Ausflug eignet sich perfekt für:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>Familien</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Paare</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Schnorchel-Fans</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Fotografen</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Die Kombination aus Entspannung und Schnorcheln macht Orange Bay zu einem absoluten Highlight.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":9378,"sizeSlug":"full","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2026/04/86.jpg" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:heading -->
</p>
<h3><strong>2.Quad Safari Hurghada – Das ultimative Wüstenabenteuer</strong></h3>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Eine Quad Safari in Hurghada ist ideal für alle, die Action und Abenteuer suchen.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Erlebe:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>rasante Fahrten durch die Wüste</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>beeindruckende Landschaften</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>einen Besuch im Beduinendorf</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>traditionellen ägyptischen Tee</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>spektakuläre Sonnenuntergänge</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Die Quad Safari gehört zu den meistgebuchten Hurghada Ausflügen.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":8887,"sizeSlug":"large","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2026/01/IMG-20250814-WA0073-1024x683.jpg" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:heading -->
</p>
<h3><strong>3.Schnorcheln in Hurghada – Die faszinierende Unterwasserwelt</strong></h3>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Das Rote Meer zählt zu den schönsten Schnorchelgebieten der Welt.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Beim Schnorcheln in Hurghada entdeckst du:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>bunte Korallenriffe</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>exotische Fischarten</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>kristallklares Wasser</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>einzigartige Unterwasserlandschaften</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Besonders beliebt sind Paradise Island und Giftun Island.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":8814,"sizeSlug":"full","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2026/01/05de47bb-1ef7-4bd2-a83a-b12bbb8b26ef_medium.webp" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:paragraph -->
</p>
<h3 data-section-id="x0t30r" data-start="2783" data-end="2809"><strong>4. Delfin Tour Hurghada</strong></h3>
<p data-start="2811" data-end="2860">Die Delfin Tour ist ein unvergessliches Erlebnis.</p>
<p data-start="2862" data-end="2967">Mit etwas Glück kannst du Delfine in ihrer natürlichen Umgebung beobachten und sogar mit ihnen schwimmen.</p>
<p data-start="2969" data-end="3035">Diese Tour ist besonders beliebt bei Familien und Naturliebhabern.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":6778,"sizeSlug":"full","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2025/10/Private-Tour-to-Luxor-5-870x555-1.webp" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:paragraph -->
</p>
<h3><strong>5. Luxor Tagesausflug ab Hurghada</strong></h3>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Für Kulturinteressierte ist Luxor ein Muss.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Besuche:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>das Tal der Könige</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>den Karnak Tempel</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>den Hatschepsut Tempel</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>den Nil</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Dieser Ausflug zeigt die beeindruckende Geschichte des alten Ägyptens.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":6795,"sizeSlug":"large","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2025/10/aegypten-kairo-pyramiden-von-gizeh-g-1277362064-1024x683.jpg" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:heading -->
</p>
<h3><strong>6.Kairo Ausflug ab Hurghada – Die Pyramiden von Gizeh erleben</strong></h3>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Ein Tagesausflug nach Kairo gehört zu den beeindruckendsten Erlebnissen während eines Hurghada Urlaubs.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Besuche die weltberühmten Pyramiden von Gizeh, die Sphinx und entdecke die faszinierende Geschichte des alten Ägyptens.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Ein Kairo Ausflug ab Hurghada ist perfekt für alle, die die berühmtesten Sehenswürdigkeiten Ägyptens live erleben möchten.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Highlights des Kairo Ausflugs:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>Die Pyramiden von Gizeh</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Die Große Sphinx</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Das Ägyptische Museum</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Spannende Einblicke in die Geschichte Ägyptens</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Dieser Ausflug zählt zu den beliebtesten Kultur-Ausflügen ab Hurghada.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
</p>
<h4><strong>Die besten Tipps für Hurghada Ausflüge</strong></h4>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Für den perfekten Ausflug solltest du:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>frühzeitig buchen</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Sonnenschutz mitnehmen</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>ausreichend Wasser trinken</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>bequeme Kleidung tragen</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>eine Kamera dabeihaben</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:heading -->
</p>
<h4><strong>Warum bei Hurghada Reiseplaner buchen?</strong></h4>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Bei uns profitierst du von:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>deutschsprachigem Service</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>persönlicher Betreuung</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>transparenten Preisen</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>geprüften Touren</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>einfacher Buchung</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Wir helfen dir dabei, die besten Ausflüge in Hurghada zu finden und deinen Urlaub unvergesslich zu machen.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
</p>
<h4><strong>Fazit: Die schönsten Ausflüge in Hurghada 2025</strong></h4>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Hurghada bietet für jeden das passende Erlebnis – egal ob Abenteuer, Entspannung, Schnorcheln oder Kultur.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Wenn du die besten Hurghada Ausflüge suchst, bist du bei Hurghada Reiseplaner genau richtig.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Buche jetzt deine Tour und entdecke die schönsten Seiten des Roten Meeres.</p>
<!-- /wp:paragraph -->', '5 Min', '[]'::jsonb),
('blog_posts', 'bc3112c6-a2e1-4475-997b-39e2a77e228e', 'hu', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Die besten Ausflüge in Hurghada 2025 – Top Sehenswürdigkeiten, Insider-Tipps und unvergessliche Erlebnisse am Roten Meer', 'Die besten Ausflüge in Hurghada 2025 – Top Sehenswürdigkeiten, Insider-Tipps und unvergessliche Erlebnisse am Roten Meer', '<!-- wp:paragraph -->
</p>
<p>Hurghada gehört zu den beliebtesten Reisezielen in Ägypten und zieht jedes Jahr tausende Urlauber aus Deutschland, Österreich und der Schweiz an. Die wunderschöne Küstenstadt am Roten Meer begeistert mit traumhaften Stränden, kristallklarem Wasser, farbenfrohen Korallenriffen und einzigartigen Wüstenlandschaften.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Wer seinen Urlaub in Hurghada verbringt, sollte die schönsten Ausflüge und Touren nicht verpassen. Von entspannten Bootsausflügen über faszinierende Schnorcheltouren bis hin zu aufregenden Quad Safaris bietet Hurghada unvergessliche Erlebnisse für jeden Geschmack.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Auf <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Hurghada Reiseplaner</a> findest du die besten Ausflüge in Hurghada 2025 – sicher, deutschsprachig und zu fairen Preisen.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
</p>
<h4><strong>Warum sind Ausflüge in Hurghada so beliebt?</strong></h4>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Hurghada ist einzigartig, weil hier Meer, Wüste, Abenteuer und Kultur perfekt zusammenkommen. Innerhalb eines einzigen Urlaubs kannst du:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>im Roten Meer schnorcheln</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Delfine beobachten</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>mit dem Quad durch die Wüste fahren</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>historische Tempel entdecken</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>traumhafte Inseln besuchen</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Genau diese Vielfalt macht Hurghada zu einem der besten Urlaubsziele in Ägypten.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":8968,"sizeSlug":"full","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2026/01/IMG-20250808-WA0025.jpg" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:heading -->
</p>
<h3><strong>1.Orange Bay Hurghada – Das Paradies am Roten Meer</strong></h3>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Die Orange Bay zählt zu den schönsten Ausflügen in Hurghada. Der feine weiße Sand, das türkisfarbene Wasser und die entspannte Atmosphäre erinnern an die Malediven.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Dieser Ausflug eignet sich perfekt für:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>Familien</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Paare</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Schnorchel-Fans</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Fotografen</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Die Kombination aus Entspannung und Schnorcheln macht Orange Bay zu einem absoluten Highlight.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":9378,"sizeSlug":"full","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2026/04/86.jpg" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:heading -->
</p>
<h3><strong>2.Quad Safari Hurghada – Das ultimative Wüstenabenteuer</strong></h3>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Eine Quad Safari in Hurghada ist ideal für alle, die Action und Abenteuer suchen.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Erlebe:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>rasante Fahrten durch die Wüste</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>beeindruckende Landschaften</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>einen Besuch im Beduinendorf</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>traditionellen ägyptischen Tee</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>spektakuläre Sonnenuntergänge</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Die Quad Safari gehört zu den meistgebuchten Hurghada Ausflügen.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":8887,"sizeSlug":"large","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2026/01/IMG-20250814-WA0073-1024x683.jpg" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:heading -->
</p>
<h3><strong>3.Schnorcheln in Hurghada – Die faszinierende Unterwasserwelt</strong></h3>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Das Rote Meer zählt zu den schönsten Schnorchelgebieten der Welt.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Beim Schnorcheln in Hurghada entdeckst du:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>bunte Korallenriffe</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>exotische Fischarten</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>kristallklares Wasser</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>einzigartige Unterwasserlandschaften</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Besonders beliebt sind Paradise Island und Giftun Island.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":8814,"sizeSlug":"full","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2026/01/05de47bb-1ef7-4bd2-a83a-b12bbb8b26ef_medium.webp" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:paragraph -->
</p>
<h3 data-section-id="x0t30r" data-start="2783" data-end="2809"><strong>4. Delfin Tour Hurghada</strong></h3>
<p data-start="2811" data-end="2860">Die Delfin Tour ist ein unvergessliches Erlebnis.</p>
<p data-start="2862" data-end="2967">Mit etwas Glück kannst du Delfine in ihrer natürlichen Umgebung beobachten und sogar mit ihnen schwimmen.</p>
<p data-start="2969" data-end="3035">Diese Tour ist besonders beliebt bei Familien und Naturliebhabern.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":6778,"sizeSlug":"full","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2025/10/Private-Tour-to-Luxor-5-870x555-1.webp" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:paragraph -->
</p>
<h3><strong>5. Luxor Tagesausflug ab Hurghada</strong></h3>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Für Kulturinteressierte ist Luxor ein Muss.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Besuche:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>das Tal der Könige</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>den Karnak Tempel</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>den Hatschepsut Tempel</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>den Nil</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Dieser Ausflug zeigt die beeindruckende Geschichte des alten Ägyptens.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":6795,"sizeSlug":"large","linkDestination":"none"} -->
</p>
<figure><img src="https://hurghada-reiseplaner.at/wp-content/uploads/2025/10/aegypten-kairo-pyramiden-von-gizeh-g-1277362064-1024x683.jpg" alt="" /></figure>
<p>
<!-- /wp:image -->

<!-- wp:heading -->
</p>
<h3><strong>6.Kairo Ausflug ab Hurghada – Die Pyramiden von Gizeh erleben</strong></h3>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Ein Tagesausflug nach Kairo gehört zu den beeindruckendsten Erlebnissen während eines Hurghada Urlaubs.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Besuche die weltberühmten Pyramiden von Gizeh, die Sphinx und entdecke die faszinierende Geschichte des alten Ägyptens.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Ein Kairo Ausflug ab Hurghada ist perfekt für alle, die die berühmtesten Sehenswürdigkeiten Ägyptens live erleben möchten.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Highlights des Kairo Ausflugs:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>Die Pyramiden von Gizeh</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Die Große Sphinx</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Das Ägyptische Museum</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Spannende Einblicke in die Geschichte Ägyptens</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Dieser Ausflug zählt zu den beliebtesten Kultur-Ausflügen ab Hurghada.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
</p>
<h4><strong>Die besten Tipps für Hurghada Ausflüge</strong></h4>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Für den perfekten Ausflug solltest du:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>frühzeitig buchen</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>Sonnenschutz mitnehmen</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>ausreichend Wasser trinken</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>bequeme Kleidung tragen</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>eine Kamera dabeihaben</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:heading -->
</p>
<h4><strong>Warum bei Hurghada Reiseplaner buchen?</strong></h4>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Bei uns profitierst du von:</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:list -->
</p>
<ul>
<!-- wp:list-item -->
<li>deutschsprachigem Service</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>persönlicher Betreuung</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>transparenten Preisen</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>geprüften Touren</li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li>einfacher Buchung</li>
<!-- /wp:list-item -->
</ul>
<p>
<!-- /wp:list -->

<!-- wp:paragraph -->
</p>
<p>Wir helfen dir dabei, die besten Ausflüge in Hurghada zu finden und deinen Urlaub unvergesslich zu machen.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
</p>
<h4><strong>Fazit: Die schönsten Ausflüge in Hurghada 2025</strong></h4>
<p>
<!-- /wp:heading -->

<!-- wp:paragraph -->
</p>
<p>Hurghada bietet für jeden das passende Erlebnis – egal ob Abenteuer, Entspannung, Schnorcheln oder Kultur.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Wenn du die besten Hurghada Ausflüge suchst, bist du bei Hurghada Reiseplaner genau richtig.</p>
<p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
</p>
<p>Buche jetzt deine Tour und entdecke die schönsten Seiten des Roten Meeres.</p>
<!-- /wp:paragraph -->', '5 Min', '[]'::jsonb),
('blog_posts', '47f7dda0-2b6f-475c-be26-a01bd5debd08', 'en', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Pyramids of Giza from Hurghada: An unforgettable Cairo excursion at sunrise', 'Pyramids of Giza from Hurghada – An unforgettable Cairo excursion at sunrise', '<!-- wp:paragraph -->
<p>A Cairo excursion from Hurghada is one of the most impressive experiences during a vacation in Egypt. Witnessing the world-famous Pyramids of Giza at sunrise is a magical moment you will never forget.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>The first rays of sun bathe the massive buildings in golden light and make this place one of the most fascinating travel destinations in the world.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>If you spend your vacation in Hurghada, you shouldn''t miss this unique adventure.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>With the professionally organized Cairo excursions from <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Hurghada travel planner</a> you can discover Egypt''s most important sights safely and comfortably.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Why is a Cairo excursion from Hurghada so special?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Cairo is the historic heart of Egypt and home to some of the most impressive buildings in human history.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>A day trip to Cairo allows you to see the country''s most famous landmarks with your own eyes.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>The highlights include:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>The Pyramids of Giza</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>The Great Sphinx</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>The Egyptian Museum</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>The fascinating story of the pharaohs</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Breathtaking views over the desert</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>A Cairo excursion combines history, culture and unforgettable impressions.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>The Pyramids of Giza – The Last Wonder of the Ancient World</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>The pyramids of Giza are among the most famous buildings in the world and are one of the seven wonders of the ancient world.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>The gigantic structures were built more than 4,500 years ago and continue to fascinate visitors today.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>The three main pyramids:</p>
<p><!-- /wp:paragraph --><!-- wp:heading {"level":3} --></p>
<h4><strong>The Cheops Pyramid</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>The largest and most famous pyramid in Egypt.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>It impresses with its monumental size and mysterious construction.</p>
<p><!-- /wp:paragraph --><!-- wp:heading {"level":3} --></p>
<h4><strong>The Pyramid of Chephren</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Known for its partially preserved limestone cladding.</p>
<p><!-- /wp:paragraph --><!-- wp:heading {"level":3} --></p>
<h4><strong>The Menkaure Pyramid</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>The smallest of the three great pyramids, but still impressive.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>The Great Sphinx of Giza</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Right next to the pyramids is the world-famous Sphinx.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>With its lion body and human head, it is one of the most mysterious monuments in Egypt.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>To this day, there are numerous legends surrounding its creation.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Sunrise at the pyramids – a magical moment</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Experience the pyramids at sunrise is an unforgettable experience.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>When the sun slowly rises over the desert and bathes the monumental buildings in golden light, a unique atmosphere is created.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>This moment is one of the most beautiful experiences of a Cairo excursion from Hurghada.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>The Egyptian Museum in Cairo</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Another highlight is the famous Egyptian Museum.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Here you can marvel at countless treasures of ancient Egypt, including:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>The gold mask of Tutankhamun</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Ancient mummies</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Royal Artifacts</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Historical Treasures of the Pharaohs</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Tips for your Cairo trip from Hurghada</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>To make your trip perfect, you should:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>go to sleep early</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>wear comfortable clothing</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>take enough water with you</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Don''t forget sun protection</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Have your camera or cell phone ready</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Why book a travel planner with Hurghada?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>With Hurghada Travel Planner you benefit from:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>German-speaking support</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>secure transfers</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>fair prices</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>professional organization</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>unforgettable experiences</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Conclusion: A trip to Cairo is an absolute highlight</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>The pyramids of Giza are among the most impressive sights in the world.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>A Cairo excursion from Hurghada offers you the unique opportunity to experience the secrets of ancient Egypt up close.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Book your trip now and discover the magic of the Pyramids of Giza.</p>
<!-- /wp:paragraph -->', '5 mins', '[]'::jsonb),
('blog_posts', '47f7dda0-2b6f-475c-be26-a01bd5debd08', 'ru', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Пирамиды Гизы из Хургады: незабываемая экскурсия в Каир на рассвете
---ЦЭП---
Пирамиды Гизы из Хургады – незабываемая экскурсия в Каир на рассвете
---ЦЭП---
5 минут
---ЦЭП---
<!-- wp:абзац -->
<p>Экскурсия в Каир из Хургады – одно из самых впечатляющих впечатлений во время отдыха в Египте. Увидеть всемирно известные пирамиды Гизы на рассвете — это волшебный момент, который вы никогда не забудете.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Первые лучи солнца заливают массивные здания золотым светом и делают это место одним из самых увлекательных туристических направлений в мире.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Если вы проведете отпуск в Хургаде, вы не должны пропустить это уникальное приключение.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>С профессионально организованными экскурсиями по Каиру от <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Планировщик путешествий по Хургаде</a> вы можете безопасно и комфортно открыть для себя самые важные достопримечательности Египта.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Почему экскурсия в Каир из Хургады такая особенная?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Каир – историческое сердце Египта, где расположены одни из самых впечатляющих зданий в истории человечества.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Однодневная поездка в Каир позволит вам увидеть самые известные достопримечательности страны своими глазами.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Основные моменты:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Пирамиды Гизы</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Большой Сфинкс</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Египетский музей</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Увлекательная история фараонов.</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Захватывающий вид на пустыню.</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>Экскурсия в Каире сочетает в себе историю, культуру и незабываемые впечатления.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Пирамиды Гизы – последнее чудо древнего мира</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Пирамиды Гизы входят в число самых известных сооружений мира и входят в число семи чудес древнего мира.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Гигантские сооружения были построены более 4500 лет назад и продолжают очаровывать посетителей и сегодня.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Три основные пирамиды:</p>
<p><!-- /wp:paragraph --><!-- wp:heading {"level":3} --></p>
<h4><strong>Пирамида Хеопса</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Самая большая и известная пирамида Египта.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Он впечатляет своими монументальными размерами и загадочной конструкцией.</p>
<p><!-- /wp:paragraph --><!-- wp:heading {"level":3} --></p>
<h4><strong>Пирамида Хефрена</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Известен частично сохранившейся облицовкой из известняка.</p>
<p><!-- /wp:paragraph --><!-- wp:heading {"level":3} --></p>
<h4><strong>Пирамида Менкаура</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Самая маленькая из трех великих пирамид, но все равно впечатляющая.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Большой Сфинкс в Гизе</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Рядом с пирамидами находится всемирно известный Сфинкс.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Этот памятник с телом льва и человеческой головой является одним из самых загадочных памятников Египта.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>До сих пор вокруг его создания ходит множество легенд.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Рассвет у пирамид – волшебный момент</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Видеть пирамиды на рассвете — это незабываемые впечатления.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Когда солнце медленно поднимается над пустыней и заливает монументальные здания золотым светом, создается уникальная атмосфера.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Этот момент — одно из самых прекрасных впечатлений во время экскурсии в Каир из Хургады.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Египетский музей в Каире</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Еще одна достопримечательность — знаменитый Египетский музей.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Здесь вы сможете полюбоваться бесчисленными сокровищами Древнего Египта, среди которых:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Золотая маска Тутанхамона</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Древние мумии</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Королевские артефакты</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Исторические сокровища фараонов</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Советы по поездке в Каир из Хургады</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Чтобы сделать ваше путешествие идеальным, вам следует:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>ложиться спать пораньше</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>носить удобную одежду.</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>берите с собой достаточно воды</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Не забывайте о защите от солнца.</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Подготовьте камеру или мобильный телефон.</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Зачем заказывать планировщик путешествий в Хургаде?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>С Hurghada Travel Planner вы получаете следующие преимущества:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Немецкоязычная поддержка.</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>безопасные переводы</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>справедливые цены</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>профессиональная организация</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>незабываемые впечатления</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Вывод: поездка в Каир — это незабываемое событие</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Пирамиды Гизы — одни из самых впечатляющих достопримечательностей в мире.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Экскурсия в Каир из Хургады предлагает вам уникальную возможность поближе познакомиться с тайнами Древнего Египта.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Забронируйте поездку сейчас и откройте для себя волшебство пирамид Гизы.</p>
<!-- /wp:абзац -->', 'Pyramiden von Gizeh ab Hurghada – Ein unvergesslicher Kairo Ausflug bei Sonnenaufgang', '<!-- wp:paragraph -->
<p>Ein Kairo Ausflug ab Hurghada gehört zu den beeindruckendsten Erlebnissen während eines Urlaubs in Ägypten. Die weltberühmten Pyramiden von Gizeh bei Sonnenaufgang zu erleben, ist ein magischer Moment, den du niemals vergessen wirst.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Die ersten Sonnenstrahlen tauchen die gewaltigen Bauwerke in goldenes Licht und machen diesen Ort zu einem der faszinierendsten Reiseziele der Welt.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Wer seinen Urlaub in Hurghada verbringt, sollte sich dieses einmalige Abenteuer nicht entgehen lassen.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Mit den professionell organisierten Kairo Ausflügen von <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Hurghada Reiseplaner</a> entdeckst du die bedeutendsten Sehenswürdigkeiten Ägyptens sicher und komfortabel.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Warum ist ein Kairo Ausflug ab Hurghada so besonders?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Kairo ist das historische Herz Ägyptens und Heimat einiger der beeindruckendsten Bauwerke der Menschheitsgeschichte.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Ein Tagesausflug nach Kairo ermöglicht dir, die berühmtesten Wahrzeichen des Landes mit eigenen Augen zu sehen.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Zu den Highlights gehören:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Die Pyramiden von Gizeh</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Die Große Sphinx</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Das Ägyptische Museum</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Die faszinierende Geschichte der Pharaonen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Atemberaubende Ausblicke über die Wüste</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>Ein Kairo Ausflug verbindet Geschichte, Kultur und unvergessliche Eindrücke.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Die Pyramiden von Gizeh – Das letzte Weltwunder der Antike</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Die Pyramiden von Gizeh zählen zu den bekanntesten Bauwerken der Welt und gehören zu den sieben Weltwundern der Antike.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Die gigantischen Bauwerke wurden vor mehr als 4.500 Jahren errichtet und faszinieren Besucher bis heute.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Die drei Hauptpyramiden:</p>
<p><!-- /wp:paragraph --><!-- wp:heading {"level":3} --></p>
<h4><strong>Die Cheops-Pyramide</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Die größte und berühmteste Pyramide Ägyptens.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Sie beeindruckt durch ihre monumentale Größe und ihre geheimnisvolle Bauweise.</p>
<p><!-- /wp:paragraph --><!-- wp:heading {"level":3} --></p>
<h4><strong>Die Chephren-Pyramide</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Bekannt durch ihre teilweise erhaltene Kalksteinverkleidung.</p>
<p><!-- /wp:paragraph --><!-- wp:heading {"level":3} --></p>
<h4><strong>Die Mykerinos-Pyramide</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Die kleinste der drei großen Pyramiden, aber dennoch beeindruckend.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Die Große Sphinx von Gizeh</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Direkt neben den Pyramiden befindet sich die weltberühmte Sphinx.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Mit ihrem Löwenkörper und dem menschlichen Kopf zählt sie zu den geheimnisvollsten Monumenten Ägyptens.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Bis heute ranken sich zahlreiche Legenden um ihre Entstehung.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Sonnenaufgang bei den Pyramiden – Ein magischer Moment</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Die Pyramiden bei Sonnenaufgang zu erleben, ist ein unvergessliches Erlebnis.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Wenn die Sonne langsam über der Wüste aufgeht und die monumentalen Bauwerke in goldenes Licht taucht, entsteht eine einzigartige Atmosphäre.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Dieser Moment gehört zu den schönsten Erlebnissen eines Kairo Ausflugs ab Hurghada.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Das Ägyptische Museum in Kairo</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Ein weiteres Highlight ist das berühmte Ägyptische Museum.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Hier kannst du unzählige Schätze des alten Ägyptens bestaunen, darunter:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Die Goldmaske des Tutanchamun</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Antike Mumien</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Königliche Artefakte</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Historische Schätze der Pharaonen</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Tipps für deinen Kairo Ausflug ab Hurghada</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Damit dein Ausflug perfekt wird, solltest du:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>früh schlafen gehen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>bequeme Kleidung tragen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>ausreichend Wasser mitnehmen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Sonnenschutz nicht vergessen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Kamera oder Handy bereithalten</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Warum bei Hurghada Reiseplaner buchen?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Bei Hurghada Reiseplaner profitierst du von:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>deutschsprachiger Betreuung</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>sicheren Transfers</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>fairen Preisen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>professioneller Organisation</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>unvergesslichen Erlebnissen</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Fazit: Ein Kairo Ausflug ist ein absolutes Highlight</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Die Pyramiden von Gizeh gehören zu den beeindruckendsten Sehenswürdigkeiten der Welt.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Ein Kairo Ausflug ab Hurghada bietet dir die einmalige Gelegenheit, die Geheimnisse des alten Ägyptens hautnah zu erleben.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Buche jetzt deinen Ausflug und entdecke die Magie der Pyramiden von Gizeh.</p>
<!-- /wp:paragraph -->', '5 Min', '[]'::jsonb),
('blog_posts', '47f7dda0-2b6f-475c-be26-a01bd5debd08', 'fr', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Pyramides de Gizeh depuis Hurghada : Une excursion inoubliable au Caire au lever du soleil', 'Pyramides de Gizeh depuis Hurghada – Une excursion inoubliable au Caire au lever du soleil', '<!-- wp:paragraphe -->
<p>Une excursion au Caire depuis Hurghada est l''une des expériences les plus impressionnantes lors de vacances en Égypte. Assister aux célèbres pyramides de Gizeh au lever du soleil est un moment magique que vous n''oublierez jamais.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Les premiers rayons du soleil baignent les bâtiments massifs d''une lumière dorée et font de cet endroit l''une des destinations de voyage les plus fascinantes au monde.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Si vous passez vos vacances à Hurghada, vous ne devriez pas manquer cette aventure unique.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Avec les excursions organisées par des professionnels au Caire depuis <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Planificateur de voyage Hurghada</a> vous permet de découvrir les sites les plus importants d''Égypte en toute sécurité et confortablement.</p>
<p><!-- /wp:paragraphe --><!-- wp:titre --></p>
<h4><strong>Pourquoi une excursion au Caire depuis Hurghada est-elle si spéciale ?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Le Caire est le cœur historique de l''Égypte et abrite certains des bâtiments les plus impressionnants de l''histoire de l''humanité.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Une excursion d''une journée au Caire vous permet de voir de vos propres yeux les monuments les plus célèbres du pays.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Les points forts incluent :</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Les pyramides de Gizeh</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Le Grand Sphinx</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Le Musée égyptien</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>L''histoire fascinante des pharaons</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Vues imprenables sur le désert</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraphe --></p>
<p>Une excursion au Caire allie histoire, culture et impressions inoubliables.</p>
<p><!-- /wp:paragraphe --><!-- wp:titre --></p>
<h4><strong>Les pyramides de Gizeh – La dernière merveille du monde antique</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Les pyramides de Gizeh comptent parmi les bâtiments les plus célèbres au monde et constituent l''une des sept merveilles du monde antique.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Les structures gigantesques ont été construites il y a plus de 4 500 ans et continuent de fasciner les visiteurs aujourd''hui.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Les trois pyramides principales :</p>
<p><!-- /wp:paragraph --><!-- wp:heading {"level":3} --></p>
<h4><strong>La pyramide de Khéops</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>La pyramide la plus grande et la plus célèbre d''Égypte.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Il impressionne par sa taille monumentale et sa construction mystérieuse.</p>
<p><!-- /wp:paragraph --><!-- wp:heading {"level":3} --></p>
<h4><strong>La Pyramide de Khéphren</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Connu pour son revêtement en calcaire partiellement préservé.</p>
<p><!-- /wp:paragraph --><!-- wp:heading {"level":3} --></p>
<h4><strong>La pyramide de Menkaourê</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>La plus petite des trois grandes pyramides, mais toujours impressionnante.</p>
<p><!-- /wp:paragraphe --><!-- wp:titre --></p>
<h4><strong>Le Grand Sphinx de Gizeh</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Juste à côté des pyramides se trouve le Sphinx de renommée mondiale.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Avec son corps de lion et sa tête humaine, c''est l''un des monuments les plus mystérieux d''Egypte.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>À ce jour, de nombreuses légendes entourent sa création.</p>
<p><!-- /wp:paragraphe --><!-- wp:titre --></p>
<h4><strong>Lever de soleil aux pyramides – un moment magique</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Découvrir les pyramides au lever du soleil est une expérience inoubliable.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Lorsque le soleil se lève lentement sur le désert et baigne les bâtiments monumentaux d''une lumière dorée, une atmosphère unique se crée.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Ce moment est l''une des plus belles expériences d''une excursion au Caire depuis Hurghada.</p>
<p><!-- /wp:paragraphe --><!-- wp:titre --></p>
<h4><strong>Le Musée égyptien du Caire</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Un autre point fort est le célèbre musée égyptien.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Ici, vous pourrez admirer d''innombrables trésors de l''Égypte ancienne, notamment :</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Le masque d''or de Toutankhamon</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Momies anciennes</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Artefacts royaux</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Trésors historiques des pharaons</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Conseils pour votre voyage au Caire depuis Hurghada</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Pour que votre voyage soit parfait, vous devez :</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>couche-toi tôt</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>portez des vêtements confortables</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>emportez suffisamment d''eau avec vous</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>N''oubliez pas la protection solaire</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Préparez votre appareil photo ou votre téléphone portable</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Pourquoi réserver un planificateur de voyage avec Hurghada ?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Avec Hurghada Travel Planner, vous bénéficiez de :</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Assistance germanophone</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>transferts sécurisés</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>des prix équitables</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>organisation professionnelle</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>des expériences inoubliables</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Conclusion : Un voyage au Caire est un moment fort absolu</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Les pyramides de Gizeh comptent parmi les sites les plus impressionnants au monde.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Une excursion au Caire depuis Hurghada vous offre l''occasion unique de découvrir de près les secrets de l''Égypte ancienne.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Réservez votre voyage maintenant et découvrez la magie des pyramides de Gizeh.</p>
<!-- /wp:paragraphe -->', '5 minutes', '[]'::jsonb),
('blog_posts', '47f7dda0-2b6f-475c-be26-a01bd5debd08', 'ar', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'أهرامات الجيزة من الغردقة: رحلة لا تنسى في القاهرة عند شروق الشمس
--- تسيب ---
أهرامات الجيزة من الغردقة - رحلة لا تنسى في القاهرة عند شروق الشمس
--- تسيب ---
5 دقائق
--- تسيب ---
<!-- wp:paragraph -->
<p>تعد رحلة القاهرة من الغردقة واحدة من أكثر التجارب إثارة للإعجاب خلال عطلة في مصر. إن مشاهدة أهرامات الجيزة المشهورة عالميًا عند شروق الشمس هي لحظة سحرية لن تنساها أبدًا.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>تغمر أشعة الشمس الأولى المباني الضخمة بالضوء الذهبي وتجعل من هذا المكان واحدًا من أروع وجهات السفر في العالم.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>إذا قضيت إجازتك في الغردقة، فلا ينبغي أن تفوتك هذه المغامرة الفريدة.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>مع رحلات القاهرة المنظمة بشكل احترافي من <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">مخطط رحلات الغردقة</a> يمكنك اكتشاف أهم المعالم السياحية في مصر بأمان وراحة.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>لماذا تعتبر رحلة القاهرة من الغردقة مميزة جدًا؟</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>تعد القاهرة القلب التاريخي لمصر وموطنًا لبعض المباني الأكثر إثارة للإعجاب في تاريخ البشرية.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>تتيح لك رحلة ليوم واحد إلى القاهرة رؤية أشهر معالم البلاد بأم عينيك.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>وتشمل النقاط البارزة ما يلي:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>أهرامات الجيزة</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>أبو الهول</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>المتحف المصري</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>قصة الفراعنة الرائعة</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>مناظر خلابة للصحراء</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>تجمع رحلة القاهرة بين التاريخ والثقافة والانطباعات التي لا تُنسى.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>أهرامات الجيزة – آخر عجائب العالم القديم</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>تعتبر أهرامات الجيزة من أشهر المباني في العالم وهي إحدى عجائب الدنيا السبع في العالم القديم.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>تم بناء هذه الهياكل الضخمة منذ أكثر من 4500 عام وما زالت تبهر الزوار حتى يومنا هذا.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>الأهرامات الثلاثة الرئيسية:</p>
<p><!-- /wp:paragraph --><!-- wp:heading {"level":3} --></p>
<h4><strong>هرم خوفو</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>أكبر وأشهر هرم في مصر</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>إنه مثير للإعجاب بحجمه الضخم وبنيته الغامضة.</p>
<p><!-- /wp:paragraph --><!-- wp:heading {"level":3} --></p>
<h4><strong>هرم خفرع</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>تشتهر بكسوتها المصنوعة من الحجر الجيري المحفوظة جزئيًا.</p>
<p><!-- /wp:paragraph --><!-- wp:heading {"level":3} --></p>
<h4><strong>هرم منقرع</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>الأهرامات الأصغر حجمًا من بين الأهرامات الثلاثة الكبرى، ولكنها لا تزال مثيرة للإعجاب.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>تمثال أبو الهول بالجيزة</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>بجوار الأهرامات مباشرةً يوجد تمثال أبو الهول الشهير عالميًا.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>بجسمه الأسدي ورأسه البشري، يعد من أكثر المعالم الأثرية غموضًا في مصر.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>حتى يومنا هذا، هناك العديد من الأساطير المحيطة بإنشائه.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>شروق الشمس عند الأهرامات – لحظة سحرية</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>تجربة الأهرامات عند شروق الشمس تجربة لا تنسى.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>عندما تشرق الشمس ببطء فوق الصحراء وتغمر المباني الأثرية بالضوء الذهبي، يتم إنشاء جو فريد من نوعه.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>تعد هذه اللحظة من أجمل تجارب رحلة القاهرة من الغردقة.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>المتحف المصري بالقاهرة</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>ومن المعالم البارزة الأخرى المتحف المصري الشهير.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>هنا يمكنك أن تتعجب من عدد لا يحصى من كنوز مصر القديمة، بما في ذلك:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>القناع الذهبي لتوت عنخ آمون</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>المومياوات القديمة</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>التحف الملكية</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>كنوز الفراعنة التاريخية</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>نصائح لرحلتك إلى القاهرة من الغردقة</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>لجعل رحلتك مثالية، يجب عليك:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>اذهب إلى النوم مبكرًا</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>ارتداء ملابس مريحة</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>خذ معك كمية كافية من الماء</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>لا تنس الحماية من الشمس</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>جهز الكاميرا أو الهاتف الخلوي</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>لماذا تحجز مخطط سفر إلى الغردقة؟</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>مع تطبيق Hurghada Travel Planner يمكنك الاستفادة من:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>دعم التحدث باللغة الألمانية</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>التحويلات الآمنة</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>أسعار عادلة</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>المنظمة المهنية</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>تجارب لا تُنسى</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>الخلاصة: تعتبر الرحلة إلى القاهرة حدثًا مميزًا للغاية</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>تعد أهرامات الجيزة من أكثر المعالم السياحية إثارة للإعجاب في العالم.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>توفر لك رحلة إلى القاهرة من الغردقة فرصة فريدة لتجربة أسرار مصر القديمة عن قرب.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>احجز رحلتك الآن واكتشف سحر أهرامات الجيزة.</p>
<!-- /wp:paragraph -->', 'Pyramiden von Gizeh ab Hurghada – Ein unvergesslicher Kairo Ausflug bei Sonnenaufgang', '<!-- wp:paragraph -->
<p>Ein Kairo Ausflug ab Hurghada gehört zu den beeindruckendsten Erlebnissen während eines Urlaubs in Ägypten. Die weltberühmten Pyramiden von Gizeh bei Sonnenaufgang zu erleben, ist ein magischer Moment, den du niemals vergessen wirst.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Die ersten Sonnenstrahlen tauchen die gewaltigen Bauwerke in goldenes Licht und machen diesen Ort zu einem der faszinierendsten Reiseziele der Welt.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Wer seinen Urlaub in Hurghada verbringt, sollte sich dieses einmalige Abenteuer nicht entgehen lassen.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Mit den professionell organisierten Kairo Ausflügen von <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Hurghada Reiseplaner</a> entdeckst du die bedeutendsten Sehenswürdigkeiten Ägyptens sicher und komfortabel.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Warum ist ein Kairo Ausflug ab Hurghada so besonders?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Kairo ist das historische Herz Ägyptens und Heimat einiger der beeindruckendsten Bauwerke der Menschheitsgeschichte.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Ein Tagesausflug nach Kairo ermöglicht dir, die berühmtesten Wahrzeichen des Landes mit eigenen Augen zu sehen.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Zu den Highlights gehören:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Die Pyramiden von Gizeh</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Die Große Sphinx</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Das Ägyptische Museum</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Die faszinierende Geschichte der Pharaonen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Atemberaubende Ausblicke über die Wüste</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>Ein Kairo Ausflug verbindet Geschichte, Kultur und unvergessliche Eindrücke.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Die Pyramiden von Gizeh – Das letzte Weltwunder der Antike</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Die Pyramiden von Gizeh zählen zu den bekanntesten Bauwerken der Welt und gehören zu den sieben Weltwundern der Antike.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Die gigantischen Bauwerke wurden vor mehr als 4.500 Jahren errichtet und faszinieren Besucher bis heute.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Die drei Hauptpyramiden:</p>
<p><!-- /wp:paragraph --><!-- wp:heading {"level":3} --></p>
<h4><strong>Die Cheops-Pyramide</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Die größte und berühmteste Pyramide Ägyptens.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Sie beeindruckt durch ihre monumentale Größe und ihre geheimnisvolle Bauweise.</p>
<p><!-- /wp:paragraph --><!-- wp:heading {"level":3} --></p>
<h4><strong>Die Chephren-Pyramide</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Bekannt durch ihre teilweise erhaltene Kalksteinverkleidung.</p>
<p><!-- /wp:paragraph --><!-- wp:heading {"level":3} --></p>
<h4><strong>Die Mykerinos-Pyramide</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Die kleinste der drei großen Pyramiden, aber dennoch beeindruckend.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Die Große Sphinx von Gizeh</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Direkt neben den Pyramiden befindet sich die weltberühmte Sphinx.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Mit ihrem Löwenkörper und dem menschlichen Kopf zählt sie zu den geheimnisvollsten Monumenten Ägyptens.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Bis heute ranken sich zahlreiche Legenden um ihre Entstehung.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Sonnenaufgang bei den Pyramiden – Ein magischer Moment</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Die Pyramiden bei Sonnenaufgang zu erleben, ist ein unvergessliches Erlebnis.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Wenn die Sonne langsam über der Wüste aufgeht und die monumentalen Bauwerke in goldenes Licht taucht, entsteht eine einzigartige Atmosphäre.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Dieser Moment gehört zu den schönsten Erlebnissen eines Kairo Ausflugs ab Hurghada.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Das Ägyptische Museum in Kairo</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Ein weiteres Highlight ist das berühmte Ägyptische Museum.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Hier kannst du unzählige Schätze des alten Ägyptens bestaunen, darunter:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Die Goldmaske des Tutanchamun</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Antike Mumien</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Königliche Artefakte</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Historische Schätze der Pharaonen</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Tipps für deinen Kairo Ausflug ab Hurghada</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Damit dein Ausflug perfekt wird, solltest du:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>früh schlafen gehen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>bequeme Kleidung tragen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>ausreichend Wasser mitnehmen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Sonnenschutz nicht vergessen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Kamera oder Handy bereithalten</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Warum bei Hurghada Reiseplaner buchen?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Bei Hurghada Reiseplaner profitierst du von:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>deutschsprachiger Betreuung</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>sicheren Transfers</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>fairen Preisen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>professioneller Organisation</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>unvergesslichen Erlebnissen</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Fazit: Ein Kairo Ausflug ist ein absolutes Highlight</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Die Pyramiden von Gizeh gehören zu den beeindruckendsten Sehenswürdigkeiten der Welt.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Ein Kairo Ausflug ab Hurghada bietet dir die einmalige Gelegenheit, die Geheimnisse des alten Ägyptens hautnah zu erleben.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Buche jetzt deinen Ausflug und entdecke die Magie der Pyramiden von Gizeh.</p>
<!-- /wp:paragraph -->', '5 Min', '[]'::jsonb),
('blog_posts', '47f7dda0-2b6f-475c-be26-a01bd5debd08', 'hu', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Gízai piramisok Hurghadából: Felejthetetlen kairói kirándulás napkeltekor', 'Gízai piramisok Hurghadából – Felejthetetlen kairói kirándulás napkeltekor', '<!-- wp:bekezdés -->
<p>A kairói kirándulás Hurghadából az egyik leglenyűgözőbb élmény az egyiptomi nyaralás során. A világhírű gízai piramisok szemtanúja napkeltekor egy varázslatos pillanat, amelyet soha nem fog elfelejteni.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>A nap első sugarai aranyfényben fürdetik a hatalmas épületeket, és a világ egyik leglenyűgözőbb utazási célpontjává teszik ezt a helyet.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Ha Hurghadában tölti a vakációját, ne hagyja ki ezt az egyedülálló kalandot.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>A professzionálisan szervezett kairói kirándulásokkal <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Hurghada utazástervező</a> biztonságosan és kényelmesen fedezheti fel Egyiptom legfontosabb látnivalóit.</p>
<p><!-- /wp:bekezdés --><!-- wp:heading --></p>
<h4><strong>Miért olyan különleges egy kairói kirándulás Hurghadából?</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>Kairó Egyiptom történelmi szíve, és az emberiség történelmének leglenyűgözőbb épületeinek ad otthont.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Egy napos kairói kiránduláson saját szemével láthatja az ország leghíresebb nevezetességeit.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>A kiemelések a következők:</p>
<p><!-- /wp:bekezdés --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>A gízai piramisok</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>A Nagy Szfinx</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>Az Egyiptomi Múzeum</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>A fáraók lenyűgöző története</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>Lélegzetelállító kilátás nyílik a sivatagra</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:bekezdés --></p>
<p>Egy kairói kirándulás a történelmet, a kultúrát és a felejthetetlen benyomásokat ötvözi.</p>
<p><!-- /wp:bekezdés --><!-- wp:heading --></p>
<h4><strong>A gízai piramisok – az ókori világ utolsó csodája</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>A gízai piramisok a világ leghíresebb épületei közé tartoznak, és az ókori világ hét csodájának egyike.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>A gigantikus építmények több mint 4500 évvel ezelőtt épültek, és ma is lenyűgözik a látogatókat.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>A három fő piramis:</p>
<p><!-- /wp:bekezdés --><!-- wp:heading {"level":3} --></p>
<h4><strong>A Kheopsz-piramis</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>A legnagyobb és leghíresebb piramis Egyiptomban.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Mumentális méretével és titokzatos felépítésével lenyűgöző.</p>
<p><!-- /wp:bekezdés --><!-- wp:heading {"level":3} --></p>
<h4><strong>Chephren piramisa</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>Részben megőrzött mészkőburkolatáról ismert.</p>
<p><!-- /wp:bekezdés --><!-- wp:heading {"level":3} --></p>
<h4><strong>A Menkaure piramis</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>A három nagy piramis közül a legkisebb, de mégis lenyűgöző.</p>
<p><!-- /wp:bekezdés --><!-- wp:heading --></p>
<h4><strong>A gízai nagy szfinx</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>Közvetlenül a piramisok mellett található a világhírű Szfinx.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Oroszlántestével és emberi fejével Egyiptom egyik legtitokzatosabb műemléke.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Máig számos legenda övezi létrehozását.</p>
<p><!-- /wp:bekezdés --><!-- wp:heading --></p>
<h4><strong>Napfelkelte a piramisoknál – varázslatos pillanat</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>A piramisok megtapasztalása napkeltekor felejthetetlen élmény.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Amikor a nap lassan felkel a sivatag fölé, és aranyfényben fürdeti a monumentális épületeket, egyedülálló hangulat jön létre.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Ez a pillanat a hurghadai kairói kirándulás egyik legszebb élménye.</p>
<p><!-- /wp:bekezdés --><!-- wp:heading --></p>
<h4><strong>A kairói Egyiptomi Múzeum</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>Egy másik látványosság a híres Egyiptomi Múzeum.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Itt megcsodálkozhat az ókori Egyiptom számtalan kincsében, többek között:</p>
<p><!-- /wp:bekezdés --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Tutanhamon aranymaszkja</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>Ősi múmiák</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>Királyi tárgyak</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>A fáraók történelmi kincsei</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Tippek a kairói utazáshoz Hurghadából</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>Ahhoz, hogy utazása tökéletes legyen, tegye a következőket:</p>
<p><!-- /wp:bekezdés --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>menj korán aludni</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>viseljen kényelmes ruhát</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>vigyél magaddal elegendő vizet</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>Ne feledkezzen meg a fényvédelemről</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>Készítse elő fényképezőgépét vagy mobiltelefonját</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Miért foglaljon utazástervezőt Hurghadán?</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>A Hurghada Travel Plannerrel a következőket élvezheti:</p>
<p><!-- /wp:bekezdés --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Német nyelvű támogatás</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>biztonságos átutalások</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>tisztességes árak</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>szakmai szervezet</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>feledhetetlen élmények</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Következtetés: Egy kairói utazás abszolút csúcspont</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>A gízai piramisok a világ leglenyűgözőbb látnivalói közé tartoznak.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Egy kairói kirándulás Hurghadából egyedülálló lehetőséget kínál Önnek, hogy testközelből megtapasztalja az ókori Egyiptom titkait.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Foglalja le utazását most, és fedezze fel a gízai piramisok varázsát.</p>
<!-- /wp:bekezdés -->', '5 perc', '[]'::jsonb),
('tours', 'a9e92b99-283c-4b1e-ac9a-12bfe9c7fef0', 'en', '2-day trip to Cairo from Hurghada – Pyramids, Sphinx & Egyptian Museum', '<table class="tour-pricing-table"><thead><tr><th>Participant</th><th>Vehicle</th><th>Price per person</th></tr></thead><tbody><tr><td>2 people</td><td>Private limousine</td><td>350 € per person</td></tr><tr><td>3 – 4 people</td><td>Private Minibus</td><td>335 € per person</td></tr><tr><td>5 - 6 people</td><td>Private minibus</td><td>300 € per person</td></tr><tr><td>7 - 8 people</td><td>Private minibus</td><td>280 € per person</td></tr></tbody></table>
Experience an unforgettable 2-day trip from Hurghada to Cairo and immerse yourself in the fascinating history of ancient Egypt. Visit the famous Pyramids of Giza, the Great Sphinx, the Egyptian Museum with its countless treasures and the lively Old City of Cairo. This excursion offers the perfect combination of history, culture and adventure. On the first day you leave Hurghada early in the morning and reach Cairo after about 5 hours. There you will first visit the Pyramids of Giza and the Great Sphinx. You will then drive to your hotel where you will spend the night. On the second day you will visit the Egyptian Museum, the old town of Khan el-Khalili and the Alabaster Mosque. After lunch, drive back to Hurghada.', '2 Day Trip from Hurghada to Cairo: Visit the Pyramids of Giza, the Great Sphinx, the Egyptian Museum and the Old City of Cairo.', NULL, '["Visit to the Pyramids of Giza","The Great Sphinx","Egyptian Museum in Cairo","Khan el-Khalili Old Town","Alabaster Mosque","2 days with overnight stay","Guide for the entire trip"]'::jsonb, '["Hurghada-Cairo round trip (with air conditioning)","1 night in a 4-star hotel in Cairo","Breakfast at the hotel","Lunch on the first day","Entrance tickets for all visits","Experienced tour guide","Drinking water on the bus"]'::jsonb, '["Tips","Photos and videos","Dinner","Additional drinks","Personal expenses"]'::jsonb, 'Hurghada - Red Sea - Egypt', '8h', NULL, NULL, NULL, NULL, '[{"question":"How long is the drive from Hurghada to Cairo?","answer":"The journey takes approximately 5 hours each way by bus."},{"question":"Is breakfast included in the hotel?","answer":"Yes, breakfast at the hotel is included in the price."},{"question":"Can I also do the trip as a day trip?","answer":"Yes, there is also a 1-day trip to Cairo, but you will have less time to visit."}]'::jsonb),
('tours', 'a9e92b99-283c-4b1e-ac9a-12bfe9c7fef0', 'fr', 'Excursion de 2 jours au Caire depuis Hurghada – Pyramides, Sphinx et musée égyptien', '<table class="tour-pricing-table"><thead><tr><th>Participant</th><th>Véhicule</th><th>Prix par personne</th></tr></thead><tbody><tr><td>2 personnes</td><td>Limousine privée</td><td>350 € par personne</td></tr><tr><td>3 – 4 personnes</td><td>Privé Minibus</td><td>335 € par personne</td></tr><tr><td>5 - 6 personnes</td><td>Minibus privé</td><td>300 € par personne</td></tr><tr><td>7 - 8 personnes</td><td>Minibus privé</td><td>280 € par personne</td></tr></tbody></table>
Vivez un voyage inoubliable de 2 jours d''Hurghada au Caire et plongez-vous dans l''histoire fascinante de l''Égypte ancienne. Visitez les célèbres pyramides de Gizeh, le Grand Sphinx, le musée égyptien avec ses innombrables trésors et la vieille ville animée du Caire. Cette excursion offre la combinaison parfaite d’histoire, de culture et d’aventure. Le premier jour, vous quittez Hurghada tôt le matin et atteignez le Caire après environ 5 heures. Là, vous visiterez d''abord les pyramides de Gizeh et le Grand Sphinx. Vous vous dirigerez ensuite vers votre hôtel où vous passerez la nuit. Le deuxième jour, vous visiterez le musée égyptien, la vieille ville de Khan el-Khalili et la mosquée d''Albâtre. Après le déjeuner, retour à Hurghada.', 'Excursion de 2 jours d''Hurghada au Caire : visitez les pyramides de Gizeh, le Grand Sphinx, le musée égyptien et la vieille ville du Caire.', NULL, '["Visite des pyramides de Gizeh","Le grand Sphinx","Musée égyptien du Caire","Vieille ville de Khan el-Khalili","Mosquée d''albâtre","2 jours avec nuitée","Guide pour tout le voyage"]'::jsonb, '["Aller-retour Hurghada-Caire (avec climatisation)","1 nuit dans un hôtel 4 étoiles au Caire","Petit-déjeuner à l''hôtel","Déjeuner le premier jour","Billets d''entrée pour toutes les visites","Guide touristique expérimenté","Boire de l''eau dans le bus"]'::jsonb, '["Conseils","Photos et vidéos","Dîner","Boissons supplémentaires","Dépenses personnelles"]'::jsonb, 'Hurghada - Mer Rouge - Egypte', '8h', NULL, NULL, NULL, NULL, '[{"question":"Combien de temps dure le trajet d''Hurghada au Caire ?","answer":"Le trajet dure environ 5 heures dans chaque sens en bus."},{"question":"Le petit-déjeuner est-il inclus à l''hôtel ?","answer":"Oui, le petit-déjeuner à l''hôtel est inclus dans le prix."},{"question":"Puis-je également faire le voyage en excursion d''une journée ?","answer":"Oui, il existe également une excursion d''une journée au Caire, mais vous aurez moins de temps pour le visiter."}]'::jsonb),
('tours', 'a9e92b99-283c-4b1e-ac9a-12bfe9c7fef0', 'ru', '2-дневная поездка в Каир из Хургады – пирамиды, сфинкс и египетский музей
---ЦЭП---
Двухдневная поездка из Хургады в Каир: посетите пирамиды Гизы, Большого Сфинкса, Египетский музей и Старый город Каира.
---ЦЭП---
Хургада - Красное море - Египет
---ЦЭП---
8 часов
---ЦЭП---
<table class="tour-pricing-table"><thead><tr><th>Участник</th><th>Автомобиль</th><th>Цена на человека</th></tr></thead><tbody><tr><td>2 человека</td><td>Частный лимузин</td><td>350 € на человека</td></tr><tr><td>3 – 4 человека</td><td>Частный Микроавтобус</td><td>335 € на человека</td></tr><tr><td>5 - 6 человек</td><td>Частный микроавтобус</td><td>300 € на человека</td></tr><tr><td>7 - 8 человек</td><td>Частный микроавтобус</td><td>280 € на человека</td></tr></tbody></table>
Совершите незабываемое двухдневное путешествие из Хургады в Каир и погрузитесь в увлекательную историю Древнего Египта. Посетите знаменитые пирамиды Гизы, Великого Сфинкса, Египетский музей с его бесчисленными сокровищами и оживленный Старый город Каира. Эта экскурсия предлагает идеальное сочетание истории, культуры и приключений. В первый день вы выезжаете из Хургады рано утром и примерно через 5 часов добираетесь до Каира. Там вы впервые посетите пирамиды Гизы и Великого Сфинкса. Затем вы поедете в отель, где проведете ночь. Во второй день вы посетите Египетский музей, старый город Хан-эль-Халили и Алебастровую мечеть. После обеда возвращение в Хургаду.
---ЦЭП---
Посещение пирамид Гизы
---РАЗДЕЛЕНИЕ---
Большой Сфинкс
---РАЗДЕЛЕНИЕ---
Египетский музей в Каире
---РАЗДЕЛЕНИЕ---
Старый город Хан-эль-Халили
---РАЗДЕЛЕНИЕ---
Алебастровая мечеть
---РАЗДЕЛЕНИЕ---
2 дня с ночевкой
---РАЗДЕЛЕНИЕ---
Гид на всю поездку
---ЦЭП---
Поездка Хургада-Каир туда и обратно (с кондиционером)
---РАЗДЕЛЕНИЕ---
1 ночь в 4-звездочном отеле в Каире
---РАЗДЕЛЕНИЕ---
Завтрак в отеле
---РАЗДЕЛЕНИЕ---
Обед в первый день
---РАЗДЕЛЕНИЕ---
Входные билеты на все посещения
---РАЗДЕЛЕНИЕ---
Опытный гид
---РАЗДЕЛЕНИЕ---
Питьевая вода в автобусе
---ЦЭП---
Советы
---РАЗДЕЛЕНИЕ---
Фото и видео
---РАЗДЕЛЕНИЕ---
Ужин
---РАЗДЕЛЕНИЕ---
Дополнительные напитки
---РАЗДЕЛЕНИЕ---
Личные расходы
---ЦЭП---
Сколько времени занимает поездка из Хургады в Каир?
---РАЗДЕЛЕНИЕ---
Включен ли завтрак в отеле?
---РАЗДЕЛЕНИЕ---
Могу ли я совершить поездку как однодневную?
---ЦЭП---
Дорога на автобусе занимает около 5 часов в одну сторону.
---РАЗДЕЛЕНИЕ---
Да, завтрак в отеле включен в стоимость.
---РАЗДЕЛЕНИЕ---
Да, есть еще однодневная поездка в Каир, но времени на посещение у вас будет меньше.', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Fahrzeug</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Private Limousine</td><td>350 € p.P.</td></tr><tr><td>3 – 4 Personen</td><td>Privater Minibus</td><td>335 € p.P.</td></tr><tr><td>5 – 6 Personen</td><td>Privater Minibus</td><td>300 € p.P.</td></tr><tr><td>7 – 8 Personen</td><td>Privater Minibus</td><td>280 € p.P.</td></tr></tbody></table>
Erleben Sie eine unvergessliche 2-Tages-Reise von Hurghada nach Kairo und tauchen Sie ein in die faszinierende Geschichte des alten Ägyptens. Besuchen Sie die berühmten Pyramiden von Gizeh, die Große Sphinx, das Ägyptische Museum mit seinen unzähligen Schätzen und die lebendige Altstadt von Kairo. Dieser Ausflug bietet die perfekte Kombination aus Geschichte, Kultur und Abenteuer. Am ersten Tag fahren Sie früh morgens von Hurghada ab und erreichen nach ca. 5 Stunden Kairo. Dort besuchen Sie zunächst die Pyramiden von Gizeh und die Große Sphinx. Anschließend fahren Sie zu Ihrem Hotel, wo Sie die Nacht verbringen. Am zweiten Tag besuchen Sie das Ägyptische Museum, die Altstadt von Khan el-Khalili und die Alabaster-Moschee. Nach dem Mittagessen fahren Sie zurück nach Hurghada.', '2-Tages-Reise von Hurghada nach Kairo: Besuchen Sie die Pyramiden von Gizeh, die Große Sphinx, das Ägyptische Museum und die Altstadt von Kairo.', NULL, '["Besuch der Pyramiden von Gizeh","Die Große Sphinx","Ägyptisches Museum in Kairo","Altstadt Khan el-Khalili","Alabaster-Moschee","2 Tage mit Übernachtung","Guide für die gesamte Reise"]'::jsonb, '["Hin- und Rückfahrt Hurghada-Kairo (mit Klimaanlage)","1 Übernachtung in einem 4-Sterne-Hotel in Kairo","Frühstück im Hotel","Mittagessen am ersten Tag","Eintrittskarten für alle Besichtigungen","Erfahrener Reiseführer","Trinkwasser im Bus"]'::jsonb, '["Trinkgelder","Fotos und Videos","Abendessen","Zusätzliche Getränke","Persönliche Ausgaben"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '8h', NULL, NULL, NULL, NULL, '[{"question":"Wie lange ist die Fahrt von Hurghada nach Kairo?","answer":"Die Fahrt dauert ca. 5 Stunden pro Strecke mit dem Bus."},{"question":"Ist das Frühstück im Hotel inklusive?","answer":"Ja, das Frühstück im Hotel ist im Preis inbegriffen."},{"question":"Kann ich die Reise auch als Tagesausflug machen?","answer":"Ja, es gibt auch einen 1-Tages-Ausflug nach Kairo, bei dem Sie jedoch weniger Zeit zum Besichtigten haben."}]'::jsonb),
('tours', 'a9e92b99-283c-4b1e-ac9a-12bfe9c7fef0', 'ar', 'رحلة لمدة يومين إلى القاهرة من الغردقة - الأهرامات وأبو الهول والمتحف المصري
--- تسيب ---
رحلة ليومين من الغردقة إلى القاهرة: قم بزيارة أهرامات الجيزة وأبو الهول والمتحف المصري ومدينة القاهرة القديمة.
--- تسيب ---
الغردقة - البحر الأحمر - مصر
--- تسيب ---
8 ساعات
--- تسيب ---
<table class="tour-pricing-table"><thead><tr><th>المشارك</th><th>المركبة</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخصين</td><td>سيارة ليموزين خاصة</td><td>350 يورو للشخص الواحد</td></tr><tr><td>3 - 4 أشخاص</td><td>خاص حافلة صغيرة</td><td>335 يورو للشخص الواحد</td></tr><tr><td>5 - 6 أشخاص</td><td>حافلة صغيرة خاصة</td><td>300 يورو للشخص الواحد</td></tr><tr><td>7 - 8 أشخاص</td><td>حافلة صغيرة خاصة</td><td>280 يورو للشخص الواحد</td></tr></tbody></table>
استمتع برحلة لا تُنسى لمدة يومين من الغردقة إلى القاهرة وانغمس في تاريخ مصر القديمة الرائع. قم بزيارة أهرامات الجيزة الشهيرة، وتمثال أبو الهول، والمتحف المصري بكنوزه التي لا تعد ولا تحصى، ومدينة القاهرة القديمة النابضة بالحياة. توفر هذه الرحلة مزيجًا مثاليًا من التاريخ والثقافة والمغامرة. في اليوم الأول تغادر الغردقة في الصباح الباكر وتصل إلى القاهرة بعد حوالي 5 ساعات. هناك ستزور أولاً أهرامات الجيزة وأبو الهول. ستقود بعد ذلك إلى فندقك حيث ستقضي الليل. وفي اليوم الثاني ستزور المتحف المصري وبلدة خان الخليلي القديمة ومسجد المرمر. بعد الغداء، العودة إلى الغردقة.
--- تسيب ---
زيارة أهرامات الجيزة
---تقسيم---
أبو الهول العظيم
---تقسيم---
المتحف المصري بالقاهرة
---تقسيم---
مدينة خان الخليلي القديمة
---تقسيم---
مسجد المرمر
---تقسيم---
يومين مع المبيت
---تقسيم---
دليل للرحلة بأكملها
--- تسيب ---
الغردقة - القاهرة ذهابًا وإيابًا (مع تكييف الهواء)
---تقسيم---
- ليلة واحدة في فندق 4 نجوم بالقاهرة
---تقسيم---
الإفطار في الفندق
---تقسيم---
الغداء في اليوم الأول
---تقسيم---
تذاكر الدخول لجميع الزيارات
---تقسيم---
مرشد سياحي ذو خبرة
---تقسيم---
شرب الماء في الحافلة
--- تسيب ---
نصائح
---تقسيم---
الصور ومقاطع الفيديو
---تقسيم---
العشاء
---تقسيم---
مشروبات إضافية
---تقسيم---
النفقات الشخصية
--- تسيب ---
كم تستغرق الرحلة من الغردقة إلى القاهرة؟
---تقسيم---
هل الإفطار مشمول في الفندق؟
---تقسيم---
هل يمكنني أيضًا القيام بالرحلة كرحلة يومية؟
--- تسيب ---
تستغرق الرحلة حوالي 5 ساعات في كل اتجاه بالحافلة.
---تقسيم---
نعم الإفطار في الفندق مشمول في السعر.
---تقسيم---
نعم، هناك أيضًا رحلة ليوم واحد إلى القاهرة، لكن سيكون لديك وقت أقل للزيارة.', '<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Fahrzeug</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Private Limousine</td><td>350 € p.P.</td></tr><tr><td>3 – 4 Personen</td><td>Privater Minibus</td><td>335 € p.P.</td></tr><tr><td>5 – 6 Personen</td><td>Privater Minibus</td><td>300 € p.P.</td></tr><tr><td>7 – 8 Personen</td><td>Privater Minibus</td><td>280 € p.P.</td></tr></tbody></table>
Erleben Sie eine unvergessliche 2-Tages-Reise von Hurghada nach Kairo und tauchen Sie ein in die faszinierende Geschichte des alten Ägyptens. Besuchen Sie die berühmten Pyramiden von Gizeh, die Große Sphinx, das Ägyptische Museum mit seinen unzähligen Schätzen und die lebendige Altstadt von Kairo. Dieser Ausflug bietet die perfekte Kombination aus Geschichte, Kultur und Abenteuer. Am ersten Tag fahren Sie früh morgens von Hurghada ab und erreichen nach ca. 5 Stunden Kairo. Dort besuchen Sie zunächst die Pyramiden von Gizeh und die Große Sphinx. Anschließend fahren Sie zu Ihrem Hotel, wo Sie die Nacht verbringen. Am zweiten Tag besuchen Sie das Ägyptische Museum, die Altstadt von Khan el-Khalili und die Alabaster-Moschee. Nach dem Mittagessen fahren Sie zurück nach Hurghada.', '2-Tages-Reise von Hurghada nach Kairo: Besuchen Sie die Pyramiden von Gizeh, die Große Sphinx, das Ägyptische Museum und die Altstadt von Kairo.', NULL, '["Besuch der Pyramiden von Gizeh","Die Große Sphinx","Ägyptisches Museum in Kairo","Altstadt Khan el-Khalili","Alabaster-Moschee","2 Tage mit Übernachtung","Guide für die gesamte Reise"]'::jsonb, '["Hin- und Rückfahrt Hurghada-Kairo (mit Klimaanlage)","1 Übernachtung in einem 4-Sterne-Hotel in Kairo","Frühstück im Hotel","Mittagessen am ersten Tag","Eintrittskarten für alle Besichtigungen","Erfahrener Reiseführer","Trinkwasser im Bus"]'::jsonb, '["Trinkgelder","Fotos und Videos","Abendessen","Zusätzliche Getränke","Persönliche Ausgaben"]'::jsonb, 'Hurghada - Rotes Meer - Aegypten', '8h', NULL, NULL, NULL, NULL, '[{"question":"Wie lange ist die Fahrt von Hurghada nach Kairo?","answer":"Die Fahrt dauert ca. 5 Stunden pro Strecke mit dem Bus."},{"question":"Ist das Frühstück im Hotel inklusive?","answer":"Ja, das Frühstück im Hotel ist im Preis inbegriffen."},{"question":"Kann ich die Reise auch als Tagesausflug machen?","answer":"Ja, es gibt auch einen 1-Tages-Ausflug nach Kairo, bei dem Sie jedoch weniger Zeit zum Besichtigten haben."}]'::jsonb),
('tours', 'a9e92b99-283c-4b1e-ac9a-12bfe9c7fef0', 'hu', '2 napos kirándulás Kairóba Hurghadából – Piramisok, Szfinx és Egyiptomi Múzeum', '<table class="tour-pricing-table"><thead><tr><th>Részvevő</th><th>Jármű</th><th>Ár személyenként</th></tr></thead><tbody><tr><td>2 fő</td><td>Privát limuzin</td><td>350 € személyenként</td><td>személyenként</td><td>privát Minibusz</td><td>335 €/fő</td></tr><tr><td>5-6 fő</td><td>Privát mikrobusz</td><td>300 €/fő</td></tr><tr><td>7-8 fő</td><td>Privát mikrobusz><</td><td>/280 €/tr/fő
Éljen át egy felejthetetlen 2 napos utazást Hurghadából Kairóba, és merüljön el az ókori Egyiptom lenyűgöző történelmében. Látogassa meg a híres gízai piramisokat, a Nagy Szfinxet, az Egyiptomi Múzeumot a számtalan kincsével és Kairó nyüzsgő óvárosát. Ez a kirándulás a történelem, a kultúra és a kaland tökéletes kombinációját kínálja. Az első napon kora reggel indul el Hurghadából, és körülbelül 5 óra múlva ér el Kairóba. Ott először meglátogatja a gízai piramisokat és a Nagy Szfinxet. Ezután elvezet a szállodába, ahol az éjszakát tölti. A második napon meglátogatja az Egyiptomi Múzeumot, Khan el-Khalili óvárosát és az Alabástrom-mecsetet. Ebéd után visszautazás Hurghadába.', '2 napos kirándulás Hurghadából Kairóba: Látogassa meg a gízai piramisokat, a Nagy Szfinxet, az Egyiptomi Múzeumot és Kairó óvárosát.', NULL, '["Látogatás a gízai piramisokhoz","A Nagy Szfinx","Egyiptomi Múzeum Kairóban","Khan el-Khalili óvárosa","Alabástrom mecset","2 nap éjszakázással","Útmutató a teljes utazáshoz"]'::jsonb, '["oda-vissza Hurghada-Kairó (klímával)","1 éjszaka egy 4 csillagos hotelben Kairóban","Reggeli a szállodában","Ebéd az első napon","Belépőjegyek minden látogatásra","Tapasztalt idegenvezető","Ivóvíz a buszon"]'::jsonb, '["Tippek","Fényképek és videók","Vacsora","További italok","Személyi kiadások"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '8 óra', NULL, NULL, NULL, NULL, '[{"question":"Mennyi ideig tart az út Hurghada és Kairó között?","answer":"Az út körülbelül 5 órát vesz igénybe busszal."},{"question":"A reggeli benne van a szállodában?","answer":"Igen, az ár tartalmazza a reggelit a szállodában."},{"question":"Egynapos kirándulásként is megtehetem az utat?","answer":"Igen, van egy 1 napos kirándulás Kairóba is, de kevesebb időd lesz a látogatásra."}]'::jsonb);

-- Batch 4 (rows 151-199)
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs) VALUES
('blog_posts', '8967bf58-d218-4388-a386-2c56fc36f861', 'en', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Luxor excursion from Hurghada: Experience the secrets of the pharaohs in the Valley of the Kings', 'Luxor excursion from Hurghada: Experience the secrets of the pharaohs in the Valley of the Kings', '<!-- wp:paragraph -->
<p>A Luxor excursion from Hurghada is one of the most impressive experiences during a holiday in Egypt. If you are vacationing in Hurghada and want to discover the fascinating history of ancient Egypt, you should definitely plan a day trip to Luxor.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Luxor is considered the largest open-air museum in the world and impresses with world-famous temples, monumental tombs and thousands of years of history.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>With a Luxor day trip from Hurghada, you will delve deep into the world of the pharaohs and discover the most important sights of ancient Egypt.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Why is a Luxor excursion from Hurghada so special?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Luxor is one of the most fascinating cities in Egypt. Ancient Thebes, the capital of the pharaohs, was once located here.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>A trip to Luxor offers you the unique opportunity to see world-famous historical places with your own eyes.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>The highlights include:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>The Valley of the Kings</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>The Karnak Temple</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>The Hatshepsut Temple</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>The Memnon Colossi</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>The Nile</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>This cultural excursion is ideal for anyone who wants to experience Egypt''s history up close.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>The Valley of the Kings – The Hidden Tombs of the Pharaohs</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>The Valley of the Kings is one of the most famous archaeological sites in the world.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Numerous pharaohs of the New Kingdom were buried here, including Tutankhamun.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>The artfully designed burial chambers impress with colorful wall paintings and fascinating hieroglyphs.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>A visit to the Valley of the Kings is one of the absolute highlights of any Luxor excursion from Hurghada.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>The Karnak Temple – A masterpiece of antiquity</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>The Karnak Temple is one of the largest temple complexes in the world.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>The massive colonnaded halls, impressive reliefs and monumental gates show the power and wealth of the ancient Egyptian rulers.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>The temple is one of the most important sights in Luxor.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>The Temple of Queen Hatshepsut</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>The imposing Temple of Hatshepsut is unique in its architecture.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>It was built directly into the rocks and is one of the most beautiful buildings in ancient Egypt.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>The story of the powerful pharaoh makes this place particularly fascinating.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Tips for your Luxor day trip from Hurghada</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>For the perfect trip you should:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>wear comfortable clothing</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Take sun protection with you</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>have enough water with you</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>don''t forget a camera</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>The trip from Hurghada to Luxor is worthwhile for anyone who wants to discover Egypt''s history.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Why book your Luxor excursion with Hurghada Travel Planner?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>For <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Hurghada travel planner</a> you benefit from:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>German-speaking support</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>fair prices</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>secure booking</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>professional organization</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>unforgettable experiences</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Conclusion</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>A Luxor excursion from Hurghada is an unforgettable journey into the world of the pharaohs.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>The Valley of the Kings, the Karnak Temple and the impressive monuments make this day trip an absolute highlight of your Egypt vacation.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Book your Luxor excursion now and discover the secrets of ancient Egypt.</p>
<!-- /wp:paragraph -->', '5 mins', '[]'::jsonb),
('blog_posts', '8967bf58-d218-4388-a386-2c56fc36f861', 'fr', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Excursion à Louxor depuis Hurghada : découvrez les secrets des pharaons dans la Vallée des Rois', 'Excursion à Louxor depuis Hurghada : découvrez les secrets des pharaons dans la Vallée des Rois', '<!-- wp:paragraphe -->
<p>Une excursion à Louxor depuis Hurghada est l''une des expériences les plus impressionnantes lors de vacances en Égypte. Si vous êtes en vacances à Hurghada et souhaitez découvrir l''histoire fascinante de l''Égypte ancienne, vous devez absolument planifier une excursion d''une journée à Louxor.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Louxor est considéré comme le plus grand musée en plein air au monde et impressionne par ses temples de renommée mondiale, ses tombes monumentales et ses milliers d''années d''histoire.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Avec une excursion d''une journée à Louxor au départ d''Hurghada, vous plongerez au plus profond du monde des pharaons et découvrirez les sites les plus importants de l''Égypte ancienne.</p>
<p><!-- /wp:paragraphe --><!-- wp:titre --></p>
<h4><strong>Pourquoi une excursion à Louxor depuis Hurghada est-elle si spéciale ?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Louxor est l''une des villes les plus fascinantes d''Égypte. L''ancienne Thèbes, la capitale des pharaons, se trouvait autrefois ici.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Un voyage à Louxor vous offre l''opportunité unique de voir de vos propres yeux des lieux historiques de renommée mondiale.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Les points forts incluent :</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>La Vallée des Rois</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Le temple de Karnak</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Le temple d''Hatchepsout</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Les colosses de Memnon</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Le Nil</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraphe --></p>
<p>Cette excursion culturelle est idéale pour tous ceux qui souhaitent découvrir de près l''histoire de l''Égypte.</p>
<p><!-- /wp:paragraphe --><!-- wp:titre --></p>
<h4><strong>La Vallée des Rois – Les Tombeaux cachés des Pharaons</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>La Vallée des Rois est l''un des sites archéologiques les plus célèbres au monde.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>De nombreux pharaons du Nouvel Empire ont été enterrés ici, dont Toutankhamon.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Les chambres funéraires astucieusement conçues impressionnent par leurs peintures murales colorées et leurs hiéroglyphes fascinants.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Une visite de la Vallée des Rois est l''un des points forts absolus de toute excursion à Louxor au départ d''Hurghada.</p>
<p><!-- /wp:paragraphe --><!-- wp:titre --></p>
<h4><strong>Le temple de Karnak – Un chef-d''œuvre de l''Antiquité</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Le temple de Karnak est l''un des plus grands complexes de temples au monde.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Les salles massives à colonnades, les reliefs impressionnants et les portes monumentales montrent la puissance et la richesse des anciens dirigeants égyptiens.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Le temple est l''un des sites touristiques les plus importants de Louxor.</p>
<p><!-- /wp:paragraphe --><!-- wp:titre --></p>
<h4><strong>Le temple de la reine Hatshepsout</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>L''imposant temple d''Hatchepsout est unique par son architecture.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Il a été construit directement dans la roche et est l''un des plus beaux bâtiments de l''Égypte ancienne.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>L''histoire du puissant pharaon rend ce lieu particulièrement fascinant.</p>
<p><!-- /wp:paragraphe --><!-- wp:titre --></p>
<h4><strong>Conseils pour votre excursion d''une journée à Louxor au départ d''Hurghada</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Pour un voyage parfait, vous devriez :</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>portez des vêtements confortables</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Emportez une protection solaire avec vous</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>avoir assez d''eau avec vous</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>n''oubliez pas un appareil photo</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraphe --></p>
<p>Le voyage d''Hurghada à Louxor vaut la peine pour tous ceux qui souhaitent découvrir l''histoire de l''Égypte.</p>
<p><!-- /wp:paragraphe --><!-- wp:titre --></p>
<h4><strong>Pourquoi réserver votre excursion à Louxor avec Hurghada Travel Planner ?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Pour <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Planificateur de voyage Hurghada</a> dont vous bénéficiez :</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Assistance germanophone</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>des prix équitables</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>réservation sécurisée</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>organisation professionnelle</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>des expériences inoubliables</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Conclusion</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Une excursion à Louxor depuis Hurghada est un voyage inoubliable dans le monde des pharaons.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>La Vallée des Rois, le temple de Karnak et les monuments impressionnants font de cette excursion d''une journée un point culminant absolu de vos vacances en Égypte.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Réservez dès maintenant votre excursion à Louxor et découvrez les secrets de l''Égypte ancienne.</p>
<!-- /wp:paragraphe -->', '5 minutes', '[]'::jsonb),
('blog_posts', '8967bf58-d218-4388-a386-2c56fc36f861', 'ru', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Экскурсия в Луксор из Хургады: познайте тайны фараонов в Долине царей
---ЦЭП---
Экскурсия в Луксор из Хургады: познайте тайны фараонов в Долине царей
---ЦЭП---
5 минут
---ЦЭП---
<!-- wp:абзац -->
<p>Экскурсия в Луксор из Хургады – одно из самых впечатляющих впечатлений во время отдыха в Египте. Если вы отдыхаете в Хургаде и хотите открыть для себя увлекательную историю Древнего Египта, вам обязательно стоит запланировать однодневную поездку в Луксор.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Луксор считается крупнейшим музеем под открытым небом в мире и впечатляет всемирно известными храмами, монументальными гробницами и тысячелетней историей.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Совершив однодневную поездку в Луксор из Хургады, вы погрузитесь в мир фараонов и откроете для себя самые важные достопримечательности Древнего Египта.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Почему экскурсия в Луксор из Хургады такая особенная?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Луксор — один из самых очаровательных городов Египта. Когда-то здесь располагались древние Фивы, столица фараонов.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Поездка в Луксор дает вам уникальную возможность увидеть всемирно известные исторические места своими глазами.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Основные моменты:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Долина царей</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Карнакский храм</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Храм Хатшепсут</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Колоссы Мемнона</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Нил</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>Эта культурная экскурсия идеально подходит для всех, кто хочет поближе познакомиться с историей Египта.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Долина царей – скрытые гробницы фараонов</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Долина царей — один из самых известных археологических памятников в мире.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Здесь были похоронены многочисленные фараоны Нового царства, в том числе Тутанхамон.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Искусно оформленные погребальные камеры впечатляют красочной настенной росписью и очаровательными иероглифами.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Посещение Долины царей — одно из самых ярких событий любой экскурсии в Луксор из Хургады.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Карнакский храм – шедевр древности</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Карнакский храм — один из крупнейших храмовых комплексов в мире.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Массивные залы с колоннами, впечатляющие рельефы и монументальные ворота свидетельствуют о силе и богатстве древнеегипетских правителей.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Храм — одна из самых важных достопримечательностей Луксора.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Храм царицы Хатшепсут</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Внушительный храм Хатшепсут уникален по своей архитектуре.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Оно было построено прямо в скале и является одним из самых красивых зданий Древнего Египта.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>История могущественного фараона делает это место особенно увлекательным.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Советы для однодневной поездки в Луксор из Хургады</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Для идеального путешествия вам необходимо:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>носить удобную одежду.</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Возьмите с собой защиту от солнца.</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>имейте с собой достаточно воды</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>не забудьте фотоаппарат</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>Путешествие из Хургады в Луксор подойдет всем, кто хочет познакомиться с историей Египта.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Зачем бронировать экскурсию по Луксору с помощью Hurghada Travel Planner?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Для <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Планировщик путешествий по Хургаде</a>, которым вы воспользуетесь:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Немецкоязычная поддержка.</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>справедливые цены</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>безопасное бронирование</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>профессиональная организация</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>незабываемые впечатления</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Заключение</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Экскурсия в Луксор из Хургады – незабываемое путешествие в мир фараонов.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Долина царей, Карнакский храм и впечатляющие памятники сделают эту однодневную поездку абсолютным событием вашего отпуска в Египте.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Забронируйте экскурсию в Луксор прямо сейчас и откройте для себя тайны Древнего Египта.</p>
<!-- /wp:абзац -->', 'Luxor Ausflug ab Hurghada: Die Geheimnisse der Pharaonen im Tal der Könige erleben', '<!-- wp:paragraph -->
<p>Ein Luxor Ausflug ab Hurghada gehört zu den beeindruckendsten Erlebnissen während eines Ägypten Urlaubs. Wer in Hurghada Urlaub macht und die faszinierende Geschichte des alten Ägyptens entdecken möchte, sollte unbedingt einen Tagesausflug nach Luxor planen.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Luxor gilt als das größte Freilichtmuseum der Welt und begeistert mit weltberühmten Tempeln, monumentalen Grabstätten und jahrtausendealter Geschichte.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Mit einem Luxor Tagesausflug ab Hurghada tauchst du tief in die Welt der Pharaonen ein und entdeckst die bedeutendsten Sehenswürdigkeiten des alten Ägyptens.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Warum ist ein Luxor Ausflug ab Hurghada so besonders?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Luxor ist eine der faszinierendsten Städte Ägyptens. Hier befand sich einst das antike Theben, die Hauptstadt der Pharaonen.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Ein Ausflug nach Luxor bietet dir die einmalige Möglichkeit, weltberühmte historische Orte mit eigenen Augen zu sehen.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Zu den Highlights gehören:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Das Tal der Könige</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Der Karnak Tempel</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Der Hatschepsut Tempel</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Die Memnon Kolosse</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Der Nil</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>Dieser Kultur-Ausflug ist ideal für alle, die Ägyptens Geschichte hautnah erleben möchten.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Das Tal der Könige – Die verborgenen Gräber der Pharaonen</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Das Tal der Könige zählt zu den berühmtesten archäologischen Stätten der Welt.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Hier wurden zahlreiche Pharaonen des Neuen Reiches begraben, darunter auch Tutanchamun.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Die kunstvoll gestalteten Grabkammern beeindrucken mit farbenprächtigen Wandmalereien und faszinierenden Hieroglyphen.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Ein Besuch im Tal der Könige gehört zu den absoluten Höhepunkten jedes Luxor Ausflugs ab Hurghada.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Der Karnak Tempel – Ein Meisterwerk der Antike</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Der Karnak Tempel ist eine der größten Tempelanlagen der Welt.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Die gewaltigen Säulenhallen, beeindruckenden Reliefs und monumentalen Tore zeigen die Macht und den Reichtum der alten ägyptischen Herrscher.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Der Tempel zählt zu den wichtigsten Sehenswürdigkeiten in Luxor.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Der Tempel der Königin Hatschepsut</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Der imposante Tempel der Hatschepsut ist einzigartig in seiner Architektur.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Er wurde direkt in die Felsen gebaut und zählt zu den schönsten Bauwerken des alten Ägyptens.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Die Geschichte der mächtigen Pharaonin macht diesen Ort besonders faszinierend.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Tipps für deinen Luxor Tagesausflug ab Hurghada</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Für den perfekten Ausflug solltest du:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>bequeme Kleidung tragen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Sonnenschutz mitnehmen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>ausreichend Wasser dabeihaben</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>eine Kamera nicht vergessen</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>Die Fahrt von Hurghada nach Luxor lohnt sich für jeden, der Ägyptens Geschichte entdecken möchte.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Warum deinen Luxor Ausflug bei Hurghada Reiseplaner buchen?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Bei <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Hurghada Reiseplaner</a> profitierst du von:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>deutschsprachiger Betreuung</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>fairen Preisen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>sicherer Buchung</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>professioneller Organisation</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>unvergesslichen Erlebnissen</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Fazit</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Ein Luxor Ausflug ab Hurghada ist eine unvergessliche Reise in die Welt der Pharaonen.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Das Tal der Könige, der Karnak Tempel und die beeindruckenden Monumente machen diesen Tagesausflug zu einem absoluten Highlight deines Ägypten Urlaubs.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Buche jetzt deinen Luxor Ausflug und entdecke die Geheimnisse des alten Ägyptens.</p>
<!-- /wp:paragraph -->', '5 Min', '[]'::jsonb),
('blog_posts', '8967bf58-d218-4388-a386-2c56fc36f861', 'ar', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'رحلة الأقصر من الغردقة: اكتشف أسرار الفراعنة في وادي الملوك
--- تسيب ---
رحلة الأقصر من الغردقة: اكتشف أسرار الفراعنة في وادي الملوك
--- تسيب ---
5 دقائق
--- تسيب ---
<!-- wp:paragraph -->
<p>تعد رحلة الأقصر من الغردقة واحدة من أكثر التجارب إثارة للإعجاب خلال عطلة في مصر. إذا كنت تقضي إجازتك في الغردقة وترغب في اكتشاف التاريخ الرائع لمصر القديمة، فيجب عليك بالتأكيد التخطيط لرحلة ليوم واحد إلى الأقصر.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>تعتبر مدينة الأقصر أكبر متحف مفتوح في العالم وتتميز بمعابدها المشهورة عالميًا ومقابرها الأثرية وتاريخها الذي يمتد لآلاف السنين.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>مع رحلة الأقصر النهارية من الغردقة، سوف تتعمق في عالم الفراعنة وتكتشف أهم المعالم السياحية في مصر القديمة.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>لماذا تعتبر رحلة الأقصر من الغردقة مميزة جدًا؟</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>الأقصر هي واحدة من أروع المدن في مصر. وكانت طيبة القديمة، عاصمة الفراعنة، تقع هنا ذات يوم.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>توفر لك الرحلة إلى الأقصر فرصة فريدة لرؤية الأماكن التاريخية المشهورة عالميًا بأم عينيك.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>وتشمل النقاط البارزة ما يلي:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>وادي الملوك</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>معبد الكرنك</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>معبد حتشبسوت</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>تمثالا ممنون</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>النيل</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>تُعد هذه الرحلة الثقافية مثالية لأي شخص يرغب في تجربة تاريخ مصر عن قرب.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>وادي الملوك – مقابر الفراعنة المخفية</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>يعد وادي الملوك من أشهر المواقع الأثرية في العالم.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>تم دفن العديد من فراعنة الدولة الحديثة هنا، بما في ذلك توت عنخ آمون.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>تتميز غرف الدفن المصممة ببراعة باللوحات الجدارية الملونة والكتابات الهيروغليفية الرائعة.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>تعد زيارة وادي الملوك إحدى المعالم البارزة في أي رحلة من الغردقة إلى مدينة الأقصر.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>معبد الكرنك – تحفة من العصور القديمة</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>يعد معبد الكرنك من أكبر مجمعات المعابد في العالم.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>تُظهر القاعات الضخمة ذات الأعمدة والنقوش الرائعة والبوابات الأثرية قوة وثروة الحكام المصريين القدماء.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>يعد المعبد من أهم المعالم السياحية في مدينة الأقصر.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>معبد الملكة حتشبسوت</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>يتميز معبد حتشبسوت المهيب بالفريد من نوعه في هندسته المعمارية.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>تم بناؤه مباشرة في الصخور ويعتبر من أجمل المباني في مصر القديمة.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>قصة الفرعون القوي تجعل هذا المكان رائعًا بشكل خاص.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>نصائح لرحلتك اليومية إلى الأقصر من الغردقة</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>للحصول على رحلة مثالية، يجب عليك:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>ارتداء ملابس مريحة</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>خذ معك واقيًا من الشمس</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>احتفظ بما يكفي من الماء معك</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>لا تنس الكاميرا</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>الرحلة من الغردقة إلى الأقصر تستحق العناء لأي شخص يريد اكتشاف تاريخ مصر.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>لماذا تحجز رحلتك إلى الأقصر مع Hurghada Travel Planner؟</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>بالنسبة إلى <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">مخطط رحلات الغردقة</a> الذي تستفيد منه:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>دعم التحدث باللغة الألمانية</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>أسعار عادلة</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>حجز آمن</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>المنظمة المهنية</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>تجارب لا تُنسى</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>الاستنتاج</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>رحلة الأقصر من الغردقة هي رحلة لا تنسى إلى عالم الفراعنة.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>يجعل وادي الملوك ومعبد الكرنك والمعالم الأثرية الرائعة من هذه الرحلة النهارية نقطة بارزة في إجازتك في مصر.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>احجز رحلتك إلى الأقصر الآن واكتشف أسرار مصر القديمة.</p>
<!-- /wp:paragraph -->', 'Luxor Ausflug ab Hurghada: Die Geheimnisse der Pharaonen im Tal der Könige erleben', '<!-- wp:paragraph -->
<p>Ein Luxor Ausflug ab Hurghada gehört zu den beeindruckendsten Erlebnissen während eines Ägypten Urlaubs. Wer in Hurghada Urlaub macht und die faszinierende Geschichte des alten Ägyptens entdecken möchte, sollte unbedingt einen Tagesausflug nach Luxor planen.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Luxor gilt als das größte Freilichtmuseum der Welt und begeistert mit weltberühmten Tempeln, monumentalen Grabstätten und jahrtausendealter Geschichte.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Mit einem Luxor Tagesausflug ab Hurghada tauchst du tief in die Welt der Pharaonen ein und entdeckst die bedeutendsten Sehenswürdigkeiten des alten Ägyptens.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Warum ist ein Luxor Ausflug ab Hurghada so besonders?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Luxor ist eine der faszinierendsten Städte Ägyptens. Hier befand sich einst das antike Theben, die Hauptstadt der Pharaonen.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Ein Ausflug nach Luxor bietet dir die einmalige Möglichkeit, weltberühmte historische Orte mit eigenen Augen zu sehen.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Zu den Highlights gehören:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Das Tal der Könige</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Der Karnak Tempel</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Der Hatschepsut Tempel</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Die Memnon Kolosse</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Der Nil</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>Dieser Kultur-Ausflug ist ideal für alle, die Ägyptens Geschichte hautnah erleben möchten.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Das Tal der Könige – Die verborgenen Gräber der Pharaonen</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Das Tal der Könige zählt zu den berühmtesten archäologischen Stätten der Welt.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Hier wurden zahlreiche Pharaonen des Neuen Reiches begraben, darunter auch Tutanchamun.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Die kunstvoll gestalteten Grabkammern beeindrucken mit farbenprächtigen Wandmalereien und faszinierenden Hieroglyphen.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Ein Besuch im Tal der Könige gehört zu den absoluten Höhepunkten jedes Luxor Ausflugs ab Hurghada.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Der Karnak Tempel – Ein Meisterwerk der Antike</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Der Karnak Tempel ist eine der größten Tempelanlagen der Welt.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Die gewaltigen Säulenhallen, beeindruckenden Reliefs und monumentalen Tore zeigen die Macht und den Reichtum der alten ägyptischen Herrscher.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Der Tempel zählt zu den wichtigsten Sehenswürdigkeiten in Luxor.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Der Tempel der Königin Hatschepsut</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Der imposante Tempel der Hatschepsut ist einzigartig in seiner Architektur.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Er wurde direkt in die Felsen gebaut und zählt zu den schönsten Bauwerken des alten Ägyptens.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Die Geschichte der mächtigen Pharaonin macht diesen Ort besonders faszinierend.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Tipps für deinen Luxor Tagesausflug ab Hurghada</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Für den perfekten Ausflug solltest du:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>bequeme Kleidung tragen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Sonnenschutz mitnehmen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>ausreichend Wasser dabeihaben</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>eine Kamera nicht vergessen</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>Die Fahrt von Hurghada nach Luxor lohnt sich für jeden, der Ägyptens Geschichte entdecken möchte.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Warum deinen Luxor Ausflug bei Hurghada Reiseplaner buchen?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Bei <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Hurghada Reiseplaner</a> profitierst du von:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>deutschsprachiger Betreuung</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>fairen Preisen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>sicherer Buchung</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>professioneller Organisation</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>unvergesslichen Erlebnissen</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Fazit</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Ein Luxor Ausflug ab Hurghada ist eine unvergessliche Reise in die Welt der Pharaonen.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Das Tal der Könige, der Karnak Tempel und die beeindruckenden Monumente machen diesen Tagesausflug zu einem absoluten Highlight deines Ägypten Urlaubs.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Buche jetzt deinen Luxor Ausflug und entdecke die Geheimnisse des alten Ägyptens.</p>
<!-- /wp:paragraph -->', '5 Min', '[]'::jsonb),
('blog_posts', '8967bf58-d218-4388-a386-2c56fc36f861', 'hu', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Luxor kirándulás Hurghadából: Ismerje meg a fáraók titkait a Királyok Völgyében', 'Luxor kirándulás Hurghadából: Ismerje meg a fáraók titkait a Királyok Völgyében', '<!-- wp:bekezdés -->
<p>Egy luxori kirándulás Hurghadából az egyik leglenyűgözőbb élmény az egyiptomi nyaralás során. Ha Hurghadában nyaral, és szeretné felfedezni az ókori Egyiptom lenyűgöző történelmét, mindenképpen tervezzen egy napos kirándulást Luxorba.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Luxor a világ legnagyobb szabadtéri múzeuma, és világhírű templomokkal, monumentális sírokkal és több ezer éves történelemmel nyűgöz le.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Egy napos luxori kirándulással Hurghadából mélyen elmerülhet a fáraók világában, és felfedezheti az ókori Egyiptom legfontosabb látnivalóit.</p>
<p><!-- /wp:bekezdés --><!-- wp:heading --></p>
<h4><strong>Miért olyan különleges egy luxori kirándulás Hurghadából?</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>Luxor Egyiptom egyik leglenyűgözőbb városa. Egykor itt volt az ókori Théba, a fáraók fővárosa.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Egy luxori utazás egyedülálló lehetőséget kínál arra, hogy saját szemével nézzen meg világhírű történelmi helyeket.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>A kiemelések a következők:</p>
<p><!-- /wp:bekezdés --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>A Királyok Völgye</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>A karnaki templom</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>A Hatsepszuti templom</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>A Memnon kolosszusok</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>A Nílus</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:bekezdés --></p>
<p>Ez a kulturális kirándulás ideális mindenki számára, aki közelről szeretné megtapasztalni Egyiptom történelmét.</p>
<p><!-- /wp:bekezdés --><!-- wp:heading --></p>
<h4><strong>A Királyok Völgye – A fáraók rejtett sírjai</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>A Királyok Völgye a világ egyik leghíresebb régészeti lelőhelye.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Az Újbirodalom számos fáraóját itt temették el, köztük Tutanhamont is.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>A művészien megtervezett sírkamrák színes falfestményekkel és lenyűgöző hieroglifákkal lenyűgözőek.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>A Királyok Völgyének látogatása minden hurghadai luxori kirándulás egyik csúcspontja.</p>
<p><!-- /wp:bekezdés --><!-- wp:heading --></p>
<h4><strong>A karnaki templom – az ókor remekműve</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>A karnaki templom a világ egyik legnagyobb templomegyüttese.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>A hatalmas oszlopos csarnokok, a lenyűgöző domborművek és a monumentális kapuk az ókori egyiptomi uralkodók hatalmát és gazdagságát mutatják be.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>A templom Luxor egyik legfontosabb látnivalója.</p>
<p><!-- /wp:bekezdés --><!-- wp:heading --></p>
<h4><strong>Hatsepszut királynő temploma</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>Az impozáns Hatsepszut-templom építészetében egyedülálló.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Közvetlenül a sziklákba építették, és az ókori Egyiptom egyik legszebb épülete.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>A hatalmas fáraó története különösen lenyűgözővé teszi ezt a helyet.</p>
<p><!-- /wp:bekezdés --><!-- wp:heading --></p>
<h4><strong>Tippek egy napos luxori kiránduláshoz Hurghadából</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>A tökéletes utazáshoz a következőket kell tennie:</p>
<p><!-- /wp:bekezdés --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>viseljen kényelmes ruhát</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>Vigyen magával fényvédőt</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>vigyél magaddal elegendő vizet</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>ne felejtsen el egy fényképezőgépet</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:bekezdés --></p>
<p>A Hurghada és Luxor közötti utazás mindenkinek megéri, aki szeretné felfedezni Egyiptom történelmét.</p>
<p><!-- /wp:bekezdés --><!-- wp:heading --></p>
<h4><strong>Miért foglaljon luxori kirándulást a Hurghada Travel Planner segítségével?</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>A következőhöz: <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Hurghada utazástervező</a>, amelyek előnyei:</p>
<p><!-- /wp:bekezdés --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Német nyelvű támogatás</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>tisztességes árak</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>biztonságos foglalás</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>szakmai szervezet</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>feledhetetlen élmények</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Következtetés</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>Egy luxori kirándulás Hurghadából egy felejthetetlen utazás a fáraók világába.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>A Királyok Völgye, a karnaki templom és a lenyűgöző műemlékek teszik ezt az egynapos kirándulást az egyiptomi nyaralás abszolút fénypontjává.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Foglalja le luxori kirándulását most, és fedezze fel az ókori Egyiptom titkait.</p>
<!-- /wp:bekezdés -->', '5 perc', '[]'::jsonb),
('blog_posts', 'a06032c3-164a-4be2-a2d7-625cc2e7baa5', 'en', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'The best snorkeling trips in Hurghada 2025: Discover the fascinating underwater world of the Red Sea', 'The best snorkeling trips in Hurghada 2025: Discover the fascinating underwater world of the Red Sea', '<!-- wp:group {"layout":{"type":"constrained"}} -->
<p><!-- wp:freeform --></p>
<p data-start="600" data-end="877">Snorkeling in Hurghada is one of the most popular activities for holidaymakers in Egypt. The crystal clear waters of the Red Sea, colorful coral reefs and an impressive variety of exotic marine life make Hurghada one of the best snorkeling destinations in the world.</p>
<p data-start="879" data-end="1000">If you spend your vacation on the Red Sea, you definitely shouldn''t miss the fascinating underwater world.</p>
<p data-start="1002" data-end="1179">With the snorkeling trips from <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noopener">Hurghada travel planner</a> you will discover the most beautiful snorkeling spots in Hurghada and experience unforgettable adventures in the Red Sea.</p>
<h4><strong>Why is snorkeling in Hurghada so special?</strong></h4>
<p data-start="1233" data-end="1342">Hurghada is known worldwide for its unique coral reefs and its extraordinary biodiversity.</p>
<p data-start="1344" data-end="1400">The Red Sea offers ideal conditions for snorkeling:</p>
<ul data-start="1402" data-end="1558">
<li data-section-id="131ywpp" data-start="1402" data-end="1427">Crystal clear water</li>
<li data-section-id="di6fd0" data-start="1428" data-end="1465">Pleasant temperatures all year round</li>
<li data-section-id="1v0s2f8" data-start="1466" data-end="1499">Colorful coral reefs</li>
<li data-section-id="tfd6m" data-start="1500" data-end="1524">Tropical fish species</li>
<li data-section-id="q4k63e" data-start="1525" data-end="1558">High visibility underwater</li>
</ul>
<p data-start="1560" data-end="1638">These perfect conditions make Hurghada a paradise for snorkelers.</p>
<h4><strong>The most beautiful snorkeling spots in Hurghada</strong></h4>
<h4 data-section-id="2n4rgs" data-start="1686" data-end="1700"><strong>Orange Bay</strong></h4>
<p data-start="1702" data-end="1767">Orange Bay is one of the most beautiful excursion destinations in Hurghada.</p>
<p data-start="1769" data-end="1885">In addition to beautiful sandy beaches, beautiful snorkeling areas with impressive coral formations await you.</p>
<h4 data-section-id="1xqnlz6" data-start="1887" data-end="1906"><strong>Paradise Island</strong></h4>
<p data-start="1908" data-end="1996">Paradise Island is ideal for anyone who wants to combine relaxation and snorkeling.</p>
<p data-start="1998" data-end="2101">The turquoise water and the fascinating underwater world make this excursion particularly popular.</p>
<h4 data-section-id="scm130" data-start="2103" data-end="2120"><strong>Giftun Island</strong></h4>
<p data-start="2122" data-end="2193">Giftun Island is one of the most famous snorkeling spots in the Red Sea.</p>
<p data-start="2195" data-end="2271">Here you can discover exotic fish and colorful coral reefs.</p>
<h4 data-section-id="1aljbne" data-start="2273" data-end="2290"><strong>Dolphin House</strong></h4>
<p data-start="2292" data-end="2399">The Dolphin House offers the unique opportunity to observe dolphins in their natural environment.</p>
<p data-start="2401" data-end="2456">With a bit of luck you can even swim with dolphins.</p>
<h4 data-section-id="1bghd57" data-start="2458" data-end="2532"><strong>What sea creatures can you discover while snorkeling in Hurghada?</strong></h4>
<p data-start="2534" data-end="2612">You can experience an impressive variety while snorkeling in the Red Sea:</p>
<ul data-start="2614" data-end="2743">
<li data-section-id="b8tv6x" data-start="2614" data-end="2634">Colorful reef fish</li>
<li data-section-id="1kg4cbe" data-start="2635" data-end="2654">Parrotfish</li>
<li data-section-id="izusbn" data-start="2655" data-end="2670">Clownfish</li>
<li data-section-id="gnbbth" data-start="2671" data-end="2681">rays</li>
<li data-section-id="s34uv5" data-start="2682" data-end="2693">Dolphins</li>
<li data-section-id="dpn3mp" data-start="2694" data-end="2710">Turtles</li>
<li data-section-id="1aq2272" data-start="2711" data-end="2743">Stunning coral reefs</li>
</ul>
<p data-start="2745" data-end="2809">Every snorkeling trip becomes a unique experience.</p>
<h4 data-section-id="10dztmc" data-start="2811" data-end="2860"><strong>Tips for your snorkeling adventure in Hurghada</strong></h4>
<p data-start="2862" data-end="2917">To make your snorkeling trip perfect, you should:</p>
<ul data-start="2919" data-end="3069">
<li data-section-id="3stopd" data-start="2919" data-end="2944">Use sunscreen</li>
<li data-section-id="11603ap" data-start="2945" data-end="2976">Take a pair of sunglasses</li>
<li data-section-id="1nw4clx" data-start="2977" data-end="3007">Drink enough water</li>
<li data-section-id="q1bqdf" data-start="3008" data-end="3047">Have a waterproof camera with you</li>
<li data-section-id="r7u7qr" data-start="3048" data-end="3069">Book early</li>
</ul>
<h4 data-section-id="1cusigi" data-start="3071" data-end="3119"><strong>Who is snorkeling in Hurghada suitable for?</strong></h4>
<p data-start="3121" data-end="3169">Snorkeling in Hurghada is perfect for:</p>
<ul data-start="3171" data-end="3251">
<li data-section-id="sfmced" data-start="3171" data-end="3183">Families</li>
<li data-section-id="y3w173" data-start="3184" data-end="3193">pairs</li>
<li data-section-id="45wq8r" data-start="3194" data-end="3206">Beginners</li>
<li data-section-id="1nvu7ef" data-start="3207" data-end="3232">Experienced snorkelers</li>
<li data-section-id="11vfv3e" data-start="3233" data-end="3251">Nature lovers</li>
</ul>
<p data-start="3253" data-end="3342">Thanks to professional support, even beginners can safely discover the underwater world.</p>
<h4 data-section-id="1nm710g" data-start="3344" data-end="3405"><strong>Why book snorkeling trips with Hurghada Travel Planner?</strong></h4>
<p data-start="3407" data-end="3451">With Hurghada Travel Planner you benefit from:</p>
<ul data-start="3453" data-end="3597">
<li data-section-id="8lg5io" data-start="3453" data-end="3482">German-language service</li>
<li data-section-id="15ws66q" data-start="3483" data-end="3502">safe tours</li>
<li data-section-id="sozxbi" data-start="3503" data-end="3535">professional organization</li>
<li data-section-id="1jsokg9" data-start="3536" data-end="3554">fair prices</li>
<li data-section-id="lpks3x" data-start="3555" data-end="3597">the best snorkeling spots in Hurghada</li>
</ul>
<h4 data-section-id="1j5vr0f" data-start="3599" data-end="3665"><strong>Conclusion: Snorkeling in Hurghada is an unforgettable experience</strong></h4>
<p data-start="3667" data-end="3770">The fascinating underwater world of the Red Sea is one of the most beautiful natural experiences in Egypt.</p>
<p data-start="3772" data-end="3845">If you visit Hurghada, you shouldn''t miss this adventure.</p>
<p data-start="3847" data-end="3941">Book your snorkeling trip now and discover the colorful underwater world of the Red Sea.</p>
<p><!-- /wp:freeform --></p>
<!-- /wp:group --><!-- wp:code -->
<pre><code></code></pre>
<!-- /wp:code -->', '5 mins', '[]'::jsonb),
('blog_posts', 'a06032c3-164a-4be2-a2d7-625cc2e7baa5', 'fr', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Les meilleurs voyages de snorkeling à Hurghada 2025 : découvrez le monde sous-marin fascinant de la mer Rouge', 'Les meilleurs voyages de snorkeling à Hurghada 2025 : découvrez le monde sous-marin fascinant de la mer Rouge', '<!-- wp:group {"layout":{"type":"constrained"}} -->
<p><!-- wp:forme libre --></p>
<p data-start="600" data-end="877">La plongée en apnée à Hurghada est l''une des activités les plus populaires auprès des vacanciers en Égypte. Les eaux cristallines de la mer Rouge, les récifs coralliens colorés et une variété impressionnante de vie marine exotique font d''Hurghada l''une des meilleures destinations de plongée en apnée au monde.</p>
<p data-start="879" data-end="1000">Si vous passez vos vacances sur la mer Rouge, vous ne devriez certainement pas manquer le fascinant monde sous-marin.</p>
<p data-start="1002" data-end="1179">Avec les sorties snorkeling de <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noopener">Planificateur de voyage Hurghada</a> vous découvrirez les plus beaux spots de plongée en apnée d''Hurghada et vivrez des aventures inoubliables dans la mer Rouge.</p>
<h4><strong>Pourquoi la plongée en apnée à Hurghada est-elle si spéciale ?</strong></h4>
<p data-start="1233" data-end="1342">Hurghada est connue dans le monde entier pour ses récifs coralliens uniques et son extraordinaire biodiversité.</p>
<p data-start="1344" data-end="1400">La mer Rouge offre des conditions idéales pour la plongée en apnée :</p>
<ul data-start="1402" data-end="1558">
<li data-section-id="131ywpp" data-start="1402" data-end="1427">Eau cristalline</li>
<li data-section-id="di6fd0" data-start="1428" data-end="1465">Des températures agréables toute l''année</li>
<li data-section-id="1v0s2f8" data-start="1466" data-end="1499">Récifs coralliens colorés</li>
<li data-section-id="tfd6m" data-start="1500" data-end="1524">Espèces de poissons tropicaux</li>
<li data-section-id="q4k63e" data-start="1525" data-end="1558">Haute visibilité sous l''eau</li>
</ul>
<p data-start="1560" data-end="1638">Ces conditions parfaites font d''Hurghada un paradis pour les plongeurs en apnée.</p>
<h4><strong>Les plus beaux spots de snorkeling d''Hurghada</strong></h4>
<h4 data-section-id="2n4rgs" data-start="1686" data-end="1700"><strong>Orange Bay</strong></h4>
<p data-start="1702" data-end="1767">Orange Bay est l''une des plus belles destinations d''excursion d''Hurghada.</p>
<p data-start="1769" data-end="1885">En plus de belles plages de sable fin, de belles zones de snorkeling avec d''impressionnantes formations coralliennes vous attendent.</p>
<h4 data-section-id="1xqnlz6" data-start="1887" data-end="1906"><strong>Île paradisiaque</strong></h4>
<p data-start="1908" data-end="1996">Paradise Island est idéal pour tous ceux qui souhaitent combiner détente et plongée en apnée.</p>
<p data-start="1998" data-end="2101">L''eau turquoise et le monde sous-marin fascinant rendent cette excursion particulièrement populaire.</p>
<h4 data-section-id="scm130" data-start="2103" data-end="2120"><strong>Île Giftun</strong></h4>
<p data-start="2122" data-end="2193">L''île Giftun est l''un des sites de plongée en apnée les plus célèbres de la mer Rouge.</p>
<p data-start="2195" data-end="2271">Ici, vous pourrez découvrir des poissons exotiques et des récifs coralliens colorés.</p>
<h4 data-section-id="1aljbne" data-start="2273" data-end="2290"><strong>Maison des dauphins</strong></h4>
<p data-start="2292" data-end="2399">La Dolphin House offre l''opportunité unique d''observer les dauphins dans leur environnement naturel.</p>
<p data-start="2401" data-end="2456">Avec un peu de chance, vous pourrez même nager avec les dauphins.</p>
<h4 data-section-id="1bghd57" data-start="2458" data-end="2532"><strong>Quelles créatures marines pouvez-vous découvrir en faisant de la plongée en apnée à Hurghada ?</strong></h4>
<p data-start="2534" data-end="2612">Vous pouvez découvrir une variété impressionnante lors de la plongée en apnée dans la mer Rouge :</p>
<ul data-start="2614" data-end="2743">
<li data-section-id="b8tv6x" data-start="2614" data-end="2634">Poissons de récif colorés</li>
<li data-section-id="1kg4cbe" data-start="2635" data-end="2654">Poisson perroquet</li>
<li data-section-id="izusbn" data-start="2655" data-end="2670">Poisson clown</li>
<li data-section-id="gnbbth" data-start="2671" data-end="2681">rayons</li>
<li data-section-id="s34uv5" data-start="2682" data-end="2693">Dauphins</li>
<li data-section-id="dpn3mp" data-start="2694" data-end="2710">Tortues</li>
<li data-section-id="1aq2272" data-start="2711" data-end="2743">Superbes récifs coralliens</li>
</ul>
<p data-start="2745" data-end="2809">Chaque sortie de plongée en apnée devient une expérience unique.</p>
<h4 data-section-id="10dztmc" data-start="2811" data-end="2860"><strong>Conseils pour votre aventure de plongée en apnée à Hurghada</strong></h4>
<p data-start="2862" data-end="2917">Pour que votre voyage de plongée en apnée soit parfait, vous devez :</p>
<ul data-start="2919" data-end="3069">
<li data-section-id="3stopd" data-start="2919" data-end="2944">Utilisez un écran solaire</li>
<li data-section-id="11603ap" data-start="2945" data-end="2976">Prenez une paire de lunettes de soleil</li>
<li data-section-id="1nw4clx" data-start="2977" data-end="3007">Boire suffisamment d''eau</li>
<li data-section-id="q1bqdf" data-start="3008" data-end="3047">Ayez un appareil photo étanche avec vous</li>
<li data-section-id="r7u7qr" data-start="3048" data-end="3069">Réservez tôt</li>
</ul>
<h4 data-section-id="1cusigi" data-start="3071" data-end="3119"><strong>À qui convient la plongée en apnée à Hurghada ?</strong></h4>
<p data-start="3121" data-end="3169">La plongée en apnée à Hurghada est parfaite pour :</p>
<ul data-start="3171" data-end="3251">
<li data-section-id="sfmced" data-start="3171" data-end="3183">Familles</li>
<li data-section-id="y3w173" data-start="3184" data-end="3193">paires</li>
<li data-section-id="45wq8r" data-start="3194" data-end="3206">Débutants</li>
<li data-section-id="1nvu7ef" data-start="3207" data-end="3232">Plongeurs expérimentés</li>
<li data-section-id="11vfv3e" data-start="3233" data-end="3251">Amoureux de la nature</li>
</ul>
<p data-start="3253" data-end="3342">Grâce à un accompagnement professionnel, même les débutants peuvent découvrir le monde sous-marin en toute sécurité.</p>
<h4 data-section-id="1nm710g" data-start="3344" data-end="3405"><strong>Pourquoi réserver des voyages de plongée avec tuba avec Hurghada Travel Planner ?</strong></h4>
<p data-start="3407" data-end="3451">Avec Hurghada Travel Planner, vous bénéficiez de :</p>
<ul data-start="3453" data-end="3597">
<li data-section-id="8lg5io" data-start="3453" data-end="3482">Service en langue allemande</li>
<li data-section-id="15ws66q" data-start="3483" data-end="3502">visites sécurisées</li>
<li data-section-id="sozxbi" data-start="3503" data-end="3535">organisation professionnelle</li>
<li data-section-id="1jsokg9" data-start="3536" data-end="3554">prix équitables</li>
<li data-section-id="lpks3x" data-start="3555" data-end="3597">les meilleurs spots de plongée en apnée à Hurghada</li>
</ul>
<h4 data-section-id="1j5vr0f" data-start="3599" data-end="3665"><strong>Conclusion : le snorkeling à Hurghada est une expérience inoubliable</strong></h4>
<p data-start="3667" data-end="3770">Le monde sous-marin fascinant de la mer Rouge est l''une des plus belles expériences naturelles d''Égypte.</p>
<p data-start="3772" data-end="3845">Si vous visitez Hurghada, vous ne devriez pas manquer cette aventure.</p>
<p data-start="3847" data-end="3941">Réservez dès maintenant votre sortie de plongée en apnée et découvrez le monde sous-marin coloré de la mer Rouge.</p>
<p><!-- /wp:freeform --></p>
<!-- /wp:group --><!-- wp:code -->
<pre><code></code></pre>
<!-- /wp:code -->', '5 minutes', '[]'::jsonb),
('blog_posts', 'a06032c3-164a-4be2-a2d7-625cc2e7baa5', 'ru', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Лучшие поездки для подводного плавания в Хургаде 2025 года: откройте для себя увлекательный подводный мир Красного моря
---ЦЭП---
Лучшие поездки для подводного плавания в Хургаде 2025 года: откройте для себя увлекательный подводный мир Красного моря
---ЦЭП---
5 минут
---ЦЭП---
<!-- wp:group {"layout":{"type":"constrained"}} -->
<p><!-- wp:freeform --></p>
<p data-start="600" data-end="877">Подводное плавание в Хургаде — одно из самых популярных развлечений среди отдыхающих в Египте. Кристально чистые воды Красного моря, красочные коралловые рифы и впечатляющее разнообразие экзотической морской жизни делают Хургаду одним из лучших мест для подводного плавания в мире.</p>
<p data-start="879" data-end="1000">Если вы проведете отпуск на Красном море, вам точно не стоит пропустить увлекательный подводный мир.</p>
<p data-start="1002" data-end="1179">С поездками с маской и трубкой от <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noopener">Планировщик путешествий по Хургаде</a> вы откроете для себя самые красивые места для подводного плавания в Хургаде и испытаете незабываемые приключения на Красном море.</p>
<h4><strong>Почему сноркелинг в Хургаде такой особенный?</strong></h4>
<p data-start="1233" data-end="1342">Хургада известна во всем мире своими уникальными коралловыми рифами и необыкновенным биоразнообразием.</p>
<p data-start="1344" data-end="1400">Красное море предлагает идеальные условия для подводного плавания:</p>
<ul data-start="1402" data-end="1558">
<li data-section-id="131ywpp" data-start="1402" data-end="1427">Кристально чистая вода</li>
<li data-section-id="di6fd0" data-start="1428" data-end="1465">Приятная температура круглый год</li>
<li data-section-id="1v0s2f8" data-start="1466" data-end="1499">Красочные коралловые рифы</li>
<li data-section-id="tfd6m" data-start="1500" data-end="1524">Тропические виды рыб</li>
<li data-section-id="q4k63e" data-start="1525" data-end="1558">Высокая видимость под водой</li>
</ul>
<p data-start="1560" data-end="1638">Эти идеальные условия делают Хургаду раем для любителей подводного плавания.</p>
<h4><strong>Самые красивые места для сноркелинга в Хургаде</strong></h4>
<h4 data-section-id="2n4rgs" data-start="1686" data-end="1700"><strong>Ориндж Бэй</strong></h4>
<p data-start="1702" data-end="1767">Ориндж Бэй — одно из самых красивых экскурсионных мест Хургады.</p>
<p data-start="1769" data-end="1885">Помимо прекрасных песчаных пляжей вас ждут прекрасные места для подводного плавания с впечатляющими коралловыми образованиями.</p>
<h4 data-section-id="1xqnlz6" data-start="1887" data-end="1906"><strong>Райский остров</strong></h4>
<p data-start="1908" data-end="1996">Райский остров идеально подходит для всех, кто хочет совместить отдых и подводное плавание.</p>
<p data-start="1998" data-end="2101">Бирюзовая вода и увлекательный подводный мир делают эту экскурсию особенно популярной.</p>
<h4 data-section-id="scm130" data-start="2103" data-end="2120"><strong>Остров Гифтун</strong></h4>
<p data-start="2122" data-end="2193">Остров Гифтун – одно из самых известных мест для подводного плавания в Красном море.</p>
<p data-start="2195" data-end="2271">Здесь можно обнаружить экзотических рыб и красочные коралловые рифы.</p>
<h4 data-section-id="1aljbne" data-start="2273" data-end="2290"><strong>Дом Дельфина</strong></h4>
<p data-start="2292" data-end="2399">Дом дельфинов предлагает уникальную возможность наблюдать за дельфинами в их естественной среде обитания.</p>
<p data-start="2401" data-end="2456">Если повезет, вы даже сможете плавать с дельфинами.</p>
<h4 data-section-id="1bghd57" data-start="2458" data-end="2532"><strong>Каких морских существ можно обнаружить во время подводного плавания в Хургаде?</strong></h4>
<p data-start="2534" data-end="2612">Вы можете испытать впечатляющее разнообразие во время подводного плавания в Красном море:</p>
<ul data-start="2614" data-end="2743">
<li data-section-id="b8tv6x" data-start="2614" data-end="2634">Разноцветные рифовые рыбы</li>
<li data-section-id="1kg4cbe" data-start="2635" data-end="2654">Рыба-попугай</li>
<li data-section-id="izusbn" data-start="2655" data-end="2670">Рыба-клоун</li>
<li data-section-id="gnbbth" data-start="2671" data-end="2681">лучи</li>
<li data-section-id="s34uv5" data-start="2682" data-end="2693">Дельфины</li>
<li data-section-id="dpn3mp" data-start="2694" data-end="2710">Черепахи</li>
<li data-section-id="1aq2272" data-start="2711" data-end="2743">Потрясающие коралловые рифы</li>
</ul>
<p data-start="2745" data-end="2809">Каждая поездка на подводное плавание становится уникальным опытом.</p>
<h4 data-section-id="10dztmc" data-start="2811" data-end="2860"><strong>Советы для подводного плавания в Хургаде</strong></h4>
<p data-start="2862" data-end="2917">Чтобы ваше подводное плавание прошло идеально, вам следует:</p>
<ul data-start="2919" data-end="3069">
<li data-section-id="3stopd" data-start="2919" data-end="2944">Используйте солнцезащитный крем</li>
<li data-section-id="11603ap" data-start="2945" data-end="2976">Возьмите солнцезащитные очки</li>
<li data-section-id="1nw4clx" data-start="2977" data-end="3007">Пейте достаточно воды</li>
<li data-section-id="q1bqdf" data-start="3008" data-end="3047">Имейте с собой водонепроницаемую камеру</li>
<li data-section-id="r7u7qr" data-start="3048" data-end="3069">Бронируйте заранее</li>
</ul>
<h4 data-section-id="1cusigi" data-start="3071" data-end="3119"><strong>Кому подходит снорклинг в Хургаде?</strong></h4>
<p data-start="3121" data-end="3169">Подводное плавание в Хургаде идеально подходит для:</p>
<ul data-start="3171" data-end="3251">
<li data-section-id="sfmced" data-start="3171" data-end="3183">Семьи</li>
<li data-section-id="y3w173" data-start="3184" data-end="3193">пары</li>
<li data-section-id="45wq8r" data-start="3194" data-end="3206">Новички</li>
<li data-section-id="1nvu7ef" data-start="3207" data-end="3232">Опытные любители подводного плавания</li>
<li data-section-id="11vfv3e" data-start="3233" data-end="3251">Любители природы</li>
</ul>
<p data-start="3253" data-end="3342">Благодаря профессиональной поддержке даже новички смогут безопасно открыть для себя подводный мир.</p>
<h4 data-section-id="1nm710g" data-start="3344" data-end="3405"><strong>Зачем бронировать поездки для подводного плавания с помощью Hurghada Travel Planner?</strong></h4>
<p data-start="3407" data-end="3451">С Hurghada Travel Planner вы получаете следующие преимущества:</p>
<ul data-start="3453" data-end="3597">
<li data-section-id="8lg5io" data-start="3453" data-end="3482">Сервис на немецком языке</li>
<li data-section-id="15ws66q" data-start="3483" data-end="3502">безопасные туры</li>
<li data-section-id="sozxbi" data-start="3503" data-end="3535">профессиональная организация</li>
<li data-section-id="1jsokg9" data-start="3536" data-end="3554">справедливые цены</li>
<li data-section-id="lpks3x" data-start="3555" data-end="3597">лучшие места для подводного плавания в Хургаде</li>
</ul>
<h4 data-section-id="1j5vr0f" data-start="3599" data-end="3665"><strong>Вывод: подводное плавание в Хургаде — это незабываемые впечатления</strong></h4>
<p data-start="3667" data-end="3770">Увлекательный подводный мир Красного моря — одно из самых красивых природных явлений Египта.</p>
<p data-start="3772" data-end="3845">Если вы посетите Хургаду, вы не должны пропустить это приключение.</p>
<p data-start="3847" data-end="3941">Забронируйте поездку для подводного плавания прямо сейчас и откройте для себя красочный подводный мир Красного моря.</p>
<p><!-- /wp:freeform --></p>
<!-- /wp:group --><!-- wp:code -->
<pre><code></code></pre>
<!-- /wp:код -->', 'Die besten Schnorchel-Ausflüge in Hurghada 2025: Die faszinierende Unterwasserwelt des Roten Meeres entdecken', '<!-- wp:group {"layout":{"type":"constrained"}} -->
<p><!-- wp:freeform --></p>
<p data-start="600" data-end="877">Schnorcheln in Hurghada gehört zu den beliebtesten Aktivitäten für Urlauber in Ägypten. Das kristallklare Wasser des Roten Meeres, farbenfrohe Korallenriffe und eine beeindruckende Vielfalt exotischer Meeresbewohner machen Hurghada zu einem der besten Schnorchelziele weltweit.</p>
<p data-start="879" data-end="1000">Wer seinen Urlaub am Roten Meer verbringt, sollte sich die faszinierende Unterwasserwelt auf keinen Fall entgehen lassen.</p>
<p data-start="1002" data-end="1179">Mit den Schnorchel-Ausflügen von <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noopener">Hurghada Reiseplaner</a> entdeckst du die schönsten Schnorchelspots in Hurghada und erlebst unvergessliche Abenteuer im Roten Meer.</p>
<h4><strong>Warum ist Schnorcheln in Hurghada so besonders?</strong></h4>
<p data-start="1233" data-end="1342">Hurghada ist weltweit bekannt für seine einzigartigen Korallenriffe und seine außergewöhnliche Artenvielfalt.</p>
<p data-start="1344" data-end="1400">Das Rote Meer bietet ideale Bedingungen zum Schnorcheln:</p>
<ul data-start="1402" data-end="1558">
<li data-section-id="131ywpp" data-start="1402" data-end="1427">Kristallklares Wasser</li>
<li data-section-id="di6fd0" data-start="1428" data-end="1465">Ganzjährig angenehme Temperaturen</li>
<li data-section-id="1v0s2f8" data-start="1466" data-end="1499">Farbenprächtige Korallenriffe</li>
<li data-section-id="tfd6m" data-start="1500" data-end="1524">Tropische Fischarten</li>
<li data-section-id="q4k63e" data-start="1525" data-end="1558">Hohe Sichtweiten unter Wasser</li>
</ul>
<p data-start="1560" data-end="1638">Diese perfekten Bedingungen machen Hurghada zu einem Paradies für Schnorchler.</p>
<h4><strong>Die schönsten Schnorchelspots in Hurghada</strong></h4>
<h4 data-section-id="2n4rgs" data-start="1686" data-end="1700"><strong>Orange Bay</strong></h4>
<p data-start="1702" data-end="1767">Die Orange Bay zählt zu den schönsten Ausflugszielen in Hurghada.</p>
<p data-start="1769" data-end="1885">Neben traumhaften Sandstränden erwarten dich wunderschöne Schnorchelgebiete mit beeindruckenden Korallenformationen.</p>
<h4 data-section-id="1xqnlz6" data-start="1887" data-end="1906"><strong>Paradise Island</strong></h4>
<p data-start="1908" data-end="1996">Paradise Island ist ideal für alle, die Entspannung und Schnorcheln kombinieren möchten.</p>
<p data-start="1998" data-end="2101">Das türkisfarbene Wasser und die faszinierende Unterwasserwelt machen diesen Ausflug besonders beliebt.</p>
<h4 data-section-id="scm130" data-start="2103" data-end="2120"><strong>Giftun Island</strong></h4>
<p data-start="2122" data-end="2193">Giftun Island gehört zu den bekanntesten Schnorchelspots im Roten Meer.</p>
<p data-start="2195" data-end="2271">Hier kannst du exotische Fische und farbenprächtige Korallenriffe entdecken.</p>
<h4 data-section-id="1aljbne" data-start="2273" data-end="2290"><strong>Dolphin House</strong></h4>
<p data-start="2292" data-end="2399">Das Dolphin House bietet die einzigartige Möglichkeit, Delfine in ihrer natürlichen Umgebung zu beobachten.</p>
<p data-start="2401" data-end="2456">Mit etwas Glück kannst du sogar mit Delfinen schwimmen.</p>
<h4 data-section-id="1bghd57" data-start="2458" data-end="2532"><strong>Welche Meeresbewohner kannst du beim Schnorcheln in Hurghada entdecken?</strong></h4>
<p data-start="2534" data-end="2612">Beim Schnorcheln im Roten Meer kannst du eine beeindruckende Vielfalt erleben:</p>
<ul data-start="2614" data-end="2743">
<li data-section-id="b8tv6x" data-start="2614" data-end="2634">Bunte Rifffische</li>
<li data-section-id="1kg4cbe" data-start="2635" data-end="2654">Papageienfische</li>
<li data-section-id="izusbn" data-start="2655" data-end="2670">Clownfische</li>
<li data-section-id="gnbbth" data-start="2671" data-end="2681">Rochen</li>
<li data-section-id="s34uv5" data-start="2682" data-end="2693">Delfine</li>
<li data-section-id="dpn3mp" data-start="2694" data-end="2710">Schildkröten</li>
<li data-section-id="1aq2272" data-start="2711" data-end="2743">Atemberaubende Korallenriffe</li>
</ul>
<p data-start="2745" data-end="2809">Jeder Schnorchelausflug wird so zu einem einzigartigen Erlebnis.</p>
<h4 data-section-id="10dztmc" data-start="2811" data-end="2860"><strong>Tipps für dein Schnorchelabenteuer in Hurghada</strong></h4>
<p data-start="2862" data-end="2917">Damit dein Schnorchelausflug perfekt wird, solltest du:</p>
<ul data-start="2919" data-end="3069">
<li data-section-id="3stopd" data-start="2919" data-end="2944">Sonnencreme verwenden</li>
<li data-section-id="11603ap" data-start="2945" data-end="2976">Eine Sonnenbrille mitnehmen</li>
<li data-section-id="1nw4clx" data-start="2977" data-end="3007">Ausreichend Wasser trinken</li>
<li data-section-id="q1bqdf" data-start="3008" data-end="3047">Eine wasserdichte Kamera dabeihaben</li>
<li data-section-id="r7u7qr" data-start="3048" data-end="3069">Frühzeitig buchen</li>
</ul>
<h4 data-section-id="1cusigi" data-start="3071" data-end="3119"><strong>Für wen ist Schnorcheln in Hurghada geeignet?</strong></h4>
<p data-start="3121" data-end="3169">Schnorcheln in Hurghada eignet sich perfekt für:</p>
<ul data-start="3171" data-end="3251">
<li data-section-id="sfmced" data-start="3171" data-end="3183">Familien</li>
<li data-section-id="y3w173" data-start="3184" data-end="3193">Paare</li>
<li data-section-id="45wq8r" data-start="3194" data-end="3206">Anfänger</li>
<li data-section-id="1nvu7ef" data-start="3207" data-end="3232">Erfahrene Schnorchler</li>
<li data-section-id="11vfv3e" data-start="3233" data-end="3251">Naturliebhaber</li>
</ul>
<p data-start="3253" data-end="3342">Dank professioneller Betreuung können auch Anfänger die Unterwasserwelt sicher entdecken.</p>
<h4 data-section-id="1nm710g" data-start="3344" data-end="3405"><strong>Warum Schnorchel-Ausflüge bei Hurghada Reiseplaner buchen?</strong></h4>
<p data-start="3407" data-end="3451">Bei Hurghada Reiseplaner profitierst du von:</p>
<ul data-start="3453" data-end="3597">
<li data-section-id="8lg5io" data-start="3453" data-end="3482">deutschsprachigem Service</li>
<li data-section-id="15ws66q" data-start="3483" data-end="3502">sicheren Touren</li>
<li data-section-id="sozxbi" data-start="3503" data-end="3535">professioneller Organisation</li>
<li data-section-id="1jsokg9" data-start="3536" data-end="3554">fairen Preisen</li>
<li data-section-id="lpks3x" data-start="3555" data-end="3597">den besten Schnorchelspots in Hurghada</li>
</ul>
<h4 data-section-id="1j5vr0f" data-start="3599" data-end="3665"><strong>Fazit: Schnorcheln in Hurghada ist ein unvergessliches Erlebnis</strong></h4>
<p data-start="3667" data-end="3770">Die faszinierende Unterwasserwelt des Roten Meeres gehört zu den schönsten Naturerlebnissen in Ägypten.</p>
<p data-start="3772" data-end="3845">Wer Hurghada besucht, sollte sich dieses Abenteuer nicht entgehen lassen.</p>
<p data-start="3847" data-end="3941">Buche jetzt deinen Schnorchel-Ausflug und entdecke die bunte Unterwasserwelt des Roten Meeres.</p>
<p><!-- /wp:freeform --></p>
<!-- /wp:group --><!-- wp:code -->
<pre><code></code></pre>
<!-- /wp:code -->', '5 Min', '[]'::jsonb),
('blog_posts', 'a06032c3-164a-4be2-a2d7-625cc2e7baa5', 'ar', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'أفضل رحلات الغطس في الغردقة 2025: اكتشف عالم البحر الأحمر الرائع تحت الماء
--- تسيب ---
أفضل رحلات الغطس في الغردقة 2025: اكتشف عالم البحر الأحمر الرائع تحت الماء
--- تسيب ---
5 دقائق
--- تسيب ---
<!-- wp:group {"layout":{"type":"constrained"}} -->
<p><!-- wp:freeform --></p>
<p data-start="600" data-end="877">يعد الغطس في الغردقة أحد الأنشطة الأكثر شعبية لقضاء العطلات في مصر. إن مياه البحر الأحمر الصافية والشعاب المرجانية الملونة ومجموعة متنوعة رائعة من الحياة البحرية الغريبة تجعل من الغردقة واحدة من أفضل وجهات الغطس في العالم.</p>
<p data-start="879" data-end="1000">إذا كنت تقضي إجازتك في البحر الأحمر، فمن المؤكد أنك لا ينبغي أن تفوت عالم تحت الماء الرائع.</p>
<p data-start="1002" data-end="1179">مع رحلات الغطس من <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noopener">مخطط رحلات الغردقة</a> سوف تكتشف أجمل أماكن الغطس في الغردقة وتعيش مغامرات لا تنسى في البحر الأحمر.</p>
<h4><strong>لماذا يعتبر الغطس في الغردقة مميزًا جدًا؟</strong></h4>
<p data-start="1233" data-end="1342">تشتهر الغردقة في جميع أنحاء العالم بشعابها المرجانية الفريدة وتنوعها البيولوجي الاستثنائي.</p>
<p data-start="1344" data-end="1400">يوفر البحر الأحمر ظروفًا مثالية للغطس:</p>
<ul data-start="1402" data-end="1558">
<li data-section-id="131ywpp" data-start="1402" data-end="1427">مياه صافية </li>
<li data-section-id="di6fd0" data-start="1428" data-end="1465">درجات حرارة لطيفة طوال العام</li>
<li data-section-id="1v0s2f8" data-start="1466" data-end="1499">الشعاب المرجانية الملونة</li>
<li data-section-id="tfd6m" data-start="1500" data-end="1524">أنواع الأسماك الاستوائية</li>
<li data-section-id="q4k63e" data-start="1525" data-end="1558">رؤية عالية تحت الماء</li>
</ul>
<p data-start="1560" data-end="1638">هذه الظروف المثالية تجعل من الغردقة جنة لمحبي الغطس.</p>
<h4><strong>أجمل أماكن الغطس في الغردقة</strong></h4>
<h4 data-section-id="2n4rgs" data-start="1686" data-end="1700"><strong>أورانج باي</strong></h4>
<p data-start="1702" data-end="1767">أورانج باي من أجمل الوجهات السياحية في الغردقة.</p>
<p data-start="1769" data-end="1885">بالإضافة إلى الشواطئ الرملية الجميلة، تنتظرك مناطق الغطس الجميلة ذات التكوينات المرجانية الرائعة.</p>
<h4 data-section-id="1xqnlz6" data-start="1887" data-end="1906"><strong>جزيرة الفردوس</strong></h4>
<p data-start="1908" data-end="1996">تعتبر جزيرة باراديس مثالية لأي شخص يرغب في الجمع بين الاسترخاء والغطس.</p>
<p data-start="1998" data-end="2101">تجعل المياه الفيروزية والعالم الرائع تحت الماء هذه الرحلة ذات شعبية خاصة.</p>
<h4 data-section-id="scm130" data-start="2103" data-end="2120"><strong>جزيرة الجفتون</strong></h4>
<p data-start="2122" data-end="2193">تعد جزيرة الجفتون من أشهر أماكن الغطس في البحر الأحمر.</p>
<p data-start="2195" data-end="2271">هنا يمكنك اكتشاف الأسماك الغريبة والشعاب المرجانية الملونة.</p>
<h4 data-section-id="1aljbne" data-start="2273" data-end="2290"><strong>بيت الدلافين</strong></h4>
<p data-start="2292" data-end="2399">يوفر بيت الدلافين فرصة فريدة لمراقبة الدلافين في بيئتها الطبيعية.</p>
<p data-start="2401" data-end="2456">مع قليل من الحظ، يمكنك السباحة مع الدلافين.</p>
<h4 data-section-id="1bghd57" data-start="2458" data-end="2532"><strong>ما هي الكائنات البحرية التي يمكنك اكتشافها أثناء الغطس في الغردقة؟</strong></h4>
<p data-start="2534" data-end="2612">يمكنك تجربة مجموعة متنوعة رائعة أثناء الغطس في البحر الأحمر:</p>
<ul data-start="2614" data-end="2743">
<li data-section-id="b8tv6x" data-start="2614" data-end="2634">أسماك الشعاب المرجانية الملونة</li>
<li data-section-id="1kg4cbe" data-start="2635" data-end="2654">سمكة الببغاء</li>
<li data-section-id="izusbn" data-start="2655" data-end="2670">سمكة المهرج</li>
<li data-section-id="gnbbth" data-start="2671" data-end="2681">الأشعة</li>
<li data-section-id="s34uv5" data-start="2682" data-end="2693">الدلافين</li>
<li data-section-id="dpn3mp" data-start="2694" data-end="2710">السلاحف</li>
<li data-section-id="1aq2272" data-start="2711" data-end="2743">الشعاب المرجانية المذهلة</li>
</ul>
<p data-start="2745" data-end="2809">تصبح كل رحلة غطس تجربة فريدة من نوعها.</p>
<h4 data-section-id="10dztmc" data-start="2811" data-end="2860"><strong>نصائح لمغامرة الغطس في الغردقة</strong></h4>
<p data-start="2862" data-end="2917">لجعل رحلة الغطس مثالية، يجب عليك:</p>
<ul data-start="2919" data-end="3069">
<li data-section-id="3stopd" data-start="2919" data-end="2944">استخدام واقي الشمس</li>
<li data-section-id="11603ap" data-start="2945" data-end="2976">خذ نظارة شمسية</li>
<li data-section-id="1nw4clx" data-start="2977" data-end="3007">شرب كمية كافية من الماء</li>
<li data-section-id="q1bqdf" data-start="3008" data-end="3047">احتفظ بكاميرا مقاومة للماء</li>
<li data-section-id="r7u7qr" data-start="3048" data-end="3069">احجز مبكرًا</li>
</ul>
<h4 data-section-id="1cusigi" data-start="3071" data-end="3119"><strong>من هو الشخص المناسب للغطس في الغردقة؟</strong></h4>
<p data-start="3121" data-end="3169">الغطس في الغردقة مثالي لـ:</p>
<ul data-start="3171" data-end="3251">
<li data-section-id="sfmced" data-start="3171" data-end="3183">العائلات</li>
<li data-section-id="y3w173" data-start="3184" data-end="3193">أزواج</li>
<li data-section-id="45wq8r" data-start="3194" data-end="3206">المبتدئين</li>
<li data-section-id="1nvu7ef" data-start="3207" data-end="3232">السباحون ذوو الخبرة</li>
<li data-section-id="11vfv3e" data-start="3233" data-end="3251">عشاق الطبيعة</li>
</ul>
<p data-start="3253" data-end="3342">بفضل الدعم الاحترافي، يمكن حتى للمبتدئين اكتشاف العالم تحت الماء بأمان.</p>
<h4 data-section-id="1nm710g" data-start="3344" data-end="3405"><strong>لماذا تحجز رحلات الغطس مع Hurghada Travel Planner؟</strong></h4>
<p data-start="3407" data-end="3451">مع Hurghada Travel Planner يمكنك الاستفادة من:</p>
<ul data-start="3453" data-end="3597">
<li data-section-id="8lg5io" data-start="3453" data-end="3482">خدمة باللغة الألمانية</li>
<li data-section-id="15ws66q" data-start="3483" data-end="3502">الجولات الآمنة</li>
<li data-section-id="sozxbi" data-start="3503" data-end="3535">التنظيم المهني</li>
<li data-section-id="1jsokg9" data-start="3536" data-end="3554">الأسعار العادلة</li>
<li data-section-id="lpks3x" data-start="3555" data-end="3597">أفضل أماكن الغطس في الغردقة</li>
</ul>
<h4 data-section-id="1j5vr0f" data-start="3599" data-end="3665"><strong>الخلاصة: الغطس في الغردقة تجربة لا تُنسى</strong></h4>
<p data-start="3667" data-end="3770">يعد عالم البحر الأحمر الرائع تحت الماء من أجمل التجارب الطبيعية في مصر.</p>
<p data-start="3772" data-end="3845">إذا قمت بزيارة الغردقة، فلا ينبغي أن تفوتك هذه المغامرة.</p>
<p data-start="3847" data-end="3941">احجز رحلة الغطس الآن واكتشف عالم البحر الأحمر الملون تحت الماء.</p>
<p><!-- /wp:freeform --></p>
<!-- /wp:group --><!-- wp:code -->
<pre><code></code></pre>
<!-- /wp:code -->', 'Die besten Schnorchel-Ausflüge in Hurghada 2025: Die faszinierende Unterwasserwelt des Roten Meeres entdecken', '<!-- wp:group {"layout":{"type":"constrained"}} -->
<p><!-- wp:freeform --></p>
<p data-start="600" data-end="877">Schnorcheln in Hurghada gehört zu den beliebtesten Aktivitäten für Urlauber in Ägypten. Das kristallklare Wasser des Roten Meeres, farbenfrohe Korallenriffe und eine beeindruckende Vielfalt exotischer Meeresbewohner machen Hurghada zu einem der besten Schnorchelziele weltweit.</p>
<p data-start="879" data-end="1000">Wer seinen Urlaub am Roten Meer verbringt, sollte sich die faszinierende Unterwasserwelt auf keinen Fall entgehen lassen.</p>
<p data-start="1002" data-end="1179">Mit den Schnorchel-Ausflügen von <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noopener">Hurghada Reiseplaner</a> entdeckst du die schönsten Schnorchelspots in Hurghada und erlebst unvergessliche Abenteuer im Roten Meer.</p>
<h4><strong>Warum ist Schnorcheln in Hurghada so besonders?</strong></h4>
<p data-start="1233" data-end="1342">Hurghada ist weltweit bekannt für seine einzigartigen Korallenriffe und seine außergewöhnliche Artenvielfalt.</p>
<p data-start="1344" data-end="1400">Das Rote Meer bietet ideale Bedingungen zum Schnorcheln:</p>
<ul data-start="1402" data-end="1558">
<li data-section-id="131ywpp" data-start="1402" data-end="1427">Kristallklares Wasser</li>
<li data-section-id="di6fd0" data-start="1428" data-end="1465">Ganzjährig angenehme Temperaturen</li>
<li data-section-id="1v0s2f8" data-start="1466" data-end="1499">Farbenprächtige Korallenriffe</li>
<li data-section-id="tfd6m" data-start="1500" data-end="1524">Tropische Fischarten</li>
<li data-section-id="q4k63e" data-start="1525" data-end="1558">Hohe Sichtweiten unter Wasser</li>
</ul>
<p data-start="1560" data-end="1638">Diese perfekten Bedingungen machen Hurghada zu einem Paradies für Schnorchler.</p>
<h4><strong>Die schönsten Schnorchelspots in Hurghada</strong></h4>
<h4 data-section-id="2n4rgs" data-start="1686" data-end="1700"><strong>Orange Bay</strong></h4>
<p data-start="1702" data-end="1767">Die Orange Bay zählt zu den schönsten Ausflugszielen in Hurghada.</p>
<p data-start="1769" data-end="1885">Neben traumhaften Sandstränden erwarten dich wunderschöne Schnorchelgebiete mit beeindruckenden Korallenformationen.</p>
<h4 data-section-id="1xqnlz6" data-start="1887" data-end="1906"><strong>Paradise Island</strong></h4>
<p data-start="1908" data-end="1996">Paradise Island ist ideal für alle, die Entspannung und Schnorcheln kombinieren möchten.</p>
<p data-start="1998" data-end="2101">Das türkisfarbene Wasser und die faszinierende Unterwasserwelt machen diesen Ausflug besonders beliebt.</p>
<h4 data-section-id="scm130" data-start="2103" data-end="2120"><strong>Giftun Island</strong></h4>
<p data-start="2122" data-end="2193">Giftun Island gehört zu den bekanntesten Schnorchelspots im Roten Meer.</p>
<p data-start="2195" data-end="2271">Hier kannst du exotische Fische und farbenprächtige Korallenriffe entdecken.</p>
<h4 data-section-id="1aljbne" data-start="2273" data-end="2290"><strong>Dolphin House</strong></h4>
<p data-start="2292" data-end="2399">Das Dolphin House bietet die einzigartige Möglichkeit, Delfine in ihrer natürlichen Umgebung zu beobachten.</p>
<p data-start="2401" data-end="2456">Mit etwas Glück kannst du sogar mit Delfinen schwimmen.</p>
<h4 data-section-id="1bghd57" data-start="2458" data-end="2532"><strong>Welche Meeresbewohner kannst du beim Schnorcheln in Hurghada entdecken?</strong></h4>
<p data-start="2534" data-end="2612">Beim Schnorcheln im Roten Meer kannst du eine beeindruckende Vielfalt erleben:</p>
<ul data-start="2614" data-end="2743">
<li data-section-id="b8tv6x" data-start="2614" data-end="2634">Bunte Rifffische</li>
<li data-section-id="1kg4cbe" data-start="2635" data-end="2654">Papageienfische</li>
<li data-section-id="izusbn" data-start="2655" data-end="2670">Clownfische</li>
<li data-section-id="gnbbth" data-start="2671" data-end="2681">Rochen</li>
<li data-section-id="s34uv5" data-start="2682" data-end="2693">Delfine</li>
<li data-section-id="dpn3mp" data-start="2694" data-end="2710">Schildkröten</li>
<li data-section-id="1aq2272" data-start="2711" data-end="2743">Atemberaubende Korallenriffe</li>
</ul>
<p data-start="2745" data-end="2809">Jeder Schnorchelausflug wird so zu einem einzigartigen Erlebnis.</p>
<h4 data-section-id="10dztmc" data-start="2811" data-end="2860"><strong>Tipps für dein Schnorchelabenteuer in Hurghada</strong></h4>
<p data-start="2862" data-end="2917">Damit dein Schnorchelausflug perfekt wird, solltest du:</p>
<ul data-start="2919" data-end="3069">
<li data-section-id="3stopd" data-start="2919" data-end="2944">Sonnencreme verwenden</li>
<li data-section-id="11603ap" data-start="2945" data-end="2976">Eine Sonnenbrille mitnehmen</li>
<li data-section-id="1nw4clx" data-start="2977" data-end="3007">Ausreichend Wasser trinken</li>
<li data-section-id="q1bqdf" data-start="3008" data-end="3047">Eine wasserdichte Kamera dabeihaben</li>
<li data-section-id="r7u7qr" data-start="3048" data-end="3069">Frühzeitig buchen</li>
</ul>
<h4 data-section-id="1cusigi" data-start="3071" data-end="3119"><strong>Für wen ist Schnorcheln in Hurghada geeignet?</strong></h4>
<p data-start="3121" data-end="3169">Schnorcheln in Hurghada eignet sich perfekt für:</p>
<ul data-start="3171" data-end="3251">
<li data-section-id="sfmced" data-start="3171" data-end="3183">Familien</li>
<li data-section-id="y3w173" data-start="3184" data-end="3193">Paare</li>
<li data-section-id="45wq8r" data-start="3194" data-end="3206">Anfänger</li>
<li data-section-id="1nvu7ef" data-start="3207" data-end="3232">Erfahrene Schnorchler</li>
<li data-section-id="11vfv3e" data-start="3233" data-end="3251">Naturliebhaber</li>
</ul>
<p data-start="3253" data-end="3342">Dank professioneller Betreuung können auch Anfänger die Unterwasserwelt sicher entdecken.</p>
<h4 data-section-id="1nm710g" data-start="3344" data-end="3405"><strong>Warum Schnorchel-Ausflüge bei Hurghada Reiseplaner buchen?</strong></h4>
<p data-start="3407" data-end="3451">Bei Hurghada Reiseplaner profitierst du von:</p>
<ul data-start="3453" data-end="3597">
<li data-section-id="8lg5io" data-start="3453" data-end="3482">deutschsprachigem Service</li>
<li data-section-id="15ws66q" data-start="3483" data-end="3502">sicheren Touren</li>
<li data-section-id="sozxbi" data-start="3503" data-end="3535">professioneller Organisation</li>
<li data-section-id="1jsokg9" data-start="3536" data-end="3554">fairen Preisen</li>
<li data-section-id="lpks3x" data-start="3555" data-end="3597">den besten Schnorchelspots in Hurghada</li>
</ul>
<h4 data-section-id="1j5vr0f" data-start="3599" data-end="3665"><strong>Fazit: Schnorcheln in Hurghada ist ein unvergessliches Erlebnis</strong></h4>
<p data-start="3667" data-end="3770">Die faszinierende Unterwasserwelt des Roten Meeres gehört zu den schönsten Naturerlebnissen in Ägypten.</p>
<p data-start="3772" data-end="3845">Wer Hurghada besucht, sollte sich dieses Abenteuer nicht entgehen lassen.</p>
<p data-start="3847" data-end="3941">Buche jetzt deinen Schnorchel-Ausflug und entdecke die bunte Unterwasserwelt des Roten Meeres.</p>
<p><!-- /wp:freeform --></p>
<!-- /wp:group --><!-- wp:code -->
<pre><code></code></pre>
<!-- /wp:code -->', '5 Min', '[]'::jsonb),
('blog_posts', 'a06032c3-164a-4be2-a2d7-625cc2e7baa5', 'hu', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'A legjobb sznorkeltúrák Hurghadában 2025: Fedezze fel a Vörös-tenger lenyűgöző víz alatti világát', 'A legjobb sznorkeltúrák Hurghadában 2025: Fedezze fel a Vörös-tenger lenyűgöző víz alatti világát', '<!-- wp:group {"layout":{"type":"constrained"}} -->
<p><!-- wp:freeform --></p>
<p data-start="600" data-end="877">A sznorkelezés Hurghadában az egyik legnépszerűbb tevékenység az egyiptomi nyaralók körében. A Vörös-tenger kristálytiszta vize, a színes korallzátonyok és az egzotikus tengeri élővilág lenyűgöző változatossága teszi Hurghadát a világ egyik legjobb sznorkelezési célpontjává.</p>
<p data-start="879" data-end="1000">Ha a Vörös-tengeren tölti vakációját, semmiképpen sem szabad kihagynia a lenyűgöző víz alatti világot.</p>
<p data-start="1002" data-end="1179">A <a style="color: #000000;" sznorkeltúráival" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noopener">Hurghada utazástervező</a>, felfedezheti Hurghada legszebb sznorkelezési helyeit, és felejthetetlen kalandokat élhet át a Vörös-tengeren.</p>
<h4><strong>Miért olyan különleges a sznorkelezés Hurghadában?</strong></h4>
<p data-start="1233" data-end="1342">Hurghada világszerte ismert egyedülálló korallzátonyairól és rendkívüli biológiai sokféleségéről.</p>
<p data-start="1344" data-end="1400">A Vörös-tenger ideális feltételeket kínál a sznorkelezéshez:</p>
<ul data-start="1402" data-end="1558">
<li data-section-id="131ywpp" data-start="1402" data-end="1427">Kristálytiszta víz</li>
<li data-section-id="di6fd0" data-start="1428" data-end="1465">Kellemes hőmérséklet egész évben</li>
<li data-section-id="1v0s2f8" data-start="1466" data-end="1499">Színes korallzátonyok</li>
<li data-section-id="tfd6m" data-start="1500" data-end="1524">Trópusi halfajok</li>
<li data-section-id="q4k63e" data-start="1525" data-end="1558">Jó látási viszonyok a víz alatt</li>
</ul>
<p data-start="1560" data-end="1638">Ezek a tökéletes körülmények teszik Hurghadát a sznorkelezők paradicsomává.</p>
<h4><strong>Hurghada legszebb snorkelezési helyei</strong></h4>
<h4 data-section-id="2n4rgs" data-start="1686" data-end="1700"><strong>Orange Bay</strong></h4>
<p data-start="1702" data-end="1767">Az Orange Bay Hurghada egyik legszebb kirándulóhelye.</p>
<p data-start="1769" data-end="1885">Gyönyörű homokos strandok mellett gyönyörű sznorkelezési területek lenyűgöző korallképződményekkel várják Önt.</p>
<h4 data-section-id="1xqnlz6" data-start="1887" data-end="1906"><strong>Paradicsom-sziget</strong></h4>
<p data-start="1908" data-end="1996">A Paradicsom-sziget ideális mindazok számára, akik a pihenést és a sznorkelezést szeretnék kombinálni.</p>
<p data-start="1998" data-end="2101">A türkizkék víz és a lenyűgöző víz alatti világ teszi ezt a kirándulást különösen népszerűvé.</p>
<h4 data-section-id="scm130" data-start="2103" data-end="2120"><strong>Giftun-sziget</strong></h4>
<p data-start="2122" data-end="2193">A Giftun-sziget a Vörös-tenger egyik leghíresebb sznorkelezési helye.</p>
<p data-start="2195" data-end="2271">Itt egzotikus halakat és színes korallzátonyokat fedezhet fel.</p>
<h4 data-section-id="1aljbne" data-start="2273" data-end="2290"><strong>Delfinház</strong></h4>
<p data-start="2292" data-end="2399">A delfinház egyedülálló lehetőséget kínál a delfinek természetes környezetükben történő megfigyelésére.</p>
<p data-start="2401" data-end="2456">Egy kis szerencsével akár delfinekkel is úszhatsz.</p>
<h4 data-section-id="1bghd57" data-start="2458" data-end="2532"><strong>Milyen tengeri élőlényeket fedezhet fel sznorkelezés közben Hurghadában?</strong></h4>
<p data-start="2534" data-end="2612">Lenyűgöző változatosságot tapasztalhat a Vörös-tengeren való sznorkelezés közben:</p>
<ul data-start="2614" data-end="2743">
<li data-section-id="b8tv6x" data-start="2614" data-end="2634">Színes zátonyhal</li>
<li data-section-id="1kg4cbe" data-start="2635" data-end="2654">Papagájhal</li>
<li data-section-id="izusbn" data-start="2655" data-end="2670">Bohóchal</li>
<li data-section-id="gnbbth" data-start="2671" data-end="2681">sugarak</li>
<li data-section-id="s34uv5" data-start="2682" data-end="2693">Delfinek</li>
<li data-section-id="dpn3mp" data-start="2694" data-end="2710">Teknősök</li>
<li data-section-id="1aq2272" data-start="2711" data-end="2743">Lenyűgöző korallzátonyok</li>
</ul>
<p data-start="2745" data-end="2809">Minden sznorkeltúra egyedi élménnyé válik.</p>
<h4 data-section-id="10dztmc" data-start="2811" data-end="2860"><strong>Tippek a sznorkelezéshez Hurghadában</strong></h4>
<p data-start="2862" data-end="2917">Ahhoz, hogy sznorkelezése tökéletes legyen, tegye a következőket:</p>
<ul data-start="2919" data-end="3069">
<li data-section-id="3stopd" data-start="2919" data-end="2944">Használjon fényvédő krémet</li>
<li data-section-id="11603ap" data-start="2945" data-end="2976">Vegyél egy napszemüveget</li>
<li data-section-id="1nw4clx" data-start="2977" data-end="3007">Igyál elegendő vizet</li>
<li data-section-id="q1bqdf" data-start="3008" data-end="3047">Vegyél magaddal vízálló kamerát</li>
<li data-section-id="r7u7qr" data-start="3048" data-end="3069">Korábbi foglalás</li>
</ul>
<h4 data-section-id="1cusigi" data-start="3071" data-end="3119"><strong>Kinek alkalmas a sznorkelezés Hurghadában?</strong></h4>
<p data-start="3121" data-end="3169">A sznorkelezés Hurghadában tökéletes a következőkhöz:</p>
<ul data-start="3171" data-end="3251">
<li data-section-id="sfmced" data-start="3171" data-end="3183">Családok</li>
<li data-section-id="y3w173" data-start="3184" data-end="3193">párok</li>
<li data-section-id="45wq8r" data-start="3194" data-end="3206">Kezdők</li>
<li data-section-id="1nvu7ef" data-start="3207" data-end="3232">Tapasztalt sznorkelezők</li>
<li data-section-id="11vfv3e" data-start="3233" data-end="3251">Természetbarátok</li>
</ul>
<p data-start="3253" data-end="3342">A szakmai támogatásnak köszönhetően még a kezdők is biztonságosan felfedezhetik a víz alatti világot.</p>
<h4 data-section-id="1nm710g" data-start="3344" data-end="3405"><strong>Miért érdemes sznorkeltúrákat foglalni a Hurghada Travel Planner segítségével?</strong></h4>
<p data-start="3407" data-end="3451">A Hurghada Travel Plannerrel a következőket élvezheti:</p>
<ul data-start="3453" data-end="3597">
<li data-section-id="8lg5io" data-start="3453" data-end="3482">Német nyelvű szolgáltatás</li>
<li data-section-id="15ws66q" data-start="3483" data-end="3502">biztonságos körutak</li>
<li data-section-id="sozxbi" data-start="3503" data-end="3535">szakmai szervezet</li>
<li data-section-id="1jsokg9" data-start="3536" data-end="3554">tisztességes árak</li>
<li data-section-id="lpks3x" data-start="3555" data-end="3597">a legjobb sznorkelezési helyek Hurghadában</li>
</ul>
<h4 data-section-id="1j5vr0f" data-start="3599" data-end="3665"><strong>Következtetés: A sznorkelezés Hurghadában felejthetetlen élmény</strong></h4>
<p data-start="3667" data-end="3770">A Vörös-tenger lenyűgöző víz alatti világa Egyiptom egyik legszebb természeti élménye.</p>
<p data-start="3772" data-end="3845">Ha Hurghadába látogat, ne hagyja ki ezt a kalandot.</p>
<p data-start="3847" data-end="3941">Foglalja le sznorkeltúráját most, és fedezze fel a Vörös-tenger színes víz alatti világát.</p>
<p><!-- /wp:freeform --></p>
<!-- /wp:group --><!-- wp:code -->
<pre><code></code></pre>
<!-- /wp:code -->', '5 perc', '[]'::jsonb),
('blog_posts', '9e076f56-ac05-46a5-8355-2b1aafc9c8a1', 'en', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Quad Safari Hurghada 2025 – The ultimate desert adventure in Egypt', 'Quad Safari Hurghada 2025 – The ultimate desert adventure in Egypt', '<!-- wp:heading -->
<p>A quad safari in Hurghada is one of the most popular and exciting excursions on the Red Sea. Anyone looking for adventure, adrenaline and unforgettable experiences during their Egypt holiday should definitely not miss this desert adventure.</p>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>The impressive desert landscapes around Hurghada, spectacular sunsets and the feeling of freedom make the quad safari an absolute highlight.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>With the professionally organized safari tours from <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Hurghada travel planner</a> you can experience the fascinating desert of Egypt safely and full of adventure.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Why is a quad safari in Hurghada so popular?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>The Quad Safari Hurghada combines action, nature and authentic Egyptian culture.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>During the tour you will drive through the impressive desert on a powerful quad and discover landscapes that you will never forget.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>The tour offers:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Action and adrenaline</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Breathtaking desert panoramas</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Visit a Bedouin village</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Traditional Egyptian tea</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Magical sunsets</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>An unforgettable adventure</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>This is what awaits you on a quad safari in Hurghada</strong></h4>
<p><!-- /wp:heading --><!-- wp:heading {"level":3} --></p>
<h4><strong>Quad driving through the desert</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>After a short introduction the adventure begins.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>With the quad you drive through the endless sandy landscapes around Hurghada and immediately feel the special feeling of freedom.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Driving through the desert is a unique experience for adventure lovers.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Experience the Bedouin village</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>A special highlight of every quad safari is a visit to a traditional Bedouin village.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Here you will learn about the culture and way of life of the Bedouins and can enjoy Egyptian tea.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>This insight makes the tour particularly authentic.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Sunset in the desert</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>The sunset in the Egyptian desert is one of the most beautiful natural experiences ever.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>When the sun slowly disappears behind the mountains and the landscape is bathed in golden colors, an unforgettable moment is created.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Who is the Quad Safari Hurghada suitable for?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>The Quad Safari is ideal for:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Adventure lover</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Couples</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Friend groups</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Families with older children</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Adrenaline fans</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>Even beginners can take part without any problem.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>You will receive professional instructions before each tour.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>What should you bring with you to the Quad Safari?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>For your perfect desert adventure you should take with you:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Comfortable clothing</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Sunglasses</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Scarf or towel against sand</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Closed shoes</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Camera</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Sun protection</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Safety on the Quad Safari</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Safety has the highest priority.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>All tours are accompanied by experienced guides and the quads are regularly serviced.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Even participants without previous experience can safely take part.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Why book your quad safari with Hurghada Travel Planner?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>With Hurghada Travel Planner you benefit from:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>German-speaking service</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>safe tours</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>modern quads</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>fair prices</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>professional organization</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>personal support</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>The best time for a quad safari in Hurghada</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Particularly popular are:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Morning safaris</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Sunset safaris</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Evening tours with Bedouin experience</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>The Sunset Quad Safari is particularly recommended.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Conclusion: Quad Safari Hurghada is a must</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>A quad safari excursion in Hurghada is the perfect combination of adventure, nature and Egyptian culture.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>If you want to make your vacation in Hurghada unforgettable, you should definitely experience this unique desert adventure.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Book your quad safari now and discover the fascinating desert of Egypt.</p>
<!-- /wp:paragraph -->', '5 mins', '[]'::jsonb),
('blog_posts', '9e076f56-ac05-46a5-8355-2b1aafc9c8a1', 'ru', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Quad Safari Hurghada 2025 – незабываемое приключение в пустыне Египта
---ЦЭП---
Quad Safari Hurghada 2025 – незабываемое приключение в пустыне Египта
---ЦЭП---
5 минут
---ЦЭП---
<!-- wp:heading -->
<p>Сафари на квадроциклах в Хургаде – одна из самых популярных и увлекательных экскурсий по Красному морю. Тот, кто ищет приключений, адреналина и незабываемых впечатлений во время отпуска в Египте, обязательно не должен пропустить это приключение в пустыне.</p>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Впечатляющие пустынные пейзажи вокруг Хургады, захватывающие закаты и ощущение свободы делают сафари на квадроциклах незабываемым событием.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>С помощью профессионально организованных сафари-туров от <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Планировщик путешествий по Хургаде</a> вы можете безопасно и полно приключений исследовать увлекательную пустыню Египта.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Почему сафари на квадроциклах в Хургаде так популярно?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Quad Safari Hurghada сочетает в себе действие, природу и аутентичную египетскую культуру.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Во время тура вы проедете по впечатляющей пустыне на мощном квадроцикле и откроете для себя пейзажи, которые вы никогда не забудете.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Тур предлагает:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Действие и адреналин</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Захватывающие панорамы пустыни.</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Посетить бедуинскую деревню.</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Традиционный египетский чай.</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Волшебные закаты</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Незабываемое приключение.</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Вот что вас ждет на сафари на квадроциклах в Хургаде</strong></h4>
<p><!-- /wp:heading --><!-- wp:heading {"level":3} --></p>
<h4><strong>Квадроцикл по пустыне</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>После краткого вступления начинается приключение.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>На квадроцикле вы проедете по бескрайним песчаным пейзажам Хургады и сразу почувствуете особое чувство свободы.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Вождение по пустыне — уникальный опыт для любителей приключений.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Познакомьтесь с бедуинской деревней</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Особым событием каждого сафари на квадроциклах является посещение традиционной бедуинской деревни.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Здесь вы узнаете о культуре и быте бедуинов, а также сможете насладиться египетским чаем.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Эта информация делает тур особенно аутентичным.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Закат в пустыне</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Закат в египетской пустыне — одно из самых красивых природных явлений на свете.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Когда солнце медленно скрывается за горами и пейзаж покрывается золотыми красками, создается незабываемый момент.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Кому подходит Quad Safari Hurghada?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Quad Safari идеально подходит для:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Любитель приключений</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Пары</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Группы друзей</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Семьи с детьми старшего возраста.</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Любители адреналина</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>Даже новички могут принять участие без проблем.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Перед каждым туром вы будете получать профессиональные инструкции.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Что взять с собой на Quad Safari?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Для вашего идеального приключения в пустыне вам следует взять с собой:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Удобная одежда.</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Солнцезащитные очки</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Шарф или полотенце против песка.</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Закрытая обувь.</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Камера</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Защита от солнца.</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Безопасность на Quad Safari</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Безопасность имеет высший приоритет.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Все туры сопровождаются опытными гидами, квадроциклы регулярно обслуживаются.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Участвовать могут безопасно даже участники без предыдущего опыта.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Зачем бронировать сафари на квадроциклах в Hurghada Travel Planner?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>С Hurghada Travel Planner вы получаете следующие преимущества:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Немецкоязычная служба</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>безопасные туры</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>современные квадроциклы</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>справедливые цены</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>профессиональная организация</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>личная поддержка</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Лучшее время для сафари на квадроциклах в Хургаде</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Особенно популярны:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Утренние сафари.</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Сафари на закате</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Вечерние туры с участием бедуинов.</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>Особенно рекомендуется Sunset Quad Safari.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Вывод: Сафари на квадроциклах в Хургаде просто необходимо</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Экскурсия-сафари на квадроциклах в Хургаде — это идеальное сочетание приключений, природы и египетской культуры.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Если вы хотите сделать свой отпуск в Хургаде незабываемым, вам обязательно стоит испытать это уникальное приключение в пустыне.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Забронируйте сафари на квадроциклах прямо сейчас и откройте для себя очаровательную пустыню Египта.</p>
<!-- /wp:абзац -->', 'Quad Safari Hurghada 2025 – Das ultimative Wüstenabenteuer in Ägypten', '<!-- wp:heading -->
<p>Eine Quad Safari in Hurghada gehört zu den beliebtesten und aufregendsten Ausflügen am Roten Meer. Wer während seines Ägypten Urlaubs Abenteuer, Adrenalin und unvergessliche Erlebnisse sucht, sollte sich dieses Wüstenabenteuer auf keinen Fall entgehen lassen.</p>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Die beeindruckenden Wüstenlandschaften rund um Hurghada, spektakuläre Sonnenuntergänge und das Gefühl von Freiheit machen die Quad Safari zu einem absoluten Highlight.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Mit den professionell organisierten Safari-Touren von <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Hurghada Reiseplaner</a> erlebst du die faszinierende Wüste Ägyptens sicher und voller Abenteuer.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Warum ist eine Quad Safari in Hurghada so beliebt?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Die Quad Safari Hurghada verbindet Action, Natur und authentische ägyptische Kultur.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Während der Tour fährst du mit einem leistungsstarken Quad durch die beeindruckende Wüste und entdeckst Landschaften, die du niemals vergessen wirst.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Die Tour bietet:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Action und Adrenalin</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Atemberaubende Wüstenpanoramen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Besuch eines Beduinendorfs</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Traditionellen ägyptischen Tee</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Magische Sonnenuntergänge</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Ein unvergessliches Abenteuer</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Das erwartet dich bei einer Quad Safari in Hurghada</strong></h4>
<p><!-- /wp:heading --><!-- wp:heading {"level":3} --></p>
<h4><strong>Quad fahren durch die Wüste</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Nach einer kurzen Einführung beginnt das Abenteuer.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Mit dem Quad fährst du durch die endlosen Sandlandschaften rund um Hurghada und spürst sofort das besondere Gefühl von Freiheit.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Die Fahrt durch die Wüste ist ein einzigartiges Erlebnis für Abenteuerliebhaber.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Das Beduinendorf erleben</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Ein besonderes Highlight jeder Quad Safari ist der Besuch eines traditionellen Beduinendorfs.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Hier lernst du die Kultur und Lebensweise der Beduinen kennen und kannst ägyptischen Tee genießen.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Dieser Einblick macht die Tour besonders authentisch.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Sonnenuntergang in der Wüste</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Der Sonnenuntergang in der ägyptischen Wüste zählt zu den schönsten Naturerlebnissen überhaupt.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Wenn die Sonne langsam hinter den Bergen verschwindet und die Landschaft in goldene Farben taucht, entsteht ein unvergesslicher Moment.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Für wen ist die Quad Safari Hurghada geeignet?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Die Quad Safari ist ideal für:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Abenteuerliebhaber</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Paare</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Freundesgruppen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Familien mit älteren Kindern</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Adrenalin-Fans</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>Auch Anfänger können problemlos teilnehmen.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Vor jeder Tour erhältst du eine professionelle Einweisung.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Was solltest du zur Quad Safari mitbringen?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Für dein perfektes Wüstenabenteuer solltest du mitnehmen:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Bequeme Kleidung</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Sonnenbrille</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Schal oder Tuch gegen Sand</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Geschlossene Schuhe</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Kamera</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Sonnenschutz</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Sicherheit bei der Quad Safari</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Die Sicherheit hat höchste Priorität.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Alle Touren werden von erfahrenen Guides begleitet und die Quads werden regelmäßig gewartet.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Auch Teilnehmer ohne Vorerfahrung können sicher teilnehmen.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Warum deine Quad Safari bei Hurghada Reiseplaner buchen?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Bei Hurghada Reiseplaner profitierst du von:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>deutschsprachigem Service</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>sicheren Touren</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>modernen Quads</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>fairen Preisen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>professioneller Organisation</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>persönlicher Betreuung</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Die beste Zeit für eine Quad Safari in Hurghada</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Besonders beliebt sind:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Morgen-Safaris</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Sonnenuntergangs-Safaris</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Abendtouren mit Beduinenerlebnis</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>Die Sunset Quad Safari ist besonders empfehlenswert.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Fazit: Quad Safari Hurghada ist ein Muss</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Ein Quad Safari Ausflug in Hurghada ist die perfekte Kombination aus Abenteuer, Natur und ägyptischer Kultur.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Wer seinen Urlaub in Hurghada unvergesslich machen möchte, sollte dieses einmalige Wüstenabenteuer unbedingt erleben.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Buche jetzt deine Quad Safari und entdecke die faszinierende Wüste Ägyptens.</p>
<!-- /wp:paragraph -->', '5 Min', '[]'::jsonb),
('blog_posts', '9e076f56-ac05-46a5-8355-2b1aafc9c8a1', 'fr', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Quad Safari Hurghada 2025 – L''aventure ultime dans le désert en Égypte', 'Quad Safari Hurghada 2025 – L''aventure ultime dans le désert en Égypte', '<!-- wp:titre -->
<p>Un safari en quad à Hurghada est l''une des excursions les plus populaires et les plus passionnantes de la mer Rouge. Tous ceux qui recherchent l''aventure, l''adrénaline et des expériences inoubliables pendant leurs vacances en Égypte ne devraient certainement pas manquer cette aventure dans le désert.</p>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Les impressionnants paysages désertiques autour d''Hurghada, les couchers de soleil spectaculaires et le sentiment de liberté font du safari en quad un moment fort absolu.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Avec les safaris organisés par des professionnels de <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Planificateur de voyage Hurghada</a>, vous pouvez découvrir le fascinant désert égyptien en toute sécurité et plein d''aventures.</p>
<p><!-- /wp:paragraphe --><!-- wp:titre --></p>
<h4><strong>Pourquoi un safari en quad à Hurghada est-il si populaire ?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Le Quad Safari Hurghada allie action, nature et culture égyptienne authentique.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Pendant la visite, vous traverserez l''impressionnant désert sur un puissant quad et découvrirez des paysages que vous n''oublierez jamais.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>La visite propose :</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Action et adrénaline</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Des panoramas désertiques à couper le souffle</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Visite d''un village bédouin</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Thé égyptien traditionnel</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Couchers de soleil magiques</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Une aventure inoubliable</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>C''est ce qui vous attend lors d''un safari en quad à Hurghada</strong></h4>
<p><!-- /wp:heading --><!-- wp:heading {"level":3} --></p>
<h4><strong>Quad à travers le désert</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Après une courte introduction, l''aventure commence.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Avec le quad, vous traversez les paysages sablonneux sans fin autour d''Hurghada et ressentez immédiatement un sentiment particulier de liberté.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Conduire à travers le désert est une expérience unique pour les amateurs d''aventure.</p>
<p><!-- /wp:paragraphe --><!-- wp:titre --></p>
<h4><strong>Découvrez le village bédouin</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Un point culminant de chaque safari en quad est la visite d''un village bédouin traditionnel.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Ici, vous découvrirez la culture et le mode de vie des Bédouins et pourrez déguster du thé égyptien.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Cet aperçu rend la visite particulièrement authentique.</p>
<p><!-- /wp:paragraphe --><!-- wp:titre --></p>
<h4><strong>Coucher de soleil dans le désert</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Le coucher de soleil dans le désert égyptien est l''une des plus belles expériences naturelles qui soient.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Lorsque le soleil disparaît lentement derrière les montagnes et que le paysage est baigné de couleurs dorées, un moment inoubliable est créé.</p>
<p><!-- /wp:paragraphe --><!-- wp:titre --></p>
<h4><strong>À qui convient le Quad Safari Hurghada ?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Le Quad Safari est idéal pour :</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Amoureux de l''aventure</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Couples</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Groupes d''amis</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Familles avec enfants plus âgés</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Fans d''adrénaline</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraphe --></p>
<p>Même les débutants peuvent participer sans aucun problème.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Vous recevrez des instructions professionnelles avant chaque visite.</p>
<p><!-- /wp:paragraphe --><!-- wp:titre --></p>
<h4><strong>Que devez-vous apporter avec vous au Quad Safari ?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Pour votre aventure parfaite dans le désert, vous devriez emporter avec vous :</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Vêtements confortables</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Lunettes de soleil</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Écharpe ou serviette contre le sable</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Chaussures fermées</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Caméra</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Protection solaire</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Sécurité sur le Quad Safari</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>La sécurité est la priorité absolue.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Toutes les visites sont accompagnées par des guides expérimentés et les quads sont régulièrement entretenus.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Même les participants sans expérience préalable peuvent participer en toute sécurité.</p>
<p><!-- /wp:paragraphe --><!-- wp:titre --></p>
<h4><strong>Pourquoi réserver votre safari en quad avec Hurghada Travel Planner ?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Avec Hurghada Travel Planner, vous bénéficiez de :</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Service germanophone</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>visites sécurisées</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>quads modernes</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>des prix équitables</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>organisation professionnelle</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>soutien personnel</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Le meilleur moment pour un safari en quad à Hurghada</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Sont particulièrement populaires :</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Safaris matinaux</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Safaris au coucher du soleil</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Visites en soirée avec expérience bédouine</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraphe --></p>
<p>Le Sunset Quad Safari est particulièrement recommandé.</p>
<p><!-- /wp:paragraphe --><!-- wp:titre --></p>
<h4><strong>Conclusion : Quad Safari Hurghada est un incontournable</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Une excursion safari en quad à Hurghada est la combinaison parfaite d''aventure, de nature et de culture égyptienne.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Si vous souhaitez rendre vos vacances à Hurghada inoubliables, vous devez absolument vivre cette aventure unique dans le désert.</p>
<p><!-- /wp:paragraphe --><!-- wp:paragraphe --></p>
<p>Réservez votre safari en quad dès maintenant et découvrez le fascinant désert égyptien.</p>
<!-- /wp:paragraphe -->', '5 minutes', '[]'::jsonb),
('blog_posts', '9e076f56-ac05-46a5-8355-2b1aafc9c8a1', 'ar', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'كواد سفاري الغردقة 2025 – مغامرة الصحراء المطلقة في مصر
--- تسيب ---
كواد سفاري الغردقة 2025 – مغامرة الصحراء المطلقة في مصر
--- تسيب ---
5 دقائق
--- تسيب ---
<!-- wp:heading -->
<p>تعد رحلة السفاري الرباعية في الغردقة من أكثر الرحلات شعبية وإثارة على البحر الأحمر. أي شخص يبحث عن المغامرة والأدرينالين وتجارب لا تنسى خلال عطلته في مصر يجب ألا يفوت بالتأكيد هذه المغامرة الصحراوية.</p>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>المناظر الطبيعية الصحراوية الرائعة حول الغردقة، وغروب الشمس المذهل والشعور بالحرية تجعل من رحلات السفاري الرباعية ميزة مطلقة.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>مع رحلات السفاري المنظمة بشكل احترافي من <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">مخطط رحلات الغردقة</a> يمكنك تجربة صحراء مصر الرائعة بأمان ومليئة بالمغامرات.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>لماذا تحظى رحلات السفاري الرباعية في الغردقة بشعبية كبيرة؟</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>تجمع رحلة سفاري الغردقة الرباعية بين الحركة والطبيعة والثقافة المصرية الأصيلة.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>خلال الجولة، ستقود سيارتك عبر الصحراء الرائعة على متن دراجة رباعية قوية وتكتشف مناظر طبيعية لن تنساها أبدًا.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>عروض الجولة:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>الحركة والأدرينالين</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>صور بانورامية للصحراء تحبس الأنفاس</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>زيارة قرية بدوية</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>الشاي المصري التقليدي</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>غروب الشمس الساحر</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>مغامرة لا تُنسى</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>هذا ما ينتظرك في رحلة سفاري رباعية في الغردقة</strong></h4>
<p><!-- /wp:heading --><!-- wp:heading {"level":3} --></p>
<h4><strong>القيادة الرباعية عبر الصحراء</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>بعد مقدمة قصيرة تبدأ المغامرة.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>مع الدراجة الرباعية، يمكنك القيادة عبر المناظر الطبيعية الرملية التي لا نهاية لها حول الغردقة وتشعر على الفور بشعور خاص بالحرية.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>تعتبر القيادة عبر الصحراء تجربة فريدة لمحبي المغامرة.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>تجربة القرية البدوية</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>من الأمور المميزة في كل رحلة سفاري رباعية الدفع هي زيارة قرية بدوية تقليدية.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>هنا سوف تتعرف على ثقافة وأسلوب حياة البدو ويمكنك الاستمتاع بالشاي المصري.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>هذه الرؤية تجعل الجولة حقيقية بشكل خاص.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>غروب الشمس في الصحراء</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>يعد غروب الشمس في الصحراء المصرية من أجمل التجارب الطبيعية على الإطلاق.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>عندما تختفي الشمس ببطء خلف الجبال وتتلون المناظر الطبيعية بالألوان الذهبية، يتم إنشاء لحظة لا تُنسى.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>من هو الشخص المناسب لكواد سفاري الغردقة؟</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>يعد Quad Safari مثاليًا لـ:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>عاشق المغامرة</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>الأزواج</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>مجموعات الأصدقاء</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>العائلات التي لديها أطفال أكبر سنًا</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>عشاق الأدرينالين</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>حتى المبتدئين يمكنهم المشاركة دون أي مشكلة.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>سوف تتلقى تعليمات احترافية قبل كل جولة.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>ما الذي يجب عليك إحضاره معك إلى Quad Safari؟</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>للحصول على مغامرة صحراوية مثالية يجب أن تأخذها معك:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>ملابس مريحة</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>النظارات الشمسية</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>وشاح أو منشفة ضد الرمال</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>حذاء مغلق</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>الكاميرا</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>الحماية من الشمس</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>السلامة في رحلة السفاري الرباعية</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>السلامة لها الأولوية القصوى.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>يرافق جميع الجولات مرشدون ذوو خبرة، كما تتم صيانة المركبات الرباعية بشكل منتظم.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>حتى المشاركين الذين ليس لديهم خبرة سابقة يمكنهم المشاركة بأمان.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>لماذا تحجز رحلة السفاري الرباعية مع Hurghada Travel Planner؟</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>مع تطبيق Hurghada Travel Planner يمكنك الاستفادة من:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>خدمة التحدث باللغة الألمانية</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>جولات آمنة</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>الكواد الحديثة</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>أسعار عادلة</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>المنظمة المهنية</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>الدعم الشخصي</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>أفضل وقت لرحلة سفاري رباعية في الغردقة</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>تحظى بشعبية خاصة:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>رحلات السفاري الصباحية</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>رحلات السفاري عند غروب الشمس</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>جولات مسائية مع تجربة بدوية</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>يوصى بشكل خاص باستخدام Sunset Quad Safari.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>الخلاصة: رحلة سفاري رباعية بالغردقة أمر لا بد منه</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>تعد رحلة السفاري الرباعية في الغردقة مزيجًا مثاليًا بين المغامرة والطبيعة والثقافة المصرية.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>إذا كنت تريد أن تجعل إجازتك في الغردقة لا تنسى، فيجب عليك بالتأكيد تجربة هذه المغامرة الصحراوية الفريدة.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>احجز الآن رحلة سفاري رباعية الدفع واكتشف صحراء مصر الرائعة.</p>
<!-- /wp:paragraph -->', 'Quad Safari Hurghada 2025 – Das ultimative Wüstenabenteuer in Ägypten', '<!-- wp:heading -->
<p>Eine Quad Safari in Hurghada gehört zu den beliebtesten und aufregendsten Ausflügen am Roten Meer. Wer während seines Ägypten Urlaubs Abenteuer, Adrenalin und unvergessliche Erlebnisse sucht, sollte sich dieses Wüstenabenteuer auf keinen Fall entgehen lassen.</p>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Die beeindruckenden Wüstenlandschaften rund um Hurghada, spektakuläre Sonnenuntergänge und das Gefühl von Freiheit machen die Quad Safari zu einem absoluten Highlight.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Mit den professionell organisierten Safari-Touren von <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Hurghada Reiseplaner</a> erlebst du die faszinierende Wüste Ägyptens sicher und voller Abenteuer.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Warum ist eine Quad Safari in Hurghada so beliebt?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Die Quad Safari Hurghada verbindet Action, Natur und authentische ägyptische Kultur.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Während der Tour fährst du mit einem leistungsstarken Quad durch die beeindruckende Wüste und entdeckst Landschaften, die du niemals vergessen wirst.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Die Tour bietet:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Action und Adrenalin</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Atemberaubende Wüstenpanoramen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Besuch eines Beduinendorfs</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Traditionellen ägyptischen Tee</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Magische Sonnenuntergänge</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Ein unvergessliches Abenteuer</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Das erwartet dich bei einer Quad Safari in Hurghada</strong></h4>
<p><!-- /wp:heading --><!-- wp:heading {"level":3} --></p>
<h4><strong>Quad fahren durch die Wüste</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Nach einer kurzen Einführung beginnt das Abenteuer.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Mit dem Quad fährst du durch die endlosen Sandlandschaften rund um Hurghada und spürst sofort das besondere Gefühl von Freiheit.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Die Fahrt durch die Wüste ist ein einzigartiges Erlebnis für Abenteuerliebhaber.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Das Beduinendorf erleben</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Ein besonderes Highlight jeder Quad Safari ist der Besuch eines traditionellen Beduinendorfs.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Hier lernst du die Kultur und Lebensweise der Beduinen kennen und kannst ägyptischen Tee genießen.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Dieser Einblick macht die Tour besonders authentisch.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Sonnenuntergang in der Wüste</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Der Sonnenuntergang in der ägyptischen Wüste zählt zu den schönsten Naturerlebnissen überhaupt.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Wenn die Sonne langsam hinter den Bergen verschwindet und die Landschaft in goldene Farben taucht, entsteht ein unvergesslicher Moment.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Für wen ist die Quad Safari Hurghada geeignet?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Die Quad Safari ist ideal für:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Abenteuerliebhaber</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Paare</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Freundesgruppen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Familien mit älteren Kindern</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Adrenalin-Fans</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>Auch Anfänger können problemlos teilnehmen.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Vor jeder Tour erhältst du eine professionelle Einweisung.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Was solltest du zur Quad Safari mitbringen?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Für dein perfektes Wüstenabenteuer solltest du mitnehmen:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Bequeme Kleidung</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Sonnenbrille</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Schal oder Tuch gegen Sand</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Geschlossene Schuhe</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Kamera</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Sonnenschutz</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Sicherheit bei der Quad Safari</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Die Sicherheit hat höchste Priorität.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Alle Touren werden von erfahrenen Guides begleitet und die Quads werden regelmäßig gewartet.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Auch Teilnehmer ohne Vorerfahrung können sicher teilnehmen.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Warum deine Quad Safari bei Hurghada Reiseplaner buchen?</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Bei Hurghada Reiseplaner profitierst du von:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>deutschsprachigem Service</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>sicheren Touren</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>modernen Quads</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>fairen Preisen</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>professioneller Organisation</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>persönlicher Betreuung</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Die beste Zeit für eine Quad Safari in Hurghada</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Besonders beliebt sind:</p>
<p><!-- /wp:paragraph --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Morgen-Safaris</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Sonnenuntergangs-Safaris</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>Abendtouren mit Beduinenerlebnis</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:paragraph --></p>
<p>Die Sunset Quad Safari ist besonders empfehlenswert.</p>
<p><!-- /wp:paragraph --><!-- wp:heading --></p>
<h4><strong>Fazit: Quad Safari Hurghada ist ein Muss</strong></h4>
<p><!-- /wp:heading --><!-- wp:paragraph --></p>
<p>Ein Quad Safari Ausflug in Hurghada ist die perfekte Kombination aus Abenteuer, Natur und ägyptischer Kultur.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Wer seinen Urlaub in Hurghada unvergesslich machen möchte, sollte dieses einmalige Wüstenabenteuer unbedingt erleben.</p>
<p><!-- /wp:paragraph --><!-- wp:paragraph --></p>
<p>Buche jetzt deine Quad Safari und entdecke die faszinierende Wüste Ägyptens.</p>
<!-- /wp:paragraph -->', '5 Min', '[]'::jsonb),
('blog_posts', '9e076f56-ac05-46a5-8355-2b1aafc9c8a1', 'hu', NULL, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Quad Safari Hurghada 2025 – A végső sivatagi kaland Egyiptomban', 'Quad Safari Hurghada 2025 – A végső sivatagi kaland Egyiptomban', '<!-- wp:heading -->
<p>A quad szafari Hurghadában az egyik legnépszerűbb és legizgalmasabb kirándulás a Vörös-tengeren. Aki kalandra, adrenalinra és felejthetetlen élményekre vágyik egyiptomi nyaralása során, semmiképpen ne hagyja ki ezt a sivatagi kalandot.</p>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>A Hurghada körüli lenyűgöző sivatagi tájak, a látványos naplementék és a szabadság érzése a quados szafarit abszolút csúcsponttá teszik.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>A professzionálisan szervezett szafari túrákkal <a style="color: #000000;" href="https://hurghada-reiseplaner.at?utm_source=chatgpt.com" target="_blank" rel="noreferrer noopener">Hurghada utazástervező</a>, biztonságban és kalandokkal teli megtapasztalhatja Egyiptom lenyűgöző sivatagát.</p>
<p><!-- /wp:bekezdés --><!-- wp:heading --></p>
<h4><strong>Miért olyan népszerű a quad szafari Hurghadában?</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>A Quad Safari Hurghada ötvözi az akciót, a természetet és az autentikus egyiptomi kultúrát.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>A túra során egy erős quadon halad át a lenyűgöző sivatagon, és olyan tájakat fedezhet fel, amelyeket soha nem fog elfelejteni.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>A túra a következőket kínálja:</p>
<p><!-- /wp:bekezdés --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Akció és adrenalin</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>Lélegzetelállító sivatagi panorámák</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>látogasson el egy beduin faluba</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>Hagyományos egyiptomi tea</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>Varázslatos naplementék</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>Felejthetetlen kaland</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Ez vár rád egy quad szafarin Hurghadában</strong></h4>
<p><!-- /wp:heading --><!-- wp:heading {"level":3} --></p>
<h4><strong>Négy vezetés a sivatagon keresztül</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>Rövid bemutatkozás után kezdődik a kaland.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>A quaddal végighaladsz Hurghada végtelen homokos tájain, és azonnal érzi a szabadság különleges érzését.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>A sivatagban való autózás egyedülálló élmény a kalandok szerelmeseinek.</p>
<p><!-- /wp:bekezdés --><!-- wp:heading --></p>
<h4><strong>Tapasztalja meg a beduin falut</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>Minden quados szafari különleges fénypontja egy hagyományos beduin falu látogatása.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Itt megismerkedhet a beduinok kultúrájával és életmódjával, és élvezheti az egyiptomi teát.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Ez a betekintés különösen hitelessé teszi a túrát.</p>
<p><!-- /wp:bekezdés --><!-- wp:heading --></p>
<h4><strong>Naplemente a sivatagban</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>A naplemente az egyiptomi sivatagban a valaha volt egyik legszebb természeti élmény.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Amikor a nap lassan eltűnik a hegyek mögött, és a táj arany színekben úszik, egy felejthetetlen pillanat jön létre.</p>
<p><!-- /wp:bekezdés --><!-- wp:heading --></p>
<h4><strong>Kinek alkalmas a Quad Safari Hurghada?</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>A Quad Safari ideális a következőkhöz:</p>
<p><!-- /wp:bekezdés --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Kalandkedvelő</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>Párok</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>Barátcsoportok</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>Idősebb gyermekes családok</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>Adrenalin rajongók</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:bekezdés --></p>
<p>Még a kezdők is probléma nélkül részt vehetnek.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Minden túra előtt professzionális utasításokat kap.</p>
<p><!-- /wp:bekezdés --><!-- wp:heading --></p>
<h4><strong>Mit vigyen magával a Quad Safariba?</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>A tökéletes sivatagi kalandhoz vigye magával:</p>
<p><!-- /wp:bekezdés --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Kényelmes ruházat</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>Napszemüvegek</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>Sál vagy törölköző homok ellen</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>Zárt cipő</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>Fényképezőgép</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>Fényvédelem</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>Biztonság a Quad Safarin</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>A biztonság a legfontosabb.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Minden túrát tapasztalt idegenvezetők kísérnek, és a quadokat rendszeresen karbantartják.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Még a korábbi tapasztalattal nem rendelkező résztvevők is nyugodtan részt vehetnek.</p>
<p><!-- /wp:bekezdés --><!-- wp:heading --></p>
<h4><strong>Miért foglaljon quad szafarit a Hurghada Travel Planner segítségével?</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>A Hurghada Travel Plannerrel a következőket élvezheti:</p>
<p><!-- /wp:bekezdés --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Német nyelvű szolgáltatás</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>biztonságos túrák</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>modern quadok</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>tisztességes árak</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>szakmai szervezet</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>személyes támogatás</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:heading --></p>
<h4><strong>A legjobb idő egy quad szafarihoz Hurghadában</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>Különösen népszerűek a következők:</p>
<p><!-- /wp:bekezdés --><!-- wp:list --></p>
<ul><!-- wp:list-item -->
<li>Reggeli szafarik</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>Naplemente szafarik</li>
<!-- /wp:lista-elem --><!-- wp:lista-elem -->
<li>Esti túrák beduin tapasztalattal</li>
<!-- /wp:list-item --></ul>
<p><!-- /wp:list --><!-- wp:bekezdés --></p>
<p>A Sunset Quad Safari különösen ajánlott.</p>
<p><!-- /wp:bekezdés --><!-- wp:heading --></p>
<h4><strong>Következtetés: A Quad Safari Hurghada kötelező</strong></h4>
<p><!-- /wp:heading --><!-- wp:bekezdés --></p>
<p>Egy quados szafari kirándulás Hurghadában a kaland, a természet és az egyiptomi kultúra tökéletes kombinációja.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Ha felejthetetlenné szeretné tenni nyaralását Hurghadában, mindenképp élje át ezt az egyedülálló sivatagi kalandot.</p>
<p><!-- /wp:bekezdés --><!-- wp:bekezdés --></p>
<p>Foglalja le quad szafariját most, és fedezze fel Egyiptom lenyűgöző sivatagát.</p>
<!-- /wp:bekezdés -->', '5 perc', '[]'::jsonb),
('destinations', 'fa58e909-0571-455a-99fb-abb4033443fd', 'en', 'Marsa Alam', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'fa58e909-0571-455a-99fb-abb4033443fd', 'fr', 'Marsa Alam', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'fa58e909-0571-455a-99fb-abb4033443fd', 'ru', 'Марса Алам', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'fa58e909-0571-455a-99fb-abb4033443fd', 'ar', 'مرسى علم', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', '0cb58b8e-0abe-44b9-9469-3233654967b2', 'en', 'Luxor', 'The museum of the ancient city of Thebes with its world heritage sites.', NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', '0cb58b8e-0abe-44b9-9469-3233654967b2', 'fr', 'Louxor', 'Le musée de la ville antique de Thèbes avec ses sites du patrimoine mondial.', NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', '0cb58b8e-0abe-44b9-9469-3233654967b2', 'ru', 'Луксор
---ЦЭП---
Музей древнего города Фивы с его объектами всемирного наследия.', 'Dasuseum der antiken Stadt Theben mit seinen Weltkulturerbe-Stätten.', NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', '0cb58b8e-0abe-44b9-9469-3233654967b2', 'ar', 'الأقصر
--- تسيب ---
متحف مدينة طيبة القديمة بمواقع التراث العالمي.', 'Dasuseum der antiken Stadt Theben mit seinen Weltkulturerbe-Stätten.', NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', '08309a02-95d1-46e7-86c4-e385b7ebebce', 'en', 'El Gouna', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', '08309a02-95d1-46e7-86c4-e385b7ebebce', 'ru', 'Эль Гуна', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', '08309a02-95d1-46e7-86c4-e385b7ebebce', 'ar', 'الجونة', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', '08309a02-95d1-46e7-86c4-e385b7ebebce', 'fr', 'El Gouna', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', '08309a02-95d1-46e7-86c4-e385b7ebebce', 'hu', 'El Gouna', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'b8125c80-2ed7-4749-ab30-b77a6b186a2b', 'en', 'Sahl Hasheesh', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'b8125c80-2ed7-4749-ab30-b77a6b186a2b', 'ru', 'Сахл Хашиш', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'b8125c80-2ed7-4749-ab30-b77a6b186a2b', 'ar', 'سهل حشيش', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'b8125c80-2ed7-4749-ab30-b77a6b186a2b', 'fr', 'Sahl Hasheesh', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'b8125c80-2ed7-4749-ab30-b77a6b186a2b', 'hu', 'Sahl Hasheesh', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', '97593e2f-2e87-4f78-855a-c1f8f52cd83c', 'en', 'Soma Bay', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', '97593e2f-2e87-4f78-855a-c1f8f52cd83c', 'fr', 'Baie de Soma', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', '97593e2f-2e87-4f78-855a-c1f8f52cd83c', 'ru', 'Сома Бэй', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', '97593e2f-2e87-4f78-855a-c1f8f52cd83c', 'ar', 'خليج سوما', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', '0cb58b8e-0abe-44b9-9469-3233654967b2', 'hu', 'Luxor', 'Théba ősi városának múzeuma világörökségi helyszíneivel.', NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', '97593e2f-2e87-4f78-855a-c1f8f52cd83c', 'hu', 'Soma Bay', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('destinations', 'fa58e909-0571-455a-99fb-abb4033443fd', 'hu', 'Marsa Alam', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '693d8094-990e-44b2-acfe-571c66ffbb44', 'en', 'Horse riding in Hurghada – beach, desert & horses in the sea', NULL, 'h', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '693d8094-990e-44b2-acfe-571c66ffbb44', 'fr', 'Équitation à Hurghada – plage, désert et chevaux dans la mer', NULL, 'h', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '693d8094-990e-44b2-acfe-571c66ffbb44', 'ru', 'Верховая езда в Хургаде – пляж, пустыня и лошади в море
---ЦЭП---
ч', NULL, 'h', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '693d8094-990e-44b2-acfe-571c66ffbb44', 'ar', 'ركوب الخيل في الغردقة – الشاطئ والصحراء والخيول في البحر
--- تسيب ---
ح', NULL, 'h', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '8c5d9ce5-9931-42a6-8f09-44adf155d616', 'en', 'Mini Egypt Park Hurghada – Discover Egypt’s sights in miniature format', '<table class="tour-pricing-table"><thead><tr><th>Price</th><th>Trip type</th><th>Trip start</th><th>Pick-up</th></tr></thead><tbody><tr><td>From 35 € per person</td><td>individual</td><td>daily</td><td>approx. 10:00 a.m.</td></tr></tbody></table>
✨ Experience all of Egypt in one day - with Hurghada travel planner





Imagine walking through Egypt - from the majestic Pyramids of Giza to the legendary Temple of Abu Simbel - all in one place.





At Mini Egypt Park Hurghada, this dream becomes reality. Here, the history of Egypt comes to life in over 55 masterful miniature models - so detailed that you feel like you''re traveling through millennia yourself.





Whether as a family trip, a romantic experience for two or a cultural discovery tour - this excursion is an unforgettable highlight of your holiday on the Red Sea.', 'Discover Egypt''s sights in miniature: over 55 famous monuments, guided tour & transfer from €35. Ideal for families and those interested in culture.', 'Culture & sightseeing', '["🏺 Experience 55 iconic Egyptian landmarks - from Luxor to Alexandria, all recreated to scale in every detail.","🎧Exciting stories and fascinating background information about Egypt''s most famous buildings","🚌 Comfort included – air-conditioned return transfer directly from your hotel in Hurghada.","📸 Perfect for souvenir photos - capture magical moments between mini pyramids and temples.","👨‍👩‍👧 Ideal for families & children – education, fun and amazement in one."]'::jsonb, '["Entrance to Mini Egypt Park","Guided tour of all exhibitions","Pick-up & drop-off in an air-conditioned vehicle","Driver & local guide"]'::jsonb, '["Drinks","Personal expenses","Tips (optional)","Transfer surcharge from Makadi Bay & Sahl Hasheesh: €5 per person","Transfer surcharge from El Gouna, Safaga & Soma Bay: €10 per person","Foreign language tour guide (English, Russian or French): additional charge €10 per person"]'::jsonb, 'Hurghada–Red Sea–Egypt', '3h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '8c5d9ce5-9931-42a6-8f09-44adf155d616', 'ru', 'Mini Egypt Park Хургада – Откройте для себя достопримечательности Египта в миниатюрном формате
---ЦЭП---
Откройте для себя достопримечательности Египта в миниатюре: более 55 знаменитых памятников, экскурсии и трансфер от 35 евро. Идеально подходит для семей и тех, кто интересуется культурой.
---ЦЭП---
Культура и достопримечательности
---ЦЭП---
Хургада – Красное море – Египет
---ЦЭП---
3 часа
---ЦЭП---
<table class="tour-pricing-table"><thead><tr><th>Цена</th><th>Тип поездки</th><th>Начало поездки</th><th>Самовывоз</th></tr></thead><tbody><tr><td>От 35 евро на человека</td><td>индивидуально</td><td>ежедневно</td><td>ок. 10:00</td></tr></tbody></table>
✨ Исследуйте весь Египет за один день — с планировщиком путешествий по Хургаде.





Представьте себе прогулку по Египту – от величественных пирамид Гизы до легендарного храма Абу-Симбела – и все это в одном месте.





В Mini Egypt Park Hurghada эта мечта становится реальностью. Здесь история Египта оживает в более чем 55 искусных миниатюрных моделях, настолько детализированных, что создается впечатление, что вы сами путешествуете сквозь тысячелетия.





Будь то семейная поездка, романтический опыт для двоих или экскурсия по культуре – эта экскурсия станет незабываемым событием вашего отпуска на Красном море.
---ЦЭП---
🏺 Посетите 55 знаковых египетских достопримечательностей — от Луксора до Александрии, воссозданных в масштабе до мельчайших деталей.
---РАЗДЕЛЕНИЕ---
🎧Захватывающие истории и увлекательная справочная информация о самых известных зданиях Египта.
---РАЗДЕЛЕНИЕ---
🚌Комфорт включен – трансфер с кондиционером и обратно прямо из вашего отеля в Хургаде.
---РАЗДЕЛЕНИЕ---
📸 Идеально подходит для фотографий на память — запечатлейте волшебные моменты между мини-пирамидами и храмами.
---РАЗДЕЛЕНИЕ---
👨‍👩‍👧 Идеально подходит для семей и детей – образование, развлечение и удивление в одном.
---ЦЭП---
Вход в парк Мини-Египет.
---РАЗДЕЛЕНИЕ---
Экскурсия по всем выставкам
---РАЗДЕЛЕНИЕ---
Встреча и высадка на автомобиле с кондиционером
---РАЗДЕЛЕНИЕ---
Водитель и местный гид
---ЦЭП---
Напитки
---РАЗДЕЛЕНИЕ---
Личные расходы
---РАЗДЕЛЕНИЕ---
Советы (необязательно)
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из залива Макади и Сахл Хашиша: 5 евро на человека.
---РАЗДЕЛЕНИЕ---
Доплата за трансфер из Эль-Гуны, Сафаги и Сома-Бэй: 10 евро на человека.
---РАЗДЕЛЕНИЕ---
Гид на иностранном языке (английский, русский или французский): дополнительная плата 10 евро на человека.', '<table class="tour-pricing-table"><thead><tr><th>Preis</th><th>Reisetyp</th><th>Reiseantritt</th><th>Abholung</th></tr></thead><tbody><tr><td>Ab 35 € p.P.</td><td>individuell</td><td>täglich</td><td>ca. 10:00 Uhr</td></tr></tbody></table>
✨ Erlebe ganz Ägypten an einem Tag – mit Hurghada Reiseplaner





Stell dir vor, du läufst durch Ägypten – von den majestätischen Pyramiden von Gizeh bis zum sagenhaften Tempel von Abu Simbel – und das alles an einem einzigen Ort.





Im Mini Egypt Park Hurghada wird dieser Traum Wirklichkeit. Hier erwacht die Geschichte Ägyptens in über 55 meisterhaften Miniaturmodellen zum Leben – so detailreich, dass du das Gefühl hast, selbst durch Jahrtausende zu reisen.





Ob als Familienausflug, romantisches Erlebnis zu zweit oder kulturelle Entdeckungstour – dieser Ausflug ist ein unvergessliches Highlight deines Urlaubs am Roten Meer.', 'Entdecke Ägyptens Sehenswürdigkeiten im Miniaturformat: über 55 berühmte Monumente, geführte Tour & Transfer ab 35 €. Ideal für Familien und Kulturinteressierte.', 'Kultur & Sightseeing', '["🏺 Erlebe 55 ikonische Wahrzeichen Ägyptens – von Luxor bis Alexandria, alle im Maßstab detailgetreu nachgebaut.","🎧Spannende Geschichten und faszinierende Hintergründe zu Ägyptens berühmtesten Bauwerken","🚌 Komfort inklusive – klimatisierter Hin- & Rücktransfer direkt ab deinem Hotel in Hurghada.","📸 Perfekt für Erinnerungsfotos – halte magische Momente zwischen Mini-Pyramiden und Tempeln fest.","👨‍👩‍👧 Ideal für Familien & Kinder – Bildung, Spaß und Staunen in einem."]'::jsonb, '["Eintritt in den Mini Egypt Park","Geführte Tour durch alle Ausstellungen","Abholung & Rücktransfer im klimatisierten Fahrzeug","Fahrer & ortskundiger Guide"]'::jsonb, '["Getränke","Persönliche Ausgaben","Trinkgelder (optional)","Transferzuschlag ab Makadi Bay & Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga & Soma Bay: 10 € pro Person","Fremdsprachiger Reiseleiter (Englisch, Russisch oder Französisch): Aufpreis 10 € pro Person"]'::jsonb, 'Hurghada–Rotes Meer–Ägypten', '3h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '8c5d9ce5-9931-42a6-8f09-44adf155d616', 'fr', 'Mini Egypt Park Hurghada – Découvrez les sites égyptiens en format miniature', '<table class="tour-pricing-table"><thead><tr><th>Prix</th><th>Type de voyage</th><th>Début du voyage</th><th>Prise en charge</th></tr></thead><tbody><tr><td>À partir de 35 € par personne</td><td>individuel</td><td>par jour</td><td>env. 10h00</td></tr></tbody></table>
✨ Découvrez toute l''Égypte en une journée - avec le planificateur de voyage Hurghada





Imaginez-vous marcher à travers l''Égypte - des majestueuses pyramides de Gizeh au légendaire temple d''Abou Simbel - en un seul endroit.





Au Mini Egypt Park Hurghada, ce rêve devient réalité. Ici, l''histoire de l''Égypte prend vie dans plus de 55 modèles miniatures magistral - si détaillés que vous avez l''impression de voyager vous-même à travers des millénaires.





Qu''il s''agisse d''un voyage en famille, d''une expérience romantique à deux ou d''un circuit de découverte culturelle, cette excursion est un moment inoubliable de vos vacances sur la mer Rouge.', 'Découvrez les sites égyptiens en miniature : plus de 55 monuments célèbres, visite guidée & transfert à partir de 35 €. Idéal pour les familles et les personnes intéressées par la culture.', 'Culture et tourisme', '["🏺 Découvrez 55 monuments égyptiens emblématiques, de Louxor à Alexandrie, tous recréés à l''échelle dans les moindres détails.","🎧Histoires passionnantes et informations de base fascinantes sur les bâtiments les plus célèbres d''Égypte","🚌 Confort inclus – transfert aller-retour climatisé directement depuis votre hôtel à Hurghada.","📸 Parfait pour les photos souvenirs - capturez des moments magiques entre les mini pyramides et les temples.","👨‍👩‍👧 Idéal pour les familles et les enfants – éducation, plaisir et émerveillement à la fois."]'::jsonb, '["Entrée au parc Mini Egypt","Visite guidée de toutes les expositions","Prise en charge et retour dans un véhicule climatisé","Chauffeur et guide local"]'::jsonb, '["Boissons","Dépenses personnelles","Conseils (facultatif)","Supplément de transfert depuis la baie de Makadi et Sahl Hasheesh : 5 € par personne","Supplément de transfert depuis El Gouna, Safaga et Soma Bay : 10 € par personne","Guide touristique en langue étrangère (anglais, russe ou français) : supplément 10 € par personne"]'::jsonb, 'Hurghada – Mer Rouge – Égypte', '3h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '8c5d9ce5-9931-42a6-8f09-44adf155d616', 'ar', 'ميني إيجيبت بارك الغردقة – اكتشف المعالم السياحية في مصر في شكل مصغر
--- تسيب ---
اكتشف المعالم السياحية في مصر بشكل مصغر: أكثر من 55 معلمًا شهيرًا، وجولة بصحبة مرشد، وخدمة النقل بأسعار تبدأ من 35 يورو. مثالية للعائلات والمهتمين بالثقافة.
--- تسيب ---
الثقافة ومشاهدة المعالم السياحية
--- تسيب ---
الغردقة – البحر الأحمر – مصر
--- تسيب ---
3 ساعات
--- تسيب ---
<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>بداية الرحلة</th><th>النقل</th></tr></thead><tbody><tr><td>من 35 يورو للشخص الواحد</td><td>فردي</td><td>يوميًا</td><td>تقريبًا. 10:00 صباحًا</td></tr></tbody></table>
✨ استمتع بتجربة مصر بأكملها في يوم واحد - مع مخطط رحلات الغردقة





تخيل أنك تتجول في مصر - من أهرامات الجيزة المهيبة إلى معبد أبو سمبل الأسطوري - كل ذلك في مكان واحد.





وفي ميني إيجيبت بارك الغردقة، أصبح هذا الحلم حقيقة. هنا، ينبض تاريخ مصر بالحياة في أكثر من 55 نموذجًا مصغرًا بارعًا - بتفاصيل دقيقة تجعلك تشعر وكأنك تسافر عبر آلاف السنين بنفسك.





سواء أكانت رحلة عائلية، أو تجربة رومانسية لشخصين، أو جولة اكتشاف ثقافي - تعد هذه الرحلة من المعالم البارزة التي لا تُنسى خلال عطلتك على البحر الأحمر.
--- تسيب ---
🏺 استمتع بتجربة 55 معلمًا مصريًا بارزًا - من الأقصر إلى الإسكندرية، جميعها مُعاد إنشاؤها على نطاق واسع بكل تفاصيلها.
---تقسيم---
🎧قصص مثيرة ومعلومات خلفية رائعة عن أشهر المباني في مصر
---تقسيم---
🚌 الراحة متضمنة – خدمة نقل ذهابًا وإيابًا مكيفة مباشرة من فندقك في الغردقة.
---تقسيم---
📸 مثالية للصور التذكارية - التقط لحظات سحرية بين الأهرامات الصغيرة والمعابد.
---تقسيم---
👨‍👩‍👧 مثالية للعائلات والأطفال - التعليم والمرح والدهشة في آن واحد.
--- تسيب ---
مدخل ميني إيجيبت بارك
---تقسيم---
جولة إرشادية في جميع المعارض
---تقسيم---
الاستقبال والتوصيل في سيارة مكيفة
---تقسيم---
سائق ودليل محلي
--- تسيب ---
المشروبات
---تقسيم---
النفقات الشخصية
---تقسيم---
نصائح (اختياري)
---تقسيم---
تكلفة النقل الإضافية من خليج مكادي وسهل حشيش: 5 يورو للشخص الواحد
---تقسيم---
تكلفة النقل الإضافية من الجونة وسفاجا وخليج سوما: 10 يورو للشخص الواحد
---تقسيم---
مرشد سياحي بلغة أجنبية (الإنجليزية أو الروسية أو الفرنسية): رسوم إضافية 10 يورو للشخص الواحد', '<table class="tour-pricing-table"><thead><tr><th>Preis</th><th>Reisetyp</th><th>Reiseantritt</th><th>Abholung</th></tr></thead><tbody><tr><td>Ab 35 € p.P.</td><td>individuell</td><td>täglich</td><td>ca. 10:00 Uhr</td></tr></tbody></table>
✨ Erlebe ganz Ägypten an einem Tag – mit Hurghada Reiseplaner





Stell dir vor, du läufst durch Ägypten – von den majestätischen Pyramiden von Gizeh bis zum sagenhaften Tempel von Abu Simbel – und das alles an einem einzigen Ort.





Im Mini Egypt Park Hurghada wird dieser Traum Wirklichkeit. Hier erwacht die Geschichte Ägyptens in über 55 meisterhaften Miniaturmodellen zum Leben – so detailreich, dass du das Gefühl hast, selbst durch Jahrtausende zu reisen.





Ob als Familienausflug, romantisches Erlebnis zu zweit oder kulturelle Entdeckungstour – dieser Ausflug ist ein unvergessliches Highlight deines Urlaubs am Roten Meer.', 'Entdecke Ägyptens Sehenswürdigkeiten im Miniaturformat: über 55 berühmte Monumente, geführte Tour & Transfer ab 35 €. Ideal für Familien und Kulturinteressierte.', 'Kultur & Sightseeing', '["🏺 Erlebe 55 ikonische Wahrzeichen Ägyptens – von Luxor bis Alexandria, alle im Maßstab detailgetreu nachgebaut.","🎧Spannende Geschichten und faszinierende Hintergründe zu Ägyptens berühmtesten Bauwerken","🚌 Komfort inklusive – klimatisierter Hin- & Rücktransfer direkt ab deinem Hotel in Hurghada.","📸 Perfekt für Erinnerungsfotos – halte magische Momente zwischen Mini-Pyramiden und Tempeln fest.","👨‍👩‍👧 Ideal für Familien & Kinder – Bildung, Spaß und Staunen in einem."]'::jsonb, '["Eintritt in den Mini Egypt Park","Geführte Tour durch alle Ausstellungen","Abholung & Rücktransfer im klimatisierten Fahrzeug","Fahrer & ortskundiger Guide"]'::jsonb, '["Getränke","Persönliche Ausgaben","Trinkgelder (optional)","Transferzuschlag ab Makadi Bay & Sahl Hasheesh: 5 € pro Person","Transferzuschlag ab El Gouna, Safaga & Soma Bay: 10 € pro Person","Fremdsprachiger Reiseleiter (Englisch, Russisch oder Französisch): Aufpreis 10 € pro Person"]'::jsonb, 'Hurghada–Rotes Meer–Ägypten', '3h', NULL, NULL, NULL, NULL, '[]'::jsonb),
('tours', '8c5d9ce5-9931-42a6-8f09-44adf155d616', 'hu', 'Mini Egypt Park Hurghada – Fedezze fel Egyiptom nevezetességeit miniatűr formátumban', '<table class="tour-pricing-table"><thead><tr><th>Ár</th><th>Utazás típusa</th><th>Utazás kezdete</th><th>Átvétel</th></tr></thead><tbody><tr><td>35 €-tól személyenként</td><td>egyéni</td><tdx>napi</td> 10:00</td></tr></tbody></table>
✨ Tapasztalja meg egész Egyiptomot egy nap alatt – a Hurghada utazástervezővel





Képzelje el, hogy Egyiptomon keresztül sétál – a fenséges gízai piramisoktól a legendás Abu Simbel templomig – mindezt egy helyen.





A Mini Egypt Park Hurghadában ez az álom valósággá válik. Itt Egyiptom története elevenedik meg több mint 55 mesteri miniatűr modellben – olyan részletesen, hogy úgy érzi, maga is évezredeken át utazik.





Legyen szó családi kirándulásról, romantikus élményről kettesben vagy kulturális felfedező túráról – ez a kirándulás felejthetetlen fénypontja a Vörös-tengeren töltött nyaralásának.', 'Fedezze fel Egyiptom nevezetességeit miniatűrben: több mint 55 híres műemlék, vezetett túra és transzfer 35 eurótól. Ideális családoknak és a kultúra iránt érdeklődőknek.', 'Kultúra és városnézés', '["🏺 Tapasztalja meg az 55 ikonikus egyiptomi tereptárgyat – Luxortól Alexandriáig, és mindegyiket méretre szabják, minden részletében.","🎧 Izgalmas történetek és lenyűgöző háttérinformációk Egyiptom leghíresebb épületeiről","🚌 Kényelmet tartalmaz – légkondicionált oda-vissza transzfer közvetlenül a szállodából Hurghadában.","📸 Tökéletes szuvenírfotókhoz – örökíts meg varázslatos pillanatokat mini piramisok és templomok között.","👨‍👩‍👧 Ideális családok és gyermekek számára – oktatás, szórakozás és ámulat egyben."]'::jsonb, '["A Mini Egypt Park bejárata","Tárlatvezetés az összes kiállításon","Fel- és leadás klimatizált járművel","Sofőr és helyi idegenvezető"]'::jsonb, '["Italok","Személyi kiadások","Tippek (opcionális)","Transzfer felára a Makadi Bay & Sahl Hasheesh területéről: 5 euró személyenként","Transzfer felára El Gouna, Safaga és Soma Bay területéről: 10 € személyenként","Idegen nyelvű túravezető (angol, orosz vagy francia): felár 10 € személyenként"]'::jsonb, 'Hurghada – Vörös-tenger – Egyiptom', '3 óra', NULL, NULL, NULL, NULL, '[]'::jsonb);

-- =====================================================
-- STEP 4: Verify
-- =====================================================
SELECT table_name, locale, COUNT(*) as cnt FROM content_translations GROUP BY table_name, locale ORDER BY table_name, locale;