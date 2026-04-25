import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';

// ── Generic helpers ───────────────────────────────────────────────────────────

export async function getCollection(collectionName) {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getDocument(collectionName, docId) {
  const snapshot = await getDoc(doc(db, collectionName, docId));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function addDocument(collectionName, data) {
  const ref = await addDoc(collection(db, collectionName), data);
  return ref.id;
}

export async function updateDocument(collectionName, docId, data) {
  await updateDoc(doc(db, collectionName, docId), data);
}

export async function deleteDocument(collectionName, docId) {
  await deleteDoc(doc(db, collectionName, docId));
}

export async function queryCollection(collectionName, filters = [], sortBy = null, limitCount = null) {
  let q = collection(db, collectionName);
  const constraints = [
    ...filters.map(([field, op, value]) => where(field, op, value)),
    ...(sortBy ? [orderBy(sortBy)] : []),
    ...(limitCount ? [limit(limitCount)] : []),
  ];
  q = query(q, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── Collection-specific helpers ───────────────────────────────────────────────

export const getOrders        = ()  => getCollection('orders');
export const getProducts      = ()  => getCollection('products');
export const getCustomers     = ()  => getCollection('customers');
export const getPlatforms     = ()  => getCollection('platforms');
export const getCategories    = ()  => getCollection('categories');
export const getCampaigns     = ()  => getCollection('campaigns');
export const getReturns       = ()  => getCollection('returns');
export const getAdSpends      = ()  => getCollection('adSpends');
export const getInventory     = ()  => getCollection('inventorySnapshots');
export const getCompetitors   = ()  => getCollection('competitorPrices');
export const getCalendar      = ()  => getCollection('calendar');
export const getWebAnalytics  = ()  => getCollection('webAnalytics');
export const getListings      = ()  => getCollection('productListings');

export const getOrdersByPlatform = (platformId) =>
  queryCollection('orders', [['platform_id', '==', platformId]]);

export const getOrdersByStatus = (status) =>
  queryCollection('orders', [['order_status', '==', status]]);

export const getListingsByPlatform = (platformId) =>
  queryCollection('productListings', [['platform_id', '==', platformId]]);

export async function fetchMetrics() {
  const response = await fetch('http://localhost:5000/api/metrics');
  if (!response.ok) {
    throw new Error(`Metrics API error: ${response.status}`);
  }
  const json = await response.json();
  return json.data;
}

export async function fetchOptimization() {
  const response = await fetch('http://localhost:5000/api/insight-data?dimension=total');
  if (!response.ok) {
    throw new Error(`Insight API error: ${response.status}`);
  }
  const json = await response.json();
  return json.optimization ?? null;
}

export async function generateReport(prompt, reportType) {
  const res = await fetch('http://localhost:5000/api/generate-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, report_type: reportType }),
  });
  
  if (!res.ok) throw new Error('Report generation failed');
  return res.blob(); // returns PDF blob
}
