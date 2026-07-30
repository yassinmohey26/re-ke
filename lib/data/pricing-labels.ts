export type Locale = 'de' | 'en' | 'ar' | 'fr' | 'hu' | 'ru';

export type PricingLabels = {
  header_participants: string;
  header_vehicle: string;
  header_price: string;
  person_singular: string;
  person_plural: string;
  vehicle_sedan: string;
  vehicle_minibus: string;
  vehicle_speedboat: string;
  vehicle_boat: string;
  price_suffix: string;
  free: string;
  from_label: string;
};

const LABELS: Record<Locale, PricingLabels> = {
  de: {
    header_participants: 'Teilnehmer',
    header_vehicle: 'Fahrzeug',
    header_price: 'Preis pro Person',
    person_singular: 'Person',
    person_plural: 'Personen',
    vehicle_sedan: 'Private Limousine',
    vehicle_minibus: 'Privater Minibus',
    vehicle_speedboat: 'Privates Speedboot',
    vehicle_boat: 'Privates Boot',
    price_suffix: 'p.P.',
    free: 'kostenlos',
    from_label: 'ab',
  },
  en: {
    header_participants: 'Participants',
    header_vehicle: 'Vehicle',
    header_price: 'Price per Person',
    person_singular: 'Person',
    person_plural: 'Persons',
    vehicle_sedan: 'Private Sedan',
    vehicle_minibus: 'Private Minibus',
    vehicle_speedboat: 'Private Speedboat',
    vehicle_boat: 'Private Boat',
    price_suffix: 'p.P.',
    free: 'free',
    from_label: 'from',
  },
  ar: {
    header_participants: 'المشاركون',
    header_vehicle: 'المركبة',
    header_price: 'السعر للفرد',
    person_singular: 'شخص',
    person_plural: 'أشخاص',
    vehicle_sedan: 'سيارة خاصة',
    vehicle_minibus: 'حافلة صغيرة خاصة',
    vehicle_speedboat: 'زورق سريع خاص',
    vehicle_boat: 'قارب خاص',
    price_suffix: 'للشخص',
    free: 'مجاني',
    from_label: 'من',
  },
  fr: {
    header_participants: 'Participants',
    header_vehicle: 'Véhicule',
    header_price: 'Prix par personne',
    person_singular: 'Personne',
    person_plural: 'Personnes',
    vehicle_sedan: 'Berline privée',
    vehicle_minibus: 'Minibus privé',
    vehicle_speedboat: 'Hors-bord privé',
    vehicle_boat: 'Bateau privé',
    price_suffix: '/pers.',
    free: 'Gratuit',
    from_label: 'dès',
  },
  hu: {
    header_participants: 'Résztvevők',
    header_vehicle: 'Jármű',
    header_price: 'Ár személyenként',
    person_singular: 'fő',
    person_plural: 'fő',
    vehicle_sedan: 'Privát limuzin',
    vehicle_minibus: 'Privát minibusz',
    vehicle_speedboat: 'Privát motorcsónak',
    vehicle_boat: 'Privát hajó',
    price_suffix: '/fő',
    free: 'Ingyenes',
    from_label: '-tól',
  },
  ru: {
    header_participants: 'Участники',
    header_vehicle: 'Транспорт',
    header_price: 'Цена за человека',
    person_singular: 'чел.',
    person_plural: 'чел.',
    vehicle_sedan: 'Частный седан',
    vehicle_minibus: 'Частный минивэн',
    vehicle_speedboat: 'Частный катер',
    vehicle_boat: 'Частная лодка',
    price_suffix: '/чел.',
    free: 'Бесплатно',
    from_label: 'от',
  },
};

export function getPricingLabels(locale: Locale): PricingLabels {
  return LABELS[locale] ?? LABELS.de;
}

export function formatParticipantLabel(
  min: number,
  max: number,
  labels: PricingLabels,
): string {
  const label = min === 1 && max === 1 ? labels.person_singular : labels.person_plural;
  if (min === max) return `${min} ${label}`;
  return `${min} – ${max} ${label}`;
}

export function formatPrice(
  price: number,
  labels: PricingLabels,
): string {
  if (price === 0) return labels.free;
  return `${price} € ${labels.price_suffix}`;
}

export function getVehicleLabel(
  vehicleId: string,
  labels: PricingLabels,
): string {
  const map: Record<string, keyof PricingLabels> = {
    sedan: 'vehicle_sedan',
    minibus: 'vehicle_minibus',
    speedboat: 'vehicle_speedboat',
    boat: 'vehicle_boat',
  };
  const key = map[vehicleId];
  return key ? labels[key] : vehicleId;
}
