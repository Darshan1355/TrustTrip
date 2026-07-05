from flask import Blueprint, request, jsonify
from services.translate_service import translate_text

translate_bp = Blueprint("translate", __name__)


@translate_bp.route("/translate", methods=["POST"])
def translate():

    try:
        data = request.json

        text = data.get("text")
        source = data.get("source", "auto")
        target = data.get("target")

        if not text:
            return jsonify({
                "success": False,
                "message": "Text is required"
            }), 400

        translated = translate_text(
            text,
            source,
            target
        )

        return jsonify({
            "success": True,
            "translation": translated
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500