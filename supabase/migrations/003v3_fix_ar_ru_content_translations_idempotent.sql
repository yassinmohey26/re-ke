-- Migration 003v3: Idempotent upsert for AR and RU locale content_translations
-- Generated: 2026-07-25T22:36:47.171Z
-- Uses INSERT ... ON CONFLICT DO UPDATE for safe re-runs

BEGIN;

-- Ensure unique index exists (idempotent)
CREATE UNIQUE INDEX IF NOT EXISTS idx_ct_table_row_locale ON content_translations(table_name, row_id, locale);

-- =====================================================
-- AR locale data
-- =====================================================

-- Row 1: destinations 0cb58b8e | الأقصر
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('destinations', '0cb58b8e-0abe-44b9-9469-3233654967b2', 'ar', 'الأقصر', 'متحف مدينة طيبة القديمة بمواقعها المُدرجة في قائمة التراث العالمي.', NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 2: destinations 5233806c | القاهرة
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('destinations', '5233806c-dc22-4dc1-8aa8-5d90e819ef2c', 'ar', 'القاهرة', 'عاصمة مصر وأهرامات الجيزة والمتحف المصري.', NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 3: tours 693d8094 | ركوب الخيل في الغردقة – الشاطئ والصحراء والخيول في
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '693d8094-990e-44b2-acfe-571c66ffbb44', 'ar', 'ركوب الخيل في الغردقة – الشاطئ والصحراء والخيول في البحر', NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[{"q":"هل أحتاج خبرة في ركوب الخيل؟","a":"لا، مناسبة للمبتدئين. المرشد يرافق طوال الرحلة."},{"q":"ماذا أرتدي؟","a":"حذاء مغلق، بنطال طويل، واقي شمسي."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 4: tours 42a2941f | رحلة نهارية خاصة من الغردقة إلى الأقصر – وادي المل
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '42a2941f-6b90-4f0a-9593-0ec1ec980a13', 'ar', 'رحلة نهارية خاصة من الغردقة إلى الأقصر – وادي الملوك ومعبد الكرنك', '<table class="tour-pricing-table"><thead><tr><th>المشاركون</th><th>المركبة</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخصان</td><td>ليموزين خاصة</td><td>150 € للشخص الواحد</td></tr><tr><td>3 – 4 أشخاص</td><td>حافلة صغيرة خاصة</td><td>135 € للشخص الواحد</td></tr><tr><td>5 – 6 أشخاص</td><td>حافلة صغيرة خاصة</td><td>100 € للشخص الواحد</td></tr><tr><td>7 – 8 أشخاص</td><td>حافلة صغيرة خاصة</td><td>90 € للشخص الواحد</td></tr></tbody></table>
اكتشف التاريخ الرائع لمصر في رحلة نهارية خاصة ومريحة من الغردقة إلى الأقصر. كانت الأقصر — طيبة سابقاً — في يوم من الأيام مركز الحضارة المصرية القديمة، وتضم بعضاً من أبرز الآثار وأكثرها إبهاراً في البلاد.

يبدأ يومك في الصباح الباكر برحلة مريحة إلى الأقصر. برفقة عالم مصريات ذي خبرة وناطق بالألمانية، ستستكشف أبرز معالم المدينة: وادي الملوك بمقابره الفاخرة، ومعبد الكرنك الضخم، ومعبد حتشبسوت ذي الأروقة، وتمثالَي ممنون الشهيرَين.

هذه الجولة مثالية لمحبي التاريخ، والعائلات، والمسافرين الراغبين في تجربة القلب الثقافي لمصر في يوم واحد.', 'اكتشف الأقصر في رحلة نهارية خاصة من الغردقة. قم بزيارة وادي الملوك ومعبد الكرنك ومعبد حتشبسوت وتمثالَي ممنون، مع الغداء ومرشد سياحي ناطق بالألمانية.', 'الثقافة والسياحة', '["وادي الملوك – اكتشف قبور الفراعنة","معبد الكرنك – مبنى ضخم بأعمدة شامخة","معبد الملكة حتشبسوت – تحفة معمارية","تمثالا ممنون – تمثالان جالسان مهيبان","غداء بمأكولات مصرية مميزة","جولة خاصة مع عالم مصريات ناطق بالألمانية"]'::jsonb, '["نقل مميز بسيارة مكيفة","عالم مصريات ناطق بالألمانية كمرشد سياحي","رسوم الدخول لجميع المعالم السياحية","الغداء","مياه معدنية ومشروبات خفيفة أثناء الرحلة"]'::jsonb, '["مشروبات في المطعم","نفقات شخصية","رسوم نقل إضافية لضيوف مرسى علم: 25 يورو للفرد","رسوم نقل إضافية لضيوف القصير: 15 يورو للفرد","رسوم نقل إضافية من خليج مكادي وسهل حشيش: 5 يورو للفرد","رسوم نقل إضافية من الجونة وسفاجا وخليج سوما: 10 يورو للفرد","مرشد سياحي بلغة أجنبية (إنجليزية أو روسية أو فرنسية): إضافة 10 يورو للفرد"]'::jsonb, 'الغردقة - البحر الأحمر - مصر', '14 ساعة', NULL, NULL, NULL, NULL, '[{"q":"كم تستغرق الرحلة من الغردقة إلى الأقصر؟","a":"حوالي 4-5 ساعات بالسيارة المكيفة."},{"q":"هل يمكن زيارة مقبرة توت عنخ آمون؟","a":"نعم، يمكن زيارة مقبرة توت عنخ آمون في وادي الملوك (رسوم دخول منفصلة)."},{"q":"هل الغداء مشمول؟","a":"نعم، الغداء في مطعم محلي مشمول في السعر."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 5: tours 77f34e21 | جونة – جولة خاصة في المدينة مع رحلة بحرية في البحي
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '77f34e21-9d9d-4be6-90b3-8148b2d82214', 'ar', 'جونة – جولة خاصة في المدينة مع رحلة بحرية في البحيرة وبرج المراقبة', '<table class="tour-pricing-table"><thead><tr><th>المشاركون</th><th>المركبة</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخصان</td><td>ليموزين خاصة</td><td>50 € للشخص الواحد</td></tr><tr><td>3 – 4 أشخاص</td><td>حافلة صغيرة خاصة</td><td>40 € للشخص الواحد</td></tr><tr><td>5 – 6 أشخاص</td><td>حافلة صغيرة خاصة</td><td>35 € للشخص الواحد</td></tr><tr><td>7 – 8 أشخاص</td><td>حافلة صغيرة خاصة</td><td>30 € للشخص الواحد</td></tr></tbody></table>
تُعدّ الجونة من أكثر الوجهات أناقةً على ساحل البحر الأحمر. تتميز هذه المدينة الشاطئية الحديثة بممراتها المائية الفيروزية، وجزرها الهادئة، وهندستها المعمارية المتوسطية، وأجوائها الراقية التي تذكّر بالمدن الساحلية الأوروبية.

مع جولتنا الخاصة في مدينة الجونة، ستكتشف المدينة بأسلوبك الفريد: بلا توقفات للبيع، وبلا مجموعات كبيرة، بل برفقة مرشد ذي خبرة وناطق بالألمانية واهتمام شخصي. تجمع الجولة بين رحلة بحرية خلابة في البحيرة، ومعالم ثقافية متنوعة، وزيارة برج المراقبة الشهير الذي يتيح لك أحد أجمل المناظر البانورامية في الجونة بأكملها.', 'اكتشف الجونة فينيسيا مصر في جولة خاصة بالمدينة مع رحلة بحرية في البحيرة وزيارة برج المراقبة. الهندسة المعمارية، رصيف اليخوت، البحيرات والبانوراما في حوالي 4 ساعات فقط، بدون توقفات للبيع.', 'الثقافة والسياحة', '["جولة خاصة في المدينة مع مرشد ناطق بالألمانية","رحلة بحرية مثالية عبر بحيرات الجونة","زيارة برج المراقبة للمناظر البانورامية","وسط المدينة، المسجد، الكنيسة القبطية ومكتبة الإسكندرية","تجول على رصيف أبو تيق لليخوت","بدون توقفات للبيع","مناسبة للأزواج والعائلات ومحبي التصوير"]'::jsonb, '["نقل خاص بسيارة مكيفة","رحلة بحرية في بحيرات الجونة","مرشد سياحي ناطق بالألمانية","مشروبات خفيفة في السيارة","رسوم الدخول حسب البرنامج"]'::jsonb, '["نفقات شخصية","مشروبات في المقاهي أو المطاعم","رسوم نقل إضافية من خليج مكادي وسهل حشيش: 5 يورو للفرد","رسوم نقل إضافية من الجونة وسفاجا وخليج سوما: 10 يورو للفرد","مرشد سياحي بلغة أجنبية (إنجليزية أو روسية أو فرنسية): إضافة 10 يورو للفرد"]'::jsonb, 'الغردقة - البحر الأحمر - مصر', '4 ساعات', NULL, NULL, NULL, NULL, '[{"q":"ما الذي يشمل الكروز؟","a":"كروز عبر بحيرات الجونة مع توقفات للسباحة."},{"q":"هل يوجد غطس؟","a":"نعم، الغطس في مياه البحيرات الصافية مشمول."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 6: tours c2db0455 | جولة ليلية في مدينة الغردقة – جولة خاصة
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', 'c2db0455-a5c7-47f9-8925-2ce6dcc3434a', 'ar', 'جولة ليلية في مدينة الغردقة – جولة خاصة', '<table class="tour-pricing-table"><thead><tr><th>المشاركون</th><th>المركبة</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخصان</td><td>ليموزين خاصة</td><td>30 € للشخص الواحد</td></tr><tr><td>3 – 4 أشخاص</td><td>حافلة صغيرة خاصة</td><td>25 € للشخص الواحد</td></tr><tr><td>5 – 6 أشخاص</td><td>حافلة صغيرة خاصة</td><td>20 € للشخص الواحد</td></tr><tr><td>7 – 8 أشخاص</td><td>حافلة صغيرة خاصة</td><td>15 € للشخص الواحد</td></tr></tbody></table>
استمتع بالغردقة في أبهى حُللها: ليلاً. مع تلاشي حرارة النهار، تكشف المدينة عن إيقاعها المسائي الفريد. المارينا المضاءة، والأسواق التقليدية، والمسجد الكبير، وزيارة مقهى مصري أصيل — تجعل هذه الجولة الحصرية نافذةً مكثّفة على الغردقة الحقيقية.

مع مخطّط رحلات الغردقة، ستستمتع بجولة خاصة في المدينة برفقة مرشد ناطق بالألمانية، تجمع بين الانطباعات الأصيلة والراحة المريحة.

لماذا الجولة الليلية في الغردقة؟

حين تغرب الشمس ويكتسي الأفق بدرجات الحمرة، تظهر الغردقة بأجمل صورها. تضيء المارينا، وتنبض الأسواق بالحياة، وتتنفس المدينة الصعداء. في هذه اللحظة بالضبط، نرافقك في أجواء المساء الغامضة — بلا ازدحام، مريحة وشخصية.', 'استمتع بالغردقة ليلاً مع المارينة المتلألئة والأصالة والذوق الشرقي. هذه الجولة الخاصة التي تستغرق حوالي 3 ساعات تُريك المدينة من منظور جديد تمامًا.', 'الثقافة والسياحة', '["مارينا الغردقة – منارة تتوهج بالأنوار الدافئة ليلاً","سوق الخضروات والفواكه التقليدي","سوق السمك والمسجد الكبير – معلم ديني مضاء بالأنوار الدافئة","تجربة القهوة المصرية التقليدية في مقهى محلي"]'::jsonb, '["نقل بسيارات حديثة مكيفة","مرشد سياحي ناطق بالألمانية","رسوم الدخول لجميع المعالم المذكورة","التأمين والرسوم"]'::jsonb, '["نفقات شخصية","رسوم نقل إضافية من خليج مكادي وسهل حشيش: 5 يورو للفرد","رسوم نقل إضافية من الجونة وسفاجا وخليج سوما: 10 يورو للفرد","مرشد سياحي بلغة أجنبية (إنجليزية أو روسية أو فرنسية): إضافة 10 يورو للفرد"]'::jsonb, 'الغردقة - البحر الأحمر - مصر', '3 ساعات', NULL, NULL, NULL, NULL, '[{"q":"ما الأماكن التي نزورها ليلاً؟","a":"المارينا، مسجد الميناء، البازار القديم، عشاء مع إطلالة بحرية."},{"q":"هل العشاء مشمول؟","a":"نعم، العشاء في مطعم بإطلالة بحرية مشمول."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 7: tours 7cb0c635 | رحلة نهارية خاصة إلى دندرة وأبيدوس من الغردقة
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '7cb0c635-f7a7-4d98-a9b0-cde4997ca8ae', 'ar', 'رحلة نهارية خاصة إلى دندرة وأبيدوس من الغردقة', '<table class="tour-pricing-table"><thead><tr><th>المشاركون</th><th>المركبة</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخصان</td><td>ليموزين خاصة</td><td>140 € للشخص الواحد</td></tr><tr><td>3 – 4 أشخاص</td><td>حافلة صغيرة خاصة</td><td>130 € للشخص الواحد</td></tr><tr><td>5 – 6 أشخاص</td><td>حافلة صغيرة خاصة</td><td>120 € للشخص الواحد</td></tr><tr><td>7 – 8 أشخاص</td><td>حافلة صغيرة خاصة</td><td>110 € للشخص الواحد</td></tr></tbody></table>
يوم لا يُنسى في قلب مصر القديمة

استمتع بسحر مصر القديمة في جولة خاصة وحصرية من مخطّط رحلات الغردقة.

تأخذك هذه الرحلة النهارية الخاصة إلى دندرة وأبيدوس، لزيارة اثنين من أروع مواقع المعابد في مصر — أماكن تتجسّد فيها التاريخ والأسطورة والجمال في الحجر.

برفقة عالم مصريات ذي خبرة وناطق بالألمانية، ستسافر عبر وادي النيل لتكتشف أضرحة لا يراها إلا قِلّة من الزوار.

🌸 معبد دندرة — مملكة الإلهة حتحور

محطتك الأولى هي معبد حتحور الرائع في دندرة — تحفة فنية مصرية ورمز للحب والموسيقى والبهجة.

هنا تنتظرك:
💠 قاعات ذات أعمدة ملونة احتفظت بألوانها الأصلية حتى اليوم
💠 الماميسي (بيت ولادة الآلهة) — رمز الخلق والحياة
💠 المصحة التي كانت تُجرى فيها الشفاءات الإلهية
💠 البحيرة المقدسة — مكان الطهارة الروحية
💠 الصورة الوحيدة الباقية للأسطورة كليوباترا السابعة

سيشرح لك مرشدك النقوش الفلكية الغامضة على السقف، شاهداً على معرفة قديمة بالنجوم.
✨ دندرة هو أحد أكثر معابد مصر إشراقاً بالألوان — مكان يُضيء التاريخ.

🌙 معبد أبيدوس — مقدّس أوزوريس

بعد رحلة ذات مناظر خلابة على طول وادي النيل، تصل إلى أبيدوس، إحدى أقدس مدن مصر القديمة.

هنا كان الناس يعبدون الإله أوزوريس، حاكم الموت والبعث.

ستزور معبد الفرعون سيتي الأول، المعروف بكونه من أجمل المعابد المصرية من الناحية الفنية.

أبرز معالم أبيدوس:
🔹 قائمة ملوك أبيدوس الشهيرة بأسماء الفراعنة العظام
🔹 كتابات هيروغليفية ونقوش محفورة بدقة في حالة شبه مثالية
🔹 مشاهد من أسطورة حورس — الصراع الأبدي بين الخير والشر
🔹 نقوش رمسيس الثاني مع ابنه في مشاهد القرابين والصيد

🕊️ أبيدوس ليس مجرد معبد — بل مكان روحاني تعيش فيه روح مصر.

💼 نصائح سفر لرحلتك
✔️ صورة من جواز السفر أو بطاقة الهوية (مطلوبة من الجهات الأمنية)
✔️ اطلب وجبة الإفطار من مكتب استقبال الفندق في المساء السابق
✔️ ارتدِ حذاءً مريحاً وملابس مناسبة للطقس
✔️ لا تنسَ واقي الشمس والنظارات الشمسية والقبعة
✔️ كاميرا أو هاتف لتخليد اللحظات
✔️ بعض النقود للإكراميات ودورات المياه', 'رحلة نهارية خاصة من الغردقة إلى دندرة وأبيدوس مع عالم مصريات ناطق بالألمانية، معبد حتحور، معبد أبيدوس، الغداء والنقل المريح.', 'الثقافة والسياحة', '["جولة خاصة بدون سياحة جماعية","عالم مصريات ناطق بالألمانية بخبرة متخصصة","زيارة معبد حتحور في دندرة","زيارة معبد أبيدوس مع قائمة الملوك","نقل مريح بسيارة مكيفة","فن معابد أصيل ونقوش و hieroglyphics"]'::jsonb, '["مرشد سياحي أو عالم مصريات ناطق بالألمانية","نقل خاص بسيارة مكيفة حديثة","رسوم الدخول لجميع المعالم المذكورة في البرنامج","غداء في مطعم محلي","مشروبات خفيفة في المركبة","جميع الضرائب ورسوم الخدمة"]'::jsonb, '["مشروبات في المطعم","نفقات شخصية وبقشيش","رسوم نقل إضافية لضيوف مرسى علم: 50 يورو للفرد","رسوم نقل إضافية لضيوف القصير: 35 يورو للفرد","رسوم نقل إضافية من خليج مكادي وسهل حشيش: 5 يورو للفرد","رسوم نقل إضافية من الجونة وسفاجا وخليج سوما: 10 يورو للفرد","مرشد سياحي بلغة أجنبية (إنجليزية أو روسية أو فرنسية): إضافة 10 يورو للفرد"]'::jsonb, 'الغردقة - البحر الأحمر - مصر', '13 ساعة', NULL, NULL, NULL, NULL, '[{"q":"أي المعابد نزور؟","a":"معبد حتحور في دندرة ومعبد سيتي الأول في أبيدوس."},{"q":"كم تستغرق الرحلة؟","a":"حوالي 13 ساعة بما في ذلك النقل."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 8: tours 2dc6864a | دير القديس أنطونيوس والقديس بولس من الغردقة – أقدم
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '2dc6864a-30cb-4a8e-8277-a54c2ed8ca7d', 'ar', 'دير القديس أنطونيوس والقديس بولس من الغردقة – أقدم الأديرة المسيحية في العالم', '<table class="tour-pricing-table"><thead><tr><th>المشاركون</th><th>المركبة</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخصان</td><td>ليموزين خاصة</td><td>96 € للشخص الواحد</td></tr><tr><td>3 – 4 أشخاص</td><td>حافلة صغيرة خاصة</td><td>85 € للشخص الواحد</td></tr><tr><td>5 – 6 أشخاص</td><td>حافلة صغيرة خاصة</td><td>80 € للشخص الواحد</td></tr><tr><td>7 – 8 أشخاص</td><td>حافلة صغيرة خاصة</td><td>71 € للشخص الواحد</td></tr></tbody></table>
استمتع بزيارة اثنين من أقدم الأديرة المسيحية في جولة خاصة وحصرية من الغردقة. يقع دير القديس أنطونيوس ودير القديس بولس في عزلة الصحراء الشرقية، ويُعدّان من أبرز الأماكن الروحانية في مصر.

يُعدّ دير القديس أنطونيوس والقديس بولس من أقدم الأديرة في العالم. تأسّس دير القديس أنطونيوس في القرن الرابع، ودير القديس بولس فوق كهف القديس بولس الذي يُبجَّل بوصفه أول ناسك مسيحي.

يقدّم كلا الديرين رؤى فريدة في الرهبنة المبكرة والتقليد القبطي في مصر.

لماذا هذه الرحلة مميزة جداً؟

على عكس المعابد المصرية الشهيرة، ستختبر هنا الجانب الروحاني للبلاد. توفر هذه الأديرة النائية في قلب الصحراء الشرقية مزيجاً فريداً من التاريخ والدين والطبيعة والسكينة. ولا يزال الرهبان يعيشون هنا حتى اليوم وفق تقاليد عريقة تمتد لقرون.

لمن هذه الرحلة؟

هذه الرحلة مناسبة بشكل خاص للمسافرين المهتمين بالثقافة، والمسيحيين، وهواة التاريخ، والضيوف الراغبين في اكتشاف مصر الأصيلة بعيداً عن المسارات السياحية المعروفة.', 'اكتشف أديرة القديس أنطونيوس والقديس بولس، أقدم الأديرة المسيحية في العالم. رحلة نهارية فريدة من الغردقة مليئة بالتاريخ والروحانية ومناظر الصحراء الخلابة.', 'الثقافة والسياحة', '["زيارة أقدم الأديرة المسيحية في العالم","كنائس تاريخية وفريسكو مخطوطة ومخطوطات ثمينة","الصعود إلى كهف القديس أنطونيوس (اختياري)","مناظر طبيعية صاحرة لجبال البحر الأحمر","مرشد سياحي ناطق بالألمانية متخصص","الغداء مشمول"]'::jsonb, '["جميع النقل بسيارة مكيفة","مرشد سياحي ناطق بالألمانية","رسوم الدخول حسب البرنامج","الغداء","مشروبات في المركبة","جميع رسوم الخدمة والضرائب"]'::jsonb, '["مشروبات في المطعم","نفقات شخصية","رسوم نقل إضافية لضيوف مرسى علم: 25 يورو للفرد","رسوم نقل إضافية لضيوف القصير: 15 يورو للفرد","رسوم نقل إضافية من خليج مكادي وسهل حشيش: 5 يورو للفرد","رسوم نقل إضافية من الجونة وسفاجا وخليج سوما: 10 يورو للفرد","مرشد سياحي بلغة أجنبية (إنجليزية أو روسية أو فرنسية): إضافة 10 يورو للفرد"]'::jsonb, 'الغردقة - البحر الأحمر - مصر', '14 ساعة', NULL, NULL, NULL, NULL, '[{"q":"كم تستغرق الرحلة؟","a":"يوم كامل، حوالي 14 ساعة بما في ذلك النقل."},{"q":"هل تناسب الأطفال؟","a":"نعم، لكنها رحلة طويلة. يُنصح للأطفال فوق 8 سنوات."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 9: tours 1c5a3c79 | رحلة يومين في الأقصر مع ركوب منطاد الهواء الساخن و
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '1c5a3c79-ab29-46c7-b480-36954adcc661', 'ar', 'رحلة يومين في الأقصر مع ركوب منطاد الهواء الساخن وإقامة ليلية في الفندق من الغردقة', '<table class="tour-pricing-table"><thead><tr><th>المشاركون</th><th>المركبة</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخصان</td><td>ليموزين خاصة</td><td>300 € للشخص الواحد</td></tr><tr><td>3 – 4 أشخاص</td><td>حافلة صغيرة خاصة</td><td>270 € للشخص الواحد</td></tr><tr><td>5 – 6 أشخاص</td><td>حافلة صغيرة خاصة</td><td>240 € للشخص الواحد</td></tr><tr><td>7 – 8 أشخاص</td><td>حافلة صغيرة خاصة</td><td>220 € للشخص الواحد</td></tr></tbody></table>
اكتشف مع مخطّط رحلات الغردقة واحدة من أروع الرحلات الثقافية في مصر. تجمع هذه الرحلة المدتها يومان إلى الأقصر مع ركوب منطاد الهواء الساخن بين التاريخ والمغامرة والراحة، مع إقامة ليلية في فندق بالأقصر.

تشمل الجولة: رحلة بمنطاد الهواء الساخن عند شروق الشمس، ووادي الملوك، ومعبد حتشبسوت، وتمثالَي ممنون، ومعبد الكرنك، والإقامة الفندقية، والعشاء، والإفطار، وتذاكر الدخول، والانتقالات، وعالم مصريات ناطق بالألمانية.

مثالية للضيوف الذين لا يرغبون في قضاء وقت قصير في الأقصر، بل يريدون تجربة أبرز معالم المدينة القديمة بأسلوب مريح ومكثّف.', 'استمتع بالأقصر مع ركوب منطاد الهواء الساخن وإقامة ليلية في الفندق، وادي الملوك ومعبد حتشبسوت وتمثالا ممنون ومعبد الكرنك. يشمل مرشد مصريات ناطق بالألمانية ورسوم الدخول والنقل وركوب المنطاد عند شروق الشمس.', 'الثقافة والسياحة', '["ركوب منطاد الهواء الساخن فوق الأقصر عند شروق الشمس – منظر بانورامي لا يُنسى على النيل","معبد الكرنك – أكبر مبنى ديني في العصور القديمة","وادي الملوك – قم بزيارة 3 قبور فاخرة برسومات جدارية أصلية","معبد حتشبسوت – تحفة أقوى امرأة في مصر","تمثالا ممنون – بقايا معبد Amenophis III المذهلة","إقامة في الفندق تشمل العشاء والفطور"]'::jsonb, '["مرشد مصريات ناطق بالألمانية كمرشد سياحي","رسوم الدخول لجميع المعالم السياحية حسب البرنامج","45-60 دقيقة ركوب منطاد الهواء الساخن فوق الأقصر","إقامة في الفندق تشمل العشاء والفطور","جميع النقل بسيارة مكيفة","جميع الضرائب ورسوم الخدمة"]'::jsonb, '["مشروبات في المطعم","نفقات شخصية","رسوم نقل إضافية لضيوف مرسى علم: 25 يورو للفرد","رسوم نقل إضافية لضيوف القصير: 15 يورو للفرد","رسوم نقل إضافية من خليج مكادي وسهل حشيش: 5 يورو للفرد","رسوم نقل إضافية من الجونة وسفاجا وخليج سوما: 10 يورو للفرد","مرشد سياحي بلغة أجنبية (إنجليزية أو روسية أو فرنسية): إضافة 10 يورو للفرد"]'::jsonb, 'الغردقة - البحر الأحمر - مصر', 'يوم واحد', NULL, NULL, NULL, NULL, '[{"q":"هل رحلة المنطاد آمنة؟","a":"نعم، المنطاد يتم صيانته بانتظام. الركاب يمرون بفحص طبي قبل الرحلة."},{"q":"ما الذي يشمله السعر؟","a":"رحلة المنطاد 60 دقيقة، إقامة ليلية في الأقصر، نقل، مرشد ألماني."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 10: tours 4f91f20d | جولة تسوق بالغردقة – رحلة مجانية في البازار مع الن
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '4f91f20d-ead4-4473-8700-371d4cb5fc4e', 'ar', 'جولة تسوق بالغردقة – رحلة مجانية في البازار مع النقل', '<table class="tour-pricing-table"><thead><tr><th>المشاركون</th><th>المركبة</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخصان</td><td>ليموزين خاصة</td><td>مجاني</td></tr><tr><td>3 – 4 أشخاص</td><td>حافلة صغيرة خاصة</td><td>مجاني</td></tr><tr><td>5 – 6 أشخاص</td><td>حافلة صغيرة خاصة</td><td>مجاني</td></tr><tr><td>7 – 8 أشخاص</td><td>حافلة صغيرة خاصة</td><td>مجاني</td></tr></tbody></table>
مرحباً بكم في مخطّط رحلات الغردقة — استمتع بتجربة الغردقة من خلال جولة تسوق مجانية إلى البازار التقليدي.

نصطحبك بكل يسر من فندقك ونوصلك مباشرةً إلى بازار الغردقة. هناك تتمتع بوقت حر للتسوق والاستكشاف والتجوّل. ستجد الهدايا التذكارية، والتوابل، وزيوت العطور، والمصنوعات الجلدية، والمجوهرات، وورق البردي، والحرف اليدوية.

هذه الجولة مثالية للضيوف الراغبين في اكتشاف الغردقة خارج أسوار الفندق وتذوّق الحياة السوقية المحلية الأصيلة. بعد التسوق، نوصلك بأمان إلى فندقك.', 'رحلة تسوق مجانية إلى بازار الغردقة مع النقل.', 'الثقافة والسياحة', '["جولة تسوق مجانية مع نقل من وإلى الفندق","زيارة بازار مشهور في الغردقة","سوينيرات، بهارات، زيوت عطرية، جلود ومجوهرات","وقت حر للتسوق والتجول","مناسبة للعائلات والأزواج ومحبي الثقافة"]'::jsonb, '["نقل من وإلى الفندق","نقل خاص أو مريح","وقت حر في البازار","مرافقة وتنظيم من الغردقة ريزبلانر"]'::jsonb, '["نفقات شخصية","المشتريات والسوينيرات","بقشيش اختياري"]'::jsonb, 'الغردقة - البحر الأحمر - مصر', '3 ساعات', NULL, NULL, NULL, NULL, '[{"q":"هل الرحلة مجانية حقاً؟","a":"نعم، النقل والمرشد مجانيان. تدفع فقط مقابل المشتريات."},{"q":"كم تستغرق رحلة التسوق؟","a":"حوالي 3 ساعات بما في ذلك النقل."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 11: tours 69aa0c36 | رحلة الغطس والرياضات المائية إلى جزيرة أورانج باي 
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '69aa0c36-125f-4f41-8502-55a8f4fd6d98', 'ar', 'رحلة الغطس والرياضات المائية إلى جزيرة أورانج باي من الغردقة', '<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>موعد الانطلاق</th><th>الاستقبال</th></tr></thead><tbody><tr><td>من 35 € للشخص الواحد</td><td>جولة جماعية</td><td>يومياً</td><td>نحو الساعة 8:00 صباحاً</td></tr></tbody></table>
تُعدّ رحلة الغطس إلى جزيرة أورانج باي مع الرياضات المائية من الغردقة من أكثر الرحلات اليومية حصريةً وأعلاها حجزاً في البحر الأحمر. تقع جزيرة أورانج باي داخل محمية الجفتون الوطنية، وهي من أجمل الوجهات الطبيعية في مصر.

تُشكّل الرمال البيضاء الناعمة، والمياه الفيروزية، والشعاب المرجانية الملوّنة خلفيةً استثنائية ليوم إجازة مثالي. تجمع هذه الرحلة بين غطس عالي الجودة، وساعات استجمام على جزيرة فردوسية، وأنشطة رياضات مائية احترافية — مع خدمة من الدرجة الأولى، ونقل خاص، ومرشد ناطق بالألمانية.

تجربة مثالية للمسافرين الذين يقدّرون الجودة والراحة والأمان وتجارب الطبيعة الأصيلة.

تُعرف أورانج باي بـ"كاريبي مصر"، وتُبهج الزوار بشاطئها الرملي الأبيض، ومياهها الصافية، وعالمها الفريد تحت الماء. الرحلة مثالية للعائلات، والأزواج، والمجموعات، ومبتدئي الغطس.', 'رحلة غطس ورياضات مائية إلى جزيرة أورانج باي في منتزه الجفتون الوطني – رمال بيضاء ومياه فيروزية وخدمة من الدرجة الأولى.', NULL, '["جزيرة أورانج باي الخلابة في منتزه الجفتون الوطني","من أكثر رحلات الغردقة طلبًا","موقفا غطس على شعاب مرجانية من الدرجة الأولى","مياه كريستالية وعالم بحري متنوع","رياضات مائية مشمولة: بانانا بوت وصوفا بوت","استرخاء على الشاطئ الرملي مع كراسي استلقاء","غداء ومشروبات غير كحولية مشمولة","نقل خاص من الفندق بسيارة مكيفة","قوارب عالية الجودة","مناسبة للعائلات والأزواج والمجموعات","أورانج باي – كاريبية البحر الأحمر"]'::jsonb, '["التوصيل من وإلى الفندق في الغردقة (خاص ومكيف)","رحلة بحرية إلى جزيرة أورانج باي","موقفا غطس","معدات غطس كاملة (قناع، زعانف، أنبوب تنفس، سترة نجاة)","الإقامة على جزيرة أورانج باي","الغداء","مشروبات غير كحولية","رياضات مائية (بانانا بوت وصوفا بوت)","رسوم المنتزه الوطني"]'::jsonb, '["نفقات شخصية","مشروبات أو وجبات خفيفة إضافية","رسوم نقل إضافية لمناطق محددة"]'::jsonb, 'الغردقة - البحر الأحمر - مصر', '4 ساعات', NULL, NULL, NULL, NULL, '[{"q":"ما الرياضات المائية المشمولة؟","a":"الموز، الديفان، الجيت سكي، الباراسيلينغ."},{"q":"هل توجد قيود عمرية؟","a":"الأطفال من 6 سنوات مع إشراف الوالدين."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 12: tours 17a82d9b | رحلة جزيرة المحمية بالغردقة مع الغطس والغداء
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '17a82d9b-2d00-4a29-8528-3c2e97a6bf26', 'ar', 'رحلة جزيرة المحمية بالغردقة مع الغطس والغداء', '<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>موعد الانطلاق</th><th>الاستقبال</th></tr></thead><tbody><tr><td>من 95 € للشخص الواحد</td><td>جولة جماعية</td><td>يومياً</td><td>نحو الساعة 8:00 صباحاً</td></tr></tbody></table>
تخيّل: رمال بيضاء ناعمة تحت قدميك، والبحر يتلألأ بكل درجات الفيروزي، والشمس تلمع على سطح الماء — مرحباً بك في جزيرة المحمية، أحد أجمل الأماكن في البحر الأحمر.

تُعدّ رحلة جزيرة المحمية في الغردقة أكثر بكثير من مجرد رحلة غطس عادية. إنها رحلة إلى جنة طبيعية محمية، تُعرف بحق بـ"جزر المالديف المصرية".

هنا تنتظرك شعاب مرجانية رهيبة، ومياه صافية كالكريستال، وعالم تحت الماء يعجّ بالألوان والحياة. بعيداً عن الضجيج والصخب، ستنعم بالسكينة والفخامة والطبيعة في توافق تام.

الرحلة مثالية للضيوف الباحثين عن رحلة جزيرة وغطس عالية الجودة من الغردقة تجمع بين الراحة والطبيعة والاسترخاء.

لماذا هذه الرحلة من بين أفضل الرحلات في الغردقة؟
✔ واحدة من أجمل مواقع الغطس في البحر الأحمر
✔ محمية طبيعية وطنية — طبيعة بكر لم تمسّها يد الإنسان
✔ شاطئ الأحلام برماله البيضاء الناعمة
✔ رحلة بالقارب عالية الجودة مع طاقم محترف
✔ تناول الغداء في مطعم على الشاطئ مع إطلالة بحرية
✔ مثالية للأزواج والعائلات وعشاق البحر', 'رحلة إلى جزيرة المحمية من الغردقة مع الغطس والغداء ورحلة بالقارب – جزر المالديف المصرية على عتبة داركم مباشرةً.', NULL, '["نقل من الفندق إلى الغردقة مشمول","رحلة بحرية إلى جزيرة المحمية في البحر الأحمر","غطس على شعاب مرجانية ملونة","الإقامة على جزيرة المحمية","غداء على الشاطئ مشمول","وقت حر للسباحة والغطس والاسترخاء"]'::jsonb, '["رحلة بحرية ليوم كامل إلى جزيرة المحمية","نقل من وإلى الفندق","غداء على الجزيرة","مياه ومشروبات خفيفة وفواكه","مرشد غطس ذي خبرة","معدات غطس"]'::jsonb, '["نفقات شخصية","بقشيش (اختياري)","رسوم نقل إضافية لمناطق محددة"]'::jsonb, 'الغردقة - البحر الأحمر - مصر', '4 ساعات', NULL, NULL, NULL, NULL, '[{"q":"ما هي مدة الغطس؟","a":"حوالي 45 دقيقة في كل محطة غطس."},{"q":"هل يمكنني رؤية الدلافين؟","a":"نعم، جزيرة المحمية مكان رئيسي للدلافين. احتمال كبير رؤيتهم."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 13: tours a8ddb433 | رحلة دندرة لنصف يوم من الغردقة – الزيارة الحقيقية 
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', 'a8ddb433-a4fb-41ca-b90d-b399b4a57923', 'ar', 'رحلة دندرة لنصف يوم من الغردقة – الزيارة الحقيقية لمعبد حتحور', '<table class="tour-pricing-table"><thead><tr><th>المشاركون</th><th>المركبة</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخصان</td><td>ليموزين خاصة</td><td>120 € للشخص الواحد</td></tr><tr><td>3 – 4 أشخاص</td><td>حافلة صغيرة خاصة</td><td>110 € للشخص الواحد</td></tr><tr><td>5 – 6 أشخاص</td><td>حافلة صغيرة خاصة</td><td>100 € للشخص الواحد</td></tr><tr><td>7 – 8 أشخاص</td><td>حافلة صغيرة خاصة</td><td>90 € للشخص الواحد</td></tr></tbody></table>
اكتشف معبد دندرة الرائع، أحد أفضل الأضرحة المحفوظة في مصر. يُبهر معبد الإلهة حتحور بنقوشه الغنية بالألوان، وهندسته المعمارية الاستثنائية، وتصويره الفلكي الفريد. تأخذك هذه الرحلة النصف يوم بعيداً عن السياحة الجماعية إلى أحد أبرز المعالم الثقافية في صعيد مصر — برفقة حصرية لعالم مصريات ناطق بالألمانية. وعلى عكس الجولات الجماعية المزدحمة، ستستمتع بتجربة دندرة في أجواء مريحة مع وقت كافٍ للتصوير والاستفسارات الشخصية.

لماذا معبد دندرة وجهة لا غنى عنها؟

يقع مجمع المعابد على بُعد نحو 60 كيلومتراً شمال مدينة الأقصر، ويعود إلى الحقبة البطلمية الرومانية. بفضل حفاظه الممتاز، يُعدّ من أبرز الشواهد على الفن والعلوم المصرية القديمة.', 'اكتشف معبد دندرة المثير للإعجاب، أحد أفضل المزارات المحفوظة في مصر، في جولة حصرية لمدة نصف يوم من الغردقة مع عالم مصريات ناطق بالألمانية.', 'الثقافة والسياحة', '["قاعات أعمدة ضخمة تتألق بألوانها الأصلية منذ 2000 عام","السقف الفلكي الشهير الذي يمثل سماء مصر القديمة","ماميسي (بيت ولادة الآلهة)","الأقبية ذات النقوش الغامضة","التمثال الوحيد المحفوظ بالكامل للملكة كليوباترا VII وقيصريون","البركة المقدسة – موقع التنظيف الشعائري","المستشفى الفريد الذي كانت تجري فيه الشفاءات بالطقوس المقدسة"]'::jsonb, '["نقل خاص بسيارة مكيفة","مرشد سياحي أو عالم مصريات ناطق بالألمانية","رسوم الدخول حسب البرنامج","مشروبات في المركبة","تأمين مشمول"]'::jsonb, '["نفقات شخصية","رسوم نقل إضافية لضيوف مرسى علم: 50 يورو للفرد","رسوم نقل إضافية لضيوف القصير: 35 يورو للفرد","رسوم نقل إضافية من خليج مكادي وسهل حشيش: 5 يورو للفرد","رسوم نقل إضافية من الجونة وسفاجا وخليج سوما: 10 يورو للفرد","مرشد سياحي بلغة أجنبية (إنجليزية أو روسية أو فرنسية): إضافة 10 يورو للفرد"]'::jsonb, 'الغردقة - البحر الأحمر - مصر', '7 ساعات', NULL, NULL, NULL, NULL, '[{"q":"ما المميز في معبد حتحور؟","a":"السقف الفلكي والنقوش المحفوظة جيداً."},{"q":"كم تستغرق الرحلة؟","a":"حوالي 7 ساعات بما في ذلك النقل."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 14: tours 0009b90b | القارب ذو القاع الزجاجي بالغردقة مع الغطس (30 دقيق
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '0009b90b-71a9-4e78-8459-e56bacce7cbf', 'ar', 'القارب ذو القاع الزجاجي بالغردقة مع الغطس (30 دقيقة) والنقل من الفندق', '<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>موعد الانطلاق</th><th>الاستقبال</th></tr></thead><tbody><tr><td>من 20 € للشخص الواحد</td><td>جولة جماعية</td><td>يومياً</td><td>نحو الساعة 12:00 ظهراً</td></tr></tbody></table>
مع القارب ذي القاع الزجاجي في الغردقة، ستكتشف عالم البحر الأحمر الساحر تحت الماء دون أن تبتلّ. من خلال النوافذ البانورامية الكبيرة في القارب، ستراقب الشعاب المرجانية الملوّنة، وسمك المهرج، وسمك الجراح، وكثيراً من الكائنات البحرية الأخرى، وأنت مرتاح في مقعدك.

بعد الرحلة بالقارب، نرسو في موقع هادئ للغطس، حيث يُتاح لك فرصة استكشاف العالم تحت الماء بنفسك مع الغطس المُرشَد. وقت الغطس نحو 30 دقيقة، وهو مناسب أيضاً للمبتدئين تماماً.

سترة النجاة وأداة الغطس والقناع مشمولة في السعر. يضمن لك دعمنا الناطق بالألمانية الشعور بالأمان والراحة في جميع الأوقات.

🌊 لماذا تحظى هذه الرحلة بشعبية واسعة؟

يجمع القارب ذو القاع الزجاجي تجربتين في جولة واحدة: مشاهدة مريحة للعالم تحت الماء من القارب، والغطس النشط في البحر الأحمر.

تحظى الجولة بإقبال خاص من العائلات ذات الأطفال، وغير السباحين، والضيوف الراغبين في استكشاف الشعاب المرجانية في الغردقة بطريقة آمنة ومريحة.', 'تعد رحلة القارب ذو القاع الزجاجي في الغردقة مع الغطس واحدة من أكثر رحلات الغردقة حجزًا. اكتشف الشعاب المرجانية وأسماك الاستوائية من خلال القاع الزجاجي ثم استمتع بـ 30 دقيقة غطس في البحر الأحمر – مشمول النقل والمعدات والمرافقة بالألمانية.', 'الغطس والغوص', '["قارب ذو قاع زجاجي مع منظر بانورامي على الشعاب المرجانية","30 دقيقة غطس في البحر الأحمر","رحلة عائلية شهيرة في البحر الأحمر","مناسبة للعائلات والمبتدئين","معدات غطس مشمولة","نقل من الفندق مشمول"]'::jsonb, '["التوصيل من وإلى الفندق","رحلة بالقارب ذو القاع الزجاجي","موقف غطس لمدة 30 دقيقة","معدات غطو وسترة نجاة","مياه معدنية ومشروبات خفيفة"]'::jsonb, '["نفقات شخصية","بقشيش (اختياري)","رسوم نقل إضافية لمناطق محددة"]'::jsonb, 'الغردقة–البحر الأحمر–مصر', '3 ساعات', NULL, NULL, NULL, NULL, '[{"q":"هل هذه الرحلة مناسبة للأطفال؟","a":"نعم، مثالية للعائلات مع الأطفال. الأطفال يحبون النظر من خلال القاع الزجاجي."},{"q":"هل يجب أن أعرف السباحة؟","a":"لا، يمكنك البقاء في القارب والنظر من النوافذ. الس노ركلينج اختياري."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 15: tours b604535f | رحلة الغطس إلى جزيرة عدن بالغردقة مع الغداء
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', 'b604535f-6c99-4766-9150-c29fbbf5678c', 'ar', 'رحلة الغطس إلى جزيرة عدن بالغردقة مع الغداء', '<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>موعد الانطلاق</th><th>الاستقبال</th></tr></thead><tbody><tr><td>من 75 € للشخص الواحد</td><td>جولة جماعية</td><td>يومياً</td><td>نحو الساعة 8:00 صباحاً</td></tr></tbody></table>
اكتشف جزيرة عدن الساحرة في رحلة غطس لا تُنسى من الغردقة. استمتع بالمياه الصافية، والشعاب المرجانية الملوّنة، وقضاء يوم من الاسترخاء على الشاطئ الرملي الجميل للجزيرة.

بعد الاستقبال من الفندق، تتوجّه إلى الميناء وتنطلق بالقارب نحو جزيرة عدن. في الطريق ستزور مواقع الغطس الشهيرة في البحر الأحمر، حيث يمكنك استكشاف العالم الرائع تحت الماء مع الأسماك الملوّنة والتكوينات المرجانية المبهرة.

بمجرد وصولك إلى جزيرة عدن، تنعم بوقت حر للسباحة والتشمس والاسترخاء. المياه الفيروزية والأجواء الخلابة تجعل الجزيرة من أكثر وجهات الغردقة شعبية.

يشمل السعر الغداء خلال الرحلة. الرحلة مثالية للأزواج والعائلات والأصدقاء وكل من يتطلع إلى يوم استرخاء على البحر الأحمر.

لماذا تحظى هذه الرحلة بشعبية كبيرة:
✓ الغطس على الشعاب المرجانية الملوّنة
✓ إقامة على جزيرة عدن الساحرة
✓ مياه صافية كالكريستال وشاطئ رملي ناعم
✓ النقل من الفندق مشمول
✓ الغداء خلال الرحلة مشمول
✓ مناسبة للمبتدئين والسباحين ذوي الخبرة', 'استمتع برحلة غطس لا تُنسى إلى جزيرة عدن من الغردقة مع خدمة النقل من الفندق وركوب القارب والغداء ووقت للسباحة والاسترخاء في البحر الأحمر.', 'الغطس والغوص', '["نقل من الفندق إلى الغردقة مشمول","رحلة بحرية في البحر الأحمر","غطس على شعاب مرجانية ملونة","الإقامة على جزيرة عدن","غداء مشمول","وقت حر للسباحة والاسترخاء","مرشد غطس محترف"]'::jsonb, '["التوصيل من وإلى الفندق","نقل بسيارة مكيفة","مرشد غطس محترف","معدات غطس","رسوم الدخول إلى جزيرة عدن","ركوب القارب وسترات النجاة","معدات الغطس","غداء + قهوة أو شاي أو صودا"]'::jsonb, '["نفقات شخصية","بقشيش","رسوم نقل إضافية لمناطق محددة"]'::jsonb, 'الغردقة - البحر الأحمر - مصر', '8 ساعات', NULL, NULL, NULL, NULL, '[{"q":"هل الجزيرة خاصة؟","a":"نعم، جزيرة إيدن جنة خاصة للغطس."},{"q":"هل يوجد غداء؟","a":"نعم، الغداء على الجزيرة مشمول."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 16: tours f265b20c | رحلة الغطس إلى جزيرة الحولة مع الانتقالات من الغرد
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', 'f265b20c-db45-4173-a352-b1921fd7f744', 'ar', 'رحلة الغطس إلى جزيرة الحولة مع الانتقالات من الغردقة', '<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>موعد الانطلاق</th><th>الاستقبال</th></tr></thead><tbody><tr><td>من 35 € للشخص الواحد</td><td>جولة جماعية</td><td>يومياً</td><td>نحو الساعة 8:00 صباحاً</td></tr></tbody></table>
انغمس في تجربة لا تُنسى: يُبحر القارب بهدوء فوق البحر الأحمر، وتنعكس الشمس على الأمواج، وأمامك تتفتّح الجنة — جزيرة هولا هولا. شواطئ رملية بيضاء، ومياه صافية كالكريستال، وشعاب مرجانية ملوّنة، وأسماك نادرة تنتظر أن تُكتشف.

يجمع هذا الرحلة اليومية من الغردقة بين المغامرة والاسترخاء وتجربة الطبيعة — مثالية للعائلات والأزواج وكل من يرغب في تذوّق جمال البحر الأحمر عن قُرب.

✨ لماذا عليك حجز هذه الرحلة

تُعدّ جزيرة هولا هولا من أجمل الوجهات لرحلات الغطس في البحر الأحمر بالقرب من الغردقة. هنا تلتقي الطبيعة والمغامرة والاسترخاء بطريقة فريدة:

اكتشف العالم الملوّن تحت الماء مع الأسماك النادرة والشعاب المرجانية
استرخِ على الشواطئ الساحرة للجزيرة
استمتع بلحظات لا تُنسى أثناء السباحة أو الغطس
تمتّع بالشمس المصرية والمياه الصافية والمناظر الطبيعية الخلابة

جزيرة هولا هولا مثالية للضيوف الراغبين في رحلة غطس مريحة من الغردقة مع إقامة على الجزيرة، ومياه نقية، ونقل بالقارب في راحة تامة.', 'رحلة غطس إلى جزيرة الحولة من الغردقة – شاطئ رملي أبيض وشعاب مرجانية ملونة وتجربة جزيرة لا تُنسى.', NULL, '["رحلة بحرية إلى جزيرة الحولة من الغردقة","غطس في البحر الأحمر على شعاب مرجانية","إقامة 90 دقيقة على جزيرة الحولة","غداء ومشروبات خفيفة على متن القارب مشمولة","مناسبة للعائلات والأزواج ومحبي الغطس","نقل من الفندق إلى الغردقة مشمول"]'::jsonb, '["معدات غطس","موقفا غطس","غداء ومشروبات خفيفة على متن القارب","كراسي استلقاء ومظلات شمسية على جزيرة الحولة","جميع النقل بسيارات مكيفة","رحلة بحرية إلى جزيرة الحولة"]'::jsonb, '["نفقات شخصية","بقشيش (اختياري)","رسوم نقل إضافية لمناطق محددة"]'::jsonb, 'الغردقة - البحر الأحمر - مصر', '4 ساعات', NULL, NULL, NULL, NULL, '[{"q":"هل يمكن رؤية الدلافين؟","a":"نعم، احتمال كبير لرؤية الدلافين والسلاحف."},{"q":"هل يناسب الأطفال؟","a":"نعم، أطفال من 6 سنوات مع إشراف الوالدين."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 17: tours 27ae0b35 | رحلة الدلافين الخاصة في الغردقة بالقارب السريع
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '27ae0b35-e0ef-4b01-9aa7-23d3210d74ff', 'ar', 'رحلة الدلافين الخاصة في الغردقة بالقارب السريع', '<table class="tour-pricing-table"><thead><tr><th>المشاركون</th><th>القارب</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخص واحد</td><td>قارب سريع خاص</td><td>150 € للشخص الواحد</td></tr><tr><td>شخصان</td><td>قارب سريع خاص</td><td>80 € للشخص الواحد</td></tr><tr><td>3 أشخاص</td><td>قارب سريع خاص</td><td>70 € للشخص الواحد</td></tr><tr><td>4 أشخاص</td><td>قارب سريع خاص</td><td>60 € للشخص الواحد</td></tr><tr><td>5 أشخاص</td><td>قارب سريع خاص</td><td>55 € للشخص الواحد</td></tr><tr><td>6 أشخاص</td><td>قارب سريع خاص</td><td>50 € للشخص الواحد</td></tr></tbody></table>
استمتع بواحدة من أكثر اللحظات إبهاراً في إجازتك: اسبح مع الدلافين البرية الحرة، واكتشف الشعاب المرجانية الملوّنة، واسترخِ على جزيرة فردوسية — كل ذلك في صباح واحد.

هذه الجولة الخاصة عالية الجودة مُصمَّمة للمسافرين الذين يريدون الأفضل:
✔ لا قوارب جماعية
✔ لا ضيوف غرباء
✔ لا صخب ولا فوضى
✔ خصوصية 100% ورعاية شخصية كاملة

مع مخطّط رحلات الغردقة، لن تحجز مجرد رحلة — بل تجربة يصفها كثير من الضيوف بأنها أبرز ما في إجازتهم في مصر بأكملها.

🐬 السباحة مع الدلافين في الغردقة — بشكل طبيعي ومحترم ولا يُنسى

تخيّل: القارب السريع يُبحر فوق المياه الفيروزية. تقفز إلى البحر الدافئ. وفجأة تظهر الدلافين بجوارك — فضولية، رشيقة، حرة.

يتجه مسارنا تحديداً إلى أشهر مناطق الدلافين قبالة الغردقة. تعيش الحيوانات هنا في البرية وكثيراً ما تسعى بنفسها إلى الاقتراب من القوارب.

بالنسبة لكثير من الضيوف، هذه اللحظة أعمق تأثيراً من أي معلم على البر.

لكن هذه الرحلة تقدّم أكثر من ذلك بكثير:
حطام سفينة رائع يعجّ بالحياة البحرية
أجواء مريحة بلا ضغط للوقت
كل شيء منظّم بشكل مثالي — في 4 ساعات فقط.

⭐ لماذا هذه الجولة من أكثر الرحلات الخاصة حجزاً في الغردقة
تنفيذ خاص 100%
8 أشخاص كحد أقصى على متن القارب
معدل مشاهدة دلافين مرتفع جداً
قوارب سريعة حديثة وآمنة
قباطنة ذوو خبرة وترخيص رسمي
مثالية للأزواج والعائلات والمجموعات الصغيرة
قيمة ممتازة مقابل المال

🎒 يُرجى إحضار
ملابس سباحة ومنشفة
واقي الشمس ونظارات شمسية
قبعة
في الشتاء: سترة خفيفة', 'جولة الدلافين الخاصة في الغردقة – شخصية ومريحة ولا تُنسى.', 'الغطس والغوص', '["رحلة خاصة بالقارب السريع من الغردقة","مراقبة الدلافين في بيئة طبيعية","شعاب مرجانية مذهلة","غطس على حطام سفينة غارقة","مشروبات خفيفة وفواكه طازجة على متن القارب","نقل من الفندق مشمول"]'::jsonb, '["قارب سبيد بوت خاص مع قبطان ذي خبرة","نقل من وإلى الفندق","معدات غطس","مراقبة الدلافين في بيئة طبيعية","موقفا غطس","مشروبات خفيفة ومياه وفواكه طازجة"]'::jsonb, '["نفقات شخصية","الوجبات","رسوم نقل إضافية لمناطق محددة"]'::jsonb, 'الغردقة - البحر الأحمر - مصر', '4 ساعات', NULL, NULL, NULL, NULL, '[{"q":"ما مدة رحلة الدلافين؟","a":"الرحلة تستغرق حوالي 4 ساعات بما في ذلك النقل."},{"q":"هل يمكنني السباحة مع الدلافين؟","a":"نعم، إذا اقتربت الدلافين من القارب يمكنك السباحة معها."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 18: tours c7b7cfad | جولة خاصة في الأهرامات من الغردقة – سقارة ودهشور و
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', 'c7b7cfad-0101-4997-ac52-e4456a21c252', 'ar', 'جولة خاصة في الأهرامات من الغردقة – سقارة ودهشور والجيزة', '<table class="tour-pricing-table"><thead><tr><th>المشاركون</th><th>المركبة</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخصان</td><td>ليموزين خاصة</td><td>160 € للشخص الواحد</td></tr><tr><td>3 – 4 أشخاص</td><td>حافلة صغيرة خاصة</td><td>140 € للشخص الواحد</td></tr><tr><td>5 – 6 أشخاص</td><td>حافلة صغيرة خاصة</td><td>110 € للشخص الواحد</td></tr><tr><td>7 – 8 أشخاص</td><td>حافلة صغيرة خاصة</td><td>100 € للشخص الواحد</td></tr></tbody></table>
اكتشف أبرز أهرامات مصر في رحلة نهارية خاصة ومنظّمة بشكل مثالي من الغردقة. تأخذك هذه الرحلة الحصرية إلى سقارة ودهشور والجيزة. تسافر بلا ضغط للوقت، وبلا توقفات للبيع، وبأقصى قدر من الراحة. يرافقك عالم مصريات ذو خبرة وناطق بالألمانية يُقدّم لك التاريخ بدقة ووضوح وحيوية.

مثالية للضيوف المميزين الراغبين في تجربة القاهرة بأسلوب فردي.', 'استمتع بتجربة أهم الأهرامات في مصر في جولة خاصة مخططة بشكل فردي من الغردقة. تأخذك هذه الرحلة المتميزة إلى سقارة ودهشور والجيزة وتوفر لك خدمة رعاية ممتازة من عالم مصريات معتمد. بدون توقفات للبيع. بدون انتظار.', 'الثقافة والسياحة', '["سقارة – مهد بناء الأهرامات","هرم ديوسر الدرج","مقدمة تاريخية عن مراحل البناء الأولى في المقبرة الملكية","دهشور – تطور شكل الأهرامات","الهرم المائل","الهرم الأحمر مع دخول إلى الداخل","الجيزة – عجائب الدنيا السبع القديمة","أهرامات خوفو وخفرع ومنقرع","أبو الهول ومعبد الوادي","شروحات متخصصة عن طريقة البناء والدين والرمزية"]'::jsonb, '["جميع النقل بسيارات مكيفة حديثة","جميع رسوم الدخول","مرشد سياحي ناطق بالألمانية وعالم مصريات","غداء","مشروبات في الحافلة","تأمين"]'::jsonb, '["نفقات شخصية","مشروبات في المطعم","رسوم نقل إضافية لضيوف مرسى علم: 50 يورو للفرد","رسوم نقل إضافية لضيوف القصير: 35 يورو للفرد","رسوم نقل إضافية من خليج مكادي وسهل حشيش: 5 يورو للفرد","رسوم نقل إضافية من الجونة وسفاجا وخليج سوما: 10 يورو للفرد","مرشد سياحي بلغة أجنبية (إنجليزية أو روسية أو فرنسية): إضافة 10 يورو للفرد"]'::jsonb, 'الغردقة - البحر الأحمر - مصر', '18 ساعة', NULL, NULL, NULL, NULL, '[{"q":"هل نزور هرم زوسر؟","a":"نعم، الهرم المدرج لزوسر في سقارة."},{"q":"ما هو الهرم المكسور؟","a":"هرم سنفرو في دهشور بشكله الفريد مع تغير زاوية الميل."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 19: tours b2dc19de | رحلة خاصة بالقارب السريع في الغردقة – الغطس على ال
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', 'b2dc19de-fc9f-4a96-a742-7646e16a8486', 'ar', 'رحلة خاصة بالقارب السريع في الغردقة – الغطس على الشعاب المرجانية وغروب الشمس', '<table class="tour-pricing-table"><thead><tr><th>المشاركون</th><th>القارب</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخص واحد</td><td>قارب سريع خاص</td><td>150 € للشخص الواحد</td></tr><tr><td>شخصان</td><td>قارب سريع خاص</td><td>80 € للشخص الواحد</td></tr><tr><td>3 أشخاص</td><td>قارب سريع خاص</td><td>70 € للشخص الواحد</td></tr><tr><td>4 أشخاص</td><td>قارب سريع خاص</td><td>60 € للشخص الواحد</td></tr><tr><td>5 أشخاص</td><td>قارب سريع خاص</td><td>55 € للشخص الواحد</td></tr><tr><td>6 أشخاص</td><td>قارب سريع خاص</td><td>50 € للشخص الواحد</td></tr></tbody></table>
جولة خاصة بالقارب السريع في البحر الأحمر

تتيح لك هذه الرحلة الخاصة بالقارب السريع من الغردقة فرصة استكشاف البحر الأحمر بأسلوبك الفريد وبعيداً عن السياحة الجماعية. الجولة مثالية للعائلات والأزواج والمجموعات الصغيرة التي تُقدّر الخصوصية والمرونة والاهتمام الشخصي.

في فترة ما بعد الظهر، يستقبلك سائق مباشرةً من فندقك في الغردقة وينقلك إلى الميناء. ينتظرك قاربك السريع الخاص، الذي سيأخذك إلى مواقع غطس مختارة ومناطق ساحلية هادئة.', 'الغطس على الشعاب المرجانية وغروب الشمس على البحر الأحمر.', 'الغطس والغوص', '["رحلة خاصة بالقارب السريع من الغردقة","غطس على شعاب مرجانية مختارة","الإقامة على جزيرة هادئة","غروب الشمس على البحر","مشروبات وفواكه طازجة على متن القارب"]'::jsonb, '["التوصيل من وإلى الفندق بسيارة مكيفة","قارب سبيد بوت خاص","معدات غطس (قناع، أنبوب تنفس، زعانف، سترة نجاة)","مشروبات وفواكه","الضرائب والتأمين"]'::jsonb, '["نفقات شخصية","رسوم نقل إضافية لمناطق محددة"]'::jsonb, 'الغردقة - البحر الأحمر - مصر', '4 ساعات', NULL, NULL, NULL, NULL, '[{"q":"هل يمكنني اختيار الشعاب للغطس؟","a":"نعم، القبطان يختار أفضل الشعاب في يوم الرحلة."},{"q":"هل المعدات مشمولة؟","a":"نعم، قناع، أنبوب، سترة وزعانف مشمولة."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 20: tours 6b629662 | حديقة مكادي المائية بالغردقة مع الغداء والنقل
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '6b629662-908c-40e3-b396-565393a6be18', 'ar', 'حديقة مكادي المائية بالغردقة مع الغداء والنقل', '<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>موعد الانطلاق</th><th>الاستقبال</th></tr></thead><tbody><tr><td>من 50 € للشخص الواحد</td><td>تذكرة دخول</td><td>يومياً</td><td>نحو الساعة 9:00 صباحاً</td></tr></tbody></table>
استمتع بيوم إجازة مثالي في حديقة مكادي المائية (مكادي ووتر وورلد) — واحدة من أكبر الحدائق المائية وأحدثها على ساحل البحر الأحمر.

تجمع هذه الرحلة المتميزة بين الإثارة والاسترخاء والراحة، وهي مثالية للعائلات والأزواج وكل من يحب المتعة المائية.

بفضل الاستقبال من الفندق، والنقل بسيارات مكيفة، والغداء، والمشروبات، والدخول بالأولوية مع وصول منظّم — ستنعم بيوم خالٍ من التوتر مليء بلحظات لا تُنسى.

🍽️ الغداء والمشروبات مشمولة

خلال إقامتك ستستمتع ببوفيه غداء غني يضم أطباقاً عالمية متنوعة.
المشروبات الغازية والقهوة والشاي مشمولة في السعر.
تتوفر في الحديقة مطاعم متعددة ومقاهي وجبات خفيفة ومناطق جلوس مظللة.', 'رحلة إلى الحديقة المائية في حديقة مكادي المائية مع النقل والغداء.', 'الثقافة والسياحة', '["أكثر من 50 م-slide مائية لكل الأعمار","38 منتزهًا مائيًا مذهلاً – من السريع إلى الهادئ","14 مسبحًا للأطفال والبالغين","الحفرة السوداء والمنزلقات السريعة وأفعوانية مائية","نهر الكسل ومناطق الاسترخاء","مناطق واسعة للأطفال للاستمتاع العائلي الآمن"]'::jsonb, '["رسوم الدخول إلى حديقة مكادي المائية","دخول مبكر مع تنظيم منظم","التوصيل من وإلى الفندق","نقل مكيف","غداء (بوفيه)","مشروبات خفيفة وقهوة وشاي"]'::jsonb, '["بقشيش","نفقات شخصية وخدمة التصوير","رسوم نقل إضافية لمناطق محددة"]'::jsonb, 'الغردقة–البحر الأحمر–مصر', '8 ساعات', NULL, NULL, NULL, NULL, '[{"q":"هل يناسب الأطفال الصغار؟","a":"نعم، توجد مناطق أطفال ومسابح ضحلة."},{"q":"هل الغداء مشمول؟","a":"نعم، الغداء في الأكوابارك مشمول."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 21: tours 94351900 | رحلة نهارية خاصة من الغردقة إلى القاهرة – الأهراما
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '94351900-ac6d-4c76-92e1-f9e1b1744f2f', 'ar', 'رحلة نهارية خاصة من الغردقة إلى القاهرة – الأهرامات والمتحف المصري الكبير', 'يبدأ يوم استثنائي

قبل شروق الشمس تنطلق مغامرتك الشخصية. سيستقبلك سائقك الخاص مباشرةً من فندقك في الغردقة.

ستسافر في سيارة مريحة ومكيفة عبر صمت الصحراء نحو القاهرة — بكل راحة وأمان وبأسلوب فردي.

مشروبات مجانية تُرطّبك طوال الرحلة بينما تتهيّأ لاستقبال العاصمة المصرية الرائعة.', 'الرفاهية والثقافة والتاريخ – رحلتك النهارية الخاصة إلى أهرامات الجيزة والمتحف المصري الكبير.', 'الثقافة والسياحة', '["جولة خاصة – لا رحلة جماعية، لا ضغط وقت","مرشد سياحي ناطق بالألمانية ذي خبرة","زيارة المتحف المصري الكبير مع رسوم الدخول","جولة في أهرامات وأبو الهول الجيزة","غداء مشمول","مشروبات مجانية في المركبة","خدمة فردية ومرونة في جدول اليوم"]'::jsonb, '["نقل خاص بسيارة مكيفة","مرشد سياحي ناطق بالألمانية","تذكرة دخول للمتحف المصري الكبير","زيارة أهرامات الجيزة وأبو الهول","غداء في القاهرة","مشروبات مجانية أثناء الرحلة"]'::jsonb, '["نفقات شخصية","مشروبات أثناء الغداء","رسوم الدخول إلى داخل الأهرامات (اختياري)","رسوم نقل إضافية لضيوف مرسى علم: 50 يورو للفرد","رسوم نقل إضافية لضيوف القصير: 35 يورو للفرد","رسوم نقل إضافية من خليج مكادي وسهل حشيش: 5 يورو للفرد","رسوم نقل إضافية من الجونة وسفاجا وخليج سوما: 10 يورو للفرد","مرشد سياحي بلغة أجنبية (إنجليزية أو روسية أو فرنسية): إضافة 10 يورو للفرد"]'::jsonb, 'الغردقة - البحر الأحمر - مصر', '18 ساعة', NULL, NULL, NULL, NULL, '[{"q":"ما الفرق في الرحلة الفاخرة؟","a":"نقل فاخر، مرشد شخصي، غداء فاخر، مشروبات مميزة."},{"q":"هل نزور خان الخليلي؟","a":"نعم، بازار خان الخليلي التاريخي مشمول في البرنامج."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 22: tours 80dc4e17 | تذكرة دخول جراند أكواريوم الغردقة مع الانتقالات
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '80dc4e17-ea30-4511-92be-5e8add77f139', 'ar', 'تذكرة دخول جراند أكواريوم الغردقة مع الانتقالات', '<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>موعد الانطلاق</th><th>الاستقبال</th></tr></thead><tbody><tr><td>من 45 € للشخص الواحد</td><td>تذكرة دخول مع نقل</td><td>يومياً</td><td>نحو الساعة 10:00 صباحاً</td></tr></tbody></table>
اكتشف غراند أكواريوم الغردقة، أكبر أكواريوم وأحدثه في مصر على ساحل البحر الأحمر. وجهة مميزة للعائلات والأزواج وعشاق المغامرة، تقدّم رؤى ساحرة للعالم تحت الماء — من أسماك الشعاب المرجانية الملوّنة إلى أسماك القرش المهيبة.

انغمس في أكثر من 24 معرضاً متخصصاً، وتجوّل عبر النفق تحت الماء البالغ طوله 24 متراً، واكتشف أكثر من 1000 نوع من الكائنات البحرية من شتى أنحاء العالم.

لماذا عليك زيارة غراند أكواريوم الغردقة؟

يجمع الأكواريوم بين الطبيعة والمغامرة والتعليم في مكان واحد. وهو من أكثر المعالم شعبيةً في الغردقة، ومثالي للرحلات العائلية.

إمكانية الوصول والخدمات
♿ مناسب لذوي الإعاقة الحركية وعربات الأطفال
🐾 كلاب المساعدة مسموح بها عند الطلب
🚌 اتصال جيد بوسائل المواصلات العامة

نصائح لزيارة مثالية:
🎟️ احجز التذاكر عبر الإنترنت لتجنب أوقات الانتظار
📸 احضر كاميرتك — لحظات تصوير لا تُنسى مضمونة
👨‍👩‍👧 خطّط للمناطق المخصصة للعائلات
⏰ تعال مبكراً لتجربة جميع المعالم بلا ضغوط

احجز تذاكرك الآن

لا تفوّت الوجهة المميزة على البحر الأحمر — تجربة لا تُنسى للصغار والكبار!', 'اكتشف جراند أكواريوم الغردقة الذي يضم أكثر من 1000 نوع من الحيوانات، ونفق تحت الماء بطول 24 مترًا وعوالم رائعة تحت الماء – مثالية للعائلات والأطفال.', 'الثقافة والسياحة', '["نفق تحت الماء بطول 24 مترًا","أكثر من 1000 نوع من الحيوانات حول العالم"," أسماك القرش والروبيان و الأسماك الملونة للشعاب المرجانية","منطقة غابات استوائية مع حيوانات وطائرات غريبة","مناسبة للعائلات مع الأطفال","لقطات مميزة داخل الأكواريوم"]'::jsonb, '["رسوم الدخول إلى جراند أكواريوم الغردقة","نقل من وإلى الفندق في الغردقة","جميع الضرائب ورسوم الخدمة"]'::jsonb, '["نفقات شخصية","الأطعمة والمشروبات","رسوم نقل إضافية من خليج مكادي أو سهل حشيش: 5 يورو للفرد","رسوم نقل إضافية من الجونة أو سفاجا أو خليج سوما: 10 يورو للفرد"]'::jsonb, 'الغردقة–البحر الأحمر–مصر', '3 ساعات', NULL, NULL, NULL, NULL, '[{"q":"هل يوجد نفق تحت الماء؟","a":"نعم، نفق بطول 24 متر عبر الحوض الرئيسي."},{"q":"هل يناسب الأطفال؟","a":"نعم، مثالي للعائلات مع أطفال في أي عمر."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 23: tours 65f786e7 | رحلة نهارية إلى القاهرة بالطيران من الغردقة – المت
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '65f786e7-75c3-457b-a66a-e9f91f2c950e', 'ar', 'رحلة نهارية إلى القاهرة بالطيران من الغردقة – المتحف المصري الكبير والأهرامات', '<table class="tour-pricing-table"><thead><tr><th>المشاركون</th><th>الرحلة والنقل</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخصان</td><td>رحلة جوية + نقل خاص</td><td>300 € للشخص الواحد</td></tr><tr><td>3 – 4 أشخاص</td><td>رحلة جوية + نقل خاص</td><td>280 € للشخص الواحد</td></tr><tr><td>5 – 6 أشخاص</td><td>رحلة جوية + نقل خاص</td><td>270 € للشخص الواحد</td></tr><tr><td>7 – 8 أشخاص</td><td>رحلة جوية + نقل خاص</td><td>255 € للشخص الواحد</td></tr></tbody></table>
اكتشف أهرامات الجيزة وأبو الهول المهيب وكنوز المتحف المصري — كل ذلك في يوم واحد من الغردقة.

مع مخطّط رحلات الغردقة ستسافر بكل راحة وأمان وبأسلوب فردي. يرافقك عالم مصريات ناطق بالألمانية، وخدمة شخصية، وخدمة VIP حصرية.

💎 مثالية للأزواج والعائلات والمجموعات الصغيرة الراغبين في تجربة أبرز ما تقدّمه القاهرة — بلا رحلات حافلة طويلة مرهقة.', 'اكتشف أهرامات الجيزة وأبو الهول والمتحف المصري الكبير في رحلة نهارية مريحة مع رحلات جوية من الغردقة. اكتشف أجمل ما في القاهرة – بسرعة وراحة وتنظيم احترافي.', 'الثقافة والسياحة', '["أهرامات الجيزة وأبو الهول – تراث عالمي من اليونسكو وعجيبة الدنيا الوحيدة الباقية من العصور القديمة","المتحف المصري الكبير","غداء على النيل – أطباق محلية مميزة","رحلة طيران مباشرة الغردقة – القاهرة – الغردقة","مرشد مصريات ناطق بالألمانية – مرشد شخصي طوال اليوم"]'::jsonb, '["رحلة طيران ذهاب وإياب الغردقة إلى القاهرة","نقل بسيارات مكيفة","رسوم الدخول حسب البرنامج","غداء","مرشد مصريات ناطق بالألمانية","رعاية وتنظيم من الغردقة ريزبلانر"]'::jsonb, '["مشروبات في المطعم","نفقات شخصية","رسوم نقل إضافية من مرسى علم: 50 يورو للفرد","رسوم نقل إضافية من القصير: 35 يورو للفرد","رسوم نقل إضافية من خليج مكادي وسهل حشيش: 5 يورو للفرد","رسوم نقل إضافية من الجونة وسفاجا وخليج سوما: 10 يورو للفرد","مرشد سياحي بلغة أجنبية (إنجليزية أو روسية أو فرنسية): إضافة 10 يورو للفرد"]'::jsonb, 'الغردقة - البحر الأحمر - مصر', '15 ساعة', NULL, NULL, NULL, NULL, '[{"q":"كم تستغرق الرحلة من الغردقة إلى القاهرة؟","a":"حوالي 45 دقيقة طيران في الاتجاه الواحد."},{"q":"هل يمكنني دخول الهرم من الداخل؟","a":"نعم، دخول هرم خوفو من الداخل متاح برسوم إضافية (30 يورو)."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 24: tours 380712ad | كواد سفاري الغردقة – 3 ساعات في الصحراء وركوب الجم
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '380712ad-0b71-4e9a-8bfd-4e34c6906afc', 'ar', 'كواد سفاري الغردقة – 3 ساعات في الصحراء وركوب الجمال والقرية البدوية', '<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>موعد الانطلاق</th><th>الاستقبال</th></tr></thead><tbody><tr><td>من 30 € للشخص الواحد</td><td>جولة جماعية</td><td>يومياً</td><td>نحو الساعة 8:00 صباحاً</td></tr></tbody></table>
استمتع برحلة مثيرة بالدراجة الرباعية في الغردقة تأخذك عبر المناظر الطبيعية الصحراوية الرائعة لمدة 3 ساعات. تبدأ بإيجاز عن السلامة، ثم تقود دراجتك الرباعية عبر الكثبان الرملية وأودية الأنهار الجافة. بعدها تنتظرك رحلة بالجمال إلى قرية بدوية تقليدية، حيث ستتعرف على الحياة البدوية اليومية وتستمتع بمشروب تقليدي. توفر الرحلة مزيجاً مثالياً بين المغامرة والتجربة الثقافية في الصحراء المصرية.', 'رحلة مثيرة بالدراجة الرباعية لمدة 3 ساعات في الغردقة مع ركوب الجمال وزيارة قرية بدويّة ومناظر طبيعية صحراوية خلابة.', NULL, '["3 ساعات من قيادة الدراجة الرباعية عبر الصحراء","ركوب الجمال إلى قرية بدويّة","زيارة قرية بدويّة تقليدية","تجربة المناظر الطبيعية الصحراوية","معدات أمان مشمولة","نقل من الفندق متاح"]'::jsonb, '["إيجار دراجة رباعية (3 ساعات)","ركوب الجمال","زيارة القرية البدويّة","معدات الأمان","مرشد سياحي","مياه"]'::jsonb, '["نقل من الفندق (يمكن حجزه بشكل اختياري)","بقشيش","صور وفيديو","غداء"]'::jsonb, 'الغردقة - البحر الأحمر - مصر', '8 ساعات', NULL, NULL, NULL, NULL, '[{"q":"هل أحتاج رخصة قيادة؟","a":"لا، يتم إعطاء تعليمات السلامة في الموقع."},{"q":"من أي عمر يمكن المشاركة؟","a":"الأطفال من 6 سنوات كراكب مع بالغ، قيادة من 16 سنة."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 25: tours 872d19ae | رحلة سفاري رائعة بالغردقة بمركبات رباعية وجيب وركو
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '872d19ae-dd4c-4c01-9f1b-217e481b3732', 'ar', 'رحلة سفاري رائعة بالغردقة بمركبات رباعية وجيب وركوب الجمال والشواء', '<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>موعد الانطلاق</th><th>الاستقبال</th></tr></thead><tbody><tr><td>من 40 € للشخص الواحد</td><td>جولة جماعية</td><td>يومياً</td><td>نحو الساعة 13:00</td></tr></tbody></table>
اكتشف مغامرة الصحراء في الغردقة مع رحلة السفاري الشاملة هذه. استمتع بمناظر الصحراء المصرية الخلابة على دراجة رباعية، وقُد سيارة جيب عبر الكثبان الرملية، واركب الجمال، واستمتع بشواء لذيذ في القرية البدوية. تقدّم هذه الرحلة مزيجاً مثالياً بين الحركة والطبيعة والتجربة الثقافية.

بعد الاستقبال من الفندق، تتوجّه أولاً إلى محطة الدراجات الرباعية، حيث تتلقى إيجازاً عن السلامة ثم تنطلق عبر الصحراء على دراجات رباعية القيادة الذاتية. بعدها تنتقل إلى سيارات الجيب التي تأخذك إلى محطة ركوب الجمال. هناك يمكنك ركوب الجمال والاستمتاع بالمناظر الصحراوية. وفي الختام تصل إلى قرية بدوية تقليدية تنتظرك فيها وجبة شواء عطرة. استمتع بغروب الشمس فوق الكثبان الرملية وعِش تجربة الضيافة البدوية الأصيلة.', 'استمتع بمغامرة صحراوية لا تُنسى في الغردقة: دراجة رباعية، وسيارة جيب، وركوب الجمال، والتزلج على الرمال، وشواء بدوي تحت النجوم – كل شيء مشمول.', NULL, '["قيادة الدراجة الرباعية عبر الصحراء","جولة بالجيب فوق الكثبان الرملية","ركوب الجمال عبر المناظر الطبيعية الصحراوية","زيارة قرية بدويّة تقليدية","وجبة شواء لذيذة في خيمة النجوم","غروب الشمس فوق الكثبان","نقل من الفندق مشمول"]'::jsonb, '["نقل من وإلى الفندق","قيادة الدراجة الرباعية (حوالي ساعة)","جولة بالجيب","ركوب الجمال","التزلج على الرمال","وجبة شواء في القرية البدويّة","مشروبات خفيفة ومياه","معدات الأمان","مرافقة عبر الصحراء"]'::jsonb, '["بقشيش","صور وفيديو","مشروبات كحولية","وجبات خفيفة إضافية"]'::jsonb, 'الغردقة - البحر الأحمر - مصر', '8 ساعات', NULL, NULL, NULL, NULL, '[{"q":"ماذا يشمل السافاري الكامل؟","a":"كواد، جيب، جمل، قرية بدوية، شاي وغروب شمس."},{"q":"هل أحتاج رخصة للكواد؟","a":"لا، يتم إعطاء تعليمات في الموقع."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 26: tours a9e92b99 | رحلة لمدة يومين إلى القاهرة من الغردقة – الأهرامات
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', 'a9e92b99-283c-4b1e-ac9a-12bfe9c7fef0', 'ar', 'رحلة لمدة يومين إلى القاهرة من الغردقة – الأهرامات وأبو الهول والمتحف المصري', '<table class="tour-pricing-table"><thead><tr><th>المشاركون</th><th>المركبة</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخصان</td><td>ليموزين خاصة</td><td>350 € للشخص الواحد</td></tr><tr><td>3 – 4 أشخاص</td><td>حافلة صغيرة خاصة</td><td>335 € للشخص الواحد</td></tr><tr><td>5 – 6 أشخاص</td><td>حافلة صغيرة خاصة</td><td>300 € للشخص الواحد</td></tr><tr><td>7 – 8 أشخاص</td><td>حافلة صغيرة خاصة</td><td>280 € للشخص الواحد</td></tr></tbody></table>
استمتع برحلة لا تُنسى مدتها يومان من الغردقة إلى القاهرة وانغمس في التاريخ الرائع لمصر القديمة. قم بزيارة أهرامات الجيزة الشهيرة، وتمثال أبو الهول العظيم، والمتحف المصري بكنوزه التي لا تُحصى، ومدينة القاهرة القديمة النابضة بالحياة. تقدّم هذه الرحلة مزيجاً مثالياً بين التاريخ والثقافة والمغامرة.

في اليوم الأول تغادر الغردقة في الصباح الباكر وتصل إلى القاهرة بعد نحو 5 ساعات. هناك تزور أولاً أهرامات الجيزة وأبو الهول، ثم تتوجّه إلى فندقك لقضاء الليل. وفي اليوم الثاني تزور المتحف المصري، وحي خان الخليلي العتيق، ومسجد المرمر. بعد الغداء تعود إلى الغردقة.', 'رحلة ليومين من الغردقة إلى القاهرة: قم بزيارة أهرامات الجيزة وأبو الهول والمتحف المصري ومدينة القاهرة القديمة.', NULL, '["زيارة أهرامات الجيزة","أبو الهول العظيم","المتحف المصري في القاهرة","الحي القديم خان الخليلي","مسجد المرمر","يومان مع إقامة ليلية","مرشد طوال الرحلة"]'::jsonb, '["الذهاب والعودة الغردقة – القاهرة (مكيف)","إقامة ليلية في فندق 4 نجوم في القاهرة","فطور في الفندق","غداء اليوم الأول","تذكرة دخول لجميع المعالم","مرشد سياحي ذي خبرة","مياه معدنية في الحافلة"]'::jsonb, '["بقشيش","صور وفيديو","عشاء","مشروبات إضافية","نفقات شخصية"]'::jsonb, 'الغردقة - البحر الأحمر - مصر', '8 ساعات', NULL, NULL, NULL, NULL, '[{"q":"كم تستغرق الرحلة من الغردقة إلى القاهرة؟","a":"الطريق بالباص يستغرق حوالي 5 ساعات في اتجاه واحد."},{"q":"هل الفطور في الفندق مشمول؟","a":"نعم، الفطور في الفندق مشمول في التكلفة."},{"q":"هل يمكنني القيام بالرحلة كيوم واحد؟","a":"نعم، توجد رحلة يوم واحد للقاهرة لكن وقت الزيارة أقل."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 27: tours 8c5d9ce5 | ميني إيجيبت بارك الغردقة – اكتشف المعالم السياحية 
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '8c5d9ce5-9931-42a6-8f09-44adf155d616', 'ar', 'ميني إيجيبت بارك الغردقة – اكتشف المعالم السياحية في مصر بشكل مصغر', '<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>موعد الانطلاق</th><th>الاستقبال</th></tr></thead><tbody><tr><td>من 35 € للشخص الواحد</td><td>فردي</td><td>يومياً</td><td>نحو الساعة 10:00 صباحاً</td></tr></tbody></table>
✨ استمتع بتجربة مصر بأكملها في يوم واحد — مع مخطّط رحلات الغردقة

تخيّل أنك تتجوّل في مصر — من أهرامات الجيزة المهيبة إلى معبد أبو سمبل الأسطوري — كل ذلك في مكان واحد.

في ميني إيجيبت بارك بالغردقة، أصبح هذا الحلم حقيقة. هنا ينبض تاريخ مصر بالحياة في أكثر من 55 نموذجاً مصغراً بارعاً — بتفاصيل دقيقة تجعلك تشعر وكأنك تسافر عبر آلاف السنين بنفسك.

سواء كانت رحلة عائلية، أو تجربة رومانسية لشخصين، أو جولة اكتشاف ثقافي — هذه الرحلة من أبرز ما يُميّز إجازتك على البحر الأحمر ولا يُنسى.', 'اكتشف المعالم السياحية في مصر بشكل مصغر: أكثر من 55 معلمًا شهيرًا، وجولة بصحبة مرشد، وخدمة النقل بأسعار تبدأ من 35 يورو. مثالية للعائلات ومحبي الثقافة.', 'الثقافة والسياحة', '["اكتشف 55 معلمًا أيقونيًا في مصر – من الأقصر إلى الإسكندرية، جميعها مصنوعة بدقة حسب الحجم الأصلي","قصص مثيرة وخلفيات رائعة عن أشهر المعالم في مصر","راحة مشمولة – نقل من وإلى الفندق في الغردقة بسيارة مكيفة","مثالي للصور التذكارية – لحظات سحرية بين الأهرامات والمعابد المصغرة","مثالي للعائلات والأطفال – تعليم ومرح وإعجاب في آن واحد"]'::jsonb, '["رسوم الدخول إلى ميني إيجيبت بارك","جولة بصحبة مرشد عبر جميع المعارض","التوصيل من وإلى الفندق بسيارة مكيفة","سائق ومرشد محلي"]'::jsonb, '["مشروبات","نفقات شخصية","بقشيش (اختياري)","رسوم نقل إضافية من خليج مكادي وسهل حشيش: 5 يورو للفرد","رسوم نقل إضافية من الجونة وسفاجا وخليج سوما: 10 يورو للفرد","مرشد سياحي بلغة أجنبية (إنجليزية أو روسية أو فرنسية): إضافة 10 يورو للفرد"]'::jsonb, 'الغردقة–البحر الأحمر–مصر', '3 ساعات', NULL, NULL, NULL, NULL, '[{"q":"ماذا يمكن رؤيته؟","a":"نسخ مصغرة للأهرامات، المعابد، المساجد والمعالم المصرية."},{"q":"هل هو ممتع للأطفال؟","a":"نعم، تعليمي جداً وممتع للأطفال."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 28: blog_posts bc3112c6 | أفضل الرحلات في الغردقة 2025 – أهم المعالم، نصائح 
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('blog_posts', 'bc3112c6-a2e1-4475-997b-39e2a77e228e', 'ar', 'أفضل الرحلات في الغردقة 2025 – أهم المعالم، نصائح داخلية، وتجارب لا تُنسى على البحر الأحمر', 'أفضل الرحلات في الغردقة 2025 – أهم المعالم، نصائح داخلية، وتجارب لا تُنسى على البحر الأحمر', 'اكتشف أفضل الرحلات في الغردقة 2025: أهم المعالم السياحية، نصائح داخلية، وتجارب لا تُنسى على البحر الأحمر.', NULL, '["أهرامات الجيزة – آخر عجائب العالم القديم","رحلة القاهرة من الغردقة – التاريخ والثقافة","رحلة الأقصر – وادي الملوك ومعابد الفراعنة","رحلات الغطس – عالم البحر الأحمر تحت الماء","سفاري الصحراء – مغامرة البدو وغروب الشمس"]'::jsonb, '["دعم باللغة الألمانية","نقل آمن ومريح","أسعار عادلة وشفافة","تنظيم احترافي","تجارب لا تُنسى"]'::jsonb, '[]'::jsonb, NULL, NULL, 'أفضل الرحلات في الغردقة 2025 – أهم المعالم، نصائح داخلية، وتجارب لا تُنسى على البحر الأحمر', 'دليلك الشامل لأفضل الرحلات في الغردقة 2025: رحلات الأهرامات، رحلات الغطس، سفاري الصحراء، وكل ما تحتاجه لرحلة مثالية على البحر الأحمر.', '<h2>أفضل الرحلات في الغردقة 2025</h2><p>تُعد الغردقة واحدة من أشهر الوجهات السياحية في مصر والشرق الأوسط، وتقدم مزيجاً فريداً من التاريخ والطبيعة والمغامرة. إليك دليلك الشامل لأفضل الرحلات المتاحة في 2025.</p><h3>1. رحلة الأهرامات من الغردقة</h3><p>رحلة نهارية إلى أهرامات الجيزة القريبة من القاهرة، تشمل زيارة الأهرامات الثلاثة الكبرى وأبو الهول والمتحف المصري. مثالية لعشاق التاريخ والثقافة.</p><h3>2. رحلة الغطس – البحر الأحمر</h3><p>استكشف الشعاب المرجانية الملونة والأسماك الاستوائية والدلافين في عالم تحت الماء لا يُنسى. تشمل الرحلة معدات الغطس الكاملة والمرشد المحترف.</p><h3>3. سفاري الصحراء بالكواد</h3><p>مغامرة مثيرة عبر الكثبان الرملية الذهبية في صحراء الغردقة، تشمل قيادة الرباعية وزيارة قرية بدوية والشاي التقليدي وغروب الشمس الساحر.</p><h3>4. رحلة جزيرة المحمية بالغطس</h3><p>رحلة نهارية إلى جزيرة المحمية في البحر الأحمر، من أشهر وجهات الغطس في العالم. شعاب مرجانية متنوعة وسمك ملون ومياه فيروزية صافية.</p><h3>نصائح مهمة</h3><ul><li>أفضل وقت للزيارة: من أكتوبر إلى أبريل</li><li>ارتداء ملابس مريحة وحذاء مغلق</li><li>إحضار واقي شمس ونظارة شمسية وكاميرا مقاومة للماء</li></ul><p>احجز رحلتك الآن واستمتع بأفضل تجربة في الغردقة!</p>', '10 دقائق', '[{"q":"ما هي أفضل رحلة من الغردقة؟","a":"يعتمد ذلك على اهتماماتك: التاريخ (القاهرة/الأقصر)، البحر (الغطس)، أو المغامرة (سفاري الصحراء)."},{"q":"هل الرحلات مناسبة للعائلات؟","a":"نعم، معظم رحلاتنا مناسبة للعائلات مع أطفال. نقدم خيارات مخصصة للعائلات."},{"q":"كيف يمكنني الحجز؟","a":"يمكنك الحجز مباشرة عبر موقعنا الإلكتروني أو التواصل معنا عبر واتساب/البريد الإلكتروني."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 29: blog_posts 47f7dda0 | أهرامات الجيزة من الغردقة: رحلة لا تُنسى في القاهر
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('blog_posts', '47f7dda0-2b6f-475c-be26-a01bd5debd08', 'ar', 'أهرامات الجيزة من الغردقة: رحلة لا تُنسى في القاهرة عند شروق الشمس', 'أهرامات الجيزة من الغردقة: رحلة لا تُنسى في القاهرة عند شروق الشمس', 'رحلة يوم واحد من الغردقة إلى أهرامات الجيزة عند شروق الشمس – شاهد عجائب العالم القديم في ضوء ذهبي ساحر.', NULL, '["أهرامات الجيزة – آخر عجائب العالم القديم","شروق الشمس عند الأهرامات – لحظة سحرية","المتحف المصري – كنوز توت عنخ آمون","أبو الهول – حارس الأسرار القديمة"]'::jsonb, '["نقل خاص بسيارة مكيفة","مرشد سياحي ناطق بالألمانية","رسوم الدخول للأهرامات والمتحف","غداء في مطعم محلي","مشروبات أثناء الرحلة"]'::jsonb, '["مشروبات في المطعم","نفقات شخصية","إكراميات","رسوم دخول داخل الهرم (اختياري)"]'::jsonb, NULL, NULL, 'أهرامات الجيزة من الغردقة: رحلة لا تُنسى في القاهرة عند شروق الشمس', 'رحلة يوم واحد من الغردقة إلى أهرامات الجيزة عند شروق الشمس – شاهد عجائب العالم القديم في ضوء ذهبي ساحر.', '<h2>أهرامات الجيزة من الغردقة – رحلة عند شروق الشمس</h2><p>انطلق من الغردقة في الصباح الباكر لزيارة أهرامات الجيزة عند شروق الشمس. تجربة لا تُنسى تشمل آخر عجائب العالم القديم.</p><h3>برنامج الرحلة</h3><ul><li>05:00 – المغادرة من الغردقة بالحافلة المكيفة</li><li>10:00 – الوصول إلى أهرامات الجيزة وشروق الشمس</li><li>11:00 – زيارة هرم خوفو وأبو الهول</li><li>13:00 – غداء في مطعم محلي</li><li>15:00 – زيارة المتحف المصري (توت عنخ آمون)</li><li>18:00 – العودة إلى الغردقة</li></ul><h3>ما المشمول</h3><ul><li>نقل خاص بسيارة مكيفة ذهاباً وإياباً</li><li>مرشد سياحي ناطق بالألمانية</li><li>رسوم الدخول لجميع المعالم</li><li>غداء في مطعم محلي</li><li>مشروبات أثناء الرحلة</li></ul><h3>معلومات عملية</h3><p>تستغرق الرحلة حوالي 14 ساعة. يُنصح بإحضار وجبة خفيفة ومياه إضافية.</p>', '5 دقائق', '[{"q":"كم تستغرق الرحلة من الغردقة إلى القاهرة؟","a":"تستغرق الرحلة حوالي 5 ساعات ذهاباً بالحافلة، وأقل بالطائرة."},{"q":"هل يمكن دخول هرم خوفو من الداخل؟","a":"نعم، يمكن دخول هرم خوفو برسوم إضافية (30 يورو للشخص)."},{"q":"هل الرحلة مناسبة للأطفال؟","a":"نعم، الرحلة مناسبة للعائلات مع أطفال، لكن الرحلة طويلة (يوم كامل)."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 30: blog_posts 8967bf58 | رحلة الأقصر من الغردقة: اكتشف أسرار الفراعنة في وا
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('blog_posts', '8967bf58-d218-4388-a386-2c56fc36f861', 'ar', 'رحلة الأقصر من الغردقة: اكتشف أسرار الفراعنة في وادي الملوك', 'رحلة الأقصر من الغردقة: اكتشف أسرار الفراعنة في وادي الملوك', 'رحلة يوم واحد من الغردقة إلى الأقصر – اكتشف وادي الملوك، معبد الكرنك، ومعبد حتشبسوت مع مرشد خبير.', NULL, '["وادي الملوك – مقابر الفراعنة المخفية","معبد الكرنك – تحفة العمارة القديمة","معبد الملكة حتشبسوت – جوهرة العمارة المصرية","تمثالا ممنون – حراس المعبد الأبديان"]'::jsonb, '["نقل خاص بسيارة مكيفة","مرشد سياحي ناطق بالألمانية (عالم مصريات)","رسوم الدخول لجميع المعالم","غداء في مطعم محلي","مشروبات ومياه أثناء الرحلة"]'::jsonb, '["مشروبات في المطعم","نفقات شخصية","إكراميات","رسوم نقل إضافية من مرسى علم/القصير/الخليج"]'::jsonb, NULL, NULL, 'رحلة الأقصر من الغردقة: اكتشف أسرار الفراعنة في وادي الملوك', 'رحلة يوم واحد من الغردقة إلى الأقصر – اكتشف وادي الملوك، معبد الكرنك، ومعبد حتشبسوت مع مرشد خبير.', '<h2>رحلة الأقصر من الغردقة – أسرار الفراعنة</h2><p>رحلة نهارية مثيرة من الغردقة إلى الأقصر، عاصمة مصر القديمة وموطن الفراعنة. استكشف وادي الملوك ومعبد الكرنك ومعبد حتشبسوت.</p><h3>برنامج الرحلة</h3><ul><li>06:00 – المغادرة من الغردقة بالسيارة المكيفة</li><li>11:00 – الوصول إلى الأقصر وبدء الجولة</li><li>11:30 – زيارة معبد الكرنك الضخم</li><li>13:00 – غداء في مطعم محلي</li><li>14:00 – عبور النيل إلى الضفة الغربية</li><li>15:00 – وادي الملوك – مقابر الفراعنة</li><li>16:30 – معبد الملكة حتشبسوت</li><li>18:00 – العودة إلى الغردقة</li></ul><h3>ما المشمول</h3><ul><li>نقل خاص بسيارة مكيفة</li><li>مرشد سياحي ناطق بالألمانية (عالم مصريات)</li><li>رسوم الدخول لجميع المعالم</li><li>غداء في مطعم محلي</li><li>مشروبات ومياه أثناء الرحلة</li></ul>', '5 دقائق', '[{"q":"كم تستغرق الرحلة من الغردقة إلى الأقصر؟","a":"تستغرق الرحلة حوالي 4-5 ساعات ذهاباً بالسيارة المكيفة."},{"q":"هل يمكن زيارة مقبرة توت عنخ آمون؟","a":"نعم، يمكن زيارة مقبرة توت عنخ آمون في وادي الملوك (رسوم دخول منفصلة)."},{"q":"هل الغداء مشمول؟","a":"نعم، الغداء في مطعم محلي مشمول في السعر."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 31: blog_posts a06032c3 | أفضل رحلات الغطس في الغردقة 2025: اكتشف عالم البحر
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('blog_posts', 'a06032c3-164a-4be2-a2d7-625cc2e7baa5', 'ar', 'أفضل رحلات الغطس في الغردقة 2025: اكتشف عالم البحر الأحمر الرائع تحت الماء', 'أفضل رحلات الغطس في الغردقة 2025: اكتشف عالم البحر الأحمر الرائع تحت الماء', 'اكتشف أفضل أماكن الغطس في الغردقة 2025: شعاب مرجانية ملونة، أسماك استوائية، دلافين، سلاحف، وأكثر.', NULL, '["أورانج باي – جنة الغطس في البحر الأحمر","جزيرة الفردوس – استرخاء وغطس في مياه فيروزية","جزيرة الجفتون – أشهر محمية طبيعية في البحر الأحمر","بيت الدلافين – سباحة مع الدلافين في بيئتها الطبيعية"]'::jsonb, '["معدات غطس كاملة (قناع، زعانف، بدلة)","قارب سريع أو كبير حسب الرحلة","مرشد غطس محترف","غداء ومشروبات على القارب","سترات نجاة"]'::jsonb, '["نفقات شخصية","إكراميات","صور وفيديو تحت الماء (اختياري)","نقل من مناطق محددة (رسوم إضافية)"]'::jsonb, NULL, NULL, 'أفضل رحلات الغطس في الغردقة 2025: اكتشف عالم البحر الأحمر الرائع تحت الماء', 'اكتشف أفضل أماكن الغطس في الغردقة 2025: شعاب مرجانية ملونة، أسماك استوائية، دلافين، سلاحف، وأكثر.', '<h2>أفضل رحلات الغطس في الغردقة 2025</h2><p>يُعد البحر الأحمر من أفضل وجهات الغطس في العالم، وتقدم الغردقة بواباته الرئيسية. اكتشف أفضل أماكن الغطس من الغردقة.</p><h3>أورانج باي</h3><p>من أشهر مواقع الغطس في العالم، يتميز شعاب مرجانية ملونة وأسماك استوائية متنوعة وسمك ناسي المذهل.</p><h3>جزيرة الفردوس</h3><p>جزيرة خلابة في قلب البحر الأحمر، توفر مياه فيروزية هادئة مثالية للمبتدئين والشهود على الغوص.</p><h3>جزيرة الجفتون</h3><p>أشهر محمية طبيعية في مصر، موطن للغواصات والسلاحف البحرية وشعاب مرجانية صحية.</p><h3>بيت الدلافين</h3><p>تجربة فريدة مع الدلافين في بيئتها الطبيعية. فرصة عالية لرؤية الدلافين والسباحة معها.</p><h3>معلومات عملية</h3><ul><li>الرحلات مناسبة للمبتدئين مع مرشد محترف</li><li>معدات الغطس الكاملة مشمولة</li><li>الأطفال من سن 6 سنوات فما فوق مع إشراف الوالدين</li></ul>', '7 دقائق', '[{"q":"هل أحتاج خبرة سابقة للغطس؟","a":"لا، الغطس مناسب للمبتدئين. سيقدم المرشد تعليمات كاملة ومعدات كاملة."},{"q":"هل يمكنني رؤية الدلافين؟","a":"نعم، رحلة بيت الدلافين توفر فرصة عالية لرؤية الدلافين والسباحة معها."},{"q":"هل الغطس مناسب للأطفال؟","a":"نعم، مناسب للأطفال من سن 6 سنوات فما فوق مع إشراف الوالدين."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 32: blog_posts 9e076f56 | سفاري الغردقة 2025 – مغامرة الصحراء المطلقة في مصر
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('blog_posts', '9e076f56-ac05-46a5-8355-2b1aafc9c8a1', 'ar', 'سفاري الغردقة 2025 – مغامرة الصحراء المطلقة في مصر', 'سفاري الغردقة 2025 – مغامرة الصحراء المطلقة في مصر', 'انطلق في مغامرة سفاري رباعية الدفع في صحراء الغردقة: قيادة عبر الكثبان، قرية بدوية، شاي بدوي، وغروب شمس ساحر.', NULL, '["قيادة الرباعية عبر الكثبان الرملية الذهبية","زيارة قرية بدوية تقليدية – شاي بدوي أصيل","غروب الشمس في الصحراء – ألوان ذهبية لا تُنسى","مغامرة آمنة مع مرشدين محترفين"]'::jsonb, '["استئجار دراجة رباعية (3 ساعات)","مرشد سفاري خبير","زيارة قرية بدوية","شاي بدوي تقليدي","معدات سلامة (خوذة، نظارات)","نقل من وإلى الفندق"]'::jsonb, '["نفقات شخصية","إكراميات","صور وفيديو (اختياري)","مشروبات كحولية"]'::jsonb, NULL, NULL, 'Quad-Safari Hurghada 2025 – Das ultimative Wüstenabenteuer in Ägypten', 'Quad-Safari-Abenteuer in der Wüste von Hurghada – aufregende Fahrt, Beduinendorf, ägyptischer Tee und ein zauberhafter Sonnenuntergang.', '<h2>كواد سفاري الغردقة 2025 – مغامرة الصحراء المطلقة</h2><p>انطلق في مغامرة سفاري رباعية الدفع عبر صحراء الغردقة المذهلة. تجربة مثيرة تشمل قيادة الكواد عبر الكثبان الرملية وزيارة قرية بدوية تقليدية.</p><h3>برنامج الرحلة (3 ساعات)</h3><ul><li>09:00 – استلام المعدات والتعليمات الأمنية في الغردقة</li><li>09:30 – الانطلاق في رحلة الكواد عبر الكثبان الذهبية</li><li>10:30 – زيارة قرية بدوية – شاي بدوي أصيل ومحادثة مع البدو</li><li>11:00 – الاستمتاع بغروب الشمس الصحراوي الساحر</li><li>12:00 – العودة إلى الغردقة</li></ul><h3>ما المشمول</h3><ul><li>استئجار دراجة رباعية حديثة</li><li>خوذة ومعدات أمان</li><li>مرشد سفاري خبير</li><li>شاي بدوي تقليدي</li><li>نقل من وإلى الفندق</li></ul><h3>معلومات مهمة</h3><ul><li>لا تحتاج رخصة قيادة</li><li>مناسب للمبتدئين والأطفال من سن 6 سنوات (كركاب)</li><li>ارتداء ملابس مريحة وحذاء مغلق</li></ul>', '4 دقائق', '[{"q":"هل أحتاج رخصة قيادة للدراجة الرباعية؟","a":"لا، لا حاجة لرخصة قيادة. ستحصل على تعليمات سلامة كاملة قبل الانطلاق."},{"q":"من أي عمر يمكن المشاركة؟","a":"يسمح للأطفال من سن 16 سنة بالقيادة، ومن سن 6 سنوات كراكب مع بالغ."},{"q":"ماذا يجب أن أرتدي؟","a":"ملابس مريحة، حذاء مغلق، نظارة شمسية، وواقي شمس. يُنصح بملابس طويلة للحماية من الشمس والرمال."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- =====================================================
-- RU locale data
-- =====================================================

-- Row 1: destinations 0cb58b8e | Луксор
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('destinations', '0cb58b8e-0abe-44b9-9469-3233654967b2', 'ru', 'Луксор', 'Музей древнего города Фивы под открытым небом с его храмами и гробницами, внесенными в список всемирного наследия ЮНЕСКО.', NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 2: destinations 5233806c | Каир
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('destinations', '5233806c-dc22-4dc1-8aa8-5d90e819ef2c', 'ru', 'Каир', 'Столица Египта, дом для пирамид Гизы, Великого Сфинкса и Египетского музея с сокровищами Тутанхамона.', NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 3: destinations a74479e6 | Макади Бэй
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('destinations', 'a74479e6-f15f-4053-85f5-d910217cd4e5', 'ru', 'Макади Бэй', 'Роскошный курортный район с чистыми пляжами, коралловыми рифами и полями для гольфа класса люкс.', NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 4: destinations a2b18fe9 | Хургада
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('destinations', 'a2b18fe9-0bd0-42a1-90d2-32151f220c3c', 'ru', 'Хургада', 'Жизнерадостный курорт на Красном море с шикарными пляжами, мировыми местами для дайвинга и пустынными приключениями.', NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 5: destinations e8f6cfb1 | Эль-Кусейр
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('destinations', 'e8f6cfb1-c9ce-4adb-b3c2-4c381cd808a8', 'ru', 'Эль-Кусейр', 'Исторический портовый город с крепостью XVI века, отличными местами для дайвинга и аутентичной атмосферой.', NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 6: destinations c39caf1a | Сафага
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('destinations', 'c39caf1a-a278-4aaa-9735-a255c7a77a6d', 'ru', 'Сафага', 'Тихий курорт известен своими термальными источниками, ветросерфингом и доступом к древним руинам.', NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 7: destinations fa58e909 | Марса Алам
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('destinations', 'fa58e909-0571-455a-99fb-abb4033443fd', 'ru', 'Марса Алам', 'Неиспорченный рай для дайверов с домами дельфинов, дугонгами и pristine коралловыми садами.', NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 8: destinations 08309a02 | Эль Гуна
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('destinations', '08309a02-95d1-46e7-86c4-e385b7ebebce', 'ru', 'Эль Гуна', 'Венеция Красного моря с лагунами, мостами и экологичной архитектурой — люксовый экологический курорт.', NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 9: destinations b8125c80 | Сахл Хашиш
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('destinations', 'b8125c80-2ed7-4749-ab30-b77a6b186a2b', 'ru', 'Сахл Хашиш', 'Премиальный курорт с заливом Сахл Хашиш, подводным парком и 12-километровым песчаным пляжем.', NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 10: destinations 97593e2f | Сома Бэй
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('destinations', '97593e2f-2e87-4f78-855a-c1f8f52cd83c', 'ru', 'Сома Бэй', 'Эксклюзивный полуостров с полем для гольфа стандарта чемпионатов, дайвингом у рифа Панара и роскошными отелями.', NULL, NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 11: tours 0009b90b | Лодка со стеклянным дном в Хургаде с сноркелингом 
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '0009b90b-71a9-4e78-8459-e56bacce7cbf', 'ru', 'Лодка со стеклянным дном в Хургаде с сноркелингом (30 мин.) и трансфером из отеля', '<table class="tour-pricing-table"><thead><tr><th>Цена</th><th>Тип тура</th><th>Отправление</th><th>Сбор</th></tr></thead><tbody><tr><td>От 20 € на человека</td><td>Групповой</td><td>Ежедневно</td><td>Около 12:00</td></tr></tbody></table>

С лодкой со стеклянным дном в Хургаде вы откроете волшебный подводный мир Красного моря, не намокая. Через большие панорамные окна вы будете наблюдать за цветными коралловыми рифами, клоун-рыбами, рыбами-хирургами и многими другими морскими существами.', 'Одна из самых популярных поездок в Хургаде: наблюдайте за коралловыми рифами и тропическими рыбами через панорамные окна, затем 30 минут сноркелинга в Красном море — трансфер и оборудование включены.', 'Семейный отдых', '["Лодка со стеклянным дном с панорамным видом на коралловые рифы","30 минут сноркелинга в Красном море","Популярное семейное приключение на Красном море","Подходит для семей и новичков","Оборудование для сноркелинга включено","Трансфер из отеля включен"]'::jsonb, '["Трансфер из и в отель","Прогулка на лодке со стеклянным дном","Станция для сноркелинга 30 минут","Маска, трубка и жилет","Вода и легкие закуски"]'::jsonb, '[]'::jsonb, 'Хургада - Красное море - Египет', '3 часа', NULL, NULL, NULL, NULL, '[{"q":"Подходит ли это для детей?","a":"Да, идеально для семей с детьми. Дети любят смотреть через стеклянное дно."},{"q":"Нужно ли уметь плавать?","a":"Нет, вы можете оставаться на лодке и смотреть через окна. Сноркелинг опционален."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 12: tours 17a82d9b | Поездка на остров Махмия в Хургаде с сноркелингом 
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '17a82d9b-2d00-4a29-8528-3c2e97a6bf26', 'ru', 'Поездка на остров Махмия в Хургаде с сноркелингом и обедом', '<h2>Остров Махмия в Хургаде</h2><p>Остров Махмия — одно из самых известных мест для морского туризма и сноркелинга в Красном море. Характеризуется кристально чистой водой, разноцветными коралловыми рифами и является домом для различных видов рыб и морских черепах.</p><h3>Активности</h3><ul><li>Сноркелинг через коралловые рифы</li><li>Плавание с дельфинами Красного моря</li><li>Программа обеда на пляже</li></ul>', 'Поездка на остров Махмия в Красном море: исследуйте лучшие места для сноркелинга с дельфинами и программой обеда.', NULL, '["Остров Махмия с дельфинами Красного моря","Сноркелинг через тропические коралловые рифы","Напитки на пляже","Вкусный обед","Эксперт-гид на борту лодки"]'::jsonb, '["Персональный трансфер на المكيفе","Гид на немецком языке","Входные билеты на все достопримечательности","Обед в местном ресторане"]'::jsonb, '["Напитки в ресторане","Личные расходы","Чаевые"]'::jsonb, 'Хургада - Красное море - Египет', '4 часа', NULL, NULL, NULL, NULL, '[{"q":"Какова глубина сноркелинга здесь?","a":"Вода относительно неглубокая — максимальная глубина 4 метра, идеально для новичков. Оборудование для сноркелинга включено."},{"q":"Могу ли я увидеть дельфинов?","a":"Да, остров Махмия — главное место дельфинов. Высокая вероятность увидеть их плавающими рядом с лодкой."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 13: tours 1c5a3c79 | Двухдневная поездка в Луксор с полетом на воздушно
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '1c5a3c79-ab29-46c7-b480-36954adcc661', 'ru', 'Двухдневная поездка в Луксор с полетом на воздушном шаре и ночевкой в отеле из Хургады', '<h2>Двухдневная поездка в Луксор из Хургады</h2><p>Уникальная поездка: полет на воздушном шаре над Нубийской пустыней и ночевка в Луксоре на одну ночь, затем возвращение в Хургаду на следующий день.</p>', 'Двухдневная поездка из Хургады в Луксор включает полет на шаре над Нубийской пустыней и роскошное проживание в Луксоре на одну ночь.', NULL, '["Полет в клетке — воздушный шар над Нубийской пустыней","Роскошная ночь в Луксоре","Проживание в 5-звездочном отеле","Поездка на пароме на западный берег","Посещение храма Хатшепсут"]'::jsonb, '["Полет на воздушном шаре 60 минут","Ночевка в Луксоре","Трансфер из и в Хургаду","Гид на немецком языке","Все поездки на транспорте"]'::jsonb, '["Алкогольные напитки","Чаевые","Личные напитки"]'::jsonb, 'Хургада - Красное море - Египет', '2 дня', NULL, NULL, NULL, NULL, '[{"q":"Безопасен ли полет на шаре?","a":"Да, шары регулярно обслуживаются. Пассажиров проходят медосмотр перед полетом. Запрещено для людей с проблемами сердца, суставов или головы."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 14: tours 27ae0b35 | Частная поездка к дельфинам в Хургаде на скоростно
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '27ae0b35-e0ef-4b01-9aa7-23d3210d74ff', 'ru', 'Частная поездка к дельфинам в Хургаде на скоростном катере', '<h2>Частная поездка к дельфинам</h2><p>Частный скоростной катер в зону обитания дельфинов. Плавание с дельфинами в их естественной среде с профессиональным гидом.</p>', 'Эксклюзивная поездка на скоростном катере для плавания с дельфинами в их естественной среде обитания.', NULL, '["Частный скоростной катер","Плавание с дельфинами","Профессиональный гид","Оборудование для сноркелинга","Напитки на борту"]'::jsonb, '["Частный скоростной катер","Гид на немецком языке","Оборудование для сноркелинга","Напитки и закуски","Трансфер из отеля"]'::jsonb, '["Личные расходы","Чаевые"]'::jsonb, 'Хургада - Красное море - Египет', '4 часа', NULL, NULL, NULL, NULL, '[{"q":"Какова продолжительность поездки к дельфинам?","a":"Поездка занимает около 4 часов включая трансфер."},{"q":"Могу ли я плыть с дельфинами?","a":"Да, если дельфины подплывают к лодке, вы можете поплыть с ними."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 15: tours 2dc6864a | Монастыри Св. Антония и Св. Павла из Хургады – ста
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '2dc6864a-30cb-4a8e-8277-a54c2ed8ca7d', 'ru', 'Монастыри Св. Антония и Св. Павла из Хургады – старейшие христианские монастыри', '<h2>Монастыри Св. Антония и Св. Павла</h2><p>Откройте старейшие христианские монастыри в Восточной пустыне с египтологом на немецком языке.</p>', 'Откройте монастыри Св. Антония и Св. Павла с немецким египтологом — духовное путешествие в Восточную пустыню.', NULL, '["Монастырь Св. Антония — старейший монастырь в мире","Монастырь Св. Павла — escondido в горах","Древние коптийские фрески","История отшельничества","Пустынный пейзаж"]'::jsonb, '["Трансфер на комфортном автомобиле","Египтолог на немецком языке как гид","Входные билеты на все достопримечательности","Обед","Минеральная вода и напитки во время поездки"]'::jsonb, '["Напитки в ресторане","Личные расходы","Дополнительные сборы за трансфер для гостей Марса Алам: 25 € на человека","Дополнительные сборы за трансфер для гостей Эль-Кусейр: 15 € на человека","Дополнительные сборы за трансфер из Макади Бэй/Сахл Хашиш: 5 € на человека","Дополнительные сборы за трансфер из Эль Гуны/Сафаги/Сома Бэй: 10 € на человека","Гид на иностранном языке (английский, русский или французский): доп. 10 € на человека"]'::jsonb, 'Хургада - Красное море - Египет', '14 часов', NULL, NULL, NULL, NULL, '[{"q":"Сколько времени занимает поездка в монастыри?","a":"Полный день, около 14 часов включая трансфер."},{"q":"Нужна ли специальная одежда?","a":"Рекомендуется скромная одежда, закрывающая плечи и колени."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 16: tours 380712ad | Сафари на квадроциклах в Хургаде – 3 часа в пустын
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '380712ad-0b71-4e9a-8bfd-4e34c6906afc', 'ru', 'Сафари на квадроциклах в Хургаде – 3 часа в пустыне, поездка на верблюдах и деревня', '<h2>Сафари на квадроциклах в Хургаде</h2><p>Приключение на квадроцикле через пустыню Хургады — вождение по дюнам, посещение бедуинской деревни, египетский чай и волшебный закат.</p>', 'Волнующая поездка на квадроцикле через пустыню Хургады: вождение по дюнам, бедуинская деревня, египетский чай и закат.', NULL, '["Вождение на квадроцикле через золотые дюны","Посещение традиционной бедуинской деревни — египетский чай","Закат в пустыне — золотые цвета, которые не забудете","Безопасное приключение с профессиональными гидами"]'::jsonb, '["Аренда современного квадроцикла (3 часа)","Каска и средства защиты","Профессиональный гид по сафари","Посещение бедуинской деревни","Традиционный бедуинский чай","Трансфер из и в отель"]'::jsonb, '["Алкогольные напитки","Личные расходы","Чаевые"]'::jsonb, 'Хургада - Красное море - Египет', '8 часов', NULL, NULL, NULL, NULL, '[{"q":"Нужны ли права для квадроцикла?","a":"Нет, права не нужны. Вы получите полную инструкцию по технике безопасности перед стартом."},{"q":"С какого возраста можно участвовать?","a":"Дети от 16 лет могут водить, от 6 лет — как пассажир со взрослым."},{"q":"Что надеть?","a":"Удобная обувь, солнечные очки, шапка и солнцезащитный крем. Рекомендуется одежда с длинными рукавами для защиты от солнца и песка."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 17: tours 42a2941f | Частная однодневная поездка в Луксор из Хургады – 
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '42a2941f-6b90-4f0a-9593-0ec1ec980a13', 'ru', 'Частная однодневная поездка в Луксор из Хургады – Долина царей и храм Карнак', '<table class="tour-pricing-table"><thead><tr><th>Участники</th><th>Транспорт</th><th>Цена на человека</th></tr></thead><tbody><tr><td>2 человека</td><td>Частный лимузин</td><td>150 € на человека</td></tr><tr><td>3 – 4 человека</td><td>Частный микроавтобус</td><td>120 € на человека</td></tr><tr><td>5 – 6 человек</td><td>Частный микроавтобус</td><td>100 € на человека</td></tr><tr><td>7 – 8 человек</td><td>Частный микроавтобус</td><td>90 € на человека</td></tr></tbody></table>

Откройте Луксор в частной однодневной поездке из Хургады. Посетите Долину царей, храм Карнак, храм Хатшепсут и Колоссы Мемнона с гидом-египтологом на немецком.', 'Откройте Луксор в частной однодневной поездке из Хургады. Посетите Долину царей, храм Карнак, храм Хатшепсут и Колоссы Мемнона, с обедом и гидом-египтологом на немецком.', 'Культура и туризм', '["Долина царей — откройте гробницы фараонов","Храм Карнак — гигантское сооружение с возвышающимися колоннами","Храм царицы Хатшепсут — архитектурный шедевр","Колоссы Мемнона — два грозовых сидячих колосса","Обед с египетскими деликатесами","Частная экскурсия с египтологом на немецком"]'::jsonb, '["Премиальный трансфер на комфортном автомобиле","Египтолог на немецком как гид","Входные билеты на все достопримечательности","Обед","Минеральная вода и напитки во время поездки"]'::jsonb, '["Напитки в ресторане","Личные расходы","Дополнительные сборы за трансфер для гостей Марса Алам: 25 € на человека","Дополнительные сборы за трансфер для гостей Эль-Кусейр: 15 € на человека","Дополнительные сборы за трансфер из Макади Бэй/Сахл Хашиш: 5 € на человека","Дополнительные сборы за трансфер из Эль Гуны/Сафаги/Сома Бэй: 10 € на человека","Гид на иностранном языке (английский, русский или французский): доп. 10 € на человека"]'::jsonb, 'Хургада - Красное море - Египет', '14 часов', NULL, NULL, NULL, NULL, '[{"q":"Сколько времени занимает поездка из Хургады в Луксор?","a":"Примерно 4-5 часов в одну сторону на комфортном автомобиле."},{"q":"Могу ли я посетить гробницу Тутанхамона?","a":"Да, можно посетить гробницу Тутанхамона в Долине царей (отдельный входной билет)."},{"q":"Включен ли обед?","a":"Да, обед в местном ресторане включен в цену."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 18: tours 4f91f20d | 🛍️ Шоппинг-тур по Хургаде – бесплатная экскурсия 
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '4f91f20d-ead4-4473-8700-371d4cb5fc4e', 'ru', '🛍️ Шоппинг-тур по Хургаде – бесплатная экскурсия по базары с трансфером', '<h2>Шоппинг-тур по Хургаде</h2><p>Бесплатная экскурсия по базары Хургады. Откройте местные ремесла, специи, папирус, парфюмерные масла и сувениры.</p>', 'Бесплатная шоппинг-экскурсия в базары Хургады — раскройте местные ремесла, специи и сувениры.', NULL, '["Бесплатная экскурсия по базары","Местные ремесла и сувениры","Специи и парфюмерные масла","Гид-помощник"]'::jsonb, '["Трансфер из и в отель","Гид-помощник"]'::jsonb, '["Покупки","Личные расходы","Чаевые"]'::jsonb, 'Хургада - Красное море - Египет', '3 часа', NULL, NULL, NULL, NULL, '[{"q":"Тур действительно бесплатный?","a":"Да, экскурсия бесплатная. Оплата только за покупки."},{"q":"Сколько длится шоппинг-тур?","a":"Около 3 часов включая трансфер."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 19: tours 65f786e7 | Однодневная поездка в Каир перелетом из Хургады – 
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '65f786e7-75c3-457b-a66a-e9f91f2c950e', 'ru', 'Однодневная поездка в Каир перелетом из Хургады – Египетский музей и пирамиды', '<table class="tour-pricing-table"><thead><tr><th>Цена</th><th>Тип тура</th><th>Отправление</th><th>Сбор</th></tr></thead><tbody><tr><td>От 280 € на человека</td><td>Групповой</td><td>Ежедневно</td><td>Около 5:00 утра</td></tr></tbody></table>

Однодневная поездка в Каир перелетом из Хургады. Посетите пирамиды Гизы, Сфинкс, Египетский музей с золотыми масками Тутанхамона.', 'Быстрый полет из Хургады в Каир: пирамиды Гизы, Сфинкс, Египетский музей с сокровищами Тутанхамона за один день.', 'Культура и туризм', '["Пирамиды Гизы — последнее чудо света","Великий Сфинкс — хранитель тайн","Египетский музей — сокровища Тутанхамона","Полет Хургада-Каир (45 мин)"]'::jsonb, '["Перелет Хургада-Каир-Хургада","Трансфер в Каире на комфортном автомобиле","Гид на немецком языке","Входные билеты на пирамиды и музей","Обед в местном ресторане","Напитки во время поездки"]'::jsonb, '["Напитки в ресторане","Личные расходы","Чаевые","Вход внутрь пирамиды (опционально)"]'::jsonb, 'Хургада - Красное море - Египет', '15 часов', NULL, NULL, NULL, NULL, '[{"q":"Сколько длится полет из Хургады в Каир?","a":"Примерно 45 минут в одну сторону."},{"q":"Могу ли я войти внутрь пирамиды?","a":"Да, вход в пирамиду Хеопса возможен за доплату (30 € на человека)."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 20: tours 693d8094 | Верховая езда в Хургаде – пляж, пустыня и лошади в
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '693d8094-990e-44b2-acfe-571c66ffbb44', 'ru', 'Верховая езда в Хургаде – пляж, пустыня и лошади в море', '<h2>Верховая езда в Хургаде</h2><p>Езда на лошадях по пляжу и через пустыню Хургады — уникальный опыт лошадей в море.</p>', 'Езда на лошадях по пляжу Хургады и через пустыню — уникальный опыт лошадей в море.', NULL, '["Езда по пляжу на закате","Лошади в море — уникальный фотоопыт","Пустынная тропа","Подходит для новичков и опытных всадников"]'::jsonb, '["Лошадь и инструктор","Каска","Трансфер из отеля"]'::jsonb, '["Личные расходы","Чаевые"]'::jsonb, 'Хургада - Красное море - Египет', '3 часа', NULL, NULL, NULL, NULL, '[{"q":"Нужно ли уметь верхом ездить?","a":"Нет, подходит для новичков. Инструктор сопровождает всю поездку."},{"q":"Сколько длится поездка?","a":"3 часа включая трансфер."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 21: tours 69aa0c36 | Поездка на остров Ориндж Бэй с сноркелингом и водн
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '69aa0c36-125f-4f41-8502-55a8f4fd6d98', 'ru', 'Поездка на остров Ориндж Бэй с сноркелингом и водными видами спорта', '<h2>Ориндж Бэй — Сноркелинг и водные виды спорта</h2><p>Поездка на Остров Ориндж Бэй с полным набором водных развлечений.</p>', 'Сноркелинг и водные виды спорта на Острове Ориндж Бэй — банан, диван, джет-ски и парасейлинг.', NULL, '["Сноркелинг на коралловых рифах","Банан, диван, джет-ски, парасейлинг","Обед на лодке","Оборудование для сноркелинга"]'::jsonb, '["Трансфер из отеля","Лодка до Ориндж Бэй","Оборудование для сноркелинга","Водные виды спорта","Обед и напитки"]'::jsonb, '["Фото/видео под водой","Чаевые","Личные расходы"]'::jsonb, 'Хургада - Красное море - Египет', '4 часа', NULL, NULL, NULL, NULL, '[{"q":"Какие водные виды спорта включены?","a":"Банан, диван, джет-ски, парасейлинг."},{"q":"Есть ли возрастные ограничения?","a":"Детям от 6 лет с опекой родителей."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 22: tours 6b629662 | Аквапарк Макади в Хургаде с обедом и трансфером
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '6b629662-908c-40e3-b396-565393a6be18', 'ru', 'Аквапарк Макади в Хургаде с обедом и трансфером', '<table class="tour-pricing-table"><thead><tr><th>Цена</th><th>Тип тура</th><th>Отправление</th><th>Сбор</th></tr></thead><tbody><tr><td>От 35 € на человека</td><td>Групповой</td><td>Ежедневно</td><td>Около 10:00 утра</td></tr></tbody></table>

День в аквапарке Макади — один из крупнейших аквапарков Египта с горками для всех возрастов.', 'День в аквапарке Макади — скользкие дорожки, волновой бассейн, ленивая река и детские зоны.', 'Семейный отдых', '["Горки для всех возрастов","Волновой бассейн","Ленивая река","Детские зоны","Обед включен"]'::jsonb, '["Входной билет в аквапарк","Трансфер из и в отель","Обед","Спасательные жилеты"]'::jsonb, '["Фото/видео","Чаевые","Личные расходы","Трансфер из определенных зон (доплата)"]'::jsonb, 'Хургада - Красное море - Египет', '8 часов', NULL, NULL, NULL, NULL, '[{"q":"Подходит ли аквапарк для малышей?","a":"Да, есть детские зоны и пологие горки."},{"q":"Включен ли обед?","a":"Да, обед включен в цену билета."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 23: tours 77f34e21 | Эль-Гуна – Частная экскурсия по городу с круизом п
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '77f34e21-9d9d-4be6-90b3-8148b2d82214', 'ru', 'Эль-Гуна – Частная экскурсия по городу с круизом по лагуне и сноркелингом', '<h2>Эль-Гуна — Венеция Красного моря</h2><p>Частная экскурсия по Эль-Гуне: лагуны, мосты, эко-архитектура, круиз по лагуне и сноркелинг.</p>', 'Откройте Эль-Гуну — Венецию Красного моря: частная экскурсия по городу, круиз по лагуне и сноркелинг.', NULL, '["Экскурсия по Венеции Красного моря","Круиз по лагунам","Сноркелинг в чистых водах","Архитектура и эко-дизайн","Обед в ресторане на воде"]'::jsonb, '["Персональный трансфер на комфортном автомобиле","Гид на немецком языке","Круиз по лагуне","Сноркелинг","Обед в ресторане на воде","Напитки"]'::jsonb, '["Напитки в ресторане","Личные расходы","Чаевые","Дополнительные сборы за трансфер для гостей Марса Алам/Эль-Кусейр/Корпус"]'::jsonb, 'Хургада - Красное море - Египет', '4 часа', NULL, NULL, NULL, NULL, '[{"q":"Что включает круиз по лагуне?","a":"Круиз по лагунам Эль-Гуны с остановками для купания."},{"q":"Есть ли сноркелинг?","a":"Да, сноркелинг в чистых водах лагуны включен."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 24: tours 7cb0c635 | Частная однодневная поездка в Дендеру и Абидос из 
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '7cb0c635-f7a7-4d98-a9b0-cde4997ca8ae', 'ru', 'Частная однодневная поездка в Дендеру и Абидос из Хургады', '<h2>Дендера и Абидос из Хургады</h2><p>Частная однодневная поездка в храмы Дендеры и Абидоса с египтологом на немецком.</p>', 'Частная поездка в храмы Дендеры (Хатхор) и Абидоса (Сет I) — самые сохраненные храма Египта.', NULL, '["Храм Хатхор в Дендере — лучший сохраненный храм Египта","Храм Сети I в Абидосе — список царей","Коптийские тексты и рельефы","Частная экскурсия с египтологом"]'::jsonb, '["Персональный трансфер на комфортном автомобиле","Египтолог на немецком","Входные билеты на оба храма","Обед","Напитки"]'::jsonb, '["Напитки в ресторане","Личные расходы","Чаевые","Дополнительные сборы за трансфер из отдаленных зон"]'::jsonb, 'Хургада - Красное море - Египет', '13 часов', NULL, NULL, NULL, NULL, '[{"q":"Какие храмы посещаем?","a":"Храм Хатхор в Дендере и Храм Сети I в Абидосе."},{"q":"Сколько времени в пути?","a":"Около 13 часов включая трансфер."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 25: tours 80dc4e17 | Входной билет в Гранд Аквариум Хургады с трансферо
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '80dc4e17-ea30-4511-92be-5e8add77f139', 'ru', 'Входной билет в Гранд Аквариум Хургады с трансфером', '<table class="tour-pricing-table"><thead><tr><th>Цена</th><th>Тип тура</th><th>Отправление</th><th>Сбор</th></tr></thead><tbody><tr><td>От 25 € на человека</td><td>Групповой</td><td>Ежедневно</td><td>Около 14:00</td></tr></tbody></table>

Откройте Гранд Аквариум Хургады — туннель 24 метра, акулы, скаты, сотни видов рыб Красного моря.', 'Откройте Гранд Аквариум Хургады — один из крупнейших аквариумов Египта с туннелем 24 метра.', 'Семейный отдых', '["Туннель 24 метра под водой","Акулы, скаты, морские черепахи","Сотни видов рыб Красного моря","Интерактивные экспозиции","Подходит для семей с детьми"]'::jsonb, '["Входной билет в аквариум","Трансфер из и в отель"]'::jsonb, '["Фото/видео","Чаевые","Личные расходы","Трансфер из определенных зон (доплата)"]'::jsonb, 'Хургада - Красное море - Египет', '3 часа', NULL, NULL, NULL, NULL, '[{"q":"Есть ли туннель под водой?","a":"Да, туннель длиной 24 метра сквозь главную аквариумную колодку."},{"q":"Подходит ли для детей?","a":"Да, идеально для семей с детьми любого возраста."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 26: tours 872d19ae | Великолепное сафари в Хургаде на квадроцикле, джип
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '872d19ae-dd4c-4c01-9f1b-217e481b3732', 'ru', 'Великолепное сафари в Хургаде на квадроцикле, джипе, верблюде и в бедуинской деревне', '<h2>Великолепное сафари в Хургаде</h2><p>Сафари-приключение в пустыне Хургады: квадроцикл по дюнам, джип-сафари, верблюд, бедуинская деревня, чай и закат.</p>', 'Полноценное сафари-приключение: квадроцикл, джип, верблюд, бедуинская деревня, чай и закат в пустыне.', NULL, '["Квадроцикл по золотым дюнам","Джип-сафари в пустыне","Верховая езда на верблюде","Бедуинская деревня — традиционный чай","Закат в пустыне — незабываемые цвета"]'::jsonb, '["Аренда квадроцикла","Джип-сафари","Верблюд","Бедуинская деревня","Чай","Трансфер из и в отель"]'::jsonb, '["Личные расходы","Чаевые","Фото/видео (опционально)","Алкогольные напитки"]'::jsonb, 'Хургада - Красное море - Египет', '8 часов', NULL, NULL, NULL, NULL, '[{"q":"Что включает полноценное сафари?","a":"Квадроцикл, джип, верблюд, бедуинская деревня, чай и закат."},{"q":"Нужны ли права для квадроцикла?","a":"Нет, инструктаж дается на месте."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 27: tours 8c5d9ce5 | Mini Egypt Park Хургада – откройте достопримечател
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '8c5d9ce5-9931-42a6-8f09-44adf155d616', 'ru', 'Mini Egypt Park Хургада – откройте достопримечательности Египта в миниатюре', '<table class="tour-pricing-table"><thead><tr><th>Цена</th><th>Тип тура</th><th>Отправление</th><th>Сбор</th></tr></thead><tbody><tr><td>От 20 € на человека</td><td>Групповой</td><td>Ежедневно</td><td>Около 16:00</td></tr></tbody></table>

Mini Egypt Park — откройте пирамиды, храмы, мечети и памятники Египта в детальных миниатюрах.', 'Mini Egypt Park — музей под открытым небом с миниатюрными копиями главных достопримечательностей Египта.', 'Культура и туризм', '["Пирамиды Гизы в миниатюре","Храм Карнак в миниатюре","Мечеть Мухаммеда Али","Библиотека Александрийская","Образовательно и весело для детей"]'::jsonb, '["Входной билет в парк","Трансфер из и в отель","Гид"]'::jsonb, '["Напитки","Чаевые","Личные расходы"]'::jsonb, 'Хургада - Красное море - Египет', '3 часа', NULL, NULL, NULL, NULL, '[{"q":"Что там можно увидеть?","a":"Миниатюрные копии пирамид, храмов, мечетей и памятников Египта."},{"q":"Интересно ли детям?","a":"Да, очень познавательно и весело для детей."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 28: tours 94351900 | Частная однодневная поездка в Каир из Хургады – пи
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', '94351900-ac6d-4c76-92e1-f9e1b1744f2f', 'ru', 'Частная однодневная поездка в Каир из Хургады – пирамиды и музей на люксе', '<table class="tour-pricing-table"><thead><tr><th>Участники</th><th>Транспорт</th><th>Цена на человека</th></tr></thead><tbody><tr><td>2 человека</td><td>Премиальный седан</td><td>450 € на человека</td></tr><tr><td>3 – 4 человека</td><td>Премиальный минивэн</td><td>420 € на человека</td></tr><tr><td>5 – 6 человек</td><td>Премиальный микроавтобус</td><td>390 € на человека</td></tr><tr><td>7 – 8 человек</td><td>Премиальный микроавтобус</td><td>370 € на человека</td></tr></tbody></table>

Роскошная частная поездка в Каир: пирамиды Гизы, Египетский музей, Хан-эль-Халили с премиальным транспортом и гидом.', 'Роскошная частная поездка в Каир: пирамиды Гизы, Египетский музей, Хан-эль-Халили с премиальным сервисом.', 'Культура и туризм', '["Пирамиды Гизы — последнее чудо света","Египетский музей — сокровища Тутанхамона","Хан-эль-Халили — исторический базар","Премиальный транспорт","Персональный гид-египтолог"]'::jsonb, '["Премиальный транспорт туда и обратно","Персональный египтолог на немецком","Входные билеты на все достопримечательности","Гурманский обед","Премиальные напитки"]'::jsonb, '["Алкоголь","Личные расходы","Чаевые","Вход внутрь пирамиды (опционально)"]'::jsonb, 'Хургада - Красное море - Египет', '18 часов', NULL, NULL, NULL, NULL, '[{"q":"Что отличает люкс-тур?","a":"Премиальный транспорт, персональный египтолог, гурманский обед."},{"q":"Посещаем ли Хан-эль-Халили?","a":"Да, старый базар Хан-эль-Халили включен в программу."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 29: tours a8ddb433 | Полудневная поездка в Дендеру из Хургады – храм Ха
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', 'a8ddb433-a4fb-41ca-b90d-b399b4a57923', 'ru', 'Полудневная поездка в Дендеру из Хургады – храм Хатхор', '<h2>Дендера за полдня из Хургады</h2><p>Полудневная поездка в Дендеру: откройте храм Хатхор — шедевр египетской архитектуры с астрономическим потолком.</p>', 'Полудневная поездка в Дендеру: откройте храм Хатхор — один из лучших сохраненных храмов Египта.', NULL, '["Храм Хатхор — астрономический потолок","Коптийские рельефы и тексты","Крипты и святилища","Полудневная экскурсия","Гид-египтолог на немецком"]'::jsonb, '["Трансфер на комфортном автомобиле","Египтолог на немецком","Входной билет в храм","Напитки"]'::jsonb, '["Обед","Личные расходы","Чаевые","Дополнительные сборы за трансфер из отдаленных зон"]'::jsonb, 'Хургада - Красное море - Египет', '7 часов', NULL, NULL, NULL, NULL, '[{"q":"Каков хронологический порядок пирамид?","a":"Саккара (ступенчатая) -> Дахшур (сломанная/красная) -> Гизе (великие)."},{"q":"Включен ли обед?","a":"Да, обед включен."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 30: tours a9e92b99 | 2-дневная поездка в Каир из Хургады – пирамиды, Сф
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', 'a9e92b99-283c-4b1e-ac9a-12bfe9c7fef0', 'ru', '2-дневная поездка в Каир из Хургады – пирамиды, Сфинкс и Египетский музей', '<table class="tour-pricing-table"><thead><tr><th>Участники</th><th>Автомобиль</th><th>Цена на человека</th></tr></thead><tbody><tr><td>2 человека</td><td>Частный лимузин</td><td>350 € на человека</td></tr><tr><td>3 – 4 человека</td><td>Частный микроавтобус</td><td>335 € на человека</td></tr><tr><td>5 - 6 человек</td><td>Частный микроавтобус</td><td>300 € на человека</td></tr><tr><td>7 - 8 человек</td><td>Частный микроавтобус</td><td>280 € на человека</td></tr></tbody></table>

Совершите незабываемое двухдневное путешествие из Хургады в Каир и погрузитесь в увлекательную историю Древнего Египта. Посетите знаменитые пирамиды Гизы, Великого Сфинкса, Египетский музей с его бесчисленными сокровищами и оживленный Старый город Каира. Эта экскурсия предлагает идеальное сочетание истории, культуры и приключений. В первый день вы выезжаете из Хургады рано утром и примерно через 5 часов добираетесь до Каира. Там вы впервые посетите пирамиды Гизы и Великого Сфинкса. Затем вы поедете в отель, где проведете ночь. Во второй день вы посетите Египетский музей, старый город Хан-эль-Халили и Алебастровую мечеть. После обеда возвращение в Хургаду.', 'Двухдневная поездка из Хургады в Каир: посетите пирамиды Гизы, Большого Сфинкса, Египетский музей и Старый город Каира.', 'Культура и туризм', '["Пирамиды Гизы — последнее чудо света","Великий Сфинкс — хранители тайн","Египетский музей — сокровища Тутанхамона","Старый город Хан-эль-Халили","Алебастровая мечеть","2 дня с ночевкой в 4-звездочном отеле","Гид на всю поездку"]'::jsonb, '["Трансфер Хургада-Каир туда и обратно (с кондиционером)","1 ночь в 4-звездочном отеле в Каире","Завтрак в отеле","Обед в первый день","Входные билеты на все посещения","Опытный гид","Питьевая вода в автобусе"]'::jsonb, '["Советы","Фото и видео","Ужин","Дополнительные напитки","Личные расходы"]'::jsonb, 'Хургада - Красное море - Египет', '2 дня', NULL, NULL, NULL, NULL, '[{"q":"Сколько времени занимает поездка из Хургады в Каир?","a":"Дорога на автобусе занимает около 5 часов в одну сторону."},{"q":"Включен ли завтрак в отеле?","a":"Да, завтрак в отеле включен в стоимость."},{"q":"Могу ли я совершить поездку как однодневную?","a":"Да, есть еще однодневная поездка в Каир, но времени на посещение у вас будет меньше."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 31: tours b2dc19de | Частная поездка на скоростном катере в Хургаде – с
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', 'b2dc19de-fc9f-4a96-a742-7646e16a8486', 'ru', 'Частная поездка на скоростном катере в Хургаде – сноркелинг на рифах', '<h2>Частный скоростной катер — сноркелинг</h2><p>Частный скоростной катер к лучшим коралловым рифам Хургады. Персональный гид, полное оборудование для сноркелинга.</p>', 'Частный скоростной катер к лучшим рифам Хургады для сноркелинга — персональный гид, полное оборудование.', NULL, '["Сноркелинг на лучших коралловых рифах","Частный скоростной катер","Персональный гид","Полное оборудование","Напитки на борту"]'::jsonb, '["Частный скоростной катер","Гид на немецком/английском","Оборудование для сноркелинга","Напитки и закуски","Трансфер из отеля"]'::jsonb, '["Личные расходы","Чаевые"]'::jsonb, 'Хургада - Красное море - Египет', '4 часа', NULL, NULL, NULL, NULL, '[{"q":"Можно ли выбрать рифы для сноркелинга?","a":"Да, капитан подберет лучшие рифы на день поездки."},{"q":"Включено ли оборудование?","a":"Да, маска, трубка, жилет и ласты включены."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 32: tours b604535f | Поездка на остров Эдем с маской и трубкой в Хургад
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', 'b604535f-6c99-4766-9150-c29fbbf5678c', 'ru', 'Поездка на остров Эдем с маской и трубкой в Хургаде с обедом', '<h2>Остров Эдем — сноркелинг</h2><p>Остров Эдем — приватный рай для сноркелинга с коралловыми садами, тропическими рыбами и белым песком.</p>', 'Остров Эдем — приватный рай для сноркелинга с коралловыми садами, тропическими рыбами и белым песком.', NULL, '["Приватный остров для сноркелинга","Коралловые сады и тропические рыбы","Белый песок и бирюзовые воды","Обед на острове","Релакс и приватность"]'::jsonb, '["Трансфер из отеля","Лодка до острова Эдем","Оборудование для сноркелинга","Обед на острове","Напитки"]'::jsonb, '["Фото/видео под водой","Чаевые","Личные расходы"]'::jsonb, 'Хургада - Красное море - Египет', '8 часов', NULL, NULL, NULL, NULL, '[{"q":"Остров частный?","a":"Да, остров Эдем — приватный рай для сноркелинга."},{"q":"Есть ли обед?","a":"Да, обед на острове включен."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 33: tours c2db0455 | Ночная экскурсия по Хургаде – Частный тур
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', 'c2db0455-a5c7-47f9-8925-2ce6dcc3434a', 'ru', 'Ночная экскурсия по Хургаде – Частный тур', '<h2>Ночная Хургада</h2><p>Частная ночная экскурсия: марина Хургады, мечеть Аль-Мина, старый базар, ужин в ресторане с видом на море.</p>', 'Откройте Хургаду ночью: марина, мечеть, базар, ужин с видом на море — частный тур на немецком.', NULL, '["Марина Хургады ночью","Мечеть Аль-Мина — крупнейшая в регионе","Старый базар — шоппинг и атмосфера","Ужин с видом на море","Частный гид на немецком"]'::jsonb, '["Трансфер из и в отель","Частный гид на немецком","Ужин в ресторане","Напитки во время ужина"]'::jsonb, '["Алкогольные напитки","Личные расходы","Чаевые"]'::jsonb, 'Хургада - Красное море - Египет', '3 часа', NULL, NULL, NULL, NULL, '[{"q":"Какие места посещаем ночью?","a":"Марина, мечеть Аль-Мина, старый базар, ужин с видом на море."},{"q":"Включен ли ужин?","a":"Да, ужин в ресторане с видом на море включен."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 34: tours c7b7cfad | Частный тур по пирамидам из Хургады – Саккара, Дах
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', 'c7b7cfad-0101-4997-ac52-e4456a21c252', 'ru', 'Частный тур по пирамидам из Хургады – Саккара, Дахшур и Гизе', '<h2>Пирамиды: Саккара, Дахшур, Гизе</h2><p>Частная экскурсия к трем полям пирамид: Саккара — старейшая ступенчатая пирамида Джосера, Дахшур — сломанная и красная пирамиды, Гизе — великие пирамиды.</p>', 'Частная поездка к пирамидам: Саккара (ступенчатая пирамида), Дахшур (сломанная пирамида), Гизе (великие пирамиды).', NULL, '["Саккара — ступенчатая пирамида Джосера","Дахшур — сломанная и красная пирамиды","Гизе — три великие пирамиды","Сфинкс","Частный египтолог на немецком"]'::jsonb, '["Премиальный транспорт","Египтолог на немецком","Входные билеты на все площадки","Обед","Напитки"]'::jsonb, '["Алкоголь","Личные расходы","Чаевые","Вход внутрь пирамид (опционально)"]'::jsonb, 'Хургада - Красное море - Египет', '18 часов', NULL, NULL, NULL, NULL, '[{"q":"Посещаем ли мы пирамиду Джосера?","a":"Да, ступенчатую пирамиду Джосера в Саккаре."},{"q":"Что такое сломанная пирамида?","a":"Пирамида Снеферу в Дахшуре с уникальным изменением угла наклона."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 35: tours f265b20c | Сноркелинг на острове Хула Хула с трансфером из Ху
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('tours', 'f265b20c-db45-4173-a352-b1921fd7f744', 'ru', 'Сноркелинг на острове Хула Хула с трансфером из Хургады', '<h2>Остров Хула Хула — сноркелинг</h2><p>Сноркелинг на острове Хула Хула: коралловые рифы, дельфины, морские черепахи, белый песок и кристально чистая вода.</p>', 'Сноркелинг на острове Хула Хула — коралловые рифы, дельфины, морские черепахи и белый песок.', NULL, '["Коралловые рифы острова Хула Хула","Дельфины и морские черепахи","Белый песок и бирюзовые воды","Оборудование для сноркелинга","Обед и напитки на лодке"]'::jsonb, '["Трансфер из отеля","Лодка до острова","Оборудование для сноркелинга","Обед и напитки","Спасательные жилеты"]'::jsonb, '["Фото/видео под водой","Чаевые","Личные расходы"]'::jsonb, 'Хургада - Красное море - Египет', '4 часа', NULL, NULL, NULL, NULL, '[{"q":"Можно ли увидеть дельфинов?","a":"Да, высокая вероятность увидеть дельфинов и морских черепах."},{"q":"Подходит ли для детей?","a":"Да, дети от 6 лет с опекой родителей."}]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 36: blog_posts bc3112c6 | Лучшие туры в Хургаде 2025 – главные достопримечат
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('blog_posts', 'bc3112c6-a2e1-4475-997b-39e2a77e228e', 'ru', 'Лучшие туры в Хургаде 2025 – главные достопримечательности, инсайдерские советы и незабываемые впечатления на Красном море', '<h2>Лучшие туры в Хургаде 2025</h2><p>Хургада — одна из самых популярных туристических точек в Египте и на Ближнем Востоке, предлагающая уникальное сочетание истории, природы и приключений. Вот ваш по...', 'Ваш полный гид по лучшим турам в Хургаде 2025: поездки в пирамиды, сноркелинг, пустынное сафари и всё, что нужно для идеального отпуска на Красном море.', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Лучшие туры в Хургаде 2025 – главные достопримечательности, инсайдерские советы и незабываемые впечатления на Красном море', 'Ваш полный гид по лучшим турам в Хургаде 2025: поездки в пирамиды, сноркелинг, пустынное сафари и всё, что нужно для идеального отпуска на Красном море.', '<h2>Лучшие туры в Хургаде 2025</h2><p>Хургада — одна из самых популярных туристических точек в Египте и на Ближнем Востоке, предлагающая уникальное сочетание истории, природы и приключений. Вот ваш полный гид по лучшим турам, доступным в 2025 году.</p><h3>1. Поездка в пирамиды из Хургады</h3><p>Однодневная поездка в пирамиды Гизы недалеко от Каира, включает посещение трех великих пирамид, Сфинкса и Египетского музея. Идеально для любителей истории и культуры.</p><h3>2. Сноркелинг — Красное море</h3><p>Исследуйте коралловые рифы, тропические рыбы и дельфинов в подводном мире, который не забудете. Включает полное оборудование для сноркелинга и профессионального гида.</p><h3>3. Сафари в пустыне на квадроциклах</h3><p>Волнующее приключение через золотые дюны пустыни Хургады, включает вождение на квадроцикле, посещение бедуинской деревни, традиционный чай и волшебный закат.</p><h3>4. Поездка на остров Махмия с сноркелингом</h3><p>Однодневная поездка на остров Махмия в Красном море, одно из самых известных мест для сноркелинга в мире. Коралловые рифы, разноцветные рыбы и бирюзовые воды.</p><h3>Важные советы</h3><ul><li>Лучшее время для посещения: с октября по апрель</li><li>Удобная одежда и закрытая обувь</li><li>Солнцезащитный крем, солнечные очки и камера, защищенная от воды</li></ul><p>Забронируйте свою поездку сейчас и насладитесь лучшим опытом в Хургаде!</p>', '10 минут', '[]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 37: blog_posts 47f7dda0 | Пирамиды Гизы из Хургады: незабываемая поездка в К
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('blog_posts', '47f7dda0-2b6f-475c-be26-a01bd5debd08', 'ru', 'Пирамиды Гизы из Хургады: незабываемая поездка в Каир на рассвете', '<h2>Пирамиды Гизы из Хургады – поездка на рассвете</h2><p>Отправьтесь из Хургады рано утром в пирамиды Гизы на рассвете. Впечатление, которого не забудете — последнее чудо света.</p><h3>Программа поез...', 'Однодневная поездка из Хургады в пирамиды Гизы на рассвете — увидьте последнее чудо света в волшебном золотом свете.', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Пирамиды Гизы из Хургады: незабываемая поездка в Каир на рассвете', 'Однодневная поездка из Хургады в пирамиды Гизы на рассвете — увидьте последнее чудо света в волшебном золотом свете.', '<h2>Пирамиды Гизы из Хургады – поездка на рассвете</h2><p>Отправьтесь из Хургады рано утром в пирамиды Гизы на рассвете. Впечатление, которого не забудете — последнее чудо света.</p><h3>Программа поездки</h3><ul><li>05:00 – отправление из Хургады на комфортном автобусе</li><li>10:00 – прибытие в пирамиды Гизы и рассвет</li><li>11:00 – посещение пирамиды Хеопса и Сфинкса</li><li>13:00 – обед в местном ресторане</li><li>15:00 – посещение Египетского музея (Тутанхамон)</li><li>18:00 – возвращение в Хургаду</li></ul><h3>Что включено</h3><ul><li>Персональный трансфер на комфортном автомобиле туда и обратно</li><li>Гид на немецком языке</li><li>Входные билеты на все достопримечательности</li><li>Обед в местном ресторане</li><li>Напитки во время поездки</li></ul><h3>Практическая информация</h3><p>Поездка занимает около 14 часов. Рекомендуется взять легкий перекус и дополнительную воду.</p>', '5 минут', '[]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 38: blog_posts 8967bf58 | Поездка в Луксор из Хургады: откройте тайны фараон
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('blog_posts', '8967bf58-d218-4388-a386-2c56fc36f861', 'ru', 'Поездка в Луксор из Хургады: откройте тайны фараонов в Долине царей', '<h2>Поездка в Луксор из Хургады – тайны фараонов</h2><p>Однодневная поездка из Хургады в Луксор, древнюю столицу Египта и дом фараонов. Исследуйте Долину царей, храм Карнак и храм Хатшепсут.</p><h3>Пр...', 'Однодневная поездка из Хургады в Луксор — откройте Долину царей, храм Карнак, храм Хатшепсут с экспертным гидом.', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Поездка в Луксор из Хургады: откройте тайны фараонов в Долине царей', 'Однодневная поездка из Хургады в Луксор — откройте Долину царей, храм Карнак, храм Хатшепсут с экспертным гидом.', '<h2>Поездка в Луксор из Хургады – тайны фараонов</h2><p>Однодневная поездка из Хургады в Луксор, древнюю столицу Египта и дом фараонов. Исследуйте Долину царей, храм Карнак и храм Хатшепсут.</p><h3>Программа поездки</h3><ul><li>06:00 – отправление из Хургады на комфортном автомобиле</li><li>11:00 – прибытие в Луксор и начало экскурсии</li><li>11:30 – посещение гигантского храма Карнак</li><li>13:00 – обед в местном ресторане</li><li>14:00 – переправка на западный берег Нила</li><li>15:00 – Долина царей — гробницы фараонов</li><li>16:30 – храм царицы Хатшепсут</li><li>18:00 – возвращение в Хургаду</li></ul><h3>Что включено</h3><ul><li>Персональный трансфер на комфортном автомобиле</li><li>Гид на немецком (египтолог)</li><li>Входные билеты на все достопримечательности</li><li>Обед в местном ресторане</li><li>Напитки и вода во время поездки</li></ul>', '5 минут', '[]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 39: blog_posts a06032c3 | Лучшие туры по сноркелингу в Хургаде 2025: откройт
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('blog_posts', 'a06032c3-164a-4be2-a2d7-625cc2e7baa5', 'ru', 'Лучшие туры по сноркелингу в Хургаде 2025: откройте удивительный подводный мир Красного моря', '<h2>Лучшие туры по сноркелингу в Хургаде 2025</h2><p>Красное море — одно из лучших мест для сноркелинга в мире, а Хургада — его главные ворота. Откройте лучшие места для сноркелинга из Хургады.</p><h3...', 'Откройте лучшие места для сноркелинга в Хургаде 2025: коралловые рифы, тропические рыбы, дельфины, черепахи и многое другое.', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Лучшие туры по сноркелингу в Хургаде 2025: откройте удивительный подводный мир Красного моря', 'Откройте лучшие места для сноркелинга в Хургаде 2025: коралловые рифы, тропические рыбы, дельфины, черепахи и многое другое.', '<h2>Лучшие туры по сноркелингу в Хургаде 2025</h2><p>Красное море — одно из лучших мест для сноркелинга в мире, а Хургада — его главные ворота. Откройте лучшие места для сноркелинга из Хургады.</p><h3>Ориндж Бэй</h3><p>Одно из самых известных мест для сноркелинга в мире, с цветными коралловыми рифами, разнообразными тропическими рыбами и удивительной рыбой-нászю.</p><h3>Остров Парадайз</h3><p>Прекрасный остров в сердце Красного моря, с бирюзовыми спокойными водами, идеальными для новичков и наблюдения за дайвингом.</p><h3>Остров Гифтун</h3><p>Самый известный природный заповедник в Египте, дом для дельфинов, морских черепах и здоровых коралловых рифов.</p><h3>Дом дельфинов</h3><p>Уникальный опыт с дельфинами в их естественной среде. Высокая вероятность увидеть дельфинов и плыть с ними.</p><h3>Практическая информация</h3><ul><li>Туры подходят для новичков с профессиональным гидом</li><li>Полное оборудование для сноркелинга включено</li><li>Дети от 6 лет с опекой родителей</li></ul>', '7 минут', '[]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Row 40: blog_posts 9e076f56 | Сафари на квадроциклах в Хургаде 2025 – абсолютное
INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)
VALUES ('blog_posts', '9e076f56-ac05-46a5-8355-2b1aafc9c8a1', 'ru', 'Сафари на квадроциклах в Хургаде 2025 – абсолютное пустынное приключение в Египте', '<h2>Сафари на квадроциклах в Хургаде 2025 – абсолютное пустынное приключение</h2><p>Отправьтесь в приключение сафари на квадроциклах через удивительную пустыню Хургады. Волнующий опыт включает вождени...', 'Приключение сафари на квадроциклах в пустыне Хургады – волнующее вождение, бедуинская деревня, египетский чай и волшебный закат.', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, NULL, 'Сафари на квадроциклах в Хургаде 2025 – абсолютное пустынное приключение в Египте', 'Приключение сафари на квадроциклах в пустыне Хургады – волнующее вождение, бедуинская деревня, египетский чай и волшебный закат.', '<h2>Сафари на квадроциклах в Хургаде 2025 – абсолютное пустынное приключение</h2><p>Отправьтесь в приключение сафари на квадроциклах через удивительную пустыню Хургады. Волнующий опыт включает вождение квадроциклов по дюнам и посещение традиционной бедуинской деревни.</p><h3>Программа поездки (3 часа)</h3><ul><li>09:00 – получение оборудования и инструкции по технике безопасности в Хургаде</li><li>09:30 – старт в поездке на квадроциклах через золотые дюны</li><li>10:30 – посещение бедуинской деревни — традиционный бедуинский чай и разговор с бедуинами</li><li>11:00 – наслаждение волшебным закатом в пустыне</li><li>12:00 – возвращение в Хургаду</li></ul><h3>Что включено</h3><ul><li>Аренда современного квадроцикла</li><li>Каска и средства защиты</li><li>Эксперт-гид по сафари</li><li>Традиционный бедуинский чай</li><li>Трансфер из и в отель</li></ul><h3>Важная информация</h3><ul><li>Права не нужны</li><li>Подходит для новичков и детей от 6 лет (как пассажир)</li><li>Удобная одежда, закрытая обувь, солнечные очки, солнцезащитный крем</li></ul>', '4 минуты', '[]'::jsonb)
ON CONFLICT (table_name, row_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_label = EXCLUDED.category_label,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  not_included = EXCLUDED.not_included,
  meeting_point = EXCLUDED.meeting_point,
  duration = EXCLUDED.duration,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  read_time = EXCLUDED.read_time,
  faqs = EXCLUDED.faqs;

-- Verification queries
SELECT locale, table_name, COUNT(*) as cnt FROM content_translations WHERE locale IN ('ar', 'ru') GROUP BY locale, table_name ORDER BY locale, table_name;
SELECT COUNT(*) as total_ar_rows FROM content_translations WHERE locale = 'ar';
SELECT COUNT(*) as total_ru_rows FROM content_translations WHERE locale = 'ru';

COMMIT;