const https = require('https');
const fs = require('fs');
const get = (p, redirects = 3) =>
  new Promise((res, rej) => {
    https
      .get(p, (r) => {
        if ([301, 302, 303, 307, 308].includes(r.statusCode) && r.headers.location && redirects > 0) {
          r.resume();
          res(get(new URL(r.headers.location, p).toString(), redirects - 1));
          return;
        }
        let d = '';
        r.on('data', (c) => (d += c));
        r.on('end', () => res({ status: r.statusCode, body: d }));
      })
      .on('error', rej);
  });

(async () => {
  const [ar, en] = await Promise.all([
    get('https://hurghada-reiseplaner.at/ar/touren/family-abendsafari-hurghada'),
    get('https://hurghada-reiseplaner.at/en/touren/family-abendsafari-hurghada'),
  ]);
  const out = {
    ar: {
      status: ar.status,
      hasArabicPickup: ar.body.includes('الاستقبال من الفندق'),
      hasArabicDinner: ar.body.includes('العشاء'),
      hasGerman: ar.body.includes('Abholung vom Hotel'),
    },
    en: {
      status: en.status,
      hasEnPickup: en.body.includes('Hotel Pick-Up'),
      hasEnDinner: en.body.includes('Dinner'),
      hasGerman: en.body.includes('Abholung vom Hotel'),
    },
  };
  fs.writeFileSync('scripts/_live-check.json', JSON.stringify(out, null, 2));
  console.log('done');
})().catch((e) => {
  console.log('ERR ' + e.message);
  process.exit(1);
});
