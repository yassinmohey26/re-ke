require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const slugs = [
  '2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben',
  'dendera-halbtagesausflug-ab-hurghada-der-authentische-besuch-im-hathor-tempel',
  'eden-island-schnorchelausflug-hurghada',
  'eintrittskarte-zum-hurghada-grand-aquarium',
  'hula-hula-insel-schnorchelausflug-hurghada'
];

const translations = [
  {
    slug: '2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben',
    name: '2-Day Trip to Cairo from Hurghada – Pyramids, Sphinx & Egyptian Museum',
    itinerary: [
      { title: 'Pickup & Drive to Cairo', content: 'Pickup is at approximately 2:00 AM directly from your hotel in Hurghada. The drive to Cairo then begins in an air-conditioned vehicle.' },
      { title: 'The Pyramids of Giza', content: 'Visit the world-famous pyramids of Cheops, Chephren, and Mykerinos – the last surviving wonders of the ancient world.' },
      { title: 'Valley Temple & Great Sphinx', content: 'Explore the Valley Temple of King Chephren and marvel at the legendary Great Sphinx of Giza.' },
      { title: 'Lunch', content: 'Enjoy a delicious lunch at a local restaurant.' },
      { title: 'Grand Egyptian Museum (GEM)', content: 'Discover the impressive treasures of ancient Egypt, including the famous golden mask of Tutankhamun.' },
      { title: 'Overnight in Cairo', content: 'After the sightseeing program, you will be taken to the hotel in Cairo for an overnight stay.' },
      { title: 'Breakfast at the Hotel', content: 'After breakfast, the journey continues to the oldest pyramids in Egypt.' },
      { title: 'Saqqara – Step Pyramid of Djoser', content: 'Visit the famous Step Pyramid of King Djoser – the oldest stone pyramid in the world – as well as the intricately decorated tombs of the nobles.' },
      { title: 'Dahshur – Red & Bent Pyramid', content: 'Discover the unique architecture of the Red Pyramid and the famous Bent Pyramid, which are considered important stages in the development of pyramid construction.' },
      { title: 'Return to Hurghada', content: 'After lunch, return to Hurghada. Arrival at the hotel is planned for approximately 9:00 PM.' }
    ],
    highlights: [
      'Visit to the Pyramids of Giza',
      'The Great Sphinx',
      'Egyptian Museum in Cairo',
      'Old Town Khan el-Khalili',
      'Alabaster Mosque',
      '2 days with overnight stay',
      'Guide for the entire trip'
    ],
    included: [
      'Round trip Hurghada–Cairo (with air conditioning)',
      '1 overnight stay in a 4-star hotel in Cairo',
      'Breakfast at the hotel',
      'Lunch on the first day',
      'Entry tickets for all sights',
      'Experienced tour guide',
      'Drinking water on the bus'
    ],
    not_included: [
      'Tips',
      'Photos and videos',
      'Dinner',
      'Additional drinks',
      'Personal expenses'
    ],
    faqs: [
      { question: 'How long is the drive from Hurghada to Cairo?', answer: 'The drive takes approximately 5–6 hours each way, depending on traffic and road conditions.' },
      { question: 'Is breakfast at the hotel included?', answer: 'Yes, breakfast at the hotel is included in the tour price.' },
      { question: 'Can I take this trip as a day trip instead?', answer: 'This tour is designed as a 2-day experience due to the distance and the extensive sightseeing program. A day trip would not allow enough time for all visits.' }
    ]
  },
  {
    slug: 'dendera-halbtagesausflug-ab-hurghada-der-authentische-besuch-im-hathor-tempel',
    name: 'Dendera Half-Day Trip from Hurghada – Authentic Visit to the Temple of Hathor',
    itinerary: [
      { title: 'Pickup & Drive to Dendera', content: 'Pickup at approximately 6:00 AM directly from your hotel in Hurghada. Drive to Dendera (approx. 230 km, air-conditioned vehicle).' },
      { title: 'Arrival at the Temple', content: 'Arrival at the temple & guided tour with an Egyptologist.' },
      { title: 'Hathor Column Hall & Ceiling', content: 'Visit the famous Hathor column hall and the astronomical ceiling.' },
      { title: 'Further Areas', content: 'Visit selected areas including the Mamisi, Sacred Lake, and temple complex.' },
      { title: 'Individual Exploration', content: 'Time for individual exploration and photos.' },
      { title: 'Return', content: 'Return in the early afternoon.' }
    ],
    highlights: [
      'Massive column halls where the original colors still shine after 2,000 years',
      'The famous astronomical ceiling depicting the starry sky of ancient Egypt',
      'The Mamisi (birth house of the gods)',
      'The crypts with mysterious reliefs',
      'The only fully preserved depiction of Cleopatra VII and Caesarion',
      'The Sacred Lake – site of ritual purification',
      'The unique sanatorium where healing took place through sacred rituals'
    ],
    included: [
      'Private transfer in an air-conditioned vehicle',
      'Professional guide / Egyptologist',
      'Entry fees according to the program',
      'Drinks in the vehicle',
      'Insurance included'
    ],
    not_included: [
      'Personal expenses',
      'Transfer surcharge for guests from Marsa Alam: €50 per person',
      'Transfer surcharge for guests from El Quseir: €35 per person',
      'Transfer surcharge from Makadi Bay & Sahl Hasheesh: €5 per person',
      'Transfer surcharge from El Gouna, Safaga & Soma Bay: €10 per person',
      'Guide in another language (English, Russian, or French): €10 per person surcharge'
    ],
    faqs: [
      { question: '⏱️ How long does the Dendera Temple trip last?', answer: 'The trip takes approximately 6–7 hours from pickup to return.' },
      { question: '📍 How far is Dendera from Hurghada?', answer: 'Dendera is approximately 230 km from Hurghada, about a 3-hour drive.' },
      { question: '🗣️ Is a guide included?', answer: 'Yes, a professional Egyptologist guide is included. An English, Russian, or French-speaking guide is available for a surcharge.' },
      { question: '👨‍👩‍👧‍👦 Who is the Dendera trip suitable for?', answer: 'The trip is ideal for history enthusiasts, culture lovers, and anyone interested in ancient Egyptian architecture.' },
      { question: '🔍 Which attractions are visited at the Dendera Temple?', answer: 'The tour covers the Hathor column hall, the astronomical ceiling, the Mamisi, the crypts, the Sacred Lake, and the sanatorium.' },
      { question: '👶 Is the trip suitable for children?', answer: 'Yes, children are welcome. The shorter duration and focused itinerary make it manageable for families.' },
      { question: '🛍️ Are there shopping stops during the tour?', answer: 'No, this tour has no shopping stops. It focuses entirely on the temple visit.' },
      { question: '📝 What documents are needed for booking?', answer: 'No special documents are required. A valid passport copy may be requested for the booking confirmation.' },
      { question: '🎒 What should I bring on the trip?', answer: 'Comfortable shoes, sunscreen, hat, camera, and water.' },
      { question: '💎 Why is this trip better than group tours?', answer: 'This is a private tour with your own Egyptologist guide, allowing for a more personalized and flexible experience.' }
    ]
  },
  {
    slug: 'eden-island-schnorchelausflug-hurghada',
    name: 'Eden Island Snorkeling Trip Hurghada with Lunch',
    itinerary: [
      { title: 'Hotel Pickup', content: 'Your day begins between 7:30 and 8:00 AM with a comfortable hotel transfer to the harbor of Hurghada.' },
      { title: 'Boat Ride to the Best Snorkeling Spots', content: 'After receiving your snorkeling equipment, the 40-minute boat ride begins to the most fascinating reefs around Eden Island. Colorful coral reefs and tropical fish await you – a paradise for snorkelers.' },
      { title: 'Snorkeling & Beach Time', content: 'Spend several hours at Eden Island Beach, swim in the turquoise water, or relax on the sand.' },
      { title: 'Lunch During the Trip', content: 'A rich buffet with local and international dishes awaits you during the trip.' },
      { title: 'Relaxation & Return', content: 'Use the remaining time for swimming, snorkeling, or relaxing on the beach before taking the boat back to the harbor in the afternoon and being transferred to your hotel.' }
    ],
    highlights: [
      'Hotel transfer from Hurghada included',
      'Boat ride on the Red Sea',
      'Snorkeling at colorful coral reefs',
      'Time on Eden Island',
      'Lunch included',
      'Free time for swimming and relaxation',
      'Professional snorkel guide'
    ],
    included: [
      'Hotel pickup and return transfer',
      'Air-conditioned vehicle transfer',
      'Professional snorkel guide',
      'Snorkeling equipment',
      'Entry to Eden Island',
      'Boat ride & life jackets',
      'Snorkeling equipment',
      'Lunch + coffee, tea, or soda'
    ],
    not_included: [
      'Personal expenses',
      'Tips',
      'Transfer surcharges for certain regions'
    ],
    faqs: [
      { question: '🐠 Do I need snorkeling experience?', answer: 'No, beginners are welcome. The guide provides instructions and supervision.' },
      { question: 'How long does the trip last?', answer: 'The trip lasts approximately 5–6 hours from pickup to return.' },
      { question: '🏖️ Who can participate?', answer: 'The trip is suitable for all ages. Children, adults, and non-swimmers can enjoy the experience.' },
      { question: '🛟 What safety measures are in place?', answer: 'Life jackets are provided, and a professional snorkel guide supervises all water activities.' },
      { question: '🍽️ Is lunch included in the price?', answer: 'Yes, a buffet lunch with local and international dishes is included.' },
      { question: '⛵ How far is the boat ride to the snorkeling spots?', answer: 'The boat ride to Eden Island takes approximately 40 minutes.' },
      { question: '👙 What clothing should I bring?', answer: 'Swimwear, towel, sunscreen, hat, and a change of clothes.' },
      { question: '📸 Can I take photos on Eden Island?', answer: 'Yes, photography is welcome on the island and underwater.' },
      { question: '☔ What happens in bad weather?', answer: 'For safety reasons, the trip may be rescheduled or canceled. You will be notified in advance.' },
      { question: '💻 How do I book the trip?', answer: 'You can book directly through our website or contact us for assistance.' }
    ]
  },
  {
    slug: 'eintrittskarte-zum-hurghada-grand-aquarium',
    name: 'Hurghada Grand Aquarium Entry Ticket with Transfer',
    itinerary: [
      { title: 'Arrival at Hurghada Grand Aquarium', content: 'Upon arrival, you enter one of the largest and most modern aquariums in Egypt. With your online ticket, you enjoy fast and easy entry without long waiting times.' },
      { title: 'Discovery of the Underwater World', content: 'Begin your tour through more than 24 fascinating themed areas with exotic marine life, colorful coral reefs, and impressive large aquariums of the Red Sea.' },
      { title: 'Underwater Tunnel & Panorama Areas', content: 'Experience the spectacular 24-meter-long underwater tunnel and observe sharks, rays, and numerous fish species up close – an unforgettable experience for the whole family.' },
      { title: 'Rainforest & Animal Areas', content: 'Visit the tropical rainforest zone as well as the small zoo with exotic birds, reptiles, and other fascinating animals from different regions of the world.' },
      { title: 'Interactive Experiences', content: 'Children and adults can discover the interactive touch pool and participate in animal feeding sessions and exciting live presentations.' },
      { title: 'Free Time & Photos', content: 'Use the free time to take photos, buy souvenirs, or enjoy the relaxed atmosphere of the aquarium.' },
      { title: 'End of Visit', content: 'After an eventful tour, your visit to the Hurghada Grand Aquarium ends with unforgettable impressions of the fascinating underwater world of the Red Sea.' }
    ],
    highlights: [
      '🌊 24-meter-long underwater tunnel',
      '🐠 Over 1,000 animal species from around the world',
      '🦈 Sharks, rays, and colorful reef fish',
      '🌴 Rainforest zone with exotic animals and birds',
      '👨‍👩‍👧‍👦 Ideal for families with children',
      '📸 Great photo opportunities at the aquarium'
    ],
    included: [
      'Entry to Hurghada Grand Aquarium',
      'Transfer to and from the hotel in Hurghada',
      'All taxes and service fees'
    ],
    not_included: [
      'Personal expenses',
      'Food and drinks',
      'Transfer surcharge from Makadi Bay or Sahl Hasheesh: €5 per person',
      'Transfer surcharge from El Gouna, Safaga or Soma Bay: €10 per person'
    ],
    faqs: [
      { question: '🕒 What are the opening hours of Hurghada Grand Aquarium?', answer: 'The aquarium is typically open daily from 9:00 AM to 6:00 PM. Please check current hours before your visit.' },
      { question: '🎟️ Can I book tickets online?', answer: 'Yes, online booking is available and recommended for faster entry.' },
      { question: '♿ Is the aquarium wheelchair accessible?', answer: 'Yes, the aquarium is fully wheelchair accessible.' },
      { question: '🦈 Which animals can I see at the aquarium?', answer: 'Sharks, rays, colorful reef fish, seahorses, exotic birds, reptiles, and many more species.' },
      { question: '📸 Can I take photos inside the aquarium?', answer: 'Yes, photography is allowed throughout the aquarium.' },
      { question: '🍽️ Are there restaurants or cafés at the aquarium?', answer: 'Yes, the aquarium has dining options including a café and restaurant.' },
      { question: '🎁 Is there a souvenir shop?', answer: 'Yes, a souvenir shop is available on site.' },
      { question: '👨‍👩‍👧 Is the aquarium suitable for children?', answer: 'Yes, the aquarium is very family-friendly with interactive areas and a children\'s touch pool.' },
      { question: '🕹️ Are there guided tours?', answer: 'Guided tours may be available upon request. Self-guided exploration is the standard experience.' },
      { question: '📱 Is the mobile ticket accepted?', answer: 'Yes, mobile tickets are accepted for entry.' }
    ]
  },
  {
    slug: 'hula-hula-insel-schnorchelausflug-hurghada',
    name: 'Hula Hula Island Snorkeling Trip with Transfer from Hurghada',
    itinerary: [
      { title: 'Hotel Pickup', content: 'Your experienced guide picks you up in an air-conditioned vehicle and takes you safely to the harbor.' },
      { title: 'Boat Ride to Hula Hula Island', content: 'Enjoy the wide view over the sparkling Red Sea. Feel the sea breeze and look forward to unforgettable moments.' },
      { title: 'Snorkeling & Swimming', content: 'Explore the colorful underwater world with exotic fish and impressive coral reefs. Snorkeling equipment is provided.' },
      { title: 'Island Stay (90 Minutes)', content: 'Relax on the white sandy beaches, swim in the crystal-clear water, or snorkel directly from the shore. Loungers and umbrellas are available for you.' },
      { title: 'Return to the Hotel', content: 'After an eventful day, you return to the harbor and then to your hotel – with many new impressions and happy memories.' }
    ],
    highlights: [
      'Boat ride to Hula Hula Island from Hurghada',
      'Snorkeling in the Red Sea with coral reefs',
      '90-minute island stay on Hula Hula',
      'Lunch & soft drinks on board included',
      'Ideal for families, couples, and beginner snorkelers',
      'Hotel transfer from Hurghada included'
    ],
    included: [
      'Snorkeling equipment',
      'Two snorkeling stops',
      'Lunch & soft drinks on board',
      'Loungers & umbrellas on Hula Hula Island',
      'All transfers in air-conditioned vehicles',
      'Boat ride to Hula Hula Island'
    ],
    not_included: [
      'Personal expenses',
      'Tips (voluntary)',
      'Transfer surcharges for certain regions'
    ],
    faqs: [
      { question: '🚤 How long does the Hula Hula Island tour last?', answer: 'The tour lasts approximately 5–6 hours from pickup to return.' },
      { question: '🕗 When does the tour start?', answer: 'Pickup typically starts between 7:30 and 8:00 AM.' },
      { question: '🚌 Are hotel transfers included?', answer: 'Yes, transfers from and to your hotel in Hurghada are included.' },
      { question: '🐠 Can I snorkel during the tour?', answer: 'Yes, there are two snorkeling stops with equipment provided.' },
      { question: '🏖 How long do we stay on the island?', answer: 'You have approximately 90 minutes of free time on Hula Hula Island.' },
      { question: '🍽 Is lunch included in the price?', answer: 'Yes, lunch and soft drinks on board are included.' },
      { question: '👶 Are there children\'s discounts?', answer: 'Children\'s pricing is available. Please check the tour page for specific rates.' },
      { question: '📸 Can I take photos on Hula Hula Island?', answer: 'Yes, photography is welcome on the island and underwater.' },
      { question: '🎒 Do I need to bring anything special?', answer: 'Swimwear, towel, sunscreen, and a hat are recommended.' },
      { question: '🌐 Where can I book the tour?', answer: 'You can book directly on our website or contact us for assistance.' }
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
  console.log('\nBatch 4 complete!');
})();
