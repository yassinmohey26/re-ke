const fs=require('fs');
const de=JSON.parse(fs.readFileSync('messages/de.json','utf8'));
de.terms.intro = {
  title: '1. Geltungsbereich',
  text: 'Diese Allgemeinen Geschäftsbedingungen (nachfolgend "AGB") regeln die vertraglichen Beziehungen zwischen Hurghada Reiseplaner (nachfolgend "Veranstalter") und dem Kunden (nachfolgend "Teilnehmer") für die Buchung und Durchführung von Touren, Ausflügen und weiteren touristischen Leistungen in Ägypten. Abweichende Bedingungen des Teilnehmers werden nicht anerkannt, es sei denn, der Veranstalter stimmt ihrer Geltung ausdrücklich schriftlich zu.'
};
de.terms.privacy = {
  title: '9. Datenschutz',
  text: 'Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung und der DSGVO. Daten werden nur zur Vertragsabwicklung und Kommunikation verwendet. Eine Weitergabe an Dritte erfolgt nur zur Vertragserfüllung (z.B. Hotel, Transferpartner) oder auf gesetzliche Verpflichtung.',
  policyLink: 'Datenschutzerklärung'
};
de.terms.contact.link = 'Kontaktieren Sie uns';
fs.writeFileSync('messages/de.json', JSON.stringify(de, null, 2), 'utf8');
console.log('German updated');