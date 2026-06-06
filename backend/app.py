
import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

# ---------------- CREATE APP ----------------

app = Flask(__name__)
CORS(app)

# ---------------- DATABASE CONFIG ----------------

DB_USER = os.environ.get("MYSQLUSER")
DB_PASSWORD = os.environ.get("MYSQLPASSWORD")
DB_HOST = os.environ.get("MYSQLHOST")
DB_PORT = os.environ.get("MYSQLPORT")
DB_NAME = os.environ.get("MYSQLDATABASE")

app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# ---------------- IMPORT ROUTES WITH DEBUG ----------------

try:
    from routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp)
    print("AUTH blueprint loaded")

except Exception as e:
    print("AUTH IMPORT ERROR:")
    print(e)

try:
    from routes.profile_routes import profile_bp
    app.register_blueprint(profile_bp)
    print("PROFILE blueprint loaded")

except Exception as e:
    print("PROFILE IMPORT ERROR:")
    print(e)

try:
    from routes.complaint_routes import complaint_bp
    app.register_blueprint(complaint_bp)
    print("COMPLAINT blueprint loaded")

except Exception as e:
    print("COMPLAINT IMPORT ERROR:")
    print(e)

try:
    from routes.guide_routes import guide_bp
    app.register_blueprint(guide_bp)
    print("GUIDE blueprint loaded")

except Exception as e:
    print("GUIDE IMPORT ERROR:")
    print(e)

try:
    from routes.equipment_routes import equipment_bp
    app.register_blueprint(equipment_bp)
    print("EQUIPMENT blueprint loaded")

except Exception as e:
    print("EQUIPMENT IMPORT ERROR:")
    print(e)

# ---------------- TEST ROUTES ----------------

@app.route("/")
def home():
    return jsonify({
        "message": "Backend Running"
    })

@app.route("/test-route")
def test_route():
    return jsonify({
        "status": "all routes working"
    })

# ---------------- RUN APP ----------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)

