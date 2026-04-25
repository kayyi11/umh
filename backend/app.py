#backend/app.py

from flask import Flask
from flask_cors import CORS
from routes.chat_routes import chat_bp
from routes.insight_routes import insight_bp
from routes.decision_tracker_route import decision_tracker_bp
from routes.report_routes import report_bp
from routes.smart_draft_routes import smart_draft_bp
from routes.data_routes import data_bp

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})


# Register blueprints
app.register_blueprint(chat_bp, url_prefix='/api')
app.register_blueprint(insight_bp, url_prefix='/api')
app.register_blueprint(decision_tracker_bp, url_prefix='/api')
app.register_blueprint(report_bp, url_prefix='/api')
app.register_blueprint(data_bp, url_prefix='/api')
app.register_blueprint(smart_draft_bp)

# Execution state
execution_state = {
    "steps": [
        {"id": "price_simulate", "title": "Price increase simulated", "subtitle": "+8% profit", "status": "pending"},
        {"id": "supplier_email", "title": "Supplier email sent", "subtitle": "(Waiting reply)", "status": "pending"},
        {"id": "price_list", "title": "Price list updated", "subtitle": "(Pending approval)", "status": "pending"},
        {"id": "team_notify", "title": "Team notified", "subtitle": "(Pending)", "status": "pending"}
    ],
    "impact": {
        "time_saved_seconds": 0,
        "profit_increase": 0,
        "actions_completed": 0,
        "total_actions": 4
    },
    "last_updated": None
}

if __name__ == '__main__':
    # Running on port 5000 as per project requirements
    app.run(debug=True, port=5000)