from flask import Blueprint, request, jsonify
from services.guide_service import (
    fetch_guides,
    submit_guide_rating,
    create_guide_booking,
    cancel_guide_booking,
)

guide_bp = Blueprint("guide", __name__)


@guide_bp.route("/guides", methods=["GET"])
def get_guides():
    """
    Returns all guides. Pass ?username=<username> to include
    the booked_by_user flag and accurate average rating per guide.
    """
    username = request.args.get("username")
    guides = fetch_guides(username=username)
    return jsonify(guides)


@guide_bp.route("/rate-guide", methods=["POST"])
def rate_guide():
    data = request.get_json(silent=True)
    if not data or "guide_id" not in data or "username" not in data or "rating" not in data:
        return jsonify({"error": "Missing required fields: guide_id, username, rating"}), 400

    submit_guide_rating(data)
    return jsonify({"message": "Rating submitted"})


@guide_bp.route("/select-guide", methods=["POST"])
def select_guide():
    data = request.get_json(silent=True)
    if not data or "username" not in data or "guide_id" not in data:
        return jsonify({"error": "Missing username or guide_id"}), 400

    try:
        create_guide_booking(data)
        return jsonify({"success": True, "message": "Guide booked successfully"})
    except ValueError as e:
        return jsonify({"error": str(e)}), 409
    except Exception as e:
        print("Booking Error:", e)
        return jsonify({"error": "Database error"}), 500


@guide_bp.route("/cancel-booking", methods=["POST"])
def cancel_booking():
    """
    Cancel a user's active booking for a guide.
    Body: { "username": "...", "guide_id": 123 }
    """
    data = request.get_json(silent=True)
    if not data or "username" not in data or "guide_id" not in data:
        return jsonify({"error": "Missing username or guide_id"}), 400

    try:
        cancel_guide_booking(data)
        return jsonify({"success": True, "message": "Booking cancelled successfully"})
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        print("Cancel Error:", e)
        return jsonify({"error": "Database error"}), 500
