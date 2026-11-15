from flask import Blueprint, request, jsonify
from database import db
from models import UserProgress, SavedArticle, Threat, User, QuizAttempt
from routes.auth import token_required

user_bp = Blueprint('user', __name__)

@user_bp.route('/progress', methods=['GET'])
@token_required
def get_user_progress(current_user):
    progress_items = UserProgress.query.filter_by(user_id=current_user.id).all()
    return jsonify({
        'progress': [p.to_dict() for p in progress_items]
    }), 200

@user_bp.route('/progress', methods=['POST'])
@token_required
def update_user_progress(current_user):
    data = request.get_json() or {}
    item_type = data.get('item_type')  # 'simulation', 'module', 'checklist'
    item_id = data.get('item_id')
    completed = data.get('completed', True)
    points = data.get('points', 25)

    if not item_type or not item_id:
        return jsonify({'error': 'item_type and item_id are required'}), 400

    record = UserProgress.query.filter_by(
        user_id=current_user.id,
        item_type=item_type,
        item_id=item_id
    ).first()

    if not record:
        record = UserProgress(
            user_id=current_user.id,
            item_type=item_type,
            item_id=item_id,
            completed=completed,
            points_earned=points
        )
        db.session.add(record)
        current_user.awareness_score = (current_user.awareness_score or 0) + points
    else:
        record.completed = completed
        record.points_earned = max(record.points_earned, points)

    db.session.commit()
    return jsonify({
        'message': 'Progress updated',
        'record': record.to_dict(),
        'awareness_score': current_user.awareness_score
    }), 200

@user_bp.route('/saved-articles', methods=['GET'])
@token_required
def get_saved_articles(current_user):
    saved = SavedArticle.query.filter_by(user_id=current_user.id).all()
    return jsonify({
        'saved_articles': [s.to_dict() for s in saved]
    }), 200

@user_bp.route('/saved-articles', methods=['POST'])
@token_required
def toggle_save_article(current_user):
    data = request.get_json() or {}
    threat_id = data.get('threat_id')

    if not threat_id:
        return jsonify({'error': 'threat_id is required'}), 400

    existing = SavedArticle.query.filter_by(user_id=current_user.id, threat_id=threat_id).first()
    if existing:
        db.session.delete(existing)
        db.session.commit()
        return jsonify({'saved': False, 'message': 'Article removed from bookmarks'}), 200
    else:
        new_save = SavedArticle(user_id=current_user.id, threat_id=threat_id)
        db.session.add(new_save)
        db.session.commit()
        return jsonify({'saved': True, 'message': 'Article bookmarked successfully'}), 201

@user_bp.route('/dashboard', methods=['GET'])
@token_required
def get_dashboard_summary(current_user):
    attempts = QuizAttempt.query.filter_by(user_id=current_user.id).order_by(QuizAttempt.completed_at.desc()).limit(10).all()
    simulations = UserProgress.query.filter_by(user_id=current_user.id, item_type='simulation').all()
    saved = SavedArticle.query.filter_by(user_id=current_user.id).all()

    avg_quiz_score = 0
    if attempts:
        avg_quiz_score = sum(a.percentage for a in attempts) / len(attempts)

    # Calculate Cyber Readiness Level
    score = current_user.awareness_score or 0
    if score >= 500:
        tier = 'Elite Cyber Sentinel'
        level_number = 5
    elif score >= 300:
        tier = 'Cyber Defense Specialist'
        level_number = 4
    elif score >= 150:
        tier = 'Vigilant Defender'
        level_number = 3
    elif score >= 50:
        tier = 'Awareness Cadet'
        level_number = 2
    else:
        tier = 'Recruit'
        level_number = 1

    return jsonify({
        'user': current_user.to_dict(),
        'awareness_score': score,
        'tier': tier,
        'level_number': level_number,
        'avg_quiz_score': round(avg_quiz_score, 1),
        'quiz_history': [a.to_dict() for a in attempts],
        'simulations_completed': [s.to_dict() for s in simulations],
        'saved_count': len(saved)
    }), 200
