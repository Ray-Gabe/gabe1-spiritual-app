# gabe_app/routes/auth_routes.py

from flask import Blueprint, render_template, redirect, url_for, request, flash
from flask_login import login_user, logout_user, login_required
from gabe_app.models import User
from gabe_app import db

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    # Replace with your logic
    return render_template('login.html')

@auth.route('/register', methods=['GET', 'POST'])
def register():
    # Replace with your logic
    return render_template('register.html')

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))
