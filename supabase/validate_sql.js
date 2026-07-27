const fs=require('fs');
const sql=fs.readFileSync('migrations/003v2_fix_ar_content_translations.sql','utf8');
const insertLines=sql.split('\n').filter(l=>l.startsWith('INSERT INTO'));
const deleteLine=sql.includes("DELETE FROM content_translations WHERE locale = 'ar'");
console.log('DELETE existing AR rows:', deleteLine);
console.log('INSERT statements:', insertLines.length);
console.log('Transaction BEGIN:', sql.includes('BEGIN;'));
console.log('Transaction COMMIT:', sql.includes('COMMIT;'));
console.log('First 150 chars of first INSERT:', insertLines[0].substring(0,150));
console.log('');

const arCount=sql.split("locale = 'ar'").length - 1;
console.log('References to AR locale:', arCount);
const tourRows=sql.split("table_name = 'tours'").length - 1;
console.log('Tour references:', tourRows);
const destRows=sql.split("table_name = 'destinations'").length - 1;
console.log('Destination references:', destRows);

const tRows=sql.match(/tours/g)||[];
const dRows=sql.match(/destinations/g)||[];
console.log('Total "tours" mentions:',tRows.length);
console.log('Total "destinations" mentions:',dRows.length);
console.log('File size:',(sql.length/1024).toFixed(1),'KB');
