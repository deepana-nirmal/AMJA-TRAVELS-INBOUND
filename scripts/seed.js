// ─────────────────────────────────────────────────────────────
// scripts/seed.js — load all catalog content into Firestore as
// pre-added, editable items (tours, spiritual, hotels, fleet, flights).
// Local only, uses the Admin SDK + serviceAccountKey.json.
//
//   node scripts/seed.js            (adds/merges; safe to re-run)
//   node scripts/seed.js --wipe     (clears each collection first)
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

// Unsplash direct image URLs (free to use). Stable photo IDs.
const U = id => `https://images.unsplash.com/${id}?w=1200&q=80&auto=format&fit=crop`;

const DATA = {
  tour_packages_inbound: [
    { title:'Ancient Cities', destination:'Sigiriya · Polonnaruwa · Kandy', price:'On request', duration:'3–5 days',
      description:"Sigiriya, Polonnaruwa, Anuradhapura and Kandy — the heart of Ceylon's heritage.",
      image_url:U('photo-1588598198321-9735fd52455b'), highlights:['Sigiriya Rock','Dalada Maligawa','Ancient ruins'] },
    { title:'Tea & Highlands', destination:'Ella · Nuwara Eliya · Hatton', price:'On request', duration:'2–4 days',
      description:'Misty peaks, waterfalls, tea estates and the scenic hill-country train.',
      image_url:U('photo-1546708973-b339540b5155'), highlights:['Nine Arch Bridge','Tea factory','Scenic train'] },
    { title:'Beaches & Whales', destination:'Mirissa · Bentota · Unawatuna', price:'On request', duration:'2–4 days',
      description:'Golden sand, surf, snorkelling and whale watching on the south coast.',
      image_url:U('photo-1552465011-b4e21bf6e79a'), highlights:['Whale watching','Beach stays','Galle Fort'] },
    { title:'Wildlife Safari', destination:'Yala · Udawalawe · Wilpattu', price:'On request', duration:'2–3 days',
      description:'Leopards, elephants and open-jeep safaris in the great national parks.',
      image_url:U('photo-1534177616072-ef7dc120449d'), highlights:['Leopard safari','Elephant herds','Bird life'] },
    { title:'Surf & Rivers', destination:'Kitulgala · Arugam Bay · Hikkaduwa', price:'On request', duration:'2–4 days',
      description:'White-water rafting, world-class surf breaks and coral reefs.',
      image_url:U('photo-1502680390469-be75c86b636f'), highlights:['White-water rafting','Surf breaks','Reef snorkel'] },
    { title:'Tailor-made Route', destination:'Island-wide', price:'Bespoke', duration:'Your choice',
      description:'Tell us your dates and interests — we design the whole trip around you.',
      image_url:U('photo-1566296314736-6eaac1ca0cb9'), highlights:['Custom itinerary','Private guide','Flexible pace'] },
  ],
  tour_packages_outbound: [
    { title:'Dubai & Abu Dhabi', destination:'United Arab Emirates', price:'On request', duration:'4–7 days',
      description:'City breaks, desert safaris and family theme parks with premium stays.',
      image_url:U('photo-1512453979798-5ea266f8880c'), highlights:['Burj Khalifa','Desert safari','Theme parks'] },
    { title:'Maldives Getaway', destination:'Maldives', price:'On request', duration:'3–6 days',
      description:'Overwater villas, honeymoons and all-inclusive resort escapes.',
      image_url:U('photo-1514282401047-d79a71a590e8'), highlights:['Overwater villa','Snorkelling','All-inclusive'] },
    { title:'Singapore City & Family', destination:'Singapore', price:'On request', duration:'4–6 days',
      description:'Gardens, Sentosa and shopping — perfect for families and first-timers.',
      image_url:U('photo-1525625293386-3f8f99389edd'), highlights:['Gardens by the Bay','Sentosa','Universal Studios'] },
    { title:'Grand Europe Tour', destination:'Europe', price:'On request', duration:'8–14 days',
      description:'Multi-country itineraries with guided highlights and comfortable hotels.',
      image_url:U('photo-1471623320832-752e8bbf8413'), highlights:['Multi-country','Guided tours','Central hotels'] },
    { title:'Thailand & Beyond', destination:'Thailand · Malaysia · Bali', price:'On request', duration:'5–10 days',
      description:'Beaches, culture and cuisine across Southeast Asia.',
      image_url:U('photo-1528181304800-259b08848526'), highlights:['Island hopping','Street food','Temples'] },
    { title:'Your Dream Trip', destination:'Worldwide', price:'Bespoke', duration:'Your choice',
      description:"Anywhere in the world — tell us the vision and we'll build it.",
      image_url:U('photo-1488646953014-85cb44e25828'), highlights:['Custom','Flights + hotels','One contact'] },
  ],
  hajj_packages: [
    { title:'Standard Hajj', destination:'Makkah · Mina · Arafah', price:'On request', duration:'20–35 days',
      description:'Complete Hajj package with Mina, Arafah and Muzdalifah arrangements.',
      image_url:U('photo-1537444532052-6c3f0d5a5c5e'), includes:['Full Hajj rites','Mina tents','Meals','Experienced Ulama'] },
    { title:'Premium Hajj', destination:'Makkah · Mina · Arafah', price:'On request', duration:'20–35 days',
      description:'Upgraded tents, closer accommodation and dedicated group Ulama.',
      image_url:U('photo-1591604129939-f1efa4d9f7fa'), includes:['VIP Mina tents','Closer hotels','Dedicated Ulama','Full board'] },
    { title:'VIP Hajj', destination:'Makkah · Mina · Arafah', price:'On request', duration:'20–35 days',
      description:'Five-star hotels beside the Haramain, private transport and full concierge care.',
      image_url:U('photo-1565019011521-b0575ca3c1b0'), includes:['5-star hotels','Private transport','Concierge','Dedicated Ulama'] },
    { title:'Family & Group Hajj', destination:'Makkah · Madinah', price:'Bespoke', duration:'20–35 days',
      description:'Custom group departures for families, mosques and communities.',
      image_url:U('photo-1519817650390-64a93db51149'), includes:['Group rates','Flexible dates','Ulama','Full board'] },
  ],
  umrah_packages: [
    { title:'Economy Umrah', destination:'Makkah · Madinah', price:'On request', duration:'10–14 days',
      description:'Guided Umrah with quality shared accommodation close to the Haramain.',
      image_url:U('photo-1591604129939-f1efa4d9f7fa'), includes:['Accommodation','Meals','A/C transport','Ulama guidance'] },
    { title:'Premium Umrah', destination:'Makkah · Madinah', price:'On request', duration:'10–14 days',
      description:'Five-star stays steps from the Masjid, full board and private transport.',
      image_url:U('photo-1565019011521-b0575ca3c1b0'), includes:['5-star hotel','Full board','Private transport','Ziyarah tours'] },
    { title:'Ramadan Umrah', destination:'Makkah · Madinah', price:'On request', duration:'10–20 days',
      description:'Special Ramadan departures with Laylatul Qadr in the Haramain.',
      image_url:U('photo-1519817650390-64a93db51149'), includes:['Ramadan dates','Iftar arrangements','Ulama','Ziyarah'] },
    { title:'Family & Group Umrah', destination:'Makkah · Madinah', price:'Bespoke', duration:'10–14 days',
      description:'Custom group departures for families, mosques and communities.',
      image_url:U('photo-1537444532052-6c3f0d5a5c5e'), includes:['Group rates','Flexible dates','Ulama','Full board'] },
  ],
  hotels: [
    { name:'Eden Resort & Spa', location:'Beruwala', rating:'5-Star', price:'From LKR',
      description:'A five-star beachfront resort with spa, pools and fine dining.',
      image_url:U('photo-1571896349842-33c89424de2d'), booking_url:'', amenities:['Beachfront','Spa','Pool','Restaurants'] },
    { name:'Aditya Resort', location:'Galle', rating:'Boutique', price:'From LKR',
      description:'Boutique luxury on the south coast — private and intimate.',
      image_url:U('photo-1582719508461-905c673771fd'), booking_url:'', amenities:['Boutique','Private villas','Ocean view'] },
    { name:'Deer Park Hotel', location:'Polonnaruwa', rating:'4-Star', price:'From LKR',
      description:'Nature-surrounded comfort near the ancient cultural triangle.',
      image_url:U('photo-1566073771259-6a8506099945'), booking_url:'', amenities:['Nature','Pool','Cultural triangle'] },
    { name:'Mahaweli Reach', location:'Kandy', rating:'4-Star', price:'From LKR',
      description:'Riverside elegance in the hill capital, close to the Temple.',
      image_url:U('photo-1520250497591-112f2f40a3f4'), booking_url:'', amenities:['Riverside','Pool','Near Temple'] },
  ],
  fleet: [
    { name:'Mini Car', vehicle_category:'Mini Car', model:'Mazda Demio or Similar', capacity:'4 Passengers', price:'Per day',
      description:'Economical and easy to drive — ideal for city trips and couples.',
      image_url:U('photo-1541899481282-d53bffe3c35d'), features:['2 Luggage','Automatic','A/C','Budget'] },
    { name:'Standard Car', vehicle_category:'Standard Car', model:'Nissan Sunny or Similar', capacity:'4 Passengers', price:'Per day',
      description:'A comfortable, reliable standard car for everyday travel.',
      image_url:U('photo-1549317661-bd32c8ce0db2'), features:['2 Luggage','Automatic','A/C','Value'] },
    { name:'Semi Executive Car', vehicle_category:'Semi Executive Car', model:'Toyota Corolla or Similar', capacity:'4 Passengers', price:'Per day',
      description:'Extra comfort and space for longer journeys.',
      image_url:U('photo-1550355291-bbee04a92027'), features:['3 Luggage','Automatic','A/C','Comfort'] },
    { name:'Executive Car', vehicle_category:'Executive Car', model:'Toyota Allion or Similar', capacity:'4 Passengers', price:'Per day',
      description:'A refined executive sedan for business and premium travel.',
      image_url:U('photo-1552519507-da3b142c6e3d'), features:['3 Luggage','Automatic','A/C','Executive'] },
    { name:'Luxury Car', vehicle_category:'Luxury Car', model:'BMW 320D or Similar', capacity:'4 Passengers', price:'Per day',
      description:'Premium luxury sedan for VIP transfers and special occasions.',
      image_url:U('photo-1555215695-3004980ad54e'), features:['2–3 Luggage','Automatic','Premium A/C','Luxury','VIP Transfer'] },
    { name:'Mini SUV (4×4)', vehicle_category:'Mini SUV', model:'Hyundai Tucson or Similar', capacity:'5 Passengers', price:'Per day',
      description:'Compact 4×4 great for hill country and light off-road.',
      image_url:U('photo-1519641471654-76ce0107ad1b'), features:['3 Luggage','Automatic 4WD','A/C','Off-Road','Family'] },
    { name:'Large SUV (4×4)', vehicle_category:'Large SUV', model:'Toyota Prado or Similar', capacity:'7 Passengers', price:'Per day',
      description:'Spacious 4×4 for safaris, group tours and rough terrain.',
      image_url:U('photo-1533473359331-0135ef1b58bf'), features:['4 Luggage','Automatic 4WD','Premium A/C','Safari','Group'] },
    { name:'Land Cruiser 200', vehicle_category:'Large SUV', model:'Toyota Land Cruiser or Similar', capacity:'7 Passengers', price:'Per day',
      description:'Premium V8 4×4 for VIP safaris and luxury off-road travel.',
      image_url:U('photo-1594502184342-2e12f877aa73'), features:['4 Luggage','Automatic V8','Premium A/C','VIP','Premium 4WD'] },
    { name:'Minivan / Station Wagon', vehicle_category:'Minivan', model:'Nissan Vanet or Similar', capacity:'8–10 Passengers', price:'Per day',
      description:'Great for groups, pilgrimages and corporate travel.',
      image_url:U('photo-1558618666-fcd25c85cd64'), features:['6+ Luggage','Automatic','A/C','Groups','Pilgrimages'] },
    { name:'High-Roof Minivan', vehicle_category:'Minivan', model:'Toyota KDH or Similar', capacity:'12 Passengers', price:'Per day',
      description:'High-roof van for large groups, tours and events.',
      image_url:U('photo-1543465077-db45d34b88a5'), features:['8+ Luggage','Manual','A/C','Large Groups','Tours'] },
  ],
  flights: [
    { route:'Colombo → Dubai', airline:'Leading carriers', fare:'Best fare', duration:'~4h 30m',
      description:'Frequent departures on leading carriers, great for connections.',
      image_url:U('photo-1512453979798-5ea266f8880c'), notes:['Frequent departures','Great connections'] },
    { route:'Colombo → Maldives', airline:'SriLankan & others', fare:'Best fare', duration:'~1h 15m',
      description:'Quick hops to island resorts, ideal for honeymooners.',
      image_url:U('photo-1514282401047-d79a71a590e8'), notes:['Short hop','Resort transfers'] },
    { route:'Colombo → Singapore', airline:'Full-service airlines', fare:'Best fare', duration:'~4h 20m',
      description:'Business and leisure fares with smooth onward connections.',
      image_url:U('photo-1525625293386-3f8f99389edd'), notes:['Business & leisure','Onward hubs'] },
    { route:'Colombo → London', airline:'Major full-service', fare:'Best fare', duration:'~11h',
      description:'Competitive long-haul fares on major full-service airlines.',
      image_url:U('photo-1513635269975-59663e0ac1ad'), notes:['Long-haul','Full-service'] },
    { route:'Colombo → Jeddah', airline:'SriLankan & Saudia', fare:'Best fare', duration:'~6h',
      description:'Pilgrimage and family routes to the Kingdom.',
      image_url:U('photo-1591604129939-f1efa4d9f7fa'), notes:['Umrah/Hajj','Family routes'] },
    { route:'Custom Routing', airline:'All major airlines', fare:'On request', duration:'Varies',
      description:"Tell us where you're headed — we'll find the best fare and routing.",
      image_url:U('photo-1436491865332-7a61a109cc05'), notes:['Any destination','Best-fare search'] },
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
    for (const it of items) {
      await db.collection(col).add({ ...it, created_at: now, updated_at: now, seeded: true });
    }
    console.log(`✅ ${col}: ${items.length} items added`);
  }
  console.log('\nSeed complete. Open the admin panel to see them.\n');
  process.exit(0);
})().catch(e => { console.error('❌', e.message); process.exit(1); });
