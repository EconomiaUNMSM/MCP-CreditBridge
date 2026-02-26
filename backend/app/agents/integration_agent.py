from typing import Dict, TypedDict
from app.api.schemas import IntegrationInput
from app.scoring.normalization import (
    normalize_language,
    normalize_housing_stability,
    normalize_references,
    normalize_ngo_validation
)
from app.scoring.inclusion_index import compute_integration_score

class IntegrationScoreOutput(TypedDict):
    normalized_features: Dict[str, float]
    integration_score: float
    weight_used: float

class IntegrationAgent:
    """
    Agent responsible for normalizing integration factors and calculating
    the integration score component.
    """

    def run(self, input_data: IntegrationInput) -> IntegrationScoreOutput:
        # 1. Normalize features
        norm_language = normalize_language(input_data.language_level)
        norm_housing = normalize_housing_stability(input_data.housing_stability_months)
        norm_references = normalize_references(input_data.local_references)
        norm_ngo = normalize_ngo_validation(input_data.ngo_validation)

        normalized_features = {
            "language_score": norm_language,
            "housing_score": norm_housing,
            "references_score": norm_references,
            "ngo_score": norm_ngo
        }

        # 2. Compute Integration Score
        score = compute_integration_score(
            language_score=norm_language,
            housing_score=norm_housing,
            references_score=norm_references,
            ngo_score=norm_ngo
        )

        # 3. Return structured output with weight metadata
        return {
            "normalized_features": normalized_features,
            "integration_score": round(score, 4),
            "weight_used": 0.35  # Reflects the 35% weight in the final index
        }
