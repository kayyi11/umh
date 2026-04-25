'use strict';

const admin = require('firebase-admin');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

// ── Initialise Firebase Admin ────────────────────────────────────────────────
const app = admin.initializeApp({
  credential: admin.credential.cert(require('./majuai-firebase-adminsdk.json')),
});

const db = getFirestore(app, 'majuai-db');

// ── Helpers ──────────────────────────────────────────────────────────────────
const ts = (dateStr) => Timestamp.fromDate(new Date(dateStr));

async function seedCollection(collectionName, docs, idField) {
  let written = 0;
  for (const doc of docs) {
    const id = doc[idField];
    try {
      await db.collection(collectionName).doc(id).set(doc);
      written++;
    } catch (err) {
      console.error(`  ✗ ${collectionName}/${id}: ${err.message}`);
    }
  }
  console.log(`✓ ${collectionName} — ${written} documents written`);
}

// ── 1. platforms ─────────────────────────────────────────────────────────────
const platforms = [
  { platform_id: 'shopee_my',  platform_name: 'Shopee',      api_type: 'REST'    },
  { platform_id: 'lazada_my',  platform_name: 'Lazada',      api_type: 'REST'    },
  { platform_id: 'tiktok_my',  platform_name: 'TikTok Shop', api_type: 'Webhook' },
];

// ── 2. categories ────────────────────────────────────────────────────────────
const categories = [
  { category_id: 'cat_electronics',  category_name: 'Electronics'  },
  { category_id: 'cat_fashion',      category_name: 'Fashion'       },
  { category_id: 'cat_beauty',       category_name: 'Beauty'        },
  { category_id: 'cat_home_living',  category_name: 'Home & Living' },
  { category_id: 'cat_sports',       category_name: 'Sports'        },
];

// ── 3. customers ─────────────────────────────────────────────────────────────
const customers = [
  { customer_id: 'cust_001', platform_id: 'shopee_my', signup_date: ts('2025-03-15'), tier: 'silver', location: 'Selangor'     },
  { customer_id: 'cust_002', platform_id: 'shopee_my', signup_date: ts('2025-05-20'), tier: 'bronze', location: 'Kuala Lumpur' },
  { customer_id: 'cust_003', platform_id: 'shopee_my', signup_date: ts('2025-07-10'), tier: 'gold',   location: 'Pulau Pinang' },
  { customer_id: 'cust_004', platform_id: 'lazada_my', signup_date: ts('2025-04-05'), tier: 'bronze', location: 'Johor'        },
  { customer_id: 'cust_005', platform_id: 'lazada_my', signup_date: ts('2025-06-18'), tier: 'silver', location: 'Sabah'        },
  { customer_id: 'cust_006', platform_id: 'lazada_my', signup_date: ts('2025-10-03'), tier: 'gold',   location: 'Sarawak'      },
  { customer_id: 'cust_007', platform_id: 'tiktok_my', signup_date: ts('2025-08-22'), tier: 'bronze', location: 'Kedah'        },
  { customer_id: 'cust_008', platform_id: 'tiktok_my', signup_date: ts('2026-01-14'), tier: 'silver', location: 'Perak'        },
];

// ── 4. products ──────────────────────────────────────────────────────────────
const products = [
  { product_id: 'prod_earbuds',         category_id: 'cat_electronics', name: 'Wireless Earbuds TWS Pro',     cogs_per_unit: 45.00  },
  { product_id: 'prod_smartwatch',      category_id: 'cat_electronics', name: 'Smart Watch Fitness Tracker',  cogs_per_unit: 120.00 },
  { product_id: 'prod_baju_kurung',     category_id: 'cat_fashion',     name: 'Baju Kurung Moden Sulam',      cogs_per_unit: 35.00  },
  { product_id: 'prod_tshirt',          category_id: 'cat_fashion',     name: 'Baju T-Shirt Premium Cotton',  cogs_per_unit: 15.00  },
  { product_id: 'prod_vitamin_c_serum', category_id: 'cat_beauty',      name: 'Vitamin C Serum 30ml',         cogs_per_unit: 22.00  },
  { product_id: 'prod_moisturizer',     category_id: 'cat_beauty',      name: 'Brightening Moisturizer SPF',  cogs_per_unit: 18.00  },
  { product_id: 'prod_pillow',          category_id: 'cat_home_living', name: 'Memory Foam Pillow Premium',   cogs_per_unit: 25.00  },
  { product_id: 'prod_yoga_mat',        category_id: 'cat_sports',      name: 'Yoga Mat Anti-Slip 6mm',       cogs_per_unit: 30.00  },
];

// ── 5. productListings ───────────────────────────────────────────────────────
// selling_price is always > cogs_per_unit of the linked product
const productListings = [
  { listing_id: 'listing_shopee_p1', product_id: 'prod_earbuds',         platform_id: 'shopee_my', selling_price: 89.90,  platform_product_id: 'SHPEE-1001' },
  { listing_id: 'listing_shopee_p2', product_id: 'prod_baju_kurung',     platform_id: 'shopee_my', selling_price: 79.90,  platform_product_id: 'SHPEE-1002' },
  { listing_id: 'listing_shopee_p3', product_id: 'prod_vitamin_c_serum', platform_id: 'shopee_my', selling_price: 49.90,  platform_product_id: 'SHPEE-1003' },
  { listing_id: 'listing_shopee_p4', product_id: 'prod_smartwatch',      platform_id: 'shopee_my', selling_price: 259.00, platform_product_id: 'SHPEE-1004' },
  { listing_id: 'listing_lazada_p1', product_id: 'prod_smartwatch',      platform_id: 'lazada_my', selling_price: 249.00, platform_product_id: 'LAZ-2045'   },
  { listing_id: 'listing_lazada_p2', product_id: 'prod_tshirt',          platform_id: 'lazada_my', selling_price: 39.90,  platform_product_id: 'LAZ-2046'   },
  { listing_id: 'listing_lazada_p3', product_id: 'prod_moisturizer',     platform_id: 'lazada_my', selling_price: 45.90,  platform_product_id: 'LAZ-2047'   },
  { listing_id: 'listing_tiktok_p1', product_id: 'prod_earbuds',         platform_id: 'tiktok_my', selling_price: 85.00,  platform_product_id: 'TKTK-3011'  },
  { listing_id: 'listing_tiktok_p2', product_id: 'prod_yoga_mat',        platform_id: 'tiktok_my', selling_price: 69.90,  platform_product_id: 'TKTK-3012'  },
  { listing_id: 'listing_tiktok_p3', product_id: 'prod_pillow',          platform_id: 'tiktok_my', selling_price: 55.90,  platform_product_id: 'TKTK-3013'  },
];

// ── 6. campaigns ─────────────────────────────────────────────────────────────
const campaigns = [
  {
    campaign_id: 'camp_1111',
    platform_id: 'shopee_my',
    name: '11.11 Mega Sale',
    voucher_code: 'MEGA11',
    discount_type: 'percentage',
    discount_value: 10,
    start_date: ts('2025-11-01'),
    end_date:   ts('2025-11-30'),
    total_cost: 5000.00,
  },
  {
    campaign_id: 'camp_1212',
    platform_id: 'lazada_my',
    name: '12.12 Year End Sale',
    voucher_code: 'SAVE12',
    discount_type: 'fixed_amount',
    discount_value: 15,
    start_date: ts('2025-12-01'),
    end_date:   ts('2025-12-31'),
    total_cost: 3500.00,
  },
  {
    campaign_id: 'camp_ramadan',
    platform_id: 'tiktok_my',
    name: 'Ramadan Promotion',
    voucher_code: 'RAMADAN10',
    discount_type: 'percentage',
    discount_value: 15,
    start_date: ts('2026-02-28'),
    end_date:   ts('2026-04-09'),
    total_cost: 2800.00,
  },
  {
    campaign_id: 'camp_raya',
    platform_id: 'shopee_my',
    name: 'Raya Mega Sale',
    voucher_code: 'RAYA20',
    discount_type: 'fixed_amount',
    discount_value: 20,
    start_date: ts('2026-04-01'),
    end_date:   ts('2026-04-30'),
    total_cost: 4200.00,
  },
  {
    campaign_id: 'camp_99',
    platform_id: 'lazada_my',
    name: '9.9 Super Shopping Day',
    voucher_code: null,
    discount_type: 'percentage',
    discount_value: 8,
    start_date: ts('2025-09-01'),
    end_date:   ts('2025-09-30'),
    total_cost: 2000.00,
  },
];

// ── 7. orders ────────────────────────────────────────────────────────────────
// platform_id always matches the listing's platform_id.
// Statuses: 4 × returned, 3 × completed, 2 × processing, 1 × cancelled.
// order_amount is a derived field — NOT stored here.
const orders = [
  {
    order_id: 'order_001',
    order_date: ts('2025-11-15'),
    customer_id: 'cust_001', listing_id: 'listing_shopee_p1', platform_id: 'shopee_my',
    quantity: 2, unit_price: 89.90,
    discount_amount: 17.98, platform_fee: 8.99, shipping_fee: 5.00, tax: 2.70,
    voucher_code: 'MEGA11', campaign_id: 'camp_1111',
    order_status: 'completed',
  },
  {
    order_id: 'order_002',
    order_date: ts('2025-12-10'),
    customer_id: 'cust_004', listing_id: 'listing_lazada_p1', platform_id: 'lazada_my',
    quantity: 1, unit_price: 249.00,
    discount_amount: 15.00, platform_fee: 12.45, shipping_fee: 0.00, tax: 7.02,
    voucher_code: 'SAVE12', campaign_id: 'camp_1212',
    order_status: 'completed',
  },
  {
    order_id: 'order_003',
    order_date: ts('2025-11-20'),
    customer_id: 'cust_002', listing_id: 'listing_shopee_p2', platform_id: 'shopee_my',
    quantity: 1, unit_price: 79.90,
    discount_amount: 0.00, platform_fee: 4.00, shipping_fee: 5.00, tax: 2.40,
    voucher_code: null, campaign_id: null,
    order_status: 'returned',
  },
  {
    order_id: 'order_004',
    order_date: ts('2026-02-15'),
    customer_id: 'cust_007', listing_id: 'listing_tiktok_p1', platform_id: 'tiktok_my',
    quantity: 1, unit_price: 85.00,
    discount_amount: 0.00, platform_fee: 4.25, shipping_fee: 4.00, tax: 2.55,
    voucher_code: null, campaign_id: null,
    order_status: 'returned',
  },
  {
    order_id: 'order_005',
    order_date: ts('2025-12-05'),
    customer_id: 'cust_005', listing_id: 'listing_lazada_p2', platform_id: 'lazada_my',
    quantity: 3, unit_price: 39.90,
    discount_amount: 0.00, platform_fee: 5.99, shipping_fee: 3.00, tax: 3.59,
    voucher_code: null, campaign_id: null,
    order_status: 'cancelled',
  },
  {
    order_id: 'order_006',
    order_date: ts('2026-03-10'),
    customer_id: 'cust_003', listing_id: 'listing_shopee_p3', platform_id: 'shopee_my',
    quantity: 2, unit_price: 49.90,
    discount_amount: 0.00, platform_fee: 5.00, shipping_fee: 5.00, tax: 3.00,
    voucher_code: null, campaign_id: null,
    order_status: 'processing',
  },
  {
    order_id: 'order_007',
    order_date: ts('2026-03-15'),
    customer_id: 'cust_008', listing_id: 'listing_tiktok_p2', platform_id: 'tiktok_my',
    quantity: 1, unit_price: 69.90,
    discount_amount: 10.49, platform_fee: 3.50, shipping_fee: 4.00, tax: 2.09,
    voucher_code: 'RAMADAN10', campaign_id: 'camp_ramadan',
    order_status: 'returned',
  },
  {
    order_id: 'order_008',
    order_date: ts('2026-01-20'),
    customer_id: 'cust_006', listing_id: 'listing_lazada_p3', platform_id: 'lazada_my',
    quantity: 2, unit_price: 45.90,
    discount_amount: 0.00, platform_fee: 4.59, shipping_fee: 3.00, tax: 2.75,
    voucher_code: null, campaign_id: null,
    order_status: 'completed',
  },
  {
    order_id: 'order_009',
    order_date: ts('2026-04-05'),
    customer_id: 'cust_001', listing_id: 'listing_shopee_p4', platform_id: 'shopee_my',
    quantity: 1, unit_price: 259.00,
    discount_amount: 20.00, platform_fee: 12.95, shipping_fee: 0.00, tax: 7.17,
    voucher_code: 'RAYA20', campaign_id: 'camp_raya',
    order_status: 'returned',
  },
  {
    order_id: 'order_010',
    order_date: ts('2026-04-10'),
    customer_id: 'cust_007', listing_id: 'listing_tiktok_p3', platform_id: 'tiktok_my',
    quantity: 2, unit_price: 55.90,
    discount_amount: 0.00, platform_fee: 5.59, shipping_fee: 4.00, tax: 3.35,
    voucher_code: null, campaign_id: null,
    order_status: 'processing',
  },
];

// ── 8. returns ───────────────────────────────────────────────────────────────
// Each order_id must have order_status === 'returned'.
// return_date is always after the linked order_date.
// return_status mix: 2 × approved, 1 × rejected, 1 × pending.
const returns = [
  {
    return_id: 'return_001',
    order_id: 'order_003', product_id: 'prod_baju_kurung', // listing_shopee_p2
    return_date: ts('2025-11-22'),
    return_reason: 'wrong_size',
    refund_amount: 79.90, returned_quantity: 1,
    return_status: 'approved',
  },
  {
    return_id: 'return_002',
    order_id: 'order_004', product_id: 'prod_earbuds',     // listing_tiktok_p1
    return_date: ts('2026-02-17'),
    return_reason: 'damaged',
    refund_amount: 85.00, returned_quantity: 1,
    return_status: 'approved',
  },
  {
    return_id: 'return_003',
    order_id: 'order_007', product_id: 'prod_yoga_mat',    // listing_tiktok_p2
    return_date: ts('2026-03-17'),
    return_reason: 'changed_mind',
    refund_amount: 0.00, returned_quantity: 1,
    return_status: 'rejected',
  },
  {
    return_id: 'return_004',
    order_id: 'order_009', product_id: 'prod_smartwatch',  // listing_shopee_p4
    return_date: ts('2026-04-07'),
    return_reason: 'wrong_item',
    refund_amount: 259.00, returned_quantity: 1,
    return_status: 'pending',
  },
];

// ── 9. inventorySnapshots ────────────────────────────────────────────────────
// One snapshot per listing, one per day over the last 10 days.
const inventorySnapshots = [
  { snapshot_id: 'snap_001', listing_id: 'listing_shopee_p1', snapshot_date: ts('2026-04-14'), stock_on_hand: 120, reserved_stock: 8  },
  { snapshot_id: 'snap_002', listing_id: 'listing_shopee_p2', snapshot_date: ts('2026-04-15'), stock_on_hand: 45,  reserved_stock: 3  },
  { snapshot_id: 'snap_003', listing_id: 'listing_lazada_p1', snapshot_date: ts('2026-04-16'), stock_on_hand: 30,  reserved_stock: 5  },
  { snapshot_id: 'snap_004', listing_id: 'listing_tiktok_p1', snapshot_date: ts('2026-04-17'), stock_on_hand: 88,  reserved_stock: 12 },
  { snapshot_id: 'snap_005', listing_id: 'listing_shopee_p3', snapshot_date: ts('2026-04-18'), stock_on_hand: 200, reserved_stock: 15 },
  { snapshot_id: 'snap_006', listing_id: 'listing_lazada_p2', snapshot_date: ts('2026-04-19'), stock_on_hand: 75,  reserved_stock: 6  },
  { snapshot_id: 'snap_007', listing_id: 'listing_tiktok_p2', snapshot_date: ts('2026-04-20'), stock_on_hand: 40,  reserved_stock: 2  },
  { snapshot_id: 'snap_008', listing_id: 'listing_shopee_p4', snapshot_date: ts('2026-04-21'), stock_on_hand: 15,  reserved_stock: 4  },
  { snapshot_id: 'snap_009', listing_id: 'listing_lazada_p3', snapshot_date: ts('2026-04-22'), stock_on_hand: 60,  reserved_stock: 7  },
  { snapshot_id: 'snap_010', listing_id: 'listing_tiktok_p3', snapshot_date: ts('2026-04-23'), stock_on_hand: 55,  reserved_stock: 3  },
];

// ── 10. adSpends ─────────────────────────────────────────────────────────────
// spend_date falls within each campaign's start_date–end_date window.
// attributed_revenue is realistically higher than spend (positive ROAS).
const adSpends = [
  { ad_spend_id: 'adspend_001', campaign_id: 'camp_1111',    platform_id: 'shopee_my', spend_date: ts('2025-11-05'), spend: 800.00,  attributed_revenue: 5200.00 },
  { ad_spend_id: 'adspend_002', campaign_id: 'camp_1111',    platform_id: 'shopee_my', spend_date: ts('2025-11-15'), spend: 950.00,  attributed_revenue: 6100.00 },
  { ad_spend_id: 'adspend_003', campaign_id: 'camp_1212',    platform_id: 'lazada_my', spend_date: ts('2025-12-05'), spend: 600.00,  attributed_revenue: 3800.00 },
  { ad_spend_id: 'adspend_004', campaign_id: 'camp_1212',    platform_id: 'lazada_my', spend_date: ts('2025-12-15'), spend: 750.00,  attributed_revenue: 4500.00 },
  { ad_spend_id: 'adspend_005', campaign_id: 'camp_ramadan', platform_id: 'tiktok_my', spend_date: ts('2026-03-05'), spend: 500.00,  attributed_revenue: 3200.00 },
  { ad_spend_id: 'adspend_006', campaign_id: 'camp_ramadan', platform_id: 'tiktok_my', spend_date: ts('2026-03-20'), spend: 620.00,  attributed_revenue: 3900.00 },
  { ad_spend_id: 'adspend_007', campaign_id: 'camp_raya',    platform_id: 'shopee_my', spend_date: ts('2026-04-05'), spend: 700.00,  attributed_revenue: 4800.00 },
  { ad_spend_id: 'adspend_008', campaign_id: 'camp_99',      platform_id: 'lazada_my', spend_date: ts('2025-09-10'), spend: 450.00,  attributed_revenue: 2800.00 },
];

// ── 11. competitorPrices ─────────────────────────────────────────────────────
const competitorPrices = [
  { competitor_price_id: 'comp_001', product_id: 'prod_earbuds',         price_date: ts('2026-04-10'), competitor_name: 'Seller_Gadget99', competitor_price: 92.00  },
  { competitor_price_id: 'comp_002', product_id: 'prod_earbuds',         price_date: ts('2026-04-15'), competitor_name: 'TechMart_MY',     competitor_price: 88.00  },
  { competitor_price_id: 'comp_003', product_id: 'prod_smartwatch',      price_date: ts('2026-04-08'), competitor_name: 'BestBuy_MY',      competitor_price: 265.00 },
  { competitor_price_id: 'comp_004', product_id: 'prod_baju_kurung',     price_date: ts('2026-04-12'), competitor_name: 'FashionHub_MY',   competitor_price: 85.00  },
  { competitor_price_id: 'comp_005', product_id: 'prod_vitamin_c_serum', price_date: ts('2026-04-14'), competitor_name: 'BeautyZone_MY',   competitor_price: 52.00  },
  { competitor_price_id: 'comp_006', product_id: 'prod_yoga_mat',        price_date: ts('2026-04-18'), competitor_name: 'SportsMart_MY',   competitor_price: 72.00  },
];

// ── 12. calendar ─────────────────────────────────────────────────────────────
// Mix: normal days, Malaysian public holidays, major e-commerce sale events.
// Document ID = cal_date (YYYY-MM-DD string).
const calendar = [
  { cal_date: '2025-07-15', is_public_holiday: false, is_sale_event: false, event_name: null                   },
  { cal_date: '2025-08-31', is_public_holiday: true,  is_sale_event: false, event_name: 'Hari Merdeka'         },
  { cal_date: '2025-09-09', is_public_holiday: false, is_sale_event: true,  event_name: '9.9 Super Sale'       },
  { cal_date: '2025-10-20', is_public_holiday: true,  is_sale_event: false, event_name: 'Deepavali'            },
  { cal_date: '2025-11-11', is_public_holiday: false, is_sale_event: true,  event_name: '11.11 Mega Sale'      },
  { cal_date: '2025-12-12', is_public_holiday: false, is_sale_event: true,  event_name: '12.12 Year End Sale'  },
  { cal_date: '2025-12-25', is_public_holiday: true,  is_sale_event: false, event_name: 'Krismas'              },
  { cal_date: '2026-01-29', is_public_holiday: true,  is_sale_event: false, event_name: 'Tahun Baru Cina'      },
  { cal_date: '2026-03-30', is_public_holiday: true,  is_sale_event: false, event_name: 'Hari Raya Aidilfitri' },
  { cal_date: '2026-04-10', is_public_holiday: false, is_sale_event: true,  event_name: 'Harbolnas'            },
];

// ── 13. webAnalytics ─────────────────────────────────────────────────────────
// session_count ≥ visitor_count (a visitor may have multiple sessions).
const webAnalytics = [
  { analytics_id: 'wa_001', platform_id: 'shopee_my', analytics_date: ts('2026-04-14'), traffic_source: 'organic',  visitor_count: 1200, session_count: 1580 },
  { analytics_id: 'wa_002', platform_id: 'lazada_my', analytics_date: ts('2026-04-15'), traffic_source: 'paid_ads', visitor_count: 980,  session_count: 1250 },
  { analytics_id: 'wa_003', platform_id: 'tiktok_my', analytics_date: ts('2026-04-16'), traffic_source: 'social',   visitor_count: 2100, session_count: 2750 },
  { analytics_id: 'wa_004', platform_id: 'shopee_my', analytics_date: ts('2026-04-17'), traffic_source: 'direct',   visitor_count: 850,  session_count: 1050 },
  { analytics_id: 'wa_005', platform_id: 'lazada_my', analytics_date: ts('2026-04-18'), traffic_source: 'referral', visitor_count: 640,  session_count: 820  },
  { analytics_id: 'wa_006', platform_id: 'tiktok_my', analytics_date: ts('2026-04-19'), traffic_source: 'organic',  visitor_count: 1800, session_count: 2300 },
  { analytics_id: 'wa_007', platform_id: 'shopee_my', analytics_date: ts('2026-04-20'), traffic_source: 'paid_ads', visitor_count: 1450, session_count: 1870 },
  { analytics_id: 'wa_008', platform_id: 'lazada_my', analytics_date: ts('2026-04-21'), traffic_source: 'social',   visitor_count: 1100, session_count: 1400 },
  { analytics_id: 'wa_009', platform_id: 'tiktok_my', analytics_date: ts('2026-04-22'), traffic_source: 'direct',   visitor_count: 760,  session_count: 940  },
  { analytics_id: 'wa_010', platform_id: 'shopee_my', analytics_date: ts('2026-04-23'), traffic_source: 'referral', visitor_count: 520,  session_count: 680  },
];

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Seeding MajuAI Firestore (majuai-db)…\n');

  await seedCollection('platforms',          platforms,          'platform_id');
  await seedCollection('categories',         categories,         'category_id');
  await seedCollection('customers',          customers,          'customer_id');
  await seedCollection('products',           products,           'product_id');
  await seedCollection('productListings',    productListings,    'listing_id');
  await seedCollection('campaigns',          campaigns,          'campaign_id');
  await seedCollection('orders',             orders,             'order_id');
  await seedCollection('returns',            returns,            'return_id');
  await seedCollection('inventorySnapshots', inventorySnapshots, 'snapshot_id');
  await seedCollection('adSpends',           adSpends,           'ad_spend_id');
  await seedCollection('competitorPrices',   competitorPrices,   'competitor_price_id');
  await seedCollection('calendar',           calendar,           'cal_date');
  await seedCollection('webAnalytics',       webAnalytics,       'analytics_id');

  console.log('\nAll done.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
