require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function translateTable(html) {
  const r = {
    'Teilnehmeranzahl': 'Participants', 'Teilnehmer': 'Participants', 'Fahrzeug': 'Vehicle',
    'Preis pro Person': 'Price per Person', 'Preis ': 'Price ',
    'Private Limousine': 'Private Sedan', 'Privater Minibus': 'Private Minibus',
    'Privates Speedboot': 'Private Speedboat', 'Boot': 'Boat'
  };
  let h = html;
  for (const [k,v] of Object.entries(r)) h = h.split(k).join(v);
  return h;
}

const sd = {
  'glasbodenboot-hurghada-mit-schnorcheln': 'The glass-bottom boat trip in Hurghada with snorkeling is one of the most booked Hurghada excursions. Discover coral reefs and tropical fish through the glass bottom and then enjoy 30 minutes of snorkeling in the Red Sea — including transfer, equipment, and professional guidance.',
  'mahmya-insel-ausflug-hurghada': 'Mahmya Island trip from Hurghada with snorkeling, lunch, and boat ride — the "Maldives of Egypt" right at your doorstep.',
  'luxor-tagesausflug-heissluftballon-hoteluebernachtung': 'Experience Luxor with a hot air balloon ride, hotel overnight, Valley of the Kings, Hatshepsut Temple, Colossi of Memnon, and Karnak Temple. Includes a professional Egyptologist guide, entry tickets, transfers, and balloon ride at sunrise.',
  'private-delfin-tour-hurghada': 'Private dolphin tour in Hurghada — personal, comfortable, and unforgettable.',
  'kloester-st-antonius-st-paulus': 'Discover the monasteries of St. Anthony and St. Paul — the oldest Christian monasteries in the world. A unique day trip from Hurghada full of history, spirituality, and stunning desert landscapes.',
  'quad-tour-hurghada-kamelritt': 'Exciting 3-hour quad biking trip in Hurghada with camel ride, visit to a Bedouin village, and breathtaking desert landscape.',
  'reiten-in-hurghada-strand-wueste-pferde-im-meer': 'Experience a special horseback riding trip along the Red Sea coast and through the impressive desert landscape around Hurghada.',
  'luxor-tagesausflug-ab-hurghada': 'Discover Luxor on a private day trip from Hurghada. Visit the Valley of the Kings, Karnak Temple, Hatshepsut Temple, and the Colossi of Memnon including lunch and a professional guide.',
  'hurghada-shopping-tour-basar-transfer': 'Free shopping trip to the Hurghada bazaar with transfer',
  'kairo-mit-flug-ab-hurghada-pyramiden-museum': 'Discover the Pyramids of Giza, the Sphinx, and the Grand Egyptian Museum on a comfortable day trip with flights from Hurghada. Experience the best of Cairo — fast, comfortable, and professionally organized.',
  'orange-bay-insel-schnorchelausflug-hurghada': 'Snorkeling and water sports trip to Orange Bay Island in the Giftun National Park — white sand, turquoise water, and first-class service.',
  'makadi-water-park-hurghada-mittagessen-transfer': 'Water park excursion at Makadi Water Park with transfer & lunch',
  'el-gouna-private-stadtrundfahrt-mit-lagunenfahrt-aussichtsturm': 'Discover El Gouna — the "Venice of Egypt" — on a private city tour with lagoon cruise and visit to the observation tower. Architecture, yacht harbor, lagoons, and panorama in just about 4 hours, with no shopping stops.',
  'private-speedboot-tour-orange-bay-hurghada': 'Private speedboat tour to Orange Bay from Hurghada with snorkeling, lunch, soft drinks, and hotel transfer.',
  'privater-tagesausflug-ab-hurghada-dendera-abydos-tempel': 'Private day trip from Hurghada to Dendera & Abydos with a professional Egyptologist guide, Temple of Hathor, Temple of Abydos, lunch, and comfortable transfer.',
  'eintrittskarte-zum-hurghada-grand-aquarium': 'Discover the Hurghada Grand Aquarium with over 1,000 animal species, a 24-meter-long underwater tunnel, and fascinating themed worlds — ideal for families, couples, and children.',
  'super-safari-hurghada': 'Experience an unforgettable desert adventure in Hurghada: quad, jeep, camel ride, sandboarding, and a Bedouin BBQ under the stars — all included.',
  'mini-egypt-park-hurghada': "Discover Egypt's landmarks in miniature form: over 55 famous monuments, guided tour & transfer from €35. Ideal for families and culture enthusiasts.",
  'privater-tagesausflug-von-hurghada-nach-kairo-pyramiden-grand-egyptian-museum': 'Luxury, culture & history — your private day trip to the Pyramids of Giza & the Grand Egyptian Museum.',
  'dendera-halbtagesausflug-ab-hurghada-der-authentische-besuch-im-hathor-tempel': 'Discover the impressive Temple of Dendera, one of the best-preserved sanctuaries in Egypt, on an exclusive half-day tour from Hurghada with a professional Egyptologist guide.',
  '2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben': '2-day trip from Hurghada to Cairo: Visit the Pyramids of Giza, the Great Sphinx, the Egyptian Museum, and the old town of Cairo.',
  'privater-speedboot-ausflug-in-hurghada-schnorcheln-an-korallenriffen-sonnenuntergang': 'Snorkeling at coral reefs & sunset on the Red Sea',
  'eden-island-schnorchelausflug-hurghada': 'Experience an unforgettable snorkeling trip to Eden Island from Hurghada with hotel transfer, boat ride, lunch, and time for swimming and relaxing in the Red Sea.',
  'naechtliche-stadtrundfahrt-durch-hurghada-private-tour': 'Experience Hurghada at night — with its glittering marina, authentic markets, and oriental flair. This approx. 3-hour private tour shows you the city from an entirely new perspective.',
  'privater-pyramiden-ausflug-ab-hurghada-sakkara-dahschur-gizeh': 'Experience the most important pyramids of Egypt on a private, individually customizable tour from Hurghada. This premium excursion takes you to Saqqara, Dahshur, and Giza and offers a first-class guided experience with a certified Egyptologist. No shopping stops. No waiting times.',
  'hula-hula-insel-schnorchelausflug-hurghada': 'Snorkeling trip to Hula Hula Island from Hurghada — white sandy beach, colorful coral reefs, and an unforgettable island experience.'
};

const dd = {};

// 1  glasbodenboot (no table)
dd['glasbodenboot-hurghada-mit-schnorcheln'] = `<p>With the glass-bottom boat in Hurghada, you can discover the fascinating underwater world of the Red Sea without getting wet. Through the large panoramic windows in the boat, you can observe colorful coral reefs, clownfish, surgeonfish, and many other marine creatures comfortably from your seat.</p>
<p>After the boat ride, we stop at a calm snorkeling spot. There you have the opportunity to experience the underwater world yourself through guided snorkeling. The snorkeling time is approximately 30 minutes and is also excellent for beginners.</p>
<p>Life jacket, snorkel, and mask are already included in the price. Our professional guidance ensures you feel safe and comfortable at all times.</p>
<p>🌊 Why this trip is so popular</p>
<p>The glass-bottom boat trip combines two experiences in one tour: the relaxed observation of the underwater world from the boat and active snorkeling in the Red Sea.</p>
<p>The tour is especially popular with families with children, non-swimmers, and guests who want to discover Hurghada's coral reefs in a safe and comfortable way.</p>`;

// 2  mahmya (no table)
dd['mahmya-insel-ausflug-hurghada'] = `<p>Imagine: Soft, white sand beneath your feet, the sea shimmering in every shade of turquoise, the sun glistening on the water's surface — welcome to Mahmya Island, one of the most beautiful places in the Red Sea.</p>
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

// 3  luxor-heissluftballon (table)
dd['luxor-tagesausflug-heissluftballon-hoteluebernachtung'] = `<p>Discover with Hurghada Travel Planner one of the most impressive cultural journeys in Egypt. This 2-day Luxor excursion with a hot air balloon ride combines history, adventure, and comfort with a hotel overnight in Luxor.</p>
<p>The tour includes a hot air balloon ride at sunrise, the Valley of the Kings, Hatshepsut Temple, the Colossi of Memnon, Karnak Temple, hotel overnight, dinner, breakfast, entry tickets, transfers, and a professional Egyptologist guide.</p>
<p>Ideal for guests who want to experience the highlights of the ancient city in a relaxed and intensive way, not just a brief visit.</p>\n\n`
+ `<table class="tour-pricing-table">\n<thead>\n<tr>\n<th><span><strong>Participants</strong></span></th>\n<th><span><strong>Vehicle</strong></span></th>\n<th><span><strong>Price per Person</strong></span></th>\n</tr>\n</thead>\n<tbody>\n`
+ `<tr>\n<td data-label="Participants"><strong>1 Person</strong></td>\n<td data-label="Vehicle"><strong>Private Sedan</strong></td>\n<td data-label="Price "><strong>580 ? p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>2 Persons</strong></span></td>\n<td data-label="Vehicle"><span><strong>Private Sedan</strong></span></td>\n<td data-label="Price "><span><strong>300 € p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>3 – 4 Persons</strong></span></td>\n<td data-label="Vehicle"><span><strong>Private Minibus</strong></span></td>\n<td data-label="Price "><span><strong>270 € p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>5 – 6 Persons</strong></span></td>\n<td data-label="Vehicle"><span><strong>Private Minibus</strong></span></td>\n<td data-label="Price "><span><strong>240 € p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>7 – 8 Persons</strong></span></td>\n<td data-label="Vehicle"><span><strong>Private Minibus</strong></span></td>\n<td data-label="Price "><span><strong>220 € p.P.</strong></span></td>\n</tr>\n`
+ `</tbody>\n</table>`;

// 4  private-delfin (table)
dd['private-delfin-tour-hurghada'] = `<p>Experience one of the most impressive moments of your vacation: swim with wild dolphins, discover vibrant coral reefs, and relax on a paradise island — all in a single morning.</p>
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
<p>In winter: light jacket</p>\n\n`
+ `<table class="tour-pricing-table">\n<thead>\n<tr>\n<th><span><strong>Participants</strong></span></th>\n<th>Boat</th>\n<th><span><strong>Price per Person</strong></span></th>\n</tr>\n</thead>\n<tbody>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>1 Person</strong></span></td>\n<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>\n<td data-label="Price "><span><strong>150 € p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>2 Persons</strong></span></td>\n<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>\n<td data-label="Price "><span><strong>80&nbsp; € p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>3 Persons</strong></span></td>\n<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>\n<td data-label="Price "><span><strong>70&nbsp; € p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>4 Persons</strong></span></td>\n<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>\n<td data-label="Price "><span><strong>60&nbsp; € p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>5 Persons</strong></span></td>\n<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>\n<td data-label="Price "><span><strong>55&nbsp; € p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>6 Persons</strong></span></td>\n<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>\n<td data-label="Price "><span><strong>50&nbsp; € p.P.</strong></span></td>\n</tr>\n`
+ `</tbody>\n</table>`;

// 5  kloester (table)
dd['kloester-st-antonius-st-paulus'] = `<p>Experience two of the oldest monasteries of Christianity on an exclusive private tour from Hurghada. The monasteries of St. Anthony and St. Paul are located in seclusion in the Eastern Desert and are among the most important spiritual sites in Egypt.</p>
<p>The monasteries of St. Anthony and St. Paul are considered the oldest monasteries in the world.</p>
<p>St. Anthony was founded in the 4th century, while St. Paul was built over the cave of Saint Paul, who is venerated as the first Christian hermit.</p>
<p>Both monasteries offer unique insights into early monasticism and the Coptic tradition of Egypt.</p>
<p>Why this trip is so special</p>
<p>Unlike the famous temples of Egypt, here you experience the spiritual side of the country. The secluded monasteries in the heart of the Eastern Desert offer a unique combination of history, religion, nature, and tranquility. Monks still live here today, following centuries-old traditions.</p>
<p>Who is this trip suitable for?</p>
<p>This trip is especially suitable for culturally interested travelers, Christians, history enthusiasts, and guests who want to discover the authentic Egypt away from the well-known tourist routes.</p>\n\n`
+ `<table class="tour-pricing-table">\n<thead>\n<tr>\n<th><span><strong>Participants</strong></span></th>\n<th><span><strong>Vehicle</strong></span></th>\n<th><span><strong>Price per Person</strong></span></th>\n</tr>\n</thead>\n<tbody>\n`
+ `<tr>\n<td data-label="Participants"><strong>1 Person</strong></td>\n<td data-label="Vehicle"><strong>Private Sedan</strong></td>\n<td data-label="Price "><strong>172 ? p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>2 Persons</strong></span></td>\n<td data-label="Vehicle"><span><strong>Private Sedan</strong></span></td>\n<td data-label="Price "><span><strong>96€ p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>3 – 4 Persons</strong></span></td>\n<td data-label="Vehicle"><span><strong>Private Minibus</strong></span></td>\n<td data-label="Price "><span><strong>85€ p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>5 – 6 Persons</strong></span></td>\n<td data-label="Vehicle"><span><strong>Private Minibus</strong></span></td>\n<td data-label="Price "><span><strong>80€ p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>7 – 8 Persons</strong></span></td>\n<td data-label="Vehicle"><span><strong>Private Minibus</strong></span></td>\n<td data-label="Price "><span><strong>71€ p.P.</strong></span></td>\n</tr>\n`
+ `</tbody>\n</table>`;

// 6  quad-tour (no table)
dd['quad-tour-hurghada-kamelritt'] = `<p>Experience one of the most booked adventures in Hurghada — an action-packed quad safari through the desert, combined with authentic insights into Bedouin culture.</p>
<p>👉 Out of the hotel. Into the real Egypt.</p>
<p>🔥 Why this tour is so popular</p>
<p>✔️ Over 50 km of driving fun through desert & sand dunes</p>
<p>✔️ Perfect for beginners — no experience needed</p>
<p>✔️ Camel ride & Bedouin village included</p>
<p>✔️ Hotel pickup & return transfer — stress-free</p>
<p>✔️ Available daily — limited spaces per group</p>
<p>🏜️ Quad Safari Hurghada — the desert adventure in Egypt</p>
<p>The quad safari in Hurghada is one of the most popular excursions on the Red Sea. Experience the impressive desert landscape of Egypt, ride a quad through sand dunes, and visit a traditional Bedouin village. The combination of adventure, nature, and culture makes this tour a real highlight of your Hurghada vacation.</p>
<p>🚨 Important: This tour is often sold out — early booking is recommended.</p>
<p>🎯 Imagine this for a moment…</p>
<p>You are sitting on your quad.</p>
<p>In front of you: endless desert. No roads. No hotels. Only freedom.</p>
<p>The engine starts.</p>
<p>Dust swirls up.</p>
<p>And suddenly you are right in the middle of the Hurghada adventure.</p>
<p>👉 That is exactly what awaits you.</p>
<p>⭐ What makes this tour better than others</p>
<p>Many providers offer similar tours — but here is the difference:</p>
<p>✔️ Longer riding time instead of short rounds</p>
<p>✔️ Better organization & structured流程</p>
<p>✔️ Experienced guides with a focus on safety</p>
<p>✔️ Optimized for vacationers (no stress, no chaos)</p>
<p>👉 You get exactly what you expect — without surprises.</p>
<p>⚠️ Honest & transparent (hardly anyone else tells you this)</p>
<p>The Bedouin village is designed for tourists</p>
<p>The camel ride is relatively short (approx. 5–10 minutes)</p>
<p>It gets dusty — very dusty</p>
<p>You usually ride in a group, not freely</p>
<p>👉 Nevertheless: This is exactly why most guests have a great time.</p>
<p>👨‍👩‍👧 Who is this tour perfect for?</p>
<p>✔️ Couples & friends</p>
<p>✔️ Adventure-seeking travelers</p>
<p>✔️ First-time visitors to Egypt</p>
<p>✔️ Anyone who wants more than just the beach</p>
<p>❌ Not suitable for:</p>
<p>Pregnant women</p>
<p>Children under 10 years</p>
<p>💡 Insider tips (makes the difference!)</p>
<p>Sunglasses + scarf = essential</p>
<p>Avoid light-colored clothing</p>
<p>Protect your phone (dust!)</p>
<p>Early morning = best temperatures</p>
<p>🌅 Why a quad safari in Hurghada?</p>
<p>Anyone visiting Hurghada should not miss the desert. The combination of quad riding, camel ride, and Bedouin culture makes this tour one of the most popular adventures in Egypt. Especially for travelers who want to experience more than just beach and hotel, this excursion is the perfect choice.</p>`;

// 7  reiten (no table)
dd['reiten-in-hurghada-strand-wueste-pferde-im-meer'] = `<p>Experience a special horseback riding trip along the coast of the Red Sea and through the impressive desert landscape around Hurghada.</p>
<p>Our private tours offer you peace, flexibility, and an experience tailored individually to you.</p>
<p><strong>Why horseback riding in Hurghada on the Red Sea is so special?</strong></p>
<p>Horseback riding in Hurghada is one of the most beautiful experiences on the Red Sea. The unique combination of long sandy beaches, crystal-clear water, and the impressive desert landscape makes this excursion an unforgettable adventure.</p>
<p><strong>Riding horses into the Red Sea — a unique experience!</strong></p>
<p>A special highlight of this trip is the opportunity to ride the horses into the sea. The warm water of the Red Sea and the calm atmosphere create a one-of-a-kind experience.</p>
<p><strong>Suitable for beginners and advanced riders!</strong></p>
<p>This horseback riding trip is suitable for both beginners and experienced riders. Before the start, all participants receive a short briefing.</p>`;

// 8  luxor-tagesausflug (table)
dd['luxor-tagesausflug-ab-hurghada'] = `<p>Discover the fascinating history of Egypt on a comfortable, private day trip from Hurghada to Luxor. Luxor — the former Thebes — was once the center of ancient Egyptian civilization and offers some of the most impressive monuments in the country.</p>
<p>Your day begins early in the morning with a comfortable drive to Luxor. Accompanied by an experienced professional Egyptologist guide, you explore the city's most important sights: the Valley of the Kings with its magnificent tombs, the monumental Karnak Temple, the terraced temple of Queen Hatshepsut, and the famous Colossi of Memnon.</p>
<p>This tour is perfect for history lovers, families, and travelers who want to experience Egypt's cultural heart in just one day.</p>\n\n`
+ `<table class="tour-pricing-table">\n<thead>\n<tr>\n<th><span><strong>Participants</strong></span></th>\n<th><span><strong>Vehicle</strong></span></th>\n<th><span><strong>Price per Person</strong></span></th>\n</tr>\n</thead>\n<tbody>\n`
+ `<tr>\n<td data-label="Participants"><strong>1 Person</strong></td>\n<td data-label="Vehicle"><strong>Private Sedan</strong></td>\n<td data-label="Price "><strong>280 ? p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>2 Persons</strong></span></td>\n<td data-label="Vehicle"><span><strong>Private Sedan</strong></span></td>\n<td data-label="Price "><span><strong>150 € p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>3 – 4 Persons</strong></span></td>\n<td data-label="Vehicle"><span><strong>Private Minibus</strong></span></td>\n<td data-label="Price "><span><strong>135 € p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>5 – 6 Persons</strong></span></td>\n<td data-label="Vehicle"><span><strong>Private Minibus</strong></span></td>\n<td data-label="Price "><span><strong>100 € p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>7 – 8 Persons</strong></span></td>\n<td data-label="Vehicle"><span><strong>Private Minibus</strong></span></td>\n<td data-label="Price "><span><strong>90 € p.P.</strong></span></td>\n</tr>\n`
+ `</tbody>\n</table>`;

// 9  hurghada-shopping (table — kostenlos)
dd['hurghada-shopping-tour-basar-transfer'] = `<p>Welcome to Hurghada Travel Planner — experience Hurghada with a free shopping tour to the traditional bazaar.</p>
<p>We pick you up comfortably from your hotel and take you directly to the Hurghada bazaar. There you have free time for shopping, exploring, and browsing. You will find souvenirs, spices, perfume oils, leather goods, jewelry, papyrus, and handicrafts.</p>
<p>This tour is ideal for guests who want to experience Hurghada outside the hotel and get authentic impressions of local market life. After shopping, we bring you safely back to your hotel.</p>\n\n`
+ `<table class="tour-pricing-table">\n<thead>\n<tr>\n<th><strong>Participants</strong></th>\n<th><strong>Vehicle</strong></th>\n<th><strong>Price per Person</strong></th>\n</tr>\n</thead>\n<tbody>\n`
+ `<tr>\n<td data-label="Participants"><strong>1 Person</strong></td>\n<td data-label="Vehicle"><strong>Private Sedan</strong></td>\n<td data-label="Price "><strong>free</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>2 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Sedan</strong></td>\n<td data-label="Price per Person"><strong>free</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>3 – 4 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Minibus</strong></td>\n<td data-label="Price per Person"><strong>free</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>5 – 6 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Minibus</strong></td>\n<td data-label="Price per Person"><strong>free</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>7 – 8 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Minibus</strong></td>\n<td data-label="Price per Person"><strong>free</strong></td>\n</tr>\n`
+ `</tbody>\n</table>`;

// 10  kairo-mit-flug (minimal table, paragraphs after)
dd['kairo-mit-flug-ab-hurghada-pyramiden-museum'] = `<table class="tour-pricing-table"><thead><tr><th>Participants</th><th>Price per Person</th></tr></thead><tbody><tr><td>1 Person</td><td>350 € p.P.</td></tr><tr><td>2 Persons</td><td>300 € p.P.</td></tr><tr><td>3–8 Persons</td><td>280 € p.P.</td></tr></tbody></table>\n\n`
+ `<p>Experience the Pyramids of Giza, the majestic Sphinx, and the treasures of the Egyptian Museum — all in just one day from Hurghada.</p>\n`
+ `<p>With Hurghada Travel Planner, you travel comfortably, safely, and individually. Look forward to a professional Egyptologist guide, personal service, and exclusive VIP treatment.</p>\n`
+ `<p>💎 Ideal for couples, families, and small groups who want to experience the best of Cairo — without long bus journeys.</p>`;

// 11  orange-bay (no table)
dd['orange-bay-insel-schnorchelausflug-hurghada'] = `<p>The Orange Bay Island snorkeling trip with water sports from Hurghada is one of the most exclusive and most booked day trips on the Red Sea. Orange Bay Island is located in the protected Giftun National Park and is one of the most beautiful natural destinations in Egypt.</p>
<p>Fine white sand, turquoise water, and colorful coral reefs create a unique setting for a perfect vacation day. This trip combines high-quality snorkeling, relaxing hours on a paradise island, and professional water sports activities — accompanied by first-class service, private transfer, and professional guidance.</p>
<p>An ideal experience for travelers who appreciate quality, comfort, safety, and authentic nature experiences.</p>
<p>Orange Bay is known as the "Caribbean of Egypt" and delights visitors with its white sandy beach, crystal-clear water, and a unique underwater world. The trip is ideal for families, couples, groups, and snorkeling beginners.</p>`;

// 12  makadi-water-park (no table)
dd['makadi-water-park-hurghada-mittagessen-transfer'] = `<p>Experience a perfect vacation day at Makadi Water Park (Makadi Water World) — one of the largest and most modern water parks on the Red Sea.</p>
<p>This premium excursion combines action, relaxation, and comfort and is ideal for families, couples, and anyone who loves water fun.</p>
<p>Thanks to hotel pickup, air-conditioned transfer, lunch, drinks, and priority entry with organized access, you can enjoy a stress-free day full of unforgettable moments.</p>
<p>🍽️ Lunch & drinks included</p>
<p>During your stay, enjoy a rich lunch buffet with international dishes.</p>
<p>Soft drinks, coffee, and tea are included in the price.</p>
<p>The park offers numerous restaurants, snack bars, and shaded seating areas.</p>`;

// 13  el-gouna (table)
dd['el-gouna-private-stadtrundfahrt-mit-lagunenfahrt-aussichtsturm'] = `<p>El Gouna is one of the most elegant places on the Red Sea. The modern lagoon city delights with turquoise blue waterways, quiet islands, Mediterranean architecture, and a relaxed atmosphere reminiscent of European harbor towns.</p>
<p>With our private El Gouna city tour, you experience the city entirely individually: no shopping stops, no large groups, but with personal attention and an experienced professional guide. The tour combines an idyllic lagoon cruise, cultural sights, and a visit to the famous observation tower, from which you can enjoy one of the best views in all of El Gouna.</p>\n\n`
+ `<table class="tour-pricing-table">\n<thead>\n<tr>\n<th><strong>Participants</strong></th>\n<th><strong>Vehicle</strong></th>\n<th><strong>Price per Person</strong></th>\n</tr>\n</thead>\n<tbody>\n`
+ `<tr>\n<td data-label="Participants"><strong>1 Person</strong></td>\n<td data-label="Vehicle"><strong>Private Sedan</strong></td>\n<td data-label="Price "><strong>80 ? p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>2 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Sedan</strong></td>\n<td data-label="Price "><strong>50 € p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>3 – 4 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Minibus</strong></td>\n<td data-label="Price "><strong>40 € p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>5 – 6 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Minibus</strong></td>\n<td data-label="Price "><strong>35 € p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>7 – 8 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Minibus</strong></td>\n<td data-label="Price "><strong>30 € p.P.</strong></td>\n</tr>\n`
+ `</tbody>\n</table>`;

// 14  private-speedboot-orange-bay (table)
dd['private-speedboot-tour-orange-bay-hurghada'] = `<p>Experience a private speedboat tour to Orange Bay from Hurghada — ideal for couples, families, or small groups who want to enjoy the Red Sea without mass tourism.</p>
<p>With the private speedboat, you travel quickly and comfortably to the most beautiful snorkeling spots around Orange Bay or Magawish Island. Along the way, you can expect clear water, colorful coral reefs, and with luck, exotic fish, rays, or turtles.</p>
<p>After snorkeling, enjoy relaxing time on the beach or on the boat. Lunch and soft drinks are included. The tour is flexible, private, and perfect for guests seeking an exclusive island trip with personal attention.</p>\n\n`
+ `<table class="tour-pricing-table">\n<thead>\n<tr>\n<th><span><strong>Participants</strong></span></th>\n<th>Boat</th>\n<th><span><strong>Price per Person</strong></span></th>\n</tr>\n</thead>\n<tbody>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>1 Person</strong></span></td>\n<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>\n<td data-label="Price "><span><strong>220 € p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>2 Persons</strong></span></td>\n<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>\n<td data-label="Price "><span><strong>115&nbsp; € p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>3 Persons</strong></span></td>\n<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>\n<td data-label="Price "><span><strong>90&nbsp; € p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>4 Persons</strong></span></td>\n<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>\n<td data-label="Price "><span><strong>75&nbsp; € p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>5 Persons</strong></span></td>\n<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>\n<td data-label="Price "><span><strong>65&nbsp; € p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>6 Persons</strong></span></td>\n<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>\n<td data-label="Price "><span><strong>60&nbsp; € p.P.</strong></span></td>\n</tr>\n`
+ `</tbody>\n</table>`;

// 15  dendera-abydos (table)
dd['privater-tagesausflug-ab-hurghada-dendera-abydos-tempel'] = `<p>An unforgettable day in the heart of ancient Egypt</p>
<p>Experience the magic of ancient Egypt on an exclusive private tour from Hurghada Travel Planner.</p>
<p>This private day trip to Dendera and Abydos takes you to two of the most impressive temple sites in Egypt — places where history, myth, and beauty are forever carved in stone.</p>
<p>Accompanied by an experienced professional Egyptologist guide, you travel along the Nile Valley and discover sanctuaries that few visitors ever see.</p>
<p>🌸 Temple of Dendera — The Realm of the Goddess Hathor</p>
<p>Your first stop is the beautiful Temple of Hathor in Dendera — a masterpiece of Egyptian art and a symbol of love, music, and joy.</p>
<p>Here you can expect:</p>
<p>💠 Colorful column halls whose original colors are preserved to this day</p>
<p>💠 The Mamisi (Birth House of the Gods) — a symbol of creation and life</p>
<p>💠 The Sanatorium, where divine healings took place</p>
<p>💠 The Sacred Lake, a place of ritual purification</p>
<p>💠 The only preserved depiction of the legendary Cleopatra VII</p>
<p>Your guide explains the mysterious astronomical reliefs on the ceiling — a testament to ancient knowledge of the stars.</p>
<p>✨ Dendera is one of the most colorful temples in Egypt — a place that brings history to life.</p>
<p>🌙 Temple of Abydos — The Sanctuary of Osiris</p>
<p>After a scenic drive along the Nile Valley, you reach Abydos, one of the holiest cities of ancient Egypt.</p>
<p>Here, people worshipped the god Osiris, the ruler of death and rebirth.</p>
<p>You visit the temple of Pharaoh Seti I, which is considered one of the artistically most beautiful temples in Egypt.</p>
<p>Highlights in Abydos:</p>
<p>🔹 The famous King List of Abydos with the names of important pharaohs</p>
<p>🔹 Precisely crafted hieroglyphs and reliefs in near-perfect condition</p>
<p>🔹 Scenes of the Horus myth — the eternal struggle between good and evil</p>
<p>🔹 Reliefs of Ramesses II with his son offering and hunting</p>
<p>🕊️ Abydos is not just an ordinary temple — it is a spiritual place where the soul of Egypt lives on.</p>
<p>💼 Travel tips for your trip</p>
<p>✔️ Copy of passport or ID card required (permit from authorities)</p>
<p>✔️ Order a breakfast package at the hotel reception the evening before</p>
<p>✔️ Wear comfortable shoes & weather-appropriate clothing</p>
<p>✔️ Don't forget sunscreen, sunglasses & hat</p>
<p>✔️ Camera or phone for unforgettable moments</p>
<p>✔️ Some small change for tips and restrooms</p>\n\n`
+ `<table class="tour-pricing-table">\n<thead>\n<tr>\n<th><strong>Participants</strong></th>\n<th><strong>Vehicle</strong></th>\n<th><strong>Price per Person</strong></th>\n</tr>\n</thead>\n<tbody>\n`
+ `<tr>\n<td data-label="Participants"><strong>1 Person</strong></td>\n<td data-label="Vehicle"><strong>Private Sedan</strong></td>\n<td data-label="Price "><strong>250 ? p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>2 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Sedan</strong></td>\n<td data-label="Price "><strong>140 € p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>3 – 4 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Minibus</strong></td>\n<td data-label="Price "><strong>130 € p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>5 – 6 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Minibus</strong></td>\n<td data-label="Price "><strong>120 € p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>7 – 8 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Minibus</strong></td>\n<td data-label="Price "><strong>110 € p.P.</strong></td>\n</tr>\n`
+ `</tbody>\n</table>`;

// 16  grand-aquarium (no table)
dd['eintrittskarte-zum-hurghada-grand-aquarium'] = `<p>Experience the Hurghada Grand Aquarium, the largest and most modern aquarium in Egypt on the Red Sea. A highlight for families, couples, and adventure seekers, offering fascinating insights into the underwater world — from colorful reef fish to majestic sharks.</p>
<p>Dive into over 24 themed galleries, walk through the 24-meter-long underwater tunnel, and discover over 1,000 animal species from around the world.</p>
<p>Why you should visit the Hurghada Grand Aquarium</p>
<p>The aquarium combines nature, adventure, and education in one. It is one of the most popular attractions in Hurghada and ideal for a family-friendly outing.</p>
<p>Accessibility & services</p>
<p>♿ Wheelchair accessible & stroller friendly</p>
<p>🐾 Assistance dogs allowed upon request</p>
<p>🚌 Good connection to public transport</p>
<p>Tips for a perfect visit:</p>
<p>🎟️ Book tickets online to avoid waiting times</p>
<p>📸 Bring your camera — unforgettable photo opportunities guaranteed</p>
<p>👨‍👩‍👧 Plan for family-friendly zones</p>
<p>⏰ Arrive early to experience all attractions stress-free</p>
<p>Get your tickets now</p>
<p>Don't miss the highlight on the Red Sea — an unforgettable experience for young and old!</p>`;

// 17  super-safari (no table)
dd['super-safari-hurghada'] = `<p>The Super Safari Hurghada is one of the most popular and varied desert excursions in Egypt. This tour combines adventure, nature, and culture into an unforgettable experience in the fascinating landscape of the Sahara.</p>
<p>During the tour, you experience several highlights in one day. Look forward to an exciting quad ride through the desert, a thrilling spider buggy ride, a jeep safari through impressive sand landscapes, and a traditional camel ride. You will also visit an authentic Bedouin village and gain interesting insights into Bedouin life.</p>
<p>The vast sand dunes, the impressive silence of the desert, and the spectacular views make this safari a special experience for visitors of all ages. Along the way, enjoy the unique atmosphere of the Egyptian Sahara and discover places that are hardly accessible with regular vehicles.</p>
<p>In the evening, a traditional BBQ dinner awaits you in a Bedouin village. While enjoying oriental specialties, you can experience an entertaining folklore show with music and traditional dances under the desert starry sky.</p>
<p>🌅 Why the Super Safari is so popular</p>
<p>The Super Safari Hurghada is one of the most booked excursions in Hurghada because it combines multiple experiences in a single tour. Instead of just quad biking, you also experience a jeep safari, a spider buggy ride, a camel ride, a visit to a Bedouin village, and a BBQ dinner with an oriental show.</p>
<p>The combination of adventure, culture, nature, and entertainment makes this tour an ideal choice for travelers who want to experience as much of the Egyptian desert as possible.</p>
<p>The Super Safari Hurghada is especially suitable for couples, families, and adventure seekers who want to discover the most beautiful aspects of the Sahara in one day.</p>`;

// 18  mini-egypt (no table)
dd['mini-egypt-park-hurghada'] = `<p>✨ Experience all of Egypt in one day — with Hurghada Travel Planner</p>
<p>Imagine walking through Egypt — from the majestic Pyramids of Giza to the legendary Temple of Abu Simbel — all in one place.</p>
<p>At Mini Egypt Park Hurghada, this dream becomes reality. Here, Egypt's history comes to life in over 55 masterful miniature models — so detailed that you feel as if you are traveling through millennia.</p>
<p>Whether as a family outing, a romantic experience for two, or a cultural discovery tour — this excursion is an unforgettable highlight of your vacation on the Red Sea.</p>`;

// 19  privater-kairo (table)
dd['privater-tagesausflug-von-hurghada-nach-kairo-pyramiden-grand-egyptian-museum'] = `<p>An extraordinary day begins</p>
<p>Before sunrise, your personal adventure starts. Your private driver picks you up directly from your hotel in Hurghada.</p>
<p>In a comfortable, air-conditioned vehicle, you travel through the silence of the desert towards Cairo — comfortably, safely, and individually.</p>
<p>Complimentary drinks refresh you during the journey as you look forward to the fascinating capital of Egypt.</p>\n\n`
+ `<table class="tour-pricing-table">\n<thead>\n<tr>\n<th><strong>Participants</strong></th>\n<th><strong>Vehicle</strong></th>\n<th><strong>Price per Person</strong></th>\n</tr>\n</thead>\n<tbody>\n`
+ `<tr>\n<td data-label="Participants"><strong>2 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Sedan</strong></td>\n<td data-label="Price "><strong>175 € p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>3 – 4 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Minibus</strong></td>\n<td data-label="Price "><strong>155 € p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>5 – 6 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Minibus</strong></td>\n<td data-label="Price "><strong>135 € p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>7 – 8 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Minibus</strong></td>\n<td data-label="Price "><strong>115 € p.P.</strong></td>\n</tr>\n`
+ `</tbody>\n</table>`;

// 20  dendera-halbtag (table)
dd['dendera-halbtagesausflug-ab-hurghada-der-authentische-besuch-im-hathor-tempel'] = `<p>Discover the impressive Temple of Dendera, one of the best-preserved sanctuaries in Egypt. The Temple of the Goddess Hathor fascinates with intensely colored reliefs, extraordinary architecture, and unique astronomical depictions. This half-day excursion takes you away from mass tourism to one of the most important cultural monuments of Upper Egypt — exclusively accompanied by a professional Egyptologist guide. Unlike crowded group tours, you experience Dendera in a relaxed atmosphere with ample time for photos and individual questions.</p>
<p>Why the Temple of Dendera is an essential destination</p>
<p>The temple complex lies about 60 kilometers north of Luxor and dates from the Ptolemaic-Roman period. Thanks to its excellent preservation, it is considered one of the most significant testimonies of ancient Egyptian art and science.</p>\n\n`
+ `<table class="tour-pricing-table">\n<thead>\n<tr>\n<th><strong>Participants</strong></th>\n<th><strong>Vehicle</strong></th>\n<th><strong>Price per Person</strong></th>\n</tr>\n</thead>\n<tbody>\n`
+ `<tr>\n<td data-label="Participants"><strong>1 Person</strong></td>\n<td data-label="Vehicle"><strong>Private Sedan</strong></td>\n<td data-label="Price "><strong>220 ? p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>2 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Sedan</strong></td>\n<td data-label="Price "><strong>120 € p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>3 – 4 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Minibus</strong></td>\n<td data-label="Price "><strong>110 € p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>5 – 6 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Minibus</strong></td>\n<td data-label="Price "><strong>100 € p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>7 – 8 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Minibus</strong></td>\n<td data-label="Price "><strong>90 € p.P.</strong></td>\n</tr>\n`
+ `</tbody>\n</table>`;

// 21  2-tages-kairo (table)
dd['2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben'] = `<table class="tour-pricing-table"><thead><tr><th>Participants</th><th>Vehicle</th><th>Price per Person</th></tr></thead><tbody><tr><td>2 Persons</td><td>Private Sedan</td><td>350 € p.P.</td></tr><tr><td>3 – 4 Persons</td><td>Private Minibus</td><td>335 € p.P.</td></tr><tr><td>5 – 6 Persons</td><td>Private Minibus</td><td>300 € p.P.</td></tr><tr><td>7 – 8 Persons</td><td>Private Minibus</td><td>280 € p.P.</td></tr></tbody></table>\n`
+ `<p>Experience an unforgettable 2-day trip from Hurghada to Cairo and immerse yourself in the fascinating history of ancient Egypt. Visit the famous Pyramids of Giza, the Great Sphinx, the Egyptian Museum with its countless treasures, and the vibrant old town of Cairo. This excursion offers the perfect combination of history, culture, and adventure. On the first day, you depart early in the morning from Hurghada and arrive in Cairo after approximately 5 hours. There you first visit the Pyramids of Giza and the Great Sphinx. Then you proceed to your hotel where you spend the night. On the second day, you visit the Egyptian Museum, the old town of Khan el-Khalili, and the Alabaster Mosque. After lunch, you travel back to Hurghada.</p>`;

// 22  privater-speedboot (table)
dd['privater-speedboot-ausflug-in-hurghada-schnorcheln-an-korallenriffen-sonnenuntergang'] = `<p>Private Speedboat Tour on the Red Sea</p>
<p>This private speedboat excursion in Hurghada offers you the opportunity to experience the Red Sea individually and without mass tourism. The tour is ideal for families, couples, and small groups who value privacy, flexibility, and personal attention.</p>
<p>In the afternoon, you are picked up directly from your hotel in Hurghada and taken to the harbor. There, your private speedboat awaits you, taking you to selected snorkeling spots and quiet coastal sections.</p>\n\n`
+ `<table class="tour-pricing-table">\n<thead>\n<tr>\n<th><span><strong>Participants</strong></span></th>\n<th>Boat</th>\n<th>Price per Person</th>\n</tr>\n</thead>\n<tbody>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>1 Person</strong></span></td>\n<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>\n<td data-label="Price "><span><strong>150 € p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>2 Persons</strong></span></td>\n<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>\n<td data-label="Price "><span><strong>80&nbsp; € p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>3 Persons</strong></span></td>\n<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>\n<td data-label="Price "><span><strong>70&nbsp; € p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>4 Persons</strong></span></td>\n<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>\n<td data-label="Price "><span><strong>60&nbsp; € p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>5 Persons</strong></span></td>\n<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>\n<td data-label="Price "><span><strong>55&nbsp; € p.P.</strong></span></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><span><strong>6 Persons</strong></span></td>\n<td data-label="Boat"><span><strong>Private Speedboat</strong></span></td>\n<td data-label="Price "><span><strong>50&nbsp; € p.P.</strong></span></td>\n</tr>\n`
+ `</tbody>\n</table>`;

// 23  eden-island (no table)
dd['eden-island-schnorchelausflug-hurghada'] = `<p>Discover the dreamlike Eden Island on an unforgettable snorkeling trip from Hurghada. Look forward to crystal-clear water, colorful coral reefs, and a relaxing day on the island's beautiful sandy beach.</p>
<p>After hotel pickup, you travel to the harbor and set off by boat towards Eden Island. Along the way, you visit popular snorkeling areas in the Red Sea where you can experience the fascinating underwater world with colorful fish and impressive coral formations.</p>
<p>Upon arrival at Eden Island, enjoy free time for swimming, sunbathing, and relaxation. The turquoise water and idyllic atmosphere make the island one of the most popular excursion destinations in Hurghada.</p>
<p>Lunch is included during the excursion. The trip is ideal for couples, families, friends, and anyone who wants to spend a relaxing day on the Red Sea.</p>
<p>Why this trip is so popular:</p>
<p>✓ Snorkeling at colorful coral reefs</p>
<p>✓ Time on the beautiful Eden Island</p>
<p>✓ Crystal-clear water and fine sandy beach</p>
<p>✓ Hotel transfer included</p>
<p>✓ Lunch during the excursion</p>
<p>✓ Suitable for beginners and experienced snorkelers</p>`;

// 24  naechtliche-stadtrundfahrt (table)
dd['naechtliche-stadtrundfahrt-durch-hurghada-private-tour'] = `<p>Experience Hurghada in its most beautiful light: at night. As the heat of the day fades, the city unfolds its unique evening rhythm. The illuminated marina, traditional markets, the Great Mosque, and a visit to an Egyptian café make this exclusive tour an intensive insight into the real Hurghada.</p>
<p>With Hurghada Travel Planner, you enjoy a private, guided city tour that combines authentic impressions with comfortable convenience.</p>
<p>Why a nighttime city tour through Hurghada?</p>
<p>When the sun sets and the sky turns reddish hues, Hurghada shows its most atmospheric side. The marina glows, the markets come alive, and the city breathes. It is precisely at this time that we guide you through the mysterious evening atmosphere — no crowds, relaxed and personal.</p>\n\n`
+ `<table class="tour-pricing-table">\n<thead>\n<tr>\n<th><strong>Participants</strong></th>\n<th><strong>Vehicle</strong></th>\n<th><strong>Price per Person</strong></th>\n</tr>\n</thead>\n<tbody>\n`
+ `<tr>\n<td data-label="Participants"><strong>1 Person</strong></td>\n<td data-label="Vehicle"><strong>Private Sedan</strong></td>\n<td data-label="Price "><strong>40 ? p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>2 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Sedan</strong></td>\n<td data-label="Price "><strong>30 € p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>3 – 4 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Minibus</strong></td>\n<td data-label="Price "><strong>25 € p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>5 – 6 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Minibus</strong></td>\n<td data-label="Price "><strong>20 € p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>7 – 8 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Minibus</strong></td>\n<td data-label="Price "><strong>15 € p.P.</strong></td>\n</tr>\n`
+ `</tbody>\n</table>`;

// 25  privater-pyramiden (table)
dd['privater-pyramiden-ausflug-ab-hurghada-sakkara-dahschur-gizeh'] = `<p>Discover the most important pyramids of Egypt on a private, perfectly organized day tour from Hurghada. This exclusive excursion takes you to Saqqara, Dahshur, and Giza. You travel without time pressure, without shopping stops, and with maximum comfort. You will be accompanied by an experienced professional Egyptologist guide who will convey the history to you precisely, understandably, and vividly.</p>
<p>Ideal for discerning guests who want to experience Cairo individually.</p>\n\n`
+ `<table class="tour-pricing-table">\n<thead>\n<tr>\n<th><strong>Participants</strong></th>\n<th><strong>Vehicle</strong></th>\n<th><strong>Price per Person</strong></th>\n</tr>\n</thead>\n<tbody>\n`
+ `<tr>\n<td data-label="Participants"><strong>1 Person</strong></td>\n<td data-label="Vehicle"><strong>Private Sedan</strong></td>\n<td data-label="Price "><strong>300 ? p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>2 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Sedan</strong></td>\n<td data-label="Price "><strong>160 € p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>3 – 4 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Minibus</strong></td>\n<td data-label="Price "><strong>140 € p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>5 – 6 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Minibus</strong></td>\n<td data-label="Price "><strong>110 € p.P.</strong></td>\n</tr>\n`
+ `<tr>\n<td data-label="Participants"><strong>7 – 8 Persons</strong></td>\n<td data-label="Vehicle"><strong>Private Minibus</strong></td>\n<td data-label="Price "><strong>100 € p.P.</strong></td>\n</tr>\n`
+ `</tbody>\n</table>`;

// 26  hula-hula (no table)
dd['hula-hula-insel-schnorchelausflug-hurghada'] = `<p>Immerse yourself in an unforgettable experience: A boat glides gently over the Red Sea, the sun reflects on the waves, and before you opens a paradise — Hula Hula Island. White sandy beaches, crystal-clear water, colorful coral reefs, and exotic fish await to be discovered.</p>
<p>This day trip from Hurghada perfectly combines adventure, relaxation, and nature — ideal for families, couples, and anyone who wants to experience the beauty of the Red Sea up close.</p>
<p>✨ Why you should book this excursion</p>
<p>Hula Hula Island is one of the most beautiful destinations for snorkeling and diving trips in the Red Sea near Hurghada. Here, nature, adventure, and relaxation combine in a unique way:</p>
<p>Discover the colorful underwater world with exotic fish and coral reefs</p>
<p>Relax on the dreamlike beaches of the island</p>
<p>Experience unforgettable moments swimming, snorkeling, or diving</p>
<p>Enjoy the Egyptian sun, crystal-clear water, and breathtaking landscape</p>
<p>Hula Hula Island is ideal for guests who want to experience a relaxed snorkeling trip from Hurghada with island time, clear water, and comfortable boat transfer.</p>`;

(async () => {
  const { data: tours } = await db.from('tours').select('id, slug, short_description, description');
  const { data: cts } = await db.from('content_translations').select('id, row_id').eq('table_name','tours').eq('locale','en');

  let ok = 0, fail = 0, skp = 0;
  for (const tour of tours) {
    const slug = tour.slug;
    const newShort = sd[slug];
    const newDesc = dd[slug];
    if (!newShort && !newDesc) { skp++; continue; }

    const ct = cts.find(c => c.row_id === tour.id);
    if (!ct) { console.log('NO CT ROW for', slug.substring(0,45)); fail++; continue; }

    const updates = {};
    if (newShort) updates.short_description = newShort;
    if (newDesc) updates.description = newDesc;

    const { error } = await db.from('content_translations').update(updates).eq('id', ct.id);
    if (error) { console.log('FAIL', slug.substring(0,45), error.message); fail++; }
    else { console.log('OK  ', slug.substring(0,45)); ok++; }
  }
  console.log(`\nDone: ${ok} updated, ${fail} failed, ${skp} skipped`);
})();
