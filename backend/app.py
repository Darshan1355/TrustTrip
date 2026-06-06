from flask import Flask, request, jsonify
from database import get_db_connection
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route("/register", methods=["POST"])
def register():

    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO users
    (username,password,name,mob,address,nationality,emergency_contact)
    VALUES (%s,%s,%s,%s,%s,%s,%s)
    """,(
        data["username"],
        data["password"],
        data["name"],
        data["mob"],     # FIXED
        data["address"],
        data["nationality"],
        data["emergency_contact"]
    ))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"success": True})


# LOGIN
@app.route("/login", methods=["POST"])
def login():

    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
    SELECT * FROM users
    WHERE username=%s AND password=%s
    """,(data["username"],data["password"]))

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user:
       return jsonify({
       "success": True,
        "user": {
           "id": user["user_id"],          # ✅ REQUIRED
            "username": user["username"]
        }
    })
    else:
        return jsonify({"success":False})


@app.route("/profile/<username>", methods=["GET"])
def get_profile(username):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    return user


@app.route("/profile/<username>", methods=["PUT"])
def update_user_profile(username):

    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE users
        SET name=%s, mob=%s, address=%s, nationality=%s, emergency_contact=%s
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

    return {"message": "Profile updated successfully"}

from flask import Flask, request, jsonify
from database import get_db_connection

@app.route('/complaint', methods=['POST'])
def add_complaint():
    data = request.json

    username = data.get("username")
    category = data.get("category")
    description = data.get("description")
    latitude = data.get("latitude")
    longitude = data.get("longitude")

    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO complaints (username, category, description, latitude, longitude)
        VALUES (%s, %s, %s, %s, %s)
    """

    cursor.execute(query, (username, category, description, latitude, longitude))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Complaint stored successfully"})

@app.route("/user-complaints/<username>", methods=["GET"])
def get_user_complaints(username):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT id, category, description, latitude, longitude, status, created_at
        FROM complaints
        WHERE username = %s
        ORDER BY created_at DESC
    """

    cursor.execute(query, (username,))
    complaints = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(complaints)

@app.route("/guides", methods=["GET"])
def get_guides():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT g_id, name, languages, status, profile_photo, rating
        FROM guide
    """

    cursor.execute(query)
    guides = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(guides)

@app.route("/rate-guide", methods=["POST"])
def rate_guide():

    data = request.json
    guide_id = data["guide_id"]
    username = data["username"]
    rating = data["rating"]

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO guide_ratings (username, guide_id, rating)
        VALUES (%s,%s,%s)
        ON DUPLICATE KEY UPDATE rating=%s
    """,(username,guide_id,rating,rating))

    cursor.execute("""
        UPDATE guide
        SET rating = (
            SELECT AVG(rating)
            FROM guide_ratings
            WHERE guide_id=%s
        )
        WHERE g_id=%s
    """,(guide_id,guide_id))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message":"Rating submitted"})

@app.route("/prices", methods=["GET"])
def get_prices():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id, name, base_price FROM price_items")

    prices = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(prices)    

@app.route("/place-order", methods=["POST"])
def place_order():

    data = request.json
    print("DATA RECEIVED:", data)   # 🔍 DEBUG

    # ✅ VALIDATION
    if not data:
        return jsonify({"error": "No data received"}), 400

    if "user_id" not in data:
        return jsonify({"error": "user_id missing"}), 400

    if "equipment_id" not in data:
        return jsonify({"error": "equipment_id missing"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO equipment_orders 
            (user_id, equipment_id, quantity, total_price, latitude, longitude)
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

        return jsonify({"message": "Order placed successfully"})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": "Database error"}), 500

@app.route("/user-orders/<int:user_id>", methods=["GET"])
def get_user_orders(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT eo.id, eo.quantity, eo.total_price, eo.status, eo.created_at,
               se.name, se.image
        FROM equipment_orders eo
        JOIN safety_equipment se ON eo.equipment_id = se.id
        WHERE eo.user_id = %s
        ORDER BY eo.created_at DESC
    """

    cursor.execute(query, (user_id,))
    orders = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(orders)

@app.route("/equipment", methods=["GET"])
def get_all_equipment():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM safety_equipment")
    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(data)

@app.route("/equipment/<int:id>", methods=["GET"])
def get_equipment_by_id(id):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM safety_equipment WHERE id=%s", (id,))
    item = cursor.fetchone()

    cursor.close()
    conn.close()

    if item:
        return jsonify(item)
    else:
        return jsonify({"error": "Not found"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0",debug=True)