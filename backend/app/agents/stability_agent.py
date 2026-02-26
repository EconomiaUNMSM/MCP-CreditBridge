from typing import Dict, TypedDict
from app.scoring.inclusion_index import compute_stability_score

class StabilityOutput(TypedDict):
    stability_score: float
    formula_version: str

class StabilityAgent:
    """
    Agent responsible for calculating the cross-dimensional stability score.
    It relies on normalized inputs from Economic and Integration agents.
    """

    def run(self, economic_features: Dict[str, float], integration_features: Dict[str, float]) -> StabilityOutput:
        # Extract specific features required for stability calculation
        # Stability uses: stability_income_score (Economic) and housing_score (Integration)
        stability_income = economic_features.get("stability_income_score", 0.0)
        housing_stability = integration_features.get("housing_score", 0.0)

        # Compute Score
        score = compute_stability_score(
            stability_income_score=stability_income,
            housing_score=housing_stability
        )

        return {
            "stability_score": round(score, 4),
            "formula_version": "v1.0-deterministic"
        }
