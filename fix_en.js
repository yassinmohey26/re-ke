const fs=require('fs');
const en=JSON.parse(fs.readFileSync('messages/en.json','utf8'));
en.terms.intro = {
  title: '1. Scope',
  text: 'These General Terms and Conditions (hereinafter "T&C") govern the contractual relationships between Hurghada Travel Planner (hereinafter "Organizer") and the customer (hereinafter "Participant") for the booking and execution of tours, excursions, and other tourist services in Egypt. Deviating conditions of the Participant shall not be recognized unless the Organizer expressly agrees to their validity in writing.'
};
en.terms.privacy = {
  title: '9. Data Protection',
  text: 'Personal data processing is carried out in accordance with our Privacy Policy and GDPR. Data is used exclusively for contract fulfillment and communication. Disclosure to third parties occurs only for contract fulfillment (e.g., hotel, transfer partners) or legal obligation.',
  policyLink: 'Privacy Policy'
};
en.terms.contact.link = 'Contact us';
fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2), 'utf8');
console.log('English updated');