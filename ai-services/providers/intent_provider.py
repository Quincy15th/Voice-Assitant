import os
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "..",
    "models",
    "intent_model.pkl"
)

model = joblib.load(MODEL_PATH)

def predict_intent(text):
    prediction = model.predict([text])

    return prediction[0]