"""
firestore_queries.py
Fetch and cross-reference raw Firestore documents into enriched Python dicts.
Lookup collections are batch-fetched once per function — no per-document round-trips.
"""

from datetime import datetime
from services.firestore_client import db


def _to_dt(val):
    """Return val as a datetime.
    firebase-admin already returns DatetimeWithNanoseconds (datetime subclass),
    so this is a no-op for normal Timestamp fields but guards against None."""
    if val is None:
        return None
    if isinstance(val, datetime):
        return val
    return val


def _fetch_map(collection: str, key_field: str) -> dict:
    """Stream all docs from a collection; return {key_field_value: doc_dict}."""
    result = {}
    for doc in db.collection(collection).stream():
        d = doc.to_dict()
        result[d[key_field]] = d
    return result


# ── Public query functions ────────────────────────────────────────────────────

def get_all_orders() -> list:
    listings = _fetch_map('productListings', 'listing_id')
    products = _fetch_map('products', 'product_id')

    result = []
    for doc in db.collection('orders').stream():
        order = doc.to_dict()
        order['order_date'] = _to_dt(order.get('order_date'))

        listing = listings.get(order.get('listing_id'), {})
        product_id = listing.get('product_id')
        product = products.get(product_id, {})

        order['product_id'] = product_id
        order['product_name'] = product.get('name')
        order['cogs_per_unit'] = product.get('cogs_per_unit')
        order['order_amount'] = (
            order.get('unit_price', 0) * order.get('quantity', 0)
        )
        result.append(order)
    return result


def get_all_returns() -> list:
    result = []
    for doc in db.collection('returns').stream():
        ret = doc.to_dict()
        ret['return_date'] = _to_dt(ret.get('return_date'))
        result.append(ret)
    return result


def get_all_inventory_snapshots() -> list:
    listings = _fetch_map('productListings', 'listing_id')
    products = _fetch_map('products', 'product_id')

    result = []
    for doc in db.collection('inventorySnapshots').stream():
        snap = doc.to_dict()
        snap['snapshot_date'] = _to_dt(snap.get('snapshot_date'))

        listing = listings.get(snap.get('listing_id'), {})
        product_id = listing.get('product_id')
        product = products.get(product_id, {})

        snap['product_id'] = product_id
        snap['product_name'] = product.get('name')
        result.append(snap)
    return result


def get_all_customers() -> list:
    result = []
    for doc in db.collection('customers').stream():
        cust = doc.to_dict()
        cust['signup_date'] = _to_dt(cust.get('signup_date'))
        result.append(cust)
    return result


def get_all_ad_spends() -> list:
    result = []
    for doc in db.collection('adSpends').stream():
        spend = doc.to_dict()
        spend['spend_date'] = _to_dt(spend.get('spend_date'))
        result.append(spend)
    return result


def get_all_web_analytics() -> list:
    result = []
    for doc in db.collection('webAnalytics').stream():
        wa = doc.to_dict()
        wa['analytics_date'] = _to_dt(wa.get('analytics_date'))
        result.append(wa)
    return result


def get_all_competitor_prices() -> list:
    products = _fetch_map('products', 'product_id')

    result = []
    for doc in db.collection('competitorPrices').stream():
        cp = doc.to_dict()
        cp['price_date'] = _to_dt(cp.get('price_date'))
        cp['product_name'] = products.get(cp.get('product_id'), {}).get('name')
        result.append(cp)
    return result


def get_all_campaigns() -> list:
    result = []
    for doc in db.collection('campaigns').stream():
        camp = doc.to_dict()
        camp['start_date'] = _to_dt(camp.get('start_date'))
        camp['end_date'] = _to_dt(camp.get('end_date'))
        result.append(camp)
    return result
