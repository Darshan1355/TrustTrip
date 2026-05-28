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

import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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

@app.route("/")
def home():
    return "Backend Running"

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)