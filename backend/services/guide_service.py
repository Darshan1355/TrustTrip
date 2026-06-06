from database import get_db_connection

def fetch_guides():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT g_id,
               name,
               languages,
               status,
               profile_photo,
               rating
        FROM guide
    """

    cursor.execute(query)

    guides = cursor.fetchall()

    cursor.close()
    conn.close()

    return guides


def submit_guide_rating(data):

    guide_id = data["guide_id"]
    username = data["username"]
    rating = data["rating"]

    conn = get_db_connection()
    cursor = conn.cursor()

    # Insert or update rating
    cursor.execute("""
        INSERT INTO guide_ratings
        (username, guide_id, rating)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE rating=%s
    """, (
        username,
        guide_id,
        rating,
        rating
    ))

    # Update average rating
    cursor.execute("""
        UPDATE guide
        SET rating = (
            SELECT AVG(rating)
            FROM guide_ratings
            WHERE guide_id=%s
        )
        WHERE g_id=%s
    """, (
        guide_id,
        guide_id
    ))

    conn.commit()

    cursor.close()
    conn.close()