require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient}=require('@supabase/supabase-js');
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const updates = {
  de: 'Ja, für Kinder von 3 bis 10 Jahren gibt es 50% Rabatt. Babys von 0 bis 2 Jahren reisen kostenlos.',
  ru: 'Да, для детей от 3 до 10 лет — скидка 50%. Дети от 0 до 2 лет ездят бесплатно.',
  ar: 'نعم، للأطفال من 3 إلى 10 سنوات خصم 50%. الرضع من 0 إلى سنتين مجاناً.',
  en: 'Yes, children aged 3 to 10 get a 50% discount. Infants aged 0 to 2 travel free.',
  fr: 'Oui, les enfants de 3 à 10 ans bénéficient d\'une réduction de 50%. Les bébés de 0 à 2 ans voyagent gratuitement.',
  hu: 'Igen, 3-10 éves gyerekeknek 50% kedvezmény. 0-2 éves csecsemők ingyen utaznak.'
};

(async()=>{
  for(const [locale, answer] of Object.entries(updates)){
    // First check if exists
    const {data: existing} = await sb.from('faqs').select('id').eq('locale',locale).eq('sort_order',5).limit(1);
    if(existing && existing.length > 0){
      const {error}=await sb.from('faqs').update({answer}).eq('locale',locale).eq('sort_order',5);
      if(error) console.log(locale, 'update error:', error.message);
      else console.log(locale, 'updated');
    }else{
      const {error}=await sb.from('faqs').insert({locale, sort_order:5, question: '', answer});
      if(error) console.log(locale, 'insert error:', error.message);
      else console.log(locale, 'inserted');
    }
  }
})();