from flask import Blueprint, request, jsonify
from services.auth_service import register_user, login_user

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    try:
        register_user(data)
    except Exception as exc:
        return jsonify({"success": False, "message": str(exc)}), 400

    return jsonify({"success": True, "message": "Registration successful"})


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    user = login_user(data)

    if user:
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {
                "id": user["user_id"],
                "username": user["username"]
            }
        })

    return jsonify({"success": False, "message": "Invalid username or password"}), 401