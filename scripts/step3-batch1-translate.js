require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Translation helpers
function translateTable(html) {
  // Preserve prices, structure, euro amounts — translate only visible text and data-labels
  const replacements = {
    'Teilnehmer': 'Participants',
    'Teilnehmeranzahl': 'Participants',
    'Fahrzeug': 'Vehicle',
    'Preis pro Person': 'Price per Person',
    'Preis ': 'Price ',
    'Person(en)': 'Person(s)',
    'Private Limousine': 'Private Sedan',
    'Privater Minibus': 'Private Minibus',
    'Privates Speedboot': 'Private Speedboat',
    'Privater Reisebus': 'Private Coach',
    'p.P.': 'p.P.',
    'p. P.': 'p. P.',
    '1 Person': '1 Person',
    'Boot': 'Boat'
  };
  let result = html;
  for (const [de, en] of Object.entries(replacements)) {
    result = result.split(de).join(en);
  }
  return result;
}

function translateShortDesc(de) {
  return de
    .replace('Der Glasbodenboot-Ausflug in Hurghada mit Schnorcheln gehört zu den meistgebuchten Hurghada Ausflügen. Entdecken Sie Korallenriffe und tropische Fische durch den Glasboden und genießen Sie anschließend 30 Minuten Schnorcheln im Roten Meer – inklusive Transfer, Ausrüstung und deutschsprachiger Betreu',
      'The glass-bottom boat trip in Hurghada with snorkeling is one of the most booked Hurghada excursions. Discover coral reefs and tropical fish through the glass bottom and then enjoy 30 minutes of snorkeling in the Red Sea — including transfer, equipment, and professional guidance.')
    .replace('Mahmya Insel Ausflug ab Hurghada mit Schnorcheln, Mittagessen und Bootsfahrt – die „Malediven Ägyptens" direkt vor Ihrer Tür.',
      'Mahmya Island trip from Hurghada with snorkeling, lunch, and boat ride — the "Maldives of Egypt" right at your doorstep.')
    .replace('Erleben Sie Luxor mit Heißluftballonfahrt, Hotelübernachtung, Tal der Könige, Hatschepsut-Tempel, Memnon-Kolossen und Karnak-Tempel. Inklusive deutschsprachigem Ägyptologen, Eintrittskarten, Transfers und Ballonfahrt bei Sonnenaufgang.',
      'Experience Luxor with a hot air balloon ride, hotel overnight, Valley of the Kings, Hatshepsut Temple, Colossi of Memnon, and Karnak Temple. Includes a professional Egyptologist guide, entry tickets, transfers, and balloon ride at sunrise.')
    .replace('Private Delfintour in Hurghada – persönlich, komfortabel und unvergesslich.',
      'Private dolphin tour in Hurghada — personal, comfortable, and unforgettable.')
    .replace('Entdecken Sie die Klöster St. Antonius und St. Paulus – die ältesten christlichen Klöster der Welt. Ein einzigartiger Tagesausflug ab Hurghada voller Geschichte, Spiritualität und beeindruckender Wüstenlandschaften.',
      'Discover the monasteries of St. Anthony and St. Paul — the oldest Christian monasteries in the world. A unique day trip from Hurghada full of history, spirituality, and stunning desert landscapes.');
}

const descEN = {};

descEN['glasbodenboot-hurghada-mit-schnorcheln'] = `\
<p>With the glass-bottom boat in Hurghada, you can discover the fascinating underwater world of the Red Sea without getting wet. Through the large panoramic windows in the boat, you can observe colorful coral reefs, clownfish, surgeonfish, and many other marine creatures comfortably from your seat.</p>
<p>After the boat ride, we stop at a calm snorkeling spot. There you have the opportunity to experience the underwater world yourself through guided snorkeling. The snorkeling time is approximately 30 minutes and is also excellent for beginners.</p>
<p>Life jacket, snorkel, and mask are already included in the price. Our professional guidance ensures you feel safe and comfortable at all times.</p>
<p>🌊 Why this trip is so popular</p>
<p>The glass-bottom boat trip combines two experiences in one tour: the relaxed observation of the underwater world from the boat and active snorkeling in the Red Sea.</p>
<p>The tour is especially popular with families with children, non-swimmers, and guests who want to discover Hurghada\'s coral reefs in a safe and comfortable way.</p>`;

descEN['mahmya-insel-ausflug-hurghada'] = `\
<p>Imagine: Soft, white sand beneath your feet, the sea shimmering in every shade of turquoise, the sun glistening on the water\'s surface — welcome to Mahmya Island, one of the most beautiful places in the Red Sea.</p>
<p>The Mahmya Island trip from Hurghada is far more than an ordinary snorkeling excursion. It is a journey to a protected natural paradise, rightfully known as the "Maldives of Egypt."</p>
<p>Here you can expect spectacular coral reefs, crystal-clear water, and an underwater world full of color and life. Away from the crowds, you experience tranquility, luxury, and nature in perfect harmony.</p>
<p>The trip is ideal for guests seeking a high-quality island and snorkeling excursion from Hurghada with comfort, nature, and relaxation.</p>
<p>Why this trip is among the best in Hurghada</p>
<p>✔ One of the most beautiful snorkeling spots in the Red Sea</p>
<p>✔ Protected national park — untouched nature</p>
<p>✔ Dream beach with fine, white sand</p>
<p>✔ High-quality boat tour with a professional crew</p>
<p>✔ Lunch at a beach restaurant with sea views</p>
<p>✔ Perfect for couples, families & connoisseurs</p>`;

descEN['luxor-tagesausflug-heissluftballon-hoteluebernachtung'] = `\
<p>Discover with Hurghada Travel Planner one of the most impressive cultural journeys in Egypt. This 2-day Luxor excursion with a hot air balloon ride combines history, adventure, and comfort with a hotel overnight in Luxor.</p>
<p>The tour includes a hot air balloon ride at sunrise, the Valley of the Kings, Hatshepsut Temple, the Colossi of Memnon, Karnak Temple, hotel overnight, dinner, breakfast, entry tickets, transfers, and a professional Egyptologist guide.</p>
<p>Ideal for guests who want to experience the highlights of the ancient city in a relaxed and intensive way, not just a brief visit.</p>

<table class="tour-pricing-table">
<thead>
<tr>
<th><span><strong>Participants</strong></span></th>
<th><span><strong>Vehicle</strong></span></th>
<th><span><strong>Price per Person</strong></span></th>
</tr>
</thead>
<tbody>
<tr>
<td data-label="Participants"><strong>1 Person</strong></td>
<td data-label="Vehicle"><strong>Private Sedan</strong></td>
<td data-label="Price "><strong>580 ? p.P.</strong></td>
</tr>
<tr>
<td data-label="Participants"><span><strong>2 Persons</strong></span></td>
<td data-label="Vehicle"><span><strong>Private Sedan</strong></span></td>
<td data-label="Price "><span><strong>300 € p.P.</strong></span></td>
</tr>
<tr>
<td data-label="Participants"><span><strong>3 – 4 Persons</strong></span></td>
<td data-label="Vehicle"><span><strong>Private Minibus</strong></span></td>
<td data-label="Price "><span><strong>270 € p.P.</strong></span></td>
</tr>
<tr>
<td data-label="Participants"><span><strong>5 – 6 Persons</strong></span></td>
<td data-label="Vehicle"><span><strong>Private Minibus</strong></span></td>
<td data-label="Price "><span><strong>240 € p.P.</strong></span></td>
</tr>
<tr>
<td data-label="Participants"><span><strong>7 – 8 Persons</strong></span></td>
<td data-label="Vehicle"><span><strong>Private Minibus</strong></span></td>
<td data-label="Price "><span><strong>220 € p.P.</strong></span></td>
</tr>
</tbody>
</table>`;

descEN['private-delfin-tour-hurghada'] = `\
<p>Experience one of the most impressive moments of your vacation: swim with wild dolphins, discover vibrant coral reefs, and relax on a paradise island — all in a single morning.</p>
<p>This premium private tour is designed for travelers who want the best:</p>
<p>✔ No crowded boats</p>
<p>✔ No strangers</p>
<p>✔ No rush</p>
<p>✔ 100% private & personally guided</p>
<p>With Hurghada Travel Planner, you are not booking just any excursion — but an experience that many guests describe as the highlight of their entire Egypt vacation.</p>
<p>🐬 Swimming with dolphins in Hurghada — natural, respectful & unforgettable</p>
<p>Imagine: The speedboat glides across the turquoise water. You jump into the warm sea. Suddenly dolphins appear beside you — curious, elegant, free.</p>
<p>Our route deliberately leads to the best-known dolphin areas near Hurghada. The animals live here in the wild and often approach the boats themselves.</p>
<p>For many guests, this moment is more emotional than any landmark on land.</p>
<p>But this excursion offers much more:</p>
<p>Fascinating shipwreck full of marine life</p>
<p>Relaxed atmosphere without time pressure</p>
<p>Everything perfectly organized — in just 4 hours.</p>
<p>⭐ Why this tour is among the most booked private excursions in Hurghada</p>
<p>100% private operation</p>
<p>Maximum 8 people on board</p>
<p>Very high dolphin sighting rate</p>
<p>Modern, safe speedboats</p>
<p>Experienced & licensed captains</p>
<p>Ideal for couples, families & small groups</p>
<p>Excellent value for money</p>
<p>🎒 Please bring</p>
<p>Swimwear & towel</p>
<p>Sunscreen & sunglasses</p>
<p>Hat</p>
<p>In winter: light jacket</p>

<table class="tour-pricing-table">
<thead>
<tr>
<th><span><strong>Participants</strong></span></th>
<th>Boat</th>
<th><span><strong>Price per Person</strong></span></th>
</tr>
</thead>
<tbody>
<tr>
<td data-label="Participants"><span><strong>1 Person</strong></span></td>
<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>
<td data-label="Price "><span><strong>150 € p.P.</strong></span></td>
</tr>
<tr>
<td data-label="Participants"><span><strong>2 Persons</strong></span></td>
<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>
<td data-label="Price "><span><strong>80&nbsp; € p.P.</strong></span></td>
</tr>
<tr>
<td data-label="Participants"><span><strong>3 Persons</strong></span></td>
<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>
<td data-label="Price "><span><strong>70&nbsp; € p.P.</strong></span></td>
</tr>
<tr>
<td data-label="Participants"><span><strong>4 Persons</strong></span></td>
<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>
<td data-label="Price "><span><strong>60&nbsp; € p.P.</strong></span></td>
</tr>
<tr>
<td data-label="Participants"><span><strong>5 Persons</strong></span></td>
<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>
<td data-label="Price "><span><strong>55&nbsp; € p.P.</strong></span></td>
</tr>
<tr>
<td data-label="Participants"><span><strong>6 Persons</strong></span></td>
<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>
<td data-label="Price "><span><strong>50&nbsp; € p.P.</strong></span></td>
</tr>
</tbody>
</table>`;

descEN['kloester-st-antonius-st-paulus'] = `\
<p>Experience two of the oldest monasteries of Christianity on an exclusive private tour from Hurghada. The monasteries of St. Anthony and St. Paul are located in seclusion in the Eastern Desert and are among the most important spiritual sites in Egypt.</p>
<p>The monasteries of St. Anthony and St. Paul are considered the oldest monasteries in the world.</p>
<p>St. Anthony was founded in the 4th century, while St. Paul was built over the cave of Saint Paul, who is venerated as the first Christian hermit.</p>
<p>Both monasteries offer unique insights into early monasticism and the Coptic tradition of Egypt.</p>
<p>Why this trip is so special</p>
<p>Unlike the famous temples of Egypt, here you experience the spiritual side of the country. The secluded monasteries in the heart of the Eastern Desert offer a unique combination of history, religion, nature, and tranquility. Monks still live here today, following centuries-old traditions.</p>
<p>Who is this trip suitable for?</p>
<p>This trip is especially suitable for culturally interested travelers, Christians, history enthusiasts, and guests who want to discover the authentic Egypt away from the well-known tourist routes.</p>

<table class="tour-pricing-table">
<thead>
<tr>
<th><span><strong>Participants</strong></span></th>
<th><span><strong>Vehicle</strong></span></th>
<th><span><strong>Price per Person</strong></span></th>
</tr>
</thead>
<tbody>
<tr>
<td data-label="Participants"><strong>1 Person</strong></td>
<td data-label="Vehicle"><strong>Private Sedan</strong></td>
<td data-label="Price "><strong>172 ? p.P.</strong></td>
</tr>
<tr>
<td data-label="Participants"><span><strong>2 Persons</strong></span></td>
<td data-label="Vehicle"><span><strong>Private Sedan</strong></span></td>
<td data-label="Price "><span><strong>96€ p.P.</strong></span></td>
</tr>
<tr>
<td data-label="Participants"><span><strong>3 – 4 Persons</strong></span></td>
<td data-label="Vehicle"><span><strong>Private Minibus</strong></span></td>
<td data-label="Price "><span><strong>85€ p.P.</strong></span></td>
</tr>
<tr>
<td data-label="Participants"><span><strong>5 – 6 Persons</strong></span></td>
<td data-label="Vehicle"><span><strong>Private Minibus</strong></span></td>
<td data-label="Price "><span><strong>80€ p.P.</strong></span></td>
</tr>
<tr>
<td data-label="Participants"><span><strong>7 – 8 Persons</strong></span></td>
<td data-label="Vehicle"><span><strong>Private Minibus</strong></span></td>
<td data-label="Price "><span><strong>71€ p.P.</strong></span></td>
</tr>
</tbody>
</table>`;

(async () => {
  const { data: tours } = await db.from('tours').select('id, slug, short_description, description');
  const { data: cts } = await db.from('content_translations').select('*').eq('table_name', 'tours').eq('locale', 'en');

  console.log('=== Batch 1 — short_description + description translations ===\n');

  for (const tour of tours) {
    const en = cts.find(c => c.row_id === tour.id);
    if (!en) continue;

    const newShort = translateShortDesc(tour.short_description || '');
    const newDesc = descEN[tour.slug] || tour.description;

    console.log('--- ' + tour.slug.substring(0,45) + ' ---');
    console.log('short_description:');
    console.log('  OLD: ' + (en.short_description || '').substring(0,80) + '...');
    console.log('  NEW: ' + newShort.substring(0,80) + '...');
    console.log('');
    console.log('description: (showing first 100 chars)');
    console.log('  OLD: ' + (en.description || '').replace(/<[^>]+>/g,' ').substring(0,100) + '...');
    console.log('  NEW: ' + newDesc.replace(/<[^>]+>/g,' ').substring(0,100) + '...');
    console.log('  [Table headers translated: ' + (newDesc.includes('Participants') ? '✅' : '❌') + ']');
    console.log('');
  }

  console.log('========================');
  console.log('Batch 1 ready for review. Write to DB? (Will update short_description & description in content_translations)');
})();
