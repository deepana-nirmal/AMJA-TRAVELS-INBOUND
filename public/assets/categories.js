// ─────────────────────────────────────────────────────────────
// categories.js  — single source of truth for the catalog schema.
// Ported from the old backend config so client + admin stay in sync.
// Each category maps to a Firestore collection of documents.
// ─────────────────────────────────────────────────────────────

export const CATEGORIES = {
  inbound: {
    collection: 'tour_packages_inbound',
    label: 'Inbound Tours',
    inbound: true,
    fields: ['title', 'destination', 'duration', 'price', 'description', 'image_url',
             'gallery', 'video_url', 'highlights', 'itinerary', 'included', 'additional_info'],
    required: ['title'],
    arrays: ['gallery', 'highlights', 'itinerary', 'included'],
    longtext: ['description', 'additional_info'],
    hints: {
      gallery: 'One image URL per line — shown in the tour gallery / lightbox.',
      video_url: 'Optional MP4 URL (or /images/… path). Kept lazy-loaded on the tour page.',
      itinerary: 'One day per line, e.g. "Colombo → Sigiriya — climb the rock fortress at dawn".',
      included: 'One item per line — what the price covers.',
      highlights: 'One highlight per line — the headline experiences.',
      additional_info: 'Good-to-know notes: best season, fitness level, what to pack, etc.',
    },
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
    inbound: true,
    fields: ['name', 'location', 'rating', 'price', 'description', 'image_url',
             'gallery', 'video_url', 'amenities', 'booking_url', 'additional_info'],
    required: ['name'],
    arrays: ['gallery', 'amenities'],
    longtext: ['description', 'additional_info'],
    hints: {
      gallery: 'One image URL per line — room, pool, dining, views.',
      amenities: 'One facility per line — Pool, Spa, Beachfront, Restaurant…',
      rating: 'Free text — e.g. "5-Star", "Boutique", "4-Star".',
      additional_info: 'Check-in/out, location notes, nearby attractions.',
    },
  },
  fleet: {
    collection: 'fleet',
    label: 'Fleet',
    inbound: true,
    fields: ['name', 'vehicle_category', 'model', 'capacity', 'price', 'description', 'image_url',
             'gallery', 'features', 'additional_info'],
    required: ['name', 'vehicle_category'],
    arrays: ['gallery', 'features'],
    longtext: ['description', 'additional_info'],
    hints: {
      gallery: 'One image URL per line — exterior, interior, luggage space.',
      features: 'One feature per line — A/C, Automatic, 3 Luggage, Wi-Fi…',
      capacity: 'e.g. "4 Passengers" or "10–12 Passengers".',
    },
    options: {
      vehicle_category: [
        'Mini Car', 'Standard Car', 'Semi Executive Car', 'Executive Car',
        'Luxury Car', 'Mini SUV', 'Large SUV', 'Minivan',
      ],
    },
  },
  destinations: {
    collection: 'destinations_inbound',
    label: 'Destinations',
    inbound: true,
    fields: ['name', 'region', 'tagline', 'description', 'image_url', 'gallery', 'video_url', 'highlights'],
    required: ['name'],
    arrays: ['gallery', 'highlights'],
    longtext: ['description'],
    hints: {
      region: 'e.g. "Hill Country", "South Coast", "Cultural Triangle".',
      tagline: 'One short line shown under the name on cards.',
      gallery: 'One image URL per line for the destination gallery.',
      highlights: 'One thing to do / see per line.',
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

// Categories the Inbound admin manages (order matters for the sidebar).
export const INBOUND_CATEGORIES = Object.entries(CATEGORIES)
  .filter(([, c]) => c.inbound)
  .map(([k]) => k);

// Every catalog collection name — used by security rules mirror & admin.
export const CATALOG_COLLECTIONS = Object.values(CATEGORIES).map(c => c.collection);
