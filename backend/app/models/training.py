import json
import pickle
import os
import sys
import pandas as pd
import numpy as np
from datetime import datetime
from pathlib import Path

# Add the backend folder to sys.path to fix ModuleNotFoundError
backend_path = str(Path(__file__).parent.parent.parent)
if backend_path not in sys.path:
    sys.path.append(backend_path)

from sqlalchemy.orm import Session
from app.database import crud
from app.database.base import SessionLocal
from app.models.feature_store import get_feature_names

# Try importing sklearn
try:
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import roc_auc_score, f1_score, confusion_matrix
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

# Paths
BASE_DIR = Path(__file__).parent.parent.parent
MODEL_DIR = Path(__file__).parent / "artifacts"
MODEL_PATH = MODEL_DIR / "model_v2.pkl"
METADATA_PATH = MODEL_DIR / "model_metadata.json"
SYNTHETIC_DATA_PATH = BASE_DIR / "data" / "synthetic_training.csv"

def train_model():
    """
    Orchestrates the training pipeline:
    1. Load Data (Synthetic CSV or DB)
    2. Train Model (RandomForest)
    3. Evaluate (AUC, F1, Confusion Matrix, Feature Importance)
    4. Save Artifacts
    """
    if not SKLEARN_AVAILABLE:
        print("❌ Scikit-learn not available. Skipping training.")
        return

    X, y = [], []
    source = ""

    # 1. LOAD DATA
    if SYNTHETIC_DATA_PATH.exists():
        print(f"📂 Loading synthetic data from {SYNTHETIC_DATA_PATH}...")
        df = pd.read_csv(SYNTHETIC_DATA_PATH)
        feature_names = get_feature_names()
        
        # Ensure only 17 model features are used
        X = df[feature_names].values
        # Target: Recalculate binary flag from repayment behavior for consistency
        # or use the provided flag. Let's use target_default_flag (but invert logic: 0=default, 1=success)
        # We want probability of success. So y=1 means NO default.
        y = (df["target_default_flag"] == 0).astype(int).values
        source = "synthetic_csv"
    else:
        print("🔍 No synthetic data found. Attempting to fetch from DB...")
        db: Session = SessionLocal()
        try:
            records = crud.get_training_dataset(db, min_age_months=0) # Relaxed for testing
            if len(records) < 50:
                print(f"⚠️ Insufficient data. Found {len(records)} records. Need 50+.")
                return
            X = [rec.feature_vector for rec in records]
            y = [1 if rec.target_repayment_behavior_6m > 0.8 else 0 for rec in records]
            source = "database"
        finally:
            db.close()

    print(f"📊 Training on {len(X)} records [{source}]...")

    # 2. SPLIT & TRAIN
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    clf = RandomForestClassifier(n_estimators=100, max_depth=7, random_state=42)
    clf.fit(X_train, y_train)

    # 3. EVALUATE
    y_pred = clf.predict(X_test)
    y_prob = clf.predict_proba(X_test)[:, 1]

    auc = roc_auc_score(y_test, y_prob)
    f1 = f1_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)

    print("\n" + "="*40)
    print("📈 TRAINING RESULTS")
    print("="*40)
    print(f"✅ AUC: {auc:.4f}")
    print(f"✅ F1-Score: {f1:.4f}")
    print(f"✅ Confusion Matrix:\n{cm}")

    # Feature Importance
    print("\n🔥 Feature Importance (Top 5):")
    importances = clf.feature_importances_
    names = get_feature_names()
    feat_importances = sorted(zip(names, importances), key=lambda x: x[1], reverse=True)
    for name, val in feat_importances[:5]:
        print(f"   -> {name}: {val:.4f}")

    # 4. SAVE ARTIFACTS
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(clf, f)

    metadata = {
        "model_version": f"mcp_rf_v{datetime.now().strftime('%Y%m%d')}",
        "training_date": datetime.now().isoformat(),
        "source": source,
        "metrics": {
            "auc": round(auc, 4),
            "f1": round(f1, 4),
            "n_samples": len(X)
        },
        "features": names
    }
    
    with open(METADATA_PATH, "w") as f:
        json.dump(metadata, f, indent=2)

    print("\n💾 Model & Metadata saved to app/models/artifacts/")
    print("="*40)

if __name__ == "__main__":
    train_model()
