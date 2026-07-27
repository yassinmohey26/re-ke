const fs=require('fs');
const hu=JSON.parse(fs.readFileSync('messages/hu.json','utf8'));
hu.metadata.termsTitle = "Általános Szerződési Feltételek";
hu.metadata.termsDescription = "Általános Szerződési Feltételek a hurghadai túrákra és kirándulásokra.";
fs.writeFileSync('messages/hu.json', JSON.stringify(hu, null, 2), 'utf8');
console.log('Hungarian metadata updated');