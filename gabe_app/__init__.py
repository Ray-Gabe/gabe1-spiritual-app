# gabe_app/__init__.py

from flask import Flask
from gabe_app.extensions import db  # ✅ pull db from extensions

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)

    from gabe_app.routes.auth_routes import auth
    from gabe_app.routes.main_routes import main

    app.register_blueprint(auth)
    app.register_blueprint(main)

    with app.app_context():
        db.create_all()

    return app
