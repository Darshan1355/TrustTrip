from flask import Blueprint, request, jsonify
from services.equipment_service import (
    fetch_prices,
    create_order,
    fetch_user_orders,
    fetch_all_equipment,
    fetch_equipment_by_id
)

equipment_bp = Blueprint("equipment", __name__)

@equipment_bp.route("/prices", methods=["GET"])
def get_prices():

    prices = fetch_prices()

    return jsonify(prices)


@equipment_bp.route("/place-order", methods=["POST"])
def place_order():

    data = request.json

    if not data:
        return jsonify({
            "error": "No data received"
        }), 400

    if "user_id" not in data:
        return jsonify({
            "error": "user_id missing"
        }), 400

    if "equipment_id" not in data:
        return jsonify({
            "error": "equipment_id missing"
        }), 400

    try:
        create_order(data)

        return jsonify({
            "message": "Order placed successfully"
        })

    except Exception as e:
        print("ERROR:", e)

        return jsonify({
            "error": "Database error"
        }), 500


@equipment_bp.route("/user-orders/<int:user_id>", methods=["GET"])
def get_user_orders(user_id):

    orders = fetch_user_orders(user_id)

    return jsonify(orders)


@equipment_bp.route("/equipment", methods=["GET"])
def get_all_equipment():

    data = fetch_all_equipment()

    return jsonify(data)


@equipment_bp.route("/equipment/<int:id>", methods=["GET"])
def get_equipment_by_id(id):

    item = fetch_equipment_by_id(id)

    if item:
        return jsonify(item)

    return jsonify({
        "error": "Not found"
    }), 404