const fs=require('fs');

const en=JSON.parse(fs.readFileSync('messages/en.json','utf8'));
en.terms.stripe.agreement = 'By continuing, you agree to Stripe Terms of Service (https://stripe.com/legal) and Privacy Policy (https://stripe.com/privacy).';
fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2), 'utf8');
console.log('English updated');

const fr=JSON.parse(fs.readFileSync('messages/fr.json','utf8'));
fr.terms.stripe.agreement = "En continuant, vous acceptez les Conditions d'Utilisation de Stripe (https://stripe.com/fr/legal) et la Politique de Confidentialité (https://stripe.com/fr/privacy).";
fs.writeFileSync('messages/fr.json', JSON.stringify(fr, null, 2), 'utf8');
console.log('French updated');

const ru=JSON.parse(fs.readFileSync('messages/ru.json','utf8'));
ru.terms.stripe.agreement = 'Продолжая, вы соглашаетесь с Условиями использования Stripe (https://stripe.com/legal) и Политикой конфиденциальности (https://stripe.com/privacy).';
fs.writeFileSync('messages/ru.json', JSON.stringify(ru, null, 2), 'utf8');
console.log('Russian updated');

const ar=JSON.parse(fs.readFileSync('messages/ar.json','utf8'));
ar.terms.stripe.agreement = 'بالمتابعة، فإنك توافق على شروط استخدام Stripe (https://stripe.com/legal) وسياسة الخصوصية (https://stripe.com/privacy).';
fs.writeFileSync('messages/ar.json', JSON.stringify(ar, null, 2), 'utf8');
console.log('Arabic updated');

const hu=JSON.parse(fs.readFileSync('messages/hu.json','utf8'));
hu.terms.stripe.agreement = 'A folytatással elfogadja a Stripe Használati Feltételeit (https://stripe.com/legal) és Adatvédelmi Szabályzatát (https://stripe.com/privacy).';
fs.writeFileSync('messages/hu.json', JSON.stringify(hu, null, 2), 'utf8');
console.log('Hungarian updated');

const de=JSON.parse(fs.readFileSync('messages/de.json','utf8'));
de.terms.stripe.agreement = 'Indem Sie fortfahren, stimmen Sie den Stripe-Nutzungsbedingungen (https://stripe.com/de/legal) und der Datenschutzrichtlinie (https://stripe.com/de/privacy) zu.';
fs.writeFileSync('messages/de.json', JSON.stringify(de, null, 2), 'utf8');
console.log('German updated');

const hu2=JSON.parse(fs.readFileSync('messages/hu.json','utf8'));
hu2.terms.stripe.agreement = 'A folytatással elfogadja a Stripe Használati Feltételeit (https://stripe.com/legal) és Adatvédelmi Szabályzatát (https://stripe.com/privacy).';
fs.writeFileSync('messages/hu.json', JSON.stringify(hu2, null, 2), 'utf8');
console.log('Hungarian updated');

console.log('All updated');