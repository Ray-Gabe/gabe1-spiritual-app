from flask import Blueprint, render_template, request, redirect, url_for
from gabe_app.models import User, db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/')
def home():
    return render_template('home.html')

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        new_user = User(username=username, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('auth.home'))
    return render_template('register.html')
