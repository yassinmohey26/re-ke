import { createClient } from '@supabase/supabase-js';

const db = createClient(
  'https://bgweumxabgkkqnvifaik.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnd2V1bXhhYmdra3FudmlmYWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDIxNjAxMCwiZXhwIjoyMDk5NzkyMDEwfQ.eQOr4ZxCKn1yRYqzyiotvCQge31PIrpwxuRAn6Iik8I'
);

// Same helper functions — abbreviated
function translateContent(locale, text) {
  if (locale === 'en') {
    return text
      .replace(/Abholung vom Hotel/g, 'Pickup from hotel')
      .replace(/Abholung in Hurghada/g, 'Pickup in Hurghada')
      .replace(/Abholung direkt von Ihrem Hotel/g, 'Direct pickup from your hotel')
      .replace(/Hotelabholung in Hurghada/g, 'Hotel pickup in Hurghada')
      .replace(/Hotelabholung/g, 'Hotel pickup')
      .replace(/Bequemer Transfer von Ihrer Unterkunft in Hurghada/g, 'Comfortable transfer from your accommodation in Hurghada')
      .replace(/Wir holen Sie bequem/g, 'We pick you up comfortably')
      .replace(/Tauch.*ein in das farbenfrohe Markttreiben/g, 'Immerse yourself in the colorful market life')
      .replace(/erleben Sie die authentische Atmosphäre/g, 'experience the authentic atmosphere')
      .replace(/Entdecken Sie traditionelle Produkte/g, 'Discover traditional products')
      .replace(/handgemachte Lederwaren, Parfümöle/g, 'handmade leather goods, perfume oils')
      .replace(/Papyrusrollen, Gewürze, Schmuck/g, 'papyrus scrolls, spices, jewelry')
      .replace(/Nach einer erlebnisreichen Shoppingtour/g, 'After an eventful shopping tour')
      .replace(/Rotes Meer zählt zu den schönsten Schnorchelgebieten weltweit/g, 'The Red Sea is one of the most beautiful snorkeling areas in the world')
      .replace(/Entdecken Sie farbenreiche Korallenriffe/g, 'Discover colorful coral reefs')
      .replace(/tropische Rifffische, Schildkröten, Rochen/g, 'tropical reef fish, turtles, rays')
      .replace(/Napoleonfische/g, 'Napoleonfish')
      .replace(/klarem, warmem Wasser mit sehr guter Sicht/g, 'clear, warm water with excellent visibility')
      .replace(/Aufenthalt an einer abgelegenen Insel/g, 'Stop at a remote island')
      .replace(/hellem Sandstrand/g, 'bright sandy beach')
      .replace(/ausreichend Zeit/g, 'plenty of time')
      .replace(/Schwimmen, Sonnenbaden oder Entspannen/g, 'swimming, sunbathing or relaxing')
      .replace(/Durch die private Organisation/g, 'Thanks to the private organization')
      .replace(/vermeiden Sie Menschenansammlungen/g, 'you avoid crowds')
      .replace(/genießen die Natur in ruhiger Atmosphäre/g, 'enjoy nature in a quiet atmosphere')
      .replace(/Auf der Rückfahrt erleben Sie den Sonnenuntergang/g, 'On the way back you experience the sunset')
      .replace(/Die besondere Lichtstimmung auf dem Wasser/g, 'The special play of light on the water')
      .replace(/stimmungsvollen Abschluss/g, 'atmospheric conclusion')
      .replace(/Pünktliche Abholung/g, 'Punctual pickup')
      .replace(/Persönliche Begrüßung/g, 'Personal welcome')
      .replace(/kurze Einweisung – danach beginnt Ihr Abenteuer/g, 'short briefing – then your adventure begins')
      .replace(/kurze Einweisung/g, 'short briefing')
      .replace(/Kurze Einführung/g, 'Short introduction')
      .replace(/Fahrt zu den besten Delfinplätzen/g, 'Boat ride to the best dolphin spots')
      .replace(/Mit etwas Glück beobachten Sie Delfine/g, 'With luck, you can spot dolphins')
      .replace(/sofern die Bedingungen es erlauben/g, 'if conditions permit')
      .replace(/gemeinsam mit ihnen schwimmen/g, 'swim with them')
      .replace(/Delfine sind Wildtiere/g, 'Dolphins are wild animals')
      .replace(/Eine Sichtung kann nicht garantiert werden/g, 'Sightings cannot be guaranteed')
      .replace(/die Erfolgsquote ist jedoch sehr hoch/g, 'but the success rate is very high')
      .replace(/Zwei Stopps an farbenprächtigen Riffen/g, 'Two stops at colorful reefs')
      .replace(/beeindruckender Unterwasserwelt/g, 'impressive underwater world')
      .replace(/Entdecken Sie ein faszinierendes Schiffswrack/g, 'Discover a fascinating shipwreck')
      .replace(/einer beeindruckenden Unterwasserwelt voller Fische und Korallen/g, 'an impressive underwater world full of fish and coral')
      .replace(/Gegen 12:00 Uhr Rückkehr/g, 'Return at around 12:00 PM')
      .replace(/Transfer ins Hotel/g, 'Transfer to hotel')
      .replace(/in einem privaten, klimatisierten Fahrzeug/g, 'in a private, air-conditioned vehicle')
      .replace(/klimatisierten Privatfahrzeug/g, 'air-conditioned private vehicle')
      .replace(/klimatisierten Fahrzeug/g, 'air-conditioned vehicle')
      .replace(/klimatisiertem Fahrzeug/g, 'air-conditioned vehicle')
      .replace(/klimatisierten Minibus/g, 'air-conditioned minibus')
      .replace(/Bequemer Transfer/g, 'Comfortable transfer')
      .replace(/im klimatisierten Fahrzeug/g, 'in an air-conditioned vehicle')
      .replace(/direkt von Ihrem Hotel/g, 'directly from your hotel')
      .replace(/ca\. /g, 'approx. ')
      .replace(/Gesamt ca\./g, 'Total approx.')
      .replace(/etwa /g, 'approximately ')
      .replace(/Ihr erfahrener, deutschsprachiger Reiseleiter holt Sie/g, 'Your experienced, German-speaking guide picks you up')
      .replace(/ und bringt Sie sicher/g, ' and takes you safely')
      .replace(/Genießen Sie den weiten Blick/g, 'Enjoy the wide view')
      .replace(/Spüren Sie die Meeresbrise/g, 'Feel the sea breeze')
      .replace(/freuen Sie sich auf unvergessliche Momente/g, 'look forward to unforgettable moments')
      .replace(/Erkunden Sie die farbenfrohe Unterwasserwelt/g, 'Explore the colorful underwater world')
      .replace(/Schnorchelausrüstung wird bereitgestellt/g, 'Snorkeling equipment is provided')
      .replace(/Entspannen Sie an den weißen Sandstränden/g, 'Relax on the white sand beaches')
      .replace(/schwimmen Sie im kristallklaren Wasser/g, 'swim in the crystal-clear water')
      .replace(/schnorcheln Sie direkt vom Strand aus/g, 'snorkel directly from the beach')
      .replace(/Liegen und Sonnenschirme stehen für Sie bereit/g, 'Sun loungers and umbrellas are ready for you')
      .replace(/Nach einem ereignisreichen Tag geht es zurück/g, 'After an eventful day we return')
      .replace(/mit vielen neuen Eindrücken und glücklichen Erinnerungen/g, 'with many new impressions and happy memories')
      .replace(/Persönliche Begrüßung/g, 'Personal welcome')
      .replace(/Sicherheitseinweisung/g, 'safety briefing')
      .replace(/Start der Bootstour/g, 'Start of the boat tour')
      .replace(/wird gestellt/g, 'is provided')
      .replace(/Transfer zum Hafen/g, 'Transfer to harbor')
      .replace(/Rückkehr zum Hafen/g, 'Return to harbor')
      .replace(/Abholung in Hurghada, El Gouna, Makadi Bay, Soma Bay oder Safaga/g, 'Pickup in Hurghada, El Gouna, Makadi Bay, Soma Bay or Safaga')
      .replace(/Straßen /g, '')
      .replace(/ Abholung vom/g, '')
      // Night city
      .replace(/Abholung direkt von Ihrem Hotel/g, 'Direct pickup from your hotel')
      .replace(/Spaziergang durch die Marina/g, 'Stroll through the marina')
      .replace(/Besuch des Fischmarktes und der Großen Moschee/g, 'Visit the fish market and the Great Mosque')
      .replace(/Weiterfahrt zum Obst- und Gemüsemarkt/g, 'Continue to the fruit and vegetable market')
      .replace(/Pause im ägyptischen Café/g, 'Break at an Egyptian café')
      .replace(/Rückkehr zum Hotel/g, 'Return to the hotel')
      // Short itineraries
      .replace(/Abholung vom Hotel in Hurghada/g, 'Pickup from hotel in Hurghada')
      .replace(/Fahrt nach Dendera/g, 'Drive to Dendera')
      .replace(/Fahrt nach Dendera \(ca\. 250 km\)/g, 'Drive to Dendera (approx. 250 km)')
      .replace(/Abholung um ca\. 06:00 Uhr direkt von Ihrem Hotel in Hurghada/g, 'Pickup at approx. 06:00 AM directly from your hotel in Hurghada')
      .replace(/Fahrt nach Dendera \(ca\. 230 km, klimatisiertes Fahrzeug\)/g, 'Drive to Dendera (approx. 230 km, air-conditioned vehicle)')
      .replace(/Abholung vom Hotel in Hurghada\./g, 'Pickup from hotel in Hurghada.')
      .replace(/Fahrt durch die östliche Wüste zum Kloster St\. Antonius/g, 'Drive through the Eastern Desert to St. Anthony\'s Monastery')
      .replace(/Besichtigung der historischen Kirchen, Fresken und Manuskripte/g, 'Visit the historic churches, frescoes and manuscripts')
      .replace(/Aufstieg zur Höhle des Heiligen Antonius \(optional\)/g, 'Climb to the Cave of St. Anthony (optional)')
      .replace(/Weiterfahrt zum Kloster St\. Paulus/g, 'Continue to St. Paul\'s Monastery')
      .replace(/Besichtigung des Klosters und der Kirche des Heiligen Paulus/g, 'Visit the monastery and the Church of St. Paul')
      .replace(/Mittagessen in einem lokalen Restaurant/g, 'Lunch at a local restaurant')
      .replace(/Rückfahrt nach Hurghada\. Ankunft: ca\. 17:00 Uhr/g, 'Return to Hurghada. Arrival: approx. 05:00 PM')
      // Luxor
      .replace(/Start von Hurghada, Marsa Alam oder El Quseir in einem klimatisierten Privatfahrzeug. Nach ca\. 3,5 Stunden erreichen Sie Luxor/g, 'Depart from Hurghada, Marsa Alam or El Quseir in an air-conditioned private vehicle. After approx. 3.5 hours you reach Luxor')
      .replace(/Sie genießen ein entspanntes Abendessen und beziehen Ihr ausgewähltes Hotel, bevor die Nacht zur Vorbereitung auf das morgendliche Abenteuer ruht/g, 'Enjoy a relaxing dinner and check into your selected hotel, before resting for the morning adventure')
      .replace(/Gegen 4:00 Uhr startet Ihre Heißluftballonfahrt. Während die Sonne langsam das Niltal färbt, schweben Sie über Tempel, Felder und den Westjordan des antiken Theben. Ein Moment, der Ihrem Reisealbum Glanz verleiht/g, 'At around 4:00 AM your hot air balloon ride begins. As the sun slowly colors the Nile Valley, you float over temples, fields and the west bank of ancient Thebes. A moment that will shine in your travel album')
      .replace(/Erkunden Sie die Gräber der Pharaonen, deren Wandmalereien seit Jahrtausenden leuchten/g, 'Explore the tombs of the pharaohs, whose wall paintings have been glowing for millennia')
      .replace(/Ein Tempel wie aus einem Fels geschnitten. Würde, Geschichte, klare Linien/g, 'A temple carved from the rock itself. Dignity, history, clean lines')
      .replace(/Die monumentalen Wächterfiguren des Amenophis III\. erwarten Sie bereits/g, 'The monumental guardian statues of Amenhotep III are already awaiting you')
      .replace(/Ein reichhaltiges ägyptisches Menü bietet Stärkung für den weiteren Tag/g, 'A rich Egyptian menu provides nourishment for the rest of the day')
      .replace(/Zum Finale Ihres Ausflugs entdecken Sie den größten Tempelkomplex Ägyptens. Tempel, gewaltige Säulen, Jahrtausende Kultur – ein würdiger Abschluss/g, 'To conclude your excursion, discover the largest temple complex in Egypt. Temples, mighty columns, millennia of culture – a fitting finale')
      .replace(/Ankunft gegen 20:00 Uhr in Ihrem Hotel/g, 'Arrival at your hotel around 8:00 PM')
      // Cairo flight
      .replace(/Abholung vom Hotel in Hurghada/g, 'Pickup from hotel in Hurghada')
      .replace(/Flug nach Kairo/g, 'Flight to Cairo')
      .replace(/Ankunft in Kairo & Begrüßung durch Ihren Guide/g, 'Arrival in Cairo & welcome by your guide')
      .replace(/Pyramiden, Sphinx, Museum, Mittagessen/g, 'Pyramids, Sphinx, Museum, Lunch')
      .replace(/Rückflug nach Hurghada/g, 'Return flight to Hurghada')
      .replace(/Ankunft & Transfer zum Hotel/g, 'Arrival & transfer to hotel')
      // Makadi
      .replace(/Abholung direkt vom Hotel in Hurghada oder Makadi Bay/g, 'Direct pickup from hotel in Hurghada or Makadi Bay')
      .replace(/Bequemer Transfer im klimatisierten Fahrzeug/g, 'Comfortable transfer in an air-conditioned vehicle')
      .replace(/Ganztägiger Aufenthalt im Makadi Water Park/g, 'Full-day stay at the Makadi Water Park')
      .replace(/Bevorzugter Einlass mit organisiertem Zugang/g, 'Priority entry with organized access')
      .replace(/Nutzung aller für Alter und Größe zugelassenen Attraktionen/g, 'Use of all attractions permitted for age and height')
      .replace(/Mittagessen & Getränke inklusive/g, 'Lunch & drinks included')
      .replace(/Rücktransfer zum Hotel am Nachmittag/g, 'Return transfer to hotel in the afternoon')
      // Mahmya
      .replace(/Am frühen Morgen werden Sie direkt von Ihrem Hotel abgeholt und zum Hafen gebracht. Dort begrüßt Sie die freundliche Crew an Bord Ihres komfortablen Bootes/g, 'Early in the morning you are picked up directly from your hotel and taken to the harbor. The friendly crew welcomes you on board your comfortable boat')
      .replace(/Nach der Ausgabe Ihrer Schnorchelausrüstung und einer kurzen Einweisung beginnt die Fahrt über das tiefblaue Rote Meer. Schon bald erreichen Sie die ersten Schnorchelplätze mit bunten Fischen, Korallenformationen und mit etwas Glück sogar Meeresschildkröten oder Delfine/g, 'After receiving your snorkeling gear and a short briefing, the journey across the deep blue Red Sea begins. Soon you reach the first snorkeling spots with colorful fish, coral formations and, with luck, even sea turtles or dolphins')
      .replace(/Nach der Ankunft auf der Mahmya Insel genießen Sie die traumhafte Kulisse und ein frisch zubereitetes Mittagsbuffet in einem Restaurant direkt am Meer. Der restliche Tag gehört ganz Ihnen: Entspannen, Schwimmen, die Insel erkunden oder die Ruhe und Sonne genießen/g, 'After arriving on Mahmya Island, you enjoy the dreamlike scenery and a freshly prepared lunch buffet at a restaurant right by the sea. The rest of the day is yours: relax, swim, explore the island, or simply enjoy the peace and sunshine')
      .replace(/Am Nachmittag kehren Sie entspannt zum Hafen zurück und werden zu Ihrem Hotel gebracht/g, 'In the afternoon you return relaxed to the harbor and are brought back to your hotel')
      // Hula Hula
      .replace(/Ihr erfahrener, deutschsprachiger Reiseleiter holt Sie in einem klimatisierten Fahrzeug ab und bringt Sie sicher zum Hafen/g, 'Your experienced, German-speaking guide picks you up in an air-conditioned vehicle and brings you safely to the harbor')
      .replace(/Genießen Sie den weiten Blick über das glitzernde Rote Meer. Spüren Sie die Meeresbrise und freuen Sie sich auf unvergessliche Momente/g, 'Enjoy the wide view over the glittering Red Sea. Feel the sea breeze and look forward to unforgettable moments')
      .replace(/Erkunden Sie die farbenfrohe Unterwasserwelt mit exotischen Fischen und beeindruckenden Korallenriffen. Schnorchelausrüstung wird bereitgestellt/g, 'Explore the colorful underwater world with exotic fish and impressive coral reefs. Snorkeling equipment is provided')
      .replace(/Entspannen Sie an den weißen Sandstränden, schwimmen Sie im kristallklaren Wasser oder schnorcheln Sie direkt vom Strand aus. Liegen und Sonnenschirme stehen für Sie bereit/g, 'Relax on the white sand beaches, swim in the crystal-clear water or snorkel directly from the beach. Sun loungers and umbrellas are ready for you')
      .replace(/Nach einem ereignisreichen Tag geht es zurück zum Hafen und anschließend zu Ihrem Hotel – mit vielen neuen Eindrücken und glücklichen Erinnerungen/g, 'After an eventful day we return to the harbor and then to your hotel – with many new impressions and happy memories')
      // Super Safari
      .replace(/Hotelabholung in Hurghada oder Umgebung/g, 'Hotel pickup in Hurghada or surrounding area')
      .replace(/Fahrt zur Wüstenstation/g, 'Drive to the desert station')
      .replace(/Einweisung und Start der Quad-Tour/g, 'Briefing and start of the quad bike tour')
      .replace(/Spider-Buggy Fahrt durch die Wüste/g, 'Spider buggy ride through the desert')
      .replace(/Jeep-Safari zum Beduinendorf/g, 'Jeep safari to the Bedouin village')
      .replace(/Kamelritt und Dorfbesuch/g, 'Camel ride and village visit')
      .replace(/Sonnenuntergang in der Wüste/g, 'Sunset in the desert')
      .replace(/BBQ-Abendessen und Folklore-Show/g, 'BBQ dinner and folklore show')
      .replace(/Rückfahrt zum Hotel/g, 'Return to hotel');
  }
  if (locale === 'fr') {
    return text
      .replace(/Abholung vom Hotel/g, 'Prise en charge à l\'hôtel')
      .replace(/Abholung in Hurghada/g, 'Prise en charge à Hurghada')
      .replace(/Abholung direkt von Ihrem Hotel/g, 'Prise en charge directe à votre hôtel')
      .replace(/Hotelabholung/g, 'Prise en charge à l\'hôtel')
      .replace(/Bequemer Transfer/g, 'Transfert confortable')
      .replace(/ca\. /g, 'env. ')
      .replace(/etwa /g, 'environ ')
      .replace(/in einem privaten, klimatisierten Fahrzeug/g, 'dans un véhicule privé climatisé')
      .replace(/klimatisierten Privatfahrzeug/g, 'véhicule privé climatisé')
      .replace(/klimatisierten Fahrzeug/g, 'véhicule climatisé')
      .replace(/klimatisiertem Fahrzeug/g, 'véhicule climatisé')
      .replace(/klimatisierten Minibus/g, 'minibus climatisé')
      .replace(/im klimatisierten Fahrzeug/g, 'en véhicule climatisé')
      .replace(/direkt von Ihrem Hotel/g, 'directement de votre hôtel')
      .replace(/Mittagessen/g, 'Déjeuner')
      .replace(/Sonnenuntergang/g, 'Coucher de soleil')
      .replace(/Ihr erfahrener, deutschsprachiger Reiseleiter holt Sie/g, 'Votre guide expérimenté germanophone vous prend en charge')
      .replace(/Pünktliche Abholung/g, 'Prise en charge ponctuelle')
      .replace(/Persönliche Begrüßung/g, 'Accueil personnalisé')
      .replace(/Kurze Einführung/g, 'Brève introduction')
      .replace(/kurze Einweisung/g, 'brève instruction');
  }
  if (locale === 'ru') {
    return text
      .replace(/Abholung vom Hotel/g, 'Забор из отеля')
      .replace(/Abholung in Hurghada/g, 'Забор в Хургаде')
      .replace(/Hotelabholung/g, 'Забор из отеля')
      .replace(/Bequemer Transfer/g, 'Комфортабельный трансфер')
      .replace(/ca\. /g, 'ок. ')
      .replace(/etwa /g, 'примерно ')
      .replace(/klimatisierten Fahrzeug/g, 'автомобиле с кондиционером')
      .replace(/klimatisiertem Fahrzeug/g, 'автомобиле с кондиционером')
      .replace(/im klimatisierten Fahrzeug/g, 'в автомобиле с кондиционером')
      .replace(/Mittagessen/g, 'Обед')
      .replace(/Sonnenuntergang/g, 'Закат')
      .replace(/Ihr erfahrener, deutschsprachiger Reiseleiter holt Sie/g, 'Ваш опытный немецкоязычный гид заберёт вас');
  }
  if (locale === 'hu') {
    return text
      .replace(/Abholung vom Hotel/g, 'Szállítás a szállodából')
      .replace(/Abholung in Hurghada/g, 'Szállítás Hurghadában')
      .replace(/Hotelabholung/g, 'Szállítás a szállodából')
      .replace(/Bequemer Transfer/g, 'Kényelmes transzfer')
      .replace(/ca\. /g, 'kb. ')
      .replace(/etwa /g, 'körülbelül ')
      .replace(/klimatisierten Fahrzeug/g, 'légkondicionált járművel')
      .replace(/klimatisiertem Fahrzeug/g, 'légkondicionált járművel')
      .replace(/im klimatisierten Fahrzeug/g, 'légkondicionált járművel')
      .replace(/Mittagessen/g, 'Ebéd')
      .replace(/Sonnenuntergang/g, 'Naplemente')
      .replace(/Ihr erfahrener, deutschsprachiger Reiseleiter holt Sie/g, 'Tapasztalt, német nyelvű idegenvezetője felveszi Önt');
  }
  if (locale === 'ar') {
    return text
      .replace(/Abholung vom Hotel/g, 'الاستلام من الفندق')
      .replace(/Abholung in Hurghada/g, 'الاستلام في الغردقة')
      .replace(/Hotelabholung/g, 'الاستلام من الفندق')
      .replace(/Bequemer Transfer/g, 'نقل مريح')
      .replace(/ca\. /g, 'تقريباً ')
      .replace(/etwa /g, 'حوالي ')
      .replace(/klimatisierten Fahrzeug/g, 'مركبة مكيفة')
      .replace(/klimatisiertem Fahrzeug/g, 'مركبة مكيفة')
      .replace(/im klimatisierten Fahrzeug/g, 'بمركبة مكيفة')
      .replace(/Mittagessen/g, 'الغداء')
      .replace(/Sonnenuntergang/g, 'غروب الشمس')
      .replace(/Ihr erfahrener, deutschsprachiger Reiseleiter holt Sie/g, 'مرشدك السياحي ذو الخبرة والناطق بالألمانية يستقبلك');
  }
  return text;
}

function makeTitle(locale, title) {
  let t = title;
  if (locale === 'en') {
    t = t.replace(/(\d{2}):(\d{2})(?:\s*Uhr)?/g, (_, h, m) => `${h}:${m} ${+h<12?'AM':'PM'}`)
         .replace(/ca\. /g, 'approx. ');
  }
  if (locale === 'fr') {
    t = t.replace(/(\d{2}):(\d{2})(?:\s*Uhr)?/g, (_, h, m) => `${h}h${m}`)
         .replace(/ca\. /g, 'env. ');
  }
  if (locale === 'ru') {
    t = t.replace(/(\d{2}):\d{2}\s*Uhr/g, (m) => m.replace(' Uhr', ''))
         .replace(/ca\. /g, 'ок. ');
  }
  if (locale === 'hu') {
    t = t.replace(/(\d{2}):\d{2}\s*Uhr/g, (m) => m.replace(' Uhr', ''))
         .replace(/ca\. /g, 'kb. ');
  }
  if (locale === 'ar') {
    t = t.replace(/(\d{2}):(\d{2})/g, (m, h) => `${+h<12?`${m} صباحاً`:`${m} مساءً`}`)
         .replace(/ca\. /g, 'تقريباً ');
  }
  return t;
}

function translateItinerary(deSteps, locale) {
  return deSteps.map(s => ({
    title: makeTitle(locale, s.title),
    content: translateContent(locale, s.content),
  }));
}

const germanItineraries = {
  'hula-hula-insel-schnorchelausflug-hurghada': [
    { title: 'Hotelabholung', content: 'Ihr erfahrener, deutschsprachiger Reiseleiter holt Sie in einem klimatisierten Fahrzeug ab und bringt Sie sicher zum Hafen.' },
    { title: 'Bootsfahrt zur Hula Hula Insel', content: 'Genießen Sie den weiten Blick über das glitzernde Rote Meer. Spüren Sie die Meeresbrise und freuen Sie sich auf unvergessliche Momente.' },
    { title: 'Schnorcheln & Schwimmen', content: 'Erkunden Sie die farbenfrohe Unterwasserwelt mit exotischen Fischen und beeindruckenden Korallenriffen. Schnorchelausrüstung wird bereitgestellt.' },
    { title: 'Inselaufenthalt (90 Minuten)', content: 'Entspannen Sie an den weißen Sandstränden, schwimmen Sie im kristallklaren Wasser oder schnorcheln Sie direkt vom Strand aus. Liegen und Sonnenschirme stehen für Sie bereit.' },
    { title: 'Rückfahrt zum Hotel', content: 'Nach einem ereignisreichen Tag geht es zurück zum Hafen und anschließend zu Ihrem Hotel – mit vielen neuen Eindrücken und glücklichen Erinnerungen.' },
  ],
  'super-safari-hurghada': [
    { title: 'Hotelabholung', content: 'Hotelabholung in Hurghada oder Umgebung.' },
    { title: 'Wüstenstation', content: 'Fahrt zur Wüstenstation.' },
    { title: 'Quad-Tour', content: 'Einweisung und Start der Quad-Tour.' },
    { title: 'Spider-Buggy', content: 'Spider-Buggy Fahrt durch die Wüste.' },
    { title: 'Jeep-Safari & Beduinendorf', content: 'Jeep-Safari zum Beduinendorf. Kamelritt und Dorfbesuch.' },
    { title: 'Sonnenuntergang', content: 'Sonnenuntergang in der Wüste.' },
    { title: 'BBQ-Abendessen & Folklore', content: 'BBQ-Abendessen und Folklore-Show.' },
    { title: 'Rückfahrt zum Hotel', content: 'Rückfahrt zum Hotel.' },
  ],
};

const slugs = Object.keys(germanItineraries);
const locales = ['en', 'fr', 'ru', 'hu', 'ar'];

const { data: tourRows } = await db.from('tours').select('id, slug').in('slug', slugs);
if (!tourRows) { console.error('No tours found'); process.exit(1); }

let count = 0;
for (const slug of slugs) {
  const tour = tourRows.find(t => t.slug === slug);
  if (!tour) { console.warn(`Tour not found: ${slug}`); continue; }
  const deSteps = germanItineraries[slug];
  for (const locale of locales) {
    const translated = translateItinerary(deSteps, locale);
    const { error } = await db
      .from('content_translations')
      .update({ content: JSON.stringify(translated) })
      .eq('table_name', 'tours')
      .eq('row_id', tour.id)
      .eq('locale', locale);
    if (error) {
      console.error(`ERROR ${slug} [${locale}]: ${error.message}`);
    } else {
      console.log(`✓ ${slug} [${locale}] — ${translated.length} steps`);
      count++;
    }
  }
}
console.log(`\nDone! Updated ${count} translation rows.`);
process.exit(0);
