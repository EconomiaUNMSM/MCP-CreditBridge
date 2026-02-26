import os
import pickle
import json
import numpy as np
import shap
from typing import List, Optional, Any, Dict
from pathlib import Path
from app.models.feature_store import get_feature_names

MODEL_DIR = Path(__file__).parent / "artifacts"
MODEL_PATH = MODEL_DIR / "model_v2.pkl"
METADATA_PATH = MODEL_DIR / "model_metadata.json"

class Predictor:
    """
    Robust ML Predictor with SHAP Local Explainability.
    Handles missing models gracefully and provides feature-level insights.
    """
    def __init__(self):
        self.model = None
        self.explainer = None
        self.model_metadata = {}
        self._load_model()

    def _load_model(self):
        """Attempts to load the model artifact, metadata, and initializes SHAP explainer."""
        if not MODEL_PATH.exists():
            print(f"⚠️ [Predictor] No model found at {MODEL_PATH}. Mode: Heuristic/Fallback.")
            return

        try:
            with open(MODEL_PATH, "rb") as f:
                self.model = pickle.load(f)
            
            if METADATA_PATH.exists():
                with open(METADATA_PATH, "r") as f:
                    self.model_metadata = json.load(f)
            
            # Initialize SHAP Explainer (TreeExplainer for RandomForest)
            # We pass model.predict_proba to make it model-agnostic if needed, 
            # but TreeExplainer is best for trees.
            try:
                self.explainer = shap.TreeExplainer(self.model)
                print("✅ [Predictor] SHAP Explainer initialized.")
            except Exception as e:
                print(f"⚠️ [Predictor] Failed to init SHAP: {e}")
                self.explainer = None
            
            print(f"✅ [Predictor] Loaded Model V2. Version: {self.model_metadata.get('model_version', 'unknown')}")

        except Exception as e:
            print(f"❌ [Predictor] Failed to load model: {e}")
            self.model = None

    def predict_with_explanation(self, feature_vector: List[float]) -> Dict[str, Any]:
        """
        Returns structured prediction with local explainability.
        Structure:
        {
            "probability": float | None,
            "top_features": [{"feature": str, "impact": float}, ...],
            "model_version": str
        }
        """
        if self.model is None:
            return {
                "probability": None,
                "top_features": [],
                "model_version": "not_trained"
            }

        try:
            # 1. Prediction (Probability of Class 1: Repayment/Success)
            probs = self.model.predict_proba([feature_vector])
            success_prob = float(probs[0][1])
            version = self.model_metadata.get("model_version", "v2_legacy")

            # 2. SHAP Explanation
            top_features = []
            if self.explainer:
                # shap_values[0] is for class 0, shap_values[1] is for class 1
                shap_values = self.explainer.shap_values(np.array([feature_vector]))
                
                # Robust extraction for binary classification
                if isinstance(shap_values, list):
                    # Case 1: List of arrays [class_0, class_1]
                    # We want class 1 (Success/Repayment)
                    if len(shap_values) > 1:
                        class_1_shap = shap_values[1]
                    else:
                        class_1_shap = shap_values[0]
                else:
                    # Case 2: Single array (e.g. older versions or regression)
                    class_1_shap = shap_values

                # Ensure we have a 1D vector for the single sample
                if len(class_1_shap.shape) > 1:
                     class_1_shap = class_1_shap[0]


                feature_names = get_feature_names()
                
                # Ensure class_1_shap is a flat 1D numpy array
                class_1_shap = np.asarray(class_1_shap).flatten()
                
                # Create (feature, impact) pairs
                impacts = []
                for i, name in enumerate(feature_names):
                    impact_value = class_1_shap[i]
                    impacts.append({"feature": name, "impact": round(float(impact_value), 4)})
                
                # Sort by absolute impact (magnitude of contribution)
                impacts.sort(key=lambda x: abs(x["impact"]), reverse=True)
                top_features = impacts[:5] # Top 5 drivers

            return {
                "probability": round(success_prob, 4),
                "top_features": top_features,
                "model_version": version
            }

        except Exception as e:
            print(f"❌ [Predictor] Inference Error: {e}")
            return {
                "probability": None, 
                "top_features": [], 
                "model_version": "inference_error"
            }
