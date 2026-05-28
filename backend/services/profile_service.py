from database import get_db_connection

def get_profile_data(username):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM users WHERE username=%s",
        (username,)
    )

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    return user


def update_profile(username, data):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE users
        SET name=%s,
            mob=%s,
            address=%s,
            nationality=%s,
            emergency_contact=%s
        WHERE username=%s
    """, (
        data["name"],
        data["mob"],
        data["address"],
        data["nationality"],
        data["emergency_contact"],
        username
    ))

    conn.commit()

    cursor.close()
    conn.close()