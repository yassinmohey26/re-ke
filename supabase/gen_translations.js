const fs = require('fs');

const translations = [];

function add(t, r, n, d, sd, cl, h, inc, ni, mp, dur, title, excerpt, content, readTime, faqs) {
  translations.push({
    table_name: t, row_id: r, name: n,
    description: d || null,
    short_description: sd || null,
    category_label: cl || null,
    highlights: h || [],
    included: inc || [],
    not_included: ni || [],
    meeting_point: mp || null,
    duration: dur || null,
    title: title || null,
    excerpt: excerpt || null,
    content: content || null,
    read_time: readTime || null,
    faqs: faqs || []
  });
}

// 1. Luxor destination
add('destinations','0cb58b8e-0abe-44b9-9469-3233654967b2',
  '\u0627\u0644\u0623\u0642\u0635\u0631',
  '\u0645\u062a\u062d\u0641 \u0645\u062f\u064a\u0646\u0629 \u0637\u064a\u0628\u0629 \u0627\u0644\u0642\u062f\u064a\u0645\u0629 \u0628\u0645\u0648\u0627\u0642\u0639\u0647\u0627 \u0627\u0644\u0645\u064f\u062f\u0631\u062c\u0629 \u0641\u064a \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062a\u0631\u0627\u062b \u0627\u0644\u0639\u0627\u0644\u0645\u064a.');

// 2. Kairo destination
add('destinations','5233806c-dc22-4dc1-8aa8-5d90e819ef2c',
  '\u0627\u0644\u0642\u0627\u0647\u0631\u0629',
  '\u0639\u0627\u0635\u0645\u0629 \u0645\u0635\u0631 \u0648\u0623\u0647\u0631\u0627\u0645\u0627\u062a \u0627\u0644\u062c\u064a\u0632\u0629 \u0648\u0627\u0644\u0645\u062a\u062d\u0641 \u0627\u0644\u0645\u0635\u0631\u064a.');

// 3. Reiten (minimal data)
add('tours','693d8094-990e-44b2-acfe-571c66ffbb44',
  '\u0631\u0643\u0648\u0628 \u0627\u0644\u062e\u064a\u0644 \u0641\u064a \u0627\u0644\u063a\u0631\u062f\u0642\u0629 \u2013 \u0627\u0644\u0634\u0627\u0637\u0626 \u0648\u0627\u0644\u0635\u062d\u0631\u0627\u0621 \u0648\u0627\u0644\u062e\u064a\u0648\u0644 \u0641\u064a \u0627\u0644\u0628\u062d\u0631');

fs.writeFileSync('ar_translations.json', JSON.stringify(translations, null, 2));
console.log('Written ' + translations.length + ' translations');
