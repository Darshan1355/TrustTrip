# TrustTrip Backend

## Razorpay Safety Equipment API

Configure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in the backend environment. Never expose the secret to the frontend or commit credentials.

### Create payment order

`POST /payments/razorpay/order`

```json
{"user_id": 1, "equipment_id": 2, "quantity": 1}
```

The backend validates the user and equipment, calculates the amount from the database, creates a Razorpay INR order, and stores a `PENDING` record. The response contains `key_id`, `order_id`, `amount` in paise, and `currency`.

### Verify payment

`POST /payments/razorpay/verify`

```json
{"user_id": 1, "razorpay_order_id": "order_x", "razorpay_payment_id": "pay_x", "razorpay_signature": "signature"}
```

The backend verifies the signature with the secret and marks the payment `PAID`. Repeating the same successful request is idempotent.

### Record failure

`POST /payments/razorpay/failure`

```json
{"user_id": 1, "razorpay_order_id": "order_x", "reason": "User cancelled checkout"}
```

This marks a pending payment as `FAILED`; it never marks an order as paid.

Run `ensure_tables()` from `db_init.py` once against the configured MySQL database before using these endpoints. Existing `/place-order` behavior remains unchanged for current clients.
