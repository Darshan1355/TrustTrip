from flask import Blueprint, request, jsonify
from services.complaint_service import (
    create_complaint,
    get_complaints,
    get_user_id_by_username
)
from services.notification_service import send_notification_to_user

complaint_bp = Blueprint("complaint", __name__)

@complaint_bp.route("/complaint", methods=["POST"])
def add_complaint():

    data = request.json

    try:
        # Create complaint and get ID
        complaint_id = create_complaint(data)
        
        # Get username from request
        username = data.get("username")
        
        # Trigger notification to user
        if username:
            user_id = get_user_id_by_username(username)
            if user_id:
                notification_data = {
                    "type": "complaint",
                    "complaint_id": complaint_id,
                    "screen": "MyComplaints"
                }
                send_notification_to_user(
                    user_id=user_id,
                    notification_type="complaint_submitted",
                    notification_data=notification_data
                )
        
        return jsonify({
            "message": "Complaint stored successfully",
            "complaint_id": complaint_id
        })
    
    except Exception as e:
        print(f"Error creating complaint: {e}")
        return jsonify({
            "message": "Error storing complaint"
        }), 500


@complaint_bp.route("/user-complaints/<username>", methods=["GET"])
def get_user_complaints(username):

    complaints = get_complaints(username)

    return jsonify(complaints)