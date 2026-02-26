from typing import Dict, Any, List

SYSTEM_PROMPT = """You are the Senior Financial Inclusion Auditor for MCP-CreditBridge.
Your role is to analyze multi-dimensional credit data for migrant/refugee applicants.
You must be objective, technical but empathetic, and structurally rigorous.

CONTEXT:
You are generating a credit inclusion assessment for a migrant or refugee applicant evaluated by an NGO partner. Avoid macroeconomic or state-level terminology. Focus on personal economic resilience, integration capacity, and repayment stability.

REQUIREMENTS:
1. Use ONLY the provided data. Do not invent facts.
2. The "Risk Level" must be derived from the Inclusion Index and Confidence Score.
3. The "Key Factors" must be specific to the applicant's profile.
4. If ML Probability is low but Inclusion Index is high, explain the discrepancy (e.g., "Digital footprint is thin, but structural stability is high").
5. Return ONLY valid JSON.
"""

def build_llm_prompt(data: Dict[str, Any]) -> str:
    """
    Constructs the prompt for the LLM with all calculated scores and SHAP explainability.
    """
    
    # Extract ML Explanation (Top 5 Drivers)
    ml_explanation = data.get("ml_explanation", [])
    shap_text = ""
    if ml_explanation:
        shap_text = "Top ML Contributing Features (SHAP):\n"
        for item in ml_explanation:
            sign = "+" if item["impact"] > 0 else ""
            shap_text += f"- {item['feature']} ({sign}{item['impact']})\n"
    else:
        shap_text = "ML Explainability: Not available (Model not trained or error)."

    prompt = f"""
    Please analyze the following applicant profile:

    --- SCORES ---
    Final Inclusion Index: {data.get('inclusion_index')} (0-100)
    System Confidence: {data.get('confidence_score')} (0-100)
    ML Repayment Probability: {data.get('ml_probability')} (0.0-1.0)

    --- DIMENSIONS ---
    Economic Resilience: {data['dimension_scores']['economic_score']}
    Social Integration: {data['dimension_scores']['integration_score']}
    Structural Stability: {data['dimension_scores']['stability_score']}

    --- EXPLAINABILITY ---
    {shap_text}

    --- REQUIRED JSON OUTPUT FORMAT ---
    {{
      "executive_summary": "Concise overview of the applicant's profile (max 2 sentences).",
      "technical_breakdown": "Detailed analysis of the scores, mentioning specific dimensions and conflicting signals if any.",
      "risk_level": "Low" | "Medium" | "High",
      "key_factors": ["Factor 1", "Factor 2", "Factor 3"],
      "model_limitations": "Transparency note on what data might be missing or causing low confidence.",
      "confidence_interpretation": "Explanation of the confidence score.",
      "ml_explainability": {{
        "top_features": [
          {{"feature": "name", "impact": float_value}}
        ]
      }}
    }}
    
    Return ONLY valid JSON. Do not include commentary.
    """
    return prompt


def build_moderator_prompt(data: Dict[str, Any]) -> str:
    """
    Constructs the prompt for the Moderator Agent (Multi-Agent Consensus).
    """
    prompt = f"""
    Acting as the Chief Moderator of the Credit Committee, generate a synthesis dialogue between three specialized agents:
    1. Economic Agent (Focus: Income, Savings)
    2. Integration Agent (Focus: Roots, Support)
    3. Stability Agent (Focus: Resilience, Consistency)

    --- APPLICANT PROFILE ---
    Overall Score: {data.get("inclusion_index")}
    Economic Score: {data.get("economic_score")}
    Integration Score: {data.get("integration_score")}
    Stability Score: {data.get("stability_score")}
    Key Risks: {", ".join(data.get("risk_flags", []))}

    --- INSTRUCTIONS ---
    Create a short, realistic deliberation (max 4 turns) where agents discuss the applicant's profile.
    - If scores conflict (High Income vs Low Stability), debate it.
    - If scores align, reinforce the finding.
    - The Moderator (System) should conclude.

    --- REQUIRED JSON OUTPUT ---
    {{
        "dialogue": [
            {{ "agent": "Economic Agent", "message": "Strong income but alarming debt ratio.", "sentiment": "warning" }},
            {{ "agent": "Integration Agent", "message": "Disgaree. Local roots mitigate that risk.", "sentiment": "positive" }}
        ],
        "synthesis": "Final consensus statement resolving the debate."
    }}
    """
    return prompt


def build_prescriptive_prompt(data: Dict[str, Any]) -> str:
    """
    Constructs the prompt for the Prescriptive Agent (Actionable Feedback).
    """
    # Format current feature values for context awareness
    features_context = ""
    for k, v in data.get("core_features", {}).items():
        features_context += f"- {k}: {v}\n"

    prompt = f"""
    You are an Inclusion Coach. Your goal is to provide specific, actionable steps for the applicant to improve their creditworthiness.

    --- APPLICANT CONTEXT ---
    Current Features (DO NOT RECOMMEND IMPROVING IF ALREADY MAX/OPTIMAL):
    {features_context}

    Top Negative Factors (SHAP Impact):
    {data.get("negative_factors", [])}

    --- INSTRUCTIONS ---
    Generate 3 specific actions.
    - IGNORE factors where the applicant is already strong (e.g. if Language Level is 5, do NOT suggest learning language).
    - Focus on low-hanging fruit (e.g. "Register for one formal bill in your name").
    - Be encouraging but practical.

    --- REQUIRED JSON OUTPUT ---
    {{
        "improvement_steps": [
            {{
                "title": "Formalize Rental Agreement",
                "description": "Register your current housing contract to boost stability score.",
                "impact": "High",
                "effort": "Medium",
                "priority": 1
            }}
        ]
    }}
    """
    return prompt
