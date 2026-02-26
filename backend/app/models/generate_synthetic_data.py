"""
MCP-CreditBridge V2 — Structural Synthetic Data Generator (Calibrated)
=====================================================================
Generates economically coherent synthetic datasets for ML model training.
Default probability emerges from a structural risk function, NOT random noise.

Output: backend/data/synthetic_training.csv
"""

import numpy as np
import pandas as pd
import os
from pathlib import Path

# Seed for reproducibility
np.random.seed(42)

# ===========================
# OUTPUT PATH
# ===========================
OUTPUT_DIR = Path(__file__).parent.parent.parent / "data"
OUTPUT_PATH = OUTPUT_DIR / "synthetic_training.csv"

# ===========================
# DISTRIBUTION GENERATORS
# (unchanged except minor comments)
# ===========================

def generate_monthly_income(n: int) -> np.ndarray:
    """Log-normal distribution. Realistic for migrant income."""
    values = np.random.lognormal(mean=7.5, sigma=0.5, size=n)
    return np.clip(values, 400, 6000)


def generate_income_stability_months(n: int) -> np.ndarray:
    """Gamma distribution. Most between 3-12 months, few > 36."""
    values = np.random.gamma(shape=2, scale=10, size=n)
    return np.clip(values, 0, 60).astype(int)


def generate_debt_ratio(n: int) -> np.ndarray:
    """Beta(2,5). Skewed low — most migrants have low formal debt."""
    return np.random.beta(2, 5, size=n)


def generate_savings_months_cover(n: int) -> np.ndarray:
    """Exponential. Most have 0-2 months savings, few > 6."""
    values = np.random.exponential(scale=2, size=n)
    return np.clip(values, 0, 12)


def generate_language_level(n: int) -> np.ndarray:
    """Discrete 0-5. Concentrated on 2-3."""
    probs = [0.05, 0.10, 0.30, 0.30, 0.15, 0.10]
    return np.random.choice([0, 1, 2, 3, 4, 5], size=n, p=probs)


def generate_housing_stability_months(n: int) -> np.ndarray:
    """Gamma(3,8). Less dispersed than income stability."""
    values = np.random.gamma(shape=3, scale=8, size=n)
    return np.clip(values, 0, 60).astype(int)


def generate_local_references(n: int) -> np.ndarray:
    """Poisson(lambda=2). Majority 1-3."""
    values = np.random.poisson(lam=2, size=n)
    return np.clip(values, 0, 5)


def generate_employment_type_encoded(n: int) -> np.ndarray:
    """0=informal(40%), 1=self-employed(30%), 2=formal(30%)."""
    return np.random.choice([0, 1, 2], size=n, p=[0.4, 0.3, 0.3])


def generate_ngo_validation_encoded(n: int) -> np.ndarray:
    """Bernoulli p=0.4."""
    return np.random.binomial(1, 0.4, size=n)


def generate_volatility_of_income(n: int) -> np.ndarray:
    """Beta(2,3). Represents income instability."""
    return np.random.beta(2, 3, size=n)


def generate_income_growth_trend(n: int) -> np.ndarray:
    """Normal(0, 0.05). Centered, slight growth or decline."""
    values = np.random.normal(0, 0.05, size=n)
    return np.clip(values, -0.2, 0.2)


def generate_asset_index(n: int) -> np.ndarray:
    """Beta(2,2). Symmetric — equal chance of low/high assets."""
    return np.random.beta(2, 2, size=n)


def generate_punctualidad_reportada(n: int) -> np.ndarray:
    """Beta(5,2). Skewed high — most applicants are punctual."""
    return np.random.beta(5, 2, size=n)


def generate_consistencia_declarativa(n: int) -> np.ndarray:
    """Beta(6,2). Highly skewed toward 1 — most are consistent."""
    return np.random.beta(6, 2, size=n)


def generate_digital_interaction_score(n: int) -> np.ndarray:
    """Beta(2,2). Symmetric distribution."""
    return np.random.beta(2, 2, size=n)


def generate_zone_risk_index(n: int) -> np.ndarray:
    """Uniform 0.2-0.8. No extreme safe/dangerous zones."""
    return np.random.uniform(0.2, 0.8, size=n)


def generate_vulnerability_score(n: int) -> np.ndarray:
    """Beta(2,2). Symmetric."""
    return np.random.beta(2, 2, size=n)


# ===========================
# STRUCTURAL RISK FUNCTION + CALIBRATION
# ===========================

def sigmoid(x: np.ndarray) -> np.ndarray:
    """Manual sigmoid. No external dependencies."""
    # clip to avoid overflow on exp
    x = np.clip(x, -50, 50)
    return 1.0 / (1.0 + np.exp(-x))


def normalize_minmax(values: np.ndarray) -> np.ndarray:
    """Min-Max normalization to [0,1]."""
    vmin = values.min()
    vmax = values.max()
    if vmax - vmin == 0:
        return np.zeros_like(values)
    return (values - vmin) / (vmax - vmin)


def compute_structural_risk(df: pd.DataFrame) -> np.ndarray:
    """
    Computes a latent risk score per applicant based on economic structure.
    Higher risk → higher probability of default.
    This version uses stronger coefficients and non-linear terms to increase signal.
    """
    # Normalize monetary/count variables to 0-1 range
    norm_income = normalize_minmax(df["monthly_income"].values)
    norm_savings = normalize_minmax(df["savings_months_cover"].values)
    norm_income_stability = normalize_minmax(df["income_stability_months"].values)
    norm_language = normalize_minmax(df["language_level"].values)
    norm_references = normalize_minmax(df["local_references"].values)
    norm_housing = normalize_minmax(df["housing_stability_months"].values)

    n = len(df)
    risk = np.zeros(n)

    # ---- STRONGER NEGATIVE FACTORS (Increase Risk) ----
    risk += 2.0 * df["debt_ratio"].values                      # stronger weight
    risk += 1.5 * df["volatility_of_income"].values
    risk += 1.2 * df["vulnerability_score"].values
    risk += 1.0 * df["zone_risk_index"].values
    risk += 0.8 * (1 - df["punctualidad_reportada"].values)
    risk += 0.9 * (1 - df["consistencia_declarativa"].values)

    # Non-linear penalization for very high debt
    high_debt_mask = df["debt_ratio"].values > 0.6
    risk[high_debt_mask] += 1.2  # step-up penalty for toxic debt levels

    # ---- STRONGER PROTECTIVE FACTORS (Decrease Risk) ----
    risk -= 1.5 * norm_savings
    risk -= 1.2 * norm_income_stability
    risk -= 1.0 * norm_income
    risk -= 1.4 * df["income_growth_trend"].values
    risk -= 0.9 * norm_language
    risk -= 0.7 * norm_references
    risk -= 1.0 * df["ngo_validation_encoded"].values
    risk -= 0.6 * norm_housing

    # Small interaction effect: NGO + punctuality reduces additional risk
    ngo_and_punctual = (df["ngo_validation_encoded"].values == 1) & (df["punctualidad_reportada"].values > 0.8)
    risk[ngo_and_punctual] -= 0.6

    return risk


def calibrate_prob_default(risk: np.ndarray, scale: float = 1.2, target_rate: float = 0.25, tol: float = 0.002, max_iter: int = 25) -> np.ndarray:
    """
    Calibrate intercept via binary search so global mean(prob_default) ~ target_rate.
    We search for intercept shift 'b' such that mean(sigmoid(scale*(risk - b))) ~= target_rate.
    """
    low, high = -5.0, 5.0
    b = 0.0
    for _ in range(max_iter):
        b_mid = (low + high) / 2.0
        probs = sigmoid(scale * (risk - b_mid))
        mean_p = probs.mean()
        if abs(mean_p - target_rate) <= tol:
            b = b_mid
            break
        if mean_p > target_rate:
            # need to increase b_mid to reduce probabilities
            low = b_mid
        else:
            high = b_mid
        b = b_mid
    # return calibrated probabilities and final b for debugging if needed
    return sigmoid(scale * (risk - b)), b


# ===========================
# DATASET GENERATOR
# ===========================

def generate_dataset(n: int = 5000, target_default_rate: float = 0.25) -> pd.DataFrame:
    """
    Generates a structurally sound synthetic dataset.
    Returns a DataFrame with 17 features + 2 targets.
    """
    print(f"⚙️  Generating {n} synthetic records...")

    df = pd.DataFrame({
        # ---- Core V1 ----
        "monthly_income": generate_monthly_income(n),
        "income_stability_months": generate_income_stability_months(n),
        "debt_ratio": generate_debt_ratio(n),
        "savings_months_cover": generate_savings_months_cover(n),
        "language_level": generate_language_level(n),
        "housing_stability_months": generate_housing_stability_months(n),
        "local_references": generate_local_references(n),
        "employment_type_encoded": generate_employment_type_encoded(n),
        "ngo_validation_encoded": generate_ngo_validation_encoded(n),
        # ---- V2 Extended ----
        "volatility_of_income": generate_volatility_of_income(n),
        "income_growth_trend": generate_income_growth_trend(n),
        "asset_index": generate_asset_index(n),
        "punctualidad_reportada": generate_punctualidad_reportada(n),
        "consistencia_declarativa": generate_consistencia_declarativa(n),
        "digital_interaction_score": generate_digital_interaction_score(n),
        "zone_risk_index": generate_zone_risk_index(n),
        "vulnerability_score": generate_vulnerability_score(n),
    })

    # ---- Compute Structural Risk ----
    print("📐 Computing structural risk scores...")
    risk_scores = compute_structural_risk(df)

    # ---- Calibrate probabilities to a realistic default rate (e.g., ~25%) ----
    print("⚖️ Calibrating default probability to target rate (approx).")
    prob_default, intercept_b = calibrate_prob_default(risk_scores, scale=1.2, target_rate=target_default_rate)
    # intercept_b returned for debugging if needed (not printed by default)

    # ---- Derive Targets ----
    print("🎯 Deriving target variables...")
    df["target_default_flag"] = np.random.binomial(1, prob_default)
    noise = np.random.normal(0, 0.04, size=n)
    df["target_repayment_behavior"] = np.clip(1.0 - prob_default + noise, 0, 1)

    # ---- Round floats for clean CSV ----
    float_cols = [
        "monthly_income", "savings_months_cover", "debt_ratio",
        "volatility_of_income", "income_growth_trend", "asset_index",
        "punctualidad_reportada", "consistencia_declarativa",
        "digital_interaction_score", "zone_risk_index", "vulnerability_score",
        "target_repayment_behavior"
    ]
    df[float_cols] = df[float_cols].round(4)

    return df


# ===========================
# VALIDATION & DIAGNOSTICS
# ===========================

def validate_dataset(df: pd.DataFrame):
    """Prints structural diagnostics to verify economic coherence."""
    print("\n" + "=" * 60)
    print("📊 DATASET VALIDATION REPORT")
    print("=" * 60)

    # 1. Global Default Rate
    default_rate = df["target_default_flag"].mean()
    print(f"\n🔹 Global Default Rate: {default_rate:.2%}")

    # 2. Default Rate by Income Quintile
    df["income_quintile"] = pd.qcut(df["monthly_income"], q=5, labels=["Q1 (Low)", "Q2", "Q3", "Q4", "Q5 (High)"])
    quintile_defaults = df.groupby("income_quintile")["target_default_flag"].mean()
    print("\n🔹 Default Rate by Income Quintile:")
    for q, rate in quintile_defaults.items():
        print(f"   {q}: {rate:.2%}")

    # 3. Correlation: debt_ratio vs default
    corr = df["debt_ratio"].corr(df["target_default_flag"])
    print(f"\n🔹 Correlation (debt_ratio ↔ default): {corr:.4f}")

    # 4. Correlation: savings vs default (should be negative)
    corr_savings = df["savings_months_cover"].corr(df["target_default_flag"])
    print(f"🔹 Correlation (savings ↔ default): {corr_savings:.4f}")

    # 5. Correlation: vulnerability vs default
    corr_vuln = df["vulnerability_score"].corr(df["target_default_flag"])
    print(f"🔹 Correlation (vulnerability ↔ default): {corr_vuln:.4f}")

    # 6. Shape verification
    print(f"\n🔹 Dataset Shape: {df.shape[0]} rows × {df.shape[1] - 1} columns (excl. quintile)")
    print(f"🔹 Features: {df.shape[1] - 3} | Targets: 2")  # -3 for quintile + 2 targets

    # Drop auxiliary column
    df.drop(columns=["income_quintile"], inplace=True)

    print("\n" + "=" * 60)


# ===========================
# MAIN ENTRY POINT
# ===========================

if __name__ == "__main__":
    # 1. Generate (default target rate = 25%)
    dataset = generate_dataset(n=5000, target_default_rate=0.25)

    # 2. Validate
    validate_dataset(dataset)

    # 3. Save
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    dataset.to_csv(OUTPUT_PATH, index=False)
    print(f"\n💾 Dataset saved to: {OUTPUT_PATH}")
    print(f"   Rows: {len(dataset)} | Columns: {len(dataset.columns)}")
    print("\n✅ Synthetic data generation complete.")
