from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database import db
from seed_data import seed_database
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for frontend development and production
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize SQLAlchemy
    db.init_app(app)

    # Register Route Blueprints
    from routes.auth import auth_bp
    from routes.threats import threats_bp
    from routes.tools import tools_bp
    from routes.ai_chat import ai_bp
    from routes.alerts import alerts_bp
    from routes.quiz import quiz_bp
    from routes.user import user_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(threats_bp, url_prefix='/api/threats')
    app.register_blueprint(tools_bp, url_prefix='/api/tools')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    app.register_blueprint(alerts_bp, url_prefix='/api/alerts')
    app.register_blueprint(quiz_bp, url_prefix='/api/quizzes')
    app.register_blueprint(user_bp, url_prefix='/api/user')

    # Security Headers Middleware
    @app.after_request
    def set_security_headers(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response.headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()'
        return response

    # Global Health Check & API Meta
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'OPERATIONAL',
            'platform': 'REDLINE Cyber Safety & Threat Intelligence Ecosystem',
            'version': '1.0.0',
            'tagline': 'Understand the Threat. Recognize the Risk. Protect Yourself.'
        }), 200

    # Auto-initialize and seed DB
    with app.app_context():
        try:
            db.create_all()
            seed_database()
        except Exception as e:
            print(f"[!] Database initialization note: {e}")

    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
