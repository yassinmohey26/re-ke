require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient}=require('@supabase/supabase-js');
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

(async()=>{
  // Fix 1: EN translation for bc3112c6 (main blog) - was German, needs English
  await sb.from('content_translations').upsert({
    table_name: 'blog_posts',
    row_id: 'bc3112c6-a2e1-4475-997b-39e2a77e228e',
    locale: 'en',
    name: 'Best Excursions in Hurghada 2025 – Top Highlights, Insider Tips & Unforgettable Red Sea Experiences',
    title: 'Best Excursions in Hurghada 2025 – Top Highlights, Insider Tips & Unforgettable Red Sea Experiences',
    excerpt: 'Your complete guide to the best excursions in Hurghada 2025: pyramid visits, snorkeling, desert safaris, and everything you need for the perfect Red Sea trip.',
    content: '<h2>Best Excursions in Hurghada 2025</h2><p>Hurghada is one of the most popular tourist destinations in Egypt and the Middle East, offering a unique mix of history, nature, and adventure. Here is your complete guide to the best excursions available in 2025.</p><h3>1. Pyramids of Giza Excursion</h3><p>A day trip to the Pyramids of Giza near Cairo, including visits to the three great pyramids, the Sphinx, and the Egyptian Museum. Perfect for history and culture enthusiasts.</p><h3>2. Snorkeling Excursion – Red Sea</h3><p>Explore the colorful coral reefs, tropical fish, and dolphins in an unforgettable underwater world. The excursion includes complete snorkeling equipment and a professional guide.</p><h3>3. Desert Quad Safari</h3><p>An exciting adventure through the golden sand dunes of the Hurghada desert, including quad riding, a visit to a Bedouin village, traditional tea, and a spectacular sunset.</p><h3>4. Giftun Island Snorkeling Trip</h3><p>A day trip to Giftun Island in the Red Sea, one of the world\'s most famous snorkeling destinations. Diverse coral reefs, colorful fish, and crystal-clear turquoise waters.</p><h3>Important Tips</h3><ul><li>Best time to visit: October to April</li><li>Wear comfortable clothing and closed shoes</li><li>Bring sunscreen, sunglasses, and a waterproof camera</li></ul><p>Book your excursion now and enjoy the best experience in Hurghada!</p>'
  }, {onConflict: 'table_name,row_id,locale'});
  console.log('EN bc3112c6 updated');

  // Fix 2: HU translation for bc3112c6 - was German, needs Hungarian
  await sb.from('content_translations').upsert({
    table_name: 'blog_posts',
    row_id: 'bc3112c6-a2e1-4475-997b-39e2a77e228e',
    locale: 'hu',
    name: 'Hurghada legjobb kirándulásai 2025 – Kihagyhatatlan látnivalók, bennfentes tippek és felejthetetlen Vörös-tengeri élmények',
    title: 'Hurghada legjobb kirándulásai 2025 – Kihagyhatatlan látnivalók, bennfentes tippek és felejthetetlen Vörös-tengeri élmények',
    excerpt: 'Útmutató Hurghada legjobb kirándulásaihoz 2025-ben: piramistúrák, sznorkelezés, sivatagi szafari és minden, amire szüksége van a tökéletes Vörös-tengeri nyaraláshoz.',
    content: '<h2>Hurghada legjobb kirándulásai 2025</h2><p>Hurghada Egyiptom és a Közel-Kelet egyik legnépszerűbb turisztikai célpontja, amely egyedülálló keverékét kínálja a történelemnek, a természetnek és a kalandnak. Íme teljes útmutatónk a 2025-ben elérhető legjobb kirándulásokról.</p><h3>1. Gízai piramisok kirándulás</h3><p>Egynapos kirándulás a gízai piramisokhoz Kairó közelében, beleértve a három nagy piramis, a Szfinx és az Egyiptomi Múzeum megtekintését. Ideális a történelem és a kultúra rajongóinak.</p><h3>2. Sznorkelezés – Vörös-tenger</h3><p>Fedezze fel a színes korallzátonyokat, trópusi halakat és delfineket egy felejthetetlen víz alatti világban. A kirándulás tartalmazza a teljes sznorkelező felszerelést és a professzionális idegenvezetőt.</p><h3>3. Sivatagi quad szafari</h3><p>Izgalmas kaland Hurghada aranyhomokos dűnéi között, quadozással, beduin falu látogatással, hagyományos teával és lélegzetelállító naplementével.</p><h3>4. Giftun-sziget sznorkelezés</h3><p>Egynapos kirándulás a Giftun-szigetre a Vörös-tengeren, a világ egyik leghíresebb sznorkelező helyszínére. Sokszínű korallzátonyok, trópusi halak és kristálytiszta, türkizkék vizek.</p><h3>Fontos tippek</h3><ul><li>Legjobb látogatási idő: október április</li><li>Kényelmes ruhát és zárt cipőt viseljen</li><li>Napvédő krém, napszemüveg és vízálló kamera ajánlott</li></ul><p>Foglalja le kirándulását most, és élvezze a legjobb élményt Hurghadában!</p>'
  }, {onConflict: 'table_name,row_id,locale'});
  console.log('HU bc3112c6 updated');

  // Fix 3: AR translation for 9e076f56 (Quad Safari) - was German, needs Arabic
  await sb.from('content_translations').upsert({
    table_name: 'blog_posts',
    row_id: '9e076f56-ac05-46a5-8355-2b1aafc9c8a1',
    locale: 'ar',
    name: 'سفاري كواد بالغردقة 2025 – المغامرة الصحرائية المطلقة في مصر',
    title: 'سفاري كواد بالغردقة 2025 – المغامرة الصحرائية المطلقة في مصر',
    excerpt: 'مغامرة سفاري بالكواد في صحراء الغردقة – قيادة مثيرة، قرية بدائية، شاي مصري، وغروب شمس خلاب.',
    content: '<h2>سفاري كواد بالغردقة 2025 – المغامرة المطلقة في الصحراء</h2><p>انطلق في مغامرة مثيرة بسيارة كواد عبر صحراء الغردقة المذهلة. تجربة مشتمة تشمل قيادة الكواد على الكثبان الرملية الذهبية وزيارة قرية بدائية تقليدية.</p><h3>البرنامج (3 ساعات)</h3><ul><li>09:00 – استلام المعدات وتعليمات السلامة بالغردقة</li><li>09:30 – الانطلاق بالكواد عبر الكثبان الذهبية</li><li>10:30 – زيارة قرية بدائية – شاي بدائي أصيل والتواصل مع البدو</li><li>11:00 – الاستمتاع بغروب الشمس الخلاب في الصحراء</li><li>12:00 – العودة إلى الغردقة</li></ul><h3>مشمول</h3><ul><li>إيجار كواد حديث (3 ساعات)</li><li>خوذة ومعدات السلامة</li><li>مرشد سفاري خبير</li><li>شاي بدائي تقليدي</li><li>انتقال ذهاب وعودة من الفندق</li></ul><h3>معلومات مهمة</h3><ul><li>لا حاجة لرخصة قيادة</li><li>مناسب للمبتدرين والأطفال من 6 سنوات (كراكب)</li><li>ملابس مريحة، أحذية مغلقة، نظارات شمسية، كريم واقٍ من الشمس</li></ul>'
  }, {onConflict: 'table_name,row_id,locale'});
  console.log('AR 9e076f56 updated');

  // Fix 4: Fix Quad Safari date from 1970-01-01 to proper date
  await sb.from('blog_posts').update({ date: '2025-04-22' }).eq('id', '9e076f56-ac05-46a5-8355-2b1aafc9c8a1');
  console.log('Quad Safari date fixed');
})();