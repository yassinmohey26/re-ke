require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient}=require('@supabase/supabase-js');
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const updates = {
  de: 'Ja, bis 24 Stunden vor Beginn der Tour können Sie kostenlos stornieren.',
  ru: 'Да, до 24 часов перед началом тура вы можете отменить бесплатно.',
  ar: 'نعم، حتى 24 ساعة قبل بداية الجولة يمكن الإلغاء مجاناً.',
  en: 'Yes, you can cancel free of charge up to 24 hours before the tour starts.',
  fr: 'Oui, vous pouvez annuler gratuitement jusqu\'à 24 heures avant le début de la visite.',
  hu: 'Igen, a túra indítása előtt 24 óráig ingyenesen lemondható.'
};

(async()=>{
  for(const [locale, answer] of Object.entries(updates)){
    const {error}=await sb.from('faqs').update({answer}).eq('locale',locale).eq('sort_order',2);
    if(error) console.log(locale, 'error:', error.message);
    else console.log(locale, 'updated');
  }
})();