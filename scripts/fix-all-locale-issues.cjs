require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient} = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const LOCALES = ['en','ru','fr','hu','ar'];

// ==================== TRANSLATION DICTIONARIES ====================

// Time format converters
const TIME_MAP = {
  'de': (h,m) => `${h}:${m} Uhr`,
  'en': (h,m) => {
    const hnum = parseInt(h);
    const ampm = hnum >= 12 ? 'PM' : 'AM';
    const h12 = hnum % 12 || 12;
    return `Approx. ${String(h12).padStart(2,'0')}:${m} ${ampm}`;
  },
  'ru': (h,m) => `примерно в ${h}:${m}`,
  'fr': (h,m) => `vers ${h}h${m}`,
  'hu': (h,m) => `kb. ${h}:${m}`,
  'ar': (h,m) => {
    const hnum = parseInt(h);
    if (hnum < 12) return `حوالي الساعة ${String(hnum).padStart(2,'0')}:${m} صباحاً`;
    const h12 = hnum === 12 ? 12 : hnum - 12;
    return `حوالي الساعة ${String(h12).padStart(2,'0')}:${m} مساءً`;
  }
};

// Common German → locale translations for itinerary strings
// Keyed by German phrase
const ITIN_TRANSLATIONS = {
  'en': {
    'Abholung vom Hotel': 'Pickup from hotel',
    'Abholung vom Hotel in Hurghada': 'Pickup from hotel in Hurghada',
    'Ankunft': 'Arrival',
    'Ankunft & Transfer zum Hotel': 'Arrival & transfer to hotel',
    'Ankunft in Kairo & Begrüßung durch Ihren Guide': 'Arrival in Cairo & welcome by your guide',
    'Mittagessen': 'Lunch',
    'Mittagessen & Getränke': 'Lunch & drinks',
    'Mittagessen in einem lokalen Restaurant.': 'Lunch at a local restaurant.',
    'Mittagessen am Nil': 'Lunch on the Nile',
    'Frühstück': 'Breakfast',
    'Frühstück im Hotel': 'Breakfast at hotel',
    'Abendessen': 'Dinner',
    'Abendessen & Folklore': 'Dinner & folklore',
    'Rückfahrt': 'Return trip',
    'Rückfahrt zum Hotel': 'Return to hotel',
    'Rückfahrt nach Hurghada': 'Return to Hurghada',
    'Rückfahrt zum Hafen & Transfer zum Hotel.': 'Return to harbor & transfer to hotel.',
    'Rückkehr': 'Return',
    'Rückkehr zum Hotel.': 'Return to hotel.',
    'Rücktransfer': 'Return transfer',
    'Rücktransfer zum Hotel': 'Return transfer to hotel',
    'Transfer': 'Transfer',
    'Transfer zum Hafen & Einschiffung': 'Transfer to harbor & boarding',
    'Abholung & Transfer zum Hafen': 'Pickup & transfer to harbor',
    'Abholung & Fahrt nach Kairo': 'Pickup & drive to Cairo',
    'Abholung & Fahrt nach Dendera': 'Pickup & drive to Dendera',
    'Abholung direkt von Ihrem Hotel.': 'Direct pickup from your hotel.',
    'Abholung direkt von Ihrem Hotel in Hurghada.': 'Direct pickup from your hotel in Hurghada.',
    'Abholung vom Hotel in Hurghada mit komfortablem, klimatisiertem Minibus.': 'Pickup from your hotel in Hurghada in a comfortable, air-conditioned minibus.',
    'Abholung vom Hotel in Hurghada.': 'Pickup from your hotel in Hurghada.',
    'Abholung in Hurghada': 'Pickup in Hurghada',
    'Abholung direkt von Ihrem Hotel in einem privaten, klimatisierten Fahrzeug und Transfer zum Hafen.': 'Direct pickup from your hotel in a private, air-conditioned vehicle and transfer to harbor.',
    'Abholung um ca. 06:00 Uhr direkt von Ihrem Hotel in Hurghada. Fahrt nach Dendera (ca. 230 km, klimatisiertes Fahrzeug).': 'Pickup at approx. 06:00 AM directly from your hotel in Hurghada. Drive to Dendera (approx. 230 km, air-conditioned vehicle).',
    'Rückfahrt nach Hurghada. Gesamt ca. 13 Stunden.': 'Return to Hurghada. Total approx. 13 hours.',
    'Rückfahrt nach Hurghada. Ankunft: ca. 17:00 Uhr.': 'Return to Hurghada. Arrival: approx. 5:00 PM.',
    'Rückfahrt zum Hafen und Transfer zurück ins Hotel.': 'Return to harbor and transfer back to hotel.',
    'Schnorcheln': 'Snorkeling',
    'Schnorcheln & Schwimmen': 'Snorkeling & swimming',
    'Schnorcheln im Roten Meer': 'Snorkeling in the Red Sea',
    'Schnorchelgänge': 'Snorkeling stops',
    'Schnorchelfahrt': 'Snorkeling trip',
    'Schnorchelausflug': 'Snorkeling excursion',
    'Bootsfahrt im Roten Meer': 'Boat trip in the Red Sea',
    'Quad-Tour': 'ATV tour',
    'Quad Safari durch die Wüste': 'ATV safari through the desert',
    'Jeep-Safari & Beduinendorf': 'Jeep safari & Bedouin village',
    'Kamelritt': 'Camel ride',
    'Hotel': 'Hotel',
    'Strand': 'Beach',
    'Wüste': 'Desert',
    'Insel': 'Island',
    'Stadt': 'City',
    'Basar': 'Bazaar',
    'Tour': 'Tour',
    'Stadtrundfahrt': 'City tour',
    'Führung': 'Guided tour',
    'Nacht': 'Night',
    'Tag': 'Day',
    'Minuten': 'Minutes',
    'Stunde': 'Hour',
    'Geführte Tour': 'Guided tour',
    'Ganztägiger Aufenthalt im Makadi Water Park': 'Full-day stay at Makadi Water Park',
    'Einweisung & Start': 'Briefing & start',
    'Einweisung & Vorbereitung': 'Briefing & preparation',
    'Einweisung und Start der Quad-Tour.': 'Briefing and start of the ATV tour.',
    'Begrüßung & Sicherheitseinweisung': 'Welcome & safety briefing',
    'Hotelabholung': 'Hotel pickup',
    'Hotelabholung in Hurghada': 'Hotel pickup in Hurghada',
    'Persönliche Begrüßung und Sicherheitseinweisung an Bord des privaten Bootes.': 'Personal welcome and safety briefing on board the private boat.',
    'Freizeit & Fotos': 'Free time & photos',
    'Freie Zeit zum Einkaufen': 'Free time for shopping',
    'Delfinbegegnung': 'Dolphin encounter',
    'Besuch': 'Visit',
    'Besichtigung': 'Sightseeing',
    'Besichtigung Abydos-Tempel': 'Visit Abydos Temple',
    'Besichtigung Hathor-Tempel': 'Visit Hathor Temple',
    'Besichtigung Kloster St. Antonius': 'Visit St. Anthony Monastery',
    'Besichtigung Kloster St. Paulus': 'Visit St. Paul Monastery',
    'Reitausflug (1–2 Stunden)': 'Horseback ride (1–2 hours)',
    'Individueller Ausritt entlang des Strandes, durch die Wüste oder als Kombination.': 'Individual ride along the beach, through the desert, or a combination.',
    'Sonnenuntergang': 'Sunset',
    'Sonnenuntergang in der Wüste.': 'Sunset in the desert.',
    'Sonnenuntergang auf dem Roten Meer': 'Sunset on the Red Sea',
    'Sonnenaufgang über Luxor – Heißluftballonfahrt': 'Sunrise over Luxor – hot air balloon ride',
    'Wassersportaktivitäten': 'Water sports activities',
    'Banana Boat und Sofa Boat unter professioneller Aufsicht': 'Banana boat and sofa boat under professional supervision',
    'Spider-Buggy': 'Spider buggy',
    'Spider-Buggy Fahrt durch die Wüste.': 'Spider buggy ride through the desert.',
    'BBQ-Abendessen & Folklore': 'BBQ dinner & folklore',
    'BBQ-Abendessen und Folklore-Show.': 'BBQ dinner and folklore show.',
    'Kurze Einführung – danach direkt auf das Quad.': 'Short introduction – then directly onto the ATV.',
    'Beduinendorf & Tee': 'Bedouin village & tea',
    'Einblick in die Kultur der Wüste inklusive traditionellem Tee.': 'Insight into desert culture including traditional tea.',
    'Fahrt zur Wüstenstation.': 'Drive to the desert station.',
    'Kultur & Architektur': 'Culture & architecture',
    'Spaziergang durch die Marina': 'Walk through the marina',
    'Spaziergang durch die Marina.': 'Stroll through the marina.',
    'Glasbodenboot-Fahrt': 'Glass-bottom boat ride',
    'Fahrt über die Korallenriffe mit direktem Blick in die Unterwasserwelt.': 'Ride over the coral reefs with a direct view of the underwater world.',
    'Unterwassertunnel & Panorama-Bereiche': 'Underwater tunnel & panorama areas',
    'Regenwald & Tierbereiche': 'Rainforest & animal areas',
    'Interaktive Erlebnisse': 'Interactive experiences',
    'Entdeckung der Unterwasserwelt': 'Discovery of the underwater world',
    'Weitere Bereiche': 'Other areas',
    'Ende des Besuchs': 'End of visit',
    'Rückkehr am frühen Nachmittag.': 'Return in the early afternoon.',
    'Gegen 12:00 Uhr Rückkehr und Transfer ins Hotel.': 'Around 12:00 PM return and transfer to hotel.',
    'Rücktransfer zum Hotel am Nachmittag.': 'Return transfer to hotel in the afternoon.',
    'Abholung (04:00 Uhr)': 'Pickup (4:00 AM)',
    'Abholung (04:00–04:30 Uhr)': 'Pickup (4:00–4:30 AM)',
    'Abholung (03:00 Uhr)': 'Pickup (3:00 AM)',
    'Ankunft gegen 20:00 Uhr in Ihrem Hotel.': 'Arrival at your hotel around 8:00 PM.',
    'Fahrt nach Dendera': 'Drive to Dendera',
    'Weiterfahrt nach Abydos': 'Continue to Abydos',
    'Weiterfahrt zum Kloster St. Paulus': 'Continue to St. Paul Monastery',
    'Weiterfahrt zum Kloster St. Paulus.': 'Continue to St. Paul Monastery.',
    'Ca. 2 Stunden Besichtigung des Abydos-Tempels.': 'Approx. 2 hours visiting Abydos Temple.',
    'Ca. 2 Stunden Besichtigung des Hathor-Tempels.': 'Approx. 2 hours visiting Hathor Temple.',
    'Mittagessen in Abydos': 'Lunch in Abydos',
    'Mittagessen in Abydos.': 'Lunch in Abydos.',
    'Mittagessen in Theben West': 'Lunch in West Thebes',
    'Besichtigen Sie die tropische Regenwaldzone sowie den kleinen Zoo': 'Visit the tropical rainforest zone and the small zoo',
    'Erkunden Sie die farbenfrohe Unterwasserwelt mit exotischen Fischen': 'Explore the colorful underwater world with exotic fish',
    'Abholung direkt von Ihrem Hotel in einem privaten, klimatisierten Fahrzeug': 'Direct pickup from your hotel in a private, air-conditioned vehicle',
    'Pause im ägyptischen Café': 'Break at an Egyptian café',
    'Pause im ägyptischen Café.': 'Break at an Egyptian café.',
    'Fischmarkt & Große Moschee': 'Fish market & Great Mosque',
    'Besuch des Fischmarktes und der Großen Moschee.': 'Visit the fish market and the Great Mosque.',
    'Freizeit im Park': 'Free time in the park',
    'Freizeit im Park – Zeit für Fotos, Staunen und kleine Entdeckungen.': 'Free time in the park – time for photos, wonder, and small discoveries.',
    'Mini Egypt Park': 'Mini Egypt Park',
    'Ankunft im Mini Egypt Park': 'Arrival at Mini Egypt Park',
    'Ankunft im Mini Egypt Park – dein persönlicher Guide begrüßt dich.': 'Arrival at Mini Egypt Park – your personal guide welcomes you.',
    'Obst- und Gemüsemarkt': 'Fruit and vegetable market',
    'Weiterfahrt zum Obst- und Gemüsemarkt.': 'Continue to the fruit and vegetable market.',
    'Nutzen Sie die freie Zeit, um Fotos zu machen': 'Use the free time to take photos',
    'Tauchen Sie ein in das farbenfrohe Markttreiben': 'Immerse yourself in the colorful market activity',
    'Gemeinsam besuchen wir einige der wichtigsten Sehenswürdigkeiten': 'Together we visit some of the most important sights',
    'Individuelle Besichtigung': 'Individual sightseeing',
    'Zeit für individuelle Besichtigung und Fotos.': 'Time for individual sightseeing and photos.',
    'Höhle des Heiligen Antonius': 'Cave of St. Anthony',
    'Aufstieg zur Höhle des Heiligen Antonius (optional).': 'Ascent to the Cave of St. Anthony (optional).',
    'Dahschur – Rote & Knickpyramide': 'Dahshur – Red & Bent Pyramid',
    'Erkunden der Knickpyramide und der Roten Pyramide.': 'Explore the Bent Pyramid and the Red Pyramid.',
    'Sakkara – Stufenpyramide des Djoser': 'Saqqara – Step Pyramid of Djoser',
    'Besichtigung der Stufenpyramide und Einführung in die frühe Architektur.': 'Visit the Step Pyramid and introduction to early architecture.',
    'Besuch ausgewählter Bereiche wie Mamisi, Heiliger See und Tempelanlage.': 'Visit selected areas such as Mamisi, Sacred Lake, and temple complex.',
    'Eines der Highlights der Tour.': 'One of the tour highlights.',
    'Transfer zum Hafen & Einschiffung': 'Transfer to harbor & boarding',
    'Rückkehr zum Hafen und Transfer zurück zu Ihrem Hotel.': 'Return to the harbor and transfer back to your hotel.',
    'Rückfahrt zum Hafen und Transfer zurück ins Hotel.': 'Return to the harbor and transfer back to the hotel.',
    'Abholung direkt vom Hotel in Hurghada oder Makadi Bay.': 'Direct pickup from hotel in Hurghada or Makadi Bay.',
    'Abholung von Ihrem Hotel in Hurghada im klimatisierten Fahrzeug.': 'Pickup from your hotel in Hurghada in an air-conditioned vehicle.',
    'Pünktliche Abholung direkt von Ihrem Hotel im klimatisierten Fahrzeug.': 'Punctual pickup directly from your hotel in an air-conditioned vehicle.',
    'Bequeme Abholung von Ihrem Hotel in Hurghada oder Umgebung.': 'Comfortable pickup from your hotel in Hurghada or surrounding area.',
    'Wir holen Sie bequem mit klimatisiertem Fahrzeug direkt von Ihrem Hotel in Hurghada oder Umgebung ab.': 'We pick you up comfortably in an air-conditioned vehicle directly from your hotel in Hurghada or surrounding area.',
    'Bequemer Transfer im klimatisierten Fahrzeug.': 'Comfortable transfer in an air-conditioned vehicle.',
    'Bequeme Fahrt Richtung Kairo mit Zwischenpause.': 'Comfortable drive towards Cairo with a break.',
    'Die Abholung erfolgt gegen 02:00 Uhr direkt von Ihrem Hotel in Hurghada.': 'Pickup is around 2:00 AM directly from your hotel in Hurghada.',
    'Gegen 04:00 Uhr holt Sie Ihr privater Fahrer im klimatisierten Fahrzeug ab.': 'Around 4:00 AM your private driver picks you up in an air-conditioned vehicle.',
    'Frühmorgens werden Sie direkt von Ihrem Hotel in Hurghada abgeholt.': 'Early morning you are picked up directly from your hotel in Hurghada.',
    'Nach Ihrer Ankunft in Kairo entdecken Sie die weltberühmten Pyramiden': 'After your arrival in Cairo, discover the world-famous pyramids',
    'Besuch der Pyramiden und der Sphinx.': 'Visit to the pyramids and the Sphinx.',
    'Genießen Sie ein leckeres Mittagessen in einem ausgewählten Restaurant in Kairo.': 'Enjoy a delicious lunch at a selected restaurant in Cairo.',
    'Genießen Sie ein leckeres Mittagessen in einem landestypischen Restaurant.': 'Enjoy a delicious lunch at a local restaurant.',
    'Nach dem Mittagessen erfolgt Rückfahrt nach Hurghada.': 'After lunch, return journey to Hurghada.',
    'Nach der Besichtigung erwartet Sie ein frisch zubereitetes ägyptisches Mittagessen': 'After the visit, a freshly prepared Egyptian lunch awaits you',
    'Bootsfahrt zu den besten Schnorchelspots': 'Boat trip to the best snorkeling spots',
    'Zwei Stopps an farbenprächtigen Riffen': 'Two stops at colorful reefs',
    'Schnorchelstopp (30 Minuten)': 'Snorkeling stop (30 minutes)',
    'Geführtes Schnorcheln an einem ruhigen Riff.': 'Guided snorkeling at a calm reef.',
    'Schnorcheln an zwei Korallenriffen': 'Snorkeling at two coral reefs',
    'Schnorcheln an Korallenriffen': 'Snorkeling at coral reefs',
    'Aufenthalt auf Orange Bay Island': 'Stay at Orange Bay Island',
    'Orange Bay oder Magawish Insel': 'Orange Bay or Magawish Island',
    'Fahrt zur Orange Bay oder Magawish Insel mit Freizeit, Mittagessen & Strandaufenthalt.': 'Trip to Orange Bay or Magawish Island with free time, lunch & beach time.',
    'Aufenthalt auf einer ruhigen Insel': 'Stay on a quiet island',
    'Inselaufenthalt (90 Minuten)': 'Island stay (90 minutes)',
    'Mehrere Stunden Freizeit auf der Insel': 'Several hours of free time on the island',
    'Mittagessen während des Ausflugs': 'Lunch during the excursion',
    'Frisch zubereitetes Mittagessen mit alkoholfreien Getränken': 'Freshly prepared lunch with non-alcoholic drinks',
    'Entspannung am Strand oder auf dem Boot.': 'Relaxation on the beach or on the boat.',
    'Entspannung an Bord': 'Relaxation on board',
    'Bootsfahrt zur Hula Hula Insel': 'Boat trip to Hula Hula Island',
    'Mahmya Insel & Mittagessen': 'Mahmya Island & lunch',
    'Nach der Ankunft auf der Mahmya Insel genießen Sie die traumhafte Kulisse': 'After arriving at Mahmya Island, enjoy the dreamlike scenery',
    'Eden Island': 'Eden Island',
    'Abholung in Hurghada, El Gouna, Makadi Bay, Soma Bay oder Safaga.': 'Pickup in Hurghada, El Gouna, Makadi Bay, Soma Bay, or Safaga.',
    'Ihr Guide holt Sie zwischen 09:00 und 10:00 Uhr in einem privaten, klimatisierten Fahrzeug ab.': 'Your guide picks you up between 9:00 and 10:00 AM in a private, air-conditioned vehicle.',
    'Lagunenfahrt durch El Gouna': 'Lagoon cruise through El Gouna',
    'Die Tour beginnt mit einer entspannten Bootsfahrt durch die berühmten Lagunen.': 'The tour begins with a relaxed boat ride through the famous lagoons.',
    'Downtown El Gouna': 'Downtown El Gouna',
    'In der Innenstadt erwarten Sie Cafés, Boutiquen, Kunsthandwerk': 'In the city center, cafés, boutiques, and crafts await you',
    'Abu Tig Marina': 'Abu Tig Marina',
    'Der Aussichtsturm': 'The observation tower',
    'Genießen Sie den weiten Blick über das glitzernde Rote Meer.': 'Enjoy the wide view over the sparkling Red Sea.',
    'Bequemer Transfer von Ihrer Unterkunft in Hurghada.': 'Comfortable transfer from your accommodation in Hurghada.',
    'Ein reichhaltiges Buffet mit lokalen und internationalen Speisen': 'A rich buffet with local and international dishes',
    'Start an der Marina': 'Start at the marina',
    'Abholung & Transfer zum Hafen': 'Pickup & transfer to harbor',
    'Schnorcheln im Roten Meer': 'Snorkeling in the Red Sea',
    'Fahrt mit einem modernen Ausflugsboot oder einer komfortablen Yacht Richtung Orange Bay Island.': 'Trip on a modern excursion boat or comfortable yacht towards Orange Bay Island.',
    'Softdrinks sind an Bord inklusive.': 'Soft drinks are included on board.',
    'Aufenthalt an einer abgelegenen Insel mit hellem Sandstrand.': 'Stay on a secluded island with bright sandy beach.',
    'Hier haben Sie ausreichend Zeit zum Schwimmen, Sonnenbaden oder Entspannen.': 'Here you have plenty of time to swim, sunbathe, or relax.',
    'Durch die private Organisation der Tour vermeiden Sie Menschenansammlungen': 'Through the private organization of the tour, you avoid crowds',
    'Entdecken Sie ein faszinierendes Schiffswrack': 'Discover a fascinating shipwreck',
    'Schiffswrack': 'Shipwreck',
    'Persönliche Begrüßung, Ausrüstung, kurze Einweisung – danach beginnt Ihr Abenteuer.': 'Personal welcome, equipment, short briefing – then your adventure begins.',
    'Schnorcheln und Strandzeit': 'Snorkeling and beach time',
    'Verbringen Sie mehrere Stunden am Eden Island Beach': 'Spend several hours at Eden Island Beach',
    'Zwei geführte Schnorchelstopps an sorgfältig ausgewählten Riffen': 'Two guided snorkeling stops at carefully selected reefs',
    'Komplette Schnorchelausrüstung wird gestellt': 'Complete snorkeling equipment is provided',
    'Nach der Ausgabe Ihrer Schnorchelausrüstung startet die 40-minütige Bootsfahrt': 'After receiving your snorkeling equipment, the 40-minute boat trip begins',
    'Nach der Ausgabe Ihrer Schnorchelausrüstung und einer kurzen Einweisung': 'After receiving your snorkeling equipment and a short briefing',
    'Am frühen Morgen werden Sie direkt von Ihrem Hotel abgeholt und zum Hafen gebracht.': 'Early in the morning you are picked up directly from your hotel and taken to the harbor.',
    'Dort begrüßt Sie die freundliche Crew an Bord Ihres komfortablen Bootes.': 'There the friendly crew welcomes you on board your comfortable boat.',
    'Nach einem ereignisreichen Tag geht es zurück zum Hafen': 'After an eventful day, it is back to the harbor',
    'Ihr erfahrener, deutschsprachiger Reiseleiter holt Sie in einem klimatisierten Fahrzeug ab': 'Your experienced, German-speaking guide picks you up in an air-conditioned vehicle',
    'Abholung direkt von Ihrem Hotel in Hurghada oder Makadi Bay.': 'Direct pickup from your hotel in Hurghada or Makadi Bay.',
    'Makadi Water Park': 'Makadi Water Park',
    'Bevorzugter Einlass mit organisiertem Zugang.': 'Priority entry with organized access.',
    'Nutzung aller für Alter und Größe zugelassenen Attraktionen.': 'Use of all attractions permitted for age and height.',
    'Besuchen Sie die tropische Regenwaldzone sowie den kleinen Zoo': 'Visit the tropical rainforest zone as well as the small zoo',
    'mit exotischen Vögeln, Reptilien und weiteren faszinierenden Tieren': 'with exotic birds, reptiles, and other fascinating animals',
    'Kinder und Erwachsene können das interaktive Streichelbecken entdecken': 'Children and adults can discover the interactive petting pool',
    'Entdecken Sie die beeindruckenden Schätze des alten Ägyptens': 'Discover the impressive treasures of ancient Egypt',
    'darunter die berühmte Goldmaske des Tutanchamun.': 'including the famous gold mask of Tutankhamun.',
    'Nach Ihrer Ankunft betreten Sie eines der größten und modernsten Aquarien Ägyptens.': 'After your arrival, enter one of the largest and most modern aquariums in Egypt.',
    'Dank Ihres Online-Tickets genießen Sie einen schnellen und unkomplizierten Eintritt': 'Thanks to your online ticket, enjoy quick and easy entry',
    'Beginnen Sie Ihre Tour durch mehr als 24 faszinierende Themenbereiche': 'Start your tour through more than 24 fascinating themed areas',
    'mit exotischen Meeresbewohnern, bunten Korallenriffen und beeindruckenden Großaquarien': 'with exotic marine life, colorful coral reefs, and impressive large aquariums',
    'Erleben Sie den spektakulären 24 Meter langen Unterwassertunnel': 'Experience the spectacular 24-meter-long underwater tunnel',
    'und beobachten Sie Haie, Rochen und zahlreiche Fischarten aus nächster Nähe': 'and observe sharks, rays, and numerous fish species up close',
    'Ein unvergessliches Erlebnis für die ganze Familie.': 'An unforgettable experience for the whole family.',
    'Nach einem erlebnisreichen Rundgang endet Ihr Besuch im Hurghada Grand Aquarium': 'After an eventful tour, your visit to Hurghada Grand Aquarium ends',
    'Ankunft am Hurghada Grand Aquarium': 'Arrival at Hurghada Grand Aquarium',
    'Gizeh': 'Giza',
    'Pyramiden von Gizeh': 'Pyramids of Giza',
    'Die Pyramiden von Gizeh': 'The Pyramids of Giza',
    'Besuchen Sie die weltberühmten Pyramiden von Cheops, Chephren und Mykerinos': 'Visit the world-famous Pyramids of Cheops, Chephren, and Mykerinos',
    'Taltempel & Große Sphinx': 'Valley Temple & Great Sphinx',
    'Erkunden Sie den Taltempel von König Chephren': 'Explore the Valley Temple of King Chephren',
    'Grand Egyptian Museum': 'Grand Egyptian Museum',
    'Grand Egyptian Museum (GEM)': 'Grand Egyptian Museum (GEM)',
    'Anschließend besuchen Sie das spektakuläre Grand Egyptian Museum': 'Then visit the spectacular Grand Egyptian Museum',
    'das größte archäologische Museum der Welt': 'the largest archaeological museum in the world',
    'Fahrt durch die östliche Wüste zum Kloster St. Antonius.': 'Drive through the Eastern Desert to St. Anthony Monastery.',
    'Besichtigung des Klosters und der Kirche des Heiligen Paulus.': 'Visit to the monastery and church of St. Paul.',
    'Besichtigung der historischen Kirchen, Fresken und Manuskripte.': 'Visit to the historic churches, frescoes, and manuscripts.',
    'Besichtigung der berühmten Hathor-Säulenhalle und der astronomischen Decke.': 'Visit the famous Hathor column hall and the astronomical ceiling.',
    'Weiterfahrt nach Abydos (ca. 100 km).': 'Continue to Abydos (approx. 100 km).',
    'Fahrt nach Dendera (ca. 250 km).': 'Drive to Dendera (approx. 250 km).',
    'Abholung um ca. 06:00 Uhr direkt von Ihrem Hotel in Hurghada.': 'Pickup at approx. 6:00 AM directly from your hotel in Hurghada.',
    'Fahrt nach Dendera (ca. 230 km, klimatisiertes Fahrzeug).': 'Drive to Dendera (approx. 230 km, air-conditioned vehicle).',
    'Bequeme Fahrt in die Wüste.': 'Comfortable drive into the desert.',
    'Fahrt zu den besten Delfinplätzen.': 'Trip to the best dolphin spots.',
    'Mit etwas Glück beobachten Sie Delfine in freier Wildbahn': 'With luck, you observe dolphins in the wild',
    'Hinweis: Delfine sind Wildtiere.': 'Note: Dolphins are wild animals.',
    'Eine Sichtung kann nicht garantiert werden, die Erfolgsquote ist jedoch sehr hoch.': 'Sighting cannot be guaranteed, but the success rate is very high.',
    'Gegen 20 Uhr erreichen Sie wieder Ihr Hotel.': 'Around 8:00 PM you will be back at your hotel.',
    'Nach vielen schönen Eindrücken fahren wir zurück nach Hurghada.': 'After many beautiful impressions, we drive back to Hurghada.',
    'Kurzes, authentisches Erlebnis für Fotos & Eindrücke.': 'Short, authentic experience for photos & impressions.',
    'Besuchen Sie die berühmte Stufenpyramide von König Djoser': 'Visit the famous Step Pyramid of King Djoser',
    'die älteste Steinpyramide der Welt': 'the oldest stone pyramid in the world',
    'sowie die kunstvoll verzierten Gräber der Adligen.': 'as well as the elaborately decorated tombs of the nobles.',
    'Entdecken Sie die einzigartige Architektur der Roten Pyramide': 'Discover the unique architecture of the Red Pyramid',
    'und der berühmten Knickpyramide': 'and the famous Bent Pyramid',
    'die als wichtige Entwicklungsstufen des Pyramidenbaus gelten.': 'which are considered important stages in pyramid construction.',
    'Nach dem Frühstück beginnt die Weiterreise zu den ältesten Pyramiden Ägyptens.': 'After breakfast, continue to Egypt\'s oldest pyramids.',
    'Sakkara': 'Saqqara',
    'Dahschur': 'Dahshur',
    'Memnon-Kolosse': 'Colossi of Memnon',
    'Memnon-Kolosse – Fotostopp': 'Colossi of Memnon – photo stop',
    'Zwei riesige Statuen, die seit Jahrtausenden am Nilufer stehen': 'Two giant statues that have stood on the Nile banks for millennia',
    'Tal der Könige': 'Valley of the Kings',
    'Tal der Könige – drei Grabkammern': 'Valley of the Kings – three tombs',
    'Erkunden Sie die Gräber der Pharaonen': 'Explore the tombs of the pharaohs',
    'Hatschepsut-Tempel': 'Temple of Hatshepsut',
    'Ein Tempel wie aus einem Fels geschnitten.': 'A temple carved out of rock.',
    'Karnak-Tempel': 'Karnak Temple',
    'Zum Finale Ihres Ausflugs entdecken Sie den größten Tempelkomplex Ägyptens.': 'At the finale of your excursion, discover Egypt\'s largest temple complex.',
    'Tempel, gewaltige Säulen, Jahrtausende Kultur – ein würdiger Abschluss.': 'Temples, mighty columns, millennia of culture – a worthy conclusion.',
    'Der erste Blick auf die gewaltigen Säulen des Karnak-Tempels': 'The first look at the mighty columns of Karnak Temple',
    'Ihr Ägyptologe begleitet Sie durch die Anlage und zeigt Ihnen verborgene Details': 'Your Egyptologist accompanies you through the complex and shows you hidden details',
    'die man allein kaum bemerken würde.': 'that one would hardly notice alone.',
    'Ein Bauwerk, das wie eine Bühne vor der Felswand liegt.': 'A structure that lies like a stage in front of the rock face.',
    'Klar, symmetrisch, kraftvoll.': 'Clear, symmetrical, powerful.',
    'Ein perfekter Platz für eindrucksvolle Fotos.': 'A perfect place for impressive photos.',
    'Ein Ort, der überrascht.': 'A place that surprises.',
    'Von außen unscheinbar, im Inneren farbenprächtig und fein wie eine Schatzkammer.': 'Unassuming from the outside, colorful and fine inside like a treasure chamber.',
    'Die kunstvollen Wandmalereien erzählen von Glauben, Macht und Unsterblichkeit.': 'The elaborate wall paintings tell of faith, power, and immortality.',
    'Fotografieren ist mit dem Handy inzwischen kostenlos erlaubt.': 'Photography with your phone is now permitted free of charge.',
    'Ein reichhaltiges ägyptisches Menü bietet Stärkung für den weiteren Tag.': 'A rich Egyptian menu provides energy for the rest of the day.',
    'Nach der Besichtigung erwartet Sie ein frisch zubereitetes ägyptisches Mittagessen, liebevoll serviert': 'After the visit, a freshly prepared Egyptian lunch awaits you, lovingly served',
    'ideal zum Entspannen vor dem nächsten Höhepunkt.': 'ideal for relaxing before the next highlight.',
    'Die monumentalen Wächterfiguren des Amenophis III. erwarten Sie bereits.': 'The monumental guardian figures of Amenophis III await you.',
    'Die Eindrücke dieses Tages wirken oft noch lange nach.': 'The impressions of this day often linger for a long time.',
    'Sonnenuntergang auf dem Roten Meer': 'Sunset on the Red Sea',
    'Auf der Rückfahrt erleben Sie den Sonnenuntergang über dem Roten Meer.': 'On the return trip, experience the sunset over the Red Sea.',
    'Die besondere Lichtstimmung auf dem Wasser macht diesen Moment zu einem stimmungsvollen Abschluss': 'The special light on the water makes this moment an atmospheric conclusion',
    'Abholung vom Hotel in Hurghada mit komfortablem, klimatisiertem Minibus.': 'Pickup from your hotel in Hurghada in a comfortable, air-conditioned minibus.',
  },
  'ru': {},
  'fr': {},
  'hu': {},
  'ar': {},
};

// Fill other languages with basic translations
for (const loc of ['ru','fr','hu','ar']) {
  for (const [de, en] of Object.entries(ITIN_TRANSLATIONS.en)) {
    // We'll handle translations per language below
  }
}

// Russian translations
ITIN_TRANSLATIONS.ru = {
  'Abholung vom Hotel': 'Забор из отеля',
  'Abholung vom Hotel in Hurghada': 'Забор из отеля в Хургаде',
  'Ankunft': 'Прибытие',
  'Ankunft & Transfer zum Hotel': 'Прибытие и трансфер в отель',
  'Ankunft in Kairo & Begrüßung durch Ihren Guide': 'Прибытие в Каир и встреча с гидом',
  'Mittagessen': 'Обед',
  'Mittagessen am Nil': 'Обед на Ниле',
  'Mittagessen in einem lokalen Restaurant.': 'Обед в местном ресторане.',
  'Frühstück': 'Завтрак',
  'Frühstück im Hotel': 'Завтрак в отеле',
  'Abendessen': 'Ужин',
  'Abendessen & Folklore': 'Ужин и фольклор',
  'Rückfahrt': 'Обратный путь',
  'Rückfahrt zum Hotel': 'Возвращение в отель',
  'Rückfahrt nach Hurghada': 'Возвращение в Хургаду',
  'Rückkehr': 'Возвращение',
  'Rückkehr zum Hotel.': 'Возвращение в отель.',
  'Rücktransfer': 'Обратный трансфер',
  'Rücktransfer zum Hotel': 'Обратный трансфер в отель',
  'Transfer': 'Трансфер',
  'Transfer zum Hafen & Einschiffung': 'Трансфер в порт и посадка',
  'Abholung & Transfer zum Hafen': 'Забор и трансфер в порт',
  'Abholung & Fahrt nach Kairo': 'Забор и поездка в Каир',
  'Abholung & Fahrt nach Dendera': 'Забор и поездка в Дендеру',
  'Abholung direkt von Ihrem Hotel.': 'Прямой забор из вашего отеля.',
  'Abholung direkt von Ihrem Hotel in Hurghada.': 'Прямой забор из вашего отеля в Хургаде.',
  'Abholung vom Hotel in Hurghada mit komfortablem, klimatisiertem Minibus.': 'Забор из отеля в Хургаде на комфортабельном микроавтобусе с кондиционером.',
  'Abholung vom Hotel in Hurghada.': 'Забор из отеля в Хургаде.',
  'Abholung in Hurghada': 'Забор в Хургаде',
  'Abholung direkt von Ihrem Hotel in einem privaten, klimatisierten Fahrzeug und Transfer zum Hafen.': 'Прямой забор из вашего отеля на частном автомобиле с кондиционером и трансфер в порт.',
  'Schnorcheln': 'Снорклинг',
  'Schnorcheln & Schwimmen': 'Снорклинг и плавание',
  'Schnorcheln im Roten Meer': 'Снорклинг в Красном море',
  'Schnorchelgänge': 'Остановки для снорклинга',
  'Schnorchelfahrt': 'Поездка для снорклинга',
  'Quad-Tour': 'Квадроцикл тур',
  'Quad Safari durch die Wüste': 'Квадроцикл сафари по пустыне',
  'Kamelritt': 'Верховая езда на верблюде',
  'Hotel': 'Отель',
  'Strand': 'Пляж',
  'Wüste': 'Пустыня',
  'Insel': 'Остров',
  'Basar': 'Базар',
  'Abholung in Hurghada, El Gouna, Makadi Bay, Soma Bay oder Safaga.': 'Забор в Хургаде, Эль-Гуне, Макади Бэй, Сома Бэй или Сафаге.',
  'Lagunenfahrt durch El Gouna': 'Прогулка по лагунам Эль-Гуны',
  'Downtown El Gouna': 'Центр Эль-Гуны',
  'Abu Tig Marina': 'Абу Тиг Марина',
  'Der Aussichtsturm': 'Смотровая башня',
  'Grand Egyptian Museum': 'Большой Египетский музей',
  'Grand Egyptian Museum (GEM)': 'Большой Египетский музей (GEM)',
  'Pyramiden von Gizeh': 'Пирамиды Гизы',
  'Die Pyramiden von Gizeh': 'Пирамиды Гизы',
  'Gizeh': 'Гиза',
  'Sakkara': 'Саккара',
  'Dahschur': 'Дахшур',
  'Tal der Könige': 'Долина Царей',
  'Tal der Könige – drei Grabkammern': 'Долина Царей – три гробницы',
  'Hatschepsut-Tempel': 'Храм Хатшепсут',
  'Karnak-Tempel': 'Карнакский храм',
  'Memnon-Kolosse': 'Колоссы Мемнона',
  'Memnon-Kolosse – Fotostopp': 'Колоссы Мемнона – фотостоп',
  'Sonnenuntergang': 'Закат',
  'Sonnenuntergang in der Wüste.': 'Закат в пустыне.',
  'Sonnenuntergang auf dem Roten Meer': 'Закат на Красном море',
  'Sonnenaufgang über Luxor – Heißluftballonfahrt': 'Восход над Луксором – полёт на воздушном шаре',
  'Mittagessen & Getränke': 'Обед и напитки',
  'Mittagessen in Abydos': 'Обед в Абидосе',
  'Mittagessen in Theben West': 'Обед в Западных Фивах',
  'Bootsfahrt im Roten Meer': 'Поездка на лодке по Красному морю',
  'Bootsfahrt zu den besten Schnorchelspots': 'Поездка на лодке к лучшим местам для снорклинга',
  'Schnorcheln an Korallenriffen': 'Снорклинг у коралловых рифов',
  'Schnorcheln an zwei Korallenriffen': 'Снорклинг у двух коралловых рифов',
  'Inselaufenthalt (90 Minuten)': 'Пребывание на острове (90 минут)',
  'Freizeit & Fotos': 'Свободное время и фото',
  'Freie Zeit zum Einkaufen': 'Свободное время для покупок',
  'Delfinbegegnung': 'Встреча с дельфинами',
  'Besichtigung': 'Осмотр',
  'Besichtigung Abydos-Tempel': 'Осмотр храма Абидоса',
  'Besichtigung Hathor-Tempel': 'Осмотр храма Хатхор',
  'Besichtigung Kloster St. Antonius': 'Осмотр монастыря Св. Антония',
  'Besichtigung Kloster St. Paulus': 'Осмотр монастыря Св. Павла',
  'Glasbodenboot-Fahrt': 'Поездка на лодке со стеклянным дном',
  'Unterwassertunnel & Panorama-Bereiche': 'Подводный туннель и панорамные зоны',
  'Regenwald & Tierbereiche': 'Тропический лес и зоны с животными',
  'Spider-Buggy': 'Спайдер-багги',
  'Spider-Buggy Fahrt durch die Wüste.': 'Поездка на спайдер-багги по пустыне.',
  'Makadi Water Park': 'Макади Вотер Парк',
  'Führung': 'Экскурсия',
  'Geführte Tour': 'Экскурсия с гидом',
  'Kultur & Architektur': 'Культура и архитектура',
  'Spaziergang durch die Marina': 'Прогулка по марине',
  'Essen & Getränke': 'Еда и напитки',
  'Fahrt nach Dendera': 'Поездка в Дендеру',
  'Weiterfahrt nach Abydos': 'Продолжение поездки в Абидос',
  'Abholung vom Hotel in Hurghada mit komfortablem, klimatisiertem Minibus.': 'Забор из отеля в Хургаде на комфортабельном микроавтобусе с кондиционером.',
  'Hotelabholung': 'Забор из отеля',
  'Hotelabholung in Hurghada': 'Забор из отеля в Хургаде',
  'Pause im ägyptischen Café': 'Перерыв в египетском кафе',
  'Fischmarkt & Große Moschee': 'Рыбный рынок и Большая мечеть',
  'Obst- und Gemüsemarkt': 'Фруктово-овощной рынок',
  'Abholung (04:00 Uhr)': 'Забор (04:00)',
  'Abholung (04:00–04:30 Uhr)': 'Забор (04:00–04:30)',
  'Abholung (03:00 Uhr)': 'Забор (03:00)',
  'Frühmorgens werden Sie direkt von Ihrem Hotel in Hurghada abgeholt.': 'Ранним утром вас заберут прямо из отеля в Хургаде.',
  'Gegen 04:00 Uhr holt Sie Ihr privater Fahrer im klimatisierten Fahrzeug ab.': 'Около 04:00 ваш личный водитель заберет вас на автомобиле с кондиционером.',
  'Die Abholung erfolgt gegen 02:00 Uhr direkt von Ihrem Hotel in Hurghada.': 'Забор осуществляется около 02:00 прямо из вашего отеля в Хургаде.',
  'Pünktliche Abholung direkt von Ihrem Hotel im klimatisierten Fahrzeug.': 'Своевременный забор прямо из отеля на автомобиле с кондиционером.',
  'Bequeme Abholung von Ihrem Hotel in Hurghada oder Umgebung.': 'Комфортабельный забор из вашего отеля в Хургаде или окрестностях.',
  'Bequemer Transfer im klimatisierten Fahrzeug.': 'Комфортабельный трансфер на автомобиле с кондиционером.',
  'Bequeme Fahrt Richtung Kairo mit Zwischenpause.': 'Комфортабельная поездка в Каир с остановкой.',
  'Abholung von Ihrem Hotel in Hurghada im klimatisierten Fahrzeug.': 'Забор из вашего отеля в Хургаде на автомобиле с кондиционером.',
  'Abholung direkt vom Hotel in Hurghada oder Makadi Bay.': 'Прямой забор из отеля в Хургаде или Макади Бэй.',
  'Wir holen Sie bequem mit klimatisiertem Fahrzeug direkt von Ihrem Hotel in Hurghada oder Umgebung ab.': 'Мы комфортабельно заберем вас на автомобиле с кондиционером прямо из отеля в Хургаде или окрестностях.',
  'Besuch': 'Посещение',
  'Besuchen Sie die weltberühmten Pyramiden von Gizeh, die Große Sphinx': 'Посетите всемирно известные пирамиды Гизы, Большого Сфинкса',
  'Nach Ihrer Ankunft in Kairo entdecken Sie die weltberühmten Pyramiden': 'После прибытия в Каир вы откроете всемирно известные пирамиды',
  'Genießen Sie ein leckeres Mittagessen in einem ausgewählten Restaurant in Kairo.': 'Насладитесь вкусным обедом в выбранном ресторане в Каире.',
  'Genießen Sie ein leckeres Mittagessen in einem landestypischen Restaurant.': 'Насладитесь вкусным обедом в местном ресторане.',
  'Nach dem Mittagessen erfolgt Rückfahrt nach Hurghada.': 'После обеда возвращение в Хургаду.',
  'Besuch der Pyramiden und der Sphinx.': 'Посещение пирамид и Сфинкса.',
  'Entdecken Sie die einzigartige Architektur der Roten Pyramide': 'Откройте уникальную архитектуру Красной пирамиды',
  'und der berühmten Knickpyramide': 'и знаменитой Ломаной пирамиды',
  'Sakkara – Stufenpyramide des Djoser': 'Саккара – Ступенчатая пирамида Джосера',
  'Dahschur – Rote & Knickpyramide': 'Дахшур – Красная и Ломаная пирамиды',
  'Ankunft gegen 20:00 Uhr in Ihrem Hotel.': 'Прибытие в отель около 20:00.',
  'Gegen 20 Uhr erreichen Sie wieder Ihr Hotel.': 'Около 20:00 вы вернетесь в отель.',
  'Gegen 12:00 Uhr Rückkehr und Transfer ins Hotel.': 'Около 12:00 возвращение и трансфер в отель.',
  'Rückkehr am frühen Nachmittag.': 'Возвращение ранним днём.',
  'Rücktransfer zum Hotel am Nachmittag.': 'Обратный трансфер в отель днём.',
  'Fahrt zum Kloster St. Antonius': 'Поездка в монастырь Св. Антония',
  'Weiterfahrt zum Kloster St. Paulus': 'Продолжение поездки в монастырь Св. Павла',
  'Fahrt durch die östliche Wüste zum Kloster St. Antonius.': 'Поездка через Восточную пустыню в монастырь Св. Антония.',
  'Höhle des Heiligen Antonius': 'Пещера Св. Антония',
  'Aufstieg zur Höhle des Heiligen Antonius (optional).': 'Подъем в пещеру Св. Антония (опционально).',
  'Orange Bay oder Magawish Insel': 'Остров Оранж Бэй или Магавиш',
  'Aufenthalt auf Orange Bay Island': 'Пребывание на острове Оранж Бэй',
  'Fahrt zur Orange Bay oder Magawish Insel mit Freizeit, Mittagessen & Strandaufenthalt.': 'Поездка на Оранж Бэй или Магавиш с свободным временем, обедом и пляжем.',
  'Mahmya Insel & Mittagessen': 'Остров Махмья и обед',
  'Bootsfahrt zur Hula Hula Insel': 'Поездка на лодке на остров Хула Хула',
  'Aufenthalt auf einer ruhigen Insel': 'Пребывание на тихом острове',
  'Schnorchelstopp (30 Minuten)': 'Остановка для снорклинга (30 минут)',
  'Geführtes Schnorcheln an einem ruhigen Riff.': 'Снорклинг с гидом у спокойного рифа.',
  'Zwei Stopps an farbenprächtigen Riffen': 'Две остановки у красочных рифов',
  'Zwei geführte Schnorchelstopps an sorgfältig ausgewählten Riffen': 'Две guided остановки для снорклинга у тщательно выбранных рифов',
  'Komplette Schnorchelausrüstung wird gestellt': 'Полное снаряжение для снорклинга предоставляется',
  'Nach der Ausgabe Ihrer Schnorchelausrüstung startet die 40-minütige Bootsfahrt': 'После получения снаряжения начинается 40-минутная поездка на лодке',
  'Nach der Ausgabe Ihrer Schnorchelausrüstung und einer kurzen Einweisung': 'После получения снаряжения и короткого инструктажа',
  'Verbringen Sie mehrere Stunden am Eden Island Beach': 'Проведите несколько часов на пляже Иден Айленд',
  'Entdecken Sie ein faszinierendes Schiffswrack': 'Откройте fascinating затонувший корабль',
  'Schiffswrack': 'Затонувший корабль',
  'Persönliche Begrüßung, Ausrüstung, kurze Einweisung – danach beginnt Ihr Abenteuer.': 'Личное приветствие, снаряжение, короткий инструктаж – затем начинается ваше приключение.',
  'Schnorcheln und Strandzeit': 'Снорклинг и время на пляже',
  'Abholung direkt von Ihrem Hotel in einem privaten, klimatisierten Fahrzeug und Transfer zum Hafen.': 'Прямой забор из отеля на частном автомобиле с кондиционером и трансфер в порт.',
  'Am frühen Morgen werden Sie direkt von Ihrem Hotel abgeholt und zum Hafen gebracht.': 'Ранним утром вас заберут прямо из отеля и доставят в порт.',
  'Dort begrüßt Sie die freundliche Crew an Bord Ihres komfortablen Bootes.': 'Там вас встретит дружелюбная команда на борту комфортабельной лодки.',
  'Nach einem ereignisreichen Tag geht es zurück zum Hafen': 'После насыщенного дня возвращение в порт',
  'Ihr erfahrener, deutschsprachiger Reiseleiter holt Sie in einem klimatisierten Fahrzeug ab': 'Ваш опытный немецкоязычный гид заберет вас на автомобиле с кондиционером',
  'Kurze Einführung – danach direkt auf das Quad.': 'Короткое введение – затем сразу на квадроцикл.',
  'Einweisung und Start der Quad-Tour.': 'Инструктаж и начало квадроцикла тура.',
  'Beduinendorf & Tee': 'Бедуинская деревня и чай',
  'Einblick in die Kultur der Wüste inklusive traditionellem Tee.': 'Знакомство с культурой пустыни, включая традиционный чай.',
  'Fahrt zur Wüstenstation.': 'Поездка к пустынной станции.',
  'Jeep-Safari & Beduinendorf': 'Джип-сафари и бедуинская деревня',
  'Jeep-Safari zum Beduinendorf. Kamelritt und Dorfbesuch.': 'Джип-сафари в бедуинскую деревню. Верховая езда на верблюде и посещение деревни.',
  'BBQ-Abendessen & Folklore': 'Ужин BBQ и фольклор',
  'BBQ-Abendessen und Folklore-Show.': 'Ужин BBQ и фольклорное шоу.',
  'Sonnenuntergang auf dem Roten Meer': 'Закат на Красном море',
  'Auf der Rückfahrt erleben Sie den Sonnenuntergang über dem Roten Meer.': 'На обратном пути насладитесь закатом над Красным морем.',
  'Entdecken Sie die beeindruckenden Schätze des alten Ägyptens': 'Откройте впечатляющие сокровища Древнего Египта',
  'darunter die berühmte Goldmaske des Tutanchamun.': 'включая знаменитую золотую маску Тутанхамона.',
  'Beginnen Sie Ihre Tour durch mehr als 24 faszinierende Themenbereiche': 'Начните свой тур по более чем 24 увлекательным тематическим зонам',
  'mit exotischen Meeresbewohnern, bunten Korallenriffen und beeindruckenden Großaquarien': 'с экзотическими морскими обитателями, красочными коралловыми рифами и впечатляющими большими аквариумами',
  'Erleben Sie den spektakulären 24 Meter langen Unterwassertunnel': 'Испытайте впечатляющий 24-метровый подводный туннель',
  'und beobachten Sie Haie, Rochen und zahlreiche Fischarten aus nächster Nähe': 'и наблюдайте акул, скатов и многочисленные виды рыб вблизи',
  'Ein unvergessliches Erlebnis für die ganze Familie.': 'Незабываемые впечатления для всей семьи.',
  'Nach einem erlebnisreichen Rundgang endet Ihr Besuch im Hurghada Grand Aquarium': 'После насыщенной экскурсии ваше посещение аквариума Хургады заканчивается',
  'Ankunft am Hurghada Grand Aquarium': 'Прибытие в аквариум Хургады',
  'Nach Ihrer Ankunft betreten Sie eines der größten und modernsten Aquarien Ägyptens.': 'После прибытия вы входите в один из крупнейших и самых современных аквариумов Египта.',
  'Kinder und Erwachsene können das interaktive Streichelbecken entdecken': 'Дети и взрослые могут открыть для себя интерактивный бассейн для прикосновений',
  'Besuchen Sie die tropische Regenwaldzone sowie den kleinen Zoo': 'Посетите тропическую зону дождевого леса и небольшой зоопарк',
  ' mit exotischen Vögeln, Reptilien und weiteren faszinierenden Tieren': 'с экзотическими птицами, рептилиями и другими увлекательными животными',
  'Freizeit im Park': 'Свободное время в парке',
  'Mini Egypt Park': 'Парк Мини-Египет',
  'Ankunft im Mini Egypt Park': 'Прибытие в парк Мини-Египет',
  'Ankunft im Mini Egypt Park – dein persönlicher Guide begrüßt dich.': 'Прибытие в парк Мини-Египет – ваш личный гид приветствует вас.',
  'Geführte Tour durch Ägyptens Miniaturwunder': 'Экскурсия по миниатюрным чудесам Египта',
  'Tauchen Sie ein in das farbenfrohe Markttreiben': 'Погрузитесь в красочную рыночную атмосферу',
  'Reitausflug (1–2 Stunden)': 'Верховая езда (1–2 часа)',
  'Individueller Ausritt entlang des Strandes, durch die Wüste oder als Kombination.': 'Индивидуальная поездка вдоль пляжа, по пустыне или комбинированная.',
  'Begrüßung, kurze Einweisung und Start der Bootstour.': 'Приветствие, короткий инструктаж и начало лодочной экскурсии.',
  'Fahrt mit einem modernen Ausflugsboot oder einer komfortablen Yacht Richtung Orange Bay Island.': 'Поездка на современной лодке или комфортабельной яхте к острову Оранж Бэй.',
  'Softdrinks sind an Bord inklusive.': 'Безалкогольные напитки включены на борту.',
  'Frisch zubereitetes Mittagessen mit alkoholfreien Getränken an Bord oder auf der Insel.': 'Свежеприготовленный обед с безалкогольными напитками на борту или на острове.',
  'Entspannung am Strand oder auf dem Boot.': 'Отдых на пляже или на лодке.',
  'Entspannung an Bord': 'Отдых на борту',
  'Aufenthalt an einer abgelegenen Insel mit hellem Sandstrand.': 'Пребывание на уединенном острове с белым песчаным пляжем.',
  'Hier haben Sie ausreichend Zeit zum Schwimmen, Sonnenbaden oder Entspannen.': 'Здесь у вас достаточно времени для плавания, загара или отдыха.',
  'Durch die private Organisation der Tour vermeiden Sie Menschenansammlungen': 'Благодаря частной организации тура вы избегаете скопления людей',
  'Reitausflug (1–2 Stunden)': 'Верховая езда (1–2 часа)',
};

// French translations
ITIN_TRANSLATIONS.fr = {
  'Abholung vom Hotel': 'Prise en charge à l\'hôtel',
  'Abholung vom Hotel in Hurghada': 'Prise en charge à l\'hôtel à Hurghada',
  'Ankunft': 'Arrivée',
  'Ankunft & Transfer zum Hotel': 'Arrivée et transfert à l\'hôtel',
  'Ankunft in Kairo & Begrüßung durch Ihren Guide': 'Arrivée au Caire et accueil par votre guide',
  'Mittagessen': 'Déjeuner',
  'Mittagessen am Nil': 'Déjeuner sur le Nil',
  'Mittagessen in einem lokalen Restaurant.': 'Déjeuner dans un restaurant local.',
  'Frühstück': 'Petit-déjeuner',
  'Frühstück im Hotel': 'Petit-déjeuner à l\'hôtel',
  'Abendessen': 'Dîner',
  'Abendessen & Folklore': 'Dîner et folklore',
  'Rückfahrt': 'Retour',
  'Rückfahrt zum Hotel': 'Retour à l\'hôtel',
  'Rückfahrt nach Hurghada': 'Retour à Hurghada',
  'Rückkehr': 'Retour',
  'Rückkehr zum Hotel.': 'Retour à l\'hôtel.',
  'Rücktransfer': 'Transfert retour',
  'Rücktransfer zum Hotel': 'Transfert retour à l\'hôtel',
  'Transfer': 'Transfert',
  'Transfer zum Hafen & Einschiffung': 'Transfert au port et embarquement',
  'Abholung & Transfer zum Hafen': 'Prise en charge et transfert au port',
  'Abholung & Fahrt nach Kairo': 'Prise en charge et trajet vers Le Caire',
  'Abholung & Fahrt nach Dendera': 'Prise en charge et trajet vers Dendera',
  'Abholung direkt von Ihrem Hotel.': 'Prise en charge directe à votre hôtel.',
  'Abholung direkt von Ihrem Hotel in Hurghada.': 'Prise en charge directe à votre hôtel à Hurghada.',
  'Abholung vom Hotel in Hurghada mit komfortablem, klimatisiertem Minibus.': 'Prise en charge à l\'hôtel à Hurghada en minibus confortable climatisé.',
  'Abholung vom Hotel in Hurghada.': 'Prise en charge à l\'hôtel à Hurghada.',
  'Abholung in Hurghada': 'Prise en charge à Hurghada',
  'Grand Egyptian Museum': 'Grand Musée Égyptien',
  'Grand Egyptian Museum (GEM)': 'Grand Musée Égyptien (GEM)',
  'Pyramiden von Gizeh': 'Pyramides de Gizeh',
  'Die Pyramiden von Gizeh': 'Les Pyramides de Gizeh',
  'Gizeh': 'Gizeh',
  'Sakkara': 'Saqqarah',
  'Dahschur': 'Dahchour',
  'Tal der Könige': 'Vallée des Rois',
  'Tal der Könige – drei Grabkammern': 'Vallée des Rois – trois tombes',
  'Hatschepsut-Tempel': 'Temple d\'Hatchepsout',
  'Karnak-Tempel': 'Temple de Karnak',
  'Memnon-Kolosse': 'Colosses de Memnon',
  'Memnon-Kolosse – Fotostopp': 'Colosses de Memnon – arrêt photo',
  'Sonnenuntergang': 'Coucher de soleil',
  'Sonnenuntergang in der Wüste.': 'Coucher de soleil dans le désert.',
  'Sonnenuntergang auf dem Roten Meer': 'Coucher de soleil sur la Mer Rouge',
  'Schnorcheln': 'Snorkeling',
  'Schnorcheln & Schwimmen': 'Snorkeling et baignade',
  'Schnorcheln im Roten Meer': 'Snorkeling en Mer Rouge',
  'Schnorchelgänge': 'Sessions de snorkeling',
  'Schnorchelfahrt': 'Excursion de snorkeling',
  'Quad-Tour': 'Tour en quad',
  'Quad Safari durch die Wüste': 'Safari en quad dans le désert',
  'Kamelritt': 'Promenade à chameau',
  'Hotel': 'Hôtel',
  'Strand': 'Plage',
  'Wüste': 'Désert',
  'Insel': 'Île',
  'Basar': 'Souk',
  'Abholung in Hurghada, El Gouna, Makadi Bay, Soma Bay oder Safaga.': 'Prise en charge à Hurghada, El Gouna, Makadi Bay, Soma Bay ou Safaga.',
  'Lagunenfahrt durch El Gouna': 'Croisière dans les lagunes d\'El Gouna',
  'Downtown El Gouna': 'Centre-ville d\'El Gouna',
  'Abu Tig Marina': 'Marina d\'Abu Tig',
  'Der Aussichtsturm': 'La tour d\'observation',
  'Fahrt nach Dendera': 'Trajet vers Dendera',
  'Weiterfahrt nach Abydos': 'Continuation vers Abydos',
  'Weiterfahrt zum Kloster St. Paulus': 'Continuation vers le monastère Saint-Paul',
  'Hotelabholung': 'Prise en charge à l\'hôtel',
  'Hotelabholung in Hurghada': 'Prise en charge à l\'hôtel à Hurghada',
  'Pause im ägyptischen Café': 'Pause dans un café égyptien',
  'Fischmarkt & Große Moschee': 'Marché aux poissons et Grande Mosquée',
  'Obst- und Gemüsemarkt': 'Marché de fruits et légumes',
  'Besuch': 'Visite',
  'Besichtigung': 'Visite',
  'Besichtigung Abydos-Tempel': 'Visite du temple d\'Abydos',
  'Besichtigung Hathor-Tempel': 'Visite du temple d\'Hathor',
  'Besichtigung Kloster St. Antonius': 'Visite du monastère Saint-Antoine',
  'Besichtigung Kloster St. Paulus': 'Visite du monastère Saint-Paul',
  'Glasbodenboot-Fahrt': 'Tour en bateau à fond de verre',
  'Unterwassertunnel & Panorama-Bereiche': 'Tunnel sous-marin et zones panoramiques',
  'Regenwald & Tierbereiche': 'Forêt tropicale et zones animalières',
  'Spider-Buggy': 'Spider-buggy',
  'Spider-Buggy Fahrt durch die Wüste.': 'Tour en spider-buggy dans le désert.',
  'Makadi Water Park': 'Parc aquatique Makadi',
  'Führung': 'Visite guidée',
  'Geführte Tour': 'Visite guidée',
  'Kultur & Architektur': 'Culture et architecture',
  'Spaziergang durch die Marina': 'Promenade dans la marina',
  'Mittagessen & Getränke': 'Déjeuner et boissons',
  'Mittagessen in Abydos': 'Déjeuner à Abydos',
  'Mittagessen in Theben West': 'Déjeuner à Thèbes Ouest',
  'Bootsfahrt im Roten Meer': 'Croisière en Mer Rouge',
  'Bootsfahrt zu den besten Schnorchelspots': 'Trajet en bateau vers les meilleurs spots de snorkeling',
  'Schnorcheln an Korallenriffen': 'Snorkeling aux récifs coralliens',
  'Schnorcheln an zwei Korallenriffen': 'Snorkeling à deux récifs coralliens',
  'Inselaufenthalt (90 Minuten)': 'Séjour sur l\'île (90 minutes)',
  'Freizeit & Fotos': 'Temps libre et photos',
  'Freie Zeit zum Einkaufen': 'Temps libre pour shopping',
  'Delfinbegegnung': 'Rencontre avec les dauphins',
  'Abholung direkt von Ihrem Hotel in einem privaten, klimatisierten Fahrzeug und Transfer zum Hafen.': 'Prise en charge directe à votre hôtel en véhicule privé climatisé et transfert au port.',
  'Besuchen Sie die weltberühmten Pyramiden von Cheops, Chephren und Mykerinos': 'Visitez les célèbres pyramides de Khéops, Khéphren et Mykérinos',
  'Frühmorgens werden Sie direkt von Ihrem Hotel in Hurghada abgeholt.': 'Tôt le matin, vous serez pris en charge directement à votre hôtel à Hurghada.',
  'Gegen 04:00 Uhr holt Sie Ihr privater Fahrer im klimatisierten Fahrzeug ab.': 'Vers 04h00, votre chauffeur privé vous prend en charge dans un véhicule climatisé.',
  'Die Abholung erfolgt gegen 02:00 Uhr direkt von Ihrem Hotel in Hurghada.': 'La prise en charge a lieu vers 02h00 directement à votre hôtel à Hurghada.',
  'Pünktliche Abholung direkt von Ihrem Hotel im klimatisierten Fahrzeug.': 'Prise en charge ponctuelle directement à votre hôtel dans un véhicule climatisé.',
  'Bequeme Abholung von Ihrem Hotel in Hurghada oder Umgebung.': 'Prise en charge confortable depuis votre hôtel à Hurghada ou ses environs.',
  'Bequemer Transfer im klimatisierten Fahrzeug.': 'Transfert confortable en véhicule climatisé.',
  'Bequeme Fahrt Richtung Kairo mit Zwischenpause.': 'Trajet confortable vers Le Caire avec une pause.',
  'Abholung von Ihrem Hotel in Hurghada im klimatisierten Fahrzeug.': 'Prise en charge à votre hôtel à Hurghada en véhicule climatisé.',
  'Abholung direkt vom Hotel in Hurghada oder Makadi Bay.': 'Prise en charge directe à l\'hôtel à Hurghada ou Makadi Bay.',
  'Wir holen Sie bequem mit klimatisiertem Fahrzeug direkt von Ihrem Hotel in Hurghada oder Umgebung ab.': 'Nous vous prenons en charge confortablement en véhicule climatisé directement à votre hôtel à Hurghada ou ses environs.',
  'Sonnenaufgang über Luxor – Heißluftballonfahrt': 'Lever de soleil sur Louxor – vol en montgolfière',
  'Fahrt mit einem modernen Ausflugsboot oder einer komfortablen Yacht': 'Trajet en bateau d\'excursion moderne ou yacht confortable',
};

// Hungarian translations
ITIN_TRANSLATIONS.hu = {
  'Abholung vom Hotel': 'Pickup a szállodából',
  'Abholung vom Hotel in Hurghada': 'Pickup a hurghadai szállodából',
  'Ankunft': 'Érkezés',
  'Ankunft & Transfer zum Hotel': 'Érkezés és transzfer a szállodába',
  'Ankunft in Kairo & Begrüßung durch Ihren Guide': 'Érkezés Kairóba és üdvözlés a guide által',
  'Mittagessen': 'Ebéd',
  'Mittagessen am Nil': 'Ebéd a Nílusnál',
  'Mittagessen in einem lokalen Restaurant.': 'Ebéd egy helyi étteremben.',
  'Frühstück': 'Reggeli',
  'Frühstück im Hotel': 'Reggeli a szállodában',
  'Abendessen': 'Vacsora',
  'Abendessen & Folklore': 'Vacsora és folklór',
  'Rückfahrt': 'Visszautazás',
  'Rückfahrt zum Hotel': 'Vissza a szállodába',
  'Rückfahrt nach Hurghada': 'Vissza Hurghadába',
  'Rückkehr': 'Visszatérés',
  'Rückkehr zum Hotel.': 'Visszatérés a szállodába.',
  'Rücktransfer': 'Visszatérési transzfer',
  'Rücktransfer zum Hotel': 'Visszautazás a szállodába',
  'Transfer': 'Transzfer',
  'Transfer zum Hafen & Einschiffung': 'Transzfer a kikötőbe és beszállás',
  'Abholung & Transfer zum Hafen': 'Pickup és transzfer a kikötőbe',
  'Abholung & Fahrt nach Kairo': 'Pickup és utazás Kairóba',
  'Abholung & Fahrt nach Dendera': 'Pickup és utazás Denderába',
  'Schnorcheln': 'Szörfözés',
  'Schnorcheln & Schwimmen': 'Szörfözés és úszás',
  'Schnorcheln im Roten Meer': 'Szörfözés a Vörös-tengerben',
  'Schnorchelgänge': 'Szörfözési megállók',
  'Schnorchelfahrt': 'Szörfözési kirándulás',
  'Quad-Tour': 'Quad túra',
  'Quad Safari durch die Wüste': 'Quad szafari a sivatagban',
  'Kamelritt': 'Tevegelés',
  'Hotel': 'Szálloda',
  'Strand': 'Strand',
  'Wüste': 'Sivatag',
  'Insel': 'Sziget',
  'Basar': 'Bazár',
  'Grand Egyptian Museum': 'Grand Egyptian Múzeum',
  'Grand Egyptian Museum (GEM)': 'Grand Egyptian Múzeum (GEM)',
  'Pyramiden von Gizeh': 'Gízai piramisok',
  'Die Pyramiden von Gizeh': 'A gízai piramisok',
  'Gizeh': 'Gíza',
  'Sakkara': 'Szakkarah',
  'Dahschur': 'Dahsúr',
  'Tal der Könige': 'Királyok völgye',
  'Tal der Könige – drei Grabkammern': 'Királyok völgye – három sírkamra',
  'Hatschepsut-Tempel': 'Hatshepsut temploma',
  'Karnak-Tempel': 'Karnaki templom',
  'Memnon-Kolosse': 'Memnon kolosszusai',
  'Memnon-Kolosse – Fotostopp': 'Memnon kolosszusai – fotómegálló',
  'Sonnenuntergang': 'Naplemente',
  'Sonnenuntergang in der Wüste.': 'Naplemente a sivatagban.',
  'Sonnenuntergang auf dem Roten Meer': 'Naplemente a Vörös-tengeren',
  'Bootsfahrt im Roten Meer': 'Hajókirándulás a Vörös-tengeren',
  'Bootsfahrt zu den besten Schnorchelspots': 'Hajókirándulás a legjobb szörfözési helyekhez',
  'Schnorcheln an Korallenriffen': 'Szörfözés a korallzátonyoknál',
  'Inselaufenthalt (90 Minuten)': 'Szigetlátogatás (90 perc)',
  'Freizeit & Fotos': 'Szabadidő és fotók',
  'Freie Zeit zum Einkaufen': 'Szabadidő vásárlásra',
  'Delfinbegegnung': 'Delfintalálkozás',
  'Besichtigung': 'Megtekintés',
  'Besichtigung Abydos-Tempel': 'Abüdosz templomának megtekintése',
  'Besichtigung Hathor-Tempel': 'Hathor templomának megtekintése',
  'Besichtigung Kloster St. Antonius': 'Szent Antal kolostorának megtekintése',
  'Besichtigung Kloster St. Paulus': 'Szent Pál kolostorának megtekintése',
  'Hotelabholung': 'Pickup a szállodából',
  'Hotelabholung in Hurghada': 'Pickup a hurghadai szállodából',
};

// Arabic translations
ITIN_TRANSLATIONS.ar = {
  'Abholung vom Hotel': 'الاستلام من الفندق',
  'Abholung vom Hotel in Hurghada': 'الاستلام من الفندق في الغردقة',
  'Ankunft': 'الوصول',
  'Ankunft & Transfer zum Hotel': 'الوصول والتحويل إلى الفندق',
  'Ankunft in Kairo & Begrüßung durch Ihren Guide': 'الوصول إلى القاهرة والترحيب من مرشدك',
  'Mittagessen': 'الغداء',
  'Mittagessen am Nil': 'الغداء على النيل',
  'Mittagessen in einem lokalen Restaurant.': 'الغداء في مطعم محلي.',
  'Frühstück': 'الفطور',
  'Frühstück im Hotel': 'الفطور في الفندق',
  'Abendessen': 'العشاء',
  'Abendessen & Folklore': 'العشاء والفولكلور',
  'Rückfahrt': 'العودة',
  'Rückfahrt zum Hotel': 'العودة إلى الفندق',
  'Rückfahrt nach Hurghada': 'العودة إلى الغردقة',
  'Rückkehr': 'العودة',
  'Rückkehr zum Hotel.': 'العودة إلى الفندق.',
  'Rücktransfer': 'النقل العائد',
  'Rücktransfer zum Hotel': 'النقل العائد إلى الفندق',
  'Transfer': 'النقل',
  'Transfer zum Hafen & Einschiffung': 'النقل إلى الميناء والصعود',
  'Abholung & Transfer zum Hafen': 'الاستلام والنقل إلى الميناء',
  'Abholung & Fahrt nach Kairo': 'الاستلام والذهاب إلى القاهرة',
  'Abholung & Fahrt nach Dendera': 'الاستلام والذهاب إلى دندرة',
  'Abholung direkt von Ihrem Hotel.': 'الاستلام المباشر من فندقك.',
  'Abholung direkt von Ihrem Hotel in Hurghada.': 'الاستلام المباشر من فندقك في الغردقة.',
  'Abholung vom Hotel in Hurghada mit komfortablem, klimatisiertem Minibus.': 'الاستلام من الفندق في الغردقة بحافلة صغيرة مريحة ومكيفة.',
  'Abholung vom Hotel in Hurghada.': 'الاستلام من الفندق في الغردقة.',
  'Abholung in Hurghada': 'الاستلام في الغردقة',
  'Abholung direkt von Ihrem Hotel in einem privaten, klimatisierten Fahrzeug und Transfer zum Hafen.': 'الاستلام المباشر من فندقك بسيارة خاصة مكيفة والنقل إلى الميناء.',
  'Schnorcheln': 'الغطس',
  'Schnorcheln & Schwimmen': 'الغطس والسباحة',
  'Schnorcheln im Roten Meer': 'الغطس في البحر الأحمر',
  'Schnorchelgänge': 'جولات الغطس',
  'Schnorchelfahrt': 'رحلة الغطس',
  'Quad-Tour': 'جولة كواد',
  'Quad Safari durch die Wüste': 'سفاري كواد في الصحراء',
  'Kamelritt': 'ركوب الجمل',
  'Hotel': 'فندق',
  'Strand': 'شاطئ',
  'Wüste': 'صحراء',
  'Insel': 'جزيرة',
  'Basar': 'بازار',
  'Grand Egyptian Museum': 'المتحف المصري الكبير',
  'Pyramiden von Gizeh': 'أهرامات الجيزة',
  'Die Pyramiden von Gizeh': 'أهرامات الجيزة',
  'Gizeh': 'الجيزة',
  'Sakkara': 'سقارة',
  'Tal der Könige': 'وادي الملوك',
  'Tal der Könige – drei Grabkammern': 'وادي الملوك – ثلاث مقابر',
  'Hatschepsut-Tempel': 'معبد حتشبسوت',
  'Karnak-Tempel': 'معبد الكرنك',
  'Memnon-Kolosse': 'تماثيل ممنون',
  'Sonnenuntergang': 'غروب الشمس',
  'Sonnenuntergang in der Wüste.': 'غروب الشمس في الصحراء.',
  'Sonnenuntergang auf dem Roten Meer': 'غروب الشمس على البحر الأحمر',
  'Abholung in Hurghada, El Gouna, Makadi Bay, Soma Bay oder Safaga.': 'الاستلام في الغردقة أو الجونة أو ماكادي باي أو سوما باي أو سفاجا.',
  'Lagunenfahrt durch El Gouna': 'جولة بحرية في بحيرات الجونة',
  'Downtown El Gouna': 'وسط مدينة الجونة',
  'Hotelabholung': 'الاستلام من الفندق',
  'Hotelabholung in Hurghada': 'الاستلام من الفندق في الغردقة',
  'Abholung direkt von Ihrem Hotel in einem privaten, klimatisierten Fahrzeug': 'الاستلام المباشر من فندقك بسيارة خاصة مكيفة',
  'Fahrt zum Kloster St. Antonius': 'الذهاب إلى دير القديس أنطونيوس',
  'Weiterfahrt zum Kloster St. Paulus': 'مواصلة الرحلة إلى دير القديس بولس',
  'Besichtigung Abydos-Tempel': 'زيارة معبد أبيدوس',
  'Besichtigung Hathor-Tempel': 'زيارة معبد حتحور',
  'Besichtigung Kloster St. Antonius': 'زيارة دير القديس أنطونيوس',
  'Besichtigung Kloster St. Paulus': 'زيارة دير القديس بولس',
  'Glasbodenboot-Fahrt': 'رحلة بالقارب ذو القاع الزجاجي',
  'Unterwassertunnel & Panorama-Bereiche': 'النفق تحت الماء ومناطق البانوراما',
  'Regenwald & Tierbereiche': 'الغابات المطيرة ومناطق الحيوانات',
  'Fahrt nach Dendera': 'الذهاب إلى دندرة',
  'Weiterfahrt nach Abydos': 'مواصلة الرحلة إلى أبيدوس',
  'Fischmarkt & Große Moschee': 'سوق السمك والمسجد الكبير',
  'Obst- und Gemüsemarkt': 'سوق الفواكه والخضروات',
  'Pause im ägyptischen Café': 'استراحة في مقهى مصري',
  'Besuch': 'زيارة',
  'Besichtigung': 'زيارة',
  'Geführte Tour': 'جولة إرشادية',
  'Sonnenaufgang über Luxor – Heißluftballonfahrt': 'شروق الشمس فوق الأقصر – رحلة بالون الهواء الساخن',
  'Fahrt mit einem modernen Ausflugsboot oder einer komfortablen Yacht': 'الذهاب بقارب رحلات حديث أو يخت مريح',
  'Inselaufenthalt (90 Minuten)': 'الإقامة في الجزيرة (90 دقيقة)',
  'Freizeit & Fotos': 'وقت حر وصور',
  'Freie Zeit zum Einkaufen': 'وقت حر للتسوق',
  'Schnorcheln an Korallenriffen': 'الغطس في الشعاب المرجانية',
  'Schnorcheln an zwei Korallenriffen': 'الغطس في شعاب مرجانية',
  'Bootsfahrt im Roten Meer': 'رحلة بالقارب في البحر الأحمر',
  'Bootsfahrt zu den besten Schnorchelspots': 'رحلة بالقارب إلى أفضل أماكن الغطس',
};

// Table header translations per locale
const TABLE_HEADERS = {
  'en': { 'Teilnehmer': 'Participants', 'Fahrzeug': 'Vehicle', 'Preis pro Person': 'Price per person', 'Teilnehmeranzahl': 'Number of participants' },
  'ru': { 'Teilnehmer': 'Участники', 'Fahrzeug': 'Транспорт', 'Preis pro Person': 'Цена за человека', 'Teilnehmeranzahl': 'Количество участников' },
  'fr': { 'Teilnehmer': 'Participants', 'Fahrzeug': 'Véhicule', 'Preis pro Person': 'Prix par personne', 'Teilnehmeranzahl': 'Nombre de participants' },
  'hu': { 'Teilnehmer': 'Résztvevők', 'Fahrzeug': 'Jármű', 'Preis pro Person': 'Ár személyenként', 'Teilnehmeranzahl': 'Résztvevők száma' },
  'ar': { 'Teilnehmer': 'المشاركون', 'Fahrzeug': 'المركبة', 'Preis pro Person': 'السعر للفرد', 'Teilnehmeranzahl': 'عدد المشاركين' },
};

// FAQ translations — keyed by German question text
// We'll generate on-the-fly for missing FAQs

function translateFaq(locale, faq) {
  // Basic FAQ translation lookup
  const faqDb = {
    'en': {
      '⏳Wie lange dauert der Tagesausflug von Hurghada nach Kairo?': {q:'⏳ How long does the day trip from Hurghada to Cairo take?', a:'The excursion lasts approximately 15 hours. We pick you up around 4:00 AM from your hotel, fly to Cairo, visit the sights, and are back at the hotel around 8:15 PM.'},
      '🏛️Welche Sehenswürdigkeiten werden besucht?': {q:'🏛️ Which sights are visited?', a:'You visit the world-famous Pyramids of Giza, the Great Sphinx, and – depending on your preference – the Grand Egyptian Museum or the Egyptian Museum. You also enjoy lunch at a restaurant on the Nile and are accompanied all day by a German-speaking Egyptologist.'},
      '👶Ist der Ausflug für Kinder geeignet?': {q:'👶 Is the excursion suitable for children?', a:'Yes, the excursion is family-friendly.\n\n0–2 years: 200 €\n\n3–10 years: 240 €\n\nFrom 11 years: Full price'},
      '🚘Gibt es einen Transfer von Marsa Alam oder El Quseir?': {q:'🚘 Is there a transfer from Marsa Alam or El Quseir?', a:'Yes, we organize a transfer to Hurghada Airport.\n\nMarsa Alam: +50 € per person\n\nEl Quseir: +35 € per person'},
      '✔️Was ist im Preis enthalten?': {q:'✔️ What is included in the price?', a:'Round trip flight Hurghada ↔ Cairo\n\nTransfers in air-conditioned vehicles\n\nEntrance fees according to program\n\nGerman-speaking Egyptologist\n\nLunch including soft drink'},
      '🏛️Kann ich wählen, welches Museum ich besuche?': {q:'🏛️ Can I choose which museum to visit?', a:'Yes, you can choose between the Grand Egyptian Museum or the Egyptian Museum, depending on your interest.'},
      '👥Wie viele Personen sind in einer Gruppe?': {q:'👥 How many people are in a group?', a:'The tour takes place as a private excursion or in small groups of maximum 8 people. This way you enjoy a relaxed atmosphere and enough time at all sights.'},
      '🗣️Wann sollte ich buchen?': {q:'🗣️ When should I book?', a:'We recommend booking early, especially during peak season, to secure your desired date.'},
      '🛠️Kann ich den Ausflug auch individuell anpassen?': {q:'🛠️ Can I customize the excursion?', a:'Yes, our tour is flexible. You can adjust the order of sights or add extra stops upon request.'},
      '💶Wie läuft die Bezahlung ab?': {q:'💶 How does payment work?', a:'Online via our website or by email inquiry\n\nSecure payment before departure\n\nNo hidden fees'},
    },
    // For other locales, we'll add simple translations inline
  };
  return faqDb[locale]?.[faq.question];
}

// Generic locale FAQ name prefixes
const FAQ_TIME = {
  'en': '⏳',
  'ru': '⏳',
  'fr': '⏳',
  'hu': '⏳',
  'ar': '⏳',
};

(async()=>{
  // Fetch ALL tours
  const {data: tours} = await db.from('tours').select('*');
  const {data: allTrs} = await db.from('content_translations').select('*').eq('table_name','tours');
  
  const trMap = {};
  for (const tr of allTrs || []) {
    if (!trMap[tr.row_id]) trMap[tr.row_id] = {};
    trMap[tr.row_id][tr.locale] = tr;
  }

  let fixCount = 0;

  for (const tour of tours) {
    const deTr = trMap[tour.id]?.de;
    
    for (const loc of LOCALES) {
      const tr = trMap[tour.id]?.[loc];
      if (!tr) continue;
      const updates = {};

      // ==================== 1. FIX MEETING POINT TIMES ====================
      if (tour.meeting_point) {
        const timeMatch = tour.meeting_point.match(/(\d{1,2}):(\d{2})/);
        if (timeMatch) {
          const [_, h, m] = timeMatch;
          const expectedTime = TIME_MAP[loc](h, m);
          
          // Check if the current value is wrong (empty, location text, or different time)
          if (!tr.meeting_point || tr.meeting_point.trim() === '') {
            updates.meeting_point = expectedTime;
          } else {
            // Check if time differs by > 1 hour
            const trTime = tr.meeting_point.match(/(\d{1,2}):(\d{2})/);
            if (trTime) {
              const diff = Math.abs(parseInt(trTime[1]) - parseInt(h));
              if (diff > 1) {
                updates.meeting_point = expectedTime;
              }
            } else if (tr.meeting_point.includes('Red Sea') || tr.meeting_point.includes('Rotes Meer') || 
                       tr.meeting_point.includes('Красное море') || tr.meeting_point.includes('Hotel pickup')) {
              // Location text where time should be
              updates.meeting_point = expectedTime;
            }
          }
        }
      }

      // ==================== 2. FIX ITINERARY (content field) ====================
      if (tr.content && loc !== 'de') {
        try {
          const steps = JSON.parse(tr.content);
          const deContent = deTr?.content ? JSON.parse(deTr.content) : (typeof tour.itinerary === 'string' ? JSON.parse(tour.itinerary) : tour.itinerary);
          
          if (Array.isArray(steps) && Array.isArray(deContent) && steps.length === deContent.length) {
            let modified = false;
            const newSteps = steps.map((step, i) => {
              const newStep = { ...step };
              // Translate title if it's German text (not just a time)
              const deTitle = deContent[i]?.title || '';
              if (step.title !== deTitle) {
                // Check if current title has German text or odd AM/PM repetition
                if (step.title.includes('AM AM') || step.title.includes('AM PM') || 
                    (deTitle.match(/Uhr/) && !step.title.match(/Uhr/))) {
                  // This title looks corrupted—use DE title translated
                  const trans = ITIN_TRANSLATIONS[loc]?.[deTitle] || deTitle.replace(/ Uhr$/, '');
                  if (trans) {
                    newStep.title = trans;
                    modified = true;
                  }
                }
              }
              
              // Translate content if it contains German text
              const deContentText = deContent[i]?.content || '';
              // Check if this step's content still has German text
              const germanWordsInContent = step.content.match(/\b(Abholung|Ankunft|Besuch|Fahrt|Mittagessen|Rückfahrt|Rücktransfer|Frühstück|Abendessen|Hotelabholung|Rückkehr|Schnorcheln|Besichtigung|Kamelritt|Beduinendorf|Wüstenstation|Glasbodenboot|Spider-Buggy)\b/i);
              
              if (germanWordsInContent && ITIN_TRANSLATIONS[loc]) {
                // Try to translate the German content
                let translated = step.content;
                // Sort keys by length (longest first) to avoid partial replacements
                const sortedKeys = Object.keys(ITIN_TRANSLATIONS[loc]).sort((a, b) => b.length - a.length);
                for (const dePhrase of sortedKeys) {
                  const regex = new RegExp(dePhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                  if (regex.test(translated)) {
                    translated = translated.replace(regex, ITIN_TRANSLATIONS[loc][dePhrase]);
                  }
                }
                if (translated !== step.content) {
                  newStep.content = translated;
                  modified = true;
                }
              }
              return newStep;
            });
            
            if (modified) {
              updates.content = JSON.stringify(newSteps);
            }
          }
        } catch(e) {
          // Skip if parsing fails
        }
      }

      // ==================== 3. FIX DESCRIPTION TABLE HEADERS ====================
      if (tr.description && loc !== 'de') {
        let desc = tr.description;
        let descModified = false;
        const headers = TABLE_HEADERS[loc];
        if (headers) {
          for (const [deHeader, trans] of Object.entries(headers)) {
            if (desc.includes(deHeader)) {
              desc = desc.replace(new RegExp(deHeader.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), trans);
              descModified = true;
            }
          }
          // Also fix the data-label attributes
          for (const [deHeader, trans] of Object.entries(headers)) {
            if (desc.includes(`data-label="${deHeader}"`)) {
              desc = desc.replace(new RegExp(`data-label="${deHeader}"`, 'g'), `data-label="${trans}"`);
              descModified = true;
            }
          }
        }
        if (descModified) updates.description = desc;
      }

      // ==================== 4. FIX FAQ COUNTS ====================
      const baseFaqs = Array.isArray(tour.faqs) ? tour.faqs : [];
      let locFaqs = Array.isArray(tr.faqs) ? [...tr.faqs] : [];
      
      if (baseFaqs.length > 0 && locFaqs.length > 0 && baseFaqs.length !== locFaqs.length) {
        if (locFaqs.length < baseFaqs.length) {
          // Add missing FAQs
          for (const baseFaq of baseFaqs) {
            const exists = locFaqs.some(lf => lf.question?.includes(baseFaq.question?.replace(/^[^a-zA-Z]+/, '').substring(0, 20) || ''));
            if (!exists) {
              // Add a simple translation
              const existingTrans = translateFaq(loc, baseFaq);
              if (existingTrans) {
                locFaqs.push({ question: existingTrans.q, answer: existingTrans.a });
              }
            }
          }
          if (locFaqs.length === baseFaqs.length) {
            updates.faqs = locFaqs;
          }
        }
      }

      // ==================== 5. FIX MISSING AR FAQS (8→10 pattern) ====================
      // For Arabic (and others) with 8 FAQs vs DE 10, try to match by question content
      if (baseFaqs.length > 0 && locFaqs.length > 0 && locFaqs.length !== baseFaqs.length) {
        const baseQuestions = baseFaqs.map(f => f.question.replace(/^[^a-zA-Z0-9\u0600-\u06FF\u0400-\u04FF]+/, '').trim());
        const locQuestions = locFaqs.map(f => f.question.replace(/^[^a-zA-Z0-9\u0600-\u06FF\u0400-\u04FF]+/, '').trim());
        
        // Find which DE questions are missing
        for (let i = 0; i < baseQuestions.length; i++) {
          const bq = baseQuestions[i].substring(0, 30);
          const exists = locQuestions.some(lq => lq.includes(bq) || bq.includes(lq));
          if (!exists) {
            // Need to add this FAQ - create basic translation
            const baseQ = baseFaqs[i].question.replace(/^[^a-zA-Z0-9\u0600-\u06FF\u0400-\u04FF]+/, '');
            const baseA = baseFaqs[i].answer;
            
            if (loc === 'ar') {
              locFaqs.push({
                question: baseQ,  // keep German as fallback
                answer: baseA     // keep German as fallback
              });
            }
          }
        }
        if (locFaqs.length === baseFaqs.length) {
          updates.faqs = locFaqs;
        }
      }

      // ==================== 6. FIX LIST ITEM COUNTS ====================
      for (const listField of ['highlights', 'included', 'not_included']) {
        const baseArr = Array.isArray(tour[listField]) ? tour[listField] : [];
        const locArr = Array.isArray(tr[listField]) ? [...tr[listField]] : [];
        if (baseArr.length > 0 && locArr.length > 0 && locArr.length !== baseArr.length) {
          if (locArr.length < baseArr.length) {
            // Add missing items (leave in German as temporary fill)
            for (const item of baseArr) {
              if (!locArr.includes(item)) {
                locArr.push(item);
              }
            }
            if (locArr.length === baseArr.length) {
              updates[listField] = locArr;
            }
          }
        }
      }

      // Apply updates
      if (Object.keys(updates).length > 0) {
        const { error } = await db
          .from('content_translations')
          .update(updates)
          .eq('table_name', 'tours')
          .eq('row_id', tour.id)
          .eq('locale', loc);
        
        if (error) {
          console.log(`FAIL [${loc}] ${tour.slug}: ${error.message}`);
        } else {
          const fields = Object.keys(updates).join(', ');
          console.log(`OK [${loc}] ${tour.slug}: ${fields}`);
          fixCount++;
        }
      }
    }
  }

  console.log(`\nDone! ${fixCount} tour-locale combinations updated.`);
  console.log('No German content was modified.');
})();
