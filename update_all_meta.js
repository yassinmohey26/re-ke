const fs=require('fs');
const de=JSON.parse(fs.readFileSync('messages/de.json','utf8'));
de.metadata.termsTitle = 'Allgemeine Geschäftsbedingungen';
de.metadata.termsDescription = 'Allgemeine Geschäftsbedingungen für Touren und Ausflüge in Hurghada.';
fs.writeFileSync('messages/de.json', JSON.stringify(de, null, 2), 'utf8');
console.log('German metadata updated');

const en=JSON.parse(fs.readFileSync('messages/en.json','utf8'));
en.metadata.termsTitle = 'Terms and Conditions';
en.metadata.termsDescription = 'Terms and Conditions for tours and excursions in Hurghada.';
fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2), 'utf8');
console.log('English metadata updated');

const fr=JSON.parse(fs.readFileSync('messages/fr.json','utf8'));
fr.metadata.termsTitle = "Conditions Générales d'Utilisation";
fr.metadata.termsDescription = "Conditions Générales d'Utilisation pour les visites et excursions à Hurghada.";
fs.writeFileSync('messages/fr.json', JSON.stringify(fr, null, 2), 'utf8');
console.log('French metadata updated');

const hu=JSON.parse(fs.readFileSync('messages/hu.json','utf8'));
hu.metadata.termsTitle = 'Általános Szerződési Feltételek';
hu.metadata.termsDescription = 'Általános Szerződési Feltételek a hurghadai túrákra és kirándulásokra.';
fs.writeFileSync('messages/hu.json', JSON.stringify(hu, null, 2), 'utf8');
console.log('Hungarian metadata updated');

const ru=JSON.parse(fs.readFileSync('messages/ru.json','utf8'));
ru.metadata.termsTitle = 'Общие Условия';
ru.metadata.termsDescription = 'Общие Условия для туров и экскурсий в Хургаде.';
fs.writeFileSync('messages/ru.json', JSON.stringify(ru, null, 2), 'utf8');
console.log('Russian metadata updated');

const ar=JSON.parse(fs.readFileSync('messages/ar.json','utf8'));
ar.metadata.termsTitle = 'الشروط والأحكام';
ar.metadata.termsDescription = 'الشروط والأحكام للجولات والرحلات في الغردقة.';
fs.writeFileSync('messages/ar.json', JSON.stringify(ar, null, 2), 'utf8');
console.log('Arabic metadata updated');

console.log('All metadata updated');