import pandas as pd
import joblib
from pathlib import Path

from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "data_R.csv"
MODEL_PATH = BASE_DIR / "models" / "intent_model.pkl"

df = pd.read_csv(DATA_PATH, encoding="utf-8")

X = df["text"]
y = df["label"]

pipeline = Pipeline([
    (
        "tfidf",
        TfidfVectorizer(
            lowercase=True,
            ngram_range=(1, 2),
            max_features=5000
        )
    ),
    (
        "clf",
        LogisticRegression(
            max_iter=2000,
            class_weight="balanced"
        )
    )
])

pipeline.fit(X, y)

joblib.dump(pipeline, MODEL_PATH)

print("Model saved to:", MODEL_PATH)