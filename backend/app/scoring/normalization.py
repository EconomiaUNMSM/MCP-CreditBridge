"""
Normalization utilities for MCP CreditBridge.

All functions return values normalized between 0 and 1.
No business logic should live here.
"""


# =========================
# GENERIC UTILITIES
# =========================

def min_max_ratio(value: float, max_reference: float) -> float:
    """
    Generic normalization using capped ratio.
    Returns min(value / max_reference, 1).
    """
    if max_reference <= 0:
        raise ValueError("max_reference must be positive")

    return min(value / max_reference, 1.0)


def inverse_ratio(value: float) -> float:
    """
    For variables like debt_ratio.
    Assumes value already in [0,1].
    Returns 1 - value.
    """
    if not 0 <= value <= 1:
        raise ValueError("Value must be between 0 and 1")

    return 1.0 - value


# =========================
# ECONOMIC NORMALIZATION
# =========================

def normalize_income(monthly_income: float) -> float:
    return min_max_ratio(monthly_income, 2000)


def normalize_income_stability(months: int) -> float:
    return min_max_ratio(months, 24)


def normalize_employment_type(employment_type: str) -> float:
    mapping = {
        "formal": 1.0,
        "self_employed": 0.75,
        "informal": 0.6
    }

    if employment_type not in mapping:
        raise ValueError("Invalid employment type")

    return mapping[employment_type]


def normalize_debt_ratio(debt_ratio: float) -> float:
    return inverse_ratio(debt_ratio)


def normalize_savings(savings_months_cover: float) -> float:
    return min_max_ratio(savings_months_cover, 6)


# =========================
# INTEGRATION NORMALIZATION
# =========================

def normalize_language(level: int) -> float:
    if not 0 <= level <= 5:
        raise ValueError("Language level must be between 0 and 5")

    return level / 5


def normalize_housing_stability(months: int) -> float:
    return min_max_ratio(months, 24)


def normalize_references(local_references: int) -> float:
    return min_max_ratio(local_references, 3)


def normalize_ngo_validation(ngo_validation: bool) -> float:
    return 1.0 if ngo_validation else 0.5
