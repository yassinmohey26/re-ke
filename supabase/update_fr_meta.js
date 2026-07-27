const fs=require('fs');
const fr=JSON.parse(fs.readFileSync('messages/fr.json','utf8'));
fr.metadata.termsTitle = "Conditions Générales d'Utilisation";
fr.metadata.termsDescription = "Conditions Générales d'Utilisation pour les visites et excursions à Hurghada.";
fs.writeFileSync('messages/fr.json', JSON.stringify(fr, null, 2), 'utf8');
console.log('French metadata updated');