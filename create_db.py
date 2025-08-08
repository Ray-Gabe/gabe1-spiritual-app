from gabe_app import create_app
from gabe_app.extensions import db
from gabe_app.models import User, Conversation

app = create_app()

with app.app_context():
    db.create_all()
    print("✅ Database created.")
