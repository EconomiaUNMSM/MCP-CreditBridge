from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from typing import Dict, Any

from app.api.schemas import EvaluationRequest, EvaluationResponse
from app.services.evaluation_service import InclusionPipeline
from app.services.report_services import generate_report
from app.core import config
from app.utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()

@router.post("/evaluate", response_model=Dict[str, Any])
async def evaluate_applicant(request: EvaluationRequest):
    """
    Executes the full inclusion pipeline for a new applicant.
    - Runs Economic, Integration, Stability, and ML agents.
    - Calculates Inclusion Index.
    - Persists Snapshot and Audit Log.
    - Returns detailed decision metrics.
    """
    logger.info(f"Received evaluation request for applicant_id: {request.applicant_id}")
    
    try:
        # Initialize Pipeline (Service Layer)
        # Note: InclusionPipeline instantiates the Registry internally.
        # Ideally, we should inject dependencies, but for this MVP architecture, 
        # adhering to the existing pattern is safer.
        pipeline = InclusionPipeline()
        
        result = pipeline.run_full_evaluation(request)
        
        response_payload = {
            "system_version": config.SYSTEM_VERSION,
            "model_version": result.model_version_used,
            "inclusion_index": result.inclusion_index,
            "ml_probability": result.ml_probability,
            "confidence_score": result.confidence_score,
            "dimension_scores": {
                "economic_score": result.dimension_scores.economic_score,
                "integration_score": result.dimension_scores.integration_score,
                "stability_score": result.dimension_scores.stability_score
            },
            "confidence_level": "High" if result.confidence_score > 0.8 else "Medium",
            "key_drivers": result.risk_flags,
            "snapshot_id": result.snapshot_id,
            "explanation_summary": result.explanation_summary,
            "shap_explanation": result.shap_explanation or [],
            "agent_consensus": result.agent_consensus.model_dump() if result.agent_consensus else None,
            "prescriptive_roadmap": [p.model_dump() for p in result.prescriptive_roadmap] if result.prescriptive_roadmap else None,
            "timestamp": result.timestamp.isoformat() if hasattr(result.timestamp, 'isoformat') else result.timestamp
        }
        
        logger.info(f"Evaluation successful for {request.applicant_id}. Index: {result.inclusion_index}")
        return response_payload

    except Exception as e:
        logger.error(f"Evaluation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

from sqlalchemy.orm import Session
from app.core import dependencies

@router.get("/report/{snapshot_id}")
async def get_audit_report(
    snapshot_id: int, 
    db: Session = Depends(dependencies.get_db),
    locale: str = 'en',
    fullName: str = None,
    nationality: str = None,
    yearsInCountry: str = None,
    employmentType: str = None,
    referenceCode: str = None
):
    """
    Generates and returns a PDF audit report for a specific snapshot.
    Generates in BOTH locales (en, es) for archival.
    Returns the requested locale's file.
    """
    logger.info(f"Generating report for snapshot_id: {snapshot_id}, locale: {locale}")
    try:
        # Build identity dict if provided
        identity = None
        if fullName and nationality and yearsInCountry and employmentType:
            identity = {
                "fullName": fullName,
                "nationality": nationality,
                "yearsInCountry": yearsInCountry,
                "employmentType": employmentType,
                "referenceCode": referenceCode
            }
        
        # Generate BOTH locales for archival
        pdf_path_en = generate_report(snapshot_id, db, identity=identity, locale='en')
        pdf_path_es = generate_report(snapshot_id, db, identity=identity, locale='es')
        
        # Return the requested locale
        pdf_path = pdf_path_en if locale == 'en' else pdf_path_es
        
        if not pdf_path:
             raise HTTPException(status_code=404, detail="Snapshot not found")
             
        return FileResponse(
            path=pdf_path, 
            filename=f"audit_report_{snapshot_id}_{locale}.pdf", 
            media_type='application/pdf'
        )
    except ValueError as ve:
        logger.warning(f"Report report not found: {ve}")
        raise HTTPException(status_code=404, detail="Snapshot not found")
    except Exception as e:
        logger.error(f"Report generation error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error during report generation")

@router.get("/health")
async def health_check():
    """
    Simple health check endpoint.
    """
    return {
        "status": "ok",
        "system_version": config.SYSTEM_VERSION,
        "environment": config.ENVIRONMENT
    }
