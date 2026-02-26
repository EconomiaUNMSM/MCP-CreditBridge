from typing import Dict, List, TypedDict, Any
import logging
from app.llm_runtime.prompts import build_llm_prompt
from app.llm_runtime.litellm_client import call_llm

class MLExplainabilityItem(TypedDict):
    feature: str
    impact: float

class MLExplainability(TypedDict):
    top_features: List[MLExplainabilityItem]

class LLMOutput(TypedDict):
    executive_summary: str
    technical_breakdown: str
    risk_level: str
    key_factors: List[str]
    model_limitations: str
    confidence_interpretation: str
    ml_explainability: MLExplainability

class LLMAgent:
    """
    Agent responsible for generating the final textual analysis using an LLM.
    Strictly enforces JSON schema validation.
    """
    def __init__(self):
        # Configure logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

    def run(self, inclusion_index: float, ml_probability: float, dimension_scores: Dict[str, float], confidence_score: float, ml_explanation: List[Dict[str, Any]] = None) -> LLMOutput:
        
        # 1. Prepare Data for Prompt
        data_packet = {
            "inclusion_index": inclusion_index,
            "ml_probability": ml_probability,
            "dimension_scores": dimension_scores,
            "confidence_score": confidence_score,
            "ml_explanation": ml_explanation
        }

        # 2. Build Prompt
        prompt = build_llm_prompt(data_packet)
        
        # 3. Call LLM (using new liteLLM runtime)
        try:
            raw_response = call_llm(prompt)
        except Exception as e:
            self.logger.error(f"LLM Call Failed: {e}")
            raise ValueError(f"LLM Generation Failed: {str(e)}")

        # 4. Strict Validation (Schema Enforcement)
        required_keys = [
            "executive_summary", 
            "technical_breakdown", 
            "risk_level", 
            "key_factors", 
            "model_limitations", 
            "confidence_interpretation",
            "ml_explainability"
        ]
        
        missing_keys = [key for key in required_keys if key not in raw_response]
        
        if missing_keys:
            raise ValueError(f"LLM Response Malformed. Missing keys: {missing_keys}")
            
        # Validate Types
        if not isinstance(raw_response["key_factors"], list):
             raise ValueError("key_factors is not a list")
             
        if raw_response["risk_level"] not in ["Low", "Medium", "High"]:
             raise ValueError(f"Invalid risk_level: {raw_response['risk_level']}")
             
        # Normalize and Return
        return {
            "executive_summary": str(raw_response["executive_summary"]),
            "technical_breakdown": str(raw_response["technical_breakdown"]),
            "risk_level": str(raw_response["risk_level"]),
            "key_factors": [str(x) for x in raw_response["key_factors"]],
            "model_limitations": str(raw_response["model_limitations"]),
            "confidence_interpretation": str(raw_response["confidence_interpretation"]),
            "ml_explainability": raw_response.get("ml_explainability", {"top_features": []})
        }
