#backend/app.py

from flask import Flask
from flask_cors import CORS
from routes.chat_routes import chat_bp
from routes.insight_routes import insight_bp # 1. Import new blueprint
from routes.data_routes import data_bp

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Register blueprints
app.register_blueprint(chat_bp, url_prefix='/api')
app.register_blueprint(insight_bp, url_prefix='/api') # 2. Register here
app.register_blueprint(data_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True, port=5000, threaded=True)