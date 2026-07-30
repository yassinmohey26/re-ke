// Batch 1: Full EN translations for first 5 tours (DE -> EN)
// Source of truth: German content from tours table
// Generates JSON output file for review before DB write

require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const SLUGS = [
  'glasbodenboot-hurghada-mit-schnorcheln',
  'mahmya-insel-ausflug-hurghada',
  'luxor-tagesausflug-heissluftballon-hoteluebernachtung',
  'private-delfin-tour-hurghada',
  'kloester-st-antonius-st-paulus'
];

// === TRANSLATIONS ===

// Tour 1: Glass-Bottom Boat
function translateGlassBottomBoat(tour) {
  const itinerary = [
    { title: 'Hotel Pickup', content: 'Pickup from your hotel in Hurghada in an air-conditioned vehicle.' },
    { title: 'Transfer to Harbor & Boarding', content: 'Welcome, short briefing, and start of the boat tour.' },
    { title: 'Glass-Bottom Boat Ride', content: 'Ride over the coral reefs with a direct view of the underwater world.' },
    { title: 'Snorkeling Stop (30 Minutes)', content: 'Guided snorkeling at a calm reef.' },
    { title: 'Relax On Board', content: 'Enjoy drinks and take photos.' },
    { title: 'Return & Hotel Transfer', content: 'Return to the harbor and transfer back to your hotel.' }
  ];

  const highlights = [
    'Glass-bottom boat with panoramic views of coral reefs',
    '30 minutes of snorkeling in the Red Sea',
    'Popular family-friendly excursion in the Red Sea',
    'Perfect for families & beginners',
    'Snorkeling equipment included',
    'Hotel transfer included'
  ];

  const included = [
    'Pickup & return transfer from hotel',
    'Glass-bottom boat ride',
    '30-minute snorkeling stop',
    'Snorkeling equipment & life vest',
    'Mineral water & soft drinks'
  ];

  const notIncluded = [
    'Personal expenses',
    'Tips (optional)',
    'Transfer surcharges for certain areas'
  ];

  const faqs = [
    {
      question: 'How long does the glass-bottom boat excursion in Hurghada take?',
      answer: 'The glass-bottom boat excursion in Hurghada lasts approximately 3 hours in total, including hotel transfer, the boat ride on the Red Sea, and a snorkeling stop at a beautiful coral reef.'
    },
    {
      question: 'Is hotel transfer included in the price?',
      answer: 'Yes, pickup and return transfer from your hotel in Hurghada are included in the price. For hotels outside Hurghada, a small surcharge may apply.'
    },
    {
      question: 'Is snorkeling suitable for beginners?',
      answer: 'Yes, the snorkeling stop is perfect for beginners. It takes place in calm waters with guidance from experienced guides. Life vests and snorkeling equipment are provided.'
    },
    {
      question: 'Is the excursion suitable for children?',
      answer: 'Yes, the glass-bottom boat excursion is family-friendly and very suitable for children. Through the large panoramic windows, even young children can safely observe the fascinating underwater world.'
    },
    {
      question: 'Are life vests provided?',
      answer: 'Yes, life vests are available free of charge for both adults and children. Safety is our top priority throughout the entire excursion.'
    },
    {
      question: 'Is snorkeling equipment provided?',
      answer: 'Yes, mask, snorkel, and life vest are all included. You don\'t need your own gear — just jump straight into the water.'
    },
    {
      question: 'What fish and coral can I see?',
      answer: 'During the glass-bottom boat ride, you can see colorful coral reefs as well as clownfish, parrotfish, surgeonfish, and many other tropical species. The underwater world of Hurghada is among the most beautiful in the Red Sea.'
    },
    {
      question: 'Can I take photos and videos?',
      answer: 'Yes, photography and filming are allowed throughout the excursion and are highly encouraged. Don\'t forget to bring a waterproof camera or a phone with a protective case.'
    },
    {
      question: 'Are drinks included on board?',
      answer: 'Yes, mineral water and soft drinks are provided for all guests on board, so you can sit back and enjoy your trip.'
    },
    {
      question: 'Do I need to know how to swim?',
      answer: 'No, non-swimmers can also join and observe the underwater world through the large panoramic windows. Those who want to snorkel will receive a life vest and be accompanied by experienced guides.'
    }
  ];

  return { itinerary, highlights, included, notIncluded, faqs };
}

// Tour 2: Mahmya Island
function translateMahmyaIsland(tour) {
  const itinerary = [
    { title: 'Pickup & Transfer to Harbor', content: 'In the early morning, you\'ll be picked up directly from your hotel and taken to the harbor, where the friendly crew welcomes you aboard your comfortable boat.' },
    { title: 'Snorkeling Trip', content: 'After receiving your snorkeling equipment and a short briefing, the journey across the deep-blue Red Sea begins. Soon you\'ll reach the first snorkeling spots with colorful fish, coral formations, and — with some luck — even sea turtles or dolphins.' },
    { title: 'Mahmya Island & Lunch', content: 'After arriving at Mahmya Island, enjoy the dreamlike scenery and a freshly prepared lunch buffet at a beachfront restaurant. The rest of the day is yours: relax, swim, explore the island, or simply soak up the sun and serenity.' },
    { title: 'Return to Hotel', content: 'In the afternoon, you\'ll return relaxed to the harbor and be transferred back to your hotel.' }
  ];

  const highlights = [
    'Hotel transfer from Hurghada included',
    'Boat trip to Mahmya Island in the Red Sea',
    'Snorkeling at vibrant coral reefs',
    'Time on Mahmya Island',
    'Beachfront lunch included',
    'Free time for swimming, snorkeling & relaxing'
  ];

  const included = [
    'Full-day boat trip to Mahmya Island',
    'Hotel transfer (round trip)',
    'Lunch on the island',
    'Water, soft drinks & fruit',
    'Experienced snorkeling guide',
    'Snorkeling equipment'
  ];

  const notIncluded = [
    'Personal expenses',
    'Tips (voluntary)',
    'Transfer surcharges for certain areas'
  ];

  const faqs = [
    {
      question: 'What is the Mahmya Island trip?',
      answer: 'The Mahmya Island trip is a full-day boat tour from Hurghada to the stunning Mahmya Island in Giftun National Park. Enjoy snorkeling, white sandy beaches, crystal-clear water, and a delicious lunch right on the Red Sea.'
    },
    {
      question: 'How long does the trip last?',
      answer: 'The Mahmya Island tour lasts approximately 7 hours, including hotel transfer, boat trip, beach time, and return.'
    },
    {
      question: 'What activities are included?',
      answer: 'The trip includes:\n\n• Boat trip to Mahmya Island\n• Snorkeling at colorful coral reefs\n• Free time on the white sandy beach\n• Lunch\n• Hotel transfer'
    },
    {
      question: 'Do I need snorkeling experience?',
      answer: 'No. The Mahmya Island tour is suitable for both beginners and experienced snorkelers. The guides support you at all times and ensure a safe snorkeling experience.'
    },
    {
      question: 'Are there beaches and facilities on Mahmya Island?',
      answer: 'Yes, the island has fine white sandy beaches, restrooms, and showers — perfect for a relaxing day.'
    },
    {
      question: 'Is lunch included?',
      answer: 'Yes, you\'ll enjoy a hearty lunch buffet with drinks and fruit right on the beach.'
    },
    {
      question: 'Can I see dolphins or other marine life?',
      answer: 'With some luck, you may encounter dolphins, sea turtles, and colorful schools of fish — a highlight for every visitor!'
    },
    {
      question: 'Is the trip suitable for children?',
      answer: 'Yes, the Mahmya Island trip is family-friendly.\n\n• 0–2 years: free\n• 3–10 years: 50% discount\n• 11 years and up: full price'
    },
    {
      question: 'What should I bring?',
      answer: 'We recommend:\n\n• Swimwear\n• Towel\n• Sunscreen\n• Sunglasses\n• Sun hat\n• Camera or smartphone\n• Personal items'
    },
    {
      question: 'Why should I book with Hurghada Travel Planner?',
      answer: 'With Hurghada Travel Planner, you benefit from verified quality, fair prices, experienced guides, and reliable customer service. We make sure your Mahmya Island trip is safe, comfortable, and unforgettable.'
    }
  ];

  return { itinerary, highlights, included, notIncluded, faqs };
}

// Tour 3: Luxor Hot Air Balloon
function translateLuxorBalloon(tour) {
  const itinerary = [
    { title: '5:00 PM – Pickup from Hotel', content: 'Departure from Hurghada, Marsa Alam, or El Quseir in an air-conditioned private vehicle. After approximately 3.5 hours, you will arrive in Luxor.' },
    { title: 'Arrival, Dinner & Check-in', content: 'Enjoy a relaxing dinner and check into your selected hotel, as the night prepares you for the morning\'s adventure ahead.' },
    { title: 'Sunrise Over Luxor – Hot Air Balloon Ride', content: 'Around 4:00 AM, your hot air balloon journey begins. As the sun slowly colors the Nile Valley, you float above temples, fields, and the West Bank of ancient Thebes — a moment that will be the highlight of your travel album.' },
    { title: 'Valley of the Kings – Three Tombs', content: 'Explore the tombs of the pharaohs, whose wall paintings have glowed for millennia.' },
    { title: 'Temple of Hatshepsut', content: 'A temple carved from the rock itself. Dignity, history, clean lines.' },
    { title: 'Colossi of Memnon – Photo Stop', content: 'The monumental guardian statues of Amenhotep III await you.' },
    { title: 'Lunch on the Nile', content: 'A hearty Egyptian meal provides energy for the rest of the day.' },
    { title: 'Karnak Temple', content: 'The grand finale of your trip: discover the largest temple complex in Egypt. Temples, massive columns, millennia of culture — a fitting conclusion.' },
    { title: 'Return to Hurghada', content: 'Arrival at your hotel around 8:00 PM.' }
  ];

  const highlights = [
    'Hot air balloon ride over Luxor at sunrise — unforgettable panoramic views over the Nile',
    'Karnak Temple — the largest religious structure of antiquity',
    'Valley of the Kings — visit three magnificent tombs with original wall paintings',
    'Hatshepsut Temple — the masterpiece of Egypt\'s most powerful queen',
    'Colossi of Memnon — impressive remains of the Temple of Amenhotep III',
    'Hotel overnight stay including dinner & breakfast'
  ];

  const included = [
    'Professional Egyptologist guide',
    'Admission fees for all attractions per the program',
    '45–60 minute hot air balloon ride over Luxor',
    'Hotel overnight stay including dinner & breakfast',
    'All transfers in an air-conditioned vehicle',
    'All taxes & service fees'
  ];

  const notIncluded = [
    'Drinks at the restaurant',
    'Personal expenses',
    'Transfer surcharge for guests from Marsa Alam: €25 per person',
    'Transfer surcharge for guests from El Quseir: €15 per person',
    'Transfer surcharge from Makadi Bay & Sahl Hasheesh: €5 per person',
    'Transfer surcharge from El Gouna, Safaga & Soma Bay: €10 per person',
    'Foreign-language guide (English, Russian, or French): surcharge €10 per person'
  ];

  const faqs = [
    {
      question: 'How does the hot air balloon ride in Luxor work?',
      answer: 'The balloon ride begins before sunrise. After the transfer to the launch site, you\'ll experience an approximately 45–60 minute flight with spectacular views over Luxor, the Nile, and the temple complex.'
    },
    {
      question: 'Is the balloon ride safe?',
      answer: 'Yes, it is conducted exclusively by government-certified pilots. All balloons are serviced daily and subject to strict safety checks. Flights only take place under suitable weather conditions.'
    },
    {
      question: 'Which sites are visited during the tour?',
      answer: 'You will visit Karnak Temple, the Valley of the Kings, Hatshepsut Temple, and the Colossi of Memnon.'
    },
    {
      question: 'How long does the tour last including travel?',
      answer: 'Approximately 27–28 hours (pickup the evening before, return the following evening).'
    },
    {
      question: 'Is the overnight stay included?',
      answer: 'Yes, including hotel accommodation with dinner and breakfast.'
    },
    {
      question: 'Are there child discounts?',
      answer: 'Yes!\n\n0–2 years: free\n3–10 years: 50% discount\n11 years and up: full price'
    },
    {
      question: 'What clothing is recommended?',
      answer: 'Comfortable clothing, sturdy shoes, and a light jacket in winter. It can be cool in the morning for the balloon launch.'
    },
    {
      question: 'What if I\'m afraid of heights? Is the ride suitable for beginners?',
      answer: 'The balloon ride is smooth and gentle. Even guests with no prior experience enjoy the flight without issues. If you have severe fear of heights, please contact us before booking.'
    },
    {
      question: 'Is there a guide on the tour?',
      answer: 'Yes, a professional Egyptologist guide accompanies the entire tour.'
    },
    {
      question: 'Does the balloon ride take place in all weather?',
      answer: 'No. Safety comes first. In strong winds or bad weather, the launch will be postponed or a suitable alternative offered.'
    }
  ];

  return { itinerary, highlights, included, notIncluded, faqs };
}

// Tour 4: Private Dolphin Tour
function translatePrivateDolphin(tour) {
  const itinerary = [
    { title: 'Hotel Pickup', content: 'Punctual direct pickup from your hotel in an air-conditioned vehicle.' },
    { title: 'Start at the Marina', content: 'Personal welcome, equipment handover, and a short briefing — then your adventure begins.' },
    { title: 'Dolphin Encounter', content: 'Boat ride to the best dolphin spots. With luck, you\'ll spot dolphins in the wild and can — if conditions allow — swim alongside them. Note: Dolphins are wild animals. Sightings cannot be guaranteed, but the success rate is very high.' },
    { title: 'Snorkeling at Coral Reefs', content: 'Two stops at colorful reefs with impressive underwater scenery.' },
    { title: 'Shipwreck', content: 'Discover a fascinating shipwreck teeming with fish and coral.' },
    { title: 'Return Journey', content: 'Return at around 12:00 PM and transfer to your hotel.' }
  ];

  const highlights = [
    'Private speedboat excursion from Hurghada',
    'Watch dolphins in the wild',
    'Two spectacular coral reefs',
    'Snorkeling at a sunken shipwreck',
    'Soft drinks & fresh fruit on board',
    'Hotel transfer included'
  ];

  const included = [
    'Private speedboat with experienced captain',
    'Hotel transfer (round trip)',
    'Snorkeling equipment',
    'Dolphin watching in the wild',
    'Two snorkeling stops',
    'Soft drinks, water & fresh fruit'
  ];

  const notIncluded = [
    'Personal expenses',
    'Meals',
    'Transfer surcharges for certain areas'
  ];

  const faqs = [
    {
      question: 'Can I be guaranteed to swim with the dolphins?',
      answer: 'Dolphins are wild animals, so sightings or swimming with dolphins cannot be guaranteed. However, the chances are very high as we visit known dolphin areas specifically.'
    },
    {
      question: 'Is the tour suitable for children?',
      answer: 'Yes, children aged 3 and up are welcome. Life vests are provided.'
    },
    {
      question: 'Is hotel transfer included?',
      answer: 'Yes, pickup and return transfer in an air-conditioned vehicle are included.'
    },
    {
      question: 'What equipment is needed?',
      answer: 'Full snorkeling equipment is included. Please bring swimwear, a towel, sunscreen, and a hat.'
    },
    {
      question: 'What happens in bad weather?',
      answer: 'In strong wind or bad weather, the tour will be rescheduled or canceled for safety reasons.'
    },
    {
      question: 'How many people are on the boat?',
      answer: 'Maximum 8 people to ensure privacy and comfort.'
    },
    {
      question: 'How long does the tour last?',
      answer: 'Approximately 4 hours from hotel pickup to return.'
    },
    {
      question: 'Which island do we visit?',
      answer: 'Depending on weather and sea conditions, we visit a beautiful island in the Red Sea with white sandy beaches and turquoise water.'
    },
    {
      question: 'What fish can I see while snorkeling?',
      answer: 'You can discover clownfish, parrotfish, angelfish, rays, and many other tropical marine creatures.'
    },
    {
      question: 'What makes this private dolphin tour special?',
      answer: 'This tour is 100% private — no strangers and no crowded boats. You ride an exclusive speedboat to known dolphin areas, snorkel at impressive coral reefs, and visit a shipwreck. The route can be flexibly adapted for a truly personal experience.'
    }
  ];

  return { itinerary, highlights, included, notIncluded, faqs };
}

// Tour 5: Monasteries
function translateMonasteries(tour) {
  const itinerary = [
    { title: 'Pickup (4:00 AM)', content: 'Direct pickup from your hotel in Hurghada.' },
    { title: 'Drive to St. Anthony\'s Monastery', content: 'Drive through the Eastern Desert to St. Anthony\'s Monastery.' },
    { title: 'Visit St. Anthony\'s Monastery', content: 'Visit the historic churches, frescoes, and manuscripts.' },
    { title: 'Cave of St. Anthony', content: 'Ascent to the Cave of St. Anthony (optional).' },
    { title: 'Continue to St. Paul\'s Monastery', content: 'Drive on to St. Paul\'s Monastery.' },
    { title: 'Visit St. Paul\'s Monastery', content: 'Visit the monastery and church of St. Paul.' },
    { title: 'Lunch', content: 'Lunch at a local restaurant.' },
    { title: 'Return to Hurghada', content: 'Return to Hurghada. Arrival: approximately 5:00 PM.' }
  ];

  const highlights = [
    'Visit the oldest Christian monasteries in the world',
    'Historic churches, frescoes, and valuable manuscripts',
    'Ascent to the Cave of St. Anthony (optional)',
    'Breathtaking desert landscapes of the Red Sea Mountains',
    'Expert guide',
    'Lunch included'
  ];

  const included = [
    'All transfers in an air-conditioned vehicle',
    'Professional guide',
    'Entrance fees per program',
    'Lunch',
    'Drinks in the vehicle',
    'All service charges and taxes'
  ];

  const notIncluded = [
    'Drinks at the restaurant',
    'Personal expenses',
    'Transfer surcharge for guests from Marsa Alam: €25 per person',
    'Transfer surcharge for guests from El Quseir: €15 per person',
    'Transfer surcharge from Makadi Bay & Sahl Hasheesh: €5 per person',
    'Transfer surcharge from El Gouna, Safaga & Soma Bay: €10 per person',
    'Foreign-language guide (English, Russian or French): surcharge €10 per person'
  ];

  const faqs = [
    {
      question: 'What makes this excursion so special?',
      answer: 'This private excursion to the monasteries of St. Anthony and St. Paul from Hurghada combines history, spirituality, and stunning desert landscapes. You\'ll visit the oldest Christian monasteries in the world with an expert guide — far from the usual tourist routes.'
    },
    {
      question: 'How long does the excursion take?',
      answer: 'The private monastery excursion from Hurghada lasts approximately 14 hours, including round-trip transfer, all visits, and lunch.'
    },
    {
      question: 'What time is pickup?',
      answer: 'Pickup is between 3:30 AM and 4:30 AM depending on your hotel location in Hurghada. We\'ll confirm the exact time before the trip.'
    },
    {
      question: 'Do I have to visit the Cave of St. Anthony?',
      answer: 'No. The ascent to the cave is voluntary. If you prefer not to climb, you can explore St. Anthony\'s Monastery at your leisure or relax on the grounds.'
    },
    {
      question: 'Is the excursion suitable for children?',
      answer: 'Yes, the private monastery tour is family-friendly. Discounts:\n\n0–2 years: free\n3–10 years: 50% discount\n11 years and up: full price'
    },
    {
      question: 'What clothing is recommended?',
      answer: 'Light, comfortable clothing and sturdy footwear. Since these are active monasteries, shoulders and knees must be covered. We also recommend a sun hat, sunscreen, and plenty of water.'
    },
    {
      question: 'What is included in the price?',
      answer: 'The price includes: transfers in an air-conditioned vehicle, a professional guide, all entrance fees, lunch, and drinks during the drive.'
    },
    {
      question: 'Are there additional costs during the tour?',
      answer: 'No. All main services — transfers, entrance fees, guide, and lunch — are included. Extra costs only apply for personal expenses or drinks at the restaurant.'
    },
    {
      question: 'Can I take photos in the monasteries?',
      answer: 'Yes. Photography is allowed in most areas. Flash photography may be prohibited in some churches or chapels. Your guide will inform you of the rules on-site.'
    },
    {
      question: 'Is the tour safe for all ages?',
      answer: 'Yes. The tour is accompanied by experienced drivers and a guide. The monasteries are accessible to almost all age groups. Only the cave ascent requires good physical fitness and is optional.'
    }
  ];

  return { itinerary, highlights, included, notIncluded, faqs };
}

(async () => {
  const { data: tours } = await db.from('tours').select('*').in('slug', SLUGS);
  const { data: allTrs } = await db.from('content_translations').select('*').eq('locale', 'en').eq('table_name', 'tours');

  const output = [];

  for (const slug of SLUGS) {
    const tour = tours.find(t => t.slug === slug);
    if (!tour) { console.log(`Tour not found: ${slug}`); continue; }

    const currentEn = allTrs.find(t => t.row_id === tour.id);

    let translated;
    switch (slug) {
      case 'glasbodenboot-hurghada-mit-schnorcheln': translated = translateGlassBottomBoat(tour); break;
      case 'mahmya-insel-ausflug-hurghada': translated = translateMahmyaIsland(tour); break;
      case 'luxor-tagesausflug-heissluftballon-hoteluebernachtung': translated = translateLuxorBalloon(tour); break;
      case 'private-delfin-tour-hurghada': translated = translatePrivateDolphin(tour); break;
      case 'kloester-st-antonius-st-paulus': translated = translateMonasteries(tour); break;
    }

    // Build the content_translations update payload
    const translatedNames = {
      'glasbodenboot-hurghada-mit-schnorcheln': 'Glass-Bottom Boat Hurghada with Snorkeling (30 Min.) & Hotel Transfer',
      'mahmya-insel-ausflug-hurghada': 'Mahmya Island Trip Hurghada with Snorkeling & Lunch',
      'luxor-tagesausflug-heissluftballon-hoteluebernachtung': 'Luxor Day Trip with Hot Air Balloon Ride & Hotel Overnight from Hurghada',
      'private-delfin-tour-hurghada': 'Private Dolphin Tour Hurghada by Speedboat',
      'kloester-st-antonius-st-paulus': 'Monasteries of St. Anthony & St. Paul from Hurghada – The Oldest Christian Monasteries in the World'
    };
    const enUpdate = {
      name: translatedNames[slug] || tour.name,
      short_description: tour.short_description,
      description: tour.description,
      highlights: translated.highlights,
      included: translated.included,
      not_included: translated.notIncluded,
      content: JSON.stringify(translated.itinerary),
      faqs: translated.faqs,
      meeting_point: tour.meeting_point,
      duration: tour.duration
    };

    // Show current EN for comparison
    const before = currentEn ? {
      name: currentEn.name,
      short_description: currentEn.short_description,
      description: currentEn.description,
      itinerary: typeof currentEn.content === 'string' ? JSON.parse(currentEn.content) : (Array.isArray(currentEn.content) ? currentEn.content : []),
      highlights: currentEn.highlights,
      included: currentEn.included,
      not_included: currentEn.not_included,
      faqs: currentEn.faqs,
      faqCount: Array.isArray(currentEn.faqs) ? currentEn.faqs.length : 0
    } : { name: '(no EN translation exists)' };

    output.push({
      slug,
      before,
      after: {
        name: enUpdate.name,
        short_description: enUpdate.short_description,
        description: enUpdate.description ? enUpdate.description.substring(0, 200) + '...' : '(none)',
        itinerary: translated.itinerary,
        highlights: translated.highlights,
        included: translated.included,
        not_included: translated.notIncluded,
        faqs: translated.faqs.map(f => ({ question: f.question.substring(0, 60), answer: f.answer.substring(0, 80) + '...' }))
      }
    });

    console.log(`\n✅ ${slug}: ${translated.itinerary.length} steps, ${translated.faqs.length} FAQs, ${translated.highlights.length} highlights`);
  }

  // User approved — write to DB
  console.log('\n--- WRITING TO DATABASE ---');
  for (const item of output) {
    const tour = tours.find(t => t.slug === item.slug);
    if (!tour) continue;

    let translated;
    switch (item.slug) {
      case 'glasbodenboot-hurghada-mit-schnorcheln': translated = translateGlassBottomBoat(tour); break;
      case 'mahmya-insel-ausflug-hurghada': translated = translateMahmyaIsland(tour); break;
      case 'luxor-tagesausflug-heissluftballon-hoteluebernachtung': translated = translateLuxorBalloon(tour); break;
      case 'private-delfin-tour-hurghada': translated = translatePrivateDolphin(tour); break;
      case 'kloester-st-antonius-st-paulus': translated = translateMonasteries(tour); break;
    }

    const translatedNames = {
      'glasbodenboot-hurghada-mit-schnorcheln': 'Glass-Bottom Boat Hurghada with Snorkeling (30 Min.) & Hotel Transfer',
      'mahmya-insel-ausflug-hurghada': 'Mahmya Island Trip Hurghada with Snorkeling & Lunch',
      'luxor-tagesausflug-heissluftballon-hoteluebernachtung': 'Luxor Day Trip with Hot Air Balloon Ride & Hotel Overnight from Hurghada',
      'private-delfin-tour-hurghada': 'Private Dolphin Tour Hurghada by Speedboat',
      'kloester-st-antonius-st-paulus': 'Monasteries of St. Anthony & St. Paul from Hurghada – The Oldest Christian Monasteries in the World'
    };

    const payload = {
      name: translatedNames[item.slug] || tour.name,
      short_description: tour.short_description,
      description: tour.description,
      highlights: translated.highlights,
      included: translated.included,
      not_included: translated.notIncluded,
      content: JSON.stringify(translated.itinerary),
      faqs: translated.faqs,
      meeting_point: tour.meeting_point,
      duration: tour.duration
    };

    const currentEn = allTrs.find(t => t.row_id === tour.id);

    if (currentEn) {
      const { error } = await db.from('content_translations').update(payload).eq('id', currentEn.id);
      if (error) console.error(`❌ UPDATE ${item.slug}:`, error.message);
      else console.log(`✅ Updated EN: ${item.slug}`);
    } else {
      const { error } = await db.from('content_translations').insert({
        table_name: 'tours', row_id: tour.id, locale: 'en', ...payload
      });
      if (error) console.error(`❌ INSERT ${item.slug}:`, error.message);
      else console.log(`✅ Inserted EN: ${item.slug}`);
    }
  }

  console.log('\nBatch 1 complete — 5 tours written to DB!');
})();
