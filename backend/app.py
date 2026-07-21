from flask import Flask, jsonify
from flask_cors import CORS
from config import Config

# Import blueprints from the routes package
from routes.auth_routes import auth_bp
from routes.profile_routes import profile_bp
from routes.complaint_routes import complaint_bp
from routes.guide_routes import guide_bp
from routes.equipment_routes import equipment_bp
from routes.translate import translate_bp

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Register all Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(complaint_bp)
app.register_blueprint(guide_bp)
app.register_blueprint(equipment_bp)
app.register_blueprint(translate_bp)

@app.route("/", methods=["GET"])
def index():
    """Welcome index route for status checks."""
    return jsonify({
        "status": "online",
        "app": "TrustTrip API",
        "version": "1.0.0"
    })

if __name__ == "__main__":
    # Start Flask API using configurations loaded from environment
    app.run(host="0.0.0.0", port=Config.PORT, debug=Config.DEBUG)