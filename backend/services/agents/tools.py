from crewai.tools import tool

_current_metrics: dict = {}


def set_metrics(metrics_dict: dict) -> None:
    """Populate the shared metrics store before each CrewAI run."""
    _current_metrics.clear()
    _current_metrics.update(metrics_dict)


@tool("get_business_metrics")
def get_business_metrics():
    """Returns the Top 6 Dashboard metrics and margin-impacting factors like Return Rate and Vouchers."""
    m = _current_metrics
    wow = m.get('wow_revenue_change', 0) or 0
    return {
        'net_profit_wtd':               f"RM {m.get('net_profit', 0):.2f}",
        'net_margin_pct':               f"{m.get('net_margin_percent', 0):.1f}%",
        'wow_revenue_change_pct':       f"{wow:+.1f}%",
        'return_rate_pct':              f"{m.get('return_rate_percent', 0):.1f}%",
        'inventory_days_remaining':     m.get('inventory_days_remaining'),
        'top_3_products_by_net_profit': m.get('top_3_products_by_net_profit', []),
        'p1_alerts':                    m.get('p1_alerts', 0),
        'p2_alerts':                    m.get('p2_alerts', 0),
        'voucher_impact':               f"RM {m.get('voucher_impact', 0):.2f}",
        'this_week_revenue':            f"RM {m.get('this_week_revenue', 0):.2f}",
        'new_customers_this_week':      m.get('new_customers_this_week', 0),
    }


@tool("inventory_monitor")
def inventory_monitor():
    """Monitors all product stock levels and identifies P1 (Critical) or P2 (Warning) threshold breaches."""
    days_remaining = _current_metrics.get('inventory_days_remaining')
    p1_alerts      = _current_metrics.get('p1_alerts', 0)
    p2_alerts      = _current_metrics.get('p2_alerts', 0)
    alerts         = _current_metrics.get('inventory_alerts', [])

    flagged = [
        {
            'product':       a['product_name'],
            'stock_on_hand': a['stock'],
            'threshold':     a['threshold'],
            'alert':         ('P1 - Critical Stockout Risk' if a['alert'] == 'P1'
                              else 'P2 - Warning: Low Stock'),
        }
        for a in alerts if a['alert'] in ('P1', 'P2')
    ]

    return {
        'inventory_days_remaining': days_remaining,
        'summary':                  f"{p1_alerts} P1 (critical), {p2_alerts} P2 (warning) alerts",
        'flagged_listings':         flagged or [{'alert': 'Healthy — no threshold breaches'}],
    }


@tool("supplier_contact_lookup")
def supplier_contact_lookup(product_name: str):
    """Retrieves contact details for the supplier of a specific product."""
    return {
        'product':        product_name,
        'supplier':       'FreshPoultry Sdn Bhd',
        'contact_person': 'Mr. Tan',
        'email':          'tan@freshpoultry.my',
        'whatsapp':       '+60123456789',
    }
