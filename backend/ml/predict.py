
import os
import joblib

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "models")

category_model = joblib.load(
    os.path.join(MODEL_DIR, "category_model.pkl")
)

priority_model = joblib.load(
    os.path.join(MODEL_DIR, "priority_model.pkl")
)

departments = {
    "Classroom Equipment": "Academic Maintenance",
    "Hostel": "Hostel Management",
    "Network": "IT Department",
    "Library": "Library Management",
    "Sanitation": "Housekeeping",
    "Electrical": "Electrical Maintenance",
    "Water Supply": "Water Management"
}

def predict_complaint(description):
    category = category_model.predict([description])[0]
    priority = priority_model.predict([description])[0]

    department = departments.get(category, "General Administration")

    return {
        "category": category,
        "priority": priority,
        "department": department
    }
