const fs = require('fs');
const pdfParse = require('pdf-parse');
const buf = fs.readFileSync('Hurghada – Hurghada Travel Planner.pdf');
pdfParse(buf).then(data => {
  console.log(data.text.substring(0, 10000));
}).catch(e => console.error(e));
