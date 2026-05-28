from flask import Blueprint, request, jsonify
from services.complaint_service import (
    create_complaint,
    get_complaints
)

complaint_bp = Blueprint("complaint", __name__)

@complaint_bp.route("/complaint", methods=["POST"])
def add_complaint():

    data = request.json

    create_complaint(data)

    return jsonify({
        "message": "Complaint stored successfully"
    })


@complaint_bp.route("/user-complaints/<username>", methods=["GET"])
def get_user_complaints(username):

    complaints = get_complaints(username)

    return jsonify(complaints)