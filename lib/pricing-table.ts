export interface PricingTier {
  minGuests: number;
  maxGuests: number;
  pricePerPerson: number;
}

const PRICE_REGEX = /(\d+)\s*€\s*p\.?\s*P\.?/i;
const FREE_REGEX = /kostenlos|gratis|free|مجاني|مجانية|مجانًا/i;

function parseGuestRange(text: string): { min: number; max: number } | null {
  const clean = text.replace(/\s+/g, ' ').trim().toLowerCase();
  
  if (clean.includes('شخصان')) {
    return { min: 2, max: 2 };
  }
  if (clean.includes('شخص واحد') || clean === 'شخص') {
    return { min: 1, max: 1 };
  }
  
  const exactMatch = clean.match(/^(\d+)\s*(person|gast|teilnehmer|pers?|participant|участник|participant|résztvevő)/i);
  if (exactMatch) {
    const n = parseInt(exactMatch[1], 10);
    return { min: n, max: n };
  }
  
  const arRangeMatch = clean.match(/(\d+)\s*[–\-\u2013]\s*(\d+)\s*(أشخاص|شخص|افراد|أفراد)/);
  if (arRangeMatch) {
    return { min: parseInt(arRangeMatch[1], 10), max: parseInt(arRangeMatch[2], 10) };
  }
  
  const arSingleMatch = clean.match(/^(\d+)\s*(أشخاص|شخص|افراد|أفراد)/);
  if (arSingleMatch) {
    const n = parseInt(arSingleMatch[1], 10);
    return { min: n, max: n };
  }
  
  const ruRangeMatch = clean.match(/(\d+)\s*[–\-\u2013]\s*(\d+)\s*(человек|люди|участник)/);
  if (ruRangeMatch) {
    return { min: parseInt(ruRangeMatch[1], 10), max: parseInt(ruRangeMatch[2], 10) };
  }
  
  const frRangeMatch = clean.match(/(\d+)\s*[–\-\u2013]\s*(\d+)\s*(personnes|personne)/);
  if (frRangeMatch) {
    return { min: parseInt(frRangeMatch[1], 10), max: parseInt(frRangeMatch[2], 10) };
  }
  
  const huRangeMatch = clean.match(/(\d+)\s*[–\-\u2013]\s*(\d+)\s*(személyek|személy|fő)/);
  if (huRangeMatch) {
    return { min: parseInt(huRangeMatch[1], 10), max: parseInt(huRangeMatch[2], 10) };
  }
  
  const rangeMatch = clean.match(/(\d+)\s*[–\-\u2013]\s*(\d+)/);
  if (rangeMatch) {
    return { min: parseInt(rangeMatch[1], 10), max: parseInt(rangeMatch[2], 10) };
  }
  const singleMatch = clean.match(/^(\d+)/);
  if (singleMatch) {
    const n = parseInt(singleMatch[1], 10);
    return { min: n, max: n };
  }
  return null;
}

function parsePrice(text: string): number | null {
  if (FREE_REGEX.test(text)) return 0;
  const m = text.match(PRICE_REGEX);
  if (m) return parseInt(m[1], 10);
  
  const euroMatch = text.match(/(\d+)\s*€|€\s*(\d+)/i);
  if (euroMatch) {
    return parseInt(euroMatch[1] || euroMatch[2], 10);
  }
  
  const numMatch = text.match(/(\d+)/);
  if (numMatch) return parseInt(numMatch[1], 10);
  return null;
}

export function parsePricingTiers(html: string): PricingTier[] {
  const tableMatch = html.match(/<table[\s\S]*?<\/table>/gi);
  if (!tableMatch) return [];

  for (const tableHtml of tableMatch) {
    const rowMatches = tableHtml.match(/<tr[\s\S]*?<\/tr>/gi);
    if (!rowMatches || rowMatches.length < 2) continue;

    const rows: string[][] = [];
    for (const rowHtml of rowMatches) {
      const cellMatches = rowHtml.match(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi);
      if (!cellMatches) continue;
      const cells = cellMatches.map((c) => c.replace(/<[^>]+>/g, '').trim());
      rows.push(cells);
    }
    if (rows.length < 2) continue;

    const header = rows[0].join(' ').toLowerCase();
    const isTieredTable =
      header.includes('teilnehmer') ||
      header.includes('preis pro person') ||
      header.includes('personen') ||
      (header.includes('preis') && header.includes('fahrzeug')) ||
      header.includes('participants') ||
      header.includes('price per person') ||
      header.includes('persons') ||
      (header.includes('price') && header.includes('vehicle')) ||
      header.includes('участники') ||
      header.includes('цена за человека') ||
      header.includes('люди') ||
      (header.includes('цена') && header.includes('транспорт')) ||
      header.includes('prix par personne') ||
      header.includes('personnes') ||
      (header.includes('prix') && header.includes('véhicule')) ||
      header.includes('résztvevők') ||
      header.includes('személyenkénti ár') ||
      header.includes('személyek') ||
      (header.includes('ár') && header.includes('jármű')) ||
      header.includes('المشاركون') ||
      header.includes('السعر للشخص الواحد') ||
      header.includes('أشخاص') ||
      header.includes('شخص') ||
      header.includes('أفراد') ||
      (header.includes('السعر') && header.includes('المركبة'));

    const isSimplePriceTable =
      header.includes('السعر') &&
      (header.includes('نوع الرحلة') || header.includes('موعد الانطلاق') || header.includes('الاستقبال'));

    if (!isTieredTable && !isSimplePriceTable) continue;

    if (isTieredTable) {
      const priceColIdx = rows[0].findIndex((h) => /preis|السعر/i.test(h));
      const guestColIdx = 0;

      const tiers: PricingTier[] = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const guestText = row[guestColIdx] ?? '';
        const priceText = row[priceColIdx >= 0 ? priceColIdx : row.length - 1] ?? '';
        const range = parseGuestRange(guestText);
        const price = parsePrice(priceText);
        if (range && price !== null) {
          tiers.push({ minGuests: range.min, maxGuests: range.max, pricePerPerson: price });
        }
      }
      if (tiers.length > 0) return tiers;
    } else if (isSimplePriceTable) {
      const priceColIdx = rows[0].findIndex((h) => /السعر/i.test(h));
      if (priceColIdx >= 0 && rows[1]?.[priceColIdx]) {
        const priceText = rows[1][priceColIdx];
        const price = parsePrice(priceText);
        if (price !== null) {
          return [{ minGuests: 1, maxGuests: 99, pricePerPerson: price }];
        }
      }
    }
  }
  return [];
}

export function getPriceForGuests(
  tiers: PricingTier[],
  basePrice: number | null,
  guests: number,
): number | null {
  if (tiers.length === 0) return basePrice;
  for (const tier of tiers) {
    if (guests >= tier.minGuests && guests <= tier.maxGuests) {
      return tier.pricePerPerson;
    }
  }
  if (guests < tiers[0].minGuests) return basePrice;
  return tiers[tiers.length - 1].pricePerPerson;
}

export function hasPricingTable(html: string): boolean {
  return /<table[\s\S]*?class="tour-pricing-table"[\s\S]*?<\/table>/i.test(html);
}

export function stripPricingTable(html: string): string {
  return html.replace(/<table[\s\S]*?class="tour-pricing-table"[\s\S]*?<\/table>/gi, '').trim();
}
