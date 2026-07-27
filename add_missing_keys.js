const fs = require('fs');

const langData = {
  en: {
    privacy: {
      title: '8. Data Protection',
      text: 'Personal data processing is carried out in accordance with our Privacy Policy and GDPR. Data is used exclusively for contract fulfillment and communication.',
      policyLink: 'Privacy Policy'
    },
    forceMajeure: {
      title: '5. Force Majeure',
      text: 'In case of force majeure (natural disasters, political unrest, pandemics, official orders), tours may be cancelled or postponed without liability for damages. Amounts already paid will be refunded or offered as credit for a future tour.'
    }
  },
  fr: {
    privacy: {
      title: '8. Protection des Données',
      text: 'Le traitement des données personnelles est effectué conformément à notre Politique de Confidentialité et au RGPD. Les données sont utilisées exclusivement pour l\'exécution du contrat et la communication.',
      policyLink: 'Politique de confidentialité'
    },
    forceMajeure: {
      title: '5. Force Majeure',
      text: 'En cas de force majeure (catastrophes naturelles, troubles politiques, pandémies, injonctions officielles), les visites peuvent être annulées ou reportées sans responsabilité pour dommages. Les montants déjà payés seront remboursés ou proposés sous forme d\'avoir pour une visite ultérieure.'
    }
  },
  hu: {
    privacy: {
      title: '8. Adatvédelem',
      text: 'A személyes adatok feldolgozása az Adatvédelmi Szabályzatunk és a GDPR szerint történik. Az adatokat kizárólag a szerződés teljesítésére és kommunikációra használjuk.',
      policyLink: 'Adatvédelmi szabályzat'
    },
    forceMajeure: {
      title: '5. Kényszermajor',
      text: 'Kényszermajor (természeti katasztrófák, politikai görcsök, járványok, hatósági rendelkezések) esetén a túrák felelősség nélkül lemondhatók vagy átrendezhetők. A már befizetett összegek visszatérítésre kerülnek vagy későbbi túra esetén jóváírásként kínáljuk fel.'
    }
  },
  ru: {
    privacy: {
      title: '8. Защита Данных',
      text: 'Обработка персональных данных осуществляется в соответствии с нашей Политикой конфиденциальности и GDPR. Данные используются исключительно для исполнения договора и коммуникации.',
      policyLink: 'Политика конфиденциальности'
    },
    forceMajeure: {
      title: '5. Форс-мажор',
      text: 'В случае форс-мажора (стихийные бедствия, политические волнения, пандемии, официальные приказы) туры могут быть отменены или перенесены без ответственности за ущерб. Уже оплаченные суммы будут возвращены или предложены как кредит на будущий тур.'
    }
  },
  ar: {
    privacy: {
      title: '8. حماية البيانات',
      text: 'تتم معالجة البيانات الشخصية وفقاً لسياسة الخصوصية الخاصة بنا وGDPR. تُستخدم البيانات حصرياً لتنفيذ العقد والتواصل.',
      policyLink: 'سياسة الخصوصية'
    },
    forceMajeure: {
      title: '5. القوة القاهرة',
      text: 'في حالة القوة القاهرة (الكوارث الطبيعية، الاضطرابات السياسية، الأوبئة، الأوامر الرسمية) يمكن إلغاء الجولات أو تأجيلها دون مسؤولية عن الأضرار. سيتم استرداد المبالغ المدفوعة بالفعل أو تقديمها كرصيد لجولة مستقبلية.'
    }
  }
};

const langs = ['en', 'fr', 'hu', 'ru', 'ar'];

langs.forEach(lang => {
  const file = 'messages/' + lang + '.json';
  const data = JSON.parse(fs.readFileSync('messages/' + lang + '.json', 'utf8'));
  
  if (!data.terms.privacy) {
    data.terms.privacy = langData[lang].privacy;
    data.terms.forceMajeure = langData[lang].forceMajeure;
    fs.writeFileSync('messages/' + lang + '.json', JSON.stringify(data, null, 2), 'utf8');
    console.log('Added missing keys to ' + lang);
  } else {
    console.log('Keys already exist in ' + lang);
  }
});