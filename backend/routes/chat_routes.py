import json
import queue as queue_module
import re
import threading
import traceback

from flask import Blueprint, Response, jsonify, request, stream_with_context

try:
    from services.agents.crew import run_di_analysis, run_draft_actions
    from services.agents.tools import set_metrics
    _CREW_AVAILABLE = True
except ImportError:
    run_di_analysis = None
    run_draft_actions = None
    set_metrics = lambda m: None  # noqa: E731
    _CREW_AVAILABLE = False
from services.aggregator import run_aggregation


def _parse_json_array(text: str):
    """Extract a JSON array from raw LLM output, tolerating code fences and preamble text."""
    # Strip markdown code fences (```json ... ``` or ``` ... ```)
    text = re.sub(r'```(?:json)?\s*', '', text).strip()
    # Try a direct parse first (clean output)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    # Fall back: find the first [...] block in the text
    match = re.search(r'\[[\s\S]*\]', text)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass
    return None

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

    print(f"\n{'='*60}")
    print(f"[CHAT] User query: {user_query}")
    print(f"{'='*60}")

    if not _CREW_AVAILABLE:
        return jsonify({"status": "error", "message": "crewai not installed"}), 503

    event_queue = queue_module.Queue()

    def run_crew():
        try:
            metrics_data, _ = run_aggregation(force=False)
            set_metrics(metrics_data)
            run_di_analysis(user_query, metrics_data=metrics_data, event_queue=event_queue)
        except Exception as e:
            print("CRITICAL ERROR IN CREW:")
            traceback.print_exc()
            event_queue.put({'type': 'error', 'content': str(e)})

    thread = threading.Thread(target=run_crew, daemon=True)
    thread.start()

    def generate():
        while True:
            try:
                event = event_queue.get(timeout=180)
                yield f"data: {json.dumps(event)}\n\n"
                if event.get('type') in ('done', 'error'):
                    break
            except queue_module.Empty:
                yield f"data: {json.dumps({'type': 'error', 'content': 'Request timed out after 3 minutes'})}\n\n"
                break

    return Response(
        stream_with_context(generate()),
        mimetype='text/event-stream',
        headers={'Cache-Control': 'no-cache', 'X-Accel-Buffering': 'no'},
    )


@chat_bp.route('/draft-actions', methods=['POST'])
def draft_actions():
    if not _CREW_AVAILABLE:
        return jsonify({"status": "error", "message": "crewai not installed"}), 503

    try:
        metrics_data, _ = run_aggregation(force=False)
        set_metrics(metrics_data)

        raw = run_draft_actions()
        drafted = _parse_json_array(raw)

        if drafted is None:
            print(f"DRAFT ACTIONS: failed to parse agent output:\n{raw}")
            return jsonify({"status": "error", "message": "Agent output could not be parsed", "raw": raw}), 500

        return jsonify({"status": "success", "drafted_actions": drafted})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500
