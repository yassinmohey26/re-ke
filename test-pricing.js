const { hasPricingTable, parsePricingTiers } = require('./lib/pricing-table.ts');
const testDesc = `<table class="tour-pricing-table"><thead><tr><th>السعر</th><th>نوع الرحلة</th><th>موعد الانطلاق</th><th>الاستقبال</th></tr></thead><tbody><tr><td>من 20 € للشخص الواحد</td><td>جولة جماعية</td><td>يومياً</td><td>نحو الساعة 12:00 ظهراً</td></tr></tbody></table>
مع القارب ذي القاع الزجاجي...`;

console.log('hasPricingTable:', hasPricingTable(testDesc));
console.log('parsePricingTiers:', JSON.stringify(parsePricingTiers(testDesc), null, 2));