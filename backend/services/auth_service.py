from database import get_db_connection

def register_user(data):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO users
        (username,password,name,mob,address,nationality,emergency_contact)
        VALUES (%s,%s,%s,%s,%s,%s,%s)
    """, (
        data["username"],
        data["password"],
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

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM users
        WHERE username=%s AND password=%s
    """, (
        data["username"],
        data["password"]
    ))

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    return user