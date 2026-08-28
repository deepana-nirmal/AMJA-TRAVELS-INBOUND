// ─────────────────────────────────────────────────────────────
// db.js — thin Firestore read/write helpers (client SDK).
// Public pages use the read helpers; admin uses write helpers.
// What each caller is allowed to do is enforced by Security Rules,
// NOT by this file — this is just convenience wrappers.
// ─────────────────────────────────────────────────────────────

import { db } from './firebase-init.js';
import {
  collection, getDocs, getDoc, doc, addDoc, setDoc, updateDoc,
  deleteDoc, query, orderBy, where, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getCategory } from './categories.js';

// ── READ: list all items in a category (public) ──
export async function listItems(cat) {
  const c = getCategory(cat);
  if (!c) throw new Error('Unknown category: ' + cat);
  const snap = await getDocs(collection(db, c.collection));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── READ: one item ──
export async function getItem(cat, id) {
  const c = getCategory(cat);
  if (!c) throw new Error('Unknown category: ' + cat);
  const snap = await getDoc(doc(db, c.collection, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ── WRITE: create/update an item (admin only — rules enforce) ──
export async function saveItem(cat, data, id = null) {
  const c = getCategory(cat);
  if (!c) throw new Error('Unknown category: ' + cat);
  // keep only allowed fields
  const clean = {};
  c.fields.forEach(f => { if (data[f] !== undefined) clean[f] = data[f]; });
  // normalize array fields — one entry per line (commas are kept, so
  // itinerary lines and captions may contain them safely)
  (c.arrays || []).forEach(f => {
    if (typeof clean[f] === 'string') {
      clean[f] = clean[f].split('\n').map(s => s.trim()).filter(Boolean);
    }
  });
  clean.updated_at = serverTimestamp();
  if (id) {
    await updateDoc(doc(db, c.collection, id), clean);
    return id;
  } else {
    clean.created_at = serverTimestamp();
    const ref = await addDoc(collection(db, c.collection), clean);
    return ref.id;
  }
}

// ── WRITE: delete (admin only) ──
export async function deleteItem(cat, id) {
  const c = getCategory(cat);
  if (!c) throw new Error('Unknown category: ' + cat);
  await deleteDoc(doc(db, c.collection, id));
}

// ── ENQUIRIES ──
const ENQ = 'enquiries';

// public: submit an enquiry
export async function submitEnquiry(category, payload) {
  const data = {
    category: (category || 'general').toLowerCase(),
    name: String(payload.name || '').trim(),
    phone: String(payload.phone || '').trim(),
    email: String(payload.email || '').trim(),
    message: String(payload.message || '').trim(),
    item_id: payload.item_id || '',
    item_title: payload.item_title || '',
    extra: payload.extra || {},
    read: false,
    handled: false,
    created_at: serverTimestamp(),
  };
  if (!data.name || !data.phone) throw new Error('Name and phone are required');
  const ref = await addDoc(collection(db, ENQ), data);
  return ref.id;
}

// admin: list enquiries (optionally by category), newest first
export async function listEnquiries(category = null) {
  let q = query(collection(db, ENQ), orderBy('created_at', 'desc'));
  if (category) q = query(collection(db, ENQ), where('category', '==', category), orderBy('created_at', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// admin: mark read/handled
export async function updateEnquiry(id, patch) {
  await updateDoc(doc(db, ENQ, id), patch);
}

export async function deleteEnquiry(id) {
  await deleteDoc(doc(db, ENQ, id));
}
