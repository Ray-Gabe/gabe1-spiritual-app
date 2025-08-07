from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from gabe_app.models import User  # 👈 Important

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    # 👇 Define the user_loader here
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    from gabe_app.routes.auth_routes import auth_bp
    from gabe_app.routes.main_routes import main_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)

    return app
