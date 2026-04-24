"""
aggregator.py
Pre-aggregation engine.  Computes all dashboard metrics from live Firestore
data, writes the result to preAggregatedMetrics/latest, and returns the
cached snapshot when it is younger than CACHE_TTL_MINUTES.
"""

from collections import defaultdict
from datetime import datetime, timedelta, timezone

from firebase_admin import firestore as fs_admin

from services.firestore_client import db
from services.firestore_queries import (
    get_all_ad_spends,
    get_all_customers,
    get_all_inventory_snapshots,
    get_all_orders,
    get_all_returns,
)

CACHE_TTL_MINUTES = 15
_CACHE_COLLECTION = 'preAggregatedMetrics'
_CACHE_DOC_ID     = 'latest'


# ── Helpers ───────────────────────────────────────────────────────────────────

def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


def _is_cache_fresh(data: dict) -> bool:
    computed_at = data.get('computed_at')
    if computed_at is None:
        return False
    age = _now_utc() - computed_at
    return age < timedelta(minutes=CACHE_TTL_MINUTES)


def _ensure_tz(dt: datetime) -> datetime:
    """Return dt with UTC tzinfo if it is naive."""
    if dt is None:
        return None
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def _filter_period(records: list, date_field: str,
                   start: datetime, end: datetime) -> list:
    out = []
    for r in records:
        d = _ensure_tz(r.get(date_field))
        if d is not None and start <= d < end:
            out.append(r)
    return out


def _week_range(weeks_ago: int = 0):
    """Return (start, end) UTC datetimes for a rolling 7-day window."""
    now  = _now_utc()
    end  = now  - timedelta(days=7 * weeks_ago)
    start = end - timedelta(days=7)
    return start, end


# ── Core computation ──────────────────────────────────────────────────────────

def _compute_metrics() -> dict:
    # Fetch all raw data up front (batch, no per-document round-trips).
    orders    = get_all_orders()
    returns   = get_all_returns()
    snaps     = get_all_inventory_snapshots()
    ad_spends = get_all_ad_spends()
    customers = get_all_customers()

    this_start, this_end = _week_range(0)
    last_start, last_end = _week_range(1)

    this_orders  = _filter_period(orders,    'order_date',  this_start, this_end)
    last_orders  = _filter_period(orders,    'order_date',  last_start, last_end)
    this_returns = _filter_period(returns,   'return_date', this_start, this_end)
    this_spends  = _filter_period(ad_spends, 'spend_date',  this_start, this_end)
    new_custs    = _filter_period(customers, 'signup_date', this_start, this_end)

    # ── Revenue & profit ──────────────────────────────────────────────────────
    def _revenue(ol):
        return sum(o.get('order_amount', 0) or 0 for o in ol)

    def _cogs(ol):
        return sum((o.get('cogs_per_unit') or 0) * (o.get('quantity', 0) or 0)
                   for o in ol)

    this_revenue  = _revenue(this_orders)
    last_revenue  = _revenue(last_orders)
    this_cogs     = _cogs(this_orders)
    this_ad_spend = sum(s.get('amount', 0) or 0 for s in this_spends)
    this_voucher  = sum(o.get('voucher_amount', 0) or 0 for o in this_orders)

    net_profit   = this_revenue - this_cogs - this_ad_spend
    net_margin   = (net_profit / this_revenue * 100) if this_revenue else 0.0
    wow_change   = ((this_revenue - last_revenue) / last_revenue * 100
                    if last_revenue else 0.0)

    # ── Returns ───────────────────────────────────────────────────────────────
    order_count   = max(len(this_orders), 1)
    return_count  = len(this_returns)
    return_rate   = return_count / order_count * 100
    total_refunds = sum(r.get('refund_amount', 0) or 0 for r in this_returns)

    # ── Top products by revenue ───────────────────────────────────────────────
    product_rev: dict[str, float] = defaultdict(float)
    for o in this_orders:
        name = o.get('product_name') or 'Unknown'
        product_rev[name] += o.get('order_amount', 0) or 0

    top_3 = sorted(product_rev, key=product_rev.__getitem__, reverse=True)[:3]

    # ── Inventory alerts ──────────────────────────────────────────────────────
    # Keep the most-recent snapshot per listing.
    latest: dict[str, dict] = {}
    _min_dt = datetime.min.replace(tzinfo=timezone.utc)
    for s in snaps:
        lid = s.get('listing_id')
        if not lid:
            continue
        prev_dt = _ensure_tz(latest[lid].get('snapshot_date')) if lid in latest else _min_dt
        this_dt = _ensure_tz(s.get('snapshot_date')) or _min_dt
        if this_dt > prev_dt:
            latest[lid] = s

    inventory_alerts = []
    for lid, snap in latest.items():
        stock = (snap.get('quantity_on_hand')
                 or snap.get('stock_level')
                 or snap.get('quantity')
                 or 0)
        threshold = (snap.get('reorder_point')
                     or snap.get('min_stock_threshold')
                     or snap.get('reorder_threshold')
                     or 10)
        name  = snap.get('product_name') or lid
        alert = ('P1' if stock <= threshold
                 else 'P2' if stock <= threshold * 2
                 else 'Healthy')
        inventory_alerts.append({
            'listing_id':   lid,
            'product_name': name,
            'stock':        stock,
            'threshold':    threshold,
            'alert':        alert,
        })

    inventory_alerts.sort(key=lambda a: (0 if a['alert'] == 'P1'
                                          else 1 if a['alert'] == 'P2' else 2))

    p1_count = sum(1 for a in inventory_alerts if a['alert'] == 'P1')
    p2_count = sum(1 for a in inventory_alerts if a['alert'] == 'P2')

    return {
        # Revenue / profit
        'this_week_revenue':      round(this_revenue, 2),
        'last_week_revenue':      round(last_revenue, 2),
        'this_week_cogs':         round(this_cogs, 2),
        'this_week_ad_spend':     round(this_ad_spend, 2),
        'net_profit':             round(net_profit, 2),
        'net_margin_percent':     round(net_margin, 2),
        'wow_revenue_change':     round(wow_change, 2),

        # Orders & returns
        'order_count':            order_count,
        'return_count':           return_count,
        'return_rate_percent':    round(return_rate, 2),
        'total_refunds':          round(total_refunds, 2),
        'voucher_impact':         round(this_voucher, 2),

        # Products
        'top_3_products':         top_3,
        'product_revenue':        {k: round(v, 2) for k, v in product_rev.items()},

        # Inventory
        'inventory_alerts':       inventory_alerts,
        'p1_count':               p1_count,
        'p2_count':               p2_count,

        # Customers
        'new_customers_this_week': len(new_custs),

        # Meta
        'period_start': this_start.isoformat(),
        'period_end':   this_end.isoformat(),
    }


# ── Public API ────────────────────────────────────────────────────────────────

def get_aggregated_metrics(force_refresh: bool = False) -> dict:
    """
    Return the pre-aggregated metrics dict.
    Reads from Firestore cache when fresh (< CACHE_TTL_MINUTES old);
    otherwise recomputes and persists the new snapshot.
    """
    cache_ref = db.collection(_CACHE_COLLECTION).document(_CACHE_DOC_ID)

    if not force_refresh:
        snap = cache_ref.get()
        if snap.exists:
            data = snap.to_dict()
            if _is_cache_fresh(data):
                return data

    metrics = _compute_metrics()
    metrics['computed_at'] = fs_admin.SERVER_TIMESTAMP
    cache_ref.set(metrics)

    # Re-read so computed_at is a real datetime, not the sentinel.
    return cache_ref.get().to_dict()
