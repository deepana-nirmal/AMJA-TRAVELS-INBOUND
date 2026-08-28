// ─────────────────────────────────────────────────────────────
// scripts/seed.js — load editable starter content for the
// Amja Travels INBOUND site into Firestore. Everything here is
// meant to be edited/replaced later through the admin panel.
//
//   node scripts/seed.js            (adds; safe to re-run — will duplicate)
//   node scripts/seed.js --wipe     (clears each collection first)
//
// Local only. Needs scripts/serviceAccountKey.json (Admin SDK).
// No prices, awards, partnerships or statistics are invented —
// figures are left as "On request" for the office to fill in.
// ─────────────────────────────────────────────────────────────
const path = require('path');
const fs = require('fs');

const keyPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(keyPath)) {
  console.error('\n❌ Missing scripts/serviceAccountKey.json (Firebase → Project settings → Service accounts).\n');
  process.exit(1);
}
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
initializeApp({ credential: cert(require(keyPath)) });
const db = getFirestore();
const WIPE = process.argv.includes('--wipe');

// Unsplash direct URLs (free to use) for gallery variety. Swap for
// your own photography in the admin panel whenever you like.
const U = id => `https://images.unsplash.com/${id}?w=1400&q=75&auto=format&fit=crop`;

const DATA = {
  // ── INBOUND TOURS ──────────────────────────────────────────
  tour_packages_inbound: [
    {
      title: 'Classic Sri Lanka — Cities, Hills & Coast',
      destination: 'Cultural Triangle · Kandy · Ella · South Coast',
      duration: '10–12 days',
      price: 'On request',
      description:
        "Our most-requested route, and a good first trip to the island. You start in the dry-zone cultural triangle among the old royal capitals, climb into Kandy and the tea mountains, take the scenic hill-country train, then wind down on the southern beaches before flying home from Colombo.\n\nPrivate throughout with the same driver-guide and vehicle. Every day can be lengthened, shortened or swapped.",
      image_url: 'images/dest-sigiriya.jpg',
      gallery: [
        'images/inbound/destinations/culture-1.jpg',
        'images/dest-highlands.jpg',
        'images/inbound/destinations/coast-1.jpg',
        U('photo-1546708973-b339540b5155'),
      ],
      video_url: 'images/photo/home-video.mp4',
      highlights: [
        'Sigiriya rock fortress at first light',
        'Dambulla cave temples',
        'Temple of the Sacred Tooth, Kandy',
        'Scenic hill-country train to Ella',
        'Yala or Udawalawe safari',
        'Galle Fort and southern beaches',
      ],
      itinerary: [
        'Colombo airport → Sigiriya / Habarana — settle in, evening at leisure',
        'Sigiriya rock fortress at dawn, then Polonnaruwa ancient city by bicycle',
        'Dambulla cave temples → Matale spice garden → Kandy; evening cultural dance',
        'Kandy — Temple of the Tooth, Peradeniya Botanical Gardens, city walk',
        'Kandy → Nuwara Eliya through the tea estates; factory visit and tasting',
        'Scenic train Nanu Oya → Ella; Nine Arch Bridge and Little Adam’s Peak',
        'Ella → Yala; afternoon or next-morning game drive',
        'Yala → south coast (Tangalle / Mirissa) — beach time',
        'Southern beaches — optional whale watching, Galle Fort at sunset',
        'Beach at leisure → Colombo → departure',
      ],
      included: [
        'Private air-conditioned vehicle with English-speaking chauffeur-guide',
        'All accommodation on a bed-and-breakfast basis (upgradable)',
        'All transfers, road tolls, fuel and parking',
        'Hill-country train seat reservation',
        'Airport meet-and-greet on arrival and departure',
        '24/7 in-country support line',
      ],
      additional_info:
        'Best months: December to April for the south and west; the route works year-round with small tweaks. Comfortable walking shoes needed for Sigiriya and the ancient cities. Pace is moderate — tell us if you’d like it slower or with extra beach nights.',
    },
    {
      title: 'Cultural Triangle in Depth',
      destination: 'Sigiriya · Polonnaruwa · Anuradhapura · Kandy',
      duration: '4–6 days',
      price: 'On request',
      description:
        'A focused loop through the heart of ancient Ceylon for travellers who care about history and archaeology. Rock fortresses, cave temples, ruined monasteries and the sacred city of Anuradhapura, finishing in Kandy.',
      image_url: 'images/inbound/destinations/culture-1.jpg',
      gallery: [
        'images/dest-sigiriya.jpg',
        'images/inbound/destinations/culture-2.jpg',
        'images/inbound/destinations/culture-3.jpg',
      ],
      highlights: [
        'Sigiriya and the mirror-wall frescoes',
        'Polonnaruwa by bicycle',
        'Anuradhapura sacred city and Sri Maha Bodhi',
        'Dambulla golden cave temples',
        'Minneriya / Kaudulla elephant gathering (seasonal)',
      ],
      itinerary: [
        'Colombo / airport → Sigiriya',
        'Sigiriya rock at dawn → Pidurangala → village tour',
        'Anuradhapura full day with a specialist guide',
        'Polonnaruwa by bicycle → Dambulla cave temples',
        'Minneriya safari → transfer to Kandy or Colombo',
      ],
      included: [
        'Private vehicle and chauffeur-guide',
        'Accommodation with breakfast',
        'All transfers and fuel',
        'Optional specialist archaeology guide (on request)',
      ],
      additional_info:
        'Site entry tickets are payable locally or can be pre-arranged. Mornings start early to beat the heat and crowds.',
    },
    {
      title: 'Tea Country & the Hill-Country Train',
      destination: 'Kandy · Nuwara Eliya · Ella · Haputale',
      duration: '3–5 days',
      price: 'On request',
      description:
        'Cool air, tea estates on every slope, waterfalls and one of the world’s great train rides. Plantation walks, a working tea factory, and hikes to viewpoints at sunrise.',
      image_url: 'images/dest-highlands.jpg',
      gallery: [
        'images/inbound/destinations/hills-1.jpg',
        'images/inbound/destinations/hills-2.jpg',
        'images/inbound/destinations/hills-3.jpg',
      ],
      highlights: [
        'Kandy → Ella scenic train (reserved seats)',
        'Tea factory visit and tasting',
        'Nine Arch Bridge, Ella',
        'Horton Plains and World’s End',
        'Little Adam’s Peak at sunrise',
      ],
      itinerary: [
        'Kandy → Nuwara Eliya through the estates; factory and tasting',
        'Nuwara Eliya → Horton Plains pre-dawn → World’s End loop; train to Ella',
        'Ella — Nine Arch Bridge, Little Adam’s Peak, Ravana Falls',
        'Ella → Haputale (Lipton’s Seat) → onward',
      ],
      included: [
        'Private vehicle and chauffeur-guide between towns',
        'Train seat reservation for the scenic section',
        'Accommodation with breakfast',
        'Tea factory entry',
      ],
      additional_info:
        'Layers and a light rain jacket are useful — highland mornings are genuinely cold. Horton Plains is a two- to three-hour walk on uneven ground.',
    },
    {
      title: 'Wildlife & National Parks',
      destination: 'Udawalawe · Yala · Wilpattu · Sinharaja',
      duration: '4–6 days',
      price: 'On request',
      description:
        'Leopards, elephant herds, sloth bears and enormous birdlife across the dry-zone parks and the Sinharaja rainforest, on early-morning open-jeep game drives with a naturalist.',
      image_url: 'images/inbound/destinations/wild-1.jpg',
      gallery: [
        'images/inbound/destinations/wild-2.jpg',
        'images/inbound/destinations/wild-3.jpg',
        'images/dest-wildlife.jpg',
      ],
      highlights: [
        'Leopard tracking in Yala or Wilpattu',
        'Elephants at Udawalawe',
        'Sinharaja rainforest walk',
        'Bundala for migratory water birds',
        'Optional Gal Oya boat safari',
      ],
      itinerary: [
        'Colombo → Udawalawe; afternoon game drive',
        'Udawalawe → Yala; dawn game drive next morning',
        'Yala full-day drive or transfer to Sinharaja',
        'Sinharaja guided rainforest walk → onward',
      ],
      included: [
        'Private touring vehicle and chauffeur-guide',
        'Park jeep and tracker for each game drive',
        'Accommodation with breakfast',
        'Naturalist guide in Sinharaja',
      ],
      additional_info:
        'Park fees and jeep hire are quoted separately as they change periodically. Neutral clothing and a zoom lens help. Yala’s Block 1 usually closes in September.',
    },
    {
      title: 'South Coast Unwind',
      destination: 'Galle · Unawatuna · Weligama · Mirissa · Tangalle',
      duration: '4–7 days',
      price: 'On request',
      description:
        'The classic end-of-trip stretch: calm swimming bays, the Dutch fort at Galle, beginner surf, blue-whale boats out of Mirissa in season, and long quiet sands towards Tangalle.',
      image_url: 'images/inbound/destinations/coast-1.jpg',
      gallery: [
        'images/inbound/destinations/coast-2.jpg',
        'images/inbound/destinations/coast-3.jpg',
        'images/dest-beach.jpg',
      ],
      video_url: 'images/photo/hotel-video-1.mp4',
      highlights: [
        'Galle Fort ramparts at sunset',
        'Whale watching from Mirissa (Dec–Apr)',
        'Beginner surf lessons at Weligama',
        'Madu River boat safari',
        'Sea-turtle hatchery near Kosgoda',
      ],
      itinerary: [
        'Transfer to the south coast; Galle Fort walk',
        'Beach day — optional surf lesson or cooking class',
        'Early whale-watching boat → afternoon at leisure',
        'Madu River safari → Tangalle for quieter sand',
      ],
      included: [
        'Private transfers and chauffeur-guide on tour days',
        'Beachfront or near-beach accommodation with breakfast',
        'Galle Fort walking guide',
      ],
      additional_info:
        'Sea conditions vary by month and beach; we’ll steer you to the calmest swimming at the time you travel. Whale watching runs roughly December to April.',
    },
    {
      title: 'Tailor-made — Your Own Route',
      destination: 'Island-wide',
      duration: 'Your choice',
      price: 'Bespoke',
      description:
        'Start from a blank page. Send us your dates, rough budget, who’s travelling and the things you don’t want to miss, and we’ll design the whole trip around you — then adjust it until it’s right.',
      image_url: 'images/tours-bespoke.jpg',
      gallery: [
        'images/dest-sigiriya.jpg',
        'images/dest-highlands.jpg',
        'images/dest-wildlife.jpg',
        'images/dest-beach.jpg',
      ],
      highlights: [
        'Built entirely around your interests and pace',
        'Family-friendly pacing on request',
        'Honeymoon, photography and birding specialists available',
        'One coordinator from first message to airport drop-off',
      ],
      itinerary: [
        'Tell us your dates, group and must-sees',
        'We send a draft route with a day-by-day outline',
        'We refine it together and price it transparently',
        'You travel — with 24/7 support on the ground',
      ],
      included: [
        'Custom itinerary planning with unlimited revisions before booking',
        'Private vehicle and chauffeur-guide',
        'Accommodation to your comfort level',
        'All transfers and 24/7 in-country support',
      ],
      additional_info:
        'There is no charge to plan and quote a tailor-made trip. We’ll be honest about what does and doesn’t work for your dates.',
    },
  ],

  // ── HOTELS ─────────────────────────────────────────────────
  hotels: [
    {
      name: 'Beachfront Resort — South Coast',
      location: 'Bentota / Beruwala',
      rating: '5-Star',
      price: 'Rates on request',
      description:
        'A full-service beachfront resort on a calm west-coast bay — large pool, spa, several restaurants and direct beach access. A comfortable, reliable choice for the start or end of a trip.',
      image_url: 'images/photo/hotel-1.jpeg',
      gallery: ['images/photo/hotel-2.jpeg', 'images/photo/hotel-3.jpeg', U('photo-1571896349842-33c89424de2d')],
      amenities: ['Beachfront', 'Swimming pool', 'Spa', 'Multiple restaurants', 'Family rooms', 'Airport transfer'],
      booking_url: '',
      additional_info: 'About 1.5–2 hours from Colombo airport by expressway. Good for families; calm swimming most of the year.',
    },
    {
      name: 'Boutique Fort Villa — Galle',
      location: 'Galle',
      rating: 'Boutique',
      price: 'Rates on request',
      description:
        'A restored merchant house inside Galle Fort — a handful of rooms around a courtyard, rooftop for sundowners, and the ramparts a two-minute walk away.',
      image_url: 'images/photo/hotel-2.jpeg',
      gallery: ['images/inbound/destinations/coast-3.jpg', 'images/photo/hotel-4.jpeg'],
      amenities: ['Inside Galle Fort', 'Plunge pool', 'Rooftop terrace', 'Breakfast to order', 'Airport transfer'],
      booking_url: '',
      additional_info: 'Historic building — rooms vary in size and layout. No beach on site; nearest swimming beach is a short drive.',
    },
    {
      name: 'Tea Estate Bungalow — Hill Country',
      location: 'Nuwara Eliya / Hatton',
      rating: 'Boutique',
      price: 'Rates on request',
      description:
        'A colonial-era planter’s bungalow among working tea fields, run on a house-party basis — open fires, set dinners, and walks straight from the garden into the estate.',
      image_url: 'images/photo/hotel-3.jpeg',
      gallery: ['images/inbound/destinations/hills-1.jpg', 'images/inbound/destinations/hills-3.jpg', U('photo-1520250497591-112f2f40a3f4')],
      amenities: ['Full board', 'Log fires', 'Estate walks', 'Butler service', 'Garden'],
      booking_url: '',
      additional_info: 'Cold in the evenings — pack layers. Usually a two-night minimum. Roads in are narrow and slow.',
    },
    {
      name: 'City Hotel — Colombo',
      location: 'Colombo',
      rating: '4–5 Star',
      price: 'Rates on request',
      description:
        'A well-located city hotel for first and last nights — rooftop pool, easy access to Galle Face and the old town, and a reliable airport transfer.',
      image_url: 'images/photo/hotel-4.jpeg',
      gallery: ['images/photo/hotel-5.jpeg', U('photo-1566073771259-6a8506099945')],
      amenities: ['Rooftop pool', 'Central location', 'Restaurants', 'Gym', 'Airport transfer'],
      booking_url: '',
      additional_info: 'About 45–60 minutes from the airport depending on traffic. Handy for an early flight or a late arrival.',
    },
    {
      name: 'Safari Lodge — Yala / Udawalawe',
      location: 'Yala / Udawalawe',
      rating: 'Boutique / Tented',
      price: 'Rates on request',
      description:
        'Tented and cabin lodges on the edge of the parks — early breakfasts before the game drive, pool for the heat of the day, and dinner under the stars.',
      image_url: 'images/inbound/destinations/wild-3.jpg',
      gallery: ['images/inbound/destinations/wild-1.jpg', 'images/inbound/destinations/wild-2.jpg'],
      amenities: ['Near park entrance', 'Pool', 'Full board options', 'Guided drives arranged', 'Nature deck'],
      booking_url: '',
      additional_info: 'Remote — bring anything you can’t do without. Wildlife occasionally wanders through the grounds.',
    },
  ],

  // ── FLEET ──────────────────────────────────────────────────
  fleet: [
    {
      name: 'Standard Car', vehicle_category: 'Standard Car', model: 'Toyota Axio / Nissan Sunny or similar',
      capacity: '2–3 passengers', price: 'Per-day rate on request',
      description: 'A comfortable air-conditioned saloon for couples or a small family travelling light. Economical for city stays and short tours.',
      image_url: 'images/inbound/fleet/fleet-d.jpg',
      gallery: ['images/inbound/fleet/fleet-b.jpg'],
      features: ['Air-conditioned', 'Automatic', '2 suitcases', 'Bottled water', 'Chauffeur-guide included'],
      additional_info: 'Best for 2 people with normal luggage. For 3 adults plus bags, consider the Semi-Executive or an SUV.',
    },
    {
      name: 'Executive Car', vehicle_category: 'Executive Car', model: 'Toyota Premio / Allion or similar',
      capacity: '2–3 passengers', price: 'Per-day rate on request',
      description: 'A roomier, quieter sedan for longer touring days and airport transfers where comfort matters.',
      image_url: 'images/inbound/fleet/fleet-c.jpg',
      gallery: ['images/inbound/fleet/fleet-a.jpg'],
      features: ['Air-conditioned', 'Automatic', '3 suitcases', 'Extra legroom', 'Chauffeur-guide included'],
      additional_info: 'A good all-round choice for two travellers doing a full island route.',
    },
    {
      name: 'Luxury Sedan', vehicle_category: 'Luxury Car', model: 'Mercedes-Benz E-Class / BMW 5 Series or similar',
      capacity: '2–3 passengers', price: 'Per-day rate on request',
      description: 'Premium sedan for VIP airport transfers, special occasions and travellers who want the highest comfort on the road.',
      image_url: 'images/inbound/fleet/fleet-c.jpg',
      gallery: ['images/inbound/fleet/fleet-b.jpg'],
      features: ['Premium air-conditioning', 'Automatic', 'Leather interior', 'Bottled water & Wi-Fi', 'Chauffeur-guide included'],
      additional_info: 'Subject to availability — best booked well ahead. Luggage capacity is similar to the executive car.',
    },
    {
      name: 'Mini SUV (4×4)', vehicle_category: 'Mini SUV', model: 'Hyundai Tucson / Kia Sportage or similar',
      capacity: '3–4 passengers', price: 'Per-day rate on request',
      description: 'Higher ground clearance for hill-country roads and rougher tracks, with room for four and their bags.',
      image_url: 'images/inbound/fleet/fleet-b.jpg',
      gallery: ['images/inbound/fleet/fleet-a.jpg'],
      features: ['Air-conditioned', '4×4', '3 suitcases', 'Raised ride height', 'Chauffeur-guide included'],
      additional_info: 'Comfortable for a family of four on a full tour; also popular for the tea country.',
    },
    {
      name: 'Large SUV (4×4)', vehicle_category: 'Large SUV', model: 'Toyota Prado / Fortuner or similar',
      capacity: '4–6 passengers', price: 'Per-day rate on request',
      description: 'A sturdy seven-seater for families and small groups, and the choice for rougher park access roads.',
      image_url: 'images/inbound/fleet/fleet-b.jpg',
      gallery: ['images/inbound/fleet/fleet-c.jpg'],
      features: ['Air-conditioned', '4×4', '4 suitcases', 'Third-row seating', 'Chauffeur-guide included'],
      additional_info: 'With the third row up, luggage space is limited — tell us your bag count and we’ll advise.',
    },
    {
      name: 'Passenger Van', vehicle_category: 'Minivan', model: 'Toyota KDH / Hiace or similar',
      capacity: '6–10 passengers', price: 'Per-day rate on request',
      description: 'The workhorse for groups and families — high roof, plenty of luggage room, and easy to get in and out of.',
      image_url: 'images/inbound/fleet/fleet-a.jpg',
      gallery: ['images/inbound/fleet/fleet-d.jpg'],
      features: ['Air-conditioned', 'High roof', '8+ suitcases', 'Reclining seats', 'Chauffeur-guide included'],
      additional_info: 'Configurations vary — some seat 6 with a big luggage bay, others up to 10 with less space. We’ll match it to your group.',
    },
    {
      name: 'Minibus / Coach', vehicle_category: 'Minivan', model: '22–33 seat coach or similar',
      capacity: '15–33 passengers', price: 'Per-day rate on request',
      description: 'For larger groups, incentive trips and events — full-size coaches with a driver and, on request, a separate tour guide.',
      image_url: 'images/inbound/fleet/fleet-a.jpg',
      gallery: ['images/inbound/fleet/fleet-c.jpg'],
      features: ['Air-conditioned', 'PA system', 'Large luggage hold', 'Driver + optional guide'],
      additional_info: 'Sizes from 22 to 33+ seats. Share your group size and route and we’ll quote the right vehicle.',
    },
  ],

  // ── DESTINATIONS ───────────────────────────────────────────
  destinations_inbound: [
    {
      name: 'Cultural Triangle', region: 'Centre-north', tagline: 'Rock fortresses and ancient royal cities',
      description:
        'Sigiriya, Polonnaruwa, Anuradhapura and Dambulla — the old capitals of Ceylon, ringed around Kandy. History-heavy: climb the rock at dawn, explore cave temples, cycle among ruins, and visit forest monasteries. Usually two to three nights, based near Sigiriya or Habarana.',
      image_url: 'images/inbound/destinations/culture-1.jpg',
      gallery: ['images/dest-sigiriya.jpg', 'images/inbound/destinations/culture-2.jpg', 'images/inbound/destinations/culture-3.jpg'],
      highlights: ['Sigiriya rock fortress', 'Dambulla cave temples', 'Polonnaruwa by bicycle', 'Anuradhapura sacred city', 'Minneriya elephant gathering', 'Temple of the Tooth, Kandy'],
    },
    {
      name: 'Hill Country', region: 'The middle mountains', tagline: 'Tea estates, cool air and the scenic train',
      description:
        'Nuwara Eliya, Ella, Haputale and Hatton — tea on every slope, waterfalls, and the Kandy–Ella train that people plan whole trips around. Add plantation walks, a tea-factory visit and the Horton Plains hike to World’s End.',
      image_url: 'images/inbound/destinations/hills-1.jpg',
      gallery: ['images/dest-highlands.jpg', 'images/inbound/destinations/hills-2.jpg', 'images/inbound/destinations/hills-3.jpg'],
      highlights: ['Scenic hill-country train', 'Nine Arch Bridge, Ella', 'Horton Plains & World’s End', 'Tea factory & tasting', 'Little Adam’s Peak at sunrise'],
    },
    {
      name: 'South Coast', region: 'The southern shore', tagline: 'Calm bays, Galle Fort and whales in season',
      description:
        'Galle, Unawatuna, Mirissa, Weligama and Tangalle — the classic end-of-trip beaches, with the Dutch fort at Galle to break up the sand. Calm swimming, beginner surf, and blue-whale boats out of Mirissa from December to April.',
      image_url: 'images/inbound/destinations/coast-1.jpg',
      gallery: ['images/dest-beach.jpg', 'images/inbound/destinations/coast-2.jpg', 'images/inbound/destinations/coast-3.jpg'],
      highlights: ['Galle Fort at sunset', 'Whale watching from Mirissa', 'Beginner surf at Weligama', 'Madu River boat safari', 'Quiet sands at Tangalle'],
    },
    {
      name: 'National Parks', region: 'Dry-zone wilderness', tagline: 'Leopards, elephants and huge birdlife',
      description:
        'Yala, Udawalawe, Wilpattu, Kumana and Bundala — mostly explored on open-jeep game drives. Yala has the highest leopard density but gets busy; Wilpattu is wilder and quieter; Udawalawe is the reliable one for elephants.',
      image_url: 'images/inbound/destinations/wild-1.jpg',
      gallery: ['images/dest-wildlife.jpg', 'images/inbound/destinations/wild-2.jpg', 'images/inbound/destinations/wild-3.jpg'],
      highlights: ['Leopard tracking in Yala & Wilpattu', 'Elephants at Udawalawe', 'Sloth bears (Feb–Jul)', 'Bundala for migratory birds', 'Sinharaja rainforest walk'],
    },
    {
      name: 'East & Adventure', region: 'East coast & the outdoors', tagline: 'Surf, clear water and white-water rafting',
      description:
        'Arugam Bay, Trincomalee, Passikudah and inland Kitulgala — at their best from May to September when the south is wet. Surf capital in the east, some of the island’s clearest water, and rafting and canyoning inland.',
      image_url: 'images/inbound/destinations/adv-1.jpg',
      gallery: ['images/dest-surfing.jpg', 'images/inbound/destinations/adv-2.jpg', 'images/inbound/destinations/adv-3.jpg'],
      highlights: ['Surf at Arugam Bay (May–Sep)', 'Snorkelling at Pigeon Island', 'White-water rafting, Kitulgala', 'Whale watching off Trincomalee', 'Quiet beaches at Passikudah'],
    },
  ],
};

async function wipe(col) {
  const snap = await db.collection(col).get();
  const batch = db.batch();
  snap.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
  return snap.size;
}

(async () => {
  const now = new Date().toISOString();
  for (const [col, items] of Object.entries(DATA)) {
    if (WIPE) { const n = await wipe(col); console.log(`  wiped ${n} from ${col}`); }
    let i = 0;
    for (const it of items) {
      // pad created_at so admin/list ordering is stable
      const created = new Date(Date.now() + (i++ * 1000)).toISOString();
      await db.collection(col).add({ ...it, created_at: created, updated_at: now, seeded: true });
    }
    console.log(`✅ ${col}: ${items.length} items added`);
  }
  console.log('\nSeed complete. Open the admin panel to edit them.\n');
  process.exit(0);
})().catch(e => { console.error('❌', e.message); process.exit(1); });
