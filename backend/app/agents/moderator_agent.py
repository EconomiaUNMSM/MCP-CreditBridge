from typing import Dict, Any, List, TypedDict
import logging
from app.llm_runtime.prompts import build_moderator_prompt
from app.llm_runtime.litellm_client import call_llm
from app.api.schemas import AgentConsensus

class ModeratorAgent:
    """
    Agent responsible for synthesizing the multi-agent debate into a consensus.
    """
    def __init__(self):
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

    def run(self, inclusion_index: float, dimension_scores: Dict[str, float], risk_flags: List[str]) -> AgentConsensus:
        
        # 1. Prepare Data
        data_packet = {
            "inclusion_index": inclusion_index,
            "economic_score": dimension_scores.get("economic_score", 0),
            "integration_score": dimension_scores.get("integration_score", 0),
            "stability_score": dimension_scores.get("stability_score", 0),
            "risk_flags": risk_flags
        }

        # 2. Build Prompt
        prompt = build_moderator_prompt(data_packet)
        
        # 3. Call LLM
        try:
            raw_response = call_llm(prompt)
        except Exception as e:
            self.logger.error(f"Moderator LLM Failed: {e}")
            # Fallback for robustness
            return AgentConsensus(
                dialogue=[],
                synthesis="System consensus unavailable due to processing error."
            )

        # 4. Return Structured Schema
        return AgentConsensus(
            dialogue=raw_response.get("dialogue", []),
            synthesis=raw_response.get("synthesis", "Consensus reached.")
        )
