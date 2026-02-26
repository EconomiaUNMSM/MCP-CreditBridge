"""
Confidence score computation for MCP CreditBridge.

Confidence measures the structural robustness of the evaluation,
not probability of repayment or model certainty.
"""


from typing import Dict


# =========================
# DATA COMPLETENESS
# =========================

def compute_data_completeness(input_data: Dict) -> float:
    """
    Calculates percentage of non-null values.
    Assumes nested dictionary structure.
    Returns value between 0 and 1.
    """

    total_fields = 0
    filled_fields = 0

    def count_fields(d):
        nonlocal total_fields, filled_fields
        for value in d.values():
            if isinstance(value, dict):
                count_fields(value)
            else:
                total_fields += 1
                if value is not None:
                    filled_fields += 1

    count_fields(input_data)

    if total_fields == 0:
        return 0.0

    return filled_fields / total_fields


# =========================
# CONSISTENCY SCORE
# =========================

def compute_consistency_score(
    income_score: float,
    stability_income_score: float
) -> float:
    """
    Penalizes large gaps between income level and income stability.
    Returns value between 0 and 1.
    """

    gap = abs(income_score - stability_income_score)
    return 1.0 - gap


# =========================
# FINAL CONFIDENCE
# =========================

def compute_confidence(
    raw_input_data: Dict,
    income_score: float,
    stability_income_score: float
) -> float:
    """
    Combines completeness and consistency.
    Returns score between 0 and 100.
    """

    completeness = compute_data_completeness(raw_input_data)
    consistency = compute_consistency_score(
        income_score,
        stability_income_score
    )

    confidence_value = (
        0.6 * completeness +
        0.4 * consistency
    )

    return round(confidence_value * 100, 2)
