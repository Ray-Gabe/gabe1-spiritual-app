from gabe_app import db, create_app
from gabe_app.models import User

app = create_app()

with app.app_context():
    db.create_all()
    print("✅ Database created!")
