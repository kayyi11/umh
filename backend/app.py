from flask import Flask
from flask_cors import CORS
from routes.chat_routes import chat_bp
from routes.insight_routes import insight_bp # 1. Import new blueprint
from routes.insight_routes import insight_bp # 1. Import new blueprint
from routes.report_routes import report_bp # Import report generation route

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(chat_bp, url_prefix='/api')
app.register_blueprint(insight_bp, url_prefix='/api') # 2. Register here
app.register_blueprint(report_bp, url_prefix='/api') # Register new blueprint

if __name__ == '__main__':
    app.run(debug=True, port=5000)