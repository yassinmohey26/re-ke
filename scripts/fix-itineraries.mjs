import { createClient } from '@supabase/supabase-js';

const db = createClient(
  'https://bgweumxabgkkqnvifaik.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnd2V1bXhhYmdra3FudmlmYWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDIxNjAxMCwiZXhwIjoyMDk5NzkyMDEwfQ.eQOr4ZxCKn1yRYqzyiotvCQge31PIrpwxuRAn6Iik8I'
);

// ─── HELPERS ───

function fixTime(t, locale) {
  if (locale === 'en') return t.replace(/(\d{1,2}):(\d{2})/g, (_, h, m) => `${h.padStart(2,'0')}:${m} ${+h<12?'AM':'PM'}`);
  if (locale === 'fr') return t.replace(/(\d{2}):(\d{2})/g, (_, h, m) => `${h}h${m}`).replace(/Uhr/g,'').trim();
  if (locale === 'ru') return t.replace(/Uhr/g,'').trim();
  if (locale === 'hu') return t.replace(/Uhr/g,'').trim();
  if (locale === 'ar') return t.replace(/(\d{2}:\d{2})/g, (m) => `${+m.split(':')[0]}<12?'${m} صباحاً':'${m} مساءً'`);
  return t;
}

// Manual replacement dictionaries for common content patterns
const dict = {
  en: {
    'Abholung vom Hotel': 'Hotel Pickup',
    'Rückfahrt zum Hotel': 'Return to Hotel',
    'Rücktransfer zum Hotel': 'Return Transfer to Hotel',
    'Rückfahrt nach Hurghada': 'Return to Hurghada',
    'Rücktransfers': 'Return Transfer',
    'Rückfahrt': 'Return Journey',
    'Rücktransfer': 'Return Transfer',
    'Abholung direkt von Ihrem Hotel': 'Direct pickup from your hotel',
    'Abholung von Ihrem Hotel in Hurghada im klimatisierten Fahrzeug': 'Pickup from your hotel in Hurghada in an air-conditioned vehicle',
    'Abholung vom Hotel in Hurghada mit komfortablem, klimatisiertem Minibus': 'Pickup from your hotel in Hurghada with a comfortable, air-conditioned minibus',
    'Bequemer Transfer von Ihrer Unterkunft in Hurghada': 'Comfortable transfer from your accommodation in Hurghada',
    'Kurze Einführung – danach direkt auf das Quad': 'Short introduction – then straight onto the quad bike',
    'Fahren Sie über Sanddünen und erleben Sie echtes Offroad-Feeling': 'Ride over sand dunes and experience real off-road adventure',
    'Beduinendorf & Tee': 'Bedouin Village & Tea',
    'Kamelritt': 'Camel Ride',
    'Kurzes, authentisches Erlebnis für Fotos & Eindrücke': 'Short, authentic experience for photos and memories',
    'Entspannt zurück nach Ihrer Tour': 'Relaxed return after your tour',
    'Einblick in die Kultur der Wüste inklusive traditionellem Tee': 'Insight into desert culture including traditional tea',
    'Abholung in Hurghada, El Gouna, Makadi Bay, Soma Bay oder Safaga': 'Pickup in Hurghada, El Gouna, Makadi Bay, Soma Bay or Safaga',
    'Persönliche Begrüßung und Sicherheitseinweisung an Bord des privaten Bootes': 'Personal welcome and safety briefing on board the private boat',
    '1–2 Schnorchelgänge an den schönsten Riffen des Roten Meeres': '1–2 snorkeling stops at the most beautiful Red Sea reefs',
    'Orange Bay oder Magawish Insel': 'Orange Bay or Magawish Island',
    'Freizeit, Mittagessen & Strandaufenthalt': 'Free time, lunch & beach stay',
    'Entspannung am Strand oder auf dem Boot': 'Relaxation on the beach or on the boat',
    'Rückfahrt zum Hafen & Transfer zum Hotel': 'Return to harbor & transfer to hotel',
    'Ihr Tag beginnt zwischen 7:30 und 8:00 Uhr mit dem komfortablen Hoteltransfer zum Hafen': 'Your day begins between 07:30 and 08:00 with a comfortable hotel transfer to the harbor',
    'Nach der Ausgabe Ihrer Schnorchelausrüstung startet die 40-minütige Bootsfahrt zu den faszinierendsten Riffen rund um Eden Island': 'After receiving your snorkeling equipment, the 40-minute boat ride begins to the most fascinating reefs around Eden Island',
    'Schnorcheln und Strandzeit': 'Snorkeling & Beach Time',
    'Mittagessen während des Ausflugs': 'Lunch during the excursion',
    'Entspannung und Rückfahrt': 'Relaxation & Return Journey',
    'Abholung direkt von Ihrem Hotel in einem privaten, klimatisierten Fahrzeug und Transfer zum Hafen': 'Direct pickup from your hotel in a private, air-conditioned vehicle and transfer to the harbor',
    'Bootsfahrt im Roten Meer': 'Boat Ride on the Red Sea',
    'Schnorcheln an zwei Korallenriffen': 'Snorkeling at Two Coral Reefs',
    'Aufenthalt auf Orange Bay Island': 'Stay on Orange Bay Island',
    'Wassersportaktivitäten': 'Water Sports Activities',
    'Mittagessen': 'Lunch',
    'Abholung von Ihrem Hotel in Hurghada im klimatisierten Fahrzeug': 'Pickup from your hotel in Hurghada in an air-conditioned vehicle',
    'Transfer zum Hafen & Einschiffung': 'Transfer to Harbor & Boarding',
    'Glasbodenboot-Fahrt': 'Glass-Bottom Boat Ride',
    'Schnorchelstopp': 'Snorkeling Stop',
    'Entspannung an Bord': 'Relaxation on Board',
    'Abholung vom Hotel': 'Hotel Pickup',
    'Bequemer Transfer von Ihrer Unterkunft': 'Comfortable transfer from your accommodation',
    'Einweisung & Start': 'Briefing & Start',
    'Quad Safari durch die Wüste': 'Quad Safari through the Desert',
    'Rücktransfer zum Hotel': 'Return Transfer to Hotel',
    // Night city tour
    '19:00 Uhr Abholung vom Hotel': '07:00 PM – Hotel Pickup',
    'Spaziergang durch die Marina': 'Stroll through the Marina',
    'Fischmarkt & Große Moschee': 'Fish Market & Great Mosque',
    'Obst- und Gemüsemarkt': 'Fruit & Vegetable Market',
    'Pause im ägyptischen Café': 'Break at an Egyptian Café',
    '22:00 Uhr Rückkehr zum Hotel': '10:00 PM – Return to Hotel',
    // Mini Egypt
    'Ankunft im Mini Egypt Park': 'Arrival at Mini Egypt Park',
    'Geführte Tour': 'Guided Tour',
    'Freizeit im Park': 'Free Time in the Park',
    // Monasteries
    'Abholung (04:00 Uhr)': 'Pickup (04:00 AM)',
    'Fahrt zum Kloster St. Antonius': 'Drive to St. Anthony\'s Monastery',
    'Besichtigung Kloster St. Antonius': 'Visit St. Anthony\'s Monastery',
    'Höhle des Heiligen Antonius': 'Cave of St. Anthony',
    'Weiterfahrt zum Kloster St. Paulus': 'Continue to St. Paul\'s Monastery',
    'Besichtigung Kloster St. Paulus': 'Visit St. Paul\'s Monastery',
    'Rückfahrt nach Hurghada. Ankunft: ca. 17:00 Uhr': 'Return to Hurghada. Arrival: approx. 05:00 PM',
    // Dendera
    'Abholung & Fahrt nach Dendera': 'Pickup & Drive to Dendera',
    'Ankunft am Tempel': 'Arrival at the Temple',
    'Hathor-Säulenhalle & Decke': 'Hathor Hypostyle Hall & Ceiling',
    'Weitere Bereiche': 'Additional Areas',
    'Individuelle Besichtigung': 'Individual Exploration',
    'Rückkehr': 'Return',
    // Cairo flight
    '04:00 Uhr': '04:00 AM',
    '06:00 Uhr': '06:00 AM',
    '06:50 Uhr': '06:50 AM',
    '08:00–19:00 Uhr': '08:00 AM – 07:00 PM',
    '19:00 Uhr': '07:00 PM',
    '19:45 Uhr': '07:45 PM',
    'Flug nach Kairo': 'Flight to Cairo',
    'Ankunft in Kairo & Begrüßung durch Ihren Guide': 'Arrival in Cairo & welcome by your guide',
    'Pyramiden, Sphinx, Museum, Mittagessen': 'Pyramids, Sphinx, Museum, Lunch',
    'Rückflug nach Hurghada': 'Return flight to Hurghada',
    'Ankunft & Transfer zum Hotel': 'Arrival & transfer to hotel',
    // Makadi Water Park
    'Hotelabholung': 'Hotel Pickup',
    'Transfer': 'Transfer',
    'Makadi Water Park': 'Makadi Water Park',
    'Mittagessen & Getränke': 'Lunch & Drinks',
    'Rücktransfer': 'Return Transfer',
    // Mahmya
    'Abholung & Transfer zum Hafen': 'Pickup & Transfer to Harbor',
    'Schnorchelfahrt': 'Snorkeling Trip',
    'Mahmya Insel & Mittagessen': 'Mahmya Island & Lunch',
    'Rückfahrt zum Hotel': 'Return to Hotel',
    // Hula Hula
    'Bootsfahrt zur Hula Hula Insel': 'Boat Ride to Hula Hula Island',
    'Schnorcheln & Schwimmen': 'Snorkeling & Swimming',
    'Inselaufenthalt': 'Island Stay',
    // Super Safari
    'Wüstenstation': 'Desert Station',
    'Quad-Tour': 'Quad Bike Tour',
    'Spider-Buggy': 'Spider Buggy',
    'Jeep-Safari & Beduinendorf': 'Jeep Safari & Bedouin Village',
    'Sonnenuntergang': 'Sunset',
    'BBQ-Abendessen & Folklore': 'BBQ Dinner & Folklore Show',
    'Sonnenuntergang in der Wüste': 'Sunset in the desert',
    // Luxor
    '17:00 Uhr – Abholung vom Hotel': '05:00 PM – Hotel Pickup',
    'Ankunft, Abendessen & Check-in': 'Arrival, Dinner & Check-in',
    'Sonnenaufgang über Luxor – Heißluftballonfahrt': 'Sunrise over Luxor – Hot Air Balloon Ride',
    'Tal der Könige – drei Grabkammern': 'Valley of the Kings – Three Tombs',
    'Hatschepsut-Tempel': 'Temple of Hatshepsut',
    'Memnon-Kolosse – Fotostopp': 'Colossi of Memnon – Photo Stop',
    'Mittagessen am Nil': 'Lunch on the Nile',
    'Karnak-Tempel': 'Karnak Temple',
    'Rückfahrt nach Hurghada': 'Return to Hurghada',
  },
  fr: {
    'Abholung vom Hotel': 'Prise en charge à l\'hôtel',
    'Rückfahrt zum Hotel': 'Retour à l\'hôtel',
    'Rücktransfer zum Hotel': 'Retour à l\'hôtel',
    'Rückfahrt nach Hurghada': 'Retour à Hurghada',
    'Rückfahrt': 'Retour',
    'Rücktransfer': 'Retour',
    'Rückkehr': 'Retour',
    'Abholung': 'Prise en charge',
    'Hotelabholung': 'Prise en charge à l\'hôtel',
    'Mittagessen': 'Déjeuner',
    'Sonnenuntergang': 'Coucher de soleil',
    'Sonnenuntergang in der Wüste': 'Coucher de soleil dans le désert',
  },
  ru: {
    'Abholung vom Hotel': 'Забор из отеля',
    'Rückfahrt zum Hotel': 'Возвращение в отель',
    'Rücktransfer zum Hotel': 'Трансфер обратно в отель',
    'Rückfahrt nach Hurghada': 'Возвращение в Хургаду',
    'Rückfahrt': 'Обратная дорога',
    'Rücktransfer': 'Обратный трансфер',
    'Rückkehr': 'Возвращение',
    'Hotelabholung': 'Забор из отеля',
    'Mittagessen': 'Обед',
    'Sonnenuntergang': 'Закат',
    'Sonnenuntergang in der Wüste': 'Закат в пустыне',
  },
  hu: {
    'Abholung vom Hotel': 'Szállítás a szállodából',
    'Rückfahrt zum Hotel': 'Vissza a szállodába',
    'Rücktransfer zum Hotel': 'Visszaszállítás a szállodába',
    'Rückfahrt nach Hurghada': 'Vissza Hurghadába',
    'Rückfahrt': 'Visszaút',
    'Rücktransfer': 'Visszaszállítás',
    'Hotelabholung': 'Szállítás a szállodából',
    'Mittagessen': 'Ebéd',
    'Sonnenuntergang': 'Naplemente',
    'Sonnenuntergang in der Wüste': 'Naplemente a sivatagban',
  },
  ar: {
    'Abholung vom Hotel': 'الاستلام من الفندق',
    'Rückfahrt zum Hotel': 'العودة إلى الفندق',
    'Rücktransfer zum Hotel': 'العودة إلى الفندق',
    'Rückfahrt nach Hurghada': 'العودة إلى الغردقة',
    'Rückfahrt': 'رحلة العودة',
    'Rücktransfer': 'العودة',
    'Rückkehr': 'العودة',
    'Hotelabholung': 'الاستلام من الفندق',
    'Mittagessen': 'الغداء',
    'Sonnenuntergang': 'غروب الشمس',
    'Sonnenuntergang in der Wüste': 'غروب الشمس في الصحراء',
  },
};

function translate(locale, text, deSteps) {
  let d = dict[locale] || {};
  let t = d[text] || text;
  // For EN, replace times
  if (locale === 'en') {
    t = t.replace(/(\d{2}):(\d{2})(?:\s*Uhr)?/g, (_, h, m) => {
      const hour = parseInt(h);
      return `${h}:${m} ${hour < 12 ? 'AM' : 'PM'}`;
    }).replace(/ca\. /g, 'approx. ');
  }
  if (locale === 'fr') {
    t = t.replace(/(\d{2}):(\d{2})(?:\s*Uhr)?/g, (_, h, m) => `${h}h${m}`).replace(/ca\. /g, 'env. ');
  }
  if (locale === 'ru') {
    t = t.replace(/(\d{2}):(\d{2})\s*Uhr/g, '$1:$2').replace(/ca\. /g, 'ок. ');
  }
  if (locale === 'hu') {
    t = t.replace(/(\d{2}):(\d{2})\s*Uhr/g, '$1:$2').replace(/ca\. /g, 'kb. ');
  }
  if (locale === 'ar') {
    t = t.replace(/(\d{2}):(\d{2})\s*Uhr/g, '$1:$2').replace(/ca\. /g, 'تقريباً ');
  }
  return t;
}

function translateContent(locale, text) {
  // If the text is already fully translated (starts with an English/French/etc. keyword), skip
  // This handles generic content that varies per tour

  // Generic content templates — we replace common German patterns with locale versions
  if (locale === 'en') {
    return text
      .replace(/Abholung direkt von Ihrem Hotel/g, 'Direct pickup from your hotel')
      .replace(/Abholung vom Hotel/g, 'Pickup from hotel')
      .replace(/Abholung in Hurghada/g, 'Pickup in Hurghada')
      .replace(/Abholung von Ihrem Hotel in Hurghada/g, 'Pickup from your hotel in Hurghada')
      .replace(/Abholung von Ihrem Hotel/g, 'Pickup from your hotel')
      .replace(/Bequemer Transfer von Ihrer Unterkunft in Hurghada/g, 'Comfortable transfer from your accommodation in Hurghada')
      .replace(/Wir holen Sie bequem mit klimatisiertem Fahrzeug direkt von Ihrem Hotel in Hurghada oder Umgebung ab/g, 'We pick you up comfortably in an air-conditioned vehicle directly from your hotel in Hurghada or surrounding area')
      .replace(/Tauch.*ein in das farbenfrohe Markttreiben und erleben Sie die authentische Atmosphäre eines ägyptischen Basars/g, 'Immerse yourself in the colorful market life and experience the authentic atmosphere of an Egyptian bazaar')
      .replace(/Entdecken Sie traditionelle Produkte: handgemachte Lederwaren, Parfümöle, Papyrusrollen, Gewürze, Schmuck und vieles mehr/g, 'Discover traditional products: handmade leather goods, perfume oils, papyrus scrolls, spices, jewelry and much more')
      .replace(/Nach einer erlebnisreichen Shoppingtour bringen wir Sie sicher und bequem zurück in Ihr Hotel/g, 'After an eventful shopping tour, we bring you back safely and comfortably to your hotel')
      .replace(/Das Rote Meer zählt zu den schönsten Schnorchelgebieten weltweit/g, 'The Red Sea is one of the most beautiful snorkeling areas in the world')
      .replace(/Entdecken Sie farbenreiche Korallenriffe, tropische Rifffische, Schildkröten, Rochen und Napoleonfische bei klarem, warmem Wasser mit sehr guter Sicht/g, 'Discover colorful coral reefs, tropical reef fish, turtles, rays and Napoleonfish in clear, warm water with excellent visibility')
      .replace(/Aufenthalt an einer abgelegenen Insel mit hellem Sandstrand/g, 'Stop at a remote island with bright sandy beach')
      .replace(/Hier haben Sie ausreichend Zeit zum Schwimmen, Sonnenbaden oder Entspannen/g, 'Here you have plenty of time for swimming, sunbathing or relaxing')
      .replace(/Durch die private Organisation der Tour vermeiden Sie Menschenansammlungen und genießen die Natur in ruhiger Atmosphäre/g, 'Thanks to the private organization you avoid crowds and enjoy nature in a quiet atmosphere')
      .replace(/Auf der Rückfahrt erleben Sie den Sonnenuntergang über dem Roten Meer/g, 'On the way back you experience the sunset over the Red Sea')
      .replace(/Die besondere Lichtstimmung auf dem Wasser macht diesen Moment zu einem stimmungsvollen Abschluss des Ausflugs/g, 'The special play of light on the water makes this moment a atmospheric conclusion to the trip')
      .replace(/Pünktliche Abholung direkt von Ihrem Hotel im klimatisierten Fahrzeug/g, 'Punctual pickup directly from your hotel in an air-conditioned vehicle')
      .replace(/Persönliche Begrüßung, Ausrüstung, kurze Einweisung – danach beginnt Ihr Abenteuer/g, 'Personal welcome, equipment, short briefing – then your adventure begins')
      .replace(/Fahrt zu den besten Delfinplätzen/g, 'Boat ride to the best dolphin spots')
      .replace(/Mit etwas Glück beobachten Sie Delfine in freier Wildbahn und können/g, 'With luck you will spot dolphins in the wild and can')
      .replace(/sofern die Bedingungen es erlauben/g, 'if conditions permit')
      .replace(/gemeinsam mit ihnen schwimmen/g, 'swim with them')
      .replace(/Hinweis: Delfine sind Wildtiere. Eine Sichtung kann nicht garantiert werden, die Erfolgsquote ist jedoch sehr hoch/g, 'Note: Dolphins are wild animals. Sightings cannot be guaranteed, but the success rate is very high')
      .replace(/Zwei Stopps an farbenprächtigen Riffen mit beeindruckender Unterwasserwelt/g, 'Two stops at colorful reefs with impressive underwater world')
      .replace(/Entdecken Sie ein faszinierendes Schiffswrack mit einer beeindruckenden Unterwasserwelt voller Fische und Korallen/g, 'Discover a fascinating shipwreck with an impressive underwater world full of fish and coral')
      .replace(/Gegen 12:00 Uhr Rückkehr und Transfer ins Hotel/g, 'Return at around 12:00 PM and transfer to hotel')
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
      .replace(/Ihr[\w\s]+Reiseleiter holt Sie/g, 'Your guide picks you up')
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
      .replace(/kurze Einweisung/g, 'short briefing')
      .replace(/Kurze Einführung/g, 'Short introduction')
      .replace(/Sicherheitseinweisung/g, 'safety briefing')
      .replace(/Start der Bootstour/g, 'Start of the boat tour')
      .replace(/wird gestellt/g, 'is provided')
      .replace(/Transfer zum Hafen/g, 'Transfer to harbor')
      .replace(/Rückkehr zum Hafen/g, 'Return to harbor')
      .replace(/Fahrt mit einem modernen Ausflugsboot oder einer komfortablen Yacht/g, 'Ride on a modern excursion boat or a comfortable yacht')
      .replace(/Richtung Orange Bay Island/g, 'towards Orange Bay Island')
      .replace(/Softdrinks sind an Bord inklusive/g, 'Soft drinks are included on board')
      .replace(/Zwei geführte Schnorchelstopps/g, 'Two guided snorkeling stops')
      .replace(/an sorgfältig ausgewählten Riffen mit hervorragender Sicht/g, 'at carefully selected reefs with excellent visibility')
      .replace(/Komplette Schnorchelausrüstung wird gestellt, professionelle Betreuung inklusive/g, 'Complete snorkeling equipment is provided, professional guidance included')
      .replace(/Mehrere Stunden Freizeit auf der Insel/g, 'Several hours of free time on the island')
      .replace(/Baden, Entspannen, Sonnen, Fotografieren und Genießen der einzigartigen Atmosphäre/g, 'Swimming, relaxing, sunbathing, taking photos and enjoying the unique atmosphere')
      .replace(/Banana Boat und Sofa Boat unter professioneller Aufsicht und mit moderner Sicherheitsausrüstung/g, 'Banana boat and sofa boat under professional supervision with modern safety equipment')
      .replace(/Frisch zubereitetes Mittagessen mit alkoholfreien Getränken an Bord oder auf der Insel/g, 'Freshly prepared lunch with non-alcoholic drinks on board or on the island')
      .replace(/Rückfahrt zum Hafen und Transfer zurück ins Hotel/g, 'Return to harbor and transfer back to hotel');
  }
  if (locale === 'fr') {
    return text
      .replace(/Abholung vom Hotel/g, 'Prise en charge à l\'hôtel')
      .replace(/Abholung direkt von Ihrem Hotel/g, 'Prise en charge directe à votre hôtel')
      .replace(/Abholung in Hurghada/g, 'Prise en charge à Hurghada')
      .replace(/Abholung von Ihrem Hotel in Hurghada/g, 'Prise en charge à votre hôtel à Hurghada')
      .replace(/Wir holen Sie bequem mit klimatisiertem Fahrzeug direkt von Ihrem Hotel in Hurghada oder Umgebung ab/g, 'Nous venons vous chercher confortablement en véhicule climatisé directement à votre hôtel à Hurghada ou ses environs')
      .replace(/Tauch.*ein in das farbenfrohe Markttreiben/g, 'Plongez dans l\'ambiance colorée du marché')
      .replace(/erleben Sie die authentische Atmosphäre eines ägyptischen Basars/g, 'vivez l\'atmosphère authentique d\'un bazar égyptien')
      .replace(/Entdecken Sie traditionelle Produkte/g, 'Découvrez des produits traditionnels')
      .replace(/handgemachte Lederwaren, Parfümöle/g, 'articles en cuir faits main, huiles de parfum')
      .replace(/Papyrusrollen, Gewürze, Schmuck und vieles mehr/g, 'papyrus, épices, bijoux et bien plus')
      .replace(/Nach einer erlebnisreichen Shoppingtour bringen wir Sie sicher und bequem zurück in Ihr Hotel/g, 'Après une excursion shopping mouvementée, nous vous ramenons à votre hôtel en toute sécurité')
      .replace(/Rotes Meer zählt zu den schönsten Schnorchelgebieten weltweit/g, 'La mer Rouge est l\'une des plus belles zones de snorkeling au monde')
      .replace(/Entdecken Sie farbenreiche Korallenriffe/g, 'Découvrez des récifs coralliens colorés')
      .replace(/tropische Rifffische, Schildkröten, Rochen/g, 'poissons tropicaux, tortues, raies')
      .replace(/Napoleonfische bei klarem, warmem Wasser mit sehr guter Sicht/g, 'poissons Napoléon dans une eau claire et chaude avec une excellente visibilité')
      .replace(/Aufenthalt an einer abgelegenen Insel/g, 'Arrêt sur une île isolée')
      .replace(/hellem Sandstrand/g, 'plage de sable clair')
      .replace(/Hier haben Sie ausreichend Zeit/g, 'Vous avez amplement le temps')
      .replace(/Schwimmen, Sonnenbaden oder Entspannen/g, 'nager, bronzer ou vous détendre')
      .replace(/Durch die private Organisation/g, 'Grâce à l\'organisation privée')
      .replace(/vermeiden Sie Menschenansammlungen/g, 'vous évitez les foules')
      .replace(/genießen die Natur in ruhiger Atmosphäre/g, 'profitez de la nature dans une atmosphère calme')
      .replace(/Auf der Rückfahrt erleben Sie den Sonnenuntergang/g, 'Au retour, admirez le coucher de soleil')
      .replace(/besondere Lichtstimmung auf dem Wasser/g, 'lumière particulière sur l\'eau')
      .replace(/stimmungsvollen Abschluss des Ausflugs/g, 'conclusion pleine d\'atmosphère')
      .replace(/Pünktliche Abholung direkt von Ihrem Hotel im klimatisierten Fahrzeug/g, 'Prise en charge ponctuelle à votre hôtel en véhicule climatisé')
      .replace(/Persönliche Begrüßung, Ausrüstung, kurze Einweisung – danach beginnt Ihr Abenteuer/g, 'Accueil personnalisé, équipement, brève instruction – puis votre aventure commence')
      .replace(/Fahrt zu den besten Delfinplätzen/g, 'Trajet vers les meilleurs spots de dauphins')
      .replace(/Mit etwas Glück beobachten Sie Delfine/g, 'Avec un peu de chance, vous observerez des dauphins')
      .replace(/sofern die Bedingungen es erlauben/g, 'si les conditions le permettent')
      .replace(/gemeinsam mit ihnen schwimmen/g, 'nager avec eux')
      .replace(/Delfine sind Wildtiere. Eine Sichtung kann nicht garantiert werden, die Erfolgsquote ist jedoch sehr hoch/g, 'Les dauphins sont des animaux sauvages. Une observation ne peut être garantie, mais le taux de réussite est très élevé')
      .replace(/Zwei Stopps an farbenprächtigen Riffen/g, 'Deux arrêts sur des récifs colorés')
      .replace(/beeindruckender Unterwasserwelt/g, 'monde sous-marin impressionnant')
      .replace(/Entdecken Sie ein faszinierendes Schiffswrack/g, 'Découvrez une épave fascinante')
      .replace(/einer beeindruckenden Unterwasserwelt voller Fische und Korallen/g, 'un monde sous-marin impressionnant plein de poissons et de coraux')
      .replace(/Gegen 12:00 Uhr Rückkehr und Transfer ins Hotel/g, 'Retour vers 12h00 et transfert à l\'hôtel')
      .replace(/in einem privaten, klimatisierten Fahrzeug/g, 'dans un véhicule privé climatisé')
      .replace(/klimatisierten Privatfahrzeug/g, 'véhicule privé climatisé')
      .replace(/klimatisierten Fahrzeug/g, 'véhicule climatisé')
      .replace(/klimatisiertem Fahrzeug/g, 'véhicule climatisé')
      .replace(/klimatisierten Minibus/g, 'minibus climatisé')
      .replace(/Bequemer Transfer/g, 'Transfert confortable')
      .replace(/im klimatisierten Fahrzeug/g, 'en véhicule climatisé')
      .replace(/direkt von Ihrem Hotel/g, 'directement de votre hôtel')
      .replace(/ca\. /g, 'env. ')
      .replace(/Gesamt ca\./g, 'Total env.')
      .replace(/etwa /g, 'environ ')
      .replace(/Ihr[\w\s]+Reiseleiter holt Sie/g, 'Votre guide vous prend en charge')
      .replace(/ und bringt Sie sicher/g, ' et vous emmène en sécurité')
      .replace(/Genießen Sie den weiten Blick/g, 'Profitez de la vue panoramique')
      .replace(/Spüren Sie die Meeresbrise/g, 'Sentez la brise marine')
      .replace(/freuen Sie sich auf unvergessliche Momente/g, 'réjouissez-vous de moments inoubliables')
      .replace(/Erkunden Sie die farbenfrohe Unterwasserwelt/g, 'Explorez le monde sous-marin coloré')
      .replace(/Schnorchelausrüstung wird bereitgestellt/g, 'L\'équipement de snorkeling est fourni')
      .replace(/Entspannen Sie an den weißen Sandstränden/g, 'Détendez-vous sur les plages de sable blanc')
      .replace(/schwimmen Sie im kristallklaren Wasser/g, 'nagez dans l\'eau cristalline')
      .replace(/schnorcheln Sie direkt vom Strand aus/g, 'snorkelez directement depuis la plage')
      .replace(/Liegen und Sonnenschirme stehen für Sie bereit/g, 'Transats et parasols sont à votre disposition')
      .replace(/Nach einem ereignisreichen Tag geht es zurück/g, 'Après une journée bien remplie, retour')
      .replace(/mit vielen neuen Eindrücken und glücklichen Erinnerungen/g, 'avec de nombreuses nouvelles impressions et des souvenirs heureux')
      .replace(/Persönliche Begrüßung/g, 'Accueil personnalisé')
      .replace(/kurze Einweisung/g, 'brève instruction')
      .replace(/Kurze Einführung/g, 'Brève introduction')
      .replace(/Sicherheitseinweisung/g, 'consignes de sécurité')
      .replace(/Start der Bootstour/g, 'Début de l\'excursion en bateau')
      .replace(/wird gestellt/g, 'est fourni')
      .replace(/Transfer zum Hafen/g, 'Transfert au port')
      .replace(/Rückkehr zum Hafen/g, 'Retour au port')
      .replace(/Fahrt mit einem modernen Ausflugsboot oder einer komfortablen Yacht/g, 'Trajet en bateau d\'excursion moderne ou en yacht confortable')
      .replace(/Richtung Orange Bay Island/g, 'vers Orange Bay Island')
      .replace(/Softdrinks sind an Bord inklusive/g, 'Les boissons gazeuses sont incluses à bord')
      .replace(/Zwei geführte Schnorchelstopps/g, 'Deux arrêts snorkeling guidés')
      .replace(/an sorgfältig ausgewählten Riffen mit hervorragender Sicht/g, 'sur des récifs soigneusement sélectionnés avec une excellente visibilité')
      .replace(/Komplette Schnorchelausrüstung wird gestellt, professionelle Betreuung inklusive/g, 'L\'équipement complet de snorkeling est fourni, encadrement professionnel inclus')
      .replace(/Mehrere Stunden Freizeit auf der Insel/g, 'Plusieurs heures de temps libre sur l\'île')
      .replace(/Baden, Entspannen, Sonnen, Fotografieren/g, 'Baignade, détente, bain de soleil, photos')
      .replace(/Genießen der einzigartigen Atmosphäre/g, 'Profiter de l\'atmosphère unique')
      .replace(/Banana Boat und Sofa Boat/g, 'Banana boat et sofa boat')
      .replace(/unter professioneller Aufsicht und mit moderner Sicherheitsausrüstung/g, 'sous supervision professionnelle avec équipement de sécurité moderne')
      .replace(/Frisch zubereitetes Mittagessen/g, 'Déjeuner fraîchement préparé')
      .replace(/alkoholfreien Getränken/g, 'boissons non alcoolisées')
      .replace(/an Bord oder auf der Insel/g, 'à bord ou sur l\'île')
      .replace(/Rückfahrt zum Hafen und Transfer zurück ins Hotel/g, 'Retour au port et transfert retour à l\'hôtel');
  }
  if (locale === 'ru') {
    return text
      .replace(/Abholung vom Hotel/g, 'Забор из отеля')
      .replace(/Abholung direkt von Ihrem Hotel/g, 'Забор прямо из вашего отеля')
      .replace(/Abholung in Hurghada/g, 'Забор в Хургаде')
      .replace(/Abholung von Ihrem Hotel in Hurghada/g, 'Забор из вашего отеля в Хургаде')
      .replace(/Wir holen Sie bequem/g, 'Мы заберём вас с комфортом')
      .replace(/Tauch.*ein in/g, 'Окунитесь в')
      .replace(/erleben Sie die authentische Atmosphäre/g, 'прочувствуйте аутентичную атмосферу')
      .replace(/Entdecken Sie traditionelle Produkte/g, 'Откройте для себя традиционные продукты')
      .replace(/handgemachte Lederwaren, Parfümöle/g, 'кожаные изделия ручной работы, парфюмерные масла')
      .replace(/Papyrusrollen, Gewürze, Schmuck und vieles mehr/g, 'папирус, специи, украшения и многое другое')
      .replace(/Nach einer erlebnisreichen Shoppingtour/g, 'После насыщенной шопинг-экскурсии')
      .replace(/Rotes Meer zählt zu den schönsten Schnorchelgebieten weltweit/g, 'Красное море — одна из красивейших зон для снорклинга в мире')
      .replace(/Entdecken Sie farbenreiche Korallenriffe/g, 'Откройте для себя красочные коралловые рифы')
      .replace(/tropische Rifffische, Schildkröten, Rochen/g, 'тропических рыб, черепах, скатов')
      .replace(/Napoleonfische bei klarem, warmem Wasser mit sehr guter Sicht/g, 'рыб-наполеонов в чистой тёплой воде с отличной видимостью')
      .replace(/Aufenthalt an einer abgelegenen Insel/g, 'Остановка на отдалённом острове')
      .replace(/hellem Sandstrand/g, 'светлым песчаным пляжем')
      .replace(/Hier haben Sie ausreichend Zeit/g, 'У вас достаточно времени')
      .replace(/Schwimmen, Sonnenbaden oder Entspannen/g, 'плавать, загорать или отдыхать')
      .replace(/Durch die private Organisation/g, 'Благодаря частной организации')
      .replace(/vermeiden Sie Menschenansammlungen/g, 'вы избегаете скоплений людей')
      .replace(/genießen die Natur in ruhiger Atmosphäre/g, 'наслаждаетесь природой в спокойной атмосфере')
      .replace(/Auf der Rückfahrt erleben Sie den Sonnenuntergang/g, 'На обратном пути вы увидите закат')
      .replace(/besondere Lichtstimmung auf dem Wasser/g, 'особая игра света на воде')
      .replace(/stimmungsvollen Abschluss des Ausflugs/g, 'атмосферным завершением поездки')
      .replace(/Pünktliche Abholung/g, 'Пунктуальный забор')
      .replace(/Persönliche Begrüßung/g, 'Персональное приветствие')
      .replace(/kurze Einweisung – danach beginnt Ihr Abenteuer/g, 'краткий инструктаж — затем начинается ваше приключение')
      .replace(/Fahrt zu den besten Delfinplätzen/g, 'Поездка к лучшим местам обитания дельфинов')
      .replace(/Mit etwas Glück beobachten Sie Delfine/g, 'При удаче вы увидите дельфинов')
      .replace(/sofern die Bedingungen es erlauben/g, 'если позволят условия')
      .replace(/gemeinsam mit ihnen schwimmen/g, 'поплавать с ними')
      .replace(/Delfine sind Wildtiere/g, 'Дельфины — дикие животные')
      .replace(/Zwei Stopps an farbenprächtigen Riffen/g, 'Две остановки у красочных рифов')
      .replace(/beeindruckender Unterwasserwelt/g, 'впечатляющим подводным миром')
      .replace(/Entdecken Sie ein faszinierendes Schiffswrack/g, 'Откройте для себя затонувший корабль')
      .replace(/einer beeindruckenden Unterwasserwelt voller Fische und Korallen/g, 'впечатляющим подводным миром, полным рыб и кораллов')
      .replace(/Gegen 12:00 Uhr Rückkehr und Transfer ins Hotel/g, 'Возвращение около 12:00 и трансфер в отель')
      .replace(/in einem privaten, klimatisierten Fahrzeug/g, 'в частном автомобиле с кондиционером')
      .replace(/klimatisierten Privatfahrzeug/g, 'частном автомобиле с кондиционером')
      .replace(/klimatisierten Fahrzeug/g, 'автомобиле с кондиционером')
      .replace(/klimatisiertem Fahrzeug/g, 'автомобиле с кондиционером')
      .replace(/klimatisierten Minibus/g, 'микроавтобусе с кондиционером')
      .replace(/Bequemer Transfer/g, 'Комфортабельный трансфер')
      .replace(/im klimatisierten Fahrzeug/g, 'в автомобиле с кондиционером')
      .replace(/direkt von Ihrem Hotel/g, 'прямо из вашего отеля')
      .replace(/ca\. /g, 'ок. ')
      .replace(/Gesamt ca\./g, 'Всего ок.')
      .replace(/etwa /g, 'примерно ')
      .replace(/Ihr[\w\s]+Reiseleiter holt Sie/g, 'Ваш гид заберёт вас')
      .replace(/ und bringt Sie sicher/g, ' и доставит вас')
      .replace(/Genießen Sie den weiten Blick/g, 'Наслаждайтесь широким видом')
      .replace(/Spüren Sie die Meeresbrise/g, 'Почувствуйте морской бриз')
      .replace(/freuen Sie sich auf unvergessliche Momente/g, 'радуйтесь незабываемым моментам')
      .replace(/Erkunden Sie die farbenfrohe Unterwasserwelt/g, 'Исследуйте красочный подводный мир')
      .replace(/Schnorchelausrüstung wird bereitgestellt/g, 'Снаряжение для снорклинга предоставляется')
      .replace(/Entspannen Sie an den weißen Sandstränden/g, 'Отдыхайте на белых песчаных пляжах')
      .replace(/schwimmen Sie im kristallklaren Wasser/g, 'купайтесь в кристально чистой воде')
      .replace(/schnorcheln Sie direkt vom Strand aus/g, 'занимайтесь снорклингом прямо с пляжа')
      .replace(/Liegen und Sonnenschirme stehen für Sie bereit/g, 'Шезлонги и зонты готовы для вас');
  }
  if (locale === 'hu') {
    return text
      .replace(/Abholung vom Hotel/g, 'Szállítás a szállodából')
      .replace(/Abholung direkt von Ihrem Hotel/g, 'Szállítás közvetlenül a szállodából')
      .replace(/Abholung in Hurghada/g, 'Szállítás Hurghadában')
      .replace(/Abholung von Ihrem Hotel in Hurghada/g, 'Szállítás a hurghadai szállodából')
      .replace(/Wir holen Sie bequem/g, 'Kényelmesen felvesszük Önt')
      .replace(/ca\. /g, 'kb. ')
      .replace(/Gesamt ca\./g, 'Összesen kb.')
      .replace(/etwa /g, 'körülbelül ')
      .replace(/in einem privaten, klimatisierten Fahrzeug/g, 'privát, légkondicionált járművel')
      .replace(/klimatisierten Privatfahrzeug/g, 'légkondicionált privát járművel')
      .replace(/klimatisierten Fahrzeug/g, 'légkondicionált járművel')
      .replace(/klimatisiertem Fahrzeug/g, 'légkondicionált járművel')
      .replace(/klimatisierten Minibus/g, 'légkondicionált kisbusszal')
      .replace(/Bequemer Transfer/g, 'Kényelmes transzfer')
      .replace(/im klimatisierten Fahrzeug/g, 'légkondicionált járművel')
      .replace(/direkt von Ihrem Hotel/g, 'közvetlenül a szállodájából')
      .replace(/Pünktliche Abholung/g, 'Pontos felvétel')
      .replace(/Persönliche Begrüßung/g, 'Személyes üdvözlés')
      .replace(/Ihr[\w\s]+Reiseleiter holt Sie/g, 'Idegenvezetője felveszi Önt');
  }
  if (locale === 'ar') {
    return text
      .replace(/Abholung vom Hotel/g, 'الاستلام من الفندق')
      .replace(/Abholung direkt von Ihrem Hotel/g, 'الاستلام مباشرة من فندقك')
      .replace(/Abholung in Hurghada/g, 'الاستلام في الغردقة')
      .replace(/Abholung von Ihrem Hotel in Hurghada/g, 'الاستلام من فندقك في الغردقة')
      .replace(/Wir holen Sie bequem/g, 'نستقبلك بكل راحة')
      .replace(/ca\. /g, 'تقريباً ')
      .replace(/Gesamt ca\./g, 'المجموع تقريباً')
      .replace(/etwa /g, 'حوالي ')
      .replace(/in einem privaten, klimatisierten Fahrzeug/g, 'في مركبة خاصة مكيفة')
      .replace(/klimatisierten Privatfahrzeug/g, 'مركبة خاصة مكيفة')
      .replace(/klimatisierten Fahrzeug/g, 'مركبة مكيفة')
      .replace(/klimatisiertem Fahrzeug/g, 'مركبة مكيفة')
      .replace(/klimatisierten Minibus/g, 'حافلة صغيرة مكيفة')
      .replace(/Bequemer Transfer/g, 'نقل مريح')
      .replace(/im klimatisierten Fahrzeug/g, 'بمركبة مكيفة')
      .replace(/direkt von Ihrem Hotel/g, 'مباشرة من فندقك')
      .replace(/Pünktliche Abholung/g, 'استلام دقيق')
      .replace(/Persönliche Begrüßung/g, 'ترحيب شخصي')
      .replace(/Ihr[\w\s]+Reiseleiter holt Sie/g, 'مرشدك السياحي يستقبلك')
      .replace(/Abholung/g, 'الاستلام');
  }
  return text; // fallback
}

function translateItinerary(deSteps, locale) {
  return deSteps.map(s => {
    let title = translate(locale, s.title, deSteps);
    let content = translateContent(locale, s.content);
    return { title, content };
  });
}

// ─── GERMAN BASE ITINERARIES (from DB) ───

const germanItineraries = {
  'el-gouna-private-stadtrundfahrt-mit-lagunenfahrt-aussichtsturm': [
    { title: 'Abholung vom Hotel', content: 'Ihr Guide holt Sie zwischen 09:00 und 10:00 Uhr in einem privaten, klimatisierten Fahrzeug ab. Von Hurghada aus erreichen wir El Gouna nach etwa 30 Minuten.' },
    { title: 'Lagunenfahrt durch El Gouna', content: 'Die Tour beginnt mit einer entspannten Bootsfahrt durch die berühmten Lagunen. Sie sehen Luxushotels, Villen & exklusive Wohngebiete, Inseln und Wasserwege, den Yachthafen und architektonische Besonderheiten. Ihr Reiseleiter erzählt Ihnen die Geschichte der Stadt und spannende Details über die Gründerfamilie Sawiris.' },
    { title: 'Downtown El Gouna', content: 'In der Innenstadt erwarten Sie Cafés, Boutiquen, Kunsthandwerk und kleine Plätze. Sie schlendern entspannt und genießen das moderne Flair der Stadt.' },
    { title: 'Kultur & Architektur', content: 'Gemeinsam besuchen wir einige der wichtigsten Sehenswürdigkeiten: koptische Kirche, Große Moschee und Außenstelle der Bibliotheca Alexandrina. Eine ideale Mischung aus Kultur und moderner Stadtplanung.' },
    { title: 'Der Aussichtsturm', content: 'Eines der Highlights der Tour. Von oben sehen Sie das Meer, die Lagunen, die Wüstenberge und die Marina. Ein perfekter Ort für eindrucksvolle Fotos.' },
    { title: 'Abu Tig Marina', content: 'Sie spazieren entlang der gepflegten Promenade, sehen Luxusyachten und genießen die mediterrane Atmosphäre. Wer möchte, kann noch einen Tee oder Kaffee mit Blick auf die Boote trinken (optional).' },
    { title: 'Rückfahrt zum Hotel', content: 'Nach vielen schönen Eindrücken fahren wir zurück nach Hurghada.' },
  ],
  'privater-tagesausflug-ab-hurghada-dendera-abydos-tempel': [
    { title: 'Abholung (04:00–04:30 Uhr)', content: 'Abholung vom Hotel in Hurghada.' },
    { title: 'Fahrt nach Dendera', content: 'Fahrt nach Dendera (ca. 250 km).' },
    { title: 'Besichtigung Hathor-Tempel', content: 'Ca. 2 Stunden Besichtigung des Hathor-Tempels.' },
    { title: 'Weiterfahrt nach Abydos', content: 'Weiterfahrt nach Abydos (ca. 100 km).' },
    { title: 'Mittagessen in Abydos', content: 'Mittagessen in Abydos.' },
    { title: 'Besichtigung Abydos-Tempel', content: 'Ca. 2 Stunden Besichtigung des Abydos-Tempels.' },
    { title: 'Rückfahrt nach Hurghada', content: 'Rückfahrt nach Hurghada. Gesamt ca. 13 Stunden.' },
  ],
  'eintrittskarte-zum-hurghada-grand-aquarium': [
    { title: 'Ankunft am Hurghada Grand Aquarium', content: 'Nach Ihrer Ankunft betreten Sie eines der größten und modernsten Aquarien Ägyptens. Dank Ihres Online-Tickets genießen Sie einen schnellen und unkomplizierten Eintritt ohne lange Wartezeiten.' },
    { title: 'Entdeckung der Unterwasserwelt', content: 'Beginnen Sie Ihre Tour durch mehr als 24 faszinierende Themenbereiche mit exotischen Meeresbewohnern, bunten Korallenriffen und beeindruckenden Großaquarien des Roten Meeres.' },
    { title: 'Unterwassertunnel & Panorama-Bereiche', content: 'Erleben Sie den spektakulären 24 Meter langen Unterwassertunnel und beobachten Sie Haie, Rochen und zahlreiche Fischarten aus nächster Nähe – ein unvergessliches Erlebnis für die ganze Familie.' },
    { title: 'Regenwald & Tierbereiche', content: 'Besuchen Sie die tropische Regenwaldzone sowie den kleinen Zoo mit exotischen Vögeln, Reptilien und weiteren faszinierenden Tieren aus verschiedenen Regionen der Welt.' },
    { title: 'Interaktive Erlebnisse', content: 'Kinder und Erwachsene können das interaktive Streichelbecken entdecken und an den Tierfütterungen sowie spannenden Live-Vorführungen teilnehmen.' },
    { title: 'Freizeit & Fotos', content: 'Nutzen Sie die freie Zeit, um Fotos zu machen, Souvenirs zu kaufen oder die entspannte Atmosphäre des Aquariums zu genießen.' },
    { title: 'Ende des Besuchs', content: 'Nach einem erlebnisreichen Rundgang endet Ihr Besuch im Hurghada Grand Aquarium mit unvergesslichen Eindrücken aus der faszinierenden Unterwasserwelt des Roten Meeres.' },
  ],
  'privater-tagesausflug-von-hurghada-nach-kairo-pyramiden-grand-egyptian-museum': [
    { title: 'Abholung in Hurghada', content: 'Frühmorgens werden Sie direkt von Ihrem Hotel in Hurghada abgeholt. Die Fahrt nach Kairo erfolgt komfortabel in einem modernen, klimatisierten Privatfahrzeug inklusive kostenloser Getränke.' },
    { title: 'Pyramiden von Gizeh', content: 'Nach Ihrer Ankunft in Kairo entdecken Sie die weltberühmten Pyramiden von Cheops, Chephren und Mykerinos sowie die beeindruckende Sphinx und den Taltempel.' },
    { title: 'Grand Egyptian Museum', content: 'Anschließend besuchen Sie das spektakuläre Grand Egyptian Museum – das größte archäologische Museum der Welt mit einzigartigen Schätzen des alten Ägyptens.' },
    { title: 'Mittagessen', content: 'Genießen Sie ein leckeres Mittagessen in einem ausgewählten Restaurant in Kairo. (Getränke zum Mittagessen sind nicht im Preis enthalten).' },
    { title: 'Rückfahrt nach Hurghada', content: 'Nach einem erlebnisreichen Tag bringt Sie Ihr privater Fahrer sicher und entspannt zurück zu Ihrem Hotel in Hurghada.' },
  ],
  'hurghada-shopping-tour-basar-transfer': [
    { title: 'Abholung vom Hotel', content: 'Wir holen Sie bequem mit klimatisiertem Fahrzeug direkt von Ihrem Hotel in Hurghada oder Umgebung ab.' },
    { title: 'Ankunft am Basar', content: 'Tauchen Sie ein in das farbenfrohe Markttreiben und erleben Sie die authentische Atmosphäre eines ägyptischen Basars.' },
    { title: 'Freie Zeit zum Einkaufen', content: 'Entdecken Sie traditionelle Produkte: handgemachte Lederwaren, Parfümöle, Papyrusrollen, Gewürze, Schmuck und vieles mehr.' },
    { title: 'Rückfahrt zum Hotel', content: 'Nach einer erlebnisreichen Shoppingtour bringen wir Sie sicher und bequem zurück in Ihr Hotel.' },
  ],
  'privater-speedboot-ausflug-in-hurghada-schnorcheln-an-korallenriffen-sonnenuntergang': [
    { title: 'Schnorcheln im Roten Meer', content: 'Das Rote Meer zählt zu den schönsten Schnorchelgebieten weltweit. Entdecken Sie farbenreiche Korallenriffe, tropische Rifffische, Schildkröten, Rochen und Napoleonfische bei klarem, warmem Wasser mit sehr guter Sicht.' },
    { title: 'Aufenthalt auf einer ruhigen Insel', content: 'Aufenthalt an einer abgelegenen Insel mit hellem Sandstrand. Hier haben Sie ausreichend Zeit zum Schwimmen, Sonnenbaden oder Entspannen. Durch die private Organisation der Tour vermeiden Sie Menschenansammlungen und genießen die Natur in ruhiger Atmosphäre.' },
    { title: 'Sonnenuntergang auf dem Roten Meer', content: 'Auf der Rückfahrt erleben Sie den Sonnenuntergang über dem Roten Meer. Die besondere Lichtstimmung auf dem Wasser macht diesen Moment zu einem stimmungsvollen Abschluss des Ausflugs.' },
  ],
  'private-delfin-tour-hurghada': [
    { title: 'Hotelabholung', content: 'Pünktliche Abholung direkt von Ihrem Hotel im klimatisierten Fahrzeug.' },
    { title: 'Start an der Marina', content: 'Persönliche Begrüßung, Ausrüstung, kurze Einweisung – danach beginnt Ihr Abenteuer.' },
    { title: 'Delfinbegegnung', content: 'Fahrt zu den besten Delfinplätzen. Mit etwas Glück beobachten Sie Delfine in freier Wildbahn und können – sofern die Bedingungen es erlauben – gemeinsam mit ihnen schwimmen. Hinweis: Delfine sind Wildtiere. Eine Sichtung kann nicht garantiert werden, die Erfolgsquote ist jedoch sehr hoch.' },
    { title: 'Schnorcheln an Korallenriffen', content: 'Zwei Stopps an farbenprächtigen Riffen mit beeindruckender Unterwasserwelt.' },
    { title: 'Schiffswrack', content: 'Entdecken Sie ein faszinierendes Schiffswrack mit einer beeindruckenden Unterwasserwelt voller Fische und Korallen.' },
    { title: 'Rückfahrt', content: 'Gegen 12:00 Uhr Rückkehr und Transfer ins Hotel.' },
  ],
  'private-speedboot-tour-orange-bay-hurghada': [
    { title: 'Hotelabholung', content: 'Abholung in Hurghada, El Gouna, Makadi Bay, Soma Bay oder Safaga.' },
    { title: 'Begrüßung & Sicherheitseinweisung', content: 'Persönliche Begrüßung und Sicherheitseinweisung an Bord des privaten Bootes.' },
    { title: 'Schnorchelgänge', content: '1–2 Schnorchelgänge an den schönsten Riffen des Roten Meeres.' },
    { title: 'Orange Bay oder Magawish Insel', content: 'Fahrt zur Orange Bay oder Magawish Insel mit Freizeit, Mittagessen & Strandaufenthalt.' },
    { title: 'Entspannung', content: 'Entspannung am Strand oder auf dem Boot.' },
    { title: 'Rückfahrt', content: 'Rückfahrt zum Hafen & Transfer zum Hotel.' },
  ],
  'eden-island-schnorchelausflug-hurghada': [
    { title: 'Abholung vom Hotel', content: 'Ihr Tag beginnt zwischen 7:30 und 8:00 Uhr mit dem komfortablen Hoteltransfer zum Hafen von Hurghada.' },
    { title: 'Bootsfahrt zu den besten Schnorchelspots', content: 'Nach der Ausgabe Ihrer Schnorchelausrüstung startet die 40-minütige Bootsfahrt zu den faszinierendsten Riffen rund um Eden Island. Hier erwarten Sie bunte Korallenriffe und tropische Fische – ein Paradies für Schnorchler.' },
    { title: 'Schnorcheln und Strandzeit', content: 'Verbringen Sie mehrere Stunden am Eden Island Beach, schwimmen Sie im türkisfarbenen Wasser oder entspannen Sie am Strand.' },
    { title: 'Mittagessen während des Ausflugs', content: 'Ein reichhaltiges Buffet mit lokalen und internationalen Speisen erwartet Sie während des Ausflugs.' },
    { title: 'Entspannung und Rückfahrt', content: 'Nutzen Sie die verbleibende Zeit zum Schwimmen, Schnorcheln oder Entspannen am Strand, bevor Sie am Nachmittag mit dem Boot zurück zum Hafen fahren und anschließend zu Ihrem Hotel gebracht werden.' },
  ],
  'orange-bay-insel-schnorchelausflug-hurghada': [
    { title: 'Hotelabholung in Hurghada', content: 'Abholung direkt von Ihrem Hotel in einem privaten, klimatisierten Fahrzeug und Transfer zum Hafen.' },
    { title: 'Bootsfahrt im Roten Meer', content: 'Fahrt mit einem modernen Ausflugsboot oder einer komfortablen Yacht Richtung Orange Bay Island. Softdrinks sind an Bord inklusive.' },
    { title: 'Schnorcheln an zwei Korallenriffen', content: 'Zwei geführte Schnorchelstopps an sorgfältig ausgewählten Riffen mit hervorragender Sicht. Komplette Schnorchelausrüstung wird gestellt, professionelle Betreuung inklusive.' },
    { title: 'Aufenthalt auf Orange Bay Island', content: 'Mehrere Stunden Freizeit auf der Insel zum Baden, Entspannen, Sonnen, Fotografieren und Genießen der einzigartigen Atmosphäre.' },
    { title: 'Wassersportaktivitäten', content: 'Banana Boat und Sofa Boat unter professioneller Aufsicht und mit moderner Sicherheitsausrüstung.' },
    { title: 'Mittagessen', content: 'Frisch zubereitetes Mittagessen mit alkoholfreien Getränken an Bord oder auf der Insel.' },
    { title: 'Rückfahrt nach Hurghada', content: 'Rückfahrt zum Hafen und Transfer zurück ins Hotel.' },
  ],
  'glasbodenboot-hurghada-mit-schnorcheln': [
    { title: 'Abholung vom Hotel', content: 'Abholung von Ihrem Hotel in Hurghada im klimatisierten Fahrzeug.' },
    { title: 'Transfer zum Hafen & Einschiffung', content: 'Begrüßung, kurze Einweisung und Start der Bootstour.' },
    { title: 'Glasbodenboot-Fahrt', content: 'Fahrt über die Korallenriffe mit direktem Blick in die Unterwasserwelt.' },
    { title: 'Schnorchelstopp (30 Minuten)', content: 'Geführtes Schnorcheln an einem ruhigen Riff.' },
    { title: 'Entspannung an Bord', content: 'Getränke genießen und Fotos machen.' },
    { title: 'Rückfahrt & Hoteltransfer', content: 'Rückkehr zum Hafen und Transfer zurück zu Ihrem Hotel.' },
  ],
  'quad-tour-hurghada-kamelritt': [
    { title: 'Abholung vom Hotel', content: 'Bequemer Transfer von Ihrer Unterkunft in Hurghada.' },
    { title: 'Einweisung & Start', content: 'Kurze Einführung – danach direkt auf das Quad.' },
    { title: 'Quad Safari durch die Wüste', content: 'Fahren Sie über Sanddünen und erleben Sie echtes Offroad-Feeling.' },
    { title: 'Beduinendorf & Tee', content: 'Einblick in die Kultur der Wüste inklusive traditionellem Tee.' },
    { title: 'Kamelritt', content: 'Kurzes, authentisches Erlebnis für Fotos & Eindrücke.' },
    { title: 'Rücktransfer zum Hotel', content: 'Entspannt zurück nach Ihrer Tour.' },
  ],
  'naechtliche-stadtrundfahrt-durch-hurghada-private-tour': [
    { title: '19:00 Uhr Abholung vom Hotel', content: 'Abholung direkt von Ihrem Hotel.' },
    { title: 'Spaziergang durch die Marina', content: 'Spaziergang durch die Marina.' },
    { title: 'Fischmarkt & Große Moschee', content: 'Besuch des Fischmarktes und der Großen Moschee.' },
    { title: 'Obst- und Gemüsemarkt', content: 'Weiterfahrt zum Obst- und Gemüsemarkt.' },
    { title: 'Pause im ägyptischen Café', content: 'Pause im ägyptischen Café.' },
    { title: '22:00 Uhr Rückkehr zum Hotel', content: 'Rückkehr zum Hotel.' },
  ],
  'mini-egypt-park-hurghada': [
    { title: 'Abholung vom Hotel', content: 'Abholung vom Hotel in Hurghada mit komfortablem, klimatisiertem Minibus.' },
    { title: 'Ankunft im Mini Egypt Park', content: 'Ankunft im Mini Egypt Park – dein persönlicher Guide begrüßt dich.' },
    { title: 'Geführte Tour', content: 'Geführte Tour durch Ägyptens Miniaturwunder: Die Pyramiden von Gizeh & die Sphinx, Der Tempel von Abu Simbel & der Assuan-Staudamm, Die beeindruckenden Tempel von Luxor mit dem berühmten Karnak-Tempel, Das Ägyptische Museum in Kairo, Alexandria mit Stanley-Brücke & Montazah-Palast.' },
    { title: 'Freizeit im Park', content: 'Freizeit im Park – Zeit für Fotos, Staunen und kleine Entdeckungen.' },
    { title: 'Rücktransfer zum Hotel', content: 'Rücktransfer zum Hotel – mit unvergesslichen Eindrücken im Gepäck.' },
  ],
  'luxor-tagesausflug-heissluftballon-hoteluebernachtung': [
    { day: 'Tag 1 – Anreise & Hotelfreude', title: '17:00 Uhr – Abholung vom Hotel', content: 'Start von Hurghada, Marsa Alam oder El Quseir in einem klimatisierten Privatfahrzeug. Nach ca. 3,5 Stunden erreichen Sie Luxor.' },
    { day: 'Tag 1 – Anreise & Hotelfreude', title: 'Ankunft, Abendessen & Check-in', content: 'Sie genießen ein entspanntes Abendessen und beziehen Ihr ausgewähltes Hotel, bevor die Nacht zur Vorbereitung auf das morgendliche Abenteuer ruht.' },
    { day: 'Tag 2 – Ballonfahrt, Tempel & Nil', title: 'Sonnenaufgang über Luxor – Heißluftballonfahrt', content: 'Gegen 4:00 Uhr startet Ihre Heißluftballonfahrt. Während die Sonne langsam das Niltal färbt, schweben Sie über Tempel, Felder und den Westjordan des antiken Theben. Ein Moment, der Ihrem Reisealbum Glanz verleiht.' },
    { day: 'Tag 2 – Ballonfahrt, Tempel & Nil', title: 'Tal der Könige – drei Grabkammern', content: 'Erkunden Sie die Gräber der Pharaonen, deren Wandmalereien seit Jahrtausenden leuchten.' },
    { day: 'Tag 2 – Ballonfahrt, Tempel & Nil', title: 'Hatschepsut-Tempel', content: 'Ein Tempel wie aus einem Fels geschnitten. Würde, Geschichte, klare Linien.' },
    { day: 'Tag 2 – Ballonfahrt, Tempel & Nil', title: 'Memnon-Kolosse – Fotostopp', content: 'Die monumentalen Wächterfiguren des Amenophis III. erwarten Sie bereits.' },
    { day: 'Tag 2 – Ballonfahrt, Tempel & Nil', title: 'Mittagessen am Nil', content: 'Ein reichhaltiges ägyptisches Menü bietet Stärkung für den weiteren Tag.' },
    { day: 'Tag 2 – Ballonfahrt, Tempel & Nil', title: 'Karnak-Tempel', content: 'Zum Finale Ihres Ausflugs entdecken Sie den größten Tempelkomplex Ägyptens. Tempel, gewaltige Säulen, Jahrtausende Kultur – ein würdiger Abschluss.' },
    { day: 'Tag 2 – Ballonfahrt, Tempel & Nil', title: 'Rückfahrt nach Hurghada', content: 'Ankunft gegen 20:00 Uhr in Ihrem Hotel.' },
  ],
  'kloester-st-antonius-st-paulus': [
    { title: 'Abholung (04:00 Uhr)', content: 'Abholung direkt von Ihrem Hotel in Hurghada.' },
    { title: 'Fahrt zum Kloster St. Antonius', content: 'Fahrt durch die östliche Wüste zum Kloster St. Antonius.' },
    { title: 'Besichtigung Kloster St. Antonius', content: 'Besichtigung der historischen Kirchen, Fresken und Manuskripte.' },
    { title: 'Höhle des Heiligen Antonius', content: 'Aufstieg zur Höhle des Heiligen Antonius (optional).' },
    { title: 'Weiterfahrt zum Kloster St. Paulus', content: 'Weiterfahrt zum Kloster St. Paulus.' },
    { title: 'Besichtigung Kloster St. Paulus', content: 'Besichtigung des Klosters und der Kirche des Heiligen Paulus.' },
    { title: 'Mittagessen', content: 'Mittagessen in einem lokalen Restaurant.' },
    { title: 'Rückfahrt nach Hurghada', content: 'Rückfahrt nach Hurghada. Ankunft: ca. 17:00 Uhr.' },
  ],
  'dendera-halbtagesausflug-ab-hurghada-der-authentische-besuch-im-hathor-tempel': [
    { title: 'Abholung & Fahrt nach Dendera', content: 'Abholung um ca. 06:00 Uhr direkt von Ihrem Hotel in Hurghada. Fahrt nach Dendera (ca. 230 km, klimatisiertes Fahrzeug).' },
    { title: 'Ankunft am Tempel', content: 'Ankunft am Tempel & geführte Tour mit Ägyptologen.' },
    { title: 'Hathor-Säulenhalle & Decke', content: 'Besichtigung der berühmten Hathor-Säulenhalle und der astronomischen Decke.' },
    { title: 'Weitere Bereiche', content: 'Besuch ausgewählter Bereiche wie Mamisi, Heiliger See und Tempelanlage.' },
    { title: 'Individuelle Besichtigung', content: 'Zeit für individuelle Besichtigung und Fotos.' },
    { title: 'Rückkehr', content: 'Rückkehr am frühen Nachmittag.' },
  ],
  'kairo-mit-flug-ab-hurghada-pyramiden-museum': [
    { title: '04:00 Uhr', content: 'Abholung vom Hotel in Hurghada' },
    { title: '06:00 Uhr', content: 'Flug nach Kairo' },
    { title: '06:50 Uhr', content: 'Ankunft in Kairo & Begrüßung durch Ihren Guide' },
    { title: '08:00–19:00 Uhr', content: 'Pyramiden, Sphinx, Museum, Mittagessen' },
    { title: '19:00 Uhr', content: 'Rückflug nach Hurghada' },
    { title: '19:45 Uhr', content: 'Ankunft & Transfer zum Hotel' },
  ],
  'makadi-water-park-hurghada-mittagessen-transfer': [
    { title: 'Hotelabholung', content: 'Abholung direkt vom Hotel in Hurghada oder Makadi Bay.' },
    { title: 'Transfer', content: 'Bequemer Transfer im klimatisierten Fahrzeug.' },
    { title: 'Makadi Water Park', content: 'Ganztägiger Aufenthalt im Makadi Water Park. Bevorzugter Einlass mit organisiertem Zugang. Nutzung aller für Alter und Größe zugelassenen Attraktionen.' },
    { title: 'Mittagessen & Getränke', content: 'Mittagessen & Getränke inklusive.' },
    { title: 'Rücktransfer', content: 'Rücktransfer zum Hotel am Nachmittag.' },
  ],
  'mahmya-insel-ausflug-hurghada': [
    { title: 'Abholung & Transfer zum Hafen', content: 'Am frühen Morgen werden Sie direkt von Ihrem Hotel abgeholt und zum Hafen gebracht. Dort begrüßt Sie die freundliche Crew an Bord Ihres komfortablen Bootes.' },
    { title: 'Schnorchelfahrt', content: 'Nach der Ausgabe Ihrer Schnorchelausrüstung und einer kurzen Einweisung beginnt die Fahrt über das tiefblaue Rote Meer. Schon bald erreichen Sie die ersten Schnorchelplätze mit bunten Fischen, Korallenformationen und mit etwas Glück sogar Meeresschildkröten oder Delfine.' },
    { title: 'Mahmya Insel & Mittagessen', content: 'Nach der Ankunft auf der Mahmya Insel genießen Sie die traumhafte Kulisse und ein frisch zubereitetes Mittagsbuffet in einem Restaurant direkt am Meer. Der restliche Tag gehört ganz Ihnen: Entspannen, Schwimmen, die Insel erkunden oder die Ruhe und Sonne genießen.' },
    { title: 'Rückfahrt zum Hotel', content: 'Am Nachmittag kehren Sie entspannt zum Hafen zurück und werden zu Ihrem Hotel gebracht.' },
  ],
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

// ─── RUN ───

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
