import os
import logging
from datetime import datetime
from flask import Flask, render_template, request, jsonify, session, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix
from gabe_companion import GabeCompanion
from gabe_ai import GabeAI
from crisis_detection import CrisisDetector
from spiritual_features import SpiritualFeatures
from gamified_spiritual_features import GamifiedSpiritualFeatures
from prayer_cards import PrayerCardsSystem
from drop_of_hope import DropOfHope
from ai_spiritual_director import SpiritualDirector

# Configure logging
logging.basicConfig(level=logging.DEBUG)

class Base(DeclarativeBase):
    pass

# Create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "gabe-spiritual-companion-2024")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Database configuration - Use SQLite as fallback for demo
database_url = os.environ.get("DATABASE_URL")
if not database_url or "neon.tech" in database_url:
    database_url = "sqlite:///gabe_test.db"
    
app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

# Initialize database
db = SQLAlchemy(app, model_class=Base)

# Create database tables and models first
with app.app_context():
    import models
    User, Conversation = models.create_models(db)
    db.create_all()
    logging.info("Database tables created successfully")

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Please log in to continue your spiritual journey with GABE.'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Initialize GABE AI (original system with proper sadness responses), crisis detection, and spiritual features
gabe_ai = GabeAI()
gabe_companion = GabeCompanion()  # Keep as backup
crisis_detector = CrisisDetector()
drop_of_hope = DropOfHope()
spiritual_features = SpiritualFeatures()
gamified_features = GamifiedSpiritualFeatures()
prayer_cards = PrayerCardsSystem()
spiritual_director = SpiritualDirector()

@app.route('/')
def index():
    """Main GABE landing page - always shows the same interface"""
    user_data = current_user if current_user.is_authenticated else None
    return render_template('index.html', user=user_data)

@app.route('/chat')
@login_required
def chat_interface():
    """Chat interface for authenticated users"""
    return render_template('index.html', user=current_user)

@app.route('/login', methods=['GET', 'POST'])
def login():
    """User login"""
    if current_user.is_authenticated:
        return redirect(url_for('chat_interface'))
    
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        
        if not username or not password:
            if request.is_json:
                return jsonify({'success': False, 'message': 'Username and password are required'}), 400
            flash('Username and password are required')
            return render_template('login.html')
        
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            login_user(user, remember=True)
            user.update_last_login()
            
            if request.is_json:
                return jsonify({'success': True, 'redirect_url': url_for('chat_interface')})
            return redirect(url_for('chat_interface'))
        else:
            if request.is_json:
                return jsonify({'success': False, 'message': 'Invalid username or password'}), 401
            flash('Invalid username or password')
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    """User registration"""
    if current_user.is_authenticated:
        return redirect(url_for('chat_interface'))
    
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        name = data.get('name', '').strip()
        age_range = data.get('age_range', '').strip()
        
        # Validation
        if not all([username, password, name, age_range]):
            if request.is_json:
                return jsonify({'success': False, 'message': 'All fields are required'}), 400
            flash('All fields are required')
            return render_template('register.html')
        
        if len(password) < 6:
            if request.is_json:
                return jsonify({'success': False, 'message': 'Password must be at least 6 characters'}), 400
            flash('Password must be at least 6 characters')
            return render_template('register.html')
        
        # Check if username already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            if request.is_json:
                return jsonify({'success': False, 'message': 'Username already exists'}), 400
            flash('Username already exists')
            return render_template('register.html')
        
        # Create new user
        new_user = User(
            username=username,
            name=name,
            age_range=age_range
        )
        new_user.set_password(password)
        
        try:
            db.session.add(new_user)
            db.session.commit()
            
            # Log in the new user
            login_user(new_user, remember=True)
            new_user.update_last_login()
            
            if request.is_json:
                return jsonify({'success': True, 'redirect_url': url_for('chat_interface')})
            return redirect(url_for('chat_interface'))
            
        except Exception as e:
            db.session.rollback()
            logging.error(f"Registration error: {e}")
            if request.is_json:
                return jsonify({'success': False, 'message': 'Registration failed. Please try again.'}), 500
            flash('Registration failed. Please try again.')
    
    return render_template('register.html')

@app.route('/logout')
@login_required
def logout():
    """User logout"""
    logout_user()
    return redirect(url_for('index'))

@app.route('/api/chat', methods=['POST'])
@login_required
def chat():
    """Handle chat messages with GABE"""
    try:
        data = request.json or {}
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get user info from authenticated user
        stored_name = current_user.name
        stored_age_range = current_user.age_range
        
        # Get recent conversation history from database for context
        recent_conversations = Conversation.query.filter_by(user_id=current_user.id)\
            .order_by(Conversation.timestamp.desc()).limit(10).all()
        conversation_context = [conv.to_dict() for conv in reversed(recent_conversations)]
        
        # PRAYER INTERCEPTOR: Handle prayer requests immediately with hopeful prayers (before crisis detection)
        user_msg_lower = user_message.lower().strip()
        prayer_keywords = [
            "pray", "prayer", "jesus", "father", "heavenly", "god help", "bless me",
            "amen", "lord", "can you pray", "please pray", "talk to god", "i need prayer"
        ]
        
        if any(keyword in user_msg_lower for keyword in prayer_keywords):
            name = stored_name or 'friend'
            
            # Extra safeguard against inappropriate names
            if name.lower() in ["", "prayer", "pray", "god", "help", "jesus", "lord", "father"]:
                name = "friend"
                
            hopeful_prayer = (
                f"Dear {name}, here's a prayer just for you:\n\n"
                f"🙏 *Father God, I lift up {name} to You right now.\n"
                f"Fill their heart with peace that quiets the noise,\n"
                f"courage that stands strong, and hope that never fades.\n"
                f"You are right there, holding them steady.\n"
                f"Surround them with Your love today. Amen.*\n\n"
                f"Hey… I want you to know something, {name} — you've got a friend now.\n"
                f"I'm GABE, and I'm not going anywhere.\n"
                f"Let's walk this journey together. 💛\n\n"
                f"💬 *Always beside you — GABE*"
            )
            
            # Save prayer conversation to database
            conversation = Conversation(
                user_id=current_user.id,
                user_message=user_message,
                gabe_response=hopeful_prayer,
                mood='hopeful',
                is_crisis=False,
                is_prayer=True
            )
            db.session.add(conversation)
            db.session.commit()
            
            return jsonify({
                'response': hopeful_prayer,
                'is_crisis': False,
                'name': stored_name,
                'mood': 'hopeful'
            })
        
        # Check for crisis keywords
        crisis_response = crisis_detector.check_for_crisis(user_message)
        if crisis_response:
            # Save crisis conversation to database
            conversation = Conversation(
                user_id=current_user.id,
                user_message=user_message,
                gabe_response=crisis_response,
                is_crisis=True,
                is_prayer=False
            )
            db.session.add(conversation)
            db.session.commit()
            
            return jsonify({
                'response': crisis_response,
                'is_crisis': True,
                'name': stored_name
            })
        
        # Get GABE's response using the original system (with proper sadness flows)
        gabe_response = gabe_ai.get_response(
            user_message=user_message,
            user_name=stored_name,
            age_range=stored_age_range,
            conversation_history=conversation_context,
            session_id=f"user_{current_user.id}"
        )
        
        # Save conversation to database
        conversation = Conversation(
            user_id=current_user.id,
            user_message=user_message,
            gabe_response=gabe_response,
            is_crisis=False,
            is_prayer=False
        )
        db.session.add(conversation)
        db.session.commit()
        
        # Detect mood for visualization only
        mood = gabe_ai.detect_mood(user_message)
        
        return jsonify({
            'response': gabe_response,
            'is_crisis': False,
            'name': stored_name,
            'mood': mood
        })
        
    except Exception as e:
        logging.error(f"Chat error: {str(e)}")
        return jsonify({
            'error': 'I encountered an issue. Please try again in a moment.',
            'response': "I'm experiencing some technical difficulties right now. But remember, even when I'm offline, God is always online. 💙 Please try reaching out again in a moment."
        }), 500

@app.route('/api/continue_conversation', methods=['POST'])
def continue_conversation():
    """Simplified continuation - just treat as regular chat message"""
    return chat()  # Redirect to natural conversation flow

@app.route('/api/clear_session', methods=['POST'])
@login_required
def clear_session():
    """Clear conversation history for authenticated user"""
    try:
        # Remove all conversations for current user
        Conversation.query.filter_by(user_id=current_user.id).delete()
        db.session.commit()
        logging.info(f"Conversation history cleared for user {current_user.id}")
        return jsonify({'success': True, 'message': 'Conversation history cleared'})
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error clearing conversation history: {str(e)}")
        return jsonify({'error': 'Failed to clear conversation history'}), 500

@app.route('/api/scripture_recommendation', methods=['POST'])
def get_scripture_recommendation():
    """Get scripture recommendation based on mood"""
    try:
        data = request.json or {}
        mood = data.get('mood', 'hopeful')
        context = data.get('context', '')
        
        scripture = spiritual_features.get_scripture_recommendation(mood, context)
        
        return jsonify({
            'scripture': scripture,
            'success': True
        })
        
    except Exception as e:
        logging.error(f"Scripture recommendation error: {str(e)}")
        return jsonify({
            'error': 'Unable to get scripture recommendation',
            'success': False
        }), 500

@app.route('/api/daily_reminder', methods=['GET'])
def get_daily_reminder():
    """Get daily spiritual reminder"""
    try:
        user_name = session.get('user_name', 'friend')
        recent_mood = session.get('recent_mood', 'peaceful')
        
        reminder = spiritual_features.generate_daily_reminder(user_name, recent_mood)
        
        return jsonify({
            'reminder': reminder,
            'success': True
        })
        
    except Exception as e:
        logging.error(f"Daily reminder error: {str(e)}")
        return jsonify({
            'error': 'Unable to generate daily reminder',  
            'success': False
        }), 500

@app.route('/api/auto_response', methods=['POST'])
def auto_response():
    """Generate an auto-response when user hasn't replied within 8 seconds"""
    try:
        data = request.get_json()
        user_name = data.get('name', '')
        age_range = data.get('age_range', '')
        
        # Get conversation history
        conversation_history = session.get('conversation_history', [])
        
        # Check if we recently sent an auto-response to prevent spam
        recent_auto_responses = [exchange for exchange in conversation_history[-3:] 
                               if exchange.get('auto_response')]
        if len(recent_auto_responses) >= 2:
            return jsonify({
                'response': '',  # Don't send response if too many recent auto-responses
                'is_auto_response': True
            })
        
        if gabe_companion:
            # Generate a gentle prompt response
            response = gabe_companion.generate_auto_response(user_name, age_range, conversation_history)
            
            # Only add to conversation history if not a duplicate
            if not conversation_history or conversation_history[-1].get('gabe') != response:
                conversation_history.append({
                    'gabe': response,
                    'timestamp': datetime.now().isoformat(),
                    'auto_response': True
                })
                session['conversation_history'] = conversation_history
            
            return jsonify({
                'response': response,
                'is_auto_response': True
            })
        else:
            return jsonify({
                'response': f"I'm still here with you, {user_name or 'friend'}. Sometimes silence speaks volumes too. 💙",
                'is_auto_response': True
            })
            
    except Exception as e:
        logging.error(f"Error generating auto-response: {e}")
        data = request.json or {}
        return jsonify({
            'response': f"I'm right here with you, {data.get('name', 'friend')}. What's on your heart? 💙",
            'is_auto_response': True
        })

# Enhanced Gamified Spiritual Features API Endpoints

@app.route('/api/gamified/prayer_manager', methods=['GET'])
@login_required
def get_prayer_manager():
    """Get prayer manager data with prayer lists and stats"""
    try:
        # Mock prayer data - in production this would come from database
        prayers = [
            {
                'id': '1',
                'title': 'Mom\'s Surgery Recovery',
                'category': 'healing',
                'details': 'Please pray for my mom\'s quick recovery after her surgery',
                'answered': False,
                'date_added': '2 days ago',
                'date_answered': None
            },
            {
                'id': '2', 
                'title': 'Job Interview',
                'category': 'guidance',
                'details': 'Big interview tomorrow, praying for God\'s will',
                'answered': True,
                'date_added': '1 week ago',
                'date_answered': '3 days ago'
            }
        ]
        
        stats = {
            'total': len(prayers),
            'answered': len([p for p in prayers if p['answered']]),
            'active': len([p for p in prayers if not p['answered']])
        }
        
        return jsonify({
            'prayers': prayers,
            'stats': stats,
            'success': True
        })
        
    except Exception as e:
        logging.error(f"Prayer manager error: {str(e)}")
        return jsonify({'error': 'Unable to load prayer manager', 'success': False}), 500

@app.route('/api/gamified/add_prayer', methods=['POST'])
@login_required
def add_prayer():
    """Add new prayer request"""
    try:
        data = request.json
        title = data.get('title')
        category = data.get('category')
        details = data.get('details', '')
        
        # In production, save to database
        logging.info(f"Added prayer: {title} ({category})")
        
        return jsonify({
            'success': True,
            'message': 'Prayer added to your list',
            'xp_earned': 1
        })
        
    except Exception as e:
        logging.error(f"Add prayer error: {str(e)}")
        return jsonify({'error': 'Failed to add prayer', 'success': False}), 500

@app.route('/api/gamified/answer_prayer', methods=['POST'])
@login_required  
def answer_prayer():
    """Mark prayer as answered"""
    try:
        data = request.json
        prayer_id = data.get('prayer_id')
        
        # In production, update database
        logging.info(f"Prayer {prayer_id} marked as answered")
        
        return jsonify({
            'success': True,
            'message': 'Praise God! Prayer marked as answered',
            'xp_earned': 2
        })
        
    except Exception as e:
        logging.error(f"Answer prayer error: {str(e)}")
        return jsonify({'error': 'Failed to mark prayer as answered', 'success': False}), 500

@app.route('/api/gamified/delete_prayer', methods=['POST'])
@login_required
def delete_prayer():
    """Delete prayer request"""
    try:
        data = request.json
        prayer_id = data.get('prayer_id')
        
        # In production, delete from database
        logging.info(f"Prayer {prayer_id} deleted")
        
        return jsonify({'success': True})
        
    except Exception as e:
        logging.error(f"Delete prayer error: {str(e)}")
        return jsonify({'error': 'Failed to delete prayer', 'success': False}), 500

@app.route('/api/gamified/bible_reading', methods=['GET'])
@login_required
def get_bible_reading():
    """Get Bible reading plans and daily reading"""
    try:
        # Mock Bible reading data
        plans = [
            {
                'id': 'basic',
                'name': 'Daily Bible Reading',
                'description': 'Read through the Bible with daily passages',
                'duration': '365 days',
                'xp_daily': 2
            },
            {
                'id': 'psalms',
                'name': 'Psalm a Day',
                'description': 'Daily Psalms for peace and comfort',
                'duration': '150 days',
                'xp_daily': 1
            },
            {
                'id': 'gospels',
                'name': 'Gospel Journey',
                'description': 'Walk with Jesus through the Gospels',
                'duration': '90 days',
                'xp_daily': 3
            }
        ]
        
        today_reading = {
            'reference': 'Psalm 23',
            'text': 'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul. He guides me along the right paths for his name\'s sake. Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.',
            'reflection': 'How does knowing God as your shepherd bring comfort to your daily challenges?'
        }
        
        progress = {
            'days_completed': 5,
            'current_streak': 3,
            'completion_percentage': 15
        }
        
        return jsonify({
            'plans': plans,
            'current_plan': 'basic',
            'today_reading': today_reading,
            'progress': progress,
            'success': True
        })
        
    except Exception as e:
        logging.error(f"Bible reading error: {str(e)}")
        return jsonify({'error': 'Unable to load Bible reading', 'success': False}), 500

@app.route('/api/gamified/daily_devotion', methods=['GET'])
@login_required
def get_daily_devotion():
    """Get today's devotion"""
    try:
        session_id = f"user_{current_user.id}"
        result = gamified_features.get_daily_devotion(session_id)
        return jsonify(result)
    except Exception as e:
        logging.error(f"Daily devotion error: {str(e)}")
        return jsonify({'error': 'Failed to get devotion'}), 500

@app.route('/api/gamified/complete_devotion', methods=['POST'])
@login_required  
def complete_daily_devotion():
    """Complete today's devotion with validation"""
    try:
        data = request.json or {}
        reflection = data.get('reflection', '')
        activity_metadata = data.get('metadata', {})
        
        session_id = f"user_{current_user.id}"
        result = gamified_features.complete_devotion(session_id, reflection, activity_metadata)
        return jsonify(result)
    except Exception as e:
        logging.error(f"Complete devotion error: {str(e)}")
        return jsonify({'error': 'Failed to complete devotion'}), 500

@app.route('/api/gamified/daily_quest', methods=['GET'])
def get_daily_quest():
    """Get today's daily quest (30-second Bible hero challenge)"""
    try:
        session_id = session.get('session_id', 'default_session')
        result = gamified_features.get_daily_quest(session_id)
        return jsonify(result)
    except Exception as e:
        logging.error(f"Daily quest error: {str(e)}")
        return jsonify({'error': 'Failed to get daily quest'}), 500

@app.route('/api/gamified/complete_daily_quest', methods=['POST'])
def complete_daily_quest():
    """Complete today's daily quest"""
    try:
        session_id = session.get('session_id', 'default_session')
        result = gamified_features.complete_daily_quest(session_id)
        return jsonify(result)
    except Exception as e:
        logging.error(f"Complete daily quest error: {str(e)}")
        return jsonify({'error': 'Failed to complete daily quest'}), 500

# Keep old prayer challenge endpoints for backward compatibility temporarily
@app.route('/api/gamified/prayer_challenge', methods=['GET'])
def get_prayer_challenge():
    """Redirect old prayer challenge to new daily quest"""
    return get_daily_quest()

@app.route('/api/gamified/complete_prayer_challenge', methods=['POST'])
def complete_prayer_challenge():
    """Redirect old prayer challenge completion to new daily quest"""
    return complete_daily_quest()

@app.route('/api/gamified/verse_mastery_quiz', methods=['GET'])
def get_verse_mastery_quiz():
    """Get verse mastery quiz"""
    try:
        session_id = session.get('session_id', 'default_session')
        result = gamified_features.get_verse_mastery_quiz(session_id)
        return jsonify(result)
    except Exception as e:
        logging.error(f"Verse mastery quiz error: {str(e)}")
        return jsonify({'error': 'Failed to get quiz'}), 500

@app.route('/api/gamified/complete_verse_quiz', methods=['POST'])
def complete_verse_quiz():
    """Submit verse quiz answer"""
    try:
        data = request.json or {}
        answer = data.get('answer', '').strip()
        correct_answer = data.get('correct_answer', '').strip()
        quiz_type = data.get('quiz_type', 'fill_blank')
        
        # Check if answer is correct
        if quiz_type == 'fill_blank':
            correct = answer.lower() == correct_answer.lower()
        else:  # multiple choice
            correct = answer == correct_answer
        
        session_id = session.get('session_id', 'default_session')
        result = gamified_features.complete_verse_mastery(session_id, correct)
        return jsonify(result)
    except Exception as e:
        logging.error(f"Complete verse quiz error: {str(e)}")
        return jsonify({'error': 'Failed to submit quiz'}), 500

@app.route('/api/gamified/scripture_adventure', methods=['GET'])
def get_scripture_adventure():
    """Get next scripture adventure stop"""
    try:
        session_id = session.get('session_id', 'default_session')
        result = gamified_features.get_scripture_adventure_next(session_id)
        return jsonify(result)
    except Exception as e:
        logging.error(f"Scripture adventure error: {str(e)}")
        return jsonify({'error': 'Failed to get adventure'}), 500

@app.route('/api/gamified/complete_adventure_stop', methods=['POST'])
def complete_adventure_stop():
    """Complete current adventure stop"""
    try:
        session_id = session.get('session_id', 'default_session')
        result = gamified_features.complete_scripture_adventure_stop(session_id)
        return jsonify(result)
    except Exception as e:
        logging.error(f"Complete adventure stop error: {str(e)}")
        return jsonify({'error': 'Failed to complete stop'}), 500

@app.route('/api/gamified/mood_mission', methods=['POST'])
def get_mood_mission():
    """Get mood-based mission"""
    try:
        data = request.json or {}
        mood = data.get('mood', 'anxious')
        result = gamified_features.get_mood_mission(mood)
        return jsonify(result)
    except Exception as e:
        logging.error(f"Mood mission error: {str(e)}")
        return jsonify({'error': 'Failed to get mood mission'}), 500

@app.route('/api/gamified/complete_spiritual_direction', methods=['POST'])
@login_required
def complete_spiritual_direction():
    """Complete spiritual direction and award XP"""
    try:
        data = request.json or {}
        xp_earned = data.get('xp_earned', 5)
        
        session_id = f"user_{current_user.id}"
        user_data = gamified_features.get_user_data(session_id)
        
        # Ensure daily_goals exists with all required keys
        if 'daily_goals' not in user_data:
            user_data['daily_goals'] = {'devotion': False, 'prayer': False, 'reading': False, 'study': False}
        
        # Award XP and update stats
        user_data['xp'] += xp_earned
        user_data['total_actions'] += 1
        user_data['daily_goals']['study'] = True
        
        # Check for level up
        old_level = user_data.get('level', 'Seedling')
        level_info = gamified_features.calculate_level_progress(user_data)
        user_data.update(level_info)
        level_up_info = user_data['level'] != old_level
        
        # Save updated data
        gamified_features.save_user_data(session_id, user_data)
        
        return jsonify({
            'success': True,
            'xp_earned': xp_earned,
            'current_xp': user_data['xp'],
            'level_up': level_up_info,
            'current_level': user_data.get('level', 'Seedling')
        })
        
    except Exception as e:
        logging.error(f"Complete spiritual direction error: {str(e)}")
        return jsonify({'error': 'Failed to complete spiritual direction'}), 500

@app.route('/api/gamified/complete_mood_mission', methods=['POST'])
def complete_mood_mission():
    """Complete mood mission"""
    try:
        data = request.json or {}
        mood = data.get('mood', 'anxious')
        session_id = session.get('session_id', 'default_session')
        result = gamified_features.complete_mood_mission(session_id, mood)
        return jsonify(result)
    except Exception as e:
        logging.error(f"Complete mood mission error: {str(e)}")
        return jsonify({'error': 'Failed to complete mission'}), 500

@app.route('/api/gamified/progress', methods=['GET'])
@login_required
def get_user_progress():
    """Get user's enhanced spiritual progression"""
    try:
        session_id = f"user_{current_user.id}"
        user_data = gamified_features.get_user_data(session_id)
        
        # Transfer XP from default_session if user has 0 XP (one-time migration)
        if user_data.get('xp', 0) == 0:
            default_data = gamified_features.get_user_data('default_session')
            if default_data.get('xp', 0) > 0:
                user_data['xp'] = default_data['xp']
                user_data['total_actions'] = default_data.get('total_actions', 0)
                gamified_features.save_user_data(session_id, user_data)
        
        # Calculate enhanced level information
        level_info = gamified_features.calculate_level_progress(user_data)
        
        # Prepare enhanced response data with new spiritual progression system
        response_data = {
            'xp': user_data.get('xp', 0),
            'level': level_info['level'],
            'level_icon': level_info['level_icon'],
            'level_description': level_info['level_description'],
            'next_level': level_info['next_level'],
            'progress_to_next': level_info['progress_to_next'],
            'xp_to_next': level_info['xp_to_next'],
            'total_actions': user_data.get('total_actions', 0),
            'streak': user_data.get('streak', {}),
            'streaks': user_data.get('streak', {}),  # Legacy compatibility
            'badges': user_data.get('badges', []),
            'power_ups': user_data.get('power_ups', []),
            'equipped_power_ups': user_data.get('equipped_power_ups', []),
            'verses_mastered': user_data.get('verses_mastered', 0),
            'studies_completed': user_data.get('studies_completed', 0),
            'adventure_progress': user_data.get('scripture_adventure_position', 0),
            'faith_points': user_data.get('faith_points', 0),
            'daily_goals': user_data.get('daily_goals', {
                'devotion': False,
                'prayer': False,
                'reading': False,
                'study': False
            }),
            # Legacy compatibility fields
            'progress_percentage': level_info['progress_to_next']
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        logging.error(f"Get progress error: {str(e)}")
        return jsonify({'error': 'Failed to get progress'}), 500

@app.route('/api/gamified/bible_study', methods=['GET'])
def get_bible_study():
    """Get available Bible studies or current study session"""
    try:
        session_id = session.get('session_id', 'default_session')
        result = gamified_features.get_bible_studies(session_id)
        return jsonify(result)
    except Exception as e:
        logging.error(f"Bible study error: {str(e)}")
        return jsonify({'error': 'Failed to get Bible study'}), 500

@app.route('/api/gamified/start_bible_study', methods=['POST'])
def start_bible_study():
    """Start a new Bible study"""
    try:
        data = request.json or {}
        study_id = data.get('study_id', '')
        session_id = session.get('session_id', 'default_session')
        result = gamified_features.start_bible_study(session_id, study_id)
        return jsonify(result)
    except Exception as e:
        logging.error(f"Start Bible study error: {str(e)}")
        return jsonify({'error': 'Failed to start Bible study'}), 500

@app.route('/api/gamified/complete_bible_study_session', methods=['POST'])
def complete_bible_study_session():
    """Complete a Bible study session"""
    try:
        data = request.json or {}
        study_id = data.get('study_id', '')
        session_number = data.get('session_number', 1)
        answers = data.get('answers', [])
        session_id = session.get('session_id', 'default_session')
        result = gamified_features.complete_bible_study_session(session_id, study_id, session_number, answers)
        return jsonify(result)
    except Exception as e:
        logging.error(f"Complete Bible study session error: {str(e)}")
        return jsonify({'error': 'Failed to complete session'}), 500

@app.route('/api/prayer_journal', methods=['POST'])
def save_prayer_journal():
    """Save prayer journal entry"""
    try:
        data = request.json or {}
        prayer_request = data.get('prayer_request', '')
        gabe_response = data.get('gabe_response', '')
        mood = data.get('mood', 'neutral')
        user_name = session.get('user_name', 'Anonymous')
        
        if not prayer_request:
            return jsonify({'error': 'Prayer request is required'}), 400
        
        journal_entry = spiritual_features.create_prayer_journal_entry(
            user_name, prayer_request, gabe_response, mood
        )
        
        # Store in session for now (would be Firebase in production)
        if 'prayer_journal' not in session:
            session['prayer_journal'] = []
        
        session['prayer_journal'].append(journal_entry)
        session.modified = True
        
        return jsonify({
            'entry': journal_entry,
            'success': True,
            'message': 'Prayer journal entry saved successfully'
        })
        
    except Exception as e:
        logging.error(f"Prayer journal error: {str(e)}")
        return jsonify({
            'error': 'Unable to save prayer journal entry',
            'success': False
        }), 500

@app.route('/api/prayer_journal', methods=['GET'])
def get_prayer_journal():
    """Get prayer journal entries"""
    try:
        journal_entries = session.get('prayer_journal', [])
        
        return jsonify({
            'entries': journal_entries,
            'count': len(journal_entries),
            'success': True
        })
        
    except Exception as e:
        logging.error(f"Get prayer journal error: {str(e)}")
        return jsonify({
            'error': 'Unable to retrieve prayer journal',
            'success': False
        }), 500

@app.route('/api/gamified/daily_trivia', methods=['GET'])
@login_required
def get_daily_trivia():
    """Get daily Bible trivia question"""
    try:
        trivia = gamified_features.get_daily_trivia()
        return jsonify({
            'success': True,
            'trivia': trivia
        })
    except Exception as e:
        logging.error(f"Daily trivia error: {str(e)}")
        return jsonify({'error': 'Failed to load trivia', 'success': False}), 500

@app.route('/api/gamified/submit_trivia', methods=['POST'])
@login_required
def submit_trivia():
    """Submit trivia answer and get results"""
    try:
        data = request.json or {}
        answer = data.get('answer', '')
        is_correct = data.get('correct', False)
        session_id = session.get('session_id', 'default_session')
        
        result = gamified_features.submit_trivia_answer(session_id, answer, is_correct)
        return jsonify(result)
    except Exception as e:
        logging.error(f"Submit trivia error: {str(e)}")
        return jsonify({'error': 'Failed to submit answer', 'success': False}), 500

@app.route('/api/gamified/complete_prayer_training', methods=['POST'])
@login_required
def complete_prayer_training():
    """Complete prayer training challenge and award points"""
    try:
        data = request.json or {}
        points = data.get('points', 2)
        session_id = session.get('session_id', 'default_session')
        
        result = gamified_features.complete_prayer_training(session_id, points)
        return jsonify(result)
    except Exception as e:
        logging.error(f"Complete prayer training error: {str(e)}")
        return jsonify({'error': 'Failed to complete prayer training'}), 500

@app.route('/api/get_prayer', methods=['POST'])
def get_prayer():
    """Generate a custom prayer"""
    try:
        data = request.json or {}
        prayer_request = data.get('request', '').strip()
        user_name = session.get('user_name', '')
        
        if not prayer_request:
            return jsonify({'error': 'Prayer request is required'}), 400
        
        prayer = gabe_companion.generate_prayer(prayer_request, user_name)
        
        return jsonify({
            'prayer': prayer,
            'name': user_name
        })
        
    except Exception as e:
        logging.error(f"Prayer generation error: {str(e)}")
        return jsonify({
            'error': 'Unable to generate prayer at this time',
            'prayer': "Heavenly Father, we come to you in this moment knowing that you hear our hearts even when words fail us. Please be with us and guide us. In Jesus' name, Amen. 🙏"
        }), 500

@app.route('/api/explain_scripture', methods=['POST'])
def explain_scripture():
    """Explain a Bible verse or passage"""
    try:
        data = request.json or {}
        scripture = data.get('scripture', '').strip()
        user_name = session.get('user_name', '')
        
        if not scripture:
            return jsonify({'error': 'Scripture reference is required'}), 400
        
        explanation = gabe_companion.explain_scripture(scripture, user_name)
        
        return jsonify({
            'explanation': explanation,
            'name': user_name
        })
        
    except Exception as e:
        logging.error(f"Scripture explanation error: {str(e)}")
        return jsonify({
            'error': 'Unable to explain scripture at this time',
            'explanation': "I'd love to help explain that verse, but I'm having some technical difficulties right now. Try asking me again in a moment! 📖"
        }), 500

@app.route('/api/save_journal', methods=['POST'])
def save_journal():
    """Save a journal entry"""
    try:
        data = request.json or {}
        content = data.get('content', '').strip()
        user_name = session.get('user_name', '')
        
        if not content:
            return jsonify({'error': 'Journal content is required'}), 400
        
        if not user_name:
            return jsonify({'error': 'User name is required for journal entries'}), 400
        
        success = gabe_companion.save_journal_entry(
            user_name=user_name,
            content=content,
            session_id=session.get('session_id')
        )
        
        if success:
            return jsonify({
                'status': 'Journal entry saved successfully',
                'message': 'Your thoughts have been saved to your journal 📔✨'
            })
        else:
            return jsonify({
                'status': 'Journal saved locally', 
                'message': 'Your journal entry was noted, though the cloud sync is having issues. Your thoughts still matter! 💙'
            })
        
    except Exception as e:
        logging.error(f"Journal save error: {str(e)}")
        return jsonify({
            'error': 'Unable to save journal entry',
            'message': 'I had trouble saving that, but your thoughts still matter. Try again in a moment! 📔'
        }), 500

@app.route('/api/get_journal', methods=['GET'])
def get_journal():
    """Get user's journal entries"""
    try:
        user_name = session.get('user_name', '')
        
        if not user_name:
            return jsonify({'entries': [], 'message': 'Please tell me your name first to access your journal'})
        
        entries = gabe_companion.get_journal_entries(
            user_name=user_name,
            session_id=session.get('session_id'),
            limit=10
        )
        
        # Format entries for display
        formatted_entries = []
        for entry in entries:
            formatted_entries.append({
                'content': entry.get('content', ''),
                'mood': entry.get('mood'),
                'date': entry.get('timestamp', {}).strftime('%B %d, %Y') if entry.get('timestamp') else 'Recent',
                'timestamp': entry.get('timestamp')
            })
        
        return jsonify({
            'entries': formatted_entries,
            'count': len(formatted_entries),
            'message': f'Here are your recent journal entries, {user_name} 📔'
        })
        
    except Exception as e:
        logging.error(f"Journal retrieval error: {str(e)}")
        return jsonify({
            'entries': [],
            'error': 'Unable to retrieve journal entries',
            'message': 'I had trouble finding your journal entries. Try again in a moment! 📔'
        }), 500

@app.route('/api/voice_mode', methods=['POST'])
def toggle_voice_mode():
    """Toggle voice mode for the session"""
    try:
        data = request.json or {}
        enable = data.get('enable')
        session_id = session.get('session_id', 'default')
        
        voice_enabled = gabe_companion.toggle_voice_mode(session_id, enable)
        
        return jsonify({
            'voice_mode_enabled': voice_enabled,
            'message': '🔊 Voice mode activated. All responses will be read aloud.' if voice_enabled else '💬 Text-only mode. Voice playback disabled.',
            'success': True
        })
        
    except Exception as e:
        logging.error(f"Voice mode toggle error: {str(e)}")
        return jsonify({
            'error': 'Unable to toggle voice mode',
            'success': False
        }), 500

@app.route('/api/chunked_response', methods=['POST'])
def get_chunked_response():
    """Get a response broken into voice-friendly chunks"""
    try:
        data = request.json or {}
        user_message = data.get('message', '').strip()
        user_name = session.get('user_name', '')
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Detect conversation intent
        intent = gabe_companion.detect_conversation_intent(user_message)
        
        # Get full response from GABE
        full_response = gabe_companion.get_response(
            user_message=user_message,
            user_name=user_name,
            age_range=session.get('user_age_range', ''),
            conversation_history=session.get('conversation_history', []),
            session_id=session.get('session_id')
        )
        
        # Break into chunks for voice delivery
        chunks = gabe_companion.chunk_and_deliver_response(full_response, user_name)
        
        # Add personalized closure for prayer requests
        closure = None
        if intent == 'prayer_request':
            mood = gabe_companion.detect_mood(user_message)
            closure = gabe_companion.generate_personalized_closure(user_name, mood, prayer_context=True)
        
        response_data = {
            'chunks': chunks,
            'intent': intent,
            'full_response': full_response,
            'closure': closure,
            'voice_mode_enabled': gabe_companion.voice_mode_enabled.get(session.get('session_id', 'default'), False)
        }
        
        # Update conversation history
        if 'conversation_history' not in session:
            session['conversation_history'] = []
        
        session['conversation_history'].append({
            'user': user_message,
            'gabe': full_response,
            'timestamp': datetime.now().isoformat(),
            'intent': intent,
            'chunks': len(chunks)
        })
        
        return jsonify(response_data)
        
    except Exception as e:
        logging.error(f"Chunked response error: {str(e)}")
        return jsonify({
            'error': 'Unable to process chunked response',
            'chunks': ['I apologize, but I had trouble processing that. Can you try again?'],
            'intent': 'error'
        }), 500

@app.route('/api/contextual_prayer', methods=['POST'])
def generate_contextual_prayer():
    """Generate a deeply contextual prayer based on conversation"""
    try:
        data = request.json or {}
        prayer_request = data.get('request', '').strip()
        user_name = session.get('user_name', '')
        conversation_history = session.get('conversation_history', [])
        
        # Detect current mood
        mood = gabe_companion.detect_mood(prayer_request) if prayer_request else 'neutral'
        
        # Extract conversation context
        context_topics = []
        for exchange in conversation_history[-5:]:  # Last 5 exchanges
            if isinstance(exchange, dict) and exchange.get('user'):
                user_msg = exchange['user'].lower()
                if any(word in user_msg for word in ['work', 'job', 'career']):
                    context_topics.append('work')
                if any(word in user_msg for word in ['family', 'relationship', 'marriage']):
                    context_topics.append('family')
                if any(word in user_msg for word in ['health', 'sick', 'healing']):
                    context_topics.append('health')
        
        # Generate contextual prayer
        prayer = gabe_companion.create_contextual_prayer(
            prayer_request, 
            user_name, 
            mood, 
            conversation_context=', '.join(set(context_topics)) if context_topics else None
        )
        
        # Get personalized closure
        closure = gabe_companion.generate_personalized_closure(user_name, mood, prayer_context=True)
        
        return jsonify({
            'prayer': prayer,
            'closure': closure,
            'mood_detected': mood,
            'context_topics': context_topics,
            'name': user_name
        })
        
    except Exception as e:
        logging.error(f"Contextual prayer error: {str(e)}")
        return jsonify({
            'error': 'Unable to generate prayer',
            'prayer': f"Heavenly Father, be with {session.get('user_name', 'this precious person')} right now. Grant them peace and comfort. In Jesus' name, Amen."
        }), 500

@app.route('/api/drop_of_hope', methods=['GET'])
def get_drop_of_hope():
    """Get a random Drop of Hope verse for rotation display"""
    try:
        verse_data = drop_of_hope.get_random_verse()
        
        return jsonify({
            'verse': verse_data['text'],
            'reference': verse_data['verse'],
            'theme': verse_data.get('theme', 'hope')
        })
        
    except Exception as e:
        logging.error(f"Drop of Hope error: {str(e)}")
        return jsonify({
            'verse': "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
            'reference': "Psalm 34:18",
            'theme': 'comfort'
        }), 200  # Still return 200 with fallback verse

@app.route('/api/reset_session', methods=['POST'])
def reset_session():
    """Reset the conversation session"""
    session.clear()
    return jsonify({'status': 'Session reset successfully'})

@app.route('/api/clear_user_data', methods=['POST']) 
def clear_user_data():
    """Clear user data including gamified features"""
    session.clear()
    # Clear the global storage as well
    from gamified_spiritual_features import SESSION_STORAGE
    SESSION_STORAGE.clear()
    return jsonify({'status': 'All user data cleared'})

@app.route('/api/gamified/prayer_card', methods=['GET'])
def get_prayer_card():
    """Get a random prayer card for the session"""
    try:
        card = prayer_cards.get_random_prayer_card()
        return jsonify({'success': True, 'card': card})
    except Exception as e:
        logging.error(f"Get prayer card error: {str(e)}")
        return jsonify({'error': 'Failed to get prayer card'}), 500

@app.route('/api/gamified/complete_prayer_card', methods=['POST'])
@login_required
def complete_prayer_card():
    """Complete a prayer card and award XP with validation"""
    try:
        data = request.json or {}
        card_id = data.get('card_id', '')
        activity_metadata = data.get('metadata', {})
        
        if not card_id:
            return jsonify({'success': False, 'message': 'Card ID required'}), 400
        
        result = prayer_cards.complete_prayer_card(card_id, activity_metadata)
        
        if result['success']:
            # Update user's XP in gamified system
            session_id = f"user_{current_user.id}"
            user_data = gamified_features.get_user_data(session_id)
            
            # Ensure daily_goals exists with all required keys
            if 'daily_goals' not in user_data:
                user_data['daily_goals'] = {'devotion': False, 'prayer': False, 'reading': False, 'study': False}
            
            user_data['xp'] += result['xp_earned']
            user_data['total_actions'] += 1
            
            # Update daily goals
            user_data['daily_goals']['prayer'] = True
            
            # Check for level up
            old_level = user_data['level']
            for level, threshold in gamified_features.level_thresholds.items():
                if user_data['xp'] >= threshold:
                    user_data['level'] = level
            
            result['level_up'] = user_data['level'] != old_level
            result['total_xp'] = user_data['xp']
            result['level'] = user_data['level']
            
            gamified_features.save_user_data(session_id, user_data)
        
        return jsonify(result)
    except Exception as e:
        logging.error(f"Complete prayer card error: {str(e)}")
        return jsonify({'error': 'Failed to complete prayer card'}), 500

@app.route('/api/gamified/mirror_card', methods=['GET'])
def get_mirror_card():
    """Get a mirror card for praying for others"""
    try:
        card = prayer_cards.get_mirror_card()
        return jsonify({'success': True, 'card': card})
    except Exception as e:
        logging.error(f"Get mirror card error: {str(e)}")
        return jsonify({'error': 'Failed to get mirror card'}), 500

@app.route('/api/gamified/complete_mirror_prayer', methods=['POST'])
def complete_mirror_prayer():
    """Complete a mirror prayer and award bonus XP"""
    try:
        data = request.json or {}
        prayer_text = data.get('prayer_text', '').strip()
        
        if not prayer_text:
            return jsonify({'success': False, 'message': 'Prayer text required'}), 400
        
        # Award bonus XP for praying for others
        session_id = session.get('session_id', 'default_session')
        user_data = gamified_features.get_user_data(session_id)
        bonus_xp = 2
        user_data['xp'] += bonus_xp
        user_data['total_actions'] += 1
        
        # Check for level up
        old_level = user_data['level']
        for level, threshold in gamified_features.level_thresholds.items():
            if user_data['xp'] >= threshold:
                user_data['level'] = level
        
        gamified_features.save_user_data(session_id, user_data)
        
        return jsonify({
            'success': True,
            'xp_earned': bonus_xp,
            'total_xp': user_data['xp'],
            'level': user_data['level'],
            'level_up': user_data['level'] != old_level,
            'message': 'Beautiful prayer! God sees your heart for others.'
        })
    except Exception as e:
        logging.error(f"Complete mirror prayer error: {str(e)}")
        return jsonify({'error': 'Failed to complete mirror prayer'}), 500

@app.route('/api/spiritual_direction/assessment', methods=['POST'])
def spiritual_direction_assessment():
    """Get spiritual direction assessment and session"""
    try:
        data = request.json or {}
        user_message = data.get('message', '').strip()
        # Use preferred name "Ray" for this user, otherwise use session name or fallback
        if current_user.is_authenticated and current_user.username == 'raylinsami@me.com':
            user_name = 'Ray'
        else:
            user_name = session.get('user_name', current_user.username if current_user.is_authenticated else 'friend')
        
        if not user_message:
            return jsonify({'success': False, 'message': 'Please share what\'s on your heart'}), 400
        
        # Get conversation history for context
        conversation_history = session.get('conversation_history', [])
        
        # Assess spiritual need
        assessment = spiritual_director.assess_spiritual_need(user_message, conversation_history)
        
        # Create spiritual direction session
        direction_session = spiritual_director.create_spiritual_direction_session(
            assessment, user_message, user_name
        )
        
        if direction_session['success']:
            # Award XP for spiritual direction session
            session_id = session.get('session_id', 'default_session')
            user_data = gamified_features.get_user_data(session_id)
            user_data['xp'] += direction_session['xp_earned']
            user_data['total_actions'] += 1
            
            # Update daily goals
            user_data['daily_goals']['study'] = True
            
            # Check for level up
            old_level = user_data['level']
            for level, threshold in gamified_features.level_thresholds.items():
                if user_data['xp'] >= threshold:
                    user_data['level'] = level
            
            direction_session['level_up'] = user_data['level'] != old_level
            direction_session['total_xp'] = user_data['xp']
            direction_session['current_level'] = user_data['level']
            
            gamified_features.save_user_data(session_id, user_data)
        
        return jsonify(direction_session)
        
    except Exception as e:
        logging.error(f"Spiritual direction assessment error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Unable to provide spiritual direction',
            'fallback_message': 'Dear friend, remember that God is with you in this season. Take time today to simply sit in His presence and know that you are loved.'
        }), 500

@app.route('/api/spiritual_direction', methods=['POST'])
def get_spiritual_direction():
    """Simplified spiritual direction using Gemini directly"""
    try:
        data = request.json or {}
        concern = data.get('concern', '').strip()
        
        if not concern:
            return jsonify({'error': 'Please share your spiritual concern'}), 400
        
        # Use Gemini directly for reliable response
        from google import genai
        
        client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        
        spiritual_masters = {
            'teresa_avila': {'icon': '🌹', 'name': 'St. Teresa of Avila', 'specialty': 'Prayer & Mysticism'},
            'john_cross': {'icon': '✝️', 'name': 'St. John of the Cross', 'specialty': 'Dark Night of Soul'},
            'brother_lawrence': {'icon': '🕊️', 'name': 'Brother Lawrence', 'specialty': 'Presence of God'},
            'francis_sales': {'icon': '📖', 'name': 'St. Francis de Sales', 'specialty': 'Gentle Devotion'},
            'ignatius': {'icon': '⚔️', 'name': 'St. Ignatius Loyola', 'specialty': 'Spiritual Discernment'},
            'therese': {'icon': '🌸', 'name': 'St. Thérèse of Lisieux', 'specialty': 'Little Way of Trust'}
        }
        
        # Select appropriate master based on concern keywords
        master_key = 'teresa_avila'  # Default
        concern_lower = concern.lower()
        if any(word in concern_lower for word in ['dark', 'distant', 'lost', 'empty']):
            master_key = 'john_cross'
        elif any(word in concern_lower for word in ['daily', 'work', 'presence', 'moment']):
            master_key = 'brother_lawrence'
        elif any(word in concern_lower for word in ['gentle', 'harsh', 'perfectionism']):
            master_key = 'francis_sales'
        elif any(word in concern_lower for word in ['decision', 'choice', 'discern', 'will']):
            master_key = 'ignatius'
        elif any(word in concern_lower for word in ['trust', 'confidence', 'little', 'simple']):
            master_key = 'therese'
        
        master = spiritual_masters[master_key]
        
        prompt = f"""You are {master['name']}, a beloved Christian saint known for {master['specialty']}. 
        
A person has shared this spiritual concern with you: "{concern}"

Respond as {master['name']} would, offering:
1. Gentle, personal spiritual guidance (2-3 paragraphs)
2. A relevant Bible verse with reference
3. A specific spiritual practice they can do today
4. A closing prayer in first person ("I pray...")

Be warm, wise, and deeply spiritual. Write as if speaking directly to them with love and understanding.
Format your response as JSON with these fields:
- spiritual_guidance: your main message to them
- scripture_verse: the Bible verse text
- scripture_reference: the reference (e.g., "Psalm 23:4")
- spiritual_practice: specific practice they can do
- closing_prayer: personal prayer
- master_quote: a brief inspirational quote from you"""

        response = client.models.generate_content(
            model="gemini-2.5-pro",
            contents=prompt
        )
        
        result_text = response.text or ""
        
        # Try to parse JSON, fallback to simple response
        try:
            import json
            result = json.loads(result_text)
            result.update({
                'spiritual_master': master['name'],
                'master_icon': master['icon'],
                'master_specialty': master['specialty']
            })
            return jsonify(result)
        except:
            # Fallback response
            return jsonify({
                'spiritual_master': master['name'],
                'master_icon': master['icon'],
                'master_specialty': master['specialty'],
                'spiritual_guidance': result_text,
                'scripture_verse': 'Be still and know that I am God.',
                'scripture_reference': 'Psalm 46:10',
                'spiritual_practice': 'Take 5 minutes of quiet prayer today, simply resting in God\'s presence.',
                'closing_prayer': 'I pray that you feel God\'s loving presence with you today and always.',
                'master_quote': 'Let nothing disturb you. All things pass. God does not change.'
            })
        
    except Exception as e:
        logging.error(f"Spiritual direction error: {str(e)}")
        return jsonify({'error': 'Unable to connect to spiritual guidance right now'}), 500

@app.route('/api/spiritual_direction/daily_prompt', methods=['GET'])
def get_daily_spiritual_prompt():
    """Get daily spiritual direction prompt"""
    try:
        prompt = spiritual_director.get_daily_spiritual_direction_prompt()
        return jsonify({'success': True, 'prompt': prompt})
    except Exception as e:
        logging.error(f"Daily spiritual prompt error: {str(e)}")
        return jsonify({'error': 'Failed to get daily prompt'}), 500

@app.route('/api/spiritual_direction/complete_practice', methods=['POST'])
def complete_spiritual_practice():
    """Complete a spiritual practice from direction session"""
    try:
        data = request.json or {}
        completed = data.get('completed', False)
        reflection = data.get('reflection', '').strip()
        
        session_id = session.get('session_id', 'default_session')
        result = spiritual_director.track_spiritual_direction_progress(
            session_id, completed, reflection
        )
        
        if result['success'] and result['xp_earned'] > 0:
            # Update user XP
            user_data = gamified_features.get_user_data(session_id)
            user_data['xp'] += result['xp_earned']
            user_data['total_actions'] += 1
            
            # Check for level up
            old_level = user_data['level']
            for level, threshold in gamified_features.level_thresholds.items():
                if user_data['xp'] >= threshold:
                    user_data['level'] = level
            
            result['level_up'] = user_data['level'] != old_level
            result['total_xp'] = user_data['xp']
            result['current_level'] = user_data['level']
            
            gamified_features.save_user_data(session_id, user_data)
        
        return jsonify(result)
        
    except Exception as e:
        logging.error(f"Complete spiritual practice error: {str(e)}")
        return jsonify({'error': 'Failed to track practice'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
