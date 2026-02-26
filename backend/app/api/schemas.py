from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


# =========================
# INPUT SCHEMAS (V1 CORE)
# =========================

class EconomicInput(BaseModel):
    monthly_income: float = Field(..., ge=0)
    income_stability_months: int = Field(..., ge=0)
    employment_type: str = Field(..., pattern="^(formal|informal|self_employed)$")
    debt_ratio: float = Field(..., ge=0, le=1)
    savings_months_cover: float = Field(..., ge=0)


class IntegrationInput(BaseModel):
    language_level: int = Field(..., ge=0, le=5)
    housing_stability_months: int = Field(..., ge=0)
    local_references: int = Field(..., ge=0)
    ngo_validation: bool


class CoreMCPFeatures(BaseModel):
    """
    Wrapper for the original V1 features to ensure structured separation.
    """
    economic: EconomicInput
    integration: IntegrationInput


# =========================
# INPUT SCHEMAS (V2 EXTENDED)
# =========================

class V2ExtendedFeatures(BaseModel):
    """
    New optional variables for the V2 Data Architecture.
    All fields are optional to maintain backward compatibility.
    """
    # Advanced Economic Variables
    volatility_of_income: Optional[float] = Field(None, description="Std dev of income over last 6 months")
    income_growth_trend: Optional[float] = Field(None, description="Slope of income regression line (6m)")
    debt_type_distribution: Optional[str] = Field(None, pattern="^(formal|informal|mixed)$")
    asset_index: Optional[float] = Field(None, ge=0, le=1, description="Proxy for accumulated assets (0-1)")
    expense_ratio_estimate: Optional[float] = Field(None, ge=0, description="Monthly expenses / Monthly income")

    # Behavioral Proxies
    punctualidad_reportada: Optional[float] = Field(None, ge=0, le=1, description="0-1 score of punctuality")
    consistencia_declarativa: Optional[float] = Field(None, ge=0, le=1, description="0-1 score of form consistency")
    digital_interaction_score: Optional[float] = Field(None, ge=0, le=1, description="0-1 score of digital footprint")

    # Contextual Risk (Non-discriminatory)
    zone_risk_index: Optional[float] = Field(None, ge=0, le=1, description="Economic vibrancy of residence zone")
    sector_employment_risk: Optional[float] = Field(None, ge=0, le=1, description="Volatility of employment sector")
    vulnerability_score: Optional[float] = Field(None, ge=0, le=1, description="NGO-assessed vulnerability level")


# =========================
# EVALUATION REQUEST
# =========================

class EvaluationRequest(BaseModel):
    applicant_id: str
    core_features: CoreMCPFeatures
    v2_features: Optional[V2ExtendedFeatures] = None


# =========================
# OUTPUT SCHEMAS
# =========================

class DimensionScores(BaseModel):
    economic_score: float
    integration_score: float
    stability_score: float


class AgentMessage(BaseModel):
    agent: str
    message: str
    sentiment: Optional[str] = "neutral"  # positive, negative, neutral, warning

class AgentConsensus(BaseModel):
    dialogue: List[AgentMessage]
    synthesis: str

class PrescriptiveAction(BaseModel):
    title: str
    description: str
    impact: str  # High, Medium, Low
    effort: str  # High, Medium, Low
    priority: int  # 1 is highest priority


class EvaluationResponse(BaseModel):
    applicant_id: str
    inclusion_index: float
    confidence_score: float
    ml_probability: float
    dimension_scores: DimensionScores
    explanation_summary: str
    risk_flags: List[str]
    shap_explanation: Optional[List[Dict[str, Any]]] = None
    agent_consensus: Optional[AgentConsensus] = None
    prescriptive_roadmap: Optional[List[PrescriptiveAction]] = None
    timestamp: datetime
    model_version_used: str
    snapshot_id: Optional[int] = None


# =========================
# RE-EVALUATION
# =========================

class ReevaluationRequest(BaseModel):
    applicant_id: str
    core_features: Optional[CoreMCPFeatures] = None
    v2_features: Optional[V2ExtendedFeatures] = None


# =========================
# BASIC RESPONSE WRAPPER
# =========================

class MessageResponse(BaseModel):
    message: str
