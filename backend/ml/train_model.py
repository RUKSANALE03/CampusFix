
import os
import joblib
import pandas as pd

from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

data = [
    ("Projector is not working in classroom", "Classroom Equipment", "High"),
    ("Classroom computer is damaged", "Classroom Equipment", "Medium"),
    ("Blackboard is broken", "Classroom Equipment", "Low"),
    ("Smart board is not working", "Classroom Equipment", "Medium"),
    ("Classroom benches are damaged", "Classroom Equipment", "Medium"),

    ("Hostel room fan is not working", "Hostel", "Medium"),
    ("Hostel room has a broken door", "Hostel", "Medium"),
    ("Hostel students have no proper beds", "Hostel", "Medium"),
    ("Hostel room electricity problem", "Hostel", "High"),
    ("Hostel bathroom needs repair", "Hostel", "High"),

    ("College WiFi is not connecting", "Network", "Medium"),
    ("Internet connection is very slow", "Network", "Low"),
    ("Computer lab network is disconnected", "Network", "High"),
    ("Campus internet is unavailable", "Network", "High"),
    ("WiFi router is not working", "Network", "Medium"),

    ("Library computer is not working", "Library", "Medium"),
    ("Library books are missing", "Library", "Low"),
    ("Library lights are not working", "Library", "Medium"),
    ("Library reading room needs repair", "Library", "Low"),
    ("Library computer has a technical issue", "Library", "Medium"),

    ("College washroom is very dirty", "Sanitation", "High"),
    ("Dustbins are overflowing", "Sanitation", "Medium"),
    ("Campus garbage is not collected", "Sanitation", "Medium"),
    ("Classroom needs cleaning", "Sanitation", "Low"),
    ("College campus has a bad smell", "Sanitation", "Medium"),

    ("Electricity supply is unavailable", "Electrical", "High"),
    ("Classroom lights are not working", "Electrical", "Medium"),
    ("Exposed electrical wiring in laboratory", "Electrical", "High"),
    ("College power connection is faulty", "Electrical", "High"),
    ("Corridor lights are damaged", "Electrical", "Medium"),

    ("No water supply in college", "Water Supply", "High"),
    ("Hostel drinking water is unavailable", "Water Supply", "High"),
    ("Water tap is leaking", "Water Supply", "Medium"),
    ("Water cooler is not working", "Water Supply", "Medium"),
    ("Drinking water filter needs repair", "Water Supply", "Medium")
]

df = pd.DataFrame(
    data,
    columns=["description", "category", "priority"]
)

category_model = Pipeline([
    ("tfidf", TfidfVectorizer(ngram_range=(1, 2))),
    ("classifier", LogisticRegression(max_iter=1000))
])

priority_model = Pipeline([
    ("tfidf", TfidfVectorizer(ngram_range=(1, 2))),
    ("classifier", LogisticRegression(max_iter=1000))
])

category_model.fit(df["description"], df["category"])
priority_model.fit(df["description"], df["priority"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(MODEL_DIR, exist_ok=True)

joblib.dump(
    category_model,
    os.path.join(MODEL_DIR, "category_model.pkl")
)

joblib.dump(
    priority_model,
    os.path.join(MODEL_DIR, "priority_model.pkl")
)

print("Category model trained successfully!")
print("Priority model trained successfully!")
print("Both models saved inside the models folder.")
