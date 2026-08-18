import hashlib
import hmac
import logging
import secrets
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP

import razorpay

from config import Config
from database import get_db_connection

logger = logging.getLogger(__name__)


class PaymentError(Exception):
    def __init__(self, message, status=400):
        super().__init__(message)
        self.status = status


def _client():
    if not Config.RAZORPAY_KEY_ID or not Config.RAZORPAY_KEY_SECRET:
        raise PaymentError("Razorpay is not configured", 503)
    return razorpay.Client(auth=(Config.RAZORPAY_KEY_ID, Config.RAZORPAY_KEY_SECRET))


def _amount_in_paise(value):
    try:
        amount = Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    except (InvalidOperation, TypeError):
        raise PaymentError("Invalid amount")
    if amount <= 0:
        raise PaymentError("Amount must be greater than zero")
    return int(amount * 100)


def _get_user_and_equipment(cursor, user_id, equipment_id):
    cursor.execute("SELECT user_id FROM users WHERE user_id=%s", (user_id,))
    if not cursor.fetchone():
        raise PaymentError("User not found", 404)
    cursor.execute("SELECT * FROM safety_equipment WHERE id=%s", (equipment_id,))
    item = cursor.fetchone()
    if not item:
        raise PaymentError("Equipment not found", 404)
    price = item.get("price", item.get("base_price"))
    if price is None:
        raise PaymentError("Equipment price is unavailable", 500)
    return item, price


def create_payment_order(payload):
    user_id = payload.get("user_id")
    equipment_id = payload.get("equipment_id")
    quantity = payload.get("quantity", 1)
    if not isinstance(user_id, int) or isinstance(user_id, bool) or not isinstance(equipment_id, int) or isinstance(equipment_id, bool):
        raise PaymentError("user_id and equipment_id must be integers")
    if not isinstance(quantity, int) or isinstance(quantity, bool) or quantity < 1 or quantity > 20:
        raise PaymentError("quantity must be an integer between 1 and 20")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        item, unit_price = _get_user_and_equipment(cursor, user_id, equipment_id)
        amount = _amount_in_paise(Decimal(str(unit_price)) * quantity)
        receipt = "tt_" + secrets.token_hex(12)
        remote = _client().order.create({"amount": amount, "currency": "INR", "receipt": receipt, "payment_capture": 1})
        cursor.execute("""
            INSERT INTO razorpay_payments
            (razorpay_order_id, user_id, equipment_id, quantity, amount_paise, currency, status, receipt)
            VALUES (%s, %s, %s, %s, %s, 'INR', 'PENDING', %s)
        """, (remote["id"], user_id, equipment_id, quantity, amount, receipt))
        conn.commit()
        return {"key_id": Config.RAZORPAY_KEY_ID, "order_id": remote["id"], "amount": amount, "currency": "INR", "equipment_name": item.get("name")}
    except PaymentError:
        conn.rollback()
        raise
    except Exception:
        conn.rollback()
        raise PaymentError("Unable to create payment order", 502)
    finally:
        cursor.close()
        conn.close()


def verify_payment(payload):
    required = ("user_id", "razorpay_order_id", "razorpay_payment_id", "razorpay_signature")
    if any(not payload.get(key) for key in required):
        raise PaymentError("Payment verification fields are required")
    if not isinstance(payload["user_id"], int) or isinstance(payload["user_id"], bool):
        raise PaymentError("user_id must be an integer")
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM razorpay_payments WHERE razorpay_order_id=%s FOR UPDATE", (payload["razorpay_order_id"],))
        record = cursor.fetchone()
        if not record or record["user_id"] != payload["user_id"]:
            raise PaymentError("Payment order not found", 404)
        if record["status"] == "PAID":
            if record.get("razorpay_payment_id") == payload["razorpay_payment_id"]:
                return {"message": "Payment already verified", "payment_id": record["razorpay_payment_id"]}
            raise PaymentError("Payment order has already been completed", 409)
        if record["status"] != "PENDING":
            raise PaymentError("Payment order is not payable", 409)

        expected = hmac.new(
            Config.RAZORPAY_KEY_SECRET.encode(),
            f"{payload['razorpay_order_id']}|{payload['razorpay_payment_id']}".encode(),
            "sha256",
        ).hexdigest()
        if not secrets.compare_digest(expected, str(payload["razorpay_signature"])):
            raise PaymentError("Invalid payment signature", 400)

        # Signature validation proves origin, but not that the captured payment
        # matches our amount/order. Reconcile with Razorpay before marking PAID.
        payment = _client().payment.fetch(payload["razorpay_payment_id"])
        if payment.get("order_id") != payload["razorpay_order_id"]:
            raise PaymentError("Payment does not match the order", 400)
        if int(payment.get("amount", -1)) != int(record["amount_paise"]):
            raise PaymentError("Payment amount does not match the order", 400)
        if payment.get("currency", "INR") != record["currency"]:
            raise PaymentError("Payment currency does not match the order", 400)
        if payment.get("status") != "captured":
            raise PaymentError("Payment has not been captured", 409)

        cursor.execute("""
            UPDATE razorpay_payments SET razorpay_payment_id=%s, razorpay_signature=%s, status='PAID', paid_at=NOW(), updated_at=NOW()
            WHERE id=%s AND status='PENDING'
        """, (payload["razorpay_payment_id"], payload["razorpay_signature"], record["id"]))
        if cursor.rowcount != 1:
            raise PaymentError("Payment was already processed", 409)
        conn.commit()
        return {"message": "Payment verified successfully", "payment_id": payload["razorpay_payment_id"]}
    except PaymentError:
        conn.rollback()
        raise
    except Exception:
        conn.rollback()
        raise PaymentError("Unable to verify payment", 502)
    finally:
        cursor.close()
        conn.close()


def verify_webhook_signature(raw_body, signature):
    if not Config.RAZORPAY_WEBHOOK_SECRET or not signature:
        raise PaymentError("Webhook is not configured", 503)
    expected = hmac.new(Config.RAZORPAY_WEBHOOK_SECRET.encode(), raw_body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, signature):
        raise PaymentError("Invalid webhook signature", 400)


def process_webhook(payload):
    event = payload.get("event")
    payment_entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
    order_id = payment_entity.get("order_id")
    payment_id = payment_entity.get("id")
    if event not in {"payment.captured", "payment.failed"} or not order_id:
        return {"message": "Webhook acknowledged"}
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        if event == "payment.captured":
            cursor.execute("UPDATE razorpay_payments SET razorpay_payment_id=%s, status='PAID', paid_at=NOW(), updated_at=NOW() WHERE razorpay_order_id=%s AND status='PENDING'", (payment_id, order_id))
        else:
            cursor.execute("UPDATE razorpay_payments SET status='FAILED', failure_reason=%s, updated_at=NOW() WHERE razorpay_order_id=%s AND status='PENDING'", (str(payment_entity.get("error_description", "Payment failed"))[:500], order_id))
        conn.commit()
        return {"message": "Webhook processed"}
    finally:
        cursor.close()
        conn.close()


def mark_payment_failed(payload):
    if not payload.get("razorpay_order_id") or not payload.get("user_id"):
        raise PaymentError("user_id and razorpay_order_id are required")
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE razorpay_payments SET status='FAILED', failure_reason=%s, updated_at=NOW() WHERE razorpay_order_id=%s AND user_id=%s AND status='PENDING'", (str(payload.get("reason", "Payment failed"))[:500], payload["razorpay_order_id"], payload["user_id"]))
        if cursor.rowcount == 0:
            raise PaymentError("Payment order not found", 404)
        conn.commit()
        return {"message": "Payment marked as failed"}
    finally:
        cursor.close()
        conn.close()
