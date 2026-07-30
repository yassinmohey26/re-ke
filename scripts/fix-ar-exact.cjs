require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const { createClient } = require('@supabase/supabase-js');
const IS_DRY_RUN = !process.argv.includes('--execute');

// KEY = exact current DB text, VALUE = Arabic translation
// Generated from actual DB content to ensure exact match
const BODY_TRANSLATIONS = new Map([
  // 0009b90b - Glasbodenboat
  ['Geführtes الغطس an einem ruhigen Riff.', 'غطس بإرشاد في شعاب هادئة.'],

  // 17a82d9b - Mahmya
  ['Am frühen Morgen werden Sie مباشرة من فندقك abgeholt und zum Hafen gebracht. Dort begrüsst Sie die freundliche Crew an Bord Ihres komfortablen Bootes.',
    'في الصباح الباكر يتم استقبالك من فندقك مباشرة والذهاب إلى الميناء. هناك تستقبلك الطاقم الودود على متن قاربك المريح.'],
  ['Nach der Ausgabe Ihrer معدات الغطس und einer kurzen Einweisung beginnt die Fahrt über das tiefblaue Rote Meer. Schon bald erreichen Sie die ersten Schnorchelplätze mit bunten Fischen, Korallenformationen und mit etwas Glück sogar Meeresschildkröten oder Delfine.',
    'بعد توزيع معدات الغطس وتعليمات قصيرة تبدأ الرحلة عبر البحر الأحمر الأزرق العميق. قريباً تصل إلى أول مواقع الغطس مع الأسماك الملونة وتشكيلات المرجان ومع الحظ حتى السلاحف البحرية أو الدلافين.'],
  ['Nach der الوصول auf der Mahmya جزيرة geniessen Sie die traumhafte Kulisse und ein frisch zubereitetes Mittagsbuffet in einem Restaurant direkt am Meer. Der restliche يوم gehört ganz Ihnen: Entspannen, Schwimmen, die جزيرة erkunden oder die Ruhe und Sonne geniessen.',
    'بعد الوصول إلى جزيرة الماهيا تستمتع بالمناظر الخلابة وبوفيه غداء طازج في مطعم على البحر مباشرة. باقي اليوم لك: استرخاء وسباحة واستكشاف الجزيرة أو الاستمتاع بالهدوء والشمس.'],

  // 1c5a3c79 - Luxor Balloon
  ['Sie geniessen ein entspanntes العشاء und beziehen Ihr ausgewähltes فندق, bevor die ليلة zur Vorbereitung auf das morgendliche Abenteuer ruht.',
    'تستمتع بعشاء مريح وتتوجه إلى فندقك المختار قبل أن تدعوك الليلة للاستعداد لمغامرة الصباح.'],
  ['Gegen 4:00  startet Ihre Heissluftballonfahrt. Während die Sonne langsam das Niltal färbt, schweben Sie über Tempel, Felder und den Westjordan des antiken Theben. Ein Moment, der Ihrem Reisealbum Glanz verleiht.',
    'حوالي الساعة 4:00 تبدأ رحلة البالون. بينما تلون الشمس وادي النيل ببطء، تحلق فوق المعابد والحقول والضفة الغربية لطيبة القديمة. لحظة تضفي رونقاً على ألبوم رحلاتك.'],
  ['Ein reichhaltiges ägyptisches Menü bietet Stärkung für den weiteren يوم.', 'وجبة مصرية غنية تمدك بالطاقة لبقية اليوم.'],

  // 27ae0b35 - Delfin Tour
  ['ترحيب شخصي, Ausrüstung, kurze Einweisung – danach beginnt Ihr Abenteuer.', 'استقبال حار وتجهيزات وتعليمات سريعة – ثم تبدأ مغامرتك.'],
  ['الذهاب إلى أفضل أماكن الدلافين. مع الحظ تشاهد الدلافين في البرية ويمكنك – إذا سمحت الظروف – السباحة معها. Hinweis: Delfine sind Wildtiere. Eine Sichtung kann nicht garantiert werden, die Erfolgsquote ist jedoch sehr hoch.',
    'الذهاب إلى أفضل أماكن الدلافين. مع الحظ تشاهد الدلافين في البرية ويمكنك – إذا سمحت الظروف – السباحة معها. ملاحظة: الدلافين حيوانات برية. لا يمكن ضمان المشاهدة لكن نسبة النجاح عالية جداً.'],
  ['Entdecken Sie ein faszinierendes حطام سفينة mit einer beeindruckenden Unterwasserwelt voller Fische und Korallen.',
    'اكتشف حطام سفينة رائع مع عالم تحت الماء مثير مليء بالأسماك والشعاب المرجانية.'],

  // 2dc6864a - Monastery
  ['Fahrt durch die östliche صحراء zum Kloster St. Antonius.', 'رحلة عبر الصحراء الشرقية إلى دير القديس أنطونيوس.'],
  ['زيارة der historischen Kirchen, Fresken und Manuskripte.', 'زيارة الكنائس التاريخية واللوحات الجدارية والمخطوطات.'],
  ['Aufstieg zur كهف القديس أنطونيوس (optional).', 'الصعود إلى كهف القديس أنطونيوس (اختياري).'],
  ['زيارة des Klosters und der Kirche des Heiligen Paulus.', 'زيارة الدير وكنيسة القديس بولس.'],

  // 380712ad - Quad
  ['Einblick in die Kultur der Wüste متضمن traditionellem Tee.', 'اطلاع على ثقافة الصحراء مع الشاي التقليدي.'],

  // 4f91f20d - Shopping
  ['نستقبلك بكل راحة mit مركبة مكيفة مباشرة من فندقك in Hurghada oder Umgebung ab.', 'نستقبلك براحة في سيارة مكيفة مباشرة من فندقك في الغردقة أو المناطق المحيطة.'],

  // 65f786e7 - Cairo flight
  ['الاستلام من الفندق in Hurghada', 'الاستقبال من الفندق في الغردقة'],
  ['Pyramiden, Sphinx, Museum, الغداء', 'الأهرامات وأبو الهول والمتحف والغداء'],

  // 69aa0c36 - Orange Bay
  ['الذهاب بقارب رحلات حديث أو يخت مريح Richtung Orange Bay Island. Softdrinks sind an Bord متضمن.',
    'الذهاب بقارب رحلات حديث أو يخت مريح باتجاه جزيرة أورنج باي. المشروبات الغازية متضمنة على متن القارب.'],
  ['Zwei geführte Schnorchelstopps an sorgfältig ausgewählten Riffen mit hervorragender Sicht. Komplette معدات الغطس wird gestellt, professionelle Betreuung متضمن.',
    'محطتان للغطس بإرشاد في شعاب مختارة بعناية مع رؤية ممتازة. معدات الغطس كاملة متوفرة مع إشراف محترف.'],
  ['Mehrere ساعات وقت حر auf der Insel zum Baden, Entspannen, Sonnen, Fotografieren und Geniessen der einzigartigen Atmosphäre.',
    'عدة ساعات من الوقت الحر على الجزيرة للسباحة والاسترخاء والتشمس والتصوير والاستمتاع بالأجواء الفريدة.'],
  ['Frisch zubereitetes الغداء mit alkoholfreien Getränken an Bord oder auf der جزيرة.',
    'غداء طازج مع مشروبات غير كحولية على متن القارب أو على الجزيرة.'],

  // 6b629662 - Makadi Water Park
  ['Ganztägiger Aufenthalt im متنزه ماكادي المائي. Bevorzugter Einlass mit organisiertem Zugang. Nutzung aller für Alter und Grösse zugelassenen Attraktionen.',
    'إقامة ليوم كامل في متنزه ماكادي المائي. دخول مفضل مع وصول منظم. استخدام جميع الألعاب المسموح بها حسب العمر والطول.'],

  // 77f34e21 - El Gouna
  ['Ihr Guide holt Sie zwischen 09:00 und 10:00  في مركبة خاصة مكيفة ab. Von Hurghada aus erreichen wir El Gouna nach حوالي 30 Minuten.',
    'مرشدك يستقبلك بين الساعة 09:00 و 10:00 في سيارة خاصة مكيفة. من الغردقة نصل إلى الجونة بعد حوالي 30 دقيقة.'],
  ['Die Tour beginnt mit einer entspannten Bootsfahrt durch die berühmten Lagunen. Sie sehen Luxushotels, Villen & غير متضمن Wohngebiete, Inseln und Wasserwege, den Yachthafen und architektonische Besonderheiten. Ihr مرشد سياحي erzählt Ihnen die Geschichte der Stadt und spannende Details über die Gründerfamilie Sawiris.',
    'تبدأ الجولة برحلة قارب مريحة عبر البحيرات الشهيرة. ترى فنادق فاخرة وفيلات ومناطق سكنية وجزر وممرات مائية ومرسى اليخوت ومعالم معمارية. مرشدك السياحي يروي لك تاريخ المدينة وتفاصيل شيقة عن عائلة مؤسسيها عائلة ساويرس.'],
  ['Gemeinsam besuchen wir einige der wichtigsten Sehenswürdigkeiten: koptische Kirche, Grosse Moschee und Aussenstelle der Bibliotheca Alexandrina. Eine ideale Mischung aus Kultur und moderner Stadtplanung.',
    'نزور معاً بعضاً من أهم المعالم: الكنيسة القبطية والمسجد الكبير وفرع مكتبة الإسكندرية. مزيج مثالي من الثقافة والتخطيط الحضري الحديث.'],
  ['Sie spazieren entlang der gepflegten Promenade, sehen Luxusyachten und geniessen die mediterrane Atmosphäre. Wer möchte, kann noch einen Tee oder Kaffee mit Blick auf die Boote trinken (optional).',
    'تتمشى على الكورنيش الأنيق وترى اليخوت الفاخرة وتستمتع بالأجواء المتوسطية. من يرغب يمكنه تناول شاي أو قهوة مع إطلالة على القوارب (اختياري).'],
  ['Nach vielen schönen Eindrücken fahren wir zurück nach Hurghada.', 'بعد العديد من الانطباعات الجميلة نعود إلى الغردقة.'],

  // 7b681580 - Speedboot Orange Bay
  ['ترحيب شخصي und Sicherheitseinweisung an Bord des privaten Bootes.', 'ترحيب حار وتعليمات السلامة على متن القارب الخاص.'],
  ['Fahrt zur Orange Bay oder Magawish جزيرة mit وقت حر, الغداء & شاطئaufenthalt.', 'رحلة إلى جزيرة أورنج باي أو مجاويش مع وقت حر وغداء ووقت على الشاطئ.'],
  ['الاسترخاء على الشاطئ oder auf dem Boot.', 'استرخاء على الشاطئ أو على متن القارب.'],
  ['العودة zum Hafen & النقل zum فندق.', 'العودة إلى الميناء والانتقال إلى الفندق.'],

  // 7cb0c635 - Dendera Abydos
  ['الاستلام من الفندق in Hurghada.', 'الاستقبال من الفندق في الغردقة.'],
  ['Ca. 2 ساعات زيارة des Hathor-Tempels.', 'حوالي ساعتين لزيارة معبد حتحور.'],
  ['Ca. 2 ساعات زيارة des Abydos-Tempels.', 'حوالي ساعتين لزيارة معبد أبيدوس.'],

  // 80dc4e17 - Aquarium
  ['بعد وصولك تدخل واحداً من أكبر وأحدث أحواض السمك في مصر. Dank Ihres Online-Tickets geniessen Sie einen schnellen und unkomplizierten الدخول ohne lange Wartezeiten.',
    'بعد وصولك تدخل واحداً من أكبر وأحدث أحواض السمك في مصر. بفضل تذكرتك الإلكترونية تستمتع بدخول سريع وسهل دون انتظار طويل.'],
  ['Besuchen Sie die tropische Regenwaldzone sowie den kleinen Zoo mit exotischen Vögeln, Reptilien und weiteren faszinierenden Tieren aus verschiedenen Regionen der Welt.',
    'زر منطقة الغابات المطيرة الاستوائية وحديقة الحيوانات الصغيرة مع الطيور والزواحف والحيوانات الرائعة من مختلف مناطق العالم.'],
  ['Nach einem erlebnisreichen Rundgang endet Ihr زيارة im Hurghada Grand Aquarium mit unvergesslichen Eindrücken aus der faszinierenden Unterwasserwelt des Roten Meeres.',
    'بعد جولة مليئة بالتجارب تنتهي زيارتك لحوض أسماك الغردقة الكبير مع انطباعات لا تنسى من عالم تحت الماء الرائع للبحر الأحمر.'],

  // 872d19ae - Super Safari
  ['Einweisung und Start der جولة كواد.', 'تعليمات وانطلاق جولة الكواد.'],
  ['سيارة سبايدر بغي Fahrt durch die صحراء.', 'جولة بسيارة سبايدر بغي في الصحراء.'],
  ['Jeep-Safari zum Beduinendorf. ركوب الجمل und Dorfbesuch.', 'سفاري جيب إلى القرية البدوية. ركوب الجمل وزيارة القرية.'],
  ['BBQ-العشاء und Folklore-Show.', 'عشاء شواء وعرض فلكلوري.'],

  // 8c5d9ce5 - Mini Egypt
  ['الاستلام من الفندق in Hurghada mit komfortablem, klimatisiertem حافلة صغيرة.', 'الاستقبال من الفندق في الغردقة بحافلة صغيرة مريحة ومكيفة.'],
  ['الوصول im Mini Egypt Park – dein persönlicher Guide begrüsst dich.', 'الوصول إلى منتجع مصر المصغر – مرشدك الشخصي يستقبلك.'],
  ['جولة إرشادية durch Ägyptens Miniaturwunder: Die أهرامات الجيزة & die Sphinx, Der Tempel von Abu Simbel & der Assuan-Staudamm, Die beeindruckenden Tempel von Luxor mit dem berühmten معبد الكرنك, Das Ägyptische Museum in Kairo, Alexandria mit Stanley-Brücke & Montazah-Palast.',
    'جولة إرشادية عبر عجائب مصر المصغرة: أهرامات الجيزة وأبو الهول ومعبد أبو سمبل وسد أسوان ومعابد الأقصر الرائعة مع معبد الكرنك الشهير والمتحف المصري في القاهرة والإسكندرية مع كوبري ستانلي وقصر المنتزه.'],
  ['وقت حر في الحديقة – Zeit für Fotos, Staunen und kleine Entdeckungen.', 'وقت حر في الحديقة – للصور والدهشة والاكتشافات الصغيرة.'],
  ['النقل العائد إلى الفندق – mit unvergesslichen Eindrücken im Gepäck.', 'العودة إلى الفندق – مع انطباعات لا تنسى في الحقيبة.'],

  // 94351900 - Cairo private
  ['Nach Ihrer الوصول in Kairo entdecken Sie die weltberühmten Pyramiden von Cheops, Chephren und Mykerinos sowie die beeindruckende Sphinx und den Taltempel.',
    'بعد وصولك إلى القاهرة تكتشف أهرامات الجيزة الشهيرة خوفو وخفرع ومنقرع وتمثال أبو الهول الرائع ومعبد الوادي.'],
  ['Anschliessend besuchen Sie das spektakuläre المتحف المصري الكبير – das grösste archäologische Museum der Welt mit einzigartigen Schätzen des alten Ägyptens.',
    'ثم تزور المتحف المصري الكبير المذهل – أكبر متحف أثري في العالم بكنوز فريدة من مصر القديمة.'],
  ['Geniessen Sie ein leckeres الغداء in einem ausgewählten Restaurant in Kairo. (Getränke zum الغداء sind nicht im السعر enthalten).',
    'استمتع بغداء لذيذ في مطعم مختار في القاهرة. (المشروبات مع الغداء غير متضمنة في السعر).'],
  ['Nach einem erlebnisreichen يوم bringt Sie Ihr privater Fahrer sicher und entspannt zurück zu Ihrem Hotel in Hurghada.',
    'بعد يوم مليء بالتجارب يعيدك سائقك الخاص بأمان وراحة إلى فندقك في الغردقة.'],

  // a8ddb433 - Dendera
  ['الاستلام um تقريباً 06:00  مباشرة من فندقك in Hurghada. الذهاب إلى دندرة (تقريباً 230 km, klimatisiertes المركعة).',
    'الاستقبال حوالي الساعة 06:00 مباشرة من فندقك في الغردقة. الذهاب إلى دندرة (حوالي 230 كم بسيارة مكيفة).'],
  ['الوصول am Tempel & geführte Tour mit Ägyptologen.', 'الوصول إلى المعبد وجولة إرشادية مع عالم مصريات.'],
  ['زيارة der berühmten Hathor-Säulenhalle und der astronomischen Decke.', 'زيارة قاعة أعمدة حتحور الشهيرة والسقف الفلكي.'],
  ['زيارة ausgewählter Bereiche wie Mamisi, Heiliger See und Tempelanlage.', 'زيارة مناطق مختارة مثل الماميسي والبحيرة المقدسة ومجمع المعبد.'],
  ['Zeit für individuelle زيارة und Fotos.', 'وقت للزيارة الخاصة والتصوير.'],

  // b2dc19de - Speedboat sunset
  ['Aufenthalt an einer abgelegenen Insel mit hellem Sandstrand. Hier haben Sie ausreichend Zeit zum Schwimmen, Sonnenbaden oder Entspannen. Durch die private Organisation der Tour vermeiden Sie Menschenansammlungen und geniessen die Natur in ruhiger Atmosphäre.',
    'وقت على جزيرة نائية بشاطئ رملي فاتح. لديك وقت كافٍ للسباحة أو حمامات الشمس أو الاسترخاء. من خلال التنظيم الخاص تتجنب الزحام وتستمتع بالطبيعة في أجواء هادئة.'],
  ['Auf der العودة erleben Sie den غروب الشمس über dem Roten Meer. Die besondere Lichtstimmung auf dem Wasser macht diesen Moment zu einem stimmungsvollen Abschluss des Ausflugs.',
    'في طريق العودة تشاهد غروب الشمس فوق البحر الأحمر. إضاءة خاصة على الماء تجعل هذه اللحظة ختاماً رائعاً للرحلة.'],

  // b604535f - Eden Island
  ['Nach der Ausgabe Ihrer معدات الغطس startet die 40-minütige Bootsfahrt zu den faszinierendsten Riffen rund um Eden Island. Hier erwarten Sie bunte Korallenriffe und tropische Fische – ein Paradies für Schnorchler.',
    'بعد توزيع معدات الغطس تبدأ رحلة القارب لمدة 40 دقيقة إلى أجمل الشعاب حول جزيرة إيدن. هنا تنتظرك شعاب مرجانية ملونة وأسماك استوائية – جنة لعشاق الغطس.'],
  ['Verbringen Sie mehrere ساعات am Eden Island Beach, schwimmen Sie im türkisfarbenen Wasser oder entspannen Sie am Strand.',
    'اقضِ عدة ساعات على شاطئ جزيرة إيدن، اسبح في الماء الفيروزي أو استرخ على الشاطئ.'],
  ['Nutzen Sie die verbleibende Zeit zum Schwimmen, الغطس oder Entspannen am شاطئ, bevor Sie am Nachmittag mit dem Boot zurück zum Hafen fahren und anschliessend zu Ihrem فندق gebracht werden.',
    'استخدم الوقت المتبقي للسباحة أو الغطس أو الاسترخاء على الشاطئ قبل العودة بالقارب إلى الميناء ثم إلى فندقك.'],

  // c2db0455 - Night tour
  ['زيارة des Fischmarktes und der Grossen Moschee.', 'زيارة سوق السمك والمسجد الكبير.'],
  ['Weiterfahrt zum سوق الفواكه والخضروات.', 'مواصلة الرحلة إلى سوق الفواكه والخضروات.'],

  // c7b7cfad - Kairo
  ['الم specialties المصرية التقليدية في مطعم بحديقة.', 'المأكولات المصرية التقليدية في مطعم بحديقة.'],

  // f265b20c - Hula Hula
  ['Erkunden Sie die farbenfrohe Unterwasserwelt mit exotischen Fischen und beeindruckenden Korallenriffen. معدات الغطس wird bereitgestellt.',
    'استكشف عالم ما تحت الماء الملون مع الأسماك الاستوائية والشعاب المرجانية الرائعة. يتم توفير معدات الغطس.'],
  ['Entspannen Sie an den weissen Sandstränden, schwimmen Sie im kristallklaren Wasser oder schnorcheln Sie direkt vom شاطئ aus. Liegen und Sonnenschirme stehen für Sie bereit.',
    'استرخ على الشواطئ الرملية البيضاء، اسبح في الماء الصافي أو اغطس مباشرة من الشاطئ. الكراسي والمظلات متوفرة لك.'],
  ['Nach einem ereignisreichen يوم geht es zurück zum Hafen und anschliessend zu Ihrem Hotel – mit vielen neuen Eindrücken und glücklichen Erinnerungen.',
    'بعد يوم حافل تعود إلى الميناء ثم إلى فندقك – مع انطباعات جديدة وذكريات سعيدة.'],
]);

async function main() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: cts } = await db.from('content_translations').select('*').eq('table_name', 'tours').eq('locale', 'ar');

  const updates = [];

  for (const ct of cts) {
    const content = typeof ct.content === 'string' ? JSON.parse(ct.content) : ct.content;
    if (!Array.isArray(content)) continue;

    const newContent = content.map(item => {
      const newItem = { ...item };
      if (item.content && BODY_TRANSLATIONS.has(item.content)) {
        newItem.content = BODY_TRANSLATIONS.get(item.content);
      }
      return newItem;
    });

    const changed = JSON.stringify(content) !== JSON.stringify(newContent);
    if (changed) {
      updates.push({ id: ct.id, row_id: (ct.row_id || '').substring(0, 8), oldContent: content, newContent });
    }
  }

  console.log(`Mode: ${IS_DRY_RUN ? 'DRY RUN' : 'EXECUTE'}\n`);
  console.log(`AR content_translations with body changes: ${updates.length}/${cts.length}\n`);

  for (const u of updates) {
    console.log(`=== Row ${u.row_id} (id: ${u.id}) ===`);
    for (let i = 0; i < Math.max(u.oldContent.length, u.newContent.length); i++) {
      const oldItem = u.oldContent[i] || {};
      const newItem = u.newContent[i] || {};
      const ob = (oldItem.content || '').trim();
      const nb = (newItem.content || '').trim();
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
