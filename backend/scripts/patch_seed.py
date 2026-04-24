"""
patch_seed.py
Writes 3 backfilled orders (April 14-16 2026) to Firestore so that
webAnalytics records in the same date range can be correlated with orders.

Run from the backend/ directory:
    py scripts/patch_seed.py
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime, timezone
from services.firestore_client import db

ORDERS = [
    {
        'order_id':        'order_011',
        'order_date':      datetime(2026, 4, 14, 0, 0, 0, tzinfo=timezone.utc),
        'customer_id':     'cust_002',
        'listing_id':      'listing_shopee_p1',
        'platform_id':     'shopee_my',
        'quantity':        1,
        'unit_price':      89.90,
        'discount_amount': 0.00,
        'platform_fee':    4.50,
        'shipping_fee':    5.00,
        'tax':             2.70,
        'voucher_code':    None,
        'campaign_id':     None,
        'order_status':    'completed',
    },
    {
        'order_id':        'order_012',
        'order_date':      datetime(2026, 4, 15, 0, 0, 0, tzinfo=timezone.utc),
        'customer_id':     'cust_004',
        'listing_id':      'listing_lazada_p1',
        'platform_id':     'lazada_my',
        'quantity':        1,
        'unit_price':      249.00,
        'discount_amount': 0.00,
        'platform_fee':    12.45,
        'shipping_fee':    0.00,
        'tax':             7.02,
        'voucher_code':    None,
        'campaign_id':     None,
        'order_status':    'completed',
    },
    {
        'order_id':        'order_013',
        'order_date':      datetime(2026, 4, 16, 0, 0, 0, tzinfo=timezone.utc),
        'customer_id':     'cust_007',
        'listing_id':      'listing_tiktok_p1',
        'platform_id':     'tiktok_my',
        'quantity':        2,
        'unit_price':      85.00,
        'discount_amount': 0.00,
        'platform_fee':    8.50,
        'shipping_fee':    4.00,
        'tax':             5.10,
        'voucher_code':    None,
        'campaign_id':     None,
        'order_status':    'completed',
    },
]


def main() -> None:
    coll = db.collection('orders')
    for order in ORDERS:
        oid = order['order_id']
        coll.document(oid).set(order)
        print(f'  written {oid}')
    print(f'\nDone — {len(ORDERS)} orders written to Firestore.')


if __name__ == '__main__':
    main()
