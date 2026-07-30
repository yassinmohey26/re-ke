// Batch 2: Full EN translations for tours 6-10 (DE -> EN)
// Review first, then write to DB

require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const SLUGS = [
  'quad-tour-hurghada-kamelritt',
  'reiten-in-hurghada-strand-wueste-pferde-im-meer',
  'luxor-tagesausflug-ab-hurghada',
  'hurghada-shopping-tour-basar-transfer',
  'kairo-mit-flug-ab-hurghada-pyramiden-museum'
];

const NAMES = {
  'quad-tour-hurghada-kamelritt': 'Quad Safari Hurghada – 3-Hour Desert Tour with Camel Ride & Bedouin Village',
  'reiten-in-hurghada-strand-wueste-pferde-im-meer': 'Horseback Riding in Hurghada – Beach, Desert & Swimming with Horses',
  'luxor-tagesausflug-ab-hurghada': 'Private Day Trip to Luxor from Hurghada – Valley of the Kings & Karnak Temple',
  'hurghada-shopping-tour-basar-transfer': 'Hurghada Shopping Tour – Free Bazaar Excursion with Transfer',
  'kairo-mit-flug-ab-hurghada-pyramiden-museum': 'Cairo Day Trip by Flight from Hurghada – Pyramids, Sphinx & Grand Egyptian Museum'
};

// Tour 6: Quad Safari
function translateQuad(tour) {
  return {
    itinerary: [
      { title: 'Hotel Pickup', content: 'Comfortable transfer from your accommodation in Hurghada.' },
      { title: 'Briefing & Start', content: 'Short introduction — then straight onto the quad bike.' },
      { title: 'Quad Safari Through the Desert', content: 'Ride over sand dunes and experience a true off-road adventure.' },
      { title: 'Bedouin Village & Tea', content: 'Insight into desert culture, including traditional tea.' },
      { title: 'Camel Ride', content: 'A short, authentic experience for photos and lasting impressions.' },
      { title: 'Return Transfer to Hotel', content: 'Relaxed return to your hotel after the tour.' }
    ],
    highlights: [
      'Quad safari in Hurghada through desert & sand dunes',
      'Over 50 km of quad biking fun',
      'Camel ride & traditional Bedouin village included',
      'Perfect for beginners — no experience needed',
      'Hotel pickup & return transfer included',
      'Daily quad tour in Hurghada',
      'Desert adventure in Egypt'
    ],
    included: [
      'Hotel transfer (round trip)',
      'Guided quad safari through the desert',
      'Professional guide',
      'Helmet',
      'Camel ride',
      'Bedouin tea',
      '1 bottle of water'
    ],
    notIncluded: [
      'Tips',
      'Personal expenses',
      'Transfer surcharges for certain areas'
    ],
    faqs: [
      { question: 'Do I need experience for the quad safari?', answer: 'No, no prior experience is needed for our quad safari in Hurghada. The tour is ideal for beginners and advanced riders alike. You\'ll receive a thorough introduction and safety briefing before you start.' },
      { question: 'Is hotel transfer included in the price?', answer: 'Yes, pickup and return transfer from your hotel in Hurghada are generally included. For hotels outside Hurghada, a small surcharge may apply.' },
      { question: 'How long does the quad tour take?', answer: 'The entire quad safari in Hurghada lasts about 3 hours, including hotel transfer, safety briefing, quad riding, camel ride, and return.' },
      { question: 'Is the quad safari safe?', answer: 'Yes, safety is our top priority. You\'ll receive a detailed introduction before starting, and the tour is accompanied by an experienced guide at all times.' },
      { question: 'From what age can I participate?', answer: 'Participants must be at least 10 years old. For safety reasons, the tour is not suitable for younger children.' },
      { question: 'Can pregnant women participate?', answer: 'No, for safety reasons we do not recommend pregnant women take part in the quad safari, as the route goes over uneven terrain.' },
      { question: 'Do I ride my own quad or share with someone?', answer: 'Depending on the option you book, you can ride your own quad or join as a passenger on a double quad. Both options are available.' },
      { question: 'How long do I actually ride the quad?', answer: 'Most of the tour is spent riding the quad through the impressive desert landscape around Hurghada.' },
      { question: 'Can I ride the quad without a driver\'s license?', answer: 'Yes, no driver\'s license is required. All participants receive a detailed introduction before the tour begins.' },
      { question: 'What should I bring?', answer: 'We recommend sunglasses, a scarf or shawl as dust protection, comfortable clothing, and sturdy closed-toe shoes.' }
    ]
  };
}

// Tour 7: Horseback Riding
function translateHorseback(tour) {
  return {
    itinerary: [
    { title: 'Hotel Pickup', content: 'Comfortable pickup from your hotel in Hurghada or the surrounding area.' },
    { title: 'Briefing & Preparation', content: 'Get to know your horse and receive a short safety briefing and practice ride.' },
    { title: 'Horseback Ride (1–2 Hours)', content: 'A personalized ride along the beach, through the desert, or a combination of both.' },
    { title: 'Photo Stops & Experiences', content: 'Time for photos and short breaks to enjoy the scenery.' },
    { title: 'Return Transfer', content: 'Return transfer to your hotel.' }
    ],
    highlights: [
      'Private horseback ride — exclusive for you and your party',
      'Ride along the Red Sea with stunning views',
      'Desert ride through impressive dune landscapes',
      'Optional: swimming with horses in the Red Sea',
      'Experienced and professional riding guides',
      'Hotel transfer from Hurghada included',
      'Family-friendly and suitable for beginners'
    ],
    included: [
      'Private hotel pickup and return transfer (air-conditioned vehicle)',
      'Experienced riding guide',
      'Horseback ride on the beach and in the desert',
      '1 or 2 hours of riding time (depending on booking)',
      'Drinks (water, tea, or coffee)',
      'Optional: swimming with horses (if selected)'
    ],
    notIncluded: [
      'Tips',
      'Transfer surcharges for certain areas'
    ],
    faqs: [
      { question: 'Do I need riding experience?', answer: 'No, you don\'t need any riding experience for our horseback excursion in Hurghada. The tour is suitable for both beginners and experienced riders.' },
      { question: 'Is the tour private or in a group?', answer: 'All horseback rides in Hurghada are private tours. You ride exclusively with your own party and guide.' },
      { question: 'Can I ride the horse into the sea?', answer: 'Yes, swimming with the horse in the Red Sea is optionally available on many of our rides and is one of the most popular experiences.' },
      { question: 'How long does the excursion take?', answer: 'You can choose between a 1-hour or 2-hour ride. The riding time depends on your booking.' },
      { question: 'Is hotel transfer included?', answer: 'Yes, pickup and return transfer from your hotel in Hurghada are included. For hotels outside Hurghada, a small surcharge may apply.' },
      { question: 'From which locations is pickup available?', answer: 'We offer hotel transfers from Hurghada, El Gouna, Makadi Bay, Sahl Hasheesh, Soma Bay, and Safaga.' },
      { question: 'What should I wear for riding?', answer: 'We recommend comfortable clothing, long pants, and sturdy closed-toe shoes. Sunscreen and sunglasses are also advised.' },
      { question: 'Is the tour safe?', answer: 'Yes, safety is our highest priority. You\'ll receive a short briefing before starting and will be accompanied by an experienced guide throughout the ride.' },
      { question: 'How do I pay?', answer: 'In most cases, you can pay conveniently on-site. All payment details will be provided after your booking request.' },
      { question: 'How can I book?', answer: 'You can book your horseback riding excursion easily through our website or via WhatsApp.' }
    ]
  };
}

// Tour 8: Luxor Day Trip
function translateLuxorDay(tour) {
  return {
    itinerary: [
      { title: 'Pickup in Hurghada', content: 'Around 4:00 AM, your private driver will pick you up in an air-conditioned vehicle. The drive leads via Safaga through a quiet desert landscape that gives way to the green Nile Valley just before Luxor.' },
      { title: 'Karnak Temple', content: 'Your first glimpse of the massive columns of Karnak Temple feels like stepping into another world. Your Egyptologist guide accompanies you through the complex, revealing hidden details you would hardly notice on your own.' },
      { title: 'Lunch in Western Thebes', content: 'After the tour, a freshly prepared Egyptian lunch awaits you, lovingly served and perfect for relaxing before the next highlight.' },
      { title: 'Valley of the Kings', content: 'A place that surprises. Unassuming from the outside, but inside as colorful and intricate as a treasure chamber. The elaborate wall paintings tell stories of faith, power, and immortality. Photography with smartphones is now allowed free of charge.' },
      { title: 'Temple of Hatshepsut', content: 'A structure that stands like a stage before the cliff face. Striking, symmetrical, powerful — a perfect spot for impressive photos.' },
      { title: 'Colossi of Memnon', content: 'Two giant statues that have stood on the banks of the Nile for millennia, welcoming travelers.' },
      { title: 'Return Journey', content: 'Around 8:00 PM you\'ll be back at your hotel. The impressions of this day often linger long after.' }
    ],
    highlights: [
      'Valley of the Kings — discover the tombs of the pharaohs',
      'Karnak Temple — monumental complex with grand hypostyle hall',
      'Temple of Queen Hatshepsut — architectural masterpiece',
      'Colossi of Memnon — impressive seated statues',
      'Lunch with Egyptian specialties',
      'Private tour with professional Egyptologist guide'
    ],
    included: [
      'Premium transfer in an air-conditioned vehicle',
      'Professional Egyptologist guide',
      'Entrance fees to all attractions',
      'Lunch',
      'Water and soft drinks during the drive'
    ],
    notIncluded: [
      'Drinks at the restaurant',
      'Personal expenses',
      'Transfer surcharge for guests from Marsa Alam: €25 per person',
      'Transfer surcharge for guests from El Quseir: €15 per person',
      'Transfer surcharge from Makadi Bay & Sahl Hasheesh: €5 per person',
      'Transfer surcharge from El Gouna, Safaga & Soma Bay: €10 per person',
      'Foreign-language guide (English, Russian or French): surcharge €10 per person'
    ],
    faqs: [
      { question: 'What time does the tour start and end?', answer: 'The tour starts around 5:30 AM and ends around 8:00 PM, depending on traffic. You\'ll receive the exact pickup time after booking.' },
      { question: 'How does hotel pickup work?', answer: 'You\'ll be picked up directly from your hotel lobby in a private air-conditioned vehicle.' },
      { question: 'Are all entrance fees included?', answer: 'Yes, all tickets for Karnak Temple, Valley of the Kings, Hatshepsut Temple, and the Colossi of Memnon are included.' },
      { question: 'Is there a guide on the tour?', answer: 'Yes, an experienced Egyptologist guide accompanies you throughout the entire tour, explaining the history and culture.' },
      { question: 'Which attractions are visited?', answer: 'You will visit the impressive Karnak Temple, the world-famous Valley of the Kings, the Temple of Queen Hatshepsut, and the Colossi of Memnon.' },
      { question: 'Is lunch included?', answer: 'Yes, an Egyptian lunch is included in the price (drinks extra).' },
      { question: 'Are children allowed and are there discounts?', answer: 'Yes. Children 0–2 years travel free. Children 3–10 years receive a 50% discount.' },
      { question: 'Can I take photos in the Valley of the Kings?', answer: 'Yes, with a smartphone — free of charge and without flash. Cameras are subject to a fee.' },
      { question: 'How long is the drive to Luxor?', answer: 'About 4 to 4.5 hours each way. We make a short rest stop during the drive.' },
      { question: 'Is the tour safe?', answer: 'Yes. The route between Hurghada and Luxor is officially approved for tourism and is one of the most frequented routes in the region.' }
    ]
  };
}

// Tour 9: Shopping Tour
function translateShopping(tour) {
  return {
    itinerary: [
      { title: 'Hotel Pickup', content: 'We\'ll pick you up comfortably from your hotel in Hurghada or the surrounding area in an air-conditioned vehicle.' },
      { title: 'Arrival at the Bazaar', content: 'Immerse yourself in the colorful market activity and experience the authentic atmosphere of an Egyptian bazaar.' },
      { title: 'Free Time for Shopping', content: 'Discover traditional products: handmade leather goods, perfume oils, papyrus rolls, spices, jewelry, and much more.' },
      { title: 'Return to Hotel', content: 'After an eventful shopping tour, we\'ll take you safely and comfortably back to your hotel.' }
    ],
    highlights: [
      'Free shopping tour with hotel transfer',
      'Visit a well-known bazaar in Hurghada',
      'Souvenirs, spices, perfume oils, leather goods & jewelry',
      'Free time for shopping and browsing',
      'Ideal for families, couples & culture enthusiasts'
    ],
    included: [
      'Hotel transfer (round trip)',
      'Private or comfortable transfer',
      'Free time at the bazaar',
      'Guidance/organization by Hurghada Travel Planner'
    ],
    notIncluded: [
      'Personal expenses',
      'Purchases and souvenirs',
      'Tips (voluntary)'
    ],
    faqs: [
      { question: 'Is the shopping tour really free?', answer: 'Yes! Participation in this tour is completely free. The transfer to and from the hotel, as well as guidance by our team, is included at no charge.' },
      { question: 'How does the transfer to the bazaar work?', answer: 'We\'ll pick you up directly from your hotel in Hurghada or the surrounding area in an air-conditioned vehicle.' },
      { question: 'How long does the tour take?', answer: 'The entire shopping tour usually takes 2 to 3 hours, depending on traffic and how long you spend at the bazaar.' },
      { question: 'What can I buy at the bazaar?', answer: 'The bazaar offers a huge selection of souvenirs, papyrus rolls, spices, perfume oils, leather goods, jewelry, handmade crafts, and much more.' },
      { question: 'Are prices fixed at the bazaar?', answer: 'Yes, most shops have fixed and clearly displayed prices, so you can shop relaxed without haggling.' },
      { question: 'What languages do the guides speak?', answer: 'Our team supports you throughout the entire shopping tour. Guides speak German, English, and Russian depending on availability.' },
      { question: 'Is the tour suitable for families and children?', answer: 'Yes, the tour is ideal for families, couples, and groups. Children love the vibrant market atmosphere.' },
      { question: 'When does the shopping tour take place?', answer: 'The Hurghada shopping tour is offered daily. We\'ll confirm the exact pickup time after booking.' },
      { question: 'How can I book the tour?', answer: 'You can book the tour directly through our website or contact our team by phone.' },
      { question: 'What should I bring?', answer: 'We recommend bringing some cash in Egyptian pounds or euros for shopping, a water bottle, comfortable clothing, and comfortable shoes.' }
    ]
  };
}

// Tour 10: Cairo by Flight
function translateCairoFlight(tour) {
  return {
    itinerary: [
      { title: '4:00 AM – Hotel Pickup', content: 'Pickup from your hotel in Hurghada.' },
      { title: '6:00 AM – Flight to Cairo', content: 'Flight from Hurghada to Cairo.' },
      { title: '6:50 AM – Arrival in Cairo', content: 'Arrival in Cairo and welcome by your guide.' },
      { title: '8:00 AM–7:00 PM – Pyramids, Sphinx, Museum & Lunch', content: 'Full day exploring the Pyramids of Giza, the Sphinx, the Grand Egyptian Museum, and enjoying lunch.' },
      { title: '7:00 PM – Return Flight', content: 'Return flight to Hurghada.' },
      { title: '7:45 PM – Arrival & Hotel Transfer', content: 'Arrival in Hurghada and transfer back to your hotel.' }
    ],
    highlights: [
      'Pyramids of Giza & Sphinx — UNESCO World Heritage and the last surviving wonder of the ancient world',
      'Grand Egyptian Museum',
      'Lunch on the Nile — local specialties',
      'Direct flight Hurghada – Cairo – Hurghada',
      'Professional Egyptologist guide — personal tour throughout the day'
    ],
    included: [
      'Round-trip flight Hurghada ↔ Cairo',
      'Transfers in air-conditioned vehicles',
      'Entrance fees per program',
      'Lunch',
      'Professional Egyptologist guide',
      'Support & organization by Hurghada Travel Planner'
    ],
    notIncluded: [
      'Drinks at the restaurant',
      'Personal expenses',
      'Transfer surcharge from Marsa Alam: €50 per person',
      'Transfer surcharge from El Quseir: €35 per person',
      'Transfer surcharge from Makadi Bay & Sahl Hasheesh: €5 per person',
      'Transfer surcharge from El Gouna, Safaga & Soma Bay: €10 per person',
      'Foreign-language guide (English, Russian or French): surcharge €10 per person'
    ],
    faqs: [
      { question: 'How long does the day trip from Hurghada to Cairo take?', answer: 'The trip takes approximately 15 hours. We pick you up around 4:00 AM, fly to Cairo, visit the Pyramids of Giza and the Grand Egyptian Museum, and return to your hotel in the evening.' },
      { question: 'Which attractions are visited?', answer: 'You will visit the world-famous Pyramids of Giza, the Great Sphinx, and — depending on your preference — the Grand Egyptian Museum or the Egyptian Museum.' },
      { question: 'Is the tour suitable for children?', answer: 'Yes, the trip is family-friendly. 0–2 years: €200, 3–10 years: €240, 11 years and up: full price.' },
      { question: 'Is there a transfer from Marsa Alam or El Quseir?', answer: 'Yes, we organize transfers to Hurghada Airport. Marsa Alam: +€50 per person, El Quseir: +€35 per person.' },
      { question: 'What is included in the price?', answer: 'Round-trip flight Hurghada ↔ Cairo, transfers in air-conditioned vehicles, entrance fees per program, a professional Egyptologist guide, and lunch.' },
      { question: 'Can I choose which museum to visit?', answer: 'Yes, you can choose between the Grand Egyptian Museum or the Egyptian Museum, depending on your interest.' },
      { question: 'How many people are in a group?', answer: 'The tour takes place as a private trip or in small groups of maximum 8 people, ensuring a relaxed and personal experience.' },
      { question: 'When should I book?', answer: 'We recommend booking early, especially during peak season, to secure your preferred date.' },
      { question: 'Can I customize the tour?', answer: 'Yes, the tour is flexible. You can adjust the order of attractions or add extra stops upon request.' },
      { question: 'How does payment work?', answer: 'Online via our website or by email request. Secure payment before departure. No hidden fees.' }
    ]
  };
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
      case 'quad-tour-hurghada-kamelritt': translated = translateQuad(tour); break;
      case 'reiten-in-hurghada-strand-wueste-pferde-im-meer': translated = translateHorseback(tour); break;
      case 'luxor-tagesausflug-ab-hurghada': translated = translateLuxorDay(tour); break;
      case 'hurghada-shopping-tour-basar-transfer': translated = translateShopping(tour); break;
      case 'kairo-mit-flug-ab-hurghada-pyramiden-museum': translated = translateCairoFlight(tour); break;
    }

    console.log(`\n=== ${slug} ===`);
    console.log(`Itinerary: ${translated.itinerary.length} steps`);
    console.log(`FAQs: ${translated.faqs.length}`);
    console.log(`Highlights: ${translated.highlights.length}`);

    // Show key changes
    console.log('--- ITINERARY (after) ---');
    translated.itinerary.forEach((s, i) => console.log(`  ${i+1}. ${s.title} | ${s.content}`));
    console.log('--- HIGHLIGHTS ---');
    translated.highlights.forEach(h => console.log(`  - ${h}`));
    console.log('--- INCLUDED ---');
    translated.included.forEach(h => console.log(`  - ${h}`));
    console.log('--- NOT INCLUDED ---');
    translated.notIncluded.forEach(h => console.log(`  - ${h}`));
    console.log('--- FAQ Qs ---');
    translated.faqs.forEach((f, i) => console.log(`  ${i+1}. ${f.question}`));

    output.push({ slug, name: NAMES[slug], itinerary: translated.itinerary, highlights: translated.highlights, included: translated.included, not_included: translated.notIncluded, faqs: translated.faqs });
  }

  fs.writeFileSync(__dirname + '/batch2-en-review.json', JSON.stringify(output, null, 2));
  console.log('\n✅ Review file: scripts/batch2-en-review.json');
  console.log('Review and then run with WRITE=true to save to DB.');
})();
