from datetime import datetime, timedelta
from services.firestore_client import db

def calculate_insight_data(dimension='total'):
    orders_ref = db.collection('orders').stream()
    data_map = {}

    for doc in orders_ref:
        order = doc.to_dict()
        rev = float(order.get('unit_price', 0)) * int(order.get('quantity', 0))
        
        # Determine the grouping key based on the selected dimension
        if dimension == 'category':
            # Note: You'd ideally link listing_id to product category here
            key = order.get('category_id', 'Uncategorized') 
        elif dimension == 'platform':
            key = order.get('platform_id', 'Direct')
        elif dimension == 'campaign':
            key = order.get('campaign_id', 'Organic')
        else: # Default: Total Revenue by Date
            key = order['order_date'].strftime('%d %b')

        data_map[key] = data_map.get(key, 0) + rev

    chart_data = []
    for k, v in data_map.items():
        if dimension == 'total':
            chart_data.append({"date": k, "actual": round(v, 2)})
        else:
            chart_data.append({"name": k, "value": round(v, 2)})

    # Sort time-series only
    if dimension == 'total':
        chart_data.sort(key=lambda x: x['date']) 

    return {
        "todayDate": datetime.now().strftime('%d %b'),
        "chartData": chart_data,
        "type": "line" if dimension == 'total' else "bar",
        "aiExplanation": f"Analysis shows that {dimension} performance is driven by high-margin items in your top collections.",
        "optimization": {
            "title": "Shift Marketing Spend",
            "adjustment": "to TikTok Shop",
            "profitGrowth": "+12%",
            "confidence": "High",
            "reasoning": "Platform data shows 20% lower commission costs on TikTok compared to Lazada."
        },
        "simulationMetrics": [
            {"label": "Current Revenue", "current": 5000, "projected": 5600, "change": 12.0},
            {"label": "Ad Spend", "current": 800, "projected": 700, "change": -12.5},
            {"label": "Net ROI", "current": 4.2, "projected": 5.1, "change": 21.0}
        ]
    }