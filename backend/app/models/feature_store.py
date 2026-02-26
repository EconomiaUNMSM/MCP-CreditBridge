from typing import List, Optional, Dict
from app.api.schemas import CoreMCPFeatures, V2ExtendedFeatures

# Define the definitive order of features for Model V2
# This ensures training and inference vectors are identical
MODEL_V2_FEATURE_NAMES = [
    # --- Core V1 (Normalized or Encoding) ---
    "monthly_income",
    "income_stability_months",
    "debt_ratio",
    "savings_months_cover",
    "language_level",
    "housing_stability_months",
    "local_references",
    "employment_type_encoded", # 0=informal, 1=self, 2=formal
    "ngo_validation_encoded",  # 0=false, 1=true
    
    # --- Extended V2 (With Defaults) ---
    "volatility_of_income",
    "income_growth_trend",
    "asset_index",
    "punctualidad_reportada",
    "consistencia_declarativa",
    "digital_interaction_score",
    "zone_risk_index",
    "vulnerability_score"
]

def _encode_employment(etype: str) -> float:
    mapping = {"informal": 0.0, "self_employed": 1.0, "formal": 2.0}
    return mapping.get(etype, 0.0)

def transform_features_to_vector(
    core: CoreMCPFeatures, 
    v2: Optional[V2ExtendedFeatures] = None
) -> List[float]:
    """
    Transforms the Pydantic schemas into a dense numerical vector.
    Handles None values in V2 features with safe defaults (mean imputation logic would go here).
    """

    # 1. Process Core
    vec = [
        float(core.economic.monthly_income),
        float(core.economic.income_stability_months),
        float(core.economic.debt_ratio),
        float(core.economic.savings_months_cover),
        float(core.integration.language_level),
        float(core.integration.housing_stability_months),
        float(core.integration.local_references),
        _encode_employment(core.economic.employment_type),
        1.0 if core.integration.ngo_validation else 0.0
    ]

    # 2. Process V2 (Handle Optionals with 0.0 or neutral defaults)
    if v2 is None:
        # Append 0.0 for all V2 features if missing
        vec.extend([0.0] * 8)
    else:
        vec.extend([
            v2.volatility_of_income or 0.0,
            v2.income_growth_trend or 0.0,
            v2.asset_index or 0.0,
            v2.punctualidad_reportada or 0.0,
            v2.consistencia_declarativa or 0.0,
            v2.digital_interaction_score or 0.0,
            v2.zone_risk_index or 0.0,
            v2.vulnerability_score or 0.0
        ])

    return vec

def get_feature_names() -> List[str]:
    return MODEL_V2_FEATURE_NAMES
