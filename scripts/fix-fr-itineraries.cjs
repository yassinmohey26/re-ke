/* Full FR itinerary rewrite for flagged tours. DRY RUN by default, --apply to execute.
   Self-checks each rewrite against the refined German-word audit (see AGENTS.md:
   'des' is a native French word and was dropped from the FR word list). */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const IS_DRY_RUN = !process.argv.includes('--apply');

// Refined German word list for FR: base list minus 'des' (native French plural article).
const DE_WORDS = new Set([
  'und','der','die','das','dem','den','von','mit','im','am','zu','auf','ist','sind',
  'für','fuer','aus','bei','nach','über','uber','eine','einem','einer','einen','nicht','auch',
  'als','wie','sie','wir','ihr','zur','vom','zum','aber','dann','dort','hier','sehr','viel',
  'noch','schon','immer','geniessen','genießen','zurück','zurueck','fahren','sehen','besuchen',
  'einige','wichtigsten','entspannten','erwarten','schlendern','Grosse','Große','Aussenstelle',
  'Außenstelle','Ihr','Sie','Die','Der','Von','Ein','Einer','Nach','Ihres','Ihnen','ihrer',
  'ihrem','ihren','sein','sich','ohne','kein','keine','Ihre','ein','Stunde','Stunden','Tag',
  'Tage','Abend','Abends','Morgen','Nacht','Uhr','Hotelabholung','Bootsfahrt','Schnorcheln',
  'Rückfahrt','Rueckfahrt','Ankunft','Abholung','Besuch','Fahrt','Tour','Insel','Bord','Hotel',
  'privat','Privaten','Speedboot','Sandstrand','Sonnen','Riffen','Riffe','Meeres','Korallen',
  'erleben','Hafen','Start','Beginn','Ende','durch','gegen','bis','ca','zzgl','inkl','max',
]);

function germanWords(text) {
  return String(text || '').split(/[^A-Za-z\u00C0-\u017F\-']+/)
    .filter(w => w.length > 0 && DE_WORDS.has(w));
}
function parseItin(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') { try { const p = JSON.parse(val); if (Array.isArray(p)) return p; } catch {} }
  return null;
}

const REWRITES = {
  'dendera-halbtagesausflug-ab-hurghada-der-authentische-besuch-im-hathor-tempel': [
    { title: "Prise en charge & trajet vers Dendera", content: "Prise en charge vers 06h00 directement à votre hôtel à Hurghada. Trajet vers Dendera (environ 230 km, véhicule climatisé)." },
    { title: "Arrivée au temple", content: "Arrivée au temple et visite guidée avec un égyptologue." },
    { title: "Salle hypostyle d'Hathor & plafond", content: "Visite de la célèbre salle hypostyle d'Hathor et de son plafond astronomique." },
    { title: "Autres zones", content: "Visite de zones choisies telles que le mammisi, le lac sacré et l'ensemble du temple." },
    { title: "Visite individuelle", content: "Du temps pour une visite individuelle et des photos." },
    { title: "Retour", content: "Retour en début d'après-midi." },
  ],
  'eden-island-schnorchelausflug-hurghada': [
    { title: "Prise en charge à l'hôtel", content: "Votre journée commence entre 7h30 et 8h00 avec le transfert confortable depuis l'hôtel jusqu'au port de Hurghada." },
    { title: "Trajet en bateau vers les meilleurs sites de snorkeling", content: "Après la remise de votre équipement de snorkeling, la traversée de 40 minutes démarre vers les récifs les plus fascinants autour d'Eden Island. Ici, de colorés récifs coralliens et des poissons tropicaux vous attendent – un paradis pour les amateurs de snorkeling." },
    { title: "Snorkeling et plage", content: "Passez plusieurs heures sur la plage d'Eden Island, nagez dans une eau turquoise ou détendez-vous sur le sable." },
    { title: "Déjeuner pendant l'excursion", content: "Un riche buffet avec des spécialités locales et internationales vous attend pendant l'excursion." },
    { title: "Détente et retour", content: "Profitez du temps restant pour nager, faire du snorkeling ou vous détendre sur la plage, avant de regagner le port en bateau dans l'après-midi et d'être ensuite ramené à votre hôtel." },
  ],
  'eintrittskarte-zum-hurghada-grand-aquarium': [
    { title: "Arrivée au Hurghada Grand Aquarium", content: "Après votre arrivée, vous pénétrez dans l'un des aquariums les plus grands et les plus modernes d'Égypte. Grâce à votre billet en ligne, vous profitez d'une entrée rapide et simple, sans longue attente." },
    { title: "Découverte du monde sous-marin", content: "Commencez votre visite à travers plus de 24 zones thématiques fascinantes, avec des habitants marins exotiques, de colorés récifs coralliens et d'impressionnants grands aquariums de la mer Rouge." },
    { title: "Tunnel sous-marin et zones panoramiques", content: "Vivez le spectaculaire tunnel sous-marin de 24 mètres et observez requins, raies et de nombreuses espèces de poissons de très près – une expérience inoubliable pour toute la famille." },
    { title: "Forêt tropicale et zones animales", content: "Visitez la zone de forêt tropicale humide ainsi que le petit zoo avec des oiseaux exotiques, des reptiles et d'autres animaux fascinants issus de différentes régions du monde." },
    { title: "Expériences interactives", content: "Enfants et adultes peuvent découvrir le bassin tactile interactif et participer aux nourrissages des animaux ainsi qu'à de passionnantes présentations en direct." },
    { title: "Temps libre et photos", content: "Profitez du temps libre pour prendre des photos, acheter des souvenirs ou savourer l'atmosphère détendue de l'aquarium." },
    { title: "Fin de la visite", content: "Après une visite riche en expériences, votre visite du Hurghada Grand Aquarium se termine avec des impressions inoubliables du fascinant monde sous-marin de la mer Rouge." },
  ],
  'el-gouna-private-stadtrundfahrt-mit-lagunenfahrt-aussichtsturm': [
    { title: "Prise en charge à l'hôtel", content: "Votre guide vient vous chercher entre 09h00 et 10h00 dans un véhicule privé climatisé. Depuis Hurghada, nous atteignons El Gouna en environ 30 minutes." },
    { title: "Balade dans les lagunes d'El Gouna", content: "L'excursion commence par une balade détendue en bateau à travers les célèbres lagunes. Vous verrez hôtels de luxe, villas et quartiers résidentiels exclusifs, îles et voies navigables, le port de plaisance et des particularités architecturales. Votre guide vous raconte l'histoire de la ville et des détails passionnants sur la famille fondatrice Sawiris." },
    { title: "Centre-ville d'El Gouna", content: "Dans le centre-ville, cafés, boutiques, artisanat et petites places vous attendent. Vous flânez tranquillement et profitez du flair moderne de la ville." },
    { title: "Culture et architecture", content: "Ensemble, nous visitons quelques-unes des attractions les plus importantes : l'église copte, la Grande Mosquée et une antenne de la Bibliotheca Alexandrina. Un mélange idéal de culture et d'urbanisme moderne." },
    { title: "La tour panoramique", content: "L'un des points forts de l'excursion. D'en haut, vous voyez la mer, les lagunes, les montagnes du désert et la marina. Un endroit parfait pour des photos impressionnantes." },
    { title: "Marina Abu Tig", content: "Vous longez la promenade soignée, admirez des yachts de luxe et profitez de l'atmosphère méditerranéenne. Ceux qui le souhaitent peuvent boire un thé ou un café avec vue sur les bateaux (en option)." },
    { title: "Retour à l'hôtel", content: "Après de nombreuses belles impressions, nous rentrons à Hurghada." },
  ],
  'family-abendsafari-hurghada': [
    { title: "1. Prise en charge à l'hôtel", content: "Transfert confortable de votre hôtel jusqu'à la station safari de Hurghada." },
    { title: "2. Briefing et préparation", content: "Avant le départ, vous recevez une consigne de sécurité et des informations importantes sur la conduite des véhicules." },
    { title: "3. Balade en quad dans le désert", content: "Vivez environ 30 à 40 minutes de plaisir de conduite en quad à travers l'impressionnant paysage désertique autour de Hurghada." },
    { title: "4. Balade en Spider Car", content: "Ensuite, une balade de 10 à 15 minutes en Spider Car vous attend, soit la deuxième expérience de conduite du safari." },
    { title: "5. Dîner", content: "Après les activités de conduite, savourez un dîner commun et récupérez de votre aventure dans le désert." },
    { title: "6. Spectacle divertissant", content: "Préparez-vous à un spectacle qui assure une fin divertissante à votre Family Safari." },
    { title: "7. Retour à l'hôtel", content: "Après le programme, vous êtes confortablement ramené à votre hôtel." },
  ],
  'glasbodenboot-hurghada-mit-schnorcheln': [
    { title: "Prise en charge à l'hôtel", content: "Prise en charge à votre hôtel à Hurghada dans un véhicule climatisé." },
    { title: "Transfert au port et embarquement", content: "Accueil, brève introduction et départ de l'excursion en bateau." },
    { title: "Trajet en bateau à fond de verre", content: "Trajet au-dessus des récifs coralliens avec une vue directe sur le monde sous-marin." },
    { title: "Arrêt snorkeling (30 minutes)", content: "Snorkeling guidé sur un récif calme." },
    { title: "Détente à bord", content: "Profitez de boissons et prenez des photos." },
    { title: "Retour et transfert à l'hôtel", content: "Retour au port et transfert vers votre hôtel." },
  ],
  'hula-hula-insel-schnorchelausflug-hurghada': [
    { title: "Prise en charge à l'hôtel", content: "Votre guide expérimenté et germanophone vient vous chercher dans un véhicule climatisé et vous emmène en toute sécurité au port." },
    { title: "Trajet en bateau vers l'île de Hula Hula", content: "Profitez de la vue étendue sur la mer Rouge scintillante. Ressentez la brise marine et préparez-vous à des moments inoubliables." },
    { title: "Snorkeling et baignade", content: "Explorez le monde sous-marin coloré avec des poissons exotiques et d'impressionnants récifs coralliens. L'équipement de snorkeling est fourni." },
    { title: "Séjour sur l'île (90 minutes)", content: "Détendez-vous sur les plages de sable blanc, nagez dans l'eau cristalline ou pratiquez le snorkeling directement depuis la plage. Transats et parasols sont à votre disposition." },
    { title: "Retour à l'hôtel", content: "Après une journée riche en événements, retour au port puis vers votre hôtel – avec de nombreuses nouvelles impressions et de joyeux souvenirs." },
  ],
  'hurghada-shopping-tour-basar-transfer': [
    { title: "Prise en charge à l'hôtel", content: "Nous venons vous chercher confortablement en véhicule climatisé directement à votre hôtel à Hurghada ou aux environs." },
    { title: "Arrivée au bazar", content: "Plongez dans l'animation colorée du marché et vivez l'atmosphère authentique d'un bazar égyptien." },
    { title: "Temps libre pour le shopping", content: "Découvrez des produits traditionnels : maroquinerie artisanale, huiles de parfum, rouleaux de papyrus, épices, bijoux et bien plus encore." },
    { title: "Retour à l'hôtel", content: "Après une excursion shopping riche en expériences, nous vous ramenons en toute sécurité et confortablement à votre hôtel." },
  ],
  'kairo-mit-flug-ab-hurghada-pyramiden-museum': [
    { title: "04h00", content: "Prise en charge à l'hôtel à Hurghada." },
    { title: "06h00", content: "Vol vers le Caire." },
    { title: "06h50", content: "Arrivée au Caire et accueil par votre guide." },
    { title: "08h00–19h00", content: "Pyramides, Sphinx, musée, déjeuner." },
    { title: "19h00", content: "Vol retour vers Hurghada." },
    { title: "19h45", content: "Arrivée et transfert à l'hôtel." },
  ],
  'kloester-st-antonius-st-paulus': [
    { title: "Prise en charge (04h00)", content: "Prise en charge directement à votre hôtel à Hurghada." },
    { title: "Trajet vers le monastère Saint-Antoine", content: "Trajet à travers le désert oriental jusqu'au monastère Saint-Antoine." },
    { title: "Visite du monastère Saint-Antoine", content: "Visite des églises historiques, des fresques et des manuscrits." },
    { title: "Grotte de Saint-Antoine", content: "Montée vers la grotte de Saint-Antoine (en option)." },
    { title: "Poursuite vers le monastère Saint-Paul", content: "Poursuite du trajet vers le monastère Saint-Paul." },
    { title: "Visite du monastère Saint-Paul", content: "Visite du monastère et de l'église Saint-Paul." },
    { title: "Déjeuner", content: "Déjeuner dans un restaurant local." },
    { title: "Retour à Hurghada", content: "Retour à Hurghada. Arrivée vers 17h00." },
  ],
  'luxor-tagesausflug-heissluftballon-hoteluebernachtung': [
    { title: "17h00 – Prise en charge à l'hôtel", content: "Départ de Hurghada, Marsa Alam ou El Quseir dans un véhicule privé climatisé. Après environ 3,5 heures, vous atteignez Louxor." },
    { title: "Arrivée, dîner et enregistrement", content: "Vous savourez un dîner détendu et rejoignez l'hôtel de votre choix, avant que la nuit prépare votre aventure du lendemain matin." },
    { title: "Lever du soleil sur Louxor – vol en montgolfière", content: "Votre vol en montgolfière démarre vers 4h00. Pendant que le soleil colore lentement la vallée du Nil, vous survolez temples, champs et la rive ouest de l'antique Thèbes. Un moment qui donne de l'éclat à votre album de voyage." },
    { title: "Vallée des Rois – trois tombeaux", content: "Explorez les tombes des pharaons, dont les peintures murales rayonnent depuis des millénaires." },
    { title: "Temple d'Hatchepsout", content: "Un temple comme taillé dans la roche. Dignité, histoire, lignes claires." },
    { title: "Colosses de Memnon – arrêt photo", content: "Les monumentales figures de garde d'Aménophis III vous attendent déjà." },
    { title: "Déjeuner au bord du Nil", content: "Un copieux menu égyptien vous redonne de l'énergie pour la suite de la journée." },
    { title: "Temple de Karnak", content: "Pour clore votre excursion, découvrez le plus grand complexe de temples d'Égypte. Temples, colonnes majestueuses, des millénaires de culture – une conclusion digne de ce nom." },
    { title: "Retour à Hurghada", content: "Arrivée à votre hôtel vers 20h00." },
  ],
  'mahmya-insel-ausflug-hurghada': [
    { title: "Prise en charge et transfert au port", content: "Tôt le matin, vous êtes pris en charge directement à votre hôtel puis conduits au port. Là, l'équipe amicale vous accueille à bord de votre bateau confortable." },
    { title: "Trajet avec snorkeling", content: "Après la remise de votre équipement de snorkeling et une brève introduction, la traversée de la mer Rouge, profonde et bleue, commence. Vous atteignez rapidement les premiers sites de snorkeling avec des poissons multicolores, des formations coralliennes et, avec un peu de chance, des tortues marines ou des dauphins." },
    { title: "Île de Mahmya et déjeuner", content: "Après l'arrivée sur l'île de Mahmya, profitez du décor de rêve et d'un buffet de déjeuner fraîchement préparé dans un restaurant au bord de la mer. Le reste de la journée vous appartient : détente, baignade, exploration de l'île ou calme et soleil." },
    { title: "Retour à l'hôtel", content: "Dans l'après-midi, vous regagnez le port détendu puis êtes ramené à votre hôtel." },
  ],
  'makadi-water-park-hurghada-mittagessen-transfer': [
    { title: "Prise en charge à l'hôtel", content: "Prise en charge directement à l'hôtel à Hurghada ou Makadi Bay." },
    { title: "Transfert", content: "Transfert confortable dans un véhicule climatisé." },
    { title: "Makadi Water Park", content: "Journée complète au Makadi Water Park. Entrée prioritaire avec accès organisé. Utilisation de toutes les attractions autorisées selon l'âge et la taille." },
    { title: "Déjeuner et boissons", content: "Déjeuner et boissons inclus." },
    { title: "Transfert retour", content: "Transfert retour à l'hôtel dans l'après-midi." },
  ],
  'mini-egypt-park-hurghada': [
    { title: "Prise en charge à l'hôtel", content: "Prise en charge à l'hôtel à Hurghada avec un minibus confortable et climatisé." },
    { title: "Arrivée au Mini Egypt Park", content: "Arrivée au Mini Egypt Park – votre guide personnel vous accueille." },
    { title: "Visite guidée", content: "Visite guidée à travers les merveilles miniatures de l'Égypte : les pyramides de Gizeh et le Sphinx, le temple d'Abou Simbel et le haut barrage d'Assouan, les impressionnants temples de Louxor avec le célèbre temple de Karnak, le musée égyptien du Caire, Alexandrie avec le pont Stanley et le palais Montazah." },
    { title: "Temps libre dans le parc", content: "Temps libre dans le parc – du temps pour des photos, l'émerveillement et de petites découvertes." },
    { title: "Retour à l'hôtel", content: "Retour à l'hôtel – avec des impressions inoubliables dans les bagages." },
  ],
  'naechtliche-stadtrundfahrt-durch-hurghada-private-tour': [
    { title: "19h00 – Prise en charge à l'hôtel", content: "Prise en charge directement à votre hôtel." },
    { title: "Balade dans la marina", content: "Balade dans la marina." },
    { title: "Marché aux poissons et Grande Mosquée", content: "Visite du marché aux poissons et de la Grande Mosquée." },
    { title: "Marché de fruits et légumes", content: "Poursuite vers le marché de fruits et légumes." },
    { title: "Pause dans un café égyptien", content: "Pause dans un café égyptien." },
    { title: "22h00 – Retour à l'hôtel", content: "Retour à l'hôtel." },
  ],
  'private-delfin-tour-hurghada': [
    { title: "Prise en charge à l'hôtel", content: "Prise en charge ponctuelle directement à votre hôtel dans un véhicule climatisé." },
    { title: "Départ de la marina", content: "Accueil personnel, équipement, brève introduction – puis votre aventure commence." },
    { title: "Rencontre avec les dauphins", content: "Trajet vers les meilleurs sites de dauphins. Avec un peu de chance, vous observez des dauphins en liberté et pouvez – si les conditions le permettent – nager avec eux. Remarque : les dauphins sont des animaux sauvages. Une observation ne peut pas être garantie, mais le taux de réussite est très élevé." },
    { title: "Snorkeling sur des récifs coralliens", content: "Deux arrêts sur de colorés récifs avec un monde sous-marin impressionnant." },
    { title: "Épave", content: "Découvrez une fascinante épave avec un monde sous-marin impressionnant, plein de poissons et de coraux." },
    { title: "Retour", content: "Vers 12h00, retour et transfert à l'hôtel." },
  ],
  'private-speedboot-tour-orange-bay-hurghada': [
    { title: "Prise en charge à l'hôtel", content: "Prise en charge à Hurghada, El Gouna, Makadi Bay, Soma Bay ou Safaga." },
    { title: "Accueil et briefing sécurité", content: "Accueil personnel et briefing sécurité à bord de votre bateau privé." },
    { title: "Séances de snorkeling", content: "1 à 2 séances de snorkeling sur les plus beaux récifs de la mer Rouge." },
    { title: "Orange Bay ou l'île de Magawish", content: "Trajet vers Orange Bay ou l'île de Magawish avec temps libre, déjeuner et détente sur la plage." },
    { title: "Détente", content: "Détente sur la plage ou à bord du bateau." },
    { title: "Retour", content: "Retour au port et transfert à l'hôtel." },
  ],
  'privater-speedboot-ausflug-in-hurghada-schnorcheln-an-korallenriffen-sonnenuntergang': [
    { title: "Snorkeling dans la mer Rouge", content: "La mer Rouge compte parmi les plus belles zones de snorkeling au monde. Découvrez de colorés récifs coralliens, des poissons tropicaux de récif, des tortues, des raies et des poissons Napoléon dans une eau claire et chaude avec une excellente visibilité." },
    { title: "Séjour sur une île tranquille", content: "Arrêt sur une île isolée avec une plage de sable clair. Ici, vous avez largement le temps de nager, de vous dorer ou de vous détendre. Grâce à l'organisation privée de l'excursion, vous évitez les foules et profitez de la nature dans une atmosphère calme." },
    { title: "Coucher de soleil sur la mer Rouge", content: "Au retour, vivez le coucher de soleil sur la mer Rouge. La lumière particulière sur l'eau fait de ce moment une conclusion pleine d'atmosphère pour l'excursion." },
  ],
  'privater-tagesausflug-ab-hurghada-dendera-abydos-tempel': [
    { title: "Prise en charge (04h00–04h30)", content: "Prise en charge à l'hôtel à Hurghada." },
    { title: "Trajet vers Dendera", content: "Trajet vers Dendera (environ 250 km)." },
    { title: "Visite du temple d'Hathor", content: "Environ 2 heures de visite du temple d'Hathor." },
    { title: "Poursuite vers Abydos", content: "Poursuite du trajet vers Abydos (environ 100 km)." },
    { title: "Déjeuner à Abydos", content: "Déjeuner à Abydos." },
    { title: "Visite du temple d'Abydos", content: "Environ 2 heures de visite du temple d'Abydos." },
    { title: "Retour à Hurghada", content: "Retour à Hurghada. Environ 13 heures au total." },
  ],
  'privater-tagesausflug-von-hurghada-nach-kairo-pyramiden-grand-egyptian-museum': [
    { title: "Prise en charge à Hurghada", content: "Tôt le matin, vous êtes pris en charge directement à votre hôtel à Hurghada. Le trajet vers le Caire se fait confortablement dans un véhicule privé moderne et climatisé, avec boissons gratuites comprises." },
    { title: "Pyramides de Gizeh", content: "Après votre arrivée au Caire, découvrez les pyramides mondialement célèbres de Khéops, Khéphren et Mykérinos ainsi que l'impressionnant Sphinx et le temple de la vallée." },
    { title: "Grand Egyptian Museum", content: "Ensuite, visitez le spectaculaire Grand Egyptian Museum – le plus grand musée archéologique du monde, avec des trésors uniques de l'Égypte ancienne." },
    { title: "Déjeuner", content: "Savourez un délicieux déjeuner dans un restaurant sélectionné au Caire. (Les boissons du déjeuner ne sont pas comprises dans le prix)." },
    { title: "Retour à Hurghada", content: "Après une journée riche en expériences, votre chauffeur privé vous ramène en toute sécurité et détendu à votre hôtel à Hurghada." },
  ],
  'quad-tour-hurghada-kamelritt': [
    { title: "Prise en charge à l'hôtel", content: "Transfert confortable depuis votre logement à Hurghada." },
    { title: "Briefing et départ", content: "Brève introduction – puis directement sur le quad." },
    { title: "Safari en quad dans le désert", content: "Franchissez les dunes de sable et vivez une véritable sensation de tout-terrain." },
    { title: "Village bédouin et thé", content: "Aperçu de la culture du désert, avec thé traditionnel inclus." },
    { title: "Balade à dos de chameau", content: "Une courte expérience authentique pour des photos et des impressions." },
    { title: "Retour à l'hôtel", content: "Retour détendu après votre excursion." },
  ],
  'super-safari-hurghada': [
    { title: "Prise en charge à l'hôtel", content: "Prise en charge à l'hôtel à Hurghada ou aux environs." },
    { title: "Station du désert", content: "Trajet jusqu'à la station du désert." },
    { title: "Balade en quad", content: "Briefing et départ de la balade en quad." },
    { title: "Spider-Buggy", content: "Balade en Spider-Buggy dans le désert." },
    { title: "Safari en jeep et village bédouin", content: "Safari en jeep jusqu'au village bédouin. Balade à dos de chameau et visite du village." },
    { title: "Coucher de soleil", content: "Coucher de soleil dans le désert." },
    { title: "Dîner BBQ et folklore", content: "Dîner BBQ et spectacle folklorique." },
    { title: "Retour à l'hôtel", content: "Retour à l'hôtel." },
  ],
};

async function main() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: tours } = await db.from('tours').select('id, slug, itinerary').in('slug', Object.keys(REWRITES));
  const bySlug = Object.fromEntries((tours || []).map(t => [t.slug, t]));

  let bad = 0;
  const proposal = [];
  for (const [slug, steps] of Object.entries(REWRITES)) {
    const tour = bySlug[slug];
    if (!tour) { console.log(`SKIP (no tour): ${slug}`); continue; }
    const deItin = parseItin(tour.itinerary) || [];
    if (deItin.length !== steps.length) {
      bad++; console.log(`STEP COUNT MISMATCH: ${slug} de=${deItin.length} fr=${steps.length}`);
    }
    const deWords = steps.flatMap(s => germanWords(s.title).concat(germanWords(s.content)));
    if (deWords.length > 0) {
      bad++;
      console.log(`GERMAN WORDS FOUND in rewrite: ${slug} -> ${deWords.join(', ')}`);
    }

    const { data: frRows } = await db.from('content_translations')
      .select('id')
      .eq('table_name', 'tours')
      .eq('row_id', tour.id)
      .eq('locale', 'fr');
    const frRow = frRows?.[0];
    if (!frRow) { console.log(`SKIP (no fr row): ${slug}`); continue; }

    proposal.push({ slug, id: frRow.id, deSteps: deItin.length, frSteps: steps.length, steps });
    if (IS_DRY_RUN) {
      console.log(`[DRY] ${slug} (id=${frRow.id}) deSteps=${deItin.length} frSteps=${steps.length}`);
      continue;
    }
    const { error } = await db.from('content_translations').update({ content: JSON.stringify(steps) }).eq('id', frRow.id);
    if (error) console.error(`ERROR ${slug}: ${error.message}`);
    else console.log(`OK ${slug} (id=${frRow.id}) steps=${steps.length}`);
  }

  if (IS_DRY_RUN) {
    fs.writeFileSync(path.join(__dirname, 'fr_itin_proposal.json'), JSON.stringify(proposal, null, 1), 'utf8');
    console.log(`\nWrote fr_itin_proposal.json (${proposal.length} tours)`);
    console.log(`Self-check issues: ${bad}`);
    console.log('Run with --apply to execute.');
  } else {
    console.log(`\nApplied ${Object.keys(REWRITES).length} tours. Self-check issues: ${bad}`);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
