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
        return jsonify({"success":True,"user":user})
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

if __name__ == "__main__":
    app.run(host="0.0.0.0",debug=True)