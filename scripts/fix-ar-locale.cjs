require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient} = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ===================================================================
// ARABIC (AR) LOCALE FIX SCRIPT
// For each tour, provides clean Arabic translations based on German source
// ===================================================================

const TOUR_SLUGS_WITH_ISSUES = [
  'kairo-mit-flug-ab-hurghada-pyramiden-museum',
  'makadi-water-park-hurghada-mittagessen-transfer',
  'privater-pyramiden-ausflug-ab-hurghada-sakkara-dahschur-gizeh',
  'kloester-st-antonius-st-paulus',
  'eden-island-schnorchelausflug-hurghada',
  'private-delfin-tour-hurghada',
  'private-speedboot-tour-orange-bay-hurghada',
  'dendera-halbtagesausflug-ab-hurghada-der-authentische-besuch-im-hathor-tempel',
  'orange-bay-insel-schnorchelausflug-hurghada',
  'mahmya-insel-ausflug-hurghada',
  'glasbodenboot-hurghada-mit-schnorcheln',
  'mini-egypt-park-hurghada',
  'naechtliche-stadtrundfahrt-durch-hurghada-private-tour',
  'luxor-tagesausflug-ab-hurghada',
  'privater-speedboot-ausflug-in-hurghada-schnorcheln-an-korallenriffen-sonnenuntergang',
  'hula-hula-insel-schnorchelausflug-hurghada',
  'hurghada-shopping-tour-basar-transfer',
  'super-safari-hurghada',
  '2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben',
  'quad-tour-hurghada-kamelritt',
  'privater-tagesausflug-von-hurghada-nach-kairo-pyramiden-grand-egyptian-museum',
  'luxor-tagesausflug-heissluftballon-hoteluebernachtung',
  'privater-tagesausflug-ab-hurghada-dendera-abydos-tempel',
];

// German time format → Arabic time format
function deTimeToAr(timeStr) {
  if (!timeStr) return '';
  return timeStr.replace(/(\d{1,2}):(\d{2})\s*Uhr/g, (m, h, min) => {
    const hn = parseInt(h);
    if (hn < 12) {
      if (hn === 0) return `12:${min} صباحاً`;
      return `${String(hn).padStart(2,'0')}:${min} صباحاً`;
    } else if (hn === 12) return `12:${min} ظهراً`;
    else if (hn < 18) return `${String(hn - 12 || 12).padStart(2,'0')}:${min} مساءً`;
    else return `${String(hn - 12 || 12).padStart(2,'0')}:${min} مساءً`;
  }).replace(/ca\. /g, 'حوالي ');
}

async function main() {
  const {data: tours} = await db.from('tours').select('id, slug, itinerary, faqs, highlights, included, not_included');
  const {data: allTrs} = await db.from('content_translations').select('*').eq('table_name','tours');

  const tourMap = {};
  for (const t of tours) tourMap[t.slug] = t;

  let totalUpdated = 0;
  const diffLog = [];

  for (const slug of TOUR_SLUGS_WITH_ISSUES) {
    const tour = tourMap[slug];
    if (!tour) continue;
    
    const de = allTrs.find(t => t.row_id === tour.id && t.locale === 'de');
    const ar = allTrs.find(t => t.row_id === tour.id && t.locale === 'ar');
    if (!de || !ar) continue;

    const tourDiffs = { slug, itinerary: [], faqs: [], highlights: [], included: [], not_included: [] };

    // ==================== ITINERARY FIX ====================
    try {
      // German itinerary is stored on tours.itinerary (not in de.content which is null)
      const deSteps = Array.isArray(tour.itinerary) ? tour.itinerary : [];
      const arSteps = typeof ar.content === 'string' ? JSON.parse(ar.content) : (Array.isArray(ar.content) ? ar.content : []);
      
      // Check if AR has German text in itinerary
      const contentStr = JSON.stringify(arSteps);
      const hasGerman = /\b(Abholung|Ankunft|Besuch|Fahrt|Mittagessen|Rückfahrt|Rücktransfer|Frühstück|Abendessen|Hotelabholung|Rückkehr|schnorcheln|Schnorcheln|Besichtigung|Kamelritt|Weiterfahrt|Aufenthalt|Entspannung|Rückflug|Stadtrundfahrt|Lagunenfahrt|Glasbodenboot)\b/i.test(contentStr);
      
      // Also check for Arabic itinerary that has English ("in Hurghada" instead of Arabic)
      const hasEnglishMixed = /\bin\b|\bvon\b|\bund\b|\bmit\b|\boder\b|\bca\.\b|\bUhr\b/i.test(JSON.stringify(arSteps).replace(/[\u0600-\u06FF\s]/g,''));
      
      if (deSteps.length > 0 && (hasGerman || hasEnglishMixed)) {
        const newSteps = deSteps.map((step, i) => {
          const oldStep = arSteps[i] || {};
          return {
            title: translateItinTitle(step.title || '', 'ar'),
            content: translateItinContent(step.content || '', 'ar')
          };
        });
        
        if (JSON.stringify(newSteps) !== JSON.stringify(arSteps)) {
          tourDiffs.itinerary = arSteps.map((s,i) => ({
            idx: i,
            oldTitle: s.title,
            newTitle: newSteps[i]?.title,
            oldContent: s.content?.substring(0,100),
            newContent: newSteps[i]?.content?.substring(0,100)
          }));
        }
      }
    } catch(e) {}

    // ==================== FAQ FIX ====================
    const deFaqsSource = Array.isArray(tour.faqs) ? tour.faqs : (Array.isArray(de.faqs) ? de.faqs : []);
    const arFaqs = Array.isArray(ar.faqs) ? ar.faqs : [];
    if (deFaqsSource.length > 0 && arFaqs.length < deFaqsSource.length) {
      // Add missing FAQs with Arabic translations
      const newArFaqs = [...arFaqs];
      for (let i = arFaqs.length; i < deFaqsSource.length; i++) {
        const deFaq = deFaqsSource[i];
        const arFaq = translateFAQ(deFaq, 'ar');
        newArFaqs.push(arFaq);
        tourDiffs.faqs.push({ idx: i, question: deFaq.question?.substring(0,60), answer: deFaq.answer?.substring(0,60) });
      }
    }

    // ==================== LIST FIXES ====================
    for (const field of ['highlights', 'included', 'not_included']) {
      const deItems = Array.isArray(tour[field]) ? tour[field] : (Array.isArray(de[field]) ? de[field] : []);
      const arItems = Array.isArray(ar[field]) ? ar[field] : [];
      if (deItems.length === 0 && arItems.length === 0) continue;
      
      if (arItems.length < deItems.length) {
        const newItems = [...arItems];
        for (let i = arItems.length; i < deItems.length; i++) {
          newItems.push(translateListItem(deItems[i], 'ar'));
        }
        tourDiffs[field] = { old: arItems.length, new: newItems.length, added: deItems.slice(arItems.length).map(s => ({de: s.substring(0,60), ar: translateListItem(s, 'ar').substring(0,60)})) };
      } else if (arItems.length > deItems.length) {
        tourDiffs[field] = { old: arItems.length, new: deItems.length, trimmed: true };
      }
    }

    diffLog.push(tourDiffs);
  }

  // Print diff log
  console.log('=== ARABIC FIX DIFF ===\n');
  for (const entry of diffLog) {
    if (entry.itinerary.length === 0 && entry.faqs.length === 0 && 
        !entry.highlights.length && !entry.included.length && !entry.not_included.length) continue;
    
    console.log('## ' + entry.slug);
    
    if (entry.itinerary.length > 0) {
      console.log('  ITINERARY:');
      for (const d of entry.itinerary.slice(0, 3)) {  // Show first 3 diffs
        console.log('    Step ' + d.idx + ':');
        console.log('      Title: ' + d.oldTitle + ' -> ' + d.newTitle);
        console.log('      Content: ' + d.oldContent + ' ...');
        console.log('      -> ' + d.newContent + ' ...');
      }
      if (entry.itinerary.length > 3) console.log('    ... and ' + (entry.itinerary.length - 3) + ' more steps');
    }
    
    if (entry.faqs.length > 0) {
      console.log('  FAQs (' + entry.faqs.length + ' changed):');
      for (const d of entry.faqs.slice(0, 3)) {
        console.log('    [' + d.idx + '] ' + d.oldQ + ' -> ' + d.newQ);
      }
    }
    
    for (const field of ['highlights', 'included', 'not_included']) {
      if (entry[field]) {
        console.log('  ' + field + ': ' + entry[field].old + ' -> ' + entry[field].new + ' items');
        if (entry[field].added) {
          for (const a of entry[field].added) {
            console.log('    + ' + a.de + ' -> ' + a.ar);
          }
        }
      }
    }
    console.log('');
  }
}

// ==================== TRANSLATION FUNCTIONS ====================

function translateItinTitle(title, locale) {
  // Most itinerary titles are times like "04:00 Uhr" or short phrases
  if (!title) return '';
  // For 'ar', keep the time format but remove "Uhr"
  let t = title.replace(/ Uhr$/, '').replace(/^Abholung /, 'الاستلام ');
  t = t.replace(/^Ankunft/, 'الوصول');
  t = t.replace(/^Mittagessen/, 'الغداء');
  t = t.replace(/^Rückfahrt/, 'العودة');
  return t;
}

function translateItinContent(content, locale) {
  if (!content) return '';
  // Full German-Arabic translation dictionary for itinerary content
  const dict = {
    // Common short phrases
    'Abholung vom Hotel': 'الاستلام من الفندق',
    'Abholung vom Hotel in Hurghada': 'الاستلام من الفندق في الغردقة',
    'Abholung in Hurghada': 'الاستلام في الغردقة',
    'Abholung direkt von Ihrem Hotel.': 'الاستلام المباشر من فندقك.',
    'Abholung direkt von Ihrem Hotel in Hurghada.': 'الاستلام المباشر من فندقك في الغردقة.',
    'Abholung vom Hotel in Hurghada.': 'الاستلام من الفندق في الغردقة.',
    'Hotelabholung in Hurghada': 'الاستلام من الفندق في الغردقة',
    'Hotelabholung': 'الاستلام من الفندق',
    'Ankunft': 'الوصول',
    'Ankunft & Transfer zum Hotel': 'الوصول والتحويل إلى الفندق',
    'Ankunft in Kairo & Begrüßung durch Ihren Guide': 'الوصول إلى القاهرة والترحيب من مرشدك السياحي',
    'Mittagessen': 'الغداء',
    'Mittagessen & Getränke': 'الغداء والمشروبات',
    'Mittagessen in einem lokalen Restaurant.': 'الغداء في مطعم محلي.',
    'Mittagessen in Abydos.': 'الغداء في أبيدوس.',
    'Mittagessen in Abydos': 'الغداء في أبيدوس',
    'Mittagessen in Theben West': 'الغداء في غرب طيبة',
    'Mittagessen am Nil': 'الغداء على النيل',
    'Mittagessen während des Ausflugs': 'الغداء خلال الرحلة',
    'Frühstück': 'الفطور',
    'Frühstück im Hotel': 'الفطور في الفندق',
    'Abendessen': 'العشاء',
    'Abendessen & Folklore': 'العشاء والفولكلور',
    'Rückfahrt': 'العودة',
    'Rückfahrt zum Hotel': 'العودة إلى الفندق',
    'Rückfahrt zum Hotel.': 'العودة إلى الفندق.',
    'Rückfahrt nach Hurghada': 'العودة إلى الغردقة',
    'Rückkehr': 'العودة',
    'Rückkehr zum Hotel.': 'العودة إلى الفندق.',
    'Rückkehr am frühen Nachmittag.': 'العودة في وقت مبكر من بعد الظهر.',
    'Rücktransfer': 'النقل العائد',
    'Rücktransfer zum Hotel': 'النقل العائد إلى الفندق',
    'Rücktransfer zum Hotel am Nachmittag.': 'النقل العائد إلى الفندق بعد الظهر.',
    'Rückflug nach Hurghada': 'رحلة العودة إلى الغردقة',
    'Transfer': 'النقل',
    'Transfer zum Hafen & Einschiffung': 'النقل إلى الميناء والصعود على متن القارب',
    'Abholung & Transfer zum Hafen': 'الاستلام والنقل إلى الميناء',
    'Abholung & Fahrt nach Kairo': 'الاستلام والانطلاق إلى القاهرة',
    'Abholung & Fahrt nach Dendera': 'الاستلام والانطلاق إلى دندرة',
    'Abholung in Hurghada, El Gouna, Makadi Bay, Soma Bay oder Safaga.': 'الاستلام في الغردقة أو الجونة أو ماكادي باي أو سوما باي أو سفاجا.',
    'Bootsfahrt im Roten Meer': 'رحلة بالقارب في البحر الأحمر',
    'Bootsfahrt zu den besten Schnorchelspots': 'رحلة بالقارب إلى أفضل أماكن الغطس',
    'Schnorcheln': 'الغطس',
    'Schnorcheln & Schwimmen': 'الغطس والسباحة',
    'Schnorcheln im Roten Meer': 'الغطس في البحر الأحمر',
    'Schnorcheln an Korallenriffen': 'الغطس في الشعاب المرجانية',
    'Schnorcheln an zwei Korallenriffen': 'الغطس في شعاب مرجانية',
    'Schnorchelgänge': 'جولات الغطس',
    'Schnorchelfahrt': 'رحلة الغطس',
    'Quad-Tour': 'جولة كواد',
    'Quad Safari durch die Wüste': 'سفاري كواد في الصحراء',
    'Kamelritt': 'ركوب الجمل',
    'Besichtigung': 'الزيارة',
    'Besichtigung Abydos-Tempel': 'زيارة معبد أبيدوس',
    'Besichtigung Hathor-Tempel': 'زيارة معبد حتحور',
    'Besichtigung Kloster St. Antonius': 'زيارة دير القديس أنطونيوس',
    'Besichtigung Kloster St. Paulus': 'زيارة دير القديس بولس',
    'Glasbodenboot-Fahrt': 'رحلة بالقارب ذو القاع الزجاجي',
    'Lagunenfahrt durch El Gouna': 'جولة بحرية في بحيرات الجونة',
    'Stadtrundfahrt': 'جولة في المدينة',
    'Weiterfahrt nach Abydos': 'مواصلة الرحلة إلى أبيدوس',
    'Weiterfahrt zum Kloster St. Paulus': 'مواصلة الرحلة إلى دير القديس بولس',
    'Weiterfahrt zum Obst- und Gemüsemarkt.': 'مواصلة الرحلة إلى سوق الفواكه والخضروات.',
    'Fahrt nach Dendera': 'الذهاب إلى دندرة',
    'Fahrt zum Kloster St. Antonius': 'الذهاب إلى دير القديس أنطونيوس',
    'Spider-Buggy Fahrt durch die Wüste.': 'جولة بسيارة سبايدر بغي في الصحراء.',
    'Aufenthalt auf Orange Bay Island': 'الإقامة في جزيرة أورانج باي',
    'Aufenthalt auf einer ruhigen Insel': 'الإقامة في جزيرة هادئة',
    'Inselaufenthalt (90 Minuten)': 'الإقامة في الجزيرة (90 دقيقة)',
    'Freizeit & Fotos': 'وقت حر وصور',
    'Freie Zeit zum Einkaufen': 'وقت حر للتسوق',
    'Freizeit im Park': 'وقت حر في الحديقة',
    'Delfinbegegnung': 'لقاء الدلافين',
    'Entspannung am Strand oder auf dem Boot.': 'الاسترخاء على الشاطئ أو على القارب.',
    'Entspannung an Bord': 'الاسترخاء على متن القارب',
    'Sonnenuntergang': 'غروب الشمس',
    'Sonnenuntergang in der Wüste.': 'غروب الشمس في الصحراء.',
    'Sonnenuntergang auf dem Roten Meer': 'غروب الشمس على البحر الأحمر',
    'Sonnenaufgang über Luxor – Heißluftballonfahrt': 'شروق الشمس فوق الأقصر – رحلة بالون الهواء الساخن',
    'Reitausflug (1–2 Stunden)': 'ركوب الخيل (1-2 ساعة)',
    'Einweisung & Start': 'التعليمات والانطلاق',
    'Einweisung & Vorbereitung': 'التعليمات والتحضير',
    'Einweisung und Start der Quad-Tour.': 'التعليمات وانطلاق جولة الكواد.',
    'Begrüßung & Sicherheitseinweisung': 'الترحيب وتعليمات السلامة',
    'Persönliche Begrüßung und Sicherheitseinweisung an Bord des privaten Bootes.': 'ترحيب شخصي وتعليمات السلامة على متن القارب الخاص.',
    'Besuch': 'زيارة',
    'Individuelle Besichtigung': 'جولة فردية',
    'Zeit für individuelle Besichtigung und Fotos.': 'وقت للجولة الفردية والصور.',
    'Abholung (04:00 Uhr)': 'الاستلام (04:00)',
    'Abholung (04:00–04:30 Uhr)': 'الاستلام (04:00–04:30)',
    'Abholung (03:00 Uhr)': 'الاستلام (03:00)',
    // Full sentences
    'Abholung direkt von Ihrem Hotel in einem privaten, klimatisierten Fahrzeug und Transfer zum Hafen.': 'استلام مباشر من فندقك بسيارة خاصة مكيفة ونقل إلى الميناء.',
    'Pünktliche Abholung direkt von Ihrem Hotel im klimatisierten Fahrzeug.': 'استلام في الوقت المحدد مباشرة من فندقك بسيارة مكيفة.',
    'Bequeme Abholung von Ihrem Hotel in Hurghada oder Umgebung.': 'استلام مريح من فندقك في الغردقة أو المناطق المجاورة.',
    'Bequemer Transfer im klimatisierten Fahrzeug.': 'نقل مريح بسيارة مكيفة.',
    'Bequeme Fahrt Richtung Kairo mit Zwischenpause.': 'رحلة مريحة باتجاه القاهرة مع استراحة.',
    'Abholung von Ihrem Hotel in Hurghada im klimatisierten Fahrzeug.': 'الاستلام من فندقك في الغردقة بسيارة مكيفة.',
    'Abholung direkt vom Hotel in Hurghada oder Makadi Bay.': 'استلام مباشر من الفندق في الغردقة أو ماكادي باي.',
    'Wir holen Sie bequem mit klimatisiertem Fahrzeug direkt von Ihrem Hotel in Hurghada oder Umgebung ab.': 'نستلمكم بشكل مريح بسيارة مكيفة مباشرة من فندقكم في الغردقة أو المناطق المجاورة.',
    'Frühmorgens werden Sie direkt von Ihrem Hotel in Hurghada abgeholt. Die Fahrt nach Kairo erfolgt komfortabel in einem modernen, klimatisierten Privatfahrzeug inklusive kostenloser Getränke.': 'في الصباح الباكر يتم استلامكم مباشرة من فندقكم في الغردقة. الرحلة إلى القاهرة تكون مريحة بسيارة خاصة حديثة مكيفة تتضمن مشروبات مجانية.',
    'Gegen 04:00 Uhr holt Sie Ihr privater Fahrer im klimatisierten Fahrzeug ab. Die Fahrt führt über Safaga durch eine stille Wüstenlandschaft, die kurz vor Luxor dem grünen Band des Niltals weicht.': 'حوالي الساعة 04:00 صباحاً يستقلكم سائقكم الخاص بسيارة مكيفة. الرحلة تمر عبر سفاجا ومناظر صحراوية هادئة تتحول قبل الوصول إلى الأقصر إلى الشريط الأخضر لوادي النيل.',
    'Die Abholung erfolgt gegen 02:00 Uhr direkt von Ihrem Hotel in Hurghada. Anschließend beginnt die Fahrt nach Kairo im klimatisierten Fahrzeug.': 'يتم الاستلام حوالي الساعة 02:00 صباحاً مباشرة من فندقكم في الغردقة.随后 تبدأ الرحلة إلى القاهرة بسيارة مكيفة.',
    'Abholung um ca. 06:00 Uhr direkt von Ihrem Hotel in Hurghada. Fahrt nach Dendera (ca. 230 km, klimatisiertes Fahrzeug).': 'الاستلام حوالي الساعة 06:00 صباحاً مباشرة من فندقك في الغردقة. الرحلة إلى دندرة (حوالي 230 كم، بسيارة مكيفة).',
    'Nach Ihrer Ankunft in Kairo entdecken Sie die weltberühmten Pyramiden von Cheops, Chephren und Mykerinos sowie die beeindruckende Sphinx und den Taltempel.': 'بعد وصولكم إلى القاهرة تكتشفون أهرامات الجيزة الشهيرة عالمياً خوفو وخفرع ومنقرع بالإضافة إلى تمثال أبو الهول المهيب ومعبد الوادي.',
    'Besuch der Pyramiden und der Sphinx. Ausführliche Erklärungen durch den Ägyptologen.': 'زيارة الأهرامات وأبو الهول مع شروحات مفصلة من عالم الآثار.',
    'Genießen Sie ein leckeres Mittagessen in einem ausgewählten Restaurant in Kairo. (Getränke zum Mittagessen sind nicht im Preis enthalten).': 'استمتع بغداء لذيذ في مطعم مختار في القاهرة. (المشروبات غير مشمولة في السعر).',
    'Genießen Sie ein leckeres Mittagessen in einem landestypischen Restaurant.': 'استمتع بغداء لذيذ في مطعم تقليدي محلي.',
    'Nach dem Mittagessen erfolgt Rückfahrt nach Hurghada. Die Ankunft im Hotel ist gegen 21:00 Uhr geplant.': 'بعد الغداء تتم العودة إلى الغردقة. من المتوقع الوصول إلى الفندق حوالي الساعة 09:00 مساءً.',
    'Besuchen Sie die weltberühmten Pyramiden von Cheops, Chephren und Mykerinos – die letzten erhaltenen Weltwunder der Antike.': 'قم بزيارة أهرامات خوفو وخفرع ومنقرع الشهيرة عالمياً – آخر عجائب الدنيا القديمة الباقية.',
    'Besuchen Sie die berühmte Stufenpyramide von König Djoser – die älteste Steinpyramide der Welt – sowie die kunstvoll verzierten Gräber der Adligen.': 'قم بزيارة هرم زوسر المدرج الشهير – أقدم هرم حجري في العالم – بالإضافة إلى مقابر النبلاء المزخرفة بشكل فني.',
    'Entdecken Sie die einzigartige Architektur der Roten Pyramide und der berühmten Knickpyramide, die als wichtige Entwicklungsstufen des Pyramidenbaus gelten.': 'اكتشف الهندسة المعمارية الفريدة للهرم الأحمر والهرم المائل الشهير، اللذين يعتبران مراحل مهمة في تطور بناء الأهرامات.',
    'Ca. 2 Stunden Besichtigung des Abydos-Tempels.': 'حوالي ساعتين لزيارة معبد أبيدوس.',
    'Ca. 2 Stunden Besichtigung des Hathor-Tempels.': 'حوالي ساعتين لزيارة معبد حتحور.',
    'Fahrt durch die östliche Wüste zum Kloster St. Antonius.': 'رحلة عبر الصحراء الشرقية إلى دير القديس أنطونيوس.',
    'Besichtigung der historischen Kirchen, Fresken und Manuskripte.': 'زيارة الكنائس التاريخية واللوحات الجدارية والمخطوطات.',
    'Besichtigung des Klosters und der Kirche des Heiligen Paulus.': 'زيارة الدير وكنيسة القديس بولس.',
    'Höhle des Heiligen Antonius': 'كهف القديس أنطونيوس',
    'Aufstieg zur Höhle des Heiligen Antonius (optional).': 'الصعود إلى كهف القديس أنطونيوس (اختياري).',
    'Sakkara – Stufenpyramide des Djoser': 'سقارة – هرم زوسر المدرج',
    'Dahschur – Rote & Knickpyramide': 'دهشور – الهرم الأحمر والهرم المائل',
    'Besichtigung der Stufenpyramide und Einführung in die frühe Architektur.': 'زيارة الهرم المدرج والتعرف على العمارة المبكرة.',
    'Erkunden der Knickpyramide und der Roten Pyramide.': 'استكشاف الهرم المائل والهرم الأحمر.',
    'Gizeh': 'الجيزة',
    'Pyramiden von Gizeh': 'أهرامات الجيزة',
    'Die Pyramiden von Gizeh': 'أهرامات الجيزة',
    'Grand Egyptian Museum': 'المتحف المصري الكبير',
    'Grand Egyptian Museum (GEM)': 'المتحف المصري الكبير (GEM)',
    'Sakkara': 'سقارة',
    'Dahschur': 'دهشور',
    'Tal der Könige': 'وادي الملوك',
    'Tal der Könige – drei Grabkammern': 'وادي الملوك – ثلاث مقابر',
    'Hatschepsut-Tempel': 'معبد حتشبسوت',
    'Karnak-Tempel': 'معبد الكرنك',
    'Memnon-Kolosse': 'تماثيل ممنون',
    'Memnon-Kolosse – Fotostopp': 'تماثيل ممنون – توقف للتصوير',
    'Abu Tig Marina': 'مارينا أبو تيج',
    'Downtown El Gouna': 'وسط مدينة الجونة',
    'Der Aussichtsturm': 'برج المراقبة',
    'Makadi Water Park': 'ماكادي ووتر بارك',
    'Mini Egypt Park': 'منتزه ميني إيجيبت',
    'Eden Island': 'جزيرة إيدن',
    'Mahmya Insel & Mittagessen': 'جزيرة محمية والغداء',
    'Orange Bay oder Magawish Insel': 'جزيرة أورانج باي أو ماجاويش',
    'Hula Hula Insel': 'جزيرة هولا هولا',
    'Schiffswrack': 'حطام سفينة',
    'Ganztägiger Aufenthalt im Makadi Water Park. Bevorzugter Einlass mit organisiertem Zugang. Nutzung aller für Alter und Größe zugelassenen Attraktionen.': 'إقامة يوم كامل في ماكادي ووتر بارك. دخول مفضل مع وصول منظم. استخدام جميع الألعاب المسموح بها حسب العمر والطول.',
    'Ihr Guide holt Sie zwischen 09:00 und 10:00 Uhr in einem privaten, klimatisierten Fahrzeug ab. Von Hurghada aus erreichen wir El Gouna nach etwa 30 Minuten.': 'مرشدكم يستقبلكم بين الساعة 09:00 و10:00 في سيارة خاصة مكيفة. من الغردقة نصل إلى الجونة بعد حوالي 30 دقيقة.',
    'Die Tour beginnt mit einer entspannten Bootsfahrt durch die berühmten Lagunen. Sie sehen Luxushotels, Villen & exklusive Wohngebiete, Inseln und Wasserwege, den Yachthafen und architektonische Besonderheiten. Ihr Reiseleiter erzählt Ihnen die Geschichte der Stadt und spannende Details über die Gründerfamilie Sawiris.': 'تبدأ الجولة برحلة قارب مريحة عبر البحيرات الشهيرة. تشاهد الفنادق الفاخرة والفيلات والمناطق السكنية الحصرية والجزر والممرات المائية والمرسى والمعالم المعمارية. يروي لكم مرشدكم قصة المدينة وتفاصيل شيقة عن عائلة ساويرس المؤسسة.',
    'In der Innenstadt erwarten Sie Cafés, Boutiquen, Kunsthandwerk und kleine Plätze. Sie schlendern entspannt und genießen das moderne Flair der Stadt.': 'في وسط المدينة تنتظركم المقاهي والمحلات والحرف اليدوية والساحات الصغيرة. تتجولون باسترخاء وتستمتعون بأجواء المدينة العصرية.',
    'Eines der Highlights der Tour. Von oben sehen Sie das Meer, die Lagunen, die Wüstenberge und die Marina. Ein perfekter Ort für eindrucksvolle Fotos.': 'واحدة من أبرز محطات الجولة. من الأعلى ترى البحر والبحيرات والجبال الصحراوية والمرسى. مكان مثالي لصور رائعة.',
    'Spaziergang durch die Marina.': 'نزهة في المارينا.',
    'Genießen Sie den weiten Blick über das glitzernde Rote Meer. Spüren Sie die Meeresbrise und freuen Sie sich auf unvergessliche Momente.': 'استمتع بالمنظر الواسع للبحر الأحمر المتلألئ. اشعر بنسيم البحر واستعد للحظات لا تنسى.',
    'Bequemer Transfer von Ihrer Unterkunft in Hurghada.': 'نقل مريح من مكان إقامتك في الغردقة.',
    'Abholung direkt vom Hotel in Hurghada oder Makadi Bay.': 'استلام مباشر من الفندق في الغردقة أو ماكادي باي.',
    'Ihr Tag beginnt zwischen 7:30 und 8:00 Uhr mit dem komfortablen Hoteltransfer zum Hafen von Hurghada.': 'يبدأ يومك بين الساعة 7:30 و8:00 صباحاً بالنقل المريح من الفندق إلى ميناء الغردقة.',
    'Am frühen Morgen werden Sie direkt von Ihrem Hotel abgeholt und zum Hafen gebracht. Dort begrüßt Sie die freundliche Crew an Bord Ihres komfortablen Bootes.': 'في الصباح الباكر يتم استلامكم مباشرة من فندقكم ونقلكم إلى الميناء. هناك ترحب بكم الطاقم الودود على متن قاربكم المريح.',
    'Begrüßung, kurze Einweisung und Start der Bootstour.': 'ترحيب وتعليمات قصيرة وانطلاق جولة القارب.',
    'Fahrt zu den besten Delfinplätzen. Mit etwas Glück beobachten Sie Delfine in freier Wildbahn und können – sofern die Bedingungen es erlauben – gemeinsam mit ihnen schwimmen. Hinweis: Delfine sind Wildtiere. Eine Sichtung kann nicht garantiert werden, die Erfolgsquote ist jedoch sehr hoch.': 'الذهاب إلى أفضل أماكن الدلافين. مع بعض الحظ تشاهدون الدلافين في البرية ويمكنكم – إذا سمحت الظروف – السباحة معهم. ملاحظة: الدلافين حيوانات برية. لا يمكن ضمان المشاهدة لكن نسبة النجاح عالية جداً.',
    'Schnorchelstopp (30 Minuten)': 'توقف للغطس (30 دقيقة)',
    'Geführtes Schnorcheln an einem ruhigen Riff.': 'غطس بإرشاد في شعاب مرجانية هادئة.',
    'Frisch zubereitetes Mittagessen mit alkoholfreien Getränken an Bord oder auf der Insel.': 'غداء طازج مع مشروبات غير كحولية على متن القارب أو في الجزيرة.',
    'Entspannung an Bord während der Rückfahrt.': 'استرخاء على متن القارب أثناء العودة.',
    'Rückkehr zum Hafen und Transfer zurück zu Ihrem Hotel.': 'العودة إلى الميناء والنقل عائداً إلى فندقكم.',
    'Zwei Stopps an farbenprächtigen Riffen mit beeindruckender Unterwasserwelt.': 'محطتان في شعاب مرجانية زاهية الألوان مع عالم بحري مذهل.',
    'Zwei geführte Schnorchelstopps an sorgfältig ausgewählten Riffen mit hervorragender Sicht. Komplette Schnorchelausrüstung wird gestellt, professionelle Betreuung inklusive.': 'محطتان للغطس بإرشاد في شعاب مختارة بعناية مع رؤية ممتازة. معدات الغطس كاملة متوفرة مع إشراف محترف.',
    'Nach der Ausgabe Ihrer Schnorchelausrüstung und einer kurzen Einweisung beginnt die Fahrt über das tiefblaue Rote Meer. Schon bald erreichen Sie die ersten Schnorchelplätze mit bunten Fischen, Korallenformationen und mit etwas Glück sogar Meeresschildkröten oder Delfine.': 'بعد استلام معدات الغطس وتعليمات قصيرة تبدأ الرحلة عبر البحر الأحمر العميق. سرعان ما تصلون إلى أماكن الغطس الأولى مع الأسماك الملونة وتشكيلات المرجان ومع الحظ السلاحف البحرية أو الدلافين.',
    'Das Rote Meer zählt zu den schönsten Schnorchelgebieten weltweit. Entdecken Sie farbenreiche Korallenriffe, tropische Rifffische, Schildkröten, Rochen und Napoleonfische bei klarem, warmem Wasser mit sehr guter Sicht.': 'يعتبر البحر الأحمر من أجمل مناطق الغطس في العالم. اكتشف الشعاب المرجانية الملونة والأسماك الاستوائية والسلاحف والشفنين وسمك نابليون في مياه صافية دافئة مع رؤية ممتازة.',
    'Aufenthalt an einer abgelegenen Insel mit hellem Sandstrand. Hier haben Sie ausreichend Zeit zum Schwimmen, Sonnenbaden oder Entspannen. Durch die private Organisation der Tour vermeiden Sie Menschenansammlungen und genießen die Natur in ruhiger Atmosphäre.': 'الإقامة في جزيرة نائية بشاطئ رملي فاتح. لديكم وقت كافٍ للسباحة أو الاستلقاء تحت الشمس أو الاسترخاء. بفضل التنظيم الخاص للجولة تتجنبون الزحام وتستمتعون بالطبيعة في أجواء هادئة.',
    'Entdecken Sie ein faszinierendes Schiffswrack mit einer beeindruckenden Unterwasserwelt voller Fische und Korallen.': 'اكتشف حطام سفينة رائع مع عالم بحري مذهل مليء بالأسماك والشعاب المرجانية.',
    'Verbringen Sie mehrere Stunden am Eden Island Beach, schwimmen Sie im türkisfarbenen Wasser oder entspannen Sie am Strand.': 'اقضِ عدة ساعات على شاطئ جزيرة إيدن، اسبح في المياه الفيروزية أو استرخِ على الشاطئ.',
    'Mehrere Stunden Freizeit auf der Insel zum Baden, Entspannen, Sonnen, Fotografieren und Genießen der einzigartigen Atmosphäre.': 'عدة ساعات من الوقت الحر في الجزيرة للسباحة والاسترخاء والحمامات الشمسية والتصوير والاستمتاع بالأجواء الفريدة.',
    'Nach einem ereignisreichen Tag geht es zurück zum Hafen und anschließend zu Ihrem Hotel – mit vielen neuen Eindrücken und glücklichen Erinnerungen.': 'بعد يوم حافل نعود إلى الميناء ثم إلى فندقكم – مع الكثير من الانطباعات الجديدة والذكريات السعيدة.',
    'Fahrt mit einem modernen Ausflugsboot oder einer komfortablen Yacht Richtung Orange Bay Island. Softdrinks sind an Bord inklusive.': 'الذهاب بقارب رحلات حديث أو يخت مريح باتجاه جزيرة أورانج باي. المشروبات الغازية مشمولة على متن القارب.',
    'Entspannen Sie an den weißen Sandstränden, schwimmen Sie im kristallklaren Wasser oder schnorcheln Sie direkt vom Strand aus. Liegen und Sonnenschirme stehen für Sie bereit.': 'استرخوا على الشواطئ الرملية البيضاء، اسبحوا في المياه الصافية أو مارسوا الغطس مباشرة من الشاطئ. كراسي الاستلقاء والمظلات في انتظاركم.',
    'Nutzen Sie die verbleibende Zeit zum Schwimmen, Schnorcheln oder Entspannen am Strand, bevor Sie am Nachmittag mit dem Boot zurück zum Hafen fahren und anschließend zu Ihrem Hotel gebracht werden.': 'استغلوا الوقت المتبقي للسباحة أو الغطس أو الاسترخاء على الشاطئ قبل العودة بالقارب إلى الميناء ومن ثم النقل إلى فندقكم.',
    'Am Nachmittag kehren Sie entspannt zum Hafen zurück und werden zu Ihrem Hotel gebracht.': 'بعد الظهر تعودون باسترخاء إلى الميناء ومن ثم يتم نقلكم إلى فندقكم.',
    'Nach der Ankunft auf der Mahmya Insel genießen Sie die traumhafte Kulisse und ein frisch zubereitetes Mittagsbuffet in einem Restaurant direkt am Meer. Der restliche Tag gehört ganz Ihnen: Entspannen, Schwimmen, die Insel erkunden oder die Ruhe und Sonne genießen.': 'بعد الوصول إلى جزيرة محمية تستمتعون بالمناظر الخلابة وبوفيه غداء طازج في مطعم مباشر على البحر. باقي اليوم لكم بالكامل: استرخاء، سباحة، استكشاف الجزيرة أو الاستمتاع بالهدوء والشمس.',
    'Bootsfahrt zur Hula Hula Insel': 'رحلة بالقارب إلى جزيرة هولا هولا',
    'Fahrt über die Korallenriffe mit direktem Blick in die Unterwasserwelt.': 'المرور فوق الشعاب المرجانية مع إطلالة مباشرة على العالم البحري.',
    'Entdecken Sie die beeindruckenden Schätze des alten Ägyptens, darunter die berühmte Goldmaske des Tutanchamun.': 'اكتشف الكنوز المذهلة لمصر القديمة، بما في ذلك قناع توت عنخ آمون الذهبي الشهير.',
    'Beginnen Sie Ihre Tour durch mehr als 24 faszinierende Themenbereiche mit exotischen Meeresbewohnern, bunten Korallenriffen und beeindruckenden Großaquarien des Roten Meeres.': 'ابدأ جولتك عبر أكثر من 24 منطقة مواضيعية رائعة مع كائنات بحرية غريبة وشعاب مرجانية ملونة وأحواض مائية كبيرة مذهلة للبحر الأحمر.',
    'Erleben Sie den spektakulären 24 Meter langen Unterwassertunnel und beobachten Sie Haie, Rochen und zahlreiche Fischarten aus nächster Nähe – ein unvergessliches Erlebnis für die ganze Familie.': 'عايش النفق المائي المذهل بطول 24 متراً وشاهد أسماك القرش والشفنين والعديد من أنواع الأسماك عن قرب – تجربة لا تنسى للعائلة بأكملها.',
    'Nach Ihrer Ankunft betreten Sie eines der größten und modernsten Aquarien Ägyptens. Dank Ihres Online-Tickets genießen Sie einen schnellen und unkomplizierten Eintritt ohne lange Wartezeiten.': 'بعد وصولكم تدخلون واحداً من أكبر وأحدث أحواض السمك في مصر. بفضل تذكرتكم الإلكترونية تستمتعون بدخول سريع وسهل دون انتظار طويل.',
    'Kinder und Erwachsene können das interaktive Streichelbecken entdecken und an den Tierfütterungen sowie spannenden Live-Vorführungen teilnehmen.': 'يمكن للأطفال والكبار اكتشاف حوض اللمس التفاعلي والمشاركة في إطعام الحيوانات والعروض الحية المثيرة.',
    'Besuchen Sie die tropische Regenwaldzone sowie den kleinen Zoo mit exotischen Vögeln, Reptilien und weiteren faszinierenden Tieren aus verschiedenen Regionen der Welt.': 'زوروا منطقة الغابات المطيرة الاستوائية وحديقة الحيوانات الصغيرة مع الطيور الغريبة والزواحف والحيوانات الرائعة من مختلف مناطق العالم.',
    'Freizeit im Park – Zeit für Fotos, Staunen und kleine Entdeckungen.': 'وقت حر في الحديقة – وقت للصور والدهشة والاكتشافات الصغيرة.',
    'Ankunft im Mini Egypt Park – dein persönlicher Guide begrüßt dich.': 'الوصول إلى منتزه ميني إيجيبت – مرشدك الشخصي يرحب بك.',
    'Geführte Tour durch Ägyptens Miniaturwunder: Die Pyramiden von Gizeh & die Sphinx, Der Tempel von Abu Simbel & der Assuan-Staudamm, Die beeindruckenden Tempel von Luxor mit dem berühmten Karnak-Tempel, Das Ägyptische Museum in Kairo, Alexandria mit Stanley-Brücke & Montazah-Palast.': 'جولة إرشادية عبر عجائب مصر المصغرة: أهرامات الجيزة وأبو الهول، معبد أبو سمبل وسد أسوان، معابد الأقصر المذهلة مع معبد الكرنك الشهير، المتحف المصري في القاهرة، الإسكندرية مع كوبري ستانلي وقصر المنتزه.',
    'Ein reichhaltiges Buffet mit lokalen und internationalen Speisen erwartet Sie während des Ausflugs.': 'بوفيه غني بالأطباق المحلية والعالمية بانتظاركم خلال الرحلة.',
    'Tauchen Sie ein in das farbenfrohe Markttreiben und erleben Sie die authentische Atmosphäre eines ägyptischen Basars.': 'اغوصوا في أجواء السوق الملونة وعايشوا الأجواء الأصيلة للبازار المصري.',
    'Sie spazieren entlang der gepflegten Promenade, sehen Luxusyachten und genießen die mediterrane Atmosphäre. Wer möchte, kann noch einen Tee oder Kaffee mit Blick auf die Boote trinken (optional).': 'تتجولون على طول الكورنيز الأنيق، تشاهدون اليخوت الفاخرة وتستمتعون بأجواء البحر المتوسط. من أراد يمكنه تناول شاي أو قهوة مع إطلالة على القوارب (اختياري).',
    'Gemeinsam besuchen wir einige der wichtigsten Sehenswürdigkeiten: koptische Kirche, Große Moschee und Außenstelle der Bibliotheca Alexandrina. Eine ideale Mischung aus Kultur und moderner Stadtplanung.': 'معاً نزور بعضاً من أهم المعالم: الكنيسة القبطية والمسجد الكبير وفرع مكتبة الإسكندرية. مزيج مثالي من الثقافة والتخطيط العمراني الحديث.',
    'Besuch des Fischmarktes und der Großen Moschee.': 'زيارة سوق السمك والمسجد الكبير.',
    'Pause im ägyptischen Café.': 'استراحة في مقهى مصري.',
    'Weiterfahrt zum Obst- und Gemüsemarkt.': 'مواصلة الرحلة إلى سوق الفواكه والخضروات.',
    'Entdecken Sie traditionelle Produkte: handgemachte Lederwaren, Parfümöle, Papyrusrollen, Gewürze, Schmuck und vieles mehr.': 'اكتشف المنتجات التقليدية: المصنوعات الجلدية اليدوية، زيوت العطور، لفائف البردي، البهارات، المجوهرات وأكثر.',
    'Nach vielen schönen Eindrücken fahren wir zurück nach Hurghada.': 'بعد العديد من الانطباعات الجميلة نعود إلى الغردقة.',
    'Fahren Sie über Sanddünen und erleben Sie echtes Offroad-Feeling.': 'قودوا على الكثبان الرملية وعايشوا شعور القيادة على الطرق الوعرة الحقيقية.',
    'Kurze Einführung – danach direkt auf das Quad.': 'تعليمات قصيرة – ثم مباشرة على الكواد.',
    'Beduinendorf & Tee': 'قرية بدوية وشاي',
    'Einblick in die Kultur der Wüste inklusive traditionellem Tee.': 'اطلع على ثقافة الصحراء مع شاي تقليدي.',
    'Kurzes, authentisches Erlebnis für Fotos & Eindrücke.': 'تجربة أصيلة قصيرة للصور والانطباعات.',
    'Jeep-Safari zum Beduinendorf. Kamelritt und Dorfbesuch.': 'سفاري جيب إلى القرية البدوية. ركوب الجمل وزيارة القرية.',
    'BBQ-Abendessen und Folklore-Show.': 'عشاء شواء وعرض فولكلوري.',
    'Sonnenuntergang in der Wüste.': 'غروب الشمس في الصحراء.',
    'Rückfahrt zum Hafen und Transfer zurück ins Hotel.': 'العودة إلى الميناء والنقل عائداً إلى الفندق.',
    'Rückfahrt zum Hafen & Transfer zum Hotel.': 'العودة إلى الميناء والنقل إلى الفندق.',
    'Rückfahrt nach Hurghada. Ankunft: ca. 17:00 Uhr.': 'العودة إلى الغردقة. الوصول: حوالي الساعة 05:00 مساءً.',
    'Rückfahrt nach Hurghada. Gesamt ca. 13 Stunden.': 'العودة إلى الغردقة. إجمالي الرحلة حوالي 13 ساعة.',
    'Ankunft gegen 20:00 Uhr in Ihrem Hotel.': 'الوصول إلى فندقكم حوالي الساعة 08:00 مساءً.',
    'Gegen 20 Uhr erreichen Sie wieder Ihr Hotel. Die Eindrücke dieses Tages wirken oft noch lange nach.': 'حوالي الساعة 08:00 مساءً تعودون إلى فندقكم. انطباعات هذا اليوم تبقى غالباً لفترة طويلة.',
    'Gegen 12:00 Uhr Rückkehr und Transfer ins Hotel.': 'حوالي الساعة 12:00 ظهراً العودة والنقل إلى الفندق.',
    'Nach dem Frühstück beginnt die Weiterreise zu den ältesten Pyramiden Ägyptens.': 'بعد الفطور تبدأ الرحلة إلى أقدم أهرامات مصر.',
    'Übernachtung in Kairo': 'المبيت في القاهرة',
    'Nach dem Besichtigungsprogramm erfolgt die Fahrt zum Hotel in Kairo inklusive Übernachtung.': 'بعد برنامج الزيارة يتم الانتقال إلى الفندق في القاهرة مع المبيت.',
    'Nach der Besichtigung erwartet Sie ein frisch zubereitetes ägyptisches Mittagessen, liebevoll serviert und ideal zum Entspannen vor dem nächsten Höhepunkt.': 'بعد الزيارة ينتظركم غداء مصري طازج مُعد بحب ومثالي للاسترخاء قبل المحطة التالية.',
    'Zum Finale Ihres Ausflugs entdecken Sie den größten Tempelkomplex Ägyptens. Tempel, gewaltige Säulen, Jahrtausende Kultur – ein würdiger Abschluss.': 'في ختام رحلتكم تكتشفون أكبر مجمع معابد في مصر. معابد، أعمدة هائلة، آلاف السنين من الثقافة – ختام يليق بالرحلة.',
    'Der erste Blick auf die gewaltigen Säulen des Karnak-Tempels wirkt wie ein Tor in eine andere Welt. Ihr Ägyptologe begleitet Sie durch die Anlage und zeigt Ihnen verborgene Details, die man allein kaum bemerken würde.': 'النظرة الأولى للأعمدة الهائلة لمعبد الكرنك تبدو كبوابة لعالم آخر. يرافقكم عالم الآثار عبر الموقع ويريكم تفاصيل مخفية لا تكاد ت noticed وحدكم.',
    'Ein Tempel wie aus einem Fels geschnitten. Würde, Geschichte, klare Linien.': 'معبد وكأنه منحوت من الصخر. وقار، تاريخ، خطوط واضحة.',
    'Ein Ort, der überrascht. Von außen unscheinbar, im Inneren farbenprächtig und fein wie eine Schatzkammer. Die kunstvollen Wandmalereien erzählen von Glauben, Macht und Unsterblichkeit. Fotografieren ist mit dem Handy inzwischen kostenlos erlaubt.': 'مكان مفاجئ. من الخارج متواضع، من الداخل زاهي الألوان ودقيق كغرفة كنز. الرسوم الجدارية الفنية تروي قصص الإيمان والقوة والخلود. التصوير بالهاتف مسموح مجاناً الآن.',
    'Zwei riesige Statuen, die seit Jahrtausenden am Nilufer stehen und die Reisenden willkommen heißen.': 'تمثالان عملاقان يقفان على ضفة النيل منذ آلاف السنين يرحبان بالمسافرين.',
    'Die monumentalen Wächterfiguren des Amenophis III. erwarten Sie bereits.': 'تماثيل الحراسة الضخمة لأمنحتب الثالث بانتظاركم.',
    'Ein Bauwerk, das wie eine Bühne vor der Felswand liegt. Klar, symmetrisch, kraftvoll. Ein perfekter Platz für eindrucksvolle Fotos.': 'بناء يبدو كمسرح أمام الجرف. واضح، متماثل، قوي. مكان مثالي لصور رائعة.',
    'Erkunden Sie die Gräber der Pharaonen, deren Wandmalereien seit Jahrtausenden leuchten.': 'استكشف مقابر الفراعنة التي لا تزال رسومها الجدارية متألقة منذ آلاف السنين.',
    'Sie genießen ein entspanntes Abendessen und beziehen Ihr ausgewähltes Hotel, bevor die Nacht zur Vorbereitung auf das morgendliche Abenteuer ruht.': 'تستمتعون بعشاء مريح وتتوجهون إلى فندقكم المختار قبل أن يحل الليل استعداداً لمغامرة الصباح.',
    'Gegen 4:00 Uhr startet Ihre Heißluftballonfahrt. Während die Sonne langsam das Niltal färbt, schweben Sie über Tempel, Felder und den Westjordan des antiken Theben. Ein Moment, der Ihrem Reisealbum Glanz verleiht.': 'حوالي الساعة 04:00 صباحاً تبدأ رحلة البالون. بينما تلون الشمس وادي النيل ببطء، تحلقون فوق المعابد والحقول والضفة الغربية لطيبة القديمة. لحظة تضفي بريقاً على ألبوم رحلتكم.',
    'Ein reichhaltiges ägyptisches Menü bietet Stärkung für den weiteren Tag.': 'قائمة طعام مصرية غنية تمدكم بالطاقة لبقية اليوم.',
    'Anschließend besuchen Sie das spektakuläre Grand Egyptian Museum – das größte archäologische Museum der Welt mit einzigartigen Schätzen des alten Ägyptens.': 'بعدها تزورون المتحف المصري الكبير المذهل – أكبر متحف أثري في العالم بكنوز فريدة لمصر القديمة.',
    'Besichtigung der berühmten Hathor-Säulenhalle und der astronomischen Decke.': 'زيارة قاعة أعمدة حتحور الشهيرة والسقف الفلكي.',
    'Besuch ausgewählter Bereiche wie Mamisi, Heiliger See und Tempelanlage.': 'زيارة مناطق مختارة مثل الماميسي والبحيرة المقدسة ومجمع المعابد.',
    'Fotostopps & Erlebnismomente': 'توقف للتصوير ولحظات ممتعة',
    'Entspannt zurück nach Ihrer Tour.': 'عودة مريحة بعد جولتكم.',
    'Abflug': 'الإقلاع',
    'Nach Ihrer Ankunft betreten Sie eines der größten und modernsten Aquarien Ägyptens.': 'بعد وصولكم تدخلون واحداً من أكبر وأحدث أحواض السمك في مصر.',
    'Erkunden Sie die farbenfrohe Unterwasserwelt mit exotischen Fischen und beeindruckenden Korallenriffen. Schnorchelausrüstung wird bereitgestellt.': 'استكشف عالم ما تحت الماء الزاهي بالألوان مع الأسماك الغريبة والشعاب المرجانية المذهلة. معدات الغطس متوفرة.',
    'Entdecken Sie ein faszinierendes Schiffswrack': 'اكتشف حطام سفينة رائع',
    'Persönliche Begrüßung, Ausrüstung, kurze Einweisung – danach beginnt Ihr Abenteuer.': 'ترحيب شخصي، معدات، تعليمات قصيرة – ثم تبدأ مغامرتك.',
    'Schnorcheln und Strandzeit': 'غطس ووقت على الشاطئ',
    'Nach der Ausgabe Ihrer Schnorchelausrüstung startet die 40-minütige Bootsfahrt zu den faszinierendsten Riffen rund um Eden Island. Hier erwarten Sie bunte Korallenriffe und tropische Fische – ein Paradies für Schnorchler.': 'بعد استلام معدات الغطس تبدأ رحلة القارب لمدة 40 دقيقة إلى أروع الشعاب حول جزيرة إيدن. هنا تنتظركم الشعاب المرجانية الملونة والأسماك الاستوائية – جنة للغطاسين.',
    'Ihr erfahrener, deutschsprachiger Reiseleiter holt Sie in einem klimatisierten Fahrzeug ab und bringt Sie sicher zum Hafen.': 'مرشدكم السياحي ذو الخبرة والناطق بالألمانية يستقبلكم بسيارة مكيفة ويوصلكم بأمان إلى الميناء.',
    'Abholung direkt von Ihrem Hotel in einem privaten, klimatisierten Fahrzeug': 'استلام مباشر من فندقكم بسيارة خاصة مكيفة',
    'Abholung in Hurghada, El Gouna, Makadi Bay, Soma Bay oder Safaga.': 'الاستلام في الغردقة أو الجونة أو ماكادي باي أو سوما باي أو سفاجا.',
    // More complex patterns - word-level fallback
    'Abholung': 'الاستلام',
    'Ankunft': 'الوصول',
    'Fahrt': 'رحلة',
    'Mittagessen': 'الغداء',
    'Rückfahrt': 'العودة',
    'Rücktransfer': 'النقل العائد',
    'Frühstück': 'الفطور',
    'Abendessen': 'العشاء',
    'Hotelabholung': 'الاستلام من الفندق',
    'Rückkehr': 'العودة',
    'Schnorcheln': 'الغطس',
    'schnorcheln': 'الغطس',
    'Schnorchelausflug': 'رحلة غطس',
    'Besichtigung': 'الزيارة',
    'Kamelritt': 'ركوب الجمل',
    'Beduinen': 'البدو',
    'Wüstenstation': 'محطة الصحراء',
    'Glasbodenboot': 'قارب ذو قاع زجاجي',
    'Spider-Buggy': 'سيارة سبايدر بغي',
    'Lagunenfahrt': 'جولة بحرية في البحيرات',
    'Weiterfahrt': 'مواصلة الرحلة',
    'Aufenthalt': 'الإقامة',
    'Entspannung': 'الاسترخاء',
    'Einschiffung': 'الصعود على متن القارب',
    'Stadtrundfahrt': 'جولة في المدينة',
    'Ausflug': 'رحلة',
    'Privater': 'خاص',
    'privater': 'خاص',
    'privaten': 'خاص',
    'Hotel': 'فندق',
    'Strand': 'شاطئ',
    'Wüste': 'صحراء',
    'Insel': 'جزيرة',
    'Hafen': 'ميناء',
    'Boot': 'قارب',
    'Tour': 'جولة',
    'Nacht': 'ليلة',
    'Tag': 'يوم',
    'Stunden': 'ساعة',
    'Stunde': 'ساعة',
    'Minuten': 'دقيقة',
    'Gesamt': 'الإجمالي',
    'gesamt': 'الإجمالي',
    'Uhr': '',
    'ca.': 'حوالي',
    'inklusive': 'بما في ذلك',
    'Begrüßung': 'ترحيب',
    'Einweisung': 'تعليمات',
    'Vorbereitung': 'تحضير',
    'Sicherheitseinweisung': 'تعليمات السلامة',
    'Abenteuer': 'مغامرة',
    'Erlebnis': 'تجربة',
    'Führung': 'جولة إرشادية',
    'Geführte Tour': 'جولة إرشادية',
    'Kultur & Architektur': 'الثقافة والعمارة',
    'Bootsfahrt': 'رحلة بالقارب',
    'Schnorchelausrüstung': 'معدات الغطس',
    'Reiseleiter': 'مرشد سياحي',
    'deutschsprachiger': 'ناطق بالألمانية',
    'klimatisierten Fahrzeug': 'سيارة مكيفة',
    'klimatisierten Privatfahrzeug': 'سيارة خاصة مكيفة',
    'Wassersportaktivitäten': 'أنشطة رياضية مائية',
    'Traditionelle ägyptische Spezialitäten in einem Gartenrestaurant.': 'مأكولات مصرية تقليدية في مطعم حديقة.',
    'Gesamt ca.': 'الإجمالي حوالي',
    'Abend': 'مساء',
    'Morgen': 'صباح',
    'Nachmittag': 'بعد الظهر',
    'Vormittag': 'قبل الظهر',
    'Nacht': 'ليلة',
    'ca. 04:00 Uhr': 'حوالي الساعة 04:00 صباحاً',
    'ca. 05:00 Uhr': 'حوالي الساعة 05:00 صباحاً',
    'ca. 06:00 Uhr': 'حوالي الساعة 06:00 صباحاً',
    'ca. 07:00 Uhr': 'حوالي الساعة 07:00 صباحاً',
    'ca. 08:00 Uhr': 'حوالي الساعة 08:00 صباحاً',
    'ca. 09:00 Uhr': 'حوالي الساعة 09:00 صباحاً',
    'ca. 10:00 Uhr': 'حوالي الساعة 10:00 صباحاً',
    'ca. 11:00 Uhr': 'حوالي الساعة 11:00 صباحاً',
    'ca. 12:00 Uhr': 'حوالي الساعة 12:00 ظهراً',
    'ca. 13:00 Uhr': 'حوالي الساعة 01:00 مساءً',
    'ca. 14:00 Uhr': 'حوالي الساعة 02:00 مساءً',
    'ca. 15:00 Uhr': 'حوالي الساعة 03:00 مساءً',
    'ca. 16:00 Uhr': 'حوالي الساعة 04:00 مساءً',
    'ca. 17:00 Uhr': 'حوالي الساعة 05:00 مساءً',
    'ca. 18:00 Uhr': 'حوالي الساعة 06:00 مساءً',
    'ca. 19:00 Uhr': 'حوالي الساعة 07:00 مساءً',
    'ca. 20:00 Uhr': 'حوالي الساعة 08:00 مساءً',
    'ca. 21:00 Uhr': 'حوالي الساعة 09:00 مساءً',
    'ca. 22:00 Uhr': 'حوالي الساعة 10:00 مساءً',
    'ca. 23:00 Uhr': 'حوالي الساعة 11:00 مساءً',
  };

  // Apply translations - sort by length (longest first) to avoid partial matches
  const sorted = Object.entries(dict).sort((a, b) => b[0].length - a[0].length);
  let result = content;
  for (const [de, ar] of sorted) {
    // Match whole German phrases, case-insensitive where applicable
    const escaped = de.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'gi');
    if (regex.test(result)) {
      result = result.replace(regex, ar);
    }
  }

  // Clean up artifacts
  result = result.replace(/\s+/g, ' ').trim();
  // Remove leftover "Uhr" if any
  result = result.replace(/\bUhr\b/g, '');
  // Clean double spaces
  result = result.replace(/،\s*،/g, '،');
  result = result.replace(/\.\s*\./g, '.');
  // Fix time format "04:00 " → leave as is for Arabic
  return result;
}

function translateFAQ(deFaq, locale) {
  // Basic Arabic FAQ translations based on common patterns
  const qMap = {
    '⏳Wie lange dauert der Tagesausflug von Hurghada nach Kairo?': { q: '⏳كم تستغرق الرحلة النهارية من الغردقة إلى القاهرة؟', a: 'تستغرق الرحلة حوالي 15 ساعة. نستلمكم حوالي الساعة 04:00 صباحاً من فندقكم، نسافر بالطائرة إلى القاهرة، نزور المعالم ونعود إلى الفندق حوالي الساعة 08:15 مساءً.' },
    '🏛️Welche Sehenswürdigkeiten werden besucht?': { q: '🏛️ما المعالم السياحية التي تتم زيارتها؟', a: 'تزورون أهرامات الجيزة الشهيرة عالمياً وأبو الهول بالإضافة إلى – حسب رغبتكم – المتحف المصري الكبير أو المتحف المصري. كما تستمتعون بغداء في مطعم على النيل ويرافقكم طوال اليوم عالم آثار ناطق بالألمانية.' },
    '👶Ist der Ausflug für Kinder geeignet?': { q: '👶هل الرحلة مناسبة للأطفال؟', a: 'نعم، الرحلة مناسبة للعائلات.\n\n0–2 سنة: 200 يورو\n\n3–10 سنوات: 240 يورو\n\nمن 11 سنة: السعر الكامل' },
    '🚘Gibt es einen Transfer von Marsa Alam oder El Quseir?': { q: '🚘هل يوجد نقل من مرسى علم أو القصير؟', a: 'نعم، ننظم نقلاً إلى مطار الغردقة.\n\nمرسى علم: +50 يورو للشخص\n\nالقصير: +35 يورو للشخص' },
    '✔️Was ist im Preis enthalten?': { q: '✔️ما هو مشمول في السعر؟', a: 'رحلة طيران ذهاب وعودة الغردقة ↔ القاهرة\n\nنقل بسيارات مكيفة\n\nرسوم الدخول حسب البرنامج\n\nعالم آثار ناطق بالألمانية\n\nغداء مع مشروب غازي' },
    '🏛️Kann ich wählen, welches Museum ich besuche?': { q: '🏛️هل يمكنني اختيار المتحف الذي أزوره؟', a: 'نعم، يمكنكم الاختيار بين المتحف المصري الكبير أو المتحف المصري حسب اهتمامكم.' },
    '👥Wie viele Personen sind in einer Gruppe?': { q: '👥كم عدد الأشخاص في المجموعة؟', a: 'الجولة تتم كرحلة خاصة أو في مجموعات صغيرة بحد أقصى 8 أشخاص. هكذا تستمتعون بأجواء مريحة ووقت كافٍ في جميع المعالم.' },
    '🗣️Wann sollte ich buchen?': { q: '🗣️متى يجب أن أحجز؟', a: 'ننصح بالحجز المبكر، خاصة في موسم الذروة، لضمان الحصول على التاريخ المطلوب.' },
    '🛠️Kann ich den Ausflug auch individuell anpassen?': { q: '🛠️هل يمكنني تخصيص الرحلة؟', a: 'نعم، جولتنا مرنة. يمكنكم تعديل ترتيب المعالم أو إضافة محطات إضافية حسب الرغبة.' },
    '💶Wie läuft die Bezahlung ab?': { q: '💶كيف تتم عملية الدفع؟', a: 'عبر الإنترنت من خلال موقعنا أو عن طريق الاستفسار بالبريد الإلكتروني\n\nدفع آمن قبل المغادرة\n\nلا توجد رسوم خفية' },
    // More general FAQ translations
    '⏳Wie lange dauert der Ausflug?': { q: '⏳كم تستغرق الرحلة؟', a: 'تستغرق الرحلة طول اليوم.' },
    'Welche Sehenswürdigkeiten werden besucht?': { q: 'ما المعالم التي تتم زيارتها؟', a: 'أهرامات الجيزة والمتحف المصري الكبير.' },
  };
  
  const found = qMap[deFaq.question];
  if (found) return { question: found.q, answer: found.a };
  
  // Generic fallback: keep German text (better than nothing)
  return { question: deFaq.question, answer: deFaq.answer };
}

function translateListItem(text, locale) {
  const d = {
    'Pyramiden von Gizeh & Sphinx – UNESCO Weltkulturerbe & einziges Weltwunder der Antike': 'أهرامات الجيزة وأبو الهول – تراث عالمي لليونسكو وأعجوبة العالم القديم الوحيدة',
    'Grand Egyptian Museum': 'المتحف المصري الكبير',
    'Mittagessen am Nil – lokale Spezialitäten': 'غداء على النيل – مأكولات محلية',
    'Direktflug Hurghada – Kairo – Hurghada': 'رحلة طيران مباشرة الغردقة – القاهرة – الغردقة',
    'Deutschsprachiger Ägyptologe – persönliche Führung den ganzen Tag': 'عالم آثار ناطق بالألمانية – مرافقة شخصية طوال اليوم',
    'Flug Hurghada – Kairo – Hurghada': 'رحلة طيران الغردقة – القاهرة – الغردقة',
    'Flug ab Hurghada': 'رحلة طيران من الغردقة',
    'Privater Transfer im klimatisierten Fahrzeug': 'نقل خاص بسيارة مكيفة',
    'Privater Transfer': 'نقل خاص',
    'Privater Guide': 'مرشد خاص',
  };
  return d[text] || text;
}

main().catch(console.error);
