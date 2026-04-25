# decision_tracker_route.py
"""
Backend routes for Decision Tracker and Impact Tracker.
Maintains execution state, handles action execution, and provides current status.
"""

import time
from datetime import datetime
from flask import Blueprint, request, jsonify

# Create a blueprint (or remove the Blueprint wrapper if you're not using one)
decision_tracker_bp = Blueprint('decision_tracker', __name__)

# ==========================================
# STATE STORAGE (in-memory for demo)
# ==========================================
# In production, store this in a database (SQLite, PostgreSQL, Redis, etc.)
execution_state = {
    "steps": [
        {
            "id": "price_simulate",
            "title": "Price increase simulated",
            "subtitle": "+8% profit",
            "status": "pending"          # pending, completed, failed
        },
        {
            "id": "supplier_email",
            "title": "Supplier email sent",
            "subtitle": "(Waiting reply)",
            "status": "pending"
        },
        {
            "id": "price_list",
            "title": "Price list updated",
            "subtitle": "(Pending approval)",
            "status": "pending"
        },
        {
            "id": "team_notify",
            "title": "Team notified",
            "subtitle": "(Pending)",
            "status": "pending"
        }
    ],
    "impact": {
        "time_saved_seconds": 0,     # cumulative seconds saved by automation
        "profit_increase": 0,        # total profit increase in RM
        "actions_completed": 0,
        "total_actions": 4
    },
    "last_updated": None
}

# ==========================================
# HELPER FUNCTIONS
# ==========================================
def update_state_step(step_id, new_status, profit_delta=0, time_saved_delta=0):
    """Update a specific step's status and adjust impact metrics."""
    global execution_state
    for step in execution_state["steps"]:
        if step["id"] == step_id:
            step["status"] = new_status
            break

    # Only increment counters if the step is being marked as completed
    # (avoid double counting when status already completed)
    if new_status == "completed":
        # Check if we already counted this step (idempotency)
        # For simplicity, we assume each execution endpoint is called only once per step.
        execution_state["impact"]["actions_completed"] += 1
        execution_state["impact"]["profit_increase"] += profit_delta
        execution_state["impact"]["time_saved_seconds"] += time_saved_delta

    execution_state["last_updated"] = datetime.utcnow().isoformat()

def reset_state():
    """Reset all steps to pending and zero out impact."""
    global execution_state
    for step in execution_state["steps"]:
        step["status"] = "pending"
    execution_state["impact"]["actions_completed"] = 0
    execution_state["impact"]["profit_increase"] = 0
    execution_state["impact"]["time_saved_seconds"] = 0
    execution_state["last_updated"] = datetime.utcnow().isoformat()

# ==========================================
# ROUTES
# ==========================================

@decision_tracker_bp.route('/api/state', methods=['GET'])
def get_state():
    """Return current tracker state (steps + impact)."""
    return jsonify(execution_state)

@decision_tracker_bp.route('/api/reset', methods=['POST'])
def reset():
    """Reset all execution state (for testing/re‑run)."""
    reset_state()
    return jsonify({"success": True, "state": execution_state})

# ---------- Execute each action ----------

@decision_tracker_bp.route('/api/execute/price-simulate', methods=['POST'])
def execute_price_simulate():
    """
    Simulate a price increase.
    In reality, this would call a pricing engine or update a database.
    """
    # Business logic example:
    #   old_price = get_current_price('chicken')
    #   new_price = old_price * 1.08
    #   profit_increase = (new_price - old_price) * estimated_volume

    profit_increase = 200          # RM200
    time_saved = 5 * 60            # 5 minutes saved vs. manual calculation

    update_state_step("price_simulate", "completed", profit_increase, time_saved)
    return jsonify({"success": True, "state": execution_state})

@decision_tracker_bp.route('/api/execute/supplier-email', methods=['POST'])
def execute_supplier_email():
    """
    Send the drafted email to the supplier.
    Expects JSON: { "draft": { "subject": "...", "body": "..." } }
    """
    data = request.get_json()
    draft = data.get('draft', {})
    subject = draft.get('subject', 'Price renegotiation')
    body = draft.get('body', '')

    # --- Email sending logic (placeholder) ---
    # In real code: use smtplib, SendGrid, AWS SES, etc.
    print(f"Sending email to supplier:\nSubject: {subject}\nBody: {body}\n")
    # Uncomment when email service is configured:
    # send_email(to="supplier@example.com", subject=subject, body=body)

    # Time saved: manual email takes ~10 mins, automation takes 30 sec
    time_saved = 10 * 60 - 30

    update_state_step("supplier_email", "completed", profit_delta=0, time_saved_delta=time_saved)
    return jsonify({"success": True, "state": execution_state})

@decision_tracker_bp.route('/api/execute/price-list', methods=['POST'])
def execute_price_list():
    """
    Generate and export the updated price list.
    Could return a file or store a generated CSV/PDF.
    """
    # Business logic: recalculate prices, generate Excel/PDF file
    # For demo, just simulate work
    time.sleep(1)   # simulate processing

    # Time saved: manual export takes 15 mins, automated takes 1 min
    time_saved = 15 * 60 - 60

    update_state_step("price_list", "completed", profit_delta=0, time_saved_delta=time_saved)
    return jsonify({"success": True, "state": execution_state})

@decision_tracker_bp.route('/api/execute/team-notify', methods=['POST'])
def execute_team_notify():
    """
    Send WhatsApp message to team using the drafted content.
    Expects JSON: { "draft": { "body": "..." } }
    """
    data = request.get_json()
    draft = data.get('draft', {})
    message = draft.get('body', 'Price update notification')

    # --- WhatsApp sending logic (placeholder) ---
    # Integrate with Twilio, WhatsApp Business API, etc.
    print(f"Sending WhatsApp message to team:\n{message}\n")

    # Time saved: manual broadcast takes 5 mins, automation takes 20 sec
    time_saved = 5 * 60 - 20

    update_state_step("team_notify", "completed", profit_delta=0, time_saved_delta=time_saved)
    return jsonify({"success": True, "state": execution_state})

# ---------- Optional: Execute all actions in one call ----------
@decision_tracker_bp.route('/api/execute/all', methods=['POST'])
def execute_all():
    """
    Execute all actions sequentially (simplified).
    For a robust implementation, you would queue them and report progress via WebSockets.
    """
    # Execute one after another (in a real app, consider background tasks)
    results = []
    actions = [
        ('price-simulate', {}),
        ('supplier-email', request.get_json() or {}),
        ('price-list', {}),
        ('team-notify', request.get_json() or {})
    ]
    for action, payload in actions:
        # Call the respective endpoint function
        if action == 'price-simulate':
            resp = execute_price_simulate()
        elif action == 'supplier-email':
            resp = execute_supplier_email()
        elif action == 'price-list':
            resp = execute_price_list()
        elif action == 'team-notify':
            resp = execute_team_notify()
        results.append(resp.json)
    return jsonify({"success": True, "results": results})