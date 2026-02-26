export interface CoreFeatures {
    economic: {
        monthly_income: number;
        income_stability_months: number;
        employment_type: "formal" | "informal" | "self_employed";
        debt_ratio: number;
        savings_months_cover: number;
    };
    integration: {
        language_level: number;
        housing_stability_months: number;
        local_references: number;
        ngo_validation: boolean;
    };
}

export interface V2Features {
    volatility_of_income?: number;
    income_growth_trend?: number;
    debt_type_distribution?: "formal" | "informal" | "mixed";
    asset_index?: number;
    expense_ratio_estimate?: number;
    punctualidad_reportada?: number;
    consistencia_declarativa?: number;
    digital_interaction_score?: number;
    zone_risk_index?: number;
    sector_employment_risk?: number;
    vulnerability_score?: number;
}

export interface EvaluationRequest {
    applicant_id: string;
    core_features: CoreFeatures;
    v2_features?: V2Features;
}

export interface DimensionScores {
    economic_score: number;
    integration_score: number;
    stability_score: number;
}

export interface AgentMessage {
    agent: string;
    message: string;
    sentiment: 'positive' | 'warning' | 'neutral';
}

export interface AgentConsensus {
    dialogue: AgentMessage[];
    synthesis: string;
}

export interface PrescriptiveAction {
    title: string;
    description: string;
    impact: string;
    effort: string;
    priority: number;
}

export interface EvaluationResponse {
    applicant_id: string;
    inclusion_index: number;
    confidence_score: number;
    ml_probability: number;
    dimension_scores: DimensionScores;
    explanation_summary: string;
    risk_flags: string[];
    shap_explanation: { feature: string; impact: number }[];
    agent_consensus?: AgentConsensus | null;
    prescriptive_roadmap?: PrescriptiveAction[] | null;
    timestamp: string;
    model_version_used: string;
    snapshot_id: number | null;
    system_version: string;
    confidence_level: string;
    key_drivers: string[];
}
