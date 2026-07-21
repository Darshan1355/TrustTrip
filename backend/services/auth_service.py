# auth_service.py

from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db_connection


def _verify_password(stored_password, candidate_password):
    """Verify a password, supporting both hashed and legacy plaintext values."""
    if not stored_password or not candidate_password:
        return False

    if not stored_password:
        return False

    # New hashes from Werkzeug are prefixed with the algorithm and parameters.
    if stored_password.startswith("pbkdf2:sha256") or stored_password.startswith("scrypt"):
        try:
            return check_password_hash(stored_password, candidate_password)
        except ValueError:
            return False

    return stored_password == candidate_password


def register_user(data):
    """Hashes the user's password and stores it in the database."""
    hashed_password = generate_password_hash(data["password"])

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO users
        (username, password, name, mob, address, nationality, emergency_contact)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (
        data["username"],
        hashed_password,
        data["name"],
        data["mob"],
        data["address"],
        data["nationality"],
        data["emergency_contact"]
    ))

    conn.commit()
    cursor.close()
    conn.close()


def login_user(data):
    """Fetches user by username and verifies the supplied password."""
    if not data:
        return None

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return None

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM users
        WHERE username = %s
    """, (username,))

    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user and _verify_password(user.get("password"), password):
        return user

    return None