# gabe_app/routes/main_routes.py
from flask import Blueprint, render_template, jsonify, request

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    """Serve the beautiful main app page"""
    # Mock authenticated user to bypass login for now
    user = {
        'name': 'Guest User',
        'username': 'guest',
        'age_range': '18-30',
        'authenticated': True
    }
    return render_template('index.html', user=user, authenticated_user=user)

@main_bp.route('/login')
def login_page():
    """Serve basic login page as fallback"""
    return render_template('login.html')

@main_bp.route('/register') 
def register_page():
    """Serve basic register page as fallback"""
    return render_template('register.html')

# API routes for the spiritual features
@main_bp.route('/api/chat', methods=['POST'])
def chat_api():
    """Handle chat messages"""
    data = request.get_json()
    message = data.get('message', '')
    name = data.get('name', 'friend')
    
    # Simple spiritual responses based on keywords
    if any(word in message.lower() for word in ['prayer', 'pray']):
        response = f"Let's pray together, {name}. What's on your heart that we can bring to God?"
    elif any(word in message.lower() for word in ['bible', 'scripture', 'verse']):
        response = f"The Bible is full of wisdom! Here's a verse for you: 'Trust in the Lord with all your heart.' - Proverbs 3:5"
    elif any(word in message.lower() for word in ['sad', 'worried', 'anxious']):
        response = f"I understand you're going through a tough time, {name}. Remember, 'Cast all your anxiety on Him because He cares for you.' - 1 Peter 5:7"
    elif any(word in message.lower() for word in ['thank', 'grateful', 'blessed']):
        response = f"Gratitude is beautiful, {name}! 'Give thanks in all circumstances.' - 1 Thessalonians 5:18"
    else:
        response = f"I'm here to walk alongside you in faith, {name}. How can I help you grow spiritually today?"
    
    return jsonify({
        'response': response,
        'mood': 'hopeful'
    })

@main_bp.route('/api/gamified/daily_devotion')
def daily_devotion():
    """Serve daily devotion content"""
    return jsonify({
        'type': 'new_devotion',
        'devotion': {
            'title': 'Morning Power-Up',
            'greeting': 'Good morning, faith warrior!',
            'verse_text': 'I can do all things through Christ who strengthens me.',
            'verse_reference': 'Philippians 4:13',
            'epic_story': 'Today is your day to shine for God! Every challenge is an opportunity to show His power.',
            'mission': 'Find one way to encourage someone today and watch God work through you.',
            'power_prayer': 'Lord, fill me with Your strength and love. Help me be a light in someone\'s life today.',
            'closing': 'You are God\'s masterpiece, created for good works!'
        }
    })

@main_bp.route('/api/gamified/complete_devotion', methods=['POST'])
def complete_devotion():
    """Handle devotion completion"""
    return jsonify({
        'success': True,
        'xp_earned': 2,
        'message': 'Devotion completed! God is pleased with your dedication.',
        'new_level': False,
        'streak': 1
    })

@main_bp.route('/api/drop_of_hope')
def drop_of_hope():
    """Serve rotating Bible verses"""
    verses = [
        {
            'verse': 'Be strong and courageous! Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
            'reference': 'Joshua 1:9'
        },
        {
            'verse': 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you.',
            'reference': 'Jeremiah 29:11'
        },
        {
            'verse': 'Cast all your anxiety on him because he cares for you.',
            'reference': '1 Peter 5:7'
        }
    ]
    import random
    return jsonify(random.choice(verses))
