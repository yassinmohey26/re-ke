const fs=require('fs');
const fr=JSON.parse(fs.readFileSync('messages/fr.json','utf8'));
fr.terms.intro = {
  title: '1. Champ d\'application',
  text: 'Ces Conditions Générales d\'Utilisation (ci-après "CGU") régissent les relations contractuelles entre Hurghada Travel Planner (ci-après "l\'Organisateur") et le client (ci-après "le Participant") pour la réservation et l\'exécution de visites, excursions et autres prestations touristiques en Égypte. Les conditions divergentes du Participant ne sont pas reconnues, sauf si l\'Organisateur accepte expressément leur validité par écrit.'
};
fr.terms.privacy = {
  title: '8. Protection des Données',
  text: 'Le traitement des données personnelles est effectué conformément à notre Politique de Confidentialité et au RGPD. Les données sont utilisées exclusivement pour l\'exécution du contrat et la communication. Une transmission à des tiers n\'a lieu que pour l\'exécution du contrat (ex: hôtel, partenaires de transfert) ou sur obligation légale.',
  policyLink: 'Politique de confidentialité'
};
fr.terms.contact.link = 'Nous contacter';
fs.writeFileSync('messages/fr.json', JSON.stringify(fr, null, 2), 'utf8');
console.log('French updated');