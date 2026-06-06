from database import get_db_connection

def create_complaint(data):

    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO complaints
        (username, category, description, latitude, longitude)
        VALUES (%s, %s, %s, %s, %s)
    """

    cursor.execute(query, (
        data.get("username"),
        data.get("category"),
        data.get("description"),
        data.get("latitude"),
        data.get("longitude")
    ))

    conn.commit()

    cursor.close()
    conn.close()


def get_complaints(username):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT id, category, description,
               latitude, longitude,
               status, created_at
        FROM complaints
        WHERE username = %s
        ORDER BY created_at DESC
    """

    cursor.execute(query, (username,))

    complaints = cursor.fetchall()

    cursor.close()
    conn.close()

    return complaints