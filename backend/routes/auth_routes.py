from flask import Blueprint, request, jsonify
from services.auth_service import register_user, login_user

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    register_user(data)
    return jsonify({"success": True})

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    user = login_user(data)

    if user:
        return jsonify({
            "success": True,
            "user": {
                "id": user["user_id"],
                "username": user["username"]
            }
        })

    return jsonify({"success": False})