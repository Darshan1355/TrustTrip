from database import get_db_connection


def fetch_prices():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id,
               name,
               base_price
        FROM price_items
    """)

    prices = cursor.fetchall()

    cursor.close()
    conn.close()

    return prices


def create_order(data):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO equipment_orders
        (
            user_id,
            equipment_id,
            quantity,
            total_price,
            latitude,
            longitude
        )
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        data["user_id"],
        data["equipment_id"],
        data.get("quantity", 1),
        data.get("total_price", 0),
        data.get("latitude"),
        data.get("longitude")
    ))

    conn.commit()

    cursor.close()
    conn.close()


def fetch_user_orders(user_id):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT eo.id,
               eo.quantity,
               eo.total_price,
               eo.status,
               eo.created_at,
               se.name,
               se.image
        FROM equipment_orders eo
        JOIN safety_equipment se
        ON eo.equipment_id = se.id
        WHERE eo.user_id = %s
        ORDER BY eo.created_at DESC
    """

    cursor.execute(query, (user_id,))

    orders = cursor.fetchall()

    cursor.close()
    conn.close()

    return orders


def fetch_all_equipment():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM safety_equipment
    """)

    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data


def fetch_equipment_by_id(id):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM safety_equipment
        WHERE id=%s
    """, (id,))

    item = cursor.fetchone()

    cursor.close()
    conn.close()

    return item