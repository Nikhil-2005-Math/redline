from flask import Blueprint, request, jsonify, current_app
from services.ai_engine import generate_chat_response

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/chat', methods=['POST'])
def chat():
    data = request.get_json() or {}
    message = data.get('message', '').strip()
    language = data.get('language', 'en')

    if not message:
        return jsonify({'error': 'Message content cannot be empty.'}), 400

    api_key = current_app.config.get('GEMINI_API_KEY')
    result = generate_chat_response(message, language=language, api_key=api_key)
    return jsonify(result), 200
