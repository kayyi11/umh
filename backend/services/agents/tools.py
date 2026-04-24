from crewai.tools import tool

@tool("get_business_metrics")
def get_business_metrics():
    """Returns the Top 6 Dashboard metrics and margin-impacting factors like Return Rate and Vouchers."""
    # We added return_rate and voucher_impact to help the AI answer "Why did my margin drop?"
    return {
        "net_profit": "RM 3,100 (WTD)",
        "net_margin_percent": "12.5%",
        "inventory_days_remaining": 2,
        "return_rate": "6.7% (High - Up from 2% last week)", 
        "voucher_impact": "RM 450 (Heavy discounting detected)",
        "wow_revenue_change": "+8.4%",
        "top_3_products": ["Hainanese Chicken Rice", "Roasted Chicken Rice", "BBQ Pork Rice"]
    }

@tool("inventory_monitor")
def inventory_monitor():
    """Monitors all product stock levels and identifies P1 (Critical) or P2 (Warning) threshold breaches."""
    return [
        {"product": "Chicken Rice", "stock_on_hand": 2, "alert": "P1 - Critical Stockout Risk"},
        {"product": "Chili Sauce", "stock_on_hand": 50, "alert": "Healthy"}
    ]

@tool("supplier_contact_lookup")
def supplier_contact_lookup(product_name: str):
    """Retrieves contact details for the supplier of a specific product."""
    return {
        "product": product_name,
        "supplier": "FreshPoultry Sdn Bhd",
        "contact_person": "Mr. Tan",
        "email": "tan@freshpoultry.my",
        "whatsapp": "+60123456789"
    }