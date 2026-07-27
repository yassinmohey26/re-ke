require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient}=require('@supabase/supabase-js');
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const ruFaqs = [
  {locale:'ru',sort_order:1,question:'Какие способы оплаты вы принимаете?',answer:'Мы принимаем кредитные карты (Visa, MasterCard), PayPal и банковские переводы. Оплата наличными возможна на месте.'},
  {locale:'ru',sort_order:2,question:'Возможно ли бесплатное отменение?',answer:'Да, до 48 часов перед началом тура вы можете отменить бесплатно.'},
  {locale:'ru',sort_order:3,question:'Как забронировать тур?',answer:'Выберите тур, дату и количество участников, затем нажмите "Забронировать сейчас". Вы получите подтверждение по электронной почте.'},
  {locale:'ru',sort_order:4,question:'Можно ли забронировать несколько туров за день?',answer:'Да, пока время не перекрывается. Полуденные туры хорошо сочетаются.'},
  {locale:'ru',sort_order:5,question:'Есть ли скидки для детей?',answer:'Да, для детей до 12 лет — скидка 50%. Дети до 3 лет ездят бесплатно.'},
  {locale:'ru',sort_order:6,question:'Включен ли трансфер из отеля?',answer:'Да, все туры включают заезд и возврат в ваш отель в Хургаде.'},
  {locale:'ru',sort_order:7,question:'Что взять с собой?',answer:'Солнцезащитный крем, шляпу, удобную обувь, камеру, воду и небольшую сумму на чаевые.'},
  {locale:'ru',sort_order:8,question:'Есть ли питание на турах?',answer:'На полноценных туррах обычно включен обед. На полуденных — закуски и напитки.'},
  {locale:'ru',sort_order:9,question:'Какие погодные условия?',answer:'В Хургаде круглый год тёплое погода. Лучшее время для визита — март-май и октябрь-ноябрь.'},
  {locale:'ru',sort_order:10,question:'Насколько безопасна Хургада для туристов?',answer:'Да, Хургада — один из самых безопасных туристических регионов Египта. Есть сильная полицейская присутствие.'},
  {locale:'ru',sort_order:11,question:'Можно ли посетить несколько достопримечательностей?',answer:'Да, мы предлагаем комби-туры, которые покрывают несколько мест за один день.'},
  {locale:'ru',sort_order:12,question:'На каких языках говорят ваши гиды?',answer:'Немецкий, английский, арабский и часто также русский и итальянский.'},
];

(async()=>{
  const {error}=await sb.from('faqs').insert(ruFaqs);
  if(error) console.log('Error:', error.message);
  else console.log('Russian FAQs inserted successfully');
})();