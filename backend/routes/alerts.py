from flask import Blueprint, request, jsonify
from database import db
from models import CyberAlert

alerts_bp = Blueprint('alerts', __name__)

@alerts_bp.route('', methods=['GET'])
def get_alerts():
    severity = request.args.get('severity')
    category = request.args.get('category')
    limit = request.args.get('limit', type=int, default=20)

    query = CyberAlert.query.filter_by(is_active=True)

    if severity and severity != 'all':
        query = query.filter(CyberAlert.severity.ilike(severity))

    if category and category != 'all':
        query = query.filter(CyberAlert.category.ilike(category))

    alerts = query.order_by(CyberAlert.published_at.desc()).limit(limit).all()

    return jsonify({
        'count': len(alerts),
        'alerts': [a.to_dict() for a in alerts]
    }), 200
