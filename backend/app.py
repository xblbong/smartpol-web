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
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active
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
            'option_text': self.option_text,
            'votes_count': self.votes_count,
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
class Officials(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    position = db.Column(db.String(255), nullable=False)
    party = db.Column(db.String(100), nullable=True)
    period_start = db.Column(db.Date, nullable=True)
    period_end = db.Column(db.Date, nullable=True)
    electoral_district = db.Column(db.String(100), nullable=True)
    role = db.Column(db.String(50), nullable=False, default='dprd')  # dprd, dpri, pimpinan_daerah
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
            allowed_roles = ['konsituen', 'dpri', 'dprd', 'pimpinan_daerah']
            
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
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def validate_malang_nik(nik):
    """Validate NIK for Malang residents and determine dapil"""
    if not nik or len(nik) != 16 or not nik.isdigit():
        return False, None, "NIK must be 16 digits"
    
    # Check if NIK starts with 3573 (Kota Malang code)
    if not nik.startswith('3573'):
        return False, None, "NIK is not from Kota Malang (must start with 3573)"
    
    # Extract kecamatan code (digits 5-6)
    kecamatan_code = nik[4:6]
    
    # Mapping kecamatan code to dapil based on Kota Malang administrative divisions
    kecamatan_dapil_mapping = {
        '01': {'name': 'Blimbing', 'dapil': 'Dapil 1'},
        '02': {'name': 'Klojen', 'dapil': 'Dapil 1'}, 
        '03': {'name': 'Kedungkandang', 'dapil': 'Dapil 2'},
        '04': {'name': 'Sukun', 'dapil': 'Dapil 2'},
        '05': {'name': 'Lowokwaru', 'dapil': 'Dapil 3'}
    }
    
    if kecamatan_code not in kecamatan_dapil_mapping:
        return False, None, "Invalid kecamatan code in NIK"
    
    kecamatan_info = kecamatan_dapil_mapping[kecamatan_code]
    return True, kecamatan_info, "Valid Malang NIK"

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
        
        # Validate Malang NIK
        is_valid, kecamatan_info, message = validate_malang_nik(nik)
        
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
        return jsonify({
            'success': True,
            'polls': [poll.to_dict() for poll in polls]
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
    if 'end_date' in data:
        poll.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d %H:%M:%S')
    
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

# Chat History Routes
@app.route('/api/chat/history', methods=['GET'])
def get_chat_history():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user_id = session['user_id']
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
    
    data = request.get_json()
    if not data or 'message' not in data or 'is_user' not in data:
        return jsonify({'error': 'Message and is_user fields are required'}), 400
    
    chat_message = ChatHistory(
        user_id=session['user_id'],
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

# Analytics and Dashboard Endpoints
@app.route('/api/admin/analytics/overview', methods=['GET'])
@admin_required
def get_analytics_overview():
    try:
        # Get date range from query params
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Basic statistics
        total_users = User.query.count()
        active_users = User.query.filter_by(is_active=True).count()
        total_polls = Polling.query.count()
        active_polls = Polling.query.filter_by(status='active').count()
        total_policies = Policy.query.count()
        total_votes = PollingVote.query.count()
        chatbot_sessions = ChatHistory.query.with_entities(ChatHistory.session_id).distinct().count()
        
        # User growth (last 30 days)
        from datetime import datetime, timedelta
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        new_users = User.query.filter(User.created_at >= thirty_days_ago).count()
        
        # Poll engagement
        poll_engagement = 0
        if total_polls > 0:
            poll_engagement = (total_votes / total_polls) if total_polls > 0 else 0
        
        # Recent activities
        recent_users = User.query.order_by(User.created_at.desc()).limit(5).all()
        recent_polls = Polling.query.order_by(Polling.created_at.desc()).limit(5).all()
        recent_policies = Policy.query.order_by(Policy.created_at.desc()).limit(5).all()
        
        activities = []
        for user in recent_users:
            activities.append({
                'type': 'user',
                'title': 'New user registered',
                'description': f'{user.full_name} joined the platform',
                'time': user.created_at.isoformat(),
                'icon': 'user',
                'color': 'blue'
            })
        
        for poll in recent_polls:
            activities.append({
                'type': 'poll',
                'title': 'Poll created',
                'description': poll.title,
                'time': poll.created_at.isoformat(),
                'icon': 'chart',
                'color': 'green'
            })
        
        for policy in recent_policies:
            activities.append({
                'type': 'policy',
                'title': 'Policy updated',
                'description': policy.title,
                'time': policy.created_at.isoformat(),
                'icon': 'file',
                'color': 'yellow'
            })
        
        # Sort activities by time
        activities.sort(key=lambda x: x['time'], reverse=True)
        activities = activities[:10]  # Limit to 10 most recent
        
        return jsonify({
            'overview': {
                'total_users': total_users,
                'active_users': active_users,
                'new_users': new_users,
                'total_polls': total_polls,
                'active_polls': active_polls,
                'total_policies': total_policies,
                'total_votes': total_votes,
                'chatbot_sessions': chatbot_sessions,
                'poll_engagement': round(poll_engagement, 2)
            },
            'recent_activities': activities
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/analytics/users', methods=['GET'])
@admin_required
def get_user_analytics():
    try:
        # User statistics by role
        user_roles = db.session.query(
            User.role,
            db.func.count(User.id).label('count')
        ).group_by(User.role).all()
        
        role_stats = [{'role': role, 'count': count} for role, count in user_roles]
        
        # User registration trend (last 30 days)
        from datetime import datetime, timedelta
        registration_trend = []
        for i in range(30):
            date = datetime.utcnow() - timedelta(days=i)
            start_of_day = date.replace(hour=0, minute=0, second=0, microsecond=0)
            end_of_day = date.replace(hour=23, minute=59, second=59, microsecond=999999)
            
            count = User.query.filter(
                User.created_at >= start_of_day,
                User.created_at <= end_of_day
            ).count()
            
            registration_trend.append({
                'date': date.strftime('%Y-%m-%d'),
                'count': count
            })
        
        registration_trend.reverse()
        
        # Active vs inactive users
        active_users = User.query.filter_by(is_active=True).count()
        inactive_users = User.query.filter_by(is_active=False).count()
        
        return jsonify({
            'role_distribution': role_stats,
            'registration_trend': registration_trend,
            'activity_status': {
                'active': active_users,
                'inactive': inactive_users
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/analytics/polls', methods=['GET'])
@admin_required
def get_poll_analytics():
    try:
        # Poll statistics by category
        poll_categories = db.session.query(
            Polling.category,
            db.func.count(Polling.id).label('count')
        ).group_by(Polling.category).all()
        
        category_stats = [{'category': cat, 'count': count} for cat, count in poll_categories]
        
        # Poll statistics by status
        poll_status = db.session.query(
            Polling.status,
            db.func.count(Polling.id).label('count')
        ).group_by(Polling.status).all()
        
        status_stats = [{'status': status, 'count': count} for status, count in poll_status]
        
        # Vote statistics
        total_votes = PollingVote.query.count()
        unique_voters = PollingVote.query.with_entities(PollingVote.user_id).distinct().count()
        
        # Top performing polls
        top_polls = db.session.query(
            Polling.id,
            Polling.title,
            db.func.count(PollingVote.id).label('vote_count')
        ).join(PollingVote).group_by(Polling.id).order_by(db.func.count(PollingVote.id).desc()).limit(10).all()
        
        top_polls_data = [{
            'id': poll_id,
            'title': title,
            'vote_count': vote_count
        } for poll_id, title, vote_count in top_polls]
        
        return jsonify({
            'category_distribution': category_stats,
            'status_distribution': status_stats,
            'vote_statistics': {
                'total_votes': total_votes,
                'unique_voters': unique_voters
            },
            'top_polls': top_polls_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/analytics/chatbot', methods=['GET'])
@admin_required
def get_chatbot_analytics():
    try:
        # Total chatbot interactions
        total_interactions = ChatHistory.query.count()
        
        # Unique users who used chatbot
        unique_users = ChatHistory.query.with_entities(ChatHistory.user_id).distinct().count()
        
        # Sessions count
        total_sessions = ChatHistory.query.with_entities(ChatHistory.session_id).distinct().count()
        
        # Average messages per session
        avg_messages_per_session = total_interactions / total_sessions if total_sessions > 0 else 0
        
        # Daily interaction trend (last 30 days)
        from datetime import datetime, timedelta
        interaction_trend = []
        for i in range(30):
            date = datetime.utcnow() - timedelta(days=i)
            start_of_day = date.replace(hour=0, minute=0, second=0, microsecond=0)
            end_of_day = date.replace(hour=23, minute=59, second=59, microsecond=999999)
            
            count = ChatHistory.query.filter(
                ChatHistory.timestamp >= start_of_day,
                ChatHistory.timestamp <= end_of_day
            ).count()
            
            interaction_trend.append({
                'date': date.strftime('%Y-%m-%d'),
                'count': count
            })
        
        interaction_trend.reverse()
        
        return jsonify({
             'total_interactions': total_interactions,
             'unique_users': unique_users,
             'total_sessions': total_sessions,
             'avg_messages_per_session': round(avg_messages_per_session, 2),
             'interaction_trend': interaction_trend
         })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Report Management Endpoints
@app.route('/api/admin/reports/daily', methods=['GET'])
@admin_required
def get_daily_report():
    try:
        from datetime import datetime, timedelta
        
        # Get date from query params or use today
        date_str = request.args.get('date')
        if date_str:
            target_date = datetime.strptime(date_str, '%Y-%m-%d')
        else:
            target_date = datetime.utcnow()
        
        start_of_day = target_date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = target_date.replace(hour=23, minute=59, second=59, microsecond=999999)
        
        # Daily statistics
        daily_stats = {
            'new_users': User.query.filter(
                User.created_at >= start_of_day,
                User.created_at <= end_of_day
            ).count(),
            'new_polls': Polling.query.filter(
                Polling.created_at >= start_of_day,
                Polling.created_at <= end_of_day
            ).count(),
            'new_votes': PollingVote.query.filter(
                PollingVote.voted_at >= start_of_day,
                PollingVote.voted_at <= end_of_day
            ).count(),
            'new_reports': Report.query.filter(
                Report.created_at >= start_of_day,
                Report.created_at <= end_of_day
            ).count(),
            'chatbot_interactions': ChatHistory.query.filter(
                ChatHistory.timestamp >= start_of_day,
                ChatHistory.timestamp <= end_of_day
            ).count(),
            'new_policies': Policy.query.filter(
                Policy.created_at >= start_of_day,
                Policy.created_at <= end_of_day
            ).count()
        }
        
        # Hourly breakdown
        hourly_data = []
        for hour in range(24):
            hour_start = start_of_day.replace(hour=hour)
            hour_end = start_of_day.replace(hour=hour, minute=59, second=59)
            
            hourly_stats = {
                'hour': hour,
                'users': User.query.filter(
                    User.created_at >= hour_start,
                    User.created_at <= hour_end
                ).count(),
                'votes': PollingVote.query.filter(
                    PollingVote.voted_at >= hour_start,
                    PollingVote.voted_at <= hour_end
                ).count(),
                'chatbot': ChatHistory.query.filter(
                    ChatHistory.timestamp >= hour_start,
                    ChatHistory.timestamp <= hour_end
                ).count()
            }
            hourly_data.append(hourly_stats)
        
        return jsonify({
            'date': target_date.strftime('%Y-%m-%d'),
            'daily_stats': daily_stats,
            'hourly_breakdown': hourly_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/reports/monthly', methods=['GET'])
@admin_required
def get_monthly_report():
    try:
        from datetime import datetime, timedelta
        import calendar
        
        # Get month and year from query params or use current month
        month = int(request.args.get('month', datetime.utcnow().month))
        year = int(request.args.get('year', datetime.utcnow().year))
        
        # Get first and last day of the month
        first_day = datetime(year, month, 1)
        last_day = datetime(year, month, calendar.monthrange(year, month)[1], 23, 59, 59)
        
        # Monthly statistics
        monthly_stats = {
            'total_users': User.query.filter(
                User.created_at >= first_day,
                User.created_at <= last_day
            ).count(),
            'total_polls': Polling.query.filter(
                Polling.created_at >= first_day,
                Polling.created_at <= last_day
            ).count(),
            'total_votes': PollingVote.query.filter(
                PollingVote.voted_at >= first_day,
                PollingVote.voted_at <= last_day
            ).count(),
            'total_reports': Report.query.filter(
                Report.created_at >= first_day,
                Report.created_at <= last_day
            ).count(),
            'chatbot_interactions': ChatHistory.query.filter(
                ChatHistory.timestamp >= first_day,
                ChatHistory.timestamp <= last_day
            ).count(),
            'total_policies': Policy.query.filter(
                Policy.created_at >= first_day,
                Policy.created_at <= last_day
            ).count()
        }
        
        # Daily breakdown for the month
        daily_data = []
        current_date = first_day
        while current_date <= last_day:
            day_start = current_date.replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = current_date.replace(hour=23, minute=59, second=59, microsecond=999999)
            
            daily_stats = {
                'date': current_date.strftime('%Y-%m-%d'),
                'day': current_date.day,
                'users': User.query.filter(
                    User.created_at >= day_start,
                    User.created_at <= day_end
                ).count(),
                'votes': PollingVote.query.filter(
                    PollingVote.voted_at >= day_start,
                    PollingVote.voted_at <= day_end
                ).count(),
                'reports': Report.query.filter(
                    Report.created_at >= day_start,
                    Report.created_at <= day_end
                ).count()
            }
            daily_data.append(daily_stats)
            current_date += timedelta(days=1)
        
        # Category breakdown
        poll_categories = db.session.query(
            Polling.category,
            db.func.count(Polling.id).label('count')
        ).filter(
            Polling.created_at >= first_day,
            Polling.created_at <= last_day
        ).group_by(Polling.category).all()
        
        category_stats = [{'category': cat, 'count': count} for cat, count in poll_categories]
        
        return jsonify({
            'month': month,
            'year': year,
            'monthly_stats': monthly_stats,
            'daily_breakdown': daily_data,
            'category_breakdown': category_stats
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/reports/annual', methods=['GET'])
@admin_required
def get_annual_report():
    
    try:
        from datetime import datetime, timedelta
        
        # Get year from query params or use current year
        year = int(request.args.get('year', datetime.utcnow().year))
        
        # Get first and last day of the year
        first_day = datetime(year, 1, 1)
        last_day = datetime(year, 12, 31, 23, 59, 59)
        
        # Annual statistics
        annual_stats = {
            'total_users': User.query.filter(
                User.created_at >= first_day,
                User.created_at <= last_day
            ).count(),
            'total_polls': Polling.query.filter(
                Polling.created_at >= first_day,
                Polling.created_at <= last_day
            ).count(),
            'total_votes': PollingVote.query.filter(
                PollingVote.voted_at >= first_day,
                PollingVote.voted_at <= last_day
            ).count(),
            'total_reports': Report.query.filter(
                Report.created_at >= first_day,
                Report.created_at <= last_day
            ).count(),
            'chatbot_interactions': ChatHistory.query.filter(
                ChatHistory.timestamp >= first_day,
                ChatHistory.timestamp <= last_day
            ).count(),
            'total_policies': Policy.query.filter(
                Policy.created_at >= first_day,
                Policy.created_at <= last_day
            ).count()
        }
        
        # Monthly breakdown for the year
        monthly_data = []
        for month in range(1, 13):
            month_start = datetime(year, month, 1)
            if month == 12:
                month_end = datetime(year, 12, 31, 23, 59, 59)
            else:
                month_end = datetime(year, month + 1, 1) - timedelta(seconds=1)
            
            monthly_stats = {
                'month': month,
                'month_name': month_start.strftime('%B'),
                'users': User.query.filter(
                    User.created_at >= month_start,
                    User.created_at <= month_end
                ).count(),
                'polls': Polling.query.filter(
                    Polling.created_at >= month_start,
                    Polling.created_at <= month_end
                ).count(),
                'votes': PollingVote.query.filter(
                    PollingVote.voted_at >= month_start,
                    PollingVote.voted_at <= month_end
                ).count(),
                'reports': Report.query.filter(
                    Report.created_at >= month_start,
                    Report.created_at <= month_end
                ).count()
            }
            monthly_data.append(monthly_stats)
        
        # Top performing content
        top_polls = db.session.query(
            Polling.id,
            Polling.title,
            db.func.count(PollingVote.id).label('vote_count')
        ).join(PollingVote).filter(
            Polling.created_at >= first_day,
            Polling.created_at <= last_day
        ).group_by(Polling.id).order_by(db.func.count(PollingVote.id).desc()).limit(10).all()
        
        top_polls_data = [{
            'id': poll_id,
            'title': title,
            'vote_count': vote_count
        } for poll_id, title, vote_count in top_polls]
        
        return jsonify({
            'year': year,
            'annual_stats': annual_stats,
            'monthly_breakdown': monthly_data,
            'top_polls': top_polls_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Policies Management Endpoints
@app.route('/api/admin/policies', methods=['GET'])
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

# Chatbot Reports Endpoints
@app.route('/api/admin/reports/chatbot', methods=['GET'])
def get_chatbot_reports():
    try:
        from datetime import datetime, timedelta
        
        # Get date range from query params
        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')
        
        if start_date_str and end_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
        else:
            # Default to last 30 days
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=30)
        
        # Chatbot interaction summary
        total_interactions = ChatHistory.query.filter(
            ChatHistory.timestamp >= start_date,
            ChatHistory.timestamp <= end_date
        ).count()
        
        unique_users = db.session.query(ChatHistory.user_id).filter(
            ChatHistory.timestamp >= start_date,
            ChatHistory.timestamp <= end_date
        ).distinct().count()
        
        # Daily interaction breakdown
        daily_interactions = []
        current_date = start_date
        while current_date <= end_date:
            day_start = current_date.replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = current_date.replace(hour=23, minute=59, second=59, microsecond=999999)
            
            interactions_count = ChatHistory.query.filter(
                ChatHistory.timestamp >= day_start,
                ChatHistory.timestamp <= day_end
            ).count()
            
            daily_interactions.append({
                'date': current_date.strftime('%Y-%m-%d'),
                'interactions': interactions_count
            })
            current_date += timedelta(days=1)
        
        # Most active users
        top_users = db.session.query(
            ChatHistory.user_id,
            User.full_name,
            db.func.count(ChatHistory.id).label('interaction_count')
        ).join(User).filter(
            ChatHistory.timestamp >= start_date,
            ChatHistory.timestamp <= end_date
        ).group_by(ChatHistory.user_id).order_by(
            db.func.count(ChatHistory.id).desc()
        ).limit(10).all()
        
        top_users_data = [{
            'user_id': user_id,
            'full_name': full_name,
            'interaction_count': interaction_count
        } for user_id, full_name, interaction_count in top_users]
        
        return jsonify({
            'summary': {
                'total_interactions': total_interactions,
                'unique_users': unique_users,
                'date_range': {
                    'start': start_date.strftime('%Y-%m-%d'),
                    'end': end_date.strftime('%Y-%m-%d')
                }
            },
            'daily_breakdown': daily_interactions,
            'top_users': top_users_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/reports/polling', methods=['GET'])
def get_polling_reports():
    try:
        from datetime import datetime, timedelta
        
        # Get date range from query params
        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')
        
        if start_date_str and end_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
        else:
            # Default to last 30 days
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=30)
        
        # Polling summary
        total_polls = Polling.query.filter(
            Polling.created_at >= start_date,
            Polling.created_at <= end_date
        ).count()
        
        total_votes = PollingVote.query.filter(
            PollingVote.voted_at >= start_date,
            PollingVote.voted_at <= end_date
        ).count()
        
        active_polls = Polling.query.filter(
            Polling.created_at >= start_date,
            Polling.created_at <= end_date,
            Polling.status == 'active'
        ).count()
        
        # Daily polling activity
        daily_activity = []
        current_date = start_date
        while current_date <= end_date:
            day_start = current_date.replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = current_date.replace(hour=23, minute=59, second=59, microsecond=999999)
            
            polls_created = Polling.query.filter(
                Polling.created_at >= day_start,
                Polling.created_at <= day_end
            ).count()
            
            votes_cast = PollingVote.query.filter(
                PollingVote.voted_at >= day_start,
                PollingVote.voted_at <= day_end
            ).count()
            
            daily_activity.append({
                'date': current_date.strftime('%Y-%m-%d'),
                'polls_created': polls_created,
                'votes_cast': votes_cast
            })
            current_date += timedelta(days=1)
        
        # Category performance
        category_performance = db.session.query(
            Polling.category,
            db.func.count(Polling.id).label('poll_count'),
            db.func.count(PollingVote.id).label('vote_count')
        ).outerjoin(PollingVote).filter(
            Polling.created_at >= start_date,
            Polling.created_at <= end_date
        ).group_by(Polling.category).all()
        
        category_data = [{
            'category': category,
            'poll_count': poll_count,
            'vote_count': vote_count or 0
        } for category, poll_count, vote_count in category_performance]
        
        return jsonify({
            'summary': {
                'total_polls': total_polls,
                'total_votes': total_votes,
                'active_polls': active_polls,
                'date_range': {
                    'start': start_date.strftime('%Y-%m-%d'),
                    'end': end_date.strftime('%Y-%m-%d')
                }
            },
            'daily_activity': daily_activity,
            'category_performance': category_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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

# Create tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)