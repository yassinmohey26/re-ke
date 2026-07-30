require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const { createClient } = require('@supabase/supabase-js');
const IS_DRY_RUN = !process.argv.includes('--execute');

const TRANSLATIONS = new Map([
  // Row 0009b90b - Glasbodenboot
  ['Geführtes Schnorcheln an einem ruhigen Riff.', 'غطس بإرشاد في شعاب هادئة.'],

  // Row 17a82d9b - Mahmya
  ['Am frühen Morgen werden Sie direkt von Ihrem Hotel abgeholt und zum Hafen gebracht. Dort begrüsst Sie die freundliche Crew an Bord Ihres komfortablen Bootes.',
    'في الصباح الباكر يتم استقبالك من فندقك والذهاب إلى الميناء. هناك تستقبلك الطاقم الودود على متن قاربك المريح.'],
  ['Nach der Ausgabe Ihrer Schnorchelausrüstung und einer kurzen Einweisung beginnt die Fahrt über das tiefblaue Rote Meer. Schon bald erreichen Sie die ersten Schnorchelplätze mit bunten Fischen, Korallenformationen und mit etwas Glück sogar Meeresschildkröten oder Delfine.',
    'بعد توزيع معدات الغطس وتعليمات قصيرة تبدأ الرحلة عبر البحر الأحمر. قريباً تصل إلى أول مواقع الغطس مع الأسماك الملونة وتشكيلات المرجان ومع الحظ السلاحف البحرية أو الدلافين.'],
  ['Nach der Ankunft auf der Mahmya Insel geniessen Sie die traumhafte Kulisse und ein frisch zubereitetes Mittagsbuffet in einem Restaurant direkt am Meer. Der restliche Tag gehört ganz Ihnen: Entspannen, Schwimmen, die Insel erkunden oder die Ruhe und Sonne geniessen.',
    'بعد الوصول إلى جزيرة الماهيا تستمتع بالمناظر الخلابة وبوفيه غداء طازج في مطعم على البحر. باقي اليوم لك: استرخاء وسباحة واستكشاف الجزيرة أو الاستمتاع بالهدوء والشمس.'],

  // Row 1c5a3c79 - Luxor Balloon
  ['Sie geniessen ein entspanntes Abendessen und beziehen Ihr ausgewähltes Hotel, bevor die Nacht zur Vorbereitung auf das morgendliche Abenteuer ruft.',
    'تستمتع بعشاء مريح وتتوجه إلى فندقك المختار قبل أن تدعوك الليلة للاستعداد لمغامرة الصباح.'],
  ['Gegen 4:00 Uhr startet Ihre Heissluftballonfahrt. Während die Sonne langsam das Niltal färbt, schweben Sie über Tempel, Felder und den Westjordan des antiken Theben. Ein Moment, der Ihrem Reisealbum Glanz verleiht.',
    'حوالي الساعة 4:00 تبدأ رحلة البالون. بينما تلون الشمس وادي النيل ببطء، تحلق فوق المعابد والحقول والضفة الغربية لطيبة القديمة. لحظة تضفي رونقاً على ألبوم رحلاتك.'],
  ['Ein reichhaltiges ägyptisches Menü bietet Stärkung für den weiteren Tag.', 'وجبة مصرية غنية تمدك بالطاقة لبقية اليوم.'],

  // Row 27ae0b35 - Delfin Tour
  ['Herzlicher Empfang, Ausrüstung, kurze Einweisung – danach beginnt Ihr Abenteuer.', 'استقبال حار وتجهيزات وتعليمات سريعة – ثم تبدأ مغامرتك.'],
  ['Zwei Stopps an farbenprächtigen Riffen mit beeindruckender Unterwasserwelt.', 'محطتان في شعاب مرجانية ملونة مع عالم تحت مائي رائع.'],
  ['Entdecken Sie ein faszinierendes Schiffswrack mit einer beeindruckenden Unterwasserwelt voller Fische und Korallen.',
    'اكتشف حطام سفينة رائع مع عالم تحت الماء مثير مليء بالأسماك والشعاب المرجانية.'],

  // Row 2dc6864a - Monastery
  ['Fahrt durch die östliche Wüste zum Kloster St. Antonius.', 'رحلة عبر الصحراء الشرقية إلى دير القديس أنطونيوس.'],
  ['Besichtigung der historischen Kirchen, Fresken und Manuskripte.', 'زيارة الكنائس التاريخية واللوحات الجدارية والمخطوطات.'],

  // Row 380712ad - Quad
  ['Einblick in die Kultur der Wüste inklusive traditionellem Tee.', 'اطلاع على ثقافة الصحراء مع الشاي التقليدي.'],

  // Row 4f91f20d - Shopping
  ['Wir holen Sie bequem von Ihrem Hotel in Hurghada oder Umgebung ab.', 'نستقبلك براحة من فندقك في الغردقة أو المناطق المحيطة.'],

  // Row 65f786e7 - Cairo by flight
  ['Abholung vom Hotel in Hurghada', 'الاستقبال من الفندق في الغردقة'],
  ['Pyramiden, Sphinx, Museum, Mittagessen', 'الأهرامات وأبو الهول والمتحف والغداء'],
  ['Transfer zum Flughafen Hurghada', 'الانتقال إلى مطار الغردقة'],

  // Row 69aa0c36 - Orange Bay
  ['Fahrt mit einem modernen Ausflugsboot oder einer komfortablen Yacht Richtung Orange Bay Island. Softdrinks sind an Bord inbegriffen.',
    'الذهاب بقارب رحلات حديث أو يخت مريح باتجاه جزيرة أورنج باي. المشروبات الغازية متضمنة على متن القارب.'],
  ['Zwei geführte Schnorchelstopps an sorgfältig ausgewählten Riffen mit hervorragender Sicht. Komplette Schnorchelausrüstung wird gestellt, professionelle Betreuung inbegriffen.',
    'محطتان للغطس بإرشاد في شعاب مختارة بعناية مع رؤية ممتازة. معدات الغطس كاملة متوفرة مع إشراف محترف.'],
  ['Mehrere Stunden Freizeit auf der Insel zum Baden, Entspannen, Sonnen, Fotografieren und Geniessen der einzigartigen Atmosphäre.',
    'عدة ساعات من الوقت الحر على الجزيرة للسباحة والاسترخاء والتشمس والتصوير والاستمتاع بالأجواء الفريدة.'],
  ['Banana Boat und Sofa Boat unter professioneller Aufsicht und mit moderner Sicherheitsausrüstung.',
    ' Banana Boat و Sofa Boat تحت إشراف محترف وبمعدات سلامة حديثة.'],
  ['Frisch zubereitetes Mittagessen mit alkoholfreien Getränken an Bord oder auf der Insel.',
    'غداء طازج مع مشروبات غير كحولية على متن القارب أو على الجزيرة.'],

  // Row 6b629662 - Makadi Water Park
  ['Ganztägiger Aufenthalt im Makadi Water Park. Bevorzugter Einlass mit organisiertem Zugang. Nutzung aller für Alter und Grösse zugelassenen Attraktionen.',
    'إقامة ليوم كامل في متنزه ماكادي المائي. دخول مفضل مع وصول منظم. استخدام جميع الألعاب المسموح بها حسب العمر والطول.'],
  ['Mittagessen & Getränke inbegriffen.', 'الغداء والمشروبات متضمنة.'],

  // Row 77f34e21 - El Gouna
  ['Ihr Guide holt Sie zwischen 09:00 und 10:00 Uhr in einem klimatisierten Privatfahrzeug ab. Von Hurghada aus erreichen wir El Gouna nach etwa 30 Minuten.',
    'مرشدك يستقبلك بين الساعة 09:00 و 10:00 في سيارة خاصة مكيفة. من الغردقة نصل إلى الجونة بعد حوالي 30 دقيقة.'],
  ['Die Tour beginnt mit einer entspannten Bootsfahrt durch die berühmten Lagunen. Sie sehen Luxushotels, Villen & Wohngebiete, Inseln und Wasserwege, den Yachthafen und architektonische Besonderheiten. Ihr Reiseführer erzählt Ihnen die Geschichte der Stadt und spannende Details über die Gründung und Entwicklung dieser einzigartigen Lagunenstadt.',
    'تبدأ الجولة برحلة قارب مريحة عبر البحيرات الشهيرة. ترى فنادق فاخرة وفيلات ومناطق سكنية وجزر وممرات مائية ومرسى اليخوت ومعالم معمارية. مرشدك السياحي يروي لك تاريخ المدينة وتفاصيل شيقة عن تأسيس وتطور مدينة البحيرات الفريدة هذه.'],
  ['In der Innenstadt erwarten Sie Cafés, Boutiquen, Kunsthandwerk und kleine Plätze. Sie schlendern entspannt und geniessen das moderne Flair der Stadt.',
    'في وسط المدينة تنتظرك مقاهي وبوتيكات وحرف يدوية وساحات صغيرة. تتجول باسترخاء وتستمتع بأجواء المدينة العصرية.'],
  ['Gemeinsam besuchen wir einige der wichtigsten Sehenswürdigkeiten: koptische Kirche, Grosse Moschee und Aussenstelle der Bibliotheca Alexandrina. Eine ideale Mischung aus Kultur und moderner Stadtplanung.',
    'نزور معاً بعضاً من أهم المعالم: الكنيسة القبطية والمسجد الكبير وفرع مكتبة الإسكندرية. مزيج مثالي من الثقافة والتخطيط الحضري الحديث.'],
  ['Sie spazieren entlang der gepflegten Promenade, sehen Luxusyachten und geniessen die mediterrane Atmosphäre. Wer möchte, kann noch einen Tee oder Kaffee mit Blick auf die Boote trinken (optional).',
    'تتمشى على الكورنيش الأنيق وترى اليخوت الفاخرة وتستمتع بالأجواء المتوسطية. من يرغب يمكنه تناول شاي أو قهوة مع إطلالة على القوارب (اختياري).'],
  ['Nach vielen schönen Eindrücken fahren wir zurück nach Hurghada.', 'بعد العديد من الانطباعات الجميلة نعود إلى الغردقة.'],

  // Row 7b681580 - Speedboot Orange Bay
  ['Herzlicher Empfang und Sicherheitseinweisung an Bord des privaten Bootes.', 'ترحيب حار وتعليمات السلامة على متن القارب الخاص.'],
  ['1–2 Schnorchelgänge an den schönsten Riffen des Roten Meeres.', '1–2 جلسات غطس في أجمل شعاب البحر الأحمر.'],
  ['Fahrt zur Orange Bay oder Magawish Insel mit Freizeit, Mittagessen & Strandaufenthalt.', 'رحلة إلى جزيرة أورنج باي أو مجاويش مع وقت حر وغداء ووقت على الشاطئ.'],
  ['Entspannung am Strand oder auf dem Boot.', 'استرخاء على الشاطئ أو على متن القارب.'],
  ['Rückfahrt zum Hafen & Transfer zum Hotel.', 'العودة إلى الميناء والانتقال إلى الفندق.'],

  // Row 7cb0c635 - Dendera Abydos
  ['Abholung vom Hotel in Hurghada.', 'الاستقبال من الفندق في الغردقة.'],
  ['Ca. 2 Stunden Besichtigung des Hathor-Tempels.', 'حوالي ساعتين لزيارة معبد حتحور.'],
  ['Ca. 2 Stunden Besichtigung des Abydos-Tempels.', 'حوالي ساعتين لزيارة معبد أبيدوس.'],

  // Row 80dc4e17 - Aquarium
  ['Nach Ihrer Ankunft betreten Sie eines der grössten und modernsten Aquarien Ägyptens. Dank Ihres Online-Tickets geniessen Sie einen schnellen und unkomplizierten Eintritt ohne lange Wartezeiten.',
    'بعد وصولك تدخل واحداً من أكبر وأحدث أحواض السمك في مصر. بفضل تذكرتك الإلكترونية تستمتع بدخول سريع وسهل دون انتظار طويل.'],
  ['Erleben Sie den spektakulären 24 Meter langen Unterwassertunnel und beobachten Sie Haie, Rochen und zahlreiche Fischarten aus nächster Nähe – ein unvergessliches Erlebnis für die ganze Familie.',
    'اختبر النفق تحت الماء المذهل بطول 24 متراً وشاهد أسماك القرش والراي وأنواعاً عديدة من الأسماك عن قرب – تجربة لا تنسى للعائلة بأكملها.'],
  ['Besuchen Sie die tropische Regenwaldzone sowie den kleinen Zoo mit exotischen Vögeln, Reptilien und weiteren faszinierenden Tieren aus verschiedenen Regionen der Welt.',
    'زر منطقة الغابات المطيرة الاستوائية وحديقة الحيوانات الصغيرة مع الطيور والزواحف والحيوانات الرائعة من مختلف مناطق العالم.'],
  ['Nach einem erlebnisreichen Rundgang endet Ihr Besuch im Hurghada Grand Aquarium mit unvergesslichen Eindrücken aus der faszinierenden Unterwasserwelt des Roten Meeres.',
    'بعد جولة مليئة بالتجارب تنتهي زيارتك لحوض أسماك الغردقة الكبير مع انطباعات لا تنسى من عالم تحت الماء الرائع للبحر الأحمر.'],

  // Row 872d19ae - Super Safari
  ['Fahrt zur Wüstenstation.', 'الذهاب إلى المحطة الصحراوية.'],
  ['Einweisung und Start der Quad-Tour.', 'تعليمات وانطلاق جولة الكواد.'],
  ['Spider-Buggy Fahrt durch die Wüste.', 'جولة بسيارة سبايدر بغي في الصحراء.'],
  ['Jeep-Safari zum Beduinendorf. Kamelritt und Dorfbesuch.', 'سفاري جيب إلى القرية البدوية. ركوب الجمل وزيارة القرية.'],
  ['BBQ-Abendessen und Folklore-Show.', 'عشاء شواء وعرض فلكلوري.'],

  // Row 8c5d9ce5 - Mini Egypt
  ['Abholung vom Hotel in Hurghada mit komfortablem, klimatisiertem Minibus.', 'الاستقبال من الفندق في الغردقة بحافلة صغيرة مريحة ومكيفة.'],
  ['Ankunft im Mini Egypt Park – Ihr persönlicher Guide begrüsst Sie.', 'الوصول إلى منتجع مصر المصغر – مرشدك الشخصي يستقبلك.'],
  ['Geführte Tour durch Ägyptens Miniaturwunder: Die Pyramiden von Gizeh & die Sphinx, Der Tempel von Abu Simbel & der Assuan-Staudamm, Die beeindruckenden Tempel von Luxor mit dem berühmten Karnak-Tempel, Das Ägyptische Museum in Kairo, Alexandria mit Stanley-Brücke & Montazah-Palast.',
    'جولة إرشادية عبر عجائب مصر المصغرة: أهرامات الجيزة وأبو الهول ومعبد أبو سمبل وسد أسوان ومعابد الأقصر الرائعة مع معبد الكرنك الشهير والمتحف المصري في القاهرة والإسكندرية مع كوبري ستانلي وقصر المنتزه.'],
  ['Freizeit im Park – Zeit für Fotos, Staunen und kleine Entdeckungen.', 'وقت حر في الحديقة – وقت للصور والدهشة والاكتشافات الصغيرة.'],
  ['Rücktransfer zum Hotel – mit unvergesslichen Eindrücken im Gepäck.', 'العودة إلى الفندق – مع انطباعات لا تنسى في الحقيبة.'],

  // Row 94351900 - Cairo private
  ['Nach Ihrer Ankunft in Kairo entdecken Sie die weltberühmten Pyramiden von Cheops, Chephren und Mykerinos sowie die beeindruckende Sphinx und den Taltempel.',
    'بعد وصولك إلى القاهرة تكتشف أهرامات الجيزة الشهيرة خوفو وخفرع ومنقرع وتمثال أبو الهول الرائع ومعبد الوادي.'],
  ['Anschliessend besuchen Sie das spektakuläre Grand Egyptian Museum – das grösste archäologische Museum der Welt mit einzigartigen Schätzen des alten Ägyptens.',
    'ثم تزور المتحف المصري الكبير المذهل – أكبر متحف أثري في العالم بكنوز فريدة من مصر القديمة.'],
  ['Geniessen Sie ein leckeres Mittagessen in einem ausgewählten Restaurant in Kairo. (Getränke zum Mittagessen sind nicht im Preis enthalten).',
    'استمتع بغداء لذيذ في مطعم مختار في القاهرة. (المشروبات مع الغداء غير متضمنة في السعر).'],
  ['Nach einem erlebnisreichen Tag bringt Sie Ihr privater Fahrer sicher und entspannt zurück zu Ihrem Hotel in Hurghada.',
    'بعد يوم مليء بالتجارب يعيدك سائقك الخاص بأمان وراحة إلى فندقك في الغردقة.'],

  // Row a8ddb433 - Dendera
  ['Ankunft am Tempel & geführte Tour mit Ägyptologen.', 'الوصول إلى المعبد وجولة إرشادية مع عالم مصريات.'],
  ['Besichtigung der berühmten Hathor-Säulenhalle und der astronomischen Decke.', 'زيارة قاعة أعمدة حتحور الشهيرة والسقف الفلكي.'],
  ['Besuch ausgewählter Bereiche wie Mamisi, Heiliger See und Tempelanlage.', 'زيارة مناطق مختارة مثل الماميسي والبحيرة المقدسة ومجمع المعبد.'],
  ['Zeit für individuelle Besichtigung und Fotos.', 'وقت للزيارة الخاصة والتصوير.'],

  // Row b2dc19de - Speedboot sunset
  ['Aufenthalt an einer abgelegenen Insel mit hellem Sandstrand. Hier haben Sie ausreichend Zeit zum Schwimmen, Sonnenbaden oder Entspannen. Durch die private Organisation der Tour vermeiden Sie Menschenansammlungen und geniessen die Natur in ruhiger Atmosphäre.',
    'وقت على جزيرة نائية بشاطئ رملي فاتح. لديك وقت كافٍ للسباحة أو حمامات الشمس أو الاسترخاء. من خلال التنظيم الخاص تتجنب الزحام وتستمتع بالطبيعة في أجواء هادئة.'],
  ['Auf der Rückfahrt erleben Sie den Sonnenuntergang über dem Roten Meer. Die besondere Lichtstimmung auf dem Wasser macht diesen Moment zu einem stimmungsvollen Abschluss des Ausflugs.',
    'في طريق العودة تشاهد غروب الشمس فوق البحر الأحمر. إضاءة خاصة على الماء تجعل هذه اللحظة ختاماً رائعاً للرحلة.'],

  // Row b604535f - Eden Island
  ['Nach der Ausgabe Ihrer Schnorchelausrüstung startet die 40-minütige Bootsfahrt zu den faszinierendsten Riffen rund um Eden Island. Hier erwarten Sie bunte Korallenriffe und tropische Fische – ein Paradies für Schnorchler.',
    'بعد توزيع معدات الغطس تبدأ رحلة القارب لمدة 40 دقيقة إلى أجمل الشعاب حول جزيرة إيدن. هنا تنتظرك شعاب مرجانية ملونة وأسماك استوائية – جنة لعشاق الغطس.'],
  ['Verbringen Sie mehrere Stunden am Eden Island Beach, schwimmen Sie im türkisfarbenen Wasser oder entspannen Sie am Strand.',
    'اقضِ عدة ساعات على شاطئ جزيرة إيدن، اسبح في الماء الفيروزي أو استرخ على الشاطئ.'],
  ['Nutzen Sie die verbleibende Zeit zum Schwimmen, Schnorcheln oder Entspannen am Strand, bevor Sie am Nachmittag mit dem Boot zurück zum Hafen fahren und anschliessend zu Ihrem Hotel gebracht werden.',
    'استخدم الوقت المتبقي للسباحة أو الغطس أو الاسترخاء على الشاطئ قبل العودة بالقارب إلى الميناء ثم إلى فندقك.'],

  // Row c2db0455 - Night tour
  ['Besuch des Fischmarktes und der Grossen Moschee.', 'زيارة سوق السمك والمسجد الكبير.'],
  ['Weiterfahrt zum Obst- und Gemüsemarkt.', 'مواصلة الرحلة إلى سوق الفواكه والخضروات.'],

  // Row f265b20c - Hula Hula
  ['Erkunden Sie die farbenfrohe Unterwasserwelt mit exotischen Fischen und beeindruckenden Korallenriffen. Schnorchelausrüstung wird bereitgestellt.',
    'استكشف عالم ما تحت الماء الملون مع الأسماك الاستوائية والشعاب المرجانية الرائعة. يتم توفير معدات الغطس.'],
  ['Entspannen Sie an den weissen Sandstränden, schwimmen Sie im kristallklaren Wasser oder schnorcheln Sie direkt vom Strand aus. Liegen und Sonnenschirme stehen für Sie bereit.',
    'استرخ على الشواطئ الرملية البيضاء، اسبح في الماء الصافي أو اغطس مباشرة من الشاطئ. الكراسي والمظلات متوفرة لك.'],
  ['Nach einem ereignisreichen Tag geht es zurück zum Hafen und anschliessend zu Ihrem Hotel – mit vielen neuen Eindrücken und glücklichen Erinnerungen.',
    'بعد يوم حافل تعود إلى الميناء ثم إلى فندقك – مع انطباعات جديدة وذكريات سعيدة.'],
]);

function normalize(s) {
  return s.replace(/[\s]+/g, ' ').trim();
}

function applyFuzzyMatch(text) {
  if (!text) return text;
  const normalized = normalize(text);
  for (const [de, ar] of TRANSLATIONS) {
    const normDe = normalize(de);
    // Try exact match first
    if (normalized === normDe) return ar;
    // Try substring match for longer texts
    if (normDe.length > 30 && normalized.includes(normDe)) {
      return normalized.replace(normDe, ar);
    }
    // Partial match: if most words overlap
    const deWords = new Set(normDe.toLowerCase().split(/\s+/));
    const textWords = normalized.toLowerCase().split(/\s+/);
    const common = [...deWords].filter(w => textWords.includes(w) && w.length > 3);
    if (common.length >= 5 && common.length / deWords.size > 0.5) {
      return text; // skip for now, too risky for partial
    }
  }
  return text;
}

async function main() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: cts } = await db.from('content_translations').select('*').eq('table_name', 'tours').eq('locale', 'ar');

  const updates = [];

  for (const ct of cts) {
    const content = typeof ct.content === 'string' ? JSON.parse(ct.content) : ct.content;
    if (!Array.isArray(content)) continue;

    const newContent = content.map(item => {
      const newItem = { ...item };
      if (item.content) {
        const translated = applyFuzzyMatch(item.content);
        if (translated !== item.content) newItem.content = translated;
      }
      return newItem;
    });

    const changed = JSON.stringify(content) !== JSON.stringify(newContent);
    if (changed) {
      updates.push({ id: ct.id, row_id: (ct.row_id || '').substring(0, 8), oldContent: content, newContent });
    }
  }

  console.log(`Mode: ${IS_DRY_RUN ? 'DRY RUN' : 'EXECUTE'}\n`);
  console.log(`AR translations with body changes: ${updates.length}/${cts.length}\n`);

  for (const u of updates) {
    console.log(`=== Row ${u.row_id} (id: ${u.id}) ===`);
    for (let i = 0; i < Math.max(u.oldContent.length, u.newContent.length); i++) {
      const oldItem = u.oldContent[i] || {};
      const newItem = u.newContent[i] || {};
      const ob = normalize(oldItem.content || '');
      const nb = normalize(newItem.content || '');
      if (ob !== nb) {
        console.log(`  body[${i}]:`);
        console.log(`    OLD: ${ob.substring(0, 150)}`);
        console.log(`    NEW: ${nb.substring(0, 150)}`);
      }
    }
    console.log('');
  }

  if (!IS_DRY_RUN) {
    console.log('=== EXECUTING ===\n');
    let done = 0, errors = 0;
    for (const u of updates) {
      const { error: err } = await db.from('content_translations')
        .update({ content: JSON.stringify(u.newContent) })
        .eq('id', u.id);
      if (err) { console.error(`  ERROR row ${u.id}: ${err.message}`); errors++; }
      else done++;
    }
    console.log(`Done. Updated ${done} rows, ${errors} errors.`);
  } else {
    console.log('Dry-run complete. Run with --execute to apply changes.');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
