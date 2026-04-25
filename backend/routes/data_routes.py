# backend/routes/data_routes.py
import os
import base64
import json
from flask import Blueprint, jsonify, request
from services.data_service import DataService

data_bp = Blueprint("data", __name__)
data_service = DataService()


# ─────────────────────────────────────────────────────────────────────────────
# POST /api/upload
# Accepts a file (image, PDF, audio) and runs AI extraction via GLM/Anthropic.
# Returns: { status, summary, extractedItems }
# ─────────────────────────────────────────────────────────────────────────────
@data_bp.route("/upload", methods=["POST"])
def handle_upload():
    file = request.files.get("file")
    file_type = request.form.get("type", "receipt")

    if not file:
        return jsonify({"status": "error", "message": "No file provided"}), 400

    try:
        result = data_service.extract_content_from_file(file, file_type)
        return jsonify({
            "status": "success",
            "summary": result["summary"],
            "extractedItems": result.get("extractedItems", []),
        })
    except Exception as e:
        # Return a structured error so the frontend can display it
        error_msg = str(e)
        print(f"❌ /api/upload failed: {error_msg}")
        return jsonify({
            "status": "error",
            "message": error_msg,
            # Return zeroed summary so frontend doesn't crash
            "summary": {
                "itemsDetected": 0,
                "highConfidence": 0,
                "lowConfidence": 0,
                "overallAccuracy": 0,
            },
            "extractedItems": [],
        }), 500


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/data/table
# Returns unified table data: Firestore products + orders joined
# ─────────────────────────────────────────────────────────────────────────────
@data_bp.route("/data/table", methods=["GET"])
def get_table_data():
    data = data_service.get_unified_table_data()
    return jsonify(data)


# ─────────────────────────────────────────────────────────────────────────────
# POST /api/data/update
# Updates a product record (price, category, item name, quantity)
# ─────────────────────────────────────────────────────────────────────────────
@data_bp.route("/data/update", methods=["POST"])
def update_product():
    incoming = request.json
    if not incoming:
        return jsonify({"status": "error", "message": "No data provided"}), 400

    p_id = incoming.get("id")
    new_price = incoming.get("price")
    new_category = incoming.get("category")
    new_item = incoming.get("item")
    new_quantity = incoming.get("quantity")

    try:
        data_service.update_product(p_id, {
            "price": new_price,
            "category": new_category,
            "item": new_item,
            "quantity": new_quantity,
        })
        return jsonify({"status": "success", "message": f"Product {p_id} updated"})
    except Exception as e:
        print(f"❌ Update error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/data/stats
# Returns the four summary stat cards for the Data Workspace header
# ─────────────────────────────────────────────────────────────────────────────
@data_bp.route("/data/stats", methods=["GET"])
def get_stats():
    try:
        stats = data_service.get_data_stats()
        return jsonify(stats)
    except Exception as e:
        print(f"❌ Stats error: {e}")
        # Fallback static values so the UI doesn't break
        return jsonify([
            {"title": "Inventory Data",   "records": 0, "confidence": "0%", "color": "text-[#10B981]"},
            {"title": "Sales Data",        "records": 0, "confidence": "0%", "color": "text-[#10B981]"},
            {"title": "Supplier Data",     "records": 0, "confidence": "0%", "color": "text-[#10B981]"},
            {"title": "Performance Data",  "records": 0, "confidence": "0%", "color": "text-[#10B981]"},
        ])