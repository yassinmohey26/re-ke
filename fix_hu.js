const fs=require('fs');
const hu=JSON.parse(fs.readFileSync('messages/hu.json','utf8'));
hu.terms.intro = {
  title: '1. Hatálykör',
  text: 'Ezek az Általános Szerződési Feltételek (a továbbiakban: "ÁSZF") szabályozzák a Hurghada Utazásszervező (a továbbiakban: "Szervező") és az ügyfél (a továbbiakban: "Résztvevő") közötti szerződési kapcsolatokat a túrák, kirándulások és egyéb turisztikai szolgáltatások előfizetéséhez és megvalósításához Egyiptomban. Az eltérő feltételeket a Résztvevő nem fogadjuk el, hacsak a Szervező kifejezetten írásosan nem hagyja jóvá.'
};
hu.terms.privacy = {
  title: '8. Adatvédelem',
  text: 'A személyes adatok feldolgozása az Adatvédelmi Szabályzatunk és a GDPR szerint történik. Az adatokat kizárólag a szerződés teljesítésére és kommunikációra használjuk. Harmadik felekkel csak a szerződés teljesítéséhez (pl. szálloda, transzfer-partnerek) vagy jogi kötelezettség esetén osztunk meg.',
  policyLink: 'Adatvédelmi szabályzat'
};
hu.terms.contact.link = 'Kapcsolat';
fs.writeFileSync('messages/hu.json', JSON.stringify(hu, null, 2), 'utf8');
console.log('Hungarian updated');