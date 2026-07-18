require('dotenv').config({ path: __dirname + '/../.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TRANSFERS = [
  { sort_order: 1,  destination: 'Hurghada',      car_price: 12, minibus_price: 25 },
  { sort_order: 2,  destination: 'Sahl Hasheesh',  car_price: 15, minibus_price: 30 },
  { sort_order: 3,  destination: 'Makadi Bay',     car_price: 18, minibus_price: 35 },
  { sort_order: 4,  destination: 'El Gouna',       car_price: 15, minibus_price: 30 },
  { sort_order: 5,  destination: 'Soma Bay',       car_price: 20, minibus_price: 40 },
  { sort_order: 6,  destination: 'Safaga',         car_price: 25, minibus_price: 50 },
  { sort_order: 7,  destination: 'El Quseir',      car_price: 35, minibus_price: 65 },
  { sort_order: 8,  destination: 'TUI Magic Life', car_price: 20, minibus_price: 40 },
  { sort_order: 9,  destination: 'Port Ghalib',    car_price: 40, minibus_price: 75 },
  { sort_order: 10, destination: 'Marsa Alam',     car_price: 45, minibus_price: 85 },
  { sort_order: 11, destination: 'Cairo',          car_price: 120, minibus_price: 200 },
  { sort_order: 12, destination: 'Luxor',          car_price: 90, minibus_price: 160 },
  { sort_order: 13, destination: 'Assuan',         car_price: 150, minibus_price: 280 },
];

const FAQS = [
  {
    sort_order: 1,
    question: 'How do I book my airport transfer with Hurghada Travel Planner?',
    answer: 'You can book your airport transfer directly through our website by filling out the booking form or contacting us via WhatsApp. Simply provide your flight details, destination, and number of passengers, and we will confirm your transfer within a few hours.'
  },
  {
    sort_order: 2,
    question: 'What happens if my flight is delayed?',
    answer: 'No problem at all. We monitor all incoming flights and adjust your pickup time accordingly. Your driver will be waiting for you regardless of any delays, and there are no extra charges for flight delays.'
  },
  {
    sort_order: 3,
    question: 'Are the transfer prices per person or per vehicle?',
    answer: 'All prices listed are per vehicle, not per person. A car accommodates up to 2 persons and a minibus up to 8 persons, so the price stays the same regardless of how many passengers share the ride.'
  },
  {
    sort_order: 4,
    question: 'Will we be picked up directly at the airport?',
    answer: 'Yes, your driver will meet you at the arrivals hall holding a sign with your name. They will assist you with your luggage and take you directly to your vehicle for a comfortable ride to your hotel.'
  },
  {
    sort_order: 5,
    question: 'Can I book a transfer at short notice?',
    answer: 'Yes, we accept last-minute bookings subject to availability. We recommend booking at least 24 hours in advance to guarantee availability, but we do our best to accommodate short-notice requests.'
  },
  {
    sort_order: 6,
    question: 'Are there any hidden costs?',
    answer: 'No, there are absolutely no hidden costs. The price you see is the price you pay. All tolls, fuel, and waiting times at the airport are included in the quoted price.'
  },
  {
    sort_order: 7,
    question: 'Can I book a round-trip transfer at the same time?',
    answer: 'Absolutely. You can book both your arrival and departure transfers at once. This ensures your return transfer is already arranged, giving you peace of mind throughout your trip.'
  },
  {
    sort_order: 8,
    question: 'How do I book my trip with the Hurghada travel planner?',
    answer: 'Simply browse our tours and excursions page, select the experiences you are interested in, and fill out the booking form. You can also contact us directly via WhatsApp or our contact form for a personalized itinerary.'
  },
  {
    sort_order: 9,
    question: 'What happens if I need to change my booking?',
    answer: 'We understand plans can change. You can modify your booking up to 24 hours before the scheduled date at no extra cost. Simply reach out to us and we will adjust your reservation.'
  },
  {
    sort_order: 10,
    question: 'Does the Hurghada travel planner offer support during my trip?',
    answer: 'Yes, we provide support throughout your entire stay. Whether you need help with bookings, recommendations, or any urgent matters, our team is available via WhatsApp and phone.'
  },
  {
    sort_order: 11,
    question: 'Are your trips family-friendly?',
    answer: 'Absolutely! Many of our tours and excursions are suitable for families with children. We clearly indicate minimum age requirements and can recommend the best options for families.'
  },
  {
    sort_order: 12,
    question: 'Can I customize my itinerary?',
    answer: 'Yes, we specialize in creating personalized itineraries tailored to your interests, budget, and schedule. Contact us with your preferences and we will design a custom plan just for you.'
  },
];

async function seed() {
  console.log('Seeding airport_transfers...');
  for (const t of TRANSFERS) {
    const { error } = await supabase.from('airport_transfers').upsert(t, { onConflict: 'id' });
    if (error) console.error('  FAIL:', t.destination, error.message);
    else console.log('  OK:', t.destination, '€' + t.car_price + '/€' + t.minibus_price);
  }

  console.log('\nSeeding airport_transfer_faqs...');
  for (const f of FAQS) {
    const { error } = await supabase.from('airport_transfer_faqs').upsert(f, { onConflict: 'id' });
    if (error) console.error('  FAIL:', f.question.substring(0, 40), error.message);
    else console.log('  OK:', f.question.substring(0, 60));
  }

  console.log('\nDone!');
}

seed().catch(err => { console.error('FATAL:', err); process.exit(1); });
