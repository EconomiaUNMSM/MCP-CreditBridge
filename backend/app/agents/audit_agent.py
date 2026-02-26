from datetime import datetime, timezone
from typing import Dict, TypedDict, Any, List, Optional
import json
import os
from pathlib import Path

class AuditOutput(TypedDict):
    audit_id: str
    timestamp: str
    system_version: str

class AuditAgent:
    """
    Agent responsible for logging the entire decision process for auditability.
    Saves immutable JSON records of each run.
    """
    LEDGER_PATH = Path(__file__).parent.parent.parent / "data" / "audit_ledger.jsonl"
    SYSTEM_VERSION = "v2.0-hybrid-shap" 

    def run(
        self,
        snapshot_id: int,
        applicant_id: str,
        economic_output: Dict[str, Any],
        integration_output: Dict[str, Any],
        stability_output: Dict[str, Any],
        ml_output: Dict[str, Any],
        final_inclusion_index: float,
        confidence_score: float,
        llm_explanation: str,
        agent_consensus: Optional[Any] = None,
        prescriptive_roadmap: Optional[List[Any]] = None
    ) -> AuditOutput:
        
        ml_explanation = ml_output.get("ml_explanation", [])
        
        # Sort SHAP values to find drivers
        sorted_shap = sorted(ml_explanation, key=lambda x: x['impact'], reverse=True)
        top_positive = [x for x in sorted_shap if x['impact'] > 0][:5]
        top_negative = [x for x in sorted_shap if x['impact'] < 0][:5]

        audit_record = {
            "snapshot_id": snapshot_id,
            "applicant_id": applicant_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "system_version": self.SYSTEM_VERSION,
            "model_version": ml_output.get("model_version", "unknown"),
            
            "metrics": {
                "final_index": final_inclusion_index,
                "ml_probability": ml_output["probability"],
                "confidence_score": confidence_score,
                "dimension_scores": {
                    "economic": economic_output["economic_score"],
                    "integration": integration_output["integration_score"],
                    "stability": stability_output["stability_score"]
                }
            },

            "shap": {
                "top_positive": [x["feature"] for x in top_positive],
                "top_negative": [x["feature"] for x in top_negative],
                # Persist full explanation for transparency if needed, but not required for report
                "raw_explanation": ml_explanation 
            },

            "llm_explanation": llm_explanation,
            "agent_consensus": agent_consensus.model_dump() if agent_consensus else None,
            "prescriptive_roadmap": [p.model_dump() for p in prescriptive_roadmap] if prescriptive_roadmap else None,
            
            "inputs": {
                "economic": economic_output["normalized_features"],
                "integration": integration_output["normalized_features"]
            }
        }
        
        self._append_to_ledger(audit_record)
        
        return {
            "audit_id": "aud_" + audit_record["timestamp"],
            "timestamp": audit_record["timestamp"],
            "system_version": self.SYSTEM_VERSION
        }

    def _append_to_ledger(self, record: Dict):
        # Ensure directory exists
        os.makedirs(os.path.dirname(self.LEDGER_PATH), exist_ok=True)
        
        with open(self.LEDGER_PATH, "a") as f:
            f.write(json.dumps(record) + "\n")
