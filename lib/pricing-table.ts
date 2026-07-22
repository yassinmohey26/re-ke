export interface PricingTier {
  minGuests: number;
  maxGuests: number;
  pricePerPerson: number;
}

const PRICE_REGEX = /(\d+)\s*€\s*p\.?\s*P\.?/i;
const FREE_REGEX = /kostenlos|gratis|free/i;

function parseGuestRange(text: string): { min: number; max: number } | null {
  const clean = text.replace(/\s+/g, ' ').trim().toLowerCase();
  const exactMatch = clean.match(/^(\d+)\s*(person|gast|teilnehmer|pers?)/i);
  if (exactMatch) {
    const n = parseInt(exactMatch[1], 10);
    return { min: n, max: n };
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
    const hasTierHeaders =
      header.includes('teilnehmer') ||
      header.includes('preis pro person') ||
      header.includes('personen') ||
      (header.includes('preis') && header.includes('fahrzeug'));
    if (!hasTierHeaders) continue;

    const priceColIdx = rows[0].findIndex((h) => /preis/i.test(h));
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
