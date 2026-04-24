from flask import Blueprint, request, jsonify
from services.agents.crew import run_di_analysis
import traceback

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    user_query = data.get('query', 'Check business health')
    
    print(f"--- Received query: {user_query} ---") # Debug log
    
    try:
        result = run_di_analysis(user_query)
        return jsonify({
            "status": "success",
            "output": result
        })
    except Exception as e:
        # This will print the exact error to your terminal
        print("CRITICAL ERROR IN CREW:")
        traceback.print_exc() 
        return jsonify({
            "status": "error", 
            "message": str(e)
        }), 500