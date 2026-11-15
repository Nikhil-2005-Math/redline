from datetime import datetime
import json
import bcrypt
from database import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user')
    awareness_score = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    quiz_attempts = db.relationship('QuizAttempt', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    progress = db.relationship('UserProgress', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    saved_articles = db.relationship('SavedArticle', backref='user', lazy='dynamic', cascade='all, delete-orphan')

    def set_password(self, password: str):
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def check_password(self, password: str) -> bool:
        if not self.password_hash:
            return False
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'awareness_score': self.awareness_score,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class ThreatCategory(db.Model):
    __tablename__ = 'threat_categories'
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(60), unique=True, nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    icon = db.Column(db.String(50), default='ShieldAlert')
    display_order = db.Column(db.Integer, default=0)

    threats = db.relationship('Threat', backref='category', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'slug': self.slug,
            'name': self.name,
            'description': self.description,
            'icon': self.icon,
            'display_order': self.display_order,
            'threat_count': self.threats.count()
        }


class Threat(db.Model):
    __tablename__ = 'threats'
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('threat_categories.id'), nullable=False, index=True)
    slug = db.Column(db.String(80), unique=True, nullable=False, index=True)
    name = db.Column(db.String(120), nullable=False)
    short_desc = db.Column(db.String(255), nullable=False)
    risk_category = db.Column(db.String(40), default='High')  # Critical, High, Medium, Low
    difficulty = db.Column(db.String(30), default='Beginner')  # Beginner, Intermediate, Advanced
    icon = db.Column(db.String(50), default='AlertTriangle')
    views_count = db.Column(db.Integer, default=0)
    
    # 10 essential structured fields stored in JSON or columns
    full_content = db.Column(db.Text, nullable=False)  # JSON string

    def get_content(self):
        try:
            return json.loads(self.full_content)
        except Exception:
            return {}

    def to_dict(self, include_full=False):
        data = {
            'id': self.id,
            'category_id': self.category_id,
            'category_name': self.category.name if self.category else '',
            'category_slug': self.category.slug if self.category else '',
            'slug': self.slug,
            'name': self.name,
            'short_desc': self.short_desc,
            'risk_category': self.risk_category,
            'difficulty': self.difficulty,
            'icon': self.icon,
            'views_count': self.views_count
        }
        if include_full:
            data['content'] = self.get_content()
        return data


class SecurityTool(db.Model):
    __tablename__ = 'security_tools'
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(60), unique=True, nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)
    short_desc = db.Column(db.String(255), nullable=False)
    icon = db.Column(db.String(50), default='Shield')
    route = db.Column(db.String(100), nullable=False)
    badge = db.Column(db.String(50), default='Client/Server')
    features_json = db.Column(db.Text, default='[]')

    def to_dict(self):
        try:
            features = json.loads(self.features_json)
        except Exception:
            features = []
        return {
            'id': self.id,
            'slug': self.slug,
            'name': self.name,
            'short_desc': self.short_desc,
            'icon': self.icon,
            'route': self.route,
            'badge': self.badge,
            'features': features
        }


class LearningModule(db.Model):
    __tablename__ = 'learning_modules'
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(80), unique=True, nullable=False, index=True)
    title = db.Column(db.String(150), nullable=False)
    topic = db.Column(db.String(60), nullable=False)
    level = db.Column(db.String(30), default='Beginner')
    duration_minutes = db.Column(db.Integer, default=10)
    points = db.Column(db.Integer, default=50)
    summary = db.Column(db.Text, nullable=False)
    steps_json = db.Column(db.Text, default='[]')

    def to_dict(self):
        try:
            steps = json.loads(self.steps_json)
        except Exception:
            steps = []
        return {
            'id': self.id,
            'slug': self.slug,
            'title': self.title,
            'topic': self.topic,
            'level': self.level,
            'duration_minutes': self.duration_minutes,
            'points': self.points,
            'summary': self.summary,
            'steps': steps
        }


class QuizQuestion(db.Model):
    __tablename__ = 'quiz_questions'
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(60), nullable=False, index=True)
    level = db.Column(db.String(30), default='Beginner', index=True)
    question = db.Column(db.Text, nullable=False)
    options_json = db.Column(db.Text, nullable=False)  # list of strings
    correct_index = db.Column(db.Integer, nullable=False)
    explanation = db.Column(db.Text, nullable=False)

    def to_dict(self, include_answer=False):
        try:
            options = json.loads(self.options_json)
        except Exception:
            options = []
        data = {
            'id': self.id,
            'category': self.category,
            'level': self.level,
            'question': self.question,
            'options': options,
        }
        if include_answer:
            data['correct_index'] = self.correct_index
            data['explanation'] = self.explanation
        return data


class QuizAttempt(db.Model):
    __tablename__ = 'quiz_attempts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True, index=True)
    category = db.Column(db.String(60), default='General')
    level = db.Column(db.String(30), default='Beginner')
    score = db.Column(db.Integer, nullable=False)
    max_score = db.Column(db.Integer, nullable=False)
    percentage = db.Column(db.Float, default=0.0)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category': self.category,
            'level': self.level,
            'score': self.score,
            'max_score': self.max_score,
            'percentage': round(self.percentage, 1),
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }


class UserProgress(db.Model):
    __tablename__ = 'user_progress'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    item_type = db.Column(db.String(40), nullable=False)  # 'module', 'simulation', 'checklist'
    item_id = db.Column(db.String(80), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    points_earned = db.Column(db.Integer, default=0)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'item_type': self.item_type,
            'item_id': self.item_id,
            'completed': self.completed,
            'points_earned': self.points_earned,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class SavedArticle(db.Model):
    __tablename__ = 'saved_articles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    threat_id = db.Column(db.Integer, db.ForeignKey('threats.id'), nullable=False)
    saved_at = db.Column(db.DateTime, default=datetime.utcnow)

    threat = db.relationship('Threat')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'threat_id': self.threat_id,
            'threat': self.threat.to_dict() if self.threat else None,
            'saved_at': self.saved_at.isoformat() if self.saved_at else None
        }


class CyberAlert(db.Model):
    __tablename__ = 'cyber_alerts'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    source = db.Column(db.String(80), nullable=False)  # CERT-In, CISA, Google Security, etc.
    severity = db.Column(db.String(30), default='Medium')  # Critical, High, Medium, Info
    category = db.Column(db.String(60), default='Fraud Alert')
    summary = db.Column(db.Text, nullable=False)
    recommended_action = db.Column(db.Text, nullable=True)
    original_url = db.Column(db.String(255), nullable=True)
    affected_systems = db.Column(db.String(150), default='General Users / Android / Web')
    published_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'source': self.source,
            'severity': self.severity,
            'category': self.category,
            'summary': self.summary,
            'recommended_action': self.recommended_action,
            'original_url': self.original_url,
            'affected_systems': self.affected_systems,
            'published_at': self.published_at.strftime('%Y-%m-%d') if self.published_at else None,
            'is_active': self.is_active
        }
