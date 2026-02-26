from typing import List, Dict, Any, Optional
import logging
from app.llm_runtime.prompts import build_prescriptive_prompt
from app.llm_runtime.litellm_client import call_llm
from app.api.schemas import PrescriptiveAction, CoreMCPFeatures

class PrescriptiveAgent:
    """
    Agent responsible for generating actionable, context-aware feedback.
    Uses SHAP impact vs Raw Feature Values to ensure logic.
    """
    def __init__(self):
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

    def run(
        self, 
        shap_explanation: List[Dict[str, Any]], 
        core_features: CoreMCPFeatures
    ) -> List[PrescriptiveAction]:
        
        # 1. Identify Areas for Improvement (Negative SHAP only)
        negative_factors = [
            f"{item['feature']} (Impact: {item['impact']})" 
            for item in shap_explanation 
            if item['impact'] < 0
        ]

        if not negative_factors:
            return []  # No negative drivers -> No critical improvements needed

        # 2. Flatten Core Features for Context
        # We need to pass the raw values to the LLM so it knows NOT to recommend
        # improving something that is already maxed out (e.g. Language Level 5).
        flat_features = {
            **core_features.economic.model_dump(),
            **core_features.integration.model_dump()
        }

        # 3. Build Prompt
        data_packet = {
            "negative_factors": negative_factors,
            "core_features": flat_features
        }
        prompt = build_prescriptive_prompt(data_packet)

        # 4. Call LLM
        try:
            raw_response = call_llm(prompt)
            steps = raw_response.get("improvement_steps", [])
            
            # Map to Schema
            return [PrescriptiveAction(**step) for step in steps]
            
        except Exception as e:
            self.logger.error(f"Prescriptive LLM Failed: {e}")
            return []
