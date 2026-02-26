"""
Inclusion Index computation for MCP CreditBridge.

This module assumes all inputs are already normalized between 0 and 1.
No raw values should enter here.
"""


from typing import Dict


# =========================
# ECONOMIC SCORE (45%)
# =========================

def compute_economic_score(
    income_score: float,
    stability_income_score: float,
    employment_score: float,
    debt_score: float,
    savings_score: float
) -> float:

    return (
        0.30 * income_score +
        0.20 * stability_income_score +
        0.20 * employment_score +
        0.20 * debt_score +
        0.10 * savings_score
    )


# =========================
# INTEGRATION SCORE (35%)
# =========================

def compute_integration_score(
    language_score: float,
    housing_score: float,
    references_score: float,
    ngo_score: float
) -> float:

    return (
        0.40 * language_score +
        0.25 * housing_score +
        0.20 * references_score +
        0.15 * ngo_score
    )


# =========================
# STABILITY SCORE (20%)
# =========================

def compute_stability_score(
    stability_income_score: float,
    housing_score: float
) -> float:

    return (stability_income_score + housing_score) / 2


# =========================
# FINAL MCP INCLUSION INDEX
# =========================

def compute_inclusion_index(
    economic_score: float,
    integration_score: float,
    stability_score: float
) -> float:

    final_score = (
        0.45 * economic_score +
        0.35 * integration_score +
        0.20 * stability_score
    )

    return round(final_score * 100, 2)


# =========================
# FULL PIPELINE HELPER
# =========================

def compute_full_index(normalized_values: Dict[str, float]) -> Dict[str, float]:
    """
    Expects a dictionary with all normalized inputs.
    Returns dimension scores + final index.
    """

    economic_score = compute_economic_score(
        normalized_values["income_score"],
        normalized_values["stability_income_score"],
        normalized_values["employment_score"],
        normalized_values["debt_score"],
        normalized_values["savings_score"]
    )

    integration_score = compute_integration_score(
        normalized_values["language_score"],
        normalized_values["housing_score"],
        normalized_values["references_score"],
        normalized_values["ngo_score"]
    )

    stability_score = compute_stability_score(
        normalized_values["stability_income_score"],
        normalized_values["housing_score"]
    )

    final_index = compute_inclusion_index(
        economic_score,
        integration_score,
        stability_score
    )

    return {
        "economic_score": round(economic_score, 4),
        "integration_score": round(integration_score, 4),
        "stability_score": round(stability_score, 4),
        "inclusion_index": final_index
    }
