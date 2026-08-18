# TrustTrip Backend

## Razorpay Safety Equipment API

Configure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in the backend environment. Never expose the secret to the frontend or commit credentials.

### Create payment order

`POST /payments/razorpay/order`

```json
{"user_id": 1, "equipment_id": 2, "quantity": 1}
```

The backend validates the user and equipment, calculates the amount from the database, creates a Razorpay INR order, and stores a `PENDING` record. The response contains `key_id`, `order_id`, `amount` in paise, and `currency`. Keep `RAZORPAY_MODE=test` until Test Mode validation is complete; never put `RAZORPAY_KEY_SECRET` in the frontend.

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

### Webhook

Configure Razorpay to call `POST /payments/razorpay/webhook` and set `RAZORPAY_WEBHOOK_SECRET`. The endpoint verifies `X-Razorpay-Signature` against the raw request body and reconciles `payment.captured` and `payment.failed` events without logging payloads.

### Production checklist

- Run `db_init.py` with a least-privilege MySQL account and review the schema before production use.
- Serve Flask with a WSGI server behind HTTPS; set `TRUST_PROXY=true` only behind a trusted proxy.
- Use `ENVIRONMENT=production`, `DEBUG=false`, `RAZORPAY_MODE=live`, and live credentials only after Test Mode sign-off.
- Configure webhook retries, monitoring, database backups, and a rollback plan. Never log keys, signatures, payment payloads, or full request bodies.

Run `ensure_tables()` from `db_init.py` once against the configured MySQL database before using these endpoints. Existing `/place-order` behavior remains unchanged for current clients.
