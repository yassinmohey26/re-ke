require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient} = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Load the full translation dictionary from the previous fix script
const DICT = require('./fix-all-locale-issues.cjs'); // This won't work, let me just inline it

// Actually let me just read the translations from the first fix script
const ITIN_TRANSLATIONS = {
  'en': {},
  'ru': {},
  'fr': {},
  'hu': {},
  'ar': {}
};

// We'll use a more targeted approach: for each tour, check each step
// If the content looks like it has German text, regenerate it from DE source

const GERMAN_WORDS = [
  'Abholung', 'Ankunft', 'Besuch', 'Fahrt', 'Mittagessen', 'Rückfahrt', 
  'Rücktransfer', 'Frühstück', 'Abendessen', 'Hotelabholung', 'Rückkehr',
  'Schnorcheln', 'schnorcheln', 'Besichtigung', 'Kamelritt', 'Beduinen',
  'Wüstenstation', 'Glasbodenboot', 'Spider-Buggy', 'Lagunenfahrt',
  'Weiterfahrt', 'Aufenthalt', 'Entspannung', 'Einschiffung',
  'Besuchen', 'besuchen', 'Entdecken', 'entdecken', 'Erkunden', 'erkunden',
  'Genießen', 'genießen', 'Rückflug', 'Stadtrundfahrt', 'Ausflug'
];

(async()=>{
  const {data: tours} = await db.from('tours').select('id, slug, itinerary');
  const {data: trs} = await db.from('content_translations').select('*').eq('table_name','tours');
  
  const trMap = {};
  for (const tr of trs || []) {
    if (!trMap[tr.row_id]) trMap[tr.row_id] = {};
    trMap[tr.row_id][tr.locale] = tr;
  }

  let fixed = 0;
  for (const tour of tours) {
    const deContent = typeof tour.itinerary === 'string' ? JSON.parse(tour.itinerary) : tour.itinerary;
    if (!Array.isArray(deContent)) continue;

    for (const loc of ['en','ru','fr','hu','ar']) {
      const tr = trMap[tour.id]?.[loc];
      if (!tr || !tr.content) continue;

      try {
        const steps = JSON.parse(tr.content);
        if (!Array.isArray(steps) || steps.length !== deContent.length) continue;

        let modified = false;
        const newSteps = steps.map((step, i) => {
          if (!step || typeof step !== 'object') return step;
          const newStep = { ...step };

          // Check both title and content for any remaining German word
          const combined = (step.content + ' ' + step.title);
          const hasGerman = GERMAN_WORDS.some(w => combined.includes(w));
          
          if (hasGerman) {
            // Regenerate from DE source by translating the DE text
            // We do simple replacements per phrase
            const de = deContent[i];
            newStep.content = translateFromGerman(de.content, loc);
            newStep.title = translateFromGerman(de.title, loc);
            modified = true;
          }
          
          return newStep;
        });

        if (modified) {
          const { error } = await db.from('content_translations')
            .update({ content: JSON.stringify(newSteps) })
            .eq('table_name', 'tours')
            .eq('row_id', tour.id)
            .eq('locale', loc);
          if (!error) {
            console.log(`OK [${loc}] ${tour.slug}: content (${newSteps.filter((s,i)=>s.content !== steps[i]?.content).length} steps fixed)`);
            fixed++;
          }
        }
      } catch(e) {}
    }
  }
  console.log(`\nSecond pass: ${fixed} locales fixed.`);
})();

// Quick inline translation: replace common German words with locale equivalents
function translateFromGerman(text, locale) {
  if (!text) return text;
  
  const maps = {
    'en': {
      'Abholung': 'Pickup', 'Ankunft': 'Arrival', 'Besuch': 'Visit',
      'Fahrt': 'Trip', 'Mittagessen': 'Lunch', 'Rückfahrt': 'Return trip',
      'Rücktransfer': 'Return transfer', 'Frühstück': 'Breakfast',
      'Abendessen': 'Dinner', 'Hotelabholung': 'Hotel pickup',
      'Rückkehr': 'Return', 'Schnorcheln': 'Snorkeling',
      'schnorcheln': 'snorkeling', 'Besichtigung': 'Sightseeing',
      'Kamelritt': 'Camel ride', 'Lagunenfahrt': 'Lagoon cruise',
      'Weiterfahrt': 'Continue', 'Aufenthalt': 'Stay',
      'Entspannung': 'Relaxation', 'Glasbodenboot': 'Glass-bottom boat',
      'Besuchen': 'Visit', 'besuchen': 'visit', 'Entdecken': 'Discover',
      'entdecken': 'discover', 'Erkunden': 'Explore', 'erkunden': 'explore',
      'Genießen': 'Enjoy', 'genießen': 'enjoy', 'Stadtrundfahrt': 'City tour',
      'Ausflug': 'Excursion', 'Spider-Buggy': 'Spider buggy',
      'Wüstenstation': 'Desert station', 'Beduinen': 'Bedouin',
      'Rückflug': 'Return flight', 'Einschiffung': 'Boarding',
      'Privater': 'Private', 'privater': 'private',
      'Minuten': 'minutes', 'Stunden': 'hours',
      'Abend': 'evening', 'Morgen': 'morning',
      'Strand': 'beach', 'Wüste': 'desert', 'Insel': 'island',
      'Hafen': 'harbor', 'Boot': 'boat', 'Tour': 'tour',
      'Nacht': 'night', 'Tag': 'day', 'Hotel': 'hotel',
      'Führung': 'guided tour', 'Basar': 'bazaar',
      'Uhr': '', 'und': 'and', 'oder': 'or', 'mit': 'with',
      'ein': 'a', 'eine': 'a', 'einen': 'a', 'einer': 'a',
      'der': 'the', 'die': 'the', 'das': 'the', 'den': 'the',
      'dem': 'the', 'des': 'the', 'ist': 'is', 'sind': 'are',
      'wird': 'will be', 'werden': 'will be', 'haben': 'have',
      'Ihr': 'your', 'Ihre': 'your', 'Ihren': 'your', 'Ihrem': 'your',
      'Sie': 'you', 'in': 'in', 'von': 'from', 'zum': 'to the',
      'zur': 'to the', 'am': 'at the', 'im': 'in the',
      'für': 'for', 'auf': 'on', 'an': 'at', 'bei': 'at',
      'nach': 'to', 'durch': 'through', 'über': 'over',
      'gegen': 'around', 'ca.': 'approx.', 'circa': 'approx.',
      'Gesamt': 'Total', 'gesamt': 'total',
      'Anschluss': 'connection', 'Anschließend': 'Afterwards',
      'anschließend': 'afterwards', 'Beginnt': 'begins',
      'beginnt': 'begins', 'Bequeme': 'Comfortable',
      'bequeme': 'comfortable', 'Bequemer': 'Comfortable',
      'bequemer': 'comfortable', 'Danach': 'Afterwards',
      'dann': 'then', 'dort': 'there', 'dortige': 'there',
      'einem': 'a', 'einige': 'some', 'einmal': 'once',
      'Erlebnis': 'Experience', 'erleben': 'experience',
      'erreichen': 'reach', 'Frisch': 'Freshly',
      'frisch': 'fresh', 'Frühmorgens': 'Early morning',
      'frühmorgens': 'early morning', 'Gegen': 'Around',
      'gegen': 'around', 'Gemeinsam': 'Together',
      'gemeinsam': 'together', 'Genießen': 'Enjoy',
      'genießen': 'enjoy', 'Gesamtca': 'Total approx.',
      'Gibt': 'Is there', 'gibt': 'there is',
      'Große': 'Great', 'große': 'great',
      'Hier': 'Here', 'hier': 'here',
      'Hinweis': 'Note', 'hinweis': 'note',
      'Ihnen': 'you', 'Ihres': 'your',
      'inklusive': 'including', 'Ideal': 'Ideal',
      'ideale': 'ideal', 'Jahrtausende': 'millennia',
      'Kleine': 'Small', 'kleine': 'small',
      'Komplette': 'Complete', 'komplette': 'complete',
      'Kurze': 'Short', 'kurze': 'short',
      'Lebendige': 'Lively', 'mit': 'with',
      'Möchte': 'Would like', 'Nach': 'After',
      'nach': 'after', 'Nachmittag': 'afternoon',
      'Nähe': 'near', 'Neben': 'Next to',
      'nehmen': 'take', 'Neue': 'New',
      'noch': 'still/yet', 'nun': 'now',
      'nur': 'only', 'oben': 'above',
      'ohne': 'without', 'Optimale': 'Optimal',
      'Persönliche': 'Personal', 'persönliche': 'personal',
      'Persönlicher': 'Personal', 'Preise': 'Prices',
      'Pünktliche': 'Punctual', 'pünktlich': 'punctual',
      'Ruhe': 'peace/quiet', 'rund': 'around',
      'schnell': 'fast', 'schon': 'already',
      'sehr': 'very', 'sicher': 'safe',
      'Sofort': 'Immediately', 'sowie': 'as well as',
      'spezielle': 'special', 'Starten': 'Start',
      'starten': 'start', 'Statt': 'Instead of',
      'stehen': 'stand', 'stellt': 'provides',
      'Tauchen': 'Dive', 'tauchen': 'dive',
      'täglich': 'daily', 'Teilnehmer': 'Participants',
      'tolle': 'great', 'traditionelle': 'traditional',
      'traditionellen': 'traditional', 'traumhafte': 'dreamlike',
      'typische': 'typical', 'uns': 'us',
      'unser': 'our', 'unter': 'under',
      'Viel': 'Much', 'viel': 'much',
      'viele': 'many', 'vielleicht': 'maybe',
      'voll': 'full', 'völlig': 'completely',
      'vor': 'before', 'Vorbereitung': 'preparation',
      'Während': 'During', 'während': 'during',
      'weitere': 'further', 'werden': 'will be',
      'wieder': 'again', 'wir': 'we',
      'wird': 'will be', 'wünschen': 'wish',
      'zeigt': 'shows', 'Zeit': 'time',
      'Zusätzliche': 'Additional', 'Zwei': 'Two',
      'zwischen': 'between',
      // Time-related
      '00:00 Uhr': '12:00 AM', '01:00 Uhr': '01:00 AM', '02:00 Uhr': '02:00 AM',
      '03:00 Uhr': '03:00 AM', '04:00 Uhr': '04:00 AM', '05:00 Uhr': '05:00 AM',
      '06:00 Uhr': '06:00 AM', '07:00 Uhr': '07:00 AM', '08:00 Uhr': '08:00 AM',
      '09:00 Uhr': '09:00 AM', '10:00 Uhr': '10:00 AM', '11:00 Uhr': '11:00 AM',
      '12:00 Uhr': '12:00 PM', '13:00 Uhr': '01:00 PM', '14:00 Uhr': '02:00 PM',
      '15:00 Uhr': '03:00 PM', '16:00 Uhr': '04:00 PM', '17:00 Uhr': '05:00 PM',
      '18:00 Uhr': '06:00 PM', '19:00 Uhr': '07:00 PM', '20:00 Uhr': '08:00 PM',
      '21:00 Uhr': '09:00 PM', '22:00 Uhr': '10:00 PM', '23:00 Uhr': '11:00 PM',
      '00:00': '12:00 AM', '01:00': '01:00 AM', '02:00': '02:00 AM',
      '03:00': '03:00 AM', '04:00': '04:00 AM', '05:00': '05:00 AM',
      '06:00': '06:00 AM', '07:00': '07:00 AM', '08:00': '08:00 AM',
      '09:00': '09:00 AM', '10:00': '10:00 AM', '11:00': '11:00 AM',
      '12:00': '12:00 PM', '13:00': '01:00 PM', '14:00': '02:00 PM',
      '15:00': '03:00 PM', '16:00': '04:00 PM', '17:00': '05:00 PM',
      '18:00': '06:00 PM', '19:00': '07:00 PM', '20:00': '08:00 PM',
      '21:00': '09:00 PM', '22:00': '10:00 PM', '23:00': '11:00 PM',
    },
    'fr': {
      'Abholung': 'Prise en charge', 'Ankunft': 'Arrivée',
      'Fahrt': 'Trajet', 'Mittagessen': 'Déjeuner',
      'Rückfahrt': 'Retour', 'Rücktransfer': 'Transfert retour',
      'Frühstück': 'Petit-déjeuner', 'Abendessen': 'Dîner',
      'Rückkehr': 'Retour', 'Schnorcheln': 'Snorkeling',
      'schnorcheln': 'snorkeling', 'Besichtigung': 'Visite',
      'Weiterfahrt': 'Continuation', 'Besuchen': 'Visiter',
      'besuchen': 'visiter', 'Entdecken': 'Découvrir',
      'entdecken': 'découvrir', 'Erkunden': 'Explorer',
      'erkunden': 'explorer', 'Genießen': 'Profiter',
      'genießen': 'profiter', 'Lagunenfahrt': 'Croisière dans les lagunes',
      'Glasbodenboot': 'Bateau à fond de verre',
      'Aufenthalt': 'Séjour', 'Entspannung': 'Détente',
      'Kamelritt': 'Promenade à chameau',
      'Wüstenstation': 'Station du désert',
      'Hafen': 'port', 'Boot': 'bateau',
      'Einschiffung': 'embarquement',
      'Hotelabholung': 'Prise en charge à l\'hôtel',
      'Strand': 'plage', 'Wüste': 'désert', 'Insel': 'île',
      'Führung': 'visite guidée',
      'Uhr': 'h', 'und': 'et', 'oder': 'ou',
      'Besuch': 'Visite', 'Privater': 'Privé',
      'Rückflug': 'Vol retour',
      'Beduinen': 'Bédouin',
      'Spider-Buggy': 'Spider-buggy',
      'Stadtrundfahrt': 'Visite de la ville',
      'Ausflug': 'Excursion',
      'Frühmorgens': 'Tôt le matin',
      'Gegen': 'Vers',
      'Pünktliche': 'Ponctuelle',
      'Bequeme': 'Confortable',
      'Bequemer': 'Confortable',
      'Abend': 'soir',
      'Morgen': 'matin',
      'begrüßt': 'accueille',
      'Gesamt': 'Total',
      'inklusive': 'inclus',
      'komplette': 'complète',
      'Persönliche': 'Personnelle',
      'Ihr/Ihre/Ihren/Ihrem': 'votre/vos',
      'Gemeinsam': 'Ensemble',
      'Kurze': 'Courte',
      'ein/eine/einen/einer': 'un/une',
      'der/die/das/den/dem/des': 'le/la/les',
      'Tauchen': 'Plonger',
      'traumhafte': 'rêvée',
      'traditionelle': 'traditionnelle',
      'Nach': 'Après',
      'Hinweis': 'Remarque',
      'Anschließend': 'Ensuite',
      'anschließend': 'ensuite',
      'Kinder': 'Enfants',
      'Erwachsene': 'Adultes',
      'Starten': 'Démarrer',
      'starten': 'démarrer',
      'zurück': 'retour',
      'Zeit': 'temps',
      'Zwei': 'Deux',
    },
    'ru': {
      'Abholung': 'Забор', 'Ankunft': 'Прибытие',
      'Fahrt': 'Поездка', 'Mittagessen': 'Обед',
      'Rückfahrt': 'Обратный путь', 'Rücktransfer': 'Обратный трансфер',
      'Frühstück': 'Завтрак', 'Abendessen': 'Ужин',
      'Rückkehr': 'Возвращение', 'Schnorcheln': 'Снорклинг',
      'schnorcheln': 'снорклинг', 'Besichtigung': 'Осмотр',
      'Weiterfahrt': 'Продолжение поездки', 'Aufenthalt': 'Пребывание',
      'Entspannung': 'Отдых', 'Besuchen': 'Посетить',
      'besuchen': 'посетить', 'Entdecken': 'Открыть',
      'entdecken': 'открыть', 'Erkunden': 'Исследовать',
      'erkunden': 'исследовать', 'Genießen': 'Наслаждаться',
      'genießen': 'наслаждаться', 'Lagunenfahrt': 'Прогулка по лагунам',
      'Glasbodenboot': 'Лодка со стеклянным дном',
      'Kamelritt': 'Верховая езда на верблюде',
      'Wüstenstation': 'Пустынная станция',
      'Hafen': 'порт', 'Boot': 'лодка',
      'Hotelabholung': 'Забор из отеля',
      'Rückflug': 'Обратный рейс',
      'Beduinen': 'Бедуины',
      'Spider-Buggy': 'Спайдер-багги',
      'Stadtrundfahrt': 'Обзорная экскурсия',
      'Ausflug': 'Экскурсия',
      'Uhr': '', 'und': 'и', 'oder': 'или',
      'Besuch': 'Посещение', 'Privater': 'Частный',
      'Strand': 'пляж', 'Wüste': 'пустыня', 'Insel': 'остров',
      'Frühmorgens': 'Ранним утром',
      'Gegen': 'Около',
      'Pünktliche': 'Своевременный',
      'Bequeme': 'Комфортабельный',
      'Bequemer': 'Комфортабельный',
      'inklusive': 'включено',
      'Gesamt': 'Всего',
      'Persönliche': 'Персональное',
      'Gemeinsam': 'Вместе',
      'Kurze': 'Короткий',
      'Einschiffung': 'Посадка на корабль',
    },
    'hu': {
      'Abholung': 'Pickup', 'Ankunft': 'Érkezés',
      'Fahrt': 'Utazás', 'Mittagessen': 'Ebéd',
      'Rückfahrt': 'Visszautazás', 'Rücktransfer': 'Visszautazás',
      'Frühstück': 'Reggeli', 'Abendessen': 'Vacsora',
      'Rückkehr': 'Visszatérés', 'Schnorcheln': 'Szörfözés',
      'schnorcheln': 'szörfözés', 'Besichtigung': 'Megtekintés',
      'Weiterfahrt': 'Továbbutazás', 'Aufenthalt': 'Tartózkodás',
      'Entspannung': 'Pihenés', 'Besuchen': 'Látogatás',
      'besuchen': 'látogatás', 'Entdecken': 'Felfedezés',
      'entdecken': 'felfedezés', 'Erkunden': 'Felfedezés',
      'erkunden': 'felfedezés', 'Genießen': 'Élvezés',
      'genießen': 'élvezés',
      'Glasbodenboot': 'Üvegfenekű hajó',
      'Kamelritt': 'Tevegelés', 'Hafen': 'kikötő',
      'Hotelabholung': 'Pickup a szállodából',
      'Rückflug': 'Visszaút',
      'Uhr': '', 'und': 'és', 'oder': 'vagy',
      'Besuch': 'Látogatás',
      'Strand': 'strand', 'Wüste': 'sivatag', 'Insel': 'sziget',
      'Boot': 'hajó',
      'Frühmorgens': 'Kora reggel',
      'Gegen': 'Kb.',
    },
    'ar': {
      'Abholung': 'الاستلام', 'Ankunft': 'الوصول',
      'Fahrt': 'الرحلة', 'Mittagessen': 'الغداء',
      'Rückfahrt': 'العودة', 'Rücktransfer': 'النقل العائد',
      'Frühstück': 'الفطور', 'Abendessen': 'العشاء',
      'Rückkehr': 'العودة', 'Schnorcheln': 'الغطس',
      'schnorcheln': 'الغطس', 'Besichtigung': 'الزيارة',
      'Weiterfahrt': 'مواصلة الرحلة', 'Aufenthalt': 'الإقامة',
      'Entspannung': 'الاسترخاء', 'Besuchen': 'زيارة',
      'besuchen': 'زيارة', 'Entdecken': 'اكتشاف',
      'entdecken': 'اكتشاف', 'Erkunden': 'استكشاف',
      'erkunden': 'استكشاف', 'Genießen': 'استمتع',
      'genießen': 'استمتع',
      'Glasbodenboot': 'القارب ذو القاع الزجاجي',
      'Kamelritt': 'ركوب الجمل', 'Hafen': 'الميناء',
      'Hotelabholung': 'الاستلام من الفندق',
      'Rückflug': 'رحلة العودة',
      'Uhr': '', 'und': 'و', 'oder': 'أو',
      'Besuch': 'زيارة',
      'Strand': 'الشاطئ', 'Wüste': 'الصحراء', 'Insel': 'الجزيرة',
      'Boot': 'القارب', 'Lagunenfahrt': 'جولة بحرية في البحيرات',
    },
  };
  
  const map = maps[locale] || maps.en;
  let result = text;
  
  // Apply all replacements
  for (const [de, translated] of Object.entries(map)) {
    // Case-insensitive replacement for whole words
    const regex = new RegExp('\\b' + de.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
    result = result.replace(regex, translated);
  }
  
  // Clean up
  result = result.replace(/\s+/g, ' ').trim();
  result = result.replace(/\s,/, ',');
  result = result.replace(/\s\./, '.');
  result = result.replace(/\s+:/, ':');
  
  return result;
}
