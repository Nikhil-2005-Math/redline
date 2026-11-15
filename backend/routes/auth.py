from flask import Blueprint, request, jsonify, current_app
from functools import wraps
from datetime import datetime, timedelta
import jwt
import re
from database import db
from models import User

auth_bp = Blueprint('auth', __name__)

def create_token(user_id: int) -> str:
    payload = {
        'sub': user_id,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(hours=current_app.config['JWT_EXPIRATION_HOURS'])
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'error': 'Authentication token is missing'}), 401
        
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['sub'])
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired, please log in again'}), 401
        except Exception:
            return jsonify({'error': 'Invalid authentication token'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not username or len(username) < 3:
        return jsonify({'error': 'Username must be at least 3 characters long.'}), 400
    
    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    if not email or not re.match(email_regex, email):
        return jsonify({'error': 'A valid email address is required.'}), 400

    if not password or len(password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters long for adequate security.'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username is already registered.'}), 409

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email is already registered.'}), 409

    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    token = create_token(user.id)
    return jsonify({
        'message': 'Account created successfully',
        'token': token,
        'user': user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    identifier = data.get('identifier', '').strip()
    password = data.get('password', '')

    if not identifier or not password:
        return jsonify({'error': 'Please provide email/username and password.'}), 400

    user = User.query.filter(
        (User.email == identifier.lower()) | (User.username == identifier)
    ).first()

    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials. Please verify your details.'}), 401

    token = create_token(user.id)
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify({
        'user': current_user.to_dict(),
        'quiz_attempts_count': current_user.quiz_attempts.count(),
        'saved_articles_count': current_user.saved_articles.count(),
        'completed_simulations_count': current_user.progress.filter_by(item_type='simulation', completed=True).count()
    }), 200
