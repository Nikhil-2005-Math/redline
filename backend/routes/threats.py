from flask import Blueprint, request, jsonify
from database import db
from models import Threat, ThreatCategory, SecurityTool, QuizQuestion

threats_bp = Blueprint('threats', __name__)

@threats_bp.route('', methods=['GET'])
def get_threats():
    category_slug = request.args.get('category')
    difficulty = request.args.get('difficulty')
    risk = request.args.get('risk')
    search = request.args.get('search', '').strip()

    query = Threat.query.join(ThreatCategory)

    if category_slug and category_slug != 'all':
        query = query.filter(ThreatCategory.slug == category_slug)

    if difficulty and difficulty != 'all':
        query = query.filter(Threat.difficulty.ilike(difficulty))

    if risk and risk != 'all':
        query = query.filter(Threat.risk_category.ilike(risk))

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Threat.name.ilike(search_filter)) |
            (Threat.short_desc.ilike(search_filter)) |
            (Threat.full_content.ilike(search_filter))
        )

    threats = query.order_by(Threat.id.asc()).all()
    return jsonify({
        'count': len(threats),
        'threats': [t.to_dict() for t in threats]
    }), 200

@threats_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = ThreatCategory.query.order_by(ThreatCategory.display_order.asc()).all()
    return jsonify({
        'categories': [c.to_dict() for c in categories]
    }), 200

@threats_bp.route('/stats', methods=['GET'])
def get_stats():
    threats_count = Threat.query.count()
    categories_count = ThreatCategory.query.count()
    tools_count = SecurityTool.query.count()
    quizzes_count = QuizQuestion.query.count()
    
    return jsonify({
        'threat_topics': threats_count,
        'categories': categories_count,
        'security_tools': tools_count,
        'learning_quizzes': quizzes_count,
        'simulations_available': 6
    }), 200

@threats_bp.route('/featured', methods=['GET'])
def get_featured_threats():
    # 12 specific featured threats requested for the homepage overview
    featured_slugs = [
        'phishing', 'ransomware', 'upi-scams', 'camera-privacy-risks',
        'sim-swapping', 'password-attacks', 'pretexting', 'rogue-access-points',
        'digital-arrest-scams', 'spyware', 'credential-stuffing', 'deepfake-scams'
    ]
    threats = Threat.query.filter(Threat.slug.in_(featured_slugs)).all()
    if not threats:
        threats = Threat.query.limit(12).all()
    return jsonify({
        'featured': [t.to_dict() for t in threats]
    }), 200

@threats_bp.route('/<slug>', methods=['GET'])
def get_threat_detail(slug):
    threat = Threat.query.filter_by(slug=slug).first()
    if not threat:
        return jsonify({'error': f'Threat topic "{slug}" not found'}), 404
    
    # Increment views count
    threat.views_count = (threat.views_count or 0) + 1
    db.session.commit()

    return jsonify({
        'threat': threat.to_dict(include_full=True)
    }), 200
