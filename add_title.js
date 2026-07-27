const fs = require('fs');

const translations = {
  de: 'Allgemeine Geschäftsbedingungen',
  en: 'Terms and Conditions',
  fr: "Conditions Générales d'Utilisation",
  hu: 'Általános Szerződési Feltételek',
  ru: 'Общие Условия',
  ar: 'الشروط والأحكام'
};

const langs = ['de', 'en', 'fr', 'hu', 'ru', 'ar'];

langs.forEach(lang => {
  const file = 'messages/' + lang + '.json';
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  if (!data.terms.title) {
    data.terms.title = translations[lang] || data.terms.pageTitle;
    fs.writeFileSync('messages/' + lang + '.json', JSON.stringify(data, null, 2), 'utf8');
    console.log('Added title to ' + lang);
  } else {
    console.log('title already exists in ' + lang);
  }
});