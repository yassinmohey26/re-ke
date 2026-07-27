require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient}=require('@supabase/supabase-js');
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const arFaqs = [
  {locale:'ar',sort_order:1,question:'ما هي طرق الدفع المقبولة؟',answer:'نقبل بطاقات الائتمان (فيزا، ماستركارد)، باي بال، والتحويل البنكي. الدفع نقداً متاح في الموقع.'},
  {locale:'ar',sort_order:2,question:'هل يمكن الإلغاء مجاناً؟',answer:'نعم، حتى 48 ساعة قبل بداية الجولة يمكن الإلغاء مجاناً.'},
  {locale:'ar',sort_order:3,question:'كيف أحجز جولة؟',answer:'اختر جولتك، حدد التاريخ وعدد المشاركين، واضغط على \"احجز الآن\". ستحصل على تأكيد بالبريد الإلكتروني.'},
  {locale:'ar',sort_order:4,question:'هل يمكن حجز عدة جولات في يوم واحد؟',answer:'نعم، طالما أن الأوقات لا تتعارض. يمكن دمج الجولات النصف يومية بشكل جيد.'},
  {locale:'ar',sort_order:5,question:'هل يوجد خصومات للأطفال؟',answer:'نعم، للأطفال دون 12 سنة خصم 50%. الرضع دون 3 سنوات مجاناً.'},
  {locale:'ar',sort_order:6,question:'هل النقل من الفندق مشمول؟',answer:'نعم، جميع الجولات تشمل الاستلام والإيصال من فندقك في الغردقة.'},
  {locale:'ar',sort_order:7,question:'ماذا يجب أن آخذ معي؟',answer:'واقي شمس، قبعة، حذاء مريح، كاميرا، ماء، ومبلغ صغير للنصائح.'},
  {locale:'ar',sort_order:8,question:'هل يوجد طعام في الجولات؟',answer:'في الجولات اليومية عادة الغداء مشمول. في الجولات النصف يومية توجد وجبات خفيفة ومشروبات.'},
  {locale:'ar',sort_order:9,question:'ما حالة الطقس في الغردقة؟',answer:'الغردقة تتمتع بطقس دافئ طوال العام. أفضل وقت للزيارة من مارس إلى مايو وأكتوبر إلى نوفمبر.'},
  {locale:'ar',sort_order:10,question:'هل الغردقة آمنة للسياح؟',answer:'نعم، الغردقة من أكثر المناطق السياحية أماناً في مصر. توجد شرطة سياحية قوية.'},
  {locale:'ar',sort_order:11,question:'هل يمكن زيارة عدة وجهات في يوم واحد؟',answer:'نعم، نقدم جولات مركبة تزور عدة وجهات في يوم واحد.'},
  {locale:'ar',sort_order:12,question:'ما اللغات التي يتحدثها مرشدوكم؟',answer:'الألمانية، الإنجليزية، العربية، وغالباً الروسية والإيطالية.'},
];

(async()=>{
  const {error}=await sb.from('faqs').insert(arFaqs);
  if(error) console.log('Error:', error.message);
  else console.log('Arabic FAQs inserted successfully');
})();