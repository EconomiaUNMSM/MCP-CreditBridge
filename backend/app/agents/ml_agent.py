from typing import Dict, TypedDict, Optional, List, Any
from app.models.predictor import Predictor
from app.models.feature_store import transform_features_to_vector
from app.api.schemas import CoreMCPFeatures, V2ExtendedFeatures

class MLOutput(TypedDict):
    probability: Optional[float]
    model_version: str
    ml_explanation: List[Dict[str, Any]]

class MLAgent:
    """
    Agent responsible for loading the V2 ML model (RandomForest) with Explainability.
    It uses a singleton pattern for the Predictor.
    """
    _predictor = None

    def __init__(self):
        if MLAgent._predictor is None:
            MLAgent._predictor = Predictor()

    def run(
        self, 
        core_features: CoreMCPFeatures, 
        v2_features: Optional[V2ExtendedFeatures] = None
    ) -> MLOutput:
        
        # 1. Feature Transformation (Raw schemas -> Numerical Vector)
        vector = transform_features_to_vector(core_features, v2_features)
        
        # 2. Prediction with Explanation (SHAP)
        result = MLAgent._predictor.predict_with_explanation(vector)

        # 3. Return Structured
        return {
            "probability": result["probability"],
            "model_version": result["model_version"],
            "ml_explanation": result["top_features"]
        }
