const { hasPricingTable, parsePricingTiers } = require('./lib/pricing-table.ts');

// German tiered table
const deTable = `<table class="tour-pricing-table"><thead><tr><th>Teilnehmer</th><th>Fahrzeug</th><th>Preis pro Person</th></tr></thead><tbody><tr><td>2 Personen</td><td>Private Limousine</td><td>150 € p.P.</td></tr><tr><td>3–4 Personen</td><td>Minivan</td><td>120 € p.P.</td></tr></tbody></table>`;

// English tiered table
const enTable = `<table class="tour-pricing-table"><thead><tr><th>Participants</th><th>Vehicle</th><th>Price per Person</th></tr></thead><tbody><tr><td>2 Persons</td><td>Private Limousine</td><td>150 € p.P.</td></tr><tr><td>3–4 Persons</td><td>Minivan</td><td>120 € p.P.</td></tr></tbody></table>`;

// Russian tiered table
const ruTable = `<table class="tour-pricing-table"><thead><tr><th>Участники</th><th>Транспорт</th><th>Цена за человека</th></tr></thead><tbody><tr><td>2 человека</td><td>Лимузин</td><td>150 € за человека</td></tr><tr><td>3–4 человека</td><td>Минивэн</td><td>120 € за человека</td></tr></tbody></table>`;

// French tiered table
const frTable = `<table class="tour-pricing-table"><thead><tr><th>Participants</th><th>Véhicule</th><th>Prix par personne</th></tr></thead><tbody><tr><td>2 personnes</td><td>Limousine privée</td><td>150 € par personne</td></tr><tr><td>3–4 personnes</td><td>Minivan</td><td>120 € par personne</td></tr></tbody></table>`;

// Hungarian tiered table
const huTable = `<table class="tour-pricing-table"><thead><tr><th>Résztvevők</th><th>Jármű</th><th>Személyenkénti ár</th></tr></thead><tbody><tr><td>2 fő</td><td>Privát limuzin</td><td>150 €/fő</td></tr><tr><td>3–4 fő</td><td>Minivan</td><td>120 €/fő</td></tr></tbody></table>`;

// Arabic tiered table
const arTable = `<table class="tour-pricing-table"><thead><tr><th>المشاركون</th><th>المركبة</th><th>السعر للشخص الواحد</th></tr></thead><tbody><tr><td>شخصان</td><td>ليموزين خاصة</td><td>150 € للشخص الواحد</td></tr><tr><td>3–4 أشخاص</td><td>ميني فان</td><td>120 € للشخص الواحد</td></tr></tbody></table>`;

// Arabic simple table
const arSimpleTable = `<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>موعد الانطلاق</th><th>الاستقبال</th></tr></thead><tbody><tr><td>من 20 € للشخص الواحد</td><td>جولة جماعية</td><td>يومياً</td><td>نحو الساعة 12:00 ظهراً</td></tr></tbody></table>`;

console.log('=== German ===');
console.log('hasPricingTable:', hasPricingTable(deTable));
console.log('parsePricingTiers:', JSON.stringify(parsePricingTiers(deTable), null, 2));

console.log('\n=== English ===');
console.log('hasPricingTable:', hasPricingTable(enTable));
console.log('parsePricingTiers:', JSON.stringify(parsePricingTiers(enTable), null, 2));

console.log('\n=== Russian ===');
console.log('hasPricingTable:', hasPricingTable(ruTable));
console.log('parsePricingTiers:', JSON.stringify(parsePricingTiers(ruTable), null, 2));

console.log('\n=== French ===');
console.log('hasPricingTable:', hasPricingTable(frTable));
console.log('parsePricingTiers:', JSON.stringify(parsePricingTiers(frTable), null, 2));

console.log('\n=== Hungarian ===');
console.log('hasPricingTable:', hasPricingTable(huTable));
console.log('parsePricingTiers:', JSON.stringify(parsePricingTiers(huTable), null, 2));

console.log('\n=== Arabic (tiered) ===');
console.log('hasPricingTable:', hasPricingTable(arTable));
console.log('parsePricingTiers:', JSON.stringify(parsePricingTiers(arTable), null, 2));

console.log('\n=== Arabic (simple) ===');
console.log('hasPricingTable:', hasPricingTable(arSimpleTable));
console.log('parsePricingTiers:', JSON.stringify(parsePricingTiers(arSimpleTable), null, 2));