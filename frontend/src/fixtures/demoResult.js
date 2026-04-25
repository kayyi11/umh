export const DEMO_RESULT = {
  agent_1_detect: {
    alert:
      "Chicken rice pricing is below cost-recovery threshold following a 12% supplier cost increase. Margin erosion risk on your top-performing SKU.",
    evidence: [
      "Current price: RM6.50 | Cost base: RM5.80 | Margin: 11.2% (target: 15%)",
      "Frozen chicken (1kg) stock: 23 units | Reorder point: 50 | Status: P1 Alert",
      "Last 7-day return rate: 3.1% — within normal range (quality not the driver)",
      "Shopee accounts for 68% of chicken rice sales volume",
    ],
  },
  agent_2_think: {
    reasoning:
      "A RM0.50 price increase (7.7%) is justified by supplier cost data and competitive benchmarking. Historical data shows your customer base is price-inelastic for this SKU — the last increase in Q3 2025 caused only a 2.1% volume dip that recovered within 3 weeks.",
    projection: {
      current:   { revenue: 5000, cost: 3800, profit: 1200 },
      projected: { revenue: 5480, cost: 3800, profit: 1680 },
    },
    explanation:
      "The Malaysian SME food market shows strong price acceptance for staple proteins when bundled with perceived quality. Shopee's algorithm also rewards higher ASP listings in the 'value meal' category — a RM6.90–RM7.00 price point is optimal for both margin and discoverability.",
  },
  agent_3_act: {
    draft_email:
      "Subject: Request for Revised Pricing — Frozen Chicken (1kg)\n\nDear Mr. Tan,\n\nI hope this message finds you well. Following our internal cost review, we would like to discuss revised pricing for frozen chicken (1kg).\n\nOur current stock sits at 23 units against a reorder point of 50. We need to place an order within the next 3–5 days to avoid a stockout on Shopee and Lazada.\n\nWe would appreciate your best pricing for a bulk order of 200 units. Please revert at your earliest convenience.\n\nBest regards,\nManagement\nMajuAI Store",
    checklist: [
      "Update Shopee listing price to RM7.00",
      "Update Lazada listing price to RM7.00",
      "Place restock order with FreshPoultry Sdn Bhd",
      "Notify team via WhatsApp of price change",
      "Monitor return rate for 14 days post-adjustment",
    ],
  },
};
