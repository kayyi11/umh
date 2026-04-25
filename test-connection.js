'use strict';

const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

const app = admin.initializeApp({
  credential: admin.credential.cert(require('./zintelligence-firebase-adminsdk.json')),
});

const db = getFirestore(app, 'majuai-db');

async function testConnection() {
  console.log('Testing Firestore connection to zintelligence-db...\n');

  const collections = [
    'platforms', 'categories', 'customers', 'products',
    'productListings', 'campaigns', 'orders', 'returns',
    'inventorySnapshots', 'adSpends', 'competitorPrices',
    'calendar', 'webAnalytics',
  ];

  for (const name of collections) {
    const snapshot = await db.collection(name).get();
    console.log(`  ${snapshot.empty ? '✗' : '✓'} ${name.padEnd(20)} — ${snapshot.size} document(s)`);
  }

  console.log('\nSample order (order_001):');
  const sample = await db.collection('orders').doc('order_001').get();
  console.log(JSON.stringify(sample.data(), null, 2));
}

testConnection()
  .then(() => { console.log('\nConnection test passed.'); process.exit(0); })
  .catch(err => { console.error('\nConnection test failed:', err.message); process.exit(1); });
