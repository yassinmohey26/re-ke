require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const slugs = [
  'orange-bay-insel-schnorchelausflug-hurghada',
  'makadi-water-park-hurghada-mittagessen-transfer',
  'el-gouna-private-stadtrundfahrt-mit-lagunenfahrt-aussichtsturm',
  'private-speedboot-tour-orange-bay-hurghada',
  'privater-tagesausflug-ab-hurghada-dendera-abydos-tempel'
];

const translations = [
  {
    slug: 'orange-bay-insel-schnorchelausflug-hurghada',
    name: 'Orange Bay Island Snorkeling Trip with Water Sports from Hurghada',
    itinerary: [
      { title: 'Hotel Pickup in Hurghada', content: 'Direct pickup from your hotel in a private, air-conditioned vehicle and transfer to the harbor.' },
      { title: 'Boat Ride on the Red Sea', content: 'Travel on a modern excursion boat or comfortable yacht toward Orange Bay Island. Soft drinks are included on board.' },
      { title: 'Snorkeling at Two Coral Reefs', content: 'Two guided snorkeling stops at carefully selected reefs with excellent visibility. Complete snorkeling equipment is provided, with professional supervision included.' },
      { title: 'Time on Orange Bay Island', content: 'Several hours of free time on the island for swimming, relaxing, sunbathing, photography, and enjoying the unique atmosphere.' },
      { title: 'Water Sports Activities', content: 'Banana boat and sofa boat under professional supervision with modern safety equipment.' },
      { title: 'Lunch', content: 'Freshly prepared lunch with non-alcoholic drinks on board or on the island.' },
      { title: 'Return to Hurghada', content: 'Return trip to the harbor and transfer back to your hotel.' }
    ],
    highlights: [
      'Dreamlike Orange Bay Island in the Giftun National Park',
      'One of the most popular snorkeling trips in Hurghada',
      'Two snorkeling stops at first-class coral reefs',
      'Crystal-clear water & diverse underwater world',
      'Water sports included: Banana Boat & Sofa Boat',
      'Relaxation on the white sandy beach with sun loungers',
      'Lunch & non-alcoholic drinks included',
      'Private hotel transfer in an air-conditioned vehicle',
      'High-quality boats',
      'Ideal for families, couples, and groups',
      'Orange Bay – the Caribbean of the Red Sea'
    ],
    included: [
      'Hotel pickup & return transfer in Hurghada (private & air-conditioned)',
      'Boat trip to Orange Bay Island',
      'Two snorkeling stops',
      'Complete snorkeling equipment (mask, fins, snorkel, life jacket)',
      'Time on Orange Bay Island',
      'Lunch',
      'Non-alcoholic drinks',
      'Water sports (Banana Boat & Sofa Boat)',
      'National park fees'
    ],
    not_included: [
      'Personal expenses',
      'Additional drinks or snacks',
      'Transfer surcharges for certain regions'
    ],
    faqs: [
      { question: '🚤 How does the Orange Bay Island snorkeling trip work?', answer: 'You are picked up from your hotel and taken to the harbor. From there, the boat takes you to Orange Bay Island in the Giftun National Park. On the way, there are two snorkeling stops at beautiful coral reefs. Upon arrival, you have free time on the island to swim, relax, or enjoy water sports. Lunch is served on board or on the island before the return trip.' },
      { question: '⏰ How long does the excursion last?', answer: 'The trip lasts approximately 6–7 hours from hotel pickup to return.' },
      { question: '🤿 Is snorkeling equipment included?', answer: 'Yes, complete snorkeling equipment (mask, fins, snorkel, and life jacket) is provided free of charge.' },
      { question: '👨‍👩‍👧 Is the trip suitable for children and families?', answer: 'Yes, the trip is suitable for all ages. Children enjoy the shallow water and sandy beach. Water sports and snorkeling are supervised by professionals.' },
      { question: '🏝️ What makes Orange Bay so special?', answer: 'Orange Bay boasts fine white sand, crystal-clear turquoise water, and a Caribbean flair. It is part of the protected Giftun National Park and offers an idyllic landscape.' },
      { question: '🐠 Which fish can you see while snorkeling?', answer: 'The reefs around Orange Bay are home to clownfish, parrotfish, angelfish, butterflyfish, and occasionally sea turtles and rays.' },
      { question: '🦺 Is Orange Bay suitable for non-swimmers?', answer: 'Yes, the shallow water near the beach is safe for non-swimmers. Life jackets and floatation aids are available.' },
      { question: '👕 What clothing should I bring?', answer: 'Swimwear, towel, sunscreen, hat, sunglasses, and comfortable footwear. A light change of clothes is recommended for the return trip.' },
      { question: '⏳ How long is the boat ride to Orange Bay?', answer: 'The boat ride takes approximately 30–45 minutes each way.' },
      { question: '📸 Are photos and videos allowed on Orange Bay?', answer: 'Yes, photography is welcome on the island and underwater. Capture the scenery and marine life.' }
    ]
  },
  {
    slug: 'makadi-water-park-hurghada-mittagessen-transfer',
    name: 'Makadi Water Park Hurghada with Lunch & Transfer',
    itinerary: [
      { title: 'Hotel Pickup', content: 'Direct pickup from your hotel in Hurghada or Makadi Bay.' },
      { title: 'Transfer', content: 'Comfortable transfer in an air-conditioned vehicle.' },
      { title: 'Makadi Water Park', content: 'Full-day stay at Makadi Water Park. Priority entry with organized access. Use of all attractions permitted for your age and height.' },
      { title: 'Lunch & Drinks', content: 'Lunch and drinks included.' },
      { title: 'Return Transfer', content: 'Return transfer to the hotel in the afternoon.' }
    ],
    highlights: [
      'Over 50 water attractions for all ages',
      '38 spectacular water slides – from thrilling to relaxing',
      '14 swimming pools for children & adults',
      'Black Hole, high-speed slides & water roller coaster',
      'Lazy River & relaxation zones',
      'Large children\'s areas for safe family fun'
    ],
    included: [
      'Entry to Makadi Water Park / Makadi Water World',
      'Priority entry with organized access',
      'Hotel pickup & return transfer',
      'Air-conditioned transport',
      'Lunch (buffet)',
      'Soft drinks, coffee & tea'
    ],
    not_included: [
      'Tips',
      'Personal expenses & photo service',
      'Transfer surcharges for certain regions'
    ],
    faqs: [
      { question: '🎟️ What is included in the Makadi Water Park trip price?', answer: 'The package includes entry to the park, hotel transfer in an air-conditioned vehicle, lunch (buffet), and soft drinks, coffee, and tea. Personal expenses and tips are not included.' },
      { question: '🏨 Which hotels offer pickup?', answer: 'Pickup is available from all hotels in Hurghada and Makadi Bay. Surcharges may apply for hotels in other regions.' },
      { question: '⏰ How long does the trip take?', answer: 'The entire trip takes approximately 6–7 hours, including transfer time and your stay at the water park.' },
      { question: '👨‍👩‍👧‍👦 Is Makadi Water Park suitable for children?', answer: 'Yes, the park has extensive children\'s areas with age-appropriate slides and pools, making it ideal for families.' },
      { question: '🍽️🥤 Are lunch and drinks included?', answer: 'Yes, a buffet lunch and soft drinks, coffee, and tea are included in the price.' },
      { question: '🚪 Are there long waiting times at the entrance?', answer: 'With priority entry and organized access, waiting times are kept to a minimum.' },
      { question: '🎒 What should I bring to the water park?', answer: 'Swimwear, towel, sunscreen, and a change of clothes. Lockers are available on site.' },
      { question: '🚐 Is the transfer safe and comfortable?', answer: 'Yes, all transfers are in modern, air-conditioned vehicles with professional drivers.' },
      { question: '🔄 Can the trip be cancelled?', answer: 'Cancellation policies apply. Please check the terms at the time of booking.' },
      { question: '⭐ Why should I book with Hurghada Travel Planner?', answer: 'We offer organized access, comfortable transfers, and all-inclusive pricing with no hidden costs. Our local expertise ensures a smooth experience.' }
    ]
  },
  {
    slug: 'el-gouna-private-stadtrundfahrt-mit-lagunenfahrt-aussichtsturm',
    name: 'El Gouna – Private City Tour with Lagoon Cruise & Observation Tower',
    itinerary: [
      { title: 'Hotel Pickup', content: 'Your guide picks you up between 9:00 and 10:00 AM in a private, air-conditioned vehicle. From Hurghada, we reach El Gouna in about 30 minutes.' },
      { title: 'Lagoon Cruise Through El Gouna', content: 'The tour begins with a relaxing boat ride through the famous lagoons. You will see luxury hotels, villas & exclusive residential areas, islands and waterways, the yacht harbor, and architectural highlights. Your guide shares the history of the city and fascinating details about the Sawiris family who founded it.' },
      { title: 'Downtown El Gouna', content: 'In the city center, you will find cafés, boutiques, artisan shops, and small plazas. Stroll at your leisure and enjoy the modern atmosphere of the city.' },
      { title: 'Culture & Architecture', content: 'Together we visit some of the most important landmarks: the Coptic Church, the Grand Mosque, and a branch of the Bibliotheca Alexandrina. An ideal mix of culture and modern urban planning.' },
      { title: 'The Observation Tower', content: 'One of the highlights of the tour. From the top, you see the sea, the lagoons, the desert mountains, and the marina. A perfect spot for impressive photos.' },
      { title: 'Abu Tig Marina', content: 'Stroll along the well-kept promenade, see luxury yachts, and enjoy the Mediterranean atmosphere. If you like, you can have tea or coffee overlooking the boats (optional).' },
      { title: 'Return to the Hotel', content: 'After many wonderful impressions, we drive back to Hurghada.' }
    ],
    highlights: [
      'Private city tour with a professional guide',
      'Idyllic lagoon cruise through El Gouna',
      'Visit to the observation tower for panoramic views',
      'Downtown, Mosque, Coptic Church & Bibliotheca Alexandrina',
      'Stroll along Abu Tig Marina',
      'No shopping stops',
      'Perfect for couples, families, and photo enthusiasts'
    ],
    included: [
      'Private transfers in an air-conditioned vehicle',
      'Lagoon cruise in El Gouna',
      'Professional guide',
      'Soft drinks in the car',
      'Entry fees according to the program'
    ],
    not_included: [
      'Personal expenses',
      'Drinks at cafés or restaurants',
      'Transfer surcharge from Makadi Bay & Sahl Hasheesh: €5 per person',
      'Transfer surcharge from El Gouna, Safaga & Soma Bay: €10 per person',
      'Guide in another language (English, Russian, or French): €10 per person surcharge'
    ],
    faqs: [
      { question: '⏱️ How long does the private El Gouna city tour last?', answer: 'The tour lasts approximately 4–5 hours from pickup to return.' },
      { question: '👨‍👩‍👧‍👦 Is the El Gouna city tour really private?', answer: 'Yes, this is an exclusive private tour with only your party. No other groups are added.' },
      { question: '🚐 From which locations is pickup available?', answer: 'Pickup is available from hotels in Hurghada. Surcharges apply for Makadi Bay, Sahl Hasheesh, El Gouna, Safaga, and Soma Bay.' },
      { question: '🛍️ Are there shopping stops during the tour?', answer: 'No, this tour has no shopping stops. It is purely a sightseeing and cultural experience.' },
      { question: '🗣️ Is a guide included?', answer: 'Yes, a professional guide is included. An English, Russian, or French-speaking guide is available for a surcharge.' },
      { question: '📷 Is there enough time for photos and free time?', answer: 'Yes, there is plenty of time for photos at each stop, including the observation tower and marina.' },
      { question: '💰 How much does the El Gouna city tour cost?', answer: 'Prices vary by group size and pickup location. Please check the tour page or contact us for a specific quote.' },
      { question: '👦 Is the tour suitable for children?', answer: 'Yes, the tour is family-friendly and suitable for children of all ages.' },
      { question: '⛪ Which landmarks are visited?', answer: 'The tour includes the Coptic Church, the Grand Mosque, a branch of the Bibliotheca Alexandrina, the observation tower, and Abu Tig Marina.' },
      { question: '🎒 What should I bring on the tour?', answer: 'Comfortable shoes, camera, sunscreen, and a hat. Light clothing is recommended.' }
    ]
  },
  {
    slug: 'private-speedboot-tour-orange-bay-hurghada',
    name: 'Private Speedboat Tour to Orange Bay from Hurghada – Snorkeling & Island Trip',
    itinerary: [
      { title: 'Hotel Pickup', content: 'Pickup in Hurghada, El Gouna, Makadi Bay, Soma Bay, or Safaga.' },
      { title: 'Welcome & Safety Briefing', content: 'Personal welcome and safety briefing on board the private boat.' },
      { title: 'Snorkeling Stops', content: '1–2 snorkeling stops at the most beautiful reefs in the Red Sea.' },
      { title: 'Orange Bay or Magawish Island', content: 'Trip to Orange Bay or Magawish Island with free time, lunch, and beach time.' },
      { title: 'Relaxation', content: 'Relax on the beach or on the boat.' },
      { title: 'Return Trip', content: 'Return to the harbor & transfer to the hotel.' }
    ],
    highlights: [
      'Private speedboat tour to Orange Bay or Magawish Island',
      'Snorkeling at vibrant coral reefs',
      'Exotic fish, rays & sea turtles possible',
      'Relaxation on the white sandy beach or on the sun deck',
      'Lunch & soft drinks included',
      'Private supervision by an experienced crew',
      'Flexible & customizable for couples, families, or small groups'
    ],
    included: [
      'Private speedboat & experienced crew',
      'Hotel transfer both ways',
      'Snorkeling equipment (mask, fins, snorkel)',
      'Visit to Orange Bay Island or Magawish Island',
      'Lunch & soft drinks',
      'Personal supervision & safety briefing'
    ],
    not_included: [
      'Personal expenses',
      'Tips (voluntary)',
      'Transfer surcharges for certain regions'
    ],
    faqs: [
      { question: '🕒 How long does the boat tour to Orange Bay last?', answer: 'The tour lasts approximately 5–7 hours depending on your selected itinerary.' },
      { question: '📍 From which locations can the tour start?', answer: 'Pickup is available from Hurghada, El Gouna, Makadi Bay, Soma Bay, and Safaga.' },
      { question: '🤿 Is snorkeling equipment included?', answer: 'Yes, masks, fins, snorkels, and life jackets are provided.' },
      { question: '👨‍👩‍👧 Is the tour suitable for families with children?', answer: 'Yes, the tour is family-friendly and can be tailored to children\'s needs.' },
      { question: '🐠 Which marine life can I see?', answer: 'You can see colorful reef fish, parrotfish, angelfish, and sometimes sea turtles and rays.' },
      { question: '🚤 How many people fit on the private speedboat?', answer: 'The boat accommodates up to 8–10 guests depending on the model.' },
      { question: '🍴 Is lunch included?', answer: 'Yes, lunch and soft drinks are included in the price.' },
      { question: '🏖️ How long can we stay on Orange Bay Island?', answer: 'You typically have 1–2 hours of free time on the island.' },
      { question: '⚓ How far is Orange Bay Island from Hurghada?', answer: 'Orange Bay is approximately 30–40 minutes by speedboat from Hurghada.' },
      { question: '🔒 Is the speedboat tour truly private?', answer: 'Yes, the boat is exclusively for your party — no other guests are added.' }
    ]
  },
  {
    slug: 'privater-tagesausflug-ab-hurghada-dendera-abydos-tempel',
    name: 'Private Day Trip to Dendera & Abydos from Hurghada',
    itinerary: [
      { title: 'Pickup (4:00–4:30 AM)', content: 'Pickup from your hotel in Hurghada.' },
      { title: 'Drive to Dendera', content: 'Drive to Dendera (approx. 250 km).' },
      { title: 'Visit to the Temple of Hathor', content: 'Approximately 2 hours visiting the Temple of Hathor.' },
      { title: 'Continue to Abydos', content: 'Continue to Abydos (approx. 100 km).' },
      { title: 'Lunch in Abydos', content: 'Lunch in Abydos.' },
      { title: 'Visit to the Temple of Abydos', content: 'Approximately 2 hours visiting the Temple of Abydos.' },
      { title: 'Return to Hurghada', content: 'Return to Hurghada. Total approx. 13 hours.' }
    ],
    highlights: [
      'Private tour without group tourism',
      'Professional Egyptologist guide with expert knowledge',
      'Visit to the Temple of Hathor in Dendera',
      'Visit to the Temple of Abydos with the King List',
      'Comfortable transfer in an air-conditioned vehicle',
      'Authentic temple art, reliefs, and hieroglyphs'
    ],
    included: [
      'Professional guide / Egyptologist',
      'Private transfers in a modern, air-conditioned vehicle',
      'Entry to all sights mentioned in the program',
      'Lunch at a local restaurant',
      'Soft drinks in the vehicle',
      'All taxes and service fees'
    ],
    not_included: [
      'Drinks at the restaurant',
      'Personal expenses & tips',
      'Transfer surcharge for guests from Marsa Alam: €50 per person',
      'Transfer surcharge for guests from El Quseir: €35 per person',
      'Transfer surcharge from Makadi Bay & Sahl Hasheesh: €5 per person',
      'Transfer surcharge from El Gouna, Safaga & Soma Bay: €10 per person',
      'Guide in another language (English, Russian, or French): €10 per person surcharge'
    ],
    faqs: [
      { question: '🕓 How long does the day trip to Dendera and Abydos last?', answer: 'The tour lasts approximately 13 hours from pickup to return.' },
      { question: '🚐 How does pickup in Hurghada work?', answer: 'You will be picked up directly from your hotel in a private, air-conditioned vehicle.' },
      { question: '👥 Is the tour private or in a group?', answer: 'This is a completely private tour with only your party.' },
      { question: '🏛️ What will I see at the Dendera Temple?', answer: 'The Temple of Hathor is one of the best-preserved temples in Egypt, featuring stunning astronomical ceilings, crypts, and intricate reliefs.' },
      { question: '🌙 What awaits me at the Abydos Temple?', answer: 'The Temple of Seti I in Abydos is famous for its exquisite reliefs and the Abydos King List, a chronological list of Egyptian pharaohs.' },
      { question: '🍽️ Is lunch included?', answer: 'Yes, lunch at a local restaurant is included in the price.' },
      { question: '🧳 What should I bring for the trip?', answer: 'Comfortable shoes, sunscreen, hat, camera, and a light jacket for the early morning start.' },
      { question: '👨‍👩‍👧 Is the trip suitable for children?', answer: 'The long day and extensive temple visits are better suited for older children and adults.' },
      { question: '🏺 Do I need a permit for the tour?', answer: 'No, all necessary permits and entry fees are included in the tour price.' },
      { question: '✨ Why are Dendera and Abydos less crowded than Luxor?', answer: 'These temples are located off the main tourist circuit, offering a more peaceful and authentic experience with fewer visitors.' }
    ]
  }
];

(async () => {
  const { data: tours } = await db.from('tours').select('*').in('slug', slugs);

  for (const item of translations) {
    const tour = tours.find(t => t.slug === item.slug);
    if (!tour) { console.log('Missing:', item.slug); continue; }

    const payload = {
      name: item.name,
      short_description: tour.short_description,
      description: tour.description,
      highlights: item.highlights,
      included: item.included,
      not_included: item.not_included,
      content: JSON.stringify(item.itinerary),
      faqs: item.faqs,
      meeting_point: tour.meeting_point,
      duration: tour.duration
    };

    const { data: existing } = await db.from('content_translations')
      .select('id').eq('table_name','tours').eq('row_id',tour.id).eq('locale','en').limit(1);

    if (existing?.length) {
      const { error } = await db.from('content_translations').update(payload).eq('id', existing[0].id);
      if (error) console.error('FAIL', item.slug, error.message);
      else console.log('Updated EN:', item.slug.substring(0,65));
    } else {
      const { error } = await db.from('content_translations').insert({
        table_name:'tours', row_id: tour.id, locale:'en', ...payload
      });
      if (error) console.error('FAIL INSERT', item.slug, error.message);
      else console.log('Inserted EN:', item.slug.substring(0,65));
    }
  }
  console.log('\nBatch 3 complete!');
})();
