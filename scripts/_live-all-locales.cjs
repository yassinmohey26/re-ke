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

const base = 'https://hurghada-reiseplaner.at';
const slug = '/touren/family-abendsafari-hurghada';
const checks = {
  de: { native: 'Abholung vom Hotel', german: 'Abholung vom Hotel' },
  en: { native: 'Hotel Pick-Up', german: 'Abholung vom Hotel' },
  ar: { native: 'الاستقبال من الفندق', german: 'Abholung vom Hotel' },
  ru: { native: 'Встреча в отеле', german: 'Abholung vom Hotel' },
  fr: { native: "Prise en charge à l'hôtel", german: 'Abholung vom Hotel' },
  hu: { native: 'Átvétel a szállodából', german: 'Abholung vom Hotel' },
};

(async () => {
  const out = {};
  for (const [loc, c] of Object.entries(checks)) {
    const r = await get(`${base}/${loc}${slug}`);
    out[loc] = {
      status: r.status,
      hasNative: r.body.includes(c.native),
      hasGerman: r.body.includes(c.german),
    };
  }
  fs.writeFileSync('scripts/_live-all-locales.json', JSON.stringify(out, null, 2));
  console.log('done');
})().catch((e) => {
  console.log('ERR ' + e.message);
  process.exit(1);
});
