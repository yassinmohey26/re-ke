require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const { createClient } = require('@supabase/supabase-js');
const IS_DRY_RUN = !process.argv.includes('--execute');

const LOCALE_MAP = {
  fr: [
    [/ß/g, 'ss'],
    [/\bAbholung\b/g, 'Prise en charge'],
    [/\bHotelabholung\b/g, 'Prise en charge à l\'hôtel'],
    [/\bAbendessen\b/g, 'dîner'],
    [/\bMittagessen\b/g, 'déjeuner'],
    [/\bFrühstück\b/g, 'petit-déjeuner'],
    [/\bBesichtigung\b/g, 'Visite'],
    [/\bFührung\b/g, 'visite guidée'],
    [/\bEintritt\b/g, 'entrée'],
    [/\bEintrittskarten\b/g, 'billets d\'entrée'],
    [/\bStunden\b/g, 'heures'],
    [/\bTage\b/g, 'jours'],
    [/\bTag\b(?!e[sn]?\b)/g, 'journée'],
    [/\bNacht\b/g, 'nuit'],
    [/\bUhr\b/g, 'h'],
    [/\binklusive\b/gi, 'inclus'],
    [/\bexklusive\b/gi, 'non inclus'],
    [/\binbegriffen\b/gi, 'inclus'],
    [/\bkostenlos\b/g, 'gratuit'],
    [/\bAusflug\b/g, 'excursion'],
    [/\bRücktransfer\b/gi, 'transfert retour'],
    [/\bRückfahrt\b/g, 'retour'],
    [/\bTreffpunkt\b/g, 'point de rendez-vous'],
    [/\bDauer\b/g, 'Durée'],
    [/\bTransfer\b/g, 'Transfert'],
    [/\bTeilnehmer\b/g, 'participants'],
    [/\bReiseleiter\b/g, 'guide touristique'],
    [/\bSchwierigkeit\b/g, 'Difficulté'],
    [/\bMindestalter\b/g, 'Âge minimum'],
    [/\bVerpflegung\b/g, 'repas'],
    [/\bUnterkunft\b/g, 'hébergement'],
    [/\bTrinkgeld\b/g, 'pourboire'],
    [/\bWüste\b/g, 'désert'],
    [/\bQuad\b/gi, 'quad'],
    [/\bKamelritt\b/g, 'promenade à chameau'],
    [/\bSonnenuntergang\b/g, 'coucher de soleil'],
    [/\bSonnenaufgang\b/g, 'lever du soleil'],
    [/\bFreizeit\b/g, 'temps libre'],
    [/\bEntspannung\b/g, 'détente'],
    [/\bEntspannen\b/g, 'Détente'],
    [/\bSchwimmen\b/g, 'baignade'],
    [/\bWeiterfahrt\b/g, 'Continuation'],
    [/\bBootsfahrt\b/g, 'Promenade en bateau'],
    [/\bAnkunft\b/g, 'Arrivée'],
    [/\bRückkehr\b/g, 'Retour'],
    [/\bBegrüßung\b/g, 'Accueil'],
    [/\bEinweisung\b/g, 'briefing'],
    [/\bSicherheitseinweisung\b/g, 'briefing sécurité'],
    [/\btraditionellem\s+Tee\b/g, 'thé traditionnel'],
    [/\bGrand Egyptian Museum\b/g, 'Grand Musée Égyptien'],
    [/\bKarnak-Tempel\b/g, 'Temple de Karnak'],
    [/\bHatschepsut-Tempel\b/g, 'Temple d\'Hatchepsout'],
    [/\bPyramiden von Gizeh\b/g, 'Pyramides de Gizeh'],
    [/\bca\.\s*(\d{1,2}:\d{2})\s*Uhr\b/g, 'vers $1 h'],
    [/\bca\.\s*(\d{1,2}:\d{2})\b/g, 'vers $1'],
    [/\bca\.\s*/g, 'environ '],
    [/\bp\.\s*P\.\b/g, 'par personne'],
    [/\bAuf\s+Anfrage\b/g, 'Sur demande'],
    [/\bSchnorchel\b/g, 'snorkeling'],
    [/\bSchnorchelausrüstung\b/g, 'équipement de snorkeling'],
    [/\bFahrzeug\b/g, 'véhicule'],
    [/\bLimousine\b/g, 'limousine'],
    [/\bMinibus\b/g, 'minibus'],
    [/\bPrivat(er|es|e)\b/g, 'privé'],
    [/\bSpeedboot\b/g, 'speedboat'],
  ],

  hu: [
    [/ß/g, 'ss'],
    [/\bAbholung\b/g, 'Átvétel'],
    [/\bHotelabholung\b/g, 'Szállodai átvétel'],
    [/\bAbendessen\b/g, 'vacsora'],
    [/\bMittagessen\b/g, 'ebéd'],
    [/\bFrühstück\b/g, 'reggeli'],
    [/\bBesichtigung\b/g, 'Látogatás'],
    [/\bFührung\b/g, 'vezetett túra'],
    [/\bEintritt\b/g, 'belépő'],
    [/\bEintrittskarten\b/g, 'belépőjegyek'],
    [/\bStunden\b/g, 'óra'],
    [/\bTage\b/g, 'nap'],
    [/\bTag\b(?!e[sn]?\b)/g, 'nap'],
    [/\bNacht\b/g, 'éjszaka'],
    [/\bUhr\b/g, ''],
    [/\binklusive\b/gi, 'beleértve'],
    [/\bexklusive\b/gi, 'nem tartalmazza'],
    [/\binbegriffen\b/gi, 'beleértve'],
    [/\bkostenlos\b/g, 'ingyenes'],
    [/\bAusflug\b/g, 'kirándulás'],
    [/\bRücktransfer\b/gi, 'visszaszállítás'],
    [/\bRückfahrt\b/g, 'visszaút'],
    [/\bTreffpunkt\b/g, 'találkozási pont'],
    [/\bDauer\b/g, 'Időtartam'],
    [/\bTransfer\b/g, 'Szállítás'],
    [/\bTeilnehmer\b/g, 'résztvevők'],
    [/\bReiseleiter\b/g, 'idegenvezető'],
    [/\bSchwierigkeit\b/g, 'Nehézség'],
    [/\bMindestalter\b/g, 'Minimális életkor'],
    [/\bVerpflegung\b/g, 'étkezés'],
    [/\bUnterkunft\b/g, 'szállás'],
    [/\bTrinkgeld\b/g, 'borravaló'],
    [/\bWüste\b/g, 'sivatag'],
    [/\bQuad\b/gi, 'quad'],
    [/\bKamelritt\b/g, 'teve lovaglás'],
    [/\bSonnenuntergang\b/g, 'naplemente'],
    [/\bSonnenaufgang\b/g, 'napfelkelte'],
    [/\bFreizeit\b/g, 'szabadidő'],
    [/\bEntspannung\b/g, 'pihenés'],
    [/\bSchwimmen\b/g, 'úszás'],
    [/\bWeiterfahrt\b/g, 'Folytatás'],
    [/\bAnkunft\b/g, 'Érkezés'],
    [/\bRückkehr\b/g, 'Visszatérés'],
    [/\bBegrüßung\b/g, 'Fogadtatás'],
    [/\bEinweisung\b/g, 'tájékoztató'],
    [/\bSicherheitseinweisung\b/g, 'biztonsági tájékoztató'],
    [/\btraditionellem\s+Tee\b/g, 'hagyományos tea'],
    [/\btraditionellen\s+Tee\b/g, 'hagyományos tea'],
    [/\bGrand Egyptian Museum\b/g, 'Grand Egyptian Museum'],
    [/\bKarnak-Tempel\b/g, 'Karnaki templom'],
    [/\bHatschepsut-Tempel\b/g, 'Hatsepszut templom'],
    [/\bPyramiden von Gizeh\b/g, 'Gízai piramisok'],
    [/\bca\.\s*(\d{1,2}:\d{2})\s*Uhr\b/g, 'kb. $1'],
    [/\bca\.\s*(\d{1,2}:\d{2})\b/g, 'kb. $1'],
    [/\bca\.\s*/g, 'kb. '],
    [/\bp\.\s*P\.\b/g, 'főnként'],
    [/\bSchnorchel\b/g, 'sznorklizés'],
    [/\bSchnorchelausrüstung\b/g, 'sznorkelfelszerelés'],
    [/\bFahrzeug\b/g, 'jármű'],
    [/\bMinibus\b/g, 'minibusz'],
    [/\bSpeedboot\b/g, 'gyorsmotorcsónak'],
  ],

  ru: [
    [/ß/g, 'ss'],
    [/\bAbholung\b/g, 'Встреча'],
    [/\bHotelabholung\b/g, 'Встреча в отеле'],
    [/\bAbendessen\b/g, 'ужин'],
    [/\bMittagessen\b/g, 'обед'],
    [/\bFrühstück\b/g, 'завтрак'],
    [/\bBesichtigung\b/g, 'Осмотр'],
    [/\bFührung\b/g, 'экскурсия с гидом'],
    [/\bEintritt\b/g, 'вход'],
    [/\bEintrittskarten\b/g, 'входные билеты'],
    [/\bStunden\b/g, 'часов'],
    [/\bTage\b/g, 'дней'],
    [/\bTag\b/g, 'день'],
    [/\bNacht\b/g, 'ночь'],
    [/\bUhr\b/g, ''],
    [/\binklusive\b/gi, 'включено'],
    [/\bexklusive\b/gi, 'не включено'],
    [/\binbegriffen\b/gi, 'включено'],
    [/\bkostenlos\b/g, 'бесплатно'],
    [/\bAusflug\b/g, 'экскурсия'],
    [/\bRücktransfer\b/gi, 'обратный трансфер'],
    [/\bRückfahrt\b/g, 'возвращение'],
    [/\bTreffpunkt\b/g, 'место встречи'],
    [/\bDauer\b/g, 'Длительность'],
    [/\bTransfer\b/g, 'Трансфер'],
    [/\bTeilnehmer\b/g, 'участников'],
    [/\bReiseleiter\b/g, 'гид'],
    [/\bSchwierigkeit\b/g, 'Сложность'],
    [/\bMindestalter\b/g, 'Минимальный возраст'],
    [/\bVerpflegung\b/g, 'питание'],
    [/\bUnterkunft\b/g, 'проживание'],
    [/\bTrinkgeld\b/g, 'чаевые'],
    [/\bWüste\b/g, 'пустыня'],
    [/\bQuad\b/gi, 'квадроцикл'],
    [/\bKamelritt\b/g, 'верховая езда на верблюде'],
    [/\bSonnenuntergang\b/g, 'закат'],
    [/\bSonnenaufgang\b/g, 'рассвет'],
    [/\bFreizeit\b/g, 'свободное время'],
    [/\bEntspannung\b/g, 'отдых'],
    [/\bSchwimmen\b/g, 'плавание'],
    [/\bWeiterfahrt\b/g, 'Продолжение'],
    [/\bAnkunft\b/g, 'Прибытие'],
    [/\bRückkehr\b/g, 'Возвращение'],
    [/\bBegrüßung\b/g, 'Встреча'],
    [/\bEinweisung\b/g, 'инструктаж'],
    [/\bSicherheitseinweisung\b/g, 'инструктаж по безопасности'],
    [/\btraditionellem\s+Tee\b/g, 'традиционный чай'],
    [/\btraditionellen\s+Tee\b/g, 'традиционный чай'],
    [/\bGrand Egyptian Museum\b/g, 'Большой Египетский Музей'],
    [/\bKarnak-Tempel\b/g, 'Храм Карнака'],
    [/\bHatschepsut-Tempel\b/g, 'Храм Хатшепсут'],
    [/\bPyramiden von Gizeh\b/g, 'Пирамиды Гизы'],
    [/\bca\.\s*(\d{1,2}:\d{2})\s*Uhr\b/g, 'около $1'],
    [/\bca\.\s*(\d{1,2}:\d{2})\b/g, 'около $1'],
    [/\bca\.\s*/g, 'около '],
    [/\bp\.\s*P\.\b/g, 'за человека'],
    [/\bSchnorchel\b/g, 'снорклинг'],
    [/\bSchnorchelausrüstung\b/g, 'снаряжение для снорклинга'],
    [/\bFahrzeug\b/g, 'транспортное средство'],
    [/\bMinibus\b/g, 'минибус'],
    [/\bSpeedboot\b/g, 'скоростной катер'],
  ],
};

const TEXT_FIELDS = ['name', 'description', 'short_description', 'category_label', 'meeting_point', 'duration'];
const ARRAY_FIELDS = ['highlights', 'included', 'not_included'];

async function processLocale(locale) {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: cts } = await db.from('content_translations').select('*').eq('table_name', 'tours').eq('locale', locale);

  const patterns = LOCALE_MAP[locale];
  if (!patterns) { console.log(`No patterns for ${locale}`); return; }

  function apply(text) {
    if (!text || typeof text !== 'string') return text;
    let r = text;
    for (const [p, rep] of patterns) r = r.replace(p, rep);
    return r;
  }

  let changed = 0;
  for (const ct of cts) {
    const updateData = {};
    let hasChanges = false;

    for (const key of TEXT_FIELDS) {
      const oldVal = ct[key] || '';
      const newVal = apply(oldVal);
      if (newVal !== oldVal) { updateData[key] = newVal; hasChanges = true; }
    }
    for (const key of ARRAY_FIELDS) {
      const arr = ct[key] || [];
      const newArr = arr.map(apply);
      if (arr.some((v,i) => v !== newArr[i])) { updateData[key] = newArr; hasChanges = true; }
    }
    try {
      const content = typeof ct.content === 'string' ? JSON.parse(ct.content) : ct.content;
      if (Array.isArray(content)) {
        const newContent = content.map(i => ({...i, title: apply(i.title), content: apply(i.content)}));
        if (JSON.stringify(content) !== JSON.stringify(newContent)) { updateData.content = JSON.stringify(newContent); hasChanges = true; }
      }
    } catch {}
    try {
      const faqs = ct.faqs || [];
      if (Array.isArray(faqs)) {
        const newFaqs = faqs.map(f => ({...f, question: apply(f.question), answer: apply(f.answer)}));
        if (JSON.stringify(faqs) !== JSON.stringify(newFaqs)) { updateData.faqs = newFaqs; hasChanges = true; }
      }
    } catch {}

    if (hasChanges) {
      changed++;
      if (!IS_DRY_RUN) {
        const { error } = await db.from('content_translations').update(updateData).eq('id', ct.id);
        if (error) console.error(`  ERROR ${ct.id}: ${error.message}`);
      }
    }
  }
  return changed;
}

async function main() {
  const locales = ['fr', 'hu', 'ru'];
  for (const locale of locales) {
    const n = await processLocale(locale);
    console.log(`${locale}: ${n}/${26} rows changed`);
  }
  console.log(`\nMode: ${IS_DRY_RUN ? 'DRY RUN' : 'EXECUTE'}`);
  if (IS_DRY_RUN) console.log('Run with --execute to apply.');
}
main().catch(e => { console.error(e); process.exit(1); });
