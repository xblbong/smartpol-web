from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
from dotenv import load_dotenv
import pymysql
from functools import wraps
from sqlalchemy import text

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'mysql+pymysql://root:@localhost:3306/smartpol_chatbot')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app, origins=os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://localhost:5174').split(','), supports_credentials=True)

# Admin authentication decorator
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
        
        user = User.query.get(session['user_id'])
        if not user or user.role != 'admin' or not user.is_active:
            return jsonify({'error': 'Admin access required'}), 403
            
        return f(*args, **kwargs)
    return decorated_function

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='konsituen')
    description = db.Column(db.Text, nullable=True)
    nik = db.Column(db.String(16), nullable=True)
    nik_verified = db.Column(db.Boolean, default=False)
    kecamatan = db.Column(db.String(50), nullable=True)
    dapil = db.Column(db.String(20), nullable=True)
    avatar_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'full_name': self.full_name,
            'email': self.email,
            'role': self.role,
            'description': self.description,
            'nik': self.nik,
            'nik_verified': self.nik_verified,
            'kecamatan': self.kecamatan,
            'dapil': self.dapil,
            'avatar_url': self.avatar_url,
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active
        }

# Aspirasi Warga Model
class AspirasiWarga(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category = db.Column(db.String(100), nullable=False)  # Pendidikan, Kesehatan, Ekonomi, etc.
    subcategory = db.Column(db.String(255), nullable=False)  # Specific aspiration item
    kecamatan = db.Column(db.String(100), nullable=True)
    dapil = db.Column(db.String(20), nullable=True)
    session_id = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='aspirasi_responses')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category': self.category,
            'subcategory': self.subcategory,
            'kecamatan': self.kecamatan,
            'dapil': self.dapil,
            'session_id': self.session_id,
            'created_at': self.created_at.isoformat()
        }

# Polling Publik Model
class PollingPublik(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    question_id = db.Column(db.Integer, nullable=False)  # 1 for satisfaction, 2 for corruption
    answer = db.Column(db.Integer, nullable=False)  # 1-5 for answer options
    kecamatan = db.Column(db.String(100), nullable=True)
    dapil = db.Column(db.String(20), nullable=True)
    session_id = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='polling_responses')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'question_id': self.question_id,
            'answer': self.answer,
            'kecamatan': self.kecamatan,
            'dapil': self.dapil,
            'session_id': self.session_id,
            'created_at': self.created_at.isoformat()
        }

# Event Pendidikan Politik Model
class EventPendidikanPolitik(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    event_date = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(255), nullable=False)
    organizer = db.Column(db.String(255), nullable=False)
    registration_link = db.Column(db.String(500), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'event_date': self.event_date.isoformat(),
            'location': self.location,
            'organizer': self.organizer,
            'registration_link': self.registration_link,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

# Polling Model
class Polling(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False, default='polling')  # polling, survey
    status = db.Column(db.String(50), nullable=False, default='active')  # active, ended
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, nullable=True)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    creator = db.relationship('User', backref='created_polls')
    options = db.relationship('PollingOption', backref='poll', cascade='all, delete-orphan')
    votes = db.relationship('PollingVote', backref='poll', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'type': self.type,
            'status': self.status,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'options': [option.to_dict() for option in self.options],
            'total_votes': len(self.votes)
        }

# Polling Option Model
class PollingOption(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    polling_id = db.Column(db.Integer, db.ForeignKey('polling.id'), nullable=False)
    option_text = db.Column(db.String(255), nullable=False)
    votes_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'polling_id': self.polling_id,
            'text': self.option_text,
            'votes': self.votes_count,
            'created_at': self.created_at.isoformat()
        }

# Polling Vote Model
class PollingVote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    polling_id = db.Column(db.Integer, db.ForeignKey('polling.id'), nullable=False)
    option_id = db.Column(db.Integer, db.ForeignKey('polling_option.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    voted_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='votes')
    option = db.relationship('PollingOption', backref='votes')
    
    # Unique constraint to prevent multiple votes from same user on same poll
    __table_args__ = (db.UniqueConstraint('polling_id', 'user_id', name='unique_user_poll_vote'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'polling_id': self.polling_id,
            'option_id': self.option_id,
            'user_id': self.user_id,
            'voted_at': self.voted_at.isoformat()
        }

# Policy Model
class Policy(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), nullable=False, default='draft')  # draft, submitted, approved, rejected
    policy_type = db.Column(db.String(100), nullable=False)  # perda, kebijakan, regulasi
    effective_date = db.Column(db.DateTime, nullable=True)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    creator = db.relationship('User', backref='created_policies')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'content': self.content,
            'category': self.category,
            'status': self.status,
            'policy_type': self.policy_type,
            'effective_date': self.effective_date.isoformat() if self.effective_date else None,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

# Officials Model
class Dapil(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)  # e.g., "JAWA TIMUR VI"
    description = db.Column(db.Text, nullable=True)  # e.g., "Malang Raya, Kota dan Kabupaten Malang dan Kota Batu"
    province = db.Column(db.String(100), nullable=False)  # e.g., "Jawa Timur"
    cities = db.Column(db.Text, nullable=True)  # JSON string of cities/kabupaten
    kecamatan_list = db.Column(db.Text, nullable=True)  # JSON string of kecamatan
    nik_prefixes = db.Column(db.Text, nullable=True)  # JSON string of NIK prefixes for verification
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'province': self.province,
            'cities': self.cities,
            'kecamatan_list': self.kecamatan_list,
            'nik_prefixes': self.nik_prefixes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Officials(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    position = db.Column(db.String(255), nullable=False)
    party = db.Column(db.String(100), nullable=True)
    period_start = db.Column(db.Date, nullable=True)
    period_end = db.Column(db.Date, nullable=True)
    electoral_district = db.Column(db.String(100), nullable=True)
    role = db.Column(db.String(50), nullable=False, default='dprd')  # dprd, dpr_ri, pimpinan_daerah
    status_smartpol = db.Column(db.Boolean, default=False)  # True if joined Smartpol, False if not
    bio = db.Column(db.Text, nullable=True)  # Biography/profile
    birth_date = db.Column(db.Date, nullable=True)  # Birth date
    birth_place = db.Column(db.String(100), nullable=True)  # Birth place
    education = db.Column(db.Text, nullable=True)  # Education background
    commission = db.Column(db.String(100), nullable=True)  # Commission (for DPR/DPRD)
    commission_focus = db.Column(db.Text, nullable=True)  # Commission focus areas
    password_hash = db.Column(db.String(255), nullable=True)
    email = db.Column(db.String(120), nullable=True)
    username = db.Column(db.String(80), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'position': self.position,
            'party': self.party,
            'period_start': self.period_start.isoformat() if self.period_start else None,
            'period_end': self.period_end.isoformat() if self.period_end else None,
            'electoral_district': self.electoral_district,
            'role': self.role,
            'status_smartpol': self.status_smartpol,
            'bio': self.bio,
            'birth_date': self.birth_date.isoformat() if self.birth_date else None,
            'birth_place': self.birth_place,
            'education': self.education,
            'commission': self.commission,
            'commission_focus': self.commission_focus,
            'email': self.email,
            'username': self.username,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

# Chat History Model
class ChatHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_user = db.Column(db.Boolean, nullable=False)  # True for user messages, False for bot messages
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    session_id = db.Column(db.String(255), nullable=True)  # To group messages in conversations
    
    # Relationships
    user = db.relationship('User', backref='chat_history')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'message': self.message,
            'is_user': self.is_user,
            'timestamp': self.timestamp.isoformat(),
            'session_id': self.session_id
        }

# Conversation Summary Model
class ConversationSummary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    session_id = db.Column(db.String(255), nullable=False)
    summary = db.Column(db.Text, nullable=False)
    topics = db.Column(db.Text, nullable=True)  # JSON string of topics discussed
    message_count = db.Column(db.Integer, default=0)
    is_polling_related = db.Column(db.Boolean, default=False)
    polling_topics = db.Column(db.Text, nullable=True)  # JSON string of polling-related topics
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='conversation_summaries')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'session_id': self.session_id,
            'summary': self.summary,
            'topics': self.topics,
            'message_count': self.message_count,
            'is_polling_related': self.is_polling_related,
            'polling_topics': self.polling_topics,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

# Report Model
class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=False)  # e.g., 'infrastruktur', 'pelayanan', 'kebijakan'
    location = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(50), default='pending')  # pending, in_progress, resolved, rejected
    priority = db.Column(db.String(20), default='medium')  # low, medium, high, urgent
    admin_notes = db.Column(db.Text, nullable=True)
    resolved_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    resolved_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', foreign_keys=[user_id], backref='reports')
    resolver = db.relationship('User', foreign_keys=[resolved_by])
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': self.user.full_name if self.user else None,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'location': self.location,
            'status': self.status,
            'priority': self.priority,
            'admin_notes': self.admin_notes,
            'resolved_by': self.resolved_by,
            'resolver_name': self.resolver.full_name if self.resolver else None,
            'resolved_at': self.resolved_at.isoformat() if self.resolved_at else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

# Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK', 'message': 'SmartPol Backend is running'})

# Database Health Check and Validation
@app.route('/api/database/health', methods=['GET'])
@admin_required
def database_health_check():
    try:
        # Check database connection
        db.session.execute(text('SELECT 1'))
        
        # Get table information
        tables_result = db.session.execute(text('SHOW TABLES'))
        tables = [row[0] for row in tables_result.fetchall()]
        
        # Get basic statistics
        stats = {}
        for table in tables:
            if table != 'alembic_version':
                count_result = db.session.execute(text(f'SELECT COUNT(*) FROM {table}'))
                stats[table] = count_result.fetchone()[0]
        
        return jsonify({
            'status': 'healthy',
            'tables': tables,
            'statistics': stats,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@app.route('/api/database/validate', methods=['GET'])
@admin_required
def validate_database_integrity():
    try:
        validation_results = []
        
        # Validate user data integrity
        users_with_invalid_email = User.query.filter(~User.email.contains('@')).count()
        validation_results.append({
            'check': 'user_email_format',
            'status': 'pass' if users_with_invalid_email == 0 else 'fail',
            'count': users_with_invalid_email
        })
        
        # Validate polling data integrity
        polls_without_options = db.session.execute(text(
            'SELECT COUNT(*) FROM polling p LEFT JOIN polling_option po ON p.id = po.poll_id WHERE po.id IS NULL'
        )).fetchone()[0]
        validation_results.append({
            'check': 'polls_with_options',
            'status': 'pass' if polls_without_options == 0 else 'warning',
            'count': polls_without_options
        })
        
        # Validate votes integrity
        orphaned_votes = db.session.execute(text(
            'SELECT COUNT(*) FROM polling_vote pv LEFT JOIN polling_option po ON pv.option_id = po.id WHERE po.id IS NULL'
        )).fetchone()[0]
        validation_results.append({
            'check': 'orphaned_votes',
            'status': 'pass' if orphaned_votes == 0 else 'fail',
            'count': orphaned_votes
        })
        
        return jsonify({
            'validation_results': validation_results,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
         return jsonify({'error': str(e)}), 500

@app.route('/api/database/sync', methods=['POST'])
@admin_required
def sync_database_data():
    try:
        sync_results = []
        
        # Sync user data - ensure all required fields are present
        users_updated = 0
        users = User.query.all()
        for user in users:
            updated = False
            if not user.created_at:
                user.created_at = datetime.utcnow()
                updated = True
            if user.is_active is None:
                user.is_active = True
                updated = True
            if updated:
                users_updated += 1
        
        # Sync polling data - ensure end dates are set for ended polls
        polls_updated = 0
        polls = Polling.query.filter_by(status='ended').all()
        for poll in polls:
            if not poll.end_date:
                poll.end_date = datetime.utcnow()
                polls_updated += 1
        
        # Sync policy data - ensure created_at is set
        policies_updated = 0
        policies = Policy.query.all()
        for policy in policies:
            updated = False
            if not policy.created_at:
                policy.created_at = datetime.utcnow()
                updated = True
            if not policy.updated_at:
                policy.updated_at = datetime.utcnow()
                updated = True
            if updated:
                policies_updated += 1
        
        db.session.commit()
        
        sync_results = [
            {'table': 'users', 'updated_count': users_updated},
            {'table': 'polling', 'updated_count': polls_updated},
            {'table': 'policy', 'updated_count': policies_updated}
        ]
        
        return jsonify({
            'status': 'success',
            'sync_results': sync_results,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/check', methods=['GET'])
def check_auth():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        if user:
            return jsonify({
                'authenticated': True,
                'user': user.to_dict()
            }), 200
    return jsonify({'authenticated': False}), 200

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['username', 'fullName', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if user already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400
        
        # Create new user
        user = User(
            username=data['username'],
            full_name=data['fullName'],
            email=data['email'],
            role=data.get('role', 'konsituen'),
            description=data.get('description', '')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username and password are required'}), 400
        
        user = User.query.filter_by(username=data['username']).first()
        
        if user and user.check_password(data['password']) and user.is_active:
            # Define allowed roles for standard login
            allowed_roles = ['konsituen', 'dpr_ri', 'dprd', 'pimpinan_daerah']
            
            # Block admin from logging in through regular login
            if user.role == 'admin':
                return jsonify({'error': 'Admin users must login through admin portal'}), 403
            
            # Block unauthorized roles from logging in
            if user.role not in allowed_roles:
                return jsonify({
                    'error': 'Akses ditolak. Hanya pengguna dengan peran Konsituen, DPRI/DPRD, atau Pimpinan Daerah yang dapat mengakses sistem ini.'
                }), 403
                
            session['user_id'] = user.id
            session['username'] = user.username
            session['role'] = user.role
            return jsonify({
                'message': 'Login successful',
                'user': user.to_dict()
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logout successful'}), 200

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    try:
        data = request.get_json()
        
        if not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username and password are required'}), 400
        
        user = User.query.filter_by(username=data['username']).first()
        
        if user and user.check_password(data['password']) and user.is_active:
            # Check if user is admin
            if user.role != 'admin':
                return jsonify({'error': 'Admin access required'}), 403
                
            session['user_id'] = user.id
            session['username'] = user.username
            session['role'] = user.role
            return jsonify({
                'message': 'Admin login successful',
                'user': user.to_dict(),
                'token': 'admin-session-token'  # Simple token for frontend
            }), 200
        else:
            return jsonify({'error': 'Invalid admin credentials'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/logout', methods=['POST'])
def admin_logout():
    try:
        # Verify admin session exists
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
        
        user = User.query.get(session['user_id'])
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        # Clear session
        session.clear()
        return jsonify({'message': 'Admin logout successful'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/profile', methods=['GET'])
def get_profile():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
            
        current_user_id = session['user_id']
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/profile/update', methods=['PUT'])
def update_profile():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
            
        current_user_id = session['user_id']
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'email' in data:
            # Check if email is already taken by another user
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user and existing_user.id != user.id:
                return jsonify({'error': 'Email already exists'}), 400
            user.email = data['email']
        if 'username' in data:
            # Check if username is already taken by another user
            existing_user = User.query.filter_by(username=data['username']).first()
            if existing_user and existing_user.id != user.id:
                return jsonify({'error': 'Username already exists'}), 400
            user.username = data['username']
        if 'avatar_url' in data:
            user.avatar_url = data['avatar_url']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def validate_nik_by_dapil(nik, dapil_name=None):
    """Validate NIK based on dapil data and determine dapil"""
    if not nik or len(nik) != 16 or not nik.isdigit():
        return None
    
    # Get NIK prefix (first 6 digits)
    nik_prefix = nik[:6]
    
    # If dapil_name is provided, validate against specific dapil
    if dapil_name:
        dapil = Dapil.query.filter_by(name=dapil_name).first()
        if not dapil:
            return None
        
        # Check if NIK prefix matches this dapil
        import json
        try:
            nik_prefixes = json.loads(dapil.nik_prefixes) if dapil.nik_prefixes else []
            if nik_prefix in nik_prefixes:
                return dapil.name
            else:
                return None
        except json.JSONDecodeError:
            return None
    
    # If no specific dapil, check all dapils to find match
    dapils = Dapil.query.all()
    for dapil in dapils:
        try:
            import json
            nik_prefixes = json.loads(dapil.nik_prefixes) if dapil.nik_prefixes else []
            if nik_prefix in nik_prefixes:
                return dapil.name
        except json.JSONDecodeError:
            continue
    
    return None

def validate_nik_detailed(nik, dapil_name=None):
    """Validate NIK with detailed response for API endpoints"""
    if not nik or len(nik) != 16 or not nik.isdigit():
        return False, None, "NIK must be 16 digits"
    
    # Get NIK prefix (first 6 digits)
    nik_prefix = nik[:6]
    
    # If dapil_name is provided, validate against specific dapil
    if dapil_name:
        dapil = Dapil.query.filter_by(name=dapil_name).first()
        if not dapil:
            return False, None, f"Dapil {dapil_name} not found"
        
        # Check if NIK prefix matches this dapil
        import json
        try:
            nik_prefixes = json.loads(dapil.nik_prefixes) if dapil.nik_prefixes else []
            if nik_prefix in nik_prefixes:
                # Get kecamatan info for Kota Malang
                kecamatan_name = dapil.name  # Default to dapil name
                if 'KOTA MALANG' in dapil.name:
                    kecamatan_mapping = {
                        '357301': 'Klojen',
                        '357302': 'Blimbing', 
                        '357303': 'Kedungkandang',
                        '357304': 'Sukun',
                        '357305': 'Lowokwaru'
                    }
                    kecamatan_name = kecamatan_mapping.get(nik_prefix, dapil.name)
                
                return True, {'name': kecamatan_name, 'dapil': dapil.name}, f"Valid NIK for {dapil.name}"
            else:
                return False, None, f"NIK is not from {dapil.name} area"
        except json.JSONDecodeError:
            return False, None, "Error reading dapil data"
    
    # If no specific dapil, check all dapils to find match
    dapils = Dapil.query.all()
    for dapil in dapils:
        try:
            import json
            nik_prefixes = json.loads(dapil.nik_prefixes) if dapil.nik_prefixes else []
            if nik_prefix in nik_prefixes:
                # Get kecamatan info for Kota Malang
                kecamatan_name = dapil.name  # Default to dapil name
                if 'KOTA MALANG' in dapil.name:
                    kecamatan_mapping = {
                        '357301': 'Klojen',
                        '357302': 'Blimbing', 
                        '357303': 'Kedungkandang',
                        '357304': 'Sukun',
                        '357305': 'Lowokwaru'
                    }
                    kecamatan_name = kecamatan_mapping.get(nik_prefix, dapil.name)
                
                return True, {'name': kecamatan_name, 'dapil': dapil.name}, f"Valid NIK for {dapil.name}"
        except json.JSONDecodeError:
            continue
    
    return False, None, "NIK is not from any registered dapil area"

@app.route('/api/profile/verify-nik', methods=['POST'])
def verify_nik():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
            
        current_user_id = session['user_id']
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        nik = data.get('nik')
        
        # Validate NIK using dapil data
        is_valid, kecamatan_info, message = validate_nik_detailed(nik)
        
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Check if NIK is already verified by another user
        existing_user = User.query.filter_by(nik=nik, nik_verified=True).first()
        if existing_user and existing_user.id != user.id:
            return jsonify({'error': 'NIK already verified by another user'}), 400
        
        # Update user NIK, kecamatan, dapil and mark as verified
        user.nik = nik
        user.nik_verified = True
        user.kecamatan = kecamatan_info['name']
        user.dapil = kecamatan_info['dapil']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'NIK verified successfully',
            'user': user.to_dict(),
            'kecamatan': kecamatan_info['name'],
            'dapil': kecamatan_info['dapil']
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Polling API Endpoints
@app.route('/api/polling', methods=['GET'])
def get_polls():
    try:
        polls = Polling.query.order_by(Polling.created_at.desc()).all()
        user_id = session.get('user_id')
        
        polls_data = []
        for poll in polls:
            poll_dict = poll.to_dict()
            
            # Check if current user has voted on this poll
            if user_id:
                existing_vote = PollingVote.query.filter_by(
                    polling_id=poll.id,
                    user_id=user_id
                ).first()
                poll_dict['has_voted'] = existing_vote is not None
                if existing_vote:
                    poll_dict['voted_option_id'] = existing_vote.option_id
            else:
                poll_dict['has_voted'] = False
                
            polls_data.append(poll_dict)
        
        return jsonify({
            'success': True,
            'polls': polls_data
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/polling', methods=['POST'])
def create_poll():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
            
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'category', 'options']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        if len(data['options']) < 2:
            return jsonify({'error': 'At least 2 options are required'}), 400
        
        # Create new poll
        poll = Polling(
            title=data['title'],
            description=data['description'],
            category=data['category'],
            created_by=session['user_id'],
            end_date=datetime.fromisoformat(data['end_date']) if data.get('end_date') else None
        )
        
        db.session.add(poll)
        db.session.flush()  # Get poll ID
        
        # Create poll options
        for option_text in data['options']:
            option = PollingOption(
                polling_id=poll.id,
                option_text=option_text
            )
            db.session.add(option)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Poll created successfully',
            'poll': poll.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/polling/<int:poll_id>/vote', methods=['POST'])
def vote_poll(poll_id):
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
            
        user_id = session['user_id']
        
        # Check if user has verified NIK
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        if not user.nik_verified:
            return jsonify({'error': 'NIK verification required to vote'}), 400
        
        data = request.get_json()
        option_id = data.get('option_id')
        
        if not option_id:
            return jsonify({'error': 'option_id is required'}), 400
        
        # Check if poll exists and is active
        poll = Polling.query.get(poll_id)
        if not poll:
            return jsonify({'error': 'Poll not found'}), 404
        
        if poll.status != 'active':
            return jsonify({'error': 'Poll is not active'}), 400
        
        # Check if user already voted
        existing_vote = PollingVote.query.filter_by(
            polling_id=poll_id,
            user_id=user_id
        ).first()
        
        if existing_vote:
            return jsonify({'error': 'You have already voted on this poll'}), 400
        
        # Verify option belongs to this poll
        option = PollingOption.query.filter_by(
            id=option_id,
            polling_id=poll_id
        ).first()
        
        if not option:
            return jsonify({'error': 'Invalid option for this poll'}), 400
        
        # Create vote
        vote = PollingVote(
            polling_id=poll_id,
            option_id=option_id,
            user_id=user_id
        )
        
        # Update option vote count
        option.votes_count += 1
        
        # Update poll status to completed after voting
        poll.status = 'completed'
        poll.end_date = datetime.utcnow()
        
        db.session.add(vote)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Vote recorded successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Policy API Endpoints
@app.route('/api/policies', methods=['GET'])
def get_policies():
    try:
        status_filter = request.args.get('status')
        category_filter = request.args.get('category')
        
        query = Policy.query
        
        if status_filter:
            query = query.filter_by(status=status_filter)
        
        if category_filter:
            query = query.filter_by(category=category_filter)
        
        policies = query.order_by(Policy.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'policies': [policy.to_dict() for policy in policies]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/policies', methods=['POST'])
def create_policy():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
            
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'content', 'category', 'policy_type']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create new policy
        policy = Policy(
            title=data['title'],
            description=data['description'],
            content=data['content'],
            category=data['category'],
            policy_type=data['policy_type'],
            status=data.get('status', 'draft'),
            created_by=session['user_id'],
            effective_date=datetime.fromisoformat(data['effective_date']) if data.get('effective_date') else None
        )
        
        db.session.add(policy)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Policy created successfully',
            'policy': policy.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/policies/<int:policy_id>', methods=['GET'])
def get_policy(policy_id):
    try:
        policy = Policy.query.get(policy_id)
        if not policy:
            return jsonify({'error': 'Policy not found'}), 404
        
        return jsonify({
            'success': True,
            'policy': policy.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Admin API endpoints
@app.route('/api/admin/users', methods=['GET'])
@admin_required
def get_all_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

@app.route('/api/admin/users', methods=['POST'])
@admin_required
def create_user():
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['username', 'full_name', 'email', 'password', 'role']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'error': f'{field} is required'}), 400
    
    # Check if username or email already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    # Create new user
    new_user = User(
        username=data['username'],
        full_name=data['full_name'],
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        role=data['role']
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully', 'user': new_user.to_dict()}), 201

@app.route('/api/admin/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    
    current_user = User.query.get(session['user_id'])
    if not current_user or current_user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    user_to_update = User.query.get(user_id)
    if not user_to_update:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    # Update user fields
    if 'username' in data:
        existing_user = User.query.filter_by(username=data['username']).first()
        if existing_user and existing_user.id != user_id:
            return jsonify({'error': 'Username already exists'}), 400
        user_to_update.username = data['username']
    
    if 'full_name' in data:
        user_to_update.full_name = data['full_name']
    
    if 'email' in data:
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user and existing_user.id != user_id:
            return jsonify({'error': 'Email already exists'}), 400
        user_to_update.email = data['email']
    
    if 'role' in data:
        user_to_update.role = data['role']
    
    user_to_update.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({'message': 'User updated successfully', 'user': user_to_update.to_dict()}), 200

@app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    
    current_user = User.query.get(session['user_id'])
    if not current_user or current_user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    user_to_delete = User.query.get(user_id)
    if not user_to_delete:
        return jsonify({'error': 'User not found'}), 404
    
    # Prevent admin from deleting themselves
    if user_to_delete.id == current_user.id:
        return jsonify({'error': 'Cannot delete your own account'}), 400
    
    db.session.delete(user_to_delete)
    db.session.commit()
    
    return jsonify({'message': 'User deleted successfully'}), 200

@app.route('/api/admin/polls/<int:poll_id>', methods=['PUT'])
@admin_required
def update_poll(poll_id):
    
    poll = Polling.query.get(poll_id)
    if not poll:
        return jsonify({'error': 'Poll not found'}), 404
    
    data = request.get_json()
    
    # Update poll fields
    if 'title' in data:
        poll.title = data['title']
    if 'description' in data:
        poll.description = data['description']
    if 'status' in data:
        poll.status = data['status']
    if 'start_date' in data:
        poll.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d %H:%M:%S')
    if 'end_date' in data:
        poll.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d %H:%M:%S')
    if 'category' in data:
        poll.category = data['category']
    
    # Update options if provided
    if 'options' in data and data['options']:
        if len(data['options']) < 2:
            return jsonify({'error': 'At least 2 options are required'}), 400
        
        # Delete existing options
        PollingOption.query.filter_by(polling_id=poll_id).delete()
        
        # Create new options
        for option_text in data['options']:
            if option_text and option_text.strip():  # Only add non-empty options
                option = PollingOption(
                    polling_id=poll_id,
                    option_text=option_text.strip()
                )
                db.session.add(option)
    
    poll.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({'message': 'Poll updated successfully', 'poll': poll.to_dict()}), 200

@app.route('/api/admin/polls/<int:poll_id>', methods=['DELETE'])
@admin_required
def delete_poll(poll_id):
    
    poll = Polling.query.get(poll_id)
    if not poll:
        return jsonify({'error': 'Poll not found'}), 404
    
    # Delete associated votes and options
    PollingVote.query.filter_by(polling_id=poll_id).delete()
    PollingOption.query.filter_by(polling_id=poll_id).delete()
    
    db.session.delete(poll)
    db.session.commit()
    
    return jsonify({'message': 'Poll deleted successfully'}), 200

@app.route('/api/admin/polls', methods=['POST'])
@admin_required
def create_poll_admin():
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['title', 'description', 'category', 'options']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'error': f'{field} is required'}), 400
    
    if len(data['options']) < 2:
        return jsonify({'error': 'At least 2 options are required'}), 400
    
    # Create new poll
    new_poll = Polling(
        title=data['title'],
        description=data['description'],
        category=data['category'],
        status=data.get('status', 'active'),
        type=data.get('type', 'polling'),
        start_date=datetime.strptime(data['start_date'], '%Y-%m-%d %H:%M:%S') if data.get('start_date') else datetime.utcnow(),
        end_date=datetime.strptime(data['end_date'], '%Y-%m-%d %H:%M:%S') if data.get('end_date') else None,
        created_by=session['user_id']
    )
    
    db.session.add(new_poll)
    db.session.flush()  # Get poll ID
    
    # Create poll options
    for option_text in data['options']:
        option = PollingOption(
            polling_id=new_poll.id,
            option_text=option_text
        )
        db.session.add(option)
    
    db.session.commit()
    
    return jsonify({'message': 'Poll created successfully', 'poll': new_poll.to_dict()}), 201

@app.route('/api/admin/policies/<int:policy_id>', methods=['PUT'])
@admin_required
def update_policy(policy_id):
    
    policy = Policy.query.get(policy_id)
    if not policy:
        return jsonify({'error': 'Policy not found'}), 404
    
    data = request.get_json()
    
    # Update policy fields
    if 'title' in data:
        policy.title = data['title']
    if 'description' in data:
        policy.description = data['description']
    if 'content' in data:
        policy.content = data['content']
    if 'category' in data:
        policy.category = data['category']
    if 'status' in data:
        policy.status = data['status']
    
    policy.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({'message': 'Policy updated successfully', 'policy': policy.to_dict()}), 200

@app.route('/api/admin/policies/<int:policy_id>', methods=['DELETE'])
@admin_required
def delete_policy(policy_id):
    
    policy = Policy.query.get(policy_id)
    if not policy:
        return jsonify({'error': 'Policy not found'}), 404
    
    db.session.delete(policy)
    db.session.commit()
    
    return jsonify({'message': 'Policy deleted successfully'}), 200

@app.route('/api/admin/policies', methods=['POST'])
@admin_required
def create_policy_admin():
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['title', 'description', 'content', 'category']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'error': f'{field} is required'}), 400
    
    # Create new policy
    new_policy = Policy(
        title=data['title'],
        description=data['description'],
        content=data['content'],
        category=data['category'],
        status=data.get('status', 'draft'),
        policy_type=data.get('policy_type', 'regulation'),
        effective_date=datetime.strptime(data['effective_date'], '%Y-%m-%d %H:%M:%S') if data.get('effective_date') else None,
        created_by=session['user_id']
    )
    
    db.session.add(new_policy)
    db.session.commit()
    
    return jsonify({'message': 'Policy created successfully', 'policy': new_policy.to_dict()}), 201

# Chat History Routes
@app.route('/api/chat/history', methods=['GET'])
def get_chat_history():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user_id = session['user_id']
    
    # Check if user exists
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    # Removed NIK verification requirement - PICO users can now access chat without verification
    session_id = request.args.get('session_id')
    
    query = ChatHistory.query.filter_by(user_id=user_id)
    if session_id:
        query = query.filter_by(session_id=session_id)
    
    chat_history = query.order_by(ChatHistory.timestamp.asc()).all()
    
    return jsonify({
        'chat_history': [message.to_dict() for message in chat_history]
    }), 200

@app.route('/api/chat/history', methods=['POST'])
def save_chat_message():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user_id = session['user_id']
    
    # Check if user exists
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    # Removed NIK verification requirement - PICO users can now save chat messages without verification
    
    data = request.get_json()
    if not data or 'message' not in data or 'is_user' not in data:
        return jsonify({'error': 'Message and is_user fields are required'}), 400
    
    chat_message = ChatHistory(
        user_id=user_id,
        message=data['message'],
        is_user=data['is_user'],
        session_id=data.get('session_id')
    )
    
    db.session.add(chat_message)
    db.session.commit()
    
    return jsonify({
        'message': 'Chat message saved successfully',
        'chat_message': chat_message.to_dict()
    }), 201

@app.route('/api/chat/sessions', methods=['GET'])
def get_chat_sessions():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user_id = session['user_id']
    
    # Get distinct session IDs with latest message timestamp
    sessions = db.session.query(
        ChatHistory.session_id,
        db.func.max(ChatHistory.timestamp).label('last_message_time'),
        db.func.count(ChatHistory.id).label('message_count')
    ).filter_by(user_id=user_id).filter(
        ChatHistory.session_id.isnot(None)
    ).group_by(ChatHistory.session_id).order_by(
        db.func.max(ChatHistory.timestamp).desc()
    ).all()
    
    session_list = []
    for session_id, last_message_time, message_count in sessions:
        # Get the first user message as session title
        first_message = ChatHistory.query.filter_by(
            user_id=user_id,
            session_id=session_id,
            is_user=True
        ).order_by(ChatHistory.timestamp.asc()).first()
        
        title = first_message.message[:50] + '...' if first_message and len(first_message.message) > 50 else (first_message.message if first_message else 'Chat Session')
        
        session_list.append({
            'session_id': session_id,
            'title': title,
            'last_message_time': last_message_time.isoformat(),
            'message_count': message_count
        })
    
    return jsonify({'sessions': session_list}), 200

# Conversation Summary Routes
@app.route('/api/chat/summary', methods=['POST'])
def save_conversation_summary():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    data = request.get_json()
    if not data or 'session_id' not in data or 'summary' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    user_id = session['user_id']
    
    # Check if summary already exists for this session
    existing_summary = ConversationSummary.query.filter_by(
        user_id=user_id,
        session_id=data['session_id']
    ).first()
    
    if existing_summary:
        # Update existing summary
        existing_summary.summary = data['summary']
        existing_summary.topics = data.get('topics')
        existing_summary.message_count = data.get('message_count', 0)
        existing_summary.is_polling_related = data.get('is_polling_related', False)
        existing_summary.polling_topics = data.get('polling_topics')
        existing_summary.updated_at = datetime.utcnow()
        
        try:
            db.session.commit()
            return jsonify({
                'message': 'Conversation summary updated successfully',
                'summary': existing_summary.to_dict()
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    else:
        # Create new summary
        conversation_summary = ConversationSummary(
            user_id=user_id,
            session_id=data['session_id'],
            summary=data['summary'],
            topics=data.get('topics'),
            message_count=data.get('message_count', 0),
            is_polling_related=data.get('is_polling_related', False),
            polling_topics=data.get('polling_topics')
        )
        
        try:
            db.session.add(conversation_summary)
            db.session.commit()
            return jsonify({
                'message': 'Conversation summary saved successfully',
                'summary': conversation_summary.to_dict()
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

@app.route('/api/chat/summary/<session_id>', methods=['GET'])
def get_conversation_summary(session_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user_id = session['user_id']
    
    summary = ConversationSummary.query.filter_by(
        user_id=user_id,
        session_id=session_id
    ).first()
    
    if not summary:
        return jsonify({'error': 'Summary not found'}), 404
    
    return jsonify({'summary': summary.to_dict()}), 200

@app.route('/api/chat/summaries', methods=['GET'])
def get_conversation_summaries():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user_id = session['user_id']
    
    summaries = ConversationSummary.query.filter_by(
        user_id=user_id
    ).order_by(ConversationSummary.updated_at.desc()).all()
    
    return jsonify({
        'summaries': [summary.to_dict() for summary in summaries]
    }), 200

# Report Routes
@app.route('/api/reports', methods=['POST'])
def create_report():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    data = request.get_json()
    if not data or 'title' not in data or 'description' not in data or 'category' not in data:
        return jsonify({'error': 'Title, description, and category are required'}), 400
    
    report = Report(
        user_id=session['user_id'],
        title=data['title'],
        description=data['description'],
        category=data['category'],
        location=data.get('location'),
        priority=data.get('priority', 'medium')
    )
    
    db.session.add(report)
    db.session.commit()
    
    return jsonify({
        'message': 'Report created successfully',
        'report': report.to_dict()
    }), 201

@app.route('/api/reports', methods=['GET'])
def get_reports():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Admin can see all reports, regular users only see their own
    if user.is_admin:
        reports = Report.query.order_by(Report.created_at.desc()).all()
    else:
        reports = Report.query.filter_by(user_id=session['user_id']).order_by(Report.created_at.desc()).all()
    
    return jsonify({
        'reports': [report.to_dict() for report in reports]
    }), 200

@app.route('/api/reports/recent', methods=['GET'])
def get_recent_reports():
    """Get recent reports for kepala daerah chatbot"""
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Check if user has kepala daerah role
    if user.role not in ['dpr_ri', 'dprd', 'pimpinan_daerah']:
        return jsonify({'error': 'Access denied'}), 403
    
    try:
        # Get recent reports (last 7 days, limit 10)
        from datetime import datetime, timedelta
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        
        reports = Report.query.join(User, Report.user_id == User.id)\
            .filter(Report.created_at >= seven_days_ago)\
            .order_by(Report.created_at.desc())\
            .limit(10).all()
        
        reports_data = []
        for report in reports:
            report_dict = report.to_dict()
            # Add user information
            report_dict['user_name'] = report.user.full_name
            report_dict['user_kecamatan'] = report.user.kecamatan
            report_dict['user_kelurahan'] = getattr(report.user, 'kelurahan', None)
            reports_data.append(report_dict)
        
        return jsonify({
            'success': True,
            'reports': reports_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/reports/<int:report_id>', methods=['GET'])
def get_report(report_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user = User.query.get(session['user_id'])
    report = Report.query.get_or_404(report_id)
    
    # Check if user can access this report
    if not user.is_admin and report.user_id != session['user_id']:
        return jsonify({'error': 'Access denied'}), 403
    
    return jsonify({'report': report.to_dict()}), 200

@app.route('/api/reports/<int:report_id>', methods=['PUT'])
def update_report(report_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user = User.query.get(session['user_id'])
    report = Report.query.get_or_404(report_id)
    
    # Only admin can update reports
    if not user.is_admin:
        return jsonify({'error': 'Access denied'}), 403
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Update allowed fields
    if 'status' in data:
        report.status = data['status']
    if 'priority' in data:
        report.priority = data['priority']
    if 'admin_notes' in data:
        report.admin_notes = data['admin_notes']
    
    # If resolving the report
    if data.get('status') == 'resolved' and not report.resolved_at:
        report.resolved_by = session['user_id']
        report.resolved_at = datetime.utcnow()
    
    report.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({
        'message': 'Report updated successfully',
        'report': report.to_dict()
    }), 200

@app.route('/api/reports/<int:report_id>', methods=['DELETE'])
def delete_report(report_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user = User.query.get(session['user_id'])
    if not user.is_admin:
        return jsonify({'error': 'Access denied'}), 403
    
    report = Report.query.get_or_404(report_id)
    db.session.delete(report)
    db.session.commit()
    
    return jsonify({'message': 'Report deleted successfully'}), 200

@app.route('/api/reports/stats', methods=['GET'])
def get_report_stats():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user = User.query.get(session['user_id'])
    if not user.is_admin:
        return jsonify({'error': 'Access denied'}), 403
    
    # Get report statistics
    total_reports = Report.query.count()
    pending_reports = Report.query.filter_by(status='pending').count()
    in_progress_reports = Report.query.filter_by(status='in_progress').count()
    resolved_reports = Report.query.filter_by(status='resolved').count()
    
    # Get reports by category
    category_stats = db.session.query(
        Report.category,
        db.func.count(Report.id).label('count')
    ).group_by(Report.category).all()
    
    # Get reports by priority
    priority_stats = db.session.query(
        Report.priority,
        db.func.count(Report.id).label('count')
    ).group_by(Report.priority).all()
    
    return jsonify({
        'total_reports': total_reports,
        'pending_reports': pending_reports,
        'in_progress_reports': in_progress_reports,
        'resolved_reports': resolved_reports,
        'category_stats': [{'category': cat, 'count': count} for cat, count in category_stats],
        'priority_stats': [{'priority': pri, 'count': count} for pri, count in priority_stats]
    }), 200







# Report Management Endpoints







# Policies Management Endpoints
@app.route('/api/admin/policies', methods=['GET'])
@admin_required
def get_all_policies_admin():
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        search = request.args.get('search', '')
        category_filter = request.args.get('category')
        status_filter = request.args.get('status')
        
        query = Policy.query
        
        # Apply search filter
        if search:
            query = query.filter(
                db.or_(
                    Policy.title.ilike(f'%{search}%'),
                    Policy.description.ilike(f'%{search}%')
                )
            )
        
        # Apply category filter
        if category_filter:
            query = query.filter(Policy.category == category_filter)
        
        # Apply status filter
        if status_filter:
            query = query.filter(Policy.status == status_filter)
        
        # Paginate results
        policies = query.order_by(Policy.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        policies_data = []
        for policy in policies.items:
            policies_data.append({
                'id': policy.id,
                'title': policy.title,
                'description': policy.description,
                'category': policy.category,
                'status': policy.status,
                'policy_type': policy.policy_type,
                'effective_date': policy.effective_date.isoformat() if policy.effective_date else None,
                'created_at': policy.created_at.isoformat() if policy.created_at else None,
                'creator': policy.creator.full_name if policy.creator else None
            })
        
        return jsonify({
            'policies': policies_data,
            'total': policies.total,
            'pages': policies.pages,
            'current_page': page,
            'per_page': per_page
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/policies/stats', methods=['GET'])
def get_policies_stats():
    try:
        total_policies = Policy.query.count()
        draft_policies = Policy.query.filter_by(status='draft').count()
        approved_policies = Policy.query.filter_by(status='approved').count()
        rejected_policies = Policy.query.filter_by(status='rejected').count()
        
        # Policies by category
        category_stats = db.session.query(
            Policy.category,
            db.func.count(Policy.id).label('count')
        ).group_by(Policy.category).all()
        
        category_data = [{'category': cat, 'count': count} for cat, count in category_stats]
        
        return jsonify({
            'total_policies': total_policies,
            'draft_policies': draft_policies,
            'approved_policies': approved_policies,
            'rejected_policies': rejected_policies,
            'category_breakdown': category_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Polling Management Endpoints
@app.route('/api/admin/polls', methods=['GET'])
@admin_required
def get_all_polls_admin():
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        search = request.args.get('search', '')
        category_filter = request.args.get('category')
        status_filter = request.args.get('status')
        
        query = Polling.query
        
        # Apply search filter
        if search:
            query = query.filter(
                db.or_(
                    Polling.title.ilike(f'%{search}%'),
                    Polling.description.ilike(f'%{search}%')
                )
            )
        
        # Apply category filter
        if category_filter:
            query = query.filter(Polling.category == category_filter)
        
        # Apply status filter
        if status_filter:
            query = query.filter(Polling.status == status_filter)
        
        # Paginate results
        polls = query.order_by(Polling.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        polls_data = []
        for poll in polls.items:
            # Get vote count for each poll
            vote_count = PollingVote.query.filter_by(polling_id=poll.id).count()
            
            polls_data.append({
                'id': poll.id,
                'title': poll.title,
                'description': poll.description,
                'category': poll.category,
                'type': poll.type,
                'status': poll.status,
                'start_date': poll.start_date.isoformat() if poll.start_date else None,
                'end_date': poll.end_date.isoformat() if poll.end_date else None,
                'created_at': poll.created_at.isoformat() if poll.created_at else None,
                'creator': poll.creator.full_name if poll.creator else None,
                'vote_count': vote_count,
                'options_count': len(poll.options)
            })
        
        return jsonify({
            'polls': polls_data,
            'total': polls.total,
            'pages': polls.pages,
            'current_page': page,
            'per_page': per_page
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/polls/stats', methods=['GET'])
def get_polls_stats():
    try:
        total_polls = Polling.query.count()
        active_polls = Polling.query.filter_by(status='active').count()
        ended_polls = Polling.query.filter_by(status='ended').count()
        total_votes = PollingVote.query.count()
        
        # Polls by category
        category_stats = db.session.query(
            Polling.category,
            db.func.count(Polling.id).label('count')
        ).group_by(Polling.category).all()
        
        category_data = [{'category': cat, 'count': count} for cat, count in category_stats]
        
        # Most voted polls
        top_polls = db.session.query(
            Polling.id,
            Polling.title,
            db.func.count(PollingVote.id).label('vote_count')
        ).join(PollingVote).group_by(Polling.id).order_by(
            db.func.count(PollingVote.id).desc()
        ).limit(5).all()
        
        top_polls_data = [{
            'id': poll_id,
            'title': title,
            'vote_count': vote_count
        } for poll_id, title, vote_count in top_polls]
        
        return jsonify({
            'total_polls': total_polls,
            'active_polls': active_polls,
            'ended_polls': ended_polls,
            'total_votes': total_votes,
            'category_breakdown': category_data,
            'top_polls': top_polls_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/polls/<int:poll_id>/results', methods=['GET'])
@admin_required
def get_poll_results(poll_id):
    try:
        poll = Polling.query.get_or_404(poll_id)
        
        # Get options with vote counts
        options_data = []
        total_votes = 0
        
        for option in poll.options:
            vote_count = PollingVote.query.filter_by(
                polling_id=poll.id,
                option_id=option.id
            ).count()
            
            options_data.append({
                'id': option.id,
                'option_text': option.option_text,
                'vote_count': vote_count
            })
            total_votes += vote_count
        
        # Calculate percentages
        for option in options_data:
            if total_votes > 0:
                option['percentage'] = round((option['vote_count'] / total_votes) * 100, 2)
            else:
                option['percentage'] = 0
        
        return jsonify({
            'poll': {
                'id': poll.id,
                'title': poll.title,
                'description': poll.description,
                'status': poll.status,
                'total_votes': total_votes
            },
            'options': options_data
        })
    except Exception as e:
         return jsonify({'error': str(e)}), 500





@app.route('/api/admin/reports/poll-performance', methods=['GET'])
@admin_required
def get_poll_performance():
    try:
        from datetime import datetime, timedelta
        from sqlalchemy import func
        
        # Get top performing polls by vote count
        top_polls = db.session.query(
            Polling.id,
            Polling.title,
            Polling.category,
            func.count(PollingVote.id).label('vote_count')
        ).join(PollingVote, Polling.id == PollingVote.polling_id)\
         .group_by(Polling.id, Polling.title, Polling.category)\
         .order_by(func.count(PollingVote.id).desc())\
         .limit(10).all()
        
        performance_data = []
        for poll in top_polls:
            performance_data.append({
                'id': poll.id,
                'title': poll.title,
                'category': poll.category,
                'vote_count': poll.vote_count
            })
        
        return jsonify({
            'success': True,
            'data': performance_data
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/admin/reports/category-stats', methods=['GET'])
@admin_required
def get_category_stats():
    try:
        from sqlalchemy import func
        
        # Get polling statistics by category
        category_stats = db.session.query(
            Polling.category,
            func.count(Polling.id).label('poll_count'),
            func.count(PollingVote.id).label('vote_count')
        ).outerjoin(PollingVote, Polling.id == PollingVote.polling_id)\
         .group_by(Polling.category)\
         .order_by(func.count(Polling.id).desc()).all()
        
        stats_data = []
        for stat in category_stats:
            stats_data.append({
                'category': stat.category,
                'poll_count': stat.poll_count,
                'vote_count': stat.vote_count or 0
            })
        
        return jsonify({
            'success': True,
            'data': stats_data
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/admin/reports/recent-activities', methods=['GET'])
@admin_required
def get_recent_activities():
    try:
        from datetime import datetime, timedelta
        
        # Get recent polling activities (last 7 days)
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=7)
        
        # Recent polls created
        recent_polls = Polling.query.filter(
            Polling.created_at >= start_date
        ).order_by(Polling.created_at.desc()).limit(5).all()
        
        # Recent votes
        recent_votes = db.session.query(
            PollingVote.voted_at,
            Polling.title,
            User.username
        ).join(Polling, PollingVote.polling_id == Polling.id)\
         .join(User, PollingVote.user_id == User.id)\
         .filter(PollingVote.voted_at >= start_date)\
         .order_by(PollingVote.voted_at.desc()).limit(10).all()
        
        activities = []
        
        # Add recent polls
        for poll in recent_polls:
            activities.append({
                'type': 'poll_created',
                'title': f'New poll: {poll.title}',
                'timestamp': poll.created_at.isoformat(),
                'category': poll.category
            })
        
        # Add recent votes
        for vote in recent_votes:
            activities.append({
                'type': 'vote_cast',
                'title': f'{vote.username} voted on {vote.title}',
                'timestamp': vote.voted_at.isoformat(),
                'category': 'voting'
            })
        
        # Sort by timestamp
        activities.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return jsonify({
            'success': True,
            'data': activities[:15]  # Return top 15 activities
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Additional Admin Utilities
@app.route('/api/admin/users/stats', methods=['GET'])
def get_users_stats():
    if 'user_id' not in session or session.get('role') != 'admin':
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        from datetime import datetime, timedelta
        
        # Total users
        total_users = User.query.count()
        
        # Active users
        active_users = User.query.filter_by(is_active=True).count()
        
        # Users by role
        users_by_role = db.session.query(
            User.role,
            db.func.count(User.id).label('count')
        ).group_by(User.role).all()
        
        role_stats = {role: count for role, count in users_by_role}
        
        # Users by verification status
        verified_users = User.query.filter_by(nik_verified=True).count()
        unverified_users = total_users - verified_users
        
        # Recent registrations (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_registrations = User.query.filter(User.created_at >= thirty_days_ago).count()
        
        return jsonify({
            'total_users': total_users,
            'active_users': active_users,
            'inactive_users': total_users - active_users,
            'verified_users': verified_users,
            'unverified_users': unverified_users,
            'recent_registrations': recent_registrations,
            'users_by_role': role_stats
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/dashboard/quick-stats', methods=['GET'])
@admin_required
def get_dashboard_quick_stats():
    try:
        from datetime import datetime, timedelta
        
        # Today's stats
        today = datetime.utcnow().date()
        today_start = datetime.combine(today, datetime.min.time())
        today_end = datetime.combine(today, datetime.max.time())
        
        # Get basic counts
        total_users = User.query.count()
        active_polls = Polling.query.filter_by(status='active').count()
        total_policies = Policy.query.count()
        chatbot_interactions = ChatHistory.query.with_entities(ChatHistory.session_id).distinct().count()
        
        # Format data sesuai dengan yang diharapkan frontend
        stats = {
            'total_users': total_users,
            'active_polls': active_polls,
            'total_policies': total_policies,
            'chatbot_interactions': chatbot_interactions,
            'today': {
                'new_users': User.query.filter(
                    User.created_at >= today_start,
                    User.created_at <= today_end
                ).count(),
                'new_votes': PollingVote.query.filter(
                    PollingVote.voted_at >= today_start,
                    PollingVote.voted_at <= today_end
                ).count(),
                'chatbot_interactions': ChatHistory.query.filter(
                    ChatHistory.timestamp >= today_start,
                    ChatHistory.timestamp <= today_end
                ).count(),
                'new_reports': Report.query.filter(
                    Report.created_at >= today_start,
                    Report.created_at <= today_end
                ).count()
            },
            'total': {
                'users': total_users,
                'polls': Polling.query.count(),
                'policies': total_policies,
                'reports': Report.query.count()
            },
            'active': {
                'polls': active_polls,
                'users': User.query.filter_by(is_active=True).count()
            }
        }
        
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dapil/by-kecamatan/<kecamatan>', methods=['GET'])
def get_dapil_by_kecamatan(kecamatan):
    """Get dapil information by kecamatan"""
    try:
        # For Malang area, we know it's JAWA TIMUR VI
        dapil = Dapil.query.filter_by(name='JAWA TIMUR VI').first()
        if dapil:
            return jsonify(dapil.to_dict())
        else:
            return jsonify({'error': 'Dapil not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/officials/by-dapil/<dapil_name>', methods=['GET'])
def get_officials_by_dapil(dapil_name):
    """Get all officials by dapil name"""
    try:
        officials = Officials.query.filter_by(electoral_district=dapil_name).all()
        return jsonify([official.to_dict() for official in officials])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/dapil-info', methods=['GET'])
def get_user_dapil_info():
    """Get user's dapil and officials information based on their profile"""
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
        
        user = User.query.get(session['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get dapil info (for Malang area, it's JAWA TIMUR VI)
        dapil = Dapil.query.filter_by(name='JAWA TIMUR VI').first()
        
        # Get officials for this dapil
        officials = Officials.query.filter_by(electoral_district='JAWA TIMUR VI').all()
        
        # Group officials by role
        officials_by_role = {
            'gubernur': [],
            'bupati': [],
            'walikota': [],
            'dpri': [],
            'dprd_provinsi': [],
            'dprd_kota': []
        }
        
        for official in officials:
            if 'gubernur' in official.position.lower():
                officials_by_role['gubernur'].append(official.to_dict())
            elif 'bupati' in official.position.lower():
                officials_by_role['bupati'].append(official.to_dict())
            elif 'walikota' in official.position.lower():
                officials_by_role['walikota'].append(official.to_dict())
            elif official.role == 'dpr_ri':
                officials_by_role['dpri'].append(official.to_dict())
            elif official.role == 'dprd' and 'provinsi' in official.position.lower():
                officials_by_role['dprd_provinsi'].append(official.to_dict())
            elif official.role == 'dprd' and ('kota' in official.position.lower() or 'kabupaten' in official.position.lower()):
                officials_by_role['dprd_kota'].append(official.to_dict())
        
        return jsonify({
            'user': user.to_dict(),
            'dapil': dapil.to_dict() if dapil else None,
            'officials': officials_by_role
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Check official status and get profile
@app.route('/api/officials/check-status/<official_name>', methods=['GET'])
def check_official_status(official_name):
    try:
        # Search for official by name (case insensitive)
        official = Officials.query.filter(
            Officials.name.ilike(f'%{official_name}%')
        ).first()
        
        if not official:
            return jsonify({
                'success': False,
                'found': False,
                'message': f'Pejabat dengan nama {official_name} tidak ditemukan'
            })
        
        return jsonify({
            'success': True,
            'found': True,
            'official': official.to_dict(),
            'status_smartpol': official.status_smartpol
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get all officials with smartpol status
@app.route('/api/officials/smartpol-members', methods=['GET'])
def get_smartpol_members():
    try:
        # Get all officials who joined smartpol
        officials = Officials.query.filter_by(status_smartpol=True).all()
        
        return jsonify({
            'success': True,
            'officials': [official.to_dict() for official in officials],
            'count': len(officials)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Create tables
# Aspirasi Warga Endpoints
@app.route('/api/aspirasi', methods=['POST'])
def submit_aspirasi():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'User not authenticated'}), 401
        
        data = request.get_json()
        if not data or 'category' not in data or 'subcategory' not in data:
            return jsonify({'error': 'Category and subcategory are required'}), 400
        
        user = User.query.get(session['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        aspirasi = AspirasiWarga(
            user_id=session['user_id'],
            category=data['category'],
            subcategory=data['subcategory'],
            kecamatan=user.kecamatan,
            dapil=user.dapil,
            session_id=data.get('session_id')
        )
        
        db.session.add(aspirasi)
        db.session.commit()
        
        return jsonify({
            'message': 'Aspirasi submitted successfully',
            'aspirasi': aspirasi.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/aspirasi/stats', methods=['GET'])
def get_aspirasi_stats():
    try:
        # Get aspirasi statistics by category
        stats = db.session.query(
            AspirasiWarga.category,
            db.func.count(AspirasiWarga.id).label('count')
        ).group_by(AspirasiWarga.category).all()
        
        # Get aspirasi by kecamatan for map visualization
        kecamatan_stats = db.session.query(
            AspirasiWarga.kecamatan,
            db.func.count(AspirasiWarga.id).label('count')
        ).filter(AspirasiWarga.kecamatan.isnot(None)).group_by(AspirasiWarga.kecamatan).all()
        
        return jsonify({
            'category_stats': [{'category': stat.category, 'count': stat.count} for stat in stats],
            'kecamatan_stats': [{'kecamatan': stat.kecamatan, 'count': stat.count} for stat in kecamatan_stats]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Polling Publik Endpoints
@app.route('/api/polling-publik', methods=['POST'])
def submit_polling_publik():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'User not authenticated'}), 401
        
        data = request.get_json()
        if not data or 'question_id' not in data or 'answer' not in data:
            return jsonify({'error': 'Question ID and answer are required'}), 400
        
        user = User.query.get(session['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if user already answered this question
        existing = PollingPublik.query.filter_by(
            user_id=session['user_id'],
            question_id=data['question_id']
        ).first()
        
        if existing:
            return jsonify({'error': 'You have already answered this question'}), 400
        
        polling = PollingPublik(
            user_id=session['user_id'],
            question_id=data['question_id'],
            answer=data['answer'],
            kecamatan=user.kecamatan,
            dapil=user.dapil,
            session_id=data.get('session_id')
        )
        
        db.session.add(polling)
        db.session.commit()
        
        return jsonify({
            'message': 'Polling response submitted successfully',
            'polling': polling.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/polling-publik/stats', methods=['GET'])
def get_polling_publik_stats():
    try:
        # Get polling statistics by question and answer
        question_1_stats = db.session.query(
            PollingPublik.answer,
            db.func.count(PollingPublik.id).label('count')
        ).filter(PollingPublik.question_id == 1).group_by(PollingPublik.answer).all()
        
        question_2_stats = db.session.query(
            PollingPublik.answer,
            db.func.count(PollingPublik.id).label('count')
        ).filter(PollingPublik.question_id == 2).group_by(PollingPublik.answer).all()
        
        # Get polling by kecamatan for map visualization
        kecamatan_stats = db.session.query(
            PollingPublik.kecamatan,
            db.func.count(PollingPublik.id).label('count')
        ).filter(PollingPublik.kecamatan.isnot(None)).group_by(PollingPublik.kecamatan).all()
        
        return jsonify({
            'question_1_stats': [{'answer': stat.answer, 'count': stat.count} for stat in question_1_stats],
            'question_2_stats': [{'answer': stat.answer, 'count': stat.count} for stat in question_2_stats],
            'kecamatan_stats': [{'kecamatan': stat.kecamatan, 'count': stat.count} for stat in kecamatan_stats]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Event Pendidikan Politik Endpoints
@app.route('/api/events', methods=['GET'])
def get_events():
    try:
        events = EventPendidikanPolitik.query.filter_by(is_active=True).order_by(EventPendidikanPolitik.event_date.asc()).all()
        return jsonify({
            'events': [event.to_dict() for event in events]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events', methods=['POST'])
@admin_required
def create_event():
    try:
        data = request.get_json()
        required_fields = ['title', 'event_date', 'location', 'organizer']
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        event = EventPendidikanPolitik(
            title=data['title'],
            description=data.get('description'),
            event_date=datetime.fromisoformat(data['event_date'].replace('Z', '+00:00')),
            location=data['location'],
            organizer=data['organizer'],
            registration_link=data.get('registration_link')
        )
        
        db.session.add(event)
        db.session.commit()
        
        return jsonify({
            'message': 'Event created successfully',
            'event': event.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/test/create-admin', methods=['POST'])
def create_test_admin():
    try:
        # Check if admin already exists
        existing_admin = User.query.filter_by(username='admin').first()
        if existing_admin:
            existing_admin.set_password('admin123')
            db.session.commit()
            return jsonify({'message': 'Admin password updated to admin123'}), 200
        
        # Create new admin user
        admin_user = User(
            username='admin',
            full_name='Administrator',
            email='admin@smartpol.com',
            role='admin'
        )
        admin_user.set_password('admin123')
        db.session.add(admin_user)
        db.session.commit()
        
        return jsonify({'message': 'Admin user created with password: admin123'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

with app.app_context():
    db.create_all()
    
    # Add sample events for political education
    if EventPendidikanPolitik.query.count() == 0:
        sample_events = [
            EventPendidikanPolitik(
                title="WEBINAR : PENDIDIKAN PEMILIH UNTUK GENERASI MUDA PERKOTAAN",
                description="Webinar tentang pentingnya pendidikan pemilih untuk generasi muda di perkotaan",
                event_date=datetime(2025, 12, 25, 10, 0),
                location="Online via Zoom",
                organizer="FISIP UB",
                registration_link="https://fisip.ub.ac.id/webinar-pendidikan-pemilih"
            ),
            EventPendidikanPolitik(
                title="Seminar Nasional Tema: UU Pemilu, kini dan nanti",
                description="Seminar nasional membahas perkembangan UU Pemilu dari masa ke masa",
                event_date=datetime(2025, 12, 30, 9, 0),
                location="Widyaloka Universitas Brawijaya Malang",
                organizer="Universitas Brawijaya",
                registration_link="https://ub.ac.id/seminar-uu-pemilu"
            )
        ]
        
        for event in sample_events:
            db.session.add(event)
        
        try:
            db.session.commit()
            print("Sample events added successfully")
        except Exception as e:
            db.session.rollback()
            print(f"Error adding sample events: {e}")

# Chatbot-specific endpoints for user data access
@app.route('/api/chatbot/user-context', methods=['GET'])
def get_user_context_for_chatbot():
    """Get comprehensive user context for chatbot personalization"""
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
        
        user = User.query.get(session['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user's dapil information
        user_dapil = None
        user_kecamatan = None
        
        if user.nik and user.verified:
            # Find user's dapil based on NIK
            dapil_result = validate_nik_by_dapil(user.nik)
            if dapil_result:
                user_dapil = dapil_result
                # Get kecamatan from dapil data
                dapil_data = Dapil.query.filter_by(name=dapil_result).first()
                if dapil_data and dapil_data.kecamatan_list:
                    # Extract kecamatan from NIK prefix
                    nik_prefix = user.nik[:6]
                    kecamatan_mapping = {
                        '357301': 'Klojen',
                        '357302': 'Blimbing', 
                        '357303': 'Kedungkandang',
                        '357304': 'Sukun',
                        '357305': 'Lowokwaru'
                    }
                    user_kecamatan = kecamatan_mapping.get(nik_prefix, 'Unknown')
        
        # Get user's officials
        officials = []
        if user_dapil:
            officials = Officials.query.filter_by(electoral_district=user_dapil).all()
        
        # Get recent chat history for context
        recent_chats = ChatHistory.query.filter_by(user_id=user.id)\
            .order_by(ChatHistory.timestamp.desc()).limit(10).all()
        
        # Get user's polling participation
        user_votes = PollVote.query.filter_by(user_id=user.id).count()
        
        return jsonify({
            'user': {
                'id': user.id,
                'username': user.username,
                'full_name': user.full_name,
                'email': user.email,
                'role': user.role,
                'nik': user.nik,
                'verified': user.verified,
                'created_at': user.created_at.isoformat() if user.created_at else None
            },
            'location': {
                'dapil': user_dapil,
                'kecamatan': user_kecamatan
            },
            'officials': [official.to_dict() for official in officials],
            'engagement': {
                'total_chats': len(recent_chats),
                'poll_votes': user_votes,
                'verification_status': user.verified
            },
            'recent_chat_topics': [chat.message[:100] for chat in recent_chats if chat.is_user][:5]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chatbot/user-preferences', methods=['GET', 'POST'])
def handle_user_preferences():
    """Get or set user preferences for chatbot customization"""
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
        
        user = User.query.get(session['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if request.method == 'GET':
            # Return current preferences (stored in user profile or separate table)
            preferences = {
                'communication_style': 'formal',  # formal, casual, friendly
                'topics_of_interest': ['politik_lokal', 'kebijakan_publik'],
                'notification_preferences': {
                    'polling_alerts': True,
                    'policy_updates': True,
                    'event_reminders': True
                },
                'language': 'id'
            }
            return jsonify({'preferences': preferences})
        
        elif request.method == 'POST':
            # Save user preferences
            data = request.get_json()
            # Here you would save preferences to database
            # For now, just return success
            return jsonify({'message': 'Preferences updated successfully'})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)