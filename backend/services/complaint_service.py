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

def create_complaint(data):
    """
    Create a new complaint and return the complaint ID.
    
    Args:
        data: Dictionary with username, category, description, latitude, longitude
        
    Returns:
        int: The complaint ID
    """
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

    complaint_id = cursor.lastrowid
    conn.commit()

    cursor.close()
    conn.close()
    
    return complaint_id


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