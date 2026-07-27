require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient}=require('@supabase/supabase-js');
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const faqs = {
  en: [
    {sort_order:1, question:'Which payment methods do you accept?', answer:'We accept credit cards (Visa, MasterCard), PayPal, and bank transfer. Cash payment is possible on site.'},
    {sort_order:2, question:'Free cancellation possible?', answer:'Yes, you can cancel free of charge up to 48 hours before the tour starts.'},
    {sort_order:3, question:'How do I book a tour?', answer:'Select your tour, choose date and number of participants, and click "Book Now". You will receive a confirmation by email.'},
    {sort_order:4, question:'Can I book multiple tours in one day?', answer:'Yes, as long as the times don\'t overlap. Half-day tours combine well.'},
    {sort_order:5, question:'Are there child discounts?', answer:'Yes, children aged 3 to 10 get a 50% discount. Infants aged 0 to 2 travel free.'},
    {sort_order:6, question:'Is hotel pick-up included?', answer:'Yes, all tours include pick-up and drop-off at your hotel in Hurghada.'},
    {sort_order:7, question:'What should I bring?', answer:'Sunscreen, hat, comfortable shoes, camera, water and a small amount of cash for tips.'},
    {sort_order:8, question:'Is there catering on the tours?', answer:'Full-day tours usually include lunch. Half-day tours include snacks and drinks.'},
    {sort_order:9, question:'What are the weather conditions?', answer:'Hurghada has warm weather year-round. Best travel time is March to May and October to November.'},
    {sort_order:10, question:'Is Hurghada safe for tourists?', answer:'Yes, Hurghada is one of the safest tourist regions in Egypt. There is a strong police presence.'},
    {sort_order:11, question:'Can I visit multiple destinations?', answer:'Yes, we offer combo tours that visit multiple destinations in one day.'},
    {sort_order:12, question:'Which languages do your guides speak?', answer:'German, English, Arabic and often also Russian and Italian.'},
  ],
  fr: [
    {sort_order:1, question:'Quels modes de paiement acceptez-vous?', answer:'Nous acceptons les cartes de crédit (Visa, MasterCard), PayPal et les virements bancaires. Le paiement en espèces est possible sur place.'},
    {sort_order:2, question:'Annulation gratuite possible?', answer:'Oui, vous pouvez annuler gratuitement jusqu\'à 48 heures avant le début de la visite.'},
    {sort_order:3, question:'Comment réserver une visite?', answer:'Choisissez votre visite, sélectionnez la date et le nombre de participants, puis cliquez sur "Réserver maintenant". Vous recevrez une confirmation par email.'},
    {sort_order:4, question:'Puis-je réserver plusieurs visites par jour?', answer:'Oui, tant que les horaires ne se chevauchent pas. Les demi-journées se combinent bien.'},
    {sort_order:5, question:'Y a-t-il des réductions pour les enfants?', answer:'Oui, les enfants de 3 à 10 ans bénéficient d\'une réduction de 50%. Les bébés de 0 à 2 ans voyagent gratuitement.'},
    {sort_order:6, question:'Le service de prise en charge à l\'hôtel est-il inclus?', answer:'Oui, toutes les visites incluent la prise en charge et le retour à votre hôtel à Hurghada.'},
    {sort_order:7, question:'Que dois-je apporter?', answer:'Crème solaire, chapeau, chaussures confortables, appareil photo, eau et une petite somme pour les pourboires.'},
    {sort_order:8, question:'Y a-t-il de la restauration pendant les visites?', answer:'Pour les visites d\'une journée complète, le déjeuner est généralement inclus. Pour les demi-journées, il y a des collations et des boissons.'},
    {sort_order:9, question:'Quelles sont les conditions météorologiques?', answer:'Hurghada a un temps chaud toute l\'année. La meilleure période de voyage est de mars à mai et d\'octobre à novembre.'},
    {sort_order:10, question:'Hurghada est-elle sûre pour les touristes?', answer:'Oui, Hurghada est l\'une des régions touristiques les plus sûres d\'Égypte. Il y a une forte présence policière.'},
    {sort_order:11, question:'Puis-je visiter plusieurs destinations?', answer:'Oui, nous proposons des visites combinées qui couvrent plusieurs destinations en une journée.'},
    {sort_order:12, question:'Quelles langues parlent vos guides?', answer:'Allemand, anglais, arabe et souvent aussi russe et italien.'},
  ],
  hu: [
    {sort_order:1, question:'Milyen fizetési módszereket fogadnak el?', answer:'Bankkártyát (Visa, MasterCard), PayPal és banki átutalást fogadunk el. Készpénzfizetés is lehetséges helyben.'},
    {sort_order:2, question:'Lehetséges az ingyenes lemondás?', answer:'Igen, a túra indítása előtt 48 óráig ingyenesen lemondható.'},
    {sort_order:3, question:'Hogyan foglalhatok turát?', answer:'Válassza ki a turát, az dátumot és a résztvevők számát, majd kattintson a "Most foglalok" gombra. E-mailben kap megerősítést.'},
    {sort_order:4, question:'Foglalhatok több turát egy napon?', answer:'Igen, amíg az időpontok nem fedik egymást. Félnapi túrak jól kombinálhatók.'},
    {sort_order:5, question:'Vannak gyermek kedvezmények?', answer:'Igen, 3-10 éves gyerekeknek 50% kedvezmény. 0-2 éves csecsemők ingyen utaznak.'},
    {sort_order:6, question:'A hotel átvitel benne van?', answer:'Igen, minden túra tartalmazza a hotelből való átvitelét és visszavitelét Hurghadában.'},
    {sort_order:7, question:'Mit vigyek magammal?', answer:'Napvédő krém, sapka, kényelmes cipő, kamera, víz és kis pénz a borravalóhoz.'},
    {sort_order:8, question:'Van étkezés a túrán?', answer:'Nappali túránál általában a reggeli inkluzív. Félnapi túránál kenyérlik és ital.'},
    {sort_order:9, question:'Milyen az időjárás?', answer:'Hurghadában egész évben meleg az idő. A legjobb utazási idő március-május és október-november.'},
    {sort_order:10, question:'Biztonságos-e Hurghada a turistáknak?', answer:'Igen, Hurghada az egyik legbiztonságosabb turist régió Egyiptomban. Erős rendőrségi jelenlét van.'},
    {sort_order:11, question:'Látogathatok több célállomást?', answer:'Igen, kínálunk kombi túrákat, amelyek több helyszínt fedenek le egy napon.'},
    {sort_order:12, question:'Milyen nyelveken beszélnek a gイドek?', answer:'Német, angol, arab és gyakran orosz és olasz is.'},
  ],
};

(async()=>{
  for(const [locale, faqList] of Object.entries(faqs)){
    for(const faq of faqList){
      const {data: existing} = await sb.from('faqs').select('id').eq('locale',locale).eq('sort_order',faq.sort_order).limit(1);
      if(existing && existing.length > 0){
        await sb.from('faqs').update({question:faq.question, answer:faq.answer}).eq('locale',locale).eq('sort_order',faq.sort_order);
        console.log(`${locale} FAQ ${faq.sort_order} updated`);
      }else{
        await sb.from('faqs').insert({locale, sort_order:faq.sort_order, question:faq.question, answer:faq.answer});
        console.log(`${locale} FAQ ${faq.sort_order} inserted`);
      }
    }
  }
  console.log('Done');
})();