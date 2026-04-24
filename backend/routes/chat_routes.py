import traceback

from flask import Blueprint, jsonify, request

try:
    from services.agents.crew import run_di_analysis
    from services.agents.tools import set_metrics
    _CREW_AVAILABLE = True
except ImportError:
    run_di_analysis = None
    set_metrics = lambda m: None  # noqa: E731
    _CREW_AVAILABLE = False
from services.aggregator import run_aggregation

chat_bp = Blueprint('chat', __name__)


@chat_bp.route('/aggregate', methods=['POST'])
def aggregate():
    body  = request.get_json(silent=True) or {}
    force = bool(body.get('force', False))
    try:
        data, cached = run_aggregation(force=force)
        return jsonify({"status": "ok", "data": data, "cached": cached})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500


@chat_bp.route('/metrics', methods=['GET'])
def metrics():
    try:
        data, _ = run_aggregation(force=False)
        return jsonify({"status": "ok", "data": data})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500


@chat_bp.route('/analyze', methods=['POST'])
def analyze():
    body       = request.get_json(silent=True) or {}
    user_query = body.get('query', 'Check business health')

    print(f"--- Received query: {user_query} ---")

    if not _CREW_AVAILABLE:
        return jsonify({"status": "error", "message": "crewai not installed"}), 503

    try:
        metrics_data, _ = run_aggregation(force=False)
        set_metrics(metrics_data)

        result = run_di_analysis(user_query)
        return jsonify({"status": "success", "output": result})
    except Exception as e:
        print("CRITICAL ERROR IN CREW:")
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500
