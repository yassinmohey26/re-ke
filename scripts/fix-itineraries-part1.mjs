import { createClient } from '@supabase/supabase-js';

const db = createClient(
  'https://bgweumxabgkkqnvifaik.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnd2V1bXhhYmdra3FudmlmYWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDIxNjAxMCwiZXhwIjoyMDk5NzkyMDEwfQ.eQOr4ZxCKn1yRYqzyiotvCQge31PIrpwxuRAn6Iik8I'
);

// ─── HELPER: generate locale-specific itinerary ───

function makeEN(deSteps) {
  const timeMap = {
    '09:00': '09:00 AM', '10:00': '10:00 AM', '04:00': '04:00 AM', '04:30': '04:30 AM',
    '06:00': '06:00 AM', '06:50': '06:50 AM', '08:00': '08:00 AM', '12:00': '12:00 PM',
    '17:00': '05:00 PM', '19:00': '07:00 PM', '22:00': '10:00 PM', '19:45': '07:45 PM',
    '7:30': '07:30 AM', '8:00': '08:00 AM', '09:30': '09:30 AM',
  };
  return deSteps.map(s => {
    let t = s.title, c = s.content;
    // Translate common titles
    if (t === 'Abholung vom Hotel') t = 'Hotel Pickup';
    else if (t === 'Rückfahrt zum Hotel' || t === 'Rücktransfer zum Hotel' || t === 'Rückfahrt nach Hurghada') t = 'Return Transfer to Hotel';
    else if (t === 'Rückfahrt' || t === 'Rücktransfer') t = 'Return Transfer';
    else if (t.startsWith('Abholung')) t = 'Pickup from Hotel';
    else if (t.startsWith('Rückfahrt')) t = 'Return Journey';
    else if (t.startsWith('Rückkehr')) t = 'Return';
    // Replace time formats
    t = t.replace(/(\d{1,2}:\d{2})/g, (m) => timeMap[m] || m);
    t = t.replace(/Uhr/g, '').trim();
    // Translate content
    c = c.replace(/Ihr Guide holt Sie zwischen 09:00 und 10:00 Uhr ab/g, 'Your guide picks you up between 09:00 AM and 10:00 AM');
    c = c.replace(/Von Hurghada aus erreichen wir El Gouna nach etwa 30 Minuten/g, 'From Hurghada we reach El Gouna after approximately 30 minutes');
    c = c.replace(/in einem privaten, klimatisierten Fahrzeug/g, 'in a private, air-conditioned vehicle');
    c = c.replace(/klimatisierten Privatfahrzeug/g, 'air-conditioned private vehicle');
    c = c.replace(/klimatisierten Fahrzeug/g, 'air-conditioned vehicle');
    c = c.replace(/klimatisiertem Fahrzeug/g, 'air-conditioned vehicle');
    c = c.replace(/klimatisierten Minibus/g, 'air-conditioned minibus');
    c = c.replace(/komfortablen, klimatisierten/g, 'comfortable, air-conditioned');
    c = c.replace(/bequem mit klimatisiertem Fahrzeug/g, 'comfortably in an air-conditioned vehicle');
    c = c.replace(/Bequemer Transfer/g, 'Comfortable transfer');
    c = c.replace(/Abholung vom Hotel/g, 'Pickup from hotel');
    c = c.replace(/Abholung direkt von Ihrem Hotel/g, 'Direct pickup from your hotel');
    c = c.replace(/Abholung von Ihrem Hotel/g, 'Pickup from your hotel');
    c = c.replace(/Abholung in Hurghada/g, 'Pickup in Hurghada');
    c = c.replace(/Wir holen Sie bequem/g, 'We pick you up comfortably');
    c = c.replace(/direkt von Ihrem Hotel/g, 'directly from your hotel');
    c = c.replace(/Ihr[\w\s]+Reiseleiter holt Sie/g, 'Your guide picks you up');
    c = c.replace(/Ihr erfahrener, deutschsprachiger Reiseleiter holt Sie/g, 'Your experienced, German-speaking guide picks you up');
    c = c.replace(/Persönliche Begrüßung/g, 'Personal welcome');
    c = c.replace(/kurze Einweisung/g, 'short briefing');
    c = c.replace(/Kurze Einführung/g, 'Short introduction');
    c = c.replace(/dann beginnt Ihr Abenteuer/g, 'then your adventure begins');
    c = c.replace(/danach beginnt Ihr Abenteuer/g, 'then your adventure begins');
    c = c.replace(/Start der Bootstour/g, 'Start of the boat tour');
    c = c.replace(/wird gestellt/g, 'is provided');
    c = c.replace(/wird bereitgestellt/g, 'is provided');
    c = c.replace(/— danach direkt auf das Quad/g, '— then straight onto the quad bike');
    c = c.replace(/danach direkt auf das Quad/g, '— then straight onto the quad bike');
    c = c.replace(/Fahren Sie über Sanddünen/g, 'Ride over sand dunes');
    c = c.replace(/erleben Sie echtes Offroad-Feeling/g, 'experience real off-road adventure');
    c = c.replace(/Einblick in die Kultur der Wüste/g, 'Insight into desert culture');
    c = c.replace(/traditionellem Tee/g, 'traditional tea');
    c = c.replace(/Kurzes, authentisches Erlebnis/g, 'Short authentic experience');
    c = c.replace(/Entspannt zurück/g, 'Relaxed return');
    c = c.replace(/nach Ihrer Tour/g, 'after your tour');
    c = c.replace(/Entspannen Sie an den weißen Sandstränden/g, 'Relax on the white sand beaches');
    c = c.replace(/schwimmen Sie im kristallklaren Wasser/g, 'swim in the crystal-clear water');
    c = c.replace(/schnorcheln Sie direkt vom Strand aus/g, 'or snorkel directly from the beach');
    c = c.replace(/Liegen und Sonnenschirme stehen für Sie bereit/g, 'Sun loungers and umbrellas are ready for you');
    c = c.replace(/mit vielen neuen Eindrücken/g, 'with many new impressions');
    c = c.replace(/glücklichen Erinnerungen/g, 'happy memories');
    c = c.replace(/und bringen Sie sicher zum Hafen/g, 'and takes you safely to the harbor');
    c = c.replace(/und bringt Sie sicher zum Hafen/g, 'and takes you safely to the harbor');
    c = c.replace(/Genießen Sie den weiten Blick über das glitzernde Rote Meer/g, 'Enjoy the wide view over the glittering Red Sea');
    c = c.replace(/Spüren Sie die Meeresbrise/g, 'Feel the sea breeze');
    c = c.replace(/freuen Sie sich auf unvergessliche Momente/g, 'and look forward to unforgettable moments');
    c = c.replace(/Die Tour beginnt mit einer entspannten Bootsfahrt/g, 'The tour begins with a relaxed boat ride');
    c = c.replace(/durch die berühmten Lagunen/g, 'through the famous lagoons');
    c = c.replace(/Sie sehen Luxushotels/g, 'You will see luxury hotels');
    c = c.replace(/Villen & exklusive Wohngebiete/g, 'villas and exclusive residential areas');
    c = c.replace(/Inseln und Wasserwege/g, 'islands and waterways');
    c = c.replace(/den Yachthafen und architektonische Besonderheiten/g, 'the yacht harbor and architectural highlights');
    c = c.replace(/Ihr Reiseleiter erzählt Ihnen die Geschichte der Stadt/g, 'Your guide tells you the history of the city');
    c = c.replace(/spannende Details über die Gründerfamilie Sawiris/g, 'and exciting details about the Sawiris founding family');
    c = c.replace(/In der Innenstadt erwarten Sie/g, 'In the city center you will find');
    c = c.replace(/Cafés, Boutiquen, Kunsthandwerk/g, 'cafés, boutiques, and handicrafts');
    c = c.replace(/kleine Plätze/g, 'small squares');
    c = c.replace(/Sie schlendern entspannt/g, 'You stroll relaxed');
    c = c.replace(/genießen das moderne Flair der Stadt/g, 'and enjoy the modern flair of the city');
    c = c.replace(/Gemeinsam besuchen wir/g, 'Together we visit');
    c = c.replace(/einige der wichtigsten Sehenswürdigkeiten/g, 'some of the most important sights');
    c = c.replace(/koptische Kirche, Große Moschee/g, 'the Coptic Church, the Great Mosque');
    c = c.replace(/Außenstelle der Bibliotheca Alexandrina/g, 'and the Bibliotheca Alexandrina branch');
    c = c.replace(/Eine ideale Mischung aus Kultur und moderner Stadtplanung/g, 'An ideal mix of culture and modern urban planning');
    c = c.replace(/Eines der Highlights der Tour/g, 'One of the tour highlights');
    c = c.replace(/Von oben sehen Sie das Meer/g, 'From above you see the sea');
    c = c.replace(/die Lagunen, die Wüstenberge und die Marina/g, 'the lagoons, the desert mountains, and the marina');
    c = c.replace(/Ein perfekter Ort für eindrucksvolle Fotos/g, 'A perfect spot for impressive photos');
    c = c.replace(/Sie spazieren entlang der gepflegten Promenade/g, 'You stroll along the well-kept promenade');
    c = c.replace(/sehen Luxusyachten/g, 'see luxury yachts');
    c = c.replace(/genießen die mediterrane Atmosphäre/g, 'and enjoy the Mediterranean atmosphere');
    c = c.replace(/Wer möchte, kann noch einen Tee oder Kaffee/g, 'If you like, you can have tea or coffee');
    c = c.replace(/mit Blick auf die Boote trinken/g, 'with a view of the boats');
    c = c.replace(/Nach vielen schönen Eindrücken/g, 'After many wonderful impressions');
    c = c.replace(/fahren wir zurück nach Hurghada/g, 'we drive back to Hurghada');
    c = c.replace(/Tauch.*ein in das farbenfrohe Markttreiben/g, 'Immerse yourself in the colorful market life');
    c = c.replace(/erleben Sie die authentische Atmosphäre eines ägyptischen Basars/g, 'and experience the authentic atmosphere of an Egyptian bazaar');
    c = c.replace(/Entdecken Sie traditionelle Produkte/g, 'Discover traditional products');
    c = c.replace(/handgemachte Lederwaren, Parfümöle/g, 'handmade leather goods, perfume oils');
    c = c.replace(/Papyrusrollen, Gewürze, Schmuck/g, 'papyrus scrolls, spices, jewelry');
    c = c.replace(/Nach einer erlebnisreichen Shoppingtour/g, 'After an eventful shopping tour');
    c = c.replace(/Rotes Meer zählt zu den schönsten Schnorchelgebieten weltweit/g, 'Red Sea is one of the most beautiful snorkeling areas in the world');
    c = c.replace(/Entdecken Sie farbenreiche Korallenriffe/g, 'Discover colorful coral reefs');
    c = c.replace(/tropische Rifffische, Schildkröten, Rochen/g, 'tropical reef fish, turtles, rays');
    c = c.replace(/Napoleonfische bei klarem, warmem Wasser/g, 'and Napoleonfish in clear, warm water');
    c = c.replace(/sehr guter Sicht/g, 'excellent visibility');
    c = c.replace(/Aufenthalt an einer abgelegenen Insel/g, 'Stop at a remote island');
    c = c.replace(/hellem Sandstrand/g, 'bright sandy beach');
    c = c.replace(/reichlich Zeit zum Schwimmen/g, 'plenty of time for swimming');
    c = c.replace(/Sonnenbaden oder Entspannen/g, 'sunbathing or relaxing');
    c = c.replace(/Durch die private Organisation der Tour/g, 'Thanks to the private organization');
    c = c.replace(/vermeiden Sie Menschenansammlungen/g, 'you avoid crowds');
    c = c.replace(/genießen die Natur in ruhiger Atmosphäre/g, 'and enjoy nature in a quiet atmosphere');
    c = c.replace(/Auf der Rückfahrt erleben Sie den Sonnenuntergang/g, 'On the way back you experience the sunset');
    c = c.replace(/Die besondere Lichtstimmung auf dem Wasser/g, 'The special play of light on the water');
    c = c.replace(/macht diesen Moment zu einem stimmungsvollen Abschluss/g, 'makes this moment a atmospheric conclusion');
    c = c.replace(/Pünktliche Abholung/g, 'Punctual pickup');
    c = c.replace(/Ausrüstung/g, 'equipment');
    c = c.replace(/Fahrt zu den besten Delfinplätzen/g, 'Boat ride to the best dolphin spots');
    c = c.replace(/Mit etwas Glück beobachten Sie Delfine in freier Wildbahn/g, 'With luck, you will spot dolphins in the wild');
    c = c.replace(/sofern die Bedingungen es erlauben/g, 'if conditions permit');
    c = c.replace(/gemeinsam mit ihnen schwimmen/g, 'swim with them');
    c = c.replace(/Delfine sind Wildtiere/g, 'Dolphins are wild animals');
    c = c.replace(/Eine Sichtung kann nicht garantiert werden/g, 'Sightings cannot be guaranteed');
    c = c.replace(/die Erfolgsquote ist jedoch sehr hoch/g, 'but the success rate is very high');
    c = c.replace(/Zwei Stopps an farbenprächtigen Riffen/g, 'Two stops at colorful reefs');
    c = c.replace(/beeindruckender Unterwasserwelt/g, 'impressive underwater world');
    c = c.replace(/Entdecken Sie ein faszinierendes Schiffswrack/g, 'Discover a fascinating shipwreck');
    c = c.replace(/einer beeindruckenden Unterwasserwelt voller Fische und Korallen/g, 'an impressive underwater world full of fish and coral');
    c = c.replace(/Gegen 12:00 Uhr Rückkehr/g, 'Return at around 12:00 PM');
    c = c.replace(/Transfer ins Hotel/g, 'Transfer to hotel');
    c = c.replace(/Abholung in Hurghada, El Gouna, Makadi Bay, Soma Bay oder Safaga/g, 'Pickup in Hurghada, El Gouna, Makadi Bay, Soma Bay or Safaga');
    c = c.replace(/Persönliche Begrüßung und Sicherheitseinweisung an Bord des privaten Bootes/g, 'Personal welcome and safety briefing on board the private boat');
    c = c.replace(/1–2 Schnorchelgänge an den schönsten Riffen des Roten Meeres/g, 'One to two snorkeling sessions at the most beautiful Red Sea reefs');
    c = c.replace(/Orange Bay oder Magawish Insel/g, 'Orange Bay or Magawish Island');
    c = c.replace(/Freizeit, Mittagessen & Strandaufenthalt/g, 'free time, lunch, and beach stay');
    c = c.replace(/Entspannung am Strand oder auf dem Boot/g, 'Relaxation on the beach or on the boat');
    c = c.replace(/Rückfahrt zum Hafen & Transfer zum Hotel/g, 'Return to harbor and transfer to hotel');
    c = c.replace(/Ihr Tag beginnt zwischen 7:30 und 8:00 Uhr/g, 'Your day begins between 07:30 AM and 08:00 AM');
    c = c.replace(/mit dem komfortablen Hoteltransfer zum Hafen/g, 'with a comfortable hotel transfer to the harbor');
    c = c.replace(/Nach der Ausgabe Ihrer Schnorchelausrüstung/g, 'After receiving your snorkeling equipment');
    c = c.replace(/startet die 40-minütige Bootsfahrt/g, 'the 40-minute boat ride begins');
    c = c.replace(/zu den faszinierendsten Riffen rund um Eden Island/g, 'to the most fascinating reefs around Eden Island');
    c = c.replace(/Hier erwarten Sie bunte Korallenriffe und tropische Fische/g, 'Colorful coral reefs and tropical fish await you');
    c = c.replace(/ein Paradies für Schnorchler/g, 'a paradise for snorkelers');
    c = c.replace(/Verbringen Sie mehrere Stunden am Eden Island Beach/g, 'Spend several hours at Eden Island Beach');
    c = c.replace(/schwimmen Sie im türkisfarbenen Wasser/g, 'swim in the turquoise water');
    c = c.replace(/entspannen Sie am Strand/g, 'or relax on the beach');
    c = c.replace(/Ein reichhaltiges Buffet mit lokalen und internationalen Speisen/g, 'A rich buffet with local and international dishes');
    c = c.replace(/Nutzen Sie die verbleibende Zeit/g, 'Use the remaining time');
    c = c.replace(/Schwimmen, Schnorcheln oder Entspannen/g, 'swimming, snorkeling, or relaxing');
    c = c.replace(/bevor Sie am Nachmittag mit dem Boot zurück zum Hafen fahren/g, 'before returning to the harbor by boat in the afternoon');
    c = c.replace(/anschließend zu Ihrem Hotel gebracht werden/g, 'and being transferred back to your hotel');
    c = c.replace(/Abholung direkt von Ihrem Hotel in einem privaten, klimatisierten Fahrzeug/g, 'Direct pickup from your hotel in a private, air-conditioned vehicle');
    c = c.replace(/Transfer zum Hafen/g, 'transfer to the harbor');
    c = c.replace(/Fahrt mit einem modernen Ausflugsboot/g, 'Ride on a modern excursion boat');
    c = c.replace(/einer komfortablen Yacht/g, 'a comfortable yacht');
    c = c.replace(/Richtung Orange Bay Island/g, 'towards Orange Bay Island');
    c = c.replace(/Softdrinks sind an Bord inklusive/g, 'Soft drinks are included on board');
    c = c.replace(/Zwei geführte Schnorchelstopps/g, 'Two guided snorkeling stops');
    c = c.replace(/an sorgfältig ausgewählten Riffen/g, 'at carefully selected reefs');
    c = c.replace(/hervorragender Sicht/g, 'excellent visibility');
    c = c.replace(/Komplette Schnorchelausrüstung wird gestellt/g, 'Complete snorkeling equipment is provided');
    c = c.replace(/professionelle Betreuung inklusive/g, 'professional guidance included');
    c = c.replace(/Mehrere Stunden Freizeit auf der Insel/g, 'Several hours of free time on the island');
    c = c.replace(/Baden, Entspannen, Sonnen, Fotografieren/g, 'swimming, relaxing, sunbathing, taking photos');
    c = c.replace(/Genießen der einzigartigen Atmosphäre/g, 'and enjoying the unique atmosphere');
    c = c.replace(/Banana Boat und Sofa Boat/g, 'Banana boat and sofa boat');
    c = c.replace(/unter professioneller Aufsicht/g, 'under professional supervision');
    c = c.replace(/moderner Sicherheitsausrüstung/g, 'modern safety equipment');
    c = c.replace(/Frisch zubereitetes Mittagessen/g, 'Freshly prepared lunch');
    c = c.replace(/alkoholfreien Getränken/g, 'non-alcoholic drinks');
    c = c.replace(/an Bord oder auf der Insel/g, 'on board or on the island');
    c = c.replace(/Abholung von Ihrem Hotel in Hurghada im klimatisierten Fahrzeug/g, 'Pickup from your hotel in Hurghada in an air-conditioned vehicle');
    c = c.replace(/Begrüßung, kurze Einweisung/g, 'Welcome, short briefing');
    c = c.replace(/Fahrt über die Korallenriffe/g, 'Ride over the coral reefs');
    c = c.replace(/direktem Blick in die Unterwasserwelt/g, 'with a direct view of the underwater world');
    c = c.replace(/Geführtes Schnorcheln an einem ruhigen Riff/g, 'Guided snorkeling at a calm reef');
    c = c.replace(/Getränke genießen und Fotos machen/g, 'Enjoy drinks and take photos');
    c = c.replace(/Rückkehr zum Hafen/g, 'Return to the harbor');
    c = c.replace(/Transfer zurück zu Ihrem Hotel/g, 'Transfer back to your hotel');
    c = c.replace(/Bequemer Transfer von Ihrer Unterkunft/g, 'Comfortable transfer from your accommodation');
    c = c.replace(/Kurze Einführung/g, 'Short introduction');
    c = c.replace(/nach der Tour/g, 'after the tour');
    c = c.replace(/ca\. /g, 'approx. ');
    c = c.replace(/Gesamt ca\./g, 'Total approx.');
    return { title: t, content: c };
  });
}

function makeFR(deSteps) {
  return deSteps.map(s => {
    let t = s.title, c = s.content;
    t = t.replace(/(\d{2}:\d{2})/g, (m) => m.replace(':', 'h'));
    t = t.replace(/ –/g, ' –');
    t = t.replace(/Uhr/g, '').trim();
    if (t === 'Abholung vom Hotel') t = 'Prise en charge à l\'hôtel';
    else if (t === 'Rückfahrt zum Hotel' || t === 'Rücktransfer zum Hotel' || t === 'Rückfahrt nach Hurghada') t = 'Retour à l\'hôtel';
    else if (t === 'Rückfahrt' || t === 'Rücktransfer') t = 'Retour';
    else if (t.startsWith('Abholung')) t = t.replace('Abholung', 'Prise en charge').replace(/\(.*?\)/g, '').trim();
    else if (t.startsWith('Rückfahrt')) t = 'Retour';
    else if (t.startsWith('Rückkehr')) t = 'Retour';
    c = c.replace(/Ihr Guide holt Sie zwischen 09:00 und 10:00 Uhr ab/g, 'Votre guide vous prend en charge entre 09h00 et 10h00');
    c = c.replace(/Von Hurghada aus erreichen wir El Gouna nach etwa 30 Minuten/g, 'Depuis Hurghada, nous rejoignons El Gouna en environ 30 minutes');
    c = c.replace(/in einem privaten, klimatisierten Fahrzeug/g, 'dans un véhicule privé climatisé');
    c = c.replace(/klimatisierten Privatfahrzeug/g, 'véhicule privé climatisé');
    c = c.replace(/klimatisierten Fahrzeug/g, 'véhicule climatisé');
    c = c.replace(/klimatisiertem Fahrzeug/g, 'véhicule climatisé');
    c = c.replace(/klimatisierten Minibus/g, 'minibus climatisé');
    c = c.replace(/komfortablen, klimatisierten/g, 'confortable et climatisé');
    c = c.replace(/bequem mit klimatisiertem Fahrzeug/g, 'confortablement dans un véhicule climatisé');
    c = c.replace(/Bequemer Transfer/g, 'Transfert confortable');
    c = c.replace(/Abholung vom Hotel/g, 'Prise en charge à l\'hôtel');
    c = c.replace(/Abholung direkt von Ihrem Hotel/g, 'Prise en charge directe à votre hôtel');
    c = c.replace(/Abholung von Ihrem Hotel/g, 'Prise en charge à votre hôtel');
    c = c.replace(/Abholung in Hurghada/g, 'Prise en charge à Hurghada');
    c = c.replace(/Wir holen Sie bequem/g, 'Nous venons vous chercher confortablement');
    c = c.replace(/direkt von Ihrem Hotel/g, 'directement de votre hôtel');
    c = c.replace(/Ihr[\w\s]+Reiseleiter holt Sie/g, 'Votre guide vous prend en charge');
    c = c.replace(/Ihr erfahrener, deutschsprachiger Reiseleiter holt Sie/g, 'Votre guide expérimenté germanophone vous prend en charge');
    c = c.replace(/Persönliche Begrüßung/g, 'Accueil personnalisé');
    c = c.replace(/kurze Einweisung/g, 'brève instruction');
    c = c.replace(/Kurze Einführung/g, 'Brève introduction');
    c = c.replace(/dann beginnt Ihr Abenteuer/g, 'puis votre aventure commence');
    c = c.replace(/danach beginnt Ihr Abenteuer/g, 'puis votre aventure commence');
    c = c.replace(/Start der Bootstour/g, 'Début de la excursion en bateau');
    c = c.replace(/wird gestellt/g, 'est fournie');
    c = c.replace(/wird bereitgestellt/g, 'est fournie');
    c = c.replace(/— danach direkt auf das Quad/g, '— puis directement sur le quad');
    c = c.replace(/danach direkt auf das Quad/g, '— puis directement sur le quad');
    c = c.replace(/Fahren Sie über Sanddünen/g, 'Conduisez sur les dunes de sable');
    c = c.replace(/erleben Sie echtes Offroad-Feeling/g, 'vivez une véritable expérience tout-terrain');
    c = c.replace(/Einblick in die Kultur der Wüste/g, 'Aperçu de la culture du désert');
    c = c.replace(/traditionellem Tee/g, 'thé traditionnel');
    c = c.replace(/Kurzes, authentisches Erlebnis/g, 'Courte expérience authentique');
    c = c.replace(/Entspannt zurück/g, 'Retour détendu');
    c = c.replace(/nach Ihrer Tour/g, 'après votre excursion');
    c = c.replace(/Entspannen Sie an den weißen Sandstränden/g, 'Détendez-vous sur les plages de sable blanc');
    c = c.replace(/schwimmen Sie im kristallklaren Wasser/g, 'nagez dans l\'eau cristalline');
    c = c.replace(/schnorcheln Sie direkt vom Strand aus/g, 'ou snorklez directement depuis la plage');
    c = c.replace(/Liegen und Sonnenschirme stehen für Sie bereit/g, 'Transats et parasols sont à votre disposition');
    c = c.replace(/mit vielen neuen Eindrücken/g, 'avec de nombreuses nouvelles impressions');
    c = c.replace(/glücklichen Erinnerungen/g, 'des souvenirs heureux');
    c = c.replace(/und bringen Sie sicher zum Hafen/g, 'et vous emmène en sécurité au port');
    c = c.replace(/und bringt Sie sicher zum Hafen/g, 'et vous emmène en sécurité au port');
    c = c.replace(/Genießen Sie den weiten Blick über das glitzernde Rote Meer/g, 'Profitez de la vue panoramique sur la mer Rouge scintillante');
    c = c.replace(/Spüren Sie die Meeresbrise/g, 'Sentez la brise marine');
    c = c.replace(/freuen Sie sich auf unvergessliche Momente/g, 'et réjouissez-vous de moments inoubliables');
    c = c.replace(/Die Tour beginnt mit einer entspannten Bootsfahrt/g, 'La excursion commence par une promenade en bateau relaxante');
    c = c.replace(/durch die berühmten Lagunen/g, 'à travers les célèbres lagunes');
    c = c.replace(/Sie sehen Luxushotels/g, 'Vous verrez des hôtels de luxe');
    c = c.replace(/Villen & exklusive Wohngebiete/g, 'des villas et des quartiers résidentiels exclusifs');
    c = c.replace(/Inseln und Wasserwege/g, 'des îles et des voies navigables');
    c = c.replace(/den Yachthafen und architektonische Besonderheiten/g, 'le port de plaisance et les particularités architecturales');
    c = c.replace(/Ihr Reiseleiter erzählt Ihnen die Geschichte der Stadt/g, 'Votre guide vous raconte l\'histoire de la ville');
    c = c.replace(/spannende Details über die Gründerfamilie Sawiris/g, 'et des détails passionnants sur la famille fondatrice Sawiris');
    c = c.replace(/In der Innenstadt erwarten Sie/g, 'Dans le centre-ville, vous trouverez');
    c = c.replace(/Cafés, Boutiquen, Kunsthandwerk/g, 'des cafés, des boutiques, de l\'artisanat');
    c = c.replace(/kleine Plätze/g, 'et des petites places');
    c = c.replace(/Sie schlendern entspannt/g, 'Vous flânez tranquillement');
    c = c.replace(/genießen das moderne Flair der Stadt/g, 'et profitez de l\'ambiance moderne de la ville');
    c = c.replace(/Gemeinsam besuchen wir/g, 'Ensemble, nous visitons');
    c = c.replace(/einige der wichtigsten Sehenswürdigkeiten/g, 'quelques-uns des sites les plus importants');
    c = c.replace(/koptische Kirche, Große Moschee/g, 'l\'église copte, la Grande Mosquée');
    c = c.replace(/Außenstelle der Bibliotheca Alexandrina/g, 'et l\'annexe de la Bibliotheca Alexandrina');
    c = c.replace(/Eine ideale Mischung aus Kultur und moderner Stadtplanung/g, 'Un mélange idéal de culture et d\'urbanisme moderne');
    c = c.replace(/Eines der Highlights der Tour/g, 'L\'un des points forts de la excursion');
    c = c.replace(/Von oben sehen Sie das Meer/g, 'D\'en haut, vous voyez la mer');
    c = c.replace(/die Lagunen, die Wüstenberge und die Marina/g, 'les lagunes, les montagnes du désert et la marina');
    c = c.replace(/Ein perfekter Ort für eindrucksvolle Fotos/g, 'Un endroit parfait pour des photos impressionnantes');
    c = c.replace(/Sie spazieren entlang der gepflegten Promenade/g, 'Vous vous promenez le long de la promenade bien entretenue');
    c = c.replace(/sehen Luxusyachten/g, 'voyez des yachts de luxe');
    c = c.replace(/genießen die mediterrane Atmosphäre/g, 'et profitez de l\'atmosphère méditerranéenne');
    c = c.replace(/Wer möchte, kann noch einen Tee oder Kaffee/g, 'Si vous le souhaitez, vous pouvez prendre un thé ou un café');
    c = c.replace(/mit Blick auf die Boote trinken/g, 'avec vue sur les bateaux');
    c = c.replace(/Nach vielen schönen Eindrücken/g, 'Après de nombreuses belles impressions');
    c = c.replace(/fahren wir zurück nach Hurghada/g, 'nous retournons à Hurghada');
    c = c.replace(/Tauch.*ein in das farbenfrohe Markttreiben/g, 'Plongez dans l\'ambiance colorée du marché');
    c = c.replace(/erleben Sie die authentische Atmosphäre eines ägyptischen Basars/g, 'et vivez l\'atmosphère authentique d\'un bazar égyptien');
    c = c.replace(/Entdecken Sie traditionelle Produkte/g, 'Découvrez des produits traditionnels');
    c = c.replace(/handgemachte Lederwaren, Parfümöle/g, 'articles en cuir faits main, huiles de parfum');
    c = c.replace(/Papyrusrollen, Gewürze, Schmuck/g, 'papyrus, épices, bijoux');
    c = c.replace(/Nach einer erlebnisreichen Shoppingtour/g, 'Après une excursion shopping mouvementée');
    c = c.replace(/Rotes Meer zählt zu den schönsten Schnorchelgebieten weltweit/g, 'La mer Rouge est l\'une des plus belles zones de snorkeling au monde');
    c = c.replace(/Entdecken Sie farbenreiche Korallenriffe/g, 'Découvrez des récifs coralliens colorés');
    c = c.replace(/tropische Rifffische, Schildkröten, Rochen/g, 'poissons tropicaux, tortues, raies');
    c = c.replace(/Napoleonfische bei klarem, warmem Wasser/g, 'et poissons Napoléon dans une eau claire et chaude');
    c = c.replace(/sehr guter Sicht/g, 'excellente visibilité');
    c = c.replace(/Aufenthalt an einer abgelegenen Insel/g, 'Arrêt sur une île isolée');
    c = c.replace(/hellem Sandstrand/g, 'plage de sable clair');
    c = c.replace(/reichlich Zeit zum Schwimmen/g, 'assez de temps pour nager');
    c = c.replace(/Sonnenbaden oder Entspannen/g, 'bronzer ou se détendre');
    c = c.replace(/Durch die private Organisation der Tour/g, 'Grâce à l\'organisation privée');
    c = c.replace(/vermeiden Sie Menschenansammlungen/g, 'vous évitez les foules');
    c = c.replace(/genießen die Natur in ruhiger Atmosphäre/g, 'et profitez de la nature dans une atmosphère calme');
    c = c.replace(/Auf der Rückfahrt erleben Sie den Sonnenuntergang/g, 'Au retour, vous admirez le coucher de soleil');
    c = c.replace(/Die besondere Lichtstimmung auf dem Wasser/g, 'La lumière particulière sur l\'eau');
    c = c.replace(/macht diesen Moment zu einem stimmungsvollen Abschluss/g, 'fait de ce moment une conclusion pleine d\'atmosphère');
    c = c.replace(/Pünktliche Abholung/g, 'Prise en charge ponctuelle');
    c = c.replace(/Ausrüstung/g, 'équipement');
    c = c.replace(/Fahrt zu den besten Delfinplätzen/g, 'Trajet vers les meilleurs spots de dauphins');
    c = c.replace(/Mit etwas Glück beobachten Sie Delfine in freier Wildbahn/g, 'Avec un peu de chance, vous observerez des dauphins dans la nature');
    c = c.replace(/sofern die Bedingungen es erlauben/g, 'si les conditions le permettent');
    c = c.replace(/gemeinsam mit ihnen schwimmen/g, 'nager avec eux');
    c = c.replace(/Delfine sind Wildtiere/g, 'Les dauphins sont des animaux sauvages');
    c = c.replace(/Eine Sichtung kann nicht garantiert werden/g, 'Une observation ne peut être garantie');
    c = c.replace(/die Erfolgsquote ist jedoch sehr hoch/g, 'mais le taux de réussite est très élevé');
    c = c.replace(/Zwei Stopps an farbenprächtigen Riffen/g, 'Deux arrêts sur des récifs colorés');
    c = c.replace(/beeindruckender Unterwasserwelt/g, 'monde sous-marin impressionnant');
    c = c.replace(/Entdecken Sie ein faszinierendes Schiffswrack/g, 'Découvrez une épave fascinante');
    c = c.replace(/einer beeindruckenden Unterwasserwelt voller Fische und Korallen/g, 'un monde sous-marin impressionnant plein de poissons et de coraux');
    c = c.replace(/Gegen 12:00 Uhr Rückkehr/g, 'Retour vers 12h00');
    c = c.replace(/Transfer ins Hotel/g, 'Transfert à l\'hôtel');
    c = c.replace(/Abholung in Hurghada, El Gouna, Makadi Bay, Soma Bay oder Safaga/g, 'Prise en charge à Hurghada, El Gouna, Makadi Bay, Soma Bay ou Safaga');
    c = c.replace(/Persönliche Begrüßung und Sicherheitseinweisung an Bord des privaten Bootes/g, 'Accueil personnalisé et consignes de sécurité à bord du bateau privé');
    c = c.replace(/1–2 Schnorchelgänge an den schönsten Riffen des Roten Meeres/g, 'Une à deux séances de snorkeling aux plus beaux récifs de la mer Rouge');
    c = c.replace(/Orange Bay oder Magawish Insel/g, 'Orange Bay ou l\'île Magawish');
    c = c.replace(/Freizeit, Mittagessen & Strandaufenthalt/g, 'temps libre, déjeuner et séjour à la plage');
    c = c.replace(/Entspannung am Strand oder auf dem Boot/g, 'Détente sur la plage ou sur le bateau');
    c = c.replace(/Rückfahrt zum Hafen & Transfer zum Hotel/g, 'Retour au port et transfert à l\'hôtel');
    c = c.replace(/Ihr Tag beginnt zwischen 7:30 und 8:00 Uhr/g, 'Votre journée commence entre 07h30 et 08h00');
    c = c.replace(/mit dem komfortablen Hoteltransfer zum Hafen/g, 'avec le transfert confortable de l\'hôtel au port');
    c = c.replace(/Nach der Ausgabe Ihrer Schnorchelausrüstung/g, 'Après la distribution de votre équipement de snorkeling');
    c = c.replace(/startet die 40-minütige Bootsfahrt/g, 'la traversée de 40 minutes commence');
    c = c.replace(/zu den faszinierendsten Riffen rund um Eden Island/g, 'vers les récifs les plus fascinants autour d\'Eden Island');
    c = c.replace(/Hier erwarten Sie bunte Korallenriffe und tropische Fische/g, 'Des récifs coralliens colorés et des poissons tropicaux vous attendent');
    c = c.replace(/ein Paradies für Schnorchler/g, 'un paradis pour les snorkeleurs');
    c = c.replace(/Verbringen Sie mehrere Stunden am Eden Island Beach/g, 'Passez plusieurs heures à la plage d\'Eden Island');
    c = c.replace(/schwimmen Sie im türkisfarbenen Wasser/g, 'nagez dans l\'eau turquoise');
    c = c.replace(/entspannen Sie am Strand/g, 'ou détendez-vous sur la plage');
    c = c.replace(/Ein reichhaltiges Buffet mit lokalen und internationalen Speisen/g, 'Un buffet riche avec des plats locaux et internationaux');
    c = c.replace(/Nutzen Sie die verbleibende Zeit/g, 'Utilisez le temps restant');
    c = c.replace(/Schwimmen, Schnorcheln oder Entspannen/g, 'nager, snorkeler ou se détendre');
    c = c.replace(/bevor Sie am Nachmittag mit dem Boot zurück zum Hafen fahren/g, 'avant de retourner au port en bateau dans l\'après-midi');
    c = c.replace(/anschließend zu Ihrem Hotel gebracht werden/g, 'et d\'être ramené à votre hôtel');
    c = c.replace(/Abholung direkt von Ihrem Hotel in einem privaten, klimatisierten Fahrzeug/g, 'Prise en charge directe à votre hôtel dans un véhicule privé climatisé');
    c = c.replace(/Transfer zum Hafen/g, 'transfert au port');
    c = c.replace(/Fahrt mit einem modernen Ausflugsboot/g, 'Trajet en bateau d\'excursion moderne');
    c = c.replace(/einer komfortablen Yacht/g, 'un yacht confortable');
    c = c.replace(/Richtung Orange Bay Island/g, 'vers Orange Bay Island');
    c = c.replace(/Softdrinks sind an Bord inklusive/g, 'Les boissons gazeuses sont incluses à bord');
    c = c.replace(/Zwei geführte Schnorchelstopps/g, 'Deux arrêts snorkeling guidés');
    c = c.replace(/an sorgfältig ausgewählten Riffen/g, 'sur des récifs soigneusement sélectionnés');
    c = c.replace(/hervorragender Sicht/g, 'visibilité excellente');
    c = c.replace(/Komplette Schnorchelausrüstung wird gestellt/g, 'L\'équipement complet de snorkeling est fourni');
    c = c.replace(/professionelle Betreuung inklusive/g, 'encadrement professionnel inclus');
    c = c.replace(/Mehrere Stunden Freizeit auf der Insel/g, 'Plusieurs heures de temps libre sur l\'île');
    c = c.replace(/Baden, Entspannen, Sonnen, Fotografieren/g, 'baignade, détente, bain de soleil, photos');
    c = c.replace(/Genießen der einzigartigen Atmosphäre/g, 'et profiter de l\'atmosphère unique');
    c = c.replace(/Banana Boat und Sofa Boat/g, 'Banana boat et sofa boat');
    c = c.replace(/unter professioneller Aufsicht/g, 'sous supervision professionnelle');
    c = c.replace(/moderner Sicherheitsausrüstung/g, 'équipement de sécurité moderne');
    c = c.replace(/Frisch zubereitetes Mittagessen/g, 'Déjeuner fraîchement préparé');
    c = c.replace(/alkoholfreien Getränken/g, 'boissons non alcoolisées');
    c = c.replace(/an Bord oder auf der Insel/g, 'à bord ou sur l\'île');
    c = c.replace(/Abholung von Ihrem Hotel in Hurghada im klimatisierten Fahrzeug/g, 'Prise en charge à votre hôtel à Hurghada dans un véhicule climatisé');
    c = c.replace(/Begrüßung, kurze Einweisung/g, 'Accueil, brève instruction');
    c = c.replace(/Fahrt über die Korallenriffe/g, 'Traversée au-dessus des récifs coralliens');
    c = c.replace(/direktem Blick in die Unterwasserwelt/g, 'avec vue directe sur le monde sous-marin');
    c = c.replace(/Geführtes Schnorcheln an einem ruhigen Riff/g, 'Snorkeling guidé sur un récif calme');
    c = c.replace(/Getränke genießen und Fotos machen/g, 'Profitez des boissons et prenez des photos');
    c = c.replace(/Rückkehr zum Hafen/g, 'Retour au port');
    c = c.replace(/Transfer zurück zu Ihrem Hotel/g, 'Transfert retour à votre hôtel');
    c = c.replace(/Bequemer Transfer von Ihrer Unterkunft/g, 'Transfert confortable depuis votre hébergement');
    c = c.replace(/Kurze Einführung/g, 'Brève introduction');
    c = c.replace(/nach der Tour/g, 'après la excursion');
    c = c.replace(/ca\. /g, 'env. ');
    c = c.replace(/Gesamt ca\./g, 'Total env.');
    return { title: t, content: c };
  });
}

function makeRU(deSteps) {
  return deSteps.map(s => {
    let t = s.title, c = s.content;
    // Keep 24h format
    t = t.replace(/Uhr/g, '').trim();
    if (t === 'Abholung vom Hotel') t = 'Забор из отеля';
    else if (t === 'Rückfahrt zum Hotel' || t === 'Rücktransfer zum Hotel' || t === 'Rückfahrt nach Hurghada') t = 'Обратный трансфер в отель';
    else if (t === 'Rückfahrt' || t === 'Rücktransfer') t = 'Обратный трансфер';
    else if (t.startsWith('Abholung')) t = t.replace('Abholung', 'Забор').replace(/\(.*?\)/g, '').trim();
    else if (t.startsWith('Rückfahrt')) t = 'Обратная дорога';
    else if (t.startsWith('Rückkehr')) t = 'Возвращение';
    // Translate content
    c = c.replace(/Ihr Guide holt Sie zwischen 09:00 und 10:00 Uhr ab/g, 'Ваш гид заберёт вас между 09:00 и 10:00');
    c = c.replace(/Von Hurghada aus erreichen wir El Gouna nach etwa 30 Minuten/g, 'Из Хургады мы добираемся до Эль-Гуны примерно за 30 минут');
    c = c.replace(/in einem privaten, klimatisierten Fahrzeug/g, 'в частном автомобиле с кондиционером');
    c = c.replace(/klimatisierten Privatfahrzeug/g, 'частном автомобиле с кондиционером');
    c = c.replace(/klimatisierten Fahrzeug/g, 'автомобиле с кондиционером');
    c = c.replace(/klimatisiertem Fahrzeug/g, 'автомобиле с кондиционером');
    c = c.replace(/klimatisierten Minibus/g, 'микроавтобусе с кондиционером');
    c = c.replace(/komfortablen, klimatisierten/g, 'комфортабельном с кондиционером');
    c = c.replace(/bequem mit klimatisiertem Fahrzeug/g, 'с комфортом в автомобиле с кондиционером');
    c = c.replace(/Bequemer Transfer/g, 'Комфортабельный трансфер');
    c = c.replace(/Abholung vom Hotel/g, 'Забор из отеля');
    c = c.replace(/Abholung direkt von Ihrem Hotel/g, 'Забор прямо из вашего отеля');
    c = c.replace(/Abholung von Ihrem Hotel/g, 'Забор из вашего отеля');
    c = c.replace(/Abholung in Hurghada/g, 'Забор в Хургаде');
    c = c.replace(/Wir holen Sie bequem/g, 'Мы заберём вас с комфортом');
    c = c.replace(/direkt von Ihrem Hotel/g, 'прямо из вашего отеля');
    c = c.replace(/Ihr[\w\s]+Reiseleiter holt Sie/g, 'Ваш гид заберёт вас');
    c = c.replace(/Ihr erfahrener, deutschsprachiger Reiseleiter holt Sie/g, 'Ваш опытный немецкоязычный гид заберёт вас');
    c = c.replace(/Persönliche Begrüßung/g, 'Персональное приветствие');
    c = c.replace(/kurze Einweisung/g, 'краткий инструктаж');
    c = c.replace(/Kurze Einführung/g, 'Краткое введение');
    c = c.replace(/dann beginnt Ihr Abenteuer/g, 'затем начинается ваше приключение');
    c = c.replace(/danach beginnt Ihr Abenteuer/g, 'затем начинается ваше приключение');
    c = c.replace(/Start der Bootstour/g, 'Начало лодочной экскурсии');
    c = c.replace(/wird gestellt/g, 'предоставляется');
    c = c.replace(/wird bereitgestellt/g, 'предоставляется');
    c = c.replace(/— danach direkt auf das Quad/g, '— затем сразу на квадроцикл');
    c = c.replace(/danach direkt auf das Quad/g, '— затем сразу на квадроцикл');
    c = c.replace(/Fahren Sie über Sanddünen/g, 'Поезжайте по песчаным дюнам');
    c = c.replace(/erleben Sie echtes Offroad-Feeling/g, 'почувствуйте настоящее внедорожье');
    c = c.replace(/Einblick in die Kultur der Wüste/g, 'Знакомство с культурой пустыни');
    c = c.replace(/traditionellem Tee/g, 'традиционным чаем');
    c = c.replace(/Kurzes, authentisches Erlebnis/g, 'Короткий аутентичный опыт');
    c = c.replace(/Entspannt zurück/g, 'Расслабленное возвращение');
    c = c.replace(/nach Ihrer Tour/g, 'после вашей экскурсии');
    c = c.replace(/Entspannen Sie an den weißen Sandstränden/g, 'Отдыхайте на белых песчаных пляжах');
    c = c.replace(/schwimmen Sie im kristallklaren Wasser/g, 'купайтесь в кристально чистой воде');
    c = c.replace(/schnorcheln Sie direkt vom Strand aus/g, 'или занимайтесь снорклингом прямо с пляжа');
    c = c.replace(/Liegen und Sonnenschirme stehen für Sie bereit/g, 'Шезлонги и зонты готовы для вас');
    c = c.replace(/mit vielen neuen Eindrücken/g, 'с множеством новых впечатлений');
    c = c.replace(/glücklichen Erinnerungen/g, 'счастливых воспоминаний');
    c = c.replace(/und bringen Sie sicher zum Hafen/g, 'и доставляет вас в порт');
    c = c.replace(/und bringt Sie sicher zum Hafen/g, 'и доставляет вас в порт');
    c = c.replace(/Genießen Sie den weiten Blick über das glitzernde Rote Meer/g, 'Наслаждайтесь широким видом на сверкающее Красное море');
    c = c.replace(/Spüren Sie die Meeresbrise/g, 'Почувствуйте морской бриз');
    c = c.replace(/freuen Sie sich auf unvergessliche Momente/g, 'и радуйтесь незабываемым моментам');
    c = c.replace(/Die Tour beginnt mit einer entspannten Bootsfahrt/g, 'Экскурсия начинается с расслабленной прогулки на лодке');
    c = c.replace(/durch die berühmten Lagunen/g, 'по знаменитым лагунам');
    c = c.replace(/Sie sehen Luxushotels/g, 'Вы увидите роскошные отели');
    c = c.replace(/Villen & exklusive Wohngebiete/g, 'виллы и эксклюзивные жилые районы');
    c = c.replace(/Inseln und Wasserwege/g, 'острова и водные пути');
    c = c.replace(/den Yachthafen und architektonische Besonderheiten/g, 'яхтенную гавань и архитектурные особенности');
    c = c.replace(/Ihr Reiseleiter erzählt Ihnen die Geschichte der Stadt/g, 'Ваш гид расскажет вам историю города');
    c = c.replace(/spannende Details über die Gründerfamilie Sawiris/g, 'и увлекательные подробности о семье основателей Савирис');
    c = c.replace(/In der Innenstadt erwarten Sie/g, 'В центре города вас ждут');
    c = c.replace(/Cafés, Boutiquen, Kunsthandwerk/g, 'кафе, бутики, ремесленные изделия');
    c = c.replace(/kleine Plätze/g, 'и маленькие площади');
    c = c.replace(/Sie schlendern entspannt/g, 'Вы непринуждённо прогуливаетесь');
    c = c.replace(/genießen das moderne Flair der Stadt/g, 'и наслаждаетесь современным колоритом города');
    c = c.replace(/Gemeinsam besuchen wir/g, 'Вместе мы посещаем');
    c = c.replace(/einige der wichtigsten Sehenswürdigkeiten/g, 'некоторые из самых важных достопримечательностей');
    c = c.replace(/koptische Kirche, Große Moschee/g, 'коптскую церковь, Большую мечеть');
    c = c.replace(/Außenstelle der Bibliotheca Alexandrina/g, 'и филиал Библиотеки Александрины');
    c = c.replace(/Eine ideale Mischung aus Kultur und moderner Stadtplanung/g, 'Идеальное сочетание культуры и современного градостроительства');
    c = c.replace(/Eines der Highlights der Tour/g, 'Одна из главных достопримечательностей экскурсии');
    c = c.replace(/Von oben sehen Sie das Meer/g, 'Сверху вы видите море');
    c = c.replace(/die Lagunen, die Wüstenberge und die Marina/g, 'лагуны, пустынные горы и марину');
    c = c.replace(/Ein perfekter Ort für eindrucksvolle Fotos/g, 'Идеальное место для впечатляющих фотографий');
    c = c.replace(/Sie spazieren entlang der gepflegten Promenade/g, 'Вы прогуливаетесь по ухоженной набережной');
    c = c.replace(/sehen Luxusyachten/g, 'видите роскошные яхты');
    c = c.replace(/genießen die mediterrane Atmosphäre/g, 'и наслаждаетесь средиземноморской атмосферой');
    c = c.replace(/Wer möchte, kann noch einen Tee oder Kaffee/g, 'По желанию можно выпить чай или кофе');
    c = c.replace(/mit Blick auf die Boote trinken/g, 'с видом на лодки');
    c = c.replace(/Nach vielen schönen Eindrücken/g, 'После множества прекрасных впечатлений');
    c = c.replace(/fahren wir zurück nach Hurghada/g, 'мы возвращаемся в Хургаду');
    c = c.replace(/Tauch.*ein in das farbenfrohe Markttreiben/g, 'Окунитесь в красочную рыночную жизнь');
    c = c.replace(/erleben Sie die authentische Atmosphäre eines ägyptischen Basars/g, 'и прочувствуйте аутентичную атмосферу египетского базара');
    c = c.replace(/Entdecken Sie traditionelle Produkte/g, 'Откройте для себя традиционные продукты');
    c = c.replace(/handgemachte Lederwaren, Parfümöle/g, 'кожаные изделия ручной работы, парфюмерные масла');
    c = c.replace(/Papyrusrollen, Gewürze, Schmuck/g, 'папирус, специи, украшения');
    c = c.replace(/Nach einer erlebnisreichen Shoppingtour/g, 'После насыщенной шопинг-экскурсии');
    c = c.replace(/Rotes Meer zählt zu den schönsten Schnorchelgebieten weltweit/g, 'Красное море — одна из красивейших зон для снорклинга в мире');
    c = c.replace(/Entdecken Sie farbenreiche Korallenriffe/g, 'Откройте для себя красочные коралловые рифы');
    c = c.replace(/tropische Rifffische, Schildkröten, Rochen/g, 'тропических рыб, черепах, скатов');
    c = c.replace(/Napoleonfische bei klarem, warmem Wasser/g, 'и рыб-наполеонов в чистой тёплой воде');
    c = c.replace(/sehr guter Sicht/g, 'отличной видимостью');
    c = c.replace(/Aufenthalt an einer abgelegenen Insel/g, 'Остановка на отдалённом острове');
    c = c.replace(/hellem Sandstrand/g, 'светлым песчаным пляжем');
    c = c.replace(/reichlich Zeit zum Schwimmen/g, 'достаточно времени для плавания');
    c = c.replace(/Sonnenbaden oder Entspannen/g, 'загара или отдыха');
    c = c.replace(/Durch die private Organisation der Tour/g, 'Благодаря частной организации');
    c = c.replace(/vermeiden Sie Menschenansammlungen/g, 'вы избегаете скоплений людей');
    c = c.replace(/genießen die Natur in ruhiger Atmosphäre/g, 'и наслаждаетесь природой в спокойной атмосфере');
    c = c.replace(/Auf der Rückfahrt erleben Sie den Sonnenuntergang/g, 'На обратном пути вы увидите закат');
    c = c.replace(/Die besondere Lichtstimmung auf dem Wasser/g, 'Особая игра света на воде');
    c = c.replace(/macht diesen Moment zu einem stimmungsvollen Abschluss/g, 'делает этот момент атмосферным завершением');
    c = c.replace(/Pünktliche Abholung/g, 'Пунктуальный забор');
    c = c.replace(/Ausrüstung/g, 'снаряжение');
    c = c.replace(/Fahrt zu den besten Delfinplätzen/g, 'Поездка к лучшим местам обитания дельфинов');
    c = c.replace(/Mit etwas Glück beobachten Sie Delfine in freier Wildbahn/g, 'При удаче вы увидите дельфинов в дикой природе');
    c = c.replace(/sofern die Bedingungen es erlauben/g, 'если позволят условия');
    c = c.replace(/gemeinsam mit ihnen schwimmen/g, 'поплавать с ними');
    c = c.replace(/Delfine sind Wildtiere/g, 'Дельфины — дикие животные');
    c = c.replace(/Eine Sichtung kann nicht garantiert werden/g, 'Встреча не гарантирована');
    c = c.replace(/die Erfolgsquote ist jedoch sehr hoch/g, 'но процент успеха очень высок');
    c = c.replace(/Zwei Stopps an farbenprächtigen Riffen/g, 'Две остановки у красочных рифов');
    c = c.replace(/beeindruckender Unterwasserwelt/g, 'впечатляющим подводным миром');
    c = c.replace(/Entdecken Sie ein faszinierendes Schiffswrack/g, 'Откройте для себя fascinating затонувший корабль');
    c = c.replace(/einer beeindruckenden Unterwasserwelt voller Fische und Korallen/g, 'впечатляющий подводный мир, полный рыб и кораллов');
    c = c.replace(/Gegen 12:00 Uhr Rückkehr/g, 'Возвращение около 12:00');
    c = c.replace(/Transfer ins Hotel/g, 'Трансфер в отель');
    c = c.replace(/Abholung in Hurghada, El Gouna, Makadi Bay, Soma Bay oder Safaga/g, 'Забор в Хургаде, Эль-Гуне, Макади-Бей, Сома-Бей или Сафаге');
    c = c.replace(/Persönliche Begrüßung und Sicherheitseinweisung an Bord des privaten Bootes/g, 'Персональное приветствие и инструктаж по безопасности на борту частной лодки');
    c = c.replace(/1–2 Schnorchelgänge an den schönsten Riffen des Roten Meeres/g, 'Одна-две остановки для снорклинга у красивейших рифов Красного моря');
    c = c.replace(/Orange Bay oder Magawish Insel/g, 'Оранж-Бей или остров Магавиш');
    c = c.replace(/Freizeit, Mittagessen & Strandaufenthalt/g, 'свободное время, обед и отдых на пляже');
    c = c.replace(/Entspannung am Strand oder auf dem Boot/g, 'Отдых на пляже или на лодке');
    c = c.replace(/Rückfahrt zum Hafen & Transfer zum Hotel/g, 'Возвращение в порт и трансфер в отель');
    c = c.replace(/Ihr Tag beginnt zwischen 7:30 und 8:00 Uhr/g, 'Ваш день начинается между 07:30 и 08:00');
    c = c.replace(/mit dem komfortablen Hoteltransfer zum Hafen/g, 'с комфортабельным трансфером из отеля в порт');
    c = c.replace(/Nach der Ausgabe Ihrer Schnorchelausrüstung/g, 'После выдачи снаряжения для снорклинга');
    c = c.replace(/startet die 40-minütige Bootsfahrt/g, 'начинается 40-минутная поездка на лодке');
    c = c.replace(/zu den faszinierendsten Riffen rund um Eden Island/g, 'к самым впечатляющим рифам вокруг Eden Island');
    c = c.replace(/Hier erwarten Sie bunte Korallenriffe und tropische Fische/g, 'Красочные коралловые рифы и тропические рыбы ждут вас');
    c = c.replace(/ein Paradies für Schnorchler/g, 'рай для любителей снорклинга');
    c = c.replace(/Verbringen Sie mehrere Stunden am Eden Island Beach/g, 'Проведите несколько часов на пляже Eden Island');
    c = c.replace(/schwimmen Sie im türkisfarbenen Wasser/g, 'плавайте в бирюзовой воде');
    c = c.replace(/entspannen Sie am Strand/g, 'или отдыхайте на пляже');
    c = c.replace(/Ein reichhaltiges Buffet mit lokalen und internationalen Speisen/g, 'Богатый буфет с местными и интернациональными блюдами');
    c = c.replace(/Nutzen Sie die verbleibende Zeit/g, 'Используйте оставшееся время');
    c = c.replace(/Schwimmen, Schnorcheln oder Entspannen/g, 'плавание, снорклинг или отдых');
    c = c.replace(/bevor Sie am Nachmittag mit dem Boot zurück zum Hafen fahren/g, 'прежде чем вернуться в порт на лодке во второй половине дня');
    c = c.replace(/anschließend zu Ihrem Hotel gebracht werden/g, 'и быть доставленным обратно в отель');
    c = c.replace(/Abholung direkt von Ihrem Hotel in einem privaten, klimatisierten Fahrzeug/g, 'Забор прямо из отеля в частном автомобиле с кондиционером');
    c = c.replace(/Transfer zum Hafen/g, 'трансфер до порта');
    c = c.replace(/Fahrt mit einem modernen Ausflugsboot/g, 'Поездка на современном экскурсионном катере');
    c = c.replace(/einer komfortablen Yacht/g, 'комфортабельной яхте');
    c = c.replace(/Richtung Orange Bay Island/g, 'к Orange Bay Island');
    c = c.replace(/Softdrinks sind an Bord inklusive/g, 'Безалкогольные напитки включены на борту');
    c = c.replace(/Zwei geführte Schnorchelstopps/g, 'Две остановки для снорклинга с гидом');
    c = c.replace(/an sorgfältig ausgewählten Riffen/g, 'у тщательно выбранных рифов');
    c = c.replace(/hervorragender Sicht/g, 'отличной видимостью');
    c = c.replace(/Komplette Schnorchelausrüstung wird gestellt/g, 'Полное снаряжение для снорклинга предоставляется');
    c = c.replace(/professionelle Betreuung inklusive/g, 'профессиональное сопровождение включено');
    c = c.replace(/Mehrere Stunden Freizeit auf der Insel/g, 'Несколько часов свободного времени на острове');
    c = c.replace(/Baden, Entspannen, Sonnen, Fotografieren/g, 'купание, отдых, загар, фотографирование');
    c = c.replace(/Genießen der einzigartigen Atmosphäre/g, 'и наслаждение уникальной атмосферой');
    c = c.replace(/Banana Boat und Sofa Boat/g, 'Банан и софа-боат');
    c = c.replace(/unter professioneller Aufsicht/g, 'под профессиональным наблюдением');
    c = c.replace(/moderner Sicherheitsausrüstung/g, 'современным защитным оборудованием');
    c = c.replace(/Frisch zubereitetes Mittagessen/g, 'Свежеприготовленный обед');
    c = c.replace(/alkoholfreien Getränken/g, 'безалкогольными напитками');
    c = c.replace(/an Bord oder auf der Insel/g, 'на борту или на острове');
    c = c.replace(/Abholung von Ihrem Hotel in Hurghada im klimatisierten Fahrzeug/g, 'Забор из отеля в Хургаде на автомобиле с кондиционером');
    c = c.replace(/Begrüßung, kurze Einweisung/g, 'Приветствие, краткий инструктаж');
    c = c.replace(/Fahrt über die Korallenriffe/g, 'Поездка над коралловыми рифами');
    c = c.replace(/direktem Blick in die Unterwasserwelt/g, 'с прямым видом на подводный мир');
    c = c.replace(/Geführtes Schnorcheln an einem ruhigen Riff/g, 'Снорклинг с гидом у спокойного рифа');
    c = c.replace(/Getränke genießen und Fotos machen/g, 'Наслаждайтесь напитками и делайте фото');
    c = c.replace(/Rückkehr zum Hafen/g, 'Возвращение в порт');
    c = c.replace(/Transfer zurück zu Ihrem Hotel/g, 'Трансфер обратно в отель');
    c = c.replace(/Bequemer Transfer von Ihrer Unterkunft/g, 'Комфортабельный трансфер из вашего жилья');
    c = c.replace(/Kurze Einführung/g, 'Краткое введение');
    c = c.replace(/nach der Tour/g, 'после экскурсии');
    c = c.replace(/ca\. /g, 'ок. ');
    c = c.replace(/Gesamt ca\./g, 'Всего ок.');
    c = c.replace(/fascinating /g, ''); // cleanup stray
    return { title: t, content: c };
  });
}

function makeHU(deSteps) {
  return deSteps.map(s => {
    let t = s.title, c = s.content;
    t = t.replace(/Uhr/g, '').trim();
    if (t === 'Abholung vom Hotel') t = 'Szállítás a szállodából';
    else if (t === 'Rückfahrt zum Hotel' || t === 'Rücktransfer zum Hotel' || t === 'Rückfahrt nach Hurghada') t = 'Visszaszállítás a szállodába';
    else if (t === 'Rückfahrt' || t === 'Rücktransfer') t = 'Visszautazás';
    else if (t.startsWith('Abholung')) t = t.replace('Abholung', 'Szállítás').replace(/\(.*?\)/g, '').trim();
    else if (t.startsWith('Rückfahrt')) t = 'Visszaút';
    else if (t.startsWith('Rückkehr')) t = 'Visszatérés';
    c = c.replace(/Ihr Guide holt Sie zwischen 09:00 und 10:00 Uhr ab/g, 'Idegenvezetője 09:00 és 10:00 között veszi fel Önt');
    c = c.replace(/Von Hurghada aus erreichen wir El Gouna nach etwa 30 Minuten/g, 'Hurghadából körülbelül 30 perc alatt érkezünk El Gounába');
    c = c.replace(/in einem privaten, klimatisierten Fahrzeug/g, 'privát, légkondicionált járművel');
    c = c.replace(/klimatisierten Privatfahrzeug/g, 'légkondicionált privát járművel');
    c = c.replace(/klimatisierten Fahrzeug/g, 'légkondicionált járművel');
    c = c.replace(/klimatisiertem Fahrzeug/g, 'légkondicionált járművel');
    c = c.replace(/klimatisierten Minibus/g, 'légkondicionált kisbusszal');
    c = c.replace(/komfortablen, klimatisierten/g, 'kényelmes, légkondicionált');
    c = c.replace(/bequem mit klimatisiertem Fahrzeug/g, 'kényelmesen légkondicionált járművel');
    c = c.replace(/Bequemer Transfer/g, 'Kényelmes transzfer');
    c = c.replace(/Abholung vom Hotel/g, 'Szállítás a szállodából');
    c = c.replace(/Abholung direkt von Ihrem Hotel/g, 'Szállítás közvetlenül a szállodából');
    c = c.replace(/Abholung von Ihrem Hotel/g, 'Szállítás a szállodájából');
    c = c.replace(/Abholung in Hurghada/g, 'Szállítás Hurghadában');
    c = c.replace(/Wir holen Sie bequem/g, 'Kényelmesen felvesszük Önt');
    c = c.replace(/direkt von Ihrem Hotel/g, 'közvetlenül a szállodájából');
    c = c.replace(/Ihr[\w\s]+Reiseleiter holt Sie/g, 'Idegenvezetője felveszi Önt');
    c = c.replace(/Ihr erfahrener, deutschsprachiger Reiseleiter holt Sie/g, 'Tapasztalt, német nyelvű idegenvezetője felveszi Önt');
    c = c.replace(/Persönliche Begrüßung/g, 'Személyes üdvözlés');
    c = c.replace(/kurze Einweisung/g, 'rövid tájékoztatás');
    c = c.replace(/Kurze Einführung/g, 'Rövid bevezető');
    c = c.replace(/dann beginnt Ihr Abenteuer/g, 'aztán kezdődik a kaland');
    c = c.replace(/danach beginnt Ihr Abenteuer/g, 'aztán kezdődik a kaland');
    c = c.replace(/Start der Bootstour/g, 'A hajóút kezdete');
    c = c.replace(/wird gestellt/g, 'biztosítva');
    c = c.replace(/wird bereitgestellt/g, 'biztosítva');
    c = c.replace(/— danach direkt auf das Quad/g, '— majd egyenesen a quadra');
    c = c.replace(/danach direkt auf das Quad/g, '— majd egyenesen a quadra');
    c = c.replace(/Fahren Sie über Sanddünen/g, 'Vezessen a homokdűnéken');
    c = c.replace(/erleben Sie echtes Offroad-Feeling/g, 'élje át az igazi off-road érzést');
    c = c.replace(/Einblick in die Kultur der Wüste/g, 'Betekintés a sivatag kultúrájába');
    c = c.replace(/traditionellem Tee/g, 'hagyományos teával');
    c = c.replace(/Kurzes, authentisches Erlebnis/g, 'Rövid, hiteles élmény');
    c = c.replace(/Entspannt zurück/g, 'Pihentető visszaút');
    c = c.replace(/nach Ihrer Tour/g, 'a túra után');
    c = c.replace(/Entspannen Sie an den weißen Sandstränden/g, 'Pihenjen a fehér homokos strandokon');
    c = c.replace(/schwimmen Sie im kristallklaren Wasser/g, 'ússzon a kristálytiszta vízben');
    c = c.replace(/schnorcheln Sie direkt vom Strand aus/g, 'vagy snorkeleljen közvetlenül a strandról');
    c = c.replace(/Liegen und Sonnenschirme stehen für Sie bereit/g, 'Napozóágyak és napernyők állnak rendelkezésre');
    c = c.replace(/mit vielen neuen Eindrücken/g, 'sok új élménnyel');
    c = c.replace(/glücklichen Erinnerungen/g, 'boldog emlékekkel');
    c = c.replace(/und bringen Sie sicher zum Hafen/g, 'és biztonságosan elviszi a kikötőbe');
    c = c.replace(/und bringt Sie sicher zum Hafen/g, 'és biztonságosan elviszi a kikötőbe');
    c = c.replace(/Genießen Sie den weiten Blick über das glitzernde Rote Meer/g, 'Élvezze a csillogó Vörös-tengerre nyíló kilátást');
    c = c.replace(/Spüren Sie die Meeresbrise/g, 'Érezze a tengeri szellőt');
    c = c.replace(/freuen Sie sich auf unvergessliche Momente/g, 'és örüljön a felejthetetlen pillanatoknak');
    c = c.replace(/Die Tour beginnt mit einer entspannten Bootsfahrt/g, 'A túra egy pihentető hajóúttal kezdődik');
    c = c.replace(/durch die berühmten Lagunen/g, 'a híres lagúnákon keresztül');
    c = c.replace(/Sie sehen Luxushotels/g, 'Luxusszállodákat lát');
    c = c.replace(/Villen & exklusive Wohngebiete/g, 'villákat és exkluzív lakóövezeteket');
    c = c.replace(/Inseln und Wasserwege/g, 'szigeteket és vízi utakat');
    c = c.replace(/den Yachthafen und architektonische Besonderheiten/g, 'a jachtkikötőt és építészeti különlegességeket');
    c = c.replace(/Ihr Reiseleiter erzählt Ihnen die Geschichte der Stadt/g, 'Idegenvezetője elmeséli a város történetét');
    c = c.replace(/spannende Details über die Gründerfamilie Sawiris/g, 'és izgalmas részleteket a Saviris alapító családról');
    c = c.replace(/In der Innenstadt erwarten Sie/g, 'A belvárosban kávézók, butikok');
    c = c.replace(/Cafés, Boutiquen, Kunsthandwerk/g, 'kézműves termékek');
    c = c.replace(/kleine Plätze/g, 'és kis terek várják');
    c = c.replace(/Sie schlendern entspannt/g, 'Ön lazán sétál');
    c = c.replace(/genießen das moderne Flair der Stadt/g, 'és élvezi a város modern hangulatát');
    c = c.replace(/Gemeinsam besuchen wir/g, 'Együtt meglátogatjuk');
    c = c.replace(/einige der wichtigsten Sehenswürdigkeiten/g, 'a legfontosabb látnivalók némelyikét');
    c = c.replace(/koptische Kirche, Große Moschee/g, 'a kopt templomot, a Nagymecsetet');
    c = c.replace(/Außenstelle der Bibliotheca Alexandrina/g, 'és az Alexandriai Könyvtár fiókintézményét');
    c = c.replace(/Eine ideale Mischung aus Kultur und moderner Stadtplanung/g, 'Ideális keveréke a kultúrának és a modern várostervezésnek');
    c = c.replace(/Eines der Highlights der Tour/g, 'A túra egyik fénypontja');
    c = c.replace(/Von oben sehen Sie das Meer/g, 'Felülről látja a tengert');
    c = c.replace(/die Lagunen, die Wüstenberge und die Marina/g, 'a lagúnákat, a sivatagi hegyeket és a marinát');
    c = c.replace(/Ein perfekter Ort für eindrucksvolle Fotos/g, 'Tökéletes hely lenyűgöző fotókhoz');
    c = c.replace(/Sie spazieren entlang der gepflegten Promenade/g, 'Sétál a gondozott sétányon');
    c = c.replace(/sehen Luxusyachten/g, 'luxusjachtokat lát');
    c = c.replace(/genießen die mediterrane Atmosphäre/g, 'és élvezi a mediterrán hangulatot');
    c = c.replace(/Wer möchte, kann noch einen Tee oder Kaffee/g, 'Aki szeretné, ihat egy teát vagy kávét');
    c = c.replace(/mit Blick auf die Boote trinken/g, 'a hajókra néző kilátással');
    c = c.replace(/Nach vielen schönen Eindrücken/g, 'Sok szép élmény után');
    c = c.replace(/fahren wir zurück nach Hurghada/g, 'visszautazunk Hurghadába');
    c = c.replace(/Tauch.*ein in das farbenfrohe Markttreiben/g, 'Merüljön el a színes piaci életben');
    c = c.replace(/erleben Sie die authentische Atmosphäre eines ägyptischen Basars/g, 'és élje át egy egyiptomi bazár autentikus hangulatát');
    c = c.replace(/Entdecken Sie traditionelle Produkte/g, 'Fedezze fel a hagyományos termékeket');
    c = c.replace(/handgemachte Lederwaren, Parfümöle/g, 'kézzel készített bőrárukat, parfüm olajokat');
    c = c.replace(/Papyrusrollen, Gewürze, Schmuck/g, 'papirusztekercseket, fűszereket, ékszereket');
    c = c.replace(/Nach einer erlebnisreichen Shoppingtour/g, 'Egy eseménydús vásárlási körút után');
    c = c.replace(/Rotes Meer zählt zu den schönsten Schnorchelgebieten weltweit/g, 'A Vörös-tenger a világ egyik legszebb snorkelező helye');
    c = c.replace(/Entdecken Sie farbenreiche Korallenriffe/g, 'Fedezze fel a színes korallzátonyokat');
    c = c.replace(/tropische Rifffische, Schildkröten, Rochen/g, 'trópusi halakat, teknősöket, rájákat');
    c = c.replace(/Napoleonfische bei klarem, warmem Wasser/g, 'és Napoleon halakat tiszta, meleg vízben');
    c = c.replace(/sehr guter Sicht/g, 'kiváló látási viszonyokkal');
    c = c.replace(/Aufenthalt an einer abgelegenen Insel/g, 'Tartózkodás egy távoli szigeten');
    c = c.replace(/hellem Sandstrand/g, 'világos homokos strandon');
    c = c.replace(/reichlich Zeit zum Schwimmen/g, 'bőven van idő úszásra');
    c = c.replace(/Sonnenbaden oder Entspannen/g, 'napozásra vagy pihenésre');
    c = c.replace(/Durch die private Organisation der Tour/g, 'A privát szervezésnek köszönhetően');
    c = c.replace(/vermeiden Sie Menschenansammlungen/g, 'elkerüli a tömeget');
    c = c.replace(/genießen die Natur in ruhiger Atmosphäre/g, 'és nyugodt légkörben élvezi a természetet');
    c = c.replace(/Auf der Rückfahrt erleben Sie den Sonnenuntergang/g, 'Visszaúton megéli a naplementét');
    c = c.replace(/Die besondere Lichtstimmung auf dem Wasser/g, 'A különleges fényjáték a vízen');
    c = c.replace(/macht diesen Moment zu einem stimmungsvollen Abschluss/g, 'ezt a pillanatot hangulatos befejezéssé teszi');
    c = c.replace(/Pünktliche Abholung/g, 'Pontos felvétel');
    c = c.replace(/Ausrüstung/g, 'felszerelés');
    c = c.replace(/Fahrt zu den besten Delfinplätzen/g, 'Utazás a legjobb delfin helyekre');
    c = c.replace(/Mit etwas Glück beobachten Sie Delfine in freier Wildbahn/g, 'Szerencsével delfineket figyelhet meg a vadonban');
    c = c.replace(/sofern die Bedingungen es erlauben/g, 'ha a körülmények engedik');
    c = c.replace(/gemeinsam mit ihnen schwimmen/g, 'úszhat velük');
    c = c.replace(/Delfine sind Wildtiere/g, 'A delfinek vadon élő állatok');
    c = c.replace(/Eine Sichtung kann nicht garantiert werden/g, 'A megfigyelés nem garantálható');
    c = c.replace(/die Erfolgsquote ist jedoch sehr hoch/g, 'de a sikerarány nagyon magas');
    c = c.replace(/Zwei Stopps an farbenprächtigen Riffen/g, 'Két megálló színes zátonyoknál');
    c = c.replace(/beeindruckender Unterwasserwelt/g, 'lenyűgöző víz alatti világgal');
    c = c.replace(/Entdecken Sie ein faszinierendes Schiffswrack/g, 'Fedezzen fel egy lenyűgöző hajóroncsot');
    c = c.replace(/einer beeindruckenden Unterwasserwelt voller Fische und Korallen/g, 'egy lenyűgöző víz alatti világot, tele halakkal és korallokkal');
    c = c.replace(/Gegen 12:00 Uhr Rückkehr/g, 'Visszaérkezés kb. 12:00-kor');
    c = c.replace(/Transfer ins Hotel/g, 'Transzfer a szállodába');
    c = c.replace(/Abholung in Hurghada, El Gouna, Makadi Bay, Soma Bay oder Safaga/g, 'Szállítás Hurghadában, El Gounában, Makadi Bay-ben, Soma Bay-ben vagy Safagában');
    c = c.replace(/Persönliche Begrüßung und Sicherheitseinweisung an Bord des privaten Bootes/g, 'Személyes üdvözlés és biztonsági tájékoztató a fedélzeten');
    c = c.replace(/1–2 Schnorchelgänge an den schönsten Riffen des Roten Meeres/g, '1–2 snorkelezés a Vörös-tenger legszebb zátonyainál');
    c = c.replace(/Orange Bay oder Magawish Insel/g, 'Orange Bay vagy Magawish-sziget');
    c = c.replace(/Freizeit, Mittagessen & Strandaufenthalt/g, 'szabadidő, ebéd és strandolás');
    c = c.replace(/Entspannung am Strand oder auf dem Boot/g, 'Pihenés a strandon vagy a hajón');
    c = c.replace(/Rückfahrt zum Hafen & Transfer zum Hotel/g, 'Vissza a kikötőbe és transzfer a szállodába');
    c = c.replace(/Ihr Tag beginnt zwischen 7:30 und 8:00 Uhr/g, 'A nap 07:30 és 08:00 között kezdődik');
    c = c.replace(/mit dem komfortablen Hoteltransfer zum Hafen/g, 'kényelmes transzferrel a szállodából a kikötőbe');
    c = c.replace(/Nach der Ausgabe Ihrer Schnorchelausrüstung/g, 'A snorkel felszerelés kiosztása után');
    c = c.replace(/startet die 40-minütige Bootsfahrt/g, 'elindul a 40 perces hajóút');
    c = c.replace(/zu den faszinierendsten Riffen rund um Eden Island/g, 'a leglenyűgözőbb zátonyokhoz Eden Island körül');
    c = c.replace(/Hier erwarten Sie bunte Korallenriffe und tropische Fische/g, 'Színes korallzátonyok és trópusi halak várják');
    c = c.replace(/ein Paradies für Schnorchler/g, 'egy paradicsom a snorkelezőknek');
    c = c.replace(/Verbringen Sie mehrere Stunden am Eden Island Beach/g, 'Töltsön több órát az Eden Island strandon');
    c = c.replace(/schwimmen Sie im türkisfarbenen Wasser/g, 'ússzon a türkizkék vízben');
    c = c.replace(/entspannen Sie am Strand/g, 'vagy pihenjen a strandon');
    c = c.replace(/Ein reichhaltiges Buffet mit lokalen und internationalen Speisen/g, 'Gazdag büfé helyi és nemzetközi ételekkel');
    c = c.replace(/Nutzen Sie die verbleibende Zeit/g, 'Használja a fennmaradó időt');
    c = c.replace(/Schwimmen, Schnorcheln oder Entspannen/g, 'úszásra, snorkelezésre vagy pihenésre');
    c = c.replace(/bevor Sie am Nachmittag mit dem Boot zurück zum Hafen fahren/g, 'mielőtt délután visszaindul a kikötőbe');
    c = c.replace(/anschließend zu Ihrem Hotel gebracht werden/g, 'majd visszaviszik a szállodájába');
    c = c.replace(/Abholung direkt von Ihrem Hotel in einem privaten, klimatisierten Fahrzeug/g, 'Szállítás közvetlenül a szállodából privát, légkondicionált járművel');
    c = c.replace(/Transfer zum Hafen/g, 'transzfer a kikötőbe');
    c = c.replace(/Fahrt mit einem modernen Ausflugsboot/g, 'Utazás modern kirándulóhajóval');
    c = c.replace(/einer komfortablen Yacht/g, 'kényelmes jachttal');
    c = c.replace(/Richtung Orange Bay Island/g, 'Orange Bay Island felé');
    c = c.replace(/Softdrinks sind an Bord inklusive/g, 'Üdítők a fedélzeten ingyenesek');
    c = c.replace(/Zwei geführte Schnorchelstopps/g, 'Két vezetett snorkelező megálló');
    c = c.replace(/an sorgfältig ausgewählten Riffen/g, 'gondosan kiválasztott zátonyoknál');
    c = c.replace(/hervorragender Sicht/g, 'kiváló látási viszonyokkal');
    c = c.replace(/Komplette Schnorchelausrüstung wird gestellt/g, 'Teljes snorkel felszerelés biztosított');
    c = c.replace(/professionelle Betreuung inklusive/g, 'szakmai felügyelettel');
    c = c.replace(/Mehrere Stunden Freizeit auf der Insel/g, 'Több óra szabadidő a szigeten');
    c = c.replace(/Baden, Entspannen, Sonnen, Fotografieren/g, 'úszás, pihenés, napozás, fotózás');
    c = c.replace(/Genießen der einzigartigen Atmosphäre/g, 'és az egyedülálló légkör élvezete');
    c = c.replace(/Banana Boat und Sofa Boat/g, 'Banánhajó és szófahajó');
    c = c.replace(/unter professioneller Aufsicht/g, 'szakmai felügyelet alatt');
    c = c.replace(/moderner Sicherheitsausrüstung/g, 'modern biztonsági felszereléssel');
    c = c.replace(/Frisch zubereitetes Mittagessen/g, 'Frissen készített ebéd');
    c = c.replace(/alkoholfreien Getränken/g, 'alkoholmentes italokkal');
    c = c.replace(/an Bord oder auf der Insel/g, 'a fedélzeten vagy a szigeten');
    c = c.replace(/Abholung von Ihrem Hotel in Hurghada im klimatisierten Fahrzeug/g, 'Szállítás a hurghadai szállodából légkondicionált járművel');
    c = c.replace(/Begrüßung, kurze Einweisung/g, 'Üdvözlés, rövid tájékoztatás');
    c = c.replace(/Fahrt über die Korallenriffe/g, 'Utazás a korallzátonyok felett');
    c = c.replace(/direktem Blick in die Unterwasserwelt/g, 'közvetlen rálátással a víz alatti világra');
    c = c.replace(/Geführtes Schnorcheln an einem ruhigen Riff/g, 'Vezetett snorkelezés egy csendes zátonynál');
    c = c.replace(/Getränke genießen und Fotos machen/g, 'Élvezze az italokat és készítsen fotókat');
    c = c.replace(/Rückkehr zum Hafen/g, 'Visszatérés a kikötőbe');
    c = c.replace(/Transfer zurück zu Ihrem Hotel/g, 'Transzfer vissza a szállodába');
    c = c.replace(/Bequemer Transfer von Ihrer Unterkunft/g, 'Kényelmes transzfer a szállásáról');
    c = c.replace(/Kurze Einführung/g, 'Rövid bemutató');
    c = c.replace(/nach der Tour/g, 'a túra után');
    c = c.replace(/ca\. /g, 'kb. ');
    c = c.replace(/Gesamt ca\./g, 'Összesen kb.');
    return { title: t, content: c };
  });
}

function makeAR(deSteps) {
  return deSteps.map(s => {
    let t = s.title, c = s.content;
    // Format times in Arabic
    t = t.replace(/(\d{2}:\d{2})/g, (m) => {
      const h = parseInt(m.split(':')[0]);
      return h < 12 ? `${m} صباحاً` : `${m} مساءً`;
    });
    t = t.replace(/ –/g, ' – ');
    t = t.replace(/Uhr/g, '').trim();
    if (t === 'Abholung vom Hotel') t = 'الاستلام من الفندق';
    else if (t === 'Rückfahrt zum Hotel' || t === 'Rücktransfer zum Hotel' || t === 'Rückfahrt nach Hurghada') t = 'العودة إلى الفندق';
    else if (t === 'Rückfahrt' || t === 'Rücktransfer') t = 'العودة';
    else if (t.startsWith('Abholung')) t = t.replace('Abholung', 'الاستلام').replace(/\(.*?\)/g, '').trim();
    else if (t.startsWith('Rückfahrt')) t = 'رحلة العودة';
    else if (t.startsWith('Rückkehr')) t = 'العودة';
    // Arabic content
    c = c.replace(/Ihr Guide holt Sie zwischen 09:00 und 10:00 Uhr ab/g, 'مرشدك السياحي يستقبلك بين الساعة 09:00 و10:00 صباحاً');
    c = c.replace(/Von Hurghada aus erreichen wir El Gouna nach etwa 30 Minuten/g, 'من الغردقة نصل إلى الجونة بعد حوالي 30 دقيقة');
    c = c.replace(/in einem privaten, klimatisierten Fahrzeug/g, 'في مركبة خاصة مكيفة');
    c = c.replace(/klimatisierten Privatfahrzeug/g, 'مركبة خاصة مكيفة');
    c = c.replace(/klimatisierten Fahrzeug/g, 'مركبة مكيفة');
    c = c.replace(/klimatisiertem Fahrzeug/g, 'مركبة مكيفة');
    c = c.replace(/klimatisierten Minibus/g, 'حافلة صغيرة مكيفة');
    c = c.replace(/komfortablen, klimatisierten/g, 'مريحة ومكيفة');
    c = c.replace(/bequem mit klimatisiertem Fahrzeug/g, 'بكل راحة في مركبة مكيفة');
    c = c.replace(/Bequemer Transfer/g, 'نقل مريح');
    c = c.replace(/Abholung vom Hotel/g, 'الاستلام من الفندق');
    c = c.replace(/Abholung direkt von Ihrem Hotel/g, 'الاستلام مباشرة من فندقك');
    c = c.replace(/Abholung von Ihrem Hotel/g, 'الاستلام من فندقك');
    c = c.replace(/Abholung in Hurghada/g, 'الاستلام في الغردقة');
    c = c.replace(/Wir holen Sie bequem/g, 'نستقبلك بكل راحة');
    c = c.replace(/direkt von Ihrem Hotel/g, 'مباشرة من فندقك');
    c = c.replace(/Ihr[\w\s]+Reiseleiter holt Sie/g, 'مرشدك السياحي يستقبلك');
    c = c.replace(/Ihr erfahrener, deutschsprachiger Reiseleiter holt Sie/g, 'مرشدك السياحي ذو الخبرة والناطق بالألمانية يستقبلك');
    c = c.replace(/Persönliche Begrüßung/g, 'ترحيب شخصي');
    c = c.replace(/kurze Einweisung/g, 'إيجاز قصير');
    c = c.replace(/Kurze Einführung/g, 'مقدمة قصيرة');
    c = c.replace(/dann beginnt Ihr Abenteuer/g, 'ثم تبدأ مغامرتك');
    c = c.replace(/danach beginnt Ihr Abenteuer/g, 'ثم تبدأ مغامرتك');
    c = c.replace(/Start der Bootstour/g, 'بداية جولة القارب');
    c = c.replace(/wird gestellt/g, 'متوفر');
    c = c.replace(/wird bereitgestellt/g, 'متوفر');
    c = c.replace(/— danach direkt auf das Quad/g, '— ثم مباشرة على الدراجة الرباعية');
    c = c.replace(/danach direkt auf das Quad/g, '— ثم مباشرة على الدراجة الرباعية');
    c = c.replace(/Fahren Sie über Sanddünen/g, 'قد عبر الكثبان الرملية');
    c = c.replace(/erleben Sie echtes Offroad-Feeling/g, 'واختبر شعور القيادة على الطرق الوعرة');
    c = c.replace(/Einblick in die Kultur der Wüste/g, 'اطّلع على ثقافة الصحراء');
    c = c.replace(/traditionellem Tee/g, 'الشاي التقليدي');
    c = c.replace(/Kurzes, authentisches Erlebnis/g, 'تجربة أصيلة قصيرة');
    c = c.replace(/Entspannt zurück/g, 'عودة مريحة');
    c = c.replace(/nach Ihrer Tour/g, 'بعد جولتك');
    c = c.replace(/Entspannen Sie an den weißen Sandstränden/g, 'استرخِ على الشواطئ الرملية البيضاء');
    c = c.replace(/schwimmen Sie im kristallklaren Wasser/g, 'اسبح في المياه الصافية');
    c = c.replace(/schnorcheln Sie direkt vom Strand aus/g, 'أو غص بالسنوركل مباشرة من الشاطئ');
    c = c.replace(/Liegen und Sonnenschirme stehen für Sie bereit/g, 'كراسي الاستلقاء والمظلات في انتظارك');
    c = c.replace(/mit vielen neuen Eindrücken/g, 'بالعديد من الانطباعات الجديدة');
    c = c.replace(/glücklichen Erinnerungen/g, 'ذكريات سعيدة');
    c = c.replace(/und bringen Sie sicher zum Hafen/g, 'ويوصلك بأمان إلى الميناء');
    c = c.replace(/und bringt Sie sicher zum Hafen/g, 'ويوصلك بأمان إلى الميناء');
    c = c.replace(/Genießen Sie den weiten Blick über das glitzernde Rote Meer/g, 'استمتع بالمنظر الواسع للبحر الأحمر المتلألئ');
    c = c.replace(/Spüren Sie die Meeresbrise/g, 'اشعر بنسيم البحر');
    c = c.replace(/freuen Sie sich auf unvergessliche Momente/g, 'وتطلع إلى لحظات لا تُنسى');
    c = c.replace(/Die Tour beginnt mit einer entspannten Bootsfahrt/g, 'تبدأ الجولة برحلة قارب هادئة');
    c = c.replace(/durch die berühmten Lagunen/g, 'عبر البحيرات الشهيرة');
    c = c.replace(/Sie sehen Luxushotels/g, 'سترى فنادق فاخرة');
    c = c.replace(/Villen & exklusive Wohngebiete/g, 'فيلات ومناطق سكنية حصرية');
    c = c.replace(/Inseln und Wasserwege/g, 'جزر وممرات مائية');
    c = c.replace(/den Yachthafen und architektonische Besonderheiten/g, 'مرسى اليخوت والمعالم المعمارية');
    c = c.replace(/Ihr Reiseleiter erzählt Ihnen die Geschichte der Stadt/g, 'يروي لك مرشدك قصة المدينة');
    c = c.replace(/spannende Details über die Gründerfamilie Sawiris/g, 'وتفاصيل مثيرة عن عائلة ساويرس المؤسسة');
    c = c.replace(/In der Innenstadt erwarten Sie/g, 'في وسط المدينة تنتظرك');
    c = c.replace(/Cafés, Boutiquen, Kunsthandwerk/g, 'مقاهٍ ومتاجر وحرف يدوية');
    c = c.replace(/kleine Plätze/g, 'وساحات صغيرة');
    c = c.replace(/Sie schlendern entspannt/g, 'تتجول باسترخاء');
    c = c.replace(/genießen das moderne Flair der Stadt/g, 'وتستمتع بأجواء المدينة العصرية');
    c = c.replace(/Gemeinsam besuchen wir/g, 'معاً نزور');
    c = c.replace(/einige der wichtigsten Sehenswürdigkeiten/g, 'بعضاً من أهم المعالم');
    c = c.replace(/koptische Kirche, Große Moschee/g, 'الكنيسة القبطية، المسجد الكبير');
    c = c.replace(/Außenstelle der Bibliotheca Alexandrina/g, 'وفرع مكتبة الإسكندرية');
    c = c.replace(/Eine ideale Mischung aus Kultur und moderner Stadtplanung/g, 'مزيج مثالي من الثقافة والتخطيط الحضري الحديث');
    c = c.replace(/Eines der Highlights der Tour/g, 'واحدة من أبرز محطات الجولة');
    c = c.replace(/Von oben sehen Sie das Meer/g, 'من الأعلى ترى البحر');
    c = c.replace(/die Lagunen, die Wüstenberge und die Marina/g, 'البحيرات وجبال الصحراء والمارينا');
    c = c.replace(/Ein perfekter Ort für eindrucksvolle Fotos/g, 'مكان مثالي لصور رائعة');
    c = c.replace(/Sie spazieren entlang der gepflegten Promenade/g, 'تتمشى على الكورنيش المُعتنى به');
    c = c.replace(/sehen Luxusyachten/g, 'ترى يخوتاً فاخرة');
    c = c.replace(/genießen die mediterrane Atmosphäre/g, 'وتستمتع بالأجواء المتوسطية');
    c = c.replace(/Wer möchte, kann noch einen Tee oder Kaffee/g, 'من أراد يمكنه تناول شاي أو قهوة');
    c = c.replace(/mit Blick auf die Boote trinken/g, 'مع إطلالة على القوارب');
    c = c.replace(/Nach vielen schönen Eindrücken/g, 'بعد العديد من الانطباعات الجميلة');
    c = c.replace(/fahren wir zurück nach Hurghada/g, 'نعود إلى الغردقة');
    c = c.replace(/Tauch.*ein in das farbenfrohe Markttreiben/g, 'انغمس في أجواء السوق الملونة');
    c = c.replace(/erleben Sie die authentische Atmosphäre eines ägyptischen Basars/g, 'وعش الأجواء الأصيلة لسوق مصري');
    c = c.replace(/Entdecken Sie traditionelle Produkte/g, 'اكتشف المنتجات التقليدية');
    c = c.replace(/handgemachte Lederwaren, Parfümöle/g, 'المنتجات الجلدية اليدوية، زيوت العطور');
    c = c.replace(/Papyrusrollen, Gewürze, Schmuck/g, 'لفائف البردي، التوابل، المجوهرات');
    c = c.replace(/Nach einer erlebnisreichen Shoppingtour/g, 'بعد جولة تسوق مليئة بالخبرات');
    c = c.replace(/Rotes Meer zählt zu den schönsten Schnorchelgebieten weltweit/g, 'البحر الأحمر من أجمل مناطق الغطس بالسنوركل في العالم');
    c = c.replace(/Entdecken Sie farbenreiche Korallenriffe/g, 'اكتشف الشعاب المرجانية الملونة');
    c = c.replace(/tropische Rifffische, Schildkröten, Rochen/g, 'أسماك الشعاب الاستوائية، السلاحف، الراي اللساع');
    c = c.replace(/Napoleonfische bei klarem, warmem Wasser/g, 'وأسماك النابليون في ماء دافئ وصافٍ');
    c = c.replace(/sehr guter Sicht/g, 'رؤية ممتازة');
    c = c.replace(/Aufenthalt an einer abgelegenen Insel/g, 'التوقف في جزيرة نائية');
    c = c.replace(/hellem Sandstrand/g, 'برمال الشاطئ الفاتحة');
    c = c.replace(/reichlich Zeit zum Schwimmen/g, 'وقت كافٍ للسباحة');
    c = c.replace(/Sonnenbaden oder Entspannen/g, 'للاستحمام الشمسي أو الاسترخاء');
    c = c.replace(/Durch die private Organisation der Tour/g, 'بفضل التنظيم الخاص');
    c = c.replace(/vermeiden Sie Menschenansammlungen/g, 'تتجنب الزحام');
    c = c.replace(/genießen die Natur in ruhiger Atmosphäre/g, 'وتستمتع بالطبيعة في جو هادئ');
    c = c.replace(/Auf der Rückfahrt erleben Sie den Sonnenuntergang/g, 'في طريق العودة تشاهد غروب الشمس');
    c = c.replace(/Die besondere Lichtstimmung auf dem Wasser/g, 'أجواء الضوء الخاصة على الماء');
    c = c.replace(/macht diesen Moment zu einem stimmungsvollen Abschluss/g, 'تجعل من هذه اللحظة ختاماً عاطفياً');
    c = c.replace(/Pünktliche Abholung/g, 'استلام دقيق');
    c = c.replace(/Ausrüstung/g, 'معدات');
    c = c.replace(/Fahrt zu den besten Delfinplätzen/g, 'رحلة إلى أفضل أماكن الدلافين');
    c = c.replace(/Mit etwas Glück beobachten Sie Delfine in freier Wildbahn/g, 'بالحظ قد تشاهد دلافين في البرية');
    c = c.replace(/sofern die Bedingungen es erlauben/g, 'إذا سمحت الظروف');
    c = c.replace(/gemeinsam mit ihnen schwimmen/g, 'السباحة معها');
    c = c.replace(/Delfine sind Wildtiere/g, 'الدلافين حيوانات برية');
    c = c.replace(/Eine Sichtung kann nicht garantiert werden/g, 'لا يمكن ضمان المشاهدة');
    c = c.replace(/die Erfolgsquote ist jedoch sehr hoch/g, 'لكن نسبة النجاح عالية جداً');
    c = c.replace(/Zwei Stopps an farbenprächtigen Riffen/g, 'محطتان عند شعاب مرجانية ملونة');
    c = c.replace(/beeindruckender Unterwasserwelt/g, 'عالم تحت الماء مذهل');
    c = c.replace(/Entdecken Sie ein faszinierendes Schiffswrack/g, 'اكتشف حطام سفينة رائع');
    c = c.replace(/einer beeindruckenden Unterwasserwelt voller Fische und Korallen/g, 'عالم تحت الماء مذهل مليء بالأسماك والمرجان');
    c = c.replace(/Gegen 12:00 Uhr Rückkehr/g, 'العودة حوالي الساعة 12:00');
    c = c.replace(/Transfer ins Hotel/g, 'نقل إلى الفندق');
    c = c.replace(/Abholung in Hurghada, El Gouna, Makadi Bay, Soma Bay oder Safaga/g, 'الاستلام من الغردقة، الجونة، خليج ماكادي، خليج سوما أو سفاجا');
    c = c.replace(/Persönliche Begrüßung und Sicherheitseinweisung an Bord des privaten Bootes/g, 'ترحيب شخصي وتعليمات السلامة على متن القارب الخاص');
    c = c.replace(/1–2 Schnorchelgänge an den schönsten Riffen des Roten Meeres/g, '1–2 جولة غطس بأجمل شعاب البحر الأحمر');
    c = c.replace(/Orange Bay oder Magawish Insel/g, 'أورانج باي أو جزيرة مجاويش');
    c = c.replace(/Freizeit, Mittagessen & Strandaufenthalt/g, 'وقت حر، غداء واسترخاء على الشاطئ');
    c = c.replace(/Entspannung am Strand oder auf dem Boot/g, 'استرخاء على الشاطئ أو على القارب');
    c = c.replace(/Rückfahrt zum Hafen & Transfer zum Hotel/g, 'العودة إلى الميناء والنقل إلى الفندق');
    c = c.replace(/Ihr Tag beginnt zwischen 7:30 und 8:00 Uhr/g, 'يبدأ يومك بين 07:30 و08:00 صباحاً');
    c = c.replace(/mit dem komfortablen Hoteltransfer zum Hafen/g, 'مع نقل مريح من الفندق إلى الميناء');
    c = c.replace(/Nach der Ausgabe Ihrer Schnorchelausrüstung/g, 'بعد توزيع معدات الغطس');
    c = c.replace(/startet die 40-minütige Bootsfahrt/g, 'تبدأ رحلة القارب التي تستغرق 40 دقيقة');
    c = c.replace(/zu den faszinierendsten Riffen rund um Eden Island/g, 'إلى أروع الشعاب المرجانية حول جزيرة إيدن');
    c = c.replace(/Hier erwarten Sie bunte Korallenriffe und tropische Fische/g, 'الشعاب المرجانية الملونة والأسماك الاستوائية في انتظارك');
    c = c.replace(/ein Paradies für Schnorchler/g, 'جنة لعشاق الغطس');
    c = c.replace(/Verbringen Sie mehrere Stunden am Eden Island Beach/g, 'اقضِ عدة ساعات على شاطئ جزيرة إيدن');
    c = c.replace(/schwimmen Sie im türkisfarbenen Wasser/g, 'اسبح في الماء الفيروزي');
    c = c.replace(/entspannen Sie am Strand/g, 'أو استرخِ على الشاطئ');
    c = c.replace(/Ein reichhaltiges Buffet mit lokalen und internationalen Speisen/g, 'بوفيه غني بالأطباق المحلية والعالمية');
    c = c.replace(/Nutzen Sie die verbleibende Zeit/g, 'استغل الوقت المتبقي');
    c = c.replace(/Schwimmen, Schnorcheln oder Entspannen/g, 'للسباحة أو الغطس أو الاسترخاء');
    c = c.replace(/bevor Sie am Nachmittag mit dem Boot zurück zum Hafen fahren/g, 'قبل العودة بالقارب إلى الميناء في فترة ما بعد الظهر');
    c = c.replace(/anschließend zu Ihrem Hotel gebracht werden/g, 'ثم تُنقل إلى فندقك');
    c = c.replace(/Abholung direkt von Ihrem Hotel in einem privaten, klimatisierten Fahrzeug/g, 'الاستلام مباشرة من فندقك بمركبة خاصة مكيفة');
    c = c.replace(/Transfer zum Hafen/g, 'نقل إلى الميناء');
    c = c.replace(/Fahrt mit einem modernen Ausflugsboot/g, 'ركوب قارب سياحي حديث');
    c = c.replace(/einer komfortablen Yacht/g, 'يخت مريح');
    c = c.replace(/Richtung Orange Bay Island/g, 'باتجاه جزيرة أورانج باي');
    c = c.replace(/Softdrinks sind an Bord inklusive/g, 'المشروبات الغازية متضمنة على متن القارب');
    c = c.replace(/Zwei geführte Schnorchelstopps/g, 'محطتان للغطس بإرشاد');
    c = c.replace(/an sorgfältig ausgewählten Riffen/g, 'عند شعاب مختارة بعناية');
    c = c.replace(/hervorragender Sicht/g, 'مع رؤية ممتازة');
    c = c.replace(/Komplette Schnorchelausrüstung wird gestellt/g, 'معدات الغطس الكاملة متوفرة');
    c = c.replace(/professionelle Betreuung inklusive/g, 'مع إشراف محترف');
    c = c.replace(/Mehrere Stunden Freizeit auf der Insel/g, 'عدة ساعات من الوقت الحر في الجزيرة');
    c = c.replace(/Baden, Entspannen, Sonnen, Fotografieren/g, 'سباحة، استرخاء، حمام شمسي، تصوير');
    c = c.replace(/Genießen der einzigartigen Atmosphäre/g, 'والاستمتاع بالأجواء الفريدة');
    c = c.replace(/Banana Boat und Sofa Boat/g, 'قارب الموز وقارب الصوفا');
    c = c.replace(/unter professioneller Aufsicht/g, 'تحت إشراف محترف');
    c = c.replace(/moderner Sicherheitsausrüstung/g, 'معدات أمان حديثة');
    c = c.replace(/Frisch zubereitetes Mittagessen/g, 'غداء طازج');
    c = c.replace(/alkoholfreien Getränken/g, 'مشروبات غير كحولية');
    c = c.replace(/an Bord oder auf der Insel/g, 'على متن القارب أو في الجزيرة');
    c = c.replace(/Abholung von Ihrem Hotel in Hurghada im klimatisierten Fahrzeug/g, 'الاستلام من فندقك في الغردقة بمركبة مكيفة');
    c = c.replace(/Begrüßung, kurze Einweisung/g, 'ترحيب، إيجاز قصير');
    c = c.replace(/Fahrt über die Korallenriffe/g, 'ركوب فوق الشعاب المرجانية');
    c = c.replace(/direktem Blick in die Unterwasserwelt/g, 'مع إطلالة مباشرة على عالم تحت الماء');
    c = c.replace(/Geführtes Schnorcheln an einem ruhigen Riff/g, 'غطس بإرشاد عند شعاب هادئة');
    c = c.replace(/Getränke genießen und Fotos machen/g, 'استمتع بالمشروبات والتقط الصور');
    c = c.replace(/Rückkehr zum Hafen/g, 'العودة إلى الميناء');
    c = c.replace(/Transfer zurück zu Ihrem Hotel/g, 'نقل العودة إلى فندقك');
    c = c.replace(/Bequemer Transfer von Ihrer Unterkunft/g, 'نقل مريح من مكان إقامتك');
    c = c.replace(/Kurze Einführung/g, 'مقدمة قصيرة');
    c = c.replace(/nach der Tour/g, 'بعد الجولة');
    c = c.replace(/ca\. /g, 'تقريباً ');
    c = c.replace(/Gesamt ca\./g, 'المجموع تقريباً');
    return { title: t, content: c };
  });
}

// ─── TOUR DATA ───

const tours = {
  'el-gouna-private-stadtrundfahrt-mit-lagunenfahrt-aussichtsturm': {
    en: [
      { title: 'Hotel Pickup', content: 'Your guide picks you up between 09:00 AM and 10:00 AM in a private, air-conditioned vehicle. From Hurghada we reach El Gouna after approximately 30 minutes.' },
      { title: 'Lagoon Cruise through El Gouna', content: 'The tour begins with a relaxed boat ride through the famous lagoons. You will see luxury hotels, villas and exclusive residential areas, islands and waterways, the yacht harbor and architectural highlights. Your guide tells you the history of the city and exciting details about the Sawiris founding family.' },
      { title: 'Downtown El Gouna', content: 'In the city center you will find cafés, boutiques, handicrafts and small squares. You stroll relaxed and enjoy the modern flair of the city.' },
      { title: 'Culture & Architecture', content: 'Together we visit some of the most important sights: the Coptic Church, the Great Mosque and the Bibliotheca Alexandrina branch. An ideal mix of culture and modern urban planning.' },
      { title: 'The Observation Tower', content: 'One of the tour highlights. From above you see the sea, the lagoons, the desert mountains and the marina. A perfect spot for impressive photos.' },
      { title: 'Abu Tig Marina', content: 'You stroll along the well-kept promenade, see luxury yachts and enjoy the Mediterranean atmosphere. If you like, you can have tea or coffee with a view of the boats (optional).' },
      { title: 'Return Transfer to Hotel', content: 'After many wonderful impressions we drive back to Hurghada.' },
    ],
    fr: [
      { title: 'Prise en charge à l\'hôtel', content: 'Votre guide vous prend en charge entre 09h00 et 10h00 dans un véhicule privé climatisé. Depuis Hurghada, nous rejoignons El Gouna en environ 30 minutes.' },
      { title: 'Croisière dans les lagunes d\'El Gouna', content: 'La excursion commence par une promenade en bateau relaxante à travers les célèbres lagunes. Vous verrez des hôtels de luxe, des villas et des quartiers résidentiels exclusifs, des îles et des voies navigables, le port de plaisance et les particularités architecturales. Votre guide vous raconte l\'histoire de la ville et des détails passionnants sur la famille fondatrice Sawiris.' },
      { title: 'Centre-ville d\'El Gouna', content: 'Dans le centre-ville, vous trouverez des cafés, des boutiques, de l\'artisanat et des petites places. Vous flânez tranquillement et profitez de l\'ambiance moderne de la ville.' },
      { title: 'Culture & Architecture', content: 'Ensemble, nous visitons quelques-uns des sites les plus importants : l\'église copte, la Grande Mosquée et l\'annexe de la Bibliotheca Alexandrina. Un mélange idéal de culture et d\'urbanisme moderne.' },
      { title: 'La Tour d\'Observation', content: 'L\'un des points forts de la excursion. D\'en haut, vous voyez la mer, les lagunes, les montagnes du désert et la marina. Un endroit parfait pour des photos impressionnantes.' },
      { title: 'Marina d\'Abu Tig', content: 'Vous vous promenez le long de la promenade bien entretenue, voyez des yachts de luxe et profitez de l\'atmosphère méditerranéenne. Si vous le souhaitez, vous pouvez prendre un thé ou un café avec vue sur les bateaux (optionnel).' },
      { title: 'Retour à l\'hôtel', content: 'Après de nombreuses belles impressions, nous retournons à Hurghada.' },
    ],
    ru: [
      { title: 'Забор из отеля', content: 'Ваш гид заберёт вас между 09:00 и 10:00 в частном автомобиле с кондиционером. Из Хургады мы добираемся до Эль-Гуны примерно за 30 минут.' },
      { title: 'Прогулка по лагунам Эль-Гуны', content: 'Экскурсия начинается с расслабленной прогулки на лодке по знаменитым лагунам. Вы увидите роскошные отели, виллы и эксклюзивные жилые районы, острова и водные пути, яхтенную гавань и архитектурные особенности. Ваш гид расскажет вам историю города и увлекательные подробности о семье основателей Савирис.' },
      { title: 'Центр Эль-Гуны', content: 'В центре города вас ждут кафе, бутики, ремесленные изделия и маленькие площади. Вы непринуждённо прогуливаетесь и наслаждаетесь современным колоритом города.' },
      { title: 'Культура и архитектура', content: 'Вместе мы посещаем некоторые из самых важных достопримечательностей: коптскую церковь, Большую мечеть и филиал Библиотеки Александрины. Идеальное сочетание культуры и современного градостроительства.' },
      { title: 'Смотровая башня', content: 'Одна из главных достопримечательностей экскурсии. Сверху вы видите море, лагуны, пустынные горы и марину. Идеальное место для впечатляющих фотографий.' },
      { title: 'Абу-Тиг Марина', content: 'Вы прогуливаетесь по ухоженной набережной, видите роскошные яхты и наслаждаетесь средиземноморской атмосферой. По желанию можно выпить чай или кофе с видом на лодки (опционально).' },
      { title: 'Обратный трансфер в отель', content: 'После множества прекрасных впечатлений мы возвращаемся в Хургаду.' },
    ],
    hu: [
      { title: 'Szállítás a szállodából', content: 'Idegenvezetője 09:00 és 10:00 között veszi fel Önt egy privát, légkondicionált járművel. Hurghadából körülbelül 30 perc alatt érkezünk El Gounába.' },
      { title: 'Lagúnahajózás El Gounában', content: 'A túra egy pihentető hajóúttal kezdődik a híres lagúnákon keresztül. Luxusszállodákat, villákat és exkluzív lakóövezeteket, szigeteket és vízi utakat, a jachtkikötőt és építészeti különlegességeket lát. Idegenvezetője elmeséli a város történetét és izgalmas részleteket a Saviris alapító családról.' },
      { title: 'El Gouna belvárosa', content: 'A belvárosban kávézók, butikok, kézműves termékek és kis terek várják. Ön lazán sétál és élvezi a város modern hangulatát.' },
      { title: 'Kultúra és építészet', content: 'Együtt meglátogatjuk a legfontosabb látnivalók némelyikét: a kopt templomot, a Nagymecsetet és az Alexandriai Könyvtár fiókintézményét. Ideális keveréke a kultúrának és a modern várostervezésnek.' },
      { title: 'A kilátótorony', content: 'A túra egyik fénypontja. Felülről látja a tengert, a lagúnákat, a sivatagi hegyeket és a marinát. Tökéletes hely lenyűgöző fotókhoz.' },
      { title: 'Abu Tig Marina', content: 'Sétál a gondozott sétányon, luxusjachtokat lát és élvezi a mediterrán hangulatot. Aki szeretné, ihat egy teát vagy kávét a hajókra néző kilátással (opcionális).' },
      { title: 'Visszaszállítás a szállodába', content: 'Sok szép élmény után visszautazunk Hurghadába.' },
    ],
    ar: [
      { title: 'الاستلام من الفندق', content: 'مرشدك السياحي يستقبلك بين الساعة 09:00 و10:00 صباحاً في مركبة خاصة مكيفة. من الغردقة نصل إلى الجونة بعد حوالي 30 دقيقة.' },
      { title: 'جولة بحرية في بحيرات الجونة', content: 'تبدأ الجولة برحلة قارب هادئة عبر البحيرات الشهيرة. سترى فنادق فاخرة، فيلات ومناطق سكنية حصرية، جزر وممرات مائية، مرسى اليخوت والمعالم المعمارية. يروي لك مرشدك قصة المدينة وتفاصيل مثيرة عن عائلة ساويرس المؤسسة.' },
      { title: 'وسط مدينة الجونة', content: 'في وسط المدينة تنتظرك مقاهٍ ومتاجر وحرف يدوية وساحات صغيرة. تتجول باسترخاء وتستمتع بأجواء المدينة العصرية.' },
      { title: 'الثقافة والهندسة المعمارية', content: 'معاً نزور بعضاً من أهم المعالم: الكنيسة القبطية، المسجد الكبير وفرع مكتبة الإسكندرية. مزيج مثالي من الثقافة والتخطيط الحضري الحديث.' },
      { title: 'برج المراقبة', content: 'واحدة من أبرز محطات الجولة. من الأعلى ترى البحر والبحيرات وجبال الصحراء والمارينا. مكان مثالي لصور رائعة.' },
      { title: 'مرسى أبو تيج', content: 'تتمشى على الكورنيش المُعتنى به، ترى يخوتاً فاخرة وتستمتع بالأجواء المتوسطية. من أراد يمكنه تناول شاي أو قهوة مع إطلالة على القوارب (اختياري).' },
      { title: 'العودة إلى الفندق', content: 'بعد العديد من الانطباعات الجميلة نعود إلى الغردقة.' },
    ],
  },
  'privater-tagesausflug-ab-hurghada-dendera-abydos-tempel': {
    en: [
      { title: 'Pickup (approx. 04:00 AM – 04:30 AM)', content: 'Pickup from your hotel in Hurghada.' },
      { title: 'Drive to Dendera', content: 'Drive to Dendera (approx. 250 km).' },
      { title: 'Visit Hathor Temple', content: 'Approximately 2 hours of sightseeing at the Hathor Temple.' },
      { title: 'Continue to Abydos', content: 'Continue to Abydos (approx. 100 km).' },
      { title: 'Lunch in Abydos', content: 'Lunch in Abydos.' },
      { title: 'Visit Abydos Temple', content: 'Approximately 2 hours of sightseeing at the Abydos Temple.' },
      { title: 'Return to Hurghada', content: 'Return to Hurghada. Total approx. 13 hours.' },
    ],
    fr: [
      { title: 'Prise en charge (04h00–04h30)', content: 'Prise en charge à votre hôtel à Hurghada.' },
      { title: 'Trajet vers Dendéra', content: 'Trajet vers Dendéra (environ 250 km).' },
      { title: 'Visite du temple d\'Hathor', content: 'Environ 2 heures de visite du temple d\'Hathor.' },
      { title: 'Route vers Abydos', content: 'Route vers Abydos (environ 100 km).' },
      { title: 'Déjeuner à Abydos', content: 'Déjeuner à Abydos.' },
      { title: 'Visite du temple d\'Abydos', content: 'Environ 2 heures de visite du temple d\'Abydos.' },
      { title: 'Retour à Hurghada', content: 'Retour à Hurghada. Total environ 13 heures.' },
    ],
    ru: [
      { title: 'Забор (04:00–04:30)', content: 'Забор из отеля в Хургаде.' },
      { title: 'Поездка в Дендеру', content: 'Поездка в Дендеру (ок. 250 км).' },
      { title: 'Осмотр храма Хатхор', content: 'Около 2 часов осмотра храма Хатхор.' },
      { title: 'Продолжение в Абидос', content: 'Продолжение в Абидос (ок. 100 км).' },
      { title: 'Обед в Абидосе', content: 'Обед в Абидосе.' },
      { title: 'Осмотр храма Абидоса', content: 'Около 2 часов осмотра храма Абидоса.' },
      { title: 'Возвращение в Хургаду', content: 'Возвращение в Хургаду. Всего ок. 13 часов.' },
    ],
    hu: [
      { title: 'Szállítás (kb. 04:00–04:30)', content: 'Szállítás a hurghadai szállodából.' },
      { title: 'Utazás Denderába', content: 'Utazás Denderába (kb. 250 km).' },
      { title: 'Hathor templomának megtekintése', content: 'Kb. 2 óra a Hathor-templom megtekintésére.' },
      { title: 'Tovább Abüdoszba', content: 'Továbbutazás Abüdoszba (kb. 100 km).' },
      { title: 'Ebéd Abüdoszban', content: 'Ebéd Abüdoszban.' },
      { title: 'Abüdosz templomának megtekintése', content: 'Kb. 2 óra az Abüdosz-templom megtekintésére.' },
      { title: 'Vissza Hurghadába', content: 'Vissza Hurghadába. Összesen kb. 13 óra.' },
    ],
    ar: [
      { title: 'الاستلام (04:00–04:30 صباحاً)', content: 'الاستلام من فندقك في الغردقة.' },
      { title: 'القيادة إلى دندرة', content: 'القيادة إلى دندرة (حوالي 250 كم).' },
      { title: 'زيارة معبد حتحور', content: 'حوالي ساعتين لزيارة معبد حتحور.' },
      { title: 'الاستمرار إلى أبيدوس', content: 'الاستمرار إلى أبيدوس (حوالي 100 كم).' },
      { title: 'الغداء في أبيدوس', content: 'الغداء في أبيدوس.' },
      { title: 'زيارة معبد أبيدوس', content: 'حوالي ساعتين لزيارة معبد أبيدوس.' },
      { title: 'العودة إلى الغردقة', content: 'العودة إلى الغردقة. المجموع تقريباً 13 ساعة.' },
    ],
  },
};

// Add remaining tours... (this file is getting long, continue in part 2)
const slugs = Object.keys(tours);
const { data: tourRows } = await db.from('tours').select('id, slug').in('slug', slugs);
if (!tourRows) { console.error('No tours found'); process.exit(1); }

let count = 0;
for (const slug of slugs) {
  const tour = tourRows.find(t => t.slug === slug);
  if (!tour) { console.warn(`Tour not found: ${slug}`); continue; }
  const localeData = tours[slug];
  for (const [locale, itinerary] of Object.entries(localeData)) {
    const { error } = await db
      .from('content_translations')
      .update({ content: JSON.stringify(itinerary) })
      .eq('table_name', 'tours')
      .eq('row_id', tour.id)
      .eq('locale', locale);
    if (error) {
      console.error(`Error updating ${slug} [${locale}]: ${error.message}`);
    } else {
      console.log(`✓ ${slug} [${locale}] — ${itinerary.length} steps`);
      count++;
    }
  }
}
console.log(`\nDone! Updated ${count} translation rows.`);
await db.rest.end(); // simulate disconnection? Actually supabase-js has no explicit disconnect needed, just exit

// Note: The supabase-js client doesn't require cleanup, but we signal completion
process.exit(0);
