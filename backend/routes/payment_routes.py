import logging

from flask import Blueprint, jsonify, request

from config import Config
from services.payment_service import PaymentError, create_payment_order, mark_payment_failed, process_webhook, verify_payment, verify_webhook_signature

logger = logging.getLogger(__name__)

payment_bp = Blueprint("payments", __name__)


def _json():
    return request.get_json(silent=True) or {}


@payment_bp.errorhandler(PaymentError)
def handle_payment_error(error):
    logger.warning("payment request rejected: %s", error.status)
    return jsonify({"error": str(error)}), error.status


def _require_https():
    if Config.REQUIRE_HTTPS_PAYMENTS and not request.is_secure and not Config.TRUST_PROXY:
        return jsonify({"error": "Secure connection required"}), 400
    return None


@payment_bp.route("/payments/razorpay/order", methods=["POST"])
def create_order():
    secure_error = _require_https()
    if secure_error:
        return secure_error
    try:
        return jsonify(create_payment_order(_json())), 201
    except PaymentError as error:
        return handle_payment_error(error)


@payment_bp.route("/payments/razorpay/verify", methods=["POST"])
def verify_order():
    secure_error = _require_https()
    if secure_error:
        return secure_error
    try:
        return jsonify(verify_payment(_json()))
    except PaymentError as error:
        return handle_payment_error(error)


@payment_bp.route("/payments/razorpay/webhook", methods=["POST"])
def webhook():
    try:
        verify_webhook_signature(request.get_data(), request.headers.get("X-Razorpay-Signature", ""))
        return jsonify(process_webhook(request.get_json(silent=True) or {}))
    except PaymentError as error:
        return handle_payment_error(error)


@payment_bp.route("/payments/razorpay/failure", methods=["POST"])
def failure():
    try:
        return jsonify(mark_payment_failed(_json()))
    except PaymentError as error:
        return handle_payment_error(error)
