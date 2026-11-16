
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

from database import initialize_database, get_db_connection
from ml.predict import predict_complaint

app = Flask(__name__)

app.config["SECRET_KEY"] = "campusfix-development-secret-change-later"
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

CORS(app, supports_credentials=True)

initialize_database()


def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return None

    connection = get_db_connection()
    user = connection.execute(
        "SELECT id, name, email, role FROM users WHERE id = ?",
        (user_id,)
    ).fetchone()
    connection.close()

    return user


@app.route("/")
def home():
    return jsonify({
        "message": "Welcome to CampusFix API",
        "status": "Running"
    })


@app.route("/api/health")
def health():
    return jsonify({
        "backend": "Connected",
        "database": "Initialized"
    })


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    if len(password) < 8:
        return jsonify({
            "error": "Password must contain at least 8 characters"
        }), 400

    connection = get_db_connection()

    try:
        connection.execute("""
            INSERT INTO users (name, email, password, role)
            VALUES (?, ?, ?, 'student')
        """, (
            name,
            email,
            generate_password_hash(password)
        ))

        connection.commit()

        return jsonify({
            "message": "Registration successful"
        }), 201

    except Exception as error:
        if "UNIQUE constraint failed" in str(error):
            return jsonify({"error": "Email already registered"}), 409

        return jsonify({"error": "Registration failed"}), 500

    finally:
        connection.close()


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    connection = get_db_connection()

    user = connection.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    ).fetchone()

    connection.close()

    if user is None or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    session.clear()
    session["user_id"] = user["id"]

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    })


@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()

    return jsonify({"message": "Logged out successfully"})


@app.route("/api/me")
def me():
    user = get_current_user()

    if user is None:
        return jsonify({"error": "Please login"}), 401

    return jsonify(dict(user))


@app.route("/api/complaints", methods=["POST"])
def create_complaint():
    user = get_current_user()

    if user is None:
        return jsonify({"error": "Please login"}), 401

    data = request.get_json(silent=True) or {}

    title = data.get("title", "").strip()
    description = data.get("description", "").strip()

    if not title or not description:
        return jsonify({
            "error": "Title and description are required"
        }), 400

    prediction = predict_complaint(description)

    connection = get_db_connection()

    cursor = connection.execute("""
        INSERT INTO complaints (
            user_id, title, description,
            category, priority, department
        )
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        user["id"],
        title,
        description,
        prediction["category"],
        prediction["priority"],
        prediction["department"]
    ))

    connection.commit()
    complaint_id = cursor.lastrowid
    connection.close()

    return jsonify({
        "message": "Complaint submitted successfully",
        "complaint_id": complaint_id,
        "prediction": prediction
    }), 201


@app.route("/api/complaints", methods=["GET"])
def get_my_complaints():
    user = get_current_user()

    if user is None:
        return jsonify({"error": "Please login"}), 401

    connection = get_db_connection()

    complaints = connection.execute("""
        SELECT * FROM complaints
        WHERE user_id = ?
        ORDER BY created_at DESC
    """, (user["id"],)).fetchall()

    connection.close()

    return jsonify([dict(item) for item in complaints])


@app.route("/api/admin/complaints", methods=["GET"])
def get_all_complaints():
    user = get_current_user()

    if user is None or user["role"] != "admin":
        return jsonify({"error": "Admin access required"}), 403

    connection = get_db_connection()

    complaints = connection.execute("""
        SELECT complaints.*, users.name AS student_name,
               users.email AS student_email
        FROM complaints
        JOIN users ON complaints.user_id = users.id
        ORDER BY complaints.created_at DESC
    """).fetchall()

    connection.close()

    return jsonify([dict(item) for item in complaints])


@app.route("/api/admin/complaints/<int:complaint_id>", methods=["PATCH"])
def update_complaint(complaint_id):
    user = get_current_user()

    if user is None or user["role"] != "admin":
        return jsonify({"error": "Admin access required"}), 403

    data = request.get_json(silent=True) or {}
    status = data.get("status", "")

    allowed_statuses = ["Pending", "In Progress", "Resolved"]

    if status not in allowed_statuses:
        return jsonify({"error": "Invalid complaint status"}), 400

    connection = get_db_connection()

    cursor = connection.execute("""
        UPDATE complaints
        SET status = ?
        WHERE id = ?
    """, (status, complaint_id))

    connection.commit()
    updated = cursor.rowcount
    connection.close()

    if updated == 0:
        return jsonify({"error": "Complaint not found"}), 404

    return jsonify({"message": "Complaint status updated"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
