import datetime
from database import get_db_connection


def get_user_id_by_username(username):
    """Get user_id from username."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT user_id FROM users WHERE username = %s", (username,))
        result = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        return result["user_id"] if result else None
    except Exception as e:
        print(f"Error getting user_id: {e}")
        return None


def fetch_guides(username=None):
    """
    Fetch all guides with their average rating.
    If username is provided, also returns whether the current user
    has an active booking for each guide (booked_by_user flag).
    """
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if username:
        # Use a grouped subquery so a guide appears only once even if multiple booking rows exist
        cursor.execute("""
            SELECT
                g.g_id,
                g.name,
                g.languages,
                g.status,
                COALESCE(ROUND(g.rating, 1), 0.0) AS rating,
                CASE WHEN ub.guide_id IS NOT NULL THEN TRUE ELSE FALSE END AS booked_by_user
            FROM guide g
            LEFT JOIN (
                SELECT guide_id
                FROM guide_bookings
                WHERE username = %s
                  AND (LOWER(status) = 'booked' OR LOWER(status) = 'confirmed')
                GROUP BY guide_id
            ) ub ON ub.guide_id = g.g_id
        """, (username,))
    else:
        cursor.execute("""
            SELECT
                g_id,
                name,
                languages,
                status,
                COALESCE(ROUND(rating, 1), 0.0) AS rating,
                FALSE AS booked_by_user
            FROM guide
        """)

    guides = cursor.fetchall()
    # Convert bit/boolean field to Python bool for JSON serialisation
    for g in guides:
        g["booked_by_user"] = bool(g["booked_by_user"])

        # Normalize status text for frontend consistency
        raw_status = (g.get("status") or "").strip().lower()
        if raw_status in ("available", "avail", "open"):
            g["status"] = "Available"
        elif "busy" in raw_status:
            g["status"] = "Busy"
        elif raw_status in ("booked", "confirmed"):
            g["status"] = "Booked"
        elif raw_status in ("not available", "not_available", "notavailable"):
            g["status"] = "Not Available"
        else:
            # Default to showing original with capitalized words
            g["status"] = g.get("status") and str(g.get("status")).title() or "Unknown"

        # Ensure rating is a numeric value (float)
        try:
            g["rating"] = float(g.get("rating") or 0.0)
        except Exception:
            g["rating"] = 0.0

    cursor.close()
    conn.close()
    return guides


def submit_guide_rating(data):
    """
    Insert or update a user's rating for a guide, then recalculate and
    persist the average so fetch_guides always returns the current average.
    """
    guide_id = data["guide_id"]
    username = data["username"]
    rating   = data["rating"]

    conn   = get_db_connection()
    cursor = conn.cursor()

    # Upsert the individual rating row
    cursor.execute("""
        INSERT INTO guide_ratings (username, guide_id, rating)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE rating = %s
    """, (username, guide_id, rating, rating))

    # Recalculate average and persist it on the guide row
    cursor.execute("""
        UPDATE guide
        SET rating = (
            SELECT AVG(rating)
            FROM guide_ratings
            WHERE guide_id = %s
        )
        WHERE g_id = %s
    """, (guide_id, guide_id))

    conn.commit()
    cursor.close()
    conn.close()


def create_guide_booking(data):
    """
    Create a booking record and flip the guide's status to 'Booked'.
    If the user already has an active booking for this guide, this becomes a no-op.
    Raises an exception if the guide is not available.
    
    Returns:
        int: The booking ID, or None if already booked
    """
    username     = data.get("username")
    guide_id     = data.get("guide_id")
    booking_date = data.get("booking_date") or datetime.date.today().strftime("%Y-%m-%d")
    status       = "Booked"

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # If the user already has an active booking for this guide, do nothing
    cursor.execute("""
        SELECT id
        FROM guide_bookings
        WHERE username = %s AND guide_id = %s AND (LOWER(status) = 'booked' OR LOWER(status) = 'confirmed')
        LIMIT 1
    """, (username, guide_id))
    existing_booking = cursor.fetchone()
    if existing_booking:
        cursor.close()
        conn.close()
        return None

    # Check current guide status before booking (case-insensitive)
    cursor.execute("SELECT status FROM guide WHERE g_id = %s", (guide_id,))
    guide = cursor.fetchone()
    if not guide:
        cursor.close()
        conn.close()
        raise ValueError("Guide not found")

    current_status = (guide.get("status") or "").strip().lower()
    if current_status != "available":
        cursor.close()
        conn.close()
        raise ValueError(f"Guide is not available (current status: {guide.get('status')})")

    # Insert the booking record
    cursor.execute("""
        INSERT INTO guide_bookings (username, guide_id, booking_date, status)
        VALUES (%s, %s, %s, %s)
    """, (username, guide_id, booking_date, status))

    booking_id = cursor.lastrowid

    # Update the guide's public status to "Booked"
    cursor.execute("""
        UPDATE guide
        SET status = 'Booked'
        WHERE g_id = %s
    """, (guide_id,))

    conn.commit()
    cursor.close()
    conn.close()
    
    return booking_id


def cancel_guide_booking(data):
    """
    Cancel a user's booking for a guide and set guide status back to 'Available'.
    Only cancels if this user actually has an active booking for this guide.
    """
    username = data.get("username")
    guide_id = data.get("guide_id")

    conn   = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Verify the booking exists and belongs to this user
    cursor.execute("""
        SELECT id FROM guide_bookings
        WHERE username = %s AND guide_id = %s AND (LOWER(status) = 'booked' OR LOWER(status) = 'confirmed')
        LIMIT 1
    """, (username, guide_id))
    booking = cursor.fetchone()

    if not booking:
        cursor.close()
        conn.close()
        raise ValueError("No active booking found for this guide by this user")

    # Mark booking as cancelled
    cursor.execute("""
        UPDATE guide_bookings
        SET status = 'Cancelled'
        WHERE username = %s AND guide_id = %s AND (LOWER(status) = 'booked' OR LOWER(status) = 'confirmed')
    """, (username, guide_id))

    # Check if any other active bookings exist for this guide
    cursor.execute("""
        SELECT COUNT(*) AS cnt
        FROM guide_bookings
        WHERE guide_id = %s AND status = 'Booked'
    """, (guide_id,))
    remaining = cursor.fetchone()["cnt"]

    # Only set guide back to Available if no other active bookings
    if remaining == 0:
        cursor.execute("""
            UPDATE guide
            SET status = 'Available'
            WHERE g_id = %s
        """, (guide_id,))

    conn.commit()
    cursor.close()
    conn.close()
