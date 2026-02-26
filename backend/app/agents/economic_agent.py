from typing import Dict, TypedDict
from app.api.schemas import EconomicInput
from app.scoring.normalization import (
    normalize_income,
    normalize_income_stability,
    normalize_employment_type,
    normalize_debt_ratio,
    normalize_savings
)
from app.scoring.inclusion_index import compute_economic_score

class EconomicScoreOutput(TypedDict):
    normalized_features: Dict[str, float]
    economic_score: float
    weight_used: float

class EconomicAgent:
    """
    Agent responsible for validating economic inputs, normalizing features,
    and calculating the initial economic score component.
    """
    
    def run(self, input_data: EconomicInput) -> EconomicScoreOutput:
        # 1. Normalize features
        norm_income = normalize_income(input_data.monthly_income)
        norm_stability = normalize_income_stability(input_data.income_stability_months)
        norm_employment = normalize_employment_type(input_data.employment_type)
        norm_debt = normalize_debt_ratio(input_data.debt_ratio)
        norm_savings = normalize_savings(input_data.savings_months_cover)
        
        normalized_features = {
            "income_score": norm_income,
            "stability_income_score": norm_stability,
            "employment_score": norm_employment,
            "debt_score": norm_debt,
            "savings_score": norm_savings
        }

        # 2. Compute Economic Score
        # Using the deterministic formula from inclusion_index.py
        score = compute_economic_score(
            income_score=norm_income,
            stability_income_score=norm_stability,
            employment_score=norm_employment,
            debt_score=norm_debt,
            savings_score=norm_savings
        )

        # 3. Return structured output with weight metadata
        return {
            "normalized_features": normalized_features,
            "economic_score": round(score, 4),
            "weight_used": 0.45  # Reflects the 45% weight in the final index
        }
