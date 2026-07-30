require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const slugs = [
  'mini-egypt-park-hurghada',
  'naechtliche-stadtrundfahrt-durch-hurghada-private-tour',
  'privater-pyramiden-ausflug-ab-hurghada-sakkara-dahschur-gizeh',
  'privater-speedboot-ausflug-in-hurghada-schnorcheln-an-korallenriffen-sonnenuntergang',
  'privater-tagesausflug-von-hurghada-nach-kairo-pyramiden-grand-egyptian-museum',
  'super-safari-hurghada'
];

const translations = [
  {
    slug: 'mini-egypt-park-hurghada',
    name: 'Mini Egypt Park Hurghada – Discover Egypt\'s Landmarks in Miniature',
    itinerary: [
      { title: 'Hotel Pickup', content: 'Pickup from your hotel in Hurghada in a comfortable, air-conditioned minibus.' },
      { title: 'Arrival at Mini Egypt Park', content: 'Arrival at Mini Egypt Park — your personal guide welcomes you.' },
      { title: 'Guided Tour', content: 'Guided tour through Egypt\'s miniature wonders: The Pyramids of Giza & the Sphinx, The Temple of Abu Simbel & the Aswan Dam, The impressive temples of Luxor with the famous Karnak Temple, The Egyptian Museum in Cairo, Alexandria with Stanley Bridge & Montazah Palace.' },
      { title: 'Free Time in the Park', content: 'Free time in the park — time for photos, wonder, and small discoveries.' },
      { title: 'Return Transfer to the Hotel', content: 'Return transfer to the hotel — with unforgettable impressions.' }
    ],
    highlights: [
      '🏺 See 55 iconic Egyptian landmarks — from Luxor to Alexandria, all faithfully reproduced in detail.',
      '🎧 Fascinating stories and background information about Egypt\'s most famous buildings',
      '🚌 Comfort included — air-conditioned transfer directly from your hotel in Hurghada.',
      '📸 Perfect for souvenir photos — capture magical moments among mini pyramids and temples.',
      '👨‍👩‍👧 Ideal for families & children — education, fun, and wonder all in one.'
    ],
    included: [
      'Entry to Mini Egypt Park',
      'Guided tour through all exhibitions',
      'Pickup & return transfer in an air-conditioned vehicle',
      'Driver & local guide'
    ],
    not_included: [
      'Drinks',
      'Personal expenses',
      'Tips (optional)',
      'Transfer surcharge from Makadi Bay & Sahl Hasheesh: €5 per person',
      'Transfer surcharge from El Gouna, Safaga & Soma Bay: €10 per person',
      'Guide in another language (English, Russian, or French): €10 per person surcharge'
    ],
    faqs: [
      { question: '🕓 How long does the Mini Egypt Park trip last?', answer: 'The trip lasts approximately 3–4 hours from pickup to return.' },
      { question: '🚐 Is hotel transfer included?', answer: 'Yes, pickup and return transfer from your hotel in Hurghada are included.' },
      { question: '🧭 What can I see at Mini Egypt Park?', answer: 'Over 55 miniature replicas of Egypt\'s most famous landmarks, including the Pyramids of Giza, Abu Simbel, Karnak Temple, and more.' },
      { question: '🗣️ Is a guide included?', answer: 'Yes, a guide is included. An English, Russian, or French-speaking guide is available for a surcharge.' },
      { question: '👨‍👩‍👧 Is the trip suitable for children?', answer: 'Yes, the park is very family-friendly and educational for children.' },
      { question: '📸 Can I take photos at Mini Egypt Park?', answer: 'Yes, photography is welcome throughout the park.' },
      { question: '💧 What should I bring?', answer: 'Comfortable shoes, sunscreen, camera, and water.' },
      { question: '🕒 When does the trip take place?', answer: 'The trip typically starts in the morning, with pickup between 8:00–9:00 AM.' },
      { question: '🛒 How can I book the trip?', answer: 'You can book directly through our website or contact us for assistance.' },
      { question: '💸 Can I cancel for free?', answer: 'Cancellation policies apply. Please check the terms at the time of booking.' }
    ]
  },
  {
    slug: 'naechtliche-stadtrundfahrt-durch-hurghada-private-tour',
    name: 'Night City Tour Through Hurghada – Private Tour',
    itinerary: [
      { title: '7:00 PM – Hotel Pickup', content: 'Direct pickup from your hotel.' },
      { title: 'Stroll Through the Marina', content: 'Stroll through the marina.' },
      { title: 'Fish Market & Grand Mosque', content: 'Visit to the fish market and the Grand Mosque.' },
      { title: 'Fruit and Vegetable Market', content: 'Continue to the fruit and vegetable market.' },
      { title: 'Break at an Egyptian Café', content: 'Break at an Egyptian café.' },
      { title: '10:00 PM – Return to the Hotel', content: 'Return to the hotel.' }
    ],
    highlights: [
      'Marina of Hurghada',
      'The marina is a modern hotspot and one of the most beautiful harbor complexes on the Red Sea. Numerous yachts start from here for diving and island trips. In the evening, the lights of the boats transform the water into a shimmering play of colors. An ideal place for photos and a first impression of Hurghada\'s vibrant nightlife.',
      'Traditional fruit and vegetable market',
      'This is where the real Hurghada begins. The market is a meeting point for locals who shop for fresh produce daily. Visitors experience authentic haggling, real sounds and smells — a lively glimpse of Egyptian everyday life, far from the tourist zones.',
      'Fish market and Grand Mosque',
      'We walk past the fish market and reach the Grand Mosque, which glows in warm lights in the evening. It offers impressive photo opportunities and a view of the city\'s religious architecture.',
      'Typical Egyptian café experience',
      'To finish, enjoy a traditional peppermint tea or Arabic coffee at a local café. A quiet moment that perfectly rounds off the tour.'
    ],
    included: [
      'Transfer in modern, air-conditioned vehicles',
      'Professional guide',
      'Entry fees for all listed attractions',
      'Insurance and taxes'
    ],
    not_included: [
      'Personal expenses',
      'Transfer surcharge from Makadi Bay & Sahl Hasheesh: €5 per person',
      'Transfer surcharge from El Gouna, Safaga & Soma Bay: €10 per person',
      'Guide in another language (English, Russian, or French): €10 per person surcharge'
    ],
    faqs: [
      { question: '🌙 What awaits me on the night city tour of Hurghada?', answer: 'A guided evening tour through the marina, past the fish market and Grand Mosque, through the fruit and vegetable market, with a break at an Egyptian café — all with a professional guide.' },
      { question: '🕖 How long does the tour last?', answer: 'The tour lasts approximately 3 hours, from 7:00 PM to 10:00 PM.' },
      { question: '🚗 Is hotel transfer included?', answer: 'Yes, pickup and return transfer from your hotel are included.' },
      { question: '👨‍👩‍👧‍👦 Is the tour suitable for families and children?', answer: 'Yes, the tour is family-friendly and suitable for all ages.' },
      { question: '📸 Is the tour suitable for first-time visitors to Hurghada?', answer: 'Yes, it offers a great introduction to the city\'s highlights and local culture.' },
      { question: '🕌 Is there a dress code for the mosque or markets?', answer: 'Modest dress is appreciated for the mosque visit. Shoulders and knees should be covered.' },
      { question: '☕ Are drinks at the café included?', answer: 'Drinks at the café are not included in the tour price and are paid for individually.' },
      { question: '💰 How is payment handled?', answer: 'Payment is made at the time of booking. Various payment methods are accepted.' },
      { question: '🔒 Is the tour safe?', answer: 'Yes, the tour is conducted by a professional guide in safe areas of the city.' },
      { question: '❌ Are there shopping stops?', answer: 'No, this tour has no shopping stops or pressured sales.' }
    ]
  },
  {
    slug: 'privater-pyramiden-ausflug-ab-hurghada-sakkara-dahschur-gizeh',
    name: 'Private Pyramids Tour from Hurghada – Saqqara, Dahshur & Giza',
    itinerary: [
      { title: 'Pickup (3:00 AM)', content: 'Comfortable drive toward Cairo with a rest stop.' },
      { title: 'Saqqara', content: 'Visit the Step Pyramid and introduction to early architecture.' },
      { title: 'Dahshur', content: 'Explore the Bent Pyramid and the Red Pyramid.' },
      { title: 'Lunch', content: 'Traditional Egyptian specialties in a garden restaurant.' },
      { title: 'Giza', content: 'Visit the pyramids and the Sphinx. Detailed explanations by the Egyptologist.' },
      { title: 'Return Trip', content: 'Arrival in Hurghada around 9:00 PM.' }
    ],
    highlights: [
      'Saqqara – Origin of pyramid construction',
      'Step Pyramid of Djoser',
      'Historical introduction to the early royal necropolis',
      'Dahshur – Development of the pyramid form',
      'Bent Pyramid',
      'Red Pyramid with access to the interior',
      'Giza – Wonder of the Ancient World',
      'Pyramids of Cheops, Chephren, and Mykerinos',
      'Sphinx and Valley Temple',
      'Expert explanations on construction techniques, religion, and symbolism'
    ],
    included: [
      'All transfers in modern, air-conditioned vehicles',
      'All entry fees',
      'Professional guide and Egyptologist',
      'Lunch',
      'Drinks on the bus',
      'Insurance'
    ],
    not_included: [
      'Personal expenses',
      'Drinks at the restaurant',
      'Transfer surcharge for guests from Marsa Alam: €50 per person',
      'Transfer surcharge for guests from El Quseir: €35 per person',
      'Transfer surcharge from Makadi Bay & Sahl Hasheesh: €5 per person',
      'Transfer surcharge from El Gouna, Safaga & Soma Bay: €10 per person',
      'Guide in another language (English, Russian, or French): €10 per person surcharge'
    ],
    faqs: [
      { question: '⏱️ How long does the pyramids tour from Hurghada last?', answer: 'The tour lasts approximately 16–18 hours from early morning pickup to evening return.' },
      { question: '🚐 How does pickup work?', answer: 'You are picked up directly from your hotel in a private, air-conditioned vehicle around 3:00 AM.' },
      { question: '🎟️ Are entry fees included?', answer: 'Yes, all entry fees for the sights mentioned in the program are included.' },
      { question: '🛑 Are there shopping stops?', answer: 'No, this tour has no shopping stops.' },
      { question: '👨‍👩‍👧 Can I book the tour with children?', answer: 'The long day is better suited for older children and teenagers due to the early start and extensive program.' },
      { question: '🏛️ Which pyramids are visited on this private tour?', answer: 'The tour covers the Step Pyramid at Saqqara, the Bent and Red Pyramids at Dahshur, and the Pyramids of Giza.' },
      { question: '📅 Does the tour take place daily?', answer: 'Yes, the tour is available daily upon request.' },
      { question: '🗣️ In which language is the tour conducted?', answer: 'The tour is conducted by an Egyptologist guide. An English, Russian, or French-speaking guide is available for a surcharge.' },
      { question: '🛠️ Can the tour be customized?', answer: 'Yes, as a private tour, the itinerary can be adjusted to your preferences.' },
      { question: '📜 Why is a visit to Saqqara and Dahshur recommended?', answer: 'These sites show the evolution of pyramid construction and are far less crowded than Giza, offering a more intimate experience.' }
    ]
  },
  {
    slug: 'privater-speedboot-ausflug-in-hurghada-schnorcheln-an-korallenriffen-sonnenuntergang',
    name: 'Private Speedboat Trip in Hurghada | Snorkeling at Coral Reefs & Sunset',
    itinerary: [
      { title: 'Snorkeling in the Red Sea', content: 'The Red Sea is one of the most beautiful snorkeling areas in the world. Discover colorful coral reefs, tropical reef fish, sea turtles, rays, and Napoleon fish in clear, warm water with excellent visibility.' },
      { title: 'Stay on a Quiet Island', content: 'Time on a secluded island with a bright sandy beach. Here you have plenty of time to swim, sunbathe, or relax. Thanks to the private organization of the tour, you avoid crowds and enjoy nature in a peaceful atmosphere.' },
      { title: 'Sunset on the Red Sea', content: 'On the return trip, experience the sunset over the Red Sea. The special play of light on the water makes this moment a atmospheric conclusion to the trip.' }
    ],
    highlights: [
      'Private speedboat ride from Hurghada',
      'Snorkeling at selected coral reefs',
      'Stay on a quiet island',
      'Sunset at sea',
      'Drinks and fresh fruit on board'
    ],
    included: [
      'Hotel pickup & return transfer in an air-conditioned vehicle',
      'Private speedboat',
      'Snorkeling equipment (mask, snorkel, fins, life jacket)',
      'Drinks & fruit',
      'Taxes & insurance'
    ],
    not_included: [
      'Personal expenses',
      'Transfer surcharges for certain regions'
    ],
    faqs: [
      { question: '🚤 Is the speedboat tour really private?', answer: 'Yes, the boat is exclusively for your party with no other guests added.' },
      { question: '⏱️ How long does the trip last?', answer: 'The trip lasts approximately 3–4 hours depending on the itinerary.' },
      { question: '🏨 Are we picked up from the hotel?', answer: 'Yes, hotel pickup and return transfer are included.' },
      { question: '🏝️ Which island is visited?', answer: 'The tour visits a quiet, secluded island near Hurghada.' },
      { question: '🤿 Is snorkeling equipment included?', answer: 'Yes, mask, snorkel, fins, and life jacket are provided.' },
      { question: '👨‍👩‍👧 Is the trip suitable for children?', answer: 'Yes, families with children are welcome on this private tour.' },
      { question: '🌅 Does the trip always take place at sunset?', answer: 'Yes, the timing is planned to experience the sunset on the return trip.' },
      { question: '🥤 Are drinks and fresh fruit on board?', answer: 'Yes, drinks and fresh fruit are included.' },
      { question: '⚓ How safe is the speedboat tour?', answer: 'The boat is operated by an experienced crew with all necessary safety equipment and briefings.' },
      { question: '📍 From which hotels is pickup available?', answer: 'Pickup is available from most hotels in Hurghada and surrounding areas.' }
    ]
  },
  {
    slug: 'privater-tagesausflug-von-hurghada-nach-kairo-pyramiden-grand-egyptian-museum',
    name: 'Private Day Trip from Hurghada to Cairo – Pyramids & Grand Egyptian Museum',
    itinerary: [
      { title: 'Pickup in Hurghada', content: 'Early in the morning, you are picked up directly from your hotel in Hurghada. The drive to Cairo is comfortable in a modern, air-conditioned private vehicle including complimentary drinks.' },
      { title: 'Pyramids of Giza', content: 'Upon arrival in Cairo, discover the world-famous pyramids of Cheops, Chephren, and Mykerinos as well as the impressive Sphinx and the Valley Temple.' },
      { title: 'Grand Egyptian Museum', content: 'Then visit the spectacular Grand Egyptian Museum — the largest archaeological museum in the world with unique treasures of ancient Egypt.' },
      { title: 'Lunch', content: 'Enjoy a delicious lunch at a selected restaurant in Cairo. (Drinks with lunch are not included in the price.)' },
      { title: 'Return to Hurghada', content: 'After an eventful day, your private driver takes you safely and comfortably back to your hotel in Hurghada.' }
    ],
    highlights: [
      'Private tour — no group tour, no time pressure',
      'Experienced guide',
      'Visit to the Grand Egyptian Museum including entry',
      'Sightseeing of the Pyramids & Sphinx of Giza',
      'Lunch included',
      'Complimentary drinks in the vehicle',
      'Individual service & flexible daily planning'
    ],
    included: [
      'Private transfer in an air-conditioned vehicle',
      'Professional guide',
      'Entry ticket to the Grand Egyptian Museum',
      'Visit to the Pyramids of Giza & Sphinx',
      'Lunch in Cairo',
      'Complimentary drinks during the drive'
    ],
    not_included: [
      'Personal expenses',
      'Drinks with lunch',
      'Entry inside the pyramids (optional)',
      'Transfer surcharge for guests from Marsa Alam: €50 per person',
      'Transfer surcharge for guests from El Quseir: €35 per person',
      'Transfer surcharge from Makadi Bay & Sahl Hasheesh: €5 per person',
      'Transfer surcharge from El Gouna, Safaga & Soma Bay: €10 per person',
      'Guide in another language (English, Russian, or French): €10 per person surcharge'
    ],
    faqs: [
      { question: '🚗 How is the transfer to Cairo organized?', answer: 'A private, air-conditioned vehicle picks you up from your hotel in Hurghada for the drive to Cairo.' },
      { question: '🏛️ Is entry to the Grand Egyptian Museum included?', answer: 'Yes, the entry ticket to the Grand Egyptian Museum is included in the price.' },
      { question: '🏜️ Are the Pyramids of Giza included in the program?', answer: 'Yes, the tour includes the Pyramids of Giza, the Sphinx, and the Valley Temple.' },
      { question: '🍴 Is lunch included?', answer: 'Yes, lunch at a selected restaurant in Cairo is included. Drinks with lunch are not included.' },
      { question: '👨‍👩‍👧 Is the trip suitable for families?', answer: 'Yes, the private tour can be tailored to families with children.' },
      { question: '🕰️ When does the trip start and end?', answer: 'Pickup is early morning (around 2:00–3:00 AM) with return in the evening around 9:00–10:00 PM.' },
      { question: '👗 What clothing is recommended?', answer: 'Light, comfortable clothing, sunscreen, hat, and comfortable walking shoes.' },
      { question: '📸 Can I take photos at the Grand Egyptian Museum?', answer: 'Photography is allowed in most areas of the museum. Some special exhibits may have restrictions.' },
      { question: '📅 Can the trip be booked any day?', answer: 'Yes, the tour is available daily upon request.' },
      { question: '🏆 Why should I book this private Cairo tour?', answer: 'Enjoy a personalized experience with no group pressure, flexible timing, and a dedicated guide.' }
    ]
  },
  {
    slug: 'super-safari-hurghada',
    name: 'Super Safari Hurghada with Quad, Jeep, Camel Ride & BBQ',
    itinerary: [
      { title: 'Hotel Pickup', content: 'Hotel pickup in Hurghada or surrounding area.' },
      { title: 'Desert Station', content: 'Drive to the desert station.' },
      { title: 'Quad Tour', content: 'Briefing and start of the quad tour.' },
      { title: 'Spider-Buggy', content: 'Spider-Buggy ride through the desert.' },
      { title: 'Jeep Safari & Bedouin Village', content: 'Jeep safari to the Bedouin village. Camel ride and village visit.' },
      { title: 'Sunset', content: 'Sunset in the desert.' },
      { title: 'BBQ Dinner & Folklore', content: 'BBQ dinner and folklore show.' },
      { title: 'Return to the Hotel', content: 'Return to the hotel.' }
    ],
    highlights: [
      'Quad ride through the desert',
      'Spider-Buggy & Jeep Safari',
      'Camel ride & Bedouin village',
      'Sunset in the desert',
      'BBQ dinner & show'
    ],
    included: [
      'Hotel transfer (round trip)',
      'Quad ride through the desert',
      'Spider-Buggy ride',
      'Jeep safari',
      'Camel ride',
      'Visit to the Bedouin village',
      'BBQ dinner',
      'Soft drinks',
      'Evening show'
    ],
    not_included: [
      'Personal expenses',
      'Tips',
      'Transfer surcharges for certain regions'
    ],
    faqs: [
      { question: '🏜️ What is the Super Safari Hurghada?', answer: 'A desert adventure combining quad riding, Spider-Buggy, jeep safari, camel ride, Bedouin village visit, sunset, and BBQ dinner with folklore show.' },
      { question: '🕒 How long does the Super Safari Hurghada last?', answer: 'The safari lasts approximately 5–6 hours from pickup to return.' },
      { question: '🚐 Is hotel transfer included?', answer: 'Yes, round-trip hotel transfer is included.' },
      { question: '🏍️ How long does the quad riding last?', answer: 'The quad ride typically lasts 30–45 minutes through the desert.' },
      { question: '👨‍👩‍👧‍👦 Is the Super Safari suitable for families?', answer: 'Yes, the safari is family-friendly and suitable for most ages.' },
      { question: '🐪 Can I ride a camel during the safari?', answer: 'Yes, a camel ride is included as part of the Bedouin village visit.' },
      { question: '🍖 Is dinner included?', answer: 'Yes, a BBQ dinner with soft drinks and a folklore show is included.' },
      { question: '🌅 When is the best time for the desert safari?', answer: 'Afternoon to evening timing allows you to experience the sunset in the desert.' },
      { question: '👕 What should I bring to the desert safari?', answer: 'Comfortable clothing, closed-toe shoes, sunscreen, and a scarf for dust.' },
      { question: '🏍️ Can I do the Super Safari without a driver\'s license?', answer: 'A valid driver\'s license is typically required for driving the quad.' }
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
  console.log('\nBatch 5 complete!');
})();
