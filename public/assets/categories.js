// ─────────────────────────────────────────────────────────────
// categories.js  — single source of truth for the catalog schema.
// Ported from the old backend config so client + admin stay in sync.
// Each category maps to a Firestore collection of documents.
// ─────────────────────────────────────────────────────────────

export const CATEGORIES = {
  inbound: {
    collection: 'tour_packages_inbound',
    label: 'Inbound Tours',
    fields: ['title', 'destination', 'price', 'duration', 'description', 'image_url', 'highlights'],
    required: ['title'],
    arrays: ['highlights'],
  },
  outbound: {
    collection: 'tour_packages_outbound',
    label: 'Outbound Tours',
    fields: ['title', 'destination', 'price', 'duration', 'description', 'image_url', 'highlights'],
    required: ['title'],
    arrays: ['highlights'],
  },
  hajj: {
    collection: 'hajj_packages',
    label: 'Hajj Tours',
    fields: ['title', 'destination', 'price', 'duration', 'description', 'image_url', 'includes'],
    required: ['title'],
    arrays: ['includes'],
  },
  umrah: {
    collection: 'umrah_packages',
    label: 'Umrah Tours',
    fields: ['title', 'destination', 'price', 'duration', 'description', 'image_url', 'includes'],
    required: ['title'],
    arrays: ['includes'],
  },
  hotels: {
    collection: 'hotels',
    label: 'Hotels',
    fields: ['name', 'location', 'rating', 'price', 'description', 'image_url', 'booking_url', 'amenities'],
    required: ['name'],
    arrays: ['amenities'],
  },
  fleet: {
    collection: 'fleet',
    label: 'Fleet',
    fields: ['name', 'vehicle_category', 'model', 'capacity', 'price', 'description', 'image_url', 'features'],
    required: ['name', 'vehicle_category'],
    arrays: ['features'],
    options: {
      vehicle_category: [
        'Mini Car', 'Standard Car', 'Semi Executive Car', 'Executive Car',
        'Luxury Car', 'Mini SUV', 'Large SUV', 'Minivan',
      ],
    },
  },
  flights: {
    collection: 'flights',
    label: 'Flights',
    fields: ['route', 'airline', 'fare', 'duration', 'description', 'image_url', 'notes'],
    required: ['route'],
    arrays: ['notes'],
  },
};

// Extra enquiry fields per category (beyond name/email/phone/message).
export const ENQUIRY_FIELDS = {
  inbound:  ['travel_date', 'people'],
  outbound: ['travel_date', 'people', 'destination'],
  fleet:    ['pickup_date', 'rental_days', 'passengers', 'vehicle_category'],
  hajj:     ['preferred_month', 'pax'],
  umrah:    ['preferred_month', 'pax'],
  hotels:   ['check_in', 'nights', 'guests'],
  flights:  ['travel_date', 'passengers'],
  general:  [],
};

export function getCategory(cat) {
  if (!cat) return null;
  return CATEGORIES[cat.toLowerCase()] || null;
}

// Every catalog collection name — used by security rules mirror & admin.
export const CATALOG_COLLECTIONS = Object.values(CATEGORIES).map(c => c.collection);
