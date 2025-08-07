# gabe_app/routes/main_routes.py

from flask import Blueprint, render_template

main = Blueprint('main', __name__)

@main.route('/')
def index():
    # Optional: mock user data for testing
    user = {
        'username': 'TestUser',
        'age_range': '18-30'
    }
    return render_template('index.html', user=user)

@main.route('/landing')
def landing():
    return render_template('landing.html')
