from flask import Blueprint, request, jsonify, current_app
import jwt
from database import db
from models import QuizQuestion, QuizAttempt, User

quiz_bp = Blueprint('quiz', __name__)

def get_optional_user():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            return User.query.get(data.get('sub'))
        except Exception:
            return None
    return None

@quiz_bp.route('', methods=['GET'])
def get_quiz_questions():
    category = request.args.get('category')
    level = request.args.get('level')

    query = QuizQuestion.query

    if category and category != 'all':
        query = query.filter(QuizQuestion.category.ilike(f"%{category}%"))

    if level and level != 'all':
        query = query.filter(QuizQuestion.level.ilike(level))

    questions = query.all()
    return jsonify({
        'count': len(questions),
        'questions': [q.to_dict(include_answer=False) for q in questions]
    }), 200

@quiz_bp.route('/submit', methods=['POST'])
def submit_quiz():
    data = request.get_json() or {}
    answers = data.get('answers', {})  # { question_id: selected_index }
    category = data.get('category', 'General')
    level = data.get('level', 'Beginner')

    if not answers:
        return jsonify({'error': 'No answers submitted.'}), 400

    score = 0
    total = len(answers)
    detailed_results = []

    for q_id_str, selected_idx in answers.items():
        try:
            q_id = int(q_id_str)
            question = QuizQuestion.query.get(q_id)
            if not question:
                continue

            is_correct = (question.correct_index == int(selected_idx))
            if is_correct:
                score += 1

            detailed_results.append({
                'question_id': q_id,
                'question': question.question,
                'selected_index': int(selected_idx),
                'correct_index': question.correct_index,
                'is_correct': is_correct,
                'explanation': question.explanation
            })
        except Exception:
            continue

    percentage = (score / total * 100) if total > 0 else 0
    current_user = get_optional_user()

    # Save attempt
    attempt = QuizAttempt(
        user_id=current_user.id if current_user else None,
        category=category,
        level=level,
        score=score,
        max_score=total,
        percentage=percentage
    )
    db.session.add(attempt)

    # Award points to user if logged in
    points_awarded = score * 10
    if current_user:
        current_user.awareness_score = (current_user.awareness_score or 0) + points_awarded

    db.session.commit()

    # Determine Badge
    if percentage >= 90:
        badge = 'Master Cyber Guardian'
    elif percentage >= 70:
        badge = 'Certified Defender'
    elif percentage >= 50:
        badge = 'Security Apprentice'
    else:
        badge = 'Awareness Explorer'

    return jsonify({
        'score': score,
        'total': total,
        'percentage': round(percentage, 1),
        'badge': badge,
        'points_awarded': points_awarded,
        'details': detailed_results
    }), 200
