from flask import Blueprint, jsonify, request
from services.insight_service import calculate_insight_data, generate_detailed_report

insight_bp = Blueprint('insight', __name__)

@insight_bp.route('/insight-data', methods=['GET'])
def get_insight():
    # Capture the dimension from the URL, e.g., /insight-data?dimension=platform
    dimension = request.args.get('dimension', 'total')
    try:
        data = calculate_insight_data(dimension)
        return jsonify(data)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@insight_bp.route('/detailed-analysis', methods=['POST'])
def get_detailed_analysis():
    try:
        data = request.json
        recommendation = data.get('recommendation', 'General Optimization')
        
        # Trigger the Strategist Agent
        report = generate_detailed_report(recommendation)
        
        return jsonify({"status": "success", "report": report})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500