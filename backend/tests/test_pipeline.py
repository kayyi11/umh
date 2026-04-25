"""
test_pipeline.py
Integration tests for the MajuAI backend data pipeline (Tasks 1-5).

Run from the project root:
    py -m unittest backend/tests/test_pipeline.py -v
"""

import math
import os
import sys
import unittest

import requests

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

BASE_URL = "http://localhost:5000"

# Detect whether crewai is available so Task-5 tool tests can be skipped cleanly.
try:
    import crewai  # noqa: F401
    CREWAI_AVAILABLE = True
except ImportError:
    CREWAI_AVAILABLE = False


# ── Task 1: Firestore connection ──────────────────────────────────────────────

class TestTask1FirestoreConnection(unittest.TestCase):

    def test_db_singleton_importable(self):
        """Task 1: db singleton imports without error."""
        from services.firestore_client import db
        from google.cloud.firestore import Client
        self.assertIsInstance(db, Client)

    def test_known_collection_accessible(self):
        """Task 1: orders collection returns at least one document."""
        from services.firestore_client import db
        docs = list(db.collection("orders").limit(1).stream())
        self.assertGreater(len(docs), 0)

    def test_patch_orders_written(self):
        """Step 0: all three patch orders exist in Firestore."""
        from services.firestore_client import db
        for oid in ("order_011", "order_012", "order_013"):
            doc = db.collection("orders").document(oid).get()
            self.assertTrue(doc.exists, f"{oid} not found in Firestore")

    def test_patch_orders_have_correct_fields(self):
        """Step 0: patch orders carry the exact fields specified."""
        from services.firestore_client import db
        expected = {
            "order_011": {"listing_id": "listing_shopee_p1",  "unit_price": 89.90,  "quantity": 1},
            "order_012": {"listing_id": "listing_lazada_p1",  "unit_price": 249.00, "quantity": 1},
            "order_013": {"listing_id": "listing_tiktok_p1",  "unit_price": 85.00,  "quantity": 2},
        }
        for oid, fields in expected.items():
            data = db.collection("orders").document(oid).get().to_dict()
            for field, value in fields.items():
                self.assertAlmostEqual(
                    data.get(field), value, places=2,
                    msg=f"{oid}.{field} mismatch",
                )

    def test_patch_orders_have_no_cogs_stored(self):
        """Step 0: patch orders must not store cogs_per_unit (derived field only)."""
        from services.firestore_client import db
        for oid in ("order_011", "order_012", "order_013"):
            data = db.collection("orders").document(oid).get().to_dict()
            self.assertNotIn("cogs_per_unit", data,
                             f"{oid} must not store cogs_per_unit in Firestore")


# ── Task 2: Normalisation & mapping layer ─────────────────────────────────────

class TestTask2Normalisation(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        from services.firestore_queries import get_all_orders, get_all_returns, get_all_inventory_snapshots
        cls.orders = get_all_orders()
        cls.returns = get_all_returns()
        cls.snapshots = get_all_inventory_snapshots()

    def test_get_all_orders_returns_list(self):
        """Task 2: get_all_orders returns a non-empty list."""
        self.assertIsInstance(self.orders, list)
        self.assertGreater(len(self.orders), 0)

    def test_orders_enriched_with_product_name(self):
        """Task 2: orders are enriched with product_name from products collection."""
        enriched = [o for o in self.orders if o.get("product_name")]
        self.assertGreater(len(enriched), 0, "No orders carry product_name")

    def test_orders_enriched_with_cogs_per_unit(self):
        """Task 2: orders linked through productListings carry cogs_per_unit."""
        enriched = [o for o in self.orders if o.get("cogs_per_unit") is not None]
        self.assertGreater(len(enriched), 0, "No orders carry cogs_per_unit")

    def test_order_amount_equals_price_times_quantity(self):
        """Task 2: order_amount == unit_price * quantity for all orders."""
        for o in self.orders:
            expected = (o.get("unit_price") or 0) * (o.get("quantity") or 0)
            self.assertAlmostEqual(
                o.get("order_amount", 0), expected, places=2,
                msg=f"order_amount mismatch on {o.get('order_id')}",
            )

    def test_patch_orders_normalised(self):
        """Step 0 + Task 2: patch orders are enriched by the normalisation layer."""
        patch_ids = {"order_011", "order_012", "order_013"}
        patch = [o for o in self.orders if o.get("order_id") in patch_ids]
        self.assertEqual(len(patch), 3,
                         f"Expected 3 patch orders, got {len(patch)}")
        for o in patch:
            self.assertIsNotNone(o.get("product_name"),
                                 f"{o['order_id']} missing product_name after normalisation")

    def test_returns_have_return_date(self):
        """Task 2: get_all_returns returns records with return_date as datetime."""
        from datetime import datetime
        for r in self.returns:
            if r.get("return_date") is not None:
                self.assertIsInstance(r["return_date"], datetime)
                break

    def test_snapshots_enriched_with_product_name(self):
        """Task 2: inventory snapshots carry product_name."""
        enriched = [s for s in self.snapshots if s.get("product_name")]
        self.assertGreater(len(enriched), 0, "No snapshots carry product_name")


# ── Task 3: Pre-aggregation engine ────────────────────────────────────────────

class TestTask3Aggregation(unittest.TestCase):

    REQUIRED_KEYS = [
        "net_profit", "net_margin_percent", "wow_revenue_change",
        "return_rate_percent", "inventory_days_remaining",
        "top_3_products_by_net_profit", "p1_alerts", "p2_alerts",
        "order_count", "this_week_revenue", "last_week_revenue",
        "this_week_cogs", "this_week_ad_spend", "voucher_impact",
        "top_3_products", "inventory_alerts", "new_customers_this_week",
        "computed_at", "period_start", "period_end",
    ]

    @classmethod
    def setUpClass(cls):
        from services.aggregator import run_aggregation
        cls.data, cls.cached = run_aggregation(force=True)

    def test_returns_dict(self):
        """Task 3: run_aggregation returns a dict."""
        self.assertIsInstance(self.data, dict)

    def test_all_required_keys_present(self):
        """Task 3: all required metric keys are present in the output."""
        for key in self.REQUIRED_KEYS:
            self.assertIn(key, self.data, f"Missing required key: {key}")

    def test_force_returns_not_cached(self):
        """Task 3: force=True means cached=False."""
        self.assertFalse(self.cached)

    def test_second_call_hits_cache(self):
        """Task 3: second call without force returns cached=True."""
        from services.aggregator import run_aggregation
        _, cached = run_aggregation(force=False)
        self.assertTrue(cached)

    def test_p1_alerts_is_nonnegative_int(self):
        """Task 3: p1_alerts is a non-negative integer."""
        val = self.data["p1_alerts"]
        self.assertIsInstance(val, int)
        self.assertGreaterEqual(val, 0)

    def test_p2_alerts_is_nonnegative_int(self):
        """Task 3: p2_alerts is a non-negative integer."""
        val = self.data["p2_alerts"]
        self.assertIsInstance(val, int)
        self.assertGreaterEqual(val, 0)

    def test_inventory_alerts_is_list(self):
        """Task 3: inventory_alerts is a list of dicts with required keys."""
        alerts = self.data["inventory_alerts"]
        self.assertIsInstance(alerts, list)
        for a in alerts:
            for key in ("listing_id", "product_name", "stock", "threshold", "alert"):
                self.assertIn(key, a, f"inventory_alert missing key '{key}'")

    def test_no_nan_or_inf_in_numeric_fields(self):
        """Task 3: numeric fields are finite — no ZeroDivisionError side-effects."""
        for key in ("net_margin_percent", "wow_revenue_change", "return_rate_percent"):
            val = self.data.get(key) or 0
            self.assertFalse(math.isnan(val), f"{key} is NaN")
            self.assertFalse(math.isinf(val), f"{key} is Inf")

    def test_top_3_products_is_list(self):
        """Task 3: top_3_products is a list with at most 3 entries."""
        top3 = self.data["top_3_products"]
        self.assertIsInstance(top3, list)
        self.assertLessEqual(len(top3), 3)

    def test_top_3_by_profit_is_list(self):
        """Task 3: top_3_products_by_net_profit is a list with at most 3 entries."""
        top3 = self.data["top_3_products_by_net_profit"]
        self.assertIsInstance(top3, list)
        self.assertLessEqual(len(top3), 3)

    def test_inventory_days_remaining_type(self):
        """Task 3: inventory_days_remaining is a float or None (never raises ZeroDivisionError)."""
        val = self.data["inventory_days_remaining"]
        self.assertTrue(val is None or isinstance(val, (int, float)),
                        f"Expected float|None, got {type(val)}")

    def test_computed_at_is_string(self):
        """Task 3: computed_at is serialised to a string (JSON-safe)."""
        self.assertIsInstance(self.data["computed_at"], str)

    def test_last_week_revenue_includes_patch_orders(self):
        """Step 0 + Task 3: patch orders (Apr 14-16) fall in the last-week window."""
        # Apr 14-16 is 8-10 days before Apr 24, landing in the last-week bucket.
        # last_week_revenue must be > 0 because patch orders total 89.90 + 249.00 + 170.00 = 508.90
        self.assertGreater(self.data["last_week_revenue"], 0,
                           "last_week_revenue should reflect patch orders in Apr 14-16 window")


# ── Task 4: API endpoints ─────────────────────────────────────────────────────

class TestTask4APIEndpoints(unittest.TestCase):

    def _get(self, path, **kwargs):
        return requests.get(f"{BASE_URL}{path}", timeout=30, **kwargs)

    def _post(self, path, body=None, **kwargs):
        return requests.post(f"{BASE_URL}{path}", json=body or {}, timeout=60, **kwargs)

    # GET /api/metrics
    def test_metrics_returns_200(self):
        """Task 4: GET /api/metrics → 200."""
        self.assertEqual(self._get("/api/metrics").status_code, 200)

    def test_metrics_body_structure(self):
        """Task 4: GET /api/metrics → {status: ok, data: dict}."""
        body = self._get("/api/metrics").json()
        self.assertEqual(body["status"], "ok")
        self.assertIsInstance(body["data"], dict)

    def test_metrics_data_has_required_keys(self):
        """Task 4: GET /api/metrics data contains core metric keys."""
        data = self._get("/api/metrics").json()["data"]
        for key in ("net_profit", "p1_alerts", "p2_alerts", "inventory_alerts",
                    "return_rate_percent", "computed_at"):
            self.assertIn(key, data, f"data missing key: {key}")

    def test_metrics_does_not_expose_cached_field(self):
        """Task 4: GET /api/metrics has no 'cached' field (only /aggregate does)."""
        body = self._get("/api/metrics").json()
        self.assertNotIn("cached", body)

    # POST /api/aggregate
    def test_aggregate_returns_200(self):
        """Task 4: POST /api/aggregate → 200."""
        self.assertEqual(self._post("/api/aggregate").status_code, 200)

    def test_aggregate_body_structure(self):
        """Task 4: POST /api/aggregate → {status, data, cached}."""
        body = self._post("/api/aggregate").json()
        self.assertEqual(body["status"], "ok")
        self.assertIn("data", body)
        self.assertIn("cached", body)
        self.assertIsInstance(body["cached"], bool)

    def test_aggregate_force_true_returns_not_cached(self):
        """Task 4: POST /api/aggregate {force: true} → cached=False."""
        body = self._post("/api/aggregate", {"force": True}).json()
        self.assertFalse(body["cached"])

    def test_aggregate_second_call_returns_cached(self):
        """Task 4: second POST /api/aggregate (no force) → cached=True."""
        self._post("/api/aggregate", {"force": True})   # prime fresh cache
        body = self._post("/api/aggregate").json()       # should hit it
        self.assertTrue(body["cached"])

    def test_aggregate_data_is_json_serialisable(self):
        """Task 4: /api/aggregate data round-trips through JSON without error."""
        import json
        body = self._post("/api/aggregate").json()
        json.dumps(body["data"])   # raises if any datetime leaked through


# ── Task 5: tools.py wiring ───────────────────────────────────────────────────

@unittest.skipUnless(CREWAI_AVAILABLE, "crewai not installed — skipping tool tests")
class TestTask5ToolsWiring(unittest.TestCase):

    def test_set_metrics_importable(self):
        """Task 5: set_metrics is importable from services.agents.tools."""
        from services.agents.tools import set_metrics
        self.assertTrue(callable(set_metrics))

    def test_current_metrics_importable(self):
        """Task 5: _current_metrics dict is importable."""
        from services.agents.tools import _current_metrics
        self.assertIsInstance(_current_metrics, dict)

    def test_set_metrics_populates_dict(self):
        """Task 5: set_metrics writes values into _current_metrics."""
        from services.agents.tools import set_metrics, _current_metrics
        set_metrics({"net_profit": 999.0, "p1_alerts": 3})
        self.assertEqual(_current_metrics["net_profit"], 999.0)
        self.assertEqual(_current_metrics["p1_alerts"], 3)

    def test_set_metrics_clears_old_keys(self):
        """Task 5: set_metrics replaces (not merges) the previous dict."""
        from services.agents.tools import set_metrics, _current_metrics
        set_metrics({"stale_key": "old"})
        set_metrics({"fresh_key": "new"})
        self.assertNotIn("stale_key", _current_metrics)
        self.assertIn("fresh_key", _current_metrics)

    def test_set_metrics_accepts_aggregator_output(self):
        """Task 5: set_metrics accepts the full run_aggregation output dict."""
        from services.aggregator import run_aggregation
        from services.agents.tools import set_metrics, _current_metrics
        data, _ = run_aggregation(force=False)
        set_metrics(data)
        self.assertIn("p1_alerts", _current_metrics)
        self.assertIn("net_profit", _current_metrics)
        self.assertIn("inventory_days_remaining", _current_metrics)

    def test_get_business_metrics_returns_required_keys(self):
        """Task 5: get_business_metrics tool returns all Task-5-specified keys."""
        from services.aggregator import run_aggregation
        from services.agents.tools import set_metrics, get_business_metrics
        data, _ = run_aggregation(force=False)
        set_metrics(data)
        result = get_business_metrics()
        for key in ("net_profit_wtd", "net_margin_pct", "wow_revenue_change_pct",
                    "return_rate_pct", "inventory_days_remaining",
                    "top_3_products_by_net_profit", "p1_alerts", "p2_alerts"):
            self.assertIn(key, result, f"get_business_metrics missing key: {key}")

    def test_inventory_monitor_returns_required_keys(self):
        """Task 5: inventory_monitor tool returns inventory_days_remaining and summary."""
        from services.aggregator import run_aggregation
        from services.agents.tools import set_metrics, inventory_monitor
        data, _ = run_aggregation(force=False)
        set_metrics(data)
        result = inventory_monitor()
        self.assertIn("inventory_days_remaining", result)
        self.assertIn("summary", result)
        self.assertIn("flagged_listings", result)
        self.assertIsInstance(result["flagged_listings"], list)


if __name__ == "__main__":
    unittest.main()
