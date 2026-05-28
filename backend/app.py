from flask import Flask
from flask_cors import CORS

from routes.auth_routes import auth_bp
from routes.profile_routes import profile_bp
from routes.complaint_routes import complaint_bp
from routes.guide_routes import guide_bp
from routes.equipment_routes import equipment_bp

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(complaint_bp)
app.register_blueprint(guide_bp)
app.register_blueprint(equipment_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)