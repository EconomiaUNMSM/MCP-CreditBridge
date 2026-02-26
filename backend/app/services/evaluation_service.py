from datetime import datetime, timezone
from typing import Dict, Any, Optional

from app.api.schemas import EvaluationRequest, EvaluationResponse, DimensionScores
from app.agents.registry import AgentRegistry
from app.scoring.inclusion_index import compute_inclusion_index
from app.scoring.confidence import compute_confidence
from app.database import crud, models
from app.database.base import SessionLocal
from app.models.feature_store import transform_features_to_vector

class InclusionPipeline:
    """
    Orchestrator for the full credit inclusion evaluation flow.
    PERSISTENCE: Saves snapshot history and training records for V2 Data Architecture.
    EXPLAINABILITY: Passes SHAP values to LLM for enhanced breakdown.
    """

    def __init__(self):
        self.registry = AgentRegistry()

    def run_full_evaluation(self, request: EvaluationRequest) -> EvaluationResponse:
        # 1. Economic Analysis
        economic_result = self.registry.economic.run(request.core_features.economic)
        
        # 2. Integration Analysis
        integration_result = self.registry.integration.run(request.core_features.integration)
        
        # 3. Stability Analysis
        stability_result = self.registry.stability.run(
            economic_features=economic_result["normalized_features"],
            integration_features=integration_result["normalized_features"]
        )

        # 4. ML Prediction (V2 Model with SHAP)
        ml_result = self.registry.ml.run(
            core_features=request.core_features,
            v2_features=request.v2_features
        )

        # 5. Core Calculations
        final_inclusion_index = compute_inclusion_index(
            economic_score=economic_result["economic_score"],
            integration_score=integration_result["integration_score"],
            stability_score=stability_result["stability_score"]
        )

        raw_input_data = {
            **request.core_features.economic.model_dump(),
            **request.core_features.integration.model_dump()
        }
        confidence = compute_confidence(
            raw_input_data=raw_input_data,
            income_score=economic_result["normalized_features"]["income_score"],
            stability_income_score=economic_result["normalized_features"]["stability_income_score"]
        )

        # 6. PERSISTENCE (V2 Requirement)
        db: Session = SessionLocal()
        try:
            snapshot = crud.create_snapshot(
                db=db,
                applicant_id=request.applicant_id,
                inclusion_index=final_inclusion_index,
                confidence_score=confidence,
                ml_probability=ml_result["probability"],
                core_features=request.core_features.model_dump(),
                v2_features=request.v2_features.model_dump() if request.v2_features else None,
                model_version=ml_result["model_version"],
                system_version="v2.0-hybrid-shap"
            )
            
            # Capture ID before session closes
            snapshot_id = snapshot.id
            
            # Create Training Record (Flatten numerical vector)
            vector = transform_features_to_vector(request.core_features, request.v2_features)
            crud.create_training_record(
                db=db,
                snapshot_id=snapshot_id, 
                applicant_id=request.applicant_id,
                feature_vector=vector
            )
            
        except Exception as e:
            print(f"❌ DB ERROR: {e}") # Non-blocking
            snapshot_id = None
        finally:
            db.close()


        dimension_scores_dict = {
            "economic_score": economic_result["economic_score"],
            "integration_score": integration_result["integration_score"],
            "stability_score": stability_result["stability_score"]
        }

        # 7. LLM Explanation (Using the V2 Model Probability + SHAP Explanations)
        try:
            llm_result = self.registry.llm.run(
                inclusion_index=final_inclusion_index,
                ml_probability=ml_result["probability"] if ml_result["probability"] is not None else 0.5,
                dimension_scores=dimension_scores_dict,
                confidence_score=confidence,
                ml_explanation=ml_result["ml_explanation"]
            )
            explanation_summary = llm_result.get("executive_summary", "Analysis completed.")
            risk_flags = llm_result.get("key_factors", [])
        except Exception as e:
            explanation_summary = f"Automated analysis completed. Explanation unavailable: {str(e)}"
            risk_flags = ["System Warning: LLM Explanation Failed"]

        # 8. Multi-Agent Consensus & Prescriptive AI (Phase 8)
        agent_consensus = None
        prescriptive_roadmap = None
        
        try:
            # A. Moderator Agent (Dialogue Synthesis)
            agent_consensus = self.registry.moderator.run(
                inclusion_index=final_inclusion_index,
                dimension_scores=dimension_scores_dict,
                risk_flags=risk_flags
            )
            
            # B. Prescriptive Agent (Actionable Feedback)
            prescriptive_roadmap = self.registry.prescriptive.run(
                shap_explanation=ml_result.get("ml_explanation", []),
                core_features=request.core_features
            )
        except Exception as e:
            print(f"⚠️ Multi-Agent Warning: {e}")
            # Non-blocking failure

        # 9. Audit Logging (Including SHAP & New Agents)
        if snapshot_id: # Only log if snapshot was successfully created
            self.registry.audit.run(
                snapshot_id=snapshot_id,
                applicant_id=request.applicant_id,
                economic_output=economic_result,
                integration_output=integration_result,
                stability_output=stability_result,
                ml_output=ml_result, 
                final_inclusion_index=final_inclusion_index,
                confidence_score=confidence,
                llm_explanation=explanation_summary,
                agent_consensus=agent_consensus,
                prescriptive_roadmap=prescriptive_roadmap
            )

        return EvaluationResponse(
            applicant_id=request.applicant_id,
            inclusion_index=final_inclusion_index,
            confidence_score=confidence,
            ml_probability=round(ml_result["probability"], 4) if ml_result["probability"] is not None else -1.0, 
            dimension_scores=DimensionScores(
                economic_score=economic_result["economic_score"],
                integration_score=integration_result["integration_score"],
                stability_score=stability_result["stability_score"]
            ),
            explanation_summary=explanation_summary,
            risk_flags=risk_flags,
            shap_explanation=ml_result.get("ml_explanation", []),
            agent_consensus=agent_consensus,
            prescriptive_roadmap=prescriptive_roadmap,
            timestamp=datetime.now(timezone.utc),
            model_version_used=ml_result.get("model_version", "unknown"),
            snapshot_id=snapshot_id
        )
