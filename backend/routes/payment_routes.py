from flask import Blueprint, jsonify, request

from services.payment_service import PaymentError, create_payment_order, mark_payment_failed, verify_payment

payment_bp = Blueprint("payments", __name__)


def _json():
    return request.get_json(silent=True) or {}


@payment_bp.errorhandler(PaymentError)
def handle_payment_error(error):
    return jsonify({"error": str(error)}), error.status


@payment_bp.route("/payments/razorpay/order", methods=["POST"])
def create_order():
    try:
        return jsonify(create_payment_order(_json())), 201
    except PaymentError as error:
        return handle_payment_error(error)


@payment_bp.route("/payments/razorpay/verify", methods=["POST"])
def verify_order():
    try:
        return jsonify(verify_payment(_json()))
    except PaymentError as error:
        return handle_payment_error(error)


@payment_bp.route("/payments/razorpay/failure", methods=["POST"])
def failure():
    try:
        return jsonify(mark_payment_failed(_json()))
    except PaymentError as error:
        return handle_payment_error(error)
