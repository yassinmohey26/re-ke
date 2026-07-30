require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const { createClient } = require('@supabase/supabase-js');

const IS_DRY_RUN = !process.argv.includes('--execute');

// Full German title → Arabic title replacements (exact match on item.title)
const TITLE_MAP = {
  // General
  'Abholung': 'الاستقبال',
  'Hotelabholung': 'الاستقبال من الفندق',
  'Hotelabholung in Hurghada': 'الاستقبال من الفندق في الغردقة',
  'Abholung & Transfer zum Hafen': 'الاستقبال والانتقال إلى الميناء',
  'Abholung & Fahrt nach Dendera': 'الاستقبال والذهاب إلى دندرة',
  'Abholung (04:00 Uhr)': 'الاستقبال (04:00)',
  'Abholung (04:00–04:30 Uhr)': 'الاستقبال (04:00–04:30)',
  'Abholung (03:00 Uhr)': 'الاستقبال (03:00)',
  'Abholung in Hurghada': 'الاستقبال في الغردقة',
  '19:00 Uhr Abholung vom Hotel': '19:00 الاستقبال من الفندق',
  '17:00 Uhr – Abholung vom Hotel': '17:00 – الاستقبال من الفندق',
  'Privater Transfer zum Hafen': 'الانتقال الخاص إلى الميناء',
  'Transfer zum Hafen & Einschiffung': 'الانتقال إلى الميناء والصعود على القارب',
  'Transfer': 'الانتقال',
  'Fahrt zum Kloster St. Antonius': 'الذهاب إلى دير القديس أنطونيوس',
  'Weiterfahrt zum Kloster St. Paulus': 'مواصلة الرحلة إلى دير القديس بولس',
  'Fahrt nach Dendera': 'الذهاب إلى دندرة',
  'Weiterfahrt nach Abydos': 'مواصلة الرحلة إلى أبيدوس',
  'Fahrt zum Hafen': 'الذهاب إلى الميناء',
  'Abu Tig Marina': 'مرسى أبو تيج',
  'Spaziergang durch die Marina': 'نزهة في المارينا',
  'Transfer zum Hafen': 'الانتقال إلى الميناء',
  'Privater Transfer': 'انتقال خاص',
  'Rückfahrt & Hoteltransfer': 'العودة والانتقال إلى الفندق',
  'Rückfahrt zum Hotel': 'العودة إلى الفندق',
  'Rückfahrt': 'العودة',
  'Rücktransfer zum Hotel': 'العودة إلى الفندق',

  // Arrival / start
  'Ankunft am Hurghada Grand Aquarium': 'الوصول إلى حوض أسماك الغردقة الكبير',
  'Ankunft am Tempel': 'الوصول إلى المعبد',
  'Ankunft am Basar': 'الوصول إلى السوق',
  'Ankunft im Mini Egypt Park': 'الوصول إلى منتجع مصر المصغر',
  'Ankunft an der Marina': 'الوصول إلى المارينا',
  'Ankunft & Begrüssung': 'الوصول والترحيب',

  // Boat / snorkel
  'Glasbodenboot-Fahrt': 'رحلة القارب ذو القاع الزجاجي',
  'Bootsfahrt im Roten Meer': 'رحلة القارب في البحر الأحمر',
  'Bootsfahrt zu den besten Schnorchelspots': 'رحلة القارب إلى أفضل مواقع الغطس',
  'Bootsfahrt zur Hula Hula Insel': 'رحلة القارب إلى جزيرة هولا هولا',
  'Schnorcheln im Roten Meer': 'الغطس في البحر الأحمر',
  'Schnorcheln & Schwimmen': 'الغطس والسباحة',
  'Schnorcheln an Korallenriffen': 'الغطس في الشعاب المرجانية',
  'Schnorcheln an zwei Korallenriffen': 'الغطس في شعاب مرجانية',
  'Schnorchelfahrt': 'رحلة غطس',
  'Schnorchelstopp (30 Minuten)': 'توقف للغطس (30 دقيقة)',
  'Schnorchelgänge': 'جلسات غطس',
  'Schnorchelausrüstung': 'معدات الغطس',
  'Wassersportaktivitäten': 'الأنشطة المائية',

  // Desert / quad
  'Quad-Tour': 'جولة كواد',
  'Quad Safari durch die Wüste': 'جولة كواد في الصحراء',
  'Safari-Tour': 'جولة سفاري',
  'Spider-Buggy': 'سيارة سبايدر بغي',
  'Jeep-Safari & Beduinendorf': 'سفاري جيب وقرية بدوية',
  'Wüstenstation': 'محطة صحراوية',
  'Beduinendorf & Tee': 'قرية بدوية وشاي',
  'Kamelritt': 'ركوب الجمل',
  'Sonnenuntergang': 'غروب الشمس',
  'Sonnenuntergang auf dem Roten Meer': 'غروب الشمس على البحر الأحمر',
  'Sonnenaufgang über Luxor – Heissluftballonfahrt': 'شروق الشمس فوق الأقصر – رحلة البالون',
  'Sonnenaufgang': 'شروق الشمس',
  'Sonnenuntergang & Abendessen': 'غروب الشمس والعشاء',

  // Meals
  'Mittagessen': 'الغداء',
  'Mittagessen im Restaurant': 'الغداء في مطعم',
  'Abendessen & Folklore-Show': 'العشاء وعرض فلكلوري',
  'BBQ-Abendessen & Folklore-Show': 'عشاء شواء وعرض فلكلوري',
  'Pause im ägyptischen Café': 'استراحة في مقهى مصري',
  'Frühstück im Hotel': 'الإفطار في الفندق',

  // Sightseeing
  'Tempelbesichtigung': 'زيارة المعبد',
  'Pyramiden von Gizeh': 'أهرامات الجيزة',
  'Grand Egyptian Museum': 'المتحف المصري الكبير',
  'Karnak-Tempel': 'معبد الكرنك',
  'Tal der Könige – drei Grabkammern': 'وادي الملوك – ثلاث مقابر',
  'Hatschepsut-Tempel': 'معبد حتشبسوت',
  'Memnon-Kolosse – Fotostopp': 'تمثالي ممنون – توقف للتصوير',
  'Hathor-Säulenhalle & Decke': 'قاعة أعمدة حتحور والسقف',
  'Weitere Bereiche': 'مناطق أخرى',
  'Höhle des Heiligen Antonius': 'كهف القديس أنطونيوس',
  'Delfinbegegnung': 'لقاء الدلافين',
  'Unterwassertunnel & Panorama-Bereiche': 'النفق تحت الماء ومناطق البانوراما',
  'Regenwald & Tierbereiche': 'الغابة المطيرة ومناطق الحيوانات',
  'Interaktive Erlebnisse': 'تجارب تفاعلية',
  'Freizeit & Fotos': 'وقت حر وتصوير',
  'Ende des Besuchs': 'نهاية الزيارة',
  'Geführte Tour': 'جولة إرشادية',
  'Freizeit im Park': 'وقت حر في الحديقة',

  // Misc
  'Einweisung & Start': 'التعليمات والانطلاق',
  'Kurze Einweisung': 'تعليمات سريعة',
  'Begrüssung & Sicherheitseinweisung': 'الترحيب وتعليمات السلامة',
  'Entspannung an Bord': 'الاسترخاء على متن القارب',
  'Entspannung am Strand': 'الاسترخاء على الشاطئ',
  'Entspannung': 'استرخاء',
  'Start an der Marina': 'الانطلاق من المارينا',
  'Schnorcheln und Strandzeit': 'الغطس ووقت الشاطئ',
  'Hotelübernachtung & Abendessen': 'الإقامة في الفندق والعشاء',
  'Inselaufenthalt (90 Minuten)': 'وقت على الجزيرة (90 دقيقة)',
  'Orange Bay oder Magawish Insel': 'جزيرة أورنج باي أو مجاويش',
  'Aufenthalt auf Orange Bay Island': 'وقت على جزيرة أورنج باي',
  'Aufenthalt auf einer ruhigen Insel': 'وقت على جزيرة هادئة',
  'Freie Zeit zum Einkaufen': 'وقت حر للتسوق',
  'Freizeit': 'وقت حر',
  'Abendliche Stadtrundfahrt': 'جولة مسائية في المدينة',
  'Stadtrundfahrt & Basar': 'جولة في المدينة والسوق',
  'Fischmarkt & Grosse Moschee': 'سوق السمك والمسجد الكبير',
  'Obst- und Gemüsemarkt': 'سوق الفواكه والخضروات',
  'Ankunft am Hurghada Grand Aquarium': 'الوصول إلى حوض أسماك الغردقة الكبير',
  'Entdeckung der Unterwasserwelt': 'استكشاف عالم ما تحت الماء',
  'Bootsfahrt zu den Schnorchelspots': 'رحلة القارب إلى مواقع الغطس',
  'Entspannung und Rückfahrt': 'الاسترخاء والعودة',
  'Makadi Water Park': 'متنزه ماكادي المائي',
  'Begrüssung, kurze Einweisung und Start der Bootstour': 'الترحيب والتعليمات السريعة وانطلاق رحلة القارب',
  'Fahrt zu den Schnorchelplätzen': 'الذهاب إلى مواقع الغطس',
  'Freie Zeit & Fotos': 'وقت حر وتصوير',
  'Rückkehr zum Hotel': 'العودة إلى الفندق',
  'Start in Hurghada': 'الانطلاق من الغردقة',
  'Weiterfahrt zur Insel': 'مواصلة الرحلة إلى الجزيرة',
  'Zeit am Strand': 'وقت على الشاطئ',
  'City Tour durch Hurghada': 'جولة في مدينة الغردقة',
  'Schiffswrack': 'حطام سفينة',
  'Kultur & Architektur': 'الثقافة والعمارة',
  'Der Aussichtsturm': 'برج المراقبة',
  'Lagunenfahrt durch El Gouna': 'رحلة بحيرة في الجونة',
  'Downtown El Gouna': 'وسط مدينة الجونة',
  'Rückfahrt im Speedboot': 'العودة بالقارب السريع',

  // Body text translations - mixed content that needs fixing
  'Frühmorgens werden Sie direkt von Ihrem Hotel in Hurghada abgeholt. Die Fahrt nach Kairo erfolgt komfortabel in einem modernen, klimatisierten Privatfahrzeug inklusive kostenloser Getränke.':
    'في الصباح الباكر يتم استقبالك مباشرة من فندقك في الغردقة. الرحلة إلى القاهرة تكون مريحة في سيارة خاصة مكيفة حديثة مع مشروبات مجانية.',

  'Ihr Guide holt Sie zwischen 09:00 und 10:00 Uhr in einem klimatisierten Privatfahrzeug ab. Von Hurghada aus erreichen wir El Gouna nach etwa 30 Minuten.':
    'مرشدك يستقبلك بين الساعة 09:00 و 10:00 في سيارة خاصة مكيفة. من الغردقة نصل إلى الجونة بعد حوالي 30 دقيقة.',

  'Die Tour beginnt mit einer entspannten Bootsfahrt durch die berühmten Lagunen. Sie sehen Luxushotels, Villen & Wohngebiete, Inseln und Wasserwege, den Yachthafen und architektonische Besonderheiten.':
    'تبدأ الجولة برحلة قارب مريحة عبر البحيرات الشهيرة. ترى فنادق فاخرة وفيلات ومناطق سكنية وجزر وممرات مائية ومرسى اليخوت ومعالم معمارية.',

  'Am frühen Morgen werden Sie direkt von Ihrem Hotel abgeholt und zum Hafen gebracht. Dort begrüsst Sie die freundliche Crew an Bord Ihres komfortablen Bootes.':
    'في الصباح الباكر يتم استقبالك من فندقك مباشرة والذهاب إلى الميناء. هناك تستقبلك الطاقم الودود على متن قاربك المريح.',

  'Nach der Ausgabe Ihrer Schnorchelausrüstung und einer kurzen Einweisung beginnt die Fahrt über das tiefblaue Rote Meer. Schon bald erreichen Sie die ersten Schnorchelplätze mit bunten Fischen, Korallenformationen und mit etwas Glück sogar Meeresschildkröten.':
    'بعد توزيع معدات الغطس وتعليمات سريعة تبدأ الرحلة عبر البحر الأحمر الأزرق العميق. قريباً تصل إلى أولى مواقع الغطس مع الأسماك الملونة وتشكيلات المرجان ومع الحظ حتى السلاحف البحرية.',

  'Am Nachmittag kehren Sie entspannt zum Hafen zurück und werden zu Ihrem Hotel gebracht.':
    'في فترة ما بعد الظهر تعود إلى الميناء ثم يتم نقلك إلى فندقك.',

  'Nach einem ereignisreichen Tag geht es zurück zum Hafen und anschliessend zu Ihrem Hotel – mit vielen neuen Eindrücken und glücklichen Erinnerungen.':
    'بعد يوم حافل تعود إلى الميناء ثم إلى فندقك – مع انطباعات جديدة وذكريات سعيدة.',

  'Fahrt zu den besten Delfinplätzen. Mit etwas Glück beobachten Sie Delfine in freier Wildbahn und können – sofern die Bedingungen es erlauben – gemeinsam mit ihnen schwimmen.':
    'الذهاب إلى أفضل أماكن الدلافين. مع الحظ تشاهد الدلافين في البرية ويمكنك – إذا سمحت الظروف – السباحة معها.',

  'Gegen 12:00 Uhr Rückfahrt und Transfer ins Hotel.':
    'حوالي الساعة 12:00 العودة والانتقال إلى الفندق.',

  'Gegen 4:00 Uhr startet Ihre Heissluftballonfahrt. Während die Sonne langsam das Niltal färbt, schweben Sie über Tempel, Felder und den Westjordan des antiken Theben.':
    'حوالي الساعة 4:00 تبدأ رحلة البالون. بينما تلون الشمس وادي النيل ببطء، تحلق فوق المعابد والحقول والضفة الغربية لطيبة القديمة.',

  'Zum Finale Ihres Ausflugs entdecken Sie den grössten Tempelkomplex Ägyptens. Tempel, gewaltige Säulen, Jahrtausende Kultur – ein würdiger Abschluss.':
    'في ختام رحلتك تكتشف أكبر مجمع معابد في مصر. معبد وأعمدة ضخمة وثقافة تمتد لآلاف السنين – ختام رائع.',

  'Ganztägiger Aufenthalt im Makadi Water Park. Bevorzugter Einlass mit organisiertem Zugang. Nutzung aller für Alter und Grösse zugelassenen Attraktionen.':
    'إقامة ليوم كامل في متنزه ماكادي المائي. دخول مفضل مع وصول منظم. استخدام جميع الألعاب المسموح بها حسب العمر والطول.',

  'Eines der Highlights der Tour. Von oben sehen Sie das Meer, die Lagunen, die Wüstenberge und die Marina. Ein perfekter Ort für eindrucksvolle Fotos.':
    'واحدة من أبرز محطات الجولة. من الأعلى ترى البحر والبحيرات وجبال الصحراء والمارينا. مكان مثالي لصور رائعة.',

  'Erkunden Sie die farbenfrohe Unterwasserwelt mit exotischen Fischen und beeindruckenden Korallenriffen. Schnorchelausrüstung wird bereitgestellt.':
    'استكشف عالم ما تحت الماء الملون مع الأسماك الاستوائية والشعاب المرجانية الرائعة. يتم توفير معدات الغطس.',

  'Entspannen Sie an den weissen Sandstränden, schwimmen Sie im kristallklaren Wasser oder schnorcheln Sie direkt vom Strand aus. Liegen und Sonnenschirme stehen für Sie bereit.':
    'استرخ على الشواطئ الرملية البيضاء، اسبح في الماء الصافي أو اغطس مباشرة من الشاطئ. الكراسي والمظلات متوفرة لك.',

  'Das Rote Meer zählt zu den schönsten Schnorchelgebieten weltweit. Entdecken Sie farbenreiche Korallenriffe, tropische Rifffische, Schildkröten, Rochen und Napoleonfische bei klarem, warmem Wasser mit sehr guter Sicht.':
    'البحر الأحمر يعتبر من أجمل مناطق الغطس في العالم. اكتشف الشعاب المرجانية الملونة والأسماك الاستوائية والسلاحف والراي وأسماك نابليون في ماء دافئ صافٍ مع رؤية ممتازة.',

  'Aufenthalt an einer abgelegenen Insel mit hellem Sandstrand. Hier haben Sie ausreichend Zeit zum Schwimmen, Sonnenbaden oder Entspannen. Durch die private Organisation der Tour vermeiden Sie Menschenansammlungen.':
    'وقت على جزيرة نائية بشاطئ رملي فاتح. لديك وقت كافٍ للسباحة أو حمامات الشمس أو الاسترخاء. من خلال التنظيم الخاص تتجنب الزحام.',

  'Ihr Tag beginnt zwischen 7:30 und 8:00 Uhr mit dem komfortablen Hoteltransfer zum Hafen von Hurghada.':
    'يومك يبدأ بين الساعة 7:30 و 8:00 مع الانتقال المريح من الفندق إلى ميناء الغردقة.',

  'Nach der Ausgabe Ihrer Schnorchelausrüstung startet die 40-minütige Bootsfahrt zu den faszinierendsten Riffen rund um Eden Island. Hier erwarten Sie bunte Korallenriffe und tropische Fische – ein Paradies für Schnorchler.':
    'بعد توزيع معدات الغطس تبدأ رحلة القارب لمدة 40 دقيقة إلى أجمل الشعاب حول جزيرة إيدن. هنا تنتظرك شعاب مرجانية ملونة وأسماك استوائية – جنة لعشاق الغطس.',

  'Verbringen Sie mehrere Stunden am Eden Island Beach, schwimmen Sie im türkisfarbenen Wasser oder entspannen Sie am Strand.':
    'اقضِ عدة ساعات على شاطئ جزيرة إيدن، اسبح في الماء الفيروزي أو استرخ على الشاطئ.',

  'Ein reichhaltiges Buffet mit lokalen und internationalen Speisen erwartet Sie während des Ausflugs.':
    'بوفيه غني بالأطباق المحلية والعالمية ينتظرك خلال الرحلة.',

  'Nutzen Sie die verbleibende Zeit zum Schwimmen, Schnorcheln oder Entspannen am Strand, bevor Sie am Nachmittag mit dem Boot zurück zum Hafen fahren und anschliessend zu Ihrem Hotel gebracht werden.':
    'استخدم الوقت المتبقي للسباحة أو الغطس أو الاسترخاء على الشاطئ قبل العودة بالقارب إلى الميناء ثم إلى فندقك.',

  'Geniessen Sie den weiten Blick über das glitzernde Rote Meer. Spüren Sie die Meeresbrise und freuen Sie sich auf unvergessliche Momente.':
    'استمتع بالمنظر الواسع للبحر الأحمر المتلألئ. اشعر بنسيم البحر واستعد للحظات لا تنسى.',

  'Auf der Rückfahrt erleben Sie den Sonnenuntergang über dem Roten Meer. Die besondere Lichtstimmung auf dem Wasser macht diesen Moment zu einem stimmungsvollen Abschluss des Ausflugs.':
    'في طريق العودة تشاهد غروب الشمس فوق البحر الأحمر. إضاءة خاصة على الماء تجعل هذه اللحظة ختاماً رائعاً للرحلة.',

  'Nach Ihrer Ankunft in Kairo entdecken Sie die weltberühmten Pyramiden von Cheops, Chephren und Mykerinos sowie die beeindruckende Sphinx und den Taltempel.':
    'بعد وصولك إلى القاهرة تكتشف أهرامات الجيزة الشهيرة خوفو وخفرع ومنقرع sowie تمثال أبو الهول الرائع ومعبد الوادي.',

  'Anschliessend besuchen Sie das spektakuläre Grand Egyptian Museum – das grösste archäologische Museum der Welt mit einzigartigen Schätzen des alten Ägyptens.':
    'ثم تزور المتحف المصري الكبير – أكبر متحف أثري في العالم بكنوز فريدة من مصر القديمة.',

  'Geniessen Sie ein leckeres Mittagessen in einem ausgewählten Restaurant in Kairo. (Getränke zum Mittagessen sind nicht im Preis enthalten).':
    'استمتع بغداء لذيذ في مطعم مختار في القاهرة. (المشروبات مع الغداء غير متضمنة في السعر).',

  'Nach einem erlebnisreichen Tag bringt Sie Ihr privater Fahrer sicher und entspannt zurück zu Ihrem Hotel in Hurghada.':
    'بعد يوم مليء بالتجارب يعيدك سائقك الخاص بأمان وراحة إلى فندقك في الغردقة.',

  'Nach der Ankunft auf der Mahmya Insel geniessen Sie die traumhafte Kulisse und ein frisch zubereitetes Mittagsbuffet in einem Restaurant direkt am Meer. Der restliche Tag gehört ganz Ihnen: Entspannen, Schwimmen, die Insel erkunden oder die Ruhe und Sonne geniessen.':
    'بعد الوصول إلى جزيرة الماهيا تستمتع بالمناظر الخلابة وبوفيه غداء طازج في مطعم على البحر مباشرة. باقي اليوم لك: استرخاء وسباحة واستكشاف الجزيرة أو الاستمتاع بالهدوء والشمس.',

  'Entdecken Sie ein faszinierendes Schiffswrack mit einer beeindruckenden Unterwasserwelt voller Fische und Korallen.':
    'اكتشف حطام سفينة رائع مع عالم تحت الماء مثير مليء بالأسماك والشعاب المرجانية.',

  'Sie geniessen ein entspanntes Abendessen und beziehen Ihr ausgewähltes Hotel, bevor die Nacht zur Vorbereitung auf das morgendliche Abenteuer ruft.':
    'تستمتع بعشاء مريح وتتوجه إلى فندقك المختار قبل أن تدعوك الليلة للاستعداد لمغامرة الصباح.',

  'Erkunden Sie die Gräber der Pharaonen, deren Wandmalereien seit Jahrtausenden leuchten.':
    'استكشف مقابر الفراعنة التي تلمع رسوماتها الجدارية منذ آلاف السنين.',

  'Ein Tempel wie aus einem Fels geschnitten. Würde, Geschichte, klare Linien.':
    'معبد منحوت من الصخر. وقار وتاريخ وخطوط واضحة.',

  'Die monumentalen Wächterfiguren des Amenophis III. erwarten Sie bereits.':
    'تماثيل الحراسة الضخمة لأمنحتب الثالث في انتظارك.',

  'Ankunft gegen 20:00 Uhr in Ihrem Hotel.':
    'الوصول حوالي الساعة 20:00 إلى فندقك.',

  'Mehrere Stunden Freizeit auf der Insel zum Baden, Entspannen, Sonnen, Fotografieren und Geniessen der einzigartigen Atmosphäre.':
    'عدة ساعات من الوقت الحر على الجزيرة للسباحة والاسترخاء والتشمس والتصوير والاستمتاع بالأجواء الفريدة.',

  'Begrüssung, kurze Einweisung und Start der Bootstour.':
    'ترحيب وتعليمات سريعة وانطلاق رحلة القارب.',

  'Fahrt über die Korallenriffe mit direktem Blick in die Unterwasserwelt.':
    'رحلة فوق الشعاب المرجانية مع إطلالة مباشرة على عالم ما تحت الماء.',

  'Getränke geniessen und Fotos machen.':
    'استمتع بالمشروبات والتقط الصور.',

  'Rückfahrt zum Hafen und Transfer zurück zu Ihrem Hotel.':
    'العودة إلى الميناء والانتقال إلى فندقك.',

  'Kurze Einführung – danach direkt auf das Quad.':
    'تعليمات سريعة – ثم مباشرة على الكواد.',

  'Fahren Sie über Sanddünen und erleben Sie echtes Offroad-Feeling.':
    'قد عبر الكثبان الرملية واستمتع بإحساس حقيقي بالقيادة على الطرق الوعرة.',

  'Kurzes, authentisches Erlebnis für Fotos & Eindrücke.':
    'تجربة قصيرة وأصيلة للصور والانطباعات.',

  'Entspannt zurück nach Ihrer Tour.':
    'عودة مريحة بعد جولتك.',

  'Tauchen Sie ein in das farbenfrohe Markttreiben und erleben Sie die authentische Atmosphäre eines ägyptischen Basars.':
    'اغمر نفسك في أجواء السوق الملونة واختبر الأجواء الأصيلة لسوق مصري.',

  'Entdecken Sie traditionelle Produkte: handgemachte Lederwaren, Parfümöle, Papyrusrollen, Gewürze, Schmuck und vieles mehr.':
    'اكتشف المنتجات التقليدية: منتجات جلدية يدوية وزيوت عطرية ولفائف البردي والتوابل والمجوهرات وغيرها.',

  'Nach einer erlebnisreichen Shoppingtour bringen wir Sie sicher und bequem zurück in Ihr Hotel.':
    'بعد جولة تسوق مليئة بالتجارب نعيدك بأمان وراحة إلى فندقك.',

  'Ihr Fahrer holt Sie zu einer vereinbarten Uhrzeit von Ihrem Hotel ab.':
    'سائقك يستقبلك في وقت متفق عليه من فندقك.',

  'Erkunden Sie die Stadt in Ihrem eigenen Tempo und geniessen Sie die freie Zeit.':
    'استكشف المدينة بوتيرتك الخاصة واستمتع بالوقت الحر.',

  'Starten Sie Ihren Tag mit einem Ausflug in der Wüste, wo Sie die Ruhe und Weite der Sahara erleben.':
    'ابدأ يومك برحلة في الصحراء حيث تختبر الهدوء وامتداد الصحراء.',

  'Geniessen Sie die Stille der Wüste und die atemberaubende Landschaft.':
    'استمتع بسكون الصحراء والمناظر الطبيعية الخلابة.',

  'Erleben Sie die traditionelle Beduinenkultur mit Tee und Gastfreundschaft.':
    'اختبر الثقافة البدوية التقليدية مع الشاي والضيافة.',

  '1–2 Schnorchelgänge an den schönsten Riffen des Roten Meeres.':
    '1–2 جلسات غطس في أجمل شعاب البحر الأحمر.',

  'Entspannung am Strand oder auf dem Boot.':
    'استرخاء على الشاطئ أو على متن القارب.',

  'Nach Ihrer Ankunft betreten Sie eines der grössten und modernsten Aquarien Ägyptens.':
    'بعد وصولك تدخل واحداً من أكبر وأحدث أحواض الأسماك في مصر.',

  'Besuchen Sie die tropische Regenwaldzone sowie den kleinen Zoo mit exotischen Vögeln, Reptilien und weiteren faszinierenden Tieren.':
    'زر منطقة الغابات المطيرة الاستوائية وحديقة الحيوانات الصغيرة مع الطيور والزواحف والحيوانات الرائعة الأخرى.',

  'Kinder und Erwachsene können das interaktive Streichelbecken entdecken und an den Tierfütterungen sowie spannenden Live-Vorführungen teilnehmen.':
    'يمكن للأطفال والكبار اكتشاف حوض اللمس التفاعلي والمشاركة في إطعام الحيوانات والعروض الحية المثيرة.',

  'Nutzen Sie die freie Zeit, um Fotos zu machen, Souvenirs zu kaufen oder die entspannte Atmosphäre des Aquariums zu geniessen.':
    'استغل وقتك الحر لالتقاط الصور أو شراء الهدايا التذكارية أو الاستمتاع بأجواء الحوض المائي المريحة.',

  'Einweisung und Start der Quad-Tour.':
    'تعليمات وانطلاق جولة الكواد.',

  'Beginnen Sie Ihre Tour durch mehr als 24 faszinierende Themenbereiche mit exotischen Meeresbewohnern, bunten Korallenriffen und beeindruckenden Grossaquarien des Roten Meeres.':
    'ابدأ جولتك عبر أكثر من 24 منطقة موضوعية رائعة مع كائنات بحرية غريبة وشعاب مرجانية ملونة وأحواض كبيرة مذهلة للبحر الأحمر.',

  'Erleben Sie den spektakulären 24 Meter langen Unterwassertunnel und beobachten Sie Haie, Rochen und zahlreiche Fischarten aus nächster Nähe.':
    'اختبر النفق تحت الماء المذهل بطول 24 متراً وشاهد أسماك القرش والراي والعديد من أنواع الأسماك عن قرب.',

  'Einweihung & Start der Quad-Tour': 'التعليمات وانطلاق جولة الكواد',
  'Spaziergang durch die Marina.': 'نزهة في المارينا.',
  'Besuch des Fischmarktes und der Grossen Moschee.': 'زيارة سوق السمك والمسجد الكبير.',
  'Weiterfahrt zum Obst- und Gemüsemarkt.': 'مواصلة الرحلة إلى سوق الفواكه والخضروات.',
  'Pause im ägyptischen Café.': 'استراحة في مقهى مصري.',
  'Rückkehr zum Hotel um 22:00 Uhr.': 'العودة إلى الفندق حوالي الساعة 22:00.',
  '22:00  Rückkehr zum Hotel': '22:00 العودة إلى الفندق',
  'Ein reichhaltiges Buffet mit lokalen und internationalen Speisen.': 'بوفيه غني بالأطباق المحلية والعالمية.',
  'Besuch des Klosters und der Kirche des Heiligen Paulus.': 'زيارة الدير وكنيسة القديس بولس.',
  'Aufstieg zur Höhle des Heiligen Antonius (optional).': 'الصعود إلى كهف القديس أنطونيوس (اختياري).',
  'Besuch der historischen Kirchen, Fresken und Manuskripte.': 'زيارة الكنائس التاريخية واللوحات الجدارية والمخطوطات.',
  'Weiterfahrt zum Kloster St. Paulus.': 'مواصلة الرحلة إلى دير القديس بولس.',
  'Besuch ausgewählter Bereiche wie Mamisi, Heiliger See und Tempelanlage.':
    'زيارة مناطق مختارة مثل الماميسي والبحيرة المقدسة ومجمع المعبد.',
  'Zeit für individuelle Besichtigung und Fotos.':
    'وقت للزيارة الخاصة والتصوير.',
  'Besichtigung der berühmten Hathor-Säulenhalle und der astronomischen Decke.':
    'زيارة قاعة أعمدة حتحور الشهيرة والسقف الفلكي.',
  'Geführte Tour durch Ägyptens Miniaturwunder: Die Pyramiden von Gizeh & die Sphinx, Der Tempel von Abu Simbel & der Assuan-Staudamm, Die beeindruckenden Tempel von Luxor mit dem berühmten Karnak-Tempel.':
    'جولة إرشادية عبر عجائب مصر المصغرة: أهرامات الجيزة وأبو الهول ومعبد أبو سمبل وسد أسوان ومعابد الأقصر الرائعة مع معبد الكرنك الشهير.',
  'Freizeit im Park – Zeit für Fotos, Staunen und kleine Entdeckungen.':
    'وقت حر في الحديقة – وقت للصور والدهشة والاكتشافات الصغيرة.',
  'Entspannung und Rückfahrt zum Hotel.':
    'استرخاء والعودة إلى الفندق.',
  'Bootsfahrt zu den schönsten Schnorchelplätzen.':
    'رحلة القارب إلى أجمل مواقع الغطس.',
  'Rückfahrt im Speedboot zum Hafen.':
    'العودة بالقارب السريع إلى الميناء.',
  'Innenstadtbesuch & Freizeit.':
    'زيارة وسط المدينة ووقت حر.',
  'Rückfahrt zum Hafen und Transfer zurück zum Hotel.':
    'العودة إلى الميناء والانتقال إلى الفندق.',

  // Arabic mixed content fragments
  'الاستلام direkt vom Hotel in Hurghada oder Makadi Bay.':
    'الاستقبال مباشرة من الفندق في الغردقة أو خليج ماكادي.',
  'النقل العائد إلى الفندق am Nachmittag.':
    'العودة إلى الفندق في فترة ما بعد الظهر.',
  'الاستلام مباشرة من فندقك في مركبة خاصة مكيفة und Transfer zum Hafen.':
    'الاستقبال مباشرة من فندقك في سيارة خاصة مكيفة والانتقال إلى الميناء.',
  'العودة zum Hafen und النقل zurück ins فندق.':
    'العودة إلى الميناء والانتقال إلى الفندق.',
  'العودة zum Hafen und النقل zurück zu Ihrem فندق.':
    'العودة إلى الميناء والانتقال إلى فندقك.',
  'مرشدك السياحي ذو الخبرة والناطق بالألمانية يستقبلك in einem مركبة مكيفة ab und bringt Sie sicher zum Hafen.':
    'مرشدك السياحي ذو الخبرة والناطق بالألمانية يستقبلك في سيارة مكيفة ويوصلك بأمان إلى الميناء.',
  'الاستلام من الفندق in Hurghada oder Umgebung.':
    'الاستقبال من الفندق في الغردقة أو المناطق المحيطة.',
  'الاستلام من فندقك في الغردقة im مركبة مكيفة.':
    'الاستقبال من فندقك في الغردقة في سيارة مكيفة.',
  'الاستلام من الفندق in Hurghada mit komfortablem, klimatisiertem Fahrzeug.':
    'الاستقبال من الفندق في الغردقة بسيارة مريحة ومكيفة.',
  'Pünktliche الاستلام مباشرة من فندقك im مركبة مكيفة.':
    'استقبال في الموعد مباشرة من فندقك في سيارة مكيفة.',
  'الاستلام مباشرة من فندقك in Hurghada.':
    'الاستقبال مباشرة من فندقك في الغردقة.',
  'Start von Hurghada, Marsa Alam oder El Quseir in einem مركبة خاصة مكيفة. Nach تقريباً 3,5 ساعات erreichen Sie Luxor.':
    'الانطلاق من الغردقة أو مرسى علم أو القصير في سيارة خاصة مكيفة. بعد حوالي 3.5 ساعات تصل إلى الأقصر.',
  'الاستلام um تقريباً 06:00 Uhr مباشرة من فندقك in Hurghada.':
    'الاستقبال حوالي الساعة 06:00 مباشرة من فندقك في الغردقة.',
  'الاستلام direkt vom Hotel in Hurghada oder Makadi Bay.':
    'الاستقبال مباشرة من الفندق في الغردقة أو خليج ماكادي.',
  'نقل مريح von Ihrer الإقامة in Hurghada.':
    'نقل مريح من مكان إقامتك في الغردقة.',
  'غروب الشمس in der Wüste.':
    'غروب الشمس في الصحراء.',
  'Frühmorgens werden Sie مباشرة من فندقك in Hurghada abgeholt. Die Fahrt nach Kairo erfolgt komfortabel in einem modernen, مركبة خاصة مكيفة متضمن kostenloser Getränke.':
    'في الصباح الباكر يتم استقبالك مباشرة من فندقك في الغردقة. الرحلة إلى القاهرة تكون مريحة في سيارة خاصة مكيفة حديثة مع مشروبات مجانية.',
  'Ihr يوم beginnt zwischen 7:30 und 8:00  mit dem komfortablen Hoteltransfer zum Hafen von Hurghada.':
    'يومك يبدأ بين الساعة 7:30 و 8:00 مع الانتقال المريح من الفندق إلى ميناء الغردقة.',
  'الوصول gegen 20:00  in Ihrem فندق.':
    'الوصول حوالي الساعة 20:00 إلى فندقك.',
  'Gegen 12:00  العودة und النقل ins فندق.':
    'حوالي الساعة 12:00 العودة والانتقال إلى الفندق.',
  'العودة am frühen Nachmittag.':
    'العودة في فترة ما بعد الظهر المبكرة.',
  'Nach Ihrer الوصول betreten Sie eines der grössten und modernsten Aquarien Ägyptens.':
    'بعد وصولك تدخل واحداً من أكبر وأحدث أحواض السمك في مصر.',
  'الاستلام في الغردقة, El Gouna, Makadi Bay, Soma Bay oder Safaga.':
    'الاستقبال في الغردقة أو الجونة أو خليج ماكادي أو خليج سوما أو سفاجا.',
};

function translateTitle(title) {
  if (!title) return title;
  // Exact match first
  if (TITLE_MAP[title]) return TITLE_MAP[title];
  // Try trimming
  const trimmed = title.replace(/\s+/g, ' ').trim();
  if (TITLE_MAP[trimmed]) return TITLE_MAP[trimmed];
  return title;
}

function translateBody(body) {
  if (!body) return body;
  let result = body;
  // Apply full sentence replacements first
  for (const [de, ar] of Object.entries(TITLE_MAP)) {
    if (result.includes(de)) {
      result = result.replaceAll(de, ar);
    }
  }
  return result;
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
      const oldTitle = item.title || '';
      const oldBody = item.content || '';
      const newTitle = translateTitle(oldTitle);
      const newBody = translateBody(oldBody);
      if (newTitle !== oldTitle) newItem.title = newTitle;
      if (newBody !== oldBody) newItem.content = newBody;
      return newItem;
    });

    const changed = JSON.stringify(content) !== JSON.stringify(newContent);
    if (changed) {
      updates.push({
        id: ct.id,
        row_id: (ct.row_id || '').substring(0, 8),
        oldContent: content,
        newContent
      });
    }
  }

  // === PREVIEW ===
  console.log(`Mode: ${IS_DRY_RUN ? 'DRY RUN' : 'EXECUTE'}\n`);
  console.log(`AR content_translations with German content JSON: ${updates.length}/${cts.length}\n`);

  for (const u of updates) {
    console.log(`=== Row ${u.row_id} (id: ${u.id}) ===`);
    for (let i = 0; i < Math.max(u.oldContent.length, u.newContent.length); i++) {
      const oldItem = u.oldContent[i] || {};
      const newItem = u.newContent[i] || {};
      if (oldItem.title !== newItem.title) {
        console.log(`  title[${i}]:`);
        console.log(`    OLD: ${oldItem.title?.substring(0, 120)}`);
        console.log(`    NEW: ${newItem.title?.substring(0, 120)}`);
      }
      if (oldItem.content !== newItem.content) {
        console.log(`  body[${i}]:`);
        console.log(`    OLD: ${oldItem.content?.substring(0, 150)}`);
        console.log(`    NEW: ${newItem.content?.substring(0, 150)}`);
      }
    }
    console.log('');
  }

  // === EXECUTE ===
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
    console.log(`Dry-run complete. Run with --execute to apply changes.`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
