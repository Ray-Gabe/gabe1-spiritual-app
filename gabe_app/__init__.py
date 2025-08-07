# gabe_app/__init__.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)

    from gabe_app.routes.auth_routes import auth
    from gabe_app.routes.main_routes import main

    app.register_blueprint(auth)
    app.register_blueprint(main)

    # ✅ Optional: auto-create tables (no login required)
    with app.app_context():
        db.create_all()

    return app

