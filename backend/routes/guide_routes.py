from flask import Blueprint, request, jsonify
from services.guide_service import (
    fetch_guides,
    submit_guide_rating
)

guide_bp = Blueprint("guide", __name__)

@guide_bp.route("/guides", methods=["GET"])
def get_guides():

    guides = fetch_guides()

    return jsonify(guides)


@guide_bp.route("/rate-guide", methods=["POST"])
def rate_guide():

    data = request.json

    submit_guide_rating(data)

    return jsonify({
        "message": "Rating submitted"
    })