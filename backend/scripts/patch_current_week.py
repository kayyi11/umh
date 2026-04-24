"""
patch_current_week.py
Writes 2 completed orders (April 22-23 2026) to Firestore to populate
the current week's revenue and product data.

Run from the backend/ directory:
    py scripts/patch_current_week.py
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime, timezone
from services.firestore_client import db

ORDERS = [
    {
        'order_id':        'order_014',
        'order_date':      datetime(2026, 4, 22, 0, 0, 0, tzinfo=timezone.utc),
        'customer_id':     'cust_001',
        'listing_id':      'listing_shopee_p1',
        'platform_id':     'shopee_my',
        'quantity':        2,
        'unit_price':      89.90,
        'discount_amount': 0.00,
        'platform_fee':    8.99,
        'shipping_fee':    5.00,
        'tax':             2.70,
        'voucher_code':    None,
        'campaign_id':     None,
        'order_status':    'completed',
    },
    {
        'order_id':        'order_015',
        'order_date':      datetime(2026, 4, 23, 0, 0, 0, tzinfo=timezone.utc),
        'customer_id':     'cust_003',
        'listing_id':      'listing_shopee_p3',
        'platform_id':     'shopee_my',
        'quantity':        3,
        'unit_price':      49.90,
        'discount_amount': 0.00,
        'platform_fee':    7.49,
        'shipping_fee':    5.00,
        'tax':             4.49,
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
