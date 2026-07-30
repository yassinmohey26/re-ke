require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const { createClient } = require('@supabase/supabase-js');
const IS_DRY_RUN = !process.argv.includes('--execute');

const REPLACEMENTS = [
  [/\bAbholung\b/g, 'Prise en charge'],
  [/\bHotelabholung\b/g, 'Prise en charge à l\'hôtel'],
  [/\bAbendessen\b/g, 'dîner'],
  [/\bMittagessen\b/g, 'déjeuner'],
  [/\bFrühstück\b/g, 'petit-déjeuner'],
  [/\bBesichtigung\b/g, 'Visite'],
  [/\bFührung\b/g, 'Visite guidée'],
  [/\bSchnorcheln\b/g, 'Snorkeling'],
  [/\bSchnorchelausrüstung\b/g, 'équipement de snorkeling'],
  [/\bSchnorchelstopp\b/g, 'arrêt snorkeling'],
  [/\bSchnorchelgänge?\b/g, 'séances de snorkeling'],
  [/\bSchnorchelplätze\b/g, 'sites de snorkeling'],
  [/\binklusive\b/gi, 'inclus'],
  [/\bexklusive\b/gi, 'non inclus'],
  [/\binbegriffen\b/gi, 'inclus'],
  [/\bkostenlos\b/g, 'gratuit'],
  [/\bkostenloser\b/g, 'gratuits'],
  [/\bEintritt\b/g, 'entrée'],
  [/\bEintrittskarten\b/g, 'billets d\'entrée'],
  [/\bStunden\b/g, 'heures'],
  [/\bTage\b/g, 'jours'],
  [/\bTag\b(?!e\b|es\b|en\b)/g, 'journée'],
  [/\bNacht\b/g, 'nuit'],
  [/\bUhr\b/g, 'h'],
  [/\bca\.\s*(\d{1,2}:\d{2})\s*h\b/g, 'vers $1 h'],
  [/\bca\.\s*/g, 'environ '],
  [/\bAusflug\b/g, 'excursion'],
  [/\bRücktransfer\b/gi, 'transfert retour'],
  [/\bRückfahrt\b/g, 'retour'],
  [/\bTreffpunkt\b/g, 'point de rendez-vous'],
  [/\bDauer\b/g, 'Durée'],
  [/\bTransfer\b/g, 'Transfert'],
  [/\bPrivater\s+Transfer\b/g, 'Transfert privé'],
  [/\bPrivat(er|e[sn]?)\b/g, 'privé'],
  [/\bFahrzeug\b/g, 'véhicule'],
  [/\bLimousine\b/g, 'limousine'],
  [/\bMinibus\b/g, 'minibus'],
  [/\bSpeedboot\b(?![-])/g, 'speedboat'],
  [/\bTeilnehmer\b/g, 'participants'],
  [/\bReiseleiter\b/g, 'guide touristique'],
  [/\bSchwierigkeit\b/g, 'Difficulté'],
  [/\bMindestalter\b/g, 'Âge minimum'],
  [/\bVerpflegung\b/g, 'repas'],
  [/\bUnterkunft\b/g, 'hébergement'],
  [/\bTrinkgeld\b/g, 'pourboire'],
  [/\bWüste\b/g, 'désert'],
  [/\bWüstenstation\b/g, 'station du désert'],
  [/\bQuad-Tour\b/g, 'tour en quad'],
  [/\bQuads?\b/gi, 'quad'],
  [/\bKamelritt\b/g, 'promenade à chameau'],
  [/\bSonnenuntergang\b/g, 'coucher de soleil'],
  [/\bSonnenaufgang\b/g, 'lever du soleil'],
  [/\bAbenteuer\b/g, 'aventure'],
  [/\bFreizeit\b/g, 'temps libre'],
  [/\bEntspannung\b/g, 'détente'],
  [/\bEntspannen\b/g, 'Détendez-vous'],
  [/\bSchwimmen\b/g, 'baignade'],
  [/\bFahrt\b(?!z\b)/g, 'Trajet'],
  [/\bWeiterfahrt\b/g, 'Continuation'],
  [/\bBootsfahrt\b/g, 'Promenade en bateau'],
  [/\bAnkunft\b/g, 'Arrivée'],
  [/\bRückkehr\b/g, 'Retour'],
  [/\bBegrüßung\b/g, 'Accueil'],
  [/\bEinweisung\b/g, 'Briefing'],
  [/\bSicherheitseinweisung\b/g, 'briefing sécurité'],
  [/\bGrand Egyptian Museum\b/g, 'Grand Musée Égyptien'],
  [/\bKarnak-Tempel\b/g, 'Temple de Karnak'],
  [/\bHatschepsut-Tempel\b/g, 'Temple d\'Hatchepsout'],
  [/\bPyramiden von Gizeh\b/g, 'Pyramides de Gizeh'],
  [/\btraditionellem\s+Tee\b/g, 'thé traditionnel'],
  [/\bp\.\s*P\.\b/g, 'par personne'],
  [/\bAuf\s+Anfrage\b/g, 'Sur demande'],
];

function apply(text) {
  if (!text || typeof text !== 'string') return text;
  let r = text;
  for (const [p, rep] of REPLACEMENTS) r = r.replace(p, rep);
  return r;
}

async function main() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: cts } = await db.from('content_translations').select('*').eq('table_name', 'tours').eq('locale', 'fr');

  const TEXT_FIELDS = ['name', 'description', 'short_description', 'category_label', 'meeting_point', 'duration'];
  const ARRAY_FIELDS = ['highlights', 'included', 'not_included'];
  let totalChanges = 0, toursChanged = 0;
  const updates = [];

  for (const ct of cts) {
    const changes = {};
    let fieldsChanged = 0, wordChanges = 0;

    for (const key of TEXT_FIELDS) {
      const oldVal = ct[key] || '';
      const newVal = apply(oldVal);
      if (newVal !== oldVal) { changes[key] = { old: oldVal.substring(0,120), new: newVal.substring(0,120) }; fieldsChanged++; wordChanges++; }
    }
    for (const key of ARRAY_FIELDS) {
      const arr = ct[key] || [];
      const newArr = arr.map(apply);
      if (arr.some((v,i) => v !== newArr[i])) { changes[key] = { old: JSON.stringify(arr).substring(0,120), new: JSON.stringify(newArr).substring(0,120) }; fieldsChanged++; wordChanges++; }
    }
    try {
      const content = JSON.parse(ct.content || '[]');
      if (Array.isArray(content)) {
        const newContent = content.map(i => ({...i, title: apply(i.title), content: apply(i.content)}));
        if (JSON.stringify(content) !== JSON.stringify(newContent)) { changes['content'] = { old: 'changed', new: 'changed' }; fieldsChanged++; wordChanges++; }
      }
    } catch {}
    try {
      const faqs = ct.faqs || [];
      if (Array.isArray(faqs)) {
        const newFaqs = faqs.map(f => ({...f, question: apply(f.question), answer: apply(f.answer)}));
        if (JSON.stringify(faqs) !== JSON.stringify(newFaqs)) { changes['faqs'] = { old: 'changed', new: 'changed' }; fieldsChanged++; wordChanges++; }
      }
    } catch {}

    if (fieldsChanged > 0) {
      toursChanged++; totalChanges += wordChanges;
      updates.push({ id: ct.id, row_id: ct.row_id, slug: (ct.row_id||'').substring(0,8), fieldsChanged, wordChanges, changes });
    }
  }

  console.log(`Mode: ${IS_DRY_RUN ? 'DRY RUN' : 'EXECUTE'}\nFR rows with changes: ${toursChanged}/${cts.length}, total changes: ${totalChanges}\n`);
  for (const u of updates) {
    console.log(`--- ${u.slug} (${u.fieldsChanged} fields, ${u.wordChanges} replacements) ---`);
    for (const [key, val] of Object.entries(u.changes)) {
      console.log(`  ${key}: "${val.old}" → "${val.new}"`);
    }
    console.log('');
  }

  if (!IS_DRY_RUN) {
    let done = 0, errors = 0;
    for (const u of updates) {
      const ct = cts.find(c => c.id === u.id);
      const updateData = {};
      for (const key of TEXT_FIELDS) updateData[key] = apply(ct[key]);
      for (const key of ARRAY_FIELDS) updateData[key] = (ct[key]||[]).map(apply);
      try {
        const content = JSON.parse(ct.content || '[]');
        if (Array.isArray(content)) updateData.content = JSON.stringify(content.map(i => ({...i, title: apply(i.title), content: apply(i.content)})));
      } catch {}
      try {
        const faqs = ct.faqs || [];
        if (Array.isArray(faqs)) updateData.faqs = faqs.map(f => ({...f, question: apply(f.question), answer: apply(f.answer)}));
      } catch {}
      const { error: err } = await db.from('content_translations').update(updateData).eq('id', u.id);
      if (err) { console.error(`  ERROR ${u.id}: ${err.message}`); errors++; } else done++;
    }
    console.log(`Done. ${done} rows, ${errors} errors.`);
  } else {
    console.log('Run with --execute to apply.');
  }
}
main().catch(e => { console.error(e); process.exit(1); });
