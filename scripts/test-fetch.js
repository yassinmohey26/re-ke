const https = require('https');
const fs = require('fs');
https.get('https://hurghada-reiseplaner.at/trip/glasbodenboot-hurghada-mit-schnorcheln/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    fs.writeFileSync('scripts/test-page.html', data);
    console.log('Saved', data.length, 'bytes');
    console.log('Has description class:', data.includes('description enable-readmore'));
    console.log('Has id ablauf:', data.includes('id="ablauf"'));
    console.log('Has id highlights:', data.includes('id="highlights"'));
    console.log('Has id ie:', data.includes('id="ie"'));
    console.log('Has togo-st-overview:', data.includes('togo-st-overview'));
    console.log('Has togo-st-highlights:', data.includes('togo-st-highlights'));
    console.log('Has data-widget_type:', data.includes('data-widget_type'));
    
    // Search for common content patterns
    const idx = data.indexOf('enable-readmore');
    if (idx > -1) {
      console.log('Found enable-readmore at index:', idx);
      console.log('Context:', data.substring(idx - 100, idx + 100));
    }
    
    const idx2 = data.indexOf('description');
    if (idx2 > -1) {
      console.log('First "description" at:', idx2);
      console.log('Context:', data.substring(idx2 - 50, idx2 + 100));
    }
    
    // Check if content is loaded via JS/AJAX
    const idx3 = data.indexOf('togo-st');
    if (idx3 > -1) {
      console.log('Found togo-st at:', idx3);
    } else {
      console.log('No togo-st found - content may be loaded dynamically');
    }
  });
}).on('error', e => console.error(e));
