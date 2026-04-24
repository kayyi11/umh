# backend/routes/data_routes.py

import os
from flask import Blueprint, jsonify, request
from services.data_service import DataService
from werkzeug.utils import secure_filename

data_bp = Blueprint('data', __name__)
service = DataService()

@data_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"status": "error", "message": "No file uploaded"}), 400
    
    file = request.files['file']
    file_type = request.form.get('type') # 'receipt', 'pdf', or 'voice'
    
    # 1. Save file locally (optional)
    filename = secure_filename(file.filename)
    
    # 2. Trigger "AI Extraction" Logic
    # In a real app, you'd send this to Z.AI or an OCR engine.
    # Here, we process based on type to return dynamic results.
    extracted_data = service.extract_content_from_file(file, file_type)
    
    return jsonify({
        "status": "success",
        "extracted_items": extracted_data,
        "summary": {
            "count": len(extracted_data),
            "confidence": 94
        }
    })

@data_bp.route('/data/stats', methods=['GET'])
def get_stats():
    return jsonify(service.get_workspace_stats())

@data_bp.route('/data/table', methods=['GET'])
def get_table():
    return jsonify(service.get_table_data())

@data_bp.route('/data/update', methods=['POST'])
def update_data():
    try:
        payload = request.json
        # Map frontend 'price' back to database 'cogs_per_unit'
        updates = {"cogs_per_unit": float(payload['price'])}
        service.update_record(payload['id'], updates)
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500