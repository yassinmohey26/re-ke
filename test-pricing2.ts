const { hasPricingTable, parsePricingTiers } = require('./lib/pricing-table.ts');

const arabicDesc = `<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>موعد الانطلاق</th><th>الاستقبال</th></tr></thead><tbody><tr><td>من 20 € للشخص الواحد</td><td>جولة جماعية</td><td>يومياً</td><td>نحو الساعة 12:00 ظهراً</td></tr></tbody></table>
مع القارب...`;

console.log('hasPricingTable:', hasPricingTable(arabicDesc));
const tiers = parsePricingTiers(arabicDesc);
console.log('parsePricingTiers:', JSON.stringify(tiers, null, 2));